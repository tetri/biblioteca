import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Search, RefreshCw, CheckCircle, Shield, ShieldOff } from 'lucide-react';
import api, { getApiErrorMessage } from '../lib/api';
import { ErrorMessage } from '../components/error-message';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Member';
  isApproved: boolean;
  isSetupRequired: boolean;
};

const QUERY_KEY = ['admin-users'];

export default function AdminUsersPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [approvalFilter, setApprovalFilter] = useState<string>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');
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
      setSuccess('Usuário aprovado com sucesso.');
      await queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
    onError: (mutationError: unknown) => {
      setSuccess(null);
      setError(getApiErrorMessage(mutationError, 'Não foi possível aprovar o usuário.'));
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
      setError(getApiErrorMessage(mutationError, 'Não foi possível atualizar o perfil.'));
    },
  });

  const totalUsers = users.length;
  const approvedUsers = users.filter(u => u.isApproved).length;
  const pendingUsers = totalUsers - approvedUsers;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight lg:text-3xl">Usuários</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Aprove cadastros e controle papéis administrativos.
        </p>
      </div>

      {error && <ErrorMessage title="Erro" message={error} />}
      {success && (
        <div className="rounded-lg border border-border bg-accent px-4 py-3 text-sm font-medium text-accent-foreground">
          {success}
        </div>
      )}

      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="text-xs font-medium uppercase tracking-wider">Total</CardDescription>
            <CardTitle className="flex items-center gap-2 text-xl font-bold">
              {totalUsers}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="text-xs font-medium uppercase tracking-wider">Aprovados</CardDescription>
            <CardTitle className="flex items-center gap-2 text-xl font-bold">
              {approvedUsers}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="text-xs font-medium uppercase tracking-wider">Pendentes</CardDescription>
            <CardTitle className="flex items-center gap-2 text-xl font-bold">
              {pendingUsers}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome ou e-mail"
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Select value={approvalFilter} onValueChange={setApprovalFilter}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Aprovação" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="approved">Aprovados</SelectItem>
                <SelectItem value="pending">Pendentes</SelectItem>
              </SelectContent>
            </Select>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Perfil" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="Member">Membros</SelectItem>
                <SelectItem value="Admin">Admins</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" onClick={() => refetch()} disabled={isFetching}>
              <RefreshCw className={`size-4 ${isFetching ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Usuários cadastrados</CardTitle>
          <CardDescription>Gerencie aprovação e perfil de acesso.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : users.length === 0 ? (
            <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
              Nenhum usuário encontrado para os filtros aplicados.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuário</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Perfil</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => {
                    const changingRoleTo = user.role === 'Admin' ? 'Member' : 'Admin';
                    const isBusy = approveMutation.isPending || roleMutation.isPending;
                    const initials = user.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()
                      .slice(0, 2);

                    return (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar size="sm">
                              <AvatarFallback>{initials}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{user.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{user.email}</TableCell>
                        <TableCell>
                          <Badge variant={user.isApproved ? 'secondary' : 'outline'}>
                            {user.isApproved ? 'Aprovado' : 'Pendente'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.role === 'Admin' ? 'default' : 'secondary'}>
                            {user.role === 'Admin' ? (
                              <Shield className="mr-1 size-3" />
                            ) : (
                              <ShieldOff className="mr-1 size-3" />
                            )}
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            {!user.isApproved && (
                              <Button
                                size="sm"
                                onClick={() => {
                                  setSuccess(null);
                                  approveMutation.mutate(user.id);
                                }}
                                disabled={isBusy}
                              >
                                <CheckCircle className="mr-1 size-3" />
                                Aprovar
                              </Button>
                            )}
                            <Button
                              size="sm"
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
