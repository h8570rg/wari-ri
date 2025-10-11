import {
	collection,
	doc,
	getDoc,
	type QueryDocumentSnapshot,
	runTransaction,
	type SnapshotOptions,
	type WithFieldValue,
} from "firebase/firestore";
import { db } from "../firebase";
import { calculateAggregationForAddSettlement } from "../utils/aggregation";
import type { BaseDocument } from ".";
import { getGroupDocRef, groupCollectionName } from "./group";

const activitySubcollectionName = "activities";

export type SettlementDocument = BaseDocument & {
	type: "settlement";
	amount: number;
	fromUserId: string;
	toUserId: string;
};

export const settlementConverter = {
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

export function getSettlementDocRef(groupId: string, settlementId: string) {
	return doc(
		db,
		groupCollectionName,
		groupId,
		activitySubcollectionName,
		settlementId,
	).withConverter(settlementConverter);
}

export function getNewSettlementDocRef(groupId: string) {
	return doc(
		collection(db, groupCollectionName, groupId, activitySubcollectionName),
	).withConverter(settlementConverter);
}

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
	const groupRef = getGroupDocRef(groupId);
	const settlementRef = getNewSettlementDocRef(groupId);

	await runTransaction(db, async (transaction) => {
		// 1. 現在のgroupデータを取得
		const groupDoc = await transaction.get(groupRef);
		if (!groupDoc.exists()) {
			throw new Error("Group not found");
		}

		const groupData = groupDoc.data();

		// 2. 新しいaggregationを計算
		const newAggregation = calculateAggregationForAddSettlement(
			groupData.aggregation,
			{ amount, fromUserId, toUserId },
			groupData.users,
		);

		// 3. settlementを追加
		transaction.set(settlementRef, {
			id: settlementRef.id,
			type: "settlement",
			amount,
			fromUserId,
			toUserId,
			createdAt: new Date(),
			updatedAt: new Date(),
		});

		// 4. aggregationを更新
		transaction.update(groupRef, {
			aggregation: {
				...newAggregation,
				lastCalculatedAt: new Date(),
			},
			updatedAt: new Date(),
		});
	});
}

export async function getSettlement(groupId: string, settlementId: string) {
	const docRef = getSettlementDocRef(groupId, settlementId);
	const docSnap = await getDoc(docRef);
	const data = docSnap.data();
	if (!data) {
		throw new Error("Settlement not found");
	}
	return data;
}
