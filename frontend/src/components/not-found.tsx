import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { PublicLayout } from '../components/shared/public-layout';

export function NotFoundPage() {
  return (
    <PublicLayout>
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h2 className="text-6xl font-bold text-indigo-700">404</h2>
        <p className="text-xl mt-4 mb-8">Página não encontrada.</p>
        <Button asChild>
          <Link to="/">Voltar ao Início</Link>
        </Button>
      </div>
    </PublicLayout>
  );
}
