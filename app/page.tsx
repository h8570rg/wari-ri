import Image from "next/image";
import styles from "./page.module.css";
import FirestoreTest from "@/components/FirestoreTest";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Image
          className={styles.logo}
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        
        <div>
          <h1>Firebase Firestore テスト</h1>
          <p>以下でFirestoreの動作をテストできます</p>
        </div>
        
        {/* Firestoreテストコンポーネント */}
        <FirestoreTest />

      </main>
    </div>
  );
}
