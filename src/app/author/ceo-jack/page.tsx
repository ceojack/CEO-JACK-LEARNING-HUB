import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/src/components/footer";
import { SiteHeader } from "@/src/components/header";
import { blogPosts } from "@/src/lib/blog-posts";
import "@/src/app/blog/blog.css";
import "./author.css";

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
    <div className="blog-page blog-shell author-page">
      <div className="page-bg" aria-hidden="true" />
      <SiteHeader active="/blog" />
      <main className="blog-page author-profile-main">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(profileSchema).replace(/</g, "\\u003c") }}
        />
        <div className="container author-profile-container">
          <nav className="article-breadcrumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link><span aria-hidden="true">/</span><Link href="/blog">Blog</Link><span aria-hidden="true">/</span><span aria-current="page">Author profile</span>
          </nav>

          <section className="author-profile-hero" aria-labelledby="author-name">
            <div className="author-profile-copy">
              <span className="blog-eyebrow"><i /> FOUNDER · BUSINESS COACH · ENTREPRENEUR</span>
              <h1 id="author-name">CEO <span>JACK</span></h1>
              <p className="author-profile-intro">Business coach and entrepreneur based in Kampala, Uganda. Founder of CEO JACK LEARNING HUB.</p>
              <p className="author-profile-description">Through the Hub, CEO JACK shares learning across education, leadership, digital skills and entrepreneurship to help young people turn knowledge into practical action.</p>
              <div className="author-profile-actions">
                <Link href="/blog" className="blog-cta-button">Read the blog <span aria-hidden="true">→</span></Link>
                <Link href="/about" className="author-about-link">About the Learning Hub <span aria-hidden="true">→</span></Link>
              </div>
            </div>
            <figure className="author-photo-slot">
              <div className="author-photo-frame" aria-hidden="true"><span>+</span></div>
              <figcaption>Your profile photo goes here</figcaption>
            </figure>
          </section>

          <section className="author-focus" aria-labelledby="author-focus-title">
            <div className="blog-section-heading"><div><span className="blog-kicker">AREAS OF FOCUS</span><h2 id="author-focus-title">Learning that moves into action</h2></div></div>
            <div className="author-focus-grid">
              <article><span>01</span><h3>Education</h3><p>Build understanding through clear lessons and purposeful study.</p></article>
              <article><span>02</span><h3>Digital skills</h3><p>Develop practical technology skills through learning and creation.</p></article>
              <article><span>03</span><h3>Entrepreneurship</h3><p>Explore business thinking, leadership and ideas that can be tested in real life.</p></article>
            </div>
          </section>

          <section className="author-writing" aria-labelledby="author-writing-title">
            <div className="blog-section-heading"><div><span className="blog-kicker">WRITING FROM THE HUB</span><h2 id="author-writing-title">Latest practical guides</h2></div><Link href="/blog">Visit the blog <span aria-hidden="true">→</span></Link></div>
            <div className="related-grid">
              {blogPosts.slice(0, 2).map((post) => (
                <article key={post.slug}>
                  <span className="blog-category">{post.category}</span>
                  <h3><Link href={`/blog/${post.slug}`}>{post.title}</Link></h3>
                  <Link className="blog-read-link" href={`/blog/${post.slug}`}>Read the guide <span aria-hidden="true">→</span></Link>
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
