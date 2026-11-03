/**
 * 入力値を数値に変換する（未入力や数値でない場合はundefined）
 */
export function parseAmount(value: string): number | undefined {
	if (value === "" || value === "-") {
		return undefined;
	}
	const amount = Number(value);
	return Number.isNaN(amount) ? undefined : amount;
}

/**
 * 符号付きで金額を表示する（例: +¥1,000 / -¥300 / ¥0）
 */
export function formatSignedAmount(amount: number) {
	const sign = amount > 0 ? "+" : amount < 0 ? "-" : "";
	return `${sign}¥${Math.abs(amount).toLocaleString()}`;
}
