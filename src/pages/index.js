import { useSession, signIn } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { getAccessToken, searchAlbums, getAlbums } from '../utils/spotify';

export default function Home() {
  const { data: session, status } = useSession();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    if (status === 'authenticated') {
      const fetchAlbums = async () => {
        try {
          const accessToken = session.accessToken;
          const userAlbums = await getAlbums(accessToken);
          setAlbums(userAlbums);
        } catch (error) {
          console.error('Failed to fetch albums:', error);
        }
      };
      fetchAlbums();
    }
  }, [session, status]);

  const handleSearch = async () => {
    if (!searchTerm) return;
    try {
      const accessToken = session.accessToken;
      if (!accessToken) {
        console.error('Access token is missing'); // 추가 디버깅
        return;
      }
      console.log('Access token for search:', accessToken); // 디버그 로그 추가
      const results = await searchAlbums(accessToken, searchTerm);
      setSearchResults(results);
    } catch (error) {
      console.error('Failed to search albums:', error);
    }
  };
  const addAlbum = async (album) => {
    try {
      const response = await fetch('/api/albums', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ album: { id: album.id } }),
      });

      if (response.ok) {
        console.log('Album added successfully');
        // 새로 추가된 앨범을 앨범 목록에 추가합니다.
        setAlbums([...albums, album]);
      } else {
        console.error('Failed to add album');
      }
    } catch (error) {
      console.error('Failed to add album:', error);
    }
  };
  if (!albums) {
    return <p>Failed to load albums</p>;
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100vh' }}>
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
          margin: '20px',
        }}
      >
        Log in with Spotify
      </button>

      {status === 'authenticated' && (
        <div>
          <input
            type="text"
            placeholder="Search for an album"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: '10px',
              fontSize: '16px',
              marginBottom: '10px',
              width: '300px',
            }}
          />
          <button
            onClick={handleSearch}
            style={{
              padding: '10px 20px',
              fontSize: '16px',
              backgroundColor: '#1DB954',
              color: '#fff',
              border: 'none',
              borderRadius: '25px',
              cursor: 'pointer',
              marginBottom: '20px',
            }}
          >
            Search
          </button>
          <div>
            <h1>Search Results</h1>
            <ul>
              {searchResults.map((album) => (
                <li key={album.id}>
                  <img src={album.images[0].url} alt={album.name} width="100" height="100" />
                  <p>{album.name}</p>
                  <button onClick={() => addAlbum(album)}>Add Album</button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
