import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  DocumentData,
  WhereFilterOp,
  Query,
} from "firebase/firestore";
import { db } from "./firebase";

// ドキュメントタイプの定義例
export interface BaseDocument {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// コレクション全体を取得
export const getAllDocuments = async (
  collectionName: string,
): Promise<DocumentData[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Record<string, unknown>),
    }));
  } catch (error) {
    console.error("ドキュメント取得エラー:", error);
    throw error;
  }
};

// 特定のドキュメントを取得
export const getDocument = async (
  collectionName: string,
  docId: string,
): Promise<DocumentData | null> => {
  try {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error("ドキュメント取得エラー:", error);
    throw error;
  }
};

// 新しいドキュメントを追加
export const addDocument = async (
  collectionName: string,
  data: Record<string, unknown>,
): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, collectionName), {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return docRef.id;
  } catch (error) {
    console.error("ドキュメント追加エラー:", error);
    throw error;
  }
};

// ドキュメントを更新
export const updateDocument = async (
  collectionName: string,
  docId: string,
  data: Record<string, unknown>,
): Promise<void> => {
  try {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, {
      ...data,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error("ドキュメント更新エラー:", error);
    throw error;
  }
};

// ドキュメントを削除
export const deleteDocument = async (
  collectionName: string,
  docId: string,
): Promise<void> => {
  try {
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("ドキュメント削除エラー:", error);
    throw error;
  }
};

// クエリ付きでドキュメントを取得
export const getDocumentsWithQuery = async (
  collectionName: string,
  conditions: { field: string; operator: WhereFilterOp; value: unknown }[] = [],
  orderByField?: string,
  orderDirection: "asc" | "desc" = "desc",
  limitCount?: number,
): Promise<DocumentData[]> => {
  try {
    let q: Query<DocumentData> = collection(db, collectionName);

    // Where条件を追加
    conditions.forEach((condition) => {
      q = query(q, where(condition.field, condition.operator, condition.value));
    });

    // Order By条件を追加
    if (orderByField) {
      q = query(q, orderBy(orderByField, orderDirection));
    }

    // Limit条件を追加
    if (limitCount) {
      q = query(q, limit(limitCount));
    }

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Record<string, unknown>),
    }));
  } catch (error) {
    console.error("クエリ実行エラー:", error);
    throw error;
  }
};
