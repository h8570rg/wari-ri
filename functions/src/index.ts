import { setGlobalOptions } from "firebase-functions";
import { onDocumentWritten } from "firebase-functions/v2/firestore";
import * as admin from "firebase-admin";
import * as logger from "firebase-functions/logger";

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

// 集計計算のヘルパー関数
function calculateAggregation(
  users: Array<{ id: string; name: string }>,
  activityDocs: admin.firestore.QueryDocumentSnapshot[],
): GroupAggregation {
  const activities: ActivityData[] = activityDocs.map(
    (doc) => doc.data() as ActivityData,
  );

  // 建て替え記録のみを取得
  const expenses = activities.filter((activity) => activity.type === "expense");

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

  return {
    totalExpenses,
    userBalances,
  };
}
