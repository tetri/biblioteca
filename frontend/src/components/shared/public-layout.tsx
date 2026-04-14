import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { LogIn, UserPlus } from "lucide-react";
import React from 'react';

export const PublicLayout = React.memo(({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="border-b bg-white" role="banner">
        <div className="container mx-auto px-4 max-w-[800px]">
          <nav className="py-4 flex justify-between items-center" aria-label="Navegação Principal">
            <Link to="/" className="text-xl font-bold text-indigo-700" aria-label="Ir para a página inicial">Minha Biblioteca</Link>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/entrar"><LogIn className="mr-2 h-4 w-4" aria-hidden="true" /> Entrar</Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/cadastro"><UserPlus className="mr-2 h-4 w-4" aria-hidden="true" /> Cadastre-se</Link>
              </Button>
            </div>
          </nav>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8 max-w-[800px]" id="main-content" role="main">
        {children}
      </main>

      <footer className="border-t bg-white py-6" role="contentinfo">
        <div className="container mx-auto px-4 max-w-[800px] text-center text-sm text-slate-500">
          <p>© {new Date().getFullYear()} Minha Biblioteca. Todos os direitos reservados.</p>
          <nav className="flex justify-center gap-4 mt-2" aria-label="Links Institucionais">
            <Link to="/termos-de-uso" className="underline underline-offset-4">Termos de Uso</Link>
            <Link to="/politica-de-privacidade" className="underline underline-offset-4">Política de Privacidade</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
});
PublicLayout.displayName = 'PublicLayout';
