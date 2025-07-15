import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

interface UseGetTaskProps {
    taskId: string;
}

export const useGetTask = ({ taskId }: UseGetTaskProps) => {
    const query = useQuery({
        queryKey: ["task", taskId], // we add worksapceID so that projects reload every time we change workspace
        queryFn: async () => {
            const response = await client.api.tasks[":taskId"].$get({ param: {taskId}});

            if(!response.ok){
                throw new Error("Failed to fecth task");
            }

            const { data } = await response.json();
            return data;
        },
    });

    return query;
}