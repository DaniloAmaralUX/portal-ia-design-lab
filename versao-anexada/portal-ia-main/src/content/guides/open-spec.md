A especificação passa a ser o artefato principal do projeto. O agente de IA lê, planeja e implementa a partir dela, e você revisa em pontos definidos. Este guia vai do zero ao primeiro ciclo completo, com os comandos reais e exemplos de um projeto em andamento.

Este guia é o passo a passo do OpenSpec. Para saber por que adotar o SDD, leia [Por que utilizar o SDD?](/metodo/por-que-utilizar-o-sdd), e para explorar outras ferramentas, o [Guia SDD](/metodo/sdd).

Os cinco comandos do ciclo, em ordem:

```text
/opsx:explore  →  /opsx:propose  →  você revisa  →  /opsx:apply  →  /opsx:archive
```

**ENTENDER**

## O que é o OpenSpec {#o-que-e}

O OpenSpec é um framework leve de SDD com três partes. Uma CLI (`openspec`) cria a estrutura e valida os arquivos. Um conjunto de *skills* ensina o agente a seguir o fluxo. Os *slash commands* (`/opsx:propose`, `/opsx:apply` e outros) são o que você digita no chat. Os artefatos são arquivos markdown comuns, sem servidor e sem conta.

O `openspec init` configura dezenas de assistentes de IA (a tela de escolha lista 50). Neste guia usamos o Claude Code.

## O fluxo de uma change {#fluxo}

No OpenSpec, cada unidade de trabalho é uma **change**: uma pasta com o plano e os specs de uma entrega. Toda change percorre o mesmo ciclo. Os nomes dos comandos podem variar um pouco conforme o assistente de IA escolhido no `init`.

![Fluxo de uma change no OpenSpec em sete passos: prompt-mestre, explorar, propor, revisar o plano, implementar, verificar e arquivar, com o comando, quem faz, o terminal e os arquivos de cada passo](figura/openspec-fluxo)

*Projeto de exemplo, com a change exportar-relatorio-csv. Clique num passo ou use Anterior e Próximo. A tabela abaixo traz o mesmo fluxo em texto.*

| Etapa | Comando | O que acontece | Quem decide |
|---|---|---|---|
| 1. Explorar | `/opsx:explore` | Conversa livre para entender o problema e tirar dúvidas de regra de negócio. O agente lê documentos e código, faz perguntas e não grava código. É opcional, mas é onde as decisões nascem. As decisões existem só na conversa. | Você |
| 2. Propor | `/opsx:propose <nome>` | Cria a change e gera, em ordem de dependência, `proposal.md`, os deltas em `specs/`, `design.md` e `tasks.md`. Só planeja: o agente para ao terminar, mesmo que o seu pedido mencione implementar. Sai a pasta `openspec/changes/<nome>/`. | O agente redige, você aprova na etapa seguinte |
| 3. Revisar o plano | `/opsx:update <nome>` | É o gate principal. Você lê os artefatos no disco e edita o que quiser. Quando decidir algo novo, o `update` reconcilia os arquivos entre si e nunca mexe em código. O `openspec validate --strict` confere o formato. | Você |
| 4. Implementar | `/opsx:apply <nome>` | Executa o `tasks.md` task a task e marca `[x]` na hora. Pausa diante de dúvida, bloqueio, problema de design ou trabalho que o plano não prevê. Só roda quando você pede. Sai código, testes e tasks marcadas. | Você pede o apply e revisa o diff |
| 5. Verificar (opcional) | `/opsx:verify` e `/code-review` | Confere se o que foi implementado bate com specs, design e tasks, e revisa o código. O `/opsx:verify` aparece quando o perfil de workflows instalado o inclui (veja `openspec config profile`). Sai uma lista de achados para corrigir. | Você, sobre o que corrigir |
| 6. Arquivar | `/opsx:archive <nome>` | Confere artefatos e tasks, oferece o sync dos specs e move a change para `openspec/changes/archive/AAAA-MM-DD-<nome>/`. Os specs principais passam a refletir a nova realidade. | Você confirma |

> **Onde você decide**
>
> Quatro momentos pedem a sua palavra: a revisão do plano depois do propose, o pedido do apply, a revisão do diff e a confirmação do archive. Fora deles o agente trabalha sozinho. Nenhuma fase avança sem a aprovação explícita do gate anterior.

## Specs, changes e deltas {#conceitos}

O OpenSpec separa o que o sistema faz hoje do que está sendo proposto. Os **specs** guardam o estado atual. Cada **change** descreve só a diferença, chamada de **delta**. Ao arquivar, a diferença é aplicada aos specs e a pasta da change vira histórico.

O propose lê os specs vigentes e escreve o plano na pasta da change. O archive faz duas coisas: aplica o delta aos specs e move a pasta para o histórico.

### Como fica no disco {#disco}

```text
openspec/
├── config.yaml                  contexto e regras do projeto
├── specs/                       estado atual do sistema
│   └── relatorios/spec.md       uma capacidade = uma pasta
└── changes/
    ├── exportar-relatorio-csv/  change em andamento
    │   ├── .openspec.yaml       metadados da change
    │   ├── proposal.md          por quê e o que muda
    │   ├── design.md            como: decisões e plano de testes
    │   ├── tasks.md             passos de implementação
    │   └── specs/
    │       └── exportacao-relatorios/spec.md   delta
    └── archive/
        └── 2026-10-08-dominio-projeto/         changes concluídas
```

