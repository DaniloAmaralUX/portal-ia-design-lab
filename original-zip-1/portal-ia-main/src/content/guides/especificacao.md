## 1 Escopo deste guia {#escopo-deste-guia}

Este guia trata de **uma única atividade**: escrever a especificação de negócio de uma feature (`feature.md`), no formato definido por `template-feature.md`.

Ele existe porque a especificação deixou de ser um documento de leitura humana e passou a ser **insumo de produção**. Quando um processo orientado a especificação conduz a implementação, tudo que o documento não disser, outra pessoa vai decidir em outro momento, sem contexto de negócio e sem registro. Escrever requisito virou engenharia de precisão.

**Está no escopo:**

- o que entra no documento e o que não entra;
- o nível de detalhe que torna um requisito consumível sem suposição;
- como as quatro camadas de informação do projeto sustentam a escrita;
- como revisar e declarar a especificação pronta.

**Não está no escopo**, e de propósito, a **especificação técnica** da feature (componentes, modelo de dados, contratos de interface, comportamento não observável, âncoras no código, testes nomeados). Nem o que vem depois dela: como o desenvolvimento consome a especificação, como se quebra em tarefas, como se planeja a execução, como se organiza a esteira de implementação e verificação.

**Nada do que segue é objeto deste guia**, mesmo quando aparece em documentos vizinhos: política de branch, mensagem de commit, abertura e revisão de PR, execução e ordem de migrações, criação e nome de *feature flag*, estratégia de liberação, procedimento de rollback, comandos de esteira (`lint`, `typecheck`, `build`), limiar de cobertura, painel e alerta de operação. Cada um desses itens tem lar próprio, e nenhum deles é a especificação de negócio:

| Assunto | Onde mora | Como aparece na especificação |
|---|---|---|
| Componentes, contratos de interface, modelo de dados, testes nomeados | **Fluxo SDD**, na etapa de especificação técnica | não aparece; a especificação declara o comportamento observável e as regras que o governam |
| Branch, commit, PR, publicação de contrato | Esteira de desenvolvimento, **fora deste repositório** | citado, nunca reescrito |
| Nome de flag, estratégia de liberação, passos de rollback | Esteira de desenvolvimento | não aparece |
| Ordem e execução de migrações, janela, *downtime* | Esteira de desenvolvimento | a especificação declara o **destino do dado existente** sob a regra nova, como decisão de negócio |
| Comandos de teste, cobertura, `lint`/`build` | Esteira de desenvolvimento | a especificação nomeia **o que precisa ser verificado** (`regras/30-testes.md`), não como rodar |
| Stack, versões, estrutura de módulos, estilo de código | Esteira de desenvolvimento | não aparece; quem cobra o vocabulário de domínio no código são os guardrails do contrato |
| Painéis, alertas, plantão | Operação | só a métrica que instrumenta a métrica de sucesso da §1 |

Onde este guia toca nesses assuntos, é só para responder a uma pergunta: *que detalhe a especificação precisa carregar para que aquela etapa não tenha que adivinhar?*

### 1.1 O teste de fronteira {#o-teste-de-fronteira}

> **A especificação declara o que precisa ser verdade e como se sabe que é verdade.** **O fluxo SDD decide como fazer, e a esteira decide como publicar e como operar.**

Diante de qualquer item, pergunte: *se isto ficar em branco, o que acontece?*

- Alguém teria que **decidir um significado de negócio** por conta própria → é especificação. Escreva.
- Alguém só teria que **escolher um endereço técnico ou seguir um procedimento padrão do projeto** → é do fluxo SDD ou da esteira. Deixe seguir.

**Este repositório contém só artefatos de especificação de requisitos.** O outro lado da fronteira (solução técnica, desenvolvimento e entrega de código) vive fora dele. Isso não enfraquece a fronteira. Torna a fronteira física. Quando este guia manda "citar a esteira", a citação aponta para um processo que tem dono em outro lugar, e a especificação continua sem reescrevê-lo.

Escrever procedimento de entrega dentro da especificação tem um custo específico e silencioso: cria uma segunda versão da esteira, que envelhece sem que ninguém perceba. É o defeito que o §12.1 ("um fato, um lar") existe para evitar. E tem um custo de adoção: documento que exige do autor decisões que não são dele é documento que o time deixa de preencher.

> **Premissa de trabalho de todo o guia:** a especificação é o último lugar em que uma decisão de negócio ainda sai barata. Depois dela, toda decisão custa código.

## 2 O produto do trabalho {#o-produto-do-trabalho}

Por história, **um arquivo**:

```
features/US-142-aprovacao-alcada/
└── feature.md      ← PO/PM — o QUÊ e o PORQUÊ, em linguagem de negócio
```

|  | `feature.md` |
|---|---|
| **Dono** | PO/PM |
| **Responde** | O que o usuário passa a conseguir fazer, sob que regras, e como se verifica que foi cumprido |
| **Proibição absoluta** | citar endpoint, tabela, arquivo, código HTTP ou tecnologia |
| **Aprovado por** | QA + Líder Técnico |
| **Obrigatório** | sempre |
| **Versiona quando** | o significado do negócio muda |

### 2.1 O que o `feature.md` é {#o-que-o-featuremd-e}

É a **especificação de negócio completa de uma feature**: o problema que ela resolve e como se saberá que resolveu; a fronteira do que está dentro e do que está fora; o vocabulário e as entidades em linguagem de negócio; as regras com seus valores exatos e tabelas de decisão; o ciclo de vida com as transições permitidas e as proibidas; os requisitos em EARS; o texto literal de cada mensagem; os critérios de aceite com dados concretos; as expectativas não funcionais percebidas; e o que ainda não se sabe, declarado como premissa ou pergunta.

O nome do arquivo é `feature.md` e a semântica é essa: **um documento por feature, e ele especifica o negócio da feature.**

### 2.2 O que segue adiante, no fluxo SDD {#o-que-segue-adiante-no-fluxo-sdd}

A **especificação técnica** não faz parte da etapa de especificação de requisitos. Componentes, modelo de dados, contratos de interface, códigos de erro, idempotência, concorrência, cache, âncoras no código e testes nomeados ficam com o **fluxo SDD**, que recebe como entrada o `feature.md` aprovado.

A divisão de trabalho, então, é direta:

- **Aqui:** o que precisa ser verdade para o negócio, com números, textos e fronteiras, escrito por quem tem autoridade sobre o produto.
- **Adiante:** onde isso vive e com que mecanismo, decidido por quem tem autoridade sobre a solução.

Este guia garante que o fluxo SDD não precise adivinhar nada de negócio para fazer o seu trabalho. Toda vez que ele precisar adivinhar, a especificação falhou. O §3 existe para que isso não aconteça.

### 2.3 Mapa de consumo: para que serve cada seção lá na frente {#mapa-de-consumo-para-que-serve-cada-secao-la-na-frente}

Este é o argumento contra "detalhe demais". Cada seção do template alimenta uma decisão concreta adiante. Seção pobre não economiza tempo. Ela transfere a decisão para quem tem menos contexto de negócio.

| Seção da especificação | Alimenta | O que acontece se estiver pobre |
|---|---|---|
| §1 Contexto e métrica de sucesso | Priorização, e o julgamento de "isto está dentro ou fora?" | Escopo cresce em silêncio; a história não pode ser avaliada |
| §2 Escopo | A fronteira da entrega | Alguém implementa por conta própria o que era para ficar de fora |
| §3 Vocabulário / Entidades | Nomes de domínio, campos, validações | Sinônimos divergentes no código; campo inventado |
| §3.2 Relações e cardinalidade | O modelo de dados | Cardinalidade decidida por quem tem menos contexto de negócio |
| §4.1 Requisitos EARS | A unidade de trabalho e de verificação | Comportamento implementado por interpretação |
| §4.2 Cobertura obrigatória | Os cinco caminhos que ninguém lembra de pedir | Caso vazio, repetição e dado legado resolvidos por padrão da biblioteca |
| §4.3 Fluxo (quando há etapas) | A sequência entre requisitos | Ordem das etapas inferida adiante: decisão de negócio sem dono |
| §5 Regras + tabelas de decisão | Casos de teste de fronteira | Fronteira errada em produção, invisível até auditoria |
| §6 Ciclo de vida e autorização | Máquina de estados e transições recusadas | Transição proibida permitida por omissão |
| §7 Mensagens e textos | Texto literal exibido | Texto inventado, tom inconsistente, i18n perdida |
| §8 Critérios de aceite | Cenários automatizados | Teste que confirma o que foi feito, não o que era pedido |
| §9 ENF | O alvo mensurável definido adiante | Requisito não funcional não verificado |
| §10 Incertezas | O que precisa ser decidido antes de codificar | Decisão de negócio tomada durante a implementação, sem fórum |

## 3 O padrão de suficiência {#o-padrao-de-suficiencia}

O critério de qualidade de um requisito não é "está claro para mim". É:

> \### O teste da suposição zero
>
> Leia o requisito no papel de quem vai implementá-lo, **sem acesso a você**. Se em qualquer ponto a resposta for "aqui eu teria que decidir por conta própria", o requisito está incompleto, e o que falta nele é aquela decisão.

O teste se desdobra em seis checagens, e todo requisito precisa passar pelas seis:

| # | Checagem | Pergunta |
|---|---|---|
| 1 | **Oráculo** | Existe uma forma objetiva de dizer se está certo ou errado? |
| 2 | **Concretude** | Todo valor é número, data, texto literal ou enumeração, nunca adjetivo? |
| 3 | **Fronteira** | Toda faixa declara os dois lados, com inclusividade explícita? |
| 4 | **Exceção** | O caminho infeliz está especificado, não apenas o feliz? |
| 5 | **Estado inicial** | O contexto de partida está definido (quem, em que estado, com que dados)? |
| 6 | **Unicidade** | O requisito descreve **um** comportamento? |

### 3.1 As sete fontes de ambiguidade {#as-sete-fontes-de-ambiguidade}

Quase toda suposição indevida nasce de uma destas sete construções. Elas são fáceis de caçar por leitura:

| Fonte | Sintoma no texto | Correção |
|---|---|---|
| Adjetivo sem número | "rápido", "grande", "recente", "adequado" | substituir por valor e unidade |
| Lista aberta | "etc.", "entre outros", "por exemplo" | enumerar exaustivamente |
| Voz passiva sem ator | "a solicitação deve ser aprovada" | nomear quem age |
| Pronome sem antecedente | "ele deve ser notificado" | repetir o substantivo |
| Condição composta sem precedência | "A e B ou C" | parênteses ou tabela de decisão |
| Faixa com fronteira aberta | "acima de R$ 50 mil" | "superior a R$ 50.000,00, exclusive" |
| Exceção não declarada | só o caminho feliz descrito | requisito EARS do tipo *Se… então* |

### 3.2 A quádrupla de completude {#a-quadrupla-de-completude}

Um comportamento de negócio quase nunca está completo em um único lugar. Ele se sustenta em quatro elementos que se referenciam:

```
REQ-007   comportamento observável        (o quê acontece)
  └── RN-003   regra e valores            (sob que condição e com que números)
        └── MSG-004  texto exibido        (o que o usuário lê)
              └── CA-005  cenário         (como se verifica, com dados reais)
```

**Requisito sem regra é vago. Regra sem cenário não é verificada. Cenário sem mensagem deixa texto para inventar.** Quando uma das quatro pontas falta, alguém sem mandato para isso vai preenchê-la.

### 3.3 Antes e depois {#antes-e-depois}

**Requisito insuficiente:**

> ❌ *O sistema deve validar a alçada do aprovador antes de permitir a aprovação.*

Cinco decisões ficaram em aberto: o que é "validar"; qual é a alçada de cada perfil; o que acontece quando estoura; se o valor considerado é o total ou o do item; se o bloqueio é na abertura ou no registro da decisão.

**Requisito suficiente, na forma da quádrupla:**

> **REQ-007:** Quando um aprovador registrar decisão de aprovação em uma etapa, o sistema deve recusar a operação caso o valor total da solicitação seja superior ao limite de alçada do perfil do aprovador, e deve informar o limite aplicável ao perfil.

> **RN-003:** O limite de alçada é definido por perfil, sobre o **valor total** da solicitação (soma dos itens, com impostos, desconsiderando frete). Fonte: `memoria/dominio/regras-corporativas.md#RC-014`.
>
> | Faixa | Perfil | Valor total | Resultado |
> |---|---|---|---|
> | A | Coordenador | de R$ 0,01 a R$ 10.000,00, inclusive | pode aprovar |
> | B | Gerente | de R$ 0,01 a R$ 50.000,00, inclusive | pode aprovar |
> | C | Gerente | superior a R$ 50.000,00 | recusar: exige comitê |
> | D | Diretor | qualquer valor | pode aprovar |

> **MSG-004** (erro): *"Esta solicitação está acima do seu limite de aprovação (R$ 50.000,00). Encaminhe ao comitê financeiro."*

> ```gherkin
> @REQ-007 @RN-003 @CA-005 @automatizavel
> Esquema do Cenário: fronteira de alçada do perfil Gerente
>   Dado que existe uma solicitação em aprovação com valor total <valor>
>   E que o aprovador da etapa atual tem o perfil "Gerente"
>   Quando ele registrar a decisão "aprovar"
>   Então o resultado deve ser <resultado>
>
>   Exemplos:
>     | valor        | resultado                                   |
>     | 49.999,99    | solicitação avança para a etapa seguinte    |
>     | 50.000,00    | solicitação avança para a etapa seguinte    |
>     | 50.000,01    | decisão recusada com a mensagem MSG-004     |
> ```

