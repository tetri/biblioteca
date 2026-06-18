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

### Traduções
- Arquivos em `frontend/src/i18n/locales/<lang>/translation.json`.
- Para adicionar um novo idioma:
  1. Crie a pasta `frontend/src/i18n/locales/<lang>/` com o arquivo `translation.json` (use `pt-BR` como template).
  2. Registre o recurso em `frontend/src/i18n/config.ts`.
  3. Adicione o tipo do idioma em `frontend/src/hooks/useLanguage.ts` (`AppLanguage`).
  4. Adicione o label em todos os arquivos de tradução existentes na chave `language.<lang>`.
  5. Confirme que `npm run build` passa sem erros.
- Commits de novo idioma devem seguir o padrão `feat(i18n): add <language> translation`.
