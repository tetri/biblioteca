import { http, HttpResponse } from 'msw';

export const handlers = [
  http.post('/user/api/auth/login', async ({ request }) => {
    const body = (await request.json()) as { email?: string; password?: string };
    if (body?.email === 'admin@biblioteca.com' && body?.password === 'password') {
      return HttpResponse.json({ token: 'fake-jwt-token' });
    }
    return new HttpResponse(null, { status: 401 });
  }),

  http.post('/user/api/auth/register', async () => {
    return HttpResponse.json({ ok: true }, { status: 201 });
  }),
  
  http.get('/api/catalog/books', () => {
    return HttpResponse.json([
      { id: '1', title: 'Clean Code', author: 'Robert C. Martin' }
    ]);
  })
];
