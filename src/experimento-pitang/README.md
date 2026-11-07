# Experimento visual · Portal de IA da Pitang

Protótipo independente inspirado em https://oklch.fyi/, observado em 4 de novembro de 2026. Os prints em `referencias/` registram a primeira dobra das principais telas públicas e um detalhe de paleta; não são uma captura exaustiva de todos os estados, interações ou conteúdo abaixo da dobra. Foram mantidos apenas para estudo visual.

## Arquitetura observada

- Início educativo, com introdução, exemplos visuais e chamadas para criar ou explorar.
- Navegação lateral persistente no desktop e menu recolhido em telas compactas.
- Ferramentas individuais: criar, converter, paletas, gradientes, gamut e conversão em lote.
- Lista de paletas leva a uma página de detalhe; itens salvos exigem entrada na conta.
- Cabeçalho global com tema, feedback e entrada; controles e cartões discretos sobre fundo claro.

## Experimento

O protótipo adapta essa estrutura para início, skills, ferramentas, prompts, recursos, casos de uso, aprendizado e salvos. Busca, filtros, navegação, detalhes e tema são locais; os conteúdos são exemplos e não estão conectados ao portal oficial. A área de salvos não implementa persistência.

Para abrir a partir da raiz do projeto: `python -m http.server 4190 --bind 127.0.0.1 --directory src/experimento-pitang` e acesse `http://127.0.0.1:4190/`.
