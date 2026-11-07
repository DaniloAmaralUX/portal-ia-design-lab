# Publicação do mapa Desengs

- URL de produção: https://desengs-resource-ranking.vercel.app
- Projeto Vercel: `desengs-resource-ranking`
- Escopo: `danilos-projects-94eff717`
- Diretório publicado: `src/desengs-ranking/`
- Tipo: HTML estático, sem dependências de runtime ou comando de build remoto.
- Snapshot da pesquisa: 4 de novembro de 2026; as métricas não atualizam automaticamente.

Para regenerar o site a partir das evidências locais:

```powershell
python research/desengs/build_site.py
```

Para republicar, com a CLI autenticada e o projeto vinculado localmente:

```powershell
cd src/desengs-ranking
npx vercel@latest deploy --prod --scope danilos-projects-94eff717
```

O projeto está desconectado do GitHub para que pushes no repositório da aplicação não publiquem a raiz indevidamente. As configurações locais de vínculo ficam em `.vercel/`, ignorado pelo Git. Nenhum token é necessário no código.

Validação realizada: `npm ci`, `npm test` (45 cenários de integração e compilação do CSS exportado), prévia visual a 390 px e abertura do site publicado em navegador real. Página inicial, JSON com 78 recursos, CSV e relatório Markdown retornaram HTTP 200 sem autenticação.
