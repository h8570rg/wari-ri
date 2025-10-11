"use client";

import {
	Button,
	Checkbox,
	Group,
	NumberInput,
	Select,
	Stack,
	TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { ExpenseFormField } from "@/app/groups/[id]/expenses/_components/expense-form-field";
import { expenseSchema } from "@/app/groups/[id]/expenses/_components/expense-schema";
import type { GroupDocument } from "@/lib/data/group";
import { createExpense } from "./actions";

type Props = {
	group: GroupDocument;
};

export function NewExpenseForm({ group }: Props) {
	const form = useForm({
		initialValues: {
			amount: undefined as number | undefined,
			description: "",
			payerId: "",
			participantIds: [] as string[],
		},
		validate: zod4Resolver(expenseSchema),
	});

	const handleSubmit = async (values: typeof form.values) => {
		await createExpense({
			groupId: group.id,
			payerId: values.payerId,
			// biome-ignore lint/style/noNonNullAssertion: バリデーションしているので必ず存在する
			amount: values.amount!,
			description: values.description,
			participantIds: values.participantIds,
		});
	};

	return (
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
						placeholder="¥1000"
						hideControls
						prefix="¥"
						{...form.getInputProps("amount")}
					/>
				</ExpenseFormField>
				<Button type="submit" mt="lg" fullWidth loading={form.submitting}>
					建て替え記録を追加
				</Button>
			</Stack>
		</form>
	);
}
