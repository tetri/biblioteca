import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
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
        if (!token) throw new Error(t('bookDetails.mutation.needLogin'));

        const payload = decodeJwtPayload(token);
        const userId = payload.sid || payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/sid"];
        if (!userId) throw new Error(t('bookDetails.mutation.invalidToken'));

        return api.post('/loan/api/loans/reserve', {
            bookId,
            userId,
            reservationDate: new Date().toISOString()
        });
    },
    onSuccess: () => {
        scheduleClearMessage(setSuccessMessage, t('bookDetails.success.reserve'), true);
    },
    onError: (err: Error) => {
        const e = err as { response?: { data?: { message?: string } | string }; message?: string };
        const errorData = e.response?.data;
        const message = typeof errorData === 'string'
            ? errorData
            : (errorData?.message || e.message || t('bookDetails.error.default'));

        scheduleClearMessage(setErrorMessage, message);
    }
  });

  if (isLoading) return (
    <PublicLayout>
      <div className="max-w-4xl mx-auto px-6 py-12">
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
      <div className="max-w-4xl mx-auto px-6 py-12">
        <ErrorMessage
            title={t('bookDetails.error.loadTitle')}
            message={t('bookDetails.error.loadMessage')}
        />
        <Button variant="ghost" className="mt-6" onClick={() => navigate('/catalogo')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> {t('bookDetails.backToCatalog')}
        </Button>
      </div>
    </PublicLayout>
  );

  return (
    <PublicLayout>
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Button
          variant="ghost"
          className="mb-8 text-muted-foreground hover:text-foreground"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> {t('bookDetails.back')}
        </Button>

        {successMessage && (
          <div role="status" aria-live="polite" className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
            <CheckCircle2 className="h-5 w-5" />
            <p className="font-medium">{successMessage}</p>
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 animate-in fade-in slide-in-from-top-4">
            <ErrorMessage title={t('bookDetails.error.title')} message={errorMessage} />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="md:col-span-1">
            <div className="aspect-[2/3] bg-accent/50 border-border rounded-2xl flex flex-col items-center justify-center text-muted-foreground/50 shadow-sm overflow-hidden group relative">
              <BookOpen className="h-20 w-20 group-hover:text-primary transition-colors" />
              <p className="mt-4 font-medium text-sm">{t('bookDetails.noCover')}</p>
              <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            <Card className="mt-8 border-border shadow-sm overflow-hidden rounded-2xl mesh-card">
              <CardHeader className="bg-accent/50 pb-4">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Info className="h-4 w-4 text-primary" />
                  {t('bookDetails.statusCard.title')}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-muted-foreground">{t('bookDetails.statusCard.available')}</span>
                  <span className={`text-lg font-bold ${book.availableCopies > 0 ? 'text-emerald-600' : 'text-destructive'}`}>
                    {book.availableCopies}
                  </span>
                </div>
                <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-1000 ${book.availableCopies > 0 ? 'bg-emerald-500' : 'bg-destructive'}`}
                    style={{ width: `${book.totalCopies > 0 ? Math.min(Math.max((book.availableCopies / book.totalCopies) * 100, 0), 100) : 0}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground/70 mt-2 text-center">
                  {t('bookDetails.statusCard.total', { count: book.totalCopies })}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2">
            <h1 className="text-4xl font-bold tracking-tight mb-2">{book.title}</h1>
            <p className="text-xl text-primary font-medium mb-8">{book.author}</p>

            <div className="grid grid-cols-2 gap-6 mb-10">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-accent rounded-lg text-muted-foreground">
                  <Hash className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{t('bookDetails.metadata.isbn')}</p>
                  <p className="font-medium">{book.isbn}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-accent rounded-lg text-muted-foreground">
                  <Tag className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{t('bookDetails.metadata.category')}</p>
                  <p className="font-medium">{book.category}</p>
                </div>
              </div>
            </div>

            <div className="max-w-none mb-12">
              <h3 className="text-lg font-bold mb-4">{t('bookDetails.about.title')}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {t('bookDetails.about.description', { category: book.category })}
              </p>
            </div>

            <Button
              className={`w-full py-8 rounded-2xl font-bold text-lg transition-all shadow-xl ${
                book.availableCopies > 0
                ? ''
                : 'bg-muted text-muted-foreground cursor-not-allowed'
              }`}
              disabled={book.availableCopies === 0 || reserveMutation.isPending}
              onClick={() => reserveMutation.mutate(book.id)}
            >
              {reserveMutation.isPending ? t('bookDetails.reserveProcessing') : t('bookDetails.reserveButton')}
            </Button>

            <p className="text-center text-muted-foreground/70 text-sm mt-4">
              {t('bookDetails.reserveHint')}
            </p>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
