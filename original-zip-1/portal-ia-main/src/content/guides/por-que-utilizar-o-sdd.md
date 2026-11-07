> **Por que utilizar o SDD, em resumo**
>
> Este guia trata do **valor**, voltado à gestão. As cinco seções seguem a ordem **problema → conceito → mercado → governança → métricas**: por que desenvolver com [IA](#sigla), o que é [SDD](#sigla), o que a indústria já pratica, como governar com decisão humana e como medir o ganho real. Cada seção se lê sozinha, então leia na ordem ou vá direto à que interessa.

## 1.1 O problema: [IA](#sigla) sem processo {#problema}

Gerar código com [IA](#sigla) a partir de um pedido vago e aceitar o que sai, sem uma especificação contra a qual conferir, é o que a indústria apelidou de **"vibe coding"**. A velocidade é aparente e a dívida é real: o resultado impressiona na demo e cobra caro na manutenção. O problema não está no modelo. Está na falta de processo entre a intenção e o código.

> 🎯 **Sintoma 1**
>
> **Deriva de intenção**
>
> A cada prompt, o modelo reinterpreta o que se quer. Sem um documento que sirva de âncora, o código se afasta um pouco mais da necessidade real a cada iteração, e ninguém percebe até estar longe.

> 🎲 **Sintoma 2**
>
> **Requisitos adivinhados**
>
> O modelo preenche por suposição as regras de negócio, os casos de borda e as restrições que ninguém disse. O que não está escrito ele não implementa do jeito que você pensou: ele chuta.

> 🔁 **Sintoma 3**
>
> **Retrabalho**
>
> O que parecia pronto volta, porque a entrega não era o que se pedia. Corrigir depois custa mais do que teria custado especificar antes, e o custo se repete a cada rodada de "quase lá".

> 💨 **Sintoma 4**
>
> **Conhecimento volátil**
>
> A decisão vive no chat, não no repositório. Quando a conversa fecha, o "porquê" se perde: ninguém mais consegue auditar, reproduzir ou explicar por que o código ficou daquele jeito.

> ⚠️ **A [IA](#sigla) não errou. Ela respondeu exatamente ao que foi pedido.** Faltou uma especificação verificável entre a intenção e o código. Velocidade sem processo não é produtividade. É dívida contraída depressa, com juros que aparecem no review, na manutenção e no próximo bug de produção.

#### O outro lado: onde o "vibe coding" tem lugar e onde cobra a conta

Nem todo uso de [IA](#sigla) sem processo é problema. Em ferramentas internas, protótipos e provas de conceito (o que muitos chamam de "a nova planilha de Excel"), o vibe coding dá autonomia a áreas não técnicas e resolve problemas pontuais sem travar a fila do time. O risco aparece quando o mesmo jeito de trabalhar chega ao **software de missão crítica**. É ali que surge o defeito mais traiçoeiro, o **bug silencioso**.

> 🕳️ **O bug silencioso.** Peça à [IA](#sigla) para "deixar mais rápido" um relatório de pedidos lento, e ela pode resolver a lentidão **descartando em silêncio** parte dos registros num passo de agregação. O código fica rápido e o log não mostra erro, mas o relatório que vai para a diretoria passa a omitir pedidos válidos e a mentir sobre os números. Um leigo comemora a velocidade. Quem conhece o negócio percebe que a "correção" violou a integridade do dado. **O processo existe para garantir essa análise crítica e o gate humano.**

## 1.2 O que é [SDD](#sigla) {#o-que-e-sdd}

**Spec-Driven Development** inverte a ordem. Em vez de tratar a especificação como um rascunho descartável antes do "código de verdade", o [SDD](#sigla) faz dela a **fonte da verdade** durante o desenvolvimento: um artefato que uma pessoa aprova e que serve de referência para gerar e verificar o código. O código deixa de ser o objetivo e passa a ser a implementação de uma spec. Divergência entre os dois é defeito, não "interpretação".

> 📜 **Spec como fonte da verdade**
>
> A intenção fica escrita, e dá para revisá-la antes do código. Toda decisão tem um artefato que a registra, em vez de um trecho perdido de conversa.

> ✅ **Código verificado contra a spec**
>
> O review compara o que a [IA](#sigla) gera com o que a spec exige. A pergunta deixa de ser "gostei?" e passa a ser "corresponde ao que foi aprovado?".

> 🧭 **Intenção antes de implementação**
>
> Você alinha com as pessoas o "o quê" e o "porquê" *antes* de gastar esforço no "como". Mudar de rumo, que é a parte cara, acontece no texto e não no código.

> 🔗 **Rastreabilidade**
>
> Do [PBI](#sigla) ao código, cada fase deixa um artefato encadeado. Dá para responder "de onde veio esta regra?" seguindo a trilha, não a memória de quem estava na sala.

#### Os artefatos do processo: do PBI ao código

Cada fase produz um documento que alimenta a seguinte. Só o primeiro, a necessidade de negócio, é escrito por uma pessoa. Os outros **saem do processo, com revisão humana**, e servem de mapa: a [IA](#sigla) consulta esses documentos para executar o trabalho sem depender da memória de um chat. Cada ferramenta dá o seu nome a eles, e os guias de implementação mostram como.

| Artefato | O que é | No Compozy | No OpenSpec |
|---|---|---|---|
| Necessidade | O problema de negócio que inicia tudo, no vocabulário de quem pediu | [PBI](#sigla) (`feature.md`) | Insumos e prompt-mestre (`Feature/`) |
| Requisitos | O "o quê": problema, objetivos, escopo e critérios de aceite | [PRD](#sigla) e histórias de usuário (`_user_stories.md`) | `proposal.md` e o delta do spec, com requisitos e cenários |
| Plano técnico | O "como": abordagem de implementação, decisões de arquitetura e contratos | [TechSpec](#sigla) | `design.md` |
| Testes | Os casos que verificam cada requisito, antes de existir código | Contrato de testes (`_tests.md`) | Cenários WHEN/THEN do spec e o plano de testes do `design.md` |
| Tasks | A decomposição: passos pequenos e ordenados que a IA executa um a um | Tasks | `tasks.md` |
| Decisões | Registros das decisões importantes, com alternativas e consequências | [ADRs](#sigla), anexados ao PRD e à TechSpec | Seção Decisions do `design.md` (`ADR-NNN`) |

#### Antes e depois

| Dimensão | Sem processo ("vibe coding") | Com [SDD](#sigla) |
|---|---|---|
| Fonte da verdade | O prompt e o histórico do chat | A especificação aprovada, revisada antes do código |
| Requisitos | Adivinhados pelo modelo quando faltam | Explícitos, escritos e revisados antes |
| Papel do humano | Aceita ou rejeita o que sai | Aprova a spec e revisa o resultado contra ela |
| Quando o erro aparece | Tarde: no review ou em produção | Cedo: no gate da spec, antes do código existir |
| Conhecimento | No histórico do chat, volátil | No código e nos testes; a spec fica como histórico auditável |
| Mudança de escopo | Reescreve do zero e torce para acertar | Atualiza a spec e regenera a partir dela, com rastro |

#### Como o SDD organiza o contexto: três camadas de memória

Por baixo, o [SDD](#sigla) organiza em três camadas o que a [IA](#sigla) "lembra" em cada momento. É isso que mantém o modelo alinhado sem afogá-lo em contexto. Cada peça que os guias de implementação detalham ocupa uma dessas camadas:

> **Longo prazo**
>
> **Padrões do projeto**
>
> As rules, as skills e o `CLAUDE.md`: convenções estáveis que valem para o repositório inteiro. São a fundação em que toda spec e toda task se apoiam.

> **Médio prazo**
>
> **A spec do entregável**
>
> Os requisitos e o plano técnico (no Compozy, o [PRD](#sigla) e a [TechSpec](#sigla); no OpenSpec, os artefatos da change), presentes em toda task da feature. Mesmo com o contexto limpo entre uma task e outra, todas obedecem à mesma verdade de negócio e de arquitetura.

> **Curto prazo**
>
> **A task atual**
>
> O passo a passo de **uma única task**. A janela recomeça limpa a cada task nova, sem o ruído da anterior, e o modelo mantém o foco.

> 🧭 **A spec guia; o código documenta.** Durante o trabalho, a spec aprovada é a fonte da verdade, o contrato que serve de referência para gerar e verificar o código. Depois da entrega, a **documentação viva é o código + testes**, e as specs ficam como histórico auditável, não como documento mantido à mão. Manter specs "vivas" e sincronizadas custa caro e rende pouco, e por isso o processo não exige.

## 1.3 Contexto de mercado {#mercado}

[SDD](#sigla) não é uma metodologia caseira nem uma aposta isolada. As principais fabricantes de ferramentas de [IA](#sigla) para desenvolvimento chegaram, cada uma por conta própria, ao mesmo formato: **fases explícitas, especificação antes do código e checkpoints humanos entre etapas**. Nomes e comandos mudam; o esqueleto é o mesmo.

GitHub Spec Kit · Amazon Kiro · Thoughtworks / Martin Fowler

> **Ferramenta · open-source**
>
> **GitHub Spec Kit**
>
> Toolkit aberto do GitHub para spec-driven development: transforma uma especificação em plano e tarefas executáveis por agentes, num fluxo de fases (/specify → /plan → /tasks → /implement). Faz da spec o artefato central do trabalho.

> **Ferramenta · AWS**
>
> **Amazon Kiro**
>
> [IDE](#sigla) agêntica da [AWS](#sigla) estruturada em specs: a partir de um pedido, gera requisitos, design e tarefas *antes* de implementar. O "spec-driven" é o padrão do produto, e não um recurso opcional acoplado depois.

> **Referência · consultoria/autor**
>
> **Thoughtworks / Martin Fowler**
>
> A Thoughtworks e Martin Fowler tratam o desenvolvimento assistido por [IA](#sigla) com especificação e fluxo revisado como a direção madura e o separam do uso ad-hoc: a spec é a âncora, e a pessoa continua no controle da decisão.

> 🧩 **A convergência**
>
> O padrão comum é **descrever → planejar → decompor em tarefas → executar → revisar**, com aprovação humana entre as fases. Os três guias de implementação do portal seguem esse esqueleto: [SDD com Compozy](/metodo/compozy), em fases fixas do PBI ao código revisado, [SDD com OpenSpec](/metodo/open-spec), com o ciclo explorar, propor, revisar, implementar e arquivar, e [SDD com Spec Kit](/metodo/spec-kit), com um comando por artefato (spec, plano e tarefas) e a conferência do código no fim.

## 1.4 Governança e gates humanos {#governanca}

Autonomia da [IA](#sigla) sem controle é risco; controle sem autonomia anula o ganho. O [SDD](#sigla) equilibra os dois com **human-in-the-loop**: a [IA](#sigla) produz, uma pessoa aprova em pontos definidos (os **gates**), e o rigor do controle é **proporcional ao risco** da mudança. Decisão estrutural passa por revisão rigorosa; ajuste trivial passa leve. A ideia não é revisar tudo igual, e sim revisar o que importa onde importa. Quem aprova todos os gates, por padrão, é o **dev que conduz a feature**. O [PO](#sigla) e o tech lead entram na decisão quando ela pede: dúvida de escopo ou de critério de aceite chama o PO, decisão estrutural chama o tech lead.

> 🛑 Um agente que **gera e aprova o próprio trabalho** não tem governança. Tem um ponto único de falha rodando em velocidade máxima. O gate humano existe para que a decisão de aceitar seja de uma pessoa responsável, com nome e crachá, e não do modelo que produziu a mudança.

#### Os gates de aprovação, proporcionais ao risco

| Gate | O que se aprova | Quem aprova | Rigor por risco |
|---|---|---|---|
| Requisitos | Problema, escopo, requisitos e critérios de aceite | Dev (aciona o [PO](#sigla) em dúvida de escopo/aceite) | Alto, porque define o "o quê" |
| Plano técnico | Arquitetura e decisões estruturais ([ADRs](#sigla)) | Dev (aciona o tech lead em decisão estrutural) | Alto em decisão estrutural |
| Tasks | Decomposição em tarefas e sequência | Dev | Médio |
| Implementação | Código de cada tarefa conferido contra a spec | Dev revisor | Proporcional ao risco da tarefa |
| Review e correção | Resolução das issues levantadas | Dev revisor | Proporcional à severidade |

No Compozy, esses gates são o PRD, a TechSpec, as tasks, a execução e o review. No OpenSpec, são quatro momentos: a revisão do plano depois do propose, o pedido do apply, a revisão do diff e a confirmação do archive. Nas ferramentas, nenhuma fase avança sem a aprovação da anterior.

#### O novo papel do dev

> 🔍 **De autor a revisor**
>
> Escreve menos linhas à mão e lê, questiona e aprova muito mais. O valor sai de "digitar o código" e vai para "garantir que o código está certo".

> 🎛️ **De executor a orquestrador**
>
> Conduz o pipeline: define a intenção, aprova as specs e decide o que passa em cada gate. O dev pilota o processo em vez de teclar cada detalhe.

> 🪪 **Responsabilidade indelegável**
>
> A [IA](#sigla) propõe; a pessoa responde pelo que entra no repositório. A autoria pode ser da máquina, mas a responsabilidade continua humana.

## 1.5 Métricas de valor {#metricas}

Se o processo muda o que a [IA](#sigla) faz pelo time, o jeito de medir precisa mudar junto. Medir **volume** (linhas de código, número de [PRs](#sigla)) premia exatamente o que o [SDD](#sigla) quer reduzir. O valor não está em produzir mais, e sim em entregar o **certo**, com menos retrabalho e menos defeito escapado.

> **Fluxo e estabilidade**
>
> **[DORA](#sigla)**
>
> As quatro métricas [DORA](#sigla) (frequência de deploy, lead time para mudança, taxa de falha em mudança e tempo de restauração) medem a saúde da entrega, não o esforço gasto para chegar lá.

> **Custo evitável**
>
> **Retrabalho**
>
> Quanto do que foi "entregue" volta para correção. O [SDD](#sigla) ataca isso na origem: com a spec alinhada antes, a intenção deixa de ser adivinhada e o retrabalho cai.

> **Qualidade real**
>
> **Defeitos escapados**
>
> Defeitos que passam do gate e chegam a produção. Quanto menos, melhor, e o gate da spec elimina classes inteiras de defeito antes de o código existir.

> **Aderência**
>
> **Conformidade com a spec**
>
> O que foi entregue corresponde ao que foi aprovado? A rastreabilidade do [PBI](#sigla) ao código torna essa resposta auditável, em vez de uma questão de confiança.

#### A economia do planejamento: a regra 90/10

Um dado prático muda onde vale pôr esforço: numa feature de ponta a ponta, o **planejamento** (requisitos, plano técnico e decomposição em tasks) costuma consumir cerca de **10%** dos tokens, e os **90%** restantes vão para a execução (implementar, corrigir e revisar). Planejar é a etapa mais barata e a que mais decide.

\~10%

Planejamento: requisitos · plano técnico · tasks

\~90%

Execução: implementação · correção · review

> 💡 Como o planejamento é barato e define todo o resto, é nele que vale usar o **modelo de raciocínio mais forte disponível**. Um erro de centavos na spec vira prejuízo caro de output na execução. Se o time quiser, dá para variar o modelo por fase: o Compozy permite um modelo para planejar, outro para executar e outro para revisar (`compozy exec`), e o guia do OpenSpec entrega o apply a um subagente com um modelo mais rápido. Mas isso é uma escolha, não uma exigência.

> 📉 **Linhas de código e volume de [PRs](#sigla) medem atividade, não valor.** Com [IA](#sigla), produzir 10× mais linhas ficou trivial, e cada linha é passivo a manter, revisar e depurar. Premiar volume incentiva inflar o código. O [SDD](#sigla) quer o oposto: a **menor mudança correta** que satisfaz a spec. Medir [LoC](#sigla) quando a [IA](#sigla) escreve o código é premiar o desperdício que o processo existe para cortar.

> **Próximo passo**
>
> O processo, fase a fase, está nos guias de implementação: [SDD com Compozy](/metodo/compozy), com o workspace de quatro repositórios, as rules, as skills e o pipeline, [SDD com OpenSpec](/metodo/open-spec), com o ciclo de uma change, e [SDD com Spec Kit](/metodo/spec-kit), com o ciclo de uma feature.
