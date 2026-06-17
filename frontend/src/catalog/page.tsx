import { useState, useRef, useEffect, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../lib/api';
import { decodeJwtPayload } from '../lib/utils';
import { ErrorMessage } from '../components/error-message';
import { PublicLayout } from '../components/shared/public-layout';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import {
  BookOpen,
  CheckCircle2,
  Search,
  SlidersHorizontal,
  X,
  ChevronRight,
  Filter
} from "lucide-react";

interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  availableCopies: number;
}

const fetchBooks = async (query?: string): Promise<Book[]> => {
  const endpoint = query
    ? `/catalog/api/catalog/books/search?query=${encodeURIComponent(query)}`
    : '/catalog/api/catalog/books';
  const { data } = await api.get(endpoint);
  return data;
};

export function BooksPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('query') || '';

  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState(queryParam);
  const [showFilters, setShowFilters] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [filterAuthor, setFilterAuthor] = useState<string>('');

  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [pendingBookIds, setPendingBookIds] = useState<Set<string>>(new Set());
  const messageTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setSearchTerm(queryParam);
  }, [queryParam]);

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
      queryClient.invalidateQueries({ queryKey: ['books'] });
    }

    messageTimeoutRef.current = setTimeout(() => {
      setter(null);
      messageTimeoutRef.current = null;
    }, 5000);
  };

  const { data: books, isLoading, error } = useQuery({
    queryKey: ['books', queryParam],
    queryFn: () => fetchBooks(queryParam),
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
    onMutate: (bookId: string) => {
        setPendingBookIds(prev => new Set(prev).add(bookId));
    },
    onSuccess: async (_, bookId) => {
        await queryClient.invalidateQueries({ queryKey: ['books'] });
        setPendingBookIds(prev => {
            const next = new Set(prev);
            next.delete(bookId);
            return next;
        });
        scheduleClearMessage(setSuccessMessage, "Livro reservado com sucesso!");
    },
    onError: (err: any, bookId) => {
        setPendingBookIds(prev => {
            const next = new Set(prev);
            next.delete(bookId);
            return next;
        });
        const errorData = err.response?.data;
        const message = typeof errorData === 'string'
            ? errorData
            : (errorData?.message || err.message || "Erro ao reservar livro.");

        scheduleClearMessage(setErrorMessage, message);
    }
  });

  const createLoanMutation = useMutation({
    mutationFn: async (bookId: string) => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error("Você precisa estar logado para pegar um livro emprestado.");

        const payload = decodeJwtPayload(token);
        const userId = payload.sid || payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/sid"];
        if (!userId) throw new Error("Token inválido: SID não encontrado.");

        return api.post('/loan/api/loans', {
            bookId,
            userId
        });
    },
    onMutate: (bookId: string) => {
        setPendingBookIds(prev => new Set(prev).add(bookId));
    },
    onSuccess: async (_, bookId) => {
        await queryClient.invalidateQueries({ queryKey: ['books'] });
        setPendingBookIds(prev => {
            const next = new Set(prev);
            next.delete(bookId);
            return next;
        });
        scheduleClearMessage(setSuccessMessage, "Livro emprestado com sucesso!");
    },
    onError: (err: any, bookId) => {
        setPendingBookIds(prev => {
            const next = new Set(prev);
            next.delete(bookId);
            return next;
        });
        const errorData = err.response?.data;
        const message = typeof errorData === 'string'
            ? errorData
            : (errorData?.message || err.message || "Erro ao emprestar livro.");

        scheduleClearMessage(setErrorMessage, message);
    }
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setSearchParams({ query: searchTerm.trim() });
    } else {
      setSearchParams({});
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setFilterCategory('');
    setFilterAuthor('');
    setSearchParams({});
  };

  const filteredBooks = useMemo(() => {
    if (!books) return [];
    let list = Array.isArray(books) ? books : [];
    if (filterCategory) {
      list = list.filter(b => b.category.toLowerCase().includes(filterCategory.toLowerCase()));
    }
    if (filterAuthor) {
      list = list.filter(b => b.author.toLowerCase().includes(filterAuthor.toLowerCase()));
    }
    return list;
  }, [books, filterCategory, filterAuthor]);

  const categories = useMemo(() => {
    if (!books || !Array.isArray(books)) return [];
    const cats = new Set(books.map(b => b.category));
    return Array.from(cats).sort();
  }, [books]);

  const authors = useMemo(() => {
    if (!books || !Array.isArray(books)) return [];
    const auths = new Set(books.map(b => b.author));
    return Array.from(auths).sort();
  }, [books]);

  return (
    <PublicLayout>
      <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col gap-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Catálogo de Livros</h1>
          <p className="text-muted-foreground mt-2 text-lg">Explore nossa coleção e reserve suas próximas leituras.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <form onSubmit={handleSearch} className="relative flex-grow group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Pesquisar por título, autor, ISBN ou categoria..."
              className="pl-12 py-6 rounded-2xl transition-all shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-accent rounded-full text-muted-foreground transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </form>
          <Button
            variant="outline"
            className={`py-6 px-6 rounded-2xl flex gap-2 ${showFilters ? 'bg-accent' : ''}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal className="h-5 w-5" />
            Filtros
          </Button>
        </div>

        {showFilters && (
          <div className="mesh-card p-6 rounded-2xl border-border animate-in fade-in slide-in-from-top-4">
            <div className="flex items-center gap-2 mb-4 font-bold">
              <Filter className="h-4 w-4" />
              <span>Filtros Detalhados</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label htmlFor="filter-category" className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Categoria</label>
                <select
                  id="filter-category"
                  className="w-full bg-card border-border rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                >
                  <option value="">Todas as categorias</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label htmlFor="filter-author" className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Autor</label>
                <select
                  id="filter-author"
                  className="w-full bg-card border-border rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                  value={filterAuthor}
                  onChange={(e) => setFilterAuthor(e.target.value)}
                >
                  <option value="">Todos os autores</option>
                  {authors.map(author => (
                    <option key={author} value={author}>{author}</option>
                  ))}
                </select>
              </div>
            </div>
            {(filterCategory || filterAuthor) && (
              <Button
                variant="ghost"
                size="sm"
                className="mt-6 text-primary hover:text-primary/80 hover:bg-primary/10"
                onClick={() => { setFilterCategory(''); setFilterAuthor(''); }}
              >
                Limpar filtros
              </Button>
            )}
          </div>
        )}

        {successMessage && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
            <CheckCircle2 className="h-5 w-5" />
            <p className="font-medium">{successMessage}</p>
          </div>
        )}

        {errorMessage && (
          <ErrorMessage title="Erro de Reserva" message={errorMessage} />
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
              title="Erro ao carregar catálogo"
              message="Não foi possível obter os livros. Nossos engenheiros já foram notificados."
            />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredBooks.map((book: Book) => (
                <Card key={book.id} className="group rounded-2xl p-6 border-border shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full relative overflow-hidden mesh-card">
                  <Link to={`/catalogo/${book.id}`} className="absolute inset-0 z-0" aria-label={`Ver detalhes de ${book.title}`} />

                  <div className="bg-accent/50 rounded-xl p-6 mb-6 flex items-center justify-center group-hover:bg-primary/10 transition-colors relative z-10">
                    <BookOpen className="h-12 w-12 text-muted-foreground/50 group-hover:text-primary transition-colors" />
                  </div>

                  <div className="flex-grow relative z-10">
                    <div className="flex justify-between items-start gap-2 mb-1">
                      <h2 className="text-xl font-bold group-hover:text-primary transition-colors line-clamp-2">{book.title}</h2>
                    </div>
                    <p className="text-muted-foreground font-medium mb-4">{book.author}</p>

                    <div className="flex items-center gap-2 mb-6">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        book.availableCopies > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {book.availableCopies > 0 ? `${book.availableCopies} disponíveis` : 'Indisponível'}
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-muted text-muted-foreground">
                        {book.category}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 relative z-10">
                    {book.availableCopies > 0 ? (
                      <Button
                        className="flex-grow py-6 rounded-xl font-bold"
                        disabled={pendingBookIds.has(book.id)}
                        onClick={(e) => {
                          e.preventDefault();
                          createLoanMutation.mutate(book.id);
                        }}
                      >
                        {pendingBookIds.has(book.id) ? 'Processando...' : 'Pegar Emprestado'}
                      </Button>
                    ) : (
                      <Button
                        className="flex-grow py-6 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-700"
                        disabled={pendingBookIds.has(book.id)}
                        onClick={(e) => {
                          e.preventDefault();
                          reserveMutation.mutate(book.id);
                        }}
                      >
                        {pendingBookIds.has(book.id) ? 'Processando...' : 'Reservar'}
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      className="py-6 px-4 rounded-xl"
                      asChild
                    >
                      <Link to={`/catalogo/${book.id}`}><ChevronRight className="h-5 w-5" /></Link>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            {filteredBooks.length === 0 && (
              <div className="text-center py-20 mesh-card rounded-3xl border border-dashed border-border">
                <Search className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="text-xl font-semibold">Nenhum livro encontrado</h3>
                <p className="text-muted-foreground">Tente ajustar seus termos de busca ou filtros.</p>
                <Button variant="link" className="mt-4 text-primary" onClick={clearSearch}>
                  Limpar todos os filtros
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </PublicLayout>
  );
}
