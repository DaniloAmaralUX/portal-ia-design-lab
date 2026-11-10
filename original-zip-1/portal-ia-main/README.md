# Portal IA da Pitang

**Prévia atual:** https://portal-ia-craft-preview.vercel.app, com acesso público e sem senha, conforme solicitado. A galeria de design system foi removida do portal; a biblioteca de componentes permanece interna ao código. [Padronização e validação desta entrega](docs/STANDARDIZATION.md).

**Versão isolada para continuidade:** [handoff e instruções](docs/HANDOFF-PORTAL.md), branch `handoff/portal-original-ui-audit`.

**Rodada atual de refinamento:** [craft, movimento e validação](docs/CRAFT-POLISH.md), branch `polish/jakub-emil`. A branch de handoff acima permanece preservada.

O portal de IA da Pitang tem quatro portas:

- **Manifesto:** por que a Pitang adota IA.
- **Academy:** as trilhas de capacitação de cada papel.
- **Método:** os guias de como a Pitang trabalha com IA.
- **Catálogo:** os plugins e as skills do marketplace interno para o Claude Code.

Ele só abre para quem entra com a conta Microsoft da Pitang. O nome do site está em `src/shared/brand.ts`, e o cabeçalho, os títulos e o rodapé leem de lá.

## Rodar

Você precisa do Node 24.12 ou mais novo e do repositório `skills` clonado ao lado deste, com o histórico, porque o build monta o catálogo a partir dele:

```bash
git clone https://gitlab.pitang.com/pitang-agentic/skills.git ../skills
npm install
npm run dev       # http://localhost:5190, sem a Microsoft: abre na tela de login, e o "Entrar" mostra um perfil de exemplo
npm run check     # tsc e eslint
npm test          # testes de unidade, com o Vitest
npm run build     # gera dist/client/, com o index.html, os chunks e os .md das páginas
npm run test:e2e  # build e testes de navegador, com o Playwright e o axe
npm start         # o build em :8080, com o login da Microsoft
```

O clone do `skills` não pode ser raso (`--depth`): o gerador do catálogo recusa, porque o `git log` dá a data de cada mudança. Em outra pasta, ponha o caminho no `SKILLS_DIR`. Mudou o `skills`? Reinicie o `npm run dev`, que lê o catálogo na subida.

As variáveis ficam no `.env`, que o git ignora. O [`.env.example`](.env.example) lista todas, com o que cada uma é e o padrão. Para rodar na máquina:

- **No `npm run dev`:** basta o `SKILLS_REPO_URL`.
- **No `npm start`:** também o `PORTAL_URL`, o `MICROSOFT_TENANT_ID`, o `MICROSOFT_CLIENT_ID`, o `MICROSOFT_CLIENT_SECRET` e o `SESSION_SECRET`.

O resto do arquivo tem padrão ou só existe no GitLab. O BFF não sobe com uma variável faltando ou errada, e a mensagem diz qual.

O `scripts/environment.test.ts` falha nestes casos:

- o código lê uma variável que o `.env.example` não lista;
- o `.env.example` lista uma que ninguém lê;
- o ambiente é lido fora do `bff/config.ts` e do `scripts/build-config.ts`.

O `npm test` roda o `deploy/render-service.sh`, que usa o `envsubst`. No macOS ele vem com `brew install gettext`, e no Debian, com `apt-get install gettext-base`. Sem ele, esses testes são pulados na máquina. No CI, que instala o pacote, eles são obrigatórios.

## Como funciona