### As quatro operações de um delta {#delta}

Esses quatro cabeçalhos não são arquivos: ficam dentro do arquivo de delta da change (`specs/<capacidade>/spec.md`) e dizem o que cada bloco faz nos specs vigentes quando o archive o aplica. Quem os escreve é o agente, no `/opsx:propose`. Você só os digita se editar o delta à mão, e na revisão do plano confere se o agente escolheu o cabeçalho certo.

| Cabeçalho | Use para | Regra |
|---|---|---|
| `## ADDED Requirements` | Requisito novo ou capacidade nova | Capacidade nova começa com `## Purpose` de 50 caracteres ou mais. Todo requisito tem ao menos um cenário. |
| `## MODIFIED Requirements` | Mudar um requisito que já existe | Cole o requisito **inteiro**, com os cenários que continuam valendo, e edite. O título deve ser igual ao do spec principal. |
| `## REMOVED Requirements` | Aposentar um requisito | Inclua `**Reason**` e `**Migration**`. |
| `## RENAMED Requirements` | Só trocar o nome | Use o formato `FROM:` e `TO:`. |

> **Cuidado com o MODIFIED**
>
> Um MODIFIED com conteúdo parcial apaga detalhes no archive. Se você só acrescenta comportamento sem alterar o que existe, use ADDED. Para uma change sem mudança de comportamento (refatoração, documentação, infraestrutura), marque `skip_specs: true` no `.openspec.yaml`.

**PASSO A PASSO**

## 1 Instalar a CLI {#instalar}

Você precisa do Node.js 20.19 ou superior. A CLI é instalada uma vez por máquina.

```bash
npm install -g @fission-ai/openspec@latest
openspec --version   # confirma a instalação
openspec update      # regenera skills e comandos de um projeto
```

O `openspec update` reescreve os arquivos de instrução do projeto (as skills e os slash commands). Rode depois de atualizar a CLI, em cada projeto que a usa. O `openspec version` informa se há uma versão mais nova.

## 2 Montar o workspace {#workspace}

Crie uma pasta para o projeto e coloque o código ali. Pode ser um monorepo, várias pastas ou vários repositórios. Ao lado deles, crie uma pasta dedicada ao planejamento, com o sufixo `.Sdd`, e abra o VS Code dentro dela.

```text
Grupo.NomeProjeto/                 pasta raiz (neste caso, um monorepo)
├── Grupo.NomeProjeto.Sdd/         planejamento: abra o VS Code e o Claude Code aqui
├── Grupo.NomeProjeto.Api/         backend
├── Grupo.NomeProjeto.View/        frontend
└── Grupo.NomeProjeto.TestsFuncionais/
```

### Por que uma pasta só para o planejamento {#pasta-sdd}

O Claude Code lê `.claude/` (skills, comandos, agentes) e o `CLAUDE.md` da pasta em que a sessão abre. Abrindo o VS Code na pasta `.Sdd`, as skills do OpenSpec ficam disponíveis no chat. O código continua nas pastas irmãs, e o planejamento fica separado dele.

### Adicionar os outros repositórios {#add-dir}

No VS Code, use **Arquivo → Adicionar Pasta ao Workspace…** para cada pasta de código e salve o conjunto com **Arquivo → Salvar Workspace Como…**. O explorador passa a mostrar as quatro pastas. Para o Claude Code enxergar o código, adicione as pastas à sessão:

```bash
# ao abrir a sessão, dentro de Grupo.NomeProjeto.Sdd/
claude --add-dir ../Grupo.NomeProjeto.Api --add-dir ../Grupo.NomeProjeto.View

# ou, com a sessão já aberta
/add-dir ../Grupo.NomeProjeto.Api
```

> **Dica**
>
> Versione `openspec/` e `.claude/` no git (exceto `settings.local.json`). Assim todo o time usa as mesmas skills, os mesmos comandos e o mesmo histórico de specs.

## 3 Reunir os insumos {#insumos}

Na pasta `.Sdd`, crie a pasta `Feature/`. Nela vai tudo o que ajuda o agente a entender o negócio: reuniões transcritas, requisitos, imagens, critérios de aceite, planilhas de dados, contratos de API, propostas antigas.

```text
Feature/
├── plano-de-execucao.pdf        escopo e contexto, o documento mais recente
├── diagrama.html                arquitetura, stack, autenticação
├── contrato-api-externa.apib         contrato de uma API externa
├── anexos/                      processos, planilhas, imagens
├── transcricoes/                reuniões (anonimize antes)
└── prompt-sdd.md                o prompt-mestre, descrito abaixo
```

> **Anonimize antes de colocar na pasta**
>
> Transcrições e anexos costumam ter nomes de pessoas e empresas. Remova ou troque por papéis ("o gestor", "o fornecedor") antes de o agente ler. O que ele lê pode aparecer nos specs, nos seeds e nos testes.

### O prompt-mestre {#prompt-mestre}

Dentro de `Feature/`, crie um arquivo como `prompt-sdd.md` (o nome é livre). Ele reúne as especificações técnicas e as regras de negócio do projeto e referencia os arquivos da pasta. Peça ao próprio Claude para gerar a primeira versão, e depois você ajusta. Um esqueleto que funciona:

