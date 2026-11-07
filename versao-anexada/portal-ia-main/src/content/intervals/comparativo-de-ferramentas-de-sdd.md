---
title: Comparativo de ferramentas de SDD
date: 2026-10-08
summary: Diego Luna, do Labs, comparou o Claude Code no fluxo padrão com seis métodos de SDD em seis tarefas, medindo tempo, tokens e qualidade.
video: https://pitangconsult-my.sharepoint.com/personal/luana_leao_pitang_com/_layouts/15/embed.aspx?UniqueId=b9afc4bf-21ad-4807-9de1-4174077eaaa0&embed=%7B%22ust%22%3Atrue%7D&referrer=StreamWebApp&referrerScenario=EmbedDialog.Create
area: engenharia
minutes: 76
---

Especificação antes do código compensa em tarefas pequenas e médias? Neste intervalo técnico, Diego Luna, do Labs, apresentou um estudo que comparou o Claude Code no fluxo padrão com ferramentas de desenvolvimento guiado por especificação (SDD) do mercado e com abordagens criadas na Pitang.

## O estudo

- Seis métodos de SDD e um baseline, em seis tarefas, medidos em tempo de execução, consumo de tokens e qualidade da entrega.
- Na terceira versão do estudo, cada tarefa rodou três vezes, com o processo automatizado e as versões das ferramentas fixadas.
- A qualidade passou por revisão cega e por avaliação de IA, e a apresentação discutiu o quanto cada uma é confiável.

## O que os resultados mostraram

- O baseline enxuto, que também é uma forma de SDD, gastou menos tokens, foi mais rápido e entregou boa qualidade nas tarefas avaliadas.
- As ferramentas de SDD ficaram próximas entre si. O que mais pesa é seguir um processo bem definido, e não a ferramenta escolhida.
- Para bug pequeno e refatoração simples, o baseline tende a servir melhor. Para feature maior ou com mais contexto, um fluxo de SDD estruturado traz mais valor.
- Uma especificação detalhada, com escopo, restrições e definição de pronto, reduz perguntas, retrabalho e falhas na implementação.

Os resultados são preliminares. O estudo ainda pode crescer com mais tarefas e outros modelos.

## Para ir além do vídeo

O Método tem o resumo do ciclo SDD e o passo a passo de cada ferramenta que a Pitang usa:

- [Guia SDD](/metodo/sdd): o ciclo, do PBI ao código revisado.
- [SDD com Compozy](/metodo/compozy)
- [SDD com OpenSpec](/metodo/open-spec)
- [SDD com Spec Kit](/metodo/spec-kit)
