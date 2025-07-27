import {
  collection,
  doc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  DocumentData,
  setDoc,
  UpdateData,
  QueryDocumentSnapshot,
  SnapshotOptions,
  WithFieldValue,
  Timestamp,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

export type BaseDocument = {
  id: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
} & DocumentData;

export async function getDocument<T extends BaseDocument>(
  collectionName: string,
  docId: string,
) {
  const converter = createConverter<T>();
  const docRef = doc(db, collectionName, docId).withConverter(converter);
  const docSnap = await getDoc(docRef);
  return docSnap.data();
}

export async function getAllDocuments<T extends BaseDocument>(
  collectionName: string,
) {
  const converter = createConverter<T>();
  const querySnapshot = await getDocs(
    collection(db, collectionName).withConverter(converter),
  );
  return querySnapshot.docs.map((doc) => doc.data());
}

export async function addDocument<T extends BaseDocument>(
  collectionName: string,
  data: Omit<T, "id" | "createdAt" | "updatedAt">,
) {
  const newDocRef = doc(collection(db, collectionName));
  await setDoc(newDocRef, {
    ...data,
    id: newDocRef.id,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return newDocRef.id;
}

export async function setDocument<T extends BaseDocument>(
  collectionName: string,
  documentId: string,
  data: T,
) {
  const converter = createConverter<T>();
  await setDoc(
    doc(db, collectionName, documentId).withConverter(converter),
    data,
  );
}

export async function updateDocument<T extends BaseDocument>(
  collectionName: string,
  documentId: string,
  data: UpdateData<T>,
) {
  const converter = createConverter<T>();
  await updateDoc(
    doc(db, collectionName, documentId).withConverter(converter),
    data,
  );
}

export async function deleteDocument<T extends BaseDocument>(
  collectionName: string,
  documentId: string,
) {
  const converter = createConverter<T>();
  await deleteDoc(doc(db, collectionName, documentId).withConverter(converter));
}

export const createConverter = <T extends BaseDocument>() => ({
  toFirestore(value: WithFieldValue<T>) {
    return value;
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions) {
    return snapshot.data(options) as T;
  },
});
