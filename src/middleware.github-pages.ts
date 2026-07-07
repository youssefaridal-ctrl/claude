import { NextResponse } from "next/server";

// No-op middleware for static GitHub Pages export — no auth gating needed.
export default function middleware() {
  return NextResponse.next();
}

export const config = { matcher: [] };
