const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';
const ALBUMS_ENDPOINT = 'https://api.spotify.com/v1/albums';
const SEARCH_ENDPOINT = 'https://api.spotify.com/v1/search';

const getAccessToken = async () => {
  const response = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
    },
    body: 'grant_type=client_credentials',
  });

  const data = await response.json();
  return data.access_token;
};

const getAlbums = async (accessToken, albumIds) => {
  const response = await fetch(`${ALBUMS_ENDPOINT}?ids=${albumIds.join(',')}`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  const data = await response.json();
  
  // 각 앨범에 트랙 정보를 추가
  const albumsWithTracks = await Promise.all(data.albums.map(async album => {
    const tracksResponse = await fetch(`${ALBUMS_ENDPOINT}/${album.id}/tracks`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    const tracksData = await tracksResponse.json();
    return { ...album, tracks: tracksData.items };
  }));

  return albumsWithTracks;
};

const searchAlbums = async (accessToken, query) => {
  if (!accessToken) {
    console.error('Access token is missing in searchAlbums'); // Debug log
    return [];
  }

  try {
    const response = await fetch(`${SEARCH_ENDPOINT}?q=${encodeURIComponent(query)}&type=album`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to search albums');
    }

    const data = await response.json();
    return data.albums.items;
  } catch (error) {
    console.error('Error searching albums:', error);
    return [];
  }
};



module.exports = { getAccessToken, getAlbums, searchAlbums };
