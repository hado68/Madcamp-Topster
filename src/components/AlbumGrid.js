import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import '../styles/AlbumGrid.css';

const AlbumGrid = ({ albums, onRemoveAlbum }) => {
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const popupRef = useRef(null);
  const gradientRef = useRef(null);
  const albumGridRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setSelectedAlbum(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleMouseMove = (e) => {
    if (!popupRef.current || !gradientRef.current) return;

    const rect = popupRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;

    popupRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

    gradientRef.current.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255, 255, 255, 0.5), rgba(0, 0, 0, 0))`;
  };

  const handleDragStart = (e, album) => {
    e.dataTransfer.setData('album', JSON.stringify(album));
  };

  const handleDropOutside = (e) => {
    e.preventDefault();
    const album = JSON.parse(e.dataTransfer.getData('album'));
    onRemoveAlbum(album);
  };

  const handleDragOverOutside = (e) => {
    e.preventDefault();
  };

  useEffect(() => {
    document.addEventListener('drop', handleDropOutside);
    document.addEventListener('dragover', handleDragOverOutside);
    return () => {
      document.removeEventListener('drop', handleDropOutside);
      document.removeEventListener('dragover', handleDragOverOutside);
    };
  }, []);

  const handleImageClick = () => {
    if (selectedAlbum) {
      router.push(`/album/${selectedAlbum.id}`);
    }
  };

  return (
    <div className="album-grid" ref={albumGridRef}>
      {albums.slice(0, 16).map((album) => (
        <div
          key={album.id}
          className="album-grid-item"
          onClick={() => setSelectedAlbum(album)}
          draggable
          onDragStart={(e) => handleDragStart(e, album)}
        >
          <img
            src={album.images[0]?.url || '/placeholder-album.jpg'}
            alt={album.name}
            className="album-image"
          />
        </div>
      ))}
      {selectedAlbum && (
        <div className="popup-overlay">
          <div
            className="popup-content"
            ref={popupRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => {
              if (popupRef.current) {
                popupRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
              }
            }}
          >
            <div className="popup-gradient" ref={gradientRef}></div>
            <img
              src={selectedAlbum.images[0]?.url || '/placeholder-album.jpg'}
              alt={selectedAlbum.name}
              className="popup-image"
              onClick={handleImageClick}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AlbumGrid;
