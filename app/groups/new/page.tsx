import { Box, Container, Text, Title } from "@mantine/core";
import { NewGroupForm } from "./_components/new-group-form";
import NextLink from "next/link";

export default function NewGroupPage() {
  return (
    <Box mih="100vh" bg="white">
      <Box pos="relative">
        <Box
          pos="relative"
          bg="green.8"
          style={{
            background: "white",
            clipPath: "inset(0 round 0 0 30px 0)",
          }}
        >
          <Box pt="md" px="md">
            <Text component={NextLink} href="/" c="green.0" size="h4" fw={700}>
              ワリーリ
            </Text>
          </Box>
          <Box py="xl">
            <Title order={1} c="white" size="h3" ta="center">
              グループ作成
            </Title>
          </Box>
        </Box>
        <Box
          pos="absolute"
          top="calc(100% - 1px)"
          left={0}
          w="30px"
          h="30px"
          bg="green.8"
          style={{
            mask: "radial-gradient(30px at 100% 100%, #0000 98%, #000)",
          }}
        />
      </Box>
      <Container>
        <NewGroupForm />
      </Container>
    </Box>
  );
}
