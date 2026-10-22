import Link from "next/link";
import Image from "next/image";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-top">
        <div className="footer-brand">
          <Link href="/" className="brand">
            <Image src="/assets/images/logo1.webp" alt="" className="brand-logo" width={40} height={40} />
            <span className="brand-copy">
              <strong>CEO JACK</strong>
              <small>LEARNING HUB</small>
            </span>
          </Link>
          <p>Learn. Create. Develop.</p>
        </div>
        <nav className="footer-links" aria-label="Footer navigation">
          <Link href="/">Home</Link>
          <Link href="/#hubs">Hubs</Link>
          <Link href="/how-it-works">How It Works</Link>
          <Link href="/about">About</Link>
          <Link href="/services">Services</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/contact">Contact</Link>
        </nav>
      </div>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} CEO JACK LEARNING HUB. All rights reserved.</span>
        <span>Built for the next generation of learners.</span>
      </div>
    </footer>
  );
}
