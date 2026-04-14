import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Book, User, LogOut, ChevronDown } from "lucide-react";
import React, { useState } from 'react';

export const PublicLayout = React.memo(({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const isAuthenticated = !!token;
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <header className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/80 backdrop-blur-md" role="banner">
        <div className="container mx-auto px-6 max-w-5xl">
          <nav className="flex h-16 items-center justify-between" aria-label="Navegação Principal">
            <Link to="/" className="flex items-center space-x-2 transition-opacity hover:opacity-90" aria-label="Ir para a página inicial">
              <div className="bg-indigo-600 p-1.5 rounded-lg">
                <Book className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-semibold tracking-tight">Biblioteca</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link to="/catalogo" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors hidden md:block mr-4">
                Catálogo
              </Link>

              {!isAuthenticated ? (
                <>
                  <Button variant="ghost" className="text-slate-600 hover:text-slate-900" asChild>
                    <Link to="/entrar">Entrar</Link>
                  </Button>
                  <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-6" asChild>
                    <Link to="/cadastro">Começar agora</Link>
                  </Button>
                </>
              ) : (
                <div className="relative">
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 rounded-full pl-2 pr-4 hover:bg-slate-50 border border-transparent hover:border-slate-100"
                    onClick={() => setShowUserMenu(!showUserMenu)}
                  >
                    <div className="bg-indigo-100 p-1.5 rounded-full">
                      <User className="h-4 w-4 text-indigo-600" />
                    </div>
                    <span className="text-sm font-semibold text-slate-700 hidden sm:inline">Minha Conta</span>
                    <ChevronDown className={`h-3 w-3 text-slate-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                  </Button>

                  {showUserMenu && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                      <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-100 rounded-2xl shadow-xl shadow-slate-200/50 py-2 z-50 animate-in fade-in zoom-in-95">
                        <Link
                          to="/perfil"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <User className="h-4 w-4" />
                          Ver Perfil
                        </Link>
                        <Link
                          to="/catalogo"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors md:hidden"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <Book className="h-4 w-4" />
                          Catálogo
                        </Link>
                        <div className="my-1 border-t border-slate-50" />
                        <button
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                          onClick={handleLogout}
                        >
                          <LogOut className="h-4 w-4" />
                          Sair
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

      <main className="flex-grow container mx-auto px-6 py-12 max-w-5xl" id="main-content" role="main">
        {children}
      </main>

      <footer className="border-t border-slate-100 bg-slate-50/50 py-12" role="contentinfo">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex flex-col items-center md:items-start gap-2">
              <Link to="/" className="flex items-center space-x-2 opacity-50 hover:opacity-100 transition-opacity">
                <Book className="h-4 w-4" />
                <span className="font-semibold">Biblioteca</span>
              </Link>
              <p className="text-sm text-slate-500">© {new Date().getFullYear()} Sistema de Biblioteca Premium.</p>
            </div>
            <nav className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm font-medium text-slate-500" aria-label="Links Institucionais">
              <Link to="/termos-de-uso" className="hover:text-indigo-600 transition-colors">Termos de Uso</Link>
              <Link to="/politica-de-privacidade" className="hover:text-indigo-600 transition-colors">Privacidade</Link>
              <Link to="/catalogo" className="hover:text-indigo-600 transition-colors">Catálogo</Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
});
PublicLayout.displayName = 'PublicLayout';
