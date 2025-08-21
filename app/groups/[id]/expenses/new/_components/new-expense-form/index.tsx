"use client";

import { createExpense } from "./actions";
import { newExpenseSchema } from "./schema";
import { GroupDocument } from "@/lib/data/group";
import {
  Button,
  Checkbox,
  NumberInput,
  Select,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { zod4Resolver } from "mantine-form-zod-resolver";

type Props = {
  group: GroupDocument;
};

export function NewExpenseForm({ group }: Props) {
  const form = useForm({
    initialValues: {
      amount: 0,
      description: "",
      payerId: "",
      participantIds: [] as string[],
    },
    validate: zod4Resolver(newExpenseSchema),
  });

  const handleSubmit = async (values: typeof form.values) => {
    await createExpense({
      groupId: group.id,
      payerId: values.payerId,
      amount: values.amount,
      description: values.description,
      participantIds: values.participantIds,
    });
  };

  return (
    <Stack gap="lg">
      <Title order={1} size="h2" ta="center">
        建て替え記録を追加
      </Title>

      <Text size="sm" c="dimmed" ta="center">
        グループ：{group.name}
      </Text>

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          <NumberInput
            label="金額"
            placeholder="1000"
            min={1}
            {...form.getInputProps("amount")}
          />

          <TextInput
            label="内容"
            placeholder="ランチ代"
            {...form.getInputProps("description")}
          />

          <Select
            label="建て替えした人"
            placeholder="選択してください"
            data={group.users.map((user) => ({
              value: user.id,
              label: user.name,
            }))}
            {...form.getInputProps("payerId")}
          />

          <Checkbox.Group
            label="参加者"
            error={form.errors.participantIds}
            {...form.getInputProps("participantIds")}
          >
            <Stack gap="xs" mt="xs">
              {group.users.map((user) => (
                <Checkbox key={user.id} value={user.id} label={user.name} />
              ))}
            </Stack>
          </Checkbox.Group>

          <Button
            type="submit"
            mt="lg"
            w="100%"
            size="md"
            loading={form.submitting}
          >
            建て替え記録を追加
          </Button>
        </Stack>
      </form>
    </Stack>
  );
}
