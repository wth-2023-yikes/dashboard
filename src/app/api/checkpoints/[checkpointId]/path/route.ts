import { NextResponse } from "next/server";
import { ZodError, z } from "zod";
import { prisma } from "~/server/db";
import { ImageSchema } from "./shared";

export async function GET(request: Request, { params }: { params: { checkpointId: string } }) {
  const res = await prisma.checkpointPath.findMany({
    select: {
      id: true,
      checkpointId: true,
      tags: true,
      toCheckpointId: true,
      ToCheckpoint: true,
      Checkpoint: true,
      images: true,
    },
    where: {
      id: params.checkpointId,
    },
  });

  // const resolvedNodeMappings = new Map<string, string[]>();
  // let unresolvedReferences = new Set<string>();

  // while (true) {
  //   const newUnresolvedReferences = new Set<string>();
  //   res.forEach((path) => {
  //     path.images.forEach((_image) => {
  //       const image = ImageSchema.parse(JSON.parse(_image));
  //       if (image.type === "checkpointRef") {
  //         newUnresolvedReferences.add(image.src);
  //       }
  //     });
  //   });
  //   unresolvedReferences = newUnresolvedReferences;
  // }

  // const promises = new Array(res.length);
  // res.forEach((path) => {});

  return NextResponse.json(
    res.map((path) => {
      return {
        ...res,
        images: path.images.map((image) => {
          return ImageSchema.parse(JSON.parse(image));
        }),
      };
    })
  );
  // return NextResponse.json(
  //   {
  //     ...res,
  //     images: res.images.map((image) => {
  //       return ImageSchema.parse(JSON.parse(image));
  //     }),
  //   },
  //   {
  //     status: 200,
  //   }
  // );
}

const PostRequestSchema = z.object({
  toCheckpointId: z.string(),
  images: z.array(ImageSchema),
  tags: z.array(z.string()),
});

export async function POST(request: Request, { params }: { params: { checkpointId: string } }) {
  try {
    const body = PostRequestSchema.parse(await request.json());

    const res = await prisma.checkpointPath.create({
      select: {
        id: true,
      },
      data: {
        checkpointId: params.checkpointId,
        toCheckpointId: body.toCheckpointId,
        tags: body.tags,
        images: body.images.map((image) => {
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