Note o que mudou: ninguém inventou nada. O PO escreveu o que estava na cabeça dele, e a fronteira exata (`50.000,00` aprova, `50.000,01` recusa) deixou de ser uma aposta de quem implementa.

### 3.4 Densidade de detalhe por tipo de requisito {#densidade-de-detalhe-por-tipo-de-requisito}

Nem todo requisito exige a mesma profundidade. Use esta tabela como piso, não como teto:

| Tipo de comportamento | Detalhe mínimo obrigatório |
|---|---|
| Cálculo, faixa, alçada, limite | Tabela de decisão completa, sem lacuna, com arredondamento e unidade declarados |
| Transição de estado | Estado origem, evento, destino, perfil autorizado + lista de transições proibidas |
| Validação de entrada | Regra por campo, obrigatoriedade, formato, mensagem de erro por caso |
| Autorização | Perfil × operação × objeto, incluindo o caso "é o próprio autor" |
| Comportamento em concorrência | O **resultado percebido** pelo usuário; o fluxo SDD decide o mecanismo, adiante (§10.1) |
| Integração externa | Comportamento de negócio esperado quando o parceiro falha ou demora |
| Listagem e busca | Filtros, ordenação padrão, o que o usuário vê quando não há resultado |
| Efeito assíncrono | O que o usuário vê enquanto não concluiu; o que vê se falhar depois |
| Auditoria | Que eventos precisam ficar registrados e por quanto tempo |

**Os cinco esquecimentos mais caros**, na ordem: o caso vazio, o caso do próprio autor, o segundo clique (repetição), o que acontece quando o sistema externo não responde e **o registro criado antes desta entrega**. Os cinco têm linha própria na §4.2 do template, porque ninguém lembra do que o template não pergunta.

## 4 As quatro camadas de informação {#as-quatro-camadas-de-informacao}

Escrever bem um requisito depende menos de talento redacional e mais de **não escrever no documento errado**. Existem quatro naturezas de informação em um projeto, e cada uma tem regime próprio de escrita, revisão e uso durante a especificação.

| Camada | Natureza | Pergunta que responde | Muda | Papel na especificação |
|---|---|---|---|---|
| **1. Palácio de Memórias** | Descritiva | *O que é verdade sobre o nosso mundo?* | Raramente | **Insumo**: é de onde o autor puxa vocabulário e regras vigentes |
| **2. Regras do projeto** | Prescritiva | *O que é lei aqui?* | Muito raramente | **Fundo**: o que a especificação não precisa repetir, só citar |
| **3. Skills de autoria** | Procedural | *Como se escreve isto?* | Por evolução de método | **Método**: o passo a passo de produzir o documento |
| **4. Artefato de especificação** | Delta | *O que muda nesta entrega?* | A cada história | **Produto**: o `feature.md` da história |

As duas confusões que mais custam tempo:

> **Memória é conhecimento. Regra é ordem.** "O comitê financeiro aprova por representante único" é **memória**, porque descreve como o mundo funciona. "Toda faixa de valor declara as duas fronteiras" é **regra**, porque obriga alguém a agir.

> **Memória é sobre o produto. Skill é sobre o método.** "A solicitação tem cinco estados" é memória. "Como escrever um requisito EARS dirigido a evento" é skill.

E a confusão que mais custa qualidade:

> **Se você escreveu na especificação algo que já era verdade antes desta história, você duplicou memória.** Duplicação não é redundância inofensiva: são duas versões que passam a divergir em silêncio, e quem lê depois não sabe qual vale.

## 5 O teste de roteamento {#o-teste-de-roteamento}

Quando bater a dúvida "onde eu coloco isso?", rode estas quatro perguntas **em ordem**. A primeira que der "sim" define o destino.

```
1. Isso continuaria verdadeiro se esta história fosse cancelada?
   NÃO → Artefato de especificação (camada 4). Fim.
   SIM ↓

2. É uma obrigação ou proibição que vale em toda e qualquer entrega deste projeto?
   SIM → Regra do projeto (camada 2). Fim.
   NÃO ↓

3. É a descrição de como executar uma tarefa — um método, um passo a passo?
   SIM → Skill de autoria (camada 3). Fim.
   NÃO ↓

4. É um fato durável sobre o domínio, o sistema ou uma decisão tomada?
   SIM → Palácio de Memórias (camada 1).
```

Três testes auxiliares resolvem quase todo caso limite:

- **Teste da repetição:** se você escreveu a mesma frase em duas histórias, ela não pertence à história.
- **Teste do onboarding:** se alguém novo precisaria saber isso antes de pegar qualquer card, é camada 1, 2 ou 3, nunca camada 4.
- **Teste do delta:** se o objeto já tem definição canônica na memória, a história só escreve **o que muda**. O resto é referência.

### 5.1 Roteamento aplicado a itens que aparecem toda semana {#roteamento-aplicado-a-itens-que-aparecem-toda-semana}

| Item | Vai para | Como aparece no `feature.md` |
|---|---|---|
| Definição de "alçada" | Memória (`glossario.md#alcada`) | referência na §3 |
| Limite de R$ 50 mil vigente na empresa | Memória (`RC-014`) | referência na §5, com o valor repetido **na tabela de decisão** |
| Limite novo, criado por esta história | §5 como `RN-XXX` **nova**, marcada `nova — promover` | a marca é o registro; não se recopia na §11 |
| Os cinco estados da solicitação | Memória (`ciclos-de-vida.md#solicitacao`) | referência na §6 |
| O estado novo que esta história cria | §6 como delta | + candidato a promoção |
| Perfis e permissões existentes | Memória (`personas-e-perfis.md`) | referência na §1 e na matriz da §6 |
| "Dado pessoal não vai para log" | Regra (`regras/20-*`) | origem de uma `ENF` na §9, citando a regra |
| "Duas pessoas decidindo ao mesmo tempo: vale a primeira" | §4 e §5 | é resultado percebido: negócio, não mecanismo |
| Bloqueio otimista, campo de versão, código de erro | Fluxo SDD | não aparece |
| Decisão de arquitetura reutilizável | Memória (`ADR-XXXX`) | não aparece; é consumida adiante |
| Como escrever tabela de decisão sem lacuna | Skill de autoria | não aparece no documento |

Sobre a linha do `RC-014`: **referência não dispensa a tabela.** Cite a fonte na coluna "Fonte" e ainda assim escreva as faixas com os valores. A referência garante a autoridade; a tabela garante que o requisito seja verificável sem abrir outro arquivo. Isso não é duplicação, é *citação*. Se o valor corporativo mudar, a divergência aparece na revisão da história, que é onde ela deve aparecer.

## 6 Camada 1: Palácio de Memórias {#camada-1-palacio-de-memorias}

O conhecimento durável do projeto. Descritivo, não normativo. Durante a escrita da especificação, ele tem **um papel só, e é decisivo: evitar que cada história reinvente o vocabulário e as regras do domínio.**

### 6.1 Catálogo {#catalogo}

```
memoria/
├── 00-mapa.md                        ← índice navegável — o arquivo mais importante
├── dominio/
│   ├── glossario.md                  ← termo → definição inequívoca, com âncoras
│   ├── personas-e-perfis.md          ← perfis, permissões, quem faz o quê
│   ├── regras-corporativas.md        ← regras que atravessam features (alçadas, SLAs, políticas)
│   ├── ciclos-de-vida.md             ← máquinas de estado de negócio dos objetos centrais
│   ├── catalogo-de-mensagens.md      ← MSG-XXX consolidadas, tom de voz, i18n
│   ├── integracoes.md                ← sistemas externos: que informação vai e vem, SLA, limites
│   └── dados-e-retencao.md           ← classificação e retenção por entidade de negócio
├── decisoes/
│   ├── ADR-0001-....md               ← decisões de arquitetura (contexto e alternativas)
│   └── DN-0001-....md                ← decisões de negócio (quem decidiu, quando, por quê)
└── aprendizados/
    ├── incidentes.md                 ← o que quebrou e por quê
    └── lacunas-de-especificacao.md   ← o que faltou nas especificações anteriores
```

**Toda a memória deste repositório é de negócio.** Retrato da implementação (mapa de módulos, modelo de dados físico, contrato técnico de integração, ambientes e flags) é insumo da solução técnica e vive no fluxo SDD. O critério não é de acesso, é de curadoria: documento que precisa acompanhar o código envelhece quando não tem consumidor local, e memória envelhecida continua citável.

Dois documentos merecem nota, porque nasceram do lado técnico e ficaram por terem consequência de negócio:

- **`integracoes.md`** é o **lado de negócio das integrações com sistemas externos**. O autor precisa saber com quem o produto se integra e **que informação cada parceiro fornece e recebe**, com que disponibilidade contratada e sob que limites: para não escrever regra que depende de um dado que ninguém entrega (§11.11), para saber o que o produto se compromete a enviar, e para decidir o que o usuário vê quando o parceiro falha ou demora (§3.4). Endpoint, payload, timeout e política de retry não entram, porque o contrato técnico da integração é do fluxo SDD.
- **`dados-e-retencao.md`** guarda a classificação do dado e o prazo de retenção com base legal, que sustentam as `ENF` de auditoria e privacidade (§11.10) e as regras `SEG-02` e `SEG-04`. Classificação e prazo são propriedade da entidade de negócio, não do esquema.

### 6.2 Quem consulta o quê, e para quê {#quem-consulta-o-que-e-para-que}

| Documento de memória | Quem usa | Para quê |
|---|---|---|
| `glossario.md` | Autor de negócio | §3: vocabulário sem sinônimo divergente |
| `personas-e-perfis.md` | Autor de negócio | §1 (persona) e §6 (quem pode transicionar) |
| `regras-corporativas.md` | Autor de negócio | §5: o que já é lei e não se reescreve |
| `ciclos-de-vida.md` | Autor de negócio | §6: o canônico, para escrever só o delta |
| `catalogo-de-mensagens.md` | Autor de negócio | §7: tom de voz e códigos já usados |
| `integracoes.md` | Autor de negócio | §5, §9 e §10: o que dá para exigir de um parceiro externo, o que o produto envia a ele e o que fazer quando ele falha |
| `dados-e-retencao.md` | Autor de negócio | §3 e §9: que dado é pessoal, por quanto tempo fica retido e sob que base legal |
| `decisoes/DN-*` | Autor de negócio | §2.3: o que já foi decidido e não se reabre |
| `decisoes/ADR-*` | Fluxo SDD | insumo da solução técnica, **não** da especificação de negócio |
| `aprendizados/*` | Autor + revisor | Antecipar a lacuna que já custou caro antes |

### 6.3 Regras de curadoria {#regras-de-curadoria}

O Palácio de Memórias tem um inimigo natural: **o crescimento sem poda**. Memória inchada não é riqueza. É ruído, e o ruído faz o autor desistir de consultar e escrever de cabeça. Quatro políticas obrigatórias:

1. **Todo documento entra pelo `00-mapa.md`.** Se não está no mapa, não existe. O mapa é o único arquivo lido por inteiro; o resto é buscado por referência.
2. **Teto por documento: \~300 linhas.** Passou disso, quebre em subdocumentos e atualize o mapa.
3. **Âncoras estáveis.** Todo termo, regra e entidade tem um ID citável: `memoria/dominio/glossario.md#alcada`, `RC-014`, `ADR-0007`. É por esses IDs que a especificação referencia.
4. **Data e dono em todo documento.** Memória sem dono vira folclore, e folclore não serve de fonte para uma regra.

### 6.4 O que **não** vai na memória {#o-que-nao-vai-na-memoria}

- Detalhe de uma história específica que não virou padrão.
- Backlog, roadmap e prazos, que são efêmeros.
- Qualquer coisa que já esteja no código e possa ser lida de lá.
- Instruções sobre como agir, que são regra ou skill.

### 6.5 `aprendizados/lacunas-de-especificacao.md` merece atenção especial {#aprendizadoslacunas-de-especificacaomd-merece-atencao-especial}

Este é o arquivo que faz a operação melhorar em vez de só rodar. Toda vez que uma história voltou por falta de detalhe (a fronteira que ninguém declarou, o caso vazio esquecido, a mensagem inventada, a transição proibida que passou), o padrão entra ali, com a história de origem.

Depois de alguns ciclos, ele responde à pergunta mais útil da revisão: *o que costuma faltar nas nossas especificações?* É a fonte natural de novas regras (§7) e de ajustes nas skills de autoria (§8).

### 6.6 De onde a memória vem, na prática {#de-onde-a-memoria-vem-na-pratica}

Três caminhos alimentam o Palácio de Memórias, e eles não competem, porque cada um traz o que os outros dois não alcançam:

| Caminho | O que traz | Quando | Skill |
|---|---|---|---|
| **Promoção pós-entrega** | o que **esta entrega** descobriu: termo novo, regra que se mostrou transversal, ciclo alterado | a cada história entregue (§14) | `pg-spec-promote-to-memory` (§8.7) |
| **Leitura do sistema em operação** | o que **já era verdade** e só existia dentro do código | na partida do projeto, e periodicamente | `pg-mem-sync` (§8.8) |
| **Curadoria** | poda, fusão, correção, dono e data | contínua (§6.3) | nenhuma: é trabalho humano de julgamento |

O primeiro caminho impede que a próxima história redescubra o que esta descobriu. O segundo resolve o problema de partida de quem adota este guia com um produto já em operação: a memória nasce vazia, o domínio não. O terceiro é o que impede os dois primeiros de transformarem o Palácio em depósito.

**Nenhum dos três grava sem aprovação nominal.** As duas skills propõem e perguntam item a item; quem responde é o dono do documento de destino. Memória escrita no automático é o modo de falha "memória vira depósito", do §18, só que mais rápido.

