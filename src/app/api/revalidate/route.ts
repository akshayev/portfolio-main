import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const secret =
      req.headers.get("x-sanity-secret") ||
      req.headers.get("authorization")?.replace("Bearer ", "") ||
      req.nextUrl.searchParams.get("secret");

    const expectedSecret = process.env.SANITY_REVALIDATE_SECRET;

    if (expectedSecret && secret !== expectedSecret) {
      return NextResponse.json(
        { message: "Invalid revalidation secret token" },
        { status: 401 }
      );
    }

    const body = await req.json().catch(() => ({}));

    // Trigger Next.js 15 cache purge for the 'projects' tag
    revalidateTag("projects");

    return NextResponse.json({
      revalidated: true,
      now: Date.now(),
      tag: "projects",
      documentId: body._id || null,
      documentType: body._type || "project",
      message: "Cache tag 'projects' successfully revalidated",
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error("Revalidation error:", errorMessage);
    return NextResponse.json(
      { message: "Error revalidating cache", error: errorMessage },
      { status: 500 }
    );
  }
}
