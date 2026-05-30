import Link from "next/link";

import { Portrait } from "@/components/portrait";

export function Intro() {
  return (
    <section id="story" className="bg-night py-24 sm:py-32">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 sm:px-10 lg:grid-cols-[1.45fr_1fr] lg:items-center">
        <div>
          <p className="eyebrow mb-6">Who I am</p>
          <h2 className="font-display text-3xl leading-[1.04] normal-case sm:text-[2.75rem]">
            Fa&rsquo;res Husseini; <span className="text-lime">marketer</span>,{" "}
            <span className="text-lime">founder</span>,{" "}
            <span className="text-lime">builder</span>, and someone documenting{" "}
            <span className="text-lime">what it actually takes</span> to grow a
            business from zero.
          </h2>
          <Link href="/about" className="btn-lime mt-8">
            Read my story
          </Link>
        </div>

        <Portrait className="mx-auto w-full max-w-sm lg:max-w-none" />
      </div>
    </section>
  );
}
