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
 * Expenseの差分を既存のaggregationに加算して新しいaggregationを作成
 */
function applyExpenseAdd(
	current: Aggregation,
	expense: Pick<ExpenseDocument, "amount" | "payerId" | "participantIds">,
	users: GroupDocument["users"],
): Aggregation {
	const newUserBalances: { [userId: string]: UserBalance } = {};

	// 既存のuserBalancesをディープコピー
	for (const userId in current.userBalances) {
		newUserBalances[userId] = {
			paid: current.userBalances[userId].paid,
			owes: current.userBalances[userId].owes,
			balance: current.userBalances[userId].balance,
		};
	}

	// 支払った人の更新
	if (!newUserBalances[expense.payerId]) {
		newUserBalances[expense.payerId] = {
			paid: 0,
			owes: 0,
			balance: 0,
		};
	}
	newUserBalances[expense.payerId].paid += expense.amount;

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
		newUserBalances[participantId].owes += amountPerPerson;
	}

	// バランスを再計算
	for (const userId in newUserBalances) {
		newUserBalances[userId].balance =
			newUserBalances[userId].paid - newUserBalances[userId].owes;
	}

	return {
		totalExpenses: (current.totalExpenses || 0) + expense.amount,
		userBalances: newUserBalances,
		remainingSettlements: calculateTheoreticalSettlements(
			newUserBalances,
			users,
		),
	};
}

/**
 * Expenseの差分を既存のaggregationから減算して新しいaggregationを作成
 */
function applyExpenseSubtract(
	current: Aggregation,
	expense: Pick<ExpenseDocument, "amount" | "payerId" | "participantIds">,
	users: GroupDocument["users"],
): Aggregation {
	const newUserBalances: { [userId: string]: UserBalance } = {};

	// 既存のuserBalancesをディープコピー
	for (const userId in current.userBalances) {
		newUserBalances[userId] = {
			paid: current.userBalances[userId].paid,
			owes: current.userBalances[userId].owes,
			balance: current.userBalances[userId].balance,
		};
	}

	// 支払った人の更新
	if (!newUserBalances[expense.payerId]) {
		newUserBalances[expense.payerId] = {
			paid: 0,
			owes: 0,
			balance: 0,
		};
	}
	newUserBalances[expense.payerId].paid -= expense.amount;

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
		newUserBalances[participantId].owes -= amountPerPerson;
	}

	// バランスを再計算
	for (const userId in newUserBalances) {
		newUserBalances[userId].balance =
			newUserBalances[userId].paid - newUserBalances[userId].owes;
	}

	return {
		totalExpenses: (current.totalExpenses || 0) - expense.amount,
		userBalances: newUserBalances,
		remainingSettlements: calculateTheoreticalSettlements(
			newUserBalances,
			users,
		),
	};
}

/**
 * Settlementを既存のaggregationに適用して新しいaggregationを作成
 */
function applySettlement(
	current: Aggregation,
	settlement: Pick<SettlementDocument, "amount" | "fromUserId" | "toUserId">,
	users: GroupDocument["users"],
): Aggregation {
	const newUserBalances: { [userId: string]: UserBalance } = {};

	// 既存のuserBalancesをディープコピー
	for (const userId in current.userBalances) {
		newUserBalances[userId] = {
			paid: current.userBalances[userId].paid,
			owes: current.userBalances[userId].owes,
			balance: current.userBalances[userId].balance,
		};
	}

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
	// fromUser（支払者）: 支払った額が増える
	newUserBalances[settlement.fromUserId].paid += settlement.amount;
	// toUser（参加者）: 負担する額が増える
	newUserBalances[settlement.toUserId].owes += settlement.amount;

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
	return applySettlement(aggregation, settlement, users);
}
