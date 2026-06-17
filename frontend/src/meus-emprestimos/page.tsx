import { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { decodeJwtPayload } from '../lib/utils';
import { ErrorMessage } from '../components/error-message';
import { ProtectedRoute } from '../components/auth/protected-route';
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import {
  BookOpen,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Calendar
} from "lucide-react";

interface Loan {
  id: string;
  userId: string;
  bookId: string;
  bookTitle: string;
  bookAuthor: string;
  bookCategory: string;
  loanDate: string;
  dueDate: string;
  returnDate: string | null;
  status: 'Reserved' | 'Active' | 'Returned' | 'Overdue';
}

const fetchUserLoans = async (): Promise<Loan[]> => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error("Você precisa estar logado.");

  const payload = decodeJwtPayload(token);
  const userId = payload.sid || payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/sid"];
  if (!userId) throw new Error("Token inválido: SID não encontrado.");

  const response = await fetch(`/loan/api/loans/my-loans`);
  if (!response.ok) {
    throw new Error("Não foi possível carregar seus empréstimos.");
  }

  const loans = await response.json();

  const booksResponse = await fetch(`/catalog/api/catalog/books`);
  const books = await booksResponse.json();

  return loans.map((loan: any) => {
    const book = books.find((b: any) => b.id === loan.bookId);
    return {
      ...loan,
      bookTitle: book?.title || 'Livro não encontrado',
      bookAuthor: book?.author || 'Autor desconhecido',
      bookCategory: book?.category || 'Categoria desconhecida'
    };
  });
};

