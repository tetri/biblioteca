import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api, { getApiErrorMessage } from '../lib/api';
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
  bookTitle?: string;
}

export default function ProfilePage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const messageTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [name, setName] = useState('');
  const [isNameDirty, setIsNameDirty] = useState(false);
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

  const displayName = isNameDirty ? name : (profile?.name ?? '');

  const { data: loans, isLoading: isLoansLoading } = useQuery({
    queryKey: ['my-loans'],
    queryFn: async () => {
      const { data } = await api.get<Loan[]>('/loan/api/loans/my-loans');
      return data;
    }
  });

  const updateMutation = useMutation({
    mutationFn: async () => {
      return api.put('/user/api/users/me', { name: isNameDirty ? name : profile?.name, password: password || undefined });
    },
    onSuccess: async () => {
      scheduleClearMessage(setSuccessMessage, t('profile.success.update'));
      setPassword('');
      await queryClient.invalidateQueries({ queryKey: ['profile'] });
      setIsNameDirty(false);
    },
    onError: (err: Error) => {
      scheduleClearMessage(setErrorMessage, getApiErrorMessage(err, t('profile.error.defaultUpdate')));
    }
  });

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  if (isProfileLoading) return (
    <PublicLayout>
      <div className="max-w-5xl mx-auto px-6 py-12 space-y-8">
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
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">{t('profile.title')}</h1>
            <p className="text-muted-foreground mt-2 text-lg">{t('profile.subtitle')}</p>
          </div>
          <Button variant="outline" className="rounded-xl text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" /> {t('profile.logoutButton')}
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
            <ErrorMessage title={t('profile.error.title')} message={errorMessage} />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-border shadow-sm rounded-2xl overflow-hidden mesh-card">
              <CardHeader className="bg-accent/50">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Settings className="h-4 w-4 text-primary" />
                  {t('profile.personalData.title')}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="name-input" className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{t('profile.personalData.fullName')}</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="name-input"
                        value={displayName}
                        onChange={(e) => {
                          setName(e.target.value);
                          setIsNameDirty(true);
                        }}
                        className="pl-10 bg-accent/30"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email-input" className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{t('profile.personalData.email')}</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email-input"
                        value={profile?.email}
                        disabled
                        className="pl-10 bg-muted cursor-not-allowed text-muted-foreground"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="password-input" className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{t('profile.personalData.newPassword')}</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password-input"
                        type="password"
                        placeholder={t('profile.personalData.passwordPlaceholder')}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 bg-accent/30"
                      />
                    </div>
                  </div>
                </div>
                <Button
                  className="w-full rounded-xl py-6 font-bold"
                  onClick={() => updateMutation.mutate()}
                  disabled={updateMutation.isPending}
                >
                  {updateMutation.isPending ? t('profile.personalData.saving') : t('profile.personalData.updateButton')}
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-2xl font-bold flex items-center gap-3">
              <BookOpen className="h-6 w-6 text-primary" />
              {t('profile.loans.title')}
            </h3>

            {isLoansLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => <Skeleton key={i} className="h-32 w-full rounded-2xl" />)}
              </div>
            ) : loans && loans.length > 0 ? (
              <div className="grid gap-4">
                {loans.map((loan) => (
                  <Card key={loan.id} className="border-border shadow-sm hover:shadow-md transition-shadow rounded-2xl overflow-hidden group mesh-card">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div className="flex gap-4">
                          <div className="bg-accent/50 p-4 rounded-xl flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                            <BookOpen className="h-6 w-6 text-muted-foreground group-hover:text-primary" />
                          </div>
                          <div>
                            <h4 className="font-bold mb-1">{t('profile.loans.loanId', { id: loan.bookId.substring(0, 8) })}</h4>
                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {t('profile.loans.pickupDate', { date: new Date(loan.loanDate).toLocaleDateString() })}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {t('profile.loans.returnDate', { date: new Date(loan.dueDate).toLocaleDateString() })}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                            loan.status === 'Active' ? 'bg-primary/10 text-primary' :
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
              <div className="text-center py-16 mesh-card rounded-3xl border border-dashed border-border">
                <AlertCircle className="h-10 w-10 text-muted-foreground/50 mx-auto mb-4" />
                <h4 className="text-lg font-semibold">{t('profile.loans.empty.title')}</h4>
                <p className="text-muted-foreground mb-6">{t('profile.loans.empty.message')}</p>
                <Button variant="outline" className="rounded-full px-8" asChild>
                  <a href="/catalogo">{t('profile.loans.empty.exploreButton')}</a>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
