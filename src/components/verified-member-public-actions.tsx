"use client";

import Link from "next/link";
import QRCode from "qrcode";
import { useEffect, useState } from "react";
import { drawVerifiedCard } from "@/src/utils/verified-member-canvas";
import type { VerifiedMemberCardData } from "@/src/utils/verified-member";

export function VerifiedMemberPublicActions({ card, isOwner }: { card: VerifiedMemberCardData; isOwner: boolean }) {
  const [qrImage, setQrImage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    void QRCode.toDataURL(card.qrUrl, { errorCorrectionLevel: "H", margin: 1, width: 320, color: { dark: "#10233d", light: "#ffffff" } })
      .then((value) => { if (!cancelled) setQrImage(value); })
      .catch((qrError: unknown) => { if (!cancelled) setError(qrError instanceof Error ? qrError.message : "The card QR code could not be prepared."); });
    return () => { cancelled = true; };
  }, [card.qrUrl]);

  async function downloadCard() {
    setError("");
    try {
      const canvas = await drawVerifiedCard(card, qrImage);
      const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob((image) => image ? resolve(image) : reject(new Error("The card PNG could not be created.")), "image/png"));
      const fileName = `Ceo-Jack-Verified-Card-${card.memberId}.png`;
      const file = new File([blob], fileName, { type: "image/png" });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: "CEO JACK Verified Member Card" });
        return;
      }
      const imageUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = imageUrl;
      link.download = fileName;
      link.click();
      window.setTimeout(() => URL.revokeObjectURL(imageUrl), 1000);
    } catch (downloadError) {
      if (downloadError instanceof DOMException && downloadError.name === "AbortError") return;
      setError(downloadError instanceof Error ? downloadError.message : "The card PNG could not be downloaded.");
    }
  }

  async function shareCard() {
    setError("");
    const shareText = "This is an official verified member of Ceo Jack Learning Hub.";
    try {
      if (navigator.share) {
        await navigator.share({ title: "Verified Member Card", text: shareText, url: card.qrUrl });
      } else {
        const message = encodeURIComponent(`${shareText} ${card.qrUrl}`);
        window.open(`https://wa.me/?text=${message}`, "_blank", "noopener,noreferrer");
      }
    } catch (shareError) {
      if (shareError instanceof DOMException && shareError.name === "AbortError") return;
      setError("The card could not be shared. Copy its link from the address bar and try again.");
    }
  }

  return (
    <div className="verified-public-actions">
      <Link className="verified-primary-button verified-get-card-link" href="/verified-member">✅ Get Your Verified Card <span aria-hidden="true">→</span></Link>
      <button className="verified-secondary-button" type="button" onClick={() => void shareCard()}>📤 Share This Card</button>
      {isOwner ? <>
        <Link className="verified-secondary-button" href="/verified-member">✏️ Edit My Card</Link>
        <button className="verified-primary-button" type="button" onClick={() => void downloadCard()} disabled={!qrImage}>⬇️ Download My Card</button>
      </> : null}
      {error ? <p className="verified-error" role="alert">{error}</p> : null}
    </div>
  );
}
