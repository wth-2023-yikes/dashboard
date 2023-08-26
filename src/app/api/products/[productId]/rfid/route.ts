import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "~/server/db";

export async function GET(request: Request, { params }: { params: { productId: string } }) {
  const { productId } = params;

  const res = await prisma.productRFID.findMany({
    select: {
      id: true,
      rfid: true,
    },
    where: {
      productId,
    },
  });

  return NextResponse.json(res, {
    status: 200,
  });
}

const PostRequestSchema = z.object({
  rfid: z.string(),
});

export async function POST(request: Request, { params }: { params: { productId: string } }) {
  const body = PostRequestSchema.parse(await request.json());

  const res = await prisma.productRFID.upsert({
    select: {
      id: true,
    },
    create: {
      rfid: body.rfid,
      productId: params.productId,
    },
    update: {
      productId: params.productId,
    },
    where: {
      rfid: body.rfid,
    },
  });

  return NextResponse.json(res, {
    status: 200,
  });
}
