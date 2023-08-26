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
    price: number;
    quantity: number;
  }>();
  const {
    mutate: createProduct,
    isLoading: createProductIsLoading,
    error: createProductError,
  } = useMutation(async (data: { name: string; price: number; quantity: number }) => {
    const response = await fetch("/api/products/", {
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
          Create Product
        </Typography>
        <form
          // eslint-disable-next-line @typescript-eslint/no-misused-promises, @typescript-eslint/require-await
          onSubmit={handleSubmit(async (data) => {
            void createProduct(data);
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
              flexDirection: "row",
              gap: 2,
            }}
          >
            <TextField
              sx={{
                width: "100%",
              }}
              label="Price"
              variant="outlined"
              {...register("price", { required: true, valueAsNumber: true, min: 0 })}
            />
            <TextField
              sx={{
                width: "100%",
              }}
              label="Quantity"
              variant="outlined"
              {...register("quantity", { required: true, valueAsNumber: true, min: 0 })}
            />
          </Stack>
          <Stack
            sx={{
              display: "flex",
              marginTop: 2,
              flexDirection: "row",
              gap: 2,
            }}
          >
            {createProductError ? (
              <Alert severity="error">{(createProductError as { message: string }).message ?? "An unknown error occurred."}</Alert>
            ) : null}
            <Button variant="contained" type="submit" disabled={createProductIsLoading}>
              Create Product
            </Button>
          </Stack>
        </form>
      </Container>
    </main>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const products = await prisma.product.findMany({
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
  console.log(products);

  return {
    props: {
      products,
    },
  };
};
