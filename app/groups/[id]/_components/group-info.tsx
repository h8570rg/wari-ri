import { getGroup } from "@/lib/data";
import { Avatar, Card, Flex, Group, Stack, Text, Title } from "@mantine/core";
import { IconUsers } from "@tabler/icons-react";

export async function GroupInfo({ id }: { id: string }) {
  const group = await getGroup(id);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Stack gap="md">
        <Title order={1} size="h2" ta="center">
          {group.name}
        </Title>
        <Group gap="xs" justify="center">
          <IconUsers size={20} color="var(--mantine-color-dimmed)" />
          <Text size="sm" c="dimmed">
            メンバー {group.users.length}人
          </Text>
        </Group>
        <Flex gap="sm" wrap="wrap" justify="center">
          {group.users.map((user) => (
            <Group key={user.id} gap="xs">
              <Avatar size="sm" color="blue" radius="xl">
                {user.name.charAt(0)}
              </Avatar>
              <Text size="sm">{user.name}</Text>
            </Group>
          ))}
        </Flex>
      </Stack>
    </Card>
  );
}
