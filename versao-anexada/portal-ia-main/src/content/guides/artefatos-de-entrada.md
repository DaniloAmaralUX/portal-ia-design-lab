## 1 Princípios gerais {#principios-gerais}

### 1.1 Fonte bruta é sinal, não ruído {#fonte-bruta-e-sinal-nao-ruido}

Na entrada de uma demanda, **o detalhe não filtrado é onde moram os melhores critérios de aceite**: as exceções mencionadas de passagem, as hesitações do usuário, o "ah, mas nesse caso é diferente". Resumir a fonte antes de entregá-la ao modelo significa filtrar com um único olhar (o seu) e abrir mão de um segundo leitor capaz de capturar o que você não notou.

> **Regra prática: recorte, não resuma.** Selecione o trecho relevante da fonte; dentro do trecho, preserve o texto original.

### 1.2 O formato ideal é o par "bruto + enquadramento" {#o-formato-ideal-e-o-par-bruto-mais-enquadramento}

O melhor artefato de entrada quase nunca é a fonte bruta sozinha, nem o seu resumo sozinho. É a combinação dos dois:

```
Contexto: [funcionalidade/módulo afetado, 1-2 linhas]
Origem: [reunião com X em DD/MM | e-mail de Y | Art. N da norma Z | ticket #123]
O que já existe: [história/regra/comportamento atual relacionado, se houver]
Objetivo do negócio: [por que isso foi pedido, se souber; se não souber, diga]
Fonte bruta: [transcrição / texto literal / trecho da norma / dado de uso]
```

O enquadramento é seu; a riqueza é da fonte. Com os dois, o modelo escreve histórias precisas e ainda aponta o que ficou ambíguo.

### 1.3 Sempre declare o que já existe {#sempre-declare-o-que-ja-existe}

Entrada de demanda sem a regra ou história atual relacionada é a principal fábrica de histórias contraditórias no backlog. Se existe algo relacionado, anexe ou referencie, e peça que a nova história explicite o que muda, o que permanece e o que é revogado.

### 1.4 Diga o que você não sabe {#diga-o-que-voce-nao-sabe}

"Não sei o motivo do pedido" também é informação: leva o modelo a devolver perguntas em vez de presumir uma justificativa plausível (e possivelmente errada).

### 1.5 Peça ambiguidades de volta {#peca-ambiguidades-de-volta}

Instrua o modelo a acompanhar toda geração de histórias com uma **lista de ambiguidades e perguntas em aberto** detectadas na fonte. Essa lista vira sua pauta de refinamento. O modelo como segundo leitor da fonte bruta é metade do valor dele.

### 1.6 Formato de arquivo pouco importa aqui {#formato-de-arquivo-pouco-importa-aqui}

Entrada de demanda tem vida curta. Texto colado na conversa, `.txt` ou `.md` resolvem quase tudo. Só evite anexar contêiner pesado (PDF de 80 páginas, planilha com dezenas de abas) quando o que interessa é um trecho. O recorte é sempre melhor que o contêiner.

## 2 Situações clássicas de demanda {#cenarios-classicos-de-demanda}

### 2.1 Reuniões gravadas com usuários (discovery) {#reunioes-gravadas-com-usuarios-discovery}

**O que fornecer:** a transcrição bruta do trecho relevante, e não a ata nem o resumo.

- Se a reunião cobriu vários temas, recorte só o trecho da funcionalidade em questão. Dentro dele, não edite nem "limpe" a fala.
- Identifique quem fala o quê (usuário final vs. gestor vs. facilitador), porque o peso de cada fala é diferente.
- Exceção citada de passagem é critério de aceite em potencial; não a retire achando que é desvio de assunto.
- Peça, além das histórias, a lista de ambiguidades e perguntas para a próxima conversa com o usuário.

**Formato:** `.txt`/`.md` com o trecho da transcrição, ou colado na conversa.

