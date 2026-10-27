# Handoff técnico

Entregue em 24 de outubro de 2026. Produção: https://mesa-dev-desktop.vercel.app

## Arquitetura

A aplicação roda no navegador com HTML, CSS e JavaScript. Node.js é necessário apenas para preparar dados, compilar e testar. Não há backend nem dependências de runtime servidas por CDN.

`scripts/build.cjs` combina as views e os dados em `src/index.template.html`. Os placeholders são resolvidos em uma única passagem, evitando interpretar conteúdo dos documentos como parte do template. JSON é escapado antes da inclusão em tags `script`.

Ordem dos scripts: `window-manager` → `desktop` → `interfaces` → `tools` → `glass-icons`. Eles compartilham o escopo de um script clássico para manter a abertura offline do HTML; não converta um arquivo isolado para módulo sem ajustar o build e seus consumidores.

## Donos de estado e de estilo

- `window-manager.js`: foco, janela ativa, camadas e limites de movimentação.
- `desktop.js`: seleção das categorias, histórico e estado da janela de biblioteca.
- `interfaces.js`: catálogo, busca, filtros, detalhes e exportação das skills.
- `tools.js`: os três aplicativos e seus estados locais.
- O fundo usa `src/assets/backgrounds/elliott-engelmann-DjlKxYFJlTc-unsplash.jpg`, fornecido pelo usuário em 27 de outubro de 2026. A fotografia é incorporada ao HTML e preenche a tela com `object-fit: cover`, centralizada. `strands.js` e seus shaders originais permanecem arquivados, sem participar do build nem consumir GPU.
- `glass-icons.js`: adapta o renderer Glass Icons do React Bits aos seis botões existentes. São dois canvases compartilhados, um por grupo, com redraw apenas durante interação ou resize. Os shaders, gradientes e cálculos ópticos originais são preservados. Rótulos ficam sempre visíveis; não há intro, e ações por teclado não disparam movimento decorativo. Sem WebGL, o fallback usa CSS. Origem e revisão em `vendor/react-bits/glass-icons/source.txt`.
- `desktop-shell.css`: única fonte para geometria de janelas, dock e área de trabalho. O dock tem espaço reservado para evitar sobreposição com rodapés.
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
