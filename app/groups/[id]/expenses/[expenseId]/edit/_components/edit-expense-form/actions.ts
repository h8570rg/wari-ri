"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
	deleteExpense as _deleteExpense,
	updateExpense as _updateExpense,
} from "@/lib/data/expense";

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

	revalidatePath(`/groups/${groupId}`);
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

	revalidatePath(`/groups/${groupId}`);
	redirect(`/groups/${groupId}`);
}
