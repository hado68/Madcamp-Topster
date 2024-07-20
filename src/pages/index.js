import { useSession, signIn } from 'next-auth/react';
import Link from 'next/link';
import { getAccessToken, getAlbums } from '../utils/spotify';

export default function Home({ albums }) {
  const { data: session, status } = useSession();

  if (!albums) {
    return <p>Failed to load albums</p>;
  }
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <button
        onClick={() => signIn('spotify')}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: '#1DB954',
          color: '#fff',
          border: 'none',
          borderRadius: '25px',
          cursor: 'pointer',
        }}
      >
        Log in with Spotify
      </button>
      {status == 'authenticated' && (
        <div>
        <h1>Album List</h1>
        <ul>
          {albums.map(album => (
            <li key={album.id}>
              <Link href={`/album/${album.id}`}>
                  <img src={album.images[0].url} alt={album.name} width="100" height="100" />
                  <p>{album.name}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
        )}
    </div>
  );
}
export async function getServerSideProps() {
  try {
    const accessToken = await getAccessToken();
    const albumIds = ['68To0i66fYxVRRqf7fAh4i', '4SZko61aMnmgvNhfhgTuD3']; // Spotify 앨범 ID를 배열로 입력
    const albums = await getAlbums(accessToken, albumIds);

    // null 값을 필터링
    const filteredAlbums = albums.filter(album => album !== null);

    return {
      props: {
        albums: filteredAlbums,
      },
    };
  } catch (error) {
    console.error('Failed to fetch albums:', error);
    return {
      props: {
        albums: null,
      },
    };
  }
}