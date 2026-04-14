import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Shield, Users, BookOpen, Settings, ArrowLeft } from "lucide-react";
import { ErrorMessage } from '../components/error-message';

export default function AdminPage() {
  const navigate = useNavigate();
  const [notice, setNotice] = useState<string | null>(null);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const handlePlaceholderClick = (feature: string) => {
    setNotice(`${feature} será implementado em breve.`);
    setTimeout(() => setNotice(null), 5000);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        {notice && (
          <div className="mb-6 animate-in fade-in slide-in-from-top-4">
            <ErrorMessage title="Aviso" message={notice} />
          </div>
        )}

        <div className="flex justify-between items-center mb-8">
          <div>
            <Link to="/" className="inline-flex items-center text-sm text-slate-500 hover:text-slate-900 mb-4 transition-colors">
              <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para o início
            </Link>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
              <Shield className="h-8 w-8 text-indigo-600" />
              Painel Administrativo
            </h1>
          </div>
          <Button
            variant="outline"
            className="rounded-full"
            onClick={handleLogout}
          >
            Sair do Painel
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-none shadow-sm bg-white">
            <CardHeader>
              <Users className="h-8 w-8 text-blue-500 mb-2" />
              <CardTitle>Usuários</CardTitle>
              <CardDescription>Gerenciar membros e permissões.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                className="w-full justify-start"
                variant="ghost"
                onClick={() => handlePlaceholderClick('Gerenciamento de usuários')}
              >
                Ver todos os usuários
              </Button>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-white">
            <CardHeader>
              <BookOpen className="h-8 w-8 text-green-500 mb-2" />
              <CardTitle>Catálogo</CardTitle>
              <CardDescription>Adicionar ou editar livros no sistema.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                className="w-full justify-start"
                variant="ghost"
                onClick={() => navigate('/catalogo')}
              >
                Gerenciar livros
              </Button>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-white">
            <CardHeader>
              <Settings className="h-8 w-8 text-orange-500 mb-2" />
              <CardTitle>Configurações</CardTitle>
              <CardDescription>Ajustes globais do sistema de biblioteca.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                className="w-full justify-start"
                variant="ghost"
                onClick={() => handlePlaceholderClick('Configurações do sistema')}
              >
                Preferências do sistema
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="bg-indigo-600 rounded-2xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-2">Bem-vindo, Administrador!</h2>
          <p className="opacity-90 mb-6">Este é o seu centro de comando. Aqui você pode supervisionar toda a operação da biblioteca.</p>
          <div className="flex gap-4">
            <Button
              variant="secondary"
              className="bg-white text-indigo-600 hover:bg-slate-100"
              onClick={() => handlePlaceholderClick('Relatórios')}
            >
              Relatórios Mensais
            </Button>
            <Button
              variant="ghost"
              className="text-white hover:bg-indigo-500 border border-indigo-400"
              onClick={() => handlePlaceholderClick('Atividade Recente')}
            >
              Ver Atividade Recente
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
