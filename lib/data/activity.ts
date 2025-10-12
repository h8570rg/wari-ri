import {
	collection,
	doc,
	getCountFromServer,
	getDocs,
	limit,
	orderBy,
	type QueryConstraint,
	type QueryDocumentSnapshot,
	query,
	type SnapshotOptions,
	type WithFieldValue,
} from "firebase/firestore";
import { db } from "../firebase";
import type { BaseDocument } from ".";
import type { ExpenseDocument } from "./expense";
import { groupCollectionName } from "./group";
import type { SettlementDocument } from "./settlement";

const activitySubcollectionName = "activities";

export type ActivityDocument = BaseDocument &
	(ExpenseDocument | SettlementDocument);

const activityConverter = {
	toFirestore(value: WithFieldValue<ActivityDocument>) {
		return value;
	},
	fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions) {
		const data = snapshot.data(options);
		return {
			...data,
			createdAt: data.createdAt.toDate(),
			updatedAt: data.updatedAt.toDate(),
		} as ActivityDocument;
	},
};

export function getActivityDocRef(groupId: string, activityId: string) {
	return doc(
		db,
		groupCollectionName,
		groupId,
		activitySubcollectionName,
		activityId,
	).withConverter(activityConverter);
}

export function getNewActivityDocRef(groupId: string) {
	return doc(
		collection(db, groupCollectionName, groupId, activitySubcollectionName),
	);
}

export function getActivitiesCollectionRef(groupId: string) {
	return collection(
		db,
		groupCollectionName,
		groupId,
		activitySubcollectionName,
	).withConverter(activityConverter);
}

export async function getActivities(groupId: string, limitCount?: number) {
	const queryConstraints: QueryConstraint[] = [orderBy("createdAt", "desc")];
	if (limitCount) {
		queryConstraints.push(limit(limitCount));
	}
	const q = query(getActivitiesCollectionRef(groupId), ...queryConstraints);
	const querySnapshot = await getDocs(q);
	return querySnapshot.docs.map((doc) => doc.data());
}

export async function getActivitiesCount(groupId: string) {
	const q = query(getActivitiesCollectionRef(groupId));
	const snapshot = await getCountFromServer(q);
	return snapshot.data().count;
}
