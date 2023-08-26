import { z } from "zod";

export const ImageSchema = z.object({
  type: z.enum(["base64"]),
  src: z.string(),
});
