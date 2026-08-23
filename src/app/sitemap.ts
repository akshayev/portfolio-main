import { MetadataRoute } from "next";
import { client } from "@/sanity/client";

type SanityProjectSlug = {
  slug: string;
  _updatedAt?: string;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://akshay.is-a.dev";

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/studio`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];

  // Fetch dynamic project slugs from Sanity CMS
  let projectRoutes: MetadataRoute.Sitemap = [];

  try {
    const projects = await client.fetch<SanityProjectSlug[]>(
      `*[_type == "project" && defined(slug.current)]{ "slug": slug.current, _updatedAt }`
    );

    projectRoutes = projects.map((project) => ({
      url: `${baseUrl}/projects/${project.slug}`,
      lastModified: project._updatedAt ? new Date(project._updatedAt) : new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    }));
  } catch (error) {
    console.error("Sanity sitemap fetch error (falling back to static routes):", error);
  }

  return [...staticRoutes, ...projectRoutes];
}
