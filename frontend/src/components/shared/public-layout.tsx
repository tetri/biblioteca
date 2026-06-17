import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Book, User, LogOut, ChevronDown } from "lucide-react";
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '@/components/language-switcher';

export const PublicLayout = React.memo(({ children }: { children: React.ReactNode }) => {
  const { t } = useTranslation();
  const token = localStorage.getItem('token');
  const isAuthenticated = !!token;
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen flex flex-col selection:bg-brand-500/10">
      <header className="sticky top-0 z-50 w-full border-border mesh-card backdrop-blur-md" role="banner">
        <div className="container mx-auto px-6 max-w-5xl">
          <nav className="flex h-16 items-center justify-between" aria-label={t('header.nav.ariaLabel')}>
            <Link to="/" className="flex items-center space-x-2 transition-opacity hover:opacity-90" aria-label={t('header.nav.homeLinkAriaLabel')}>
              <div className="bg-primary p-1.5 rounded-lg">
                <Book className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-semibold tracking-tight">{t('header.brand')}</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link to="/catalogo" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors hidden md:block mr-4">
                {t('header.nav.catalog')}
              </Link>

              <LanguageSwitcher />

              {!isAuthenticated ? (
                <>
                  <Button variant="ghost" className="text-muted-foreground hover:text-foreground" asChild>
                    <Link to="/entrar">{t('header.nav.login')}</Link>
                  </Button>
                  <Button className="rounded-full px-6" asChild>
                    <Link to="/cadastro">{t('header.nav.signup')}</Link>
                  </Button>
                </>
              ) : (
                <div className="relative">
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 rounded-full pl-2 pr-4 hover:bg-accent"
                    onClick={() => setShowUserMenu(!showUserMenu)}
                  >
                    <div className="bg-primary/10 p-1.5 rounded-full">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm font-semibold text-foreground hidden sm:inline">{t('header.nav.myAccount')}</span>
                    <ChevronDown className={`h-3 w-3 text-muted-foreground transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                  </Button>

                  {showUserMenu && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                      <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-2xl shadow-xl shadow-brand-500/5 py-2 z-50 animate-in fade-in zoom-in-95">
                        <Link
                          to="/perfil"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-muted-foreground hover:bg-accent hover:text-primary transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <User className="h-4 w-4" />
                          {t('header.nav.viewProfile')}
                        </Link>
                        <Link
                          to="/catalogo"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-muted-foreground hover:bg-accent hover:text-primary transition-colors md:hidden"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <Book className="h-4 w-4" />
                          {t('header.nav.catalogMobile')}
                        </Link>
                        <div className="my-1 border-t border-border" />
                        <button
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                          onClick={handleLogout}
                        >
                          <LogOut className="h-4 w-4" />
                          {t('header.nav.signOut')}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </nav>
        </div>
      </header>

      <main className="flex-grow" id="main-content" role="main">
        {children}
      </main>

      <footer className="border-t border-border mesh-card py-12" role="contentinfo">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex flex-col items-center md:items-start gap-2">
              <Link to="/" className="flex items-center space-x-2 opacity-50 hover:opacity-100 transition-opacity">
                <Book className="h-4 w-4" />
                <span className="font-semibold">{t('footer.brand')}</span>
              </Link>
              <p className="text-sm text-muted-foreground">{t('footer.copyright', { year: new Date().getFullYear() })}</p>
            </div>
            <nav className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm font-medium text-muted-foreground" aria-label={t('footer.navAriaLabel')}>
              <Link to="/termos-de-uso" className="hover:text-primary transition-colors">{t('footer.links.termsOfUse')}</Link>
              <Link to="/politica-de-privacidade" className="hover:text-primary transition-colors">{t('footer.links.privacy')}</Link>
              <Link to="/catalogo" className="hover:text-primary transition-colors">{t('footer.links.catalog')}</Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
});
PublicLayout.displayName = 'PublicLayout';
