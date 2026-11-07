---
paths:
  - "src/content/guides/**"
  - "src/data/**"
  - "src/routes/**"
  - "src/components/**"
  - "src/features/**"
  - "src/lib/machine-readable.ts"
  - "README.md"
  - "AGENTS.md"
  - ".claude/rules/**"
---

# Texto do site e da documentação: o padrão de escrita do time

O texto que o site mostra e a documentação do repositório (o `README.md`, o `AGENTS.md` e as regras de `.claude/rules/`) seguem a skill `pg-escrever-texto`, do plugin communication. Com o plugin instalado, use a skill para escrever e para revisar. Sem ele, valem as regras abaixo, que resumem a skill.

## Ao escrever

- Toda frase nomeia um mecanismo, um número, um nome ou uma decisão. "A consulta ficou mais eficiente" nomeia uma sensação, e "a listagem caiu de 40 queries para 2" nomeia um número.
- Frase que caberia, sem mudar nada, no site de outro projeto sai. Esse teste pega o que a lista de marcas abaixo ainda não nomeia.
- Onde uma frase resiste, pergunte o que o leitor passa a fazer ou a saber depois dela. Se nada, ela era enfeite e sai.
- Não invente o número, o nome nem o mecanismo. Se ele não está no material, pergunte a quem pediu ou corte a frase. Número inventado é pior que frase vaga.
- Uma ideia por frase. Se o leitor volta para entender, parta a frase em duas.
- Voz ativa, que nomeia quem faz a ação: "o serviço valida", e não "a validação é feita pelo serviço". O "se" também esconde o ator, e "verificou-se que a query falha" é "a query falha".
- Varie o ritmo, e troque o genérico pelo específico: no lugar de "há preocupações", a preocupação, com nome.
- A voz de quem escreve vence estas regras. O pedido explícito da pessoa também vence: diga a consequência numa frase e siga o pedido.

## Na revisão, varra as marcas

Leia o rascunho pronto contra esta lista. Enquanto você escreve, a lista de proibições põe na frase o que ela proíbe.

- Vocabulário de máquina: "crucial", "fundamental", "robusto", "abrangente", "significativo", "otimizar", "potencializar", "alavancar", "cenário", "jornada", "ecossistema" e "solução" para qualquer coisa. O "de forma eficiente" é o número ou o mecanismo que o torna eficiente.
- Verbo pomposo e verbo virado substantivo: "utilizar" é "usar", "disponibilizar" é "dar", "entregar" ou "publicar", e "realizar a validação" é "validar".
- Preposição inflada: "com o intuito de" é "para", e "no âmbito de" é "em". "Através de" só vale quando algo atravessa: é "pela API", e não "através da API".
- Gerundismo: "vou estar verificando" é "vou verificar".
- "O mesmo" no lugar de pronome: "o usuário entrou e o mesmo foi redirecionado" é "o usuário entrou e foi redirecionado". Antes de substantivo, como em "a mesma versão", ele está certo.
- Muleta de abertura: "Vale ressaltar que", "É importante notar que" e "Em suma" saem, porque o que vinha depois delas era a frase.
- Advérbio em "-mente" escorando verbo fraco: "melhorou significativamente" é o quanto melhorou.
- Juridiquês: "outrossim", "destarte", "o presente documento". Documento técnico não é peça processual.
- Afirmação vazia:
  - o elogio no lugar da descrição;
  - "estudos mostram" sem a fonte;
  - "apesar dos desafios", no lugar do fato;
  - as ideias forçadas em grupos de três;
  - o "não apenas X, mas também Y";
  - quatro nomes para a mesma coisa num parágrafo;
  - três ressalvas onde uma bastava;
  - o fecho genérico, como "o futuro é promissor".

## Pontuação e forma

- Sem travessão e sem meia-risca. Termine a frase, ou use vírgula, dois-pontos ou parênteses. Escreva o intervalo com "a", como em "2 a 3".
- Dois-pontos vêm antes de uma lista ou de um exemplo. Entre duas orações, eles viram ponto.
- Aspas retas. Título com maiúscula só na primeira palavra e nos nomes próprios.
- O negrito marca a afirmação do parágrafo, e não os nomes dele. O rótulo em negrito no começo de um item só vale se o texto depois dele traz detalhe novo.
- Sem emoji decorativo.

## Nos guias e no catálogo

- Ao reescrever um guia, não mexa no id do título (`{#...}`), nos blocos de código, nos links nem na forma das tabelas, porque os endereços das páginas saem deles.
- Não reescreva aqui a cópia do `skills`. Veja `catalog-first.md`.
