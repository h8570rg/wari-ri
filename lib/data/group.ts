import {
	collection,
	deleteDoc,
	doc,
	getDoc,
	type QueryDocumentSnapshot,
	type SnapshotOptions,
	serverTimestamp,
	setDoc,
	updateDoc,
	type WithFieldValue,
} from "firebase/firestore";
import { db } from "../firebase";
import type { BaseDocument } from ".";

export const groupCollectionName = "groups";

export type UserBalance = {
	paid: number;
	owes: number;
	balance: number;
};

export type Settlement = {
	fromUserId: string;
	toUserId: string;
	amount: number;
};

export type Aggregation = {
	totalExpenses?: number;
	userBalances?: {
		[userId: string]: UserBalance;
	};
	remainingSettlements?: Settlement[];
	lastCalculatedAt?: Date;
};

export type GroupDocument = BaseDocument & {
	name: string;
	users: { id: string; name: string }[];
	aggregation?: Aggregation;
};

export const groupConverter = {
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
	const docRef = getGroupDocRef(groupId);
	const docSnap = await getDoc(docRef);
	const data = docSnap.data();
	if (!data) {
		throw new Error("Group not found");
	}
	return data;
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
	await updateDoc(getGroupDocRef(groupId), {
		name,
		users,
	});
}

export async function deleteGroup(groupId: string) {
	await deleteDoc(getGroupDocRef(groupId));
}

export function getGroupDocRef(groupId: string) {
	return doc(db, groupCollectionName, groupId).withConverter(groupConverter);
}
