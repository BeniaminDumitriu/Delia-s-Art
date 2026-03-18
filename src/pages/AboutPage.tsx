import { useNavigate } from 'react-router-dom';
import './AboutPage.css';

export function AboutPage() {
  const navigate = useNavigate();

  return (
    <div className="about-page">
      <button 
        type="button" 
        className="about-close" 
        onClick={() => navigate('/collection')}
        aria-label="Back to collection"
      >
        ×
      </button>

      <div className="about-content">
        <div className="about-hero">
          <h1>About the Artist</h1>
          <p className="about-subtitle">Where dreams become paintings</p>
        </div>

        <div className="about-section">
          <h2>The Story</h2>
          <p>
            Every painting begins with a dream. For Delia, art is not just a passion—it's a way of 
            breathing life into imagination. What started as simple sketches on paper has blossomed 
            into a vibrant collection of works that celebrate the beauty of nature, the magic of 
            everyday moments, and the courage to create.
          </p>
          <p>
            Each piece tells its own story, inviting viewers to step into a world where flowers dance, 
            ships sail through dreamscapes, and tiny creatures hold grand adventures. Through bold colors, 
            delicate details, and a touch of whimsy, Delia's art captures the essence of wonder that 
            exists all around us—if only we take the time to see it.
          </p>
        </div>

        <div className="about-section">
          <h2>The Process</h2>
          <p>
            Working primarily with mixed media, Delia combines traditional techniques with modern 
            approaches to create pieces that feel both timeless and contemporary. Each artwork begins 
            with careful observation and sketching, followed by layers of color, texture, and detail 
            that bring the vision to life.
          </p>
          <p>
            The creative process is intuitive and exploratory—allowing the painting to evolve naturally, 
            revealing its story along the way. From the first brushstroke to the final detail, every 
            piece is crafted with care, patience, and a deep love for the art of creation.
          </p>
        </div>

        <div className="about-section">
          <h2>The Vision</h2>
          <p>
            Art has the power to transform spaces and touch hearts. Delia's vision is to create works 
            that bring joy, spark imagination, and remind us of the beauty that surrounds us. Whether 
            it's a whimsical fairy garden, a majestic sailing ship, or a delicate floral study, each 
            painting is an invitation to pause, dream, and see the world through a more colorful lens.
          </p>
        </div>

        <div className="about-instagram">
          <h2>Follow the Journey</h2>
          <p>See behind-the-scenes moments, works in progress, and new creations on Instagram</p>
          <a 
            href="https://www.instagram.com/delia.sart/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="instagram-link"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            @delia.sart
          </a>
        </div>

        <div className="about-footer">
          <button 
            className="action-button primary"
            onClick={() => navigate('/collection')}
          >
            View Collection
          </button>
        </div>
      </div>
    </div>
  );
}