```markdown
# Prompt-mestre: <nome do projeto>

## 1. Contexto e objetivo
O que é o produto, quem usa, o que esta entrega precisa resolver.

## 2. Fontes e precedência
Arquivos de Feature/ e qual vence quando dois divergem.

## 3. Decisões fechadas (não reabrir)
Stack, autenticação, banco, formato de entrega. O agente não rediscute.

## 4. Regras de negócio
Perfis, limites, fluxos, estados. Referencie os arquivos em vez de copiar.

## 5. Sequência de changes
Nome de cada change, o que entra nela e a ordem de execução.

## 6. Qualidade e segurança
Política de testes, LGPD, checklist de revisão, o que o agente nunca faz.

## 7. Perguntas em aberto
O que você quer discutir no /opsx:explore.
```

Um pedido para começar:

```text
Leia tudo em @Feature/ e escreva Feature/prompt-sdd.md seguindo a estrutura
abaixo. Antes de escrever, me pergunte o que estiver faltando ou ambíguo.
Não invente regra de negócio: o que não estiver nos documentos vira
"Pendência" na seção 7.
```

> **Por que a seção 5 existe**
>
> O OpenSpec não decide o que entra em cada change. Quem decide é o agente, a partir do contexto que ele tem. Se o prompt-mestre lista as changes e o conteúdo de cada uma, o agente propõe sem inventar o recorte. A seção "Uma change por vez" mostra um exemplo completo.

## 4 Inicializar o projeto {#inicializar}

Com o prompt-mestre pronto, rode o init dentro da pasta `.Sdd`.

```bash
openspec init
```

A CLI mostra uma tela de boas-vindas e pede para escolher as ferramentas de IA. Navegue com as setas, marque o **Claude Code** com `Espaço` e confirme com `Enter`.

```text
? Select tools to set up (50 available)
  Selected: Claude Code
  Search: [type to filter]
  ↑↓ navigate · Space toggle · Backspace remove · Enter confirm
  [ ] Cline
  › [x] Claude Code (selected)
  [ ] Codex
```

Sem interação (útil em scripts e em novos repositórios do time), use `openspec init --tools claude`. O `--language <idioma>` define o idioma dos artefatos novos.

### O que o init cria {#init-cria}

```text
Grupo.NomeProjeto.Sdd/
├── .claude/
│   ├── commands/opsx/    os slash commands: /opsx:propose, /opsx:apply…
│   └── skills/           as skills openspec-* que o agente carrega
├── Feature/              criada por você no passo anterior
└── openspec/
    ├── changes/          changes em andamento, mais archive/
    ├── specs/            specs vigentes
    └── config.yaml       contexto e regras do projeto (próxima seção)
```

### Configurar o config.yaml {#config}

O `config.yaml` é a memória do projeto para o OpenSpec. O contexto e as regras dele entram nas instruções de todo artefato, então vale o investimento. Peça ao Claude para preenchê-lo a partir do prompt-mestre:

```text
Leia @Feature/prompt-sdd.md e preencha openspec/config.yaml:
um "context" curto com stack, restrições e convenções, e "rules" para
proposal, specs, design e tasks. Mantenha cada regra em uma linha.
```

O resultado tem esta forma (trecho adaptado de um projeto real):

```yaml
schema: spec-driven

context: |
  Projeto "NomeProjeto". Este workspace guarda só openspec/ e Feature/;
  o código vive nas pastas irmãs (../Api, ../View).
  Entrada de negócio: Feature/ (precedência: plano de execução > diagrama > anexos).
  Decisões fechadas em Feature/prompt-sdd.md §3: não reabrir.
  Restrições: artefatos em pt-BR (cabeçalhos do OpenSpec, SHALL/MUST e
  WHEN/THEN/AND ficam em inglês); LGPD: nenhum nome real em artefatos,
  seeds ou testes; nunca commitar.

rules:
  proposal:
    - 'Marque toda premissa como "Premissa:" e toda pendência como "Pendência:"'
    - 'Declare o que está fora do escopo'
  specs:
    - 'Um requisito por user story, com título "US-NNN — <título>" e SHALL/MUST'
    - 'Cada cenário deve ser verificável por exatamente um teste'
  design:
    - 'Decisões como "### ADR-NNN — <título>" (contexto, decisão, alternativas, consequências)'
  tasks:
    - 'Fatias verticais, não uma task por camada; cada task cita os US/AC que entrega'

operations:
  apply:
    guidance:
      - 'Só marque [x] com evidência fresca (teste, lint ou build rodado agora)'
      - 'Não commite; mostre o diff restrito à pasta tocada'
```

- O `schema` escolhe o conjunto de artefatos. `spec-driven` gera proposal, specs, design e tasks.
- O `context` é texto livre entregue ao agente em todo artefato. Cabe até 50 KB, mas um texto curto e direto funciona melhor.
- As `rules` adicionam regras por tipo de artefato, e as `operations` fazem o mesmo para o apply e o archive.

> **Crie também um CLAUDE.md na pasta .Sdd**
>
> O `config.yaml` orienta os artefatos. O `CLAUDE.md` orienta toda a sessão: o fluxo que o time segue, as regras transversais (git, LGPD, idioma), como rodar o ambiente e quais são os próximos IDs livres. Escreva o que você diria a uma pessoa nova no primeiro dia.

## 5 Explorar o problema {#explorar}

O `/opsx:explore` serve para tirar dúvidas da regra de negócio antes de planejar. Passe o prompt-mestre como entrada:

