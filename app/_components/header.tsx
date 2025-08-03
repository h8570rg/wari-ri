"use client";

import { Box, Title } from "@mantine/core";
import NextLink from "next/link";

export function Header() {
  return (
    <Box component="header" bg="green" p="md" ta="center">
      <Title
        size="xl"
        c="white"
        display="block"
        renderRoot={(props) => <NextLink href="/" {...props} />}
      >
        ワリーリ
      </Title>
    </Box>
  );
}
