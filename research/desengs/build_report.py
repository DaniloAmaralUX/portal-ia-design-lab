import csv
import html
import json
from pathlib import Path

P = Path(__file__).parent
items = json.loads((P / 'inventory.json').read_text(encoding='utf-8'))
repos = json.loads((P / 'github-evidence.json').read_text(encoding='utf-8'))
sites = json.loads((P / 'site-evidence.json').read_text(encoding='utf-8'))
reads = json.loads((P / 'reading-evidence.json').read_text(encoding='utf-8'))
repo_by_title = {x['title']: x for x in repos}
status_by_title = {x['title']: x.get('status', 'Falha de acesso') for x in sites + reads}
uses = '''Colaboração e habilidades humanas
Código como referência de produto
Indicadores de carregamento
Exploração de gradientes
Geometria de cantos aninhados
Repertório e decisões de design
Redução de ruído visual
Geração de tokens de design
Fluxo de design assistido por IA
Escolha de fonte para interfaces
Composição de entradas de chat com IA
Fundamentos de tipografia
Segmentação de texto para animação
Apresentação animada de imagens
Componentes e blocos de interface
Efeitos e composição com matriz de pontos
Estilos e utilitários de interface
Componentes para apresentações interativas
Critério humano na geração com IA
Carreira em design engineering e IA
Captura e documentação visual de interfaces
Checklist de implementação de interface
Competências para trabalhar com design e IA
Ícones com transições animadas
Componentes de interface
Material visual de vidro
Interações com deformação fluida
Componentes de interface
Componentes e padrões de interação fluida
Indicadores visuais de atividade da IA
Regras de qualidade para agentes de código
Tratamento gráfico com dithering
Anotações visuais para orientar agentes de IA
Oportunidade de design engineering
Oportunidade de design de produto
Regras de interação e animação para agentes
Transições de números e métricas
Oportunidade de design engineering
Oportunidade profissional
Critério para decidir quando animar
Componentes de interface e efeitos
Feedback sonoro de interação
Construção de bordas em gradiente
Responsabilidades de implementação no frontend
Direção visual para agentes de código
Formação de julgamento visual
Avatares derivados de identificadores
Correção e orientação de interfaces
Componentes e referências de telas
Fluxo de implementação com IA
Transições de texto
Construção e ajuste de sombras
Regras de qualidade para interfaces geradas
Revisão automatizada de interfaces
Componentes com movimento e interação
Cobertura e consistência de um design system
Auditoria e comandos de melhoria visual
Ajuste interativo de parâmetros de movimento
Detalhes de acabamento de interfaces
Animação e apresentação de texto
Competências de um design engineer
Exploração e ajuste de curvas de animação
Trajetória de aprendizado em design engineering
Fundamentos da disciplina
Exploração de cores no espaço OKLCH
Detalhes de interação e resposta aos gestos
Gráficos com atualização contínua
Valores e princípios de produto
Busca e comandos por teclado
Diretrizes de implementação de interface
Sons para feedback de interface
Design engineering como forma de trabalhar
Feedback tátil em dispositivos compatíveis
Introdução à disciplina
Notificações de confirmação e erro
Princípios para avaliar movimento
Desenvolvimento de repertório e julgamento
Prática de design engineering em equipe'''.splitlines()
assert len(uses) == len(items) == 78
high_reads = {'Interface Cheat Sheet', 'Details That Make Interfaces Feel Better', 'Web Interface Guidelines', 'Anatomy of AI Input', 'Invisible Details of Interaction Design', "You Don't Need Animations", 'Inter alternatives: How to choose a UI font', 'A Five-Minute Guide to Better Typography', 'Limit the number of details', '12 Principles of Animation'}
priority = {'Impeccable', 'UI Skills', 'Agentation', 'DialKit', 'Fancy Components', 'morphicons', 'Fluid Functionalism', 'Design Tokens Generator', 'shadowLab', 'Corner Radii', 'jakubkrehel/skills', 'emilkowalski/skills', 'Beautiful UI', 'devl.dev', 'Sonner', '⌘K', 'OKLCH.fyi', 'loading.dev'}
reviews = {'Agentation': ('5,0/5', 1, 'https://www.producthunt.com/products/agentation/reviews'), 'Sonner': ('5,0/5', 1, 'https://www.producthunt.com/products/sonner/reviews')}
rows = []
for i, use in zip(items, uses):
    r = repo_by_title.get(i['title'], {})
    review = reviews.get(i['title'], ('Não verificada', '', ''))
    rows.append(dict(title=i['title'], category=i['format'].title(), url=i['url'], application=use,
        stars=r.get('stargazers_count'), repository=r.get('html_url', ''), forks=r.get('forks_count'),
        last_push=r.get('pushed_at', ''), license=(r.get('license') or {}).get('spdx_id', 'Não identificada'),
        rating=review[0], review_count=review[1], review_source=review[2],
        priority='Alta' if i['title'] in priority | high_reads else ('Fora do redesign' if i['format']=='apply' else 'Contextual'),
        access_status=status_by_title.get(i['title'], 'Não verificado'),
        caveat='Estrelas do monorepositório Libraries.dev; não isolam Liquid Gooey.' if i['title']=='Liquid Gooey' else '',
        checked_at=r.get('checked_at', '2026-11-04')))
