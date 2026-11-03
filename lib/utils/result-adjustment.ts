/**
 * 勝ち負けの合計を0に補正する
 *
 * 勝ちの合計と負けの合計を目標額にそろえ、勝ち側・負け側それぞれの中では元の金額に比例して配分する。
 * 符号は変わらず、0円（不参加）の人には配分しない。
 *
 * @param amounts 各メンバーの金額（整数）
 * @param ratio 目標額の位置。0で勝ちの合計、1で負けの合計にそろえる
 * @returns 補正後の金額。勝ちと負けの両方がない場合は補正できないのでundefined
 */
export function adjustResultAmounts(
	amounts: number[],
	ratio: number,
): number[] | undefined {
	const totalWin = sum(amounts.filter((amount) => amount > 0));
	const totalLoss = -sum(amounts.filter((amount) => amount < 0));
	if (totalWin === 0 || totalLoss === 0) {
		return undefined;
	}

	const target = getAdjustmentTarget(totalWin, totalLoss, ratio);
	const wins = apportion(
		amounts.map((amount) => Math.max(amount, 0)),
		target,
	);
	const losses = apportion(
		amounts.map((amount) => Math.max(-amount, 0)),
		target,
	);
	return amounts.map((_, index) => wins[index] - losses[index]);
}

/**
 * 勝ちの合計・負けの合計をそろえる目標額（整数）
 */
function getAdjustmentTarget(
	totalWin: number,
	totalLoss: number,
	ratio: number,
) {
	return Math.round(totalWin + (totalLoss - totalWin) * ratio);
}

function sum(values: number[]) {
	return values.reduce((acc, value) => acc + value, 0);
}

/**
 * 0以上の整数を合計がtotalになるよう比例配分する（最大剰余法）
 *
 * 小数誤差を避けるため、比例配分の商と余りを整数のまま計算する。
 */
function apportion(values: number[], total: number) {
	const valueSum = sum(values);
	const shares = values.map((value) => ({
		quotient: Math.floor((value * total) / valueSum),
		remainder: (value * total) % valueSum,
	}));

	// 切り捨てで足りなくなった分を、余りの大きい順に1円ずつ配る（同じ余りなら入力順）
	let shortage = total - sum(shares.map((share) => share.quotient));
	const order = shares
		.map((share, index) => ({ index, remainder: share.remainder }))
		.filter(({ index }) => values[index] > 0)
		.sort((a, b) => b.remainder - a.remainder || a.index - b.index);
	const result = shares.map((share) => share.quotient);
	for (const { index } of order) {
		if (shortage === 0) {
			break;
		}
		result[index] += 1;
		shortage -= 1;
	}
	return result;
}
