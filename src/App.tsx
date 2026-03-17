import { useMediaQuery } from './hooks/useMediaQuery';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { StoryViewer } from './components/StoryViewer';
import { WebIntro } from './components/WebIntro';
import { CollectionPage } from './pages/CollectionPage';
import { ProductPage } from './pages/ProductPage';

function App() {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const navigate = useNavigate();

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            isDesktop ? (
              <WebIntro onIntroComplete={() => navigate('/collection')} />
            ) : (
              <StoryViewer onStoryComplete={() => navigate('/collection')} />
            )
          }
        />
        <Route path="/collection" element={<CollectionPage />} />
        <Route path="/products/:id" element={<ProductPage />} />
        <Route path="*" element={<Navigate to="/collection" replace />} />
      </Routes>
    </>
  );
}

export default App;
