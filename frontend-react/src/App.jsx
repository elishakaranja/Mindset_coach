import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Home from './pages/Home';
import Onboarding from './pages/Onboarding';
import Chat from './pages/Chat';
import Personalities from './pages/Personalities';
import BackgroundEffects from './components/BackgroundEffects';

// Import all CSS files (copied unchanged from vanilla JS version)
import './styles/design-system.css';
import './styles/main.css';
import './styles/components.css';
import './styles/animations.css';

// Protected Route wrapper
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated()) {
    return <Navigate to="/onboarding" replace />;
  }

  return children;
};

function AppRoutes() {
  return (
    <Router>
      <BackgroundEffects />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/personalities" element={<Personalities />} />
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
