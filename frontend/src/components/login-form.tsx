import { cn } from "@/lib/utils"
import { useTranslation, Trans } from 'react-i18next';
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { t } = useTranslation();
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">{t('loginForm.title')}</h1>
                <p className="text-muted-foreground text-balance">
                  {t('loginForm.subtitle')}
                </p>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="email">{t('loginForm.email')}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t('loginForm.emailPlaceholder')}
                  required
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">{t('loginForm.password')}</Label>
                  <a
                    href="#"
                    className="ml-auto text-sm underline-offset-2 hover:underline"
                  >
                    {t('loginForm.forgotPassword')}
                  </a>
                </div>
                <Input id="password" type="password" required />
              </div>
              <Button type="submit" className="w-full">
                {t('loginForm.submitText')}
              </Button>
              <div className="text-center text-sm">
                {t('loginForm.signupPrompt')}{" "}
                <a href="#" className="underline underline-offset-4">
                  {t('loginForm.signupLink')}
                </a>
              </div>
            </div>
          </form>
          <div className="bg-muted relative hidden md:block">
            <img
              src="/inaki-del-olmo-NIJuEQw0RKg-unsplash.jpg"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        <Trans i18nKey="loginForm.footer">
          Ao prosseguir, você concorda com nossos <a href="/termos-de-uso">Termos de Uso</a> e <a href="/politica-de-privacidade">Política de Privacidade</a>.
        </Trans>
      </div>
    </div>
  )
}
