"use client";

import { createGroup } from "./actions";
import { newGroupSchema, userNameSchema } from "./schema";
import { Button, Flex, Group, Pill, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { zod4Resolver } from "mantine-form-zod-resolver";

export function NewGroupForm() {
  const userNameForm = useForm({
    initialValues: {
      userName: "",
    },
    validate: zod4Resolver(userNameSchema),
  });

  const form = useForm({
    initialValues: {
      name: "",
      userNames: [] as { userName: string }[],
    },
    validate: zod4Resolver(newGroupSchema),
  });

  const handleSubmit = async (values: typeof form.values) => {
    await createGroup({
      name: values.name,
      userNames: values.userNames.map((user) => user.userName),
    });
  };

  console.debug(form.errors);
  console.debug(form.values);

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <TextInput
        label="グループ名"
        placeholder="北海道旅行"
        {...form.getInputProps("name")}
      />
      <TextInput
        mt="md"
        w="100%"
        label="メンバー"
        placeholder="やまだ"
        {...userNameForm.getInputProps("userName")}
        error={
          userNameForm.getInputProps("userName").error ?? form.errors.userNames
        }
        styles={{
          wrapper: {
            flex: 1,
          },
        }}
        inputContainer={(children) => (
          <Group gap="xs">
            {children}
            <Button
              onClick={() => {
                const userNameValue = userNameForm.getValues().userName;
                const userNamesValue = form.getValues().userNames;
                if (
                  userNamesValue.some((user) => user.userName === userNameValue)
                ) {
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
                form.insertListItem("userNames", { userName: userNameValue });
                userNameForm.reset();
                form.clearFieldError("userNames");
              }}
            >
              追加
            </Button>
          </Group>
        )}
      />
      <Flex mt="xs">
        {form.values.userNames.map((user, index) => (
          <Pill
            key={user.userName}
            size="md"
            withRemoveButton
            onRemove={() => {
              form.removeListItem("userNames", index);
            }}
          >
            {user.userName}
          </Pill>
        ))}
      </Flex>
      <Button
        type="submit"
        mt="lg"
        w="100%"
        size="md"
        loading={form.submitting}
      >
        グループを作成
      </Button>
    </form>
  );
}
