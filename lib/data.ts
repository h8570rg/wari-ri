import {
  addDocument,
  BaseDocument,
  getAllDocuments,
  getDocument,
} from "./firestore";

const groupCollectionName = "groups";

export type GroupDocument = BaseDocument;

export async function createGroup() {
  return addDocument<GroupDocument>(groupCollectionName, {});
}

export async function getAllGroups() {
  return getAllDocuments<GroupDocument>(groupCollectionName);
}

export async function getGroup(groupId: string) {
  return getDocument<GroupDocument>(groupCollectionName, groupId);
}
