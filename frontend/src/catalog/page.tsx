import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import { ErrorMessage } from '../components/error-message';
import { PublicLayout } from '../components/shared/public-layout';
import { Button } from "@/components/ui/button";
import { BookOpen, CheckCircle2, AlertCircle } from "lucide-react";

interface Book {
  id: string;
  title: string;
  author: string;
  availableCopies: number;
}

const fetchBooks = async (): Promise<Book[]> => {
  const { data } = await api.get('/catalog/api/books');
  return data;
};

export function BooksPage() {
  const queryClient = useQueryClient();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [pendingBookId, setPendingBookId] = useState<string | null>(null);

  const { data: books, isLoading, error } = useQuery({
    queryKey: ['books'],
    queryFn: fetchBooks,
  });

  const reserveMutation = useMutation({
    mutationFn: async (bookId: string) => {
        setPendingBookId(bookId);
        // Obter o UserId do token se possível
        const token = localStorage.getItem('token');
        if (!token) throw new Error("Você precisa estar logado para reservar um livro.");

        let userId;
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            userId = payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/sid"];
            if (!userId) throw new Error("Token inválido: SID não encontrado.");
        } catch (e) {
            throw new Error("Erro ao processar login. Por favor, entre novamente.");
        }

        return api.post('/loan/api/loans/reserve', {
            bookId,
            userId,
            reservationDate: new Date().toISOString()
        });
    },
    onSuccess: () => {
        setSuccessMessage("Livro reservado com sucesso!");
        queryClient.invalidateQueries({ queryKey: ['books'] });
        setTimeout(() => setSuccessMessage(null), 5000);
    },
    onError: (err: any) => {
        const errorData = err.response?.data;
        const message = typeof errorData === 'string'
            ? errorData
            : (errorData?.message || err.message || "Erro ao reservar livro.");

        setErrorMessage(message);
        setTimeout(() => setErrorMessage(null), 5000);
    },
    onSettled: () => {
        setPendingBookId(null);
    }
  });

  if (isLoading) return (
    <PublicLayout>
        <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
    </PublicLayout>
  );
  if (error) return (
    <div className="p-8">
        <ErrorMessage 
            title="Erro ao carregar catálogo" 
            message="Não foi possível obter os livros. Nossos engenheiros já foram notificados." 
        />
    </div>
  );

  const bookList = Array.isArray(books) ? books : [];

  return (
    <PublicLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Catálogo de Livros</h1>
          <p className="text-slate-500 mt-2 text-lg">Explore nossa coleção e reserve suas próximas leituras.</p>
        </div>
      </div>

      {successMessage && (
        <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="h-5 w-5" />
          <p className="font-medium">{successMessage}</p>
        </div>
      )}

      {errorMessage && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
          <AlertCircle className="h-5 w-5" />
          <p className="font-medium">{errorMessage}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {bookList.map((book: Book) => (
          <div key={book.id} className="group bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 flex flex-col h-full">
            <div className="bg-slate-50 rounded-xl p-6 mb-6 flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
              <BookOpen className="h-12 w-12 text-slate-300 group-hover:text-indigo-400 transition-colors" />
            </div>

            <div className="flex-grow">
              <h2 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">{book.title}</h2>
              <p className="text-slate-500 font-medium mb-4">{book.author}</p>

              <div className="flex items-center gap-2 mb-6">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                  book.availableCopies > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                }`}>
                  {book.availableCopies > 0 ? `${book.availableCopies} disponíveis` : 'Indisponível'}
                </span>
              </div>
            </div>

            <Button
              className={`w-full py-6 rounded-xl font-bold transition-all ${
                book.availableCopies > 0
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
              disabled={book.availableCopies === 0 || (pendingBookId === book.id)}
              onClick={() => reserveMutation.mutate(book.id)}
            >
              {pendingBookId === book.id ? 'Processando...' : 'Reservar agora'}
            </Button>
          </div>
        ))}
      </div>

      {bookList.length === 0 && (
        <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
          <BookOpen className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-900">Nenhum livro encontrado</h3>
          <p className="text-slate-500">O catálogo está vazio no momento.</p>
        </div>
      )}
    </PublicLayout>
  );
}

