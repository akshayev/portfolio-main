import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "./env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
});

// Intercept fetch to prevent crashes if credentials are missing
const originalFetch = client.fetch.bind(client);

client.fetch = async function <R = any>(
  query: string,
  params?: any,
  options?: any
): Promise<R> {
  if (projectId === "placeholder" || !projectId) {
    console.warn(`[Sanity CMS] Missing project ID. Mocking fallback for query: ${query.substring(0, 30)}...`);
    // Return empty array as fallback since our queries expect arrays
    return [] as unknown as R;
  }
  return originalFetch(query, params, options);
} as typeof client.fetch;
