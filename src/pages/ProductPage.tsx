import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { artworks } from '../data/artworks';
import '../components/ArtworkModal.css';
import './ProductPage.css';

export function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const artwork = useMemo(() => artworks.find((a) => a.id === id), [id]);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleClose = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate('/collection');
  };

  if (!artwork) {
    return (
      <div className="product-page">
        <button type="button" className="product-close" onClick={handleClose} aria-label="Close">
          ×
        </button>
        <div className="product-details">
          <h2>Artwork not found</h2>
        </div>
      </div>
    );
  }

  const isLongDescription = artwork.description.length > 150;
  const displayDescription =
    isExpanded || !isLongDescription
      ? artwork.description
      : `${artwork.description.slice(0, 150)}...`;

  return (
    <div className="product-page">
      <button type="button" className="product-close" onClick={handleClose} aria-label="Close">
        ×
      </button>

      <div className="product-layout">
        <div className="product-media">
          <img src={artwork.imageUrl} alt={artwork.title} />
        </div>

        <div className="product-details">
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400, marginTop: 0 }}>
            {artwork.title}
          </h2>

          <div style={{ marginBottom: 28 }}>
            <p style={{ color: '#ccc', fontSize: '1.05rem', lineHeight: 1.6, margin: 0 }}>
              {displayDescription}
            </p>
            {isLongDescription && (
              <button
                className="read-more-btn"
                onClick={() => setIsExpanded((v) => !v)}
              >
                {isExpanded ? 'Read less' : 'Read more'}
              </button>
            )}
          </div>

          <div className="artwork-meta" style={{ marginBottom: 34 }}>
            <span>
              <strong>Size:</strong> {artwork.size}
            </span>
            <span>
              <strong>Medium:</strong> {artwork.medium}
            </span>
            <span className="price">{artwork.price}</span>
          </div>

          <button className="action-button primary">Purchase Artwork</button>
          <button className="action-button secondary">Inquire</button>
        </div>
      </div>
    </div>
  );
}