## 7 Camada 2: Regras do projeto {#camada-2-regras-do-projeto}

Prescritiva, invariante, válida para toda entrega. No contexto da especificação, as regras servem para **reduzir o tamanho dos documentos**: o que é lei do projeto não se reescreve em cada história, só se cita.

**Meta prática: o conjunto inteiro cabe em \~350 linhas.** Regra que ninguém consegue ler por inteiro é indistinguível de regra que não existe.

```
regras/
├── 00-constituicao.md          ← princípios inegociáveis e ordem de precedência
├── 20-dados-e-seguranca.md     ← dados sensíveis, autorização, logs, LGPD
├── 30-testes.md                ← o que precisa ser provado e a que ID isso se amarra
└── 60-especificacao.md         ← o que é obrigatório em toda especificação
```

Quatro arquivos, e a razão de serem só quatro: **cada um sobrevive ao teste do §1.1.** A `60-especificacao.md` é objeto deste guia. A `20-dados-e-seguranca.md` é a origem das expectativas de auditoria, retenção e autorização que a especificação declara. Sem ela, cada história repetiria a política de dado pessoal. A `30-testes.md` diz o que precisa ser provado e como isso se amarra aos IDs, que é a única parte da verificação que a especificação pode afirmar.

**O que não está aqui, e não deve passar a estar:** stack, versões, estrutura de módulos e padrão de nomenclatura de código; branch, commit, PR, execução de migração, nome de flag, estratégia de liberação e rollback; comando de teste, pipeline e limiar de cobertura. Tudo isso pertence à esteira de desenvolvimento, que vive fora deste repositório e tem dono próprio. Quando você se pegar explicando na história, ou numa regra daqui, como se nomeia uma branch, como se estrutura a solução ou em que ordem roda a migração, o texto está no repositório errado, e está criando uma segunda fonte para um procedimento que já tem dono.

As obrigações de **fidelidade** que a especificação impõe a quem a consome (usar o termo do glossário, citar o `RN` de origem de cada valor, tirar o texto do catálogo de mensagens) atravessam a fronteira pelos guardrails do contrato de execução, não por uma regra de código escrita aqui.

### 7.1 `60-especificacao.md`: as regras sobre a própria especificação {#60-especificacaomd-as-regras-sobre-a-propria-especificacao}

Este arquivo torna a qualidade da especificação uma condição objetiva, e não uma questão de zelo individual. Exemplos de regras que valem a pena escrever uma vez:

> ✅ "Todo requisito funcional deve ter ao menos um critério de aceite que o referencie por ID." ✅ "Toda faixa de valor deve declarar as fronteiras dos dois lados, com inclusividade explícita." ✅ "Toda mensagem exibida ao usuário deve ter texto literal e código `MSG-XXX`." ✅ "Especificação com pergunta bloqueante em aberto não pode ser declarada pronta." ✅ "O `feature.md` não pode conter endpoint, tabela, arquivo, código HTTP ou nome de tecnologia." ❌ "Escrever requisitos claros e completos." Sem oráculo, ocupa espaço e não obriga a nada.

### 7.2 Como uma regra encurta a especificação {#como-uma-regra-encurta-a-especificacao}

| Regra do projeto | O que a especificação deixa de escrever |
|---|---|
| `20-*`: "dado pessoal não vai para log" | Cada história repetir a política; basta uma `ENF` citando a regra |
| `30-*`: "o nome do teste cita o ID de origem" | Cada história explicar como amarrar verificação a requisito |
| `30-*`: "toda `RN` com tabela tem fronteira nos dois lados" | Cada história enumerar os casos de fronteira |
| `00-*`: "IDs são imutáveis e nunca reciclados" | Cada história combinar política de numeração |

A esteira de desenvolvimento encurta a especificação do mesmo jeito, de fora: porque "toda funcionalidade nasce atrás de flag desligada" já é lei lá, nenhuma história precisa discutir estratégia de liberação.

### 7.3 A precedência tem que estar escrita {#a-precedencia-tem-que-estar-escrita}

Conflitos vão acontecer entre o que a memória diz, o que a regra manda e o que a história pede. Deixe a ordem escrita, uma vez, no `00-constituicao.md`:

```
Ordem de precedência em caso de conflito:
1. Regras de segurança e dados (20-*)
2. Regras da constituição (00-*)
3. Especificação da história
4. Demais regras
5. Memória do projeto

Se o conflito envolver significado de negócio, NÃO se resolve por precedência:
abre-se pergunta na especificação e quem decide é o PO.
```

A última linha é a mais importante do arquivo. **Precedência resolve conflito técnico; não resolve conflito de intenção.** Um conflito de intenção resolvido por precedência é uma decisão de produto tomada por regra de formatação.

## 8 Camada 3: Skills de autoria {#camada-3-skills-de-autoria}

Procedural, acionada sob demanda. No escopo deste guia existem **seis skills**: cinco operam sobre o `feature.md` (prefixo `pg-spec-`) e uma opera sobre a memória de domínio (prefixo `pg-mem-`).

| Skill | Dono | Entrada | Saída | Quando roda |
|---|---|---|---|---|
| `pg-spec-create` | PO/PM | Demanda, transcrição, tela, política, regra | `feature.md` | no início, antes do portão |
| `pg-spec-consolidate` | PO/PM | `feature.md` que acumulou versões e IDs removidos | o mesmo `feature.md` em versão 1.0, numeração corrida, sem histórico | antes do portão, e só enquanto não há consumidor |
| `pg-spec-review` | QA / par | `feature.md` | `revisao-AAAA-MM-DD-HH-mm.md` na pasta da história, com lacunas + nota da rubrica (§13.4) | **no** portão |
| `pg-spec-apply-review` | PO/PM | `feature.md` + o relatório mais recente, somado aos achados que rodadas anteriores deixaram abertos | o mesmo `feature.md`, corrigido, com as decisões como `D-XXX` na §2.3 | **entre** a devolução e a revisão seguinte |
| `pg-spec-promote-to-memory` | Curador de memória | §11 do `feature.md` + marcas `novo — promover` das §3 e §5 | entradas novas em `memoria/` + `00-mapa.md` atualizado | **depois** da entrega |
| `pg-mem-sync` | Curador de memória | o sistema em operação: repositórios de backend e de frontend, somente leitura | os sete documentos de `memoria/dominio/`, reconciliados | fora do ciclo de uma história |

**A ordem da tabela é a ordem do fluxo** (§13.1), e as subseções §8.3 a §8.8 detalham as seis nessa mesma ordem.

**O prefixo diz o alvo, e ele não se cruza.** `pg-spec-*` só escreve em `features/US-XXX-<slug>/`; `pg-mem-*` só escreve em `memoria/`. Nenhuma das seis toca `user-stories/`: as skills `pg-us-*` pertencem ao processo de histórias de usuário, que tem guia próprio, formato próprio e portão próprio. O formato de um processo não vale no outro.

**Três das seis existem por um motivo comum: o que acontece depois que a primeira versão foi escrita.** `pg-spec-create` e `pg-spec-review` cobrem a ida. A limpeza do versionamento, a aplicação da devolução e a promoção pós-entrega cobrem o que vem depois, que antes ficava por conta do zelo individual. Era aí que a operação perdia qualidade em silêncio, porque cada uma dessas três atividades tem um jeito errado que parece certo: consolidar um documento que já tem consumidor, fechar um achado decidindo negócio no lugar do dono, promover para a memória conteúdo que a história não aprovou.

A sexta, `pg-mem-sync`, não pertence ao ciclo de nenhuma história: ela alimenta a memória de onde todas as outras leem (§6.6), e por isso é a única que roda sem que exista uma entrega em curso.

### 8.1 Quatro princípios de skill {#quatro-principios-de-skill}

**Skill não guarda conhecimento de projeto.** Se a skill de negócio tem a tabela de alçadas dentro dela, ela deixou de ser método e virou memória mal colocada. Skill ensina *como escrever uma tabela de decisão sem lacuna*; a tabela vive na memória ou na história.

**Skill declara o que carregar.** Toda skill começa listando quais documentos de memória e quais regras ela precisa ler (§15). Essa lista impede o autor, humano ou assistido, de tentar absorver o repositório inteiro antes de escrever a primeira linha.

**Uma skill, um artefato.** Skill que produz dois documentos diferentes é duas skills, com dois donos. O que conta é o **tipo** de artefato e o dono, não a contagem de arquivos: `pg-mem-sync` pode escrever sete documentos numa rodada, mas os sete são a mesma memória de domínio, com o mesmo curador, e por isso é uma skill só.

**Skill evolui por lacuna observada.** A fonte de melhoria de uma skill é `memoria/aprendizados/lacunas-de-especificacao.md`. Se a mesma lacuna apareceu três vezes, ela precisa virar um passo explícito da skill, ou uma regra em `60-especificacao.md`.

### 8.2 O esqueleto de uma skill de autoria {#o-esqueleto-de-uma-skill-de-autoria}

Uma skill de autoria útil tem cinco partes, nesta ordem:

1. **Pacote de leitura:** quais regras e quais documentos de memória carregar antes de começar.
2. **Roteiro de entrevista:** as perguntas que a fonte da demanda precisa responder, na ordem em que destravam as outras.
3. **Ordem de preenchimento:** as seções do template não se escrevem de cima para baixo (§11.1).
4. **Regras de escrita:** padrões EARS, concretude, fronteira, delta sobre memória.
5. **Autoverificação:** o próprio autor aplica a rubrica do §13.4 antes de pedir revisão.

**Skill que não preenche um template adapta o esqueleto, não o abandona.** Nas que revisam, aplicam, consolidam ou curam, a "ordem de preenchimento" vira a **ordem das passadas**, e é ela que faz o trabalho ser sempre o mesmo trabalho, independentemente de quem executa. O que nenhuma delas dispensa é o item 1: skill que não declara o pacote de leitura obriga quem a executa a decidir sozinho o que carregar, e essa decisão é onde a suposição entra.

### 8.3 `pg-spec-create`: a escrita, e as duas decisões que a precedem {#pg-spec-create-a-escrita-e-as-duas-decisoes-que-a-precedem}

A skill que produz o documento faz duas coisas **antes** de escrever a primeira linha, e é nelas que a história se ganha ou se perde. Escrever bem uma especificação errada (grande demais, ou cerimoniosa demais para o que a demanda pede) é retrabalho que nenhuma revisão recupera.

**Primeiro, a triagem: uma demanda ou várias?** O eixo de quebra é a **capacidade de negócio verificável**, não a entidade. Uma história pode tocar três entidades e continuar inteira, se houver **uma** regra que as amarra e **uma** métrica que a mede. E duas mudanças na mesma entidade podem ser duas histórias, se não compartilham regra, métrica nem ciclo de vida. A triagem é mecânica e segue esta ordem:

1. **Inventário:** cada pedido atômico da fonte bruta, na ordem em que aparece, com a **citação literal** do trecho. Listar e interpretar na mesma passada é como pedido some.
2. **Agrupamento:** para cada par, quatro testes, e o primeiro que separar decide: **métrica** (um indicador só, com um alvo só?) · **cancelamento** (cancelando A, B ainda entrega valor sozinho?) · **fronteira cruzada** (o "fora do escopo" de A precisaria listar B?) · **sinais estruturais** do `ESP-29`. O teste do cancelamento impede a quebra por conveniência: **se A sozinho não entrega valor, você não tem duas histórias. Tem uma história e metade de um requisito.**
3. **Mapa de cobertura:** pedido → destino → justificativa. O oráculo vem emprestado das tabelas de decisão: **todo pedido aparece em exatamente uma linha de destino**, sem lacuna e sem sobreposição. Pedido sem destino é escopo perdido, e é o defeito mais caro desta etapa, porque ninguém sente falta do que nunca virou documento.
4. **Contagem:** com mais de 12 `REQ` ou 10 `RN` estimados, quebre **agora** (§13.5). Quebrar depois custa o retrabalho de todas as seções, porque cada `REQ` que migra leva junto `RN`, `CA`, mensagem, linha de cobertura e item de promoção.

**Camada, CRUD e fase não são eixo de quebra.** "Tela, serviço e dados" não são verificáveis pelo negócio isoladamente; criar, editar e excluir compartilham ciclo de vida e regras; e "fase 1 sem validação, fase 2 com validação" não sobrevive ao teste do cancelamento: cadastro sem a regra que o justifica não é valor, é dívida com aparência de entrega.

> **Quebrar é decisão de produto**, e a skill para aqui: apresenta o mapa e **aguarda confirmação** antes de escrever o primeiro `feature.md`. Skill que recebe um e-mail e devolve quatro documentos prontos tomou uma decisão que não era dela. Confirmada a quebra, a regra compartilhada entre duas histórias **não é copiada nas duas**: nasce na primeira, marcada `nova — promover`, e a segunda a referencia (`CON-01`).

**Segundo, a classe: quanto documento esta demanda merece** (§9.3). `capacidade`, `regra` ou `texto` decide quais seções são obrigatórias e como o portão vai avaliar o documento, e o portão confere a classe declarada contra os gatilhos. Cerimônia de capacidade nova numa troca de rótulo ensina o time a contornar o processo; `texto` declarado numa capacidade nova é o mesmo defeito na direção oposta (§13.5).

Só então vêm o roteiro de entrevista (problema, fronteira, vocabulário, regras e números, ciclo de vida, exceções, mensagens, não funcionais, entidades) e a **ordem de preenchimento do §11.1**, que não é a ordem do template. Duas obrigações atravessam toda a escrita: o que a memória já define entra **por referência** (§5), e o que a fonte não respondeu vira premissa ou pergunta na §10, **nunca** o palpite plausível que fecha a lacuna.

