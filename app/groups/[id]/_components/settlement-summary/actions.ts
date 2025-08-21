"use server";

import { createSettlement as _createSettlement } from "@/lib/data/group";

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

  // リアルタイムリスナーが自動的に更新を検知するため、revalidatePathは不要
}
