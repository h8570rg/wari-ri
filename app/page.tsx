import {
  Button,
  Container,
  Title,
  Text,
  Stack,
  Paper,
  Group,
  ActionIcon,
} from "@mantine/core";
import { IconUsers, IconCalculator, IconHeart } from "@tabler/icons-react";
import NextLink from "next/link";

export default function RootPage() {
  return (
    <Container>
      <Stack gap="xl" align="center">
        <Paper withBorder>
          <Stack align="center" gap="md">
            <Group gap="xs">
              <ActionIcon
                variant="gradient"
                gradient={{ from: "green", to: "teal" }}
                size="xl"
                radius="xl"
              >
                <IconCalculator size={28} />
              </ActionIcon>
              <Title order={1} c="green.7">
                ワリーリ
              </Title>
            </Group>

            <Text c="dimmed" ta="center" size="lg">
              みんなで使う、シンプルな割り勘アプリ
            </Text>
          </Stack>
        </Paper>

        <Stack gap="md" w="100%" maw={400}>
          <Button
            component={NextLink}
            href="/groups/new"
            leftSection={<IconUsers size={20} />}
            variant="gradient"
            gradient={{ from: "green", to: "teal" }}
            size="lg"
            fullWidth
          >
            割り勘グループを作成
          </Button>
        </Stack>

        <Paper withBorder w="100%" maw={400}>
          <Stack gap="sm">
            <Group gap="xs">
              <IconHeart size={16} color="var(--mantine-color-green-6)" />
              <Text size="sm" fw={600} c="green.7">
                ワリーリの特徴
              </Text>
            </Group>

            <Text size="sm" c="dimmed">
              • シンプルで使いやすいデザイン
              <br />
              • リアルタイムで金額を共有
              <br />• 面倒な計算は自動で処理
            </Text>
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
}
