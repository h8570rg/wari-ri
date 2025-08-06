"use server";

import { redirect } from "next/navigation";
import { updateGroup as _updateGroup } from "@/lib/data";

export async function updateGroup({
  groupId,
  name,
  userNames,
}: {
  groupId: string;
  name: string;
  userNames: string[];
}) {
  await _updateGroup({
    groupId,
    name,
    userNames,
  });

  redirect(`/groups/${groupId}`);
}
