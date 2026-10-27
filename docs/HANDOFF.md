# Handoff técnico

Entregue em 24 de outubro de 2026. Produção: https://mesa-dev-desktop.vercel.app

## Arquitetura

A aplicação roda no navegador com HTML, CSS e JavaScript. Node.js é necessário apenas para preparar dados, compilar e testar. Não há backend nem dependências de runtime servidas por CDN.

`scripts/build.cjs` combina as views e os dados em `src/index.template.html`. Os placeholders são resolvidos em uma única passagem, evitando interpretar conteúdo dos documentos como parte do template. JSON é escapado antes da inclusão em tags `script`.

O Aero Shards tem um bundle IIFE separado, preparado pelo esbuild e incorporado ao mesmo HTML, sem imports de rede. `vgpu@0.3.1`, `@vgpu/core` e `@vgpu/wgsl` fornecem o renderer WebGPU. As dependências e o lockfile são versionados; não há React em runtime. O override do pacote transitivo `@modelcontextprotocol/server` para `2.3.0` corrige alertas de segurança da dependência de tooling do vgpu. Esse servidor não participa do bundle nem é executado pela aplicação.

Ordem dos scripts: `window-manager` → `desktop` → `interfaces` → `tools` → `glass-icons`. Eles compartilham o escopo de um script clássico para manter a abertura offline do HTML; não converta um arquivo isolado para módulo sem ajustar o build e seus consumidores.

## Donos de estado e de estilo

- `window-manager.js`: foco, janela ativa, camadas e limites de movimentação.
- `desktop.js`: seleção das categorias, histórico e estado da janela de biblioteca.
- `interfaces.js`: catálogo, busca, filtros, detalhes e exportação das skills.
- `tools.js`: os três aplicativos e seus estados locais.
- O fundo usa `src/assets/backgrounds/elliott-engelmann-DjlKxYFJlTc-unsplash.jpg`, fornecido pelo usuário em 27 de outubro de 2026. A fotografia é incorporada ao HTML e preenche a tela com `object-fit: cover`, centralizada. `strands.js` e seus shaders originais permanecem arquivados, sem participar do build nem consumir GPU.
- `aero-shards.js` conserva os nove shaders WGSL, a simulação e a composição do componente React Bits original. Adapta apenas o lifecycle: laranja `#f97316`, velocidade `0.87`, fundo transparente, opacidade CSS de 25%, sem marcadores ou eventos de ponteiro. Render limitado a 30 FPS e DPR 1.25. A animação pausa com a aba oculta e é desmontada quando movimento/transparência reduzidos são ativados; sem WebGPU, a fotografia continua visível. Recursos são liberados ao sair, e recriados ao voltar pelo histórico do navegador. Estado de diagnóstico em `data-aero-state`.
- `glass-icons.js`: adapta o renderer Glass Icons do React Bits aos seis botões existentes. São dois canvases compartilhados, um por grupo, com redraw apenas durante interação ou resize. Os shaders, gradientes e cálculos ópticos originais são preservados. Rótulos ficam sempre visíveis; não há intro, e ações por teclado não disparam movimento decorativo. Sem WebGL, o fallback usa CSS. Origem e revisão em `vendor/react-bits/glass-icons/source.txt`.
- `desktop-shell.css`: única fonte para geometria de janelas, dock e área de trabalho. O dock tem espaço reservado para evitar sobreposição com rodapés.
- O dock usa uma variante compacta horizontal: vidro escuro, ícone à esquerda do rótulo e indicador discreto de aplicativo aberto. Seus Glass Icons usam `plate: 'offset'` e `spread: .45`, tanto no renderer quanto no fallback CSS; os atalhos do desktop mantêm a placa inclinada.
- `base.css`, `library.css`, `tool-panels.css` e `glass-icons.css`: reset/tokens e estilos dos componentes correspondentes.

As skins anteriores não fazem parte deste repositório. Evite voltar a empilhar folhas de estilo de protótipos antigos para corrigir componentes atuais.

## Persistência e segurança

O tema salvo fica no `localStorage`, chave `mesa-theme-v1`. Ele pertence ao dispositivo e à origem; não é sincronizado com conta ou servidor. A leitura valida tokens e valores antes de aplicá-los.

O editor de blocos escapa o texto, restringe destinos a protocolos conhecidos e usa iframe com sandbox na prévia. Os SVGs de origem são verificados durante a preparação dos dados. Conteúdo dos documentos de skills é exibido como texto e nunca executado.

Nunca versionar `.env*`, `.vercel/`, tokens, dados de usuário, dependências instaladas ou artefatos de testes. A publicação usa somente `dist/`.

## Escopo entregue e limites

- As pastas Plugins e Recursos são categorias vazias; não há instalação real de plugins ou integração com o sistema operacional.
- O desktop é uma interface web; atalhos reservados pelo navegador podem ter prioridade sobre os da aplicação.
- A ferramenta Temas adapta presets e edição local do tweakcn; contas, comunidade, IA e sincronização do projeto original não estão implementadas.
- Blocos contém três composições portadas do Tailark. Exporta HTML/CSS, não componentes React com todas as dependências do projeto original.
- Ícones contém a seleção de 90 SVGs registrada em `vendor/lucide/icons`.
- O fundo fotográfico não requer WebGL. Glass Icons usa WebGL 2 com fallback CSS.
- Aero Shards precisa de WebGPU em contexto seguro. O fundo fica só com a foto em plataformas sem suporte; não há download extra, tela de erro ou bloqueio da navegação.
- Copiar depende das permissões e APIs do navegador. Há seleção manual quando os mecanismos de cópia não estão disponíveis. O adaptador de clipboard do navegador de validação retornou vazio; não foi usado como confirmação da cópia nativa.

## Como validar alterações

1. Execute `npm test` em um checkout limpo.
2. Confira em navegador real os seis Glass Icons, o fundo, a seleção e os rótulos do dock, incluindo fallback e redução de movimento.
3. Abra skills → INTERFACES, busque, filtre, expanda e baixe um ZIP.
4. Abra uma ferramenta, depois a biblioteca; feche a biblioteca e confirme que o teclado volta à ferramenta.
5. Confira janelas normais e ampliadas: rodapés devem ficar acima do dock.
6. Confira a 1280×800 e 390×844, incluindo scroll, foco e ausência de overflow horizontal.
7. Confira copiar e baixar na plataforma de destino. Testes jsdom simulam essas APIs.

Na validação publicada, o Strands renderizou sem erros de console, as seis imagens carregaram, a busca por "coracao" retornou um ícone e as caixas de janelas ficaram acima do dock nos dois tamanhos citados.

## Deploy

Projeto Vercel: `mesa-dev-desktop`. Escopo: `danilos-projects-94eff717`. Framework: Other. Root Directory: raiz do repositório. Build: `npm run build`. Output Directory: `dist`. Node.js: 24.

Para uma publicação manual, autentique a CLI na sua máquina, vincule esse projeto e use `vercel --prod`. Não coloque tokens no repositório. A configuração do repositório substitui a publicação estática inicial feita durante o protótipo.

## Próximas melhorias

- Completar conteúdos das categorias Plugins e Recursos conforme a curadoria desejada.
- Adicionar regressão visual automatizada em navegador à CI.
- Revisar contraste e tipografia dos painéis internos em telas pequenas.
- Caso o produto cresça, separar os aplicativos em módulos com bundler, preservando testes e a definição explícita de runtime/offline.

A revisão que motivou a consolidação do shell está em [CODE_REVIEW.md](CODE_REVIEW.md).
