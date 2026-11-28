import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteFooter } from "@/src/components/footer";
import { SiteHeader } from "@/src/components/header";
import { BlogAdPlaceholder } from "@/src/components/blog-ad-placeholder";
import { blogPosts } from "@/src/utils/blog-posts";

const siteUrl = "https://ceojacklearninghub.com";

export const metadata: Metadata = {
  title: "Learning, Digital Skills & Business Blog",
  description:
    "Practical learning guides from CEO JACK LEARNING HUB. Explore study skills, digital skills and beginner-friendly entrepreneurship advice.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "The CEO JACK Learning Blog",
    description:
      "Practical guides to help you learn with purpose, build digital skills and turn ideas into action.",
    url: "/blog",
    siteName: "CEO JACK LEARNING HUB",
    type: "website",
    images: ["/assets/images/banner.jpeg"],
  },
};

const blogSchema = {
  "@context": "https://schema.org",
  "@type": "Blog",
  name: "CEO JACK Learning Blog",
  description: metadata.description,
  url: `${siteUrl}/blog`,
  publisher: {
    "@type": "Organization",
    name: "CEO JACK LEARNING HUB",
    url: siteUrl,
  },
  blogPost: blogPosts.map((post) => ({
    "@type": "BlogPosting",
    headline: post.title,
    url: `${siteUrl}/blog/${post.slug}`,
    datePublished: post.datePublished,
  })),
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}

