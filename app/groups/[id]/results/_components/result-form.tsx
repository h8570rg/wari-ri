"use client";

import {
	Box,
	Button,
	Flex,
	Group,
	Stack,
	Text,
	TextInput,
} from "@mantine/core";
import { schemaResolver, useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { SignedAmountInput } from "@/components/signed-amount-input";
import type { GroupDocument } from "@/lib/data/group";
import type { ResultEntry } from "@/lib/data/result";
import { resultSchema } from "@/lib/schema";
import { formatSignedAmount, parseAmount } from "@/lib/utils/amount";
import { adjustResultAmounts } from "@/lib/utils/result-adjustment";
import { ResultAdjustmentModal } from "./result-adjustment-modal";

type Props = {
	group: GroupDocument;
	initialValues?: { description: string; entries: ResultEntry[] };
	submitLabel: string;
	onSubmit: (values: {
		description: string;
		entries: ResultEntry[];
	}) => Promise<void>;
};

export function ResultForm({
	group,
	initialValues,
	submitLabel,
	onSubmit,
}: Props) {
	// グループから外れたメンバーの記録も編集時に失わないよう残す
	const userIds = [
		...group.users.map((user) => user.id),
		...(initialValues?.entries ?? [])
			.map((entry) => entry.userId)
			.filter((userId) => !group.users.some((user) => user.id === userId)),
	];

	const [
		adjustmentModalOpened,
		{ open: openAdjustmentModal, close: closeAdjustmentModal },
	] = useDisclosure(false);

	const form = useForm({
		initialValues: {
			description: initialValues?.description ?? "",
			entries: userIds.map((userId) => ({
				userId,
				amount: String(
					initialValues?.entries.find((entry) => entry.userId === userId)
						?.amount ?? "",
				),
			})),
		},
		validate: schemaResolver(resultSchema, { sync: true }),
		transformValues: (values) => resultSchema.parse(values),
	});

	const sum = form.values.entries.reduce(
		(acc, entry) => acc + (parseAmount(entry.amount) ?? 0),
		0,
	);

	function getUserName(userId: string) {
		return group.users.find((user) => user.id === userId)?.name || "不明";
	}

	// 整数でない入力があるときや、勝ちと負けの両方がないときは補正できない
	const adjustmentEntries = form.values.entries.map((entry) => ({
		userId: entry.userId,
		userName: getUserName(entry.userId),
		amount: parseAmount(entry.amount) ?? 0,
	}));
	const canAdjust =
		form.values.entries.every((entry) => /^(-?\d+)?$/.test(entry.amount)) &&
		adjustResultAmounts(
			adjustmentEntries.map((entry) => entry.amount),
			0.5,
		) !== undefined;

	function applyAdjustment(amounts: number[]) {
		form.setFieldValue(
			"entries",
			form.values.entries.map((entry, index) => ({
				...entry,
				// 未入力（不参加）の人は空欄のまま残す
				amount: amounts[index] === 0 ? entry.amount : String(amounts[index]),
			})),
		);
	}

	return (
		<>
			<form onSubmit={form.onSubmit(onSubmit)}>
				<Stack gap="lg">
					<TextInput
						label="タイトル"
						placeholder="麻雀"
						{...form.getInputProps("description")}
					/>
					{form.values.entries.map((entry, index) => {
						const userName = getUserName(entry.userId);
						return (
							<Flex key={entry.userId} gap="md" align="center">
								<Text flex="1" fw="bold" truncate>
									{userName}
								</Text>
								<Box style={{ flexGrow: 1, maxWidth: "160px" }}>
									<SignedAmountInput
										aria-label={`${userName}の金額`}
										{...form.getInputProps(`entries.${index}.amount`)}
									/>
								</Box>
							</Flex>
						);
					})}
				</Stack>
				<Stack gap="md" mt="lg">
					<Group justify="space-between">
						<Text fw="bold">合計</Text>
						<Text fw="bold">{formatSignedAmount(sum)}</Text>
					</Group>
					<Button
						variant="light"
						color="blue"
						fullWidth
						disabled={sum === 0 || !canAdjust}
						onClick={openAdjustmentModal}
					>
						合計を0に調整
					</Button>
					{form.errors.entries && (
						<Text size="sm" c="red">
							{form.errors.entries}
						</Text>
					)}
					<Button
						type="submit"
						fullWidth
						loading={form.submitting}
						color="blue"
					>
						{submitLabel}
					</Button>
				</Stack>
			</form>
			<ResultAdjustmentModal
				opened={adjustmentModalOpened}
				onClose={closeAdjustmentModal}
				entries={adjustmentEntries}
				onApply={applyAdjustment}
			/>
		</>
	);
}
