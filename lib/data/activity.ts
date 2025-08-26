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

export async function getActivities(groupId: string) {
	const q = query(
		collection(
			db,
			groupCollectionName,
			groupId,
			activitySubcollectionName,
		).withConverter(activityConverter),
		orderBy("createdAt", "desc"),
	);
	const querySnapshot = await getDocs(q);
	return querySnapshot.docs.map((doc) => doc.data());
}

export async function createActivity(
	groupId: string,
	activity: Omit<ActivityDocument, keyof BaseDocument>,
) {
	const newDocRef = doc(
		collection(db, groupCollectionName, groupId, activitySubcollectionName),
	);
	await setDoc(newDocRef, {
		id: newDocRef.id,
		createdAt: serverTimestamp(),
		updatedAt: serverTimestamp(),
		...activity,
	});
	return newDocRef.id;
}

export async function getActivity(groupId: string, activityId: string) {
	const docRef = doc(
		db,
		groupCollectionName,
		groupId,
		activitySubcollectionName,
		activityId,
	).withConverter(activityConverter);
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
	await updateDoc(
		doc(
			db,
			groupCollectionName,
			groupId,
			activitySubcollectionName,
			activityId,
		).withConverter(activityConverter),
		activity,
	);
}

export async function deleteActivity(groupId: string, activityId: string) {
	await deleteDoc(
		doc(
			db,
			groupCollectionName,
			groupId,
			activitySubcollectionName,
			activityId,
		).withConverter(activityConverter),
	);
}
