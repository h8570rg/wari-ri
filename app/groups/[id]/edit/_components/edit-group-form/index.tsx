"use client";

import { updateGroup } from "./actions";
import { editGroupSchema, userNameSchema } from "./schema";
import { GroupDocument } from "@/lib/data/group";
import {
  Button,
  Flex,
  Group,
  Pill,
  TextInput,
  Title,
  Text,
  Stack,
  Modal,
  ActionIcon,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { useState } from "react";
import { IconEdit } from "@tabler/icons-react";

type Props = {
  group: GroupDocument;
};

export function EditGroupForm({ group }: Props) {
  const [editModalOpened, setEditModalOpened] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const userNameForm = useForm({
    initialValues: {
      userName: "",
    },
    validate: zod4Resolver(userNameSchema),
  });

  const editUserNameForm = useForm({
    initialValues: {
      userName: "",
    },
    validate: zod4Resolver(userNameSchema),
  });

  const form = useForm({
    initialValues: {
      name: group.name,
      users: group.users,
    },
    validate: zod4Resolver(editGroupSchema),
  });

  const handleSubmit = async (values: typeof form.values) => {
    await updateGroup({
      groupId: group.id,
      name: values.name,
      users: values.users,
    });
  };

  const handleEditMember = (index: number, currentName: string) => {
    setEditingIndex(index);
    editUserNameForm.setValues({ userName: currentName });
    setEditModalOpened(true);
  };

  const handleUpdateMemberName = () => {
    const newName = editUserNameForm.getValues().userName;
    const usersValue = form.getValues().users;

    // 重複チェック（編集中のメンバー以外）
    const otherNames = usersValue
      .filter((_, index) => index !== editingIndex)
      .map((user) => user.name);
    if (otherNames.includes(newName)) {
      editUserNameForm.setFieldError("userName", "ユーザー名が重複しています");
      return;
    }

    const validateResult = editUserNameForm.validateField("userName");
    if (validateResult.hasError || editingIndex === null) {
      return;
    }

    form.setFieldValue(`users.${editingIndex}.name`, newName);
    setEditModalOpened(false);
    setEditingIndex(null);
    editUserNameForm.reset();
  };

  return (
    <Stack gap="lg">
      <Title order={1} size="h2" ta="center">
        グループを編集
      </Title>

      <Text size="sm" c="dimmed" ta="center">
        グループ名の変更、メンバーの追加・名前変更ができます
      </Text>

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          <TextInput
            label="グループ名"
            placeholder="北海道旅行"
            {...form.getInputProps("name")}
          />

          <div>
            <Text size="sm" fw={500} mb={5}>
              メンバーを追加
            </Text>
            <Group gap="xs">
              <TextInput
                placeholder="やまだ"
                flex={1}
                {...userNameForm.getInputProps("userName")}
                error={
                  userNameForm.getInputProps("userName").error ??
                  form.errors.users
                }
              />
              <Button
                onClick={() => {
                  const userNameValue = userNameForm.getValues().userName;
                  const usersValue = form.getValues().users;
                  if (usersValue.some((user) => user.name === userNameValue)) {
                    userNameForm.setFieldError(
                      "userName",
                      "ユーザー名が重複しています",
                    );
                    return;
                  }
                  const validateResult = userNameForm.validateField("userName");
                  if (validateResult.hasError) {
                    return;
                  }
                  const newUser = {
                    id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                    name: userNameValue,
                  };
                  form.insertListItem("users", newUser);
                  userNameForm.reset();
                  form.clearFieldError("users");
                }}
              >
                追加
              </Button>
            </Group>
          </div>

          {form.values.users.length > 0 && (
            <div>
              <Text size="sm" fw={500} mb="xs">
                現在のメンバー（クリックで名前変更）
              </Text>
              <Flex gap="xs" wrap="wrap">
                {form.values.users.map((user, index) => (
                  <Pill
                    key={`${user.id}-${index}`}
                    size="md"
                    style={{ paddingRight: 4, cursor: "pointer" }}
                    onClick={() => handleEditMember(index, user.name)}
                  >
                    <Group gap={4} wrap="nowrap">
                      <Text size="sm">{user.name}</Text>
                      <ActionIcon size="xs" variant="subtle" color="gray">
                        <IconEdit size={12} />
                      </ActionIcon>
                    </Group>
                  </Pill>
                ))}
              </Flex>
            </div>
          )}

          <Button
            type="submit"
            mt="lg"
            w="100%"
            size="md"
            loading={form.submitting}
          >
            グループを更新
          </Button>
        </Stack>
      </form>

      <Modal
        opened={editModalOpened}
        onClose={() => {
          setEditModalOpened(false);
          setEditingIndex(null);
          editUserNameForm.reset();
        }}
        title="メンバー名を編集"
        centered
      >
        <Stack gap="md">
          <TextInput
            label="新しい名前"
            placeholder="新しいメンバー名"
            {...editUserNameForm.getInputProps("userName")}
          />

          <Group gap="md" mt="md">
            <Button
              variant="outline"
              flex={1}
              onClick={() => {
                setEditModalOpened(false);
                setEditingIndex(null);
                editUserNameForm.reset();
              }}
            >
              キャンセル
            </Button>

            <Button flex={1} onClick={handleUpdateMemberName}>
              更新
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
}
