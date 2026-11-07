# Instruções deste repositório

O Portal IA da Pitang: a Academy (capacitação em IA por papel), o Método (os guias de como a Pitang trabalha com IA) e o Catálogo (as skills e os plugins do marketplace interno para o Claude Code). É uma SPA em React atrás de um BFF em Hono, que faz o login com a conta Microsoft da Pitang e só entrega o build a quem entrou. Publica no Cloud Run.

O `CLAUDE.md` só importa este arquivo (`@AGENTS.md`): a instrução mora aqui, e só aqui.

## As regras (ler antes de planejar, escrever ou revisar)

As convenções do projeto ficam em `.claude/rules/`, e cada uma é a fonte única do seu assunto. O Claude Code carrega todas sozinho. Outra ferramenta lê o arquivo do assunto antes de mexer nele:

| Regra | Vale para |
|---|---|
| `.claude/rules/architecture.md` | onde cada coisa mora: features por domínio, rotas finas, regras de dependência |
| `.claude/rules/stack-react.md` | as escolhas de tecnologia do site e o que não entra |
| `.claude/rules/security.md` | o que vale para o site todo: segredo, HTML de conteúdo, autoria e token no navegador |
| `.claude/rules/security-bff.md` | o BFF e o container (`bff/`, `src/shared/`, `deploy/`, `Dockerfile`, `e2e/test-server.ts`): o login, a sessão, os cabeçalhos, a CSP, o log e o acervo |
| `.claude/rules/testing.md` | a política de teste e o gate |
| `.claude/rules/catalog-first.md` | o catálogo, que vem do repositório `skills` no build (`src/data/`, `features/catalog`, `features/install`) |
| `.claude/rules/writing.md` | o texto que a pessoa lê no site e nos guias, e o da documentação: o README, este arquivo e as regras |

Não repita uma regra em outro arquivo: aponte para ela. Divergência de uma regra se resolve mudando a regra, no mesmo commit.

## Rodar

```bash
npm install
npm run dev       # a interface em http://localhost:5190, sem a Microsoft: abre na tela de login, e o "Entrar" mostra um perfil de exemplo
npm run check     # tsc e eslint
npm test          # testes de unidade
npm run test:e2e  # build e testes de navegador
npm start         # o build em :8080 com o login da Microsoft (precisa do .env)
```

O build lê o catálogo do repositório `skills`, em `../skills` ou em `SKILLS_DIR`, com o histórico, e precisa do `SKILLS_REPO_URL`. A lista de todas as variáveis de ambiente é o `.env.example`, e só o `bff/config.ts` e o `scripts/build-config.ts` leem o ambiente. O Node é o 24.12 ou mais novo.

## Antes de dizer que terminou

- O gate passa inteiro: `npm run check`, `npm test` e `npm run test:e2e`.
- Mudança de comportamento tem teste. Refatoração mantém os testes e o e2e verdes sem mudar o que eles conferem.
- O README e as rules continuam descrevendo o código.

## Commits e remoto

- Conventional Commits em português, com acento, uma intenção por commit, assunto de até 72 colunas. Sem trailer de ferramenta.
- Push, tag, merge e MR são do dono do repositório.
- Nunca leia nem escreva o `.env`. Segredo não entra no repositório nem no build.

## Em dúvida sobre uma biblioteca

Confira a doc oficial da versão do `package.json` (pelo Context7, se estiver configurado) antes de usar uma API. Não confie na memória.
