import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

interface UseGetProjectProps {
    projectId: string;
}

export const useGetProject = ({ projectId }: UseGetProjectProps) => {
    const query = useQuery({
        queryKey: ["project", projectId], // we add worksapceID so that projects reload every time we change workspace
        queryFn: async () => {
            const response = await client.api.projects[":projectId"].$get({ param: { projectId }});

            if(!response.ok){
                throw new Error("Failed to fecth project");
            }

            const { data } = await response.json();
            return data;
        },
    });

    return query;
}