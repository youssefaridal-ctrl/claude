import { NextResponse } from "next/server";

export const dynamic = "force-static";

// Auth routes are not available in the static GitHub Pages export.
export function GET() {
  return NextResponse.json({ error: "not_available" }, { status: 404 });
}
export function POST() {
  return NextResponse.json({ error: "not_available" }, { status: 404 });
}
