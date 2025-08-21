const RECENT_GROUPS_KEY = "recent-groups";
const MAX_RECENT_GROUPS = 5;

export type RecentGroup = {
  id: string;
  name: string;
  lastViewed: string; // ISO string
};

export function getRecentGroups(): RecentGroup[] {
  if (typeof window === "undefined") {
    return [];
  }

  const stored = localStorage.getItem(RECENT_GROUPS_KEY);
  if (!stored) {
    return [];
  }

  const groups: RecentGroup[] = JSON.parse(stored);
  return groups;
}

export function addRecentGroup(groupId: string, groupName: string): void {
  if (typeof window === "undefined") {
    return;
  }

  const currentGroups = getRecentGroups();
  const now = new Date().toISOString();

  // 既存の同じIDを除去
  const filteredGroups = currentGroups.filter((group) => group.id !== groupId);

  // 新しいグループを先頭に追加
  const newGroup: RecentGroup = {
    id: groupId,
    name: groupName,
    lastViewed: now,
  };
  const updatedGroups = [newGroup, ...filteredGroups];

  // 最大数で制限
  const limitedGroups = updatedGroups.slice(0, MAX_RECENT_GROUPS);

  localStorage.setItem(RECENT_GROUPS_KEY, JSON.stringify(limitedGroups));
}

export function updateRecentGroup(groupId: string, groupName: string): void {
  if (typeof window === "undefined") {
    return;
  }

  const currentGroups = getRecentGroups();
  const groupIndex = currentGroups.findIndex((group) => group.id === groupId);

  if (groupIndex === -1) {
    // グループが存在しない場合は追加
    addRecentGroup(groupId, groupName);
    return;
  }

  // 既存のグループの名前を更新
  const updatedGroups = [...currentGroups];
  updatedGroups[groupIndex] = {
    ...updatedGroups[groupIndex],
    name: groupName,
  };

  localStorage.setItem(RECENT_GROUPS_KEY, JSON.stringify(updatedGroups));
}

export function removeRecentGroup(groupId: string): void {
  if (typeof window === "undefined") {
    return;
  }

  const currentGroups = getRecentGroups();
  const filteredGroups = currentGroups.filter((group) => group.id !== groupId);
  localStorage.setItem(RECENT_GROUPS_KEY, JSON.stringify(filteredGroups));
}
