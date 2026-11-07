# Stack: o site em React

As escolhas de tecnologia do portal. Onde cada coisa mora está em `architecture.md`.

- Build: Vite · Linguagem: TypeScript · UI: React 19 + shadcn/ui (Radix) + Tailwind 4
- Rotas: TanStack Router como SPA, com o @tanstack/router-plugin (rotas por arquivo) no Vite. O `index.html` e o `src/main.tsx` são a entrada. O BFF entrega o `index.html` para as páginas
- Código num arquivo só, sem code splitting (decisão do Diogo, de 09/10/2026). O portal é interno e fica atrás do login. A medição passou pelo BFF, em HTTP/2 e com o cache frio. O arquivo único teve a mesma primeira carga do code splitting: 0,3 s numa rede de 30 Mbps e 2,7 s num 4G lento, de 1,6 Mbps, com a CPU 4 vezes mais lenta. A primeira visita a cada página ficou 30 a 50 ms mais rápida na rede de 30 Mbps e 170 a 240 ms no 4G. O capítulo de um guia pinta em 0,6 s no perfil do alarme de LCP (`e2e/vitals.ts`), contra 1,4 s com o code splitting. A paleta abre inteira, sem estado de carregamento. Só o texto desce sob demanda: o de cada capítulo (`scripts/guide-index.ts`), o de cada guia lido inteiro (`src/data/guide-loader.ts`) e a doc de cada skill (`virtual:skill-docs`). No arquivo único, esse texto dobraria o JS da primeira carga. Do texto, o arquivo do site leva só o que a busca lê: os subtítulos e os 400 primeiros caracteres de cada capítulo, ou de cada seção no guia sem capítulos (`scripts/academy-index.ts`). O `chunkSizeWarningLimit` do `vite.config.ts` avisa quando o arquivo passa de 1,4 MB
- Dados: entram no build, por `src/data/`. Do servidor, o site só pede com `fetch`: o `/api/me`, que devolve quem entrou, e o logout (`src/lib/account.ts`), e o envio do `/publicar` (`POST /api/publish`, em `src/features/publish/submit.ts`, que o BFF responde com 202 depois de pôr a solicitação na fila), e o arquivo do `/acervo/` que a página da skill mostra (`SkillFileContent.tsx`)
- Estado de interface: Zustand (`src/store/`), lido campo a campo
- Markdown: react-markdown + remark-gfm · Busca: cmdk · Ícones: lucide-react · Avisos: sonner
- Login: o BFF (`bff/`), um servidor pequeno em Hono com o @hono/node-server. Ele fica na frente do build e também o entrega. O openid-client faz o OpenID Connect com o Entra ID da Pitang, e o iron-session sela a sessão no cookie. O Node 24.12 ou mais novo roda o TypeScript do BFF direto, sem flag, porque a remoção de tipos é estável desde a 24.12. Por isso o `tsconfig.bff.json` só aceita sintaxe que o Node apaga (`erasableSyntaxOnly`). A versão mínima está no `engines` do `package.json`, e a imagem e o CI usam o 24.21. O `Dockerfile` monta o container
- Fontes: @fontsource-variable (Inter, Montserrat e JetBrains Mono), que o próprio site serve
- Testes: Vitest (unidade) + Playwright com axe (navegador)
- Lint e tipos: o TypeScript em `strict`, com `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`, `noUncheckedIndexedAccess` e `verbatimModuleSyntax`. O ESLint com `recommendedTypeChecked` (`projectService`), `react-hooks`, `no-floating-promises`, `no-explicit-any`, `consistent-type-imports`, `no-console` (só `error` e `warn`), `eqeqeq` em `smart`, `no-else-return`, `max-lines` em 300, sem export default, sem `enum` e o `no-restricted-imports` das regras de dependência (`architecture.md`)

## Dependências

- Só versão estável (nunca RC nem beta), publicada há 3 dias ou mais. O `package-lock.json` vai no git, e o CI roda o `npm ci`. A versão nova só entra com o gate verde (`npm run check`, `npm test` e `npm run test:e2e`).
- O `npm outdated` só lista o que tem motivo para ficar para trás: versão com menos de 3 dias, o TypeScript 7 (o typescript-eslint ainda não o aceita) e o `@types/node` 26 (a imagem roda o Node 24).

## Não fazer

- Não troque framework nem lib sem uma decisão do time registrada no MR.
- Não traga o Axios. O TanStack Query só entra quando houver uma tela que busque dado do BFF além do `/api/me`. O site é estático, e até lá o `fetch` dá conta do que ele pede.
- Não escreva módulo que só funciona por efeito no import. O `package.json` marca só `**/*.css` em `sideEffects`. Essa marca deixa o Rollup cortar o que o `index.ts` de uma feature exporta e nenhuma página usa. Sem ela, o arquivo do site leva tudo. O que precisa rodar é função chamada, não um `import` solto.
- Não edite `src/routeTree.gen.ts`. O plugin do TanStack Router gera esse arquivo no build e no `npm run dev`.
