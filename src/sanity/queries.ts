import { defineQuery } from "next-sanity";

export const getFlagshipProjectsQuery = defineQuery(
  `*[_type == "project"] | order(_createdAt desc) {
    _id,
    _createdAt,
    title,
    "slug": slug.current,
    tagline,
    coverImage,
    techStack,
    problemStatement,
    architecture,
    metrics,
    githubUrl,
    liveUrl,
    youtubeUrl
  }`
);
