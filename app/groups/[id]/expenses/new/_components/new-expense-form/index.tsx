"use client";

import {
	Box,
	Button,
	Checkbox,
	Flex,
	Group,
	NumberInput,
	Select,
	Stack,
	Text,
	TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { zod4Resolver } from "mantine-form-zod-resolver";
import type { GroupDocument } from "@/lib/data/group";
import { createExpense } from "./actions";
import { newExpenseSchema } from "./schema";

type Props = {
	group: GroupDocument;
};

export function NewExpenseForm({ group }: Props) {
	const form = useForm({
		initialValues: {
			amount: "",
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
			amount: Number(values.amount),
			description: values.description,
			participantIds: values.participantIds,
		});
	};

	return (
		<form onSubmit={form.onSubmit(handleSubmit)}>
			<Stack gap="lg">
				<Field supportingText="が">
					<Select
						placeholder="払った人"
						data={group.users.map((user) => ({
							value: user.id,
							label: user.name,
						}))}
						{...form.getInputProps("payerId")}
						flex="1"
					/>
				</Field>
				<Field supportingText="の">
					<Checkbox.Group
						error={form.errors.participantIds}
						{...form.getInputProps("participantIds")}
						flex="1"
					>
						<Group>
							{group.users.map((user) => (
								<Checkbox key={user.id} value={user.id} label={user.name} />
							))}
						</Group>
					</Checkbox.Group>
				</Field>
				<Field supportingText="を払って">
					<TextInput
						placeholder="ランチ代"
						{...form.getInputProps("description")}
					/>
				</Field>
				<Field supportingText="かかった">
					<NumberInput
						placeholder="¥1000"
						min={1}
						hideControls
						prefix="¥"
						{...form.getInputProps("amount")}
					/>
				</Field>
				<Button type="submit" mt="lg" fullWidth loading={form.submitting}>
					建て替え記録を追加
				</Button>
			</Stack>
		</form>
	);
}

function Field({
	children,
	supportingText,
}: {
	children: React.ReactNode;
	supportingText: string;
}) {
	return (
		<Flex gap="lg" align="center">
			<Box flex="1">{children}</Box>
			<Box
				style={{
					flexBasis: "max(70px, 30%)",
				}}
			>
				<Text fw="bold">{supportingText}</Text>
			</Box>
		</Flex>
	);
}
