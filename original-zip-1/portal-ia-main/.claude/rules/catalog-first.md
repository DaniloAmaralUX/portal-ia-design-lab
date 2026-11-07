---
paths:
  - "src/data/**"
  - "src/features/catalog/**"
  - "src/features/install/**"
  - "scripts/catalog.ts"
  - "scripts/skills-source.ts"
  - "scripts/downloads.ts"
---

# Catálogo-first: o `skills` é a fonte, o site é a vitrine

```
repositório skills ──► scripts/catalogo.mjs (no skills) ──► scripts/catalog.ts ──► módulos virtuais · /acervo/ · .zip
```

## Princípio

- O repositório `skills` é a fonte única dos plugins e do que os descreve: nome, descrição, versão, título, exemplo, o que entrega, tipos de efeito, área, dono, ciclo de vida, criador, fluxo, `SKILL.md`, arquivos, contribuidores e datas. O site lê e **nunca guarda cópia** nem escreve texto sobre skill ou plugin.
- O build roda o `scripts/catalogo.mjs` do `skills` em `SKILLS_DIR` (o `../skills` por padrão), na ref de `SKILLS_REF`. No CI, essa ref é o `stable`, depois da primeira release. O portal chama o gerador, que mora no `skills` e lê o frontmatter e os manifestos com o mesmo leitor do validador. Não reimplemente essa leitura aqui. Não escreva no código o endereço de clone nem o canal que os comandos mostram. Os dois vêm do `SKILLS_REPO_URL` e do `SKILLS_CHANNEL`, pelo `scripts/build-config.ts` e pelo `virtual:catalog-index`.
- O que o build gera (o `/acervo/`, os .zip, os `.md` das páginas) vai para o `dist/`. Nada disso entra no git.

## O que falta no catálogo se corrige no `skills`

- Se o site precisa de um campo que o `skills` não tem, o campo entra no esquema e no validador de lá (`CONTRIBUTING.md` do `skills`), e o gerador o devolve. Texto de skill ou de plugin escrito em `src/` é erro.
- O gerador falha com os achados se o `skills` não passa no validador. Conserte lá o erro nos dados, e o portal só rebuilda.
- Skill ou plugin novo no `skills` vira página sozinho. O `machine-readable.test.ts` confere que cada um do catálogo tem a sua, e os testes de navegador abrem todas.

## O que o site escreve é só o que é do site

- `areas.ts` guarda o nome, o público e a chamada de cada área. Qual plugin é de qual área vem do `metadata.area`.
- `effect-kinds.ts` e `lifecycle.ts` guardam o rótulo e o significado de cada valor fechado do esquema. Valor novo no esquema do `skills` pede o rótulo aqui, e o tipo em `types.ts` o cobra.
- Os comandos de instalação saem todos de `src/lib/commands.ts`, e o nome do .zip, de `src/shared/zip-name.ts`.
