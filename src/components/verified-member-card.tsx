import type { VerifiedMemberCardData } from "@/src/utils/verified-member";
import { SiteLogoMark } from "@/src/components/site-logo-mark";

export function VerifiedMemberCard({ card, qrImage }: { card: VerifiedMemberCardData; qrImage: string }) {
  const since = card.createdAt ? new Date(card.createdAt).getFullYear() : new Date().getFullYear();
  const motto = card.motto || "Learn. Create. Develop.";

  return (
    <article className={`verified-member-card theme-${card.cardColour}`} aria-label={`Verified member card for ${card.fullName}`}>
      <div className="verified-card-watermark" aria-hidden="true"><span>CEO JACK LEARNING HUB</span><span>CEO JACK LEARNING HUB</span></div>
      <header className="verified-card-header">
        <div className="verified-card-brand"><SiteLogoMark className="verified-card-logo" width={64} height={64} alt="CEO JACK Learning Hub crest" /><span><strong>CEO JACK</strong><small>LEARNING HUB</small></span></div>
        <div className="verified-card-badge"><span aria-hidden="true">♢</span><span>VERIFIED MEMBER</span></div>
      </header>
      <div className="verified-card-body">
        <div className="verified-card-photo-wrap">{card.photoUrl ? <img className="verified-card-photo" src={card.photoUrl} alt={`${card.fullName}'s member portrait`} crossOrigin="anonymous" /> : <SiteLogoMark className="verified-card-photo-placeholder" width={160} height={160} alt="CEO JACK Learning Hub logo placeholder" />}</div>
        <div className="verified-card-details">
          <h2><span>{card.fullName || "Your Name"}</span><span className="verified-blue-tick" aria-label="Verified">✓</span></h2>
          <p className="verified-card-hobby">{card.hobby || "LEARNER"}<span aria-hidden="true"> • </span>{card.level || "BEGINNER"} LEARNER</p>
          <p className="verified-card-id">ID: {card.memberId || "CJ-0000-0000"}</p>
          <p className="verified-card-motto">“{motto}”</p>
        </div>
      </div>
      <footer className="verified-card-footer">
        <div className="verified-card-footer-copy"><strong>MEMBER SINCE {since}</strong><span>ceojacklearninghub.com</span></div>
        <div className="verified-card-qr-box">{qrImage ? <img src={qrImage} alt="QR code linking to this verified member card" /> : <span>QR</span>}</div>
      </footer>
    </article>
  );
}