```text
/opsx:explore @Feature/prompt-sdd.md
```

O agente lê os documentos, cruza com o código existente e pergunta, uma dúvida por vez, o que muda escopo, comportamento ou critério de aceite. Ele não grava código. Para quem já conhece o Compozy, é o equivalente ao `create-prd`.

Um exemplo de conversa:

> **Você:** /opsx:explore @Feature/prompt-sdd.md
>
> **Claude:** Li o prompt e os anexos. Três pontos mudam o escopo da exportação:
>
> 1. O arquivo respeita os filtros da tela ou exporta tudo?
> 2. Existe limite de linhas?
> 3. Todos os perfis podem exportar?
>
> **Você:** Respeita os filtros. Limite de 50 mil linhas. Só Analista e Gestor.
>
> **Claude:** Anotado. Falta decidir o separador: vírgula ou ponto e vírgula, para abrir direto no Excel em português?

> **As decisões do explore só existem na conversa**
>
> Se você abrir outra sessão, elas somem. Há dois caminhos. O primeiro é rodar o `/opsx:propose` na **mesma sessão**. O segundo é pedir ao Claude para gravar um arquivo, por exemplo `metricas/decisoes-explore-dominio.md`, e usá-lo como entrada do propose depois.

> **Dica**
>
> Use o modelo mais forte disponível no explore e no propose. É nessas etapas que o raciocínio pesa. A execução pode usar um modelo mais rápido (veja "Subagente de execução").

## 6 Propor e revisar {#propor}

Com as dúvidas resolvidas, peça o plano. O argumento é o nome da change, em kebab-case:

```text
/opsx:propose dominio-projeto
# na mesma sessão do explore, ou apontando para o arquivo de decisões:
/opsx:propose dominio-projeto @metricas/decisoes-explore-dominio.md
```

O agente cria `openspec/changes/dominio-projeto/` e gera os quatro artefatos. Ele **só planeja**. Mesmo que o pedido diga "e já implemente", ele para quando o plano estiver pronto.

> **O nome da change não significa nada para o OpenSpec**
>
> O `/opsx:propose banana` cria a change `banana` normalmente. O nome é só o da pasta. O que entra nela vem do contexto que o agente tem: o prompt-mestre, o `config.yaml` e a conversa. Por isso o prompt-mestre precisa dizer o que cada change contém.

### A revisão é o gate mais importante {#revisao}

Abra os arquivos no disco e leia. Você pode editá-los à mão, e o agente é instruído a reler tudo do disco a cada passo. Perguntas para fazer durante a leitura:

- O `proposal.md` explica por que a change existe e o que fica de fora?
- Toda regra de negócio discutida no explore virou requisito com cenário?
- Cada cenário pode ser verificado por exatamente um teste?
- O `design.md` registra alternativas descartadas, e não só a escolhida?
- As tasks são fatias pequenas que entregam comportamento, e não uma task por camada?
- Toda premissa e toda pendência aparecem marcadas, em vez de decididas em silêncio?

### Ajustar e validar {#validar}

Se você decidir algo na revisão, peça o `update`. Ele revisa os artefatos para ficarem coerentes entre si e nunca edita código. Depois valide o formato:

```text
/opsx:update dominio-projeto

$ openspec validate dominio-projeto --strict
$ openspec status --change dominio-projeto   # quais artefatos estão prontos
```

Rode o `validate --strict` ao fim de todo `propose` e `update`, e de novo antes do `archive`. No modo estrito, avisos viram erros, como um requisito com descrição acima de 500 caracteres.

## 7 Implementar e arquivar {#executar}

Quando o plano estiver aprovado, você pede a implementação. O apply nunca roda sozinho.

```text
/opsx:apply dominio-projeto
```

- O agente executa o `tasks.md` na ordem e marca `[x]` assim que cada task termina.
- Ele pausa e pergunta diante de dúvida, bloqueio, problema de design ou trabalho além do que os specs descrevem.
- Só marque `[x]` quando o comportamento especificado está inteiro implementado, com um teste, lint ou build rodado agora e visto passar. Trabalho parcial ou adiado fica desmarcado.
- Você revisa o diff. Se o plano estava errado, volte ao `/opsx:update` antes de continuar.

### Verificar e encerrar {#encerrar}

```text
/code-review                              # revisão das pastas tocadas
/opsx:verify                              # se o seu perfil incluir (implementação x specs)
$ openspec validate dominio-projeto --strict
/opsx:archive dominio-projeto             # aceite o sync dos specs
```

O archive confere artefatos e tasks, avisa se houver task incompleta e pede a sua confirmação. Em seguida oferece o **sync dos specs**: é aqui que o delta vira spec principal. A pasta da change vai para `openspec/changes/archive/`.

> **Precisa dos specs novos antes de arquivar?**
>
> O `/opsx:sync dominio-projeto` mescla os deltas nos specs principais sem arquivar. É útil quando a próxima change já precisa enxergar esses requisitos. Para changes de infraestrutura ou documentação, o CLI aceita `openspec archive --skip-specs`.

> **Regra de equipe, não do OpenSpec**
>
> Neste projeto o agente nunca faz commit, push ou deploy. Ele deixa as mudanças no working tree e mostra o diff, e a pessoa responsável faz um commit por task. O OpenSpec também não commita, e o `/opsx:archive` só move e mescla arquivos. Defina a política de git do seu time no `CLAUDE.md`.

