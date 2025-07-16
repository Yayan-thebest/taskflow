import { Project } from "@/features/projects/types";
import { Task } from "../types";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import Link from "next/link";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { ChevronRight, TrashIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDeleteTask } from "../api/use-delete-task";
import { useConfirm } from "@/hooks/use-confirm";
import { useRouter } from "next/navigation";

interface TaskBreadcrumpsProps {
    project: Project;
    task: Task;
}

export const TaskBreadcrumbs = ({ project, task }: TaskBreadcrumpsProps ) => {
    const workspaceId = useWorkspaceId();
    const { mutate, isPending } = useDeleteTask();
    const router = useRouter();

    const [ConfirmDialog, confirm] = useConfirm(
        "Delete task",
        "This action cannot be undone.",
        "destructive"
    );
    const handleDeleteTask = async () => {
        const ok = await confirm();
        if(!ok) return;

        mutate({ param: { taskId: task.$id }}, {
            onSuccess: () => {
                router.push(`/workspaces/${workspaceId}/tasks`);
            }
        });
    };


    return (
        <div className="flex items-center gap-x-2 w-full">¸
            <ConfirmDialog />
            {/* Avatar du projet */}
            <ProjectAvatar 
                name={project.name}
                className="size-6 lg:size-8"
            />

            {/* Lien vers le projet */}
            <div className="flex flex-col lg:flex-row lg:items-center gap-x-1 flex-1">
                <Link 
                    href={`/workspaces/${workspaceId}/projects/${project.$id}`}
                    className="flex items-center gap-x-1 hover:opacity-75 transition"
                >
                <p className="text-sm lg:text-lg font-semibold text-muted-foreground">
                    {project.name}
                </p>
                <ChevronRight className="size-4 lg:size-5 text-muted-foreground" />
                <p className="text-sm lg:text-md font-semibold text-primary">
                    {task.name}
                </p>
                </Link>
            </div>

            {/* Bouton Delete en dehors du lien */}
            <Button onClick={handleDeleteTask} disabled={isPending} className="ml-auto" variant="destructive" size="sm">
                <TrashIcon className="size-4 lg:mr-1" />
                <span className="hidden lg:block">Delete Task</span>
            </Button>
        </div>

    )
}

