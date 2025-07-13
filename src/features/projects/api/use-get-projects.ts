import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

interface UseGetProjectsProps {
    workspaceId: string;
}

export const useGetProjects = ({ workspaceId }: UseGetProjectsProps) => {
    const query = useQuery({
        queryKey: ["projects", workspaceId], // we add worksapceID so that projects reload every time we change workspace
        queryFn: async () => {
            const response = await client.api.projects.$get({ query: { workspaceId }});

            if(!response.ok){
                throw new Error("Failed to fecth projects");
            }

            const { data } = await response.json();
            return data;
        },
    });

    return query;
}