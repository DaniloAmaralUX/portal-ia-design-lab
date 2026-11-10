import { AreasSection } from "./AreasSection";
import { EntryPoints } from "./EntryPoints";
import { ForYouSection } from "./ForYouSection";
import { Hero } from "./Hero";
import { HowItWorks } from "./HowItWorks";
import { WhatsNewSection } from "./WhatsNewSection";

export function HomePage() {
  return (
    <>
      <Hero />
      <ForYouSection />
      <EntryPoints />
      <AreasSection />
      <HowItWorks />
      <WhatsNewSection />
    </>
  );
}
