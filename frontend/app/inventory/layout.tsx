/*
【執筆メモStart】
【執筆メモEnd】
*/
import styles from "./styles.module.css";

export default function InventoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.layout}>
      <header className={styles.header}>ヘッダー</header>
      <div className={styles.container}>
        <aside className={styles.navbar}>サイドバー</aside>
        <main className={styles.content}>
          <section>{children}</section>
        </main>
      </div>
      <footer className={styles.footer}>フッター</footer>
    </div>
  );
}
