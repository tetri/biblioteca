import { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import { ErrorMessage } from '../components/error-message';
import { PublicLayout } from '../components/shared/public-layout';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  User,
  Mail,
  Lock,
  Clock,
  CheckCircle2,
  BookOpen,
  Settings,
  LogOut,
  Calendar,
  AlertCircle
} from "lucide-react";

interface UserProfile {
  id: string;
  name: string;
  email: string;
}

interface Loan {
  id: string;
  bookId: string;
  loanDate: string;
  dueDate: string;
  status: string;
  bookTitle?: string; // We'll try to fetch this if needed, or assume it's in the DTO if backend is updated
}

export default function ProfilePage() {
  const queryClient = useQueryClient();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const messageTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    return () => {
      if (messageTimeoutRef.current) clearTimeout(messageTimeoutRef.current);
    };
  }, []);

  const scheduleClearMessage = (
    setter: (msg: string | null) => void,
    message: string | null
  ) => {
    if (messageTimeoutRef.current) clearTimeout(messageTimeoutRef.current);
    setSuccessMessage(null);
    setErrorMessage(null);
    setter(message);

    messageTimeoutRef.current = setTimeout(() => {
      setter(null);
      messageTimeoutRef.current = null;
    }, 5000);
  };

  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data } = await api.get<UserProfile>('/user/api/users/me');
      return data;
    }
  });

  useEffect(() => {
    if (profile && name === '') {
      setName(profile.name);
    }
  }, [profile, name]);

  const { data: loans, isLoading: isLoansLoading } = useQuery({
    queryKey: ['my-loans'],
    queryFn: async () => {
      const { data } = await api.get<Loan[]>('/loan/api/loans/my-loans');
      return data;
    }
  });

  const updateMutation = useMutation({
    mutationFn: async () => {
      return api.put('/user/api/users/me', { name, password: password || undefined });
    },
    onSuccess: () => {
      scheduleClearMessage(setSuccessMessage, "Perfil atualizado com sucesso!");
      setPassword('');
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
    onError: (err: any) => {
      const errorData = err.response?.data;
      const message = typeof errorData === 'string'
          ? errorData
          : (errorData?.message || err.message || "Erro ao atualizar perfil.");
      scheduleClearMessage(setErrorMessage, message);
    }
  });

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  if (isProfileLoading) return (
    <PublicLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <Skeleton className="h-12 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Skeleton className="h-64 md:col-span-1 rounded-2xl" />
          <Skeleton className="h-96 md:col-span-2 rounded-2xl" />
        </div>
      </div>
    </PublicLayout>
  );

  return (
    <PublicLayout>
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Meu Perfil</h1>
            <p className="text-slate-500 mt-2 text-lg">Gerencie sua conta e acompanhe seus empréstimos.</p>
          </div>
          <Button variant="outline" className="rounded-xl border-slate-200 text-red-600 hover:bg-red-50 hover:text-red-700" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" /> Sair da conta
          </Button>
        </div>

        {successMessage && (
          <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
            <CheckCircle2 className="h-5 w-5" />
            <p className="font-medium">{successMessage}</p>
          </div>
        )}

        {errorMessage && (
          <div className="mb-6">
            <ErrorMessage title="Erro" message={errorMessage} />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar: Personal Info */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-slate-100 shadow-sm rounded-2xl overflow-hidden">
              <CardHeader className="bg-slate-50/50">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Settings className="h-4 w-4 text-indigo-600" />
                  Dados Pessoais
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="name-input" className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nome Completo</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id="name-input"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="pl-10 bg-slate-50/50 border-slate-200"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email-input" className="text-xs font-bold text-slate-500 uppercase tracking-wider">E-mail</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id="email-input"
                        value={profile?.email}
                        disabled
                        className="pl-10 bg-slate-100 border-slate-200 cursor-not-allowed text-slate-500"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="password-input" className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nova Senha</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id="password-input"
                        type="password"
                        placeholder="Deixe em branco para manter"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 bg-slate-50/50 border-slate-200"
                      />
                    </div>
                  </div>
                </div>
                <Button
                  className="w-full bg-indigo-600 hover:bg-indigo-700 rounded-xl py-6 font-bold"
                  onClick={() => updateMutation.mutate()}
                  disabled={updateMutation.isPending}
                >
                  {updateMutation.isPending ? 'Salvando...' : 'Atualizar Perfil'}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content: Loans */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
              <BookOpen className="h-6 w-6 text-indigo-600" />
              Meus Empréstimos e Reservas
            </h3>

            {isLoansLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => <Skeleton key={i} className="h-32 w-full rounded-2xl" />)}
              </div>
            ) : loans && loans.length > 0 ? (
              <div className="grid gap-4">
                {loans.map((loan) => (
                  <Card key={loan.id} className="border-slate-100 shadow-sm hover:shadow-md transition-shadow rounded-2xl overflow-hidden group">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div className="flex gap-4">
                          <div className="bg-slate-50 p-4 rounded-xl flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
                            <BookOpen className="h-6 w-6 text-slate-400 group-hover:text-indigo-600" />
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-900 mb-1">Livro ID: {loan.bookId.substring(0, 8)}...</h4>
                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                Retirada: {new Date(loan.loanDate).toLocaleDateString()}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                Devolução: {new Date(loan.dueDate).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                            loan.status === 'Active' ? 'bg-indigo-100 text-indigo-700' :
                            loan.status === 'Reserved' ? 'bg-amber-100 text-amber-700' :
                            loan.status === 'Overdue' ? 'bg-red-100 text-red-700' :
                            'bg-emerald-100 text-emerald-700'
                          }`}>
                            {loan.status}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                <AlertCircle className="h-10 w-10 text-slate-300 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-slate-900">Nenhum registro encontrado</h4>
                <p className="text-slate-500 mb-6">Você ainda não realizou nenhum empréstimo ou reserva.</p>
                <Button variant="outline" className="rounded-full px-8" asChild>
                  <a href="/catalogo">Explorar Catálogo</a>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
