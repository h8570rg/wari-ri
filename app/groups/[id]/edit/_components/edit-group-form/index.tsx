"use client";

import { Button, Flex, Group, Modal, Pill, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { IconEdit } from "@tabler/icons-react";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { useState } from "react";
import type { GroupDocument } from "@/lib/data/group";
import { editGroupSchema, userNameSchema } from "@/lib/schema";
import { updateGroup } from "./actions";

type Props = {
	group: GroupDocument;
};

export function EditGroupForm({ group }: Props) {
	const [editModalOpened, { open: openEditModal, close: closeEditModal }] =
		useDisclosure(false);
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
		openEditModal();
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
		closeEditModal();
		setEditingIndex(null);
		editUserNameForm.reset();
	};

	return (
		<>
			<form onSubmit={form.onSubmit(handleSubmit)}>
				<TextInput
					label="グループ名"
					placeholder="北海道旅行"
					{...form.getInputProps("name")}
				/>
				<TextInput
					mt="md"
					label="メンバー"
					placeholder="やまだ"
					{...userNameForm.getInputProps("userName")}
					error={
						userNameForm.getInputProps("userName").error ?? form.errors.users
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
										id: crypto.randomUUID(),
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
					)}
				/>

				{form.values.users.length > 0 && (
					<Pill.Group mt="xs">
						{form.values.users.map((user, index) => (
							<Pill
								key={`${user.id}-${index}`}
								size="lg"
								onClick={() => handleEditMember(index, user.name)}
							>
								<Flex align="center">
									{user.name}
									<IconEdit size="16px" style={{ marginLeft: "4px" }} />
								</Flex>
							</Pill>
						))}
					</Pill.Group>
				)}
				<Button type="submit" mt="xl" fullWidth loading={form.submitting}>
					グループを更新
				</Button>
			</form>

			<Modal
				opened={editModalOpened}
				onClose={() => {
					closeEditModal();
					setEditingIndex(null);
					editUserNameForm.reset();
				}}
				title="メンバー名を編集"
				centered
			>
				<TextInput
					label="名前"
					placeholder="やまだ"
					{...editUserNameForm.getInputProps("userName")}
				/>
				<Group justify="flex-end" mt="xl">
					<Button onClick={handleUpdateMemberName}>更新</Button>
				</Group>
			</Modal>
		</>
	);
}
