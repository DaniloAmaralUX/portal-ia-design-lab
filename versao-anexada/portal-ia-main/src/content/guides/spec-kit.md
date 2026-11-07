A especificação passa a ser o artefato principal da feature. O agente de IA lê, planeja e implementa a partir dela, e você concentra a revisão no que é caro de errar: a spec e as tarefas. Este guia vai do zero ao primeiro ciclo completo com o Spec Kit, o toolkit de SDD do GitHub, de forma acompanhada ou deixando a implementação rodar sozinha.

Este guia é o passo a passo do Spec Kit. Para saber por que adotar o SDD, leia [Por que utilizar o SDD?](/metodo/por-que-utilizar-o-sdd), e para comparar com outra ferramenta, o [Guia SDD](/metodo/sdd) e o [SDD com OpenSpec](/metodo/open-spec).

> **O que foi conferido neste guia**
>
> O passo a passo foi validado num MVP real, com a CLI `specify` 1.2.1 e o Claude Code. A anatomia dos artefatos, a seção de subagente e os exemplos de uma feature fictícia (exportar relatório em CSV) são ilustrações montadas a partir da documentação oficial e desse projeto.

O ciclo completo, em ordem. Os passos entre parênteses são opcionais:

```text
prompt-mestre  →  /speckit-constitution  →  /speckit-specify  →  /speckit-clarify  →  GATE 1: a spec
  →  /speckit-plan  →  (checklist)  →  /speckit-tasks  →  /speckit-analyze  →  GATE 2: as tarefas
  →  /speckit-implement (lote a lote)  →  review  →  /speckit-converge  →  encerramento
```

**ENTENDER**

## O que é o Spec Kit {#o-que-e}

O Spec Kit é um toolkit de código aberto do GitHub para SDD, com três partes. A CLI `specify`, escrita em Python, cria a estrutura do projeto. Os modelos e scripts ficam em `.specify/`. As skills do agente, instaladas por uma *integração* com o assistente de IA, são o que você digita no chat (`/speckit-specify`, `/speckit-plan` e outros). Os artefatos são arquivos markdown comuns, versionados com o código.

O `specify init` configura vários assistentes (a documentação lista Claude Code, GitHub Copilot, Gemini CLI e outros). Neste guia usamos o Claude Code, cuja integração instala as skills em `.claude/skills/speckit-*`.


## O fluxo de uma feature {#fluxo}

No Spec Kit, cada unidade de trabalho é uma **feature**: uma pasta em `specs/` com a especificação, o plano e as tarefas dela. O fluxo tem um comando por artefato. Cada comando lê os artefatos do anterior e grava o seu na pasta da feature.

| Etapa | Comando | O que acontece | Quem decide |
|---|---|---|---|
| 0. Constituição (uma vez) | `/speckit-constitution` | Registra os princípios do projeto: stack, segurança, testes, convenções. Sai o `constitution.md`, que os comandos seguintes consultam. | Você revisa |
| 1. Especificar | `/speckit-specify` | Escreve o `spec.md` (histórias, cenários de aceite, requisitos, critérios de sucesso) e um `checklists/requirements.md`. Sem tecnologia. | Você revisa |
| 2. Esclarecer | `/speckit-clarify` | Faz até 5 perguntas por execução para tirar ambiguidade e grava as respostas na seção `## Clarifications` da spec. | Você responde. **Gate 1**: aprovação da spec |
| 3. Planejar | `/speckit-plan` | Escreve o `plan.md` e os artefatos de apoio: `research.md`, `data-model.md`, `contracts/` e `quickstart.md`. | Você confirma as decisões que o agente listar |
| 4. Checklist (opcional) | `/speckit-checklist` | Gera um checklist por domínio, os "testes unitários dos requisitos": a spec e o plano estão completos e claros? | Você marca os itens |
| 5. Tarefas | `/speckit-tasks` | Escreve o `tasks.md`, agrupado em lotes. | Você revisa |
| 6. Analisar | `/speckit-analyze` | Confere spec, plano, tarefas e constituição entre si. Só lê. | Você corrige na origem. **Gate 2**: aprovação das tarefas |
| 7. Implementar | `/speckit-implement` | Executa as tarefas e marca `[X]`. Pede ou recebe um lote por vez. | Você pede e revisa o diff |
| 8. Convergir | `/speckit-converge` | Compara o código com spec, plano e tarefas e acrescenta ao `tasks.md` o que falta construir. | Você revisa |

> **Onde você decide**
>
> O esforço humano fica nos dois gates, a **spec** (o que construir) e as **tarefas** (como fatiar), mais as decisões que o plano pedir. Depois deles a implementação pode rodar sozinha, lote a lote, e para quando encontra um bloqueio real. O fim do ciclo é outro ponto humano: o encerramento, com a evidência de cada critério de aceite.

## Features, sem delta e sem archive {#conceitos}

O Spec Kit não separa o estado atual do sistema de uma proposta de mudança. Cada feature ganha a própria pasta, com os artefatos completos.

O efeito prático aparece na hora de manter. Para uma feature que já foi entregue e precisa mudar, a documentação sugere escolher um modelo e escrevê-lo na constituição:

- **Registro histórico.** A pasta da feature entregue não muda mais. A mudança vira uma feature nova.
- **Contrato vivo.** O `spec.md` continua valendo. Você o edita e regenera o plano e as tarefas a partir dele.
- **Realimentação.** O que se descobre no código, no plano ou nas tarefas volta para a spec, e o conjunto dos artefatos é reconciliado.

### Como fica no disco {#disco}

```text
<Projeto>.Sdd/
├── .claude/
│   └── skills/               as skills speckit-*, instaladas pela integração
├── .specify/
│   ├── memory/
│   │   └── constitution.md   princípios do projeto
│   ├── scripts/              scripts de apoio
│   ├── templates/            modelos de spec, plano e tarefas
│   ├── workflows/
│   └── feature.json          aponta a feature ativa (não vai para o git)
├── Feature/                  documentos de negócio e o prompt-mestre
└── specs/
    └── 001-exportar-relatorio-csv/
        ├── spec.md
        ├── checklists/       requirements.md e um arquivo por domínio
        ├── plan.md
        ├── research.md
        ├── data-model.md
        ├── contracts/
        ├── quickstart.md
        ├── tasks.md
        ├── handoffs.md       memória da execução autônoma (a IA cria, a seu pedido)
        └── reviews/          rodadas de revisão (a IA cria ao registrar os achados)
```

