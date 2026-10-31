import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteFooter } from "@/src/components/footer";
import { SiteHeader } from "@/src/components/header";
import { blogPosts } from "@/src/lib/blog-posts";
import "./blog.css";

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
    <div className="blog-page blog-shell">
      <div className="page-bg" aria-hidden="true" />
      <SiteHeader active="/blog" />
      <main className="blog-page">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema).replace(/</g, "\\u003c") }}
        />
        <section className="blog-hero">
          <div className="container blog-hero-inner">
            <span className="blog-eyebrow"><i /> IDEAS FOR YOUR NEXT STEP</span>
            <h1>Learn something.<br /><span>Put it to work.</span></h1>
            <p>Clear, practical guides for stronger study habits, useful digital skills and building a business idea one step at a time.</p>
            <div className="blog-topics" aria-label="Blog topics">
              <span>Learning skills</span><span>Digital skills</span><span>Entrepreneurship</span>
            </div>
          </div>
        </section>

        <section className="container blog-featured-section" aria-labelledby="featured-heading">
          <div className="blog-section-heading">
            <div><span className="blog-kicker">START HERE</span><h2 id="featured-heading">Featured guide</h2></div>
            <span className="blog-count">{blogPosts.length} practical guides</span>
          </div>
          <article className="blog-featured-card">
            <Link href={`/blog/${featuredPost.slug}`} className="blog-featured-image" aria-label={`Read ${featuredPost.title}`}>
              <Image src={featuredPost.image} alt={featuredPost.imageAlt} fill sizes="(max-width: 800px) 100vw, 52vw" preload />
              <span className="blog-image-credit">{featuredPost.imageCredit}</span>
            </Link>
            <div className="blog-featured-copy">
              <div className="blog-meta"><span className="blog-category">{featuredPost.category}</span><span>{featuredPost.readTime}</span></div>
              <h3><Link href={`/blog/${featuredPost.slug}`}>{featuredPost.title}</Link></h3>
              <p>{featuredPost.description}</p>
              <div className="blog-byline"><Link href="/author/ceo-jack" className="author-mark" aria-label="Read the CEO JACK author profile">CJ</Link><span>By <Link href="/author/ceo-jack" className="article-author-name">CEO JACK</Link><br /><small>Published {formatDate(featuredPost.datePublished)}</small></span></div>
              <Link href="/author/ceo-jack" className="blog-author-profile-link">Meet the author <span aria-hidden="true">→</span></Link>
              <Link className="blog-read-link" href={`/blog/${featuredPost.slug}`}>Read the guide <span aria-hidden="true">→</span></Link>
            </div>
          </article>
        </section>

        <section className="container blog-library-section" aria-labelledby="latest-heading">
          <div className="blog-section-heading">
            <div><span className="blog-kicker">THE LEARNING LIBRARY</span><h2 id="latest-heading">Explore the guides</h2></div>
            <p>Small ideas. Practical steps. Room to grow.</p>
          </div>
          <div className="blog-grid">
            {latestPosts.map((post, index) => (
              <article className="blog-card" key={post.slug}>
                <Link className="blog-card-image" href={`/blog/${post.slug}`} aria-label={`Read ${post.title}`}>
                  <Image src={post.image} alt={post.imageAlt} fill sizes="(max-width: 680px) 100vw, (max-width: 1000px) 50vw, 33vw" />
                  <span className="blog-image-credit">{post.imageCredit}</span>
                  <span className="blog-image-number">0{index + 2}</span>
                </Link>
                <div className="blog-card-copy">
                  <div className="blog-meta"><span className="blog-category">{post.category}</span><span>{post.readTime}</span></div>
                  <h3><Link href={`/blog/${post.slug}`}>{post.title}</Link></h3>
                  <p>{post.description}</p>
                  <Link className="blog-read-link" href={`/blog/${post.slug}`}>Read the guide <span aria-hidden="true">→</span></Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="container blog-cta-section">
          <div className="blog-cta">
            <div><span className="blog-kicker">KEEP YOUR MOMENTUM</span><h2>Turn your next question into progress.</h2><p>Explore the learning hubs and find a useful next step for your goals.</p></div>
            <Link href="/get-started" className="get-started-button">Get Started Free <span aria-hidden="true">→</span></Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
