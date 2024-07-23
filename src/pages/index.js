import { useSession, signIn } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { getAccessToken, searchAlbums, getAlbums } from '../utils/spotify';
import AlbumGrid from '../components/AlbumGrid';
import Album from './album/[id]';
import AlbumShelf from '@/components/AlbumShelf';

export default function Home() {
  const { data: session, status } = useSession();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    // Fetch user genres data
    fetch('/api/albums')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch genres');
        }
        return response.json();
      })
      .then((data) => {
        setAlbums(data.albums || []);
      })
      .catch((error) => console.error('Failed to fetch genres:', error));
  }, []);
  const handleSearch = async () => {
    if (!searchTerm) return;
    try {
      const accessToken = session.accessToken;
      if (!accessToken) {
        console.error('Access token is missing'); // 추가 디버깅
        return;
      }
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
        body: JSON.stringify({ album: album }),
      });

      if (response.ok) {
        console.log('Fetched albums:', albums);                
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
        <div className="container">
          <div className="search-section">
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
                  <li key={album.id} style={{ listStyle: 'none', marginBottom: '10px' }}>
                    <img src={album.images[0].url} alt={album.name} width="100" height="100" />
                    <p>{album.name}</p>
                    <button
                      onClick={() => addAlbum(album)}
                      style={{
                        padding: '5px 10px',
                        fontSize: '14px',
                        backgroundColor: '#1DB954',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '15px',
                        cursor: 'pointer',
                      }}
                    >
                      Add Album
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="album-section">
            <h1>Your Albums</h1>
            <AlbumGrid albums={albums} />
            <AlbumShelf/>
          </div>
        </div>
      )}
    </div>
  );
}