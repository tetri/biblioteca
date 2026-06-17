import { PublicLayout } from '../components/shared/public-layout';
import { Shield, Lock, Eye, Server, RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function PoliticaDePrivacidade() {
  const { t } = useTranslation();
  return (
    <PublicLayout>
      <div className="max-w-3xl mx-auto px-6 py-12">
        <header className="mb-16 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 text-primary rounded-2xl mb-6">
            <Shield className="h-10 w-10" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">{t('privacy.title')}</h1>
          <p className="text-lg text-muted-foreground">{t('privacy.lastUpdated')}</p>
        </header>

        <article className="max-w-none">
          <div className="space-y-8">
            <section className="mesh-card p-8 rounded-3xl border-border shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-2 bg-accent rounded-lg"><Eye className="h-6 w-6 text-primary" /></div>
                <h2 className="text-2xl font-bold m-0">{t('privacy.section1.title')}</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed text-lg italic mb-6">
{t('privacy.section1.quote')}
              </p>
              <p className="text-muted-foreground leading-relaxed">
{t('privacy.section1.body')}
              </p>
            </section>

            <section className="mesh-card p-8 rounded-3xl border-border shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-2 bg-accent rounded-lg"><Server className="h-6 w-6 text-primary" /></div>
                <h2 className="text-2xl font-bold m-0">{t('privacy.section2.title')}</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
{t('privacy.section2.intro')}
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-4">
                <li>{t('privacy.section2.item1')}</li>
                <li>{t('privacy.section2.item2')}</li>
                <li>{t('privacy.section2.item3')}</li>
                <li>{t('privacy.section2.item4')}</li>
              </ul>
              <p className="mt-6 text-muted-foreground leading-relaxed">
{t('privacy.section2.closing')}
              </p>
            </section>

            <section className="mesh-card p-8 rounded-3xl border-border shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-2 bg-accent rounded-lg"><Lock className="h-6 w-6 text-primary" /></div>
                <h2 className="text-2xl font-bold m-0">{t('privacy.section3.title')}</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
{t('privacy.section3.body')}
              </p>
            </section>

            <section className="mesh-card p-8 rounded-3xl border-border shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-2 bg-accent rounded-lg"><RefreshCw className="h-6 w-6 text-primary" /></div>
                <h2 className="text-2xl font-bold m-0">{t('privacy.section4.title')}</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
{t('privacy.section4.body')}
              </p>
            </section>
          </div>
        </article>

        <footer className="mt-20 pt-12 border-t border-border text-center">
          <p className="text-muted-foreground">{t('privacy.footer.question')} <a href={`mailto:${t('privacy.footer.email')}`} className="text-primary font-medium hover:underline">{t('privacy.footer.contactLink')}</a></p>
        </footer>
      </div>
    </PublicLayout>
  );
}
