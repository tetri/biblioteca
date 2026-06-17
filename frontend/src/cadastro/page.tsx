import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';
import api, { getApiErrorMessage } from '../lib/api';
import { ErrorMessage } from '../components/error-message';
import { PublicLayout } from '../components/shared/public-layout';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, CheckCircle2, Library } from "lucide-react";

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        navigate('/entrar');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, navigate]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/user/api/auth/register', { name, email, password });
      setIsSuccess(true);
    } catch (err) {
      setError(getApiErrorMessage(err, t('register.error.defaultMessage')));
    }
  };

  if (isSuccess) {
    return (
      <PublicLayout>
        <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4">
          <div className="w-full max-w-[420px] text-center">
            <div className="inline-flex items-center justify-center p-4 bg-emerald-100 text-emerald-600 rounded-full mb-6">
              <CheckCircle2 className="h-12 w-12" />
            </div>
            <h1 className="text-3xl font-bold mb-4">{t('register.success.title')}</h1>
            <p className="text-muted-foreground mb-8">
              {t('register.success.message')}
            </p>
            <p className="text-sm text-muted-foreground/70">{t('register.success.redirecting')}</p>
          </div>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4">
        <div className="w-full max-w-[420px]">
          <div className="flex flex-col items-center mb-8">
            <div className="size-12 flex items-center justify-center rounded-xl bg-primary text-primary-foreground mb-4">
              <Library className="size-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">{t('register.form.title')}</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {t('register.form.subtitle')}
            </p>
          </div>

          <Card className="border-border shadow-xl shadow-brand-500/5 mesh-card rounded-2xl">
            <CardContent className="p-8">
              {error && <div className="mb-6"><ErrorMessage title={t('register.error.title')} message={error} /></div>}

              <form onSubmit={handleRegister} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">{t('register.form.fullName')}</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder={t('register.form.fullNamePlaceholder')}
                    className="rounded-lg"
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">{t('register.form.email')}</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder={t('register.form.emailPlaceholder')}
                    className="rounded-lg"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">{t('register.form.password')}</Label>
                  <Input
                    id="password"
                    type="password"
                    className="rounded-lg"
                    placeholder={t('register.form.passwordPlaceholder')}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full py-6 rounded-lg text-base font-semibold">
                  {t('register.form.submit')}
                </Button>
              </form>

              <div className="mt-8 text-center text-sm text-muted-foreground">
                {t('register.loginPrompt')}{' '}
                <Link to="/entrar" className="text-primary hover:text-primary/80 font-semibold underline-offset-4 hover:underline">
                  {t('register.loginLink')}
                </Link>
              </div>
            </CardContent>
          </Card>

          <p className="mt-6 text-center text-xs text-muted-foreground/70 leading-relaxed px-4">
            {t('register.termsAgreement')} <Link to="/termos-de-uso" className="underline hover:text-primary">{t('register.termsLink')}</Link> e <Link to="/politica-de-privacidade" className="underline hover:text-primary">{t('register.privacyLink')}</Link>.
          </p>

          <div className="flex justify-center mt-6">
            <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="mr-2 h-4 w-4" /> {t('register.backToHome')}
            </Link>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
