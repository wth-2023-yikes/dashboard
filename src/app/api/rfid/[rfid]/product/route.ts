import { NextResponse } from "next/server";
import { prisma } from "~/server/db";

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: {
      rfid: string;
    };
  }
) {
  const { rfid } = params;

  const res = await prisma.product.findFirst({
    select: {
      id: true,
      name: true,
      price: true,
      quantity: true,
    },
    where: {
      ProductRFID: {
        every: {
          rfid,
        },
      },
    },
  });

  if (!res) {
    return NextResponse.json(
      {
        message: "Product not found",
      },
      {
        status: 404,
      }
    );
  }

  return NextResponse.json(res, {
    status: 200,
  });
}
