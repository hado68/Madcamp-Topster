import { getAccessToken, getAlbums } from '../../utils/spotify';
import styles from '../../styles/Album.module.css';
import React, { useEffect, useState } from "react";
import useWindowSize from "@rooks/use-window-size";
import ParticleImage, { forces, Vector } from "react-particle-image";
import Player from '../../components/Player';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/router';

// Round number up to nearest step for better canvas performance
const round = (n, step = 20) => Math.ceil(n / step) * step;

// Try making me lower to see how performance degrades
const STEP = 30;

const particleOptions = {
  filter: ({ x, y, image }) => {
    // Get pixel
    const pixel = image.get(x, y);
    // Make a particle for this pixel if magnitude < 200 (range 0-255)
    const magnitude = (pixel.r + pixel.g + pixel.b) / 3;
    return true;
  },
  color: ({ x, y, image }) => {
    const pixel = image.get(x, y);
    // Canvases are much more performant when painting as few colors as possible.
    // Use color of pixel as color for particle however round to nearest 30
    // to decrease the number of unique colors painted on the canvas.
    // You'll notice if we remove this rounding, the framerate will slow down a lot.
    return `rgba(
      ${round(pixel.r, STEP)}, 
      ${round(pixel.g, STEP)}, 
      ${round(pixel.b, STEP)}, 
      ${round(pixel.a, STEP) / 255}
    )`;
  },
  radius: ({ x, y, image }) => {
    const pixel = image.get(x, y);
    const magnitude = (pixel.r + pixel.g + pixel.b) / 3;
    // Lighter colors will have smaller radius
    return 8 - (magnitude / 255) * 1;
  },
  mass: () => 30,
  friction: () => 0.15,
  initialPosition: ({ canvasDimensions }) => {
    // Return the center of the canvas
    return new Vector(canvasDimensions.width / 2, canvasDimensions.height / 2);
  }
};

const motionForce = (x, y) => {
  return forces.disturbance(x, y, 7);
};
const motionForce2 = (x, y) => {
  return forces.entropy(x, y, 2);
};
export default function Album({ album }) {
  const { innerWidth, innerHeight } = useWindowSize();
  const [windowDimensions, setWindowDimensions] = useState({ width: 0, height: 0 });
  const [currentTrack, setCurrentTrack] = useState(null);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (innerWidth && innerHeight) {
      setWindowDimensions({ width: innerWidth, height: innerHeight });
    }
  }, [innerWidth, innerHeight]);

  if (!album) {
    return <p>Album not found</p>;
  }

  const handleTrackClick = (trackUrl) => {
    setCurrentTrack(trackUrl);
  };

  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className={styles.albumPage}>
      <Player token={session?.accessToken} playlist={[currentTrack]} />
      {windowDimensions.width > 0 && windowDimensions.height > 0 && (
        <ParticleImage
          src={album.images[0].url}
          width={windowDimensions.width}
          height={windowDimensions.height}
          scale={1.05}
          entropy={10}
          maxParticles={7000}
          particleOptions={particleOptions}
          mouseMoveForce={motionForce}
          touchMoveForce={motionForce}
          mouseDownForce={motionForce2}
          backgroundColor="#252b2e"
          style={{
            position: 'fixed', 
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 2,
          }}
        />
      )}
      
      <div 
        className={styles.trackList}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className={styles.trackListContent}>
          <h1>{album.name}</h1>
          <h3>Track List</h3>
          {album.tracks.map((track, index) => (
            <div 
              key={index} 
              className={styles.trackItem}
              onClick={() => handleTrackClick(track.external_urls.spotify)}
            >
              {track.name}
            </div>
          ))}
          <img 
            src="/Arrow.svg" 
            alt="Custom Image" 
            className={`${styles.customImage} ${isHovered ? styles.flipped : ''}`}
          />
        </div>
      </div>
      
      <button className={styles.goBackButton} onClick={() => router.back()}>Go Back</button>
    </div>
  );
}

export async function getServerSideProps(context) {
  const { id } = context.params;
  const accessToken = await getAccessToken();
  const albums = await getAlbums(accessToken, [id]);
  const album = albums[0];

  return {
    props: {
      album,
    },
  };
}
