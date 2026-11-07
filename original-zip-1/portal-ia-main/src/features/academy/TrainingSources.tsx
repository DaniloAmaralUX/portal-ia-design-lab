export function TrainingSources() {
  return (
    <div className="mt-14 space-y-2 border-t border-border pt-5 text-caption leading-relaxed text-muted-foreground *:max-w-md">
      <p>
        <strong className="font-semibold text-foreground/85">Fonte das trilhas:</strong> planilha Retrato_Pitang Frente 1 (abas
        Trilha por Perfil, Trilha Anthropic, Trilha OpenAI e Trilha Microsoft).
      </p>
      <p>
        <strong className="font-semibold text-foreground/85">Tempos:</strong> consultados nos sites em 28/09/2026. Anthropic Academy:
        tempo estimado de cada aula, somado por curso (inclui quiz). OpenAI Academy: duração informada no curso. Microsoft Learn:
        duração dos módulos no catálogo oficial. Os tempos cobrem leitura, vídeo e exercícios, e podem mudar quando as plataformas
        atualizarem o conteúdo.
      </p>
      <p>
        Os cursos da Anthropic mudaram de endereço: saíram de anthropic.skilljar.com e agora ficam em academy.claude.com. Os links das
        trilhas já apontam para o endereço novo.
      </p>
    </div>
  );
}
