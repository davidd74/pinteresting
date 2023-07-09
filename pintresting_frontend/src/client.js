import {createClient} from "@sanity/client";

export const client = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID,
  dataset: "production",
  token: import.meta.env.VITE_SANITY_TOKEN,
  useCdn: false,
  apiVersion: "2023-05-03",
});
