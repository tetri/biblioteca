import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search, BookOpen } from "lucide-react";
import { PublicLayout } from '../components/shared/public-layout';

export default function HomePage() {
  return (
    <PublicLayout>
        <section className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-slate-900 mb-4">Encontre seu próximo livro</h2>
          <p className="text-slate-600 mb-8 max-w-2xl mx-auto">Explore nosso catálogo completo e reserve seus livros favoritos com facilidade.</p>
          
          <div className="flex w-full max-w-md mx-auto space-x-2">
            <Input type="text" placeholder="Buscar por título ou autor..." className="bg-white" />
            <Button><Search className="mr-2 h-4 w-4" /> Buscar</Button>
          </div>
        </section>

        <section>
          <h3 className="text-2xl font-bold mb-6">Atalhos rápidos</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="pt-6">
                <Link to="/catalogo" className="flex items-center space-x-4">
                  <div className="p-3 bg-indigo-100 rounded-lg">
                    <BookOpen className="h-6 w-6 text-indigo-700" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Ver Catálogo</h4>
                    <p className="text-sm text-slate-500">Veja todos os livros disponíveis</p>
                  </div>
                </Link>
              </CardContent>
            </Card>
          </div>
        </section>
    </PublicLayout>
  );
}
