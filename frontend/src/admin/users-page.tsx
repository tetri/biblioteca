import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api, { getApiErrorMessage } from '../lib/api';
import { ErrorMessage } from '../components/error-message';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Clock3, RefreshCw, Search, UserCheck, Users } from 'lucide-react';

type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Member';
  isApproved: boolean;
  isSetupRequired: boolean;
};

type ApprovalFilter = 'all' | 'approved' | 'pending';
type RoleFilter = 'all' | 'Admin' | 'Member';

const QUERY_KEY = ['admin-users'];

export default function AdminUsersPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [approvalFilter, setApprovalFilter] = useState<ApprovalFilter>('all');
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('all');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    if (search.trim()) params.set('search', search.trim());
    if (approvalFilter === 'approved') params.set('isApproved', 'true');
    if (approvalFilter === 'pending') params.set('isApproved', 'false');
    if (roleFilter !== 'all') params.set('role', roleFilter);
    return params.toString();
  }, [search, approvalFilter, roleFilter]);

  const { data: users = [], isLoading, refetch, isFetching } = useQuery<AdminUser[]>({
    queryKey: [...QUERY_KEY, queryString],
    queryFn: async () => {
      const url = queryString ? `/user/api/users/admin?${queryString}` : '/user/api/users/admin';
      const { data } = await api.get<AdminUser[]>(url);
      return data;
    },
  });

  const approveMutation = useMutation({
    mutationFn: async (userId: string) => {
      await api.patch(`/user/api/users/admin/${userId}/approve`);
    },
    onSuccess: async () => {
      setError(null);
      setSuccess('Usuario aprovado com sucesso.');
      await queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
    onError: (mutationError: unknown) => {
      setSuccess(null);
      setError(getApiErrorMessage(mutationError, 'Nao foi possivel aprovar o usuario.'));
    },
  });

  const roleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: 'Admin' | 'Member' }) => {
      await api.patch(`/user/api/users/admin/${userId}/role`, { role });
    },
    onSuccess: async () => {
      setError(null);
      setSuccess('Perfil de acesso atualizado com sucesso.');
      await queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
    onError: (mutationError: unknown) => {
      setSuccess(null);
      setError(getApiErrorMessage(mutationError, 'Nao foi possivel atualizar o perfil de acesso.'));
    },
  });

  const totalUsers = users.length;
  const approvedUsers = users.filter(u => u.isApproved).length;
  const pendingUsers = totalUsers - approvedUsers;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Gerenciamento de Usuarios</h1>
        <p className="mt-1 text-slate-600">Aprove cadastros e controle papeis administrativos.</p>
      </div>

      {error && <ErrorMessage title="Erro" message={error} />}
      {success && <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-700">{success}</div>}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="border-slate-200 bg-white">
          <CardHeader className="pb-2">
            <CardDescription>Total</CardDescription>
            <CardTitle className="flex items-center gap-2 text-2xl"><Users className="h-5 w-5 text-slate-500" /> {totalUsers}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-slate-200 bg-white">
          <CardHeader className="pb-2">
            <CardDescription>Aprovados</CardDescription>
            <CardTitle className="flex items-center gap-2 text-2xl"><UserCheck className="h-5 w-5 text-emerald-600" /> {approvedUsers}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-slate-200 bg-white">
          <CardHeader className="pb-2">
            <CardDescription>Pendentes</CardDescription>
            <CardTitle className="flex items-center gap-2 text-2xl"><Clock3 className="h-5 w-5 text-amber-600" /> {pendingUsers}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card className="border-slate-200 bg-white">
        <CardContent className="grid gap-4 pt-6 md:grid-cols-3">
          <div className="relative md:col-span-2">
            <label htmlFor="admin-user-search" className="sr-only">Buscar usuarios</label>
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              id="admin-user-search"
              placeholder="Buscar por nome ou e-mail"
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant={approvalFilter === 'all' ? 'default' : 'outline'} onClick={() => setApprovalFilter('all')}>Todos</Button>
            <Button variant={approvalFilter === 'pending' ? 'default' : 'outline'} onClick={() => setApprovalFilter('pending')}>Pendentes</Button>
            <Button variant={approvalFilter === 'approved' ? 'default' : 'outline'} onClick={() => setApprovalFilter('approved')}>Aprovados</Button>
          </div>

          <div className="md:col-span-3 flex items-center justify-between gap-2">
            <div className="flex gap-2">
              <Button variant={roleFilter === 'all' ? 'default' : 'outline'} onClick={() => setRoleFilter('all')}>Todos os perfis</Button>
              <Button variant={roleFilter === 'Member' ? 'default' : 'outline'} onClick={() => setRoleFilter('Member')}>Membros</Button>
              <Button variant={roleFilter === 'Admin' ? 'default' : 'outline'} onClick={() => setRoleFilter('Admin')}>Administradores</Button>
            </div>
            <Button variant="outline" onClick={() => refetch()} disabled={isFetching}>
              <RefreshCw className={`mr-2 h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} /> Atualizar
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-slate-200 bg-white">
        <CardHeader>
          <CardTitle>Usuarios cadastrados</CardTitle>
          <CardDescription>Gerencie aprovacao e perfil de acesso.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {isLoading ? (
            <>
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </>
          ) : users.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-slate-500">Nenhum usuario encontrado para os filtros aplicados.</div>
          ) : (
            users.map((user) => {
              const changingRoleTo = user.role === 'Admin' ? 'Member' : 'Admin';
              const isBusy = approveMutation.isPending || roleMutation.isPending;

              return (
                <div key={user.id} className="rounded-xl border border-slate-200 bg-slate-50/40 p-4 md:p-5">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="font-semibold text-slate-900">{user.name}</p>
                      <p className="text-sm text-slate-600">{user.email}</p>
                      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                        <span className={`rounded-full px-2.5 py-1 ${user.isApproved ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                          {user.isApproved ? 'Aprovado' : 'Pendente'}
                        </span>
                        <span className="rounded-full bg-indigo-100 px-2.5 py-1 text-indigo-700">{user.role}</span>
                        {user.isSetupRequired && <span className="rounded-full bg-slate-200 px-2.5 py-1 text-slate-700">Setup pendente</span>}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 md:justify-end">
                      {!user.isApproved && (
                        <Button
                          onClick={() => {
                            setSuccess(null);
                            approveMutation.mutate(user.id);
                          }}
                          disabled={isBusy}
                          className="bg-emerald-600 text-white hover:bg-emerald-700"
                        >
                          Aprovar Usuario
                        </Button>
                      )}

                      <Button
                        variant="outline"
                        onClick={() => {
                          setSuccess(null);
                          roleMutation.mutate({ userId: user.id, role: changingRoleTo });
                        }}
                        disabled={isBusy}
                      >
                        Tornar {changingRoleTo}
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>
    </div>
  );
}
