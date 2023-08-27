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
} from "@mui/material";
import { type GetServerSideProps } from "next";
import { prisma } from "~/server/db";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";

export default function Home() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{
    name: string;
  }>();
  const {
    mutate: createCheckpoint,
    isSuccess: createCheckpointIsSuccess,
    isLoading: createCheckpointIsLoading,
    error: createCheckpointError,
  } = useMutation(async (data: { name: string }) => {
    const response = await fetch("/api/checkpoints/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Network response was not ok");

    return response.json();
  });

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
          Create Checkpoint
        </Typography>
        <form
          // eslint-disable-next-line @typescript-eslint/no-misused-promises, @typescript-eslint/require-await
          onSubmit={handleSubmit(async (data) => {
            void createCheckpoint(data);
          })}
        >
          <TextField
            sx={{
              width: "100%",
            }}
            label="Name"
            variant="outlined"
            {...register("name", { required: true })}
          />

          <Stack
            sx={{
              display: "flex",
              marginTop: 2,
              flexDirection: "column",
              gap: 2,
            }}
          >
            {createCheckpointError ? (
              <Alert severity="error">{(createCheckpointError as { message: string }).message ?? "An unknown error occurred."}</Alert>
            ) : null}
            {createCheckpointIsSuccess ? (
              <Alert severity="success">
                Checkpoint created successfully. <Link href="/admin/checkpoints">Click Here</Link> to view all checkpoints.
              </Alert>
            ) : null}
            <div>
              <Button variant="contained" type="submit" disabled={createCheckpointIsLoading}>
                Create Checkpoint
              </Button>
            </div>
          </Stack>
        </form>
      </Container>
    </main>
  );
}
