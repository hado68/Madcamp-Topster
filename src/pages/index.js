// pages/index.js
import Head from 'next/head';
import TurnTableComponent from '../components/TurnTable';


const Home = () => {
  return (
    <>
      <Head>
        <title>Album Shelf</title>
        <meta name="description" content="TurnTable Page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', margin: 0, backgroundColor: '#f0f0f0' }}>
        <TurnTableComponent />
      </main>
    </>
  );
};

export default Home;
