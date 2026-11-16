import type { Metadata } from "next";
import Link from "next/link";
import QRCode from "qrcode";
import { VerifiedMemberCard } from "@/src/components/verified-member-card";
import { VerifiedMemberPublicActions } from "@/src/components/verified-member-public-actions";
import { createClient } from "@/src/utils/supabase/server";
import { isVerifiedMemberTheme, type VerifiedMemberCardData } from "@/src/utils/verified-member";

export const dynamic = "force-dynamic";

type PublicMemberPageProps = { params: Promise<{ memberId: string }> };

export async function generateMetadata({ params }: PublicMemberPageProps): Promise<Metadata> {
  const { memberId } = await params;
  return {
    title: "Verified Member Card",
    alternates: { canonical: `/verified-member/${encodeURIComponent(memberId)}` },
    robots: { index: true, follow: true },
  };
}

function CardNotFound() {
  return (
    <main className="verified-member-page verified-member-public-page">
      <header className="verified-member-topbar"><Link href="/">CEO JACK LEARNING HUB</Link><span>VERIFIED MEMBER CARD</span></header>
      <section className="verified-public-content verified-card-not-found">
        <span className="verified-not-found-icon" aria-hidden="true">?</span>
        <span className="verified-kicker">MEMBER LOOKUP</span>
        <h1>Card Not Found</h1>
        <p>This Member ID does not exist or was deleted.</p>
        <Link className="verified-primary-button verified-get-card-link" href="/verified-member">✅ Get Your Verified Card <span aria-hidden="true">→</span></Link>
      </section>
    </main>
  );
}

export default async function PublicVerifiedMemberPage({ params }: PublicMemberPageProps) {
  const { memberId } = await params;
  if (!/^CJ-\d{4}-\d{4}$/.test(memberId)) return <CardNotFound />;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("get_public_verified_member_card", { p_member_id: memberId });
    if (error) {
      console.error("Could not load public verified member card:", error);
      return <CardNotFound />;
    }
    const row = Array.isArray(data) ? data[0] : data;
    if (!row || typeof row !== "object") return <CardNotFound />;
    const details = row as Record<string, unknown>;
    if (!isVerifiedMemberTheme(details.card_colour) || typeof details.full_name !== "string" || typeof details.photo_url !== "string") return <CardNotFound />;

    const qrUrl = `https://ceojacklearninghub.com/verified-member/${memberId}`;
    const card: VerifiedMemberCardData = {
      fullName: details.full_name,
      photoUrl: details.photo_url,
      hobby: typeof details.hobby === "string" ? details.hobby : "Learner",
      level: typeof details.level === "string" ? details.level : "Beginner",
      motto: typeof details.motto === "string" ? details.motto : "Learn. Create. Develop.",
      memberId,
      cardColour: details.card_colour,
      qrUrl,
      createdAt: typeof details.created_at === "string" ? details.created_at : undefined,
    };
    const qrImage = await QRCode.toDataURL(qrUrl, { errorCorrectionLevel: "H", margin: 1, width: 320, color: { dark: "#10233d", light: "#ffffff" } });

    let isOwner = false;
    const { data: claimsData } = await supabase.auth.getClaims();
    const viewerId = claimsData?.claims?.sub;
    if (typeof viewerId === "string") {
      const { data: ownCard, error: ownerLookupError } = await supabase
        .from("verified_member_cards")
        .select("member_id")
        .eq("user_id", viewerId)
        .maybeSingle();
      if (ownerLookupError) console.error("Could not check verified card owner:", ownerLookupError);
      isOwner = ownCard?.member_id === memberId;
    }

    return (
      <main className="verified-member-page verified-member-public-page">
        <header className="verified-member-topbar"><Link href="/">CEO JACK LEARNING HUB</Link><span>VERIFIED MEMBER CARD</span></header>
        <section className="verified-public-content">
          <span className="verified-kicker">OFFICIAL LEARNER COMMUNITY</span>
          <h1>✅ Verified Member</h1>
          <p>This is an official verified member of Ceo Jack Learning Hub.</p>
          <VerifiedMemberCard card={card} qrImage={qrImage} />
          <VerifiedMemberPublicActions card={card} isOwner={isOwner} />
        </section>
      </main>
    );
  } catch (error) {
    console.error("Could not render public verified member card:", error);
    return <CardNotFound />;
  }
}
