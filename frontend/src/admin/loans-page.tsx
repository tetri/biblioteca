import { useMemo, useState, type ComponentType } from 'react';
import { useQuery } from '@tanstack/react-query';
import api, { getApiErrorMessage } from '../lib/api';
import { ErrorMessage } from '../components/error-message';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Clock3, Handshake, RotateCcw, TriangleAlert } from 'lucide-react';

type Loan = {
  id: string;
  userId: string;
  bookId: string;
  loanDate: string;
  dueDate: string;
  status: 'Reserved' | 'Active' | 'Returned' | 'Overdue' | string;
};

type StatusFilter = 'all' | 'Reserved' | 'Active' | 'Returned' | 'Overdue';

export default function AdminLoansPage() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  const { data: loans = [], isLoading, error, refetch, isFetching } = useQuery<Loan[]>({
    queryKey: ['admin-loans'],
    queryFn: async () => (await api.get('/loan/api/loans/admin')).data,
  });

  const filteredLoans = useMemo(() => {
    if (statusFilter === 'all') return loans;
    return loans.filter((l) => l.status === statusFilter);
  }, [loans, statusFilter]);

  const metrics = useMemo(() => {
    return {
      total: loans.length,
      active: loans.filter(l => l.status === 'Active').length,
      reserved: loans.filter(l => l.status === 'Reserved').length,
      overdue: loans.filter(l => l.status === 'Overdue').length,
    };
  }, [loans]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Gerenciamento de Emprestimos</h1>
          <p className="mt-1 text-slate-600">Monitore reservas, emprestimos ativos e situacoes de atraso.</p>
        </div>
        <Button variant="outline" onClick={() => refetch()} disabled={isFetching}>
          <RotateCcw className={`mr-2 h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} /> Atualizar
        </Button>
      </div>

      {error && (
        <ErrorMessage
          title="Erro"
          message={getApiErrorMessage(error, 'Nao foi possivel carregar os emprestimos administrativos.')}
        />
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <LoanStatCard icon={Handshake} title="Total" value={metrics.total} />
        <LoanStatCard icon={Clock3} title="Ativos" value={metrics.active} />
        <LoanStatCard icon={RotateCcw} title="Reservas" value={metrics.reserved} />
        <LoanStatCard icon={TriangleAlert} title="Atrasados" value={metrics.overdue} danger />
      </div>

      <Card className="border-slate-200 bg-white">
        <CardContent className="flex flex-wrap gap-2 pt-6">
          {(['all', 'Reserved', 'Active', 'Returned', 'Overdue'] as const).map((status) => (
            <Button
              key={status}
              variant={statusFilter === status ? 'default' : 'outline'}
              onClick={() => setStatusFilter(status)}
            >
              {status === 'all' ? 'Todos' : status}
            </Button>
          ))}
        </CardContent>
      </Card>

      <Card className="border-slate-200 bg-white">
        <CardHeader>
          <CardTitle>Registros de emprestimos</CardTitle>
          <CardDescription>{filteredLoans.length} item(ns) para o filtro selecionado.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {isLoading ? (
            <>
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </>
          ) : filteredLoans.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-slate-500">Nenhum emprestimo encontrado.</div>
          ) : (
            filteredLoans.map((loan) => (
              <div key={loan.id} className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-slate-50/40 p-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-semibold text-slate-900">Emprestimo {loan.id.slice(0, 8)}</p>
                  <p className="text-sm text-slate-600">Usuario: {loan.userId.slice(0, 8)} • Livro: {loan.bookId.slice(0, 8)}</p>
                  <p className="text-xs text-slate-500">Emprestimo: {new Date(loan.loanDate).toLocaleDateString()} • Vencimento: {new Date(loan.dueDate).toLocaleDateString()}</p>
                </div>
                <span className={`inline-flex w-fit rounded-full px-2.5 py-1 text-xs font-semibold ${loan.status === 'Overdue' ? 'bg-red-100 text-red-700' : loan.status === 'Active' ? 'bg-indigo-100 text-indigo-700' : loan.status === 'Reserved' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                  {loan.status}
                </span>
              </div>
            ))
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
  icon: ComponentType<{ className?: string }>;
  title: string;
  value: number;
  danger?: boolean;
}) {
  return (
    <Card className="border-slate-200 bg-white">
      <CardHeader>
        <CardDescription>{title}</CardDescription>
        <CardTitle className="flex items-center gap-2 text-3xl font-bold text-slate-900">
          <Icon className={danger ? 'h-5 w-5 text-red-600' : 'h-5 w-5 text-indigo-600'} />
          {value}
        </CardTitle>
      </CardHeader>
    </Card>
  );
}
