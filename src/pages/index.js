import { useSession } from 'next-auth/react';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { searchAlbums } from '../utils/spotify';
import AlbumGrid from '../components/AlbumGrid';
import Unauthenticated from '../components/Unauthenticated';

export default function Home() {
  const { data: session, status } = useSession();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [albums, setAlbums] = useState([]);
  const router = useRouter();

  // Log session status for debugging
  useEffect(() => {
    console.log('Session Status:', status);
  }, [status]);

  useEffect(() => {
    if (status === 'authenticated') {
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
    }
  }, [status]);

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

  const handleTurntableClick = () => {
    router.push('/turntable');
  };

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  return (
    <main>
      {status === 'unauthenticated' && <Unauthenticated />}
      {status === 'authenticated' && (
        <div className="container">
          <div className="search-section" style={{ position: 'relative', marginTop: '80px', marginRight: '20px' }}>
            <input
              type="text"
              className="search-input"
              placeholder="Search for an Album"
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
                  maxHeight: '400px',
                  overflowY: 'scroll',
                  backgroundColor: '#000',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                  borderRadius: '8px',
                  zIndex: 1000,
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                }}
              >
                <ul style={{ listStyle: 'none', padding: '10px' }}>
                  {searchResults.slice(0, 50).map((album) => (
                    <li
                      key={album.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '10px',
                        cursor: 'pointer',
                        borderBottom: '1px solid #eee',
                        color: '#fff',
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
          <AlbumGrid albums={albums} />
          <div style={{ marginLeft: '100px', marginTop: '500px' }}>
            <img
              src="/TurnTableImage.png"
              alt="Turntable"
              onClick={handleTurntableClick}
              style={{
                width: '200px',
                height: 'auto',
                borderRadius: '10px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                cursor: 'pointer',
              }}
            />
            
          </div>
        </div>
      )}
    </main>
  );
}