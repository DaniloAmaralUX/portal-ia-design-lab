# Testes: política e gate

## Testes fazem parte da fatia

Quem escreve o código escreve os testes dele, na mesma tarefa. Não existe tarefa só de teste.

A cobertura segue o risco, e aqui o risco mora em cinco lugares: o catálogo, que vem do `skills`, e o que as páginas fazem com ele (`src/data/*.test.ts`, `src/lib/*.test.ts` e os de `e2e/`); a busca (`src/lib/search.test.ts`); o BFF, que é a tranca do portal (`bff/*.test.ts`); o que o build grava e a estrutura do `src/` (`scripts/*.test.ts`); e as páginas no navegador (`e2e/`). Tela sem lógica própria não precisa de teste de unidade, porque os testes de navegador já abrem toda página.

## Gate: o que impede dizer "pronto"

- Os testes que leem o catálogo precisam do repositório `skills` em `SKILLS_DIR` (o `../skills` por padrão), com o histórico. O `skills` tem de passar no próprio validador. O `SKILLS_REPO_URL` também é obrigatório, no ambiente ou no `.env`. O CI clona só o branch do `SKILLS_REF` do `skills` (`deploy/clone-skills.sh`).

- `npm run check` (tipos e lint) e `npm test` (Vitest) verdes.
- `npm run build` verde: o `tsc -b`, o Vite, o `.md` das páginas e a pré-compressão.
- `npx playwright test` verde sobre o build, que o BFF serve com o login de teste (`e2e/test-server.ts`). O projeto `login` entra uma vez, e os testes usam a sessão. Eles abrem toda página nos dois temas e rodam o axe nas páginas de cada modelo. Também conferem a tela de 320 px sem rolagem de lado, os `.md` das páginas, o peso (o capítulo baixa só o próprio texto), o LCP e o CLS, e o que quem não entrou não vê. O `e2e/experience.spec.ts` falha se o LCP passa de 2,5 s ou o CLS, de 0,1, num laptop e num celular de 375 px com a CPU 4 vezes mais lenta, na mesma rede (`PROFILE` e `PHONE_PROFILE`, em `e2e/vitals.ts`). O `npm run test:e2e` roda o Vite e a pré-compressão, sem o `tsc -b`, e depois os testes.
- O CI do GitLab roda os mesmos passos em todo MR (`.gitlab-ci.yml`), menos o `e2e/experience.spec.ts` (a tag `@vitals`). O pod do runner compartilhado mede a CPU dele, e não a página: o `/` pintou em 0,7 s num laptop e em 3,0 a 3,2 s no pod. Por isso, o LCP e o CLS se conferem no `npm run test:e2e`, na máquina de quem fecha a fatia.
