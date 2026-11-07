O Spec-Driven Development (SDD) inverte a ordem do desenvolvimento com IA: a especificação vem antes do código, uma pessoa a aprova, e só então o agente implementa. A especificação aprovada vira a fonte da verdade, e o review compara o código que a IA gera com o que ela exige.

## O ciclo em quatro passos

1. **Especificar.** Uma pessoa escreve o que o sistema deve fazer, no vocabulário do negócio, em arquivos versionados no repositório.
2. **Planejar.** O agente transforma a especificação num plano com decisões e tarefas pequenas, cada uma ligada ao requisito que entrega.
3. **Aprovar.** Uma pessoa revisa o plano antes de existir código. Nenhuma fase avança sem a aprovação da anterior.
4. **Implementar e conferir.** O agente executa as tarefas, e o review confere o resultado contra a especificação.

## Três guias de implementação

O ciclo é o mesmo nas três ferramentas. O que muda é o passo a passo de cada uma: a instalação, os comandos, os artefatos que cada fase gera e a configuração do workspace.

- [SDD com Compozy](/metodo/compozy). O pipeline do PBI ao código revisado, com o `compozy` e as skills `cy-*`: o workspace de quatro repositórios, o `CLAUDE.md`, as rules por path, o daemon com a interface web e uma feature de ponta a ponta.
- [SDD com OpenSpec](/metodo/open-spec). O ciclo de uma change com os comandos `/opsx:*`: a instalação da CLI, o prompt-mestre, o `config.yaml`, os quatro artefatos de uma change e o subagente de execução.
- [SDD com Spec Kit](/metodo/spec-kit). O ciclo de uma feature com os comandos `/speckit-*`: a CLI `specify`, a constituição do projeto, o prompt-mestre, um comando por artefato (spec, plano e tarefas), a implementação lote a lote e o modo autônomo.

## Antes de escolher

Para saber por que adotar o SDD, o que a indústria já pratica, como governar os gates e como medir o ganho, leia [Por que utilizar o SDD?](/metodo/por-que-utilizar-o-sdd).
