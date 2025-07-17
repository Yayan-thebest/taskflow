import { useParams } from "next/navigation";

// permet d'obtenir le ID provenan de l'url
export const useProjectId = () => {
    const params = useParams();
    return params.projectId as string;
}