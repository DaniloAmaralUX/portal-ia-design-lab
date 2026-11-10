# Rodada de craft — Jakub e Emil

Branch: `polish/jakub-emil`. Base preservada para handoff: `handoff/portal-original-ui-audit`, commit `98dc503`.

## Escopo e contrato

Refinamento dos componentes compartilhados de navegação, busca, botões e cartões usados na home, Academy, treinamentos, intervalos e caminhos por papel. A rodada não altera os textos editoriais, a ordem das seções, os títulos, os tamanhos de fonte ou os grids originais. O único ajuste de conteúdo gerado remove a contagem `undefined skills` quando o catálogo não está disponível.

As skills foram instaladas com o CLI oficial `npx skills add`, a partir de [Jakub Krehel](https://github.com/jakubkrehel/skills) e [Emil Kowalski](https://github.com/emilkowalski/skills). Aplicadas nesta rodada: `better-accessibility`, `better-layout`, `better-writing`, `better-typography`, `better-colors`, `better-ui`, `better-interface`, `emil-design-eng`, `animate`, `animation-performance` e `review-animations`. `interface-review` também foi instalada para revisões posteriores de branches; não substitui a revisão de implementação desta rodada.

## Revisão e decisões

| Before | After | Why |
| --- | --- | --- |
| Busca com `animate-pop-in` e entrada do overlay | Abertura e fechamento imediatos, mantendo o diálogo Radix e o retorno do foco | Uma busca acionada repetidamente por atalho não deve atrasar a tarefa |
| Cartões com deslocamento vertical e sombra crescente | Superfície estável com borda e fundo em 150 ms; foco visível | Mantém os alvos e o texto no lugar durante a leitura e a comparação |
| Revelação de conteúdo vinculada à rolagem | Conteúdo inteiro disponível ao entrar na área visível | Evita texto parcialmente transparente esperando movimento de scroll |
| Arcos da marca oscilando indefinidamente | Marca estática | O efeito não explica uma mudança de estado e compete com a demonstração |
| Terminal pausado apenas por hover ou foco | Botão explícito de pausa persistente, com `aria-pressed` e nome acessível | Permite interromper a demonstração e continuar lendo o restante da página |
| Preferência de movimento lida apenas na montagem | `useSyncExternalStore` observa mudanças de `matchMedia` | Respeita a preferência do sistema sem exigir recarga |
| Escala de pressão também em acionamento pelo teclado | Pressão de 0,96 somente sem `focus-visible` e com movimento permitido | Preserva feedback do toque sem deslocar controles usados pelo teclado |
| Supressão de transições do tema sujeita ao agrupamento do navegador | Leitura de estilo antes da troca dos tokens | Evita que as cores atravessem estados intermediários durante a troca de tema |
| Resultado de instalação com contagem ausente | Omite apenas a contagem indisponível | Remove `undefined` sem inventar o tamanho do catálogo |

## Ingredientes de movimento

Feedback frequente usa transições CSS de borda e fundo, em 150 ms com `cubic-bezier(0.2, 0, 0, 1)`. Feedback de pressão usa escala 0,96, sem mudança de geometria de layout. Não foi adicionada biblioteca de animação. Hover segue o suporte do ponteiro; movimento reduzido e teclado têm tratamento explícito.

A demonstração do terminal mantém a finalidade de explicar o uso do Claude Code. Pausa fora da tela, em aba oculta, por hover ou foco e pelo controle persistente. Com movimento reduzido, mostra o roteiro completo, estático.

## Cobertura da revisão

| Domínio | Evidência | Limite |
| --- | --- | --- |
| Acessibilidade | Pausa por teclado, preferência de movimento em tempo real, foco, testes axe dos modelos principais | Não substitui testes com leitor de tela e dispositivos físicos |
| Layout | Cabeçalho, cartões e telas principais entre 320 e 1440 px | Sem nova arquitetura da informação |
| Escrita | Rótulos da pausa e dados ausentes na demonstração | Textos editoriais originais preservados |
| Tipografia | Hierarquia original e revisão dos títulos renderizados | Sem troca de fontes ou escala |
| Cores | Tokens existentes e contraste automatizado nos temas | Sem migração de paleta nesta rodada |
| UI e movimento | Feedback CSS, busca imediata, superfícies estáveis, remoção de loops decorativos | Não constitui auditoria de cada animação de todos os módulos legados |

## Continuidade

O ícone do GitHub ao lado do tema aponta para o código desta nova branch. O link da branch de handoff anterior continua válido e não foi alterado. As limitações do catálogo privado e do gate completo permanecem documentadas em `HANDOFF-PORTAL.md`.

## Resultado da validação

- `npm run check` e `npm run build`: aprovados. Lint adicional do novo hook e dos testes desta rodada executado separadamente.
- Playwright: 18 testes aprovados (`chanhdai-complete.spec.ts`, `home.spec.ts`, `craft-polish.spec.ts`). Cobrem quatro larguras de tela, axe dos modelos principais, busca, tema, atalho de handoff, personalização e controle de movimento.
- Revisão visual automatizada de 20 combinações de rota e largura: sem overflow horizontal nem erros de JavaScript. Seis varreduras axe de conteúdo principal sem violações detectadas. Evidência em `polish-browser.json`.
- Gateway da prévia: quatro testes aprovados.
- `npm test`: 449 aprovados, 24 falhas e 36 ignorados, os mesmos totais anteriores. O gate completo continua pendente das limitações já documentadas; não é declarado aprovado.

Veredito da rodada: **Approve** para as alterações de craft e movimento revisadas. Não representa aprovação integral do catálogo privado, de todos os módulos legados, de leitores de tela ou de desempenho em hardware físico. A revisão não mediu FPS nem promete um orçamento de GPU validado em dispositivos reais.
