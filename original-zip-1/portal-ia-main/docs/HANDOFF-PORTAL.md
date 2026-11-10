# Continuidade do Portal IA da Pitang

Branch isolada: `handoff/portal-original-ui-audit`.

Aplicação publicada: https://portal-ia-craft-preview.vercel.app. A senha permanece na configuração remota da Vercel.

## Abrir o código correto

```sh
git clone --single-branch --branch handoff/portal-original-ui-audit https://github.com/DaniloAmaralUX/portal-ia-design-lab.git
cd portal-ia-design-lab/original-zip-1/portal-ia-main
npm ci
```

Use Node.js 24.21 ou superior. A raiz do repositório contém outro projeto; o portal desta entrega fica em `original-zip-1/portal-ia-main`.

## Estado desta versão

Os textos, a ordem das seções, os títulos, a fonte Montserrat e a hierarquia visual foram restaurados do arquivo `portal-codigo-original.zip`. O preset Chanh Dai restante muda superfícies neutras e bordas. Não muda medidas de texto, grids ou espaçamento.

A auditoria segue a [UI Audit do Tommy Geoco](https://github.com/tommygeoco/ui-audit). Consulte `UI-AUDIT-ORIGINAL-FIDELITY.json`, `original-copy-restoration.json` e `original-fidelity-browser.json` nesta pasta. A conferência inicial registrou 65 arquivos iguais aos originais. Depois dela, o cabeçalho recebeu o atalho de handoff ao lado do tema e passou a recolher o nome do portal abaixo de 368 px para acomodá-lo.

O ícone do GitHub abre a pasta desta aplicação nesta branch, em outra aba. Ele aparece em todas as páginas que usam o cabeçalho comum.

## Rodar e validar

Leia `AGENTS.md` e `.claude/rules/` antes de editar. Configure o catálogo privado conforme o README principal. O build recebe `SKILLS_DIR`, `SKILLS_REPO_URL` e `SHAREPOINT_ORIGIN` pelo ambiente. Não grave credenciais no código.

```sh
npm run dev -- --host 127.0.0.1 --port 5194 --strictPort
npm run check
npm test
npm run build
```

O servidor de desenvolvimento usa o login de exemplo previsto no projeto. O catálogo privado não acompanha esta branch. A fixture externa usada na prévia é vazia, não contém skills da Pitang e não deve ser confundida com conteúdo de produção. Obtenha o catálogo com o time responsável para validar buscas e comandos reais.

## Validação do handoff

Tipos, lint, build e 14 testes Playwright passaram. O teste do atalho confere a branch de destino, abertura em outra aba, posição ao lado do tema e ausência de rolagem horizontal entre 320 e 1440 px. Os quatro testes do gateway de senha também passaram.

## Limitações conhecidas

- Na restauração, a suíte de unidade teve 449 testes aprovados, 24 falhas e 36 ignorados. As falhas incluem expectativas do catálogo privado ausente e limitações anteriores da infraestrutura de prévia. O gate completo não está verde.
- As contagens e os exemplos gerados a partir do catálogo vazio não representam o acervo real. Alguns resultados de demonstração mostram `undefined skills` sem o catálogo.
- A prévia da Vercel usa `src/prototype-host/`, com senha compartilhada. O BFF original em `bff/` continua sendo o caminho de autenticação Microsoft para produção institucional.
- A senha e os metadados locais da Vercel não fazem parte do repositório. Não versione `.env*`, `.vercel/`, `node_modules/` ou arquivos de sessão.

## Publicação da prévia

Com o catálogo e as variáveis de build configurados, execute `npm run build`, `node --test src/prototype-host/gateway.test.mjs` e `node scripts/build-prototype.mjs`. Publique o diretório gerado `.prototype-vercel` no projeto existente `portal-ia-craft-preview`, preservando suas variáveis remotas. Não publique o diretório `dist/client` diretamente: ele precisa da proteção do gateway.

## Pontos para continuar

- Conteúdo e hierarquia: `src/features/home/` e demais features.
- Cabeçalho e atalho desta branch: `src/components/layout/SiteHeader.tsx` e `GithubHandoff.tsx`.
- Estilos originais: `src/styles/globals.css`; acabamentos experimentais: `src/styles/chanhdai-portal.css`.
- Rotas: `src/routes/`; não edite `src/routeTree.gen.ts` manualmente.
- Testes de navegador desta entrega: `e2e/chanhdai-complete.spec.ts` e `e2e/home.spec.ts`.
