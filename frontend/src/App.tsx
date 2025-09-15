

import { Routes, Route } from 'react-router-dom';
import LoginPage from './login/page';
import PoliticaDePrivacidade from './politica-de-privacidade/page';
import TermosDeUso from './termos-de-uso/page';
import HomePage from './home/page';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/politica-de-privacidade" element={<PoliticaDePrivacidade />} />
      <Route path="/termos-de-uso" element={<TermosDeUso />} />
    </Routes>
  );
}

export default App;