ranked = sorted([r for r in rows if r['stars'] is not None], key=lambda r:r['stars'], reverse=True)
for n,r in enumerate(ranked,1): r['adoption_rank']=n
for r in rows:r.setdefault('adoption_rank','')
(P/'mapa-completo.json').write_text(json.dumps(rows, ensure_ascii=False, indent=2),encoding='utf-8')
with (P/'mapa-completo.csv').open('w',encoding='utf-8-sig',newline='') as f:
    w=csv.DictWriter(f,fieldnames=list(rows[0]));w.writeheader();w.writerows(rows)
md=['# Desengs — mapa dos filtros selecionados','', 'Consulta: 4 de novembro de 2026. Escopo: Read, Use, Build e Apply, conforme a imagem. Captura do diretório: 78 itens (28 Read, 15 Use, 31 Build e 4 Apply). O catálogo pode mudar depois da captura.', '',
'## Como interpretar o ranking','', 'Foram localizados e verificados repositórios oficiais para 37 dos 46 recursos Use/Build. O ranking abaixo usa estrelas do GitHub como sinal de adoção/interesse, não como nota de satisfação ou garantia de qualidade. A contagem favorece projetos mais antigos e comunidades maiores. Atualização do repositório não comprova estabilidade nem qualidade do código.', '',
'Avaliações de usuários verificadas: [Agentation](https://www.producthunt.com/products/agentation/reviews) e [Sonner](https://www.producthunt.com/products/sonner/reviews), ambos com 5,0/5 e somente 1 avaliação nas páginas consultadas. Empatam na nota encontrada, mas a amostra é insuficiente para declarar os melhores avaliados. A página de Sonner disponível no índice é antiga. Não encontrar uma nota nesta pesquisa não significa que nenhuma exista.', '',
'Não misturei votos de lançamento do Product Hunt, notas editoriais e estrelas em uma pontuação artificial. A prioridade Alta/Contextual é minha avaliação de aplicação ao portal, não uma avaliação pública. As ferramentas foram pesquisadas; não foram todas instaladas ou testadas no projeto.', '',
'## Ranking por adoção pública — GitHub','', '| # | Recurso / fonte | Estrelas | Último push UTC | Licença identificada | Aplicação |', '|---|---|---:|---|---|---|']
for r in ranked:md.append(f"| {r['adoption_rank']} | [{r['title']}]({r['repository']}) | {r['stars']:,} | {r['last_push'][:10]} | {r['license']} | {r['application']} |")
md += ['', 'Liquid Gooey usa a contagem do monorepositório Libraries.dev; ela não representa avaliações isoladas desse componente. NOASSERTION ou licença não identificada exigem leitura dos termos antes de reaproveitar código.', '', '## Recursos sem métrica comparável verificada', '', 'Não atribuí nota zero: não localizei um repositório oficial verificável ou avaliações comparáveis nesta pesquisa.', '', '| Recurso | Aplicação | Prioridade editorial |', '|---|---|---|']
for r in rows:
    if r['category'] in ['Use','Build'] and r['stars'] is None:md.append(f"| [{r['title']}]({r['url']}) | {r['application']} | {r['priority']} |")
