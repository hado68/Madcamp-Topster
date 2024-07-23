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

      <TurnTableComponent />

      <main style={{
        position: 'relative',
        zIndex: 1,
        color: 'white',
        padding: '20px',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <h1>Welcome to Album Shelf</h1>
        <p>Explore your music collection in a new way!</p>
      </main>
    </>
  );
}

export default TurnTable;