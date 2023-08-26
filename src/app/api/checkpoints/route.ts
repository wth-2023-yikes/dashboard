import { NextResponse } from "next/server";
import { ZodError, z } from "zod";
import { prisma } from "~/server/db";
import { ImageSchema } from "./shared";

export async function GET() {
  const res = await prisma.checkpoint.findMany({
    select: {
      id: true,
      name: true,
      images: true,
    },
  });

  return NextResponse.json(
    res.map((checkpoint) => {
      return {
        ...checkpoint,
        images: checkpoint.images.map((image) => {
          return ImageSchema.parse(JSON.parse(image));
        }),
      };
    }),
    {
      status: 200,
    }
  );
}

const PostRequestSchema = z.object({
  name: z.string(),
  images: z.array(ImageSchema).optional(),
});

export async function POST(request: Request) {
  try {
    const body = PostRequestSchema.parse(await request.json());

    const res = await prisma.checkpoint.create({
      select: {
        id: true,
      },
      data: {
        name: body.name,
        images: (body.images ?? []).map((image) => {
          return JSON.stringify(image);
        }),
      },
    });

    return NextResponse.json(res, {
      status: 200,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          message: error.message,
        },
        {
          status: 400,
        }
      );
    }
    console.error(error);
    return NextResponse.json(
      {
        message: "Something went wrong",
      },
      {
        status: 404,
      }
    );
  }
}
