import { CATALOG_COMMIT, REPO_WEB_URL } from "@/data/catalog-index";

export const CONTRIBUTING_URL = `${REPO_WEB_URL}/-/blob/${CATALOG_COMMIT}/CONTRIBUTING.md`;

export const questions = [
  ["Deixaria de ser verdade se este trabalho fosse cancelado?", "É artefato do trabalho, como o feature.md ou o relatório. Não é componente."],
  ["É obrigação válida em toda entrega daquele tipo de arquivo?", "É rule."],
  ["É um método, um passo a passo de como fazer?", "É skill."],
  ["É fato durável sobre o domínio ou o sistema?", "É memória do projeto, e não deste acervo."],
  ["É um recorte de contexto e ferramentas que roda sozinho e devolve um resultado?", "É agente."],
] as const;

export const standard = [
  "O nome tem o prefixo pg-, é igual ao da pasta e é único no acervo inteiro.",
  "A description tem até 300 caracteres e diz o que a skill faz e quando usar. Os nomes e as descriptions de todas as skills da sessão dividem um orçamento curto.",
  "A skill é autossuficiente: tudo o que ela lê fica na pasta dela, em references/, assets/ ou scripts/.",
  "Disciplina dispara sozinha; processo é manual. O que configura o projeto, traz coisa em lote ou é difícil de desfazer leva disable-model-invocation.",
  "A dependência de outra skill vai em metadata.requires.",
  "O SKILL.md e a documentação são em português.",
];

export const curation = [
  ["Cabe aqui?", "Resolve uma tarefa que mais de um time repete, e não um caso de um projeto só."],
  ["Quanto custa no contexto?", "A description entra em toda sessão de quem instala. Curta e precisa custa menos."],
  ["O gatilho é exclusivo?", "A description não disputa pedido com outra skill do acervo."],
  ["Como se verifica?", "Uma checagem que roda (teste, validador, eval) vale mais que uma instrução a mais."],
  ["A maturidade é honesta?", "A skill é experimental até rodar num projeto real, e o eval com e sem ela mostra se há ganho."],
] as const;
