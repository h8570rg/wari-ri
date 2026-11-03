"use client";

import { Button, Group, Modal, Slider, Stack, Text } from "@mantine/core";
import { useState } from "react";
import { formatSignedAmount } from "@/lib/utils/amount";
import { adjustResultAmounts } from "@/lib/utils/result-adjustment";

type Entry = {
	userId: string;
	userName: string;
	amount: number;
};

type Props = {
	opened: boolean;
	onClose: () => void;
	entries: Entry[];
	onApply: (amounts: number[]) => void;
};

/**
 * 合計が0にならない勝ち負けを補正するモーダル
 */
export function ResultAdjustmentModal({
	opened,
	onClose,
	entries,
	onApply,
}: Props) {
	return (
		<Modal opened={opened} onClose={onClose} title="合計を0に調整" centered>
			<AdjustmentContent
				entries={entries}
				onApply={(amounts) => {
					onApply(amounts);
					onClose();
				}}
			/>
		</Modal>
	);
}

function AdjustmentContent({
	entries,
	onApply,
}: Pick<Props, "entries" | "onApply">) {
	// 0: 勝ちの合計にそろえる / 100: 負けの合計にそろえる
	// Modalは閉じると中身をアンマウントするので、開くたびに初期位置に戻る
	const [position, setPosition] = useState(50);

	const amounts = entries.map((entry) => entry.amount);
	const adjustedAmounts = adjustResultAmounts(amounts, position / 100);
	if (!adjustedAmounts) {
		return null;
	}

	const totalWin = amounts
		.filter((amount) => amount > 0)
		.reduce((acc, amount) => acc + amount, 0);
	const totalLoss = -amounts
		.filter((amount) => amount < 0)
		.reduce((acc, amount) => acc + amount, 0);

	return (
		<Stack gap="lg">
			<Text size="sm">
				勝ちの合計（¥{totalWin.toLocaleString()}）と負けの合計（¥
				{totalLoss.toLocaleString()}
				）をそろえます。それぞれの中では金額の比率を保って配分します。
			</Text>
			<Stack gap={4}>
				<Slider
					thumbLabel="調整の基準"
					value={position}
					onChange={setPosition}
					min={0}
					max={100}
					step={1}
					label={null}
					marks={[{ value: 0 }, { value: 50 }, { value: 100 }]}
					size="lg"
					color="blue"
				/>
				<Group justify="space-between">
					<Text size="xs" c="dimmed">
						勝ちに合わせる
					</Text>
					<Text size="xs" c="dimmed">
						負けに合わせる
					</Text>
				</Group>
			</Stack>
			<Stack gap="xs">
				{entries.map((entry, index) =>
					entry.amount === 0 ? null : (
						<Group key={entry.userId} justify="space-between" wrap="nowrap">
							<Text size="sm" fw="bold" truncate>
								{entry.userName}
							</Text>
							<Text size="sm" style={{ whiteSpace: "nowrap" }}>
								{formatSignedAmount(entry.amount)} →{" "}
								<Text span fw="bold">
									{formatSignedAmount(adjustedAmounts[index])}
								</Text>
							</Text>
						</Group>
					),
				)}
			</Stack>
			<Button fullWidth color="blue" onClick={() => onApply(adjustedAmounts)}>
				適用する
			</Button>
		</Stack>
	);
}
