import Link from "next/link";
import { SiteFooter } from "@/src/components/footer";

export const metadata = {
  title: "Terms",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-[radial-gradient(ellipse_at_15%_0%,rgba(99,133,255,0.11),transparent_42%),radial-gradient(ellipse_at_90%_100%,rgba(155,123,255,0.08),transparent_36%)] px-4 py-7 min-[561px]:px-6 min-[561px]:py-16">
      <article className="w-full max-w-[780px] rounded-[18px] border border-white/10 bg-[linear-gradient(145deg,rgba(18,28,48,0.96),rgba(12,19,34,0.98))] p-[clamp(28px,6vw,58px)] shadow-[0_28px_90px_rgba(0,0,0,0.3)] min-[561px]:rounded-[24px]">
        <Link className="mb-[35px] inline-flex text-[13px] font-bold text-[#bdc9df] transition duration-200 hover:-translate-x-[3px] hover:text-white min-[561px]:mb-11" href="/">← Back to home</Link>
        <span className="mb-3 block text-[11px] font-extrabold tracking-[0.14em] text-[#9b7bff]">CEO JACK LEARNING HUB</span>
        <h1 className="mb-3 text-[clamp(38px,7vw,60px)] tracking-[-0.045em]">Terms of Use</h1>
        <p className="max-w-[560px] text-[clamp(16px,2.5vw,19px)] leading-[1.65] text-[#b6c0d2]">These terms explain how to use our learning website and what you can expect from it.</p>
        <p className="mt-[14px] text-[13px] text-[#8491aa]">Last updated: <time dateTime="2026-11-01">1 November 2026</time></p>
        <div className="mt-[30px] rounded-[14px] border border-white/[0.08] bg-white/[0.025] p-[18px] min-[561px]:px-6 min-[561px]:py-[22px] [&_a]:text-[#b8a5ff] [&_a]:underline [&_a]:underline-offset-[3px] [&_h2]:mb-[10px] [&_h2]:text-[clamp(18px,2.5vw,22px)] [&_h2]:leading-[1.4] [&_h2]:tracking-[-0.02em] [&_h2]:text-[#f0f3fb] [&_li]:text-[15px] [&_li]:leading-[1.8] [&_li]:marker:text-[#9b7bff] [&_p]:mb-[14px] [&_p]:text-[15px] [&_p]:leading-[1.85] [&_p]:text-[#a7b1c7] [&_section+section]:mt-7 [&_section+section]:border-t [&_section+section]:border-white/[0.08] [&_section+section]:pt-6 [&_strong]:text-[#e7ebf8] [&_ul]:my-0 [&_ul]:grid [&_ul]:list-disc [&_ul]:gap-3 [&_ul]:pl-[22px] [&_.legal-related]:mt-7 [&_.legal-related]:border-t [&_.legal-related]:border-white/[0.08] [&_.legal-related]:pt-5">
          <section aria-labelledby="terms-acceptance">
            <h2 id="terms-acceptance">1. Using the Learning Hub</h2>
            <p>By visiting or using CEO JACK LEARNING HUB, you agree to these terms. If you do not agree, please stop using the website. “We,” “us” and “our” mean CEO JACK LEARNING HUB; “you” means a visitor or learner using the site.</p>
          </section>
          <section aria-labelledby="terms-service">
            <h2 id="terms-service">2. What the service provides</h2>
            <p>The site offers educational and informational content across Education, Digital Skills and Entrepreneurship, along with learning activities and an AI learning companion. Features may change as the service develops. Lessons and AI responses are general learning support, may contain mistakes, and are not a substitute for advice from a qualified teacher or professional.</p>
          </section>
          <section aria-labelledby="terms-account">
            <h2 id="terms-account">3. Accounts and learner information</h2>
            <p>Keep your sign-in details private and provide accurate information when using account forms. You are responsible for activity carried out through your account and should tell us if you think someone else has accessed it. When Supabase is configured, sign-in uses Supabase Auth and your learning profile and sample lesson progress are saved to your account. AI chats and work plans remain on the device where you use them.</p>
          </section>
          <section aria-labelledby="terms-young-learners">
            <h2 id="terms-young-learners">4. Children and young learners</h2>
            <p>If you are under 18, ask a parent or guardian to review these terms and supervise your use of the site. A parent or guardian must give permission before a child’s personal data is submitted. The site does not currently verify that permission, so do not create an account or submit a child’s personal data until the parent or guardian has agreed. Do not share your home address, school, passwords, phone number, precise location or other sensitive details in lessons or AI chats.</p>
          </section>
          <section aria-labelledby="terms-acceptable-use">
            <h2 id="terms-acceptable-use">5. Acceptable use</h2>
            <p>Use the site lawfully and respectfully. Do not try to disrupt the service, access another person’s account or data, upload malicious code, misuse the AI feature, or copy and redistribute material in a way that violates someone’s rights.</p>
          </section>
          <section aria-labelledby="terms-content">
            <h2 id="terms-content">6. Content and ownership</h2>
            <p>Unless a page says otherwise, the site’s name, design and original learning materials belong to CEO JACK LEARNING HUB or the people who license them to us. You may use the materials for your own personal learning. Ask for permission before republishing or commercially reusing them. You keep ownership of original content you submit, while allowing us to process it only as needed to provide the feature you chose.</p>
          </section>
          <section aria-labelledby="terms-third-party">
            <h2 id="terms-third-party">7. External services</h2>
            <p>The site may link to third-party websites or send an AI prompt to an external AI provider when that feature is enabled. Those services have their own terms and privacy practices. Review them before sharing information, and do not include confidential or sensitive details in AI prompts.</p>
          </section>
          <section aria-labelledby="terms-availability">
            <h2 id="terms-availability">8. Availability and changes</h2>
            <p>We work to keep the site useful, but cannot promise it will always be available, uninterrupted or error-free. We may update features or these terms. When we make a significant change, we will update the date on this page. Continued use after the updated terms take effect means you accept the revised terms.</p>
          </section>
          <section aria-labelledby="terms-law">
            <h2 id="terms-law">9. Governing law</h2>
            <p>These terms are governed by the laws of Uganda, subject to any consumer protections that apply to you and cannot legally be excluded.</p>
          </section>
          <section aria-labelledby="terms-contact">
            <h2 id="terms-contact">10. Contact</h2>
            <p>Questions about these terms? Email <a href="mailto:info@ceojacklearninghub.com">info@ceojacklearninghub.com</a> or use our <Link href="/contact">contact page</Link>.</p>
          </section>
          <p className="legal-related">See also our <Link href="/privacy">Privacy Policy</Link>.</p>
        </div>
      </article>
      <SiteFooter />
    </main>
  );
}
