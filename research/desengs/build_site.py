"""Build the standalone, dependency-free version of the research viewer."""
import json
import runpy
from pathlib import Path

research = Path(__file__).resolve().parent
context = runpy.run_path(str(research / 'build_report.py'))
site = research.parent.parent / 'src' / 'desengs-ranking'
site.mkdir(parents=True, exist_ok=True)
page = context['page']
page = page.replace('<meta charset="utf-8">', '''<head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="description" content="Mapa de 78 recursos de design engineering do Desengs, com filtros, aplicações e sinais públicos de adoção.">
<meta name="color-scheme" content="dark"><title>Desengs — mapa e ranking de recursos</title>
<style>
:root{--background:#0b0b0d;--foreground:#f4f4f5;--muted-foreground:#aaaab3;--secondary:#202024;--border:#303036;--ring:#a78bfa;--font-sans:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
html{background:var(--background)}body{width:min(100% - 40px,1000px);margin:48px auto!important;padding-bottom:40px}a:hover{color:#c4b5fd}input,select{min-height:44px}button{min-height:44px}.exports{display:flex;gap:18px;flex-wrap:wrap;margin:16px 0 28px}.exports a{font-size:13px}h2{line-height:1.2}
@media(max-width:600px){body{width:calc(100% - 32px);margin-top:28px!important}.filters>*{width:100%}.row{grid-template-columns:minmax(0,1fr) auto}.name{overflow-wrap:anywhere}}
</style>''')
page = page.replace('</style><h2>', '</style></head><body><main><h2>')
page = page.replace('<div class="filters">', '''<nav class="exports" aria-label="Baixar pesquisa"><a href="mapa-completo.csv" download>Baixar CSV</a><a href="mapa-completo.json" download>Baixar JSON</a><a href="relatorio.md" download>Relatório completo</a><a href="https://desengs.com/" target="_blank" rel="noopener">Diretório original ↗</a></nav><div class="filters">''')
page = page.replace('<script>', '</main><script>')
page = page.replace('</script></html>', '</script></body></html>')
(site / 'index.html').write_text(page, encoding='utf-8')
for original, target in [('mapa-completo.csv','mapa-completo.csv'),('mapa-completo.json','mapa-completo.json'),('RELATORIO.md','relatorio.md')]:
    (site / target).write_bytes((research / original).read_bytes())
(site / 'vercel.json').write_text(json.dumps({'$schema':'https://openapi.vercel.sh/vercel.json', 'framework':None, 'buildCommand':'', 'installCommand':'', 'outputDirectory':'.', 'headers':[{'source':'/(.*)','headers':[{'key':'X-Content-Type-Options','value':'nosniff'},{'key':'Referrer-Policy','value':'strict-origin-when-cross-origin'},{'key':'X-Frame-Options','value':'DENY'}]}]}, indent=2), encoding='utf-8')
(site / '.vercelignore').write_text('.vercel\n.env*\n', encoding='utf-8')
print('Standalone site:', site)
