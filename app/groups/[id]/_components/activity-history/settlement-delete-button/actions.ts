"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { deleteSettlement as _deleteSettlement } from "@/lib/data/settlement";

export async function deleteSettlement({
	groupId,
	settlementId,
}: {
	groupId: string;
	settlementId: string;
}) {
	await _deleteSettlement(groupId, settlementId);

	revalidatePath(`/groups/${groupId}`);
	redirect(`/groups/${groupId}`);
}
