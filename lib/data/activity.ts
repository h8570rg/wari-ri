import {
	collection,
	deleteDoc,
	doc,
	getDoc,
	getDocs,
	orderBy,
	type QueryDocumentSnapshot,
	query,
	type SnapshotOptions,
	serverTimestamp,
	setDoc,
	updateDoc,
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

export async function getActivities(groupId: string) {
	const q = query(
		getActivitiesCollectionRef(groupId),
		orderBy("createdAt", "desc"),
	);
	const querySnapshot = await getDocs(q);
	return querySnapshot.docs.map((doc) => doc.data());
}

export async function createActivity(
	groupId: string,
	activity: Omit<ActivityDocument, keyof BaseDocument>,
) {
	const newDocRef = getNewActivityDocRef(groupId);
	await setDoc(newDocRef, {
		id: newDocRef.id,
		createdAt: serverTimestamp(),
		updatedAt: serverTimestamp(),
		...activity,
	});
	return newDocRef.id;
}

export async function getActivity(groupId: string, activityId: string) {
	const docRef = getActivityDocRef(groupId, activityId);
	const docSnap = await getDoc(docRef);
	const data = docSnap.data();
	if (!data) {
		throw new Error("Activity not found");
	}
	return data;
}

export async function updateActivity(
	groupId: string,
	activityId: string,
	activity: Partial<Omit<ActivityDocument, keyof BaseDocument>>,
) {
	await updateDoc(getActivityDocRef(groupId, activityId), activity);
}

export async function deleteActivity(groupId: string, activityId: string) {
	await deleteDoc(getActivityDocRef(groupId, activityId));
}