md += ['', '## Leituras — mapa completo', '', 'Prioridade editorial para o portal. Não há nota de usuários comparável verificada para esta seleção.', '', '| Leitura | Aplicação | Prioridade | Acesso na consulta |','|---|---|---|---|']
for r in rows:
    if r['category']=='Read':md.append(f"| [{r['title']}]({r['url']}) | {r['application']} | {r['priority']} | {r['access_status']} |")
md += ['', '## Apply — vagas, separadas do ranking de ferramentas', '', 'HTTP 200 indica apenas página acessível; não confirma contratação ativa. HTTP 404 indica link indisponível nesta consulta; não comprova encerramento da vaga. Não avaliei empregadores.', '', '| Organização / link | Acesso |','|---|---|']
for r in rows:
    if r['category']=='Apply':md.append(f"| [{r['title']}]({r['url']}) | {r['access_status']} |")
md += ['', '## O que eu havia deixado passar e como aproveitaria', '',
'1. **Impeccable e UI Skills:** revisar hierarquia, legibilidade e consistência antes de acrescentar efeitos. Usar como apoio às regras de Jakub e Emil, resolvendo conflitos entre instruções.',
'2. **Agentation:** registrar feedback diretamente sobre elementos para transformar observações de design em tarefas precisas.',
'3. **DialKit:** experimentar parâmetros de movimento e aprovar valores antes de fixá-los no código.',
'4. **Fluid Functionalism, Fancy Components e morphicons:** selecionar interações e ícones adequados aos fluxos; confirmar compatibilidade e acessibilidade no projeto.',
'5. **Design Tokens Generator, shadowLab, Corner Radii e OKLCH.fyi:** consolidar cores, sombras e raios em tokens compartilhados.',
'6. **Calligraph, Torph e NumberFlow:** avaliar para estados textuais e numéricos específicos; evitar movimento ornamental repetitivo.',
'7. **WebHaptics e áudio:** recursos condicionais, dependentes de dispositivo, preferências e contexto de uso. Menor prioridade que clareza e navegação.', '',
'## Evidências e limites', '', 'O inventário foi extraído dos dados públicos da página Desengs. As contagens de estrelas vieram da API oficial do GitHub, com URL e horário preservados em github-evidence.json. site-evidence.json e reading-evidence.json preservam as verificações de acesso. Nenhum arquivo de aplicação foi alterado nesta pesquisa. Falhas HTTP, bloqueios e erros TLS não são avaliações negativas do conteúdo.']
(P/'RELATORIO.md').write_text('\n'.join(md)+'\n',encoding='utf-8')
draft=Path(r'C:\Users\dar\AppData\Local\Temp\eregion-pages\3d43a24f18b7c152');draft.mkdir(parents=True,exist_ok=True)
page='''<!doctype html><html lang="pt-BR"><meta charset="utf-8"><style>
*{box-sizing:border-box}body{margin:0;font-family:var(--font-sans);color:var(--foreground);background:var(--background);font-size:14px}h2{font-size:23px;letter-spacing:-.6px;margin:0 0 8px}p{line-height:1.55;color:var(--muted-foreground)}.stats{display:flex;flex-wrap:wrap;gap:8px;margin:18px 0}.stats span{padding:8px 12px;background:var(--secondary);border-radius:8px}button,input,select{font:inherit;color:var(--foreground);background:var(--background);border:1px solid var(--border);padding:10px;border-radius:7px}input{flex:1;min-width:150px}.filters{display:flex;gap:8px;flex-wrap:wrap;margin:18px 0}a{color:var(--foreground);text-underline-offset:3px}.row{padding:15px 0;border-top:1px solid var(--border);display:grid;grid-template-columns:1fr auto;gap:8px}.name{font-weight:600;font-size:15px}.detail{margin-top:5px;color:var(--muted-foreground);font-size:13px;line-height:1.5}.metric{text-align:right;white-space:nowrap}.tag{font-size:11px;letter-spacing:.3px;color:var(--muted-foreground)}.pager{display:flex;align-items:center;justify-content:space-between;margin-top:18px}small{display:block;color:var(--muted-foreground);line-height:1.5}button{cursor:pointer}button:disabled{opacity:.4}button:focus-visible,a:focus-visible,input:focus-visible,select:focus-visible{outline:2px solid var(--ring);outline-offset:3px}@media(max-width:420px){.row{grid-template-columns:1fr}.metric{text-align:left}}
</style><h2>Desengs: os 78 recursos selecionados</h2><p>Read, Use, Build e Apply. Mapa completo e ranking por adoção pública, com as fontes de cada item. Consulta: 04/11/2026.</p><div class="stats"><span><b>28</b> leituras</span><span><b>46</b> ferramentas e bibliotecas</span><span><b>4</b> vagas</span></div><p><b>Avaliações encontradas:</b> <a href="https://www.producthunt.com/products/agentation/reviews" target="_blank" rel="noopener">Agentation</a> e <a href="https://www.producthunt.com/products/sonner/reviews" target="_blank" rel="noopener">Sonner</a>: 5,0/5, com apenas 1 avaliação cada. Amostra insuficiente para um ranking confiável de satisfação.</p><small>O ranking usa estrelas do GitHub: sinal de interesse, não nota de qualidade. Há repositório verificado para 37 dos 46 recursos. “Prioridade alta” é minha avaliação editorial para o portal. Nenhum pacote foi instalado nesta pesquisa.</small><div class="filters"><input id="search" aria-label="Buscar recurso" placeholder="Buscar recurso ou aplicação…"><select id="category" aria-label="Categoria"><option value="">Todas as categorias</option><option>Build</option><option>Use</option><option>Read</option><option>Apply</option></select><select id="sort" aria-label="Ordenação"><option value="stars">Adoção no GitHub</option><option value="priority">Prioridade para o portal</option><option value="name">Nome</option></select></div><small id="count" aria-live="polite"></small><div id="list"></div><div class="pager"><button id="prev">Anterior</button><small id="position"></small><button id="next">Próxima</button></div><script>
const data=__DATA__;let page=0;const size=10;const el=id=>document.getElementById(id);const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function render(){let q=el('search').value.toLocaleLowerCase();let a=data.filter(r=>(!el('category').value||r.category===el('category').value)&&[r.title,r.application].join(' ').toLocaleLowerCase().includes(q));a.sort((x,y)=>el('sort').value==='name'?x.title.localeCompare(y.title):el('sort').value==='priority'?(x.priority==='Alta'?-1:0)-(y.priority==='Alta'?-1:0)||(y.stars??-1)-(x.stars??-1):(y.stars??-1)-(x.stars??-1));page=Math.min(page,Math.max(0,Math.ceil(a.length/size)-1));el('count').textContent=a.length+' recursos encontrados';el('list').innerHTML=a.slice(page*size,(page+1)*size).map(r=>`<div class="row"><div><div class="tag">${esc(r.category)} · ${esc(r.priority==='Alta'?'Prioridade alta':r.priority)}</div><a class="name" href="${esc(r.url)}" target="_blank" rel="noopener">${esc(r.title)}</a><div class="detail">${esc(r.application)}</div>${r.caveat?`<small>${esc(r.caveat)}</small>`:''}</div><div class="metric">${r.stars!==null?`<a href="${esc(r.repository)}" target="_blank" rel="noopener">${r.stars.toLocaleString('pt-BR')} ★</a><small>#${r.adoption_rank} em adoção</small><small>Push ${esc(r.last_push.slice(0,10))}</small>`:`<small>${r.category==='Apply'?'HTTP '+esc(r.access_status):'Sem métrica comparável'}</small>`}${r.review_count?`<small>${esc(r.rating)} · ${r.review_count} avaliação</small>`:''}</div></div>`).join('');el('position').textContent=(a.length?page+1:0)+' / '+Math.ceil(a.length/size);el('prev').disabled=page===0;el('next').disabled=(page+1)*size>=a.length;}
for(const id of ['search','category','sort'])el(id).addEventListener('input',()=>{page=0;render()});el('prev').onclick=()=>{page--;render()};el('next').onclick=()=>{page++;render()};render();console.log('Inventário validado:',data.length,'itens;',data.filter(r=>r.stars!==null).length,'repositórios');
</script></html>'''.replace('__DATA__',json.dumps(rows,ensure_ascii=False).replace('</','<\\/'))
(draft/'desengs-ranking.html').write_text(page,encoding='utf-8')
print(json.dumps({'total':len(rows),'ranked':len(ranked),'unranked_tools':sum(r['category'] in ['Use','Build'] and r['stars'] is None for r in rows),'report':str(P/'RELATORIO.md'),'preview':str(draft/'desengs-ranking.html')},ensure_ascii=False))