**APROFUNDAR**

## Anatomia dos artefatos {#artefatos}

Uma change tem quatro artefatos, gerados nesta ordem porque cada um depende do anterior. Os exemplos abaixo são de uma mini change, `exportar-relatorio-csv`, para você ver os quatro arquivos contando a mesma história.

### proposal.md {#proposal}

Responde por que esta change existe e até onde ela vai. Quem lê é quem aprova o escopo. As seções são Why, What Changes, Capabilities e Impact.

```markdown
# Proposal

## Why
Analistas copiam relatórios da tela para planilhas, perdem a formatação e
gastam tempo a cada fechamento. Hoje não existe exportação.

## What Changes
- Botão "Exportar CSV" na tela de relatórios, respeitando os filtros ativos.
- Endpoint `GET /api/relatorios/:id/exportacao` que devolve o arquivo.
- Limite de 50.000 linhas por exportação.

## Capabilities
### New Capabilities
- `exportacao-relatorios`: exportação do relatório filtrado em CSV.

### Modified Capabilities
<!-- nenhuma -->

## Impact
API (novo endpoint), View (novo botão), TestsFuncionais (cenário de download).
Fora desta change: exportação em PDF e envio agendado por e-mail.
```

Cada capacidade listada em "New Capabilities" ganha um arquivo `specs/<capacidade>/spec.md`. Em "Modified Capabilities" entram só as que mudam de comportamento, com o caminho exato que já existe em `openspec/specs/`.

### specs/…/spec.md {#spec}

Responde o que o sistema deve fazer, de forma testável. Quem lê é o negócio, o QA e quem implementa. O formato é o requisito com SHALL/MUST e os cenários WHEN/THEN.

```markdown
# Spec Delta

## Purpose
Permite que o usuário leve o relatório filtrado para uma planilha, em formato portátil.

## ADDED Requirements

### Requirement: Exportar relatório em CSV
O sistema SHALL gerar um arquivo CSV com as linhas do relatório e os filtros
ativos no momento do clique, limitado a 50.000 linhas.

#### Scenario: Exportação com filtro ativo
- **WHEN** o usuário filtra por "Março/2026" e clica em "Exportar CSV"
- **THEN** o sistema baixa um arquivo com somente as linhas de março
- **AND** a primeira linha do arquivo contém os nomes das colunas

#### Scenario: Relatório acima do limite
- **WHEN** o filtro resulta em mais de 50.000 linhas
- **THEN** o sistema recusa a exportação com "Refine o filtro para exportar"
```

- O requisito usa **SHALL** ou **MUST**. Evite "deveria" e "pode".
- O cenário usa exatamente **quatro** `#`. Com três, ou com marcadores de lista, a validação falha em silêncio.
- Todo requisito tem ao menos um cenário, e cada cenário vira um teste.
- O spec descreve comportamento observável. Nome de classe, biblioteca e passo de implementação vão para o `design.md`.

### design.md {#design}

Responde como será feito, e por que assim. Quem lê é quem implementa e quem revisa a arquitetura. As seções do template são Context, Goals / Non-Goals, Decisions e Risks.

```markdown
# Design

## Context
O relatório já é montado no servidor. Hoje só existe a visão em tela.

## Goals / Non-Goals
**Goals:** exportar o que a tela mostra, sem segunda consulta divergente.
**Non-Goals:** PDF, agendamento, exportação assíncrona.

## Decisions

### ADR-001 — Gerar o CSV no servidor, em streaming
**Contexto:** o front só conhece a página atual do relatório.
**Decisão:** o endpoint reaplica os filtros e envia o arquivo em streaming.
**Alternativas:** montar no navegador (descartada: só vê uma página);
fila com envio por e-mail (adiada).
**Consequências:** memória constante; o limite de linhas protege o banco.

## Plano de testes
| ID      | Cobre                                   | Tipo        |
|---------|-----------------------------------------|-------------|
| UT-001  | escape de vírgula e aspas no CSV        | unidade     |
| IT-001  | filtro aplicado ao arquivo              | integração  |
| E2E-001 | download pelo botão "Exportar CSV"      | ponta a ponta |
```

As seções `### ADR-NNN` e `## Plano de testes` vêm das regras do `config.yaml` do projeto de exemplo. O template padrão traz Context, Goals / Non-Goals, Decisions e Risks / Trade-offs.

### tasks.md {#tasks}

Responde em que ordem implementar, e o que já foi feito. Quem lê é o agente no apply e você na revisão. O estado é só o checkbox: `[ ]` ou `[x]`.

```markdown
# Tasks

## 1. API

- [x] 1.1 `GET /api/relatorios/:id/exportacao` com filtros e limite (cenários
  "Exportação com filtro ativo" e "Relatório acima do limite"); UT-001 e IT-001 verdes
  - Evidência: `npm test -- exportacao` 9/9 verde; `npm run lint` sem erro.

## 2. View

- [ ] 2.1 Botão "Exportar CSV" na tela de relatórios (E2E-001)

## Follow-ups

- Exportação em PDF fica para outra change.
```

- Agrupe por pasta e escreva **fatias verticais**: cada task entrega comportamento de ponta a ponta, em vez de "criar a camada de serviço".
- Cada task cita os requisitos que entrega e os testes que implementa, o que mantém a rastreabilidade de spec a teste.
- A linha **Evidência** registra o comando que foi rodado e visto passar. Sem ela, o `[x]` não vale.
- A seção **Follow-ups** guarda decisões, riscos e necessidades fora do escopo, para a próxima change.

