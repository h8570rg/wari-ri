"use client";

import { useState, useEffect } from "react";
import { getAllDocuments, addDocument, deleteDocument } from "@/lib/firestore";

interface TestItem {
  id?: string;
  title: string;
  description: string;
  createdAt?: Date;
}

export default function FirestoreTest() {
  const [items, setItems] = useState<TestItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [newItem, setNewItem] = useState({ title: "", description: "" });
  const [error, setError] = useState<string | null>(null);

  // データを取得する関数
  const fetchItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllDocuments("test-items");
      setItems(data as TestItem[]);
      console.log("データ取得成功:", data);
    } catch (err) {
      console.error("データ取得エラー:", err);
      setError("データの取得に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  // 新しいアイテムを追加する関数
  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.title.trim()) return;

    try {
      const docId = await addDocument("test-items", {
        title: newItem.title,
        description: newItem.description,
      });
      console.log("アイテム追加成功:", docId);
      setNewItem({ title: "", description: "" });
      fetchItems();
    } catch (err) {
      console.error("アイテム追加エラー:", err);
      setError("アイテムの追加に失敗しました");
    }
  };

  // アイテムを削除する関数
  const handleDeleteItem = async (id: string) => {
    try {
      await deleteDocument("test-items", id);
      console.log("アイテム削除成功:", id);
      fetchItems();
    } catch (err) {
      console.error("アイテム削除エラー:", err);
      setError("アイテムの削除に失敗しました");
    }
  };

  // コンポーネント初回レンダリング時にデータを取得
  useEffect(() => {
    fetchItems();
  }, []);

  const containerStyle: React.CSSProperties = {
    maxWidth: "600px",
    margin: "20px auto",
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    backgroundColor: "#f9f9f9",
  };

  const formStyle: React.CSSProperties = {
    marginBottom: "20px",
    padding: "15px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    backgroundColor: "white",
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "8px",
    margin: "5px 0",
    border: "1px solid #ccc",
    borderRadius: "4px",
    fontSize: "14px",
  };

  const buttonStyle: React.CSSProperties = {
    padding: "8px 16px",
    margin: "5px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
  };

  const addButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: "#007bff",
    color: "white",
  };

  const deleteButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: "#dc3545",
    color: "white",
  };

  const refreshButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: "#6c757d",
    color: "white",
  };

  return (
    <div style={containerStyle}>
      <h2>🔥 Firestore 動作テスト</h2>

      {error && (
        <div
          style={{
            color: "red",
            marginBottom: "10px",
            padding: "10px",
            backgroundColor: "#ffe6e6",
            border: "1px solid red",
            borderRadius: "4px",
          }}
        >
          {error}
        </div>
      )}

      {/* 新しいアイテム追加フォーム */}
      <form onSubmit={handleAddItem} style={formStyle}>
        <h3>新しいテストアイテムを追加</h3>
        <input
          type="text"
          placeholder="タイトル"
          value={newItem.title}
          onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
          style={inputStyle}
        />
        <input
          type="text"
          placeholder="説明"
          value={newItem.description}
          onChange={(e) =>
            setNewItem({ ...newItem, description: e.target.value })
          }
          style={inputStyle}
        />
        <button type="submit" style={addButtonStyle}>
          📝 追加
        </button>
      </form>

      {/* データ再取得ボタン */}
      <div style={{ marginBottom: "15px" }}>
        <button
          onClick={fetchItems}
          disabled={loading}
          style={refreshButtonStyle}
        >
          {loading ? "🔄 読み込み中..." : "🔄 データを更新"}
        </button>
      </div>

      {/* アイテム一覧表示 */}
      <div>
        <h3>保存されたアイテム一覧</h3>
        {items.length === 0 ? (
          <p style={{ color: "#666", fontStyle: "italic" }}>
            📋 まだアイテムがありません。上のフォームから追加してください。
          </p>
        ) : (
          <div>
            {items.map((item, index) => (
              <div
                key={item.id || index}
                style={{
                  padding: "10px",
                  margin: "8px 0",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  backgroundColor: "white",
                }}
              >
                <div style={{ fontWeight: "bold", marginBottom: "5px" }}>
                  📌 {item.title}
                </div>
                <div
                  style={{
                    color: "#666",
                    fontSize: "14px",
                    marginBottom: "8px",
                  }}
                >
                  {item.description || "説明なし"}
                </div>
                <div style={{ fontSize: "12px", color: "#888" }}>
                  ID: {item.id}
                </div>
                <button
                  onClick={() => {
                    if (confirm(`「${item.title}」を削除しますか？`)) {
                      handleDeleteItem(item.id!);
                    }
                  }}
                  style={deleteButtonStyle}
                >
                  🗑️ 削除
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div
        style={{
          marginTop: "20px",
          fontSize: "12px",
          color: "#666",
          textAlign: "center",
        }}
      >
        コレクション名: <code>test-items</code>
      </div>
    </div>
  );
}
