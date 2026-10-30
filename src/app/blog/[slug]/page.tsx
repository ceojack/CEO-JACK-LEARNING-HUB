import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/src/components/footer";
import { SiteHeader } from "@/src/components/header";
import { blogPosts, getBlogPost } from "@/src/lib/blog-posts";
import "../blog.css";

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

  return (
    <div className="blog-page blog-shell">
      <div className="page-bg" aria-hidden="true" />
      <SiteHeader active="/blog" />
      <main className="blog-page blog-article-page">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema).replace(/</g, "\\u003c") }}
        />
        <div className="container article-container">
          <nav className="article-breadcrumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link><span aria-hidden="true">/</span><Link href="/blog">Blog</Link><span aria-hidden="true">/</span><span aria-current="page">{post.category}</span>
          </nav>
          <header className="article-heading">
            <span className="blog-category">{post.category}</span>
            <h1>{post.title}</h1>
            <p className="article-deck">{post.description}</p>
            <div className="article-byline">
              <Link href="/author/ceo-jack" className="author-mark" aria-label="Read the CEO JACK author profile">CJ</Link>
              <span><Link href="/author/ceo-jack" className="article-author-name">CEO JACK</Link><br /><small>Published <time dateTime={post.datePublished}>{formatDate(post.datePublished)}</time> <i aria-hidden="true">·</i> {post.readTime}</small></span>
            </div>
          </header>
          <figure className="article-cover">
            <Image src={post.image} alt={post.imageAlt} width={1400} height={850} sizes="(max-width: 900px) 100vw, 1000px" preload />
            <figcaption>{post.imageCredit} · <a href="https://unsplash.com" target="_blank" rel="noreferrer">Unsplash</a></figcaption>
          </figure>
          <div className="article-layout">
            <article className="article-body">
              <p className="article-intro">{post.intro}</p>
              {post.sections.map((section) => (
                <section className="article-section" key={section.heading}>
                  <h2>{section.heading}</h2>
                  {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                  {section.bullets ? <ul>{section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul> : null}
                  {section.takeaway ? <aside className="article-takeaway"><span>TAKE THIS WITH YOU</span><p>{section.takeaway}</p></aside> : null}
                </section>
              ))}
              <div className="article-end"><span>LEARN · CREATE · DEVELOP</span><Link href="/blog">More practical guides <span aria-hidden="true">→</span></Link></div>
            </article>
            <aside className="article-sidebar" aria-label="About the author">
              <div className="author-card"><span className="blog-kicker">ABOUT THE AUTHOR</span><h2>CEO JACK</h2><p>Business coach, entrepreneur and founder of CEO JACK LEARNING HUB in Kampala, Uganda.</p><Link href="/author/ceo-jack">Read the author profile <span aria-hidden="true">→</span></Link></div>
              <div className="article-sidebar-cta"><span>KEEP LEARNING</span><p>Explore lessons across education, digital skills and entrepreneurship.</p><Link href="/get-started">Explore the hubs →</Link></div>
            </aside>
          </div>
          <section className="article-related" aria-labelledby="related-heading">
            <div className="blog-section-heading"><div><span className="blog-kicker">NEXT STEPS</span><h2 id="related-heading">Keep exploring</h2></div><Link href="/blog">All guides <span aria-hidden="true">→</span></Link></div>
            <div className="related-grid">{relatedPosts.map((related) => <article key={related.slug}><span className="blog-category">{related.category}</span><h3><Link href={`/blog/${related.slug}`}>{related.title}</Link></h3><Link className="blog-read-link" href={`/blog/${related.slug}`}>Read the guide <span aria-hidden="true">→</span></Link></article>)}</div>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
