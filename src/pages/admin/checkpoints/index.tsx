import Head from "next/head";
import Link from "next/link";
import Box from "@mui/material/Box";
import { Alert, Button, Container, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { type GetServerSideProps } from "next";
import { prisma } from "~/server/db";
import { create } from "domain";

export default function Home({
  checkpoints,
}: {
  checkpoints: {
    id: string;
    name: string;
    CheckpointPath: {
      id: string;
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
          Checkpoints
        </Typography>
        <Stack
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Box>
            <Link href="/admin/checkpoints/create" passHref>
              <Button variant="contained">Create Checkpoint</Button>
            </Link>
          </Box>
        </Stack>
        <TableContainer>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell align="right">Name</TableCell>
                <TableCell align="right">Paths</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {checkpoints.map((checkpoint) => {
                return (
                  <TableRow key={checkpoint.id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                    <TableCell component="th" scope="row">
                      {checkpoint.id}
                    </TableCell>
                    <TableCell align="right">{checkpoint.name}</TableCell>
                    <TableCell align="right">{checkpoint.CheckpointPath.length}</TableCell>
                    <TableCell align="right">
                      <Link href={`/admin/checkpoints/${checkpoint.id}/path`} passHref>
                        <Button variant="text">View Paths</Button>
                      </Link>
                    </TableCell>
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
  const checkpoints = await prisma.checkpoint.findMany({
    select: {
      id: true,
      name: true,
      CheckpointPath: {
        select: {
          id: true,
        },
      },
    },
  });

  return {
    props: {
      checkpoints,
    },
  };
};
