"use server";

import { redirect } from "next/navigation";
import { createExpense as _createExpense } from "@/lib/data";

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
  await _createExpense({
    groupId,
    payerId,
    amount,
    description,
    participantIds,
  });

  redirect(`/groups/${groupId}`);
}
