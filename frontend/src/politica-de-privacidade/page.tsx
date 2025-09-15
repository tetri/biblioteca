import {
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";

export default function PoliticaDePrivacidade() {
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
                            <BreadcrumbPage>Política de Privacidade</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
            <Card className="w-full max-w-2xl shadow-lg">
                <CardHeader>
                    <CardTitle className="text-3xl">Política de Privacidade</CardTitle>
                    <CardDescription className="text-base">
                        Saiba como tratamos seus dados e garantimos sua privacidade.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8 text-justify">
                    <section>
                        <h2 className="font-semibold text-lg mb-2">1. Coleta de Informações</h2>
                        <p>
                            Coletamos informações fornecidas por você ao se cadastrar, como nome, e-mail e demais dados necessários para o uso da plataforma.
                        </p>
                    </section>
                    <section>
                        <h2 className="font-semibold text-lg mb-2">2. Uso das Informações</h2>
                        <p>
                            Utilizamos seus dados para fornecer e aprimorar nossos serviços, personalizar sua experiência e enviar comunicações importantes.
                        </p>
                    </section>
                    <section>
                        <h2 className="font-semibold text-lg mb-2">3. Compartilhamento de Dados</h2>
                        <p>
                            Não compartilhamos suas informações pessoais com terceiros, exceto quando necessário para cumprir obrigações legais ou mediante seu consentimento.
                        </p>
                    </section>
                    <section>
                        <h2 className="font-semibold text-lg mb-2">4. Segurança</h2>
                        <p>
                            Adotamos medidas de segurança para proteger seus dados contra acesso não autorizado, alteração, divulgação ou destruição.
                        </p>
                    </section>
                    <section>
                        <h2 className="font-semibold text-lg mb-2">5. Alterações nesta Política</h2>
                        <p>
                            Podemos atualizar esta Política de Privacidade periodicamente. Recomendamos que você revise esta página regularmente para estar ciente de quaisquer alterações.
                        </p>
                    </section>
                    <section>
                        <h2 className="font-semibold text-lg mb-2">6. Contato</h2>
                        <p>
                            Em caso de dúvidas sobre esta Política de Privacidade, entre em contato pelo e-mail: contato@biblioteca.com
                        </p>
                    </section>
                </CardContent>
            </Card>
        </div>
    );
}
