import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { BookOpen, Clock3, Handshake, LibraryBig, TrendingUp, UserCheck, Users } from 'lucide-react';
import api, { getApiErrorMessage } from '../lib/api';
import { ErrorMessage } from '../components/error-message';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

type AdminUser = { id: string; isApproved: boolean; role: 'Admin' | 'Member' };
type Book = { id: string; availableCopies: number; totalCopies: number };
type Loan = { id: string; status: string };

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
        <h1 className="text-2xl font-bold tracking-tight lg:text-3xl">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Visão consolidada dos principais indicadores operacionais.
        </p>
      </div>

      {hasError && (
        <ErrorMessage
          title="Erro ao carregar indicadores"
          message={getApiErrorMessage(
            usersQuery.error || booksQuery.error || loansQuery.error,
            'Não foi possível carregar o dashboard.',
          )}
        />
      )}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MetricCard
          loading={isLoading}
          icon={Users}
          label="Usuários"
          value={summary.totalUsers}
          badge={`${summary.pendingUsers} pendentes`}
        />
        <MetricCard
          loading={isLoading}
          icon={BookOpen}
          label="Livros"
          value={summary.totalBooks}
          badge={`${summary.availableBooks} disponíveis`}
        />
        <MetricCard
          loading={isLoading}
          icon={Handshake}
          label="Empréstimos"
          value={summary.totalLoans}
          badge={`${summary.activeLoans} ativos`}
        />
        <MetricCard
          loading={isLoading}
          icon={Clock3}
          label="Atrasos"
          value={summary.overdueLoans}
          badge="empréstimos em atraso"
          danger
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="mesh-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <UserCheck className="size-4 text-primary" />
              Usuários
            </CardTitle>
            <CardDescription>
              Controle de cadastro e perfis administrativos.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Total de admins</span>
              <span className="font-semibold">{summary.admins}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Pendentes</span>
              <Badge variant="outline" className="font-medium">{summary.pendingUsers}</Badge>
            </div>
            <Button asChild variant="outline" className="mt-3 w-full">
              <Link to="/admin/usuarios">Gerenciar usuários</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="mesh-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <TrendingUp className="size-4 text-primary" />
              Catálogo
            </CardTitle>
            <CardDescription>
              Saúde do acervo e disponibilidade de exemplares.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Total de exemplares</span>
              <span className="font-semibold">{summary.totalCopies}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Títulos disponíveis</span>
              <Badge variant="secondary" className="font-medium">{summary.availableBooks}</Badge>
            </div>
            <Button asChild variant="outline" className="mt-3 w-full">
              <Link to="/admin/livros">Gerenciar livros</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="mesh-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <LibraryBig className="size-4 text-primary" />
              Empréstimos
            </CardTitle>
            <CardDescription>
              Monitoramento de operação e risco de atraso.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Reservas</span>
              <span className="font-semibold">{summary.reservedLoans}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Em atraso</span>
              <Badge variant="destructive" className="font-medium">{summary.overdueLoans}</Badge>
            </div>
            <Button asChild variant="outline" className="mt-3 w-full">
              <Link to="/admin/emprestimos">Gerenciar empréstimos</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function MetricCard({
  loading,
  icon: Icon,
  label,
  value,
  badge,
  danger,
}: {
  loading: boolean;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  badge: string;
  danger?: boolean;
}) {
  if (loading) {
    return (
      <Card className="mesh-card">
        <CardHeader className="space-y-2 pb-3">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-8 w-12" />
          <Skeleton className="h-3 w-28" />
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="mesh-card">
      <CardHeader className="pb-3">
        <CardDescription className="text-xs font-medium uppercase tracking-wider">
          {label}
        </CardDescription>
        <CardTitle className="flex items-center gap-2 text-2xl font-bold lg:text-3xl">
          <Icon className={`size-5 ${danger ? 'text-destructive' : 'text-primary'}`} />
          {value}
        </CardTitle>
        <p className={`text-xs ${danger ? 'text-destructive' : 'text-muted-foreground'}`}>
          {badge}
        </p>
      </CardHeader>
    </Card>
  );
}
