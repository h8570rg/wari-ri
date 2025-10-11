import type { ExpenseDocument } from "../data/expense";
import type {
	Aggregation,
	GroupDocument,
	Settlement,
	UserBalance,
} from "../data/group";
import type { SettlementDocument } from "../data/settlement";

/**
 * 空の集計データを作成
 */
export function createEmptyAggregation(): Aggregation {
	return {
		totalExpenses: 0,
		userBalances: {},
		remainingSettlements: [],
	};
}

/**
 * userBalancesをディープコピー
 */
function deepCopyUserBalances(userBalances: Aggregation["userBalances"]): {
	[userId: string]: UserBalance;
} {
	const copied: { [userId: string]: UserBalance } = {};

	for (const userId in userBalances) {
		copied[userId] = {
			paid: userBalances[userId].paid,
			owes: userBalances[userId].owes,
			balance: userBalances[userId].balance,
		};
	}

	return copied;
}

/**
 * Expenseの差分を既存のaggregationに適用して新しいaggregationを作成
 * @param multiplier 1で加算、-1で減算
 */
function applyExpenseChange(
	current: Aggregation,
	expense: Pick<ExpenseDocument, "amount" | "payerId" | "participantIds">,
	users: GroupDocument["users"],
	multiplier: 1 | -1,
): Aggregation {
	// 既存のuserBalancesをディープコピー
	const newUserBalances = deepCopyUserBalances(current.userBalances);

	// 支払った人の更新
	if (!newUserBalances[expense.payerId]) {
		newUserBalances[expense.payerId] = {
			paid: 0,
			owes: 0,
			balance: 0,
		};
	}
	newUserBalances[expense.payerId].paid += expense.amount * multiplier;

	// 各参加者の負担額を計算（端数は支払者が負担）
	const participantCount = expense.participantIds.length;
	const baseAmount = Math.floor(expense.amount / participantCount);
	const remainder = expense.amount - baseAmount * participantCount;

	for (const participantId of expense.participantIds) {
		if (!newUserBalances[participantId]) {
			newUserBalances[participantId] = {
				paid: 0,
				owes: 0,
				balance: 0,
			};
		}
		// 支払者の場合は端数を加算
		const amountPerPerson =
			participantId === expense.payerId ? baseAmount + remainder : baseAmount;
		newUserBalances[participantId].owes += amountPerPerson * multiplier;
	}

	// バランスを再計算
	for (const userId in newUserBalances) {
		newUserBalances[userId].balance =
			newUserBalances[userId].paid - newUserBalances[userId].owes;
	}

	return {
		totalExpenses: (current.totalExpenses || 0) + expense.amount * multiplier,
		userBalances: newUserBalances,
		remainingSettlements: calculateTheoreticalSettlements(
			newUserBalances,
			users,
		),
	};
}

/**
 * Expenseの差分を既存のaggregationに加算して新しいaggregationを作成
 */
function applyExpenseAdd(
	current: Aggregation,
	expense: Pick<ExpenseDocument, "amount" | "payerId" | "participantIds">,
	users: GroupDocument["users"],
): Aggregation {
	return applyExpenseChange(current, expense, users, 1);
}

/**
 * Expenseの差分を既存のaggregationから減算して新しいaggregationを作成
 */
function applyExpenseSubtract(
	current: Aggregation,
	expense: Pick<ExpenseDocument, "amount" | "payerId" | "participantIds">,
	users: GroupDocument["users"],
): Aggregation {
	return applyExpenseChange(current, expense, users, -1);
}

/**
 * Settlementの差分を既存のaggregationに適用して新しいaggregationを作成
 * @param multiplier 1で加算、-1で減算
 */
function applySettlementChange(
	current: Aggregation,
	settlement: Pick<SettlementDocument, "amount" | "fromUserId" | "toUserId">,
	users: GroupDocument["users"],
	multiplier: 1 | -1,
): Aggregation {
	// 既存のuserBalancesをディープコピー
	const newUserBalances = deepCopyUserBalances(current.userBalances);

	// fromUserとtoUserの更新
	if (!newUserBalances[settlement.fromUserId]) {
		newUserBalances[settlement.fromUserId] = {
			paid: 0,
			owes: 0,
			balance: 0,
		};
	}
	if (!newUserBalances[settlement.toUserId]) {
		newUserBalances[settlement.toUserId] = {
			paid: 0,
			owes: 0,
			balance: 0,
		};
	}

	// Settlementは支払者と参加者が1人ずつのExpenseと同じ
	// fromUser（支払者）: 支払った額が増える/減る
	newUserBalances[settlement.fromUserId].paid += settlement.amount * multiplier;
	// toUser（参加者）: 負担する額が増える/減る
	newUserBalances[settlement.toUserId].owes += settlement.amount * multiplier;

	// バランスを再計算（全ユーザー）
	for (const userId in newUserBalances) {
		newUserBalances[userId].balance =
			newUserBalances[userId].paid - newUserBalances[userId].owes;
	}

	return {
		totalExpenses: current.totalExpenses || 0, // settlementは総支出に影響しない
		userBalances: newUserBalances,
		remainingSettlements: calculateTheoreticalSettlements(
			newUserBalances,
			users,
		),
	};
}

