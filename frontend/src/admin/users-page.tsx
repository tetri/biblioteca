import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();

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
      setSuccess(t('admin.users.success.approved'));
      await queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
    onError: (mutationError: unknown) => {
      setSuccess(null);
      setError(getApiErrorMessage(mutationError, t('admin.users.errorMessages.approve')));
    },
  });

  const roleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: 'Admin' | 'Member' }) => {
      await api.patch(`/user/api/users/admin/${userId}/role`, { role });
    },
    onSuccess: async () => {
      setError(null);
      setSuccess(t('admin.users.success.roleUpdated'));
      await queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
    onError: (mutationError: unknown) => {
      setSuccess(null);
      setError(getApiErrorMessage(mutationError, t('admin.users.errorMessages.updateRole')));
    },
  });

  const totalUsers = users.length;
  const approvedUsers = users.filter(u => u.isApproved).length;
  const pendingUsers = totalUsers - approvedUsers;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight lg:text-3xl">{t('admin.users.title')}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {t('admin.users.subtitle')}
        </p>
      </div>

      {error && <ErrorMessage title={t('admin.users.error.title')} message={error} />}
      {success && (
        <div className="rounded-lg border border-border bg-accent px-4 py-3 text-sm font-medium text-accent-foreground">
          {success}
        </div>
      )}

      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="text-xs font-medium uppercase tracking-wider">{t('admin.users.stats.total')}</CardDescription>
            <CardTitle className="flex items-center gap-2 text-xl font-bold">
              {totalUsers}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="text-xs font-medium uppercase tracking-wider">{t('admin.users.stats.approved')}</CardDescription>
            <CardTitle className="flex items-center gap-2 text-xl font-bold">
              {approvedUsers}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="text-xs font-medium uppercase tracking-wider">{t('admin.users.stats.pending')}</CardDescription>
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
              placeholder={t('admin.users.searchPlaceholder')}
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Select value={approvalFilter} onValueChange={setApprovalFilter}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder={t('admin.users.filter.approval')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('admin.users.filter.all')}</SelectItem>
                <SelectItem value="approved">{t('admin.users.filter.approved')}</SelectItem>
                <SelectItem value="pending">{t('admin.users.filter.pending')}</SelectItem>
              </SelectContent>
            </Select>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder={t('admin.users.filter.role')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('admin.users.filter.all')}</SelectItem>
                <SelectItem value="Member">{t('admin.users.filter.members')}</SelectItem>
                <SelectItem value="Admin">{t('admin.users.filter.admins')}</SelectItem>
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
          <CardTitle className="text-base font-semibold">{t('admin.users.table.title')}</CardTitle>
          <CardDescription>{t('admin.users.table.description')}</CardDescription>
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
              {t('admin.users.table.empty')}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('admin.users.table.header.user')}</TableHead>
                    <TableHead>{t('admin.users.table.header.email')}</TableHead>
                    <TableHead>{t('admin.users.table.header.status')}</TableHead>
                    <TableHead>{t('admin.users.table.header.role')}</TableHead>
                    <TableHead className="text-right">{t('admin.users.table.header.actions')}</TableHead>
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
                            {user.isApproved ? t('admin.users.table.status.approved') : t('admin.users.table.status.pending')}
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
                                {t('admin.users.table.action.approve')}
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
                              {t('admin.users.table.action.make', { role: changingRoleTo })}
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
