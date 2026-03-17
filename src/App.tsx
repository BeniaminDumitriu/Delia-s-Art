import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { StoryViewer } from './components/StoryViewer';
import { CollectionPage } from './pages/CollectionPage';
import { ProductPage } from './pages/ProductPage';

function App() {
  const navigate = useNavigate();

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={<StoryViewer onStoryComplete={() => navigate('/collection')} />}
        />
        <Route path="/collection" element={<CollectionPage />} />
        <Route path="/products/:id" element={<ProductPage />} />
        <Route path="*" element={<Navigate to="/collection" replace />} />
      </Routes>
    </>
  );
}

export default App;
