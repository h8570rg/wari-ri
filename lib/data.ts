import {
  addDocument,
  BaseDocument,
  getAllDocuments,
  getDocument,
} from "./firestore";

const groupCollectionName = "groups";

export type GroupDocument = BaseDocument & {
  name: string;
  users: { id: string; name: string }[];
};

export async function createGroup(name: string, userNames: string[]) {
  const users = userNames.map((userName) => ({
    id: crypto.randomUUID(),
    name: userName,
  }));

  return addDocument<GroupDocument>(groupCollectionName, {
    name,
    users,
  });
}

export async function getAllGroups() {
  return getAllDocuments<GroupDocument>(groupCollectionName);
}

export async function getGroup(groupId: string) {
  return getDocument<GroupDocument>(groupCollectionName, groupId);
}
