# Protótipo protegido na Vercel

URL: https://portal-ia-craft-preview.vercel.app
Projeto: `portal-ia-craft-preview`, escopo `danilos-projects-94eff717`.

Esta publicação serve o experimento visual, por pedido do usuário, com uma senha compartilhada no próprio protótipo. O BFF e o login Microsoft da aplicação original não foram alterados. O catálogo privado não faz parte deste checkout; a prévia conserva o catálogo vazio documentado em `DESIGN.md`.

## Proteção

- Senha em `PROTOTYPE_PASSWORD`, configurada no ambiente de produção da Vercel. Nenhuma senha fica no código, no HTML ou neste documento.
- Verificação no servidor e cookie assinado, HttpOnly, Secure e SameSite=Lax, válido por 8 horas. Trocar a senha e republicar invalida as assinaturas anteriores.
- A função protege HTML, JavaScript, CSS, fontes, documentos Markdown e `/api/me`. O build completo fica em `private-client/`, incluído somente no pacote da função, fora do diretório de arquivos estáticos públicos.
- Respostas privadas não são armazenadas em cache pelo navegador ou pela CDN. A sessão é removida do navegador ao sair.
- A prévia é somente de leitura. O perfil é identificado como revisão do protótipo e não recebe permissão de publicar.
- Ausência de senha, ou senha configurada com menos de 20 caracteres, fecha o acesso com HTTP 503.
- O diretório público contém apenas robots.txt, proibindo indexação. Os demais caminhos passam pelo gateway.

## Código e publicação

Fontes do gateway e da tela: `src/prototype-host/`.
Preparação da publicação: `scripts/build-prototype.mjs`.
Saída gerada e vínculo local: `.prototype-vercel/`, ignorado pelo Git.

Após preparar o build da aplicação com a configuração de prévia documentada:

```powershell
node --test src/prototype-host/gateway.test.mjs
node scripts/build-prototype.mjs
cd .prototype-vercel
npx vercel@latest deploy --prod --scope danilos-projects-94eff717
```

Para trocar a senha, altere `PROTOTYPE_PASSWORD` nas configurações do projeto Vercel e faça uma nova publicação. Não coloque o valor em argumentos de comando, arquivos de configuração ou commits.

## Validação

Os quatro testes de proteção passaram: acesso fechado a páginas e arquivos, recusa de senha incorreta e de origem diferente, abertura com senha válida e recusa de cookie alterado, além de retorno seguro e falha fechada sem configuração. A senha correta, a senha incorreta e os caminhos diretos dos arquivos também foram verificados no endereço publicado.
## Aplicação dos blocos no portal — 7 de novembro de 2026

A publicação foi atualizada com os componentes da DS nas telas principais, preservando as rotas e os dados do portal. Home e Método usam ArticleCards com guias reais; Academy e catálogo compartilham ResourceCard, composto com as primitivas locais; a leitura usa Widget para os metadados e LoadingIndicator/Arc durante a espera real. Não há transcrição de voz ou execução de agentes simulada.

Validação desta rodada: tipos e lint passaram; build passou; quatro testes Playwright passaram, cobrindo cinco modelos de página a 1440 e 390 px, axe no conteúdo principal, ausência de overflow horizontal, navegação para trilha e guia e leitura dos fontes de ambas as coleções adicionadas. Quatro testes do gateway protegido passaram. Capturas locais foram inspecionadas para o Método desktop e o guia em celular.

A suíte de unidade permanece com 455 testes passando, 25 falhando e 36 pulados. As falhas anteriores incluem catálogo privado ausente e a restrição de leitores de ambiente que não prevê o gateway da prévia. O gate completo do repositório não está verde. A prévia continua com catálogo privado vazio e acesso por senha; não representa publicação do portal interno com Microsoft.
