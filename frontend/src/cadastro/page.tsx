import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { ErrorMessage } from '../components/error-message';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/api/auth/register', { name, email, password });
      alert('Cadastro realizado com sucesso! Aguarde a aprovação do administrador.');
      navigate('/entrar');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao realizar cadastro.');
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Criar conta</h1>
      {error && <ErrorMessage title="Erro de Cadastro" message={error} />}
      <form onSubmit={handleRegister} className="flex flex-col gap-4">
        <input type="text" placeholder="Nome" className="border p-2" onChange={(e) => setName(e.target.value)} required />
        <input type="email" placeholder="E-mail" className="border p-2" onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Senha" className="border p-2" onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit" className="bg-primary text-white p-2 rounded">Cadastrar</button>
      </form>
    </div>
  );
}
