import { PublicLayout } from '../components/shared/public-layout';
import { Scale, BookOpen, AlertCircle, CheckCircle } from 'lucide-react';

export default function TermosDeUso() {
  return (
    <PublicLayout>
      <div className="max-w-3xl mx-auto px-6 py-12">
        <header className="mb-16 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 text-primary rounded-2xl mb-6">
            <Scale className="h-10 w-10" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">Termos de Uso</h1>
          <p className="text-lg text-muted-foreground">Diretrizes para uma convivência harmoniosa em nossa plataforma.</p>
        </header>

        <article className="max-w-none">
          <div className="space-y-8">
            <section className="mesh-card p-8 rounded-3xl border-border shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-2 bg-accent rounded-lg"><BookOpen className="h-6 w-6 text-primary" /></div>
                <h2 className="text-2xl font-bold m-0">1. Aceitação dos Termos</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Ao acessar e utilizar o Sistema de Biblioteca, você concorda em cumprir e estar vinculado aos seguintes termos e condições. Este sistema é destinado exclusivamente para fins educacionais e de gestão de acervo.
              </p>
            </section>

            <section className="mesh-card p-8 rounded-3xl border-border shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-2 bg-accent rounded-lg"><CheckCircle className="h-6 w-6 text-primary" /></div>
                <h2 className="text-2xl font-bold m-0">2. Responsabilidades do Usuário</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Como usuário da biblioteca, você se compromete a:
              </p>
              <ol className="list-decimal pl-6 space-y-4 text-muted-foreground mt-4">
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

            <section className="mesh-card p-8 rounded-3xl border-border shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-2 bg-accent rounded-lg"><AlertCircle className="h-6 w-6 text-primary" /></div>
                <h2 className="text-2xl font-bold m-0">3. Penalidades</h2>
              </div>
              <p className="text-foreground text-lg font-medium mb-4">
                O descumprimento dos termos pode acarretar em:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-accent/50 rounded-xl border-border">
                  <span className="font-bold block mb-1">Suspensão Temporária</span>
                  <p className="text-sm text-muted-foreground m-0">Impedimento de realizar novas reservas por um período determinado.</p>
                </div>
                <div className="p-4 bg-accent/50 rounded-xl border-border">
                  <span className="font-bold block mb-1">Multas Administrativas</span>
                  <p className="text-sm text-muted-foreground m-0">Conforme regulamento interno da instituição.</p>
                </div>
              </div>
            </section>

            <section className="mesh-card p-8 rounded-3xl border-border shadow-sm">
              <h2 className="text-2xl font-bold mb-6">4. Modificações</h2>
              <p className="text-muted-foreground leading-relaxed m-0">
                Reservamo-nos o direito de alterar estes termos a qualquer momento. Notificaremos os usuários sobre mudanças significativas através do e-mail cadastrado ou alertas no sistema.
              </p>
            </section>
          </div>
        </article>

        <footer className="mt-20 pt-12 border-t border-border text-center">
          <p className="text-muted-foreground italic text-sm">
            Ao continuar utilizando o sistema, você declara estar ciente e de acordo com todas as diretrizes acima.
          </p>
        </footer>
      </div>
    </PublicLayout>
  );
}
