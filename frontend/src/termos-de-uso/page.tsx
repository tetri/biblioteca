import { useTranslation } from 'react-i18next';
import { PublicLayout } from '../components/shared/public-layout';
import { Scale, BookOpen, AlertCircle, CheckCircle } from 'lucide-react';

export default function TermosDeUso() {
  const { t } = useTranslation();
  return (
    <PublicLayout>
      <div className="max-w-3xl mx-auto px-6 py-12">
        <header className="mb-16 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 text-primary rounded-2xl mb-6">
            <Scale className="h-10 w-10" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">{t('terms.title')}</h1>
          <p className="text-lg text-muted-foreground">{t('terms.subtitle')}</p>
        </header>

        <article className="max-w-none">
          <div className="space-y-8">
            <section className="mesh-card p-8 rounded-3xl border-border shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-2 bg-accent rounded-lg"><BookOpen className="h-6 w-6 text-primary" /></div>
                <h2 className="text-2xl font-bold m-0">{t('terms.section1.title')}</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                {t('terms.section1.body')}
              </p>
            </section>

            <section className="mesh-card p-8 rounded-3xl border-border shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-2 bg-accent rounded-lg"><CheckCircle className="h-6 w-6 text-primary" /></div>
                <h2 className="text-2xl font-bold m-0">{t('terms.section2.title')}</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                {t('terms.section2.intro')}
              </p>
              <ol className="list-decimal pl-6 space-y-4 text-muted-foreground mt-4">
                <li>
                  <span>{t('terms.section2.item1')}</span>
                </li>
                <li>
                  <span>{t('terms.section2.item2')}</span>
                </li>
                <li>
                  <span>{t('terms.section2.item3')}</span>
                </li>
              </ol>
            </section>

            <section className="mesh-card p-8 rounded-3xl border-border shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-2 bg-accent rounded-lg"><AlertCircle className="h-6 w-6 text-primary" /></div>
                <h2 className="text-2xl font-bold m-0">{t('terms.section3.title')}</h2>
              </div>
              <p className="text-foreground text-lg font-medium mb-4">
                {t('terms.section3.intro')}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-accent/50 rounded-xl border-border">
                  <span className="font-bold block mb-1">{t('terms.section3.penalty1.title')}</span>
                  <p className="text-sm text-muted-foreground m-0">{t('terms.section3.penalty1.description')}</p>
                </div>
                <div className="p-4 bg-accent/50 rounded-xl border-border">
                  <span className="font-bold block mb-1">{t('terms.section3.penalty2.title')}</span>
                  <p className="text-sm text-muted-foreground m-0">{t('terms.section3.penalty2.description')}</p>
                </div>
              </div>
            </section>

            <section className="mesh-card p-8 rounded-3xl border-border shadow-sm">
              <h2 className="text-2xl font-bold mb-6">{t('terms.section4.title')}</h2>
              <p className="text-muted-foreground leading-relaxed m-0">
                {t('terms.section4.body')}
              </p>
            </section>
          </div>
        </article>

        <footer className="mt-20 pt-12 border-t border-border text-center">
          <p className="text-muted-foreground italic text-sm">
            {t('terms.footer')}
          </p>
        </footer>
      </div>
    </PublicLayout>
  );
}
