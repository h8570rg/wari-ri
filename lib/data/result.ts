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
import {
	calculateAggregationForAddResult,
	calculateAggregationForDeleteResult,
	calculateAggregationForUpdateResult,
} from "../utils/aggregation";
import type { BaseDocument } from ".";
import { getGroupDocRef, groupCollectionName } from "./group";

const activitySubcollectionName = "activities";

export type ResultEntry = {
	userId: string;
	// 符号付き。勝ちはプラス、負けはマイナス（合計は0）
	amount: number;
};

export type ResultDocument = BaseDocument & {
	type: "result";
	description: string;
	entries: ResultEntry[];
};

const resultConverter = {
	toFirestore(value: WithFieldValue<ResultDocument>) {
		return value;
	},
	fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions) {
		const data = snapshot.data(options);
		return {
			...data,
			createdAt: data.createdAt.toDate(),
			updatedAt: data.updatedAt.toDate(),
		} as ResultDocument;
	},
};

export function getResultDocRef(groupId: string, resultId: string) {
	return doc(
		db,
		groupCollectionName,
		groupId,
		activitySubcollectionName,
		resultId,
	).withConverter(resultConverter);
}

export function getNewResultDocRef(groupId: string) {
	return doc(
		collection(db, groupCollectionName, groupId, activitySubcollectionName),
	).withConverter(resultConverter);
}

/**
 * 0円のエントリは保存しない（不参加扱い）
 */
function compactEntries(entries: ResultEntry[]) {
	return entries.filter((entry) => entry.amount !== 0);
}

export async function createResult({
	groupId,
	description,
	entries,
}: {
	groupId: string;
	description: string;
	entries: ResultEntry[];
}) {
	const groupRef = getGroupDocRef(groupId);
	const resultRef = getNewResultDocRef(groupId);
	const compactedEntries = compactEntries(entries);

	await runTransaction(db, async (transaction) => {
		// 1. 現在のgroupデータを取得
		const groupDoc = await transaction.get(groupRef);
		if (!groupDoc.exists()) {
			throw new Error("Group not found");
		}

		const groupData = groupDoc.data();

		// 2. 新しいaggregationを計算
		const newAggregation = calculateAggregationForAddResult(
			groupData.aggregation,
			{ entries: compactedEntries },
			groupData.users,
		);

		// 3. resultを追加
		transaction.set(resultRef, {
			id: resultRef.id,
			type: "result",
			description,
			entries: compactedEntries,
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

export async function getResult(groupId: string, resultId: string) {
	const docRef = getResultDocRef(groupId, resultId);
	const docSnap = await getDoc(docRef);
	const data = docSnap.data();
	if (!data) {
		throw new Error("Result not found");
	}
	return data;
}

export async function updateResult({
	groupId,
	resultId,
	description,
	entries,
}: {
	groupId: string;
	resultId: string;
	description: string;
	entries: ResultEntry[];
}) {
	const groupRef = getGroupDocRef(groupId);
	const resultRef = getResultDocRef(groupId, resultId);
	const compactedEntries = compactEntries(entries);

	await runTransaction(db, async (transaction) => {
		// 1. 現在のgroupデータとresultを取得
		const groupDoc = await transaction.get(groupRef);
		if (!groupDoc.exists()) {
			throw new Error("Group not found");
		}

		const resultDoc = await transaction.get(resultRef);
		if (!resultDoc.exists()) {
			throw new Error("Result not found");
		}

		const groupData = groupDoc.data();
		const oldResult = resultDoc.data();

		// 2. 新しいaggregationを計算
		const newAggregation = calculateAggregationForUpdateResult(
			groupData.aggregation,
			{ entries: oldResult.entries },
			{ entries: compactedEntries },
			groupData.users,
		);

		// 3. resultを更新
		transaction.update(resultRef, {
			description,
			entries: compactedEntries,
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

export async function deleteResult(groupId: string, resultId: string) {
	const groupRef = getGroupDocRef(groupId);
	const resultRef = getResultDocRef(groupId, resultId);

	await runTransaction(db, async (transaction) => {
		// 1. 現在のgroupデータとresultを取得
		const groupDoc = await transaction.get(groupRef);
		if (!groupDoc.exists()) {
			throw new Error("Group not found");
		}

		const resultDoc = await transaction.get(resultRef);
		if (!resultDoc.exists()) {
			throw new Error("Result not found");
		}

		const groupData = groupDoc.data();
		const result = resultDoc.data();

		// 2. 新しいaggregationを計算
		const newAggregation = calculateAggregationForDeleteResult(
			groupData.aggregation,
			{ entries: result.entries },
			groupData.users,
		);

		// 3. resultを削除
		transaction.delete(resultRef);

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
