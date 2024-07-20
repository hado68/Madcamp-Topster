// pages/index.js
import Head from 'next/head';
import AlbumShelf from '../components/AlbumShelf';

const Home = () => {
  return (
    <>
      <Head>
        <title>Album Shelf</title>
        <meta name="description" content="Music album shelf" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', margin: 0, backgroundColor: '#f0f0f0' }}>
        <AlbumShelf />
      </main>
    </>
  );
};

export default Home;