## Uma change por vez {#changes}

Cada change é uma unidade de entrega própria, e o `propose` é o passo que planeja uma delas. Quando a change `dominio-projeto` foi arquivada, ela havia entregado **o que** o sistema deve fazer (os specs). O que vem agora é outra entrega, com outro plano.

| Change | Nome | Responde | Entrega |
|---|---|---|---|
| 1 | `dominio-projeto` | **O QUE** fazer | Specs de negócio (arquivada) |
| 2 | `fundacao-tecnica` | **COMO** fazer | Contrato da API, ADRs, catálogo de testes, SQL Server, DDL/DML, client Keycloak (arquivada) |
| 3 em diante | `api-…`, `front-…`, `testes-…`, `implantacao-…` | Código de verdade | Uma fatia verificável por change |

Cada change percorre o mesmo ciclo: propose, **você revisa**, apply, archive.

### Por que não planejar tudo de uma vez {#uma-por-vez}

1. **Os specs viram a base da próxima change.** O `MODIFIED` só funciona sobre um spec principal que já existe. Por isso a change de domínio é arquivada (ou sincronizada) antes de se propor qualquer outra que a modifique.
2. **O plano nasce da realidade.** Com a change anterior arquivada, o `design.md` e o `tasks.md` da seguinte partem do código e dos specs reais, e não de suposições feitas semanas antes.
3. **Cada change cabe numa revisão.** Uma change deve ser entregável e verificável sozinha, com no máximo cerca de 12 tasks. Passou disso, divida no `propose` ou no `update`.

### Um exemplo de decomposição {#decomposicao}

Esta é a sequência planejada do projeto usado neste guia. A decomposição das changes 3 a 12 é uma proposta e pode ser fundida ou dividida a cada gate, conforme o que se aprende.

| # | Change | Conteúdo | Fase |
|---|---|---|---|
| 1 | `dominio-projeto` | Specs de negócio | Domínio |
| 2 | `fundacao-tecnica` | Contrato da API, ADRs, catálogo de testes, banco, client Keycloak | Fundação |
| 3 | `api-leitura-e-autenticacao` | Leitura da API e autenticação | A · Api |
| 4 | `api-escrita-governanca-workflow` | Escrita, regras de governança, máquina de estados | A · Api |
| 5 | `api-integracao-anexos-relatorios` | Integração interna, anexos, relatórios, notificações | A · Api |
| 6 | `api-empacotamento` | Compose, Kubernetes, refino das rules | A · Api |
| 7 | `front-promocao-keycloak` | Promoção do protótipo e login OIDC | B · View |
| 8 | `front-integracao-api` | Front contra a API real, paridade com o protótipo | B · View |
| 9 | `front-empacotamento-docs` | Dockerfile, compose, Kubernetes, documentação | B · View |
| 10 | `testes-funcionais` | Suíte E2E e matriz de cobertura | C · Testes |
| 11 | `remover-prototipo` | Remoção do protótipo depois do E2E verde | C · Testes |
| 12 | `implantacao-compose-k8s` | Guia de implantação e validação nos dois alvos | D · Implantação |

## Subagente de execução {#subagente}

Durante a sessão você pode dar autonomia ao agente para rodar propose, apply e archive em sequência. O problema é que o chat normal não separa o nível de raciocínio: o mesmo modelo planeja e executa. O propose pede a melhor capacidade de pensamento disponível. O apply, que segue um plano já aprovado, roda bem num modelo mais rápido.

A solução é um **subagente**. O agente principal faz o propose com o modelo forte. O subagente, configurado com um modelo mais rápido, executa as tasks e implementa.

| Quem | Modelo | Etapas |
|---|---|---|
| Agente principal | O de raciocínio mais forte | `/opsx:explore` → `/opsx:propose` → você revisa → `/opsx:update` |
| Subagente `ops-executor` | Um modelo rápido (sonnet) | `/opsx:apply` → `/code-review` → `validate --strict` → `/opsx:archive` |

Entre os dois, você pede: `use o ops-executor para a change dominio-projeto`. O subagente devolve um resumo e, diante de dúvida de produto, para e entrega a decisão ao principal.

### O arquivo do subagente {#ops-executor}

Crie `.claude/agents/ops-executor.md`. O bloco entre `---` é a configuração: `name` identifica o agente, `description` diz ao agente principal quando delegar a ele, e `model` escolhe o modelo. O texto abaixo do bloco é o conjunto de instruções do subagente. Ajuste-o às peculiaridades do seu projeto.

```markdown
---
name: ops-executor
description: Executa uma change do OpenSpec já planejada: apply das tasks,
  /code-review, correções, validate e archive. Use depois que o propose da
  change estiver pronto, informando o nome da change.
model: sonnet
---

Você executa UMA change do OpenSpec, cujo nome o agente principal informa, a
partir da pasta .Sdd. Antes de editar, leia o CLAUDE.md e as rules da
pasta-alvo (../<pasta>/.claude/rules/*.md); aplique cada rule só à sua pasta.

1. **Apply:** rode `/opsx:apply <change>`. Implemente as tasks em ordem e marque
   `[x]` só com evidência fresca (teste, lint ou build rodado agora e visto
   passar), registrando a evidência na própria task.
2. **Revisão:** rode `/code-review` nas pastas que a change tocou. Registre os
   achados na seção `## Revisão` do tasks.md (um checkbox por achado:
   severidade, arquivo, descrição) e corrija-os, também com evidência. Achado
   que revele erro de especificação: pare e devolva (não corrija o spec).