### 8.4 `pg-spec-consolidate`: limpar o versionamento enquanto ele ainda não é sinal {#pg-spec-consolidate-limpar-o-versionamento-enquanto-ele-ainda-nao-e-sinal}

O `feature.md` é **contrato, não ata da negociação que o produziu.** Uma história que chega ao portão carregando "`REQ-003` — removido na v2.0", "`D-006` corrige a redação da v2.0" e um histórico de quatro versões faz o revisor procurar derivações que nunca existiram, e faz o leitor de amanhã reconstituir uma discussão que já terminou. Quando ninguém consumiu nenhuma dessas versões, esse peso não protege ninguém, e a skill devolve o documento à **versão 1.0**, com numeração corrida e sem histórico.

A consolidação é **semanticamente neutra**: o conjunto de comportamentos especificados não muda de antes para depois; mudam números de ID, o campo `versao` e o histórico. Se o documento passou a dizer alguma coisa diferente, aquilo não foi consolidação. Foi nova versão, e segue o fluxo normal do §12.3.

O que autoriza a operação é a **ausência de consumidor**, e é isso que a skill verifica antes de tocar no arquivo: `status` ainda em rascunho ou refinamento, `aprovado_por` vazio, nenhum relatório de revisão na pasta, nenhuma outra história citando esta ou seus IDs. Um "não" em qualquer teste encerra a skill, com a recusa e o motivo. A razão está nas duas regras que parecem proibi-la: `CON-03` existe para **avisar quem derivou da versão anterior**, e `CON-02` protege o ID como **chave de ligação** entre especificação, verificação e o que foi construído. Sem ninguém a jusante, não há a quem avisar nem que chave proteger; **com alguém a jusante, consolidar é renumerar as cláusulas de um contrato assinado.**

### 8.5 `pg-spec-review`: a de maior retorno das seis {#pg-spec-review-a-de-maior-retorno-das-seis}

É a skill que **não escreve**. Ela só aponta onde alguém, mais adiante, seria obrigado a supor algo. Rodá-la antes do portão custa pouco e captura a maior parte do retrabalho antes que ele exista, porque atua no único momento em que corrigir um requisito ainda é editar uma linha de markdown.

Se você só puder investir em uma skill, invista nessa.

**Cinco passadas, nesta ordem**, e a ordem existe para economizar atenção humana: checagem barata que falha torna inútil a revisão cara.

| Passada | O que faz |
|---|---|
| **0: integridade mecânica** | a lista do §12.4 (IDs que resolvem, `REQ` sem cenário, `MSG` órfã, seção ausente ou vazia sem motivo, cobertura obrigatória sem célula vazia) e o teto de tamanho **por contagem** (§13.5) |
| **0.5: classe** | confere contra os gatilhos do §9.3 a classe que o autor declarou; um "sim" em qualquer gatilho reclassifica e devolve |
| **1: suficiência** | lê no papel de quem vai implementar **sem acesso ao autor**: oráculo, concretude, fronteira, exceção, estado inicial, unicidade; caça às sete fontes de ambiguidade (§3.1); cobertura obrigatória conferida **contra o corpo do documento**, não contra a própria tabela |
| **2: fronteira** | aplica o teste do §1.1 seção a seção: procedimento de esteira duplicado, mecanismo decidido no lugar do resultado percebido, endpoint ou tabela citados |
| **3: fachada e altitude** | o defeito que **parece** completude: "conforme regra vigente", detalhe na tela em vez de na regra, memória copiada em vez de referenciada, dispensa de classe usada para não decidir, e os sinais de `G` que só o julgamento pega |

A passada 0 vem primeiro porque **qualquer falha nela é bloqueante e devolve o documento sem revisão de mérito**. O documento vai mudar, e revisar mérito sobre texto que vai mudar é trabalho jogado fora. A 0.5 vem em seguida porque a classe **autoriza todas as dispensas do documento**: é a porta pela qual regra de negócio entraria sem especificação, o achado mais barato de encontrar e o mais caro de deixar passar.

Três características definem o resto do comportamento dela:

- **Regra de ouro: aponte a lacuna, não escreva a solução.** Revisor que preenche o buraco vira coautor, e o documento perde o único leitor que ainda o enxerga de fora. A decisão volta a não ter dono, agora com a assinatura de quem revisou. O outro lado da mesma regra é a forma do achado: **local identificável e oráculo**. "Faltam mensagens" é reclamação, não achado, e não chega a ser aplicável (§8.6).
- **A partir da segunda rodada, a revisão é incremental** (`ESP-39`). Entram os achados que rodadas anteriores deixaram abertos e o **delta** desde a versão-base; dimensão cuja seção não mudou tem a nota **transportada**, com a rodada que a fixou. Reavaliar as dez dimensões toda vez faz a nota oscilar sobre texto que não mudou, e nota que sobe e desce sem causa ensina o autor a não confiar no portão. Isso não é anistia: defeito antigo visto agora entra como **achado retroativo**, e a dimensão dele deixa de ser transportada.
- **A revisão não aprova.** O veredicto tem duas formas, e nenhuma delas é "aprovado": *devolvido* ou *pronto para assinatura*. Assinar é ato de pessoa, e de uma pessoa que não escreveu nem corrigiu a versão que assina (`ESP-30`, §13.3).

O relatório fica **na pasta da história**, como `revisao-AAAA-MM-DD-HH-mm.md`. A hora, em minutos, não é enfeite. Ela permite duas revisões no mesmo dia (a do QA e a do TL, ou a rodada seguinte a uma devolução) sem que uma sobrescreva a outra, e é esse histórico de devoluções que alimenta `memoria/aprendizados/lacunas-de-especificacao.md` (§6.5). Duas derivações pertencem ao relatório e **nunca** ao `feature.md`: a conferência das marcas `novo — promover` contra a §11, e a matriz `REQ × RN × MSG × CA` (§12.4).

### 8.6 `pg-spec-apply-review`: a aplicação é o espelho da revisão {#pg-spec-apply-review-a-aplicacao-e-o-espelho-da-revisao}

A revisão aponta a lacuna e **não** escreve a solução (§8.5). A aplicação é a metade complementar, e obedece à regra inversa e simétrica: ela escreve **só a solução que o achado já determina** (a tag ausente, a citação no lugar errado, a linha que faltou na tabela, a propagação para a seção vizinha) e **pergunta todo o resto**.

A devolução chega em lote e mistura duas naturezas opostas: correções que qualquer leitor competente aplicaria do mesmo jeito, e buracos que só o dono do negócio pode fechar. Aplicar as duas com a mesma mão é o defeito que esta skill existe para evitar: o documento volta ao portão *parecendo* corrigido, com uma decisão de produto tomada por quem estava editando markdown. Por isso a skill leva ao usuário cada escolha de valor, fronteira, desfecho ou significado, uma a uma, com as opções e as consequências visíveis. A resposta vira `D-XXX` na §2.3, e o que não for decidido vira `Q-XXX` na §10.2. **Nada se fecha por suposição.**

Três consequências que valem lembrar, porque contrariam o impulso natural de quem está corrigindo:

- **A skill não declara achado resolvido.** Quem fecha um achado é o revisor da rodada seguinte, e ele precisa ser **outro leitor**. Autor que dá baixa no próprio achado transforma o portão em formalidade.
- **A skill não julga o mérito do achado.** Achado que parece errado não é aplicado nem descartado: volta na entrega, nominalmente e com o motivo, para revisor e autor resolverem conversando, e não com o arquivo aberto no meio.
- **Ela lê os relatórios anteriores, não só o último.** Achado que uma rodada declarou em aberto continua vivo, e é comum a última passada ter sido de um papel que não reabriu os ajustes do outro.

E há um erro específico deste momento do fluxo, que o histórico deste repositório já registrou: **a correção fecha o caso apontado e deixa o caso vizinho**, e o texto que nasce da correção herda o oráculo do achado em vez do da regra. Corrigir a fronteira superior que o revisor citou e deixar a inferior como estava é passar no achado e reprovar na regra que o originou.

### 8.7 `pg-spec-promote-to-memory`: quem executa o ciclo do §14 {#pg-spec-promote-to-memory-quem-executa-o-ciclo-do-14}

A retroalimentação descrita no §14 tem um problema prático conhecido: ela é a última coisa do ciclo, é a única sem prazo, e é a primeira a não acontecer. Esta skill existe para que ela aconteça, e para que aconteça **do jeito certo**, que é o oposto de automático.

Ela levanta o inventário, propõe para cada item a redação final e o documento de destino, e **pergunta ao usuário item a item: promover ou não promover**. Quatro pontos definem seu comportamento:

- **A §11 sozinha não é o inventário.** Termo e regra novos não se recopiam nela: a marca `novo — promover` das §3 e §5 já é o registro (§11.12). Levantar só a §11 é a forma mais comum de deixar vocabulário novo fora da memória.
- **Ela não inventa conteúdo, e não reescreve na hora.** Tudo que entra na memória já estava escrito e aprovado na história; o que muda é o lar, o ID e a redação, que deixa de falar de uma entrega e passa a falar do domínio. Precisou decidir algo que a história não diz? Pare e pergunte: supor aqui é pior que supor na especificação, porque **todas** as histórias seguintes citam a memória.
- **A promoção é pós-entrega.** Candidato de documento que ainda se move vira memória que envelhece antes de ser citada.
- **Quem aprova é o dono do documento de destino** (§14), nominalmente. Promoção automática incha a memória com ruído, e memória inchada é pior que memória pequena, porque ninguém consulta.

Ao final, ela escreve as entradas aprovadas, aloca os IDs pela faixa livre e atualiza o `memoria/00-mapa.md` na mesma rodada, porque mapa desatualizado é memória invisível (§6.3).

### 8.8 `pg-mem-sync`: a memória lida do sistema em operação {#pg-mem-sync-a-memoria-lida-do-sistema-em-operacao}

As cinco skills acima giram em torno de uma história. Esta não: ela roda **fora do ciclo de qualquer entrega**, e resolve o problema de partida de todo projeto que adota este guia com um produto já em operação. A memória nasce vazia, mas o domínio não. Boa parte do vocabulário, dos perfis, das regras transversais, dos ciclos de vida e das mensagens já existe; só que existe **dentro do código**, onde o autor de negócio não vai buscar e não deveria precisar buscar.

A skill lê o sistema em operação e devolve, **em linguagem de negócio**, os sete documentos de `memoria/dominio/`. Cinco características definem como ela trabalha, e cada uma previne um defeito específico:

- **Pergunta antes de ler.** Primeiro ela pergunta quais são os diretórios de código-fonte de **backend** (entidades e regras) e de **frontend** (telas e mensagens exibidas), no plural, porque o código costuma estar espalhado por mais de um. Depois pergunta **quais documentos entram na rodada**. Toda a análise acontece dentro do que a pessoa informou, e o que restar de dúvida ali dentro volta como pergunta, nunca como palpite.
- **A análise inteira acontece antes de qualquer gravação.** Documento escrito no meio da leitura fixa um entendimento que a leitura seguinte contradiz. Havendo mais de um repositório, ele grava o primeiro lado que se leu.
- **Repositórios diferentes são um sistema só.** O que converge escreve-se uma vez; o que é complementar escreve-se somado; o que é exclusivo entra com a condição que o delimita; e **o que diverge para e pergunta**. Regra incompatível para o mesmo fato é fato de negócio, não detalhe de implementação, e não se resolve por antiguidade nem por volume de código. Um fato continua tendo uma regra só, com a condição explícita quando ela varia (`CON-01`).
- **Documento existente é reconciliado, não sobrescrito.** A redação curada se preserva onde nada mudou; o que é novo ou divergente vai a aprovação antes de gravar, um documento por vez. **ID existente nunca é renumerado e ID retirado nunca é reciclado** (`CON-02`); ID novo entra no fim da faixa registrada no `00-mapa.md`, e a skill atualiza a faixa na mesma rodada.
- **Ela lê código; ela não escreve código.** Abre os repositórios de produto somente para leitura.

**A altitude vale aqui como vale no `feature.md`, com uma exceção deliberada.** Nos seis primeiros documentos, nome de tabela, coluna, classe, arquivo, namespace, método, endpoint e biblioteca não aparecem, porque o que se extrai do código é o **significado de negócio**, não o retrato da implementação (§6.1). `dados-e-retencao.md` é a exceção: aquele documento existe para dizer **onde o dado está e por quanto tempo**, e o nome da tabela é a identidade que quem responde por dados pessoais precisa ter na mão. A exceção para no nome da tabela: coluna, tipo, chave e migração continuam fora.

> **O que esta skill produz é insumo, nunca requisito.** Ela não abre história, não numera `REQ`, `RN`, `CA` nem `ENF`, e não grava nada em `features/`. Memória lida do código descreve **o que já é verdade**; o que muda nesta entrega continua sendo o delta que só o `feature.md` diz.

## 9 Camada 4: O artefato de especificação {#camada-4-o-artefato-de-especificacao}

Um arquivo por história. O front matter não é decoração: é o que sustenta versionamento e rastreabilidade.

### 9.1 Front matter do `feature.md` {#front-matter-do-featuremd}

