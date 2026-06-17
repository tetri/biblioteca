import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { BookOpen, Plus, Trash2 } from 'lucide-react';
import api, { getApiErrorMessage } from '../lib/api';
import { ErrorMessage } from '../components/error-message';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

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
  const [dialogOpen, setDialogOpen] = useState(false);
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
      setDialogOpen(false);
      await queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
    onError: (createError: unknown) => {
      setSuccess(null);
      setError(getApiErrorMessage(createError, 'Não foi possível criar o livro.'));
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
      setError(getApiErrorMessage(deleteError, 'Não foi possível remover o livro.'));
    },
  });

  const metrics = useMemo(() => ({
    total: books.length,
    available: books.filter(b => b.availableCopies > 0).length,
    copies: books.reduce((acc, b) => acc + (b.totalCopies || 0), 0),
  }), [books]);

  const isFormValid = form.title && form.author && form.isbn && form.category;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight lg:text-3xl">Livros</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Cadastre e mantenha o acervo atualizado.
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 size-4" />
              Novo livro
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Novo livro</DialogTitle>
              <DialogDescription>
                Preencha os campos para adicionar um novo título ao catálogo.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-2">
              <div className="grid gap-2">
                <Label htmlFor="title">Título</Label>
                <Input id="title" placeholder="Título" value={form.title} onChange={(e) => setForm(p => ({ ...p, title: e.target.value }))} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="author">Autor</Label>
                <Input id="author" placeholder="Autor" value={form.author} onChange={(e) => setForm(p => ({ ...p, author: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="isbn">ISBN</Label>
                  <Input id="isbn" placeholder="ISBN" value={form.isbn} onChange={(e) => setForm(p => ({ ...p, isbn: e.target.value }))} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="category">Categoria</Label>
                  <Input id="category" placeholder="Categoria" value={form.category} onChange={(e) => setForm(p => ({ ...p, category: e.target.value }))} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="available">Cópias disponíveis</Label>
                  <Input id="available" type="number" min={0} value={form.availableCopies} onChange={(e) => setForm(p => ({ ...p, availableCopies: Number(e.target.value) }))} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="total">Total de cópias</Label>
                  <Input id="total" type="number" min={0} value={form.totalCopies} onChange={(e) => setForm(p => ({ ...p, totalCopies: Number(e.target.value) }))} />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
              <Button onClick={() => createMutation.mutate()} disabled={createMutation.isPending || !isFormValid}>
                {createMutation.isPending ? 'Criando...' : 'Adicionar livro'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {error && <ErrorMessage title="Erro" message={error} />}
      {success && (
        <div className="rounded-lg border border-border bg-accent px-4 py-3 text-sm font-medium text-accent-foreground">
          {success}
        </div>
      )}

      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="text-xs font-medium uppercase tracking-wider">Títulos</CardDescription>
            <CardTitle className="flex items-center gap-2 text-xl font-bold">
              <BookOpen className="size-5 text-primary" />
              {metrics.total}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="text-xs font-medium uppercase tracking-wider">Disponíveis</CardDescription>
            <CardTitle className="flex items-center gap-2 text-xl font-bold">
              {metrics.available}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="text-xs font-medium uppercase tracking-wider">Exemplares</CardDescription>
            <CardTitle className="flex items-center gap-2 text-xl font-bold">
              {metrics.copies}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Acervo atual</CardTitle>
          <CardDescription>Visualize e remova registros quando necessário.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : books.length === 0 ? (
            <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
              Nenhum livro cadastrado.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Título</TableHead>
                    <TableHead>Autor</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead className="text-center">Cópias</TableHead>
                    <TableHead className="text-center">Disponível</TableHead>
                    <TableHead className="text-right">Ação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {books.map((book) => (
                    <TableRow key={book.id}>
                      <TableCell className="font-medium">{book.title}</TableCell>
                      <TableCell className="text-muted-foreground">{book.author}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{book.category}</Badge>
                      </TableCell>
                      <TableCell className="text-center">{book.totalCopies}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant={book.availableCopies > 0 ? 'default' : 'destructive'}>
                          {book.availableCopies}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteMutation.mutate(book.id)}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="size-3" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
