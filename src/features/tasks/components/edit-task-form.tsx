"use client";

import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DottedSeparator } from "@/components/dotted-separator";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { createTaskSchema } from "../schemas";
import { DatePicker } from "@/components/date-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MemberAvatar } from "@/features/members/components/member-avatar";
import { Task, TasksStatus } from "../types";
import { CheckCircleIcon, ClockIcon, EyeIcon, ListTodoIcon, LoaderIcon } from "lucide-react";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { useUpdateTask } from "../api/use-update-task";


interface EditTaskFormProps {
    onCancel?: () => void;
    projectOptions : { id: string, name: string, imageUrl: string }[];
    memberOptions : { id: string, name: string, }[];
    initialValues: Task;
};


export const EditTaskForm = ({ onCancel, projectOptions, memberOptions, initialValues }: EditTaskFormProps) => {

   {/* const workspaceId =  useWorkspaceId(); */}

    const { mutate, isPending } = useUpdateTask();

    const formSchema = createTaskSchema.omit({ workspaceId: true, description: true });
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            ...initialValues,
            dueDate: initialValues.dueDate ? new Date(initialValues.dueDate) : undefined,
        }
    });
    {/*const form = useForm<z.infer<typeof createTaskSchema>>({
        resolver: zodResolver(createTaskSchema.omit({ workspaceId: true, description: true})),
        defaultValues: {
            ...initialValues,
            dueDate: initialValues.dueDate ? new Date(initialValues.dueDate) : undefined,
        }
    }); */}

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        mutate({ json: values, param: { taskId: initialValues.$id } }, {
            onSuccess: () => {
                onCancel?.();
            }
        });  
    };

    return (
        <Card className="w-full h-full border-none shadow-none">
            <CardHeader>
                <CardTitle className="text-xl font-bold">Edit Task</CardTitle>
            </CardHeader>
            <div className="px-7">
                <DottedSeparator/>
            </div>
            <CardContent className="p-7">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="flex flex-col gap-y-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Task Name
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="Enter task name"
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem> 
                                )}
                            /> 
                            <FormField
                                control={form.control}
                                name="dueDate"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Due Date
                                    </FormLabel>
                                    <FormControl>
                                        <DatePicker {...field}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem> 
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="assigneeId"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Assignee
                                    </FormLabel>
                                    <Select 
                                        defaultValue={field.value}
                                        onValueChange={field.onChange}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select assignee" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <FormMessage />
                                        <SelectContent>
                                            {memberOptions.map((member) => (
                                                <SelectItem key={member.id} value={member.id}>
                                                    <div className="flex items-center gap-x-2">
                                                        <MemberAvatar 
                                                            className="size-6"
                                                            name={member.name}
                                                        />
                                                        {member.name}
                                                    </div> 
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormItem> 
                                )}
                            /> 
                            <FormField
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Status
                                    </FormLabel>
                                    <Select 
                                        defaultValue={field.value}
                                        onValueChange={field.onChange}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <FormMessage />
                                        <SelectContent>
                                            <SelectItem value={TasksStatus.BACKLOG}>
                                                <div className="flex items-center">
                                                    <ListTodoIcon className="mr-2 size-4 text-muted-foreground" />
                                                    Backlog
                                                </div>
                                            </SelectItem>

                                            <SelectItem value={TasksStatus.TODO}>
                                            <div className="flex items-center">
                                                <ClockIcon className="mr-2 size-4 text-muted-foreground" />
                                                To do
                                            </div>
                                            </SelectItem>

                                            <SelectItem value={TasksStatus.IN_PROGRESS}>
                                                <div className="flex items-center">
                                                    <LoaderIcon className="mr-2 size-4 text-muted-foreground animate-spin-slow" />
                                                    In Progress
                                                </div>
                                            </SelectItem>

                                            <SelectItem value={TasksStatus.IN_REVIEW}>
                                                <div className="flex items-center">
                                                    <EyeIcon className="mr-2 size-4 text-muted-foreground" />
                                                    In Review
                                                </div>
                                            </SelectItem>

                                            <SelectItem value={TasksStatus.DONE}>
                                                <div className="flex items-center">
                                                    <CheckCircleIcon className="mr-2 size-4 text-green-600" />
                                                    Done
                                                </div>
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormItem> 
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="projectId"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Project
                                    </FormLabel>
                                    <Select 
                                        defaultValue={field.value}
                                        onValueChange={field.onChange}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select project" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <FormMessage />
                                        <SelectContent>
                                             {projectOptions.map((project) => (
                                                <SelectItem key={project.id} value={project.id}>
                                                    <div className="flex items-center gap-x-2">
                                                        <ProjectAvatar 
                                                            className="size-6"
                                                            name={project.name}
                                                        />
                                                        {project.name}
                                                    </div> 
                                                </SelectItem>
                                            ))}                                       
                                        </SelectContent>
                                    </Select>
                                </FormItem> 
                                )}
                            />                             
                        </div>
                        <DottedSeparator className="py-7"/>
                        <div className="flex items-center justify-between gap-x-1">
                            <Button 
                                type="button" 
                                variant="secondary" 
                                size={"lg"} 
                                onClick={onCancel} 
                                disabled={isPending}
                                className={cn(!onCancel && "invisible")}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" size={"lg"} disabled={isPending}>Save changes</Button>

                        </div>


                    </form>

                </Form>
            </CardContent>
        </Card>
    )
}