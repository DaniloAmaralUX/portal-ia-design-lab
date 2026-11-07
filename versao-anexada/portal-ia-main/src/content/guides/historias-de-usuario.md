## 1 Escopo deste guia {#escopo-deste-guia}

Este guia trata de **uma atividade**: transformar demanda bruta em **histórias de usuário prontas para backlog**, no formato definido por `template-user-story.md`, com o apoio das skills `/pg-us-create` e `/pg-us-review`.

Ele existe porque a história de usuário mudou de função. Antes ela era um lembrete de conversa: uma frase que o time completava na sala de refinamento, com todo mundo presente e a memória fresca. Hoje ela é lida por quem não estava na reunião, é insumo de estimativa, é base de teste e é a **entrada do fluxo SDD**, que propõe o desenho técnico a partir do que estiver escrito. **O que a história não disser, alguém sem contexto de negócio vai decidir, em outro momento e sem registro.**

**Está no escopo:**

- que matéria-prima produz uma boa história e como fornecê-la ao agente;
- como a demanda se quebra em histórias, e quem aprova a quebra;
- o que entra em cada seção do `template-user-story.md`, e o que não entra;
- como a rodada de dúvidas fecha os pontos em aberto sem que o agente decida no lugar do negócio;
- como o PO revisa a própria história antes de liberá-la.

**Não está no escopo** a especificação técnica, que pertence ao fluxo SDD: componente, contrato de interface, modelo de dados, biblioteca, endpoint, tabela. A história diz o que precisa ser verdade para o negócio e como se verifica; o fluxo SDD decide como aquilo é construído.

A matéria-prima da história tem guia próprio, [Artefatos de entrada](/metodo/artefatos-de-entrada): o que coletar, como recortar e em que formato entregar ao agente. Este guia começa **depois** da coleta: a demanda já está na mão e precisa virar backlog.

> **Premissa de trabalho:** a história de usuário é o último lugar onde uma ambiguidade custa apenas uma pergunta. Depois dela, ambiguidade custa retrabalho. Em homologação, custa credibilidade.

## 2 O produto do trabalho {#o-produto-do-trabalho}

Por história, **um arquivo**:

```
user-stories/US-149-graficos-evolucao-contratos-ativos-uc/
└── user_story.md      ← PO/PM — o que o usuário passa a conseguir fazer, sob que regras
```

|  | `user_story.md` |
|---|---|
| **Dono** | PO/PM |
| **Responde** | O que o usuário passa a conseguir fazer, sob que regras, com que mensagens, e como se verifica |
| **Formato** | `template-user-story.md`, na raiz do repositório |
| **Identificadores** | nenhum: sem siglas de regra (`RN01`), sem front matter |
| **Portão** | a **revisão do próprio PO**, conduzida com a skill `/pg-us-review`, antes de o PO liberar a história para o time e para o fluxo SDD |
| **Autossuficiência** | total: o arquivo tem de valer sozinho em qualquer backlog |

Convenções de nome e local:

- pasta `user-stories/US-XXX-<slug>/`, com `US-XXX` em três dígitos e `<slug>` em kebab-case derivado do título;
- o arquivo é sempre `user_story.md`;
- **uma pasta por história.** Demanda que gerou quatro histórias produz quatro pastas;
- o número é o que o autor indicar; se ele não indicar, o próximo livre em `user-stories/`;
- **a história mora só em `user-stories/`.** Nenhuma outra pasta do repositório recebe esse arquivo.

## 3 Quem consome a história e o portão que ela atravessa {#quem-consome-a-historia-e-o-portao-que-ela-atravessa}

### 3.1 Quatro leitores, quatro usos {#quatro-leitores-quatro-usos}

A história é escrita uma vez e lida por quatro públicos, e cada um tira dela uma coisa diferente. É isso que define quanto detalhe ela precisa ter.

| Quem lê | O que extrai | O que acontece se estiver pobre |
|---|---|---|
| **O time, no refinamento** | o tamanho da entrega e o que ela envolve | estimativa feita sobre suposição, corrigida no meio da sprint |
| **QA** | o que precisa ser provado, e com que dado | teste do caminho feliz; o defeito nasce onde não há cenário |
| **UX/UI** | campos, ações, estados e o que o usuário vê em cada um | tela desenhada para o fluxo principal, cega aos estados de vazio, erro e limite |
| **O fluxo SDD** | as regras, os valores e o comportamento observável que a implementação tem de cumprir | o fluxo decide sozinho o que a história não disse, e decide sem contexto de negócio |

O último leitor é o que mais pesa na escrita, porque é o menos capaz de perceber que está supondo. Uma pessoa que encontra uma lacuna pergunta na daily. Um fluxo automatizado encontra a mesma lacuna e a preenche com a alternativa mais provável, em silêncio. O resultado é um comportamento que ninguém pediu e que passa despercebido até a homologação.

Daí o padrão de suficiência deste guia:

> **A história está pronta quando ninguém precisa decidir negócio para construí-la.** Todo ponto que exigir decisão de negócio depois dela é uma decisão tomada por quem tem menos contexto.

### 3.2 O portão: a revisão do próprio PO {#o-portao-a-revisao-do-proprio-po}

A história **passa por revisão** antes de ser liberada, e quem revisa é o próprio autor.

Não há aqui comitê de aprovação nem rubrica de nota. O portão é o PO relendo a própria história com a lista de dúvidas na mão. A skill `/pg-us-review` conduz a rodada item a item, mostra as opções e as consequências e escreve no documento o que o PO decidir.

O que o portão exige, na prática:

- **as premissas foram lidas e aceitas**, porque é nelas que o agente declara o que assumiu sem confirmação;
- **as dúvidas foram enfrentadas uma a uma**, e cada uma saiu com resposta ou com responsável e prazo;
- **nada foi fechado por suposição**, nem do agente nem do autor com pressa;
- **o que ficou aberto está visível**, e o que fica bloqueado por isso está dito.

História liberada com dúvida escondida não fica parada. Ela segue e vira decisão de outra pessoa. Por isso o portão não é burocracia. É o último momento em que uma ambiguidade custa apenas uma pergunta.

## 4 Princípios da escrita de histórias com agentes de IA {#principios-da-escrita-de-historias-com-agentes-de-ia}

### 4.1 A história vale sozinha {#a-historia-vale-sozinha}

Nada dentro do `user_story.md` aponta para fora dele. Sem identificador de memória (`RC-XXX`, `MSG-XXX`, `DN-XXXX`), sem caminho de arquivo, sem âncora, sem menção a `memoria/`, `regras/` ou a este repositório. Isso vale também entre parênteses, em nota de rodapé, em *Premissas adotadas* e em *Pontos de Atenção para Desenvolvimento/QA*.

Regra, definição e mensagem aparecem **escritas com todas as palavras necessárias para se sustentarem**.

> Errado: *"O limite de aprovação segue a alçada vigente do perfil aprovador (RC-014)."* Certo: *"O supervisor aprova solicitações de até R$ 5.000; acima desse valor, a aprovação é do gerente."*

O teste é direto: **entregue a história a alguém de fora do projeto.** Se essa pessoa precisar perguntar o que significa alguma sigla ou onde encontrar algum documento, a história ainda não está pronta.

