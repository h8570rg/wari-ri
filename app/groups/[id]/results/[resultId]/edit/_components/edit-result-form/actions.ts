"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
	deleteResult as _deleteResult,
	updateResult as _updateResult,
	type ResultEntry,
} from "@/lib/data/result";

export async function updateResult({
	groupId,
	resultId,
	description,
	entries,
}: {
	groupId: string;
	resultId: string;
	description: string;
	entries: ResultEntry[];
}) {
	await _updateResult({
		groupId,
		resultId,
		description,
		entries,
	});

	revalidatePath(`/groups/${groupId}`);
	redirect(`/groups/${groupId}`);
}

export async function deleteResult({
	groupId,
	resultId,
}: {
	groupId: string;
	resultId: string;
}) {
	await _deleteResult(groupId, resultId);

	revalidatePath(`/groups/${groupId}`);
	redirect(`/groups/${groupId}`);
}
