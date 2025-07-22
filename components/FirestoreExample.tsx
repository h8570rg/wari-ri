"use client";

import { useState, useEffect } from "react";
import {
  getAllDocuments,
  addDocument,
  updateDocument,
  deleteDocument,
  getDocument,
} from "@/lib/firestore";

interface SampleItem {
  id?: string;
  title: string;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export default function FirestoreExample() {
  const [items, setItems] = useState<SampleItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [newItem, setNewItem] = useState({ title: "", description: "" });

  // データを取得する関数
  const fetchItems = async () => {
    setLoading(true);
    try {
      const data = await getAllDocuments("samples"); // 'samples'はコレクション名
      setItems(data as SampleItem[]);
    } catch (error) {
      console.error("データ取得エラー:", error);
    } finally {
      setLoading(false);
    }
  };

  // 新しいアイテムを追加する関数
  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.title.trim()) return;

    try {
      await addDocument("samples", {
        title: newItem.title,
        description: newItem.description,
      });
      setNewItem({ title: "", description: "" });
      fetchItems(); // データを再取得
    } catch (error) {
      console.error("アイテム追加エラー:", error);
    }
  };

  // アイテムを削除する関数
  const handleDeleteItem = async (id: string) => {
    try {
      await deleteDocument("samples", id);
      fetchItems(); // データを再取得
    } catch (error) {
      console.error("アイテム削除エラー:", error);
    }
  };

  // アイテムを更新する関数（簡単な例）
  const handleUpdateItem = async (id: string, newTitle: string) => {
    try {
      await updateDocument("samples", id, { title: newTitle });
      fetchItems(); // データを再取得
    } catch (error) {
      console.error("アイテム更新エラー:", error);
    }
  };

  // コンポーネントの初回レンダリング時にデータを取得
  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Firestore使用例</h2>

      {/* 新しいアイテムを追加するフォーム */}
      <form onSubmit={handleAddItem} className="mb-8 space-y-4">
        <div>
          <input
            type="text"
            placeholder="タイトル"
            value={newItem.title}
            onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>
        <div>
          <textarea
            placeholder="説明"
            value={newItem.description}
            onChange={(e) =>
              setNewItem({ ...newItem, description: e.target.value })
            }
            className="w-full px-4 py-2 border rounded-lg"
            rows={3}
          />
        </div>
        <button
          type="submit"
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          追加
        </button>
      </form>

      {/* データを再取得するボタン */}
      <button
        onClick={fetchItems}
        disabled={loading}
        className="mb-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
      >
        {loading ? "読み込み中..." : "データを更新"}
      </button>

      {/* アイテム一覧 */}
      <div className="space-y-4">
        {items.length === 0 ? (
          <p className="text-gray-500">アイテムがありません</p>
        ) : (
          items.map((item) => (
            <div key={item.id} className="p-4 border rounded-lg">
              <h3 className="font-semibold text-lg">{item.title}</h3>
              <p className="text-gray-600 mb-2">{item.description}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const newTitle = prompt(
                      "新しいタイトルを入力してください:",
                      item.title
                    );
                    if (newTitle && newTitle !== item.title) {
                      handleUpdateItem(item.id!, newTitle);
                    }
                  }}
                  className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                >
                  編集
                </button>
                <button
                  onClick={() => {
                    if (confirm("このアイテムを削除しますか？")) {
                      handleDeleteItem(item.id!);
                    }
                  }}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  削除
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