| Campo | Como preencher | Por que importa |
|---|---|---|
| `id` | `US-XXX`, imutável | chave de tudo |
| `classe` | `capacidade`, `regra` ou `texto` | define quais seções são obrigatórias (§9.3) |
| `versao` | sobe quando **significado** muda; não sobe por typo | sinaliza a quem já consumiu o documento que ele mudou |
| `status` | `rascunho` → `em-refinamento` → `aprovado` → … | portão de leitura |
| `aprovado_por` | QA e Líder Técnico, nominalmente | aprovação sem nome não existe |
| `revisao` | arquivo da revisão do portão, na pasta da história | é onde vive a rubrica; sem o vínculo, a aprovação não é rastreável |
| `tamanho` | `P`/`M`/`G`; **`G` deve ser quebrado antes da aprovação** | história grande esconde ambiguidade |
| `depende_de` / `bloqueia` | IDs de outras histórias | ordem de escrita e de entrega |
| `memoria_referenciada` | lista de âncoras usadas | permite validar referências automaticamente |

### 9.2 O que nunca entra no artefato de especificação {#o-que-nunca-entra-no-artefato-de-especificacao}

- Conhecimento durável copiado da memória (referencie).
- Lei do projeto copiada das regras (cite), inclusive a lista de "definição de pronto", que é `ESP-38`, `ESP-15`, `TST-08` e `TST-14` e por isso não tem seção no template.
- Método de escrita (é skill).
- Solução técnica: componente, contrato, estrutura de dados, mecanismo, **origem do dado** (é do fluxo SDD).
- Registro de execução: o que se decidiu durante a implementação alimenta a memória depois (§14), não a especificação.

### 9.3 Classe da mudança: quanto documento a demanda merece {#classe-da-mudanca-quanto-documento-a-demanda-merece}

Nem toda demanda carrega a mesma quantidade de negócio, e obrigar uma troca de rótulo a atravessar catorze seções não produz qualidade: produz **preenchimento cerimonial**, que é o passo anterior a contornar o portão. A saída não é encolher o documento informalmente. É declarar a classe e ter dispensa escrita (`ESP-35`, `ESP-36`).

| Classe | Quando | O que se escreve |
|---|---|---|
| `capacidade` | o usuário passa a conseguir algo que não conseguia | o template inteiro |
| `regra` | muda o significado, a fronteira ou a fonte de verdade do que já existe | sem ciclo de vida completo (só delta), no máximo três `REQ` |
| `texto` | muda redação exibida, e nada mais | contexto, escopo, mensagens, aceite, incertezas |

> **Dispensa declarada encurta o documento; dispensa silenciosa transforma o portão em formalidade.** Seção fora da classe mantém o cabeçalho e recebe "*Não se aplica: \<motivo>*". Ausência silenciosa é indistinguível de esquecimento, e as duas leituras produzem código diferente.

O autor declara a classe, e o portão a **confere**. Um "sim" em qualquer destes gatilhos reclassifica: o termo muda · o texto aparece em mais de um lugar · alguém busca, filtra, ordena ou concilia por ele · tem valor jurídico ou regulatório · é traduzido ou tem variável · muda o que o usuário entende que deve fazer. Sem essa conferência, `classe: texto` vira a porta pela qual regra de negócio entra sem especificação, o pior resultado que este guia poderia produzir.

**O caso da demanda enunciada em linguagem técnica.** "Passar a ler essa informação de outra origem" não é especificável (`ESP-01`, `ESP-02`): a origem pertence ao fluxo SDD. Traduza para o observável (*qual informação o usuário passa a ver*) e pergunte se o valor exibido muda para algum registro. Se não muda para nenhum, nunca, não há negócio na demanda: é tarefa técnica da esteira, e não nasce `feature.md`. Se pode mudar, é `classe: regra`, e o conteúdo real da história são o caso vazio, o dado legado e a fronteira do que **não** muda.

## 10 A linha de observabilidade {#a-linha-de-observabilidade}

Esta é a parte que mais gera discussão em time, então vale um critério único, memorizável:

> \### A linha de observabilidade do usuário
>
> Se uma pessoa de negócio consegue **observar e verificar** o comportamento sem abrir o código, é **especificação de negócio**: escreva no `feature.md`. Se só é verificável por dentro do sistema, **não é desta etapa**: quem decide é o fluxo SDD, adiante.

Aplicando:

| Informação | Onde | Por quê |
|---|---|---|
| "Compras acima de R$ 50 mil exigem comitê" | **`feature.md`** (citando `RC-014`) | Regra observável |
| "O solicitante não pode aprovar a própria solicitação" | **`feature.md`** | Comportamento observável |
| "Você não pode aprovar uma solicitação criada por você." | **`feature.md`** | O usuário lê o texto |
| Ciclo RASCUNHO → EM\_APROVACAO → APROVADA | **`feature.md`** (delta) + **memória** (canônico) | Semântica de negócio |
| "Duas pessoas decidindo ao mesmo tempo: vale a primeira" | **`feature.md`** | O resultado é percebido |
| "A confirmação deve aparecer em até 2 segundos" | **`feature.md`** (`ENF`) | Expectativa percebida |
| Recusa com código de erro e status de protocolo | **fluxo SDD** | Só verificável por dentro |
| Bloqueio otimista em decisão concorrente | **fluxo SDD** | Invisível ao usuário |
| "p95 ≤ 400 ms sob 50 req/s" | **fluxo SDD** | Tradução mensurável da expectativa |
| Tabelas, colunas e componentes | **fluxo SDD** | Implementação |
| Entidades e campos em linguagem de negócio | **`feature.md`** + **memória** | Vocabulário compartilhado |
| "O relatório é gerado em segundo plano" | **`feature.md`** se o usuário percebe a espera; **fluxo SDD** se é transparente | Depende da percepção |

### 10.1 O caso difícil: comportamento técnico com efeito percebido {#o-caso-dificil-comportamento-tecnico-com-efeito-percebido}

Concorrência, idempotência e assincronia parecem técnicos, mas têm resultado observável. A divisão correta é em duas camadas:

- **A especificação declara o resultado esperado**, em linguagem de negócio: *"Se dois aprovadores decidirem a mesma etapa simultaneamente, o sistema deve registrar apenas a primeira decisão e informar ao segundo que a etapa já foi decidida."*
- **O fluxo SDD decide o mecanismo**: bloqueio, campo de versão, código de erro, teste de corrida.

Se a especificação cala sobre isso, o padrão da biblioteca escolhe o mecanismo, e o usuário descobre o comportamento em produção.

### 10.2 A regra que protege o negócio {#a-regra-que-protege-o-negocio}

> **Ninguém, adiante, altera o significado de um requisito.** Se a implementação é inviável, ou o requisito é ambíguo, quem encontrou **abre uma pergunta contra a especificação** (`Q-XXX`), o PO decide, o `feature.md` sobe de versão e quem depende dele revisa.

É esse ciclo, e só ele, que impede a técnica de reescrever o negócio pelas beiradas. Uma ambiguidade "resolvida" na implementação é uma decisão de produto sem dono.

## 11 Escrevendo o `feature.md` {#escrevendo-o-featuremd}

Guia seção por seção de `template-feature.md`. Para cada uma: o objetivo, o critério de suficiência e o erro típico. As seções obrigatórias dependem da classe declarada (§9.3). O que segue descreve `classe: capacidade`, o caso completo.

### 11.1 A ordem real de preenchimento {#a-ordem-real-de-preenchimento}

Não escreva de cima para baixo. Esta ordem reduz retrabalho porque resolve primeiro o que restringe o resto:

```
§1 Contexto e problema          ← por que estamos fazendo (e como saberemos que deu certo)
§2 Escopo                       ← a fronteira: o "fora" vale mais que o "dentro"
§3 Vocabulário e entidades      ← fixa os nomes e a cardinalidade antes de escrever regra
§5 Regras + tabelas de decisão  ← os números, o núcleo duro
§6 Ciclo de vida e autorização  ← os estados e o que é proibido
§4.1 Requisitos EARS            ← agora sim: comportamentos, apoiados nas regras
§4.2 Cobertura obrigatória      ← as cinco linhas que fecham os caminhos esquecidos
§7 Mensagens e textos           ← texto literal de cada caminho, feliz e infeliz
§8 Critérios de aceite          ← cenários com dados reais e fronteiras
§9 ENF                          ← expectativas percebidas
§10 Incertezas                  ← o que não se sabe, explicitado
A frase "Como um… quero…"       ← escreva por último: agora ela é honesta
§11 Promoção                    ← fechamento
```

O motivo de `§4` vir depois de `§5` e `§6`: requisito escrito antes das regras vira paráfrase de desejo. Escrito depois, vira comportamento apoiado em números.

### 11.2 §1 Contexto e Problema {#1-contexto-e-problema}

**Objetivo:** dar a quem lê o critério para julgar decisões futuras. Um bom contexto permite responder "esse caso está dentro ou fora?" sem perguntar.

**Suficiente quando:** descreve a dor atual, quem sente, com que frequência e qual o custo de não resolver, e **não contém solução**.

**A métrica de sucesso é obrigatória** e precisa de três partes: indicador observável, valor alvo e prazo de medição. Só `classe: texto` a dispensa, e a dispensa fica escrita.

> ✅ "Tempo médio entre abertura e decisão final cai de 4,2 para 2 dias úteis, medido 60 dias após a liberação total." ❌ "Melhorar a agilidade do processo de aprovação."

A frase "Como um ⟨persona⟩, quero ⟨capacidade⟩, para ⟨benefício⟩" fecha esta seção e é a **última coisa a escrever** no documento: antes disso ela descreve a intenção, não a entrega.

**Erro típico:** descrever a solução no contexto ("precisamos de uma tela de aprovação com filtros"). Isso fecha o espaço de solução antes de o problema estar claro.

### 11.3 §2 Escopo {#2-escopo}

A subseção mais valiosa do template inteiro é a **§2.2 Fora do escopo**. É ela que impede o crescimento silencioso da entrega.

**Suficiente quando:** cada item de fora tem **motivo** e **destino** ("não agora: tratado em `US-150`" ou "decisão de negócio: não faremos"), em tabela de duas colunas.

Escreva em "fora do escopo" tudo que um leitor razoável poderia esperar que estivesse dentro: aprovação em lote, delegação de alçada, notificação por e-mail, histórico exportável. O item que você acha óbvio que está fora é justamente o que alguém vai implementar por conta própria.

**§2.3 Decisões já tomadas** existe para não reabrir discussão: quem decidiu, quando, e onde está a ata. Decisão sem fórum e sem data não é decisão, é preferência. Registre aqui só as decisões que **não** viraram regra. Decisão que virou `RN` vive na §5, citada na coluna Fonte. Escrever nos dois lugares cria duas versões que divergem em silêncio.

### 11.4 §3 Vocabulário e entidades {#3-vocabulario-e-entidades}

**Objetivo:** um termo, um significado, no documento e no código.

**Suficiente quando:**

- todo termo de domínio usado no documento está no glossário da memória (referenciado) ou definido aqui e marcado como **novo — promover**;
- nenhum conceito aparece com dois nomes ao longo do documento;
- as entidades listam informação, obrigatoriedade e regra de preenchimento **em linguagem de negócio**, sem tipo de banco e sem tamanho de campo;
- **cada relação entre entidades tem cardinalidade de negócio declarada**: exatamente um, zero ou um, um ou mais, zero ou mais (`ESP-37`).

Sobre cardinalidade: "cada contrato se vincula a exatamente um curso e a exatamente um estudante" é fato de negócio, não modelo de dados, e é a primeira coisa que o fluxo SDD usa. Cardinalidade que aparece como premissa é cardinalidade que ninguém decidiu.

> ✅ Entidade *Solicitação* · Informação *Justificativa* · Obrigatória *Sim quando o valor total for superior a R$ 10.000,00* · Regra *texto livre, mínimo 20 caracteres* ❌ Entidade *Solicitação* · Campo *justificativa* · `VARCHAR(500) NULL`

**Erro típico:** usar "requisição", "pedido" e "solicitação" como sinônimos ao longo do documento. Três nomes produzem três conceitos no código.

### 11.5 §4 Requisitos Funcionais (EARS) {#4-requisitos-funcionais-ears}

Os cinco padrões, e quando cada um cabe:

| Padrão | Forma | Use quando |
|---|---|---|
| Ubíquo | "O sistema deve…" | vale sempre, sem gatilho |
| Dirigido a evento | "Quando ⟨gatilho⟩, o sistema deve…" | há um estímulo discreto |
| Dirigido a estado | "Enquanto ⟨estado⟩, o sistema deve…" | vale durante uma condição |
| Opcional | "Onde ⟨recurso habilitado⟩, o sistema deve…" | depende de configuração |
| Indesejado | "Se ⟨condição⟩, então o sistema deve…" | caminho de exceção, erro, abuso |

**Suficiente quando:**

- um comportamento por requisito (se você usou "e também", provavelmente são dois);
- sempre "deve", nunca "deveria", "pode" ou "idealmente";
- a resposta é **observável**: o usuário vê, recebe, é impedido, é notificado;
- há requisito *Se… então* para cada caminho de exceção relevante;
- números e enumerações, nunca adjetivos.

**IDs são imutáveis.** `REQ-012` nasce aqui e nunca é renumerado, porque é a chave que liga a especificação à verificação e ao que for construído. Requisito removido fica marcado como removido; o número não é reciclado.

**O erro típico é o requisito-guarda-chuva:**

> ❌ "REQ-004: O sistema deve gerenciar o fluxo de aprovação, permitindo aprovar, reprovar, devolver para ajuste e cancelar, respeitando as permissões de cada perfil."

São quatro comportamentos, quatro conjuntos de regras e quatro caminhos de erro dentro de um ID. Ele é impossível de rastrear e impossível de verificar. Quebre em quatro.

**Categoria sem requisito não é apagada.** Uma história pode não ter requisito opcional, mas "não tem" e "não pensei nisso" são estados diferentes, e apagar a categoria torna os dois indistinguíveis. Escreva o motivo: *"não se aplica: a restrição não depende de configuração habilitável"* (`ESP-36`).

