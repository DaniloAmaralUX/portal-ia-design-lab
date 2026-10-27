# Desenvolvimento

- Leia `docs/HANDOFF.md` antes de alterar a arquitetura.
- Node.js 24. Execute `npm ci` e `npm test`.
- Edite arquivos em `src/`; `dist/` é gerado e não deve ser editado.
- Preserve a ordem dos scripts no build: o gerenciador de janelas precede seus consumidores.
- O shell é a única fonte de geometria, camadas e área reservada ao dock.
- Testes jsdom não validam pixels, GPU, layout ou APIs nativas do navegador. Verifique visualmente alterações de CSS e WebGL em um navegador real.
- Preserve licenças, procedência e os shaders originais do Strands.
- Nunca versione `.env*`, `.vercel/`, tokens ou dados locais do usuário.
