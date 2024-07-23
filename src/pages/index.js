import { useSession, signIn } from 'next-auth/react';
import { useState, useEffect, useCallback } from 'react';
import { searchAlbums } from '../utils/spotify';
import AlbumGrid from '../components/AlbumGrid';

export default function Home() {
  const { data: session, status } = useSession();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [albums, setAlbums] = useState([]);

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

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  return (
    <main>
      {status === 'unauthenticated' && (
      <button
        onClick={() => signIn('spotify')}
        style={{
          alignItems: 'center',
          backgroundColor: '#000',
          borderColor: 'rgba(0, 0, 0, 0.1)',
          borderRadius: '0.5rem',
          color: '#fff',
          display: 'flex',
          fontSize: '1.1rem',
          fontWeight: '500',
          justifyContent: 'center',
          minHeight: '62px',
          padding: '0.75rem 1rem',
          position: 'relative',
          transition: 'all 0.1s ease-in-out',
          margin: '20px',
          cursor: 'pointer'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
          const img = e.currentTarget.querySelector('img');
          const span = e.currentTarget.querySelector('span');
          if (img) img.style.opacity = '0.8';
          if (span) span.style.opacity = '0.8';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = '#000';
          const img = e.currentTarget.querySelector('img');
          const span = e.currentTarget.querySelector('span');
          if (img) img.style.opacity = '1';
          if (span) span.style.opacity = '1';
        }}
      >
        <img
          loading="lazy"
          height="24"
          width="24"
          src="/spotify.svg"  // Ensure this path is correct and the image is available
          alt="Spotify"
          style={{ marginRight: '10px', transition: 'opacity 0.1s ease-in-out' }}
        />
        <span style={{ transition: 'opacity 0.1s ease-in-out' }}>Sign in with Spotify</span>
      </button>
      )}
      {status === 'authenticated' && (
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
          <AlbumGrid albums={albums} />
        </div>
      )}
    </main>
  );
}