export default function BlogPage() {
  const [featuredPost, ...otherPosts] = blogPosts;
  const latestPosts = [...otherPosts].sort((a, b) => b.datePublished.localeCompare(a.datePublished));

  return (
    <div className={"blog-page blog-shell [--blog-bg:#080d1b] [--blog-surface:#10182a] [--blog-surface-raised:#151f35] [--blog-text:#f5f7ff] [--blog-muted:#a7b1c7] [--blog-blue:#819aff] [--blog-violet:#b19bff] [--blog-border:rgba(255,_255,_255,_.1)] [min-height:70vh] [color:var(--blog-text)] [background:var(--blog-bg)] [font-family:'DM_Sans',_sans-serif] [line-height:1.72] [letter-spacing:.008em] [&_h1]:[font-family:'Space_Grotesk',_sans-serif] [&_h1]:[letter-spacing:-.025em] [&_h2]:[font-family:'Space_Grotesk',_sans-serif] [&_h2]:[letter-spacing:-.025em] [&_h3]:[font-family:'Space_Grotesk',_sans-serif] [&_h3]:[letter-spacing:-.025em] [&_h4]:[font-family:'Space_Grotesk',_sans-serif] [&_h4]:[letter-spacing:-.025em] [&_a]:[color:inherit] [&_a]:[text-decoration:none] [&_a:hover]:[color:var(--blog-blue)] !motion-reduce:[&_*]:[scroll-behavior:auto] !motion-reduce:[&_*]:[transition-duration:.01ms] !motion-reduce:[&_*::before]:[scroll-behavior:auto] !motion-reduce:[&_*::before]:[transition-duration:.01ms] !motion-reduce:[&_*::after]:[scroll-behavior:auto] !motion-reduce:[&_*::after]:[transition-duration:.01ms]"}>
      <div className="page-bg" aria-hidden="true" />
      <SiteHeader active="/blog" />
      <main className={"blog-page [--blog-bg:#080d1b] [--blog-surface:#10182a] [--blog-surface-raised:#151f35] [--blog-text:#f5f7ff] [--blog-muted:#a7b1c7] [--blog-blue:#819aff] [--blog-violet:#b19bff] [--blog-border:rgba(255,_255,_255,_.1)] [min-height:70vh] [color:var(--blog-text)] [background:var(--blog-bg)] [font-family:'DM_Sans',_sans-serif] [line-height:1.72] [letter-spacing:.008em] [&_h1]:[font-family:'Space_Grotesk',_sans-serif] [&_h1]:[letter-spacing:-.025em] [&_h2]:[font-family:'Space_Grotesk',_sans-serif] [&_h2]:[letter-spacing:-.025em] [&_h3]:[font-family:'Space_Grotesk',_sans-serif] [&_h3]:[letter-spacing:-.025em] [&_h4]:[font-family:'Space_Grotesk',_sans-serif] [&_h4]:[letter-spacing:-.025em] [&_a]:[color:inherit] [&_a]:[text-decoration:none] [&_a:hover]:[color:var(--blog-blue)] !motion-reduce:[&_*]:[scroll-behavior:auto] !motion-reduce:[&_*]:[transition-duration:.01ms] !motion-reduce:[&_*::before]:[scroll-behavior:auto] !motion-reduce:[&_*::before]:[transition-duration:.01ms] !motion-reduce:[&_*::after]:[scroll-behavior:auto] !motion-reduce:[&_*::after]:[transition-duration:.01ms]"}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema).replace(/</g, "\\u003c") }}
        />
        <section className={"blog-hero [position:relative] [overflow:hidden] [padding:92px_0_74px] [border-bottom:1px_solid_var(--blog-border)] [background:radial-gradient(ellipse_at_80%_10%,_rgba(99,_133,_255,_.2),_transparent_36%),_radial-gradient(ellipse_at_12%_100%,_rgba(155,_123,_255,_.11),_transparent_42%),_linear-gradient(135deg,_#0d1427,_#080d1b_62%)] [&::after]:[position:absolute] [&::after]:[inset:0] [&::after]:[z-index:0] [&::after]:[background-image:linear-gradient(rgba(255,255,255,.025)_1px,_transparent_1px),_linear-gradient(90deg,_rgba(255,255,255,.025)_1px,_transparent_1px)] [&::after]:[background-size:48px_48px] [&::after]:[content:\"\"] [&::after]:[mask-image:linear-gradient(to_bottom,_#000,_transparent_90%)] [&::after]:[pointer-events:none] [&_h1]:[max-width:780px] [&_h1]:[margin:22px_0_18px] [&_h1]:[font-size:clamp(42px,_7vw,_76px)] [&_h1]:[letter-spacing:-.035em] [&_h1]:[line-height:1.12] [&_h1_span]:[color:var(--blog-violet)] [&_p]:[max-width:650px] [&_p]:[margin:0] [&_p]:[color:#c1c9dc] [&_p]:[font-size:18px] [&_p]:[line-height:1.75] max-[780px]:[padding:70px_0_55px] max-[780px]:[&_h1]:[font-size:clamp(42px,_12vw,_61px)] max-[780px]:[&_h1]:[line-height:1.12] max-[780px]:[&_p]:[font-size:16px] max-[780px]:[&_p]:[line-height:1.85]"}>
          <div className={"container blog-hero-inner [width:min(1160px,_calc(100%_-_48px))] [margin-inline:auto] max-[780px]:[width:min(100%_-_32px,_560px)] [position:relative] [z-index:1]"}>
            <span className={"blog-eyebrow [display:inline-flex] [align-items:center] [gap:9px] [color:var(--blog-blue)] [font-size:11px] [font-weight:800] [letter-spacing:1.6px] [&_i]:[width:7px] [&_i]:[height:7px] [&_i]:[border-radius:50%] [&_i]:[background:var(--blog-blue)] [&_i]:[box-shadow:0_0_14px_rgba(129,_154,_255,_.7)]"}><i /> IDEAS FOR YOUR NEXT STEP</span>
            <h1>Learn something.<br /><span>Put it to work.</span></h1>
            <p>Clear, practical guides for stronger study habits, useful digital skills and building a business idea one step at a time.</p>
            <div className={"blog-topics [display:flex] [flex-wrap:wrap] [gap:10px] [margin-top:27px] [&_span]:[padding:8px_12px] [&_span]:[border:1px_solid_var(--blog-border)] [&_span]:[border-radius:999px] [&_span]:[color:#c1c9dc] [&_span]:[background:rgba(255,255,255,.035)] [&_span]:[font-size:12px] [&_span]:[font-weight:600]"} aria-label="Blog topics">
              <span>Learning skills</span><span>Digital skills</span><span>Entrepreneurship</span>
            </div>
          </div>
        </section>

        <section className={"container blog-featured-section [width:min(1160px,_calc(100%_-_48px))] [margin-inline:auto] max-[780px]:[width:min(100%_-_32px,_560px)] [padding-top:58px] max-[780px]:[padding-top:43px]"} aria-labelledby="featured-heading">
          <div className={"blog-section-heading [display:flex] [align-items:center] [justify-content:space-between] [gap:24px] [margin-bottom:22px] [&_h2]:[margin:7px_0_0] [&_h2]:[font-size:clamp(25px,_3vw,_34px)] [&_h2]:[letter-spacing:-.035em] [&_>_p]:[margin:0_0_3px] [&_>_p]:[color:var(--blog-muted)] [&_>_p]:[font-size:13px] [&_>_a]:[color:var(--blog-blue)] [&_>_a]:[font-size:13px] [&_>_a]:[font-weight:800] max-[780px]:[align-items:flex-start] max-[780px]:[&_>_p]:[display:none]"}>
            <div><span className={"blog-kicker [display:inline-flex] [align-items:center] [gap:9px] [color:var(--blog-blue)] [font-size:11px] [font-weight:800] [letter-spacing:1.6px]"}>START HERE</span><h2 id="featured-heading">Featured guide</h2></div>
            <span className={"blog-count [margin:0_0_3px] [color:var(--blog-muted)] [font-size:13px]"}>{blogPosts.length} practical guides</span>
          </div>
          <article className={"blog-featured-card [display:grid] [grid-template-columns:1.08fr_.92fr] [overflow:hidden] [border:1px_solid_var(--blog-border)] [border-radius:22px] [background:linear-gradient(130deg,_var(--blog-surface-raised),_var(--blog-surface))] [box-shadow:0_24px_70px_rgba(0,0,0,.2)] max-[820px]:[grid-template-columns:1fr_1fr] max-[780px]:[grid-template-columns:1fr]"}>
            <Link href={`/blog/${featuredPost.slug}`} className={"blog-featured-image [position:relative] [display:block] [min-height:355px] [overflow:hidden] [background:#111a30] [&::after]:[position:absolute] [&::after]:[inset:40%_0_0] [&::after]:[background:linear-gradient(transparent,_rgba(5,_8,_18,_.74))] [&::after]:[content:\"\"] [&::after]:[pointer-events:none] [&_img]:[object-fit:cover] [&_img]:[transition:transform_.5s_ease] [&:hover_img]:[transform:scale(1.035)] max-[820px]:[min-height:320px] max-[780px]:[min-height:245px]"} aria-label={`Read ${featuredPost.title}`}>
              <Image src={featuredPost.image} alt={featuredPost.imageAlt} fill sizes="(max-width: 800px) 100vw, 52vw" preload />
              <span className={"blog-image-credit [position:absolute] [z-index:1] [right:14px] [bottom:12px] [color:rgba(255,255,255,.8)] [font-size:10px]"}>{featuredPost.imageCredit}</span>
            </Link>
            <div className={"blog-featured-copy [display:flex] [flex-direction:column] [align-items:flex-start] [padding:clamp(26px,_4vw,_48px)] [&_h3]:[margin:22px_0_13px] [&_h3]:[font-size:clamp(26px,_3.3vw,_38px)] [&_h3]:[letter-spacing:-.025em] [&_h3]:[line-height:1.28] [&_>_p]:[margin:0] [&_>_p]:[color:var(--blog-muted)] [&_>_p]:[font-size:15px] [&_>_p]:[line-height:1.7] max-[820px]:[padding:25px] max-[820px]:[&_h3]:[font-size:27px] max-[780px]:[min-height:320px] max-[780px]:[padding:23px] max-[780px]:[&_h3]:[margin-top:17px] max-[780px]:[&_h3]:[font-size:27px] max-[780px]:[&_h3]:[line-height:1.32] max-[780px]:[&_>_p]:[font-size:16px] max-[780px]:[&_>_p]:[line-height:1.85]"}>
              <div className={"blog-meta [display:flex] [align-items:center] [flex-wrap:wrap] [gap:12px] [color:var(--blog-muted)] [font-size:12px]"}><span className={"blog-category [display:inline-flex] [width:fit-content] [padding:6px_10px] [border:1px_solid_rgba(129,154,255,.28)] [border-radius:999px] [color:#b8c7ff] [background:rgba(99,133,255,.1)] [font-size:11px] [font-weight:700]"}>{featuredPost.category}</span><span>{featuredPost.readTime}</span></div>
              <h3><Link href={`/blog/${featuredPost.slug}`}>{featuredPost.title}</Link></h3>
              <p>{featuredPost.description}</p>
              <div className={"blog-byline [display:flex] [align-items:center] [gap:11px] [margin-top:24px] [color:var(--blog-text)] [font-size:12px] [font-weight:700] [line-height:1.5] [&_small]:[color:var(--blog-muted)] [&_small]:[font-size:11px] [&_small]:[font-weight:500]"}><Link href="/author/ceo-jack" className={"author-mark [display:grid] [width:39px] [height:39px] [flex:0_0_auto] [place-items:center] [border:1px_solid_rgba(129,154,255,.4)] [border-radius:13px] [color:#e2e8ff] [background:linear-gradient(145deg,_rgba(99,133,255,.28),_rgba(155,123,255,.2))] [font-size:12px] [&_img]:[width:100%] [&_img]:[height:100%] [&_img]:[border-radius:inherit] [&_img]:[object-fit:cover]"} aria-label="Read the CEO JACK author profile"><Image src="/assets/images/logo1.webp" alt="" width={80} height={80} /></Link><span>By <Link href="/author/ceo-jack" className={"article-author-name [color:#dce4ff] [text-decoration:underline] [text-decoration-color:rgba(129,154,255,.65)] [text-underline-offset:3px] [&:hover]:[color:#fff] [&:hover]:[text-decoration-color:currentColor]"}>CEO JACK</Link><br /><small>Published {formatDate(featuredPost.datePublished)}</small></span></div>
              <Link href="/author/ceo-jack" className={"blog-author-profile-link [display:inline-flex] [align-items:center] [gap:9px] [align-self:flex-start] [margin-top:12px] [padding:9px_13px] [border:1px_solid_rgba(129,154,255,.34)] [border-radius:10px] [color:#dce4ff] [background:rgba(99,133,255,.12)] [font-size:12px] [font-weight:800] [transition:border-color_.2s_ease,_background_.2s_ease,_transform_.2s_ease] [&_span]:[color:var(--blog-blue)] [&_span]:[transition:transform_.2s_ease] [&:hover]:[transform:translateY(-1px)] [&:hover]:[border-color:rgba(129,154,255,.65)] [&:hover]:[background:rgba(99,133,255,.2)] [&:hover]:[color:#fff] [&:hover_span]:[transform:translateX(3px)]"}>Meet the author <span aria-hidden="true">→</span></Link>
              <Link className={"blog-read-link [display:inline-flex] [align-items:center] [gap:9px] [margin-top:auto] [padding-top:24px] ![color:var(--blog-blue)] [font-size:14px] [font-weight:800] [&_span]:[transition:transform_.2s_ease] [&:hover_span]:[transform:translateX(4px)]"} href={`/blog/${featuredPost.slug}`}>Read the guide <span aria-hidden="true">→</span></Link>
            </div>
          </article>
        </section>

        <section className={"container blog-library-section [width:min(1160px,_calc(100%_-_48px))] [margin-inline:auto] max-[780px]:[width:min(100%_-_32px,_560px)] [padding-top:78px] max-[780px]:[padding-top:58px]"} aria-labelledby="latest-heading">
          <div className={"blog-section-heading [display:flex] [align-items:center] [justify-content:space-between] [gap:24px] [margin-bottom:22px] [&_h2]:[margin:7px_0_0] [&_h2]:[font-size:clamp(25px,_3vw,_34px)] [&_h2]:[letter-spacing:-.035em] [&_>_p]:[margin:0_0_3px] [&_>_p]:[color:var(--blog-muted)] [&_>_p]:[font-size:13px] [&_>_a]:[color:var(--blog-blue)] [&_>_a]:[font-size:13px] [&_>_a]:[font-weight:800] max-[780px]:[align-items:flex-start] max-[780px]:[&_>_p]:[display:none]"}>
            <div><span className={"blog-kicker [display:inline-flex] [align-items:center] [gap:9px] [color:var(--blog-blue)] [font-size:11px] [font-weight:800] [letter-spacing:1.6px]"}>THE LEARNING LIBRARY</span><h2 id="latest-heading">Explore the guides</h2></div>
            <p>Small ideas. Practical steps. Room to grow.</p>
          </div>
          <div className={"blog-grid [display:grid] [grid-template-columns:repeat(2,_minmax(0,_1fr))] [gap:22px] max-[780px]:[grid-template-columns:1fr] max-[780px]:[gap:17px]"}>
            {latestPosts.map((post, index) => (
              <article className={"blog-card [overflow:hidden] [border:1px_solid_var(--blog-border)] [border-radius:18px] [background:linear-gradient(145deg,_rgba(21,31,53,.9),_rgba(16,24,42,.96))] [transition:transform_.2s_ease,_border-color_.2s_ease] [&:hover]:[transform:translateY(-4px)] [&:hover]:[border-color:rgba(129,154,255,.4)]"} key={post.slug}>
                <Link className={"blog-card-image [position:relative] [display:block] [min-height:260px] [overflow:hidden] [background:#111a30] [&::after]:[position:absolute] [&::after]:[inset:40%_0_0] [&::after]:[background:linear-gradient(transparent,_rgba(5,_8,_18,_.74))] [&::after]:[content:\"\"] [&::after]:[pointer-events:none] [&_img]:[object-fit:cover] [&_img]:[transition:transform_.5s_ease] [&:hover_img]:[transform:scale(1.035)] max-[780px]:[min-height:235px]"} href={`/blog/${post.slug}`} aria-label={`Read ${post.title}`}>
                  <Image src={post.image} alt={post.imageAlt} fill sizes="(max-width: 680px) 100vw, (max-width: 1000px) 50vw, 33vw" />
                  <span className={"blog-image-credit [position:absolute] [z-index:1] [right:14px] [bottom:12px] [color:rgba(255,255,255,.8)] [font-size:10px]"}>{post.imageCredit}</span>
                  <span className={"blog-image-number [position:absolute] [z-index:1] [top:14px] [left:14px] [display:grid] [width:35px] [height:35px] [place-items:center] [border:1px_solid_rgba(255,255,255,.22)] [border-radius:11px] [color:white] [background:rgba(8,13,27,.52)] [backdrop-filter:blur(8px)] [font-size:12px] [font-weight:700]"}>0{index + 2}</span>
                </Link>
                <div className={"blog-card-copy [&_>_p]:[margin:0] [&_>_p]:[color:var(--blog-muted)] [&_>_p]:[font-size:15px] [&_>_p]:[line-height:1.7] [display:flex] [min-height:255px] [flex-direction:column] [align-items:flex-start] [padding:24px_25px_25px] [&_h3]:[margin:16px_0_10px] [&_h3]:[font-size:clamp(21px,_2.4vw,_27px)] [&_h3]:[letter-spacing:-.02em] [&_h3]:[line-height:1.32] max-[780px]:[&_>_p]:[font-size:16px] max-[780px]:[&_>_p]:[line-height:1.85] max-[780px]:[min-height:240px] max-[780px]:[padding:21px]"}>
                  <div className={"blog-meta [display:flex] [align-items:center] [flex-wrap:wrap] [gap:12px] [color:var(--blog-muted)] [font-size:12px]"}><span className={"blog-category [display:inline-flex] [width:fit-content] [padding:6px_10px] [border:1px_solid_rgba(129,154,255,.28)] [border-radius:999px] [color:#b8c7ff] [background:rgba(99,133,255,.1)] [font-size:11px] [font-weight:700]"}>{post.category}</span><span>{post.readTime}</span></div>
                  <h3><Link href={`/blog/${post.slug}`}>{post.title}</Link></h3>
                  <p>{post.description}</p>
                  <Link className={"blog-read-link [display:inline-flex] [align-items:center] [gap:9px] [margin-top:auto] [padding-top:24px] ![color:var(--blog-blue)] [font-size:14px] [font-weight:800] [&_span]:[transition:transform_.2s_ease] [&:hover_span]:[transform:translateX(4px)]"} href={`/blog/${post.slug}`}>Read the guide <span aria-hidden="true">→</span></Link>
                </div>
              </article>
            ))}
          </div>
        </section>
        <div className={"container [width:min(1160px,_calc(100%_-_48px))] [margin-inline:auto] max-[780px]:[width:min(100%_-_32px,_560px)]"}><BlogAdPlaceholder placement="list" /></div>

        <section className={"container blog-cta-section [width:min(1160px,_calc(100%_-_48px))] [margin-inline:auto] max-[780px]:[width:min(100%_-_32px,_560px)] [padding-block:76px_86px] max-[780px]:[padding-block:55px_60px]"}>
          <div className={"blog-cta [display:flex] [align-items:center] [justify-content:space-between] [gap:28px] [padding:clamp(27px,_5vw,_48px)] [border:1px_solid_rgba(129,154,255,.24)] [border-radius:22px] [background:radial-gradient(ellipse_at_85%_10%,_rgba(155,123,255,.15),_transparent_38%),_linear-gradient(130deg,_rgba(99,133,255,.12),_rgba(255,255,255,.025))] [&_h2]:[max-width:600px] [&_h2]:[margin:10px_0] [&_h2]:[font-size:clamp(26px,_4vw,_38px)] [&_h2]:[letter-spacing:-.04em] [&_p]:[margin:0] [&_p]:[color:var(--blog-muted)] [&_p]:[font-size:15px] max-[780px]:[align-items:flex-start] max-[780px]:[flex-direction:column]"}>
            <div><span className={"blog-kicker [display:inline-flex] [align-items:center] [gap:9px] [color:var(--blog-blue)] [font-size:11px] [font-weight:800] [letter-spacing:1.6px]"}>KEEP YOUR MOMENTUM</span><h2>Turn your next question into progress.</h2><p>Explore the learning hubs and find a useful next step for your goals.</p></div>
            <Link href="/get-started" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-5 text-sm font-bold text-white shadow-lg shadow-indigo-950/30 transition hover:-translate-y-0.5 hover:brightness-110">Get Started Free <span aria-hidden="true">→</span></Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
