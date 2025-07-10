import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof client.api.auth.register["$post"]>;
type RequestType = InferRequestType<typeof client.api.auth.register["$post"]>;

export const useRegister = () => {

    const router = useRouter();
    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async ( {json} ) => {
            const response = await client.api.auth.register["$post"]({ json });

            if(!response.ok){
                throw new Error("Failed to create account")
            }

            return await response.json();
        },
        onSuccess: () => {
            router.refresh();
            queryClient.invalidateQueries({ queryKey: ["currentUser"] });
            queryClient.invalidateQueries({ queryKey: ["workspaces"]})
            toast.success("Accounct created succesfully")
        },
        onError: () => {
            toast.error("Failed to create account")
        }
    });

    return mutation;
}