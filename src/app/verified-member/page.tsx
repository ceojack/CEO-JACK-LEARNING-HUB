"use client";

import Link from "next/link";
import QRCode from "qrcode";
import { ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { VerifiedMemberCard } from "@/src/components/verified-member-card";
import { drawVerifiedCard } from "@/src/utils/verified-member-canvas";
import { createClient } from "@/src/utils/supabase/client";
import { isSupabaseConfigured } from "@/src/utils/supabase/config";
import { isVerifiedMemberTheme, VERIFIED_MEMBER_THEMES, type VerifiedMemberCardData, type VerifiedMemberTheme } from "@/src/utils/verified-member";
import "./verified-member.css";

const hobbyOptions = ["Coding", "English", "Business", "Music", "Design", "Science", "Sports", "Entrepreneurship", "Reading", "Art", "Leadership"];
const levels = ["Beginner", "Intermediate", "Pro", "Master"];
const bucketName = "verified-member-photos";
const DEFAULT_MEMBER_MOTTO = "Learn. Create. Develop.";

type ProfileResponse = {
  user?: { fullName?: string; avatarUrl?: string };
  profile?: { hobby?: string; level?: string; avatarUrl?: string } | null;
  error?: string;
};

type CardResponse = { card?: (VerifiedMemberCardData & { isVerified?: boolean }) | null; error?: string };

function makePreviewId() {
  const year = new Date().getFullYear();
  return `CJ-${year}-${String(1000 + Math.floor(Math.random() * 9000))}`;
}

function mapLearnerLevel(value?: string) {
  if (!value) return "Beginner";
  if (levels.includes(value)) return value;
  if (/secondary/i.test(value)) return "Intermediate";
  if (/higher/i.test(value)) return "Pro";
  if (/independent/i.test(value)) return "Master";
  return "Beginner";
}

function compressPhoto(file: File) {
  return new Promise<Blob>((resolve, reject) => {
    const image = new Image();
    const sourceUrl = URL.createObjectURL(file);
    image.onload = () => {
      const side = Math.min(image.naturalWidth, image.naturalHeight);
      const sx = (image.naturalWidth - side) / 2;
      const sy = (image.naturalHeight - side) / 2;
      const canvas = document.createElement("canvas");
      canvas.width = 800;
      canvas.height = 800;
      const context = canvas.getContext("2d");
      URL.revokeObjectURL(sourceUrl);
      if (!context) return reject(new Error("Your photo could not be prepared. Try another image."));
      context.drawImage(image, sx, sy, side, side, 0, 0, 800, 800);
      canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("Your photo could not be prepared. Try another image.")), "image/jpeg", 0.9);
    };
    image.onerror = () => {
      URL.revokeObjectURL(sourceUrl);
      reject(new Error("Choose a valid photo file."));
    };
    image.src = sourceUrl;
  });
}

