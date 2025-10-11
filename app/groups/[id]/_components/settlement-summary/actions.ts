"use server";

import { revalidatePath } from "next/cache";
import { createSettlement as _createSettlement } from "@/lib/data/settlement";

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
	await _createSettlement({
		groupId,
		fromUserId,
		toUserId,
		amount,
	});

	revalidatePath(`/groups/${groupId}`);
}
