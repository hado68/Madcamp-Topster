import { useEffect, useState, useCallback } from "react";

const Player = ({ token, playlist }) => {
  const [player, setPlayer] = useState(null);
  const [isPaused, setIsPaused] = useState(true);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [deviceId, setDeviceId] = useState(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    if (!token) {
      console.error('Token is not available');
      return;
    }

    const loadSpotifyPlayer = () => {
      if (window.Spotify) {
        const spotifyPlayer = new window.Spotify.Player({
          name: 'Web Playback SDK',
          getOAuthToken: cb => { cb(token); },
          volume: 0.5,
        });

        setPlayer(spotifyPlayer);

        spotifyPlayer.addListener('ready', ({ device_id }) => {
          console.log('Ready with Device ID', device_id);
          setDeviceId(device_id);
        });

        spotifyPlayer.addListener('not_ready', ({ device_id }) => {
          console.log('Device ID has gone offline', device_id);
        });

        spotifyPlayer.addListener('player_state_changed', state => {
          if (state) {
            setCurrentTrack({
              name: state.track_window.current_track?.name || '',
              artists: state.track_window.current_track?.artists || [],
              imageUrl: state.track_window.current_track?.album?.images[0]?.url || '', // Track image URL
            });
            setIsPaused(state.paused);
            setProgress(state.position);
            setDuration(state.duration);

            // If the track has ended, play the next track
            if (state.paused && state.position === 0 && state.track_window.previous_tracks.find(track => track.id === state.track_window.current_track.id)) {
              playNextTrack();
            }
          }
        });

        spotifyPlayer.connect();
      } else {
        console.error('Spotify Player SDK not available');
      }
    };

    if (typeof window !== 'undefined') {
      if (window.Spotify) {
        loadSpotifyPlayer();
      } else {
        window.onSpotifyWebPlaybackSDKReady = loadSpotifyPlayer;
      }
    }
  }, [token]);

  const playSong = useCallback(async (spotifyUri, deviceId) => {
    try {
      const response = await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ uris: [spotifyUri] }),
      });

      if (response.ok) {
        console.log('Playback started');
      } else {
        const error = await response.json();
        console.error('Failed to start playback:', error);
      }
    } catch (error) {
      console.error('Error starting playback:', error);
    }
  }, [token]);

  useEffect(() => {
    if (player && deviceId && playlist && playlist.length > 0) {
      playSong(playlist[currentTrackIndex], deviceId);
    }
  }, [currentTrackIndex, player, deviceId, playlist, playSong]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPaused) {
        player.getCurrentState().then(state => {
          if (state) {
            setProgress(state.position);
          }
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused, player]);

  const playNextTrack = useCallback(() => {
    setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % playlist.length);
  }, [playlist.length]);

  const playPrevTrack = useCallback(() => {
    setCurrentTrackIndex((prevIndex) => (prevIndex - 1 + playlist.length) % playlist.length);
  }, [playlist.length]);

  const handleProgressChange = (event) => {
    const newPosition = (event.target.value / 100) * duration;
    player.seek(newPosition).then(() => {
      setProgress(newPosition);
    });
  };

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div style={{ ...playerContainerStyle, width: isExpanded ? '300px' : '300px' }}>
      <p onClick={toggleExpansion} style={toggleTextStyle}>
        <img src={isExpanded ? '/images/greenup.png' : '/images/greendown.png'} alt="toggle" style={toggleImageStyle} />
      </p>
      {currentTrack && isExpanded && (
        <div style={trackInfoStyle}>
          <img src={currentTrack.imageUrl} alt={currentTrack.name} style={trackImageStyle} />
          <p style={trackNameStyle}>{currentTrack.name}</p>
          <p style={artistNameStyle}>{currentTrack.artists.map(artist => artist.name).join(', ')}</p>
        </div>
      )}
      <input
        type="range"
        value={(progress / duration) * 100}
        onChange={handleProgressChange}
        style={progressBarStyle}
      />
      <div style={buttonContainerStyle}>
        <button onClick={playPrevTrack} style={controlButtonStyle}>
          <img src="/images/left.png" alt="prev" style={leftIconStyle} />
        </button>
        <button onClick={() => player.togglePlay()} style={controlButtonStyle}>
          <img
            src={isPaused ? '/images/greenplay.png' : '/images/greenpause.png'}
            alt={isPaused ? 'Play' : 'Pause'}
            style={{ width: '40px', height: '40px' }}
          />
        </button>
        <button onClick={playNextTrack} style={controlButtonStyle}>
          <img src="/images/right.png" alt="next" style={rightIconStyle} />
        </button>
      </div>
    </div>
  );
};

const playerContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  backgroundColor: '#282c34',
  padding: '1rem',
  borderRadius: '8px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  maxWidth: '300px',
  margin: '1rem',
  position: 'fixed', // 고정 위치로 설정
  top: '100px', // 원하는 위치로 조정
  left: '120px', // 원하는 위치로 조정
};

const leftIconStyle = {
  width: '40px',
  height: '40px',
};

const rightIconStyle = {
  width: '40px',
  height: '40px',
};

const toggleImageStyle = {
  width: '40px',
  height: '40px',
};

const toggleTextStyle = {
  cursor: 'pointer',
  textDecoration: 'underline',
  color: '#1db954',
  marginTop: '0.1rem', // 여백 줄이기
  marginBottom: '0.5rem', // 여백 줄이기
  display: 'flex', // 버튼 크기 줄이기 위해 flex 사용
  justifyContent: 'center', // 중앙 정렬
  alignItems: 'center', // 중앙 정렬
};

const trackInfoStyle = {
  marginBottom: '1rem',
  textAlign: 'center',
};

const trackNameStyle = {
  margin: 0,
  fontWeight: 'bold',
  fontSize: '1.1rem',
  color: '#fff',
};

const artistNameStyle = {
  margin: 0,
  color: '#ccc',
};

const trackImageStyle = {
  width: '100%',
  height: 'auto',
  borderRadius: '8px',
  marginBottom: '1rem',
};

const progressBarStyle = {
  width: '100%',
  marginBottom: '1rem',
};

const buttonContainerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  width: '100%',
};

const controlButtonStyle = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
};

export default Player;
