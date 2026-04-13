import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { ErrorMessage } from '../components/error-message';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/api/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao fazer login.');
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Entrar</h1>
      {error && <ErrorMessage title="Erro de Login" message={error} />}
      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <input type="email" placeholder="E-mail" className="border p-2" onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Senha" className="border p-2" onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit" className="bg-primary text-white p-2 rounded">Entrar</button>
      </form>
    </div>
  );
}
