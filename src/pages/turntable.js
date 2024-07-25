import React from 'react';
import Head from 'next/head';
import TurnTableComponent from '../components/TurnTable';
import { useRouter } from 'next/router';

const TurnTable = () => {
  const router = useRouter();
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
        <button style={{
          position: 'absolute', // Use absolute positioning to place the button
          top: '600px', // Adjust the top position as needed
          left: '600px', // Adjust the right position as needed
          padding: '20px 20px',
          backgroundColor: '#0070f3',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }} onClick={() => router.back()}>Go Back</button>
      </main>
    </>
  );
}
export default TurnTable;