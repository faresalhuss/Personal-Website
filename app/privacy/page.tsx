import type { Metadata } from "next";
import Link from "next/link";

import { Section } from "@/components/section";

const LAST_UPDATED = "May 31, 2026";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How fareshusseini.com collects, uses, and protects your data, including the newsletter, analytics, affiliate links, and your rights under GDPR and CCPA.",
  alternates: { canonical: "/privacy" },
  openGraph: {
    type: "website",
    url: "/privacy",
    title: "Privacy Policy — Fa'res Husseini",
    description:
      "How fareshusseini.com collects, uses, and protects your data, including the newsletter, analytics, and your privacy rights.",
    images: [
      {
        url: "/api/og?eyebrow=Privacy",
        width: 1200,
        height: 630,
        alt: "Privacy Policy",
      },
    ],
  },
};

export default function PrivacyPage() {
  return (
    <Section className="pt-32 pb-24 sm:pt-40">
      <div className="hero-rise">
        <p className="eyebrow mb-4">Legal</p>
        <h1 className="font-display text-6xl text-ink sm:text-8xl">
          Privacy
          <br />
          Policy
        </h1>
        <p className="mt-6 text-sm tracking-widest text-ink-faint uppercase">
          Last updated: {LAST_UPDATED}
        </p>
      </div>

      <div className="essay-prose mt-14">
        <p>
          Your privacy matters to me. This Privacy Policy explains what personal
          information I, Fa&rsquo;res Husseini (&ldquo;I,&rdquo; &ldquo;me,&rdquo;
          or &ldquo;my&rdquo;), collect through the website at{" "}
          <a href="https://www.fareshusseini.com">www.fareshusseini.com</a> (the
          &ldquo;Site&rdquo;), how and why I use it, who I share it with, and the
          choices and rights you have. By using the Site, you agree to the
          practices described here. This policy works alongside the{" "}
          <Link href="/terms">Terms of Service</Link>.
        </p>

        <h2>1. Who is responsible for your data</h2>
        <p>
          I operate the Site as an individual based in Atlanta, Georgia, United
          States, and I am the party responsible for the personal information
          described in this policy. You can reach me using the contact options
          listed on the Site and in the footer.
        </p>

        <h2>2. Information I collect</h2>
        <p>I collect the following categories of information:</p>
        <ul>
          <li>
            <strong>Information you give me.</strong> When you subscribe to the
            newsletter (&ldquo;The Weekly Note&rdquo;), I collect your email
            address and any optional name or other details you choose to provide.
            If you contact me directly, I collect whatever information is in your
            message.
          </li>
          <li>
            <strong>Usage and analytics data.</strong> I collect aggregated,
            privacy-friendly information about how visitors use the Site, such as
            pages viewed, referring pages, approximate region, and general device
            and browser type. This helps me understand what is useful and improve
            the Site.
          </li>
          <li>
            <strong>Device and log data.</strong> When you visit, servers may
            automatically record technical information such as your IP address
            (often truncated or anonymized), browser type, operating system, and
            timestamps, as part of normal operation and security.
          </li>
          <li>
            <strong>Cookies and similar technologies.</strong> See the cookies
            and analytics section below for details on the limited use of these
            technologies.
          </li>
        </ul>
        <p>
          I do not knowingly collect sensitive personal information, and I ask
          that you not send it to me.
        </p>

        <h2>3. How and why I use your information</h2>
        <p>I use the information I collect to:</p>
        <ul>
          <li>
            send the newsletter and confirm your subscription through a double
            opt-in process;
          </li>
          <li>operate, maintain, secure, and improve the Site;</li>
          <li>
            understand aggregate usage and measure the performance of the Site;
          </li>
          <li>respond to your messages and requests;</li>
          <li>
            detect, prevent, and address fraud, abuse, security issues, and
            technical problems; and
          </li>
          <li>comply with legal obligations and enforce my terms.</li>
        </ul>

        <h2>4. Legal bases for processing</h2>
        <p>
          Where the EU or UK General Data Protection Regulation (GDPR) applies, I
          process personal information on these legal bases: your{" "}
          <strong>consent</strong> (for example, when you subscribe to the
          newsletter, which you can withdraw at any time); my{" "}
          <strong>legitimate interests</strong> in operating, securing, and
          improving the Site in a way that does not override your rights; and
          compliance with a <strong>legal obligation</strong> where required.
        </p>

        <h2>5. Third parties and processors</h2>
        <p>
          I do not sell your personal information. I share limited information
          with trusted service providers who process it on my behalf and under
          their own privacy commitments:
        </p>
        <ul>
          <li>
            <strong>Beehiiv</strong> powers the newsletter and processes your
            email address and subscription activity. See{" "}
            <a
              href="https://www.beehiiv.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
            >
              Beehiiv&rsquo;s privacy policy
            </a>
            .
          </li>
          <li>
            <strong>Vercel</strong> hosts the Site and provides privacy-friendly
            Vercel Analytics and Speed Insights, which measure traffic and
            performance without using cross-site tracking cookies. See{" "}
            <a
              href="https://vercel.com/legal/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
            >
              Vercel&rsquo;s privacy policy
            </a>
            .
          </li>
          <li>
            <strong>Amazon</strong> may receive information when you click an
            affiliate link and visit Amazon, as described below. See{" "}
            <a
              href="https://www.amazon.com/gp/help/customer/display.html?nodeId=468496"
              target="_blank"
              rel="noopener noreferrer"
            >
              Amazon&rsquo;s privacy notice
            </a>
            .
          </li>
        </ul>
        <p>
          I may also disclose information if required by law, to respond to lawful
          requests, to protect rights, safety, and property, or in connection with
          a transfer of the Site to a successor.
        </p>

        <h2>6. Cookies and analytics</h2>
        <p>
          I keep cookies and tracking to a minimum. The Site uses Vercel Analytics
          and Speed Insights, which are designed to be privacy-friendly: they
          measure visits and performance using aggregated data and do not use
          cross-site advertising cookies or build long-term profiles about you.
          Your browser also stores standard technical data needed for the Site to
          function. You can control cookies through your browser settings, though
          disabling some may affect how the Site works.
        </p>

        <h2>7. Affiliate links and tracking</h2>
        <p>
          The Site contains Amazon affiliate links, including on the books page
          and in the downloadable reading list. When you click one and visit
          Amazon, Amazon may set its own cookies and receive information about
          your visit and any purchase so that a qualifying purchase can be
          credited to my Amazon Associates account. This tracking is performed by
          Amazon under its own privacy notice, not by me, and I do not receive
          your payment details or know what specific items you buy. See the
          affiliate disclosure in the <Link href="/terms">Terms of Service</Link>.
        </p>

        <h2>8. Downloads and lead magnets</h2>
        <p>
          The Site may offer a free downloadable PDF. If a download is tied to
          subscribing to the newsletter, the email address you provide is handled
          as described in this policy. The PDF itself may contain affiliate links,
          which work as described above.
        </p>

        <h2>9. Data retention</h2>
        <p>
          I keep newsletter information for as long as you remain subscribed and
          for a reasonable period afterward to honor unsubscribe requests and meet
          legal obligations. Analytics and log data are kept only as long as needed
          for the purposes described here, then deleted or anonymized. You can ask
          me to delete your information at any time, as described below.
        </p>

        <h2>10. Security</h2>
        <p>
          I take reasonable technical and organizational measures to protect your
          information, and I rely on reputable providers such as Beehiiv and
          Vercel that maintain their own safeguards. However, no method of
          transmission or storage is completely secure, and I cannot guarantee
          absolute security.
        </p>

        <h2>11. Your privacy rights</h2>
        <p>
          Depending on where you live, you may have some or all of the following
          rights regarding your personal information:
        </p>
        <ul>
          <li>
            <strong>Access</strong> a copy of the information I hold about you;
          </li>
          <li>
            <strong>Correct</strong> information that is inaccurate or incomplete;
          </li>
          <li>
            <strong>Delete</strong> your information (for example, by
            unsubscribing or by request);
          </li>
          <li>
            <strong>Object to or restrict</strong> certain processing, and{" "}
            <strong>withdraw consent</strong> at any time; and
          </li>
          <li>
            <strong>Portability</strong> of information you provided, where
            applicable.
          </li>
        </ul>
        <p>
          <strong>GDPR (EU and UK).</strong> If you are in the European Economic
          Area or the United Kingdom, you have the rights above and may lodge a
          complaint with your local data protection authority. Withdrawing consent
          does not affect processing that already took place.
        </p>
        <p>
          <strong>CCPA and CPRA (California).</strong> If you are a California
          resident, you have the right to know what personal information is
          collected and how it is used and shared, the right to request deletion,
          the right to correct inaccurate information, and the right to opt out of
          the &ldquo;sale&rdquo; or &ldquo;sharing&rdquo; of personal information.{" "}
          <strong>
            I do not sell your personal information, and I do not share it for
            cross-context behavioral advertising.
          </strong>{" "}
          I will not discriminate against you for exercising any of your rights.
          You may use an authorized agent to make a request on your behalf.
        </p>
        <p>
          To exercise any right, contact me using the options on the Site. I may
          need to verify your identity before acting on a request, and I will
          respond within the timeframes required by applicable law.
        </p>

        <h2>12. Children&rsquo;s privacy</h2>
        <p>
          The Site is not directed to children under 13, and I do not knowingly
          collect personal information from children under 13, consistent with the
          U.S. Children&rsquo;s Online Privacy Protection Act (COPPA). The
          newsletter and Site are intended for users 16 and older. If you believe a
          child has provided me with personal information, please contact me and I
          will delete it.
        </p>

        <h2>13. International data transfers</h2>
        <p>
          I operate from the United States, and my service providers may process
          and store information in the United States and other countries. If you
          access the Site from outside the United States, you understand that your
          information may be transferred to and processed in countries whose data
          protection laws may differ from those in your country. Where required, my
          providers rely on appropriate safeguards for such transfers.
        </p>

        <h2>14. Third-party links</h2>
        <p>
          The Site links to third-party websites and services that I do not
          control. This Privacy Policy does not apply to those sites, and I am not
          responsible for their privacy practices. Please review the privacy
          policies of any third party you visit.
        </p>

        <h2>15. Changes to this policy</h2>
        <p>
          I may update this Privacy Policy from time to time. When I do, I will
          revise the &ldquo;Last updated&rdquo; date above. Material changes will
          be reflected on this page, and your continued use of the Site after an
          update means you accept the revised policy.
        </p>

        <h2>16. How to contact me</h2>
        <p>
          If you have questions about this Privacy Policy or want to exercise your
          privacy rights, please reach out through the contact options listed on
          the Site, including the social channels linked in the footer. I will do
          my best to respond promptly.
        </p>
      </div>
    </Section>
  );
}
