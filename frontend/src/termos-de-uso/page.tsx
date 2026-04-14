import { PublicLayout } from '../components/shared/public-layout';
import { Scale, BookOpen, AlertCircle, CheckCircle } from 'lucide-react';

export default function TermosDeUso() {
  return (
    <PublicLayout>
      <div className="max-w-3xl mx-auto">
        <header className="mb-16 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-indigo-50 text-indigo-600 rounded-2xl mb-6">
            <Scale className="h-10 w-10" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-4">Termos de Uso</h1>
          <p className="text-lg text-slate-600">Diretrizes para uma convivência harmoniosa em nossa plataforma.</p>
        </header>

        <article className="prose prose-slate max-w-none">
          <div className="space-y-12">
            <section className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-2 bg-slate-50 rounded-lg"><BookOpen className="h-6 w-6 text-indigo-600" /></div>
                <h2 className="text-2xl font-bold text-slate-900 m-0">1. Aceitação dos Termos</h2>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Ao acessar e utilizar o Sistema de Biblioteca, você concorda em cumprir e estar vinculado aos seguintes termos e condições. Este sistema é destinado exclusivamente para fins educacionais e de gestão de acervo.
              </p>
            </section>

            <section className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-2 bg-slate-50 rounded-lg"><CheckCircle className="h-6 w-6 text-indigo-600" /></div>
                <h2 className="text-2xl font-bold text-slate-900 m-0">2. Responsabilidades do Usuário</h2>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Como usuário da biblioteca, você se compromete a:
              </p>
              <ol className="list-decimal pl-6 space-y-4 text-slate-600 mt-4">
                <li>
                  <span>Zelar pela integridade física dos livros físicos retirados.</span>
                </li>
                <li>
                  <span>Respeitar rigorosamente os prazos de devolução estabelecidos.</span>
                </li>
                <li>
                  <span>Não compartilhar suas credenciais de acesso com terceiros.</span>
                </li>
              </ol>
            </section>

            <section className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-2 bg-slate-50 rounded-lg"><AlertCircle className="h-6 w-6 text-indigo-600" /></div>
                <h2 className="text-2xl font-bold text-slate-900 m-0">3. Penalidades</h2>
              </div>
              <p className="text-slate-600 leading-relaxed text-lg font-medium mb-4 text-slate-900">
                O descumprimento dos termos pode acarretar em:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="font-bold text-slate-900 block mb-1">Suspensão Temporária</span>
                  <p className="text-sm text-slate-500 m-0">Impedimento de realizar novas reservas por um período determinado.</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="font-bold text-slate-900 block mb-1">Multas Administrativas</span>
                  <p className="text-sm text-slate-500 m-0">Conforme regulamento interno da instituição.</p>
                </div>
              </div>
            </section>

            <section className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">4. Modificações</h2>
              <p className="text-slate-600 leading-relaxed m-0">
                Reservamo-nos o direito de alterar estes termos a qualquer momento. Notificaremos os usuários sobre mudanças significativas através do e-mail cadastrado ou alertas no sistema.
              </p>
            </section>
          </div>
        </article>

        <footer className="mt-20 pt-12 border-t border-slate-100 text-center">
          <p className="text-slate-500 italic text-sm">
            Ao continuar utilizando o sistema, você declara estar ciente e de acordo com todas as diretrizes acima.
          </p>
        </footer>
      </div>
    </PublicLayout>
  );
}
