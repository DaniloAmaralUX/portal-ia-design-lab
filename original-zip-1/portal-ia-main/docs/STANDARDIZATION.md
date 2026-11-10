# Padronização do portal

Branch: `polish/jakub-emil`. A versão-base de handoff continua preservada em `handoff/portal-original-ui-audit`.

## Resultado

Os textos, títulos, ordem das seções, tipografia e grids originais permanecem. A galeria e a rota `/design-system` foram retiradas, assim como os links para ela nos cabeçalhos, rodapés e protótipos. A biblioteca de fontes e componentes continua no código para uso dos desenvolvedores, sem uma seção de catálogo no portal.

## Contratos comuns

| Antes | Depois | Motivo |
| --- | --- | --- |
| Botões de ícone repetiam tamanho, foco, tom e pressão | `components/ui/icon-button.tsx`, com `label` obrigatório, tamanhos e tons definidos | Tema, busca, menu, GitHub, cópia, fechamento e pausa usam a mesma base |
| `Button` e controles de ícone tinham pressão e tempos diferentes | Ambos usam `press`, com `--duration-interaction` e `--ease-out-soft` | Um contrato para resposta ao clique, teclado e movimento reduzido |
| Cartões restantes ainda duplicavam hover com elevação | `interactive-surface` nos cartões de catálogo, notícias, atalhos, método e ferramentas | Mantém a leitura estável e centraliza os estados de superfície |
| Keyframe `pop-in` da Beautiful UI podia substituir o do portal | Variante com namespace `beautiful-pop-in` | Preserva a referência sem alterar o movimento das telas principais |
| Fontes da referência dependiam de classes geradas por outro ambiente | `beautiful/adapter.css` mapeia as variáveis para fontes locais | Evita fallback silencioso nos protótipos internos |
| Pausa durante o reinício do terminal podia manter `opacity-0` | A conversa permanece visível quando a demonstração está pausada ou retida | Evita uma demonstração em branco |
| Botão de pausa tinha ação variável e `aria-pressed` simultaneamente | Ação com nome variável, sem estado de toggle contraditório | Mantém o mesmo contrato acessível do botão de tema |

`src/components/ui/` é a fonte das primitivas; `src/design-system/primitives.ts` exporta essas mesmas implementações e seus tipos. Não há cópia paralela de Button, Badge ou Card para as telas do portal. Coleções preservadas como Beautiful, Mainline e Chanh Dai têm procedência e APIs próprias; não são promovidas automaticamente a componentes de produção.

## Prévia pública

O handler da prévia Vercel usa acesso público, sem pedir nem ler uma senha. A entrada antiga `/entrar` redireciona para a home. A prévia continua sem publicação de conteúdo, usa perfil demonstrativo e mantém cabeçalhos de segurança e `noindex`. O BFF institucional em `bff/` e seu login Microsoft não foram alterados.

O empacotamento limpa somente a pasta de cliente gerada dentro de `.prototype-vercel` antes de copiar o build. Isso evita que páginas e assets removidos sobrevivam a um deploy. O caminho absoluto é validado antes dessa limpeza; credenciais e metadados locais da Vercel não são tocados.

## Validação

- Tipos e lint aprovados.
- Build aprovado: 202 arquivos pré-comprimidos, 3,8 MB de saída e 1,1 MB com Brotli. O build anterior tinha 12,8 MB e 2,8 MB com Brotli. Estes valores são do conjunto de saída, não da carga inicial de uma página.
- 21 testes Playwright aprovados: navegação responsiva, busca, tema, cópia, movimento reduzido, personalização, ausência da galeria, foco do menu e pausa durante o reinício.
- Cinco testes do gateway aprovados, incluindo a abertura pública sem cookies ou senha, bloqueio de publicação e validação de caminhos.
- Revisão de 10 telas em desktop e celular: sem overflow horizontal ou erros de JavaScript; seis varreduras axe de conteúdo principal sem violações detectadas.
- A suíte de unidade mantém 449 aprovados, 24 falhas e 36 ignorados. O catálogo privado e as limitações anteriores de infraestrutura continuam impedindo afirmar que o gate completo passou.

As fontes dos testes de estrutura agora ignoram somente diretórios vazios, que o Git não versiona. Diretórios com conteúdo continuam exigindo `index.ts` como antes. Um diretório vazio da antiga galeria pode permanecer no checkout local sem representar uma feature publicada.

## Escopo da revisão

Revisão aplicada a código, estados e componentes compartilhados das telas principais. Não se declara validação de cada receita externa preservada no registry, de cada animação legada, de leitores de tela ou de hardware gráfico físico. Essas referências mantêm suas licenças e limites documentados.
