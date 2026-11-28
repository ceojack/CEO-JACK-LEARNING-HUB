import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Fragment } from "react";
import { SiteFooter } from "@/src/components/footer";
import { SiteHeader } from "@/src/components/header";
import { BlogAdPlaceholder } from "@/src/components/blog-ad-placeholder";
import { blogPosts, getBlogPost } from "@/src/utils/blog-posts";

const siteUrl = "https://ceojacklearninghub.com";

type BlogArticleProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return blogPosts.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: BlogArticleProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return { title: "Article not found" };

  return {
    title: post.title,
    description: post.description,
    authors: [{ name: "CEO JACK", url: `${siteUrl}/author/ceo-jack` }],
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `/blog/${post.slug}`,
      siteName: "CEO JACK LEARNING HUB",
      type: "article",
      publishedTime: `${post.datePublished}T09:00:00+03:00`,
      authors: [`${siteUrl}/author/ceo-jack`],
      images: [{ url: post.image, alt: post.imageAlt }],
    },
    twitter: { card: "summary_large_image", title: post.title, description: post.description, images: [post.image] },
  };
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}

export default async function BlogArticlePage({ params }: BlogArticleProps) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    image: `${siteUrl}${post.image}`,
    datePublished: `${post.datePublished}T09:00:00+03:00`,
    dateModified: post.datePublished,
    author: {
      "@type": "Person",
      name: "CEO JACK",
      url: `${siteUrl}/author/ceo-jack`,
      jobTitle: "Business Coach and Entrepreneur",
      worksFor: {
        "@type": "Organization",
        name: "CEO JACK LEARNING HUB",
        url: siteUrl,
      },
    },
    publisher: {
      "@type": "Organization",
      name: "CEO JACK LEARNING HUB",
      url: siteUrl,
      logo: { "@type": "ImageObject", url: `${siteUrl}/assets/images/logo.webp` },
    },
    mainEntityOfPage: `${siteUrl}/blog/${post.slug}`,
    articleSection: post.category,
    isPartOf: { "@type": "Blog", name: "CEO JACK Learning Blog", url: `${siteUrl}/blog` },
  };

  const relatedPosts = blogPosts.filter((item) => item.slug !== post.slug).slice(0, 2);
  let paragraphCount = 1;
  const middleSectionIndex = Math.floor(post.sections.length / 2) - 1;

  return (
    <div className={"blog-page blog-shell [--blog-bg:#080d1b] [--blog-surface:#10182a] [--blog-surface-raised:#151f35] [--blog-text:#f5f7ff] [--blog-muted:#a7b1c7] [--blog-blue:#819aff] [--blog-violet:#b19bff] [--blog-border:rgba(255,_255,_255,_.1)] [min-height:70vh] [color:var(--blog-text)] [background:var(--blog-bg)] [font-family:'DM_Sans',_sans-serif] [line-height:1.72] [letter-spacing:.008em] [&_h1]:[font-family:'Space_Grotesk',_sans-serif] [&_h1]:[letter-spacing:-.025em] [&_h2]:[font-family:'Space_Grotesk',_sans-serif] [&_h2]:[letter-spacing:-.025em] [&_h3]:[font-family:'Space_Grotesk',_sans-serif] [&_h3]:[letter-spacing:-.025em] [&_h4]:[font-family:'Space_Grotesk',_sans-serif] [&_h4]:[letter-spacing:-.025em] [&_a]:[color:inherit] [&_a]:[text-decoration:none] [&_a:hover]:[color:var(--blog-blue)] !motion-reduce:[&_*]:[scroll-behavior:auto] !motion-reduce:[&_*]:[transition-duration:.01ms] !motion-reduce:[&_*::before]:[scroll-behavior:auto] !motion-reduce:[&_*::before]:[transition-duration:.01ms] !motion-reduce:[&_*::after]:[scroll-behavior:auto] !motion-reduce:[&_*::after]:[transition-duration:.01ms]"}>
      <div className="page-bg" aria-hidden="true" />
      <SiteHeader active="/blog" />
      <main className={"blog-page blog-article-page [--blog-bg:#080d1b] [--blog-surface:#10182a] [--blog-surface-raised:#151f35] [--blog-text:#f5f7ff] [--blog-muted:#a7b1c7] [--blog-blue:#819aff] [--blog-violet:#b19bff] [--blog-border:rgba(255,_255,_255,_.1)] [min-height:70vh] [color:var(--blog-text)] [background:var(--blog-bg)] [font-family:'DM_Sans',_sans-serif] [line-height:1.72] [letter-spacing:.008em] [&_h1]:[font-family:'Space_Grotesk',_sans-serif] [&_h1]:[letter-spacing:-.025em] [&_h2]:[font-family:'Space_Grotesk',_sans-serif] [&_h2]:[letter-spacing:-.025em] [&_h3]:[font-family:'Space_Grotesk',_sans-serif] [&_h3]:[letter-spacing:-.025em] [&_h4]:[font-family:'Space_Grotesk',_sans-serif] [&_h4]:[letter-spacing:-.025em] [&_a]:[color:inherit] [&_a]:[text-decoration:none] [&_a:hover]:[color:var(--blog-blue)] !motion-reduce:[&_*]:[scroll-behavior:auto] !motion-reduce:[&_*]:[transition-duration:.01ms] !motion-reduce:[&_*::before]:[scroll-behavior:auto] !motion-reduce:[&_*::before]:[transition-duration:.01ms] !motion-reduce:[&_*::after]:[scroll-behavior:auto] !motion-reduce:[&_*::after]:[transition-duration:.01ms]"}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema).replace(/</g, "\\u003c") }}
        />
        <div className={"container article-container [width:min(1160px,_calc(100%_-_48px))] [margin-inline:auto] max-[780px]:[width:min(100%_-_32px,_560px)] [padding-top:30px] max-[780px]:[padding-top:22px]"}>
          <nav className={"article-breadcrumbs [display:flex] [flex-wrap:wrap] [align-items:center] [gap:10px] [color:var(--blog-muted)] [font-size:12px] [&_[aria-current=\"page\"]]:[color:#d5daeb] max-[780px]:[font-size:11px]"} aria-label="Breadcrumb">
            <Link href="/">Home</Link><span aria-hidden="true">/</span><Link href="/blog">Blog</Link><span aria-hidden="true">/</span><span aria-current="page">{post.category}</span>
          </nav>
          <header className={"article-heading [max-width:850px] [margin:48px_auto_32px] [text-align:center] [&_h1]:[margin:20px_0_14px] [&_h1]:[font-size:clamp(36px,_6vw,_58px)] [&_h1]:[letter-spacing:-.03em] [&_h1]:[line-height:1.16] max-[780px]:[margin:35px_auto_26px] max-[780px]:[text-align:left] max-[780px]:[&_h1]:[font-size:clamp(34px,_10vw,_48px)] max-[780px]:[&_h1]:[line-height:1.17]"}>
            <span className={"blog-category [display:inline-flex] [width:fit-content] [padding:6px_10px] [border:1px_solid_rgba(129,154,255,.28)] [border-radius:999px] [color:#b8c7ff] [background:rgba(99,133,255,.1)] [font-size:11px] [font-weight:700]"}>{post.category}</span>
            <h1>{post.title}</h1>
            <p className={"article-deck [max-width:720px] [margin:0_auto] [color:#bdc6da] [font-size:18px] [line-height:1.7] max-[780px]:[font-size:17px] max-[780px]:[line-height:1.85]"}>{post.description}</p>
            <div className={"article-byline [display:flex] [align-items:center] [gap:11px] [margin-top:24px] [color:var(--blog-text)] [font-size:12px] [font-weight:700] [line-height:1.5] [&_small]:[color:var(--blog-muted)] [&_small]:[font-size:11px] [&_small]:[font-weight:500] [justify-content:center] [text-align:left] max-[780px]:[justify-content:flex-start]"}>
              <Link href="/author/ceo-jack" className={"author-mark [display:grid] [width:39px] [height:39px] [flex:0_0_auto] [place-items:center] [border:1px_solid_rgba(129,154,255,.4)] [border-radius:13px] [color:#e2e8ff] [background:linear-gradient(145deg,_rgba(99,133,255,.28),_rgba(155,123,255,.2))] [font-size:12px] [&_img]:[width:100%] [&_img]:[height:100%] [&_img]:[border-radius:inherit] [&_img]:[object-fit:cover]"} aria-label="Read the CEO JACK author profile"><Image src="public/assets/images/logo1.webp" alt="" width={80} height={80} /></Link>
              <span><Link href="/author/ceo-jack" className={"article-author-name [color:#dce4ff] [text-decoration:underline] [text-decoration-color:rgba(129,154,255,.65)] [text-underline-offset:3px] [&:hover]:[color:#fff] [&:hover]:[text-decoration-color:currentColor]"}>CEO JACK</Link><br /><small>Published <time dateTime={post.datePublished}>{formatDate(post.datePublished)}</time> <i aria-hidden="true">·</i> {post.readTime}</small></span>
            </div>
            <Link href="/author/ceo-jack" className={"blog-author-profile-link [display:inline-flex] [align-items:center] [gap:9px] [align-self:flex-start] [margin-top:12px] [padding:9px_13px] [border:1px_solid_rgba(129,154,255,.34)] [border-radius:10px] [color:#dce4ff] [background:rgba(99,133,255,.12)] [font-size:12px] [font-weight:800] [transition:border-color_.2s_ease,_background_.2s_ease,_transform_.2s_ease] [&_span]:[color:var(--blog-blue)] [&_span]:[transition:transform_.2s_ease] [&:hover]:[transform:translateY(-1px)] [&:hover]:[border-color:rgba(129,154,255,.65)] [&:hover]:[background:rgba(99,133,255,.2)] [&:hover]:[color:#fff] [&:hover_span]:[transform:translateX(3px)]"}>Meet the author <span aria-hidden="true">→</span></Link>
          </header>
          <figure className={"article-cover [position:relative] [max-width:1000px] [margin:0_auto] [overflow:hidden] [border:1px_solid_var(--blog-border)] [border-radius:20px] [background:var(--blog-surface)] [&_img]:[display:block] [&_img]:[width:100%] [&_img]:[height:auto] [&_img]:[max-height:580px] [&_img]:[object-fit:cover] [&_figcaption]:[padding:10px_15px] [&_figcaption]:[color:var(--blog-muted)] [&_figcaption]:[font-size:11px] [&_figcaption]:[text-align:right] [&_figcaption_a]:[color:var(--blog-blue)] max-[780px]:[border-radius:14px] max-[780px]:[&_img]:[min-height:230px] max-[780px]:[&_img]:[object-fit:cover]"}>
            <Image src={post.image} alt={post.imageAlt} width={1400} height={850} sizes="(max-width: 900px) 100vw, 1000px" preload />
            <figcaption>{post.imageCredit} · <a href="https://unsplash.com" target="_blank" rel="noreferrer">Unsplash</a></figcaption>
          </figure>
          <div className={"article-layout [display:grid] [grid-template-columns:minmax(0,_720px)_270px] [justify-content:center] [gap:54px] [padding-top:58px] max-[820px]:[grid-template-columns:minmax(0,_1fr)] max-[820px]:[gap:30px] max-[780px]:[padding-top:36px]"}>
            <article className={"article-body [min-width:0] [&_p]:[color:#c5cce0] [&_p]:[font-size:17px] [&_p]:[line-height:1.85] [&_li]:[color:#c5cce0] [&_li]:[font-size:17px] [&_li]:[line-height:1.85] max-[780px]:[&_p]:[font-size:16px] max-[780px]:[&_p]:[line-height:1.92] max-[780px]:[&_li]:[font-size:16px] max-[780px]:[&_li]:[line-height:1.92]"}>
              <p className={"article-intro [margin-bottom:38px] [color:var(--blog-text)] [font-size:20px] [line-height:1.75] max-[780px]:[font-size:18px] max-[780px]:[line-height:1.85]"}>{post.intro}</p>
              {post.sections.map((section) => (
                <section className={"article-section [margin-bottom:36px] [&_h2]:[margin:0_0_14px] [&_h2]:[font-size:clamp(24px,_3vw,_30px)] [&_h2]:[letter-spacing:-.02em] [&_h2]:[line-height:1.35] [&_p]:[margin:0_0_17px] [&_ul]:[display:grid] [&_ul]:[gap:10px] [&_ul]:[margin:3px_0_22px] [&_ul]:[padding-left:23px] [&_li::marker]:[color:var(--blog-blue)]"} key={section.heading}>
                  <h2>{section.heading}</h2>
                  {section.paragraphs.map((paragraph) => {
                    paragraphCount += 1;
                    const isSecondParagraph = paragraphCount === 2;
                    return (
                      <Fragment key={paragraph}>
                        <p>{paragraph}</p>
                        {isSecondParagraph ? <BlogAdPlaceholder placement="article" /> : null}
                      </Fragment>
                    );
                  })}
                  {section.bullets ? <ul>{section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul> : null}
                  {section.takeaway ? <aside className={"article-takeaway [margin-top:24px] [padding:23px_24px] [border:1px_solid_rgba(129,154,255,.25)] [border-left:3px_solid_var(--blog-blue)] [border-radius:13px] [background:linear-gradient(120deg,_rgba(99,133,255,.12),_rgba(255,255,255,.025))] [&_>_span]:[color:var(--blog-blue)] [&_>_span]:[font-size:10px] [&_>_span]:[font-weight:800] [&_>_span]:[letter-spacing:1.4px] [&_p]:[margin:9px_0_0] [&_p]:[color:#e2e7f7] [&_p]:[font-size:16px] [&_p]:[line-height:1.7]"}><span>TAKE THIS WITH YOU</span><p>{section.takeaway}</p></aside> : null}
                  {post.sections.length > 2 && post.sections.indexOf(section) === middleSectionIndex ? <BlogAdPlaceholder placement="article" /> : null}
                </section>
              ))}
              <div className={"article-end [display:flex] [flex-wrap:wrap] [justify-content:space-between] [gap:15px] [padding-top:22px] [border-top:1px_solid_var(--blog-border)] [&_>_span]:[color:var(--blog-muted)] [&_>_span]:[font-size:10px] [&_>_span]:[font-weight:800] [&_>_span]:[letter-spacing:1.5px] [&_>_a]:[color:var(--blog-blue)] [&_>_a]:[font-size:13px] [&_>_a]:[font-weight:800]"}><span>LEARN · CREATE · DEVELOP</span><Link href="/blog">More practical guides <span aria-hidden="true">→</span></Link></div>
            </article>
            <aside className={"article-sidebar [display:grid] [align-content:start] [gap:16px] max-[820px]:[grid-template-columns:repeat(2,_minmax(0,_1fr))] max-[780px]:[grid-template-columns:1fr]"} aria-label="About the author">
              <div className={"author-card [padding:22px] [border:1px_solid_var(--blog-border)] [border-radius:15px] [background:linear-gradient(145deg,_rgba(21,31,53,.9),_rgba(16,24,42,.96))] [&_h2]:[margin:12px_0_9px] [&_h2]:[font-size:18px] [&_h2]:[letter-spacing:-.02em] [&_p]:[margin:0_0_16px] [&_p]:[color:var(--blog-muted)] [&_p]:[font-size:13px] [&_p]:[line-height:1.65] [&_>_a]:[color:var(--blog-blue)] [&_>_a]:[font-size:12px] [&_>_a]:[font-weight:800]"}><span className={"blog-kicker [display:inline-flex] [align-items:center] [gap:9px] [color:var(--blog-blue)] [font-size:11px] [font-weight:800] [letter-spacing:1.6px]"}>ABOUT THE AUTHOR</span><h2>CEO JACK</h2><p>Business coach, entrepreneur and founder of CEO JACK LEARNING HUB in Kampala, Uganda.</p><Link href="/author/ceo-jack">Read the author profile <span aria-hidden="true">→</span></Link></div>
              <div className={"article-sidebar-cta [&_>_span]:[color:var(--blog-blue)] [&_>_span]:[font-size:10px] [&_>_span]:[font-weight:800] [&_>_span]:[letter-spacing:1.4px] [padding:22px] [border:1px_solid_var(--blog-border)] [border-radius:15px] [background:radial-gradient(ellipse_at_90%_0%,_rgba(155,123,255,.15),_transparent_50%),_var(--blog-surface)] [&_p]:[margin:0_0_16px] [&_p]:[color:var(--blog-muted)] [&_p]:[font-size:13px] [&_p]:[line-height:1.65] [&_>_a]:[color:var(--blog-blue)] [&_>_a]:[font-size:12px] [&_>_a]:[font-weight:800] [&_p]:[margin-top:10px]"}><span>KEEP LEARNING</span><p>Explore lessons across education, digital skills and entrepreneurship.</p><Link href="/get-started">Explore the hubs →</Link></div>
            </aside>
          </div>
          <BlogAdPlaceholder placement="article" />
          <section className={"article-related [padding-block:72px_82px] max-[780px]:[padding-block:54px_60px]"} aria-labelledby="related-heading">
            <div className={"blog-section-heading [display:flex] [align-items:center] [justify-content:space-between] [gap:24px] [margin-bottom:22px] [&_h2]:[margin:7px_0_0] [&_h2]:[font-size:clamp(25px,_3vw,_34px)] [&_h2]:[letter-spacing:-.035em] [&_>_p]:[margin:0_0_3px] [&_>_p]:[color:var(--blog-muted)] [&_>_p]:[font-size:13px] [&_>_a]:[color:var(--blog-blue)] [&_>_a]:[font-size:13px] [&_>_a]:[font-weight:800] max-[780px]:[align-items:flex-start] max-[780px]:[&_>_p]:[display:none]"}><div><span className={"blog-kicker [display:inline-flex] [align-items:center] [gap:9px] [color:var(--blog-blue)] [font-size:11px] [font-weight:800] [letter-spacing:1.6px]"}>NEXT STEPS</span><h2 id="related-heading">Keep exploring</h2></div><Link href="/blog">All guides <span aria-hidden="true">→</span></Link></div>
            <div className={"related-grid [display:grid] [grid-template-columns:repeat(2,_minmax(0,_1fr))] [gap:18px] [&_article]:[display:flex] [&_article]:[min-height:210px] [&_article]:[flex-direction:column] [&_article]:[align-items:flex-start] [&_article]:[padding:22px] [&_article]:[border:1px_solid_var(--blog-border)] [&_article]:[border-radius:15px] [&_article]:[background:var(--blog-surface)] [&_h3]:[margin:13px_0] [&_h3]:[font-size:21px] [&_h3]:[letter-spacing:-.025em] [&_h3]:[line-height:1.3] max-[780px]:[grid-template-columns:1fr]"}>{relatedPosts.map((related) => <article key={related.slug}><span className={"blog-category [display:inline-flex] [width:fit-content] [padding:6px_10px] [border:1px_solid_rgba(129,154,255,.28)] [border-radius:999px] [color:#b8c7ff] [background:rgba(99,133,255,.1)] [font-size:11px] [font-weight:700]"}>{related.category}</span><h3><Link href={`/blog/${related.slug}`}>{related.title}</Link></h3><Link className={"blog-read-link [display:inline-flex] [align-items:center] [gap:9px] [margin-top:auto] [padding-top:24px] ![color:var(--blog-blue)] [font-size:14px] [font-weight:800] [&_span]:[transition:transform_.2s_ease] [&:hover_span]:[transform:translateX(4px)]"} href={`/blog/${related.slug}`}>Read the guide <span aria-hidden="true">→</span></Link></article>)}</div>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
