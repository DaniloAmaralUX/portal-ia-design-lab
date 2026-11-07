import { GuideResources } from "./GuideResources";
import { AreasSection } from "./AreasSection";
import { EntryPoints } from "./EntryPoints";
import { ForYouSection } from "./ForYouSection";
import { Hero } from "./Hero";
import { LearningWidget } from "./LearningWidget";
import { WhatsNewSection } from "./WhatsNewSection";

export function HomePage() {
  return (
    <>
      <Hero />
      <EntryPoints />
      <div className="library-workspace mt-8 grid grid-cols-1 gap-3 xl:grid-cols-[minmax(0,1fr)_232px]">
        <ForYouSection />
        <LearningWidget />
      </div>
      <GuideResources />
      <AreasSection />
      <WhatsNewSection />
    </>
  );
}
