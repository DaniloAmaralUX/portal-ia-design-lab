# Portal IA: experimento visual

Aplicado na copia original-zip-1/portal-ia-main. Previa: http://127.0.0.1:5192/.

## Direção atual: Libraries.dev

A referência principal passou a ser https://libraries.dev/voice, por pedido do usuário. Especificação medida e decisões em [docs/LIBRARIES-DESIGN.md](docs/LIBRARIES-DESIGN.md). O grid de 200 px + 56 px + conteúdo, a navegação lateral, as superfícies e a escala de texto seguem essa direção. Os recursos abaixo continuam sendo componentes de apoio.

A home tem modos Explorar e Instalar, com seleção por setas, Home e End. A busca preserva o texto ao trocar de modo. VoiceBeam, do pacote oficial voice-glow, visualiza o microfone somente após uma ação explícita. O stream é local, não é gravado nem transcrito, e é liberado ao sair do modo Explorar ou ocultar a aba.

Morphicons transforma os ícones de tema, cópia, conclusão e expansão. Torph apresenta as confirmações textuais. A navegação usa o destaque medido de Fluid Functionalism, com links e foco nativos. Ações de teclado são imediatas. NumberFlow e o progresso líquido continuam ligados aos dados reais.

Em desenvolvimento, **Ajustar movimento** abre o DialKit: rigidez, amortecimento, duração, deslocamento e magnetismo alteram os componentes em tempo real. Os limites evitam deslocamentos amplos. Produção usa os valores fixos de `src/components/craft/craft-context.ts`; o painel e o Mesurer não são renderizados. **Medir interface** continua abrindo o Mesurer.

Licenças e fontes: `src/components/libraries/`, `src/components/fluid/`, além das procedências já registradas abaixo. Não foram copiados a marca, a fonte comercial Saans nem recursos pagos do Studio. A implementação mantém as fontes locais do portal.

## Recursos usados

- https://devl.dev/screens: composicao de pagina de produto e documentacao, hierarquia compacta e separacao entre conteudo principal e contexto. A navegacao e as rotas existentes continuam sendo do portal.
- https://www.beautifului.dev/: codigo e composicoes obtidos por Copy code, adaptados em src/components/beautiful-ui. Context Cards nos acessos, Prompt Bar na busca, Tool Chips nas secoes, Task Rows na instalacao e Code Block nos comandos. Exemplos substituidos por conteudo do portal; estados artificiais de processamento e resultados ficticios nao foram incorporados. A copia continua usando o fallback de permissao existente.
- https://wigggle-ui.vercel.app/docs: Widget obtido do registro oficial @wigggle-ui/widget. Os widgets de papel e progresso usam os dados e callbacks existentes. Tamanhos fixos substituidos por dimensoes responsivas no ponto de uso. Licenca preservada em src/components/wigggle/LICENSE.md.
- https://loading.dev/spinners/arc: Arc do pacote loading-dev no indicador de navegacao, exibido depois de 250 ms para evitar piscar em transicoes rapidas.
- https://devl.dev/: Plant Progress, Liquid Progress e Magnetic obtidos do repositorio oficial. Proveniencia e licenca em src/components/devl. A planta e as barras recebem somente o progresso real dos cursos; os rotulos foram traduzidos.
- https://desengs.com/: diretorio usado para localizar os recursos acima e os seguintes refinamentos: NumberFlow (https://number-flow.barvian.me/) na contagem do widget, Anatomy of AI Input (https://ibelick.com/anatomy-ai-input) no comportamento do campo, Interface Cheat Sheet (https://interfaces.dev/cheat-sheet) e Corner Radii (https://corner-radii.xyz/) na composicao dos controles.

## Guardrails de interface

Usar o sistema existente de tokens e componentes. Manter foco visivel, nomes acessiveis, campos com rotulo, contrastes de texto, estados de tema e navegacao por teclado. Nao adicionar dados ficticios, animacoes de hover que movem o layout ou dependencias de backend para efeitos visuais. Manter o texto visivel com movimento reduzido.

MotionConfig respeita a preferencia de movimento reduzido. A planta pausa fora da tela; numeros mudam com o progresso real. Magnetic atua apenas com mouse e tem deslocamento limitado a 4 px. A troca de papel tem transicao curta, e a abertura das etapas de instalacao usa altura animada com alternativa instantanea para movimento reduzido. Limpar a busca devolve o foco ao campo.

## Mesurer

Disponivel apenas em desenvolvimento. Clique em Medir interface, no canto inferior direito, para abrir o Mesurer e usar medidas, cores, guias e anotacoes. Fechar inspetor remove a ferramenta da tela. Os atalhos globais estao desativados para preservar os atalhos do portal. O estado salvo da ferramenta pode prevalecer sobre a posicao inicial.

## Limite da previa

O catalogo privado de skills nao esta disponivel neste checkout. A previa usa o fixture separado e vazio, sem inventar registros. Testes que exigem skills ou plugins reais continuam dependendo do repositorio privado.

## Validacao desta etapa

Build de producao concluido. 32 testes de navegador de cabecalho, home, leitura e interacoes de craft passaram. A pagina inicial passou no axe nos temas claro e escuro. Os testes de estrutura e do roteiro de terminal passaram. A verificacao completa do catalogo continua dependente do repositorio privado.

Foi validado tambem o viewport de 390 px e 1280 px com movimento reduzido, sem overflow horizontal nem erros de pagina. A suite de unidade completa teve 454 testes aprovados, 36 ignorados e 24 falhas ligadas ao catalogo privado ausente; essa limitacao nao foi mascarada com dados inventados.
