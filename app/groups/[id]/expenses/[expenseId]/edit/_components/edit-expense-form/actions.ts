"use server";

import { redirect } from "next/navigation";
import {
  updateExpense as _updateExpense,
  deleteExpense as _deleteExpense,
} from "@/lib/data";

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
  await _updateExpense({
    groupId,
    expenseId,
    payerId,
    amount,
    description,
    participantIds,
  });

  redirect(`/groups/${groupId}`);
}

export async function deleteExpense({
  groupId,
  expenseId,
}: {
  groupId: string;
  expenseId: string;
}) {
  await _deleteExpense(groupId, expenseId);

  redirect(`/groups/${groupId}`);
}
