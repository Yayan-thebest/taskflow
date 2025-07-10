"use client";
import { RiAddCircleFill } from "react-icons/ri";
import { useGetWorkspaces } from "@/features/workspaces/api/use-get-workspace";
import { Select, SelectContent, SelectItem, SelectTrigger } from "./ui/select";
import { SelectValue } from "@radix-ui/react-select";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { cn } from "@/lib/utils";
import { WorkspaceAvatar } from "@/features/workspaces/components/workspace-avatar";

// Retourne les 2 premières lettres en majuscules
// 🔠 Extraire 2 initiales depuis un nom
function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(w => w.charAt(0).toUpperCase())
    .join("");
}
// Retourne une couleur Tailwind basée sur le nom
function getColorFromName(name: string): string {
  const colors = [
    "bg-red-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-emerald-500",
    "bg-orange-500",
    "bg-teal-500",
  ];

  // Simple hash : somme des codes de caractères
  const hash = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);

  return colors[hash % colors.length];
}

export const WorkspaceSwitcher = () => {
    const { data: workspaces } = useGetWorkspaces();
    // Remove this line, as GetFilePreview expects an argument when used

    return (
        <div className="flex flex-col gap-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase text-neutral-500 font-medium">Workspaces</p>
            <RiAddCircleFill className="size-5 text-neutral-500 cursor-pointer hover:opacity-75 transition"/>
          </div>
          <Select>
            <SelectTrigger className="w-full bg-neutral-200 font-medium p-1">
                <SelectValue placeholder="No workspace selected"></SelectValue>
            </SelectTrigger>
            <SelectContent>
                {workspaces?.documents.map((workspace) =>(
                    <SelectItem key={workspace.$id} value={workspace.$id}>
                        <div className="flex justify-start items-center gap-3 font-medium">
                            {workspace.imageUrl ?
                                <WorkspaceAvatar name={workspace.name} />
                               : (<Avatar className="size-10 hover:opcacity-75rouned-md transition border border-neutral-300">
                                    <AvatarFallback className={cn(getColorFromName(workspace.name), "rounded-md font-medium text-sm text-white flex items-center justify-center")}>
                                        {getInitials(workspace.name)}
                                    </AvatarFallback>
                                </Avatar>)
                            }
                            <span className="truncate">{workspace.name}</span>
                        </div>
                    </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
    )
}