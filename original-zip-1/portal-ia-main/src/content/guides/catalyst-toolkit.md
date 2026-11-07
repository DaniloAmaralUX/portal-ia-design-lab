O catalyst lê um projeto e diz o que falta escrito nele para um agente de IA, como o Claude Code, trabalhar ali sem perguntar a ninguém. Depois, numa entrevista, ele escreve com você o que falta.

**ENTENDER**

## 1 O que o catalyst faz {#o-que-faz}

**Um agente de IA só acerta o que encontra escrito.** Peça ao Claude Code que mexa num projeto que ele nunca viu. Antes de tocar no código, ele procura nos arquivos o que uma pessoa nova no time perguntaria no primeiro dia: como o projeto é construído, como os testes rodam, o que não pode mudar sem aprovação. O que não está escrito, ele adivinha, e quem descobre o erro é quem revisa.

A Pitang escreveu um padrão para medir isso, o AI-maintainable. Ele tem sete requisitos, do R1 ao R7, e cada requisito faz uma pergunta sobre o projeto. O catalyst aplica esse padrão ao seu projeto, pelo terminal, com três comandos:

| Comando | O que faz | Usa a sua conta do Claude Code |
|---|---|---|
| `catalyst` | abre a casa: o último diagnóstico do projeto e as portas para os outros dois comandos | não |
| `catalyst doctor` | diagnostica o projeto pelos sete requisitos e grava o resultado numa página | sim, depois que você confirma |
| `catalyst init` | entrevista você e escreve os arquivos que faltam, só os que você marcar | sim |

**O catalyst não traz uma IA própria.** Ele usa o Claude Code instalado na sua máquina, com o login que já é seu. Por isso a revisão do `doctor` e a entrevista do `init` contam na sua conta do Claude Code.

