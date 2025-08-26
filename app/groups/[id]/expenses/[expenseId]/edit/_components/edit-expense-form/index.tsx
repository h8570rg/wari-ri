"use client";

import {
	Button,
	Checkbox,
	Group,
	Modal,
	NumberInput,
	Select,
	Stack,
	Text,
	TextInput,
	Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { useState } from "react";
import type { ExpenseDocument } from "@/lib/data/expense";
import type { GroupDocument } from "@/lib/data/group";
import { deleteExpense, updateExpense } from "./actions";
import { editExpenseSchema } from "./schema";

type Props = {
	group: GroupDocument;
	expense: ExpenseDocument;
};

export function EditExpenseForm({ group, expense }: Props) {
	const [deleteModalOpened, setDeleteModalOpened] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);

	const form = useForm({
		initialValues: {
			amount: expense.amount,
			description: expense.description,
			payerId: expense.payerId,
			participantIds: expense.participantIds,
		},
		validate: zod4Resolver(editExpenseSchema),
	});

	const handleSubmit = async (values: typeof form.values) => {
		await updateExpense({
			groupId: group.id,
			expenseId: expense.id,
			payerId: values.payerId,
			amount: values.amount,
			description: values.description,
			participantIds: values.participantIds,
		});
	};

	const handleDelete = async () => {
		setIsDeleting(true);
		await deleteExpense({
			groupId: group.id,
			expenseId: expense.id,
		});
	};

	return (
		<Stack gap="lg">
			<Title order={1} size="h2" ta="center">
				建て替え記録を編集
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

					<Group gap="md" mt="lg">
						<Button type="submit" flex={1} size="md" loading={form.submitting}>
							更新する
						</Button>

						<Button
							variant="outline"
							color="red"
							size="md"
							onClick={() => setDeleteModalOpened(true)}
						>
							削除
						</Button>
					</Group>
				</Stack>
			</form>

			<Modal
				opened={deleteModalOpened}
				onClose={() => setDeleteModalOpened(false)}
				title="建て替え記録を削除"
				centered
			>
				<Stack gap="md">
					<Text size="sm">
						この建て替え記録を削除しますか？この操作は取り消せません。
					</Text>

					<Text size="sm" fw={500}>
						内容: {expense.description}
					</Text>

					<Text size="sm" fw={500}>
						金額: ¥{expense.amount.toLocaleString()}
					</Text>

					<Group gap="md" mt="md">
						<Button
							variant="outline"
							flex={1}
							onClick={() => setDeleteModalOpened(false)}
							disabled={isDeleting}
						>
							キャンセル
						</Button>

						<Button
							color="red"
							flex={1}
							loading={isDeleting}
							onClick={handleDelete}
						>
							削除する
						</Button>
					</Group>
				</Stack>
			</Modal>
		</Stack>
	);
}
