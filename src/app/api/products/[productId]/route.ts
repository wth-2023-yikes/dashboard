import { NextResponse } from "next/server";
import { ZodError, z } from "zod";
import { prisma } from "~/server/db";

export async function GET(request: Request, { params }: { params: { productId: string } }) {
  const { productId } = params;

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
    where: {
      id: productId,
    },
  });

  return NextResponse.json(res, {
    status: 200,
  });
}
