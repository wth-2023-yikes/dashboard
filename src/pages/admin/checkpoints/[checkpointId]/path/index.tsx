import Head from "next/head";
import Link from "next/link";
import Box from "@mui/material/Box";
import { Alert, Button, Container, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { type GetServerSideProps } from "next";
import { prisma } from "~/server/db";
import { create } from "domain";
import { useRouter } from "next/router";

export default function Home({
  paths,
}: {
  paths: {
    id: string;
    Checkpoint: {
      name: string;
    };
    tags: string[];
    ToCheckpoint: {
      name: string;
    };
  }[];
}) {
  const {
    query: { checkpointId },
  } = useRouter();

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
          Paths
        </Typography>
        <Stack
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Box>
            <Link href={`/admin/checkpoints/${checkpointId instanceof Array ? checkpointId[0] : checkpointId ?? ""}/path/create`} passHref>
              <Button variant="contained">Create Path</Button>
            </Link>
          </Box>
        </Stack>
        <TableContainer>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell align="right">Path Connection</TableCell>
                <TableCell align="right">Tags</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paths.map((path) => {
                return (
                  <TableRow key={path.id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                    <TableCell component="th" scope="row">
                      {path.id}
                    </TableCell>
                    <TableCell align="right">{`${path.Checkpoint.name} -> ${path.ToCheckpoint.name}`}</TableCell>
                    <TableCell align="right">{path.tags.join(", ")}</TableCell>
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

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const checkpointId = params?.checkpointId as string;
  const paths = await prisma.checkpointPath.findMany({
    select: {
      id: true,
      tags: true,
      Checkpoint: {
        select: {
          name: true,
        },
      },
      ToCheckpoint: {
        select: {
          name: true,
        },
      },
    },
    where: {
      checkpointId,
    },
  });

  return {
    props: {
      paths,
    },
  };
};
