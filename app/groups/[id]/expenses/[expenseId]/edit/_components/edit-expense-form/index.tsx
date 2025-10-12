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
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { IconCurrencyYen } from "@tabler/icons-react";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { useState } from "react";
import { ExpenseFormField } from "@/app/groups/[id]/expenses/_components/expense-form-field";
import type { ExpenseDocument } from "@/lib/data/expense";
import type { GroupDocument } from "@/lib/data/group";
import { expenseSchema } from "@/lib/schema";
import { deleteExpense, updateExpense } from "./actions";

type Props = {
	group: GroupDocument;
	expense: ExpenseDocument;
};

export function EditExpenseForm({ group, expense }: Props) {
	const [
		deleteModalOpened,
		{ open: openDeleteModal, close: closeDeleteModal },
	] = useDisclosure(false);
	const [isDeleting, setIsDeleting] = useState(false);

	const form = useForm({
		initialValues: {
			amount: String(expense.amount),
			description: expense.description,
			payerId: expense.payerId,
			participantIds: expense.participantIds,
		},
		validate: zod4Resolver(expenseSchema),
	});

	const handleSubmit = async (values: typeof form.values) => {
		await updateExpense({
			groupId: group.id,
			expenseId: expense.id,
			payerId: values.payerId,
			amount: Number(values.amount),
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
		<>
			<form onSubmit={form.onSubmit(handleSubmit)}>
				<Stack gap="lg">
					<ExpenseFormField supportingText="が">
						<Select
							placeholder="払った人"
							data={group.users.map((user) => ({
								value: user.id,
								label: user.name,
							}))}
							{...form.getInputProps("payerId")}
						/>
					</ExpenseFormField>
					<ExpenseFormField supportingText="の">
						<Checkbox.Group
							error={form.errors.participantIds}
							{...form.getInputProps("participantIds")}
						>
							<Group>
								{group.users.map((user) => (
									<Checkbox key={user.id} value={user.id} label={user.name} />
								))}
							</Group>
						</Checkbox.Group>
					</ExpenseFormField>
					<ExpenseFormField supportingText="を払って">
						<TextInput
							placeholder="ランチ代"
							{...form.getInputProps("description")}
						/>
					</ExpenseFormField>
					<ExpenseFormField supportingText="かかった">
						<NumberInput
							type="tel"
							placeholder="1000"
							inputMode="numeric"
							hideControls
							leftSection={<IconCurrencyYen />}
							{...form.getInputProps("amount")}
						/>
					</ExpenseFormField>
				</Stack>
				<Stack mt="xl">
					<Button type="submit" fullWidth loading={form.submitting}>
						更新
					</Button>
					<Button
						variant="outline"
						color="red"
						fullWidth
						onClick={openDeleteModal}
					>
						削除
					</Button>
				</Stack>
			</form>

			<Modal
				opened={deleteModalOpened}
				onClose={closeDeleteModal}
				title="建て替え記録を削除"
				centered
			>
				<Stack gap="md">
					<Text size="sm">
						この建て替え記録を削除しますか？
						<br />
						この操作は取り消せません。
					</Text>
					<Text size="sm" fw={500}>
						内容: {expense.description}
					</Text>
					<Text size="sm" fw={500}>
						金額: ¥{expense.amount.toLocaleString()}
					</Text>
				</Stack>
				<Group gap="md" mt="xl" justify="flex-end">
					<Button
						color="red"
						size="md"
						loading={isDeleting}
						onClick={handleDelete}
					>
						削除する
					</Button>
				</Group>
			</Modal>
		</>
	);
}
