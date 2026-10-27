# Revisão do desktop — 24 out 2026

A revisão encontrou falhas concretas de camadas, área útil, foco e composição do CSS. As correções mantêm o Strands e os conteúdos existentes.

| Prioridade | Antes | Depois | Evidência / reprodução |
| --- | --- | --- | --- |
| P1 | Wallpaper com `z-index: -2` e `body` opaco | Wallpaper na camada 0, desktop na 1, janelas nas 6/8 e dock na 20; `body` isolado | A regra antiga está em `work/refine.css`; a combinação permitia encobrir o canvas. Camadas agora pertencem a `src/styles/desktop-shell.css`. |
| P1 | Finder maximizado usava quase toda a altura, cobrindo a área reservada ao dock | Janelas limitadas por uma área útil comum, com rodapé e dock separados | Abrir skills → INTERFACES e maximizar. A altura antiga `100svh - 20px` avançava sobre o dock. |
| P2 | Fechar o Finder em primeiro plano deixava o controle de teclado apontando para a janela fechada | Um gerenciador compartilhado ativa e foca a janela restante | Abrir ferramenta → abrir skills → fechar skills → Escape. Novo teste de regressão cobre a sequência. |
| P2 | Os nomes das ferramentas apareciam somente no hover | Temas, Blocos e Ícones permanecem visíveis; o tooltip complementa a ação | O DOM agora contém três rótulos persistentes `.tool-launch-name`. |
| P2 | Build incluía oito folhas de estilo de versões antigas e dependia de um ZIP em Downloads | Base, biblioteca, painéis, Strands e shell com responsabilidades separadas; assets locais atuais | Build não depende mais de `aliado-icons.zip`, backups HTML ou skins anteriores. |

## Validação

- 19 cenários de navegação e catálogo.
- 24 cenários de ferramentas, foco, exportação e contratos do shell.
- CSS de tema compilado com Tailwind CSS 4.
- Shaders GLSL comparados com o componente Strands fornecido pelo usuário.

Os testes de DOM usam APIs de plataforma simuladas. Não medem layout, GPU, pixels ou o download nativo do navegador. Essa limitação consta da [documentação do jsdom](https://github.com/jsdom/jsdom#unimplemented-parts-of-the-web-platform), consultada via Context7.

A correção de camadas segue a documentação de [stacking e z-index da MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_positioned_layout/Using_z-index), também consultada via Context7.

## Fontes atuais

- `src/styles/base.css`: tokens, reset e acessibilidade de movimento.
- `src/styles/desktop-shell.css`: desktop, dock, janelas, área útil e responsividade.
- `src/styles/library.css`: catálogo de skills.
- `src/styles/tool-panels.css`: conteúdo das três ferramentas.
- `src/scripts/window-manager.js`: foco, camadas e limites de movimentação.
- `scripts/build.cjs`: geração do HTML autossuficiente.

Os arquivos antigos foram preservados no workspace original para histórico; o repositório de handoff contém apenas as fontes atuais.

## Verificação publicada

A URL de produção foi aberta no navegador. O canvas Strands renderizou sem erros de console; as seis imagens carregaram. A busca por "coracao" retornou um ícone. Em 1280×800 e 390×844, as caixas das janelas ficaram acima do dock. O adaptador de clipboard do navegador retornou vazio; a cópia nativa não foi confirmada por esse adaptador.
