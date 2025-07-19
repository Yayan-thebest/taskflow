import { sessionMiddleware } from "@/lib/session-middleware";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createTaskSchema } from "../schemas";
import { getMember } from "@/features/members/utils";
import { DATABASE_ID, MEMBERS_ID, PROJECTS_ID, TASKS_ID } from "@/config";
import { ID, Query } from "node-appwrite";
import { z } from "zod";
import { Task, TasksStatus } from "../types";
import { createAdminClient } from "@/lib/appwrite";
import { Project } from "@/features/projects/types";

const app = new Hono()
    .delete(
        "/:taskId",
        sessionMiddleware,
        async (c) => {
           const user = c.get("user");
           const databases = c.get("databases");

           const { taskId } = c.req.param();

           const task = await databases.getDocument<Task>(
            DATABASE_ID,
            TASKS_ID,
            taskId
           );

           const member = await getMember({
            databases,
            workspaceId: task.workspaceId,
            userId: user.$id,
           });

           if(!member) {
            return c.json({ error: "Unauthorized"}, 401);
           }

           await databases.deleteDocument(
            DATABASE_ID,
            TASKS_ID,
            taskId,
           );

           return c.json({ data: { $id: task.$id }});
        }
    )
    .get(
        "/",
        sessionMiddleware,
        zValidator(
            "query", 
            z.object({ 
                workspaceId: z.string(),
                projectId: z.string().nullish(),
                assigneeId: z.string().nullish(),
                status: z.nativeEnum(TasksStatus).nullish(),
                search: z.string().nullish(),
                dueDate: z.string().nullish()
            })
        ),
        async (c) => {
            const { users } = await createAdminClient();
            const databases = c.get("databases");
            const user = c.get("user");

            const {
               workspaceId,
               projectId,
               assigneeId,
               status,
               search,
               dueDate, 
            } = c.req.valid("query");

            const member = await getMember({
                databases,
                workspaceId,
                userId: user.$id,
            });
            if(!member) {
                return c.json({ error: "Unauthorized" }, 401);
            }

            const query = [
                Query.equal("workspaceId", workspaceId),
                Query.orderDesc("$createdAt"),
            ];

            if(projectId){
                console.log("projectId ", projectId);
                query.push(Query.equal("projectId", projectId));
            }
            if(status){
                console.log("status ", status);
                query.push(Query.equal("status", status));
            } 
            if(assigneeId){
                console.log("assigneeId ", assigneeId);
                query.push(Query.equal("assigneeId", assigneeId));
            }    
            if(search){
                console.log("search ", search);
                query.push(Query.search("name", search));
            }         
            if(dueDate){
                console.log("dueDate ", dueDate);
                query.push(Query.equal("dueDate", dueDate));
            } 

            const tasks = await databases.listDocuments<Task>(
                DATABASE_ID,
                TASKS_ID,
                query,
            );

            const projectIds = tasks.documents.map((task) => task.projectId);
            const assigneeIds = tasks.documents.map((task) => task.assigneeId);

            const projects = await databases.listDocuments<Project>(
                DATABASE_ID,
                PROJECTS_ID,
                projectIds.length > 0 ? [Query.contains("$id", projectIds)] : [],
            );

            const members = await databases.listDocuments(
                DATABASE_ID,
                MEMBERS_ID,
                assigneeIds.length > 0 ? [Query.contains("$id", assigneeIds)] : [],
            );
            const assignees = await Promise.all(
                members.documents.map( async (member) => {
                    const user = await users.get(member.userId);

                    return {
                        ...member,
                        name: user.name || user.email,
                        email: user.email,
                    }
                })
            )

            const populatedTasks = tasks.documents.map((task) => {
                const project = projects.documents.find((project) => 
                    project.$id === task.projectId
                );
                const assignee = assignees.find((assignee) => 
                    assignee.$id === task.assigneeId
                );

                return {
                    ...task,
                    project,
                    assignee
                };
            });

            return c.json({
                data: {
                    ...tasks,
                    documents: populatedTasks,
                }
            })


        }
    )
    .post(
        "/",
        sessionMiddleware,
        zValidator("json", createTaskSchema),
        async (c) => {
            const user = c.get("user");
            const databases = c.get("databases");
             const {
                name, 
                status,
                workspaceId,
                projectId,
                dueDate,
                assigneeId,
            } = c.req.valid("json");

            const member = await getMember({
                databases,
                workspaceId,
                userId: user.$id
            });

            if(!member) {
                return c.json({ error: "Unauthorized" }, 401);
            }

            const highestPositionTask = await databases.listDocuments(
                DATABASE_ID,
                TASKS_ID,
                [
                    Query.equal("status", status),
                    Query.equal("workspaceId", workspaceId),
                    Query.orderAsc("position"),
                    Query.limit(1),
                ]
            );

            const newPosition = highestPositionTask.documents.length > 0 ? highestPositionTask.documents[0].position + 1000 : 1000;

            const task = await databases.createDocument(
                DATABASE_ID,
                TASKS_ID,
                ID.unique(),
                {
                    name, 
                    status,
                    workspaceId,
                    projectId,
                    dueDate,
                    assigneeId, 
                    position: newPosition                   
                }
            );

            return c.json({ data: task });
        }
    )
    .patch(
        "/:taskId",
        sessionMiddleware,
        zValidator("json", createTaskSchema.partial()),
        async (c) => {
            const user = c.get("user");
            const databases = c.get("databases");
             const {
                name, 
                status,
                projectId,
                dueDate,
                assigneeId,
                description,
            } = c.req.valid("json");

            const { taskId } = c.req.param();
            const existingTask = await databases.getDocument<Task>(
                DATABASE_ID,
                TASKS_ID,
                taskId,
            );

            const member = await getMember({
                databases,
                workspaceId: existingTask.workspaceId,
                userId: user.$id
            });

            if(!member) {
                return c.json({ error: "Unauthorized" }, 401);
            }

            const task = await databases.updateDocument(
                DATABASE_ID,
                TASKS_ID,
                taskId,
                {
                    name, 
                    status,
                    projectId,
                    dueDate,
                    assigneeId, 
                    description,
                }
            );

            return c.json({ data: task });
        }
    )
    .get(
        "/:taskId",
        sessionMiddleware,
        async (c) => {
            const currentUser = c.get("user");
            const databases = c.get("databases");
            const { taskId } = c.req.param();
            const { users } = await createAdminClient();

            const task = await databases.getDocument<Task>(
               DATABASE_ID,
               TASKS_ID,
               taskId, 
            );

            const currenMember  = await getMember({
                databases,
                workspaceId: task.workspaceId,
                userId: currentUser.$id,
            });

            if(!currenMember) {
                return c.json({ error: "Unauthorized"}, 401);
            }

            const project = await databases.getDocument<Project>(
                DATABASE_ID,
                PROJECTS_ID,
                task.projectId
            );
            const member = await databases.getDocument(
                DATABASE_ID,
                MEMBERS_ID,
                task.assigneeId
            );

            const user = await users.get(member.userId);
            const assignee = {
               ...member,
               name: user.name || user.email,
               email: user.email,
            };

            return c.json({
                data: {
                    ...task,
                    project,
                    assignee,
                }
            });
        }
    )
    .post(
        "/bulk-update", // Route HTTP POST pour les mises à jour multiples de tâches
        sessionMiddleware, // Middleware d’authentification : injecte `user` dans le contexte
        
        // Validation stricte du corps de la requête avec Zod
        zValidator(
            "json", 
            z.object({
                tasks: z.array( // On attend un tableau d’objets représentant les tâches à mettre à jour
                    z.object({
                        $id: z.string(), // ID de la tâche
                        status: z.nativeEnum(TasksStatus), // Nouveau statut, contrôlé par enum
                        position: z.number().int().positive().min(1000).max(1_000_000), // Nouvelle position (tri)
                    })                    
                )
            })
        ),

        async (c) => {
            // Récupère les services injectés via le middleware
            const databases = c.get("databases");
            const user = c.get("user");

            // Récupère les données JSON validées par le zValidator
            const { tasks } = await c.req.valid("json");

            // Requête à la base de données : récupère toutes les tâches à modifier
            const tasksToUpdate = await databases.listDocuments(
                DATABASE_ID,
                TASKS_ID,
                [Query.contains("$id", tasks.map((task) => task.$id))] // Filtre sur les IDs fournis
            );

            // On extrait tous les workspaceId des tâches concernées
            const workspaceIds = new Set(tasksToUpdate.documents.map((task) => task.workspaceId));

            // 🛡️ Sécurité : toutes les tâches doivent appartenir au même workspace
            if (workspaceIds.size !== 1) {
             return c.json({ error: "All tasks must belong to the same workspace" });
            }

            // On récupère ce workspaceId unique
            const workspaceId = workspaceIds.values().next().value;

            // Vérifie si l’utilisateur est bien membre du workspace
            const member = await getMember({
                databases,
                workspaceId,
                userId: user.$id,
            });

            // 🔐 Si l’utilisateur n’est pas membre : accès interdit
            if (!member) {
                return c.json({ error: "Unauthorized" }, 401);
            }

            // Mise à jour en parallèle de chaque tâche : statut + position
            const updatedTasks = await Promise.all(
            tasks.map((task) => {
                const { $id, status, position } = task;
                return databases.updateDocument<Task>(
                DATABASE_ID,
                TASKS_ID,
                $id,
                { status, position }
                );
            })
            );

            // Réponse contenant les tâches mises à jour
            return c.json({ data: updatedTasks });
        }
    );


export default app;