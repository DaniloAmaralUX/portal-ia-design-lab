# Prévia local

Esta pasta contém um catálogo vazio para verificar o visual do portal quando o repositório privado de skills não está disponível. Não representa o catálogo da Pitang e não substitui a fonte original. Não use esta configuração para publicar ou validar a funcionalidade do catálogo.

Para repetir a prévia no PowerShell, estando em `portal-ia-main`:

```powershell
$env:SKILLS_DIR = (Resolve-Path '../preview-fixture/skills').Path
$env:SKILLS_REPO_URL = 'https://gitlab.pitang.com/pitang-agentic/skills.git'
$env:SHAREPOINT_ORIGIN = 'https://pitangconsult-my.sharepoint.com'
npm run dev -- --host 127.0.0.1 --port 5192
```

A página de entrada do servidor de desenvolvimento usa o perfil de exemplo previsto pelo projeto.
