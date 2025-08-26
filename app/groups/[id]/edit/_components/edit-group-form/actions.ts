"use server";

import { redirect } from "next/navigation";
import { updateGroup as _updateGroup } from "@/lib/data/group";

export async function updateGroup({
	groupId,
	name,
	users,
}: {
	groupId: string;
	name: string;
	users: { id: string; name: string }[];
}) {
	await _updateGroup({
		groupId,
		name,
		users,
	});

	redirect(`/groups/${groupId}`);
}
