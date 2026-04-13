

import { Routes, Route } from 'react-router-dom';
import LoginPage from './login/page';
import RegisterPage from './cadastro/page';
import PoliticaDePrivacidade from './politica-de-privacidade/page';
import TermosDeUso from './termos-de-uso/page';
import HomePage from './home/page';
import { BooksPage } from './catalog/page';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/entrar" element={<LoginPage />} />
      <Route path="/cadastro" element={<RegisterPage />} />
      <Route path="/politica-de-privacidade" element={<PoliticaDePrivacidade />} />
      <Route path="/termos-de-uso" element={<TermosDeUso />} />
      <Route path="/catalogo" element={<BooksPage />} />
    </Routes>
  );
}

export default App;