**A §4.2 Cobertura obrigatória** é a resposta estrutural aos cinco esquecimentos do §3.4. Cinco linhas, cada uma com `REQ`, mensagem e cenário, ou com o motivo escrito de não se aplicar:

| Caso | Por que ninguém lembra |
|---|---|
| Nenhum registro / informação ausente | o caminho feliz sempre tem dados |
| O próprio autor da operação | a autorização é pensada por perfil, não por autoria |
| Repetição da mesma solicitação | ninguém demonstra o segundo clique |
| Sistema externo não responde | o parceiro respondeu em todos os testes |
| Registro criado **antes** desta entrega | a história é escrita olhando o futuro (`ESP-20`) |

Célula vazia é lacuna visível, e deixar a lacuna visível é o objetivo da tabela. E célula preenchida com um `REQ` que trata de outro caminho é fachada: a revisão confere a tabela **contra o corpo do documento**, não contra a própria tabela.

**A §4.3 Fluxo** é opcional e existe porque EARS é atomista por construção: doze requisitos não dizem em que ordem as coisas acontecem. Quando a história tem mais de uma etapa de interação, escreva até oito passos em linguagem de negócio, cada um citando o `REQ` que o governa. Sem tela, sem campo, sem botão, sem ordem de preenchimento. O fluxo é a porta mais fácil para violar a altitude, e ela fica fechada.

### 11.6 §5 Regras de Negócio {#5-regras-de-negocio}

**Objetivo:** o núcleo duro (os números, as condições, as matrizes).

**Suficiente quando:**

- cada regra tem **fonte** (política, artigo, fórum + data, ou `RC-XXX` da memória);
- regras novas estão marcadas como **nova — promover**;
- **toda faixa, alçada, limite ou matriz tem tabela de decisão completa**.

Critérios de uma tabela de decisão completa:

1. **sem lacuna:** todo valor possível cai em exatamente uma linha;
2. **sem sobreposição:** nenhum valor cai em duas;
3. **inclusividade explícita:** "de X a Y, inclusive", nunca "entre X e Y";
4. **extremos cobertos:** zero, negativo, nulo, vazio, máximo;
5. **preâmbulo escrito acima da tabela:** unidade, casas decimais, critério de arredondamento, fuso horário e faixa considerada. É parte da tabela, não enfeite: sem ele, quem lê interpreta a fronteira (`ESP-10`);
6. **sem "etc."**.

> ❌ "Compras de médio valor exigem dois aprovadores; acima disso, comitê." ✅ Tabela com faixas de R$ 0,01 a R$ 10.000,00; de R$ 10.000,01 a R$ 50.000,00; superior a R$ 50.000,00, e a linha que diz o que acontece com valor zero.

**Erro típico:** declarar a faixa e esquecer o comportamento na fronteira. "Acima de R$ 50 mil" não diz o que acontece **em** R$ 50 mil. Metade dos defeitos de regra de negócio vive nessa palavra.

### 11.7 §6 Ciclo de Vida e Autorização {#6-ciclo-de-vida-e-autorizacao}

**Objetivo:** fechar a máquina de estados de negócio.

**Suficiente quando:**

- se o objeto já tem ciclo canônico na memória, **só o delta está escrito**, com referência ao canônico;
- cada transição declara estado origem, evento, estado destino e **perfil autorizado**;
- **as transições proibidas estão listadas explicitamente**;
- **estados finais estão identificados como finais**, inclusive quando a resposta é "nenhum estado final novo";
- a matriz de autorização cobre perfil × operação × objeto, com o caso "criado por ele mesmo";
- há resposta para "o que acontece se o evento chegar no estado errado?", normalmente um requisito *Se… então* na §4.

**Erro típico:** listar só as transições desejadas. Uma máquina de estados sem lista de proibições é uma máquina permissiva por omissão, e a permissão indevida só aparece quando alguém a usa.

### 11.8 §7 Mensagens e Textos ao Usuário {#7-mensagens-e-textos-ao-usuario}

**Objetivo:** só o dono do produto escreve texto exibido ao usuário.

**Suficiente quando:**

- **texto literal, entre aspas, na redação final**, e não a descrição do texto;
- código `MSG-XXX`, condição de negócio exata e tipo (sucesso / erro / alerta / informativo);
- há mensagem para cada caminho de exceção que a §4 declarou;
- os casos vazios estão cobertos ("nenhuma solicitação pendente");
- variáveis interpoladas estão marcadas: *"Esta solicitação está acima do seu limite de aprovação ({limite})."*
- o tom segue `memoria/dominio/catalogo-de-mensagens.md`.

**Quando a história altera texto já exibido**, as duas redações ficam escritas, a atual e a nova, com onde cada uma aparece e quem tem autoridade sobre ela. É a informação central desse tipo de mudança, e a que ninguém consegue reconstruir depois.

**Erro típico:** "mostrar mensagem de erro amigável". Isso é um pedido, não uma especificação, e produz texto inventado.

### 11.9 §8 Critérios de Aceite {#8-criterios-de-aceite}

**Objetivo:** transformar cada requisito em verificação executável.

**Suficiente quando:**

- **todo `REQ` tem ao menos um `CA` que o referencia por tag**;
- todo cenário usa **dado concreto**, nunca categoria ("um valor alto" → "R$ 50.000,01");
- toda faixa da §5 virou `Esquema do Cenário` com **as fronteiras dos dois lados** (limite−ε, limite, limite+ε);
- cada cenário tem **uma** ação em `Quando`;
- o `Dado` estabelece o estado inicial completo: quem é o usuário, em que estado está o objeto, que dados existem;
- cenários que exigem julgamento humano estão marcados `@inspecao-humana`, e os demais `@automatizavel`;
- caminhos de exceção têm cenário próprio, não uma linha no final do cenário feliz.

Sobre as tags: elas não são enfeite. `@REQ-007 @RN-003 @CA-005` é o que permite verificar, mecanicamente, que nenhum requisito ficou sem verificação e que nenhum teste existe sem requisito de origem.

**Erro típico:** o cenário que descreve a interface em vez do comportamento.

> ❌ "Quando eu clicar no botão verde no canto superior direito da tela de detalhe…" ✅ "Quando eu registrar a decisão de aprovar a etapa atual…"

O primeiro amarra a verificação a um layout que vai mudar. O segundo amarra ao comportamento, que é o que foi especificado.

### 11.10 §9 Expectativas Não Funcionais {#9-expectativas-nao-funcionais}

**Objetivo:** declarar a expectativa **percebida**, deixando a métrica para quem constrói.

**Suficiente quando:** cada `ENF` tem justificativa de negócio (regulatória, contratual, política interna, experiência) e um alvo percebido, e não uma métrica técnica.

> ✅ ENF-001: "A confirmação da decisão deve aparecer em até 2 segundos." Justificativa: aprovador decide em lote e abandona a tela se travar. ✅ ENF-002: "Toda decisão precisa ficar registrada de forma auditável por 5 anos." Justificativa: exigência da auditoria interna. ❌ ENF-003: "O endpoint de decisão deve ter p95 abaixo de 400 ms." Isso é métrica técnica, e traduzir a expectativa em alvo mensurável é trabalho do fluxo SDD.

Não deixe de fora as três que mais somem: **auditoria**, **acessibilidade** e **volume esperado** (quantos registros, quantos usuários simultâneos, qual o pico). Volume não declarado é volume assumido, e a suposição costuma ser otimista.

### 11.11 §10 Incertezas: premissas e perguntas abertas {#10-incertezas-premissas-e-perguntas-abertas}

**Premissa** é o que você está assumindo como verdade sem ter verificado. Declare o **impacto se for falsa** e se é bloqueante. Premissa não declarada é a origem clássica do retrabalho tardio: alguém descobre, já na implementação, que a integração não expõe o campo que a regra exige.

Cuidado com a premissa que é, na verdade, uma afirmação não verificada. "Sem impacto em filtro, ordenação ou exportação" é o caso típico: se for verdade, é premissa com impacto declarado; escrita no corpo do documento como fato, passa a ser decisão de negócio tomada por otimismo.

**Pergunta aberta** é o que falta decidir. Precisa de responsável nominal, prazo e classificação de bloqueio.

> **Nenhuma pergunta bloqueante em aberto pode passar pelo portão.**

A tentação é grande: "seguimos e resolvemos durante a implementação". Isso significa que quem estiver escrevendo o código no momento em que a dúvida aparecer vai tomar a decisão de negócio, sem fórum e sem registro. É o custo mais alto que uma especificação pode transferir para frente.

### 11.12 §11 Candidatos a Promoção {#11-candidatos-a-promocao}

Preencha durante o refinamento, enquanto a lembrança está fresca, e revise na entrega. Entram aqui os itens que **não** têm marca própria em outra seção: decisões, delta de ciclo de vida, persona, entidade que passa a carregar dado pessoal. Esta seção alimenta o §14 e impede a memória de ficar defasada em relação ao produto.

Termo e regra **não** se recopiam aqui: a marca `novo — promover` das §3 e §5 já é o registro, e repetir a lista cria duas versões da mesma informação (`CON-01`). Quem promove lê as duas seções, e a passada 0 da revisão (§12.4) confere que a §11 não recopiou o que já estava marcado.

### 11.13 Por que não existe "Definição de Pronto" {#por-que-nao-existe-definicao-de-pronto}

O template não tem essa seção, e a ausência é deliberada. A lista que costuma ocupá-la (todo `REQ` com `CA`, todo `@inspecao-humana` validado, toda `ENF` confirmada, nada do "fora do escopo" implementado, métrica coletando) é **idêntica em toda história**, e por isso não é especificação: é `ESP-15`, `TST-08`, `TST-14` e `ESP-38`, que já são lei. Copiá-la para dentro do documento é reescrever regra (`ESP-06`), com o efeito colateral de criar duas versões que divergem.

O que a especificação de fato precisa provar na entrega, e que ninguém além dela sabe, são os dois itens do `ESP-38`: **nenhum item de "fora do escopo" foi implementado** e **a métrica de sucesso está instrumentada e coletando**. O segundo é o mais esquecido e o mais importante. Se a métrica não estiver coletando, ninguém consegue avaliar a história, e você nunca vai saber se resolveu o problema da §1.

## 12 Integridade referencial e versionamento {#integridade-referencial-e-versionamento}

Quatro invariantes. Se alguma cair, a arquitetura degrada para "pastas com markdown".

### 12.1 Um fato, um lar {#um-fato-um-lar}

Toda informação tem exatamente **um** documento dono. Os demais **referenciam por ID**: `RC-014`, `memoria/dominio/glossario.md#alcada`, `ADR-0007`, `REQ-012`.

A exceção deliberada, já mencionada no §5.1: a tabela de decisão repete os valores de regra que cita, junto com a referência à fonte, porque a verificabilidade local vale mais que a economia de linhas.

### 12.2 IDs são imutáveis {#ids-sao-imutaveis}

`REQ-012` nasce no `feature.md` e nunca é renumerado. Ele é a chave estrangeira que liga negócio → verificação → código. Renumerar quebra a rastreabilidade **em silêncio**, que é o pior tipo de quebra. Requisito descartado fica marcado como removido; o número não volta a ser usado.

### 12.3 A versão é o sinal para quem consome {#a-versao-e-o-sinal-para-quem-consome}

O `feature.md` aprovado é insumo de tudo que vem depois. Por isso a versão não é decoração:

> **Quando o `feature.md` sobe de versão, tudo que foi derivado dele a partir da versão anterior está desatualizado e precisa ser revisado antes de a entrega seguir.**

Isso resolve o problema clássico de "o PO mudou a regra e ninguém revisou o que já estava em andamento". Política de versionamento, para não haver dúvida sobre quando subir:

| Mudança | Versão | Efeito |
|---|---|---|
| Correção de typo, formatação | não sobe | nenhum |
| Detalhamento que não altera significado (ex.: mensagem que faltava) | `1.1` → `1.2` | revisão leve do que já foi derivado |
| Alteração de regra, fronteira, requisito ou escopo | `1.x` → `2.0` | **revisão obrigatória** de tudo que foi derivado |
| Requisito novo | `1.x` → `2.0` | novo comportamento a construir e verificar |

### 12.4 Referência quebrada reprova {#referencia-quebrada-reprova}

As três invariantes acima só valem se alguém as conferir. Quem confere é a **passada 0 da skill `pg-spec-review`**, a lista mecânica que roda **antes** de qualquer leitura de mérito, porque checagem barata que falha torna inútil a revisão cara:

- todo ID citado existe (`RC-XXX`, `ADR-XXXX`, âncoras de memória, `REQ`/`RN`/`ENF`/`MSG`/`CA`);
- todo `REQ` aparece em ao menos um cenário de aceite;
- toda `RN` com tabela de decisão tem preâmbulo completo e cenário de fronteira;
- toda `MSG` declarada é usada por algum requisito ou cenário;
- nenhuma seção do template está ausente, e nenhuma está vazia sem a linha "*Não se aplica: \<motivo>*" (`ESP-36`);
- a tabela de cobertura obrigatória tem as cinco linhas, sem célula vazia (`ESP-14`, `ESP-20`);
- `classe` está preenchida e `revisao` resolve para um arquivo existente;
- nenhum ID foi renumerado desde a versão anterior;
- não há pergunta bloqueante em aberto em documento com status `aprovado`.

**Qualquer falha aqui é bloqueante, e devolve o documento sem revisão de mérito**, porque ele vai mudar.

