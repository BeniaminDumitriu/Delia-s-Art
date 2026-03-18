import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Artwork } from '../types';
import { artworks } from '../data/artworks';
import '../components/GallerySection.css';
import './CollectionPage.css';

function ArtworkCard({ artwork, onClick }: { artwork: Artwork; onClick: () => void }) {
  const [videoReady, setVideoReady] = useState(false);

  return (
    <div className="artwork-card" onClick={onClick} role="button" tabIndex={0}>
      <div className="artwork-media-container">
        <img src={artwork.imageUrl} alt={artwork.title} className="artwork-image" />
        {artwork.videoUrl && (
          <video
            src={artwork.videoUrl}
            className={`artwork-video-preview ${videoReady ? 'loaded' : ''}`}
            autoPlay
            loop
            muted
            playsInline
            onLoadedData={() => setVideoReady(true)}
          />
        )}
      </div>
      <div className="artwork-card-info">
        <h3>{artwork.title}</h3>
      </div>
      <div className="hotspot icon-indicator"></div>
    </div>
  );
}

export function CollectionPage() {
  const navigate = useNavigate();

  return (
    <div className="gallery-section">
      <div className="collection-brand" aria-hidden="true">
        <img className="collection-logo" src="/logo/1logo.png" alt="Delia’s Art" />
      </div>
      <header className="gallery-header">
        <h1>The Collection</h1>
        <p className="gallery-subtitle">Every painting carries a dream</p>
        <p>Tap a painting to explore its story.</p>
        <button 
          className="about-link-btn"
          onClick={() => navigate('/about')}
        >
          About the Artist
        </button>
      </header>

      <div className="gallery-grid">
        {artworks.map((artwork) => (
          <ArtworkCard
            key={artwork.id}
            artwork={artwork}
            onClick={() => navigate(`/products/${artwork.id}`)}
          />
        ))}
      </div>

      <footer className="collection-footer">
        <div className="collection-footer-contact">
          <a href="mailto:dumitriudelia99@gmail.com">dumitriudelia99@gmail.com</a>
        </div>

        <img className="collection-footer-logo" src="/logo/1logo.png" alt="Delia’s Art" />

        <div className="collection-footer-spacer" />
      </footer>
    </div>
  );
}

