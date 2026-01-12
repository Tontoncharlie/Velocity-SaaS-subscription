import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Pricing from "@/components/Pricing";
import styles from "./page.module.css";

export default function Home() {
    return (
        <div className={styles.container}>
            <Navbar />
            <main>
                <Hero />
                <Features />
                <div id="pricing">
                    <Pricing />
                </div>
                {/* Features and Footer can go here */}
            </main>

            <footer className={styles.footer}>
                <div className={styles.footerContent}>
                    <div className={styles.footerBrand}>
                        <div className={styles.logoIcon}></div>
                        <span className={styles.logoText}>Velocity</span>
                    </div>
                    <p>© 2026 Velocity SaaS. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