3. **Encerramento:** `openspec validate <change> --strict` e depois
   `/opsx:archive <change>`, aceitando o sync dos specs.

Regras:
- Nunca commite, dê push ou deploy.
- Pare e devolva ao agente principal, sem decidir sozinho, quando houver:
  dúvida de produto, mudança visual não autorizada, bloqueio de ambiente ou
  trabalho além do que specs e tasks descrevem.
- Ao terminar (ou parar), devolva um resumo: tasks concluídas e evidências,
  achados da revisão e como foram tratados, desvios do plano, e o que ficou
  pendente.
```

- Use `/agents` no Claude Code para ver e editar os subagentes do projeto.
- O ponto central do arquivo é a regra de parada. Um executor rápido que decide dúvidas de produto sozinho produz código rápido e errado.
- Peça o resumo final no formato fixo. Ele é a sua base para a revisão do diff.

## Boas práticas {#praticas}

Regras que o time aprendeu rodando o fluxo em um projeto com mais de quarenta user stories.

- **O propose só planeja.** O apply só roda quando você pede. Se o agente começar a implementar no meio do propose, interrompa.
- **Releia do disco.** Você pode editar os artefatos entre uma etapa e outra. Peça ao agente para reler os arquivos em vez de confiar na memória da conversa.
- **Explore e propose na mesma sessão.** As decisões do explore existem só ali. Para trocar de sessão, grave um arquivo de decisões antes.
- **Uma change por vez.** Proponha a próxima só depois de arquivar a anterior. O plano seguinte nasce dos specs reais.
- **IDs estáveis, nunca renumerados.** US-001, AC-1, UT-001: a numeração liga spec e teste um a um. Mudou o requisito? Use MODIFIED e preserve o título.
- **Um cenário, um teste.** Se um cenário não pode ser verificado por um teste, ele está vago demais ou grande demais. Reescreva.
- **Evidência antes do `[x]`.** Marque a task só com um comando rodado agora e visto passar. Registre o comando na própria task.
- **Premissa e pendência explícitas.** Tudo o que o agente assumiu vira "Premissa:" e tudo o que ficou em aberto vira "Pendência:". Nada decidido em silêncio.
- **Pare e pergunte.** Dúvida de produto ou mudança que o plano não autoriza volta para você. Isso vale para o agente principal e para o subagente.
- **Valide sempre.** O `openspec validate --strict` roda ao fim de propose e update, e antes do archive. É barato e pega erro de formato cedo.
- **Validação rápida durante a task.** Rode só os testes dos arquivos afetados. A suíte completa vai na verificação final, e o que foi pulado fica registrado.
- **Conte as perguntas do processo.** Anote quantas perguntas o agente fez em cada sessão. Se o número cai de uma change para a outra, o seu prompt-mestre está melhorando.

## Problemas comuns {#problemas}

### Os comandos /opsx não aparecem no chat {#sem-comandos}

Confirme que o Claude Code foi aberto na pasta que contém o `.claude/` criado pelo init. Rode `openspec update` e inicie uma sessão nova. Se o comando específico não existe (por exemplo o `/opsx:verify`), o perfil instalado não o inclui: veja `openspec config profile` e rode `openspec update` depois.

### O agente começou a implementar durante o propose {#implementou-no-propose}

Interrompa a sessão e lembre que o propose só planeja. Reforce com uma regra no `config.yaml` e no `CLAUDE.md`. Confira com `git status` se algum arquivo de código mudou e descarte o que não foi pedido.

### Perdi as decisões que tomamos no explore {#perdi-decisoes}

Elas só existiam na conversa. Se a sessão ainda estiver aberta, peça um arquivo como `metricas/decisoes-explore-dominio.md` agora e use-o como entrada do propose. Se não estiver, será preciso repetir as perguntas.

### O validate falhou {#validate-falhou}

As causas mais comuns:

- requisito sem **SHALL** ou **MUST**;
- requisito sem nenhum cenário;
- cenário escrito com três `#` ou como marcador de lista, em vez de `####`;
- descrição de requisito acima de 500 caracteres (falha só com `--strict`);
- `## Purpose` com menos de 50 caracteres em capacidade nova;
- MODIFIED com título diferente do spec principal, ou sem todos os cenários que continuam valendo;
- change sem nenhum delta e sem `skip_specs: true`.

### O archive avisou de tasks incompletas {#archive-incompleto}

Ele mostra quantas tasks estão em aberto e pede confirmação. Termine as tasks, ou mova o que ficou para um Follow-up e arquive de propósito. Evite o `--no-validate`: ele existe para emergências.

### O MODIFIED apagou cenários do spec {#modified-apagou}

Um MODIFIED substitui o requisito inteiro. Se o delta tinha só parte do texto, o resto se perdeu. Recupere o requisito original no git, cole-o inteiro sob `## MODIFIED Requirements` e edite só o que mudou.

### A change ficou grande demais {#change-grande}

Mais de umas 12 tasks é sinal de que há duas entregas numa. Divida no `/opsx:propose` ou peça um `/opsx:update` para separar o que pode esperar em outra change.

