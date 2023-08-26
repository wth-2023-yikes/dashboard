import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "~/server/db";

export async function GET() {
  const res = await prisma.product.findMany({
    select: {
      id: true,
      name: true,
      price: true,
      quantity: true,
      ProductRFID: {
        select: {
          id: true,
          rfid: true,
        },
      },
    },
  });

  return NextResponse.json(res, {
    status: 200,
  });
}

const PostRequestSchema = z.object({
  name: z.string(),
  price: z.number(),
  quantity: z.number(),
});

export async function POST(request: Request) {
  const body = PostRequestSchema.parse(await request.json());

  const res = await prisma.product.create({
    select: {
      id: true,
    },
    data: {
      name: body.name,
      price: body.price,
      quantity: body.quantity,
    },
  });

  return NextResponse.json(res, {
    status: 200,
  });
}
