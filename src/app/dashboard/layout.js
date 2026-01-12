import Sidebar from "@/components/Sidebar";
import styles from "./DashboardLayout.module.css";

export default function DashboardLayout({ children }) {
    return (
        <div className={styles.container}>
            <Sidebar />
            <main className={styles.main}>
                {children}
            </main>
        </div>
    );
}
