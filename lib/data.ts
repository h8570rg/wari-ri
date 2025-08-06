import { notFound } from "next/navigation";
import {
  addDocument,
  addSubcollectionDocument,
  BaseDocument,
  getAllDocuments,
  getAllSubcollectionDocuments,
  getDocument,
  updateSubcollectionDocument,
  deleteSubcollectionDocument,
  updateDocument,
} from "./firestore";
const groupCollectionName = "groups";
const activitySubcollectionName = "activities";

export type GroupDocument = BaseDocument & {
  name: string;
  users: { id: string; name: string }[];
  aggregation?: {
    totalExpenses: number;
    userBalances: {
      [userId: string]: {
        paid: number;
        owes: number;
        balance: number;
      };
    };
    lastCalculatedAt: Date;
  };
};

export async function createGroup(name: string, userNames: string[]) {
  const users = userNames.map((userName) => ({
    id: crypto.randomUUID(),
    name: userName,
  }));

  return addDocument<GroupDocument>(groupCollectionName, {
    name,
    users,
  });
}

export async function getAllGroups() {
  return getAllDocuments<GroupDocument>(groupCollectionName);
}

export async function getGroup(groupId: string) {
  const data = await getDocument<GroupDocument>(groupCollectionName, groupId);
  if (!data) {
    notFound();
  }
  return data;
}

// 建て替え記録用のヘルパー関数（activitiesコレクション使用）
export async function createExpense({
  groupId,
  payerId,
  amount,
  description,
  participantIds,
}: {
  groupId: string;
  payerId: string;
  amount: number;
  description: string;
  participantIds: string[];
}) {
  return createActivity(groupId, {
    type: "expense",
    payerId,
    amount,
    description,
    participantIds,
  });
}

export async function getExpensesByGroup(groupId: string) {
  const activities = await getActivitiesByGroup(groupId);
  return activities
    .filter(
      (activity): activity is ActivityDocument & { type: "expense" } =>
        activity.type === "expense",
    )
    .map((activity) => ({
      id: activity.id,
      createdAt: activity.createdAt,
      updatedAt: activity.updatedAt,
      payerId: activity.payerId,
      amount: activity.amount,
      description: activity.description,
      participantIds: activity.participantIds,
    }));
}

export async function getExpense(groupId: string, expenseId: string) {
  const activities = await getActivitiesByGroup(groupId);
  const expense = activities.find(
    (activity) => activity.id === expenseId && activity.type === "expense",
  );

  if (!expense || expense.type !== "expense") {
    notFound();
  }

  return {
    id: expense.id,
    createdAt: expense.createdAt,
    updatedAt: expense.updatedAt,
    payerId: expense.payerId,
    amount: expense.amount,
    description: expense.description,
    participantIds: expense.participantIds,
  };
}

export async function updateExpense({
  groupId,
  expenseId,
  payerId,
  amount,
  description,
  participantIds,
}: {
  groupId: string;
  expenseId: string;
  payerId: string;
  amount: number;
  description: string;
  participantIds: string[];
}) {
  return updateActivity({
    groupId,
    activityId: expenseId,
    type: "expense",
    payerId,
    amount,
    description,
    participantIds,
  });
}

export async function deleteExpense(groupId: string, expenseId: string) {
  return deleteActivity(groupId, expenseId);
}

export async function updateGroup({
  groupId,
  name,
  userNames,
}: {
  groupId: string;
  name: string;
  userNames: string[];
}) {
  const users = userNames.map((userName, index) => ({
    id: `user-${index}`,
    name: userName,
  }));

  return updateDocument<GroupDocument>(groupCollectionName, groupId, {
    name,
    users,
  });
}

// 精算記録用のヘルパー関数（activitiesコレクション使用）
export async function getSettlementsByGroup(groupId: string) {
  const activities = await getActivitiesByGroup(groupId);
  return activities
    .filter(
      (activity): activity is ActivityDocument & { type: "settlement" } =>
        activity.type === "settlement",
    )
    .map((activity) => ({
      id: activity.id,
      createdAt: activity.createdAt,
      updatedAt: activity.updatedAt,
      fromUserId: activity.fromUserId,
      toUserId: activity.toUserId,
      amount: activity.amount,
    }));
}

export async function createSettlement({
  groupId,
  fromUserId,
  toUserId,
  amount,
}: {
  groupId: string;
  fromUserId: string;
  toUserId: string;
  amount: number;
}) {
  return createActivity(groupId, {
    type: "settlement",
    fromUserId,
    toUserId,
    amount,
  });
}

export type ActivityItem = {
  id: string;
  type: "expense" | "settlement";
  createdAt: Date;
  updatedAt: Date;
} & (
  | {
      type: "expense";
      payerId: string;
      amount: number;
      description: string;
      participantIds: string[];
    }
  | {
      type: "settlement";
      fromUserId: string;
      toUserId: string;
      amount: number;
    }
);

export async function getActivityHistory(
  groupId: string,
): Promise<ActivityItem[]> {
  const activities = await getActivitiesByGroup(groupId);

  const activityItems: ActivityItem[] = activities.map(
    (activity): ActivityItem => {
      if (activity.type === "expense") {
        return {
          id: activity.id,
          type: "expense" as const,
          createdAt: activity.createdAt,
          updatedAt: activity.updatedAt,
          amount: activity.amount,
          payerId: activity.payerId,
          description: activity.description,
          participantIds: activity.participantIds,
        };
      } else {
        return {
          id: activity.id,
          type: "settlement" as const,
          createdAt: activity.createdAt,
          updatedAt: activity.updatedAt,
          amount: activity.amount,
          fromUserId: activity.fromUserId,
          toUserId: activity.toUserId,
        };
      }
    },
  );

  // 時系列順（新しい順）にソート
  return activityItems.sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
  );
}

// Activities統合コレクション用の型定義
export type ActivityDocument = BaseDocument & {
  type: "expense" | "settlement";
  amount: number;
} & (
    | {
        type: "expense";
        payerId: string;
        description: string;
        participantIds: string[];
      }
    | {
        type: "settlement";
        fromUserId: string;
        toUserId: string;
      }
  );

// ExpenseDocument型（編集フォーム用）
export type ExpenseDocument = BaseDocument & {
  payerId: string;
  amount: number;
  description: string;
  participantIds: string[];
};

// Activities統合API

export async function createActivity(
  groupId: string,
  activity: Omit<ActivityDocument, "id" | "createdAt" | "updatedAt">,
) {
  return addSubcollectionDocument<ActivityDocument>(
    groupCollectionName,
    groupId,
    activitySubcollectionName,
    activity,
  );
}

export async function getActivitiesByGroup(groupId: string) {
  return getAllSubcollectionDocuments<ActivityDocument>(
    groupCollectionName,
    groupId,
    activitySubcollectionName,
  );
}

export async function updateActivity({
  groupId,
  activityId,
  ...updateData
}: {
  groupId: string;
  activityId: string;
} & Partial<Omit<ActivityDocument, "id" | "createdAt">>) {
  return updateSubcollectionDocument<ActivityDocument>(
    groupCollectionName,
    groupId,
    activitySubcollectionName,
    activityId,
    updateData,
  );
}

export async function deleteActivity(groupId: string, activityId: string) {
  return deleteSubcollectionDocument(
    groupCollectionName,
    groupId,
    activitySubcollectionName,
    activityId,
  );
}
