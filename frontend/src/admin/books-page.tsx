import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api, { getApiErrorMessage } from '../lib/api';
import { ErrorMessage } from '../components/error-message';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { BookOpen, Plus, Trash2 } from 'lucide-react';

type Book = {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  availableCopies: number;
  totalCopies: number;
};

const QUERY_KEY = ['admin-books'];

export default function AdminBooksPage() {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: '',
    author: '',
    isbn: '',
    category: '',
    availableCopies: 1,
    totalCopies: 1,
  });

  const { data: books = [], isLoading } = useQuery<Book[]>({
    queryKey: QUERY_KEY,
    queryFn: async () => (await api.get('/catalog/api/catalog/books')).data,
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      await api.post('/catalog/api/catalog/books', form);
    },
    onSuccess: async () => {
      setError(null);
      setSuccess('Livro criado com sucesso.');
      setForm({ title: '', author: '', isbn: '', category: '', availableCopies: 1, totalCopies: 1 });
      await queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
    onError: (createError: unknown) => {
      setSuccess(null);
      setError(getApiErrorMessage(createError, 'Nao foi possivel criar o livro.'));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (bookId: string) => {
      await api.delete(`/catalog/api/catalog/books/${bookId}`);
    },
    onSuccess: async () => {
      setError(null);
      setSuccess('Livro removido com sucesso.');
      await queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
    onError: (deleteError: unknown) => {
      setSuccess(null);
      setError(getApiErrorMessage(deleteError, 'Nao foi possivel remover o livro.'));
    },
  });

  const metrics = useMemo(() => {
    return {
      total: books.length,
      available: books.filter(b => b.availableCopies > 0).length,
      copies: books.reduce((acc, b) => acc + (b.totalCopies || 0), 0),
    };
  }, [books]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Gerenciamento de Livros</h1>
        <p className="mt-1 text-slate-600">Cadastre e mantenha o acervo atualizado.</p>
      </div>

      {error && <ErrorMessage title="Erro" message={error} />}
      {success && <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-700">{success}</div>}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard title="Titulos" value={metrics.total} />
        <StatCard title="Disponiveis" value={metrics.available} />
        <StatCard title="Exemplares" value={metrics.copies} />
      </div>

      <Card className="border-slate-200 bg-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Plus className="h-4 w-4 text-indigo-600" /> Novo livro</CardTitle>
          <CardDescription>Preencha os campos para adicionar um novo titulo ao catalogo.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          <Input placeholder="Titulo" value={form.title} onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))} />
          <Input placeholder="Autor" value={form.author} onChange={(e) => setForm(prev => ({ ...prev, author: e.target.value }))} />
          <Input placeholder="ISBN" value={form.isbn} onChange={(e) => setForm(prev => ({ ...prev, isbn: e.target.value }))} />
          <Input placeholder="Categoria" value={form.category} onChange={(e) => setForm(prev => ({ ...prev, category: e.target.value }))} />
          <Input type="number" min={0} placeholder="Copias disponiveis" value={form.availableCopies} onChange={(e) => setForm(prev => ({ ...prev, availableCopies: Number(e.target.value) }))} />
          <Input type="number" min={0} placeholder="Total de copias" value={form.totalCopies} onChange={(e) => setForm(prev => ({ ...prev, totalCopies: Number(e.target.value) }))} />
          <div className="md:col-span-2 lg:col-span-3">
            <Button
              className="w-full md:w-auto"
              onClick={() => createMutation.mutate()}
              disabled={createMutation.isPending || !form.title || !form.author || !form.isbn || !form.category}
            >
              {createMutation.isPending ? 'Criando...' : 'Adicionar livro'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-slate-200 bg-white">
        <CardHeader>
          <CardTitle>Acervo atual</CardTitle>
          <CardDescription>Visualize e remova registros quando necessario.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {isLoading ? (
            <>
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </>
          ) : books.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-slate-500">Nenhum livro cadastrado.</div>
          ) : (
            books.map((book) => (
              <div key={book.id} className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50/40 p-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-semibold text-slate-900">{book.title}</p>
                  <p className="text-sm text-slate-600">{book.author} • {book.category}</p>
                  <p className="text-xs text-slate-500">Disponiveis: {book.availableCopies} / Total: {book.totalCopies}</p>
                </div>
                <Button
                  variant="destructive"
                  onClick={() => deleteMutation.mutate(book.id)}
                  disabled={deleteMutation.isPending}
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Remover
                </Button>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <Card className="border-slate-200 bg-white">
      <CardHeader>
        <CardDescription>{title}</CardDescription>
        <CardTitle className="flex items-center gap-2 text-3xl font-bold text-slate-900">
          <BookOpen className="h-5 w-5 text-indigo-600" />
          {value}
        </CardTitle>
      </CardHeader>
    </Card>
  );
}
