import { LayoutDashboard, Users, BookOpen, Handshake, LogOut, Library } from 'lucide-react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const links = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/usuarios', label: 'Gerenciar Usuarios', icon: Users },
  { to: '/admin/livros', label: 'Gerenciar Livros', icon: BookOpen },
  { to: '/admin/emprestimos', label: 'Gerenciar Emprestimos', icon: Handshake },
];

export function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6 md:px-6">
        <aside className="sticky top-6 hidden h-[calc(100vh-3rem)] w-72 shrink-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:block">
          <div className="mb-6 flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="rounded-xl bg-indigo-600 p-2 text-white">
              <Library className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">Area Administrativa</p>
              <p className="font-semibold text-slate-900">Biblioteca</p>
            </div>
          </div>

          <nav className="space-y-2">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  )
                }
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </NavLink>
            ))}
          </nav>

          <Button variant="outline" className="mt-8 w-full" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Sair do Painel
          </Button>
        </aside>

        <main className="w-full">
          <div className="mb-4 flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 lg:hidden">
            <p className="text-sm font-semibold text-slate-900">Painel Administrativo</p>
            <Button variant="outline" size="sm" onClick={handleLogout}>Sair</Button>
          </div>

          <div className="mb-4 flex gap-2 overflow-x-auto rounded-2xl border border-slate-200 bg-white p-2 lg:hidden">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  cn(
                    'whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium transition-colors',
                    isActive ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          <Outlet />
        </main>
      </div>
    </div>
  );
}
