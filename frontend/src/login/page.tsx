import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';
import api, { getApiErrorMessage } from '../lib/api';
import { decodeJwtPayload } from '../lib/utils';
import { ErrorMessage } from '../components/error-message';
import { PublicLayout } from '../components/shared/public-layout';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Library } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await api.post('/user/api/auth/login', { email, password });

      const payload = decodeJwtPayload(data.token);
      const exp = payload.exp as number | undefined;

      if (exp && exp < Math.floor(Date.now() / 1000)) {
        throw new Error(t('login.error.expiredToken'));
      }

      const role = payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] as string | undefined;

      if (!role) {
        throw new Error(t('login.error.roleNotFound'));
      }

      localStorage.setItem('token', data.token);

      if (role === 'Admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(getApiErrorMessage(err, t('login.error.defaultMessage')));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PublicLayout>
      <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4">
        <div className="w-full max-w-[420px]">
          <div className="flex flex-col items-center mb-8">
            <div className="size-12 flex items-center justify-center rounded-xl bg-primary text-primary-foreground mb-4">
              <Library className="size-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">{t('login.title')}</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {t('login.subtitle')}
            </p>
          </div>

          <Card className="border-border shadow-xl shadow-brand-500/5 mesh-card rounded-2xl">
            <CardContent className="p-8">
              {error && (
                <div className="mb-6">
                  <ErrorMessage title={t('login.error.title')} message={error} />
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">{t('login.email')}</Label>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder={t('login.emailPlaceholder')}
                    className="rounded-lg"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">{t('login.password')}</Label>
                  <Input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    className="rounded-lg"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full py-6 rounded-lg text-base font-semibold"
                  disabled={isLoading}
                >
                  {isLoading ? t('login.submittingText') : t('login.submitText')}
                </Button>
              </form>

              <div className="mt-8 text-center text-sm text-muted-foreground">
                {t('login.signupPrompt')}{' '}
                <Link to="/cadastro" className="text-primary hover:text-primary/80 font-semibold underline-offset-4 hover:underline">
                  {t('login.signupLink')}
                </Link>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center mt-6">
            <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="mr-2 h-4 w-4" /> {t('login.backToHome')}
            </Link>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
