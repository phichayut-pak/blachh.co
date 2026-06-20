import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

// Configure this URL as a webhook in the Sanity project (Settings > API >
// Webhooks), triggered on document publish, with a custom HTTP header
// `x-webhook-secret: <SANITY_REVALIDATE_SECRET>` so edits show up instantly
// instead of waiting for the 60s fetch revalidation in lib/sanity/queries.ts.
export async function POST(request: Request) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;

  if (!secret || request.headers.get("x-webhook-secret") !== secret) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  revalidateTag("sanity-content", "max");

  return NextResponse.json({ revalidated: true });
}
