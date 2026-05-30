import { NewsletterForm } from "./newsletter-form";

export function Newsletter() {
  return (
    <section id="newsletter" className="bg-lime py-24 text-night sm:py-32">
      <div className="mx-auto max-w-3xl px-6 text-center sm:px-10">
        <p className="text-xs font-semibold tracking-[0.22em] text-night/70 uppercase">
          The newsletter
        </p>
        <h2 className="mt-4 font-display text-6xl text-night sm:text-8xl">
          The weekly note
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-lg text-night/80">
          A short email every week about what I&rsquo;m learning building. No
          course pitch. No filler. Just notes from the actual work.
        </p>
        <div className="mt-9">
          <NewsletterForm />
        </div>
      </div>
    </section>
  );
}
