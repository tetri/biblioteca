import { PublicLayout } from '../components/shared/public-layout';

export default function TermosDeUso() {
  return (
    <PublicLayout>
      <article className="prose prose-stone prose-lg max-w-none">
        <h1 className="font-sans text-4xl font-bold tracking-tight text-slate-900 mb-8">Termos de Uso</h1>
        
        <section className="mb-8">
          <h2 className="font-sans text-2xl font-semibold text-slate-800 mb-4">1. Aceitação</h2>
          <p className="font-serif text-slate-700 leading-relaxed">
            Ao utilizar o sistema de Biblioteca, você concorda em seguir nossas diretrizes de uso, 
            garantindo a integridade dos livros e respeitando os prazos de devolução.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="font-sans text-2xl font-semibold text-slate-800 mb-4">2. Responsabilidades</h2>
          <p className="font-serif text-slate-700 leading-relaxed">
            O usuário é responsável pela conservação das obras retiradas e pela veracidade 
            das informações cadastradas em sua conta. O não cumprimento dos prazos resultará 
            em bloqueios temporários de novas reservas.
          </p>
        </section>
      </article>
    </PublicLayout>
  );
}
