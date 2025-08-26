import {
	doc,
	getDoc,
	type QueryDocumentSnapshot,
	type SnapshotOptions,
	type WithFieldValue,
} from "firebase/firestore";
import { db } from "../firebase";
import type { BaseDocument } from ".";
import { createActivity, deleteActivity, updateActivity } from "./activity";
import { groupCollectionName } from "./group";

const activitySubcollectionName = "activities";

export type SettlementDocument = BaseDocument & {
	type: "settlement";
	amount: number;
	fromUserId: string;
	toUserId: string;
};

const settlementConverter = {
	toFirestore(value: WithFieldValue<SettlementDocument>) {
		return value;
	},
	fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions) {
		const data = snapshot.data(options);
		return {
			...data,
			createdAt: data.createdAt.toDate(),
			updatedAt: data.updatedAt.toDate(),
		} as SettlementDocument;
	},
};

export async function createSettlement({
	groupId,
	amount,
	fromUserId,
	toUserId,
}: {
	groupId: string;
	amount: number;
	fromUserId: string;
	toUserId: string;
}) {
	return createActivity(groupId, {
		type: "settlement",
		amount,
		fromUserId,
		toUserId,
	});
}

export async function getSettlement(groupId: string, settlementId: string) {
	const docRef = doc(
		db,
		groupCollectionName,
		groupId,
		activitySubcollectionName,
		settlementId,
	).withConverter(settlementConverter);
	const docSnap = await getDoc(docRef);
	const data = docSnap.data();
	if (!data) {
		throw new Error("Settlement not found");
	}
	return data;
}

export async function updateSettlement({
	groupId,
	settlementId,
	amount,
	fromUserId,
	toUserId,
}: {
	groupId: string;
	settlementId: string;
	amount: number;
	fromUserId: string;
	toUserId: string;
}) {
	return updateActivity(groupId, settlementId, {
		type: "settlement",
		amount,
		fromUserId,
		toUserId,
	});
}

export async function deleteSettlement(groupId: string, settlementId: string) {
	await deleteActivity(groupId, settlementId);
}
