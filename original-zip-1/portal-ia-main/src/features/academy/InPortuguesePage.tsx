import type { ReactNode } from 'react';
import { Settings, TriangleAlert } from 'lucide-react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Crumb } from '@/components/Crumb';
import { EndCard } from '@/components/EndCard';
import { NextLink } from '@/components/NextLink';
import { Notice } from '@/components/Notice';
import { PrevLink } from '@/components/PrevLink';
import playerCaptions from '@/content/player-captions.jpg';
import playerMenu from '@/content/player-menu.jpg';
import { BY_PLATFORM } from './by-platform';

const ui = 'font-semibold text-foreground';

function Steps({ children }: { children: ReactNode }) {
  return (
    <ol className="mt-4 max-w-measure list-decimal space-y-2 pl-5 text-body leading-relaxed text-foreground/85 marker:text-muted-foreground">
      {children}
    </ol>
  );
}

function Print({ src, alt, caption }: { src: string; alt: string; caption: ReactNode }) {
  return (
    <figure className="mt-6">
      <img
        src={src}
        alt={alt}
        width={900}
        height={506}
        loading="lazy"
        className="w-full rounded-xl outline outline-1 -outline-offset-1 outline-black/10 contrast-more:outline-black/30 dark:outline-white/10 dark:contrast-more:outline-white/30"
      />
      <figcaption className="mt-2 max-w-md text-caption text-muted-foreground text-pretty">{caption}</figcaption>
    </figure>
  );
}

export function InPortuguesePage() {
  return (
    <article className="max-w-3xl">
      <Breadcrumbs
        items={[
          <Crumb key="a" to="/academy">
            Academy
          </Crumb>,
          <span key="c">Antes de começar</span>,
        ]}
      />
      <h1 className="mt-6 font-display text-headline font-bold text-balance">Como estudar em português</h1>
      <p className="mt-3 max-w-xl text-lead leading-relaxed text-muted-foreground text-pretty">
        Os cursos da Anthropic e da OpenAI são em inglês. Nos vídeos dá para ligar a legenda em português, e o navegador
        traduz a página inteira em dois cliques. O Microsoft Learn já abre em português.
      </p>

      <section aria-labelledby="legenda" className="mt-14">
        <h2 id="legenda" className="font-display text-heading font-bold">
          Legenda em português nos vídeos
        </h2>
        <p className="mt-3 max-w-measure text-body leading-relaxed text-muted-foreground">
          Os vídeos da Anthropic Academy rodam no player do YouTube.
        </p>
        <Steps>
          <li>
            Dê o play no vídeo da aula. Se quiser todos os controles, clique em{' '}
            <span lang="en" className={ui}>
              Watch on YouTube
            </span>
            , logo abaixo do vídeo.
          </li>
          <li>
            Clique no botão <span className={ui}>Legendas (CC)</span> na barra do player (1). A legenda aparece embaixo
            da imagem (2).
          </li>
          <li>
            Se a legenda vier em inglês, abra a{' '}
            <span className={ui}>
              engrenagem <Settings aria-hidden className="inline size-4 align-[-0.15em]" /> (Configurações)
            </span>{' '}
            → <span className={ui}>Legendas/CC</span> → <span className={ui}>Traduzir automaticamente</span> →{' '}
            <span className={ui}>Português</span>.
          </li>
          <li>
            Em alguns vídeos, a engrenagem também mostra <span className={ui}>Faixa de áudio</span> em Português (BR),
            com dublagem automática.
          </li>
          <li>
            Abaixo do vídeo, a aba{' '}
            <span lang="en" className={ui}>
              Transcript
            </span>{' '}
            traz o texto completo da fala, e o tradutor do navegador traduz a aba junto com a página.
          </li>
        </Steps>
        <Print
          src={playerCaptions}
          alt="Player do YouTube com o botão de legendas destacado e a legenda em português na parte de baixo do vídeo"
          caption={
            <>
              (1) Botão de legendas ligado e (2) legenda em português. Aula "<span lang="en">What is Claude Code?</span>
              ", do curso Claude Code 101.
            </>
          }
        />
        <Print
          src={playerMenu}
          alt="Menu de configurações do YouTube aberto, com as opções Legendas/CC e Faixa de áudio destacadas em Português"
          caption="(1) Engrenagem, (2) Legendas/CC e (3) Faixa de áudio, as duas já em Português (Brasil)."
        />
      </section>

      <section aria-labelledby="traduzir" className="mt-16">
        <h2 id="traduzir" className="font-display text-heading font-bold">
          Traduzir a página inteira
        </h2>
        <p className="mt-3 max-w-measure text-body leading-relaxed text-muted-foreground">
          Vale para os textos das aulas, os exercícios e a transcrição.
        </p>

        <h3 className="mt-8 font-display text-subheading font-bold">Google Chrome</h3>
        <Steps>
          <li>
            Clique com o botão direito em qualquer parte da página e escolha{' '}
            <span className={ui}>Traduzir para português</span>. Outro caminho: o ícone de tradução no canto direito da
            barra de endereço.
          </li>
          <li>
            Para não repetir em toda aula, abra o mesmo ícone e marque{' '}
            <span className={ui}>Sempre traduzir inglês</span>.
          </li>
        </Steps>

        <h3 className="mt-8 font-display text-subheading font-bold">Microsoft Edge</h3>
        <Steps>
          <li>
            Clique no ícone de tradução na barra de endereço, ou clique com o botão direito e escolha{' '}
            <span className={ui}>Traduzir para Português (Brasil)</span>.
          </li>
          <li>
            Marque <span className={ui}>Sempre traduzir páginas de Inglês</span> para as próximas aulas.
          </li>
        </Steps>

        <h3 className="mt-8 font-display text-subheading font-bold">Extensão (opcional)</h3>
        <p className="mt-3 max-w-measure text-body leading-relaxed text-foreground/85">
          Se o menu de tradução não aparecer, instale a extensão oficial <span className={ui}>Google Tradutor</span> na
          Chrome Web Store. Ela adiciona um botão que traduz a página aberta.
        </p>

        <Notice icon={TriangleAlert} className="mt-6 max-w-measure">
          <p>
            <strong className="font-semibold text-foreground">Atenção com código.</strong> A tradução também troca
            palavras dentro de comandos e exemplos de código. Antes de copiar um comando, volte ao original (
            <span className={ui}>Mostrar original</span> no mesmo menu).
          </p>
        </Notice>
      </section>

      <section aria-labelledby="por-plataforma" className="mt-16">
        <h2 id="por-plataforma" className="font-display text-heading font-bold">
          Por plataforma
        </h2>
        <dl className="mt-6 divide-y divide-border border-y border-border">
          {BY_PLATFORM.map(({ name, text }) => (
            <div key={name} className="py-4">
              <dt className="text-body font-semibold">{name}</dt>
              <dd className="mt-1 max-w-measure text-small leading-relaxed text-foreground/85 text-pretty">{text}</dd>
            </div>
          ))}
        </dl>
      </section>

      <EndCard
        readId="em-portugues"
        done="Você terminou o passo a passo"
        next={
          <NextLink
            to="/academy"
            hash="trilhas"
            activeOptions={{ exact: true }}
            kicker="Próximo"
            label="Escolha a trilha do seu papel"
          />
        }
        prev={<PrevLink to="/academy" activeOptions={{ exact: true }} kicker="Academy" label="Visão geral" />}
      />
    </article>
  );
}
