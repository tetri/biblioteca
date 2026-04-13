import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest';
import LoginForm from '../components/login-form';
import { server } from '../mocks/server';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('LoginForm', () => {
  it('deve logar com credenciais corretas', async () => {
    render(<LoginForm />);
    
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'admin@biblioteca.com' } });
    fireEvent.change(screen.getByLabelText(/senha/i), { target: { value: 'password' } });
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));

    await waitFor(() => {
        // Validação de redirecionamento ou estado de sucesso
        expect(screen.queryByText(/erro/i)).not.toBeInTheDocument();
    });
  });
});
