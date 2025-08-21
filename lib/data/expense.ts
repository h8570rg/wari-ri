import {
  SnapshotOptions,
  QueryDocumentSnapshot,
  WithFieldValue,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { groupCollectionName } from "./group";
import { BaseDocument } from ".";
import { createActivity, deleteActivity, updateActivity } from "./activity";

const activitySubcollectionName = "activities";

export type ExpenseDocument = BaseDocument & {
  type: "expense";
  amount: number;
  payerId: string;
  description: string;
  participantIds: string[];
};

const expenseConverter = {
  toFirestore(value: WithFieldValue<ExpenseDocument>) {
    return value;
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions) {
    const data = snapshot.data(options);
    return {
      ...data,
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt.toDate(),
    } as ExpenseDocument;
  },
};

export async function createExpense({
  groupId,
  amount,
  payerId,
  description,
  participantIds,
}: {
  groupId: string;
  amount: number;
  payerId: string;
  description: string;
  participantIds: string[];
}) {
  return createActivity(groupId, {
    type: "expense",
    amount,
    payerId,
    description,
    participantIds,
  });
}

export async function getExpense(groupId: string, expenseId: string) {
  const docRef = doc(
    db,
    groupCollectionName,
    groupId,
    activitySubcollectionName,
    expenseId,
  ).withConverter(expenseConverter);
  const docSnap = await getDoc(docRef);
  const data = docSnap.data();
  if (!data) {
    throw new Error("Expense not found");
  }
  return data;
}

export async function updateExpense({
  groupId,
  expenseId,
  amount,
  payerId,
  description,
  participantIds,
}: {
  groupId: string;
  expenseId: string;
  amount: number;
  payerId: string;
  description: string;
  participantIds: string[];
}) {
  return updateActivity(groupId, expenseId, {
    type: "expense",
    amount,
    payerId,
    description,
    participantIds,
  });
}

export async function deleteExpense(groupId: string, expenseId: string) {
  await deleteActivity(groupId, expenseId);
}
