import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../lib/api';
import { ErrorMessage } from '../components/error-message';
import { PublicLayout } from '../components/shared/public-layout';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
    <PublicLayout>
      <div className="max-w-md mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Entrar na sua conta</h1>
        {error && <ErrorMessage title="Erro de Login" message={error} />}
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" type="email" placeholder="nome@biblioteca.com" onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input id="password" type="password" onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <Button type="submit" className="w-full">Entrar</Button>
        </form>
        
        <p className="text-center text-sm text-slate-600">
          Não possui uma conta? <Link to="/cadastro" className="underline underline-offset-4">Cadastre-se</Link>
        </p>
      </div>
    </PublicLayout>
  );
}
