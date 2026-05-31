import { JsonLd } from "@/components/json-ld";
import { homeGraphSchema } from "@/lib/structured-data";

import { Feature } from "./_components/feature";
import { Hero } from "./_components/hero";
import { Intro } from "./_components/intro";
import { Newsletter } from "./_components/newsletter";
import { Timeline } from "./_components/timeline";
import { Ventures } from "./_components/ventures";
import { Writing } from "./_components/writing";

export default function HomePage() {
  return (
    <>
      <JsonLd data={homeGraphSchema()} />

      <Hero />
      <Intro />
      <Ventures />
      <Timeline />
      <Writing />
      <Feature />
      <Newsletter />
    </>
  );
}
