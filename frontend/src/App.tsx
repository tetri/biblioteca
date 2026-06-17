

import { Routes, Route } from 'react-router-dom';
import LoginPage from './login/page';
import RegisterPage from './cadastro/page';
import PoliticaDePrivacidade from './politica-de-privacidade/page';
import TermosDeUso from './termos-de-uso/page';
import HomePage from './home/page';
import AdminDashboardPage from './admin/dashboard-page';
import AdminUsersPage from './admin/users-page';
import AdminBooksPage from './admin/books-page';
import AdminLoansPage from './admin/loans-page';
import { BooksPage } from './catalog/page';
import BookDetailsPage from './catalog/detalhes';
import ProfilePage from './perfil/page';
import { MyLoansPage } from './meus-emprestimos/page';
import { ProtectedRoute } from './components/auth/protected-route';
import { NotFoundPage } from './components/not-found';
import { ErrorBoundary } from './components/error-boundary';
import { AdminLayout } from './components/shared/admin/admin-layout';

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
          path="/meus-emprestimos"
          element={
            <ProtectedRoute>
              <MyLoansPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboardPage />} />
          <Route path="usuarios" element={<AdminUsersPage />} />
          <Route path="livros" element={<AdminBooksPage />} />
          <Route path="emprestimos" element={<AdminLoansPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </ErrorBoundary>
  );
}

export default App;

