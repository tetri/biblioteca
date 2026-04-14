import { PublicLayout } from '../components/shared/public-layout';

export default function PoliticaDePrivacidade() {
  return (
    <PublicLayout>
      <article className="prose prose-stone prose-lg max-w-none">
        <h1 className="font-sans text-4xl font-bold tracking-tight text-slate-900 mb-8">Política de Privacidade</h1>
        
        <section className="mb-8">
          <h2 className="font-sans text-2xl font-semibold text-slate-800 mb-4">1. Coleta de Informações</h2>
          <p className="font-serif text-slate-700 leading-relaxed">
            Sua privacidade é fundamental. Esta política descreve como tratamos suas informações pessoais 
            ao utilizar nossa plataforma de biblioteca. Comprometemo-nos a nunca compartilhar seus dados 
            com terceiros sem consentimento explícito.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="font-sans text-2xl font-semibold text-slate-800 mb-4">2. Uso dos Dados</h2>
          <p className="font-serif text-slate-700 leading-relaxed">
            Coletamos apenas informações estritamente necessárias para a gestão de empréstimos e 
            acesso administrativo. Os dados são armazenados de forma segura utilizando criptografia 
            de ponta em nossos bancos de dados.
          </p>
        </section>
      </article>
    </PublicLayout>
  );
}