Duas derivações pertencem a essa mesma passada, e ao **relatório**, nunca ao `feature.md`: coletar as marcas `novo — promover` das §3 e §5 para conferir a §11, e montar a matriz `REQ × RN × MSG × CA` como evidência do `ESP-15`. A matriz fica fora do template de propósito. Escrita à mão dentro da história, é duplicação que dessincroniza (`CON-01`); derivada na revisão, é o insumo que o fluxo SDD mais usa.

> **Não existe ferramenta de validação neste repositório, e não deve passar a existir.** A revisão é uma skill, e a passada 0 é a parte dela que não depende de julgamento. Criar um validador ao lado duplicaria a mesma lista em dois lugares com donos diferentes, que é o defeito que o §12.1 proíbe.

A passada 0 é o item de melhor relação esforço/retorno de toda a operação documental. Sem ela, as invariantes acima são boas intenções.

## 13 Fluxo de escrita, portão e rubrica de prontidão {#fluxo-de-escrita-portao-e-rubrica-de-prontidao}

### 13.1 O fluxo {#o-fluxo}

```
   DEMANDA (transcrição, política, tela, incidente, pedido)
      │
      ▼
 ┌──────────────────────────┐
 │ Autor de negócio         │  skill: pg-spec-create
 │ escreve feature.md       │  lê: memória/dominio/* + regras 00, 20, 60
 └───────────┬──────────────┘
             │
             ├──► ambiguidade ──► Q-XXX ──► PO decide ──► registra no documento ──┐
             │                                                                    │
             │◄───────────────────────────────────────────────────────────────────┘
             │
             ├──► versionamento acumulado, e nada derivado ainda ───┐
             │       skill: pg-spec-consolidate → volta para v1.0   │
             │◄─────────────────────────────────────────────────────┘
             ▼
      ◆ PORTÃO DE ESPECIFICAÇÃO — revisão de negócio (QA + Líder Técnico)
             │  skill: pg-spec-review → revisao-AAAA-MM-DD-HH-mm.md, na pasta da história
             │  Classe conferida — reclassificada, volta ao autor
             │  Rubrica ≥ 85 · nenhuma dimensão < 6  (classe texto: checklist, 1 aprovador)
             │  Nenhuma pergunta bloqueante aberta
             │  Passada 0 da revisão sem achado — referências resolvem
             │
             ├──► lacunas ──► skill: pg-spec-apply-review ─────────────────────────┐
             │       aplica o que o achado determina · pergunta o que é decisão     │
             │       de negócio → D-XXX na §2.3 · o que ficar aberto → Q-XXX §10.2  │
             │◄──── e volta ao portão, com OUTRO leitor fechando os achados ────────┘
             ▼
        ESPECIFICAÇÃO PRONTA
             │
             ▼
   ┄┄┄┄┄┄┄┄┄ FRONTEIRA DESTE GUIA ┄┄┄┄┄┄┄┄┄
             │
             ▼
   fluxo SDD: especificação técnica → plano → tarefas → entrega
             │
             ▼
   ┄┄┄┄┄┄┄┄┄ DE VOLTA, DEPOIS DA ENTREGA ┄┄┄┄┄┄┄┄┄
             │
             ▼
 ┌──────────────────────────┐
 │ Curador de memória       │  skill: pg-spec-promote-to-memory
 │ promove os candidatos    │  §11 + marcas "novo — promover" das §3 e §5  (§14)
 └───────────┬──────────────┘
             ▼
   memoria/dominio/* e 00-mapa.md atualizados — insumo da próxima história
```

Um portão, humano. Ele protege o significado do produto e a verificabilidade do que foi escrito. **As skills não o substituem:** `pg-spec-review` produz o relatório que o portão lê e `pg-spec-apply-review` escreve a correção, mas quem aprova são as duas pessoas do §13.3, e quem declara um achado fechado é o revisor da rodada seguinte, nunca quem aplicou.

A primeira linha tracejada é o limite deste guia, e também o limite deste repositório. Da especificação técnica para baixo (plano, tarefas, branch, PR, liberação, reversão) valem o fluxo SDD e a esteira de desenvolvimento, que vivem fora daqui. A especificação não descreve nada disso; ela é a **entrada** desse fluxo, e a única coisa que precisa garantir é que ele não tenha que adivinhar.

A segunda linha tracejada marca o retorno, e o que atravessa nela é **conhecimento, não implementação**: a promoção lê a história entregue, não o que foi construído. Se ela precisar abrir o código para decidir o que promover, a história não estava pronta, e o que se está promovendo é retrato de implementação, que não mora nesta memória (§6.1).

**O ciclo revisão → aplicação → revisão é o coração do refinamento**, e tem uma condição de saúde: o autor não fecha o próprio achado, e a aplicação não decide negócio sozinha. Quando as duas se respeitam, o número de rodadas cai por si, porque cada rodada devolve decisões tomadas, não texto remendado.

A consolidação é opcional e tem janela curta: **só antes do portão, e só enquanto nada foi derivado da história** (§8.4). Passado esse ponto, versão e IDs são lei, e a resposta da skill é a recusa.

E há um caminho que não passa por história nenhuma:

```
   SISTEMA EM OPERAÇÃO (repositórios de backend e de frontend — somente leitura)
      │
      ▼
 ┌──────────────────────────┐
 │ Curador de memória       │  skill: pg-mem-sync
 │ reconcilia a memória     │  a análise inteira acontece antes de qualquer gravação
 └───────────┬──────────────┘
             ▼
   memoria/dominio/* (sete documentos) + 00-mapa.md
```

Ele roda em dois momentos: na partida do projeto, quando o produto já existe e a memória ainda não, e depois periodicamente, quando o sistema andou por fora do fluxo de especificação. O resultado alimenta o **topo** do primeiro diagrama: é da memória reconciliada que `pg-spec-create` puxa vocabulário, perfis, ciclos e regras vigentes, e é por isso que uma rodada de `pg-mem-sync` encurta todas as histórias seguintes.

### 13.2 O que o portão realmente pergunta {#o-que-o-portao-realmente-pergunta}

- **A classe declarada sobrevive aos gatilhos do §9.3?** É a primeira pergunta, porque a classe autoriza todas as dispensas do documento.
- Alguém consegue julgar se um caso novo está dentro ou fora, lendo só a §1 e a §2?
- Todo `REQ` tem `CA` com dado concreto?
- Toda faixa tem fronteira dos dois lados, e preâmbulo com unidade, arredondamento e fuso?
- Todo caminho de exceção tem requisito, mensagem literal e cenário? As cinco linhas da cobertura obrigatória fecham **contra o corpo do documento**?
- O ciclo de vida lista as transições proibidas e marca os estados finais?
- Toda mensagem tem texto literal final?
- As `ENF` cobrem auditoria, acessibilidade e volume?
- Cada relação entre entidades tem cardinalidade declarada?
- Premissas declaram impacto; perguntas têm responsável e prazo?
- Nenhuma pergunta bloqueante em aberto?
- Nada aqui cita endpoint, tabela, coluna, arquivo, código HTTP ou tecnologia?
- Nada aqui decide mecanismo técnico que o fluxo SDD deveria decidir, inclusive a origem de um dado?

### 13.3 Quem revisa, e por quê {#quem-revisa-e-por-que}

**QA aprova.** Não é burocracia: QA é quem converte linguagem imprecisa em critério testável, e esse trabalho precisa acontecer **antes** da implementação, não depois. QA no portão encontra a fronteira que falta e o requisito sem cenário.

**O Líder Técnico aprova sem escrever.** A aprovação dele não é sobre a solução. Ela confirma uma única coisa: **o documento pode ser consumido sem que ninguém precise inventar negócio.** Se ele encontra um ponto onde teria que decidir por conta própria, isso é uma lacuna, não um detalhe a resolver depois.

### 13.4 Rubrica de prontidão {#rubrica-de-prontidao}

Use para autoavaliação antes de pedir revisão e como linguagem comum no portão. Cada dimensão vale de 0 a 10.

**Aprovação: total ≥ 85 e nenhuma dimensão abaixo de 6.** Uma dimensão em 10 não compensa outra em 3, porque as dimensões não são substituíveis.

**Como a severidade do achado vira nota** (`ESP-32`): um achado **grave** leva a dimensão a **6**, aprovável no limite; **dois graves na mesma dimensão** a levam abaixo de 6; **ajuste** não move nota; **bloqueante** reprova independentemente do total. Fazer um grave isolado reprovar equivale a exigir a rodada sem nenhum grave em dez dimensões. Seria um portão que não fecha, e que por isso deixa de proteger.

A rubrica vale para `classe: capacidade` e `classe: regra`. **`classe: texto` é avaliada por checklist de três itens** (redação atual e nova, literais · fronteira escrita do que não muda · aprovador nomeado da redação), com um único aprovador (`ESP-32`). Pontuar dez dimensões numa troca de rótulo é cerimônia que ninguém sustenta, e regra que ninguém sustenta ensina o time a contornar o portão.

| # | Dimensão | 10 pontos significa |
|---|---|---|
| 1 | Problema e sucesso | Contexto permite julgar escopo; métrica com indicador, alvo e prazo |
| 2 | Fronteira de escopo | "Fora do escopo" cobre o que um leitor razoável esperaria dentro, com motivo e destino |
| 3 | Vocabulário | Nenhum sinônimo divergente; termos novos marcados para promoção; entidades em linguagem de negócio |
| 4 | Requisitos | Um comportamento por ID; padrão EARS correto; resposta observável; sem adjetivo |
| 5 | Regras e tabelas | Toda faixa com tabela completa, sem lacuna, com inclusividade, unidade e arredondamento |
| 6 | Ciclo de vida | Transições com perfil; **proibições listadas**; estados finais marcados; delta sobre o canônico |
| 7 | Mensagens | Texto literal final para todos os caminhos, inclusive vazio e erro |
| 8 | Critérios de aceite | Todo `REQ` coberto; dados concretos; fronteiras dos dois lados; uma ação por cenário |
| 9 | Não funcionais | `ENF` com justificativa; auditoria, acessibilidade e volume declarados |
| 10 | Incertezas e referências | Premissas com impacto; zero pergunta bloqueante; referências de memória válidas e sem duplicação |

### 13.5 Sobre granularidade {#sobre-granularidade}

História marcada como `G` deve ser quebrada antes da aprovação. O motivo não é estimativa, é qualidade de especificação: **história grande esconde ambiguidade**, porque nenhuma seção consegue ser exaustiva sobre cinco comportamentos ao mesmo tempo.

**O teto é duro e se confere por contagem** (`ESP-29`): mais de **12 `REQ` ativos** ou mais de **10 `RN` ativas** → a história é `G` e volta para quebra na passada 0, antes da revisão de mérito. Nota justificando o tamanho dentro do próprio documento não é resposta admissível: se bastasse argumentar, o teto não existiria. Os demais sinais valem por julgamento, e qualquer um deles também quebra: dois ciclos de vida diferentes; mais de um perfil com regras substancialmente distintas; uma integração externa somada a uma regra de negócio nova; o "fora do escopo" mais curto que o "dentro do escopo".

**Não confunda granularidade com classe.** `G` é história grande demais para ser especificada bem, e se quebra. `classe: texto` é história pequena, que se escreve inteira em trinta linhas. Quebrar não encurta cerimônia, e classe não substitui quebra: uma capacidade nova declarada como `texto` para caber em menos páginas é o mesmo defeito, na direção oposta.

## 14 Retroalimentação {#retroalimentacao}

Escrever especificação **produz conhecimento durável**, e é isso que quase todo time desperdiça. Cada história descobre um termo, fecha uma regra, resolve uma ambiguidade histórica. Se isso não voltar para a memória, a próxima história redescobre tudo.

O ciclo é: a §11 do `feature.md` já vem com os candidatos, somada às marcas `novo — promover` das §3 e §5; após a entrega, alguém revisa e promove. Quem conduz esse "alguém revisa e promove" é a skill `pg-spec-promote-to-memory` (§8.7). Ela levanta o inventário nas três seções, propõe redação e destino, e pergunta item a item. **O que ela não faz é decidir:** promoção sem resposta explícita é como a memória incha.

| Origem | Vira | Destino |
|---|---|---|
| Termo novo usado consistentemente | Verbete | `memoria/dominio/glossario.md` |
| Regra que se mostrou transversal | Regra corporativa `RC-XXX` | `memoria/dominio/regras-corporativas.md` |
| Ciclo de vida novo ou alterado | Máquina de estado canônica | `memoria/dominio/ciclos-de-vida.md` |
| Conjunto de mensagens consolidado | Entradas no catálogo | `memoria/dominio/catalogo-de-mensagens.md` |
| Perfil ou permissão nova | Entrada de perfil | `memoria/dominio/personas-e-perfis.md` |
| Decisão de negócio com fórum e data | `DN-XXXX` | `memoria/decisoes/` |
| Decisão técnica com alternativas avaliadas | `ADR-XXXX` | `memoria/decisoes/`, promovida pelo fluxo SDD |
| Integração externa nova, ou informação, limite e SLA que se revelaram na história | Entrada de parceiro | `memoria/dominio/integracoes.md` |
| Entidade nova com dado pessoal, ou prazo de retenção decidido | Classificação e retenção | `memoria/dominio/dados-e-retencao.md` |
| **Lacuna que fez a história voltar** | Padrão de lacuna | `memoria/aprendizados/lacunas-de-especificacao.md` |
| **Lacuna que se repetiu 3×** | **Nova regra** | `regras/60-especificacao.md` |
| **Lacuna recorrente por método** | **Ajuste de skill** | `.claude/skills/` |

**O autor propõe a promoção, e quem aprova é o dono do documento de destino.** Promoção automática incha a memória com ruído, e memória inchada é pior que memória pequena, porque ninguém consulta.

