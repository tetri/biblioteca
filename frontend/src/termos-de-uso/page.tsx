import {
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";

export default function TermosDeUso() {
    return (
        <div className="min-h-svh bg-muted py-10 px-2 flex flex-col items-center">
            <div className="w-full max-w-2xl mb-6">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/">Início</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Termos de Uso</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
            <Card className="w-full max-w-2xl shadow-lg">
                <CardHeader>
                    <CardTitle className="text-3xl">Termos de Uso</CardTitle>
                    <CardDescription className="text-base">
                        Leia atentamente estes termos antes de utilizar nossos serviços.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8 text-justify">
                    <section>
                        <h2 className="font-semibold text-lg mb-2">1. Aceitação dos Termos</h2>
                        <p>
                            Ao acessar ou usar este site, você concorda em cumprir estes Termos de Uso e todas as leis e regulamentos aplicáveis. Se você não concordar com algum destes termos, está proibido de usar ou acessar este site.
                        </p>
                    </section>
                    <section>
                        <h2 className="font-semibold text-lg mb-2">2. Uso da Plataforma</h2>
                        <p>
                            Você se compromete a utilizar a plataforma apenas para fins legais e de acordo com estes Termos. É proibido utilizar o site para fins ilícitos ou para prejudicar terceiros.
                        </p>
                    </section>
                    <section>
                        <h2 className="font-semibold text-lg mb-2">3. Propriedade Intelectual</h2>
                        <p>
                            Todo o conteúdo disponibilizado, incluindo textos, imagens, logotipos e marcas, é protegido por direitos autorais e pertence à Biblioteca ou a terceiros licenciantes.
                        </p>
                    </section>
                    <section>
                        <h2 className="font-semibold text-lg mb-2">4. Modificações dos Termos</h2>
                        <p>
                            Reservamo-nos o direito de alterar estes Termos de Uso a qualquer momento. As alterações entrarão em vigor imediatamente após a publicação no site.
                        </p>
                    </section>
                    <section>
                        <h2 className="font-semibold text-lg mb-2">5. Contato</h2>
                        <p>
                            Em caso de dúvidas sobre estes Termos de Uso, entre em contato conosco pelo e-mail: contato@biblioteca.com
                        </p>
                    </section>
                </CardContent>
            </Card>
        </div>
    );
}