export default function VerifiedMemberPage() {
  const [loading, setLoading] = useState(true);
  const [signedIn, setSignedIn] = useState(false);
  const [userId, setUserId] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [photoBlob, setPhotoBlob] = useState<Blob | null>(null);
  const [fullName, setFullName] = useState("");
  const [hobby, setHobby] = useState("");
  const [level, setLevel] = useState("Beginner");
  const [motto, setMotto] = useState(DEFAULT_MEMBER_MOTTO);
  const [cardColour, setCardColour] = useState<VerifiedMemberTheme>("ocean-blue");
  const [memberId, setMemberId] = useState("");
  const [createdAt, setCreatedAt] = useState<string | undefined>();
  const [qrImage, setQrImage] = useState("");
  const [generated, setGenerated] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [downloadFallback, setDownloadFallback] = useState(false);
  const [downloadFallbackUrl, setDownloadFallbackUrl] = useState("");
  const [previewAnimating, setPreviewAnimating] = useState(false);
  const previousPreview = useRef("");

  useEffect(() => {
    let cancelled = false;
    async function loadMember() {
      setMemberId(makePreviewId());
      if (!isSupabaseConfigured()) {
        setError("Account access is not configured yet. Please try again later.");
        setLoading(false);
        return;
      }
      try {
        const supabase = createClient();
        const { data: authData } = await supabase.auth.getSession();
        const session = authData.session;
        if (!session) return;
        setSignedIn(true);
        setUserId(session.user.id);

        const headers = { Authorization: `Bearer ${session.access_token}` };
        const [profileResponse, cardResponse] = await Promise.all([
          fetch("/api/profile", { headers, cache: "no-store" }),
          fetch("/api/verified-member", { headers, cache: "no-store" }),
        ]);
        const profileResult = await profileResponse.json() as ProfileResponse;
        if (profileResponse.ok) {
          const avatar = profileResult.user?.avatarUrl || profileResult.profile?.avatarUrl || "";
          setFullName(profileResult.user?.fullName || "");
          setHobby(profileResult.profile?.hobby || "");
          setLevel(mapLearnerLevel(profileResult.profile?.level));
          setProfilePhoto(avatar);
          setPhotoUrl(avatar);
        }

        const cardResult = await cardResponse.json() as CardResponse;
        if (cardResponse.ok && cardResult.card && !cancelled) {
          const card = cardResult.card;
          setFullName(card.fullName);
          setHobby(card.hobby);
          setLevel(card.level);
          setMotto(card.motto || DEFAULT_MEMBER_MOTTO);
          setCardColour(isVerifiedMemberTheme(card.cardColour) ? card.cardColour : "ocean-blue");
          setMemberId(card.memberId);
          setPhotoUrl(card.photoUrl);
          setProfilePhoto((current) => current || card.photoUrl);
          setCreatedAt(card.createdAt);
          setGenerated(Boolean(card.isVerified));
        } else if (!cardResponse.ok) {
          if (!cancelled) setError(cardResult.error ?? "Verified member cards are not available yet.");
        }
      } catch (loadError) {
        if (!cancelled) setError(loadError instanceof Error ? loadError.message : "Your member card could not be loaded.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void loadMember();
    return () => { cancelled = true; };
  }, []);

  const qrUrl = useMemo(() => memberId ? `https://ceojacklearninghub.com/verified-member/${memberId}` : "", [memberId]);
  const card = useMemo<VerifiedMemberCardData>(() => ({
    fullName: fullName.trim() || "Your Name",
    photoUrl,
    hobby: hobby || "Learner",
    level,
    motto: motto.trim() || DEFAULT_MEMBER_MOTTO,
    memberId,
    cardColour,
    qrUrl,
    createdAt,
  }), [cardColour, createdAt, fullName, hobby, level, memberId, motto, photoUrl, qrUrl]);

  useEffect(() => {
    const previewState = [fullName, hobby, level, motto, photoUrl, cardColour].join("|");
    if (!previousPreview.current) {
      previousPreview.current = previewState;
      return;
    }
    if (previousPreview.current === previewState) return;
    previousPreview.current = previewState;
    setPreviewAnimating(true);
    const timer = window.setTimeout(() => setPreviewAnimating(false), 190);
    return () => window.clearTimeout(timer);
  }, [cardColour, fullName, hobby, level, motto, photoUrl]);

  useEffect(() => {
    let cancelled = false;
    if (!qrUrl) return;
    void QRCode.toDataURL(qrUrl, { errorCorrectionLevel: "H", margin: 1, width: 320, color: { dark: "#10233d", light: "#ffffff" } })
      .then((value) => { if (!cancelled) setQrImage(value); })
      .catch((qrError: unknown) => { if (!cancelled) setError(qrError instanceof Error ? qrError.message : "The QR code could not be created."); });
    return () => { cancelled = true; };
  }, [qrUrl]);

  async function signInWithGoogle() {
    setError("");
    try {
      const callback = new URL("/auth/callback", window.location.origin);
      callback.searchParams.set("next", "/verified-member");
      const { error: oauthError } = await createClient().auth.signInWithOAuth({
        provider: "google",
        options: { queryParams: { prompt: "select_account" }, redirectTo: callback.toString() },
      });
      if (oauthError) throw oauthError;
    } catch (oauthError) {
      setError(oauthError instanceof Error ? oauthError.message : "Google sign-in could not start. Please try again.");
    }
  }

  async function selectPhoto(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Choose an image file for your card photo.");
      return;
    }
    if (file.size > 12 * 1024 * 1024) {
      setError("Choose a photo smaller than 12 MB.");
      return;
    }
    try {
      const blob = await compressPhoto(file);
      setPhotoBlob(blob);
      setPhotoUrl(URL.createObjectURL(blob));
      setError("");
      setGenerated(false);
    } catch (photoError) {
      setError(photoError instanceof Error ? photoError.message : "The photo could not be prepared.");
    }
  }

  function useProfilePhoto() {
    setPhotoBlob(null);
    setPhotoUrl(profilePhoto);
    setError("");
    setGenerated(false);
  }

  const generateCard = useCallback(async () => {
    setError("");
    setStatus("");
    if (!signedIn) {
      setError("Sign in with Google to generate your verified member card.");
      return;
    }
    if (fullName.trim().length < 2) {
      setError("Enter your full name to continue.");
      return;
    }
    if (!photoUrl) {
      setError("Upload a photo or choose your profile photo to continue.");
      return;
    }
    if (!hobby) {
      setError("Choose a hobby to continue.");
      return;
    }

    setSaving(true);
    try {
      let savedPhotoUrl = photoUrl;
      const supabase = createClient();
      const { data: authData, error: authError } = await supabase.auth.getSession();
      if (authError || !authData.session) throw new Error("Your session has expired. Sign in again to save your card.");
      let photoToUpload = photoBlob;
      const isCardStoragePhoto = photoUrl.includes(`/storage/v1/object/public/${bucketName}/`);
      if (!photoToUpload && !isCardStoragePhoto) {
        const photoResponse = await fetch(photoUrl, { mode: "cors" });
        if (!photoResponse.ok) throw new Error("Your profile photo could not be copied. Upload a photo from your device instead.");
        const remotePhoto = await photoResponse.blob();
        photoToUpload = await compressPhoto(new File([remotePhoto], "profile-photo", { type: remotePhoto.type || "image/jpeg" }));
      }
      if (photoToUpload) {
        const path = `${userId}/member-photo.jpg`;
        const { error: uploadError } = await supabase.storage.from(bucketName).upload(path, photoToUpload, { contentType: "image/jpeg", upsert: true, cacheControl: "3600" });
        if (uploadError) throw new Error(`Photo upload failed: ${uploadError.message}`);
        savedPhotoUrl = supabase.storage.from(bucketName).getPublicUrl(path).data.publicUrl;
      }

      const response = await fetch("/api/verified-member", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${authData.session.access_token}` },
        body: JSON.stringify({ fullName: fullName.trim(), photoUrl: savedPhotoUrl, hobby, level, motto: motto.trim(), cardColour, memberId }),
      });
      const result = await response.json() as CardResponse;
      if (!response.ok || !result.card) throw new Error(result.error ?? "Your card could not be saved.");

      const saved = result.card;
      setPhotoUrl(saved.photoUrl);
      setPhotoBlob(null);
      setMemberId(saved.memberId);
      setCreatedAt(saved.createdAt);
      setGenerated(true);
      setStatus("Your verified member card is ready.");
    } catch (saveError) {
      console.error("Could not generate verified member card:", saveError);
      setError(saveError instanceof Error ? saveError.message : "Your card could not be saved. Please try again.");
    } finally {
      setSaving(false);
    }
  }, [cardColour, fullName, hobby, level, memberId, motto, photoBlob, photoUrl, signedIn, userId]);

  async function downloadCard() {
    setError("");
    setDownloadFallback(false);
    if (downloadFallbackUrl) {
      URL.revokeObjectURL(downloadFallbackUrl);
      setDownloadFallbackUrl("");
    }
    let imageBlob: Blob | null = null;
    try {
      const canvas = await drawVerifiedCard(card, qrImage);
      imageBlob = await new Promise<Blob>((resolve, reject) => canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("The PNG could not be downloaded.")), "image/png"));
      const fileName = `Ceo-Jack-Verified-Card-${card.memberId}.png`;
      const imageFile = new File([imageBlob], fileName, { type: "image/png" });
      if (navigator.canShare?.({ files: [imageFile] })) {
        await navigator.share({ files: [imageFile], title: "CEO JACK Verified Member Card" });
        return;
      }
      const link = document.createElement("a");
      const imageUrl = URL.createObjectURL(imageBlob);
      link.href = imageUrl;
      link.download = fileName;
      link.click();
      window.setTimeout(() => URL.revokeObjectURL(imageUrl), 1000);
    } catch (downloadError) {
      if (downloadError instanceof DOMException && downloadError.name === "AbortError") return;
      if (imageBlob) setDownloadFallbackUrl(URL.createObjectURL(imageBlob));
      setDownloadFallback(true);
      setError(downloadError instanceof Error ? downloadError.message : "The card download could not be created.");
    }
  }

  async function copyCardLink() {
    try {
      await navigator.clipboard.writeText(qrUrl);
      setStatus("Card link copied.");
    } catch {
      setError("The card link could not be copied on this browser.");
    }
  }

  const signInUrl = "https://ceojacklearninghub.com/verified-member";
  const themeName = VERIFIED_MEMBER_THEMES.find((theme) => theme.id === cardColour)?.name ?? "Ocean Blue";

  return (
    <main className="verified-member-page">
      <header className="verified-member-topbar"><Link href="/profile" className="verified-member-back">← Back to Learner Profile</Link><span>CEO JACK LEARNING HUB</span></header>
      <div className="verified-member-shell">
        <div className="verified-member-heading"><span className="verified-kicker">YOUR LEARNER JOURNEY</span><h1>Become a Verified Member</h1><p>Get your official Verified Member Card with Blue Tick. Fill the form, see your premium card live.</p></div>
        {signedIn ? <p className="verified-mobile-progress"><span>Step 1: Your Details</span><i aria-hidden="true">→</i><span>Step 2: Your Card</span></p> : null}

        {!loading && !signedIn ? <section className="verified-signin-card"><span className="verified-signin-mark" aria-hidden="true">✓</span><h2>Sign In with Google to become verified</h2><p>Your member card is saved to your Learning Hub account and works with JACK AI.</p><button className="verified-primary-button" type="button" onClick={() => void signInWithGoogle()}><span className="verified-google-mark" aria-hidden="true">G</span>Sign In with Google</button>{error ? <p className="verified-error" role="alert">{error}</p> : null}</section> : null}

        {signedIn ? <div className="verified-member-layout">
          <section className="verified-preview-column" aria-label="Live verified member card preview">
            <div className="verified-preview-sticky"><div className="verified-preview-label"><div><span className="verified-kicker">LIVE PREVIEW</span><h2>Your premium member card</h2></div><span className="verified-live-indicator"><i /> LIVE</span></div>
              <div className={`verified-card-motion${previewAnimating ? " is-changing" : ""}`}><VerifiedMemberCard card={card} qrImage={qrImage} /></div>
              {!generated ? <p className="verified-preview-hint">Fill in your details to see your card update live.</p> : null}
            </div>
          </section>

          <section className="verified-form-panel" aria-labelledby="verified-form-title">
            <div className="verified-panel-title"><span className="verified-kicker">MEMBER DETAILS</span><h2 id="verified-form-title">Personalize your card</h2><p>Your card preview updates as you make changes.</p></div>
            <form className="verified-member-form" onSubmit={(event) => { event.preventDefault(); void generateCard(); }}>
              <fieldset className="verified-fieldset"><legend>Member photo <span aria-hidden="true">*</span></legend>
                <label className="verified-photo-drop"><input type="file" accept="image/*" capture="user" onChange={(event) => void selectPhoto(event)} /><span className="verified-upload-preview">{photoUrl ? <img src={photoUrl} alt="" /> : <span aria-hidden="true">Photo</span>}</span><span className="verified-upload-copy"><strong>📷 Tap to Upload Photo</strong><small>Take a photo or choose one from your phone</small></span></label>
                {profilePhoto ? <button type="button" className="verified-profile-photo-button" onClick={useProfilePhoto}>Use My Profile Photo</button> : null}
              </fieldset>
              <label className="verified-field">Full Name <span aria-hidden="true">*</span><input required minLength={2} maxLength={80} value={fullName} onChange={(event) => { setFullName(event.target.value); setGenerated(false); }} placeholder="Enter your full name" /></label>
              <label className="verified-field">Hobby <span aria-hidden="true">*</span><select required value={hobby} onChange={(event) => { setHobby(event.target.value); setGenerated(false); }}><option value="">Choose a hobby</option>{hobby && !hobbyOptions.includes(hobby) ? <option>{hobby}</option> : null}{hobbyOptions.map((item) => <option key={item}>{item}</option>)}</select></label>
              <label className="verified-field">Learner Level <select value={level} onChange={(event) => { setLevel(event.target.value); setGenerated(false); }}>{levels.map((item) => <option key={item}>{item}</option>)}</select></label>
              <label className="verified-field">Motto / Quote <span className="verified-optional">Optional</span><input maxLength={35} value={motto} onChange={(event) => { setMotto(event.target.value); setGenerated(false); }} placeholder="Learn. Create. Develop." /><small>{motto.length}/35 characters</small></label>
              <fieldset className="verified-fieldset"><legend>Choose card colour</legend><div className="verified-theme-list">{VERIFIED_MEMBER_THEMES.map((theme) => <button key={theme.id} className={`verified-theme-option theme-chip-${theme.id}${cardColour === theme.id ? " selected" : ""}`} type="button" aria-label={theme.name} aria-pressed={cardColour === theme.id} onClick={() => { setCardColour(theme.id); setGenerated(false); }}><span className="verified-theme-swatch">{cardColour === theme.id ? <i aria-hidden="true">✓</i> : null}</span><span>{theme.name}</span></button>)}</div><p className="verified-selected-theme"><strong>{themeName} - Selected</strong></p></fieldset>
              {error ? <p className="verified-error" role="alert">{error}</p> : null}
              <button className="verified-primary-button verified-generate-button" type="submit" disabled={saving || loading}>{saving ? "Saving your card…" : generated ? "✨ Update My Verified Card" : "✨ Generate My Verified Card"}</button>
            </form>
          </section>
          {generated ? <section className="verified-card-actions" aria-label="Card actions"><button type="button" className="verified-primary-button" onClick={() => void downloadCard()} disabled={!qrImage}>⬇️ Download Verified Card (PNG)</button><a className="verified-secondary-button" href={`https://wa.me/?text=${encodeURIComponent(`I am now a Verified Member of Ceo Jack Learning Hub ✅ Get your card: ${signInUrl}`)}`} target="_blank" rel="noreferrer">📤 Share on WhatsApp</a><button type="button" className="verified-secondary-button" onClick={() => void copyCardLink()}>🔗 Copy Card Link</button><button type="button" className="verified-secondary-button" onClick={() => { setGenerated(false); setStatus("You can edit your card details, then generate it again."); }}>✏️ Edit Card</button>{downloadFallback ? <div className="verified-download-fallback"><p>Download didn’t work? Long-press the PNG below to save it, or copy the card link.</p>{downloadFallbackUrl ? <img className="verified-download-fallback-image" src={downloadFallbackUrl} alt="Verified member card PNG. Long-press to save." /> : null}<button type="button" className="verified-secondary-button" onClick={() => void copyCardLink()}>Copy Card Link</button></div> : null}{status ? <p className="verified-success" role="status">{status}</p> : null}</section> : null}
        </div> : null}
      </div>
    </main>
  );
}
