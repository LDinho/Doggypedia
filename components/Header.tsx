import React from 'react';
import Head from 'next/head';
import styles from '../styles/Home.module.css';

export default function Header() {
    return (
        <>
            <Head>
                <title>Doggypedia</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <header className={styles.header}>
                <nav className={styles.nav}>
                    <a href="/"> <h1>Doggypedia</h1> </a>
                </nav>
            </header>

        </>
    )
}
