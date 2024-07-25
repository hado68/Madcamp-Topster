// Unauthenticated.js
import React from 'react';
import { signIn } from 'next-auth/react';

const Unauthenticated = () => {
  return (
    <div style={styles.outerContainer}>
      <div style={styles.innerContainer}>
        <img
          src="/AppIcon.png" // Ensure this path is correct and the image is available
          alt="Welcome"
          style={styles.image}
        />
        <button
          onClick={() => signIn('spotify')}
          style={styles.button}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
            const img = e.currentTarget.querySelector('img');
            const span = e.currentTarget.querySelector('span');
            if (img) img.style.opacity = '0.8';
            if (span) span.style.opacity = '0.8';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = '#fff';
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
            src="/spotify.svg" // Ensure this path is correct and the image is available
            alt="Spotify"
            style={{ marginRight: '10px', transition: 'opacity 0.1s ease-in-out' }}
          />
          <span style={{ transition: 'opacity 0.1s ease-in-out' }}>Sign in with Spotify</span>
        </button>
      </div>
    </div>
  );
};

const styles = {
  outerContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    overflow: 'hidden', // Prevent scrolling
    backgroundImage: 'url(/LPcafe.svg)', // Set your background image here
    backgroundSize: 'cover', // Cover the whole container
    backgroundPosition: 'center', // Center the background image
    backgroundRepeat: 'no-repeat', // Do not repeat the background image
  },
  innerContainer: {
    backgroundColor: '#000', // Background color of the inner container
    padding: '100px 80px',
    borderRadius: '10px', // Rounded corners for the container
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)', // Optional: shadow for better appearance
  },
  image: {
    width: '300px', // Adjust the size as needed
    height: 'auto',
    marginBottom: '50px',
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: '0.5rem',
    color: '#000',
    display: 'flex',
    fontSize: '1.1rem',
    fontWeight: '500',
    justifyContent: 'center',
    minHeight: '62px',
    padding: '0.75rem 1rem',
    position: 'relative',
    transition: 'all 0.1s ease-in-out',
    margin: '30px',
    cursor: 'pointer',
  },
};

export default Unauthenticated;
