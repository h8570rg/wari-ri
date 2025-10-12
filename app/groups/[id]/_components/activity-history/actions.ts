"use server";

import { getActivities } from "@/lib/data/activity";

export async function getAllActivities(groupId: string) {
	return await getActivities(groupId);
}
