import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search, BookOpen, ArrowRight, Star, Shield, Zap } from "lucide-react";
import { PublicLayout } from '../components/shared/public-layout';
import { useTranslation } from 'react-i18next';

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { t } = useTranslation();

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
            {t('home.hero.title')} <span className="text-primary">{t('home.hero.titleHighlight')}</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            {t('home.hero.subtitle')}
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <form onSubmit={handleSearch} className="flex w-full max-w-lg items-center space-x-2 bg-card p-2 rounded-full border-border border shadow-sm focus-within:ring-2 focus-within:ring-primary/20 transition-all">
              <Search className="ml-3 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder={t('home.hero.searchPlaceholder')}
                className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label={t('home.hero.searchAriaLabel')}
              />
              <Button type="submit" className="rounded-full">{t('home.hero.searchButton')}</Button>
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
              <h2 className="text-xl font-semibold">{t('home.features.fast.title')}</h2>
              <p className="text-muted-foreground">{t('home.features.fast.description')}</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-4 bg-primary/10 rounded-2xl text-primary">
                <Shield className="h-8 w-8" />
              </div>
              <h2 className="text-xl font-semibold">{t('home.features.secure.title')}</h2>
              <p className="text-muted-foreground">{t('home.features.secure.description')}</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-4 bg-primary/10 rounded-2xl text-primary">
                <Star className="h-8 w-8" />
              </div>
              <h2 className="text-xl font-semibold">{t('home.features.premium.title')}</h2>
              <p className="text-muted-foreground">{t('home.features.premium.description')}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 mesh-card px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="max-w-md">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">
                {t('home.cta.title')}
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                {t('home.cta.subtitle')}
              </p>
              <Button size="lg" className="rounded-full px-8" asChild>
                <Link to="/catalogo">{t('home.cta.button')} <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4 w-full max-w-md">
              <Card className="rounded-2xl border-border shadow-sm motion-safe:rotate-3 mesh-card">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <BookOpen className="h-10 w-10 text-primary mb-4" />
                  <span className="font-bold text-2xl">∞</span>
                  <span className="text-sm text-muted-foreground">{t('home.stats.booksLabel')}</span>
                </CardContent>
              </Card>
              <Card className="rounded-2xl border-border shadow-sm motion-safe:-rotate-3 mt-8 mesh-card">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <Star className="h-10 w-10 text-warm-500 mb-4" />
                  <span className="font-bold text-2xl">24/7</span>
                  <span className="text-sm text-muted-foreground">{t('home.stats.ratingLabel')}</span>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
