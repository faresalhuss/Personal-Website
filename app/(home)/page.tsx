import dynamic from "next/dynamic";

import { JsonLd } from "@/components/json-ld";
import { homeGraphSchema } from "@/lib/structured-data";

import { Feature } from "./_components/feature";
import { Hero } from "./_components/hero";
import { Intro } from "./_components/intro";
import { Newsletter } from "./_components/newsletter";
import { QuizCta } from "./_components/quiz-cta";
import { Ventures } from "./_components/ventures";
import { Writing } from "./_components/writing";

// The timeline is below the fold and the only consumer of the motion library.
// Load it as its own chunk (still server-rendered) so motion stays off the
// homepage's critical JS path.
const Timeline = dynamic(() =>
  import("./_components/timeline").then((m) => m.Timeline),
);

export default function HomePage() {
  return (
    <>
      <JsonLd data={homeGraphSchema()} />

      <Hero />
      <Intro />
      <Ventures />
      <QuizCta />
      <Timeline />
      <Writing />
      <Feature />
      <Newsletter />
    </>
  );
}