### O agente decidiu algo que eu não aprovei {#decidiu-sozinho}

Acrescente regras ao `config.yaml`: "marque toda premissa como Premissa:" e "pare e pergunte em vez de decidir". Em seguida peça um `/opsx:update` para o agente refazer o artefato com a decisão correta.

**CONSULTAR**

## Comandos de referência {#referencia}

### No chat do Claude Code {#comandos-chat}

| Comando | Quando usar | O que faz |
|---|---|---|
| `/opsx:explore` | Antes de propor, ou no meio de uma change quando surge uma dúvida | Conversa e investigação. Não grava código. |
| `/opsx:propose <nome>` | Para planejar uma entrega | Cria a change com proposal, specs, design e tasks, e para. |
| `/opsx:update <nome>` | Depois de decidir algo na revisão | Reconcilia os artefatos. Nunca edita código. |
| `/opsx:apply <nome>` | Só quando você pedir | Implementa as tasks e marca `[x]`. |
| `/opsx:verify` | Se o perfil o incluir, depois do apply | Confere a implementação contra os specs. |
| `/opsx:sync <nome>` | Quando a próxima change precisa enxergar os requisitos | Mescla os deltas nos specs sem arquivar. |
| `/opsx:archive <nome>` | Com a change concluída | Oferece o sync e move a pasta para `archive/`. |

### No terminal {#comandos-terminal}

| Comando | O que faz |
|---|---|
| `openspec init [--tools claude] [--language <idioma>]` | Configura o OpenSpec no projeto. |
| `openspec update` | Regenera skills e comandos depois de atualizar a CLI ou mudar o perfil. |
| `openspec list [--specs]` | Lista as changes com o progresso das tasks, ou os specs com o número de requisitos. |
| `openspec view` | Painel interativo de specs e changes. |
| `openspec show <nome>` | Exibe uma change ou um spec. |
| `openspec status --change <nome>` | Mostra quais artefatos da change estão prontos. |
| `openspec validate <nome> --strict` | Valida o formato. Com `--all`, valida changes e specs. |
| `openspec archive <nome> [--skip-specs]` | Arquiva pela CLI, sem passar pelo agente. |
| `openspec config profile` | Escolhe quais workflows (comandos) ficam instalados. |
| `openspec instructions <artefato> --change <nome>` | Mostra a instrução completa que o agente recebe para um artefato. |
| `openspec templates` | Mostra onde estão os templates do schema. |
| `openspec version` | Mostra a versão instalada e se há atualização. |

Exemplo de `openspec list`:

```text
$ openspec list
Changes:
  exportar-relatorio-csv     1/2 tasks    12m ago
```

## Glossário do SDD {#glossario}

| Termo | O que é |
|---|---|
| SDD | Spec-Driven Development. A especificação vem antes do código e guia a implementação. |
| Spec | Arquivo que descreve o comportamento observável de uma capacidade, com requisitos e cenários. |
| Capacidade | Um conjunto coeso de comportamento. Cada uma é uma pasta em `openspec/specs/`. |
| Change | Uma unidade de entrega: pasta com proposal, deltas, design e tasks. Vive em `openspec/changes/`. |
| Delta | O spec dentro de uma change. Descreve só a diferença, com ADDED, MODIFIED, REMOVED ou RENAMED. |
| Requisito | Uma regra do sistema escrita com SHALL ou MUST. Em geral corresponde a uma user story. |
| Cenário | Exemplo verificável de um requisito, em WHEN, THEN e AND. Cada um deve virar um teste. |
| ADR | Registro de decisão de arquitetura: contexto, decisão, alternativas e consequências. Vive em `## Decisions` do `design.md`. |
| Gate | Ponto em que o processo para até você aprovar. Exemplos: a revisão do plano, o pedido do apply. |
| Schema | Define quais artefatos uma change tem. O padrão, `spec-driven`, gera proposal, specs, design e tasks. |
| Skill | Conjunto de instruções que o agente carrega para executar uma etapa. O init as instala em `.claude/skills/`. |
| Slash command | Atalho digitado no chat, como `/opsx:propose`. Fica em `.claude/commands/opsx/`. |
| Subagente | Agente auxiliar com instruções e modelo próprios, definido em `.claude/agents/`. |
| Archive | Etapa final: aplica o delta aos specs e move a change concluída para o histórico. |

## Seu primeiro ciclo {#checklist}

Use esta lista no seu primeiro projeto, na ordem.

1. Instalei a CLI e o `openspec --version` responde.
2. Criei a pasta `.Sdd` ao lado do código e abri o VS Code nela.
3. Adicionei os repositórios de código ao workspace e à sessão do Claude Code.
4. Juntei os insumos em `Feature/` e anonimizei o que tinha nomes reais.
5. Escrevi o prompt-mestre com decisões fechadas e sequência de changes.
6. Rodei `openspec init` e marquei o Claude Code.
7. Preenchi o `config.yaml` e criei o `CLAUDE.md` da pasta.
8. Rodei o `/opsx:explore` e respondi às dúvidas de negócio.
9. Rodei o `/opsx:propose` na mesma sessão (ou gravei as decisões em arquivo).
10. Revisei os quatro artefatos no disco e rodei `openspec validate --strict`.
11. Pedi o `/opsx:apply`, revisei o diff e conferi as evidências nas tasks.
12. Rodei o `/opsx:archive`, aceitei o sync e conferi `openspec/specs/`.
