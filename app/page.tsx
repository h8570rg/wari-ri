import FirestoreTest from "@/components/FirestoreTest";

export default function Home() {
  return (
    <div>
      <div>
        <h1>Firebase Firestore テスト</h1>
        <p>以下でFirestoreの動作をテストできます</p>
      </div>

      {/* Firestoreテストコンポーネント */}
      <FirestoreTest />
    </div>
  );
}
