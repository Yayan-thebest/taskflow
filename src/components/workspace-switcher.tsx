"use client";
import { RiAddCircleFill } from "react-icons/ri";
import { useGetWorkspaces } from "@/features/workspaces/api/use-get-workspaces";
import { Select, SelectContent, SelectItem, SelectTrigger } from "./ui/select";
import { SelectValue } from "@radix-ui/react-select";
import { getInitials } from "@/lib/utils";
import { WorkspaceAvatar } from "@/features/workspaces/components/workspace-avatar";
import { useRouter } from "next/navigation";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useCreateWorkspaceModal } from "@/features/workspaces/hooks/use-create-workspace-modal";



export const WorkspaceSwitcher = () => {
    const { data: workspaces } = useGetWorkspaces();
    const workspaceId = useWorkspaceId();
    const { open } = useCreateWorkspaceModal();

    const router = useRouter();
    const onSelect = (id: string) => {
      router.push(`/workspaces/${id}`)
    }

    

    return (
        <div className="flex flex-col gap-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase text-neutral-500 font-medium">Workspaces</p>
            <RiAddCircleFill onClick={open} className="size-5 text-neutral-500 cursor-pointer hover:opacity-75 transition"/>
          </div>
          <Select onValueChange={onSelect} value={workspaceId}>
            <SelectTrigger className="w-full bg-neutral-200 font-medium p-1">
                <SelectValue placeholder="No workspace selected"></SelectValue>
            </SelectTrigger>
            <SelectContent>

                  {workspaces?.documents.map((workspace) =>(
                      <SelectItem key={workspace.$id} value={workspace.$id}>
                          <div className="flex justify-start items-center gap-3 font-medium">
                              {/*{workspace.imageUrl ?
                                  <WorkspaceAvatar name={workspace.name} />
                                : (<Avatar className="size-10 hover:opcacity-75 rouned-md transition border border-neutral-300">
                                      <AvatarFallback className={cn(getColorFromName(workspace.name), "rounded-md font-medium text-sm text-white flex items-center justify-center")}>
                                          {getInitials(workspace.name)}
                                      </AvatarFallback>
                                  </Avatar>)
                              }*/}
                              <WorkspaceAvatar name={getInitials(workspace.name)} />
                              <span className="truncate">{workspace.name}</span>
                          </div>
                      </SelectItem>
                  ))}


            </SelectContent>
          </Select>
        </div>
    )
}