import type { NextPage } from 'next'
import Head from 'next/head'
import React, { useState } from 'react'
import { WalletData } from '../components/molecules'
import { Campaign, Pledge } from '../components/organisms'
import { AppProvider } from '../context/appContext'
import styles from '../styles/Home.module.css'

const Home: NextPage = () => {
  return (
    <AppProvider>
      <Head>
        <title>
          Crowdfund Template - An example of how to run a crowdfund campaign on Soroban.
        </title>
        <meta
          name="description"
          content="An example of loading information from a soroban smart contract"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className={styles.header}>
        <h3>Starfund</h3>
        <WalletData />
      </header>
      <main className={styles.main}>
        <div className={styles.content}>
          <Campaign />
          <Pledge />
        </div>
      </main>
    </AppProvider>
  )
}

export default Home