O `handoffs.md` e a pasta `reviews/` não vêm do Spec Kit: são convenções do modo autônomo, descritas mais adiante.

> **Branch e numeração**
>
> O `specify init` não cria repositório nem branch. A criação de branches de feature vem da extensão `git`, que não é instalada por padrão: `specify extension add git`. Sem ela, o `/speckit-specify` cria a pasta da feature em `specs/` e não cria branch. Para escolher o nome da pasta, use `SPECIFY_FEATURE_DIRECTORY`, como mostra o passo 6.
**PASSO A PASSO**

## 1 Instalar a CLI {#instalar}

Você precisa do Python 3.11 ou superior, do `uv` (o gerenciador de pacotes que a documentação recomenda) e do Claude Code, na extensão do VS Code ou na CLI. A CLI do Spec Kit é instalada uma vez por máquina.

```bash
# uv no Windows (PowerShell)
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
# uv no Linux e no macOS
curl -LsSf https://astral.sh/uv/install.sh | sh

# a CLI, globalmente
uv tool install --python 3.12 specify-cli --from git+https://github.com/github/spec-kit.git
specify check      # confere as ferramentas
specify version    # este guia foi validado com a 1.2.1
```

## 2 Montar o workspace {#workspace}

Crie uma pasta-mãe com os repositórios do projeto (um monorepo com várias pastas, ou vários repositórios lado a lado) e, **ao lado deles**, uma pasta de SDD, com o sufixo `.Sdd`. O VS Code abre dentro dela.

```text
Grupo.NomeProjeto/
├── Grupo.NomeProjeto.Sdd/          abra o VS Code AQUI
│   ├── Feature/                    documentos de negócio e o prompt-mestre
│   ├── .specify/  .claude/  specs/
├── Grupo.NomeProjeto.Api/
├── Grupo.NomeProjeto.View/
└── Grupo.NomeProjeto.TestesFuncionais/
```

### Por que uma pasta só para o planejamento {#pasta-sdd}