export function MyLoansPage() {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [pendingLoanIds, setPendingLoanIds] = useState<Set<string>>(new Set());
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
      queryClient.invalidateQueries({ queryKey: ['userLoans'] });
    }

    messageTimeoutRef.current = setTimeout(() => {
      setter(null);
      messageTimeoutRef.current = null;
    }, 5000);
  };

  const queryClient = useQueryClient();

  const { data: loans, isLoading, error, refetch } = useQuery({
    queryKey: ['userLoans'],
    queryFn: fetchUserLoans,
  });

  const returnLoanMutation = useMutation({
    mutationFn: async (loanId: string) => {
      const token = localStorage.getItem('token');
      if (!token) throw new Error("Você precisa estar logado.");

      const payload = decodeJwtPayload(token);
      const userId = payload.sid || payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/sid"];
      if (!userId) throw new Error("Token inválido: SID não encontrado.");

      const response = await fetch(`/loan/api/loans/${loanId}/return`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ userId })
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "Erro ao devolver livro.");
      }

      return response.json();
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['userLoans'] });
      scheduleClearMessage(setSuccessMessage, "Livro devolvido com sucesso!");
    },
    onError: (err: any) => {
      const errorData = err.response?.data;
      const message = typeof errorData === 'string'
          ? errorData
          : (errorData?.message || err.message || "Erro ao devolver livro.");
      scheduleClearMessage(setErrorMessage, message);
    }
  });

  const handleReturnLoan = (loanId: string) => {
    setPendingLoanIds(prev => new Set(prev).add(loanId));
    returnLoanMutation.mutate(loanId, {
      onSettled: () => {
        setPendingLoanIds(prev => {
          const next = new Set(prev);
          next.delete(loanId);
          return next;
        });
      }
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'Overdue':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'Reserved':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Returned':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Active':
        return <Clock className="h-4 w-4" />;
      case 'Overdue':
        return <AlertTriangle className="h-4 w-4" />;
      case 'Reserved':
        return <Calendar className="h-4 w-4" />;
      case 'Returned':
        return <CheckCircle2 className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  return (
    <ProtectedRoute>
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Meus Empréstimos</h1>
          <p className="text-muted-foreground mt-2 text-lg">Acompanhe seus empréstimos ativos e reservados.</p>
        </div>

        {successMessage && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
            <CheckCircle2 className="h-5 w-5" />
            <p className="font-medium">{successMessage}</p>
          </div>
        )}

        {errorMessage && (
          <ErrorMessage title="Erro" message={errorMessage} />
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Card key={i} className="rounded-2xl p-6 space-y-4 border-border">
                <Skeleton className="h-48 w-full rounded-xl" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-10 w-full mt-4" />
              </Card>
            ))}
          </div>
        ) : error ? (
          <div className="py-12">
            <ErrorMessage
              title="Erro ao carregar empréstimos"
              message="Não foi possível obter seus empréstimos. Nossos engenheiros já foram notificados."
            />
            <Button 
              onClick={() => refetch()} 
              className="mt-4"
              variant="outline"
            >
              Tentar novamente
            </Button>
          </div>
        ) : (
          <>
            {loans && loans.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {loans.map((loan: Loan) => (
                  <Card key={loan.id} className="group rounded-2xl p-6 border-border shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full relative overflow-hidden mesh-card">
                    <div className="bg-accent/50 rounded-xl p-6 mb-6 flex items-center justify-center group-hover:bg-primary/10 transition-colors relative z-10">
                      <BookOpen className="h-12 w-12 text-muted-foreground/50 group-hover:text-primary transition-colors" />
                    </div>

                    <div className="flex-grow relative z-10">
                      <div className="flex justify-between items-start gap-2 mb-1">
                        <h2 className="text-xl font-bold group-hover:text-primary transition-colors line-clamp-2">{loan.bookTitle}</h2>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusColor(loan.status)}`}>
                          {getStatusIcon(loan.status)}
                          <span className="ml-1">{loan.status}</span>
                        </span>
                      </div>
                      <p className="text-muted-foreground font-medium mb-4">{loan.bookAuthor}</p>

                      <div className="space-y-3 mb-6">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Emprestado em: {formatDate(loan.loanDate)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className={`font-medium ${isOverdue(loan.dueDate) ? 'text-destructive' : 'text-muted-foreground'}`}>Vencimento: {formatDate(loan.dueDate)}</span>
                        </div>
                        {isOverdue(loan.dueDate) && loan.status === 'Active' && (
                          <div className="flex items-center gap-2 text-sm bg-red-50 text-red-700 px-3 py-2 rounded-lg">
                            <AlertTriangle className="h-4 w-4" />
                            <span className="font-medium">Empréstimo em atraso</span>
                          </div>
                        )}
                        {loan.returnDate && (
                          <div className="flex items-center gap-2 text-sm text-emerald-600">
                            <CheckCircle2 className="h-4 w-4" />
                            <span>Devolvido em: {formatDate(loan.returnDate)}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 mb-6">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-muted text-muted-foreground">
                          {loan.bookCategory}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2 relative z-10">
                      {(loan.status === 'Active' || loan.status === 'Overdue') && (
                        <Button
                          className="flex-grow py-6 rounded-xl font-bold"
                          disabled={pendingLoanIds.has(loan.id)}
                          onClick={() => handleReturnLoan(loan.id)}
                        >
                          {pendingLoanIds.has(loan.id) ? 'Processando...' : 'Devolver'}
                        </Button>
                      )}
                      {loan.status === 'Reserved' && (
                        <Button
                          className="flex-grow py-6 rounded-xl font-bold"
                          disabled={pendingLoanIds.has(loan.id)}
                          onClick={() => handleReturnLoan(loan.id)}
                        >
                          {pendingLoanIds.has(loan.id) ? 'Processando...' : 'Converter para Empréstimo'}
                        </Button>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 mesh-card rounded-3xl border border-dashed border-border">
                <BookOpen className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="text-xl font-semibold">Você não tem empréstimos ativos</h3>
                <p className="text-muted-foreground mt-2">Comece reservando ou pegando livros emprestados!</p>
                <Button 
                  onClick={() => window.location.href = '/catalogo'} 
                  className="mt-6"
                  variant="outline"
                >
                  Explorar Catálogo
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </ProtectedRoute>
  );
}
