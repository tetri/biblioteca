import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api, { getApiErrorMessage } from '../lib/api';
import { decodeJwtPayload } from '../lib/utils';
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
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await api.post('/user/api/auth/login', { email, password });

      // Decodificar o payload do token JWT para obter a Role antes de persistir
      const payload = decodeJwtPayload(data.token);

      // Verificar expiração
      if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
        throw new Error("O token de autenticação recebido já está expirado.");
      }

      const role = payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

      if (!role) {
        throw new Error("A role do usuário não foi encontrada no token.");
      }

      localStorage.setItem('token', data.token);

      if (role === 'Admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err: any) {
      setError(getApiErrorMessage(err, 'Nao foi possivel realizar login. Verifique suas credenciais e tente novamente.'));
    } finally {
      setIsLoading(false);
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
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-slate-700">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  className="rounded-lg border-slate-200 focus:ring-indigo-500/20"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-6 rounded-lg text-base font-semibold transition-all"
                disabled={isLoading}
              >
                {isLoading ? 'Entrando...' : 'Entrar'}
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
