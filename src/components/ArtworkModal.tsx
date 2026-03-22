import { useState } from 'react';
import type { Artwork } from '../types';
import './ArtworkModal.css';

interface ArtworkModalProps {
    artwork: Artwork;
    onClose: () => void;
}

export function ArtworkModal({ artwork, onClose }: ArtworkModalProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [videoReady, setVideoReady] = useState(false);

    const descThreshold = 420;
    const isLongDescription = artwork.description.length > descThreshold;
    const displayDescription = isExpanded || !isLongDescription
        ? artwork.description
        : `${artwork.description.slice(0, descThreshold)}…`;

    return (
        <div className="artwork-modal fade-transition">
            <div className="modal-content">
                <button className="close-btn" onClick={onClose}>×</button>

                <div className="artwork-media">
                    <img src={artwork.imageUrl} alt={artwork.title} className="artwork-hero-image" />
                    {artwork.videoUrl && (
                        <video
                            src={artwork.videoUrl}
                            autoPlay
                            loop
                            muted
                            playsInline
                            className={`artwork-video ${videoReady ? 'loaded' : ''}`}
                            onLoadedData={() => setVideoReady(true)}
                        />
                    )}
                </div>

                <div className="artwork-details">
                    <h2>{artwork.title}</h2>
                    <div className="artwork-story-container">
                        <p className="artwork-story">{displayDescription}</p>
                        {isLongDescription && (
                            <button
                                className="read-more-btn"
                                onClick={() => setIsExpanded(!isExpanded)}
                            >
                                {isExpanded ? 'Read less' : 'Read more'}
                            </button>
                        )}
                    </div>

                    <div className="artwork-meta">
                        <span><strong>Suport:</strong> {artwork.supportMaterial}</span>
                        <span><strong>Dimensiuni:</strong> {artwork.dimensions}</span>
                        <span><strong>Tip culori:</strong> {artwork.colorType}</span>
                        <span><strong>Culori:</strong> {artwork.paintBrand}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
