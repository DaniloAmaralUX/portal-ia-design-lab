# Recursos e cobertura do Portal UI

Revisão: 2026-11-06. Fontes no código não significam integração em produção.

## Recursos enviados e situação

| Recurso | Papel | Situação no projeto |
|---|---|---|
| Beautiful UI | Interfaces de agentes | 21 componentes executáveis; registry de suporte reparado |
| Chanh Dai | Controles e navegação | 47 itens preservados; Wheel Picker e Line Nav executáveis |
| Wigggle UI | Widgets | 92 widgets + 26 auxiliares no registry; instalação sob demanda |
| devl.dev | Screens, blocks, motion | 106 itens preservados, incluindo dependências locais; Article Cards adaptado na home |
| Motion Primitives Pro | Blocks e motion premium | URL Pro consultada, resposta HTTP 403; não confundir com os 33 fontes da coleção gratuita |
| Motion Primitives gratuito | Motion | 33 fontes com auxiliares; não montados automaticamente em todas as telas |
| React Bits | Efeitos e superfícies | SpotlightCard local; efeitos decorativos adicionais não são requisito funcional |
| loading.dev | Espera real | loading-dev instalado; Arc no indicador de navegação |
| Libraries.dev/voice | Visualização de áudio | voice-glow instalado; sem transcrição, portanto fora da busca textual |
| Shadcnblocks/Mainline | Estrutura de páginas | Fontes portados no experimento Mainline; preservar a aplicação principal |
| Shadcncraft | Blocks e telas | Referência consultada; código Pro exige acesso; não foi copiado |
| PaceUI | Blocks e MCP | Documentação consultada; integração MCP autenticada não disponível nesta sessão |
| React Bits Pro | Templates e blocks | Catálogo de referência; sem acesso aos fontes Pro nesta sessão |
| DesEngs / All Shadcn | Diretórios | Recursos de descoberta, não bibliotecas de runtime |
| OKLCH / Corner Radii | Cor e geometria | Ferramentas de especificação; não adicionam screens |
| UI Skills / Emil / Jakub | Critérios de implementação | Skills locais e CLI; sem biblioteca visual de runtime |
| Mobbin / Grok / TIDAL | Referência visual | Prints e referências; não fornecem componentes React da aplicação |
| Fumadocs | Documentação | Referência de estrutura; não migrar o router da SPA para instalar outro framework |
| Mesurer | Inspeção | Pacote já instalado; ferramenta de desenvolvimento |
| Backgrounds Supply / ASCII Magic | Assets | Opcionais para direção de arte, não necessários à navegação ou leitura |
| Nove / Aspect / Nim | Templates | Referências; sem afirmar que os fontes comerciais foram obtidos |

## Cobertura das telas necessárias

| Tipo de tela | Implementação atual | Fonte adicional pronta para adaptação |
|---|---|---|
| Home e descoberta | HomePage, EntryPoints, GuideResources | devl Article Cards, Drive |
| Navegação responsiva | PageFrame, DocsLayout, PortalNav, Sheet | devl Inset Shell, Hairline Shell |
| Busca e catálogo | ExplorePage, SkillCard, filtros de URL | devl Folder View, Help Centre |
| Academy e trilhas | AcademyPage, RoleCard, progresso real | devl First Run, Article Cards |
| Guia e capítulo | GuidePage, ChapterPage, sumário | devl Help Centre |
| Ferramenta e instalação | ToolPage, ToolInstallBar, CopyButton | Mainline features; Chanh Dai Code Block Command |
| Novidades e treinamentos | WhatsNewSection, treinamento e intervalos | devl Article Cards |
| Publicação | formulários existentes de treinamento e intervalo | devl formulário e onboarding como variantes de referência |
| Carregando, vazio e erro | NavigationProgress, Skeleton, EmptyState, ErrorPage | loading.dev, devl estados e feedback |
| Conta e acesso | gateway protegido, conta Microsoft no BFF | devl Auth como referência; autenticação existente preservada |

Todas essas famílias têm código local. Os snapshots adicionais estão disponíveis em `/design-system` e podem ser baixados com seus fontes. Exemplos completos podem conter dados demonstrativos, Base UI/coss ou Next.js: exigem adaptar dependências e ligar dados reais antes de substituir uma tela. Não executar ações simuladas como se fossem serviços reais.

## Uso

- Executável adaptado: `import { ArticleCards } from '@/design-system/devl/ArticleCards'`.
- Fontes de telas: `src/design-system/registry/devl/*.json`.
- Motion: `src/design-system/registry/motion-primitives/*.json`.
- O campo `portalSource` registra origem, revisão e imports ainda não resolvidos.
- Licenças MIT preservadas junto de cada coleção. Pacotes Pro permanecem explicitamente sem fonte, até acesso autenticado.
