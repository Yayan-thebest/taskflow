import { AppType } from "@/app/api/[[...route]]/route";
import { hc } from "hono/client";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL;

if (!baseUrl) {
  throw new Error("NEXT_PUBLIC_APP_URL n'est pas défini !");
}

export const client = hc<AppType>(baseUrl);