### 2.2 Gravação do PO {#gravacao-do-po}

**O que fornecer:** a transcrição bruta de uma gravação feita pelo PO.

- É um recurso útil quando as reuniões com o cliente não seguem um foco.
- Na gravação, o PO pode falar:

  - Motivação da funcionalidade ou módulo.
  - O fluxo principal e as regras de negócio.
  - Questões técnicas, como a relação de campos de tela com colunas do banco de dados.
  - Mensagens de erro e sucesso.
  - Cenários alternativos.
  - Características de protótipo visual.

**Formato:** `.txt`/`.md` com a transcrição, ou colado na conversa.

### 2.3 Solicitações escritas resumidas (e-mail, chat, formulário) {#solicitacoes-escritas-resumidas}

**O que fornecer:** o texto **literal** do solicitante + o contexto que o texto não traz.

- Nunca substitua o pedido original pela sua reescrita. Anexe os dois se quiser, mas o literal precisa estar presente. Reescrita embute interpretação, e interpretação não validada vira requisito errado em silêncio.
- Complemente com o que só você sabe: quem pediu, área, módulo afetado, problema por trás do pedido.
- Pedidos vagos ("melhorar o relatório") são entrada legítima, desde que você instrua o modelo a tratá-los como ponto de partida para perguntas, e não como especificação.

### 2.4 Pedidos em reuniões de acompanhamento {#pedidos-em-reunioes-de-acompanhamento}

**O que fornecer:** o par **pedido + estado atual** (o que foi dito, junto com a história/funcionalidade existente afetada).

- Esta é a situação com maior risco de contradição, porque o pedido quase sempre é um *ajuste* sobre algo que existe. Com a história original anexada, o modelo gera a história de **mudança** corretamente.
- Registre o pedido no dia, mesmo em 2 linhas. Reconstituir de memória depois introduz erro na fonte.
- Deixe claro se é ajuste de escopo de algo **em construção** ou item **novo** de backlog; as histórias resultantes são diferentes.
- Se o pedido revoga uma regra anterior, peça que a história explicite ("substitui o comportamento definido em X").

### 2.5 Documentos regulatórios {#documentos-regulatorios}

**O que fornecer:** o **trecho literal** da norma (artigo/seção relevante), não o PDF inteiro nem só a sua tradução.

- O recorte é seu; a **interpretação pode ser colaborativa**: deixe o modelo propor a tradução da norma em regras e critérios, e valide.
- Critério de aceite regulatório precisa ser rastreável: peça que cada critério gerado cite o artigo/inciso de origem.
- Inclua data de vigência e, se a norma alterou uma anterior, diga qual. Regulação também revoga regras.

## 3 Outros artefatos de entrada comuns em projetos modernos {#outros-artefatos-de-entrada-comuns-em-projetos-modernos}

Demanda não chega só por reunião e e-mail. Os artefatos abaixo são fontes frequentes, e cada um tem sua forma ideal de preparo.

### 3.1 Tickets de suporte e relatos de bug {#tickets-de-suporte-e-relatos-de-bug}

Talvez a fonte de demanda mais subaproveitada. Um conjunto de tickets sobre o mesmo tema revela padrões que um ticket isolado não mostra.

- **O que fornecer:** os textos literais dos tickets (relato do usuário + resposta do suporte, quando houver), agrupados por tema. 5 a 15 tickets sobre o mesmo problema é uma entrada excelente.
- Distinga **bug** (comportamento diverge do especificado → correção) de **gap** (o sistema faz o especificado, mas o especificado não atende → nova história). Peça ao modelo para classificar cada ticket nessas categorias. É uma análise que ele faz bem, e ela muda o tipo de item gerado.
- Inclua frequência/recorrência se tiver ("34 tickets sobre isso no trimestre"). Ela vira insumo de priorização na descrição da história.

### 3.2 Protótipos, wireframes e specs de design (Figma etc.) {#prototipos-wireframes-e-specs-de-design}

