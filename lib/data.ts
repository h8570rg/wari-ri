import { notFound } from "next/navigation";
import {
  addDocument,
  addSubcollectionDocument,
  BaseDocument,
  getAllDocuments,
  getAllSubcollectionDocuments,
  getDocument,
  getSubcollectionDocument,
  updateSubcollectionDocument,
  deleteSubcollectionDocument,
  updateDocument,
} from "./firestore";
const groupCollectionName = "groups";
const expenseSubcollectionName = "expenses";

export type GroupDocument = BaseDocument & {
  name: string;
  users: { id: string; name: string }[];
};

export type ExpenseDocument = BaseDocument & {
  payerId: string;
  amount: number;
  description: string;
  participantIds: string[];
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
  return addSubcollectionDocument<ExpenseDocument>(
    groupCollectionName,
    groupId,
    expenseSubcollectionName,
    {
      payerId,
      amount,
      description,
      participantIds,
    },
  );
}

export async function getExpensesByGroup(groupId: string) {
  return getAllSubcollectionDocuments<ExpenseDocument>(
    groupCollectionName,
    groupId,
    expenseSubcollectionName,
  );
}

export async function getExpense(groupId: string, expenseId: string) {
  const data = await getSubcollectionDocument<ExpenseDocument>(
    groupCollectionName,
    groupId,
    expenseSubcollectionName,
    expenseId,
  );
  if (!data) {
    notFound();
  }
  return data;
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
  return updateSubcollectionDocument<ExpenseDocument>(
    groupCollectionName,
    groupId,
    expenseSubcollectionName,
    expenseId,
    {
      payerId,
      amount,
      description,
      participantIds,
    },
  );
}

export async function deleteExpense(groupId: string, expenseId: string) {
  return deleteSubcollectionDocument(
    groupCollectionName,
    groupId,
    expenseSubcollectionName,
    expenseId,
  );
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
