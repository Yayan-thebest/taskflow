"use client";

import { DottedSeparator } from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useInviteCode } from "../hooks/use-invite-code";
import { useJoinWorkspace } from "../api/use-join-workspace";
import { useWorkspaceId } from "../hooks/use-workspace-id";
import { useRouter } from "next/navigation";
import { MailIcon } from "lucide-react";

interface JoinWorkspaceProps {
    initialValues: {
        name: string;
       // user: string;
    }
}
export const JoinWorkspaceForm = ({ initialValues }: JoinWorkspaceProps) => {

    const router = useRouter();
    const workspaceId = useWorkspaceId();
    const inviteCode = useInviteCode();
    const { mutate, isPending } = useJoinWorkspace();

    const onSubmit = () => {
        mutate({
            param: { workspaceId },
            json: { code: inviteCode }
        }, {
            onSuccess: ({ data }) => {
                router.push(`/workspaces/${data.$id}`);
            }
        })
    }
    return (
        <Card className="w-full max-w-xl mx-auto h-full border border-muted bg-white shadow-sm rounded-2xl">
            <CardHeader className="p-6 pb-4">
                <div className="flex items-center gap-3 mb-2">
                <MailIcon className="size-7 text-primary" />
                <CardTitle className="text-lg sm:text-xl font-bold">
                    Invitation to join workspace
                </CardTitle>
                </div>
                <CardDescription className="text-sm text-muted-foreground leading-relaxed">
                You&apos;ve been invited by{" ***** "}
                {/*<span className="font-semibold uppercase">{initialValues.user}</span>{" "}*/}
                to join the <span className="font-semibold">{initialValues.name}</span>{" "}
                workspace.
                </CardDescription>
            </CardHeader>

            <div className="px-6">
                <DottedSeparator />
            </div>

            <CardContent className="p-6 pt-4">
                <div className="flex flex-col lg:flex-row gap-3 items-center justify-between">
                <Button
                    className="w-full lg:w-auto"
                    variant="secondary"
                    size="lg"
                    type="button"
                    asChild
                    disabled={isPending}
                >
                    <Link href="/">Cancel</Link>
                </Button>

                <Button
                    size="lg"
                    type="button"
                    className="w-full lg:w-auto"
                    onClick={onSubmit}
                    disabled={isPending}
                >
                    Join Workspace
                </Button>
                </div>
            </CardContent>
        </Card>
  
    )

}