### 4.2 A memória entra como conhecimento, nunca como citação {#a-memoria-entra-como-conhecimento-nunca-como-citacao}

A memória do projeto (`memoria/`) é a fonte do que **já é verdade** sobre o negócio: vocabulário, perfis, regras corporativas, ciclos de vida, mensagens praticadas, integrações, classificação de dados. Consultá-la antes de escrever é obrigatório. História que inventa termo, perfil ou regra que já tem dono na memória entra no backlog contradizendo o sistema em operação, e a contradição só aparece em homologação.

E citá-la dentro do arquivo é proibido, pelo motivo do princípio anterior. A rastreabilidade, que é útil, fica **no chat**: ao entregar as histórias, o agente diz de onde veio cada regra. O arquivo continua limpo.

Uma ressalva que o autor precisa carregar: **a memória só vale enquanto reflete o sistema em operação.** Documento vencido é lido com a mesma confiança de um atualizado, e a história que o reescreve por extenso entra no backlog contradizendo a produção sem que nada no texto denuncie isso. Quem mantém os documentos de `memoria/dominio/` a partir da leitura do código é a skill `/pg-mem-sync`, descrita na [§8](#pg-mem-sync-a-memoria-que-a-historia-consulta). Ela roda **fora** do ciclo da história.

### 4.3 Termo canônico, sempre {#termo-canonico-sempre}

O glossário do projeto existe para que a mesma coisa tenha um nome só. Se o negócio chama de "unidade concedente", a história não escreve "empresa parceira" porque soou melhor. Sinônimo em documento de requisito não é elegância de escrita: é a origem da pergunta *"isso é a mesma coisa?"* três semanas depois, dentro da sprint.

Se o termo canônico for pouco óbvio para quem lê de fora, **defina-o em uma linha dentro da própria história**, em vez de apontar para onde ele está definido.

### 4.4 Toda suposição é declarada: premissa ou dúvida {#toda-suposicao-e-declarada-premissa-ou-duvida}

Informação que falta na demanda tem exatamente dois destinos legítimos:

- **Premissa adotada**: o que o autor assumiu para conseguir escrever, e que vale até alguém contestar;
- **Dúvida para refinamento**: o que precisa de resposta de outra pessoa antes de virar comportamento.

O que não existe é o terceiro caminho: preencher a lacuna com o palpite plausível e seguir. Palpite plausível escrito em regra de negócio não se distingue de decisão tomada, e todos os que vierem depois o leem como decisão. **Silêncio sobre o que foi suposto é o defeito mais caro do processo.**

### 4.5 Quem decide é o negócio; quem escreve é o agente {#quem-decide-e-o-negocio-quem-escreve-e-o-agente}

Este princípio governa a rodada de dúvidas, e é o que separa um refinamento útil de uma ficção consistente. Um agente é excelente em produzir a resposta mais provável, e é por isso mesmo que ele não pode fechar uma dúvida escolhendo "o que faz mais sentido".

> Fechar um item por conta própria não resolve a dúvida: **troca uma lacuna visível por uma regra invisível, que ninguém autorizou.** Se foi preciso escolher um valor, um limite, um desfecho ou um significado, aquilo era uma pergunta.

O corolário para o autor humano: **leia as premissas antes dos critérios de aceite.** É na seção de premissas que o agente declara o que assumiu, e é justamente o trecho que os leitores apressados pulam.

### 4.6 Uma responsabilidade funcional, uma história {#uma-responsabilidade-funcional-uma-historia}

Demanda quase nunca é uma história só. Consulta, filtros, exportação, impressão, permissão, notificação e auditoria aparecem na mesma reunião e são entregas diferentes, com testes diferentes e riscos diferentes.

História grande esconde ambiguidade. Nenhum rigor de escrita compensa isso, só a quebra. O agente propõe a quebra e o **autor aprova**, com as opções na mesa. É decisão de produto, não de formatação.

### 4.7 Comportamento observável, testável, sem ambiguidade {#comportamento-observavel-testavel-sem-ambiguidade}

A história descreve **o que o sistema faz e o que o usuário vê**, e não como aquilo é construído. O critério de qualidade é o do teste: se dois leitores podem discordar sobre se o resultado foi atingido, a frase ainda não está pronta.

Isso derruba, por padrão, os advérbios de conforto: "rapidamente", "de forma amigável", "adequadamente", "quando necessário". Cada um deles é uma pergunta que não foi feita.

A história admite falar de tela, campo, estado e cuidado de implementação. As seções *Observações para UX/UI* e *Pontos de Atenção para Desenvolvimento/QA* existem para isso. O que fica fora é a **especificação técnica**: contrato de interface, modelo de dados, nome de componente, assinatura de método, biblioteca, endpoint, tabela. A fronteira útil: *dizer o que precisa ser observado para não errar* é ponto de atenção; *decidir como construir* é trabalho do fluxo SDD, e antecipá-lo aqui fecha a discussão antes de ela acontecer.

### 4.8 Detalhe não é excesso: é o que impede a decisão silenciosa {#detalhe-nao-e-excesso-e-o-que-impede-a-decisao-silenciosa}

Existe uma resistência natural a histórias longas, e ela é legítima quando a extensão vem de repetição e enfeite. Mas quando ela vem de **campo a campo, ação a ação, mensagem a mensagem**, o detalhe não custa: economiza. Cada campo não descrito é uma decisão que alguém tomará sem contexto de negócio, sozinho, e sem registrar.

O calibre esperado é o de histórias como *filtrar consulta*, *listar resultados em grid*, *exportar consulta* e *imprimir consulta*: cada campo nomeado, cada ação com seu resultado, cada mensagem com seu texto literal.

### 4.9 Melhore a demanda, não a transcreva {#melhore-a-demanda-nao-a-transcreva}

O agente não é um formatador. Quando recebe linguagem informal, devolve requisito profissional: consolida regra repetida, remove redundância, detecta funcionalidade citada de passagem, infere a intenção quando ela está clara no contexto e aponta o que ficou ambíguo.

A saída tem de ser **mais completa, mais testável e mais compreensível** do que a demanda que chegou. Se não for, o passo não agregou nada.

## 5 As skills e o ciclo de vida da história {#as-duas-skills-e-o-ciclo-de-vida-da-historia}

As skills são **método, não conhecimento de domínio**: elas dizem como trabalhar, e buscam na memória o que é verdade sobre o negócio. Duas atendem a história de usuário, uma na escrita e outra no portão, e cada uma tem um recorte estreito e deliberado. Uma terceira, `/pg-mem-sync`, não toca em história nenhuma: ela mantém a memória que as outras duas consultam.

|  | `/pg-us-create` | `/pg-us-review` | `/pg-mem-sync` |
|---|---|---|---|
| **Entrada** | demanda bruta: transcrição, e-mail, workshop, ticket, descrição de tela | um `user_story.md` já escrito | os diretórios de código do sistema em operação, de backend e de frontend |
| **Produz** | uma ou mais histórias novas em `user-stories/` | a **mesma** história, evoluída | os sete documentos de `memoria/dominio/`, criados ou reconciliados |
| **Pauta** | tudo que a demanda carregar | **somente** a seção *Dúvidas e Pontos para Refinamento* | os documentos que a rodada escolher, lidos sobre o sistema todo |
| **Interação** | propõe a quebra e pede aprovação | pergunta item a item, uma decisão por pergunta | pergunta onde está o código e o que entra na rodada; pede aprovação documento por documento |
| **Papel no ciclo** | a escrita | o portão: a revisão do PO sobre a própria história | fora do ciclo: mantém a memória que as outras duas consultam |
| **Não faz** | não revisa documento pronto | não audita a história; não abre achado fora da lista; não emite relatório | não escreve, não revisa e não abre história; não grava em `user-stories/`; não escreve código |

### A skill que não escreve história: `/pg-mem-sync` {#a-skill-que-nao-escreve-historia-pg-mem-sync}

A qualidade do que a escrita encontra na memória é a qualidade da memória. Quem a mantém é `/pg-mem-sync`, que lê o **sistema em operação** e devolve, em linguagem de negócio, os sete documentos de `memoria/dominio/`: glossário, personas e perfis, ciclos de vida, regras corporativas, integrações, catálogo de mensagens, e dados e retenção.

Ela roda **fora do ciclo da história**, sob demanda, e não toca em nada de `user-stories/`: não escreve, não revisa e não abre história, não numera nada e não decide escopo de entrega. Também não escreve código, porque abre os repositórios de produto somente para leitura. Na direção contrária, nenhuma skill de história grava em `memoria/`, em nenhuma hipótese.

O que o autor de histórias precisa saber sobre ela está na [§8](#pg-mem-sync-a-memoria-que-a-historia-consulta): as duas perguntas que ela faz antes de ler, por que a análise inteira acontece antes de qualquer gravação, como ela reconcilia documento curado em vez de sobrescrevê-lo, e quando rodar.

### O ciclo {#o-ciclo}

```
código do sistema em operação
     │
     ▼
/pg-mem-sync ──► memória de domínio atualizada ──┐   fora do ciclo da história,
                                                 │   roda sob demanda
demanda bruta                                    │   consultada como conhecimento,
     │                                           │   nunca citada dentro do arquivo
     ▼                                           │
/pg-us-create ◄──────────────────────────────────┘
     │
     ▼
aprovação da quebra ──► user_story.md (v0, com premissas e dúvidas)
     │
     ▼
leitura do autor: as premissas estão certas? as dúvidas são as certas?
     │
     ▼
/pg-us-review ──► rodada de perguntas ──► história evoluída, dúvidas fechadas
     │        (o portão)                            e dúvidas novas registradas
     ▼
(repete a rodada enquanto houver dúvida que valha perguntar)
     │
     ▼
história liberada ──► refinamento com o time ──► fluxo SDD
```

Três observações sobre o ciclo:

- **A rodada de dúvidas roda mais de uma vez, de propósito.** Decisão fechada abre pergunta nova, e a pergunta nova é resultado legítimo do refinamento, não sobra. A skill registra essas perguntas e **não** as pergunta na mesma rodada: rodada que se estende sozinha nunca termina.
- **Sair com a seção de dúvidas vazia é resultado possível.** Inventar dúvida para não entregar seção vazia é defeito, do mesmo tamanho que apagar dúvida sem resposta.
- **A escrita não substitui a leitura humana.** O agente é um segundo leitor da demanda: bom em achar o que passou batido, incapaz de saber o que o negócio quer. O autor continua sendo o dono.

## 6 `/pg-us-create`: da demanda bruta às histórias {#pg-us-create-da-demanda-bruta-as-historias}

**Papel que a skill assume:** especialista sênior em levantamento de requisitos, discovery e product ownership. **Produz:** uma ou mais histórias completas, salvas em `user-stories/US-XXX-<slug>/user_story.md`.

### 6.1 O que entregar como entrada {#o-que-entregar-como-entrada}

Serve qualquer forma de demanda: transcrição de reunião de discovery, conversa entre negócio e tecnologia, workshop, áudio transcrito, passo a passo funcional, regra explicada informalmente, e-mail, ticket, print ou descrição de tela. **Entrada desorganizada, informal ou incompleta não impede a escrita.** Falta de detalhe menor vira premissa ou dúvida, não bloqueio.

O que faz diferença no resultado, e que o guia de artefatos de entrada detalha:

- **recorte, não resuma.** A exceção citada de passagem é o melhor critério de aceite da história, e é a primeira coisa que um resumo elimina;
- **enquadre a fonte bruta**: contexto, origem, o que já existe hoje, objetivo do negócio;
- **diga o que já existe.** Demanda sem a regra ou a história atual relacionada é a principal fábrica de backlog contraditório;
- **diga o que você não sabe.** "Não sei o motivo do pedido" leva o agente a perguntar em vez de presumir uma justificativa plausível e errada.

### 6.2 O roteiro de análise {#o-roteiro-de-analise}

Antes de escrever a primeira linha, a skill percorre a demanda inteira nesta ordem, e o autor pode cobrar cada passo na entrega:

1. interpretar todo o contexto, nunca um trecho isolado;
2. identificar as funcionalidades, inclusive as citadas de passagem;
3. identificar as regras de negócio explícitas **e** implícitas;
4. identificar as validações: obrigatoriedade, formato, limite, bloqueio;
5. identificar fluxos principais e alternativos;
6. identificar perfis de usuário envolvidos;
7. identificar dependências e integrações;
8. identificar dúvidas, lacunas e ambiguidades;
9. separar as funcionalidades em histórias individuais;
10. escrever os critérios de aceite completos de cada história.

Em paralelo, a skill converte linguagem informal em requisito profissional, consolida regra repetida, detecta funcionalidade oculta e requisito não funcional mencionado, e aponta necessidade de auditoria, rastreabilidade, segurança e impacto de UX/UI.

### 6.3 A consulta à memória {#a-consulta-a-memoria}

A skill lê **`memoria/00-mapa.md` por inteiro**. É o índice, e documento que não está no mapa não existe para efeito de consulta. A partir dele, abre **apenas** os documentos de `memoria/dominio/` que a demanda tocar, pela âncora indicada.

| Ao escrever | A skill consulta |
|---|---|
| título, história e texto em geral | glossário, para usar o termo canônico e não um sinônimo |
| personas, permissões, o que cada perfil pode fazer | personas e perfis |
| Regras de Negócio | regras corporativas: alçadas, SLAs, políticas que atravessam funcionalidades |
| fluxos de status e transições | ciclos de vida |
| Mensagens do Sistema | catálogo de mensagens: o **texto** da mensagem já praticada vem antes de uma nova |
| dependências e integrações | integrações: o que cada parceiro fornece e recebe, disponibilidade e limites |
| dados sensíveis, retenção, LGPD | dados e retenção |

O status do mapa é lei: `ativo` é fonte confiável; `esqueleto` é fonte com ressalva, **e a ressalva vira premissa ou dúvida na história**; `pendente` não existe ainda e não é fonte de nada.

Documento em `esqueleto` ou `pendente` justamente no assunto que a demanda toca deixa duas saídas, e a escolha é do autor: escrever a história assumindo o mínimo, com a premissa e a pergunta declaradas, ou **rodar `/pg-mem-sync` antes** ([§8](#pg-mem-sync-a-memoria-que-a-historia-consulta)) e escrever sobre memória coberta. O que a escrita não faz, em nenhuma hipótese, é fechar a lacuna gravando em `memoria/`.

Duas situações merecem atenção do autor, porque são onde a memória e a demanda se encontram:

- **Divergência não se resolve em silêncio.** Quando a demanda contradiz o que hoje é praticado, a contradição vai para *Dúvidas e Pontos para Refinamento*, em termos de negócio (o que a demanda pede, o que hoje acontece), sem mencionar o documento de origem;
- **Lacuna na memória vira dúvida, não invenção.** Termo, perfil ou regra de que a história precisa e que a memória não tem: a skill assume o mínimo necessário, registra em *Premissas adotadas* e abre a pergunta.

### 6.4 A quebra em histórias {#a-quebra-em-historias}

A skill separa a demanda por responsabilidade funcional e usa esta lista como gatilho de reconhecimento. Cada item dela que aparecer na demanda tende a ser uma história própria:

> login · cadastro · consulta · filtros · paginação · exportação · impressão · dashboard · aprovação · fluxo de status · upload de arquivos · integrações · auditoria · notificações · permissões · relatórios · busca · ordenação · configurações · logs · regras administrativas · workflow · alertas · validações · regras específicas de negócio

**A skill propõe a quebra, explica o recorte e pede a aprovação do autor, com opções.** É o momento mais barato de corrigir o recorte do backlog: uma história a mais aqui custa um parágrafo; uma história a menos custa uma sprint descobrindo, no meio da implementação, que ali havia duas.

### 6.5 A saída {#a-saida}

Cada história vira uma pasta em `user-stories/`, com o `user_story.md` preenchido a partir do template: os blocos de orientação `<!-- ... -->` apagados, todas as seções presentes, nenhuma sigla, nenhum identificador de memória.

Na resposta ao autor, a skill lista as histórias criadas com o caminho de cada arquivo, **destaca as premissas e as dúvidas** e diz, quando ajudar, de onde veio cada regra. Ela não repete o conteúdo dos arquivos no chat: a entrega é o arquivo.

## 7 `/pg-us-review`: a rodada de dúvidas {#pg-us-review-a-rodada-de-duvidas}

**Papel que a skill assume:** especialista sênior conduzindo a rodada de dúvidas. **Produz:** o mesmo `user_story.md`, evoluído. **É o portão:** a revisão que o PO faz da própria história, com a skill conduzindo a conversa e escrevendo o que o PO decidir.

### 7.1 O recorte e por que ele é estreito de propósito {#o-recorte-e-por-que-ele-e-estreito-de-proposito}

> **O escopo desta skill é a seção *Dúvidas e Pontos para Refinamento*, e nada além dela.**

Ela pergunta o que a história já declarou em aberto, escreve as respostas no documento e registra as dúvidas novas que as respostas criarem. Ela **não** audita o documento, **não** procura lacuna que ninguém registrou, **não** avalia cobertura de cenários e **não** emite relatório.

O recorte não é preguiça: é o que mantém a rodada executável. Auditoria embutida transforma uma conversa de dez minutos numa devolutiva que o autor não pediu, e ninguém lê devolutiva longa. Se, ao ler, a skill notar algo grave fora da pauta, ela **diz no chat** e oferece registrar como dúvida; não corrige por conta própria.

### 7.2 Quando não rodar {#quando-nao-rodar}

- **a seção de dúvidas está vazia**: a skill diz isso e para. Vasculhar o documento atrás de pergunta para justificar a execução não é o serviço;
- **a história já foi implementada e o pedido é ajustar o texto ao que foi construído**: história que se ajusta ao código deixa de ser combinado e vira ata. O caminho é uma história nova de mudança.

Refinar história que já foi liberada é legítimo, **desde que avisado**: quem já consumiu a versão anterior (o time, o QA, o fluxo SDD) precisa saber que ela mudou.

### 7.3 A forma da pergunta {#a-forma-da-pergunta}

A skill lista todos os itens em aberto, numerados, **antes** da primeira pergunta. O autor decide melhor vendo o conjunto, e muitas vezes dois itens são o mesmo buraco visto de dois lugares.

Item que a própria história já responde, com todas as letras, não vira pergunta: a skill mostra o trecho que responde e o trata como respondido. Vale só quando o trecho responde **inteiro**. Se foi preciso juntar duas frases e concluir uma terceira, é pergunta.

Depois, **uma decisão por pergunta**. Cada pergunta carrega:

1. **o ponto e por que importa**, em uma linha, para o autor não precisar reler a história;
2. **as opções que a história admite**, cada uma com a consequência: o que passa a estar escrito, em que seções, quantos cenários mudam;
3. **o texto que entraria**, quando couber. Perguntar "qual regra vale?" sem mostrar as redações é pedir decisão em branco. Para texto exibido ao usuário, a opção **é** o texto literal;
4. **uma recomendação**, quando houver, porque refinamento é consultoria, não formulário. Recomendação é sugestão declarada, nunca escolha antecipada;
5. sempre a saída honesta: **"manter em aberto"**.

Regras da rodada que o autor deve reconhecer:

- **A vizinhança se fecha na mesma pergunta.** Decisão parcial custa uma rodada inteira para fazer a segunda metade da mesma pergunta: fronteira pede os três lados (antes, no limite, depois); critério que depende de causa pede as outras causas já citadas; estado novo pede de onde se entra e para onde se sai; mensagem nova pede os estados irmãos da tela.
- **"Manter em aberto" tem destino escrito, não silêncio:** o item continua na seção de dúvidas, agora com responsável nominal e prazo, e a skill diz o que fica bloqueado enquanto ele estiver aberto.
- **Resposta que não escolhe nenhuma das opções é uma decisão nova.** A skill a registra como veio, confirma o entendimento em uma frase e só então a aplica. Ler "acho que o primeiro faz mais sentido" como escolha é decidir negócio por inferência.
- **Divergência com o que o sistema pratica hoje vai declarada na pergunta**, em termos de negócio.
- **A skill não escreve nada antes de a rodada terminar**, porque uma resposta muda o que outra deve dizer.

### 7.4 Onde a decisão pousa {#onde-a-decisao-pousa}

Este é o passo que se esquece: **cada decisão pousa em mais de um lugar.**

| A decisão define | Pousa em |
|---|---|
| critério, limite, prazo, condição ou perfil | **Regras de Negócio**: bullet em texto corrido, por extenso, sem sigla |
| obrigatoriedade, formato, limite de campo, bloqueio | **Validações** |
| o que o sistema exibe | **Mensagens do Sistema**: texto literal entre aspas, com o momento em que aparece |
| qualquer comportamento observável | **Critérios de Aceite**: ao menos um cenário, mais os casos-limite que a decisão criou |
| tela, layout, estado da interface | **Observações para UX/UI** |
| consequência de implementação ou teste | **Pontos de Atenção para Desenvolvimento/QA** |

E o inverso, que é metade do trabalho:

- **Dúvida respondida sai da seção de dúvidas.** Item respondido que continua listado faz o leitor seguinte reabrir discussão fechada.
- **Premissa que a resposta contradiz é corrigida**, e a correção se propaga. Premissa que a resposta confirma vira regra de negócio afirmada. Fora esses dois casos, a skill não toca na seção de premissas, que não é pauta desta rodada.
- **Cenário existente que a decisão contradiz é reescrito, não acrescentado.** Dois cenários que dizem coisas opostas não são cobertura: são um defeito com duas testemunhas.
- **A propagação é por busca, não por lembrança.** Para cada valor, prazo, texto de mensagem, título de tela ou termo alterado, a skill busca todas as ocorrências na história e trata uma a uma. Número repetido em seis lugares e corrigido em cinco fica pior do que estava: o lugar esquecido vira a regra que quem implementa lê primeiro.

### 7.5 As dúvidas que a própria rodada cria {#as-duvidas-que-a-propria-rodada-cria}

Decisão fechada abre pergunta nova. Ao escrever cada resposta, a skill registra na seção de dúvidas o que a decisão deixou indefinido:

- o caso que a nova regra não cobre: a exceção, o perfil de fora, o estado que ela não menciona;
- a consequência que depende de terceiro (cliente, jurídico, área técnica, priorização);
- a outra história que a decisão afeta e que precisa ser revista.

A skill escreve cada uma como **pergunta fechável**, em termos de negócio, com responsável nominal e prazo quando houver. Ela não pergunta nenhuma delas na mesma rodada: todas entram na lista da próxima execução.

### 7.6 O que o autor recebe de volta {#o-que-o-autor-recebe-de-volta}

Na resposta, a skill entrega: o que foi decidido (uma linha por decisão, com a escolha e **onde ela pousou**); o que a própria história já respondia, com o trecho mostrado; o que continua aberto, com responsável, prazo e o que fica bloqueado; as dúvidas novas e de que decisão cada uma nasceu; e de onde veio cada regra, quando a memória sustentou a redação.

Se o autor quiser o histórico gravado, a skill escreve `user-stories/US-XXX-<slug>/decisoes-refinamento.md` (data, pergunta, escolha, motivo, seções alteradas) e mantém a história limpa. Sem pedido, o rastro é o chat.

## 8 `/pg-mem-sync`: a memória que a história consulta {#pg-mem-sync-a-memoria-que-a-historia-consulta}

**Papel que a skill assume:** curador de memória de domínio, o analista que lê o sistema em operação e devolve, em linguagem de negócio, o conhecimento que hoje só existe no código. **Produz:** os sete documentos de `memoria/dominio/`, criados se ainda não existirem e **reconciliados** se já existirem.

Esta é a skill que não escreve história, e ela está neste guia por dois motivos. O primeiro é que a qualidade do que a escrita encontra na memória **é** a qualidade da memória: assunto coberto troca premissa declarada por fato consultado. O segundo é que quem descobre a lacuna, em geral, é o autor de histórias. É na rodada de dúvidas que ele percebe que o sistema pratica algo que não está escrito em lugar nenhum.

### 8.1 O recorte: sete documentos, uma pergunta cada {#o-recorte-sete-documentos-uma-pergunta-cada}

| Documento | Responde | O que a história tira dele |
|---|---|---|
| glossário | o que cada informação tratada pelo sistema significa para o negócio | o termo canônico, e a definição de uma linha quando ele é pouco óbvio |
| personas e perfis | quem usa o sistema, com que objetivo, e o que cada um pode fazer | perfis, permissões e alcance de dados, que são regra de negócio e não detalhe de tela |
| ciclos de vida | por quais situações cada registro passa, e o que provoca cada transição | o nome de cada situação e as transições que os cenários exercitam |
| regras corporativas | que regras atravessam funcionalidades: alçadas, SLAs, políticas, limites | o valor, o prazo e a alçada que a regra da história reescreve por extenso |
| integrações | com quem o produto se integra, que informação vai e vem, sob que limites | dependências, e o comportamento sob falha de terceiro |
| catálogo de mensagens | que mensagens o sistema exibe, e onde cada uma aparece | o **texto literal** já praticado, que vem antes de uma mensagem nova |
| dados e retenção | que dado cada entidade guarda, onde ele fica e por quanto tempo | dado sensível, retenção e o que a LGPD exige da funcionalidade |

**Um lar por fato.** A leitura do código revela, de uma vez, matéria dos sete documentos, e cada achado vai para o seu dono: regra transversal nas regras, transição nos ciclos, texto exibido no catálogo. Achado que pertence a documento fora da rodada volta como candidato no relato final. A skill não o grava por antecipação nem o guarda no documento vizinho "por enquanto".

Três fronteiras que o autor pode cobrar:

- **Ela não escreve, não revisa e não abre história.** Não grava nada em `user-stories/`, não numera nada e não decide escopo de entrega.
- **Ela lê código; ela não escreve código.** Abre os repositórios de produto **somente para leitura** e não cria, não altera nem move nenhum arquivo fora deste repositório.
- **Retrato de implementação não entra em nenhum dos sete.** Camada, módulo, arquitetura, contrato técnico, ambiente, flag e stack pertencem ao fluxo SDD. A única exceção é deliberada e vive em *dados e retenção*, que registra o nome da tabela porque quem responde por dados pessoais precisa dele na mão.

### 8.2 As duas perguntas do começo {#as-duas-perguntas-do-comeco}

Este repositório não tem código, e a skill não adivinha onde ele está. **Antes de qualquer leitura, ela pergunta duas coisas.** O autor deve estranhar a rodada que começou sem perguntar.

**Primeiro, os diretórios do código-fonte, de backend e de frontend, no plural.** O backend dá as entidades, as regras, os estados e as integrações; o frontend dá as mensagens exibidas e o nome que o negócio usa para cada coisa: rótulo de campo, título de tela, item de menu, cabeçalho de coluna. A pergunta vem em escolha múltipla quando dá para inferir os candidatos pelo workspace, aceita quantos diretórios forem necessários e aceita caminho que não esteja na lista.

O frontend não é acessório, e neste guia menos ainda: **é dele que sai o texto literal das mensagens**, exatamente o que a história tem de reescrever por extenso em *Mensagens do Sistema*. Rodada que lê só o backend entrega catálogo pela metade e glossário com nome de classe traduzido no chute.

> **Memória montada sobre a pasta errada descreve o sistema errado com aparência de fonte confiável**, e passa a ser citada assim. Código lido pela metade é o mesmo defeito: a entidade cuja regra ficou no diretório que não foi informado recebe descrição de cadastro, e nada no documento denuncia isso.

**Depois, quais dos sete documentos entram na rodada.** Sete é uma rodada longa. Quando o pedido já nomeou um documento, a skill confirma esse documento e não expande a rodada para os sete por conta própria. Essa escolha muda **a profundidade da análise, não a fronteira**: a leitura continua sendo do sistema todo, porque conceito e regra não respeitam a divisão dos documentos.

O conjunto informado é a fronteira da leitura: a skill não varre nenhuma outra pasta do workspace. Diretório informado que não tem entidade, nem regra, nem tela aparece no relato como tal, em vez de ser silenciado.

### 8.3 A ordem é lei: analisar tudo, depois escrever {#a-ordem-e-lei-analisar-tudo-depois-escrever}

| Fase | O que acontece | Grava em `memoria/`? |
|---|---|---|
| **0: localizar** | as duas perguntas da §8.2 | não |
| **1: analisar** | ler os repositórios, cruzar, consolidar e montar o caderno de achados | **não** |
| **2: reconciliar** | documento por documento: propor, aprovar, gravar | sim |

**A skill não grava nada antes de a análise terminar**, e é a regra que mais custa quando alguém a ignora. Documento escrito no meio da leitura fixa um entendimento que a leitura seguinte contradiz. Com mais de um repositório, esse documento registra o primeiro lado que se leu, e a consolidação da §8.4 nunca acontece.

A fase 1 é também o que faz os sete documentos saírem coerentes entre si: o mesmo conceito com o mesmo nome, a mesma situação com o mesmo rótulo, a mesma regra enunciada uma vez. **Sete documentos escritos em sete leituras separadas produzem sete vocabulários**, e é assim que nasce, na história seguinte, o sinônimo no lugar do termo canônico.

A leitura é completa por princípio: o inventário inteiro antes de escolher qualquer item, com todas as entidades, todas as situações e todas as fontes de mensagem. **Análise por amostra produz descrição plausível e errada**, e a skill declara como não coberto o que não deu para cobrir, em vez de entregar como se estivesse.

### 8.4 Mais de um repositório: a consolidação cruzada {#mais-de-um-repositorio-a-consolidacao-cruzada}

Os diretórios informados são **um sistema só**. O mesmo conceito pode aparecer em vários deles com regras diferentes, e a memória registra o entendimento consolidado, nunca o de um lado escolhido por conveniência. O inventário, por isso, é **por conceito, não por repositório**: inventariar repositório a repositório e juntar depois produz duas entradas para a mesma coisa com nomes diferentes, e esse é o defeito que o glossário existe para impedir.

| Classificação | O que significa | O que a skill faz |
|---|---|---|
| **convergente** | a mesma regra, nos dois | escreve uma vez, sem mencionar que há dois lugares |
| **complementar** | cada um cobre parte do comportamento | escreve o comportamento **completo**, somado |
| **exclusiva** | existe em um só | escreve **com a condição que a delimita** (o público, o canal, o momento); se não der para evidenciar a delimitação, é pergunta |
| **divergente** | regras incompatíveis para o mesmo fato | **para e pergunta** |

**Divergência não se resolve por antiguidade, por volume nem por elegância.** Nenhuma destas frases é evidência de negócio: "o código novo está certo", "o legado é a fonte da verdade", "essa implementação é mais completa". Duas regras diferentes para o mesmo fato em produção é um **fato de negócio**: pode ser migração em curso, pode ser defeito, pode ser regra legítima que varia por canal ou por público. As duas leituras vão ao usuário, em termos de negócio, com o que cada uma implica para quem escrever história depois.

**Um fato, uma regra.** Divergência confirmada como legítima não vira duas entradas: vira **uma** entrada com a condição explícita, como "por este canal, o limite é X; pelo outro, é Y". Duas entradas para o mesmo fato criam dois donos, e a que ficar para trás é a que alguém lê primeiro. **Nome também se consolida:** o mesmo conceito nomeado de dois jeitos tem um nome só na memória, e o termo já canônico prevalece sobre qualquer código.

### 8.5 A reconciliação: documento curado não se sobrescreve {#a-reconciliacao-documento-curado-nao-se-sobrescreve}

Antes de tocar em qualquer documento, a skill lê o mapa da memória por inteiro. É ele que diz quais documentos existem, em que status, quem é o dono de cada um e quais faixas de identificador já estão alocadas.

**Quando a rodada toca mais de um documento, a ordem é fixa:** glossário, personas e perfis, ciclos de vida, regras corporativas, integrações, catálogo de mensagens, dados e retenção. Cada um consome o vocabulário que os anteriores fixaram, e inverter a ordem faz o documento de cima citar termo que o de baixo vai renomear.

Todo documento segue o mesmo protocolo. O documento existente tem redação curada por pessoas, e por isso a skill o lê inteiro antes de qualquer escrita e o **classifica item a item**:

| Situação do item | O que a skill faz |
|---|---|
| inalterado | **preserva a redação atual, palavra por palavra**, sem reescrever por gosto |
| divergente | propõe o ajuste, com a evidência que o sustenta e o texto novo |
| novo | propõe o item inteiro e a seção onde ele entra |
| sem lastro no código | **não apaga.** Pode ser conhecimento de negócio sem contrapartida no código, ou parte do sistema que não foi lida. Então pergunta |

A proposta vai ao chat **em tabela, antes de gravar**, com item, situação, o que muda, a evidência e em que repositório ela estava. Os inalterados entram como contagem, e a aprovação é **um documento por vez**. Acumular sete propostas para aprovar de uma vez transforma o portão em formalidade. Documento grande (o catálogo de mensagens é o caso típico) vai agrupado por funcionalidade, com contagem e amostra por grupo, e a aprovação é por grupo. O que a escala não muda: a skill não grava nada sem aprovação.

Duas travas de numeração que valem para sempre:

- **Identificador existente nunca é renumerado, e identificador retirado nunca é reciclado.** Item cujo enunciado muda conserva o número; item revogado deixa o número vago. Título e identificador são âncora, e âncora é citada de fora. Por isso, antes de propor renomear, a skill procura quem cita e lista os pontos afetados.
- **Identificador novo entra no fim da faixa registrada no mapa, e a skill atualiza a faixa na mesma rodada.** Faixa desatualizada faz a rodada seguinte alocar número já usado, que é a pior falha possível neste repositório.

### 8.6 Quando rodar e quando não rodar {#quando-rodar-e-quando-nao-rodar}

**Quando rodar:** antes de escrever um lote de histórias sobre um assunto que a memória ainda não cobre; quando o mapa mostra `esqueleto` ou `pendente` justamente no assunto que a demanda toca; e quando a rodada de dúvidas revelou que o que o sistema pratica hoje não está escrito em lugar nenhum. Assunto coberto troca premissa por fato consultado: é a diferença entre uma história que declara três suposições e uma que não precisa declarar nenhuma.

**Quando não rodar:**

- **para registrar o que uma história decidiu e ainda não foi construído.** A memória guarda o que **já é verdade** sobre o sistema; a história guarda o delta. Decisão nova aprovada em refinamento vira memória depois de entregue, e quem a registra é a rodada seguinte, lendo o sistema já em operação;
- **para fechar uma lacuna no meio da escrita de uma história.** A escrita declara a premissa e abre a pergunta; ela não grava em `memoria/` em nenhuma hipótese. Rodar antes é decisão do autor, e é uma rodada própria, não um passo da escrita;
- **para documentar arquitetura, modelo de dados físico, módulos ou tecnologia.** Não é o que estes sete documentos guardam, e o destino disso é o fluxo SDD.

### 8.7 O relato que fecha a rodada {#o-relato-que-fecha-a-rodada}

Um relato curto, não um relatório sobre como a análise foi feita: onde o código foi lido; por documento, quantos itens entraram, quantos foram atualizados e quantos ficaram de fora, e por quê; as consolidações cruzadas e as divergências entre repositórios; as divergências entre o código e a memória; os candidatos que pertencem a documento fora da rodada; e as perguntas que ficaram sem resposta. O conteúdo dos documentos não se repete no chat: eles são a entrega.

Uma dessas linhas merece a atenção do autor de histórias mais do que as outras. **A skill não resolve divergência entre o código e a memória:** a memória continua valendo, a divergência vira observação em termos de negócio (o que o documento diz e o que o sistema pratica), e quem decide é o dono do documento. Enquanto essa decisão não vem, a história que reescrever aquele trecho por extenso está reescrevendo algo em disputa, e isso é premissa a declarar, não detalhe.

## 9 Como estruturar o `template-user-story.md`, seção por seção {#como-estruturar-o-template-user-storymd-secao-por-secao}

O template, na raiz do repositório, é a **fonte única da forma**: mudou lá, mudou em toda história. Escrever começa por copiá-lo, não por reproduzir a estrutura de cabeça.

Três regras valem para o documento inteiro:

- **os blocos `<!-- ... -->` são orientação de preenchimento e são apagados** no arquivo entregue;
- **nenhuma seção some.** Seção sem conteúdo relevante mantém o cabeçalho e recebe uma linha dizendo que não se aplica **e por quê**, como em "não se aplica: a funcionalidade não exibe mensagem própria; toda comunicação ao usuário é a já praticada na tela";
- **português do Brasil, com acentuação correta.**

A ordem das seções é fixa:

`# US [número]: [Título]` → História de Usuário → Regras de Negócio → Validações → Mensagens do Sistema → Critérios de Aceite → Observações para UX/UI → Pontos de Atenção para Desenvolvimento/QA → Premissas adotadas → Dúvidas e Pontos para Refinamento

### 9.1 Título (`# US [número]: [Título]`) {#titulo-us-numero-titulo}

O título nomeia **a capacidade**, não a tela e não a tarefa técnica. Use o termo canônico do negócio e seja específico o suficiente para que a história se distinga das vizinhas na lista do backlog.

> *US 149: Gráficos de evolução mensal de contratos ativos na tela de Acompanhamento de UC*

### 9.2 História de Usuário {#historia-de-usuario}

Uma frase, no formato fixo:

> **EU QUERO:** \[funcionalidade\], para \[objetivo/benefício\].

Ação e benefício **explícitos**. O benefício não é enfeite: é o que permite ao time propor alternativa melhor e ao PO decidir prioridade. Benefício circular ("para poder exportar") indica que ninguém perguntou para que serve.

O perfil de usuário não fica nesta frase. Ele aparece nas regras, nas permissões e nos cenários, onde é verificável.

### 9.3 Regras de Negócio {#regras-de-negocio}

Bullets em texto corrido, **sem siglas de identificação** (nada de `RN01`, `RN02`). O critério vai por extenso: valor, limite, prazo, condição, perfil.

O que caracteriza uma regra bem escrita aqui:

- **é verificável**: tem número, prazo, condição ou lista fechada, não um adjetivo;
- **é uma regra por bullet.** Bullet que junta três critérios é impossível de contestar em pedaço;
- **inclui o negativo, quando ele existe.** "Contam como contrato ativo: ..." pede o par "**Não** contam: ...". A lista do que fica de fora é onde mora metade dos defeitos de homologação;
- **declara o que permanece.** Em mudança sobre funcionalidade existente, dizer explicitamente o que **não** muda evita que o time infira remoção onde havia acréscimo.

Perfis, permissões e alcance de dados são regra de negócio, não detalhe de tela.

### 9.4 Validações {#validacoes}

Campos, formatos, obrigatoriedade, limites, bloqueios. A fronteira com a seção anterior é simples:

> **Regra de negócio** diz o que é verdade no negócio. **Validação** diz o que o sistema exige, aceita ou recusa quando o dado chega.

"O supervisor aprova até R$ 5.000" é regra. "O campo Valor é obrigatório, aceita duas casas decimais e não admite valor negativo" é validação. Quando a validação existe **por causa** de uma regra, a própria frase diz o vínculo, para que quem alterar a regra encontre a validação.

### 9.5 Mensagens do Sistema {#mensagens-do-sistema}

O **texto literal** que o sistema exibe, entre aspas, com o momento em que aparece. Mensagem já praticada hoje é reaproveitada pelo texto, sem número de catálogo e sem dizer que ela já existe.

> - Enquanto os dados estão sendo obtidos, na área do gráfico: **"Carregando dados do gráfico..."**
> - Quando não há contratos ativos no período: **"Não há contratos ativos nos últimos 12 meses para exibição."**

Duas verificações que valem o minuto que custam:

- **toda mensagem citada em um cenário está listada aqui**, e vice-versa;
- **mensagem de erro diz o que fazer**, quando há o que fazer. "Erro ao processar" é uma mensagem que o suporte vai receber por telefone.

### 9.6 Critérios de Aceite {#criterios-de-aceite}

Cada cenário tem **nome claro**, e `Dado que` / `Quando` / `Então` / `E` são frases separadas, terminadas em ponto.

```
### Cenário 3: Unidade concedente sem contratos ativos no período

Dado que a unidade concedente possui o serviço de estágio contratado.
E não houve nenhum contrato de estágio vigente nos últimos 12 meses.
Quando o usuário abre a tela de Acompanhamento de UC.
Então a área do gráfico "Estagiários Ativos" exibe a mensagem "Não há contratos ativos nos últimos 12 meses para exibição.".
```

Esta é a cobertura esperada. Antes de fechar a história, releia a lista e pergunte quais itens a funcionalidade toca e ainda não têm cenário:

> fluxo principal · fluxos alternativos · cenários de erro · validações · mensagens exibidas · permissões · estados vazios · carregamento · paginação · ordenação · filtros · busca · exportação · impressão · auditoria · integrações · limites máximo e mínimo · ausência de dados · falha técnica

**Cenário faltando aí é o que vira defeito em homologação.** Três regras práticas: cada regra de negócio relevante é exercitada por ao menos um cenário; fronteira se testa nos três lados (abaixo, no limite, acima); e o cenário usa **dado concreto**, não "um valor válido".

### 9.7 Observações para UX/UI {#observacoes-para-uxui}

Interface, usabilidade, acessibilidade, comportamento visual. Havendo tela, grid, formulário, filtro ou botão, esta seção nomeia: **campos · ações · estados da interface · resultado esperado após cada ação**.

É aqui que entram ordem de exibição, alinhamento, o que acontece com o restante da tela durante o carregamento, o que o usuário vê quando não há dados e o comportamento em telas menores. O que não entra é decisão de design fechada em nome do designer nem escolha de componente de biblioteca.

### 9.8 Pontos de Atenção para Desenvolvimento/QA {#pontos-de-atencao-para-desenvolvimentoqa}

O que o time precisa saber para não errar: cenários negativos que merecem teste dedicado, integrações envolvidas, volume esperado, dados de teste difíceis de produzir, impacto em funcionalidade vizinha, comportamento sob falha de terceiro.

**Esta é a seção que mais escorrega de altitude.** Ponto de atenção é *"a contagem precisa considerar a virada de ano no rótulo do eixo: o cenário de dezembro para janeiro é o que costuma falhar"*. Especificação técnica é *"o método do repositório recebe o identificador e retorna a lista mensal"*. O primeiro ajuda o time; o segundo decide por ele, e decide antes de a discussão acontecer.

### 9.9 Premissas adotadas {#premissas-adotadas}

O que foi assumido porque não estava explícito na demanda. Cada premissa em um bullet e, quando fizer diferença, **o que muda se ela estiver errada**. Premissa cuja queda derruba metade dos cenários merece essa frase a mais.

Premissa não é lugar para registrar preferência ("assumimos que ficará bonito assim"). É lugar para registrar **fato de negócio adotado sem confirmação**.

### 9.10 Dúvidas e Pontos para Refinamento {#duvidas-e-pontos-para-refinamento}

As perguntas a confirmar com negócio, cliente ou stakeholders. Esta seção é a **pauta da `/pg-us-review`**. Divergência entre a demanda e o que hoje é praticado entra aqui, em termos de negócio.

Cada item é escrito como **pergunta fechável**: uma pergunta que uma resposta encerra. "Rever regra de cálculo" não é fechável; "O contrato rescindido no dia 10 conta no mês da rescisão ou deixa de contar já nesse mês?" é. Quando houver, o item leva **responsável nominal e prazo**. Dúvida sem dono é dúvida que chega à sprint.

## 10 O teste de roteamento {#o-teste-de-roteamento}

Diante de qualquer informação, pergunte: *que tipo de fato é este?* A resposta define a seção.

| A informação diz… | Vai para |
|---|---|
| o que é verdade no negócio: valor, limite, prazo, condição, perfil, alcance de dados | Regras de Negócio |
| o que o sistema exige, aceita ou recusa de um dado | Validações |
| o texto exato que aparece na tela, e quando aparece | Mensagens do Sistema |
| como se verifica que o comportamento aconteceu | Critérios de Aceite |
| como a tela se comporta, se organiza ou reage | Observações para UX/UI |
| o que o time precisa saber para não errar na construção ou no teste | Pontos de Atenção para Desenvolvimento/QA |
| o que foi assumido sem confirmação | Premissas adotadas |
| o que ninguém aqui pode responder | Dúvidas e Pontos para Refinamento |
| como aquilo é construído: componente, contrato, dado, biblioteca | **nenhuma delas**: é o fluxo SDD |
| branch, PR, pipeline, flag, migração, rollback | **nenhuma delas**: é a esteira de desenvolvimento |

Uma informação que caberia em duas seções normalmente é **uma regra e a sua verificação**. Nesse caso, ela é enunciada uma vez na regra e **exercitada** no cenário, não reescrita com outras palavras. Critério repetido com palavras diferentes em dois lugares é a origem da correção que se aplica em um só.

## 11 Modos de falha {#modos-de-falha}

Os defeitos abaixo se repetem e custam caro, e a coluna do meio mostra como reconhecer cada um a olho nu. A coluna de custo considera o consumidor mais exigente da história: **o fluxo SDD**, que não pergunta. Ele preenche o que faltar com a alternativa mais provável e segue construindo.

| Falha | Como se manifesta | Custo |
|---|---|---|
| **História que depende de contexto externo** | `RC-014`, `MSG-080`, "conforme a memória do projeto", caminho de arquivo | A referência não resolve do lado de quem consome; o fluxo SDD constrói sobre a regra que inferiu, e a inferência não fica registrada em lugar nenhum |
| **Lacuna preenchida com palpite** | regra plausível, específica, que ninguém decidiu | O palpite é lido como decisão de negócio e vira comportamento implementado; a divergência só aparece na homologação, quando já custa retrabalho |
| **Agente fechando dúvida sozinho** | a lista de dúvidas encolheu sem que ninguém tenha respondido nada | A lacuna visível vira regra invisível e entra no fluxo SDD com aparência de combinado; ninguém adiante tem como saber que aquilo não foi decidido |
| **História grande** | uma história com consulta, filtro, exportação e permissão | Estimativa errada e escopo que se descobre em partes; o fluxo SDD recebe várias capacidades misturadas e resolve as fronteiras entre elas por conta própria |
| **Cenário só do caminho feliz** | nenhum cenário de erro, vazio, limite ou falha técnica | O comportamento fora do caminho feliz é inventado na construção; o defeito nasce exatamente onde não havia cenário para prová-lo |
| **Sinônimo em vez de termo canônico** | "empresa parceira" onde o negócio diz "unidade concedente" | Dois nomes para a mesma coisa levam o fluxo SDD a tratá-las como conceitos distintos, e a divergência se propaga por tudo que for construído a partir dali |
| **Advérbio no lugar do número** | "carrega rapidamente", "de forma amigável" | Não há como provar o atendimento; o critério é interpretado na construção e rediscutido na demonstração |
| **Mensagem sem texto literal** | "exibir mensagem de erro apropriada" | Quem está construindo redige o texto, sem tom de voz nem consistência com o que o sistema já fala |
| **Regra reescrita em cinco lugares** | o mesmo critério, com palavras diferentes, na regra, no cenário e na observação de UX | A correção se aplica em quatro; a versão esquecida é a que o consumidor lê primeiro, e passa a valer sem que ninguém tenha decidido isso |
| **História que vira desenho técnico** | assinatura de método, nome de componente, biblioteca | Fecha o desenho técnico antes da etapa que deveria decidi-lo, e obriga o fluxo SDD a escolher entre seguir uma decisão sem contexto técnico ou contrariar o que está escrito |
| **Memória vencida lida como fonte** | a história reescreve por extenso uma regra ou uma mensagem que o sistema não pratica mais | O texto tem a mesma aparência de confiança de um atualizado, e nada na leitura faz suspeitar dele; a contradição com a produção aparece em homologação, e uma rodada de `/pg-mem-sync` a teria evitado |
| **História ajustada ao que foi construído** | edição posterior à implementação, para "refletir a realidade" | O combinado vira ata; perde-se o registro do que se pediu, e a próxima mudança não tem contra o que ser comparada |

## 12 Checklist do portão: antes de liberar a história {#checklist-do-portao-antes-de-liberar-a-historia}

- [ ] todas as seções presentes, na ordem do template, sem blocos de comentário `<!-- -->`; as não aplicáveis com o motivo declarado;
- [ ] a história vale sozinha: nenhuma sigla, nenhum identificador de memória, nenhum caminho de arquivo, nenhuma referência a nada fora do arquivo;
- [ ] cada regra tem valor, limite, prazo ou condição verificável, e o negativo quando existe;
- [ ] cada mensagem aparece com o texto literal e o momento em que é exibida;
- [ ] cada regra relevante é exercitada por um cenário, com dado concreto, e os estados de vazio, erro, limite e falha técnica têm cenário quando a funcionalidade os tem;
- [ ] campos, ações e estados da interface estão nomeados quando há tela envolvida;
- [ ] tudo que foi assumido está em *Premissas adotadas*, e o autor **leu e concorda** com cada uma;
- [ ] tudo que falta responder está em *Dúvidas e Pontos para Refinamento*, como pergunta fechável, com responsável e prazo quando houver. Nenhuma foi apagada sem resposta, e nenhuma foi inventada;
- [ ] a história foi lida uma vez inteira, do começo ao fim, por uma pessoa.

O último item não é retórico. O agente escreve melhor do que a demanda que recebeu, e escreve rápido. Mas quem responde pelo que está escrito continua sendo o dono da história.
