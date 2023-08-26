import { NextResponse } from "next/server";
import { prisma } from "~/server/db";

// eslint-disable-next-line @typescript-eslint/require-await
export async function GET(request: Request) {
  return new Response("Hello World");
}
