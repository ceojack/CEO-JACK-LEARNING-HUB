import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/src/components/footer";
import { SiteHeader } from "@/src/components/header";
import { blogPosts } from "@/src/utils/blog-posts";

const siteUrl = "https://ceojacklearninghub.com";
const profileUrl = `${siteUrl}/author/ceo-jack`;
const profileDescription =
  "CEO JACK is a business coach and entrepreneur based in Kampala, Uganda, and the founder of CEO JACK LEARNING HUB, a learning platform for education, digital skills and entrepreneurship.";

export const metadata: Metadata = {
  title: "CEO JACK | Business Coach, Entrepreneur & Founder",
  description: profileDescription,
  alternates: { canonical: "/author/ceo-jack" },
  openGraph: {
    title: "CEO JACK | About the Founder",
    description: profileDescription,
    url: "/author/ceo-jack",
    siteName: "CEO JACK LEARNING HUB",
    type: "profile",
    images: ["/assets/images/logo.webp"],
  },
  twitter: {
    card: "summary",
    title: "CEO JACK | Business Coach & Founder",
    description: profileDescription,
    images: ["/assets/images/logo.webp"],
  },
};

const profileSchema = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  name: "About CEO JACK",
  url: profileUrl,
  mainEntity: {
    "@type": "Person",
    "@id": `${profileUrl}#person`,
    name: "CEO JACK",
    description: profileDescription,
    url: profileUrl,
    jobTitle: "Business Coach and Entrepreneur",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Kampala",
      addressCountry: "UG",
    },
    worksFor: {
      "@type": "EducationalOrganization",
      "@id": `${siteUrl}/#organization`,
      name: "CEO JACK LEARNING HUB",
      url: siteUrl,
    },
    knowsAbout: ["Business coaching", "Entrepreneurship", "Leadership", "Digital skills", "Education"],
    mainEntityOfPage: profileUrl,
  },
};

