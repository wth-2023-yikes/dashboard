import Head from "next/head";
import Link from "next/link";
import Box from "@mui/material/Box";
import {
  Alert,
  Button,
  Container,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  FilledInput,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { type GetServerSideProps } from "next";
import { prisma } from "~/server/db";
import { Controller, useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { useState } from "react";
import { useRouter } from "next/router";

export default function Home({
  checkpoints,
}: {
  checkpoints: {
    id: string;
    name: string;
  }[];
}) {
  const {
    query: { checkpointId },
  } = useRouter();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<{
    toCheckpointId: string;
    images: FileList;
    tags: string;
  }>();
  const {
    mutate: createCheckpointPath,
    isSuccess: createCheckpointPathIsSuccess,
    isLoading: createCheckpointPathIsLoading,
    error: createCheckpointPathError,
  } = useMutation(
    async (data: {
      toCheckpointId: string;
      images: {
        type: string;
        src: string;
      }[];
      tags: string[];
    }) => {
      const response = await fetch(`/api/checkpoints/${checkpointId instanceof Array ? checkpointId[0] : checkpointId ?? ""}/path`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Network response was not ok");

      return response.json();
    }
  );

  return (
    <main className="flex flex-row">
      <Container
        sx={({ spacing }) => ({
          display: "flex",
          flexDirection: "column",
          padding: spacing(4, 2),
          gap: spacing(4),
        })}
      >
        <Typography
          component="h1"
          variant="h4"
          style={{
            fontWeight: 700,
          }}
        >
          Create Path
        </Typography>
        <form
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          onSubmit={handleSubmit(async (data) => {
            // https://stackoverflow.com/questions/36280818/how-to-convert-file-to-base64-in-javascript
            const toBase64 = (file: Blob) =>
              new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result);
                reader.onerror = reject;
              });

            const fileList = data.images;

            if (fileList) {
              const promises: Promise<string>[] = [];
              for (const file of fileList) {
                promises.push(toBase64(file) as Promise<string>);
              }
              const images = await Promise.all(promises);
              void createCheckpointPath({
                toCheckpointId: data.toCheckpointId,
                images: images.map((image) => ({
                  type: "base64",
                  src: image,
                })),
                tags: data.tags.split(",").map((tag) => tag.trim()),
              });
            }
          })}
        >
          <Stack gap={1}>
            <InputLabel>Route Images</InputLabel>
            <input
              type="file"
              multiple
              {...register("images", {
                required: true,
              })}
            />
          </Stack>

          <FormControl
            sx={{
              width: "100%",
              marginTop: 2,
            }}
            fullWidth
          >
            <InputLabel>To Checkpoint</InputLabel>
            <Controller
              control={control}
              name="toCheckpointId"
              render={({ field }) => {
                return (
                  <Select {...field}>
                    {checkpoints.map((checkpoint) => {
                      return (
                        <MenuItem key={checkpoint.id} value={checkpoint.id}>
                          {checkpoint.name}
                        </MenuItem>
                      );
                    })}
                  </Select>
                );
              }}
            />
          </FormControl>
          <TextField
            sx={{
              width: "100%",
              marginTop: 2,
            }}
            label="Tags"
            placeholder="wheelchair, tag2, etc..."
            variant="outlined"
            {...register("tags", {})}
          />

          <Stack
            sx={{
              display: "flex",
              marginTop: 2,
              flexDirection: "column",
              gap: 2,
            }}
          >
            {createCheckpointPathError ? (
              <Alert severity="error">{(createCheckpointPathError as { message: string }).message ?? "An unknown error occurred."}</Alert>
            ) : null}
            {createCheckpointPathIsSuccess ? (
              <Alert severity="success">
                Checkpoint Path created successfully.{" "}
                <Link href={`/admin/checkpoints/${checkpointId instanceof Array ? checkpointId[0] : checkpointId ?? ""}/path`}>Click Here</Link> to
                view all checkpoint paths for this checkpoint.
              </Alert>
            ) : null}
            <div>
              <Button variant="contained" type="submit" disabled={createCheckpointPathIsLoading}>
                Create Path
              </Button>
            </div>
          </Stack>
        </form>
      </Container>
    </main>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const checkpoints = await prisma.checkpoint.findMany({
    select: {
      id: true,
      name: true,
    },
  });

  return {
    props: {
      checkpoints,
    },
  };
};
