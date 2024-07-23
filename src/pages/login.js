
<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100vh' }}>
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