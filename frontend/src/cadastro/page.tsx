import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api, { getApiErrorMessage } from '../lib/api';
import { ErrorMessage } from '../components/error-message';
import { PublicLayout } from '../components/shared/public-layout';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, CheckCircle2, Library } from "lucide-react";

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
      await api.post('/user/api/auth/register', { name, email, password });
      setIsSuccess(true);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Não foi possível concluir o cadastro. Tente novamente.'));
    }
  };

  if (isSuccess) {
    return (
      <PublicLayout>
        <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4">
          <div className="w-full max-w-[420px] text-center">
            <div className="inline-flex items-center justify-center p-4 bg-emerald-100 text-emerald-600 rounded-full mb-6">
              <CheckCircle2 className="h-12 w-12" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Cadastro Realizado!</h1>
            <p className="text-muted-foreground mb-8">
              Sua conta foi criada com sucesso. Aguarde a aprovação do administrador para começar a usar o sistema.
            </p>
            <p className="text-sm text-muted-foreground/70">Redirecionando para o login em instantes...</p>
          </div>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4">
        <div className="w-full max-w-[420px]">
          <div className="flex flex-col items-center mb-8">
            <div className="size-12 flex items-center justify-center rounded-xl bg-primary text-primary-foreground mb-4">
              <Library className="size-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Criar sua conta</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Junte-se à nossa comunidade de leitores hoje mesmo.
            </p>
          </div>

          <Card className="border-border shadow-xl shadow-brand-500/5 mesh-card rounded-2xl">
            <CardContent className="p-8">
              {error && <div className="mb-6"><ErrorMessage title="Erro de Cadastro" message={error} /></div>}

              <form onSubmit={handleRegister} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">Nome completo</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Ex: João Silva"
                    className="rounded-lg"
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">E-mail corporativo ou pessoal</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="nome@exemplo.com"
                    className="rounded-lg"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    className="rounded-lg"
                    placeholder="Mínimo 8 caracteres"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full py-6 rounded-lg text-base font-semibold">
                  Criar Conta
                </Button>
              </form>

              <div className="mt-8 text-center text-sm text-muted-foreground">
                Já possui uma conta?{' '}
                <Link to="/entrar" className="text-primary hover:text-primary/80 font-semibold underline-offset-4 hover:underline">
                  Fazer login
                </Link>
              </div>
            </CardContent>
          </Card>

          <p className="mt-6 text-center text-xs text-muted-foreground/70 leading-relaxed px-4">
            Ao se cadastrar, você concorda com nossos <Link to="/termos-de-uso" className="underline hover:text-primary">Termos de Uso</Link> e <Link to="/politica-de-privacidade" className="underline hover:text-primary">Política de Privacidade</Link>.
          </p>

          <div className="flex justify-center mt-6">
            <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para o início
            </Link>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
