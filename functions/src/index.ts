import * as admin from "firebase-admin";
import { setGlobalOptions } from "firebase-functions";
import * as logger from "firebase-functions/logger";
import { onDocumentWritten } from "firebase-functions/v2/firestore";

// Firebase Admin初期化
admin.initializeApp();

// グローバル設定
setGlobalOptions({
	maxInstances: 10,
	region: "asia-northeast1",
});

// 型定義
interface UserBalance {
	paid: number;
	owes: number;
	balance: number;
}

interface GroupAggregation {
	totalExpenses: number;
	userBalances: { [userId: string]: UserBalance };
	remainingSettlements: {
		fromUserId: string;
		toUserId: string;
		amount: number;
	}[];
}

interface ActivityData {
	type: "expense" | "settlement";
	amount: number;
	payerId?: string;
	description?: string;
	participantIds?: string[];
	fromUserId?: string;
	toUserId?: string;
	createdAt?: admin.firestore.Timestamp;
	updatedAt?: admin.firestore.Timestamp;
	id?: string;
}

// activitiesコレクションの変更を監視して集計を更新
export const updateGroupAggregation = onDocumentWritten(
	"groups/{groupId}/activities/{activityId}",
	async (event) => {
		const groupId = event.params.groupId;
		const db = admin.firestore();

		try {
			logger.info(`Updating aggregation for group ${groupId}`);

			// グループ情報と全アクティビティを取得
			const [groupDoc, activitiesSnapshot] = await Promise.all([
				db.collection("groups").doc(groupId).get(),
				db.collection("groups").doc(groupId).collection("activities").get(),
			]);

			if (!groupDoc.exists) {
				logger.error(`Group ${groupId} not found`);
				return;
			}

			const groupData = groupDoc.data();
			const users = groupData?.users || [];

			// 集計計算
			const aggregation = calculateAggregation(users, activitiesSnapshot.docs);

			// 集計結果をgroupドキュメントに保存
			await db
				.collection("groups")
				.doc(groupId)
				.update({
					aggregation: {
						...aggregation,
						lastCalculatedAt: admin.firestore.FieldValue.serverTimestamp(),
					},
					updatedAt: admin.firestore.FieldValue.serverTimestamp(),
				});

			logger.info(`Successfully updated aggregation for group ${groupId}`);
		} catch (error) {
			logger.error("Error updating aggregation:", error);
			throw error;
		}
	},
);

// 残りの精算必要額を計算するヘルパー関数
function calculateRemainingSettlements(
	userBalances: { [userId: string]: UserBalance },
	completedSettlements: ActivityData[],
	users: Array<{ id: string; name: string }>,
): {
	fromUserId: string;
	toUserId: string;
	amount: number;
}[] {
	// 理論的な精算計算（債権者と債務者をマッチング）
	const calculateTheoreticalSettlements = (): {
		fromUserId: string;
		toUserId: string;
		amount: number;
	}[] => {
		const settlements: {
			fromUserId: string;
			toUserId: string;
			amount: number;
		}[] = [];

		const creditors = users
			.filter((user) => (userBalances[user.id]?.balance || 0) > 0.01)
			.sort(
				(a, b) =>
					(userBalances[b.id]?.balance || 0) -
					(userBalances[a.id]?.balance || 0),
			);

		const debtors = users
			.filter((user) => (userBalances[user.id]?.balance || 0) < -0.01)
			.sort(
				(a, b) =>
					(userBalances[a.id]?.balance || 0) -
					(userBalances[b.id]?.balance || 0),
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

		for (const debtor of remainingDebtors) {
			let debtAmount = Math.abs(debtor.balance);

			for (const creditor of remainingCreditors) {
				if (debtAmount <= 0.01 || creditor.balance <= 0.01) continue;

				const settlementAmount = Math.min(debtAmount, creditor.balance);

				settlements.push({
					fromUserId: debtor.userId,
					toUserId: creditor.userId,
					amount: Math.round(settlementAmount),
				});

				debtAmount -= settlementAmount;
				creditor.balance -= settlementAmount;
			}
		}

		return settlements;
	};

	const theoreticalSettlements = calculateTheoreticalSettlements();

	// 完了済み精算額を計算する関数
	const getCompletedAmount = (settlement: {
		fromUserId: string;
		toUserId: string;
		amount: number;
	}): number => {
		return completedSettlements
			.filter(
				(completed) =>
					completed.fromUserId === settlement.fromUserId &&
					completed.toUserId === settlement.toUserId,
			)
			.reduce((sum, completed) => sum + completed.amount, 0);
	};

	// 残りの精算必要額を計算
	return theoreticalSettlements
		.map((settlement) => {
			const completedAmount = getCompletedAmount(settlement);
			const remainingAmount = Math.max(0, settlement.amount - completedAmount);
			return {
				...settlement,
				amount: remainingAmount,
			};
		})
		.filter((settlement) => settlement.amount > 0);
}

// 集計計算のヘルパー関数
function calculateAggregation(
	users: Array<{ id: string; name: string }>,
	activityDocs: admin.firestore.QueryDocumentSnapshot[],
): GroupAggregation {
	const activities: ActivityData[] = activityDocs.map(
		(doc) => doc.data() as ActivityData,
	);

	// 建て替え記録と精算記録を分離
	const expenses = activities.filter((activity) => activity.type === "expense");
	const settlements = activities.filter(
		(activity) => activity.type === "settlement",
	);

	// 各ユーザーの収支を計算
	const userBalances: { [userId: string]: UserBalance } = {};

	users.forEach((user) => {
		// このユーザーが支払った総額
		const paid = expenses
			.filter((expense) => expense.payerId === user.id)
			.reduce((sum, expense) => sum + expense.amount, 0);

		// このユーザーが負担すべき総額
		const owes = expenses
			.filter((expense) => expense.participantIds?.includes(user.id))
			.reduce((sum, expense) => {
				const participantCount = expense.participantIds?.length || 1;
				return sum + expense.amount / participantCount;
			}, 0);

		const balance = paid - owes;

		userBalances[user.id] = {
			paid,
			owes,
			balance,
		};
	});

	// 総支出額を計算
	const totalExpenses = expenses.reduce(
		(sum, expense) => sum + expense.amount,
		0,
	);

	// 精算進捗を考慮した残りの精算必要額を計算
	const remainingSettlements = calculateRemainingSettlements(
		userBalances,
		settlements,
		users,
	);

	return {
		totalExpenses,
		userBalances,
		remainingSettlements,
	};
}
