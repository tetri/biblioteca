import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../lib/api';
import { ErrorMessage } from '../components/error-message';
import { PublicLayout } from '../components/shared/public-layout';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

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
      setError(err.response?.data?.message || 'Credenciais inválidas. Por favor, tente novamente.');
    }
  };

  return (
    <PublicLayout>
      <div className="max-w-[400px] mx-auto">
        <Link to="/" className="inline-flex items-center text-sm text-slate-500 hover:text-slate-900 mb-8 transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para o início
        </Link>
        
        <Card className="border-slate-100 shadow-xl shadow-slate-200/50 rounded-2xl overflow-hidden">
          <CardHeader className="space-y-1 pt-8 px-8">
            <CardTitle className="text-2xl font-bold tracking-tight">Bem-vindo de volta</CardTitle>
            <CardDescription className="text-slate-500">
              Entre com suas credenciais para acessar sua conta.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            {error && <div className="mb-6"><ErrorMessage title="Erro de Login" message={error} /></div>}

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-slate-700">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="nome@exemplo.com"
                  className="rounded-lg border-slate-200 focus:ring-indigo-500/20"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password" name="password" className="text-sm font-medium text-slate-700">Senha</Label>
                  <a href="#" className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">Esqueceu a senha?</a>
                </div>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  className="rounded-lg border-slate-200 focus:ring-indigo-500/20"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-6 rounded-lg text-base font-semibold transition-all">
                Entrar
              </Button>
            </form>

            <div className="mt-8 text-center text-sm text-slate-500">
              Não possui uma conta?{' '}
              <Link to="/cadastro" className="text-indigo-600 hover:text-indigo-700 font-semibold underline-offset-4 hover:underline">
                Cadastre-se gratuitamente
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </PublicLayout>
  );
}
