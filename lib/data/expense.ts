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
	calculateAggregationForAddExpense,
	calculateAggregationForDeleteExpense,
	calculateAggregationForUpdateExpense,
} from "../utils/aggregation";
import type { BaseDocument } from ".";
import { getGroupDocRef, groupCollectionName } from "./group";

const activitySubcollectionName = "activities";

export type ExpenseDocument = BaseDocument & {
	type: "expense";
	amount: number;
	payerId: string;
	description: string;
	participantIds: string[];
};

const expenseConverter = {
	toFirestore(value: WithFieldValue<ExpenseDocument>) {
		return value;
	},
	fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions) {
		const data = snapshot.data(options);
		return {
			...data,
			createdAt: data.createdAt.toDate(),
			updatedAt: data.updatedAt.toDate(),
		} as ExpenseDocument;
	},
};

export function getExpenseDocRef(groupId: string, expenseId: string) {
	return doc(
		db,
		groupCollectionName,
		groupId,
		activitySubcollectionName,
		expenseId,
	).withConverter(expenseConverter);
}

export function getNewExpenseDocRef(groupId: string) {
	return doc(
		collection(db, groupCollectionName, groupId, activitySubcollectionName),
	).withConverter(expenseConverter);
}

export async function createExpense({
	groupId,
	amount,
	payerId,
	description,
	participantIds,
}: {
	groupId: string;
	amount: number;
	payerId: string;
	description: string;
	participantIds: string[];
}) {
	const groupRef = getGroupDocRef(groupId);
	const expenseRef = getNewExpenseDocRef(groupId);

	await runTransaction(db, async (transaction) => {
		// 1. 現在のgroupデータを取得
		const groupDoc = await transaction.get(groupRef);
		if (!groupDoc.exists()) {
			throw new Error("Group not found");
		}

		const groupData = groupDoc.data();

		// 2. 新しいaggregationを計算
		const newAggregation = calculateAggregationForAddExpense(
			groupData.aggregation,
			{ amount, payerId, participantIds },
			groupData.users,
		);

		// 3. expenseを追加
		transaction.set(expenseRef, {
			id: expenseRef.id,
			type: "expense",
			amount,
			payerId,
			description,
			participantIds,
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

export async function getExpense(groupId: string, expenseId: string) {
	const docRef = getExpenseDocRef(groupId, expenseId);
	const docSnap = await getDoc(docRef);
	const data = docSnap.data();
	if (!data) {
		throw new Error("Expense not found");
	}
	return data;
}

export async function updateExpense({
	groupId,
	expenseId,
	amount,
	payerId,
	description,
	participantIds,
}: {
	groupId: string;
	expenseId: string;
	amount: number;
	payerId: string;
	description: string;
	participantIds: string[];
}) {
	const groupRef = getGroupDocRef(groupId);
	const expenseRef = getExpenseDocRef(groupId, expenseId);

	await runTransaction(db, async (transaction) => {
		// 1. 現在のgroupデータとexpenseを取得
		const [groupDoc, expenseDoc] = await Promise.all([
			transaction.get(groupRef),
			transaction.get(expenseRef),
		]);

		if (!groupDoc.exists()) {
			throw new Error("Group not found");
		}
		if (!expenseDoc.exists()) {
			throw new Error("Expense not found");
		}

		const groupData = groupDoc.data();
		const oldExpense = expenseDoc.data();

		// 2. 新しいaggregationを計算
		const newAggregation = calculateAggregationForUpdateExpense(
			groupData.aggregation,
			{
				amount: oldExpense.amount,
				payerId: oldExpense.payerId,
				participantIds: oldExpense.participantIds,
			},
			{ amount, payerId, participantIds },
			groupData.users,
		);

		// 3. expenseを更新
		transaction.update(expenseRef, {
			amount,
			payerId,
			description,
			participantIds,
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

export async function deleteExpense(groupId: string, expenseId: string) {
	const groupRef = getGroupDocRef(groupId);
	const expenseRef = getExpenseDocRef(groupId, expenseId);

	await runTransaction(db, async (transaction) => {
		// 1. 現在のgroupデータとexpenseを取得
		const [groupDoc, expenseDoc] = await Promise.all([
			transaction.get(groupRef),
			transaction.get(expenseRef),
		]);

		if (!groupDoc.exists()) {
			throw new Error("Group not found");
		}
		if (!expenseDoc.exists()) {
			throw new Error("Expense not found");
		}

		const groupData = groupDoc.data();
		const expense = expenseDoc.data();

		// 2. 新しいaggregationを計算
		const newAggregation = calculateAggregationForDeleteExpense(
			groupData.aggregation,
			{
				amount: expense.amount,
				payerId: expense.payerId,
				participantIds: expense.participantIds,
			},
			groupData.users,
		);

		// 3. expenseを削除
		transaction.delete(expenseRef);

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
