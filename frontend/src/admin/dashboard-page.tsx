import { useMemo, type ComponentType } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { BookOpen, Clock3, Handshake, TrendingUp, UserCheck, Users } from 'lucide-react';
import api, { getApiErrorMessage } from '../lib/api';
import { ErrorMessage } from '../components/error-message';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

type AdminUser = {
  id: string;
  isApproved: boolean;
  role: 'Admin' | 'Member';
};

type Book = {
  id: string;
  availableCopies: number;
  totalCopies: number;
};

type Loan = {
  id: string;
  status: 'Reserved' | 'Active' | 'Returned' | 'Overdue' | string;
};

export default function AdminDashboardPage() {
  const usersQuery = useQuery<AdminUser[]>({
    queryKey: ['admin-dashboard-users'],
    queryFn: async () => (await api.get('/user/api/users/admin')).data,
  });

  const booksQuery = useQuery<Book[]>({
    queryKey: ['admin-dashboard-books'],
    queryFn: async () => (await api.get('/catalog/api/catalog/books')).data,
  });

  const loansQuery = useQuery<Loan[]>({
    queryKey: ['admin-dashboard-loans'],
    queryFn: async () => (await api.get('/loan/api/loans/admin')).data,
  });

  const isLoading = usersQuery.isLoading || booksQuery.isLoading || loansQuery.isLoading;
  const hasError = usersQuery.isError || booksQuery.isError || loansQuery.isError;

  const summary = useMemo(() => {
    const users = usersQuery.data ?? [];
    const books = booksQuery.data ?? [];
    const loans = loansQuery.data ?? [];

    return {
      totalUsers: users.length,
      pendingUsers: users.filter(u => !u.isApproved).length,
      admins: users.filter(u => u.role === 'Admin').length,
      totalBooks: books.length,
      availableBooks: books.filter(b => b.availableCopies > 0).length,
      totalCopies: books.reduce((acc, b) => acc + (b.totalCopies || 0), 0),
      activeLoans: loans.filter(l => l.status === 'Active').length,
      reservedLoans: loans.filter(l => l.status === 'Reserved').length,
      overdueLoans: loans.filter(l => l.status === 'Overdue').length,
      totalLoans: loans.length,
    };
  }, [usersQuery.data, booksQuery.data, loansQuery.data]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard Administrativo</h1>
        <p className="mt-1 text-slate-600">Visao consolidada dos principais indicadores operacionais.</p>
      </div>

      {hasError && (
        <ErrorMessage
          title="Erro ao carregar indicadores"
          message={getApiErrorMessage(usersQuery.error || booksQuery.error || loansQuery.error, 'Nao foi possivel carregar o dashboard administrativo.')}
        />
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard loading={isLoading} icon={Users} title="Usuarios" value={summary.totalUsers} description={`${summary.pendingUsers} pendentes de aprovacao`} />
        <MetricCard loading={isLoading} icon={BookOpen} title="Livros" value={summary.totalBooks} description={`${summary.availableBooks} com disponibilidade`} />
        <MetricCard loading={isLoading} icon={Handshake} title="Emprestimos" value={summary.totalLoans} description={`${summary.activeLoans} ativos`} />
        <MetricCard loading={isLoading} icon={Clock3} title="Atrasos" value={summary.overdueLoans} description="emprestimos com status Overdue" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="border-slate-200 bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg"><UserCheck className="h-5 w-5 text-indigo-600" /> Usuarios</CardTitle>
            <CardDescription>Controle de cadastro e perfis administrativos.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-slate-600">
            <p>Total de admins: <strong className="text-slate-900">{summary.admins}</strong></p>
            <p>Pendentes: <strong className="text-amber-700">{summary.pendingUsers}</strong></p>
            <Button asChild className="mt-2 w-full"><Link to="/admin/usuarios">Ir para gerenciamento de usuarios</Link></Button>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg"><TrendingUp className="h-5 w-5 text-indigo-600" /> Catalogo</CardTitle>
            <CardDescription>Saude do acervo e disponibilidade de exemplares.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-slate-600">
            <p>Total de exemplares: <strong className="text-slate-900">{summary.totalCopies}</strong></p>
            <p>Titulos disponiveis: <strong className="text-emerald-700">{summary.availableBooks}</strong></p>
            <Button asChild className="mt-2 w-full"><Link to="/admin/livros">Ir para gerenciamento de livros</Link></Button>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg"><Handshake className="h-5 w-5 text-indigo-600" /> Emprestimos</CardTitle>
            <CardDescription>Monitoramento de operacao e risco de atraso.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-slate-600">
            <p>Reservas: <strong className="text-indigo-700">{summary.reservedLoans}</strong></p>
            <p>Em atraso: <strong className="text-red-700">{summary.overdueLoans}</strong></p>
            <Button asChild className="mt-2 w-full"><Link to="/admin/emprestimos">Ir para gerenciamento de emprestimos</Link></Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function MetricCard({
  loading,
  icon: Icon,
  title,
  value,
  description,
}: {
  loading: boolean;
  icon: ComponentType<{ className?: string }>;
  title: string;
  value: number;
  description: string;
}) {
  if (loading) {
    return (
      <Card className="border-slate-200 bg-white">
        <CardHeader className="space-y-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-3 w-40" />
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="border-slate-200 bg-white">
      <CardHeader>
        <CardDescription>{title}</CardDescription>
        <CardTitle className="flex items-center gap-2 text-3xl font-bold text-slate-900">
          <Icon className="h-5 w-5 text-indigo-600" />
          {value}
        </CardTitle>
        <p className="text-sm text-slate-500">{description}</p>
      </CardHeader>
    </Card>
  );
}
