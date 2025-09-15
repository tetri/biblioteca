import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function HomePage() {
    return (
        <div className="min-h-svh flex flex-col justify-center items-center bg-muted p-6">
            <div className="flex flex-col items-center gap-6">
                <h1 className="text-4xl font-bold">Bem-vindo à Biblioteca</h1>
                <p className="text-lg text-muted-foreground text-center max-w-xl">
                    Acesse, explore e aproveite todos os recursos disponíveis em nossa plataforma.
                </p>
                <Button asChild size="lg" className="mt-4">
                    <Link to="/login">Entrar</Link>
                </Button>
            </div>
            <footer className="w-full max-w-2xl mt-16 border-t pt-6 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
                <span>&copy; {new Date().getFullYear()} Biblioteca</span>
                <div className="flex gap-4">
                    <Link to="/politica-de-privacidade" className="underline underline-offset-4 hover:text-primary">Política de Privacidade</Link>
                    <Link to="/termos-de-uso" className="underline underline-offset-4 hover:text-primary">Termos de Uso</Link>
                </div>
            </footer>
        </div>
    );
}
