import { NextResponse } from "next/server";

export async function GET(req) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  return new Response(ip);
}