import { useState } from 'react';
import { StoryViewer } from './components/StoryViewer';
import { GallerySection } from './components/GallerySection';

function App() {
  const [showGallery, setShowGallery] = useState(false);

  return (
    <>
      {!showGallery && (
        <StoryViewer onStoryComplete={() => setShowGallery(true)} />
      )}

      {showGallery && (
        <GallerySection />
      )}
    </>
  );
}

export default App;
