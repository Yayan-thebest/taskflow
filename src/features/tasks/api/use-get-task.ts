import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

interface UseGetTasksProps {
    workspaceId: string;
}

export const useGetTasks = ({ workspaceId }: UseGetTasksProps) => {
    const query = useQuery({
        queryKey: ["tasks", workspaceId], // we add worksapceID so that projects reload every time we change workspace
        queryFn: async () => {
            const response = await client.api.tasks.$get({ query: { workspaceId }});

            if(!response.ok){
                throw new Error("Failed to fecth tasks");
            }

            const { data } = await response.json();
            return data;
        },
    });

    return query;
}