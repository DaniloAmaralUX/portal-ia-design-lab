# Portal UI

Biblioteca de fontes para construir o front do Portal IA. O modelo de distribuicao e um registry compativel com shadcn: cada componente entra como codigo no projeto, com suas dependencias. Nao e um pacote npm publicado.

## Colecoes

- Beautiful UI: 21 componentes executaveis no catalogo e exports em `index.ts`.
- Chanh Dai: 47 itens com fontes/documentacao preservados. Wheel Picker e Line Nav ja estao integrados. Theme Toggle Effect e uma colecao de receitas CSS, nao um componente React unico.
- Wigggle: 92 widgets e 26 itens auxiliares capturados do registry. A pagina anuncia 93, mas o registry e as paginas de categoria consultados entregaram 92. Nenhum widget inexistente foi inventado para completar a contagem.

O catalogo visual fica em `/design-system`. Os exemplos Beautiful UI executam localmente; as colecoes Chanh Dai e Wigggle disponibilizam os fontes, dependencias e comandos, com demonstracao na origem. Itens com Next.js, APIs externas ou recursos nativos exigem integracao especifica antes do uso na SPA.

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

As tres paginas usam os exports desta biblioteca. `blocks/PortalBlocks.tsx` compoe as primitivas em blocos reutilizaveis; `prototypes.css` guarda as variantes de apresentacao. Os links levam aos destinos reais do portal. As ilustracoes representam conteudo, sem fotografias de produtos de cafe ou identidade pessoal de terceiros.

## Procedencia

Fontes capturados em 6 de novembro de 2026. Os avisos e licencas de cada origem ficam junto aos arquivos. `fonts/provenance.json` identifica os arquivos tipograficos usados nas referencias. Os ajustes locais incluem tipos estritos, isolamento de CSS, adaptacao das primitivas auxiliares e substituicao de icones Central por Lucide. Alguns efeitos de demonstracao do upstream foram preservados com excecoes de lint localizadas e justificadas; precisam de revisao antes de promover cada componente a uso de produto.

## Ampliação de craft e telas completas

106 itens devl (42 screens, 37 blocks e 27 motion) e 33 Motion Primitives preservados com fontes e dependências locais recursivas no registry. ArticleCards é a variante executável adaptada, usada na home com guias reais. Os demais snapshots são fontes para adaptação, não exports React instalados. A matriz de cobertura e os limites de acesso estão em `docs/CRAFT-LIBRARY-COVERAGE.md`.
