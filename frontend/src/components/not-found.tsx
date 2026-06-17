import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { PublicLayout } from '../components/shared/public-layout';
import { useTranslation } from 'react-i18next';

export function NotFoundPage() {
  const { t } = useTranslation();
  return (
    <PublicLayout>
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h2 className="text-6xl font-bold text-indigo-700">{t('notFound.title')}</h2>
        <p className="text-xl mt-4 mb-8">{t('notFound.message')}</p>
        <Button asChild>
          <Link to="/">{t('notFound.backButton')}</Link>
        </Button>
      </div>
    </PublicLayout>
  );
}
