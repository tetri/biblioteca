import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../lib/api';
import { ErrorMessage } from '../components/error-message';
import { PublicLayout } from '../components/shared/public-layout';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        navigate('/entrar');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, navigate]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/api/auth/register', { name, email, password });
      setIsSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao realizar cadastro. Tente outro e-mail.');
    }
  };

  if (isSuccess) {
    return (
      <PublicLayout>
        <div className="max-w-[400px] mx-auto text-center py-12">
          <div className="inline-flex items-center justify-center p-4 bg-green-50 text-green-600 rounded-full mb-6">
            <CheckCircle2 className="h-12 w-12" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Cadastro Realizado!</h1>
          <p className="text-slate-600 mb-8">
            Sua conta foi criada com sucesso. Aguarde a aprovação do administrador para começar a usar o sistema.
          </p>
          <p className="text-sm text-slate-400">Redirecionando para o login em instantes...</p>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="max-w-[400px] mx-auto">
        <Link to="/" className="inline-flex items-center text-sm text-slate-500 hover:text-slate-900 mb-8 transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para o início
        </Link>
        
        <Card className="border-slate-100 shadow-xl shadow-slate-200/50 rounded-2xl overflow-hidden">
          <CardHeader className="space-y-1 pt-8 px-8">
            <CardTitle className="text-2xl font-bold tracking-tight">Criar sua conta</CardTitle>
            <CardDescription className="text-slate-500">
              Junte-se à nossa comunidade de leitores hoje mesmo.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            {error && <div className="mb-6"><ErrorMessage title="Erro de Cadastro" message={error} /></div>}

            <form onSubmit={handleRegister} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-slate-700">Nome completo</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Ex: João Silva"
                  className="rounded-lg border-slate-200 focus:ring-indigo-500/20"
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-slate-700">E-mail corporativo ou pessoal</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="nome@exemplo.com"
                  className="rounded-lg border-slate-200 focus:ring-indigo-500/20"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-slate-700">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  className="rounded-lg border-slate-200 focus:ring-indigo-500/20"
                  placeholder="Mínimo 8 caracteres"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-6 rounded-lg text-base font-semibold transition-all">
                Criar Conta
              </Button>
            </form>

            <div className="mt-8 text-center text-sm text-slate-500">
              Já possui uma conta?{' '}
              <Link to="/entrar" className="text-indigo-600 hover:text-indigo-700 font-semibold underline-offset-4 hover:underline">
                Fazer login
              </Link>
            </div>
          </CardContent>
        </Card>

        <p className="mt-8 text-center text-xs text-slate-400 leading-relaxed px-4">
          Ao se cadastrar, você concorda com nossos <Link to="/termos-de-uso" className="underline">Termos de Uso</Link> e <Link to="/politica-de-privacidade" className="underline">Política de Privacidade</Link>.
        </p>
      </div>
    </PublicLayout>
  );
}
