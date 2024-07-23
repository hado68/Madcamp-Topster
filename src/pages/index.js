import { useSession, signIn } from 'next-auth/react';
import { useState, useEffect, useCallback } from 'react';
import { searchAlbums } from '../utils/spotify';
import AlbumGrid from '../components/AlbumGrid';

export default function Home() {
  const { data: session, status } = useSession();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    // Fetch user albums data
    fetch('/api/albums')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch albums');
        }
        return response.json();
      })
      .then((data) => {
        setAlbums(data.albums || []);
      })
      .catch((error) => console.error('Failed to fetch albums:', error));
  }, []);

  const handleSearch = useCallback(async () => {
    if (!searchTerm) {
      setSearchResults([]);
      return;
    }
    try {
      const accessToken = session?.accessToken;
      if (!accessToken) {
        console.error('Access token is missing');
        return;
      }
      const results = await searchAlbums(accessToken, searchTerm);
      setSearchResults(results);
    } catch (error) {
      console.error('Failed to search albums:', error);
    }
  }, [searchTerm, session?.accessToken]);

  const addAlbum = async (album) => {
    try {
      const response = await fetch('/api/albums', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ album }),
      });

      if (response.ok) {
        setAlbums([...albums, album]);
      } else {
        console.error('Failed to add album');
      }
    } catch (error) {
      console.error('Failed to add album:', error);
    }
  };

  const debounce = (func, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => func.apply(this, args), delay);
    };
  };

  const debouncedSearch = useCallback(debounce(handleSearch, 500), [handleSearch]);

  useEffect(() => {
    debouncedSearch();
  }, [searchTerm, debouncedSearch]);

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
        <div className="container">
          <div className="search-section" style={{ position: 'relative' }}>
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
            {searchResults.length > 0 && (
              <div
                className="search-results"
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: '0',
                  right: '0',
                  maxHeight: '300px',
                  overflowY: 'auto',
                  backgroundColor: '#fff',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                  borderRadius: '8px',
                  zIndex: 1000,
                }}
              >
                <ul style={{ listStyle: 'none', padding: '10px' }}>
                  {searchResults.slice(0, 6).map((album) => (
                    <li
                      key={album.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '10px',
                        cursor: 'pointer',
                        borderBottom: '1px solid #eee',
                      }}
                      onClick={() => addAlbum(album)}
                    >
                      <img
                        src={album.images[0].url}
                        alt={album.name}
                        width="50"
                        height="50"
                        style={{ marginRight: '10px', borderRadius: '4px' }}
                      />
                      <p style={{ margin: 0 }}>{album.name}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div className="album-section">
            <h1>Your Albums</h1>
            <AlbumGrid albums={albums} />
          </div>
        </div>
    </div>
  );
}