Fluxo cada vez mais comum: o design nasce antes da história ou junto com ela.

- **O que fornecer:** imagens/capturas das telas do fluxo + as anotações do designer. Modelos multimodais leem telas bem, então anexe as imagens na conversa.
- A imagem mostra o estado feliz; o que gera boas histórias são os **estados que a tela não mostra**: vazio, erro, carregamento, permissão negada, dados extremos. Peça explicitamente que o modelo enumere os estados ausentes do protótipo. É uma das colaborações mais produtivas quando a entrada é protótipo.
- Inclua o link/nome do frame para rastreabilidade na história gerada.

### 3.3 Especificações técnicas e contratos de integração {#especificacoes-tecnicas-e-contratos-de-integracao}

Demandas que nascem de sistemas, não de pessoas: integrar com API de parceiro, migrar de versão, consumir um novo webhook.

- **O que fornecer:** o trecho relevante da spec (endpoints, payloads, códigos de erro) + o objetivo de negócio da integração. Specs OpenAPI/Swagger em JSON/YAML funcionam bem como anexo.
- Histórias de integração vivem ou morrem nos **cenários de falha**: timeouts, respostas inesperadas, indisponibilidade do parceiro, dados fora do contrato. Peça que os critérios de aceite cubram explicitamente os caminhos de erro da spec.

### 3.4 Débito técnico e demandas do time de engenharia {#debito-tecnico-e-demandas-do-time-de-engenharia}

- **O que fornecer:** a descrição do engenheiro (pode ser técnica) + o impacto observável (lentidão, incidentes, custo de manutenção, risco).
- O desafio aqui é tradução. Peça ao modelo para expressar o valor em termos de negócio/usuário quando possível ("como time de produto, quero X para que releases parem de quebrar Y"). Peça também que ele sinalize quando o item não tem valor de usuário direto e deve ser tratado como *enabler*, e não como história de usuário forçada.

### 3.5 Atas e transcrições de refinamento/planning do próprio time {#atas-e-transcricoes-de-refinamento-planning}

- **O que fornecer:** a transcrição ou anotações da discussão em que o time levantou dúvidas sobre uma história existente.
- Uso típico: transformar as dúvidas do refinamento em revisão da história (critérios que faltavam, cenários não cobertos). Anexe a história original + a discussão.

## Tabela-resumo {#tabela-resumo}

| Artefato | Forma ideal de entrada | Pedido-chave ao modelo |
|---|---|---|
| Reunião com usuário | Transcrição bruta do trecho | Listar ambiguidades e perguntas |
| Solicitação escrita | Texto literal + contexto seu | Perguntar quando faltar o porquê |
| Pedido de follow-up | Pedido + história atual afetada | Explicitar o que muda/permanece/revoga |
| Norma regulatória | Trecho literal do artigo | Rastrear cada critério ao artigo |
| Tickets/bugs | Textos literais agrupados por tema | Classificar bug vs. gap |
| Protótipo/design | Imagens das telas + anotações | Enumerar estados ausentes (vazio, erro...) |
| Spec de integração | Trecho da spec + objetivo de negócio | Cobrir caminhos de falha |
| Débito técnico | Descrição + impacto observável | Traduzir para valor, ou marcar como *enabler* |
| Refinamento do time | História original + discussão | Revisar critérios e cenários faltantes |

## Checklist rápido antes de pedir a geração {#checklist-rapido-antes-de-pedir-a-geracao}

- [ ] A fonte bruta relevante está presente (recortada, não resumida)?
- [ ] Eu declarei o módulo/funcionalidade e a origem da demanda?
- [ ] Anexei o que já existe de relacionado (história, regra, comportamento atual)?
- [ ] Declarei o objetivo de negócio, ou declarei que não o conheço?

> Se os quatro itens estão cobertos, a entrada está pronta, seja qual for o formato de arquivo.
