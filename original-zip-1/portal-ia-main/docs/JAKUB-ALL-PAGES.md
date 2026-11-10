# Revisão Jakub — páginas do portal

Branch isolada: `review/jakub-all-pages`, derivada de `polish/jakub-emil`. Publicação em projeto Vercel separado, sem substituir a versão anterior. A prévia continua pública e não contém a seção de design system.

## Procedimento

Skills instaladas com `npx skills add https://github.com/jakubkrehel/skills`: `better-interface`, `better-accessibility`, `better-layout`, `better-writing`, `better-typography`, `better-colors` e `better-ui`.

O inventário usa o mesmo gerador de endereços do projeto (`e2e/routes.ts`), incluindo páginas fixas, papéis, roteiros, guias, capítulos, intervalos, cursos e aulas. Foram acrescentados os formulários de publicação, busca sem resultados e página inexistente. São 142 endereços disponíveis neste checkout, verificados em claro a 1440 px e escuro a 320 px. Não se inventaram endereços ou dados de skills privadas ausentes.

## Cobertura

| Domínio | Evidência e decisão |
| --- | --- |
| Acessibilidade | Axe WCAG A/AA e 2.2 AA, títulos presentes, navegação e foco dos controles compartilhados |
| Layout | Largura do documento em cada endereço; manutenção dos grids e da ordem de leitura |
| Escrita | Vocabulário, rótulos de ações e estados existentes preservados; sem reescrever conteúdo editorial por preferência |
| Tipografia | Fontes locais carregadas antes da verificação; escala e hierarquia original preservadas |
| Cores | Contraste automatizado das cores realmente renderizadas nos dois temas; sem migração de paleta |
| UI | Pressão, foco, botões de ícone, superfícies e estados de menu com os contratos já usados no portal |

## Melhorias aplicadas

| Antes | Depois | Motivo |
| --- | --- | --- |
| A limpeza da busca repetia o estilo de outro botão | Usa `IconButton` | Mantém dimensões, nome acessível, foco e movimento no contrato comum |
| O menu de leitura só declarava que abria um diálogo | Também informa `aria-expanded` | Expõe o estado aberto ou fechado em todas as páginas que usam DocsLayout |
| A cópia alternativa movia o foco para um campo temporário | Remove o campo em `finally` e restaura o foco sem scroll | O teclado continua no controle acionado mesmo quando a API de clipboard não está disponível |
| Cartões de publicação mantinham hover próprio | Usam `interactive-surface` | Mantém o mesmo feedback de borda e fundo dos demais cartões |
| O comando do Catalyst rolava no celular sem receber foco | Usa `ScrollableTable`, com nome acessível e foco quando há overflow | Permite alcançar e rolar o comando pelo teclado |

O código desta variante é acessível pelo ícone GitHub do cabeçalho, apontando para esta branch. O projeto anterior continua apontando para sua própria versão.

## Resultado

- A varredura dos 142 endereços em dois cenários executou 285 testes, incluindo o login de teste. Foram 284 aprovados e uma falha: a região rolável do Catalyst no celular escuro.
- Após a correção, o Catalyst foi revalidado em claro/desktop e escuro/celular: três testes aprovados, incluindo login.
- O build final passou por 23 testes de regressão de interação, todos aprovados, incluindo cópia alternativa e estado/foco do menu de seção.
- Tipos, lint e build aprovados. Cinco testes do gateway aprovados.
- Sem senha na prévia; sem restauração da rota de design system. A publicação usa o projeto separado `portal-ia-jakub-pages`.

## Limites

Verificações automatizadas não equivalem a teste com leitor de tela, inspeção manual de cada pixel ou teste em hardware físico. O catálogo privado não acompanha este checkout; seus conteúdos e buscas reais dependem do acesso institucional. A suíte de unidade mantém os totais anteriores: 449 aprovados, 24 falhas e 36 ignorados. Não se declara o gate completo aprovado.