/**
 * Settlementの差分を既存のaggregationに加算して新しいaggregationを作成
 */
function applySettlementAdd(
	current: Aggregation,
	settlement: Pick<SettlementDocument, "amount" | "fromUserId" | "toUserId">,
	users: GroupDocument["users"],
): Aggregation {
	return applySettlementChange(current, settlement, users, 1);
}

/**
 * Settlementの差分を既存のaggregationから減算して新しいaggregationを作成
 */
function applySettlementSubtract(
	current: Aggregation,
	settlement: Pick<SettlementDocument, "amount" | "fromUserId" | "toUserId">,
	users: GroupDocument["users"],
): Aggregation {
	return applySettlementChange(current, settlement, users, -1);
}

/**
 * 理論的な精算を計算（債権者と債務者をマッチング）
 * userBalancesから直接計算（過去のsettlementは既にbalanceに反映済み）
 */
function calculateTheoreticalSettlements(
	userBalances: NonNullable<Aggregation["userBalances"]>,
	users: GroupDocument["users"],
): Settlement[] {
	const settlements: Settlement[] = [];

	// 債権者（プラス残高）と債務者（マイナス残高）を分離
	const creditors = users
		.filter((user) => (userBalances[user.id]?.balance || 0) > 0)
		.sort(
			(a, b) =>
				(userBalances[b.id]?.balance || 0) - (userBalances[a.id]?.balance || 0),
		);

	const debtors = users
		.filter((user) => (userBalances[user.id]?.balance || 0) < 0)
		.sort(
			(a, b) =>
				(userBalances[a.id]?.balance || 0) - (userBalances[b.id]?.balance || 0),
		);

	// 債権者と債務者のコピーを作成（計算で値を変更するため）
	const remainingCreditors = creditors.map((c) => ({
		userId: c.id,
		balance: userBalances[c.id]?.balance || 0,
	}));

	const remainingDebtors = debtors.map((d) => ({
		userId: d.id,
		balance: userBalances[d.id]?.balance || 0,
	}));

	// 債務者から債権者への精算をマッチング
	for (const debtor of remainingDebtors) {
		let debtAmount = Math.abs(debtor.balance);

		for (const creditor of remainingCreditors) {
			if (debtAmount <= 0 || creditor.balance <= 0) continue;

			const settlementAmount = Math.min(debtAmount, creditor.balance);

			settlements.push({
				fromUserId: debtor.userId,
				toUserId: creditor.userId,
				amount: settlementAmount,
			});

			debtAmount -= settlementAmount;
			creditor.balance -= settlementAmount;
		}
	}

	return settlements;
}

/**
 * Expense追加時のaggregation更新を計算
 */
export function calculateAggregationForAddExpense(
	currentAggregation: Aggregation | undefined,
	expense: Pick<ExpenseDocument, "amount" | "payerId" | "participantIds">,
	users: GroupDocument["users"],
): Aggregation {
	const aggregation = currentAggregation || createEmptyAggregation();
	return applyExpenseAdd(aggregation, expense, users);
}

/**
 * Expense更新時のaggregation更新を計算
 */
export function calculateAggregationForUpdateExpense(
	currentAggregation: Aggregation | undefined,
	oldExpense: Pick<ExpenseDocument, "amount" | "payerId" | "participantIds">,
	newExpense: Pick<ExpenseDocument, "amount" | "payerId" | "participantIds">,
	users: GroupDocument["users"],
): Aggregation {
	const aggregation = currentAggregation || createEmptyAggregation();
	const afterSubtract = applyExpenseSubtract(aggregation, oldExpense, users);
	return applyExpenseAdd(afterSubtract, newExpense, users);
}

/**
 * Expense削除時のaggregation更新を計算
 */
export function calculateAggregationForDeleteExpense(
	currentAggregation: Aggregation | undefined,
	expense: Pick<ExpenseDocument, "amount" | "payerId" | "participantIds">,
	users: GroupDocument["users"],
): Aggregation {
	const aggregation = currentAggregation || createEmptyAggregation();
	return applyExpenseSubtract(aggregation, expense, users);
}

/**
 * Settlement追加時のaggregation更新を計算
 */
export function calculateAggregationForAddSettlement(
	currentAggregation: Aggregation | undefined,
	settlement: Pick<SettlementDocument, "amount" | "fromUserId" | "toUserId">,
	users: GroupDocument["users"],
): Aggregation {
	const aggregation = currentAggregation || createEmptyAggregation();
	return applySettlementAdd(aggregation, settlement, users);
}

/**
 * Settlement削除時のaggregation更新を計算
 */
export function calculateAggregationForDeleteSettlement(
	currentAggregation: Aggregation | undefined,
	settlement: Pick<SettlementDocument, "amount" | "fromUserId" | "toUserId">,
	users: GroupDocument["users"],
): Aggregation {
	const aggregation = currentAggregation || createEmptyAggregation();
	return applySettlementSubtract(aggregation, settlement, users);
}
