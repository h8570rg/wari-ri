import {
  addDocument,
  BaseDocument,
  getAllDocuments,
  getDocument,
} from "./firestore";

const groupCollectionName = "groups";

export type GroupDocument = BaseDocument & {
  name: string;
  userNames: string[];
};

export async function createGroup(name: string, userNames: string[]) {
  return addDocument<GroupDocument>(groupCollectionName, {
    name,
    userNames,
  });
}

export async function getAllGroups() {
  return getAllDocuments<GroupDocument>(groupCollectionName);
}

export async function getGroup(groupId: string) {
  return getDocument<GroupDocument>(groupCollectionName, groupId);
}
