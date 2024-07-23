import React from 'react';
import Head from 'next/head';
import TurnTableComponent from '../components/TurnTable';
const TurnTable = () => {
  return (
    <>
      <Head>
        <title>Album Shelf</title>
        <meta name="description" content="TurnTable Page" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100vh',
        margin: 0,
        padding: 0,
        backgroundColor: '#f0f0f0',
        overflow: 'hidden'
      }}>
        <TurnTableComponent />
      </main>
    </>
  );
}
export default TurnTable;