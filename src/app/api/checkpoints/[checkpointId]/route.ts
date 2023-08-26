import { NextResponse } from "next/server";
import { ZodError, z } from "zod";
import { prisma } from "~/server/db";
import { ImageSchema } from "../shared";

export async function GET(request: Request, { params }: { params: { checkpointId: string } }) {
  const res = await prisma.checkpoint.findFirst({
    select: {
      id: true,
      name: true,
      images: true,
    },
    where: {
      id: params.checkpointId,
    },
  });

  if (!res) {
    return NextResponse.json(
      {
        message: "Checkpoint not found",
      },
      {
        status: 404,
      }
    );
  }

  return NextResponse.json(
    {
      ...res,
      images: res.images.map((image) => {
        return ImageSchema.parse(JSON.parse(image));
      }),
    },
    {
      status: 200,
    }
  );
}