**O agente só lê, e quem grava é o catalyst.** O catalyst abre o Claude Code dentro de um sandbox, um confinamento do sistema operacional que tira dele a escrita na pasta do projeto e a leitura dos arquivos com segredo. No macOS, o sandbox já vem com o sistema. No Linux, você o instala no [passo 1](#sandbox).

### O ciclo {#ciclo}

**Medir, preparar, medir de novo.** O `doctor` mede o projeto e monta o plano. O `init` prepara o que falta numa entrevista com você. O `doctor` mede de novo e mostra o que mudou.

![Ciclo: o doctor mede o projeto e monta o plano; o init prepara o que falta numa entrevista com você; o doctor mede de novo e mostra o que mudou](figura/catalyst-ciclo)

### Os sete requisitos {#sete}

| Requisito | A pergunta que ele faz |
|---|---|
| R1 · Contexto técnico | Alguém de fora constrói, testa e entende o projeto só com o que está escrito? |
| R2 · Base de conhecimento do produto | O que o sistema deve fazer, e sob que regras de negócio, está escrito? |
| R3 · Arquitetura | Dá para saber o que uma mudança toca antes de fazê-la? |
| R4 · Testes | Os testes avisam quando uma mudança quebra o comportamento? |
| R5 · Observabilidade | Quando algo falha em produção, os registros levam até a causa? |
| R6 · Entrega e reversão | Existe caminho automatizado até produção, e um jeito previsto de voltar? |
| R7 · Segurança | Os segredos estão fora do código, e o que o agente pode fazer está escrito? |

**INSTALAR**

## 2 Instalar {#instalar}

A instalação tem quatro passos, pelo npm, o instalador de pacotes que vem com o Node. O passo 2 e o passo 3 valem uma vez por máquina.

### Antes de começar {#antes}

**O catalyst roda no macOS, no Linux e no Windows, pelo WSL2.** O WSL2 é o Linux que o próprio Windows executa, e o catalyst roda nele como num Linux.

| O que pede | macOS | Linux | Windows |
|---|---|---|---|
| Processador | Apple (arm64) e Intel (x64) | x64 e arm64 | x64 e arm64 |
| Node | 22 ou mais novo | 22 ou mais novo | 22 ou mais novo, o do Linux do WSL2 |
| git | qualquer versão | qualquer versão | no Linux do WSL2 |
| Claude Code | com login feito | com login feito | com login feito, no Linux do WSL2 |
| Sandbox | o `sandbox-exec`, que já vem no sistema | o `bubblewrap`, que você instala | o `bubblewrap`, no Linux do WSL2 |

Confira num terminal. No Windows, use o terminal do Linux do WSL2:

```bash
node --version
git --version
claude --version
```

O Node responde `v22` ou um número maior. O git e o Claude Code só precisam responder com uma versão.

**Sem o Claude Code**, instale-o pela [documentação do Claude Code](https://code.claude.com/docs/en/setup) e rode `claude` uma vez para entrar na sua conta. O catalyst usa esse login.

**Sem o Node, ou com um mais velho que o 22**, instale um Node na sua conta, como o do [nvm](https://github.com/nvm-sh/nvm). Com ele, o npm instala pacotes sem `sudo`, como o [passo 4](#pacote) pede.

Você também precisa de uma conta no GitLab da Pitang, para criar a chave de leitura do [passo 2](#token).

### Passo 1: o sandbox {#sandbox}

**No macOS, não há nada a instalar.** O `sandbox-exec` vem com o sistema.

**No Linux**, instale o `bubblewrap`. No Debian e no Ubuntu:

```bash
sudo apt-get install -y bubblewrap
```

O `bubblewrap` precisa subir, e não só estar instalado. Este comando diz `o bwrap sobe` quando ele sobe:

```bash
bwrap --dev-bind / / --unshare-pid --proc /proc --new-session --die-with-parent -- true && echo "o bwrap sobe"
```

Se ele parar com um erro, o capítulo [Quando algo dá errado](#problemas) diz o conserto.

**No Windows**, o catalyst roda dentro do WSL2:

1. No PowerShell do Windows, instale o WSL2 com o Linux que ele traz, e reinicie o computador se o Windows pedir:

   ```bash
   wsl --install
   ```

2. Confira com `wsl -l -v`, que mostra `2` na coluna `VERSION`.
3. Daqui em diante, tudo roda no terminal do Linux do WSL2. Nele, o `command -v node` mostra um caminho do Linux, como `/usr/bin/node`, e não um que começa com `/mnt/c/`.
4. Instale e confira o `bubblewrap` como no Linux, acima.
5. Guarde os seus projetos no disco do Linux, na sua pasta `~/`, e não em `/mnt/c/`.

### Passo 2: a chave de leitura do GitLab {#token}

**O pacote mora no GitLab da Pitang, e o npm só o baixa com uma chave sua, o token.** O token deste passo só lê os pacotes do projeto `catalyst-toolkit`. Se ele vazar, ninguém escreve nada com ele, e ele não lê nenhum outro projeto seu.

1. Abra a página [Personal access tokens](https://gitlab.pitang.com/-/user_settings/personal_access_tokens), clique em "Generate token" e escolha "Fine-grained token".
2. Dê ao token um nome que você reconheça na lista, como `npm catalyst-toolkit`, uma descrição, que o GitLab exige, e uma validade curta, como um mês.
3. Em "Group and project access", marque "Only specific groups or projects I have access to", clique em "Add group or project" e escolha só o `pitang-agentic/catalyst-toolkit`.
4. Em "Add resource permissions", abra "Packages and Registry", marque "Package" e escolha só "Read". A caixa da categoria inteira daria também criar, apagar e atualizar pacotes.
5. Clique em "Generate token" e copie o token. O GitLab só o mostra uma vez.

Se a página não oferecer o "Fine-grained token", use o "Legacy token", com o escopo `api` e uma validade curta. Ele funciona nos mesmos comandos, mas lê e escreve em toda a API da sua conta, e não só nos pacotes do catalyst.

### Passo 3: o endereço do pacote e o token {#registro}

Este passo diz ao npm onde mora o pacote e guarda o token na sua máquina. Troque `SEU_TOKEN` pelo token do passo 2 e rode os dois comandos:

```bash
npm config set @pitang:registry=https://gitlab.pitang.com/api/v4/projects/1273/packages/npm/
```

```bash
npm config set //gitlab.pitang.com/api/v4/projects/1273/packages/npm/:_authToken=SEU_TOKEN
```

O token fica no arquivo `~/.npmrc` da sua máquina, nunca num projeto. O segundo comando também fica no histórico do terminal, e para tirá-lo de lá basta apagar a linha dele no `~/.zsh_history` ou no `~/.bash_history`.

Confira antes de instalar. Este comando pede ao GitLab as versões publicadas:

```bash
npm view @pitang/catalyst-toolkit dist-tags
```

A resposta traz o `latest` com o número da versão. Com um `401`, o token não chegou ao GitLab ou não tem a permissão, e o capítulo [Quando algo dá errado](#problemas) diz o que conferir.

### Passo 4: o pacote {#pacote}

```bash
npm i -g @pitang/catalyst-toolkit
```

Rode sem `sudo`. Com um Node da sua conta, como o do nvm, a pasta dos pacotes globais é sua.

Quando o npm terminar, confira:

```bash
catalyst --version
```

A resposta é `catalyst` e o número da versão instalada.

O catalyst também vem num `.tar.gz` por sistema, nas [releases do projeto](https://gitlab.pitang.com/pitang-agentic/catalyst-toolkit/-/releases), para instalar sem o npm. O [README do catalyst-toolkit](https://gitlab.pitang.com/pitang-agentic/catalyst-toolkit) diz como.

### Atualizar {#atualizar}

```bash
npm update -g @pitang/catalyst-toolkit
```

O comando instala a versão mais nova publicada.

### Desinstalar {#desinstalar}

```bash
npm rm -g @pitang/catalyst-toolkit
```

O comando tira o catalyst e o adaptador do Claude Code que veio com ele. O resto fica, porque é seu ou de outra ferramenta: o Claude Code que você instalou, com o login, as suas configurações do catalyst, em `~/.config/catalyst/`, e o que o `doctor` e o `init` gravaram em cada projeto.

O endereço e o token do passo 3 também ficam no `~/.npmrc`. Estes dois comandos os tiram:

```bash
npm config delete @pitang:registry
npm config delete //gitlab.pitang.com/api/v4/projects/1273/packages/npm/:_authToken
```

O token continua valendo no GitLab até você clicar em "Revoke" na página [Personal access tokens](https://gitlab.pitang.com/-/user_settings/personal_access_tokens).

**USAR**

## 3 O primeiro uso {#primeiro-uso}

**Duas conferências, e nenhuma usa a sua conta do Claude Code.** Rode as duas dentro de um projeto seu que esteja no git, como um que você clonou do GitLab. No Windows, use um projeto guardado em `~/`, no disco do Linux.

### A casa {#casa}

```bash
cd ~/um-projeto
catalyst
```

O `cd` entra na pasta do projeto. Troque `~/um-projeto` pelo caminho do seu. O `catalyst` sem comando abre a casa.


A casa mostra o projeto, o ramo do git, o último diagnóstico e três portas: Diagnosticar, que abre o `doctor`, Preparar, que abre o `init`, e Configurações. As setas escolhem a porta, o `enter` abre, e o `q` ou o `esc` sai. Num projeto que nunca passou pelo `doctor`, a casa diz `Ainda sem diagnóstico neste projeto.`

### A prévia do doctor {#previa}

Na raiz do mesmo projeto:

```bash
catalyst doctor
```

O `doctor` confere a máquina, lê o projeto e para numa pergunta: se a revisão com IA deve começar. Até ali, nada usou a sua conta.


- **Ambiente preparado** diz que o catalyst abriu o Claude Code dentro do sandbox e que ele respondeu a um cumprimento, que não abre conversa nem gasta conta.
- **Projeto lido** diz quantos itens o código resolveu sozinho.
- Um `!` no começo da linha marca o que não respondeu, e `Ambiente com falta` marca o git ou o Node que faltam. O capítulo [Quando algo dá errado](#problemas) diz o conserto de cada um.

> **O `enter` na prévia começa a revisão, e a revisão usa a sua conta do Claude Code.**
>
> Para conferir a instalação, saia com o `esc`. O `doctor` diz `Nada foi gravado.` e termina.

## 4 Diagnosticar com o doctor {#doctor}

**O doctor examina o projeto e não muda nada nele.** Ele só grava o resultado, na pasta `.catalyst/diagnostic/` do projeto. A tela mostra o exame em passos, um embaixo do outro, e cada passo diz o que achou.

### Sem IA: a máquina e o projeto {#sem-ia}

**Ambiente preparado.** O `doctor` confere o git e o Node e acorda o Claude Code. Acordar é um cumprimento, em que a IA diz o nome e o que sabe fazer, sem abrir conversa.

**Projeto lido.** O `doctor` lê os arquivos e o histórico do git e resolve sem IA o que é mecânico, como a existência do arquivo de instruções para agentes, os comandos escritos e o arquivo que constrói o projeto. Num projeto de exemplo, o código resolveu 24 de 68 itens.

### A prévia: você decide antes de gastar {#decidir}

Antes da revisão com IA, o `doctor` para e pergunta se ela deve começar, com o prazo dela: até 30 minutos, se ninguém mudou o prazo nas Configurações. O cartão mostra também o custo, quantas revisões a equipe vai fazer e onde o resultado vai ficar.

O `enter` começa a revisão. O `esc` sai sem rodar e sem gravar nada.

### A revisão com IA {#revisao}

**Os revisores trabalham ao mesmo tempo, três de cada vez.** Cada revisor é uma sessão do Claude Code que lê o projeto e julga os itens de um requisito que o código não decidiu. Para cada achado, o revisor cita o trecho do arquivo, e o catalyst relê esse trecho no disco antes de contar o achado.

A tela mostra o que cada revisor lê, o que a equipe já concluiu e o custo até aquele momento. O `ctrl+c` interrompe a revisão a qualquer hora.

### O resultado {#resultado}

Ao fim, o `doctor` grava o retrato, que é o nome do resultado: uma página para ler no navegador, a `.catalyst/diagnostic/index.html`, e o `retrato.json`, para scripts. Na tela, ele mostra o resumo.


**A manchete diz a situação do projeto.** Ela sai dos cinco requisitos críticos, o R1, o R4, o R5, o R6 e o R7:

- pronto, quando os cinco chegaram ao mínimo;
- preparação, quando nenhum está no nível 0 e algum ainda não chegou ao mínimo;
- base a construir, quando algum está no nível 0;
- indeterminada, quando algum ficou sem nível.

**Cada requisito ganha um nível, de 0 a 3.** O nível 0 quer dizer que nada do que o requisito pede existe no projeto, e o 2 é o mínimo da maioria dos requisitos. Sem nível é outra coisa. Quer dizer que o `doctor` não concluiu o bastante para dar um nível, e isso não é zero.

**Os achados apontam o arquivo e a linha**, como a linha 3 do `AGENTS.md`.

**O que fazer agora é o próximo passo, pronto para rodar.** Num projeto de exemplo, o primeiro foi preparar a base de conhecimento, o R2, com o `init`. As setas escolhem, o `enter` faz, e o `esc` sai e deixa o resumo no terminal.

### A página do retrato {#pagina}

A página abre com uma frase para quem não conhece o padrão, como "5 dos 7 requisitos ainda não chegam ao mínimo para um agente trabalhar neste projeto sem perguntar a ninguém". Depois vem o radar, com o nível de cada requisito, e cada item: o que o padrão pergunta, o que o catalyst observou, o que falta e quem resolve.

**Commite a pasta `.catalyst/diagnostic/` com o projeto.** Assim o diff do próximo merge request mostra só o que o diagnóstico moveu.

### O radar {#radar}

![Radar de um projeto de exemplo, com o nível de cada um dos sete requisitos, de N0 a N3, e o mínimo de cada um](figura/catalyst-radar)

***O radar da página do retrato, num projeto de exemplo.** Cada eixo é um requisito, do nível 0, no centro, ao 3, na borda, e o traço curto é o mínimo. Troque entre antes e depois do `init` para ver o contexto técnico e a segurança chegarem ao mínimo.*

### Quanto custa {#custo}

A revisão usa a sua conta do Claude Code em toda rodada, e a tela diz quanto custou. O `doctor` guarda cada revisão em `.catalyst/diagnostic/revisoes/`. Na rodada seguinte, só o requisito cujo conteúdo mudou volta à revisão, e o resto sai da revisão guardada, sem gastar.

O prazo de 30 minutos segura o gasto da primeira rodada, que ainda não tem um custo anterior para mostrar na prévia.

## 5 Preparar com o init {#init}

**O init escreve com você o que o doctor disse que falta.** Ele prepara o R1, o contexto técnico; o R2, a base de conhecimento do produto; e o R7, a segurança.

```bash
catalyst init
```

A porta Preparar, da casa, abre o mesmo comando. Até o `enter` da proposta, nenhum arquivo muda, e o `ctrl+c` sai a qualquer hora sem gravar nada.

### A escolha {#escolha}

O `init` lê o projeto sem IA e pergunta qual requisito preparar. Cada um aparece com o nível e quantos itens faltam. Esse nível vem só do código, e pode ser diferente do que o `doctor` deu, porque o `doctor` soma a revisão com IA.

| Requisito | O que o init escreve |
|---|---|
| R1 · Contexto técnico | o `AGENTS.md`, com o propósito, os comandos e as convenções do projeto; uma regra por área em `.claude/rules/`; o glossário, em `docs/glossary.md`; e as configurações, em `docs/configuration.md` |
| R2 · Base de conhecimento do produto | numa pasta à parte, que você indica, o glossário, as personas, as regras de negócio e as histórias de usuário do produto, que duas IAs levantam do código; e, no `AGENTS.md`, o endereço dessa pasta |
| R7 · Segurança | no `AGENTS.md`, o que o agente pode fazer; no `.claude/settings.json`, as regras que negam ao Claude Code a leitura dos arquivos com segredo e os comandos proibidos; e, no `CODEOWNERS`, quem aprova a mudança nas instruções |

### A entrevista {#entrevista}

**O entrevistador pergunta só o que o projeto não diz.** Ele é uma sessão do Claude Code que só lê. Antes de perguntar, ele procura a resposta nos arquivos, e cada pergunta já traz uma opção recomendada, com o arquivo de onde ela veio.


A entrevista tem até três rodadas de até quatro perguntas. Em cada pergunta, você escolhe uma opção pelo número ou escreve a sua em "Outra resposta…". O `a` aceita todas as recomendadas de uma vez. Quando a resposta não é sua, "Outra pessoa sabe" deixa o campo vazio, e o fim do `init` diz o que perguntar e a quem.

### A conferência {#conferencia}

Depois das perguntas, o `init` mostra o que entendeu, sob "Entendi assim. Confere?". Cada resposta traz a origem: do repositório, proposta do entrevistador, escolhida por você ou escrita por você. Ali você corrige a resposta errada, antes que ela chegue a um arquivo.

### A proposta {#proposta}

**Nada foi gravado até aqui, e você decide o que entra.** O `init` lista os arquivos que as suas respostas geram, cada um com o efeito, criar ou alterar, e quantas linhas ganha. O espaço marca e desmarca um arquivo.


Antes da lista, uma segunda IA lê cada arquivo sem ver a conversa, como um agente que chega amanhã ao projeto. Quando ela não acha no arquivo uma resposta que a entrevista deu, a proposta avisa, e o `esc` volta para você corrigir.

### O fechamento {#fechamento}

O `enter` grava só os arquivos marcados. Depois, o `init` mede de novo o requisito, sem IA, e mostra o que andou.


**O init não commita.** A mudança fica no projeto, e o `git diff` mostra o que mudou para você revisar e decidir o que fica. Rodar o `init` de novo com as mesmas respostas não muda nenhum arquivo, e ele nunca apaga uma linha que já estava no seu `AGENTS.md`.

O próximo passo é o `doctor` de novo. Ele mede o projeto com a revisão com IA, e o retrato novo mostra o que mudou.

## 6 Quando algo dá errado {#problemas}

| O que aparece | O que fazer |
|---|---|
| o npm para com `E404` no `@pitang/catalyst-toolkit` | O npm procurou o pacote no npmjs.com, porque o endereço do [passo 3](#registro) não foi gravado. Rode de novo os dois comandos dele. |
| o npm para com `401 Unauthorized` | O token não foi gravado, venceu ou foi revogado. Grave de novo pelo [passo 3](#registro), ou crie outro pelo [passo 2](#token), e confira com `npm view @pitang/catalyst-toolkit dist-tags`. |
| `401` ou `403` com o token granular já gravado | O token não tem "Package" com "Read" no `pitang-agentic/catalyst-toolkit`. Crie outro pelo [passo 2](#token). |
| o npm para com `EACCES` na pasta global | O Node é o do sistema, que pede `sudo`. Use um Node da sua conta, como o do nvm, e nunca `sudo npm i -g`. |
| o npm avisa `EBADENGINE` | O Node é anterior ao 22. Instale o 22 ou mais novo e instale o pacote de novo. |
| o npm para ao baixar o `@agentclientprotocol/claude-agent-acp` | A máquina não alcança o npmjs.com, de onde vem o adaptador do Claude Code. Libere o acesso ao `registry.npmjs.org` e instale de novo. |
| o `catalyst` sai com `69` e fala do Windows | O catalyst foi instalado no Windows, fora do WSL2. Instale dentro do WSL2, pelo Node do Linux, como no [passo 1](#sandbox). |
| o `catalyst` sai com `69` e não acha o binário da plataforma | A instalação ficou pela metade. Rode `npm i -g @pitang/catalyst-toolkit` de novo. |
| o `doctor` diz que o Claude Code não está instalado | O Claude Code que vem com o catalyst não veio, como com a opção `--omit=optional` do npm. Instale o pacote de novo, sem essa opção. |
| o `doctor` mostra `! Ambiente preparado` e `Claude Code não conectou` | O Claude Code não respondeu dentro do sandbox. No Linux e no WSL2, o mais comum é o `bubblewrap` que não sobe. Volte ao [passo 1](#sandbox). |
| o `doctor` mostra `Ambiente com falta` | Falta o git ou o Node na máquina. Instale o que falta, pela lista de [Antes de começar](#antes). |
| o teste do `bwrap` para com `setting up uid map: Permission denied`, no Ubuntu 24.04 | O Ubuntu restringe um recurso que o `bubblewrap` usa para isolar o Claude Code. O [README do catalyst-toolkit](https://gitlab.pitang.com/pitang-agentic/catalyst-toolkit#1-prepare-o-sandbox) traz o conserto, que muda uma configuração de segurança da máquina inteira, e como desfazê-lo. Se a máquina não é só sua, combine antes com quem cuida dela. |

A lista inteira, com cada causa, está na seção [Problemas](https://gitlab.pitang.com/pitang-agentic/catalyst-toolkit#problemas) do README do catalyst-toolkit.
