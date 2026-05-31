import type { Metadata } from "next";
import Link from "next/link";

import { Section } from "@/components/section";

const LAST_UPDATED = "May 31, 2026";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The terms that govern your use of fareshusseini.com, including disclaimers, affiliate disclosures, limitation of liability, and dispute resolution.",
  alternates: { canonical: "/terms" },
  openGraph: {
    type: "website",
    url: "/terms",
    title: "Terms of Service — Fa'res Husseini",
    description:
      "The terms that govern your use of fareshusseini.com, including disclaimers, affiliate disclosures, and dispute resolution.",
    images: [
      {
        url: "/api/og?eyebrow=Terms",
        width: 1200,
        height: 630,
        alt: "Terms of Service",
      },
    ],
  },
};

export default function TermsPage() {
  return (
    <Section className="pt-32 pb-24 sm:pt-40">
      <div className="hero-rise">
        <p className="eyebrow mb-4">Legal</p>
        <h1 className="font-display text-6xl text-ink sm:text-8xl">
          Terms of
          <br />
          Service
        </h1>
        <p className="mt-6 text-sm tracking-widest text-ink-faint uppercase">
          Last updated: {LAST_UPDATED}
        </p>
      </div>

      <div className="essay-prose mt-14">
        <p>
          Welcome, and thanks for reading. These Terms of Service (the
          &ldquo;Terms&rdquo;) are a binding agreement between you and Fa&rsquo;res
          Husseini (&ldquo;Fa&rsquo;res,&rdquo; &ldquo;I,&rdquo; &ldquo;me,&rdquo;
          or &ldquo;my&rdquo;) and govern your access to and use of the website at{" "}
          <a href="https://www.fareshusseini.com">www.fareshusseini.com</a> and
          any related pages, content, newsletters, downloads, and services I make
          available (together, the &ldquo;Site&rdquo;). Please read them
          carefully. They include important limitations on liability, a
          disclaimer of warranties, and a section on arbitration and a
          class-action waiver that affect your legal rights.
        </p>

        <h2>1. Acceptance of these Terms</h2>
        <p>
          By accessing or using the Site, subscribing to the newsletter,
          downloading any file, or otherwise interacting with the Site, you
          acknowledge that you have read, understood, and agree to be bound by
          these Terms and by the{" "}
          <Link href="/privacy">Privacy Policy</Link>, which is incorporated
          here by reference. If you do not agree, please do not use the Site.
        </p>

        <h2>2. Eligibility</h2>
        <p>
          The Site is intended for users who are at least 16 years old and who
          have reached the age of majority in their jurisdiction. By using the
          Site you represent and warrant that you meet these requirements, that
          you have the legal capacity to enter into these Terms, and that you
          are not barred from using the Site under the laws of the United States
          or any other applicable jurisdiction. The Site is not directed to
          children under 13, and I do not knowingly collect personal information
          from children under 13. See the{" "}
          <Link href="/privacy">Privacy Policy</Link> for details.
        </p>

        <h2>3. Intellectual property and your license to view</h2>
        <p>
          The Site and all of its contents, including text, essays, articles,
          newsletters, downloadable PDFs, graphics, logos, layout, design,
          audio, video, and the selection and arrangement of all of it (the
          &ldquo;Content&rdquo;), are owned by me or my licensors and are
          protected by copyright, trademark, and other intellectual property
          laws. The name &ldquo;Fa&rsquo;res Husseini,&rdquo; any associated
          logos, and the look and feel of the Site are my property.
        </p>
        <p>
          Subject to these Terms, I grant you a limited, personal,
          non-exclusive, non-transferable, revocable license to access and view
          the Content for your own personal, non-commercial use. You may not
          copy, reproduce, republish, distribute, sell, license, modify, create
          derivative works from, publicly display, frame, scrape, mine, or
          exploit any part of the Content without my prior written permission,
          except that you may share links to public pages and quote brief
          excerpts with proper attribution. Any use of automated systems,
          including bots, scrapers, or tools that train machine-learning or
          artificial-intelligence models on the Content, is prohibited without
          my prior written consent. All rights not expressly granted are
          reserved.
        </p>

        <h2>4. Acceptable use and prohibited conduct</h2>
        <p>You agree that you will not, and will not attempt to:</p>
        <ul>
          <li>
            use the Site for any unlawful, fraudulent, or unauthorized purpose,
            or in violation of any applicable law or regulation;
          </li>
          <li>
            access, tamper with, probe, scan, or test the vulnerability of the
            Site or any related systems, or breach any security or
            authentication measures;
          </li>
          <li>
            interfere with or disrupt the Site, the servers, or networks
            connected to it, including by introducing viruses, malware, or other
            harmful code;
          </li>
          <li>
            use any robot, spider, scraper, crawler, or other automated means to
            access, harvest, or copy the Site or its data, or to collect email
            addresses or personal information;
          </li>
          <li>
            use the Content to train, fine-tune, or develop any
            machine-learning or artificial-intelligence model without my written
            consent;
          </li>
          <li>
            impersonate any person or entity, or misrepresent your affiliation
            with any person or entity;
          </li>
          <li>
            submit false, misleading, or another person&rsquo;s information when
            subscribing to the newsletter or filling out any form;
          </li>
          <li>
            use the Site or newsletter to transmit spam, chain letters, or other
            unsolicited communications, or to harass, abuse, or harm others; or
          </li>
          <li>
            attempt to reverse engineer, decompile, or otherwise derive the
            source code of any part of the Site.
          </li>
        </ul>
        <p>
          I may investigate and take any legal or technical action I deem
          appropriate in response to violations, including removing content and
          restricting or terminating your access without notice.
        </p>

        <h2>5. The newsletter</h2>
        <p>
          The Site offers an email newsletter (&ldquo;The Weekly Note&rdquo;).
          When you subscribe, you provide your email address and any optional
          information, and you consent to receive recurring emails from me. The
          newsletter uses a double opt-in process, meaning you must confirm your
          subscription before you receive issues. Email delivery is powered by a
          third-party provider, Beehiiv, and your information is handled as
          described in the <Link href="/privacy">Privacy Policy</Link>. You can
          unsubscribe at any time using the link in any email. I make no promise
          about the frequency, timing, or continued availability of the
          newsletter, and I may modify or discontinue it at any time.
        </p>

        <h2>6. Affiliate disclosure and recommendations</h2>
        <p>
          I am a participant in the Amazon Services LLC Associates Program, an
          affiliate advertising program designed to provide a means for sites to
          earn advertising fees by advertising and linking to Amazon.com. As an
          Amazon Associate I earn from qualifying purchases. This means that when
          you click certain links on the Site, including on the books page and in
          the downloadable reading list, and then make a purchase, I may receive
          a commission at no additional cost to you.
        </p>
        <p>
          Consistent with U.S. Federal Trade Commission guidance, I disclose that
          my recommendations may include such affiliate links. I only recommend
          books and products I genuinely find worthwhile, but my opinions are my
          own, are offered for general informational purposes, and are not a
          guarantee of any result. Prices, availability, and product details are
          set by the third-party seller and may change. I am not responsible for
          any purchase you make through an affiliate link, and your transaction
          is governed solely by the terms of the third-party seller.
        </p>

        <h2>7. Third-party links and services</h2>
        <p>
          The Site contains links to third-party websites, products, and
          services that I do not own or control, including Amazon, social media
          platforms, my email provider, and others. These links are provided for
          convenience only. I do not endorse and am not responsible for the
          content, accuracy, privacy practices, products, or services of any
          third party. Your use of any third-party site or service is at your own
          risk and is governed by that third party&rsquo;s terms and policies.
        </p>

        <h2>8. No professional advice</h2>
        <p>
          All Content on the Site, including essays, the newsletter, book
          recommendations, downloads, and any future audio, video, or podcast
          content, is provided for general informational and educational purposes
          only. It reflects my personal experiences and opinions as someone still
          figuring things out, and it is{" "}
          <strong>
            not professional, financial, investment, business, legal, accounting,
            medical, mental-health, or tax advice
          </strong>{" "}
          of any kind. Nothing on the Site creates a professional-client,
          fiduciary, or advisory relationship between you and me.
        </p>
        <p>
          You should not act or refrain from acting on the basis of any Content
          without seeking the advice of a qualified professional licensed in your
          jurisdiction who can consider your specific circumstances. Any reliance
          you place on the Content is strictly at your own risk. Past results,
          stories, or outcomes described on the Site are not a guarantee or
          prediction of future results, and individual results will vary.
        </p>

        <h2>9. Disclaimer of warranties</h2>
        <p>
          The Site and all Content are provided on an &ldquo;AS IS&rdquo; and
          &ldquo;AS AVAILABLE&rdquo; basis, with all faults and without
          warranties of any kind. To the fullest extent permitted by law, I
          disclaim all warranties, whether express, implied, statutory, or
          otherwise, including any implied warranties of merchantability, fitness
          for a particular purpose, title, accuracy, and non-infringement. I do
          not warrant that the Site will be uninterrupted, secure, error-free, or
          free of viruses or other harmful components, that defects will be
          corrected, or that the Content is accurate, complete, reliable, or
          current. Some jurisdictions do not allow the exclusion of certain
          warranties, so some of these exclusions may not apply to you.
        </p>

        <h2>10. Limitation of liability</h2>
        <p>
          To the fullest extent permitted by law, in no event will Fa&rsquo;res
          Husseini or any related party be liable for any indirect, incidental,
          special, consequential, exemplary, or punitive damages, or for any loss
          of profits, revenue, data, goodwill, or other intangible losses,
          arising out of or relating to your access to or use of, or inability to
          access or use, the Site or any Content, whether based in contract,
          tort, negligence, strict liability, or any other legal theory, even if
          I have been advised of the possibility of such damages.
        </p>
        <p>
          To the fullest extent permitted by law, my total cumulative liability
          for all claims relating to the Site or these Terms will not exceed the
          greater of the total amount you paid to me, if any, in the twelve
          months before the event giving rise to the claim, or one hundred U.S.
          dollars (US $100). These limitations apply even if a remedy fails of
          its essential purpose. Some jurisdictions do not allow the limitation
          or exclusion of certain damages, so some of these limitations may not
          apply to you.
        </p>

        <h2>11. Indemnification</h2>
        <p>
          You agree to defend, indemnify, and hold harmless Fa&rsquo;res Husseini
          and any related parties from and against any claims, liabilities,
          damages, losses, costs, and expenses, including reasonable
          attorneys&rsquo; fees, arising out of or relating to your use of the
          Site, your violation of these Terms, your violation of any law or the
          rights of any third party, or any content you submit. I reserve the
          right to assume the exclusive defense and control of any matter subject
          to indemnification, in which case you agree to cooperate with me.
        </p>

        <h2>12. Copyright complaints (DMCA)</h2>
        <p>
          I respect the intellectual property rights of others. If you believe
          that content on the Site infringes your copyright, you may send a
          written notice that includes: a description of the copyrighted work; the
          location of the allegedly infringing material; your contact
          information; a statement that you have a good-faith belief the use is
          not authorized; a statement, under penalty of perjury, that the
          information is accurate and that you are the owner or authorized to act
          on the owner&rsquo;s behalf; and your physical or electronic signature.
          Send notices using the contact details in the &ldquo;Contact&rdquo;
          section below.
        </p>

        <h2>13. Privacy</h2>
        <p>
          Your use of the Site is also governed by the{" "}
          <Link href="/privacy">Privacy Policy</Link>, which explains what
          information I collect, how I use it, and the choices you have. By using
          the Site, you consent to the practices described there.
        </p>

        <h2>14. Modifications to the Terms and the Site</h2>
        <p>
          I may update these Terms from time to time. When I do, I will revise the
          &ldquo;Last updated&rdquo; date above. Changes are effective when
          posted. Your continued use of the Site after changes are posted
          constitutes your acceptance of the revised Terms. I may also change,
          suspend, or discontinue any part of the Site at any time, without
          notice or liability.
        </p>

        <h2>15. Termination</h2>
        <p>
          I may suspend or terminate your access to the Site at any time, for any
          reason, and without notice, including if I believe you have violated
          these Terms. Upon termination, the license granted to you ends and you
          must stop using the Site. Sections that by their nature should survive
          termination, including intellectual property, disclaimers, limitation
          of liability, indemnification, and dispute resolution, will survive.
        </p>

        <h2>16. Governing law</h2>
        <p>
          These Terms and any dispute arising out of or relating to them or the
          Site are governed by the laws of the State of Georgia, United States,
          without regard to its conflict-of-law principles. Subject to the
          arbitration provisions below, you agree that any action not subject to
          arbitration will be brought exclusively in the state or federal courts
          located in Georgia, and you consent to the personal jurisdiction of
          those courts.
        </p>

        <h2>17. Dispute resolution, arbitration, and class-action waiver</h2>
        <p>
          <strong>Please read this section carefully. It affects your legal rights.</strong>{" "}
          Most concerns can be resolved informally, so before filing any claim you
          agree to first contact me using the details below and to try in good
          faith to resolve the dispute for at least 30 days.
        </p>
        <p>
          If we cannot resolve a dispute informally, you and I agree that any
          dispute, claim, or controversy arising out of or relating to these Terms
          or the Site will be resolved by binding individual arbitration, rather
          than in court, except that either party may bring an individual claim in
          small-claims court if it qualifies. The arbitration will be administered
          under the rules of a recognized arbitration provider, will take place in
          Georgia or another mutually agreed location or remotely, and will be
          governed by the U.S. Federal Arbitration Act.
        </p>
        <p>
          <strong>Class-action waiver.</strong> You and I agree that each may
          bring claims against the other only in an individual capacity, and not
          as a plaintiff or class member in any purported class, collective, or
          representative proceeding. The arbitrator may not consolidate more than
          one person&rsquo;s claims and may not preside over any form of class
          proceeding.
        </p>
        <p>
          <strong>Your right to opt out.</strong> You may opt out of this
          arbitration and class-action waiver section by sending me written notice
          within 30 days of first accepting these Terms, using the contact details
          below and stating your name and your intent to opt out. If you opt out,
          neither you nor I will be bound by the arbitration and class-action
          waiver provisions, and disputes will instead proceed in the courts
          described under &ldquo;Governing law.&rdquo; Opting out has no effect on
          any other part of these Terms.
        </p>

        <h2>18. Severability</h2>
        <p>
          If any provision of these Terms is held to be invalid or unenforceable,
          that provision will be limited or eliminated to the minimum extent
          necessary, and the remaining provisions will remain in full force and
          effect. If the class-action waiver above is found unenforceable as to a
          particular claim, that claim, and only that claim, will be severed from
          arbitration and brought in court.
        </p>

        <h2>19. Entire agreement and miscellaneous</h2>
        <p>
          These Terms, together with the <Link href="/privacy">Privacy Policy</Link>,
          are the entire agreement between you and me regarding the Site and
          supersede any prior agreements. My failure to enforce any provision is
          not a waiver of it. You may not assign these Terms without my consent,
          and I may assign them freely. Nothing in these Terms creates any agency,
          partnership, or joint-venture relationship between us. Headings are for
          convenience only.
        </p>

        <h2>20. Contact</h2>
        <p>
          If you have questions about these Terms, or to send a legal or copyright
          notice or an arbitration opt-out, please reach out through the contact
          options listed on the Site, including the social channels linked in the
          footer. I will route your message to the appropriate place.
        </p>
      </div>
    </Section>
  );
}
