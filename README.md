# Portal IA Design Lab

Uma mesa de ferramentas para quem cria interfaces, com navegação por janelas e conteúdo em português.

**Produção:** [mesa-dev-desktop.vercel.app](https://mesa-dev-desktop.vercel.app)

## O que funciona

- **Skills → INTERFACES:** 16 skills de Jakub Kréhel; busca, categorias, comandos de instalação, cópia do documento original e ZIPs completos.
- **Temas:** 42 presets do tweakcn, modos claro e escuro, cores, tipografia, bordas, sombras, desfazer/refazer, salvamento local e exportação CSS para Tailwind CSS 4.
- **Blocos:** três composições adaptadas do Tailark; edição de conteúdo, prévia de computador/celular e exportação HTML autossuficiente.
- **Ícones:** 90 SVGs Lucide com busca em português, ajuste de tamanho, cor e espessura, cópia e download.
- **Desktop:** seleção, clique duplo, teclado, histórico, busca, movimentação de janelas, minimizar, ampliar e restaurar.
- **Glass Icons:** seis atalhos com placas coloridas, refração e movimento do React Bits; símbolos Lucide, rótulos permanentes e fallback sem GPU.
- **Background:** fotografia de Elliott Engelmann com Aero Shards em uma camada transparente, laranja `#f97316`, velocidade `0.87` e opacidade de 25%. Sem captura de cliques; a foto permanece quando WebGPU não está disponível ou há preferência por movimento/transparência reduzidos.

As categorias Plugins e Recursos ainda não têm conteúdo cadastrado. As ferramentas são adaptações locais de partes dos projetos de origem; não incluem seus serviços de nuvem, contas ou funcionalidades de IA.

## Rodar localmente

Requer **Node.js 24**. Não requer Python, banco, API key ou arquivos fora deste repositório.

```sh
npm ci --ignore-scripts
npm run dev
```

Abra [127.0.0.1:3000](http://127.0.0.1:3000). Alterações em `src/` e `vendor/` recompilam e recarregam a prévia. Para outra porta, defina a variável de ambiente `PORT`.

## Build e testes

```sh
npm run build
npm test
```

O build gera apenas `dist/index.html`, o ZIP da coleção e `dist/LICENSES.txt`. O HTML incorpora scripts, estilos, ícones e dados, podendo ser aberto offline. `npm run preview` serve esse build sem recompilar.

A suíte inclui 45 cenários de DOM/integração e a compilação de um tema exportado no Tailwind CSS 4. **jsdom não renderiza layout, WebGL ou WebGPU.** Mudanças visuais precisam de conferência em navegador real; veja [o handoff](docs/HANDOFF.md).

## Estrutura

```text
src/
  index.template.html     Estrutura da página
  assets/icons/           Ícones do desktop e do dock
  data/interfaces.json    Skills, documentos e ZIPs incorporados
  scripts/                Janelas, catálogo, ferramentas e Strands
  styles/                 Base, biblioteca, ferramentas, fundo e shell
  views/                  Conteúdo HTML das janelas
scripts/                  Preparação dos dados, build e servidor local
tests/                    Regressões de comportamento e exportação
vendor/                   Fontes selecionadas, revisões e licenças de terceiros
docs/                     Arquitetura, handoff e revisão de código
```

## Publicação

O `vercel.json` configura build com `npm run build` e saída em `dist/`. A Vercel deve usar a raiz deste repositório como **Root Directory** e Node.js 24.

O projeto existente é `mesa-dev-desktop`, no escopo `danilos-projects-94eff717`. Não é necessário recriar o projeto ou adicionar credenciais ao código. A integração Git pode publicar automaticamente a branch `main` quando conectada na Vercel.

## Origem e licenças

| Componente | Origem | Licença |
| --- | --- | --- |
| Presets de temas | [tweakcn](https://github.com/jnsahaj/tweakcn) | Apache 2.0 |
| Composições de página | [Tailark](https://github.com/tailark/blocks) | MIT |
| Biblioteca de SVGs | [Lucide](https://github.com/lucide-icons/lucide) | ISC / MIT |
| Ícones de aplicativos | [Fluent System Icons](https://github.com/microsoft/fluentui-system-icons) | MIT |
| Aero Shards, Glass Icons e Strands arquivado | [React Bits](https://github.com/DavidHDev/react-bits) | MIT + Commons Clause |
| Renderer WebGPU | [vgpu](https://github.com/vercel-labs/vgpu) | MIT |

As revisões utilizadas estão em `vendor/revisions.json`, `vendor/fluent/sources.json` e nos arquivos `source.txt` em `vendor/react-bits/`. O build preserva os avisos de licença. As licenças das skills acompanham os respectivos ZIPs. Não se atribui uma licença global a todo o conjunto: respeite os termos de cada componente.
