"use client";

import z from "zod";
import { useRef } from "react";
import { updateWorkspaceSchema } from "../schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DottedSeparator } from "@/components/dotted-separator";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon, CopyIcon, } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn, getInitials } from "@/lib/utils";
import { Workspace } from "../types";
import { useUpdateWorkspace } from "../api/use-update-workspace";
import { WorkspaceAvatar } from "./workspace-avatar";
import { useConfirm } from "@/hooks/use-confirm";
import { useDeleteWorkspace } from "../api/use-delete-workspace";
import { toast } from "sonner";
import { useResetInviteCode } from "../api/use-reset-invite-code";


interface EditWorkspaceFormProps {
    onCancel?: () => void;
    initialValues: Workspace;
};


export const EditWorkspaceForm = ({ onCancel, initialValues }: EditWorkspaceFormProps) => {

    const router = useRouter();
    const { mutate, isPending } = useUpdateWorkspace();
    const { mutate: deleteWorkspace, isPending: isDeletingWorkspace } = useDeleteWorkspace();
    const { mutate: resetInviteCode, isPending: isResettingInviteCode } = useResetInviteCode();


    const [DeleteDialog, confirmDelete] = useConfirm(
        "Delete Workspace",
        "This action cannot be undone.",
        "destructive",
    );
    const [ResetDialog, confirmReset] = useConfirm(
        "Reset invite link",
        "This will invalide the current invite link. Share it again",
        "teritary",
    );

    const inputRef = useRef<HTMLInputElement>(null);

    const form = useForm<z.infer<typeof updateWorkspaceSchema>>({
        resolver: zodResolver(updateWorkspaceSchema),
        defaultValues: {
            ...initialValues,
            image: initialValues.imageUrl ?? "",
        }
    });

    const handleDelete = async () => {
        const ok = await confirmDelete();
        if(!ok) return;

        deleteWorkspace({
            param: { workspaceId: initialValues.$id },
        }, {
            onSuccess: () => {
                window.location.href= "/";
            },
        });
    };
    const handleResetInviteCode = async () => {
        const ok = await confirmReset();
        if(!ok) return;

        resetInviteCode({
            param: { workspaceId: initialValues.$id },
        });
    };

    const onSubmit = (values: z.infer<typeof updateWorkspaceSchema>) => {
        const finalValues = {
            ...values,
            image: values.image instanceof File ? values.image : "",
        }
        mutate({ 
            form: finalValues,
            param: { workspaceId: initialValues.$id}
        }, {
            onSuccess: () => {
                form.reset();
            }
        });  
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if(file) {
            form.setValue("image", file)
        }
    };

    const fullInviteLink = `${window.location.origin}/workspaces/${initialValues.$id}/join/${initialValues.inviteCode}`;

    const handleCopyInviteLink =  () => {
        navigator.clipboard.writeText(fullInviteLink).then(
            () =>  toast.success("Invite link copied to clipboard")
        )
    }

    return (
        <div className="flex flex-col gap-y-4">
            <DeleteDialog />
            <ResetDialog/>
            {/* === Workspace Update Form Card === */}
            <Card className="w-full max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-muted">
            <CardHeader className="p-6 pb-4 space-y-4">
                <Button
                className="w-fit"
                size="sm"
                variant="secondary"
                onClick={onCancel ? onCancel : () => router.push(`/workspaces/${initialValues.$id}`)}
                >
                <ArrowLeftIcon className="size-4 mr-2" />
                Back
                </Button>

                <div>
                <h2 className="text-muted-foreground font-medium text-lg">Update Workspace</h2>
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
                            <FormLabel>Workspace Name</FormLabel>
                            <FormControl>
                            <Input {...field} placeholder="Enter workspace name" />
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
                            <WorkspaceAvatar name={getInitials(initialValues.name)} />

                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium">Workspace Icon</p>
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

            {/* === Invite Members Card === */}
            <Card className="w-full max-w-3xl mx-auto mt-6 bg-white rounded-2xl shadow-sm border border-muted">
            <CardContent className="p-6 space-y-4">
                <div>
                <h3 className="text-lg font-semibold">Invite Members</h3>
                <p className="text-sm text-muted-foreground">
                    Use the invite link to add users to your workspace.
                </p>
                </div>

                <DottedSeparator className="py-4" />

                <div className="flex items-center gap-2">
                <Input disabled value={fullInviteLink} />
                <Button onClick={handleCopyInviteLink} variant="secondary" className="size-12">
                    <CopyIcon className="size-5" />
                </Button>
                </div>

                <div className="flex justify-end">
                <Button
                    size="sm"
                    variant="secondary"
                    type="button"
                    disabled={isPending || isResettingInviteCode}
                    onClick={handleResetInviteCode}
                >
                    Reset invite link
                </Button>
                </div>
            </CardContent>
            </Card>

            {/* === Danger Zone Card === */}
            <Card className="w-full max-w-3xl mx-auto mt-6 bg-white rounded-2xl shadow-sm border border-muted">
            <CardContent className="p-6 space-y-4">
                <div>
                <h3 className="text-lg font-semibold text-destructive">Danger Zone</h3>
                <p className="text-sm text-muted-foreground">
                    Deleting a workspace is irreversible and will remove all associated data.
                </p>
                </div>

                <DottedSeparator className="py-4" />

                <div className="flex justify-end">
                <Button
                    size="sm"
                    variant="destructive"
                    type="button"
                    disabled={isPending || isDeletingWorkspace}
                    onClick={handleDelete}
                >
                    Delete Workspace
                </Button>
                </div>
            </CardContent>
            </Card>
        
        </div>

    )
}