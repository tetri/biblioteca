import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
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
        <h1 className="text-2xl font-bold tracking-tight lg:text-3xl">{t('admin.dashboard.title')}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {t('admin.dashboard.subtitle')}
        </p>
      </div>

      {hasError && (
        <ErrorMessage
          title={t('admin.dashboard.error.title')}
          message={getApiErrorMessage(
            usersQuery.error || booksQuery.error || loansQuery.error,
            t('admin.dashboard.error.message'),
          )}
        />
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          loading={isLoading}
          icon={Users}
          label={t('admin.dashboard.metric.users')}
          value={summary.totalUsers}
          badge={t('admin.dashboard.metric.usersBadge', { count: summary.pendingUsers })}
        />
        <MetricCard
          loading={isLoading}
          icon={BookOpen}
          label={t('admin.dashboard.metric.books')}
          value={summary.totalBooks}
          badge={t('admin.dashboard.metric.booksBadge', { count: summary.availableBooks })}
        />
        <MetricCard
          loading={isLoading}
          icon={Handshake}
          label={t('admin.dashboard.metric.loans')}
          value={summary.totalLoans}
          badge={t('admin.dashboard.metric.loansBadge', { count: summary.activeLoans })}
        />
        <MetricCard
          loading={isLoading}
          icon={Clock3}
          label={t('admin.dashboard.metric.overdue')}
          value={summary.overdueLoans}
          badge={t('admin.dashboard.metric.overdueBadge')}
          danger
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="mesh-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <UserCheck className="size-4 text-primary" />
              {t('admin.dashboard.card.users.title')}
            </CardTitle>
            <CardDescription>
              {t('admin.dashboard.card.users.description')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">{t('admin.dashboard.card.users.totalAdmins')}</span>
              <span className="font-semibold">{summary.admins}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">{t('admin.dashboard.card.users.pending')}</span>
              <Badge variant="outline" className="font-medium">{summary.pendingUsers}</Badge>
            </div>
            <Button asChild variant="outline" className="mt-3 w-full">
              <Link to="/admin/usuarios">{t('admin.dashboard.card.users.action')}</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="mesh-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <TrendingUp className="size-4 text-primary" />
              {t('admin.dashboard.card.catalog.title')}
            </CardTitle>
            <CardDescription>
              {t('admin.dashboard.card.catalog.description')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">{t('admin.dashboard.card.catalog.totalCopies')}</span>
              <span className="font-semibold">{summary.totalCopies}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">{t('admin.dashboard.card.catalog.availableTitles')}</span>
              <Badge variant="secondary" className="font-medium">{summary.availableBooks}</Badge>
            </div>
            <Button asChild variant="outline" className="mt-3 w-full">
              <Link to="/admin/livros">{t('admin.dashboard.card.catalog.action')}</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="mesh-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <LibraryBig className="size-4 text-primary" />
              {t('admin.dashboard.card.loans.title')}
            </CardTitle>
            <CardDescription>
              {t('admin.dashboard.card.loans.description')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">{t('admin.dashboard.card.loans.reservations')}</span>
              <span className="font-semibold">{summary.reservedLoans}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">{t('admin.dashboard.card.loans.overdue')}</span>
              <Badge variant="destructive" className="font-medium">{summary.overdueLoans}</Badge>
            </div>
            <Button asChild variant="outline" className="mt-3 w-full">
              <Link to="/admin/emprestimos">{t('admin.dashboard.card.loans.action')}</Link>
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
