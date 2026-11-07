export const faq = [
  {
    q: "Preciso saber programar para usar?",
    a: "Não. Depois de instalar, você pede em português, como pediria a um colega. Os comandos de instalação são dois e dá para copiar e colar.",
  },
  {
    q: "A skill mexe nos meus arquivos?",
    a: "Algumas gravam documentos no projeto, como histórias em user-stories/ e documentação em docs/. A página de cada skill diz o que ela faz no seu projeto. Fica tudo no git, e o git desfaz. O que é difícil de desfazer fica como só manual.",
  },
  {
    q: "Posso instalar uma skill só, sem o plugin?",
    a: 'Pode. Na página de cada skill, em "Só esta skill", você baixa o .zip com a skill e as de que ela depende. No mesmo projeto, use uma porta só: o plugin ou a skill avulsa.',
  },
  {
    q: "Como sei que saiu versão nova?",
    a: "A página Novidades lista cada versão, e a página de cada plugin mostra a atual. No Claude Code, o /plugin list mostra a que você tem. A atualização automática vem desligada: com ela ligada, e com a credencial do GitLab salva ou o SSH, o Claude Code busca a versão nova em segundo plano. Sem isso, atualize à mão, como na seção Atualizar.",
  },
  {
    q: "Instalei muitos plugins. Tem problema?",
    a: "O Claude Code guarda uma lista com o nome e a descrição de cada skill, e essa lista tem um limite. A página de cada plugin mostra quantos tokens ele põe em toda sessão. Com muitos plugins, o Claude Code corta primeiro as descrições das menos usadas, e o /doctor mostra o custo da lista.",
  },
  {
    q: "Como sugiro uma skill nova?",
    a: "Use a pg-escrever-skill, do plugin Práticas de engenharia. Ela cria no padrão da casa, testa com e sem a skill nova e deixa pronto para o MR. A página Contribuir tem o passo a passo.",
  },
];
