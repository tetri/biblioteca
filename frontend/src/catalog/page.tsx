import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import { ErrorMessage } from '../components/error-message';
import { PublicLayout } from '../components/shared/public-layout';

interface Book {
  id: string;
  title: string;
  author: string;
  availableCopies: number;
}

const fetchBooks = async (): Promise<Book[]> => {
  const { data } = await api.get('/api/catalog/books');
  return data;
};

export function BooksPage() {
  const { data: books, isLoading, error } = useQuery({
    queryKey: ['books'],
    queryFn: fetchBooks,
  });

  if (isLoading) return <div>Carregando...</div>;
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
      <h1 className="text-3xl font-bold mb-6">Catálogo de Livros</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {bookList.map((book: Book) => (
          <div key={book.id} className="border p-4 rounded shadow">
            <h2 className="text-xl font-semibold">{book.title}</h2>
            <p className="text-gray-600">{book.author}</p>
            <p className="mt-2 text-sm">Disponíveis: {book.availableCopies}</p>
          </div>
        ))}
      </div>
    </PublicLayout>
  );
}

