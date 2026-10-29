import Link from "next/link";
import Image from "next/image";
import "@/src/styles/footer.css";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Education", href: "/education" },
  { label: "Digital Skills", href: "/digital-skills" },
  { label: "Entrepreneurship", href: "/entrepreneurship" },
  { label: "CEO JACK AI", href: "/ai" },
  { label: "Services", href: "/services" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Get Started", href: "/get-started" },
];

const socialLinks = [
  { name: "TikTok", handle: "ceojacklearninghub", href: "https://www.tiktok.com/@ceojacklearninghub", icon: "tiktok" },
  { name: "YouTube", handle: "ceojacklearninghub", href: "https://www.youtube.com/@ceojacklearninghub", icon: "youtube" },
  { name: "X", handle: "ceojacklearninghub", href: "https://x.com/ceojacklearninghub", icon: "x" },
  { name: "LinkedIn", handle: "ceojackhub", href: "https://www.linkedin.com/in/ceojackhub", icon: "linkedin" },
];

export function SiteFooter() {
  return (
    <footer className="site-footer hub-footer">
      <div className="container footer-top hub-footer-top">
        <div className="footer-brand">
          <Link href="/" className="brand">
            <Image src="/assets/images/logo1.webp" alt="" className="brand-logo" width={40} height={40} />
            <span className="brand-copy">
              <strong>CEO JACK</strong>
              <small>LEARNING HUB</small>
            </span>
          </Link>
          <p>Learn. Create. Develop.</p>
          <a className="footer-email" href="mailto:hello@ceojacklearninghub.com">hello@ceojacklearninghub.com</a>
        </div>
        <div className="footer-navigation-group">
          <nav className="footer-links" aria-label="Quick links">
            <h2>Quick links</h2>
            {quickLinks.map((link) => <Link href={link.href} key={link.href}>{link.label}</Link>)}
          </nav>
          <nav className="footer-social" aria-label="Social media">
            <h2>Follow CEO JACK</h2>
            <div className="footer-social-links">
              {socialLinks.map((social) => (
                <a href={social.href} key={social.name} target="_blank" rel="noreferrer" aria-label={`CEO JACK Learning Hub on ${social.name}: @${social.handle}`} title={`${social.name} @${social.handle}`}>
                  {social.icon === "tiktok" ? <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19.6 7.1a6.8 6.8 0 0 1-4.3-1.5v8.1a6.2 6.2 0 1 1-5.4-6.1v3.3a2.9 2.9 0 1 0 2.1 2.8V2.5h3.3c.2 2.2 1.8 4 4.3 4.3v.3Z" fill="currentColor" /></svg> : null}
                  {social.icon === "youtube" ? <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.2 3.6-6.2 3.6Z" fill="currentColor" /></svg> : null}
                  {social.icon === "x" ? <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18.9 2H22l-6.8 7.8L23.2 22h-6.3L12 14.6 5.6 22H2.4l7.3-8.4L1.9 2h6.4l4.5 6.8L18.9 2Zm-1.1 18h1.7L7.4 3.9H5.6L17.8 20Z" fill="currentColor" /></svg> : null}
                  {social.icon === "linkedin" ? <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.4 2H3.6C2.7 2 2 2.7 2 3.6v16.8c0 .9.7 1.6 1.6 1.6h16.8c.9 0 1.6-.7 1.6-1.6V3.6c0-.9-.7-1.6-1.6-1.6ZM8 19H5V9h3v10ZM6.5 7.6a1.8 1.8 0 1 1 0-3.6 1.8 1.8 0 0 1 0 3.6ZM19 19h-3v-4.9c0-1.2 0-2.7-1.7-2.7s-2 1.3-2 2.6V19h-3V9h2.9v1.4h.1A3.2 3.2 0 0 1 15.2 9c3 0 3.8 2 3.8 4.6V19Z" fill="currentColor" /></svg> : null}
                </a>
              ))}
            </div>
          </nav>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} CEO JACK LEARNING HUB. All rights reserved.</span>
        <span className="footer-legal-links"><Link href="/privacy">Privacy Policy</Link><Link href="/terms">Terms of Use</Link></span>
      </div>
    </footer>
  );
}
