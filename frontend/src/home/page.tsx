import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search, BookOpen, ArrowRight, Star, Shield, Zap } from "lucide-react";
import { PublicLayout } from '../components/shared/public-layout';

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/catalogo?query=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate('/catalogo');
    }
  };

  return (
    <PublicLayout>
      <section className="relative overflow-hidden py-20 px-6 sm:py-32 lg:px-8 text-center mesh-hero">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Sua biblioteca pessoal, <span className="text-primary">reimaginada.</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Explore milhares de títulos, gerencie seus empréstimos e descubra sua próxima leitura em uma plataforma minimalista e intuitiva.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <form onSubmit={handleSearch} className="flex w-full max-w-lg items-center space-x-2 bg-card p-2 rounded-full border-border border shadow-sm focus-within:ring-2 focus-within:ring-primary/20 transition-all">
              <Search className="ml-3 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Título, autor ou ISBN..."
                className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Buscar livros no catálogo"
              />
              <Button type="submit" className="rounded-full">Buscar</Button>
            </form>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-3">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-4 bg-primary/10 rounded-2xl text-primary">
                <Zap className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold">Rápido e Fluido</h3>
              <p className="text-muted-foreground">Reserve seus livros em segundos com nossa interface otimizada para performance.</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-4 bg-primary/10 rounded-2xl text-primary">
                <Shield className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold">Seguro e Confiável</h3>
              <p className="text-muted-foreground">Seus dados e histórico de leitura protegidos com tecnologia de ponta.</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-4 bg-primary/10 rounded-2xl text-primary">
                <Star className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold">Experiência Premium</h3>
              <p className="text-muted-foreground">Design minimalista focado no que importa: sua experiência de leitura.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 mesh-card px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="max-w-md">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">
                Pronto para mergulhar no conhecimento?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Junte-se a milhares de leitores e tenha acesso a um catálogo vasto de obras literárias e técnicas.
              </p>
              <Button size="lg" className="rounded-full px-8" asChild>
                <Link to="/catalogo">Explorar Catálogo <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4 w-full max-w-md">
              <Card className="rounded-2xl border-border shadow-sm rotate-3 mesh-card">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <BookOpen className="h-10 w-10 text-primary mb-4" />
                  <span className="font-bold text-2xl">5k+</span>
                  <span className="text-sm text-muted-foreground">Livros</span>
                </CardContent>
              </Card>
              <Card className="rounded-2xl border-border shadow-sm -rotate-3 mt-8 mesh-card">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <Star className="h-10 w-10 text-warm-500 mb-4" />
                  <span className="font-bold text-2xl">4.9</span>
                  <span className="text-sm text-muted-foreground">Avaliação</span>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
