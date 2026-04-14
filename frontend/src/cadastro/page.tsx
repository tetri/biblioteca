import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../lib/api';
import { ErrorMessage } from '../components/error-message';
import { PublicLayout } from '../components/shared/public-layout';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
    <PublicLayout>
      <div className="max-w-md mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Criar conta</h1>
        {error && <ErrorMessage title="Erro de Cadastro" message={error} />}
        
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome completo</Label>
            <Input id="name" type="text" placeholder="Seu nome" onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" type="email" placeholder="nome@biblioteca.com" onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input id="password" type="password" onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <Button type="submit" className="w-full">Cadastrar</Button>
        </form>

        <p className="text-center text-sm text-slate-600">
          Já tem uma conta? <Link to="/entrar" className="underline underline-offset-4">Entrar</Link>
        </p>
      </div>
    </PublicLayout>
  );
}
