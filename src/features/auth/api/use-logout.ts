import { useMutation, useQueryClient } from "@tanstack/react-query";
import {  InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof client.api.auth.logout["$post"]>;

export const useLogout = () => {
    const router = useRouter();
    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType, Error>({
        mutationFn: async ( ) => {
            const response = await client.api.auth.logout["$post"]();
console.log("Logout response", response);

            if(!response.ok){
                throw new Error("Failed to logout")
            }

            return await response.json();
        },
        onSuccess: () => {
            toast.success("Logout succesfully")
            router.refresh();
            queryClient.invalidateQueries(); // when nothing is specifie it will invalidate everything
            
            // 🚀 Redirige vers la page de login
            router.push("/sign-in");
            //window.location.href = "/sign-in"
        },
        onError: () => {
            toast.error("Failed to logout")
        }
    });

    return mutation;
}