É na pasta de SDD que ficam as skills `speckit-*` e o `.specify/`, então é dela que o chat do Claude Code as enxerga. O código continua nas pastas irmãs. Para o agente enxergar o código, adicione as pastas ao workspace do VS Code (**Arquivo → Adicionar Pasta ao Workspace…**) e à sessão, como no [guia de OpenSpec](/metodo/open-spec#add-dir).

### Inicializar o Spec Kit {#inicializar}

No terminal, dentro da pasta de SDD:

```bash
specify init --here --force --integration claude
```

O `--force` é necessário porque a pasta já tem conteúdo. Faça o commit antes: ele aceita o merge e pode substituir arquivos nos caminhos que a ferramenta gerencia. Recarregue o chat do Claude Code para as skills aparecerem.

| Opção | O que faz |
|---|---|
| `--integration <chave>` | Escolhe o assistente. `claude` para o Claude Code. Sem ela, em modo não interativo, o padrão é o GitHub Copilot. |
| `--here` | Inicializa na pasta atual, em vez de criar uma nova. |
| `--force` | Aceita o merge numa pasta que já tem arquivos. |
| `--script sh\|ps\|py` | Escolhe os scripts de apoio. No Windows, o padrão é `ps` (PowerShell, sem WSL). |
| `--non-interactive` | Não espera resposta de menu. Útil em CI. |
| `--ignore-agent-tools` | Não confere se o agente está instalado. |

O init cria o `.specify/` (`memory/`, `scripts/`, `templates/` e `workflows/`) e as skills em `.claude/skills/speckit-*`.

> **Projeto que já existe**
>
> Crie uma branch de adoção e faça o commit do que estiver em andamento antes do `init`, para ler o diff depois. O init não reescreve a aplicação nem infere especificação do comportamento que já existe.

## 3 Preparar a fundação {#fundacao}

Nada do pipeline começa antes desta base estar de pé e revisada. Ela é a Fase 0.

| Item | O que fazer |
|---|---|
| Git | Decida monorepo ou repositórios separados e a branch de trabalho. Os commits do pipeline dependem disso. |
| `.gitignore` | Um por pasta. Ignore `.env` (versione só o `.env.example`), os artefatos de build e **qualquer arquivo com dado pessoal real**. Nunca ignore `.claude/rules/`. |
| `CLAUDE.md` central | Na pasta de SDD: a estrutura das pastas, as fontes e a precedência, as regras transversais e a política de git e de validação. É o ponto de partida de toda sessão. |
| `CLAUDE.md` e `AGENTS.md` por pasta | Os princípios da base, mais uma tabela que roteia cada rule de `.claude/rules/`. Os `paths` da tabela devem bater exatamente com os das rules. |
| Rules | Uma rule por camada, só com o campo `paths` no frontmatter. Se já existirem rules de uma execução anterior, **revise**. Não confie nelas às cegas. |
| Skills de apoio | Em `.claude/skills/` de cada repositório, coloque as skills que orientam a implementação dele: o OWASP Top 10 na API, as regras de segurança no front e assim por diante. |
| Skills antigas | Remova as skills de outros processos, para não competirem com as `speckit-*`. |

Depois de decidir o git, peça à IA para gerar a base e revise o resultado:

```text
Prepare a fundação do workspace para SDD com Spec Kit:
1. Um .gitignore por pasta (ignorar .env, e versionar só .env.example; ignorar
   artefatos de build e qualquer arquivo com dado pessoal real; nunca ignorar
   .claude/rules/).
2. Um CLAUDE.md central nesta pasta: estrutura das pastas, fontes de requisito e
   precedência, regras transversais, política de git e de validação. Curto.
3. Em cada pasta de código, um CLAUDE.md (princípios da base e uma tabela com cada
   rule de .claude/rules/ e seus paths) e as .claude/rules/ que faltarem: uma rule
   por camada, só "paths" no frontmatter. Se já existirem rules, revise-as em vez
   de recriar e me diga o que mudou.
4. Liste as skills de outros processos em .claude/skills/ que possam competir com
   as speckit-*.
Não faça commit.
```

## 4 Reunir os insumos e escrever o prompt-mestre {#prompt-mestre}

Na pasta de SDD, crie `Feature/` e coloque nela tudo o que ajuda o agente a entender o negócio: reuniões transcritas, requisitos, critérios de aceite, planilhas, contratos de API, telas. Para gerar histórias de usuário a partir disso, veja [Artefatos de entrada](/metodo/artefatos-de-entrada).

> **Anonimize antes de colocar na pasta**
>
> Transcrições e anexos costumam ter nomes de pessoas e empresas. Troque por papéis ("o gestor", "o fornecedor") antes de o agente ler. O que ele lê pode aparecer na spec, nos dados de exemplo e nos testes. Planilha real de apoio entra no `.gitignore` **antes** do primeiro commit: depois do commit, o ignore não remove o que já foi versionado.

### O que é o prompt-mestre {#o-prompt-mestre}

É um único arquivo Markdown, por exemplo `Feature/prompt-mestre.md`, gerado com IA a partir dos documentos de negócio e passado como argumento a vários comandos. É o artefato mais importante do processo: tudo o que a IA gera depois parte dele.

| Seção | Conteúdo |
|---|---|
| Instruções de leitura (no topo) | A tabela "comando, o que ler, limite", abaixo. Evita que um comando execute instruções de outro. |
| 1 Missão | O que será entregue e as restrições inegociáveis. |
| 2 Leitura obrigatória | As fontes de negócio e de arquitetura com a **precedência** explícita, o estado atual das pastas e um resumo do domínio. |
| 3 Decisões fechadas | Stack, arquitetura, autenticação, banco, implantação, idioma e catálogo de testes. O que não se rediscute. |
| 4 Fase 0 | A fundação do workspace (o passo anterior). |
| 5 Pipeline | Um passo por comando, com o argumento sugerido e o gate. Traz também a lista numerada de pendências de produto (P-01, P-02…). |
| 6 Entregáveis | O estado final obrigatório de cada pasta. |
| 7 Segurança | A revisão de segurança e as boas práticas. |
| 8 Critérios de aceite | A lista verificável que encerra o projeto. |

A tabela de leitura por comando, no topo do arquivo:

| Comando | O que ler | Limite |
|---|---|---|
| `/speckit-constitution` | regras transversais e decisões fechadas (seções 1, 3 e 4) | só a constituição |
| `/speckit-specify` | fontes de negócio e regras de mapeamento (seção 2 e passo 1 da seção 5) | sem stack |
| `/speckit-clarify` | pendências de produto (passo 1 da seção 5) | só perguntas e gravação em Clarifications |
| `/speckit-plan` | decisões técnicas e itens obrigatórios (seções 3, 6 e 7 e passo 2 da seção 5) | sem tasks e sem código |
| `/speckit-checklist` | domínios de checklist (passo 2 da seção 5) | sem alterar spec nem plano |
| `/speckit-tasks` | tarefas, lotes e IDs de teste (seção 3 e passo 3 da seção 5) | sem implementação |
| `/speckit-analyze` | coerência entre spec, plano, tarefas e constituição | somente leitura |
| `/speckit-implement` | o lote do argumento, as rules da pasta e a constituição | um lote por vez |
| review e converge | passos 5 e 6 da seção 5 e a seção 7 | só achados e tarefas de remediação |

### Gerar o rascunho {#gerar-prompt}

Com os documentos em `Feature/`, envie no chat:

```text
Leia INTEGRALMENTE todos os arquivos da pasta Feature/ (documentos, planilhas, PDFs,
HTMLs) e as pastas de código do workspace. Com base neles, escreva
Feature/prompt-mestre.md: o prompt que conduzirá este projeto no GitHub Spec Kit
(skills /speckit-* no Claude Code). Escreva em português.

Estrutura obrigatória:

## Instruções de leitura (no topo)
Tabela "Comando | O que ler | Limite", uma linha para cada comando:
/speckit-constitution (regras transversais e decisões fechadas → só a constituição),
/speckit-specify (fontes de negócio e regras de mapeamento → sem stack),
/speckit-clarify (pendências → só perguntas e gravação em Clarifications),
/speckit-plan (decisões técnicas e itens obrigatórios → sem tasks e sem código),
/speckit-checklist (domínios de checklist → sem alterar spec nem plan),
/speckit-tasks (organização, lotes e IDs de teste → sem implementação),
/speckit-analyze (coerência → somente leitura),
/speckit-implement (lote do argumento, rules da pasta, constituição → um lote por vez),
review e converge (achados → só achados e tarefas de remediação).

## 1. Missão: o que será entregue e as restrições inegociáveis.
## 2. Leitura obrigatória: cada arquivo de Feature/ numa tabela
   "Arquivo | O que é | Precedência", deixando explícito qual fonte manda no domínio,
   qual manda na arquitetura e quais são só contexto; estado atual das pastas de
   código (verificado no disco); resumo das regras de domínio.
## 3. Decisões fechadas: stack, arquitetura, autenticação, dados, implantação,
   testes, idioma; o que NÃO se rediscute. Marque como "divergência deliberada" o
   que contrariar alguma fonte.
## 4. Fase 0: o que precisa existir antes do pipeline.
## 5. Pipeline: um passo por comando /speckit-*, com o argumento sugerido e o gate
   humano de cada um. No passo do /speckit-specify, como mapear os documentos para o
   template da spec (histórias, cenários Dado/Quando/Então com o ID de origem
   preservado, requisitos FR-, critérios SC-). Liste TODAS as pendências e
   ambiguidades que você encontrar nas fontes, numeradas (P-01, P-02…), cada uma
   citando onde aparece. Não as resolva.
## 6. Entregáveis por pasta: estado final obrigatório.
## 7. Revisão de segurança e boas práticas.
## 8. Critérios de aceite finais: lista verificável que encerra o projeto.

Regras:
- Não invente requisitos. O que as fontes não decidirem vira pendência (P-nn) ou
  premissa marcada com ⚠️.
- Preserve os identificadores das fontes (IDs de regra, de história, de critério).
- Nenhum dado pessoal real (nomes, e-mails, documentos) no prompt-mestre.
- Ao final, me dê um resumo com: as fontes lidas, as precedências que você assumiu,
  as pendências encontradas e o que você não conseguiu ler.
```

### Revisar o rascunho {#revisar-prompt}

Leia o arquivo inteiro antes de qualquer comando do Spec Kit. É um gate obrigatório. Confira:

- Todas as fontes de `Feature/` aparecem na seção 2, com a precedência correta.
- As decisões fechadas (seção 3) são as do time e da arquitetura. Nenhuma foi inventada pela IA.
- As pendências (P-nn) estão todas listadas, e nenhuma foi "resolvida" sem você.
- Os IDs das fontes foram preservados.
- Não há dado pessoal real.
- Os critérios de aceite (seção 8) são verificáveis.

Para ajuste pequeno, edite direto. Para problema grande, peça "Revise o prompt-mestre.md: …" e revise de novo.

## 5 Escrever a constituição {#constituicao}

A constituição reúne os princípios que valem para o projeto todo. O agente a consulta ao gerar plano e código, por isso ela precisa ser precisa. Uma constituição típica traz padrões de tecnologia, requisitos de segurança, expectativas de desempenho, convenções de código (nomes, arquitetura, testes) e exigências de conformidade.

```text
/speckit-constitution @Grupo.NomeProjeto.Sdd/Feature/prompt-mestre.md
```

O resultado vai para `.specify/memory/constitution.md`. Depois de gerado:

1. **Revise cada regra.** Regra irreal vira ruído em todo plano e toda análise.
2. **Apague o "Sync Impact Report".** O comando manda a IA escrever esse relatório, um comentário no topo do arquivo, e o próprio texto do comando o chama de rascunho a remover antes do commit. Como vem do modelo do comando, deve aparecer em qualquer projeto, mas confira o topo do arquivo: se a IA não o escreveu, não há o que apagar.
3. **Para mudar uma regra depois**, rode o comando de novo. A versão do arquivo sobe por semver: MAJOR quando um princípio é removido ou redefinido, MINOR quando entra princípio novo ou o texto se amplia, PATCH para correção de redação (de 1.0.0 para 1.0.1, por exemplo).

Num projeto que já existe, use o README, os registros de decisão e a configuração do CI como evidência, e não invente padrão só para preencher o modelo.

> **Constituição e CLAUDE.md**
>
> Os dois descrevem regras do projeto, e nenhum substitui o outro. O `CLAUDE.md` orienta toda sessão (git, idioma, como rodar o ambiente). A constituição é o que o `/speckit-plan` e o `/speckit-analyze` conferem. Escreva cada regra num lugar só, e faça o outro apontar para ele.

## 6 Especificar e esclarecer {#especificar}

O `/speckit-specify` cria a pasta da feature em `specs/`. Se você não disser nada, ele escolhe o nome: um número sequencial de três dígitos e um nome curto tirado da descrição. Para escolher o nome da pasta, escreva `SPECIFY_FEATURE_DIRECTORY=specs/<feature>` dentro do pedido, no chat, junto do comando. Não é um comando de terminal.

```text
/speckit-specify SPECIFY_FEATURE_DIRECTORY=specs/001-exportar-relatorio-csv. @Grupo.NomeProjeto.Sdd/Feature/prompt-mestre.md
```

A variável **não é obrigatória**, com ou sem a extensão `git`. A extensão só cria a branch. A pasta da spec é sempre criada pelo próprio comando, e o caminho dela é gravado em `.specify/feature.json`, de onde os comandos seguintes o leem, sem depender do nome da branch. Os exemplos deste guia repetem a variável nos comandos seguintes, como no projeto em que o passo a passo foi validado, o que é uma garantia a mais. Se um comando não achar a feature, confira o `feature.json`.

O agente escreve o `spec.md`, e a spec **não leva tecnologia**: o "como" é do plano. Onde a IA não tem como decidir sem você, ela deixa na spec um marcador `[NEEDS CLARIFICATION]`.

O comando aceita no máximo **3** desses marcadores. O modelo do comando só permite um marcador quando a escolha muda o escopo ou a experiência de uso, quando há mais de uma interpretação razoável e quando não existe um padrão razoável. Se houver mais de três, ficam os três mais críticos, na ordem escopo, segurança e privacidade, experiência de uso e detalhe técnico. A documentação não diz por que o limite é três. A consequência é que a spec não vira um questionário, e o resto precisa de outro caminho:

- **Por padrão**, a IA decide as demais com um palpite e o registra em "Premissas". Confira essas premissas na revisão da spec.
- **Com o prompt-mestre deste guia**, que manda listar toda pendência numerada (P-01, P-02…), elas ficam numa seção "Pendências de produto", e você as trata no esclarecimento logo abaixo.

Responda às três perguntas no formato `Q1: A, Q2: B, Q3: A`.

### Esclarecer {#clarify}

Há duas formas. A primeira são rodadas de `/speckit-clarify`, com até 5 perguntas por execução, citando as pendências no argumento:

```text
/speckit-clarify SPECIFY_FEATURE_DIRECTORY=specs/001-exportar-relatorio-csv. Cubra as pendências P-03 a P-07.
```

A segunda resolve tudo de uma vez e é mais rápida:

```text
Quero uma única lista com todas as pendências de produto da spec e as opções
sugeridas (A/B/C, com a recomendada marcada com ★) para responder tudo de uma única vez.
```

Responda `P-03: A, P-04: B, …`. As respostas são gravadas em `## Clarifications`.

### Gate 1: aprovação da spec {#gate-spec}

Leia a spec inteira: histórias, cenários, requisitos e premissas. A spec gerada é a interpretação que a IA fez do pedido. Confira:

- Ela atende a todos os requisitos que você deu?
- Tudo foi entendido do jeito certo, ou o agente preencheu uma lacuna com um palpite?
- Falta algum detalhe, como limite, perfil ou mensagem de erro?
- Há algo que não pertence à feature e deve sair?

O teste é este: você entregaria esse arquivo a outra pessoa, ou a uma IA, sem precisar explicar mais nada? Se não, refine até conseguir.

> **Rodar de novo ou editar**
>
> Se a saída está errada de ponta a ponta, rode o comando outra vez com um pedido melhor. Para um problema pequeno, edite o arquivo. Os artefatos são texto no disco, e o agente os relê.

## 7 Planejar {#planejar}

Com a spec aprovada, peça o plano. É aqui que entram a tecnologia e as restrições:

```text
/speckit-plan @Grupo.NomeProjeto.Sdd/Feature/prompt-mestre.md
```

O agente gera o `plan.md`, as decisões (`DEC-NN`, no `research.md`), o modelo de dados, os contratos e o quickstart. Ele lista as decisões que precisam da sua confirmação: **responda antes de seguir**. Depois confira:

- As escolhas de tecnologia são adequadas?
- A arquitetura cobre todos os requisitos da spec?
- Alguma coisa da spec ficou sem resposta no plano?
- O plano respeita a constituição?

Se a IA propôs algo que você não quer, edite o plano. Ele alimenta a geração das tarefas, e erro aqui vira tarefa errada.

### Checklists {#checklists}

```text
/speckit-checklist
```

O comando gera um checklist por domínio (segurança, contrato, UX, infra, testes), cada um em `checklists/<dominio>.md`. Os itens vêm **desmarcados**: quem marca `[x]` é o revisor. Marcar um item não quer dizer que o código está pronto, porque a lista confere a spec e o plano. O comando é opcional. Se você o rodar, atenção: o `/speckit-implement` para e pergunta antes de seguir enquanto houver item desmarcado, e não altera os arquivos de checklist.

## 8 Gerar as tarefas e analisar {#tarefas}

```text
/speckit-tasks @Grupo.NomeProjeto.Sdd/Feature/prompt-mestre.md
```

O agente escreve o `tasks.md` no formato `- [ ] T001 [P] [US01] descrição com caminho`, agrupado em **lotes** (`### Lote A3`, seguido do nome). O lote é a unidade de execução e de commit.

### Analisar antes de implementar {#analyze}

```text
/speckit-analyze
```

O analyze só lê. Corrija os achados de severidade crítica e alta nos artefatos de origem e rode de novo.

### Gate 2: aprovação das tarefas {#gate-tarefas}

Revise as tarefas com quatro perguntas:

- Se todas forem concluídas, a spec inteira está atendida?
- Algum requisito ficou sem tarefa correspondente?
- Alguma tarefa é vaga ou grande demais para implementar direto?
- A ordem dos lotes faz sentido?

Uma tarefa como "Implementar autenticação" é ampla demais. Peça para dividi-la em tarefas pequenas e específicas.

## 9 Implementar, um lote por vez {#executar}

Quando os artefatos estiverem coerentes, você pede a implementação. Ela nunca roda sozinha no modo acompanhado.

```text
/speckit-implement Execute somente o Lote A0, em SPECIFY_FEATURE_DIRECTORY=specs/001-exportar-relatorio-csv
```

- O agente marca `[X]` nas tarefas concluídas.
- Ao fim de cada lote: evidência (testes, lint e build rodados agora), revisão do diff e commit por pasta.
- Se descobrir algo que muda o desenho, atualize o `plan.md` (e o `spec.md`, se o requisito mudou) antes de seguir. Os artefatos precisam continuar verdadeiros.

> **Regra de equipe, não do Spec Kit**
>
> O Spec Kit não define política de git. Neste guia, o agente não faz commit, push nem deploy: ele deixa as mudanças no working tree, e a pessoa responsável faz um commit por lote. Defina a política do seu time no `CLAUDE.md`. Versione `spec.md`, `plan.md` e `tasks.md` no repositório, junto do código: são documentação.

## 10 Modo autônomo {#autonomo}

Depois dos dois gates, a implementação pode rodar sozinha, lote a lote, parando só diante de um bloqueio real.

### Preparar antes de soltar {#autonomo-preparar}

1. **Feche os gates 1 e 2** e as decisões pendentes do plano. Tudo o que ficar em aberto vira bloqueio no meio da execução.
2. **Resolva os checklists, se você os gerou.** O `/speckit-checklist` é opcional: se não o rodou, não há o que resolver. Se rodou, marque `[x]` o que foi revisado. O `/speckit-implement` pergunta "deseja continuar?" quando há item desmarcado, e sem uma pessoa ele trava. Se decidir seguir mesmo assim, diga isso no prompt.
3. **Peça à IA o `specs/<feature>/handoffs.md`.** O Spec Kit não o cria: você pede e confere o resultado. É a memória da execução autônoma, com as seções "Follow-ups", "Riscos", "Decisões da execução", "Bloqueios" e "Encerramento". Ele precisa existir antes de soltar a IA, porque é nele que ela vai anotar o que fez.

   ```text
   Crie specs/001-exportar-relatorio-csv/handoffs.md com as seções "Follow-ups",
   "Riscos", "Decisões da execução", "Bloqueios" e "Encerramento", todas vazias.
   ```
4. **Libere as permissões no chat.** No seletor de modo do chat, escolha o modo que aceita edições e comandos sem pedir confirmação a cada passo. Sem isso, a IA para esperando aprovação. Só faça isso depois do commit do passo 6 e numa branch de trabalho.
5. **Garanta o ambiente:** containers de pé (se os testes de integração precisam de banco), dependências instaladas e `.env` locais criados.
6. **Faça o commit** de tudo antes de começar, para poder comparar e reverter.

### A ordem de execução {#autonomo-ordem}

```text
/speckit-implement Execute os lotes pendentes do tasks.md em sequência, do primeiro
ao último, em MODO AUTÔNOMO:
- Os checklists foram revisados; se houver item desmarcado, prossiga.
- Não me faça perguntas. Decisões que caibam na constituição, no CLAUDE.md, nas
  rules e no plan.md: tome e registre em handoffs.md, em "Decisões da execução".
- O que exigir decisão de produto ou mudar o que foi aprovado (por exemplo, mudança
  visual não prevista): NÃO faça; registre em "Follow-ups" e siga com o restante.
- Antes de marcar [X], rode os testes e o lint do lote e leia a saída. Teste falhando
  por defeito real NÃO se ajusta para passar.
- Ao fim de cada lote, escreva uma linha de resumo (lote, tarefas concluídas, testes
  rodados) em handoffs.md e siga para o próximo. Não faça commit.
- Se um lote não puder ser concluído (decisão necessária, ambiente quebrado, teste
  vermelho que você não sabe corrigir): registre em "Bloqueios", deixe as tarefas
  desse lote sem [X] e PARE.
```

### Variações {#autonomo-variacoes}

| Forma | Como | Quando usar |
|---|---|---|
| Alguns lotes | A mesma ordem, trocando a primeira linha por `Execute os Lotes A0, A1 e A2…` | Avançar por fase, revisando entre uma e outra. |

### Acompanhar e retomar {#autonomo-retomar}

- **Progresso:** pergunte no chat "Quantas tarefas estão concluídas e qual é o próximo lote?".
- **Bloqueio:** leia `handoffs.md`, em "Bloqueios". Resolva (decida, corrija o ambiente, atualize spec e plano se o requisito mudou) e envie de novo a ordem de execução. Ela retoma do primeiro lote pendente.
- **Follow-ups:** decida. O que for aprovado vira tarefa nova no `tasks.md`.
- **Revisão:** ao final, ou a cada fase, revise o diff acumulado e faça os commits por lote e por pasta.
- **Mudou o desenho?** Peça para atualizar o `plan.md` (e o `spec.md`, se o requisito mudou) antes de continuar.

## 11 Revisar, convergir e encerrar {#encerrar}

A revisão é feita pela IA. Você dispara os comandos, lê o resultado e decide o que fazer com ele.

> **O modo autônomo não começa a revisão sozinho**
>
> A ordem de execução do passo 10 termina quando os lotes acabam. O review e o converge só rodam quando você os pede, tanto depois do modo acompanhado quanto depois do autônomo.
>
> Você pode dar essa autonomia no próprio pedido, acrescentando ao fim da ordem do passo 10 algo como o texto abaixo. Esse encadeamento não foi validado. O exemplo para antes da correção, para você fazer a triagem:
>
> ```text
> Quando todos os lotes estiverem concluídos, rode /code-review nas pastas tocadas e
> /speckit-converge. Registre os achados em specs/<feature>/reviews/rodada-001.md e
> PARE. Não corrija nada: a triagem é minha.
> ```

1. **Review por pasta.** Você digita os comandos, e a IA revisa o código e compara com a spec. Se quiser, peça que ela rode sem fazer perguntas, nas mesmas regras do passo 10.

   ```text
   /code-review <pasta> high
   /speckit-converge
   ```

   A IA registra os achados em `specs/<feature>/reviews/rodada-NNN.md`, com id, arquivo e linha, severidade, cenário de falha e status. O `/speckit-converge` já acrescenta ao `tasks.md` o que falta construir.
2. **Triagem.** É sua: você lê os achados e marca cada um como válido ou descartado.
3. **Remediação.** Os achados válidos viram a fase "Remediação da rodada NNN" no `tasks.md`. Você manda `/speckit-implement somente a fase de Remediação NNN`, acompanhado ou com a ordem autônoma, e a IA corrige. Repita review e remediação até a rodada sair limpa.
4. **Encerramento.** É seu. Confira que todas as tarefas estão em `[X]`, que o `/speckit-analyze` não tem achado crítico ou alto, que o `/speckit-converge` não tem achados e que cada critério da seção 8 do prompt-mestre tem evidência (o comando rodado e a saída lida), anotada em `handoffs.md`, em "Encerramento". Com isso, você lê o diff e decide o commit, um por lote ou por pasta, como no passo 9.

**APROFUNDAR**

## Anatomia dos artefatos {#artefatos}

Os exemplos abaixo são de uma feature fictícia, `001-exportar-relatorio-csv`. Os títulos exatos mudam conforme o modelo da sua versão, que está em `.specify/templates/`.

### constitution.md {#constitution}

Responde quais regras valem para tudo. Quem lê é o agente, em toda etapa, e você, na revisão do plano.

```markdown
# Constituição

## Tecnologia
- API em .NET 8 e front em React. Banco SQL Server. Sem biblioteca nova sem decisão registrada.

## Segurança e dados
- Nenhum dado de pessoa real em spec, exemplo ou teste (LGPD).
- Toda rota exige autenticação e checa o perfil.

## Qualidade
- Todo requisito tem ao menos um teste. Teste de unidade para regra de negócio.

## Processo
- O agente nunca faz commit, push ou deploy.
- Feature entregue vira registro histórico: mudança é feature nova.
```

### spec.md {#spec}

Responde o que o sistema deve fazer, e por quê. Quem lê é o negócio, o QA e quem implementa. Traz histórias de usuário, cenários de aceite, requisitos (`FR-`) e critérios de sucesso (`SC-`).

```markdown
# Exportar relatório em CSV

## Resumo
Analistas levam o relatório filtrado para planilhas. A feature gera o arquivo
direto da tela, sem cópia manual.

## Histórias de usuário
### US01: Exportar o relatório filtrado
Como Analista, quero exportar o relatório em CSV para abrir no Excel.

**Cenário: exportação com filtro ativo**
- Dado que filtrei por "Março/2026"
- Quando clico em "Exportar CSV"
- Então o arquivo traz só as linhas de março, com os nomes das colunas na primeira linha

**Cenário: relatório acima do limite**
- Dado que o filtro resulta em mais de 50.000 linhas
- Quando clico em "Exportar CSV"
- Então o sistema recusa com "Refine o filtro para exportar"

## Requisitos
- FR-001: o sistema gera o CSV com as linhas e os filtros do momento do clique.
- FR-002: só os perfis Analista e Gestor veem o botão.
- FR-003: o arquivo não passa de 50.000 linhas.

## Critérios de sucesso
- SC-001: a exportação de 50.000 linhas não mantém o arquivo inteiro em memória.

## Casos de borda
- Filtro sem resultado: o arquivo traz só o cabeçalho.
- Valor com vírgula ou aspas: escapado conforme o formato.

## Pendências de produto
- P-01: o separador é vírgula ou ponto e vírgula, para abrir direto no Excel em português?
```

Não há tecnologia aqui. O "streaming" é decisão do plano.

### plan.md {#plan}

Responde como será feito. Quem lê é quem implementa e quem revisa a arquitetura. Os artefatos de apoio (`research.md`, `data-model.md`, `contracts/`, `quickstart.md`) detalham as decisões, o modelo de dados e os contratos.

```markdown
# Plano

## Arquitetura
O endpoint reaplica os filtros no servidor e envia o CSV em streaming.
O front só dispara o download.

## Pilha
.NET 8, endpoint novo em `GET /api/relatorios/{id}/exportacao`. Sem biblioteca nova.

## Sequência
1. Endpoint com filtros e limite.
2. Botão na tela de relatórios.
3. Teste de download ponta a ponta.

## Verificação contra a constituição
- Sem biblioteca nova: atendido.
- Rota autenticada e com checagem de perfil: atendido.

## Suposições
- O endpoint de relatórios já aplica os filtros (confirmar na implementação).
```

### tasks.md {#tasks}

Responde em que ordem implementar. Quem lê é o agente no implement e você na revisão. Cada tarefa tem o formato `- [ ] T001 [P] [US01] descrição com caminho`. O `[P]` marca a tarefa que pode rodar em paralelo com outra, e o `[US01]` liga a tarefa à história que ela entrega.

```markdown
# Tarefas

### Lote A0: fundação
- [X] T001 [US01] Endpoint `GET /api/relatorios/{id}/exportacao` com filtros e limite de 50.000 linhas
- [X] T002 [P] [US01] Escape de vírgula e aspas no CSV, com teste de unidade

### Lote A1: tela
- [ ] T003 [US01] Botão "Exportar CSV", visível só para Analista e Gestor
- [ ] T004 [P] [US01] Mensagem "Refine o filtro para exportar" acima do limite

### Lote A2: verificação
- [ ] T005 [US01] Teste ponta a ponta do download pelo botão
```

Por padrão o Spec Kit organiza as fases por user story. Se o backend precisa existir antes do front, organize por pasta e fase e registre a divergência na constituição e no plano (Complexity Tracking).

## Quando a feature muda no meio do caminho {#mudanca}

Se a implementação revelou que o plano estava errado, edite o `plan.md` (e o `spec.md`, se o requisito mudou), rode o `/speckit-tasks` de novo para reconciliar as tarefas e o `/speckit-analyze` para conferir. Não deixe o código seguir um desenho que os arquivos não descrevem.

## Subagente de execução {#subagente}

O modo autônomo roda no chat principal, com o mesmo modelo que planejou. Como no [guia de OpenSpec](/metodo/open-spec#subagente), vale separar o raciocínio da execução: o modelo mais forte faz specify, plan e tasks, e um modelo mais rápido executa um plano já aprovado.

Crie `.claude/agents/speckit-executor.md`:

```markdown
---
name: speckit-executor
description: Executa uma feature do Spec Kit já planejada e analisada: implement,
  converge e revisão de código. Use depois que spec, plano e tarefas estiverem
  aprovados, informando a pasta da feature.
model: sonnet
---

Você executa UMA feature do Spec Kit, cuja pasta o agente principal informa.
Antes de editar, leia o CLAUDE.md, a constituição e as rules da pasta-alvo.

1. **Implementação:** rode `/speckit-implement`, um lote por vez. Marque cada
   tarefa só com evidência fresca (teste, lint ou build rodado agora e visto
   passar) e resuma o lote em handoffs.md.
2. **Convergência:** rode `/speckit-converge` e repita o implement até aparecer
   "Converged".
3. **Revisão:** rode `/code-review` nas pastas tocadas e corrija os achados.
   Achado que revele erro da spec: pare e devolva, sem corrigir a spec.

Regras:
- Nunca commite, dê push ou deploy.
- Pare e devolva ao agente principal quando houver dúvida de produto, bloqueio
  de ambiente ou trabalho além do que spec, plano e tarefas descrevem.
- Ao terminar, devolva um resumo: tarefas concluídas e evidências, achados da
  revisão e como foram tratados, desvios do plano e o que ficou pendente.
```
## Problemas comuns {#problemas}

| Sintoma | Causa e solução |
|---|---|
| O comando `/speckit.specify` não existe | No Claude Code as skills têm hífen: `/speckit-specify`. |
| As skills não aparecem no chat | O VS Code não foi aberto na pasta de SDD, ou o chat não foi recarregado depois do `specify init`. Digite `/speckit` para ver os nomes. Depois de atualizar a CLI, o `specify integration upgrade` renova os arquivos da integração. |
| Os comandos não acham a feature | Confira o `.specify/feature.json`, que guarda o caminho da feature ativa. Se estiver errado, corrija-o ou informe `SPECIFY_FEATURE_DIRECTORY` no pedido. O Spec Kit acha a raiz pelo `.specify/`, e não pelo git. |
| Muitas pendências e só 3 perguntas | O specify limita a 3 `[NEEDS CLARIFICATION]`, e o clarify a 5 por execução. Use a lista única do passo 6. |
| Não foi criada a branch da feature | O `init` não faz git. A criação de branch de feature vem da extensão: `specify extension add git`. |
| O init avisou que a pasta não está vazia | O `--force` faz o merge e pode substituir arquivos nos caminhos gerenciados. Faça o commit antes e leia o diff. |
| O implement trava pedindo confirmação | Há checklist com item desmarcado, ou o modo de permissão do chat pede aprovação a cada comando. Revise e marque os checklists, ou autorize no prompt, e ajuste o modo do chat. |
| O plano contradiz decisões suas | Rules ou registros de execuções anteriores. Trate-os como insumo, e não como verdade: o plano registra a correção, e um lote de refinamento ajusta a rule. |
| O plano ficou preso a uma tecnologia que eu não queria | Provavelmente a tecnologia entrou na descrição da spec. Tire-a do `spec.md`, passe-a no plano e rode o plano de novo. |
| O agente começou a implementar durante o specify ou o plan | Interrompa e lembre que essas etapas só escrevem artefato. Reforce na constituição e no `CLAUDE.md`. Confira com `git status` se algum arquivo de código mudou e descarte o que não foi pedido. |
| A tarefa ficou grande demais | Peça para dividir. "Implementar autenticação" vira tarefas pequenas, cada uma verificável sozinha. |
| O converge nunca chega a "Converged" | Leia as tarefas que ele acrescenta. Se repetem o mesmo ponto, a spec está vaga ou contraditória ali: corrija o `spec.md` e regenere plano e tarefas. |
| A execução autônoma "conclui" com teste vermelho | Exija no prompt a evidência antes do `[X]` e confira o resumo de cada lote em `handoffs.md`. |
| Dado pessoal no git | O `.gitignore` não remove o que já foi versionado. Planilhas reais entram no ignore antes do primeiro commit. |

**CONSULTAR**

## Comandos de referência {#referencia}

### No chat do Claude Code {#comandos-chat}

| Comando | Quando usar | O que faz |
|---|---|---|
| `/speckit-constitution` | Uma vez por projeto, e quando uma regra muda | Cria ou atualiza os princípios do projeto. |
| `/speckit-specify` | Para começar uma feature | Escreve o `spec.md`: o que e por quê, sem tecnologia. |
| `/speckit-clarify` | Depois do specify, se houver ambiguidade | Pergunta o que está vago, até 5 perguntas por execução, e grava em `## Clarifications`. |
| `/speckit-plan` | Com a spec aprovada | Escreve o `plan.md` e os artefatos de apoio. |
| `/speckit-checklist` | Depois do plano | Gera um checklist de qualidade por domínio, com os itens desmarcados. |
| `/speckit-tasks` | Com o plano aprovado | Escreve o `tasks.md` em lotes. |
| `/speckit-analyze` | Antes do implement | Confere spec, plano, tarefas e constituição, sem alterar nada. |
| `/speckit-implement` | Só quando você pedir | Executa um lote, ou vários no modo autônomo. Marca `[X]`. |
| `/speckit-converge` | Depois do implement | Compara o código com os artefatos e acrescenta tarefas ao `tasks.md`. |

Há também comandos de extensões opcionais. Com `specify extension add bug`: `/speckit-bug-assess`, `/speckit-bug-fix` e `/speckit-bug-test`, para o ciclo de uma correção, com cada bug em `.specify/bugs/`. Com `specify extension add assess`: `/speckit-assess-intake`, `/speckit-assess-research`, `/speckit-assess-define`, `/speckit-assess-shape` e `/speckit-assess-decide`, para avaliar uma ideia antes de especificar.

### No terminal {#comandos-terminal}

| Comando | O que faz |
|---|---|
| `specify init [nome] --integration claude [--here] [--force]` | Cria a estrutura do projeto e instala as skills do Claude Code. |
| `specify check` | Confere se os agentes de linha de comando estão instalados. Roda offline. |
| `specify version` | Mostra a versão da CLI, do Python e da plataforma. |
| `specify self check` | Avisa se existe uma versão mais nova da CLI. |
| `specify integration list` | Lista as integrações e qual está instalada. |
| `specify integration upgrade` | Renova os arquivos da integração depois de atualizar a CLI. |
| `specify integration install` e `switch <chave>` | Instala uma integração, ou troca a padrão. |
| `specify extension add git\|bug\|assess` | Instala uma extensão opcional. |

### Variáveis {#variaveis}

| Variável | O que faz |
|---|---|
| `SPECIFY_FEATURE_DIRECTORY=specs/<feature>` | Escrita no pedido do `/speckit-specify`, escolhe o nome da pasta da feature. Opcional. Nos comandos seguintes é uma garantia a mais. |

## Glossário do SDD {#glossario}

Os termos gerais (SDD, spec, gate, ADR, subagente) são os do [guia de OpenSpec](/metodo/open-spec#glossario). Os próprios do Spec Kit:

| Termo | O que é |
|---|---|
| Constituição | Arquivo `constitution.md` com os princípios do projeto. O agente a consulta em todas as etapas, e o analyze confere contra ela. |
| Feature | Unidade de trabalho do Spec Kit: uma pasta em `specs/` com spec, plano e tarefas. |
| Prompt-mestre | Arquivo em `Feature/` que reúne missão, fontes, decisões fechadas, pipeline e critérios de aceite. É o argumento de quase todos os comandos. |
| Lote | Grupo de tarefas do `tasks.md`. É a unidade de execução e de commit. |
| Integração | O pacote que liga o Spec Kit a um assistente de IA. No Claude Code, instala as skills em `.claude/skills`. |
| Skill | Conjunto de instruções que o agente carrega para executar uma etapa. Cada comando `/speckit-*` é uma. |
| Extensão | Complemento opcional da CLI, como `git`, `bug` e `assess`. |
| Analyze | Conferência só de leitura entre spec, plano e tarefas, antes de implementar. |
| Converge | Conferência do código contra os artefatos, depois de implementar. Acrescenta tarefas até "Converged". |
| Checklist | Lista de qualidade dos requisitos por domínio. Quem marca os itens é o revisor. |
| Handoffs | Arquivo `handoffs.md` com follow-ups, riscos, decisões, bloqueios e encerramento da execução autônoma. |
| Rodada | Uma passada de review sobre o código, com os achados em `reviews/rodada-NNN.md`. Repete-se até uma rodada não achar nada. |
| Remediação | As tarefas de correção que nascem dos achados válidos de uma rodada, em fase própria no `tasks.md`. |

## Seu primeiro ciclo {#checklist}

Use esta lista no seu primeiro projeto, na ordem.

1. Instalei o `uv` e a CLI, e o `specify check` e o `specify version` respondem.
2. Montei a pasta `.Sdd` ao lado do código, adicionei as pastas de código ao workspace e rodei `specify init --here --force --integration claude`.
3. Preparei a fundação: git, `.gitignore`, `CLAUDE.md` central e por pasta, rules revisadas.
4. Juntei os insumos em `Feature/` e anonimizei o que tinha nomes reais.
5. Gerei o prompt-mestre com IA e o revisei, com a tabela de leitura no topo.
6. Rodei o `/speckit-constitution` e revisei cada regra.
7. Rodei o `/speckit-specify` e respondi às pendências. **Gate 1**: aprovei a spec.
8. Rodei o `/speckit-plan` e confirmei as decisões. Se rodei o `/speckit-checklist`, marquei os itens que revisei.
9. Rodei o `/speckit-tasks` e o `/speckit-analyze` até ficar limpo. **Gate 2**: aprovei as tarefas.
10. Antes de soltar a IA: pedi a ela o `handoffs.md` (onde anota decisões e bloqueios), subi o banco e as dependências dos testes e fiz o commit de tudo.
11. Pedi a implementação lote a lote, ou todos de uma vez no modo autônomo. Quando a IA parou, li o motivo em `handoffs.md`, em "Bloqueios", e a mandei continuar.
12. Mandei a IA revisar o código e rodar o converge. Li os achados, marquei os válidos e a mandei corrigi-los, até uma rodada sair limpa. Para cada critério de aceite, anotei o comando e o resultado, li o diff e decidi o commit.
