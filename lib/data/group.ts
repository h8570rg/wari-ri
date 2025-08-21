import {
  SnapshotOptions,
  QueryDocumentSnapshot,
  WithFieldValue,
  setDoc,
  collection,
  serverTimestamp,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase";
import { BaseDocument } from ".";

export const groupCollectionName = "groups";

export type GroupDocument = BaseDocument & {
  name: string;
  users: { id: string; name: string }[];
  aggregation?: {
    totalExpenses?: number;
    userBalances?: {
      [userId: string]: {
        paid: number;
        owes: number;
        balance: number;
      };
    };
    remainingSettlements?: {
      fromUserId: string;
      toUserId: string;
      amount: number;
    }[];
    lastCalculatedAt?: Date;
  };
};

const groupConverter = {
  toFirestore(value: WithFieldValue<GroupDocument>) {
    return value;
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions) {
    const data = snapshot.data(options);
    return {
      ...data,
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt.toDate(),
      aggregation: {
        ...data.aggregation,
        lastCalculatedAt: data.aggregation?.lastCalculatedAt.toDate(),
      },
    } as GroupDocument;
  },
};

export async function createGroup({
  name,
  userNames,
}: {
  name: string;
  userNames: string[];
}) {
  const users = userNames.map((userName) => ({
    id: crypto.randomUUID(),
    name: userName,
  }));
  const newDocRef = doc(collection(db, groupCollectionName));
  await setDoc(newDocRef, {
    name,
    users,
    id: newDocRef.id,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return newDocRef.id;
}

export async function getGroup(groupId: string) {
  const docRef = doc(db, groupCollectionName, groupId).withConverter(
    groupConverter,
  );
  const docSnap = await getDoc(docRef);
  const data = docSnap.data();
  if (!data) {
    throw new Error("Group not found");
  }
  return data;
}

export function subscribeToGroup(
  groupId: string,
  callback: (group: GroupDocument) => void,
) {
  const docRef = doc(db, groupCollectionName, groupId).withConverter(
    groupConverter,
  );
  const unsubscribe = onSnapshot(docRef, (doc) => {
    if (!doc.exists()) {
      throw new Error("Group not found");
    }
    callback(doc.data());
  });
  return unsubscribe;
}

export async function updateGroup({
  groupId,
  name,
  users,
}: {
  groupId: string;
  name: string;
  users: { id: string; name: string }[];
}) {
  await updateDoc(
    doc(db, groupCollectionName, groupId).withConverter(groupConverter),
    {
      name,
      users,
    },
  );
}

export async function deleteGroup(groupId: string) {
  await deleteDoc(
    doc(db, groupCollectionName, groupId).withConverter(groupConverter),
  );
}

// 精算記録を作成する関数
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
  const { createActivity } = await import("./activity");
  return createActivity(groupId, {
    type: "settlement",
    fromUserId,
    toUserId,
    amount,
  });
}
