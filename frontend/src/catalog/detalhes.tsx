import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import { decodeJwtPayload } from '../lib/utils';
import { ErrorMessage } from '../components/error-message';
import { PublicLayout } from '../components/shared/public-layout';
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, CheckCircle2, ArrowLeft, Info, Tag, Hash } from "lucide-react";

interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  availableCopies: number;
  totalCopies: number;
  createdAt: string;
  updatedAt: string;
}

const fetchBook = async (id: string): Promise<Book> => {
  const { data } = await api.get(`/catalog/api/catalog/books/${id}`);
  return data;
};

export default function BookDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const messageTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (messageTimeoutRef.current) clearTimeout(messageTimeoutRef.current);
    };
  }, []);

  const scheduleClearMessage = (
    setter: (msg: string | null) => void,
    message: string | null,
    shouldInvalidate: boolean = false
  ) => {
    if (messageTimeoutRef.current) clearTimeout(messageTimeoutRef.current);
    setSuccessMessage(null);
    setErrorMessage(null);
    setter(message);

    if (shouldInvalidate) {
      queryClient.invalidateQueries({ queryKey: ['book', id] });
    }

    messageTimeoutRef.current = setTimeout(() => {
      setter(null);
      messageTimeoutRef.current = null;
    }, 5000);
  };

  const { data: book, isLoading, error } = useQuery({
    queryKey: ['book', id],
    queryFn: () => fetchBook(id!),
    enabled: !!id,
  });

  const reserveMutation = useMutation({
    mutationFn: async (bookId: string) => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error("Você precisa estar logado para reservar um livro.");

        const payload = decodeJwtPayload(token);
        const userId = payload.sid || payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/sid"];
        if (!userId) throw new Error("Token inválido: SID não encontrado.");

        return api.post('/loan/api/loans/reserve', {
            bookId,
            userId,
            reservationDate: new Date().toISOString()
        });
    },
    onSuccess: () => {
        scheduleClearMessage(setSuccessMessage, "Livro reservado com sucesso!", true);
    },
    onError: (err: any) => {
        const errorData = err.response?.data;
        const message = typeof errorData === 'string'
            ? errorData
            : (errorData?.message || err.message || "Erro ao reservar livro.");

        scheduleClearMessage(setErrorMessage, message);
    }
  });

  if (isLoading) return (
    <PublicLayout>
      <div className="max-w-4xl mx-auto">
        <Skeleton className="h-8 w-32 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Skeleton className="h-96 w-full rounded-2xl md:col-span-1" />
          <div className="md:col-span-2 space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-12 w-full mt-8" />
          </div>
        </div>
      </div>
    </PublicLayout>
  );

  if (error || !book) return (
    <PublicLayout>
      <div className="max-w-4xl mx-auto py-12">
        <ErrorMessage
            title="Erro ao carregar detalhes"
            message="Não foi possível obter as informações do livro. Verifique se o ID está correto."
        />
        <Button variant="ghost" className="mt-6" onClick={() => navigate('/catalogo')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar ao catálogo
        </Button>
      </div>
    </PublicLayout>
  );

  return (
    <PublicLayout>
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          className="mb-8 text-slate-500 hover:text-slate-900"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
        </Button>

        {successMessage && (
          <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
            <CheckCircle2 className="h-5 w-5" />
            <p className="font-medium">{successMessage}</p>
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 animate-in fade-in slide-in-from-top-4">
            <ErrorMessage title="Erro de Reserva" message={errorMessage} />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Cover Placeholder */}
          <div className="md:col-span-1">
            <div className="aspect-[2/3] bg-slate-50 border border-slate-100 rounded-2xl flex flex-col items-center justify-center text-slate-300 shadow-sm overflow-hidden group">
              <BookOpen className="h-20 w-20 group-hover:text-indigo-400 transition-colors" />
              <p className="mt-4 font-medium text-sm">Sem capa disponível</p>
              <div className="absolute inset-0 bg-indigo-600/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            <Card className="mt-8 border-slate-100 shadow-sm overflow-hidden rounded-2xl">
              <CardHeader className="bg-slate-50/50 pb-4">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Info className="h-4 w-4 text-indigo-600" />
                  Status de Disponibilidade
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-slate-500">Disponíveis</span>
                  <span className={`text-lg font-bold ${book.availableCopies > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {book.availableCopies}
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-1000 ${book.availableCopies > 0 ? 'bg-emerald-500' : 'bg-red-500'}`}
                    style={{ width: `${(book.availableCopies / book.totalCopies) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-slate-400 mt-2 text-center">
                  Total de {book.totalCopies} exemplares no acervo
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Details Content */}
          <div className="md:col-span-2">
            <h1 className="text-4xl font-bold text-slate-900 tracking-tight mb-2">{book.title}</h1>
            <p className="text-xl text-indigo-600 font-medium mb-8">{book.author}</p>

            <div className="grid grid-cols-2 gap-6 mb-10">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                  <Hash className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">ISBN</p>
                  <p className="text-slate-900 font-medium">{book.isbn}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                  <Tag className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Categoria</p>
                  <p className="text-slate-900 font-medium">{book.category}</p>
                </div>
              </div>
            </div>

            <div className="prose prose-slate max-w-none mb-12">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Sobre este livro</h3>
              <p className="text-slate-600 leading-relaxed">
                Este exemplar faz parte do acervo permanente da nossa biblioteca. Atualmente classificado sob a categoria <strong>{book.category}</strong>,
                ele é um dos títulos mais procurados pelos nossos leitores. Para garantir a democratização do acesso,
                o período padrão de empréstimo é de 14 dias após a retirada.
              </p>
            </div>

            <Button
              className={`w-full py-8 rounded-2xl font-bold text-lg transition-all shadow-xl ${
                book.availableCopies > 0
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
              disabled={book.availableCopies === 0 || reserveMutation.isPending}
              onClick={() => reserveMutation.mutate(book.id)}
            >
              {reserveMutation.isPending ? 'Processando reserva...' : 'Reservar agora'}
            </Button>

            <p className="text-center text-slate-400 text-sm mt-4">
              A reserva garante sua prioridade na fila por até 24 horas.
            </p>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
