"use client";

import { Box, Text } from "@mantine/core";
import NextLink from "next/link";

export function Header() {
  return (
    <Box component="header" p="sm" ta="center" bdrs="0 0 10px 10px" mb="lg">
      <Text
        size="xl"
        fw={900}
        style={{
          color: "var(--mantine-primary-color-7)",
        }}
        component={NextLink}
        href="/"
      >
        ワリーリ
      </Text>
    </Box>
  );
}
