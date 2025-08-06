const RECENT_GROUPS_KEY = "recent-groups";
const MAX_RECENT_GROUPS = 5;

export function getRecentGroupIds(): string[] {
  if (typeof window === "undefined") {
    return [];
  }

  const stored = localStorage.getItem(RECENT_GROUPS_KEY);
  if (!stored) {
    return [];
  }

  const groupIds: string[] = JSON.parse(stored);
  return groupIds;
}

export function addRecentGroupId(groupId: string): void {
  if (typeof window === "undefined") {
    return;
  }

  const currentGroupIds = getRecentGroupIds();

  // 既存の同じIDを除去
  const filteredGroupIds = currentGroupIds.filter((id) => id !== groupId);

  // 新しいIDを先頭に追加
  const updatedGroupIds = [groupId, ...filteredGroupIds];

  // 最大数で制限
  const limitedGroupIds = updatedGroupIds.slice(0, MAX_RECENT_GROUPS);

  localStorage.setItem(RECENT_GROUPS_KEY, JSON.stringify(limitedGroupIds));
}

export function removeRecentGroupId(groupId: string): void {
  if (typeof window === "undefined") {
    return;
  }

  const currentGroupIds = getRecentGroupIds();
  const filteredGroupIds = currentGroupIds.filter((id) => id !== groupId);
  localStorage.setItem(RECENT_GROUPS_KEY, JSON.stringify(filteredGroupIds));
}

export function clearRecentGroups(): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(RECENT_GROUPS_KEY);
}
