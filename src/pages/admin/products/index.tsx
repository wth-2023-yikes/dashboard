import Head from "next/head";
import Link from "next/link";
import Box from "@mui/material/Box";
import { Alert, Button, Container, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { type GetServerSideProps } from "next";
import { prisma } from "~/server/db";
import { create } from "domain";

export default function Home({
  products,
}: {
  products: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    ProductRFID: {
      id: string;
      rfid: string;
    }[];
  }[];
}) {
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
          Products
        </Typography>
        <Stack
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Box>
            <Link href="/admin/products/create" passHref>
              <Button variant="contained">Create Product</Button>
            </Link>
          </Box>
        </Stack>
        <TableContainer>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell align="right">Name</TableCell>
                <TableCell align="right">Price</TableCell>
                <TableCell align="right">Quantity</TableCell>
                <TableCell align="right">Linked RFIDs</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product) => {
                return (
                  <TableRow key={product.id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                    <TableCell component="th" scope="row">
                      {product.id}
                    </TableCell>
                    <TableCell align="right">{product.name}</TableCell>
                    <TableCell align="right">{product.price}</TableCell>
                    <TableCell align="right">{product.quantity}</TableCell>
                    <TableCell align="right">{product.ProductRFID.map((rfid) => rfid.rfid).join(" ")}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
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
