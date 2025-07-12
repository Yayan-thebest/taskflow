"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useWorkspaceId } from "../hooks/use-workspace-id";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon, MoreVerticalIcon, ShieldUserIcon, TrashIcon, User } from "lucide-react";
import { DottedSeparator } from "@/components/dotted-separator";
import Link from "next/link";
import { useGetMembers } from "@/features/members/api/use-get-members";
import { Fragment } from "react";
import { MemberAvatar, } from "@/features/members/components/member-avatar";
import { Separator } from "@/components/ui/separator";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useDeletMember } from "@/features/members/api/use-delete-member";
import { useUpdateMember } from "@/features/members/api/use-update-member";
import { MemberRole } from "@/features/members/types";
import { useConfirm } from "@/hooks/use-confirm";
import { useGetWorkspaces } from "../api/use-get-workspace";
import { Badge } from "@/components/ui/badge";


interface MembersListProps {
    initialValues: {
        name: string;
        createdAt: string;
    }
}
export const MembersList =  ({initialValues}: MembersListProps) => {
    const workspaceId = useWorkspaceId();
    const { data: workspaces } = useGetWorkspaces();

    const [ConfirmDialog, confirm] = useConfirm(
        "Remove member",
        "This member will be removed from the workspace. This action cannot be undone.",
        "destructive"
    );

    const { data } = useGetMembers({ workspaceId }); 
    const {
        mutate: deleteMember,
        isPending: isDeletingMember
    } = useDeletMember();

    const {
        mutate: updateMember,
        isPending: isUpdatingMember
    } = useUpdateMember();

    const handleUpdatemember = (memberId: string, role: MemberRole) => {
        updateMember({
            json: { role },
            param: { memberId }
        });
    };

    const handleDeleteMember = async (memberId: string) => {
        const ok = await confirm();
        if(!ok) return;

        deleteMember({ param: { memberId }}, {
            onSuccess: () => {
                window.location.reload();
            }
        });
    }


    return (
        <Card className="w-full max-w-3xl mx-auto h-full bg-white rounded-2xl shadow-sm border border-muted">
        <ConfirmDialog />

            <CardHeader className="flex flex-row items-start gap-4 p-6 pb-2">
                <Button asChild variant="ghost" size="icon">
                <Link href={`/workspaces/${workspaceId}`}>
                    <ArrowLeftIcon className="size-4 text-muted-foreground" />
                </Link>
                </Button>

                <div className="flex flex-col">
                <CardTitle className="text-xl sm:text-2xl font-bold text-foreground">
                    <span className="text-muted-foreground">Members list of </span>
                    {initialValues.name}
                </CardTitle>
                <p className="text-sm text-muted-foreground font-normal">
                    Created at: {initialValues.createdAt}
                </p>
                </div>
            </CardHeader>

            <div className="px-6 pt-2">
                <DottedSeparator />
            </div>

            <CardContent className="p-6 space-y-4">
                {data?.documents.map((member, index) => (
                <Fragment key={member.$id}>
                    <div className="flex items-center gap-4">
                    <MemberAvatar
                        className="size-10"
                        fallbackClassName="text-lg"
                        name={member.name}
                    />

                    <div className="flex flex-col flex-1">
                        <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">{member.name}</p>
                        {member.role === MemberRole.ADMIN && (
                            <Badge className="bg-blue-500 text-white">{member.role}</Badge>
                        )}
                        </div>
                        <p className="text-xs text-muted-foreground">{member.email}</p>
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                        <Button
                            className="ml-auto"
                            variant="ghost"
                            size="icon"
                        >
                            <MoreVerticalIcon className="size-4 text-muted-foreground" />
                        </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent side="bottom" align="end">
                        <DropdownMenuItem
                            className="font-medium"
                            onClick={() => handleUpdatemember(member.$id, MemberRole.ADMIN)}
                            disabled={isUpdatingMember}
                        >
                            <ShieldUserIcon className="size-5 mr-2 text-muted-foreground" />
                            Set as Administrator
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="font-medium"
                            onClick={() => handleUpdatemember(member.$id, MemberRole.MEMBER)}
                            disabled={isUpdatingMember}
                        >
                            <User className="size-5 mr-2 text-muted-foreground" />
                            Set as Member
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="font-medium text-destructive"
                            onClick={() => handleDeleteMember(member.$id)}
                            disabled={isDeletingMember}
                        >
                            <TrashIcon className="size-5 mr-2" />
                            Remove {member.name}
                        </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    </div>

                    {index < data.documents.length - 1 && (
                    <Separator className="my-3" />
                    )}
                </Fragment>
                ))}
            </CardContent>
        </Card>

    )
}