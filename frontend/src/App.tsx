

import { Routes, Route } from 'react-router-dom';
import LoginPage from './login/page';
import RegisterPage from './cadastro/page';
import PoliticaDePrivacidade from './politica-de-privacidade/page';
import TermosDeUso from './termos-de-uso/page';
import HomePage from './home/page';
import AdminPage from './admin/page';
import { BooksPage } from './catalog/page';
import BookDetailsPage from './catalog/detalhes';
import ProfilePage from './perfil/page';
import { ProtectedRoute } from './components/auth/protected-route';
import { NotFoundPage } from './components/not-found';
import { ErrorBoundary } from './components/error-boundary';

function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/entrar" element={<LoginPage />} />
        <Route path="/cadastro" element={<RegisterPage />} />
        <Route path="/politica-de-privacidade" element={<PoliticaDePrivacidade />} />
        <Route path="/termos-de-uso" element={<TermosDeUso />} />
        <Route path="/catalogo" element={<BooksPage />} />
        <Route path="/catalogo/:id" element={<BookDetailsPage />} />
        <Route
          path="/perfil"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <AdminPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </ErrorBoundary>
  );
}

export default App;

