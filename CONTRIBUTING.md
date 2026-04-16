# Diretrizes de Contribuição

## Como participar
Você pode contribuir abrindo Issues ou enviando Pull Requests.

### Issues
Use Issues para:
- Relatar bugs.
- Sugerir funcionalidades.
- Discutir arquitetura.

### Pull Requests
1. Garanta que os testes passem localmente:
   - `dotnet test Biblioteca.sln`
   - `cd frontend && npm ci && npm test`
2. Use Node.js 22+ no frontend (alinhado ao CI).
3. Mantenha o código limpo (Clean Code/SOLID).
4. Atualize documentação afetada (`README.md`, `GEMINI.md`, `AGENTS.md` e demais arquivos pertinentes).
5. Para mudanças de segurança, siga `SECURITY.md`.
