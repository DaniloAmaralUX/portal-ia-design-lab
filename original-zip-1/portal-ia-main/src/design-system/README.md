# Portal UI

Biblioteca de fontes para construir o front do Portal IA. O modelo de distribuicao e um registry compativel com shadcn: cada componente entra como codigo no projeto, com suas dependencias. Nao e um pacote npm publicado.

## Padrão ativo do portal

A fonte das primitivas é `src/components/ui/`, conforme as regras de arquitetura. `@/design-system/primitives` é a API pública das mesmas implementações, com tipos exportados; não é uma cópia dos componentes.

A biblioteca permanece interna ao código. A seção e a rota `/design-system` foram removidas do portal a pedido do responsável. O tema do cabeçalho controla os mesmos tokens usados nas telas.

```tsx
import { Button, IconButton, Card, Badge } from '@/design-system/primitives';
```

- `Button`: ação com texto; variantes `default`, `secondary`, `outline`, `inverse`, `ghost`, `link`.
- `IconButton`: exige `label`; tamanhos `sm` (32 px), `default` (36 px), `lg` (40 px); tons `default` e `terminal`. `asChild` preserva links como links. Use `disabled` somente em controles nativos.
- `CopyButton`: controla área de transferência e feedback, usando `IconButton` internamente.
- `Card`: superfície estática. `interactive-surface` é o tratamento comum de cartões que contêm uma ação; não transforma um `div` em botão.
- `Badge`: informação estática. Não use como botão sem trocar a semântica.
- `Sheet`: diálogo Radix com foco e fechamento compartilhados.
- `Container`, `Kbd`, `Skeleton`, `Progress` e `ScrollableTable`: primitivas auxiliares exportadas pela mesma API.

Cores, tipografia e raios usam `globals.css`; o preset ativo em `chanhdai-portal.css` altera as superfícies neutras e preserva os papéis semânticos. Interações usam `--duration-interaction` (150 ms) e `--ease-out-soft`. A lista de durações em `lib/motion.ts` é verificada contra o CSS pelo teste existente de tokens.

## Colecoes

- Beautiful UI: 21 componentes React preservados e exports em `index.ts`.
- Chanh Dai: 47 itens com fontes/documentacao preservados. Wheel Picker e Line Nav ja estao integrados. Theme Toggle Effect e uma colecao de receitas CSS, nao um componente React unico.
- Wigggle: 92 widgets e 26 itens auxiliares capturados do registry. A pagina anuncia 93, mas o registry e as paginas de categoria consultados entregaram 92. Nenhum widget inexistente foi inventado para completar a contagem.

Não há catálogo visual publicado no portal. As coleções preservam os fontes, dependências e comandos para uso interno, com demonstração na origem. Itens com Next.js, APIs externas ou recursos nativos exigem integracao especifica antes do uso na SPA.

## Usar componentes integrados

```tsx
import { Button, Card, BeautifulProvider, BeautifulCodeBlock } from '@/design-system';

<Card>
  <BeautifulProvider>
    <BeautifulCodeBlock filename="contexto.md" lines={['# Meu projeto']} />
  </BeautifulProvider>
</Card>
```

Os exports de Beautiful UI recebem o prefixo `Beautiful` para nao colidir com os componentes existentes. `BeautifulProvider` aplica os tokens e estilos isolados da colecao. As interacoes com dados de exemplo nao executam agentes reais.

## Instalar mais fontes

```sh
npx shadcn@latest add @ncdai/wheel-picker
npx shadcn@latest add @ncdai/line-nav
npx shadcn@latest add @wigggleui/calendar-sm-01
```

`components.json` registra os namespaces oficiais. Os snapshots locais ficam em `registry/beautiful`, `registry/chanhdai` e `registry/wigggle`:

```sh
npx shadcn@latest add ./src/design-system/registry/beautiful/loading-state.json
```

Nao use `--overwrite` indiscriminadamente. Revise as APIs antes de substituir uma primitiva existente. As receitas de transicao de tema sao para leitura e escolha do efeito antes da integracao.

## Variantes por funcao

A origem e parte da identidade do componente. Copy Button, Icon Swap, Text Swap, Theme Switcher, Code Block Command, Line Nav e TOC Minimap sao relacionados aos componentes existentes como variantes, preservando os fontes. Mesma funcao nao implica API intercambiavel. O arquivo `catalog.ts` guarda as familias; nao renomeie uma implementacao sobre outra silenciosamente.

## Prototipos

- `/prototipos/craft`: composicao de marketing baseada no Shadcncraft.
- `/prototipos/chanhdai`: coluna de 768px, linhas estruturais e navegacao de secoes.
- `/prototipos/nove`: composicao de loja com caminhos, produtos visuais e comparacao.

As tres paginas usam os exports desta biblioteca. os arquivos de `blocks/`, exportados em `blocks/index.ts`, compõem as primitivas em blocos reutilizáveis; `prototypes.css` guarda as variantes de apresentacao. Os links levam aos destinos reais do portal. As ilustracoes representam conteudo, sem fotografias de produtos de cafe ou identidade pessoal de terceiros.

## Procedencia

Fontes capturados em 6 de novembro de 2026. Os avisos e licencas de cada origem ficam junto aos arquivos. `fonts/provenance.json` identifica os arquivos tipograficos usados nas referencias. Os ajustes locais incluem tipos estritos, isolamento de CSS, adaptacao das primitivas auxiliares e substituicao de icones Central por Lucide. Alguns efeitos de demonstracao do upstream foram preservados com excecoes de lint localizadas e justificadas; precisam de revisao antes de promover cada componente a uso de produto.

## Isolamento de CSS

Na adaptacao Beautiful UI, o keyframe `pop-in` e suas referencias inline usam o nome `beautiful-pop-in`, para preservar o efeito original sem colidir com o keyframe do portal. Os snapshots do registry e a licenca da origem permanecem preservados.

## Ampliação de craft e telas completas

106 itens devl (42 screens, 37 blocks e 27 motion) e 33 Motion Primitives preservados com fontes e dependências locais recursivas no registry. ArticleCards é uma variante executável adaptada, disponível para composição; ela não faz parte da home original restaurada. Os demais snapshots são fontes para adaptação, não exports React instalados. A matriz de cobertura e os limites de acesso estão em `../../docs/CRAFT-LIBRARY-COVERAGE.md`.
