import { useMemo, useState, type ComponentType } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { RotateCcw } from 'lucide-react';
import api, { getApiErrorMessage } from '../lib/api';
import { ErrorMessage } from '../components/error-message';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

type Loan = {
  id: string;
  userId: string;
  bookId: string;
  loanDate: string;
  dueDate: string;
  status: string;
};

type StatusMap = Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }>;

export default function AdminLoansPage() {
  const { t } = useTranslation();
  const [statusTab, setStatusTab] = useState('all');

  const STATUS_CONFIG: StatusMap = {
    Active: { label: t('admin.loans.status.active'), variant: 'default' },
    Reserved: { label: t('admin.loans.status.reserved'), variant: 'secondary' },
    Returned: { label: t('admin.loans.status.returned'), variant: 'outline' },
    Overdue: { label: t('admin.loans.status.overdue'), variant: 'destructive' },
  };

  const statusTabs = [
    { value: 'all', label: t('admin.loans.tabs.all') },
    { value: 'Active', label: t('admin.loans.tabs.active') },
    { value: 'Reserved', label: t('admin.loans.tabs.reserved') },
    { value: 'Overdue', label: t('admin.loans.tabs.overdue') },
    { value: 'Returned', label: t('admin.loans.tabs.returned') },
  ];

  const { data: loans = [], isLoading, error, refetch, isFetching } = useQuery<Loan[]>({
    queryKey: ['admin-loans'],
    queryFn: async () => (await api.get('/loan/api/loans/admin')).data,
  });

  const filteredLoans = useMemo(() => {
    if (statusTab === 'all') return loans;
    return loans.filter((l) => l.status === statusTab);
  }, [loans, statusTab]);

  const metrics = useMemo(() => ({
    total: loans.length,
    active: loans.filter(l => l.status === 'Active').length,
    reserved: loans.filter(l => l.status === 'Reserved').length,
    overdue: loans.filter(l => l.status === 'Overdue').length,
  }), [loans]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight lg:text-3xl">{t('admin.loans.title')}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {t('admin.loans.subtitle')}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching}>
          <RotateCcw className={`mr-2 size-3 ${isFetching ? 'animate-spin' : ''}`} />
          {t('admin.loans.refreshButton')}
        </Button>
      </div>

      {error && (
        <ErrorMessage
          title={t('admin.loans.error.title')}
          message={getApiErrorMessage(error, t('admin.loans.error.message'))}
        />
      )}

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <LoanStatCard title={t('admin.loans.stats.total')} value={metrics.total} />
        <LoanStatCard title={t('admin.loans.stats.active')} value={metrics.active} />
        <LoanStatCard title={t('admin.loans.stats.reservations')} value={metrics.reserved} />
        <LoanStatCard title={t('admin.loans.stats.overdue')} value={metrics.overdue} danger />
      </div>

      <Card>
        <CardHeader className="pb-0">
          <Tabs value={statusTab} onValueChange={setStatusTab}>
            <TabsList>
              {statusTabs.map((tab) => (
                <TabsTrigger key={tab.value} value={tab.value}>
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent className="pt-4">
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : filteredLoans.length === 0 ? (
            <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
              {t('admin.loans.table.empty')}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('admin.loans.table.header.id')}</TableHead>
                    <TableHead>{t('admin.loans.table.header.user')}</TableHead>
                    <TableHead>{t('admin.loans.table.header.book')}</TableHead>
                    <TableHead>{t('admin.loans.table.header.loanDate')}</TableHead>
                    <TableHead>{t('admin.loans.table.header.dueDate')}</TableHead>
                    <TableHead>{t('admin.loans.table.header.status')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLoans.map((loan) => {
                    const config = STATUS_CONFIG[loan.status] ?? { label: loan.status, variant: 'outline' as const };
                    return (
                      <TableRow key={loan.id}>
                        <TableCell className="font-mono text-xs font-medium">
                          {loan.id.slice(0, 8)}
                        </TableCell>
                        <TableCell className="font-mono text-xs text-muted-foreground">
                          {loan.userId.slice(0, 8)}
                        </TableCell>
                        <TableCell className="font-mono text-xs text-muted-foreground">
                          {loan.bookId.slice(0, 8)}
                        </TableCell>
                        <TableCell className="text-sm">
                          {new Date(loan.loanDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-sm">
                          {new Date(loan.dueDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Badge variant={config.variant}>{config.label}</Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function LoanStatCard({
  icon: Icon,
  title,
  value,
  danger,
}: {
  icon?: ComponentType<{ className?: string }>;
  title: string;
  value: number;
  danger?: boolean;
}) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardDescription className="text-xs font-medium uppercase tracking-wider">
          {title}
        </CardDescription>
        <CardTitle className={`text-2xl font-bold ${danger ? 'text-destructive' : ''}`}>
          {Icon && <Icon className={`mr-2 inline size-5 ${danger ? 'text-destructive' : 'text-primary'}`} />}
          {value}
        </CardTitle>
      </CardHeader>
    </Card>
  );
}
