import { PublicLayout } from '../components/shared/public-layout';
import { Shield, Lock, Eye, Server, RefreshCw } from 'lucide-react';

export default function PoliticaDePrivacidade() {
  return (
    <PublicLayout>
      <div className="max-w-3xl mx-auto">
        <header className="mb-16 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-indigo-50 text-indigo-600 rounded-2xl mb-6">
            <Shield className="h-10 w-10" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-4">Política de Privacidade</h1>
          <p className="text-lg text-slate-600">Última atualização: Fevereiro de 2024</p>
        </header>

        <article className="prose prose-slate max-w-none">
          <div className="space-y-12">
            <section className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-2 bg-slate-50 rounded-lg"><Eye className="h-6 w-6 text-indigo-600" /></div>
                <h2 className="text-2xl font-bold text-slate-900 m-0">1. Coleta de Informações</h2>
              </div>
              <p className="text-slate-600 leading-relaxed text-lg italic mb-6">
                "Sua privacidade é a nossa maior prioridade. Coletamos apenas o essencial para entregar a melhor experiência."
              </p>
              <p className="text-slate-600 leading-relaxed">
                Nós coletamos informações que você nos fornece diretamente ao criar uma conta, como seu nome, endereço de e-mail e senha. Além disso, registramos dados sobre suas interações com o catálogo, como livros reservados, prazos de devolução e histórico de leitura.
              </p>
            </section>

            <section className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-2 bg-slate-50 rounded-lg"><Server className="h-6 w-6 text-indigo-600" /></div>
                <h2 className="text-2xl font-bold text-slate-900 m-0">2. Uso e Armazenamento</h2>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Os dados coletados são utilizados exclusivamente para:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-slate-600 mt-4">
                <li>Garantir a integridade do processo de empréstimo de livros;</li>
                <li>Notificar você sobre prazos de devolução e disponibilidade de títulos;</li>
                <li>Melhorar as recomendações de leitura e a interface do sistema;</li>
                <li>Cumprir obrigações legais e administrativas da instituição.</li>
              </ul>
              <p className="mt-6 text-slate-600 leading-relaxed">
                Utilizamos criptografia de ponta e protocolos de segurança rigorosos para garantir que seus dados permaneçam protegidos contra acessos não autorizados.
              </p>
            </section>

            <section className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-2 bg-slate-50 rounded-lg"><Lock className="h-6 w-6 text-indigo-600" /></div>
                <h2 className="text-2xl font-bold text-slate-900 m-0">3. Compartilhamento</h2>
              </div>
              <p className="text-slate-600 leading-relaxed">
                <strong>Não vendemos nem alugamos seus dados pessoais para terceiros.</strong> O compartilhamento de informações ocorre apenas com prestadores de serviço essenciais para o funcionamento da plataforma (ex: serviços de e-mail transacional) e sob estrita confidencialidade.
              </p>
            </section>

            <section className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-2 bg-slate-50 rounded-lg"><RefreshCw className="h-6 w-6 text-indigo-600" /></div>
                <h2 className="text-2xl font-bold text-slate-900 m-0">4. Seus Direitos</h2>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Você tem o direito de acessar, corrigir ou excluir seus dados pessoais a qualquer momento através das configurações de sua conta. Para exclusão total de dados, entre em contato com o administrador da biblioteca.
              </p>
            </section>
          </div>
        </article>

        <footer className="mt-20 pt-12 border-t border-slate-100 text-center">
          <p className="text-slate-500">Dúvidas sobre nossa política? <a href="mailto:privacidade@biblioteca.com" className="text-indigo-600 font-medium">Contate nosso DPO</a></p>
        </footer>
      </div>
    </PublicLayout>
  );
}