Um site estático entrega cada arquivo a quem pedir. Um login feito só no React esconderia a tela, mas deixaria o JS, os `.md` e os .zip abertos pelo endereço. Por isso a checagem fica num BFF pequeno (`bff/`), na frente do build, como pedem o [guia de autorização da OWASP](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html) e a [RFC 10017](https://www.rfc-editor.org/rfc/rfc10017.html). Ele faz o login OpenID Connect com o Entra ID, guarda a sessão num cookie selado e só entrega o `index.html` e os arquivos do build a quem entrou.

O site é uma SPA no TanStack Router e roda num container só. O catálogo é montado no build, então o portal não tem banco nem API de conteúdo, e o container nunca fala com o GitLab. O log do BFF registra só a subida, os logins aceitos e recusados, os logouts e os erros, e o portal não mede uso.

As regras de cada assunto moram em `.claude/rules/`, e o README não as repete:

| Assunto | Rule |
|---|---|
| onde cada coisa mora, idioma, comentário, página nova | `architecture.md` |
| pilha, dependências e versão do Node | `stack-react.md` |
| segredo, HTML de conteúdo, autoria e token no navegador | `security.md` |
| login, sessão, cabeçalhos, CSP, log e acervo | `security-bff.md` |
| o que os testes cobrem e o gate | `testing.md` |
| o texto do site e da documentação | `writing.md` |
| o que o site lê do `skills` e não guarda | `catalog-first.md` |

## De onde vem cada dado

| Dado | Origem |
|---|---|
| Plugins, skills, arquivos, o `SKILL.md` e o `CHANGELOG.md` | o repositório `skills`, lido no build pelo `scripts/catalogo.mjs` que mora lá. Nada disso fica no git deste repositório |
| Título, exemplo de pedido, o que entrega e efeitos de cada skill | o `metadata` do frontmatter do `SKILL.md` |
| Área, dono, ciclo de vida, frase, público, o que espera e fluxo de cada plugin | a entrada do `marketplace.json` e o `plugin.json` |
| Quem contribuiu com cada skill | o `metadata.contributors` do `SKILL.md`, opcional |
| A data da última mudança | o `git log` do `skills` |
| Caracteres na lista de skills | o gerador soma o nome e a description; a skill manual não entra na lista que o Claude Code carrega |
| As três áreas e as sugestões de busca da inicial | `src/data/areas.ts`, escrito para o site. A área de cada plugin vem do `metadata.area` do `skills`. A área que chega em breve, o Design, tem um card próprio na inicial, sem skills nem links, no `src/features/home/AreasSection.tsx` |
| O roteiro de cada área no Método | `src/data/roadmaps.ts`, escrito para o site a partir dos guias e dos plugins |
| As trilhas de capacitação | `src/data/roles.ts` e, em `src/features/academy/`, o `training.ts`, o `courses.ts` e o `lessons.ts`. Vieram do artefato "Trilhas de capacitação em IA", convertido em 05/10/2026, com os tempos lidos nas plataformas em 28/09/2026 |

No build e no `npm run dev`, o plugin `scripts/catalog.ts` roda o `scripts/catalogo.mjs` do `skills` e expõe o catálogo por módulos virtuais:

- o índice leve que toda página usa;
- o catálogo das páginas de plugin e de skill;
- o `CHANGELOG`;
- o `SKILL.md` de cada skill, que desce só com a página dela.

Se o `skills` não passa no validador de lá, o gerador falha com os achados, e o portal não monta o catálogo.

No CI, o catálogo vem do branch `stable` do `skills`, que só anda com uma release:

1. O job `verify` clona o projeto do `SKILLS_PROJECT_PATH` com o `CI_JOB_TOKEN`, só o branch do `SKILLS_REF` (o `stable`). Sem a `main` no clone, o validador do `skills` não compara a versão dos plugins com ela. Entre o merge de um MR do `skills` e a release, a `main` fica à frente do `stable`, e a comparação leria a release como versão que desceu.
2. O `verify` grava o commit que clonou no `skills.env` (`SKILLS_SHA`).
3. O `browser` e o `build-image` põem o clone deles nesse mesmo commit. Assim, o que passou nos testes é o que vai para a imagem, mesmo que o `stable` ande no meio do pipeline.

Com o `SKILLS_REF` definido, o build confere que a ref existe e é o `HEAD` do clone (`scripts/skills-source.ts`). Com `CI=true`, ele recusa também um clone com mudança sem commit. Na máquina, a mudança local vale, para quem escreve uma skill ver o resultado.

## Quem criou e quem contribuiu

A página de cada skill mostra quem a criou e quem contribuiu, só pelo nome, com as iniciais no lugar da foto. A página do plugin não mostra autoria.

- **Quem criou** vem do `metadata.author` da skill, que o validador do `skills` exige em toda skill. O `author.name` do `plugin.json` é sempre "Pitang", e o portal não o mostra.
- **Quem contribuiu** vem do `metadata.contributors` da skill, que é opcional: só aparece quem o time decidiu creditar, e quem só fez commit na pasta não entra. A skill sem o campo mostra só quem a criou.

## Baixar

Cada plugin e cada skill têm um .zip:

- **O do plugin:** a pasta dele como está no `skills`.
- **O da skill:** a pasta dela e as das skills que ela lista no `metadata.requires`.

O build monta os .zip a partir dos arquivos que o `skills` guarda no git, com o `scripts/downloads.ts` e o `fflate`, e grava em `dist/client/downloads/`. Os arquivos dentro do .zip levam a data do commit do catálogo, então o mesmo commit dá sempre os mesmos bytes. O nome sai de uma função só, `src/shared/zip-name.ts`.

O mesmo código grava em `dist/client/acervo/` o acervo, os arquivos dos plugins que as páginas abrem.

## Manifesto, Academy, Método e Ferramentas

- **O Manifesto,** em `/manifesto`, é a primeira porta do menu do topo: uma página de leitura que diz por que a Pitang adota IA e como pedir ajuda ao Pitang Labs.
- **A Academy,** em `/academy`, ensina IA do zero ao avançado: a trilha de capacitação de cada papel, como estudar em português e o glossário.
- **O Método,** em `/metodo`, junta os guias de como a Pitang trabalha com IA, na ordem do trabalho: comece aqui (por que adotar o SDD e o mapa da esteira), os requisitos, o ciclo SDD e a prova real, com um roteiro por área. O ciclo SDD tem um resumo e um passo a passo por ferramenta (Compozy, OpenSpec e Spec Kit), que são alternativas: o tempo de leitura conta só uma (`readingTime`, em `src/data/guides.ts`).

- **As Ferramentas,** em `/ferramentas`, são o que a Pitang constrói para o trabalho com agentes de IA. Hoje há o Catalyst Toolkit, em `/ferramentas/catalyst-toolkit`: a página do produto, com a instalação, os passos da primeira vez em cada sistema e o vídeo da casa, e um guia de seis capítulos. O vídeo está em `src/content/videos/`.

O texto de cada guia está em `src/content/guides/<slug>.md`. Os dados da página (título, grupo, tempo de leitura e rodapé) estão em `src/data/guides.ts`. A esteira é um diagrama, no `src/features/method/PipelineDiagram.tsx`. As figuras do Catalyst Toolkit (o ciclo e o radar) são componentes do site, em `src/features/method/figures/`, e o Markdown as chama como imagem: `![o que a figura mostra](figura/catalyst-radar)`.

| Guia | Endereço | Origem |
|---|---|---|
| Manifesto "O Pé de IA é uma Pitangueira" | `/manifesto` | escrito aqui |
| Guia SDD com Compozy | `/metodo/sdd` | escrito aqui |
| Especificação de requisitos | `/metodo/especificacao` | cópia do `pitang-agentic/requisitos`, pasta `guias/` |
| Histórias de usuário | `/metodo/historias-de-usuario` | cópia do `pitang-agentic/requisitos`, pasta `guias/` |
| Artefatos de entrada | `/metodo/artefatos-de-entrada` | cópia do `pitang-agentic/requisitos`, pasta `guias/` |
| Estudo de caso SAAT/PEAT | `/metodo/estudo-de-caso` | escrito aqui |
| Esteira agêntica | `/metodo/esteira` | escrito aqui |
| Catalyst Toolkit | `/ferramentas/catalyst-toolkit`, e o endereço curto `/catalyst` | escrito aqui: a instalação, do README do `pitang-agentic/catalyst-toolkit`; o uso do `doctor` e do `init`, da tag `v0.2.0` do `pitang-agentic/pitang-dev-cli` e dos roteiros do protótipo `plan/tui/v6/`, do mesmo repositório |

O guia SDD, o de Especificação, o de Histórias de usuário e o Catalyst Toolkit se leem por capítulos, em `/metodo/<guia>/<capítulo>`. Cada título `##` com âncora no Markdown abre um capítulo: o `## 2.6 O pipeline Compozy {#pipeline}` do SDD vira `/metodo/sdd/pipeline`. O rótulo em negrito logo antes do título vira a parte do guia no sumário, à direita do texto.

As siglas dos guias e o que cada uma quer dizer estão em `src/data/glossary.ts`, junto com os termos que o site explica. A página `/academy/glossario` lista os dois.

Os três guias de requisitos são cópia do repositório `requisitos`, e a mudança de lá entra aqui à mão. Compare a página nova da pasta `guias/` de lá com a versão convertida, que está no histórico deste repositório, e aplique a diferença:

```bash
git show 59910bf:requisitos-historias-usuario.html > /tmp/historias-antes.html
```

### As trilhas de capacitação

Cada papel tem uma trilha: analista de requisitos e PO, desenvolvedor e engenheiro de testes. Cada trilha junta cursos gratuitos da Anthropic Academy, da OpenAI Academy e do Microsoft Learn em três fases, e cada curso traz a classificação para o papel (essencial, recomendado ou opcional) e o porquê.

| Página | O que mostra |
|---|---|
| `/academy` | a escolha do papel, os três cursos de fundamentos comuns a todo papel e como ler a classificação |
| `/academy/trilhas/<área>` | a trilha do papel (`produto`, `engenharia` ou `qualidade`): o tempo de cada classificação e os cursos de cada fase, com as aulas da Anthropic, o link e o tempo de cada uma |
| `/academy/em-portugues` | como ligar a legenda em português no YouTube e traduzir a página no Chrome e no Edge, com os prints em `src/content/training/` |

O botão de curso feito fica guardado só no navegador (`src/features/academy/use-completed-courses.ts`), como os capítulos lidos. O curso feito vale em toda trilha que o indica.

O tempo de cada curso da Anthropic, no `courses.ts`, repete a soma das aulas, para a trilha não precisar carregar as aulas. O `src/features/academy/training.test.ts` confere essa soma. Para incluir um curso:

1. ponha o curso no `courses.ts`;
2. ponha as aulas no `lessons.ts`, quando a plataforma dá o tempo de cada uma;
3. ponha o curso na trilha que o indica, no `training.ts`.

### Os intervalos técnicos

O `/academy/intervalos` lista as gravações dos intervalos técnicos, uma por card, com o título, a data, a duração e a área, e filtra por área. Cada card abre a página do intervalo, com o vídeo e o texto que explica o que foi mostrado.

Para publicar um intervalo, crie um arquivo em `src/content/intervals/`. O nome do arquivo vira o endereço da página: `revisao-de-pr.md` abre em `/academy/intervalos/revisao-de-pr`.

```markdown
---
title: Revisão de PR com o pr-review
date: 2026-10-15
minutes: 42
area: engenharia
summary: As seis revisões de PR do plugin pr-review, uma por ângulo, num PR de verdade.
video: https://empresa.sharepoint.com/sites/time/_layouts/15/embed.aspx?UniqueId=...
---

O texto que explica o intervalo, em Markdown.
```

- O `area` é `produto`, `qualidade` ou `engenharia`. Sem ele, o intervalo vale para todas as áreas. O `minutes` é a duração da gravação, em minutos inteiros, e também é opcional: sem ele, o card não mostra o tempo.
- O `video` é o endereço do `src` do código de incorporação. No Stream, abra a gravação e clique em Compartilhar e depois em Incorporar.
- A gravação precisa estar compartilhada com as pessoas da Pitang, e quem assiste precisa estar com a conta da Microsoft aberta no navegador.
- O build confere cada cabeçalho e falha com o nome do arquivo e do campo errado (`scripts/intervals.ts`).

O vídeo toca dentro da página, num `iframe` que a política de conteúdo libera só para o `SHAREPOINT_ORIGIN`, a origem do SharePoint das gravações. Com intervalo na pasta, a variável é obrigatória: sem ela, o build e o `npm run dev` param e dizem o que pôr no `.env`. O build também recusa o vídeo que estiver em outra origem. Embaixo do vídeo fica o link da gravação, para o navegador que bloqueia os cookies de outro site, como o Safari, e não deixa o vídeo entrar com a conta.

### Publicar pelo portal

O `/publicar` tem dois formulários: o do intervalo técnico (`/publicar/intervalo-tecnico`) e o da aula de treinamento (`/publicar/treinamento`). Cada um confere os campos com as regras do build e, no botão "Enviar", já manda o arquivo para revisão. Um treinamento novo leva dois arquivos, o `course.md` e o `1.md`. A aula de um treinamento que já existe entra com o número seguinte ao da última aula. O campo da gravação aceita o código de incorporação inteiro do Stream, e o formulário tira dele o `src`.

Só abre o formulário quem está no `PUBLISHER_EMAILS`, a lista de e-mails do BFF. O `/api/me` diz a cada pessoa se ela está na lista (`canPublish`), e o menu da conta mostra o link "Publicar no Academy" só para ela. Na máquina, o perfil de exemplo do `npm run dev` publica.

O botão "Enviar" confere os campos e chama o `POST /api/publish`. O BFF confere de novo a sessão, o `PUBLISHER_EMAILS`, o cabeçalho `X-Portal: publish` e o conteúdo (as mesmas regras do formulário, em `src/shared/publish-files.ts` e `src/shared/publish-request.ts`, mais a origem do `SHAREPOINT_ORIGIN`), recusa corpo acima de 300 KB e deixa a solicitação na **fila**, um bucket privado do Cloud Storage (`bff/queue.ts`), com a resposta 202. O portal nunca chama o GitLab: ele é interno, e o Cloud Run não o alcança.

Quem abre o Merge Request é o job agendado `publicar-pendentes` do GitLab CI, que **chama o GCP**, com o mesmo login por identidade (WIF) do deploy. Ele lê os objetos de `pending/` do bucket e roda o `scripts/publish-pending.ts` em cada um, que faz o que o BFF fazia antes (`scripts/publish-gitlab.ts`): um commit com o arquivo numa branch nova (`publicar/intervalo-<endereço>` ou `publicar/aula-<treinamento>-<número>`, a partir da `main`) e o MR, com o nome de quem enviou na descrição. O número da aula vem do repositório, pela contagem das aulas do treinamento na `main`. O script diz ao job pelo código de saída para onde o objeto vai: 0 (MR aberto) para `feitos/`, 3 (recusa que repetiria: formato errado, endereço ocupado, treinamento que não existe) para `falhas/`, e 1 (o GitLab não respondeu) deixa em `pending/` para a próxima rodada e faz o job falhar, para o time ser avisado. Se o MR falha depois do commit, o script apaga a branch.

O MR aparece na próxima rodada do agendamento, e não na hora. O botão **Play** do schedule roda o job agora.

O que o projeto precisa para ligar o envio:
- **Variáveis do BFF e do job:** o `PUBLISH_BUCKET`, o nome do bucket. Sem ele, o botão avisa que o envio não está ligado, e o arquivo continua na página para copiar.
- **Variável só do job:** o `PUBLISH_GITLAB_TOKEN`, um token de acesso do projeto com o papel Developer e o escopo `api`, Masked e Protected. Ele fica só no GitLab: não vai para o Cloud Run nem para o Secret Manager, e o script o recebe pelo stdin. Cria branch e abre MR, e não faz merge: a `main` precisa estar protegida (merge só por Maintainers, ninguém com push direto), com "Pipelines must succeed" e pelo menos uma aprovação.
- **O schedule:** em Settings, CI/CD, Schedules, um agendamento na `main` (por exemplo `0 8 * * 1-5`). Num pipeline agendado só roda o `publicar-pendentes`: o `verify`, o `browser`, o `build-image` e o `deploy` ficam de fora.
- **A infra:** o bucket e as permissões, em "O que a infra cria uma vez".

Para testar a metade do GitLab sem o bucket, na máquina e com a VPN ligada: `printf %s "$TOKEN" | node scripts/publish-pending.ts <arquivo.json> --gitlab https://gitlab.pitang.com --project pitang-agentic/portal-ia`, com um objeto da fila de exemplo. O resultado sai no código de saída e numa linha de texto.

## O que o site faz

- **Busca no Catálogo, em português.** Ela tira acento e entende plural e sinônimos simples, como `PR` para "pull request" e `massa` para `test-data`. Filtra por área, plugin e modo, e os filtros ficam na URL. Os trechos dos guias que casam com a busca aparecem embaixo.
- **Duas abas no Catálogo:** por skill ou por plugin. Em `/plugins#kit`, o time marca os plugins do projeto e copia o trecho do `.claude/settings.json`.
- **Página de cada skill.** Ela começa pelo que um PO precisa saber: o título, como pedir ao Claude, o que ele entrega e onde o Método ensina o uso. Depois desce para o que um dev confere antes de instalar: o que a skill faz no projeto, a instalação, as dependências, o `SKILL.md` e os arquivos, cada um legível na própria página.
- **Ficha técnica, na lateral.** Ela traz os tipos de efeito, o dono, o ciclo de vida, a versão, a data da última mudança e os caracteres que a skill ocupa na lista do Claude Code.
- **Instalação no Claude Code,** no terminal, nas extensões de IDE e no app Desktop em sessão local: o marketplace no `#stable` e o plugin. As outras formas ficam recolhidas: pelo terminal, para o time do projeto, a managed settings do admin do Claude, e o .zip com `--plugin-dir`. A sessão na nuvem (o Claude Code na web, ou o Desktop em modo Cloud) não atende projeto do GitLab, e a página diz isso. Atualizar e desinstalar ficam em `/primeiros-passos`.
- **Paleta de comandos.** O `⌘K` ou o `Ctrl K` abre a paleta de qualquer página, para ir direto a uma skill, um plugin, um trecho de guia, uma página ou uma área. Sem nada digitado, ela lista as cinco últimas páginas abertas e as cinco últimas buscas que levaram a um resultado. O `/` foca a busca da página.
- **Guias e trilhas.** Os guias longos se leem por capítulos, e cada capítulo lista as skills que cita. O sumário de cada página fica à direita do texto e marca a seção em que a leitura está. O site marca o que a pessoa já leu e os cursos que ela fez, guardados só no navegador.
- **O próximo passo do papel.** A página inicial pergunta o papel da pessoa e guarda a escolha só no navegador (`src/hooks/use-my-area.ts`). Com o papel, a página mostra três cartões: o próximo curso da trilha, com os essenciais antes dos recomendados; o próximo passo de leitura do roteiro da área; e o próximo capítulo do primeiro guia que ela deixou no meio. Sem guia no meio, o terceiro cartão leva às skills da área.
- **Leitura ou apresentação.** Os guias do Método e o manifesto abrem também como slides em tela cheia, feitos do mesmo texto: as setas, o Page Up e o Page Down passam os slides, o F liga a tela cheia e o Esc volta à leitura na seção do slide. Cada slide cabe na tela de quem apresenta, sem rolagem e com letra de 11 px ou mais: o que passa um pouco encolhe, e o que passa muito continua na página seguinte, cortado entre blocos ou, numa lista, tabela, código ou citação longa, entre itens e linhas. O slide fica no endereço, e o fim de um capítulo emenda no começo do próximo.
- **O resto:** o que mudou em cada versão, em `/novidades`; contribuir e pedir uma skill, em `/contribuir`; e o tema claro ou escuro, que no primeiro acesso segue o do sistema.

## Visual

- **Vermelho de ação.** As cores vêm do template 2025 da Pitang. O vermelho de ação é `#E11B22`, um tom abaixo do vermelho do logo (`#ED1C24`). O do logo dá 4,4:1 com texto branco e reprova no AA, e o de ação dá 4,8:1.
- **Uma cor por área:** Engenharia é vermelho, Qualidade é verde e Produto é dourado.
- **Vetores e fontes.** O logo, o símbolo, os arcos e as cruzes são os vetores do próprio template. As fontes estão na `stack-react.md`.

## O pipeline

| Job | O que faz |
|---|---|
| `verify` | `npm run check`, `npm test` e o build, com o `skills` do `stable` |
| `browser` | os testes de navegador, com 2 workers, porque o pod do runner tem menos CPU do que o nó que o Playwright enxerga. Ficam de fora o LCP e o CLS do `e2e/experience.spec.ts` (a tag `@vitals`): o pod mede a CPU dele, e não a página. O mesmo build pintou o `/` em 0,7 s num laptop e em 3,0 a 3,2 s no pod. Esses testes rodam no `npm run test:e2e`, num laptop como os que abrem o portal |
| `build-image` e `deploy` | a publicação no Cloud Run, só com as variáveis do GCP cadastradas. Veja a seção abaixo |

## Publicar uma release

O catálogo do portal é o da release do `skills`, e só o `stable` o move:

1. No `skills`, com o `npm test` e o `claude plugin validate --strict .` verdes, crie a tag da release, como a `v1.0.0`, e envie a tag.
2. Mova o `stable` para ela: `git push origin "v1.0.0^{commit}:refs/heads/stable"`. O `^{commit}` é obrigatório com tag anotada, e o `claude plugin tag` cria tag anotada. O `CONTRIBUTING.md` do `skills` tem o resto, inclusive como voltar uma release.
3. O push do `stable` dispara o job `atualiza-portal` do `skills`, que roda o pipeline do portal na `main`, sem levar variável nenhuma. O job não espera esse pipeline terminar, então abra o do portal e espere o verde.
4. Depois do deploy, confira:
   - o `/health` do portal responde `{"status":"ok","version":"..."}`, com a versão do `package.json` da `main`;
   - uma skill nova da release aparece no catálogo, em `/plugins/<plugin>/<skill>`, com a versão do plugin;
   - o comando de instalação, na mesma página, termina em `.git#stable`.

## Publicar no Cloud Run

O pipeline do GitLab publica o portal no Cloud Run quando o projeto tem as variáveis abaixo:

- **Sem as variáveis,** os jobs `build-image` e `deploy` nem aparecem.
- **Com as obrigatórias,** cada pipeline da `main` publica, inclusive o que o push do `stable` do `skills` dispara.
- **Só com `SKILLS_REF` igual a `stable`,** o padrão do `.gitlab-ci.yml`. Um pipeline manual com outra ref monta o catálogo e roda os testes, mas não publica.

Como a publicação funciona:

- **Login no Google sem chave guardada.** O job pede um ID token ao GitLab, troca por uma credencial curta no Workload Identity Federation (WIF) e impersona a conta de serviço de deploy, porque o Cloud Run não aceita o acesso direto da federação. O OIDC do GitLab é público (emissor `https://gitlab.pitang.com`), então o Google lê as chaves sozinho.
- **A imagem sai do Cloud Build** (`gcloud builds submit`). O runner é um executor de Kubernetes e pediria modo privilegiado para construir Docker.
  - **Contexto:** o job clona o `skills` em `.skills`, e o `.gcloudignore` manda esse clone com o `.git` dentro, porque o gerador lê o histórico. Sem o `.gcloudignore`, o `gcloud` usaria o `.gitignore`, que ignora o `.skills`.
  - **Variáveis do build:** o `SKILLS_REPO_URL` e o `SKILLS_CHANNEL` vão num `.build-env` que o `Dockerfile` lê, porque o Cloud Build não passa argumento junto com o `--tag`.
  - **Tag:** `<repositório>/portal-ia:<commit do portal>-<commit do skills>`, porque o mesmo commit do portal muda de conteúdo quando o `stable` anda.
- **O serviço é o `deploy/service.yaml`.** Ele traz a imagem pelo digest, os probes de `/health`, os dois segredos do Secret Manager em versão fixa e o CPU boost na subida. O `deploy/render-service.sh` preenche os valores com o `envsubst`, e o job aplica com `gcloud run services replace`. O Cloud Run ignora o `HEALTHCHECK` do `Dockerfile`.
- **O job `deploy` não mexe em quem invoca o serviço,** no domínio nem no load balancer. Isso é da infra.

### As variáveis

Cadastre em Settings, CI/CD, Variables. O que cada uma é, se é obrigatória e o padrão estão no [`.env.example`](.env.example). Esta tabela diz quem entrega cada uma e se ela é protegida.

Nenhuma é mascarada, porque nenhuma é segredo: os segredos ficam no Secret Manager, e o pipeline só leva o nome e a versão deles.

| Variável | Quem entrega | Protegida |
|---|---|---|
| `GCP_PROJECT_ID`, `GCP_REGION`, `GCP_ARTIFACT_REPOSITORY`, `CLOUD_RUN_SERVICE` | infra do GCP | sim |
| `GCP_WORKLOAD_IDENTITY_PROVIDER`, `GCP_DEPLOY_SERVICE_ACCOUNT`, `GCP_RUNTIME_SERVICE_ACCOUNT` | infra do GCP | sim |
| `PORTAL_URL` | infra do GCP, que dá o domínio | sim |
| `MICROSOFT_TENANT_ID` e `MICROSOFT_CLIENT_ID` | Microsoft Entra | sim |
| `MICROSOFT_CLIENT_SECRET_NAME` e `MICROSOFT_CLIENT_SECRET_VERSION` | infra do GCP, com o segredo que vem do Entra | sim |
| `SESSION_SECRET_NAME` e `SESSION_SECRET_VERSION` | infra do GCP | sim |
| `CLOUD_RUN_MIN_INSTANCES`, `CLOUD_RUN_MAX_INSTANCES` e `CLOUD_RUN_INGRESS` | infra do GCP | sim |
| `SESSION_DURATION_HOURS` | o time do portal | sim |
| `PUBLISHER_EMAILS` | o time do portal, com os e-mails que o RH indicar | sim |
| `PUBLISH_BUCKET` | a infra, com o bucket da fila | sim |
| `PUBLISH_GITLAB_TOKEN` | o time do portal, com o token que o GitLab gera | sim, e mascarada |
| `SKILLS_PROJECT_PATH` e `SKILLS_CHANNEL` | o time do portal | não: o `verify`, o `browser` e o `build-image` rodam em qualquer branch e precisam delas |

O `SKILLS_REF`, o `SKILLS_DIR` e o `SKILLS_REPO_URL` não entram aqui, porque o `.gitlab-ci.yml` já os define.

### O que o deploy não faz, e o que o projeto precisa configurar

- **O `gcloud run services replace` sobrescreve o serviço inteiro.** Uma anotação posta à mão no serviço, como o IAP ou o `default-url-disabled`, some no próximo deploy, porque vale o `deploy/service.yaml`. Se a infra precisar de uma, ela entra no `service.yaml`, como variável quando mudar de ambiente para ambiente.
- **A entrada do serviço começa fechada.**
  - O `CLOUD_RUN_INGRESS` tem o padrão `internal-and-cloud-load-balancing`, o caminho do load balancer da infra, e um serviço novo não abre para a internet antes dessa decisão.
  - Com esse padrão, o runner do GitLab só alcança o `PORTAL_URL` se o domínio passar pelo load balancer.
  - Abrir com `all` é decisão da infra, que muda a variável.
- **Quem pode pôr variável num pipeline.**
  - **O ajuste:** um Maintainer põe "Minimum role to use pipeline variables" em `no_one_allowed`, em Settings, CI/CD, Variables, no projeto do portal e no do `skills`.
  - **Por quê:** uma variável de pipeline vale mais que a do arquivo. Sem o ajuste, quem roda um pipeline à mão na `main` escolhe o `SKILLS_CHANNEL`, o `SKILLS_REPO_URL` ou o `SKILLS_REF`, e com isso o catálogo e os comandos do site.
  - **O gatilho continua funcionando:** o `atualiza-portal` do `skills` não leva variável (`forward: yaml_variables: false`).
- **O token do job não sobe com o `.skills`.**
  - Depois do clone, o `deploy/clone-skills.sh` troca a URL do `origin` pela do `SKILLS_REPO_URL`, sem o `CI_JOB_TOKEN`, porque o `.skills` vai ao Cloud Build com o `.git` dentro.
  - O `deploy/write-build-env.sh` confere o `SKILLS_REPO_URL` e o `SKILLS_CHANNEL` antes de gravar o `.build-env`, e recusa quebra de linha.

### O que a infra cria uma vez

1. **O projeto, com as APIs ligadas:** Cloud Run, Cloud Build, Artifact Registry, Secret Manager, IAM, IAM Credentials e Security Token Service.
2. **O repositório Docker** no Artifact Registry, na região, e o bucket de staging do Cloud Build, `gs://<projeto>_cloudbuild`.
3. **Os dois segredos no Secret Manager,** com a primeira versão de cada um: o segredo do cliente do Entra e o `SESSION_SECRET`.
4. **O pool e o provider do WIF** para o GitLab da Pitang. O emissor é `https://gitlab.pitang.com`, igual ao `iss` do token, e o público é o padrão do provider. O mapeamento e a condição abaixo valem só para este projeto, na `main`:

   ```bash
   gcloud iam workload-identity-pools create gitlab --location=global
   gcloud iam workload-identity-pools providers create-oidc gitlab-pitang --location=global \
     --workload-identity-pool=gitlab --issuer-uri="https://gitlab.pitang.com" \
     --attribute-mapping="google.subject=assertion.sub,attribute.project_id=assertion.project_id,attribute.ref=assertion.ref,attribute.ref_type=assertion.ref_type,attribute.ref_protected=assertion.ref_protected" \
     --attribute-condition="assertion.project_id=='<ID numérico do projeto portal-ia>' && assertion.ref=='main' && assertion.ref_type=='branch' && assertion.ref_protected=='true'"
   ```

5. **As duas contas de serviço,** cada uma com o mínimo:

   | Conta | Papéis |
   |---|---|
   | de runtime (`GCP_RUNTIME_SERVICE_ACCOUNT`) | `roles/secretmanager.secretAccessor` nos dois segredos, e mais nada |
   | de deploy (`GCP_DEPLOY_SERVICE_ACCOUNT`) | `roles/iam.workloadIdentityUser` para o pool, com o principal `principalSet://iam.googleapis.com/projects/<número>/locations/global/workloadIdentityPools/gitlab/attribute.project_id/<ID numérico do projeto portal-ia>`; `roles/cloudbuild.builds.editor` no projeto; `roles/run.developer` no projeto (no serviço, depois que ele existir); `roles/iam.serviceAccountUser` na conta de runtime; `roles/artifactregistry.reader` no repositório; e `roles/storage.objectUser` no bucket de staging |

   A conta com que o Cloud Build roda, a padrão do projeto ou uma própria, precisa escrever a imagem no repositório (`roles/artifactregistry.writer`) e o log (`roles/logging.logWriter`). A conta de deploy não recebe `roles/run.admin`: quem pode invocar o serviço não é decisão dela.
6. **Quem pode invocar o serviço** (`roles/run.invoker`), o domínio e o load balancer. A tranca do portal é o login do BFF, e a infra decide se o serviço aceita chamadas sem identidade do Google ou fica atrás de um load balancer com IAP.
7. **O domínio do `PORTAL_URL` apontando para o serviço,** e os dois endereços de retorno no app registration do Entra: `<PORTAL_URL>/auth/callback` e `<PORTAL_URL>/`.
8. **O bucket da fila do `/publicar`** (opcional: sem ele, o botão "Enviar" avisa que o envio não está ligado). Um bucket privado no projeto, na região do Cloud Run, com acesso uniforme no nível do bucket e prevenção de acesso público, com duas permissões só nele: `roles/storage.objectCreator` para a conta de runtime, que só cria objetos e só em nomes que começam com `pending/` (uma IAM Condition no nome do objeto, que o acesso uniforme permite), e `roles/storage.objectAdmin` para a conta de deploy, que o job agendado usa para listar, ler e mover. Uma regra de ciclo de vida apaga `feitos/` e `falhas/` depois de 30 dias. O nome do bucket é o `PUBLISH_BUCKET`. A condição do WIF (`main` protegida) já cobre o pipeline agendado, que roda na `main`.

### O primeiro deploy

1. A infra faz o que está acima e entrega os valores.
2. Um Maintainer cadastra as variáveis do projeto, com a `main` protegida.
3. Rode o pipeline da `main`. Os jobs `build-image` e `deploy` aparecem depois do `verify` e do `browser`.
4. Confira, nesta ordem:
   - o `build-image` termina com `IMAGE=<repositório>/portal-ia@sha256:...` no log, e a imagem está no Artifact Registry;
   - o `deploy` mostra o `gcloud run services replace` com a revisão nova pronta, e depois `<PORTAL_URL>/health answered {"status":"ok",...}`;
   - o `<PORTAL_URL>/` leva à tela de login da Microsoft, e o login volta para o portal.
5. Se o login no Google falhar, decodifique o token do job e confira dois campos:
   - **`iss`:** tem de ser exatamente o emissor do provider. A doc do GitLab para instância própria pede o emissor com barra no fim, e a doc do Google usa sem barra; vale o que o `iss` do token traz.
   - **`aud`:** tem de ser `https://iam.googleapis.com/` mais o nome do provider.
6. Se o deploy recusar a permissão ao configurar um segredo, confira antes que a conta de runtime enxerga os dois segredos. A doc de segredos do Cloud Run cita o `roles/run.admin`, mas não dê esse papel ao job.

### Voltar a uma versão anterior

Aponte o tráfego para a revisão anterior:

```bash
gcloud run revisions list --service=<CLOUD_RUN_SERVICE> --region=<GCP_REGION>
gcloud run services update-traffic <CLOUD_RUN_SERVICE> --region=<GCP_REGION> --to-revisions=<revisão anterior>=100
```

O próximo deploy volta a mandar todo o tráfego para a revisão nova, porque o `service.yaml` não fixa tráfego. Para o recuo durar, corrija a `main` com um `git revert` e deixe o pipeline publicar.

### Trocar um segredo sem derrubar ninguém

- **O `SESSION_SECRET`:**
  1. Crie uma versão nova do segredo no Secret Manager com as chaves numeradas, a nova primeiro: `2:segredo-novo,1:segredo-antigo`. O maior número sela, e todos abrem.
  2. Troque o `SESSION_SECRET_VERSION` e rode o pipeline da `main`. Quem já entrou segue entrando.
  3. Depois dos 60 minutos de inatividade e das horas da sessão, crie outra versão só com `2:segredo-novo` e publique de novo.

  A `security.md` explica as chaves numeradas.
- **O segredo do cliente do Entra:**
  1. Crie um segredo novo no app registration. O antigo continua valendo.
  2. Guarde o novo como versão nova no Secret Manager, troque o `MICROSOFT_CLIENT_SECRET_VERSION` e publique.
  3. Apague o segredo antigo no Entra.

Nos dois casos, só o número da versão passa pelo GitLab, nunca o valor.

## O que pedir à infra

O site entra no ar com os itens 1 a 4. O 5 é opcional: sem ele, cada pessoa instala pelo comando da página.

1. **O Google Cloud para o Cloud Run.** O que a infra cria e as variáveis que entrega estão em [Publicar no Cloud Run](#publicar-no-cloud-run). O `/health` responde 200 para os probes, e a porta é a 8080.
2. **O app registration no Entra ID da Pitang,** em portal.azure.com ou entra.microsoft.com, em "Registros de aplicativo":
   1. Tipos de conta: "Contas somente neste diretório organizacional (somente Pitang)".
   2. Plataforma "Web", com os URIs de redirecionamento `<PORTAL_URL>/auth/callback` e `<PORTAL_URL>/`. Para rodar na máquina, também `http://localhost:8080/auth/callback` e `http://localhost:8080/`, de preferência num app registration separado.
   3. Em "Certificados e segredos", um segredo do cliente, que a infra guarda no Secret Manager. A Microsoft recomenda certificado no lugar do segredo em produção.
   4. **O claim opcional `acct` no ID token, obrigatório para o portal,** em "Configuração de token" (Token configuration), "Adicionar declaração opcional", tipo ID, `acct`. Ele diz se a conta é de membro (0) ou de convidado (1), e o BFF só deixa entrar quem traz `acct` igual a 0. É ele que barra os convidados do tenant, as pessoas de fora chamadas para o Teams ou para pastas compartilhadas. Sem o claim, ninguém entra, e o log traz `detail: "the acct claim is missing from the ID token"`.
   5. Para limitar a um grupo, "Atribuição obrigatória" no aplicativo empresarial e o grupo atribuído. É opcional.
3. **Os segredos e as variáveis do BFF.** O `MICROSOFT_CLIENT_SECRET` e o `SESSION_SECRET` vão para o Secret Manager, e o pipeline leva só o nome e a versão deles. O `MICROSOFT_TENANT_ID` é o ID do diretório da Pitang, na Visão geral do app registration.
4. **O catálogo da release do `skills`.**
   - Na allowlist do job token do `skills`, este projeto, para o clone do CI.
   - A permissão de disparar pipeline aqui, para o job `atualiza-portal` do `skills`.
5. **A managed settings no admin do Claude,** com o Owner do Claude da Pitang, em Organization settings, Claude Code, Managed settings. Vale no plano Team.
   - O trecho é o do README do `skills`, e o painel de cada plugin mostra o mesmo: o marketplace no `stable`, o `autoUpdate` ligado e o `pluginTrustMessage`, sem `enabledPlugins`. Cada pessoa instala o plugin que quer.
   - A lista de permissão `strictKnownMarketplaces` é um bloco opcional, uma decisão de segurança da Pitang, e o texto dele avisa o que ela custa.
   - Cada pessoa continua precisando do login do GitLab salvo no git.

## O que ainda não existe

- **Medição de uso.** A aplicação não registra uso. Para medir, um coletor OpenTelemetry é o caminho, mas o OpenTelemetry do Claude Code esconde o nome de todo plugin de fora do marketplace oficial. O `OTEL_LOG_TOOL_DETAILS=1` mostra o nome, mas também exporta os comandos Bash e o que entra em cada ferramenta, e essa decisão é da Pitang.
- **Contato do dono e avaliações.** O `skills` ainda não declara o canal de contato do dono de cada plugin nem o resultado das avaliações das skills.
- **Plugins estáveis.** Todo plugin está em `experimental`.
