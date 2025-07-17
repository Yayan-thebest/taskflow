"use client";

import z from "zod";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DottedSeparator } from "@/components/dotted-separator";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon, } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn, getInitials } from "@/lib/utils";
import { Project } from "../types";
import { useConfirm } from "@/hooks/use-confirm";
import { useUpdateProject } from "../api/use-update-project";
import { updateProjectSchema } from "../schema";
import { ProjectAvatar } from "./project-avatar";
import { useDeleteProject } from "../api/use-delete-project";


interface EditProjectFormProps {
    onCancel?: () => void;
    initialValues: Project;
};


export const EditProjectForm = ({ onCancel, initialValues }: EditProjectFormProps) => {

    const router = useRouter();
    const { mutate, isPending } = useUpdateProject();
    const { mutate: deleteProject, isPending: isDeletingProject } = useDeleteProject();

    const [DeleteDialog, confirmDelete] = useConfirm(
        "Delete Project",
        "This action cannot be undone.",
        "destructive",
    );

    const inputRef = useRef<HTMLInputElement>(null);

    const form = useForm<z.infer<typeof updateProjectSchema>>({
        resolver: zodResolver(updateProjectSchema),
        defaultValues: {
            ...initialValues,
            image: initialValues.imageUrl ?? "",
        }
    });

    const handleDelete = async () => {
        const ok = await confirmDelete();
        if(!ok) return;

        deleteProject({
            param: { projectId: initialValues.$id },
        }, {
            onSuccess: () => {
                window.location.href= `/workspaces/${initialValues.workspaceId}`;
            },
        });
    };


    const onSubmit = (values: z.infer<typeof updateProjectSchema>) => {
        const finalValues = {
            ...values,
            image: values.image instanceof File ? values.image : "",
        };

        mutate({ 
            form: finalValues,
            param: { projectId: initialValues.$id}
        });  
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if(file) {
            form.setValue("image", file)
        }
    };

    return (
        <div className="flex flex-col gap-y-4">
            <DeleteDialog />
            {/* === Project Update Form Card === */}
            <Card className="w-full max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-muted">
            <CardHeader className="p-6 pb-4 space-y-4">
                <Button
                    className="w-fit"
                    size="sm"
                    variant="secondary"
                    onClick={onCancel ? onCancel : () => router.push(`/workspaces/${initialValues.workspaceId}/projects/${initialValues.$id}`)}
                >
                    <ArrowLeftIcon className="size-4 mr-1" />
                    Back
                </Button>

                <div>
                    <h2 className="text-muted-foreground font-medium text-lg">Update Project</h2>
                    <CardTitle className="text-2xl font-bold">{initialValues.name}</CardTitle>
                </div>
            </CardHeader>

            <div className="px-6">
                <DottedSeparator />
            </div>

            <CardContent className="p-6">
                <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-6">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Project Name</FormLabel>
                            <FormControl>
                            <Input {...field} placeholder="Enter Project name" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="image"
                        render={({ field }) => (
                        <div className="space-y-2">
                            <div className="flex items-center gap-x-4">
                            <ProjectAvatar name={getInitials(initialValues.name)} />

                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium">Project Icon</p>
                                <p className="text-sm text-muted-foreground">JPG, PNG, SVG or JPEG | max 1MB</p>
                                <input
                                className="hidden"
                                type="file"
                                accept=".jpg, .png, .jpeg, .svg"
                                ref={inputRef}
                                onChange={handleImageChange}
                                disabled={isPending}
                                />
                                {field.value ? (
                                <Button
                                    type="button"
                                    disabled={isPending}
                                    variant="destructive"
                                    size="xs"
                                    className="w-fit"
                                    onClick={() => {
                                    field.onChange(null);
                                    if (inputRef.current) inputRef.current.value = "";
                                    }}
                                >
                                    Remove Image
                                </Button>
                                ) : (
                                <Button
                                    type="button"
                                    disabled={isPending}
                                    variant={"teritary"}
                                    size="xs"
                                    className="w-fit"
                                    onClick={() => inputRef.current?.click()}
                                >
                                    Upload Image
                                </Button>
                                )}
                            </div>
                            </div>
                        </div>
                        )}
                    />
                    </div>

                    <DottedSeparator className="py-6" />

                    <div className="flex flex-col sm:flex-row justify-between gap-3">
                    <Button
                        type="button"
                        variant="secondary"
                        size="lg"
                        onClick={onCancel}
                        disabled={isPending}
                        className={cn(!onCancel && "invisible")}
                    >
                        Cancel
                    </Button>
                    <Button type="submit" size="lg" disabled={isPending}>
                        Save Changes
                    </Button>
                    </div>
                </form>
                </Form>
            </CardContent>
            </Card>


            {/* === Danger Zone Card === */}
            <Card className="w-full max-w-3xl mx-auto mt-6 bg-white rounded-2xl shadow-sm border border-muted">
            <CardContent className="p-6 space-y-4">
                <div>
                <h3 className="text-lg font-semibold text-destructive">Danger Zone</h3>
                <p className="text-sm text-muted-foreground">
                    Deleting a Project is irreversible and will remove all associated data.
                </p>
                </div>

                <DottedSeparator className="py-4" />

                <div className="flex justify-end">
                <Button
                    size="sm"
                    variant="destructive"
                    type="button"
                    disabled={isPending || isDeletingProject }
                    onClick={handleDelete}
                >
                    Delete Project
                </Button>
                </div>
            </CardContent>
            </Card>
        
        </div>

    )
}