Esta tabela cobre o que **a entrega** devolve. O que **já era verdade antes dela** e nunca chegou a ser escrito entra por outro caminho, o `pg-mem-sync` (§8.8 e §6.6), que não substitui a promoção nem é substituído por ela. A promoção registra o delta que a história produziu; a sincronização recupera o domínio que o código guardava calado.

Duas heurísticas para decidir o que promover e o que podar:

- **Regra dos três.** Um fato apareceu em três histórias? Promova para memória. Uma lacuna se repetiu três vezes? Promova para regra ou para passo de skill.
- **Poda trimestral.** Documento de memória que ninguém consultou em um trimestre é candidato a arquivamento. Memória viva é memória usada.

As três últimas linhas da tabela são o motor de melhoria da operação. Sem elas, o time comete os mesmos esquecimentos indefinidamente, e a qualidade da especificação passa a depender de quem escreveu, não do processo.

## 15 Política de leitura {#politica-de-leitura}

Ninguém, pessoa ou assistente, escreve bem tentando absorver o repositório inteiro antes da primeira linha. Cada papel declara seu pacote:

| Papel | Skill | Regras | Memória | Feature |
|---|---|---|---|---|
| Autor de negócio | `pg-spec-create` | `00`, `20`, `60` | `00-mapa`, `dominio/*`, `aprendizados/lacunas-*` | história relacionada, quando houver |
| Revisor de testabilidade (QA) | `pg-spec-review` | `00`, `30`, `60` | `00-mapa`, `dominio/glossario`, `aprendizados/lacunas-*` | `feature.md` |
| Revisor técnico (TL) | nenhuma | `00`, `20`, `60` | `00-mapa`, `dominio/*` | `feature.md` |
| Autor, aplicando a devolução | `pg-spec-apply-review` | `00`, `60` inteiras; `20` e `30` quando um achado as citar | `00-mapa` + só os documentos que os achados nomeiam | `feature.md` inteiro + o relatório mais recente e os achados que os anteriores deixaram abertos |
| Autor, consolidando | `pg-spec-consolidate` | `00`, `60` | nenhuma: a consolidação não toca conteúdo de negócio | `feature.md` inteiro + a pasta da história + as demais histórias, para achar quem cita esta |
| Curador de memória, promovendo | `pg-spec-promote-to-memory` | `00`, `20`, `60` | `00-mapa` por inteiro + o documento de destino, só na seção que recebe a entrada | §11 do `feature.md` + marcas `novo — promover` das §3 e §5 |
| Curador de memória, sincronizando | `pg-mem-sync` | `00`, `60` | `00-mapa` por inteiro + os documentos que entram na rodada | nenhuma (lê o código-fonte de backend e de frontend, somente leitura) |

Três pontos:

- Ninguém aqui carrega retrato de implementação (módulo, esquema de dados, contrato técnico de integração). Não é restrição de acesso. Conhecer a tabela existente é o caminho mais curto para escrever requisito em linguagem de implementação. O que desse mundo tem consequência de negócio já está em `dominio/`, traduzido (§6.1).
- Quem consome o documento adiante carrega a versão **aprovada**, não o rascunho. Trabalhar sobre requisito em movimento produz retrabalho garantido.
- A única exceção ao primeiro destes pontos é `pg-mem-sync` (§8.8), e ela existe justamente para **traduzir**: o curador abre o código para extrair significado de negócio e escrevê-lo em `dominio/`, de onde todo mundo lê depois. Quem escreve ou revisa `feature.md` continua sem carregar retrato de implementação. Se precisou abrir o código para especificar, o que está incompleto é a memória, e a resposta é uma rodada de sincronização, não uma leitura de código dentro da história.

## 16 Estrutura de pastas e matriz de responsabilidade {#estrutura-de-pastas-e-matriz-de-responsabilidade}

```
repositorio/
├── regras/
│   ├── 00-constituicao.md
│   ├── 20-dados-e-seguranca.md
│   ├── 30-testes.md
│   └── 60-especificacao.md
│
├── memoria/                         ← Palácio de Memórias
│   ├── 00-mapa.md
│   ├── dominio/
│   ├── decisoes/
│   └── aprendizados/
│
├── .claude/skills/                  ← método; nada de conhecimento de domínio aqui
│   ├── pg-spec-create/
│   ├── pg-spec-review/
│   ├── pg-spec-apply-review/
│   ├── pg-spec-consolidate/
│   ├── pg-spec-promote-to-memory/
│   └── pg-mem-sync/
│
├── features/
│   ├── US-142-aprovacao-alcada/
│   │   └── feature.md
│   └── US-145-.../
│
└── templates/
    └── template-feature.md
```

**Onde isso mora:** em repositório próprio, dedicado à especificação de requisitos. As quatro camadas vivem aqui; a especificação técnica, o código, os testes executáveis e a esteira de entrega vivem adiante, no fluxo SDD e nos repositórios de produto.

O modelo *spec-anchored* (especificação versionada junto com o que ela especifica) continua sendo o ideal quando há um único produto. Com repositório separado, o acoplamento que ele daria de graça passa a ser responsabilidade explícita de dois mecanismos, e ambos precisam existir: o `id` da história citado em toda entrega do lado do código, e a promoção pós-entrega (§14) trazendo de volta o que a implementação descobriu. Sem os dois, a especificação vira documentação paralela, e documentação paralela envelhece.

### Matriz de responsabilidade {#matriz-de-responsabilidade}

**E** = escreve · **A** = aprova · **L** = lê/consulta

| Artefato | PO/PM | Arq/TL | QA | Curador |
|---|---|---|---|---|
| `memoria/dominio/*` | **E** | L | L | A |
| `memoria/dominio/integracoes.md` | **E** | L (fornece o insumo técnico) | L | A |
| `memoria/decisoes/ADR-*` | L | **E** | L | A |
| `memoria/decisoes/DN-*` | **E** | L | L | A |
| `memoria/aprendizados/lacunas-*` | L | L | **E** | A |
| `regras/60-especificacao.md` | A | A | **E** | não participa |
| `regras/*` (demais) | L | **E** | A | não participa |
| `.claude/skills/pg-spec-create` | **E** | L | A | não participa |
| `.claude/skills/pg-spec-review` | A | A | **E** | não participa |
| `.claude/skills/pg-spec-apply-review` | **E** | L | A | não participa |
| `.claude/skills/pg-spec-consolidate` | **E** | L | L | não participa |
| `.claude/skills/pg-spec-promote-to-memory` | A | A | L | **E** |
| `.claude/skills/pg-mem-sync` | A | L | L | **E** |
| `feature.md` | **E** | A | A | L |
| Promoções para a memória | A | A | A | **E** |

Repare que quem escreve `regras/60-especificacao.md`, as regras sobre como especificar, é o QA. É de propósito: quem sente a consequência da especificação imprecisa é quem melhor sabe formular a obrigação que a previne.

## 17 Adoção incremental {#adocao-incremental}

Se você já tem histórias em formato monolítico, **não reescreva o passado**.

**Fase 1: extrair.** Pegue cinco histórias recentes e liste o que se repete entre elas. Tudo que se repetiu é candidato a memória ou regra. Isso costuma render, sem escrever nada do zero, a primeira versão do glossário, das personas e de metade das regras.

Se o produto **já está em operação**, rode antes uma passada de `pg-mem-sync` (§8.8) sobre os repositórios de backend e de frontend: ela devolve, em linguagem de negócio, o vocabulário, os perfis, os ciclos e as mensagens que hoje só existem no código. É a forma mais barata de sair do zero, e evita que as primeiras histórias gastem a rodada de refinamento redescobrindo o que o sistema já fazia.

**Fase 2: escrever uma de verdade.** Pegue **uma** história com regra de negócio nova e escreva o `feature.md` completo, aplicando a ordem do §11.1 e a rubrica do §13.4 antes de pedir revisão. É aqui que aparecem os pontos em que a técnica definia o negócio sem ninguém perceber, e esse desconforto é o resultado mais valioso do exercício.

**Fase 3: automatizar o barato.** Escreva a skill `pg-spec-review`, começando pela passada 0 (§12.4), a lista mecânica que não depende de julgamento. É o item de melhor relação esforço/retorno de toda a arquitetura: ela protege as invariantes do §12 sem consumir atenção humana, e libera a revisão para a única passada que nenhuma checagem substitui, a da fachada.

**Fase 4: fechar o ciclo.** Só depois que as três primeiras fases estiverem rodando, ative a curadoria e a promoção: `pg-spec-promote-to-memory` (§8.7) depois de cada entrega, e a poda trimestral do §14. Retroalimentação sem base estável espalha bagunça mais rápido.

As duas skills do meio do fluxo, `pg-spec-apply-review` e `pg-spec-consolidate`, não têm fase própria: elas nascem no dia em que a **primeira** história voltar do portão, que é quando o problema que cada uma resolve aparece pela primeira vez. Antes disso, escrevê-las é método sem consequência observada (§8.1).

**Regra de convivência:** histórias antigas continuam no formato antigo; novas nascem no formato novo. Reescrita retroativa de documentação é a forma mais confiável de matar uma iniciativa dessas.

## 18 Modos de falha da especificação {#modos-de-falha-da-especificacao}

Seis coisas que vão dar errado se você não vigiar. As duas primeiras são de arquitetura documental; as quatro últimas são da própria escrita, e são as mais frequentes.

**Memória vira depósito.** Sem curadoria e sem poda, o Palácio de Memórias cresce até ninguém conseguir consultá-lo, e os autores voltam a escrever de cabeça, duplicando domínio em cada história. *Sintoma:* o `00-mapa.md` não é atualizado há dois meses. *Antídoto:* poda trimestral e teto por documento.

**Regras viram wiki.** Alguém começa a escrever explicação e justificativa nas regras. Elas incham e param de ser lidas. *Sintoma:* passou de 400 linhas. *Antídoto:* justificativa vai para `ADR` na memória; a regra fica com o comando.

**Especificação de fachada.** Todas as seções preenchidas, nenhuma decisão tomada: "conforme regra de negócio vigente", "mensagem amigável", "performance adequada". O documento passa no portão porque parece completo. *Sintoma:* revisão que não gera nenhuma pergunta. *Antídoto:* rubrica com piso por dimensão, porque fachada não alcança 6 em concretude nem em fronteira.

**Detalhe no lugar errado.** O documento é longo, mas o detalhe está na descrição da tela e não na regra; está na justificativa e não na fronteira. *Sintoma:* 400 linhas e nenhuma tabela de decisão. *Antídoto:* a ordem de preenchimento do §11.1, com regras e ciclo de vida antes dos requisitos.

**A especificação vira desenho de solução.** O documento começa a nomear componente, estrutura de dados, contrato e mecanismo. Além de invadir a decisão de quem constrói, ele fecha o espaço de solução antes de a regra estar clara e envelhece no primeiro refactor. *Sintoma:* uma seção que só é verificável abrindo o código. *Antídoto:* a linha de observabilidade do §10, aplicada item a item.

**A especificação vira plano de entrega.** O documento começa a explicar como se nomeia a branch, em que ordem rodam as migrações, qual o passo a passo do rollback, qual comando executa o teste. Nada disso é errado em si. Está no arquivo errado, e agora existe em dois lugares que vão divergir. O efeito colateral é duplo: a esteira ganha uma segunda versão de si mesma sem dono, e o autor da especificação passa a ser cobrado por decisões que não são dele. *Sintoma:* uma seção que poderia ser copiada, sem uma alteração sequer, para qualquer outra história. *Antídoto:* o teste de fronteira do §1.1.

## Kit que acompanha este guia {#kit-que-acompanha-este-guia}

| Arquivo | Dono | Uso |
|---|---|---|
| `template-feature.md` | PO/PM | Especificação de negócio, por história |
| `regras/60-especificacao.md` | QA | O que é obrigatório em toda especificação |
| `.claude/skills/pg-spec-create` | PO/PM | Método de escrita: triagem, classe, roteiro, ordem |
| `.claude/skills/pg-spec-review` | QA | Portão: passada 0 mecânica, suficiência, fronteira, fachada |
| `.claude/skills/pg-spec-apply-review` | PO/PM | Devolução: aplica o que o achado determina, pergunta o que é decisão de negócio |
| `.claude/skills/pg-spec-consolidate` | PO/PM | Volta à v1.0 antes do portão, enquanto não há consumidor a jusante |
| `.claude/skills/pg-spec-promote-to-memory` | Curador | Fecha o ciclo do §14: candidatos da história viram memória, item a item |
| `.claude/skills/pg-mem-sync` | Curador | Lê o sistema em operação e reconcilia os sete documentos de `memoria/dominio/` |
| `memoria/00-mapa.md` | Curador | Porta de entrada de todo conhecimento durável |

## Apêndice: cartão de bolso {#apendice-cartao-de-bolso}

**Antes de declarar qualquer especificação pronta, seis perguntas:**

1. **Suposição zero:** sobrou algum ponto em que alguém teria que decidir por conta própria?
2. **Fronteira:** toda faixa diz o que acontece *no* limite, não só acima e abaixo dele?
3. **Caminho infeliz:** cada exceção tem requisito, mensagem literal e cenário? Os cinco casos da cobertura obrigatória estão fechados: vazio, próprio autor, repetição, externo, dado legado?
4. **Um lar:** nada foi copiado da memória ou das regras em vez de referenciado?
5. **Cadeia fechada:** todo `REQ` tem `RN`, `MSG` quando exibe texto, e `CA` com dado concreto?
6. **Classe honesta:** a classe declarada sobrevive aos gatilhos? Toda seção ausente tem motivo escrito?

**E a pergunta que resume o guia:**

> Se ninguém puder me perguntar nada, o que será construído é o que eu quis dizer?
