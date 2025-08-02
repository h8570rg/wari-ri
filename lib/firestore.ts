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
  serverTimestamp,
  query,
  QueryConstraint,
} from "firebase/firestore";
import { db } from "./firebase";

export type BaseDocument = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
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

export async function getAllDocumentsWithQuery<T extends BaseDocument>(
  collectionName: string,
  ...queryConstraints: QueryConstraint[]
) {
  const converter = createConverter<T>();
  const q = query(
    collection(db, collectionName).withConverter(converter),
    ...queryConstraints,
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => doc.data());
}

// サブコレクション用の関数群
export async function getSubcollectionDocument<T extends BaseDocument>(
  parentCollectionName: string,
  parentDocId: string,
  subcollectionName: string,
  docId: string,
) {
  const converter = createConverter<T>();
  const docRef = doc(
    db,
    parentCollectionName,
    parentDocId,
    subcollectionName,
    docId,
  ).withConverter(converter);
  const docSnap = await getDoc(docRef);
  return docSnap.data();
}

export async function getAllSubcollectionDocuments<T extends BaseDocument>(
  parentCollectionName: string,
  parentDocId: string,
  subcollectionName: string,
) {
  const converter = createConverter<T>();
  const querySnapshot = await getDocs(
    collection(
      db,
      parentCollectionName,
      parentDocId,
      subcollectionName,
    ).withConverter(converter),
  );
  return querySnapshot.docs.map((doc) => doc.data());
}

export async function addSubcollectionDocument<T extends BaseDocument>(
  parentCollectionName: string,
  parentDocId: string,
  subcollectionName: string,
  data: Omit<T, "id" | "createdAt" | "updatedAt">,
) {
  const newDocRef = doc(
    collection(db, parentCollectionName, parentDocId, subcollectionName),
  );
  await setDoc(newDocRef, {
    ...data,
    id: newDocRef.id,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return newDocRef.id;
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
    const data = snapshot.data(options);

    // TimestampをDateに変換
    const convertedData = {
      ...data,
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt.toDate(),
    };

    return convertedData as T;
  },
});