export default function CeoJackAuthorPage() {
  return (
    <div className={"blog-page blog-shell author-page [--blog-bg:#080d1b] [--blog-surface:#10182a] [--blog-surface-raised:#151f35] [--blog-text:#f5f7ff] [--blog-muted:#a7b1c7] [--blog-blue:#819aff] [--blog-violet:#b19bff] [--blog-border:rgba(255,_255,_255,_.1)] [min-height:70vh] [color:var(--blog-text)] [background:var(--blog-bg)] [font-family:'DM_Sans',_sans-serif] [line-height:1.72] [letter-spacing:.008em] [&_h1]:[font-family:'Space_Grotesk',_sans-serif] [&_h1]:[letter-spacing:-.025em] [&_h2]:[font-family:'Space_Grotesk',_sans-serif] [&_h2]:[letter-spacing:-.025em] [&_h3]:[font-family:'Space_Grotesk',_sans-serif] [&_h3]:[letter-spacing:-.025em] [&_h4]:[font-family:'Space_Grotesk',_sans-serif] [&_h4]:[letter-spacing:-.025em] [&_a]:[color:inherit] [&_a]:[text-decoration:none] [&_a:hover]:[color:var(--blog-blue)] !motion-reduce:[&_*]:[scroll-behavior:auto] !motion-reduce:[&_*]:[transition-duration:.01ms] !motion-reduce:[&_*::before]:[scroll-behavior:auto] !motion-reduce:[&_*::before]:[transition-duration:.01ms] !motion-reduce:[&_*::after]:[scroll-behavior:auto] !motion-reduce:[&_*::after]:[transition-duration:.01ms]"}>
      <div className="page-bg" aria-hidden="true" />
      <SiteHeader active="/blog" />
      <main className={"blog-page author-profile-main [--blog-bg:#080d1b] [--blog-surface:#10182a] [--blog-surface-raised:#151f35] [--blog-text:#f5f7ff] [--blog-muted:#a7b1c7] [--blog-blue:#819aff] [--blog-violet:#b19bff] [--blog-border:rgba(255,_255,_255,_.1)] [min-height:70vh] [color:var(--blog-text)] [background:var(--blog-bg)] [font-family:'DM_Sans',_sans-serif] [line-height:1.72] [letter-spacing:.008em] [&_h1]:[font-family:'Space_Grotesk',_sans-serif] [&_h1]:[letter-spacing:-.025em] [&_h2]:[font-family:'Space_Grotesk',_sans-serif] [&_h2]:[letter-spacing:-.025em] [&_h3]:[font-family:'Space_Grotesk',_sans-serif] [&_h3]:[letter-spacing:-.025em] [&_h4]:[font-family:'Space_Grotesk',_sans-serif] [&_h4]:[letter-spacing:-.025em] [&_a]:[color:inherit] [&_a]:[text-decoration:none] [&_a:hover]:[color:var(--blog-blue)] !motion-reduce:[&_*]:[scroll-behavior:auto] !motion-reduce:[&_*]:[transition-duration:.01ms] !motion-reduce:[&_*::before]:[scroll-behavior:auto] !motion-reduce:[&_*::before]:[transition-duration:.01ms] !motion-reduce:[&_*::after]:[scroll-behavior:auto] !motion-reduce:[&_*::after]:[transition-duration:.01ms]"}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(profileSchema).replace(/</g, "\\u003c") }}
        />
        <div className={"container author-profile-container [width:min(1160px,_calc(100%_-_48px))] [margin-inline:auto] max-[780px]:[width:min(100%_-_32px,_560px)] [padding-top:28px] max-[760px]:[padding-top:22px]"}>
          <nav className={"article-breadcrumbs [display:flex] [flex-wrap:wrap] [align-items:center] [gap:10px] [color:var(--blog-muted)] [font-size:12px] [&_[aria-current=\"page\"]]:[color:#d5daeb] max-[780px]:[font-size:11px]"} aria-label="Breadcrumb">
            <Link href="/">Home</Link><span aria-hidden="true">/</span><Link href="/blog">Blog</Link><span aria-hidden="true">/</span><span aria-current="page">Author profile</span>
          </nav>

          <section className={"author-profile-hero [display:grid] [grid-template-columns:minmax(0,_1fr)_360px] [align-items:center] [gap:clamp(38px,_8vw,_110px)] [padding-block:70px_78px] max-[760px]:[grid-template-columns:minmax(0,_1fr)] max-[760px]:[gap:35px] max-[760px]:[padding-block:50px_56px]"} aria-labelledby="author-name">
            <div className={"author-profile-copy [max-width:700px] [&_h1]:[margin:20px_0_17px] [&_h1]:[font-size:clamp(52px,_8vw,_86px)] [&_h1]:[letter-spacing:-.065em] [&_h1]:[line-height:.98] [&_h1_span]:[color:var(--blog-violet)] max-[760px]:[&_h1]:[font-size:clamp(52px,_14vw,_76px)]"}>
              <span className={"blog-eyebrow [display:inline-flex] [align-items:center] [gap:9px] [color:var(--blog-blue)] [font-size:11px] [font-weight:800] [letter-spacing:1.6px] [&_i]:[width:7px] [&_i]:[height:7px] [&_i]:[border-radius:50%] [&_i]:[background:var(--blog-blue)] [&_i]:[box-shadow:0_0_14px_rgba(129,_154,_255,_.7)]"}><i /> FOUNDER · BUSINESS COACH · ENTREPRENEUR</span>
              <h1 id="author-name">CEO <span>JACK</span></h1>
              <p className={"author-profile-intro [max-width:610px] [margin:0_0_14px] [color:#eef0fb] [font-size:21px] [font-weight:600] [line-height:1.55] max-[760px]:[font-size:18px]"}>Business coach and entrepreneur based in Kampala, Uganda. Founder of CEO JACK LEARNING HUB.</p>
              <p className={"author-profile-description [max-width:620px] [margin:0] [color:var(--blog-muted)] [font-size:16px] [line-height:1.8]"}>Through the Hub, CEO JACK shares learning across education, leadership, digital skills and entrepreneurship to help young people turn knowledge into practical action.</p>
              <div className={"author-profile-actions [display:flex] [flex-wrap:wrap] [align-items:center] [gap:20px] [margin-top:27px]"}>
                <Link href="/blog" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-5 text-sm font-bold text-white shadow-lg shadow-indigo-950/30 transition hover:-translate-y-0.5 hover:brightness-110">Read the blog <span aria-hidden="true">→</span></Link>
                <Link href="/about" className={"author-about-link ![color:#c4cbe0] [font-size:13px] [font-weight:700] [&_span]:[margin-left:5px] [&_span]:[color:var(--blog-blue)]"}>About the Learning Hub <span aria-hidden="true">→</span></Link>
              </div>
            </div>
            <figure className={"author-photo-slot [width:100%] [margin:0] [padding:13px] [border:1px_solid_rgba(129,154,255,.24)] [border-radius:25px] [background:linear-gradient(145deg,_rgba(21,31,53,.8),_rgba(16,24,42,.86))] [box-shadow:0_25px_70px_rgba(0,0,0,.24)] [&_figcaption]:[padding:13px_5px_3px] [&_figcaption]:[color:var(--blog-muted)] [&_figcaption]:[font-size:12px] [&_figcaption]:[text-align:center] max-[760px]:[width:min(100%,_340px)] max-[760px]:[justify-self:center]"}>
              <div className={"author-photo-frame [display:grid] [aspect-ratio:1_/_1] [place-items:center] [border:1px_dashed_rgba(173,190,255,.32)] [border-radius:17px] [background:radial-gradient(circle_at_50%_45%,_rgba(99,133,255,.1),_transparent_58%),_rgba(255,255,255,.012)] [&_span]:[display:grid] [&_span]:[width:52px] [&_span]:[height:52px] [&_span]:[place-items:center] [&_span]:[border:1px_solid_rgba(173,190,255,.26)] [&_span]:[border-radius:50%] [&_span]:[color:#b6c5ff] [&_span]:[background:rgba(99,133,255,.1)] [&_span]:[font-size:28px] [&_span]:[font-weight:300]"} aria-hidden="true"><span>+</span></div>
              <figcaption>Your profile photo goes here</figcaption>
            </figure>
          </section>

          <section className={"author-focus [padding-block:55px_65px] [border-top:1px_solid_var(--blog-border)] max-[760px]:[padding-block:42px_50px]"} aria-labelledby="author-focus-title">
            <div className={"blog-section-heading [display:flex] [align-items:center] [justify-content:space-between] [gap:24px] [margin-bottom:22px] [&_h2]:[margin:7px_0_0] [&_h2]:[font-size:clamp(25px,_3vw,_34px)] [&_h2]:[letter-spacing:-.035em] [&_>_p]:[margin:0_0_3px] [&_>_p]:[color:var(--blog-muted)] [&_>_p]:[font-size:13px] [&_>_a]:[color:var(--blog-blue)] [&_>_a]:[font-size:13px] [&_>_a]:[font-weight:800] max-[780px]:[align-items:flex-start] max-[780px]:[&_>_p]:[display:none] max-[760px]:[align-items:flex-start]"}><div><span className={"blog-kicker [display:inline-flex] [align-items:center] [gap:9px] [color:var(--blog-blue)] [font-size:11px] [font-weight:800] [letter-spacing:1.6px]"}>AREAS OF FOCUS</span><h2 id="author-focus-title">Learning that moves into action</h2></div></div>
            <div className={"author-focus-grid [display:grid] [grid-template-columns:repeat(3,_minmax(0,_1fr))] [gap:17px] [&_article]:[min-height:210px] [&_article]:[padding:23px] [&_article]:[border:1px_solid_var(--blog-border)] [&_article]:[border-radius:16px] [&_article]:[background:linear-gradient(145deg,_rgba(21,31,53,.9),_rgba(16,24,42,.96))] [&_article_>_span]:[display:grid] [&_article_>_span]:[width:34px] [&_article_>_span]:[height:34px] [&_article_>_span]:[place-items:center] [&_article_>_span]:[border:1px_solid_rgba(129,154,255,.3)] [&_article_>_span]:[border-radius:10px] [&_article_>_span]:[color:var(--blog-blue)] [&_article_>_span]:[background:rgba(99,133,255,.1)] [&_article_>_span]:[font-size:11px] [&_article_>_span]:[font-weight:800] [&_h3]:[margin:18px_0_8px] [&_h3]:[font-size:20px] [&_h3]:[letter-spacing:-.025em] [&_p]:[margin:0] [&_p]:[color:var(--blog-muted)] [&_p]:[font-size:14px] [&_p]:[line-height:1.7] max-[760px]:[grid-template-columns:minmax(0,_1fr)] max-[760px]:[&_article]:[min-height:0]"}>
              <article><span>01</span><h3>Education</h3><p>Build understanding through clear lessons and purposeful study.</p></article>
              <article><span>02</span><h3>Digital skills</h3><p>Develop practical technology skills through learning and creation.</p></article>
              <article><span>03</span><h3>Entrepreneurship</h3><p>Explore business thinking, leadership and ideas that can be tested in real life.</p></article>
            </div>
          </section>

          <section className={"author-writing [padding-block:55px_65px] [border-top:1px_solid_var(--blog-border)] [padding-top:49px] [padding-bottom:84px] max-[760px]:[padding-block:42px_50px]"} aria-labelledby="author-writing-title">
            <div className={"blog-section-heading [display:flex] [align-items:center] [justify-content:space-between] [gap:24px] [margin-bottom:22px] [&_h2]:[margin:7px_0_0] [&_h2]:[font-size:clamp(25px,_3vw,_34px)] [&_h2]:[letter-spacing:-.035em] [&_>_p]:[margin:0_0_3px] [&_>_p]:[color:var(--blog-muted)] [&_>_p]:[font-size:13px] [&_>_a]:[color:var(--blog-blue)] [&_>_a]:[font-size:13px] [&_>_a]:[font-weight:800] max-[780px]:[align-items:flex-start] max-[780px]:[&_>_p]:[display:none] max-[760px]:[align-items:flex-start]"}><div><span className={"blog-kicker [display:inline-flex] [align-items:center] [gap:9px] [color:var(--blog-blue)] [font-size:11px] [font-weight:800] [letter-spacing:1.6px]"}>WRITING FROM THE HUB</span><h2 id="author-writing-title">Latest practical guides</h2></div><Link href="/blog">Visit the blog <span aria-hidden="true">→</span></Link></div>
            <div className={"related-grid [display:grid] [grid-template-columns:repeat(2,_minmax(0,_1fr))] [gap:18px] [&_article]:[display:flex] [&_article]:[min-height:210px] [&_article]:[flex-direction:column] [&_article]:[align-items:flex-start] [&_article]:[padding:22px] [&_article]:[border:1px_solid_var(--blog-border)] [&_article]:[border-radius:15px] [&_article]:[background:var(--blog-surface)] [&_h3]:[margin:13px_0] [&_h3]:[font-size:21px] [&_h3]:[letter-spacing:-.025em] [&_h3]:[line-height:1.3] max-[780px]:[grid-template-columns:1fr]"}>
              {blogPosts.slice(0, 2).map((post) => (
                <article key={post.slug}>
                  <span className={"blog-category [display:inline-flex] [width:fit-content] [padding:6px_10px] [border:1px_solid_rgba(129,154,255,.28)] [border-radius:999px] [color:#b8c7ff] [background:rgba(99,133,255,.1)] [font-size:11px] [font-weight:700]"}>{post.category}</span>
                  <h3><Link href={`/blog/${post.slug}`}>{post.title}</Link></h3>
                  <Link className={"blog-read-link [display:inline-flex] [align-items:center] [gap:9px] [margin-top:auto] [padding-top:24px] ![color:var(--blog-blue)] [font-size:14px] [font-weight:800] [&_span]:[transition:transform_.2s_ease] [&:hover_span]:[transform:translateX(4px)]"} href={`/blog/${post.slug}`}>Read the guide <span aria-hidden="true">→</span></Link>
                </article>
              ))}
            </div>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
