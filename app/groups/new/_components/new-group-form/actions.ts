"use server";

import { redirect } from "next/navigation";
import { createGroup as _createGroup } from "@/lib/data/group";

export async function createGroup({
  name,
  userNames,
}: {
  name: string;
  userNames: string[];
}) {
  const groupId = await _createGroup({ name, userNames });

  redirect(`/groups/${groupId}`);
}
