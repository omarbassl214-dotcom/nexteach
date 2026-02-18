"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import styles from "./Overlay.module.css";

interface OverlayProps {
    portalOpen: boolean;
}

const projects = [
    {
        title: "Perfect Protocol",
        description: "Cutting-edge protocol management system ensuring seamless operations and security.",
        link: "#"
    },
    {
        title: "Heavy Production",
        description: "Industrial-grade production workflows optimized for heavy loads and efficiency.",
        link: "#"
    },
    {
        title: "Luxurious Towing",
        description: "Premium towing services redefining roadside assistance with elegance and speed.",
        link: "#"
    }
];

export default function Overlay({ portalOpen }: OverlayProps) {
    const [activeTab, setActiveTab] = useState<"works" | "about" | "contact">("works");

    return (
        <AnimatePresence>
            {portalOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1, delay: 1.5 }} // Wait for fly-through
                    className={styles.overlay}
                >
                    <div className={styles.container}>
                        {/* Left Section: Title & Nav */}
                        <div className={styles.leftSection}>
                            <motion.h1
                                className={styles.title}
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                            >
                                Ahmad.
                            </motion.h1>
                            <motion.p
                                className={styles.subtitle}
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.4 }}
                            >
                                Creative Developer & Designer crafting immersive digital experiences.
                            </motion.p>

                            <motion.nav
                                className={styles.nav}
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.5 }}
                            >
                                <button
                                    className={`${styles.navButton} ${activeTab === 'works' ? styles.navButtonActive : ''}`}
                                    onClick={() => setActiveTab('works')}
                                >
                                    Selected Works
                                </button>
                                <button
                                    className={`${styles.navButton} ${activeTab === 'about' ? styles.navButtonActive : ''}`}
                                    onClick={() => setActiveTab('about')}
                                >
                                    About Me
                                </button>
                                <button
                                    className={`${styles.navButton} ${activeTab === 'contact' ? styles.navButtonActive : ''}`}
                                    onClick={() => setActiveTab('contact')}
                                >
                                    Contact
                                </button>
                            </motion.nav>
                        </div>

                        {/* Right Section: Content */}
                        <div className={styles.contentArea}>
                            <AnimatePresence mode="wait">
                                {activeTab === 'works' && (
                                    <motion.div
                                        key="works"
                                        initial={{ x: 20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        exit={{ x: -20, opacity: 0 }}
                                        className={styles.contentArea}
                                    >
                                        {projects.map((project, index) => (
                                            <div key={index} className={styles.card}>
                                                <div className={styles.cardHeader}>
                                                    <span className={styles.cardTitle}>{project.title}</span>
                                                    <ArrowRight size={18} color="white" />
                                                </div>
                                                <p className={styles.cardDescription}>{project.description}</p>
                                            </div>
                                        ))}
                                    </motion.div>
                                )}

                                {activeTab === 'about' && (
                                    <motion.div
                                        key="about"
                                        initial={{ x: 20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        exit={{ x: -20, opacity: 0 }}
                                    >
                                        <p style={{ color: '#ddd', lineHeight: '1.8', fontSize: '1.1rem' }}>
                                            I specialize in building digital products that blend high-performance engineering with premium aesthetics.
                                            <br /><br />
                                            My approach is rooted in precision ("Perfect Protocol"), scale ("Heavy Production"), and experience ("Luxurious Towing").
                                            I don't just write code; I craft environments. Use this portal to explore my world.
                                        </p>
                                    </motion.div>
                                )}

                                {activeTab === 'contact' && (
                                    <motion.div
                                        key="contact"
                                        initial={{ x: 20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        exit={{ x: -20, opacity: 0 }}
                                    >
                                        <div className={styles.card}>
                                            <h3 className={styles.cardTitle}>Get in Touch</h3>
                                            <p className={styles.cardDescription}>
                                                Ready to start a project? <br /><br />
                                                Email: hello@example.com<br />
                                                Social: @ahmad_dev
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    <motion.div
                        className={styles.footer}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.5 }}
                    >
                        refresh to return to void
                    </motion.div>
                </motion.div>
            )}

            {!portalOpen && (
                <motion.div
                    className={styles.hint}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                >
                    Enter The Portal
                </motion.div>
            )}
        </AnimatePresence>
    );
}
