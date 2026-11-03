"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
	createResult as _createResult,
	type ResultEntry,
} from "@/lib/data/result";

export async function createResult({
	groupId,
	description,
	entries,
}: {
	groupId: string;
	description: string;
	entries: ResultEntry[];
}) {
	await _createResult({
		groupId,
		description,
		entries,
	});

	revalidatePath(`/groups/${groupId}`);
	redirect(`/groups/${groupId}`);
}
