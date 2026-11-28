"use client";

import Link from "next/link";
import QRCode from "qrcode";
import { ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { VerifiedMemberCard } from "@/src/components/verified-member-card";
import { drawVerifiedCard } from "@/src/utils/verified-member-canvas";
import { createClient } from "@/src/utils/supabase/client";
import { isSupabaseConfigured } from "@/src/utils/supabase/config";
import { isVerifiedMemberTheme, VERIFIED_MEMBER_THEMES, type VerifiedMemberCardData, type VerifiedMemberTheme } from "@/src/utils/verified-member";

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
  const photoObjectUrl = useRef("");

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
          setGenerated(Boolean(card.memberId));
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
    return () => {
      cancelled = true;
      if (photoObjectUrl.current) URL.revokeObjectURL(photoObjectUrl.current);
    };
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
      if (photoObjectUrl.current) URL.revokeObjectURL(photoObjectUrl.current);
      const objectUrl = URL.createObjectURL(blob);
      photoObjectUrl.current = objectUrl;
      setPhotoUrl(objectUrl);
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
        body: JSON.stringify({ fullName: fullName.trim(), photoUrl: savedPhotoUrl, hobby, level, motto: motto.trim(), cardColour }),
      });
      const result = await response.json() as CardResponse;
      if (!response.ok || !result.card) throw new Error(result.error ?? "Your card could not be saved.");

      const saved = result.card;
      setPhotoUrl(saved.photoUrl);
      setPhotoBlob(null);
      setMemberId(saved.memberId);
      setCreatedAt(saved.createdAt);
      setGenerated(true);
      setStatus(saved.isVerified
        ? "Your verified member card is ready."
        : "Your card is saved. Complete onboarding to publish it as a verified member card.");
    } catch (saveError) {
      console.error("Could not generate verified member card:", saveError);
      setError(saveError instanceof Error ? saveError.message : "Your card could not be saved. Please try again.");
    } finally {
      setSaving(false);
    }
  }, [cardColour, fullName, hobby, level, motto, photoBlob, photoUrl, signedIn, userId]);

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
    <main className={"verified-member-page [min-height:100vh] [overflow-x:clip] [color:#f5f7ff] [background:radial-gradient(ellipse_at_75%_-15%,rgba(74,145,255,.16),transparent_40%),#080d1b] [font-family:'Satoshi',sans-serif] [&_*]:[box-sizing:border-box] [&_button]:[font:inherit] [&_input]:[font:inherit] [&_select]:[font:inherit] [&_a]:[color:inherit] [&_a]:[text-decoration:none]"}>
      <header className={"verified-member-topbar [position:sticky] [z-index:10] [top:0] [display:flex] [min-height:68px] [align-items:center] [justify-content:space-between] [gap:18px] [padding:0_clamp(18px,5vw,64px)] [border-bottom:1px_solid_rgba(255,255,255,.08)] [background:rgba(8,13,27,.9)] [backdrop-filter:blur(16px)] [&_>_span]:[color:#9ba9c2] [&_>_span]:[font-size:10px] [&_>_span]:[font-weight:800] [&_>_span]:[letter-spacing:.14em] [&_>_a]:[color:#f5f7ff] [&_>_a]:[font-size:11px] [&_>_a]:[font-weight:850] [&_>_a]:[letter-spacing:.12em] max-[767px]:[min-height:61px] max-[767px]:[padding-inline:16px] max-[767px]:[&_>_span]:[font-size:8px]"}><Link href="/profile" className={"verified-member-back ![color:#cad5e9] [font-size:12px] [font-weight:700]"}>← Back to Learner Profile</Link><span>CEO JACK LEARNING HUB</span></header>
      <div className={"verified-member-shell [width:min(1320px,100%)] [margin:0_auto] [padding:32px_clamp(18px,4vw,52px)_58px] max-[767px]:[width:100%] max-[767px]:[padding:22px_16px_calc(80px_+_env(safe-area-inset-bottom))]"}>
        <div className={"verified-member-heading [max-width:760px] [margin-bottom:28px] [&_h1]:[margin:7px_0_9px] [&_h1]:[font-family:'Clash_Display',sans-serif] [&_h1]:[font-size:clamp(29px,4vw,43px)] [&_h1]:[letter-spacing:-.045em] [&_p]:[margin:0] [&_p]:[color:#aab7cc] [&_p]:[font-size:13px] [&_p]:[line-height:1.7] max-[767px]:[margin:0_auto_13px] max-[767px]:[text-align:center] max-[767px]:[&_h1]:[font-size:clamp(27px,7vw,34px)] max-[767px]:[&_p]:[max-width:520px] max-[767px]:[&_p]:[margin-inline:auto] max-[767px]:[&_p]:[font-size:12px]"}><span className={"verified-kicker [color:#8fc7ff] [font-size:9px] [font-weight:850] [letter-spacing:.17em]"}>YOUR LEARNER JOURNEY</span><h1>Become a Verified Member</h1><p>Get your official Verified Member Card with Blue Tick. Fill the form, see your premium card live.</p></div>
        {signedIn ? <p className={"verified-mobile-progress [display:none] max-[767px]:[display:flex] max-[767px]:[align-items:center] max-[767px]:[justify-content:center] max-[767px]:[gap:8px] max-[767px]:[margin:0_0_16px] max-[767px]:[color:#b9c5d9] max-[767px]:[font-size:10px] max-[767px]:[font-weight:700] max-[767px]:[&_span:first-child]:[color:#cce6ff] max-[767px]:[&_i]:[color:#75b8ff] max-[767px]:[&_i]:[font-style:normal]"}><span>Step 1: Your Details</span><i aria-hidden="true">→</i><span>Step 2: Your Card</span></p> : null}

        {!loading && !signedIn ? <section className={"verified-signin-card [display:grid] [width:min(100%,480px)] [justify-items:center] [gap:11px] [margin:0_auto] [padding:clamp(24px,5vw,40px)] [border:1px_solid_rgba(255,255,255,.1)] [border-radius:18px] [background:linear-gradient(145deg,#131f34,#0c1628)] [text-align:center] [&_h2]:[margin:2px_0_0] [&_h2]:[font-family:'Clash_Display',sans-serif] [&_h2]:[font-size:21px] [&_p]:[margin:0] [&_p]:[color:#aab7cc] [&_p]:[font-size:11px] [&_p]:[line-height:1.6] max-[767px]:[margin-top:18px]"}><span className={"verified-signin-mark [display:grid] [width:54px] [height:54px] [place-items:center] [border:1px_solid_rgba(105,176,255,.35)] [border-radius:16px] [background:rgba(54,135,238,.15)] [color:#79baff] [font-size:25px]"} aria-hidden="true">✓</span><h2>Sign In with Google to become verified</h2><p>Your member card is saved to your Learning Hub account and works with JACK AI.</p><button className={"verified-primary-button [display:inline-flex] [min-height:46px] [align-items:center] [justify-content:center] [gap:9px] [padding:0_15px] [border:1px_solid_rgba(145,201,255,.48)] [border-radius:10px] [background:linear-gradient(115deg,#287be8,#4367ee)] [box-shadow:0_8px_24px_rgba(42,104,225,.2)] [color:#fff] [font-size:10px] [font-weight:800] [cursor:pointer] [transition:transform_.18s,filter_.18s] [&:hover:not(:disabled)]:[transform:translateY(-1px)] [&:hover:not(:disabled)]:[filter:brightness(1.08)] [&:disabled]:[opacity:.58] [&:disabled]:[cursor:wait] [width:100%] [margin-top:7px] max-[767px]:[min-height:52px] max-[767px]:[font-size:16px] max-[767px]:[width:100%] max-[767px]:[padding-inline:13px]"} type="button" onClick={() => void signInWithGoogle()}><span className={"verified-google-mark [display:grid] [width:21px] [height:21px] [place-items:center] [border-radius:50%] [background:#fff] [color:#4285f4] [font-family:Arial,sans-serif] [font-size:14px] [font-weight:800]"} aria-hidden="true">G</span>Sign In with Google</button>{error ? <p className={"verified-error [margin:0] [color:#ffabb5] [font-size:11px] [line-height:1.55] [grid-column:1/-1] max-[767px]:[grid-column:auto]"} role="alert">{error}</p> : null}</section> : null}

        {signedIn ? <div className={"verified-member-layout [display:grid] [grid-template-columns:minmax(360px,1fr)_minmax(0,1fr)] [grid-template-rows:auto_auto] [grid-template-areas:\"form_preview\"_\"form_actions\"] [align-items:start] [gap:18px_clamp(24px,3.2vw,44px)] max-[767px]:[grid-template-columns:minmax(0,1fr)] max-[767px]:[grid-template-rows:auto_auto_auto] max-[767px]:[grid-template-areas:\"preview\"_\"form\"_\"actions\"] max-[767px]:[gap:16px]"}>
          <section className={"verified-preview-column [grid-area:preview] [position:sticky] [z-index:2] [top:92px] [min-width:0] max-[767px]:[position:static] max-[767px]:[grid-row:auto] max-[767px]:[min-width:0]"} aria-label="Live verified member card preview">
            <div className={"verified-preview-sticky [position:static]"}><div className={"verified-preview-label [&_h2]:[margin:6px_0_4px] [&_h2]:[font-family:'Clash_Display',sans-serif] [&_h2]:[font-size:18px] [display:flex] [align-items:center] [justify-content:space-between] [gap:14px] [margin:0_0_14px] max-[767px]:[margin-bottom:9px] max-[767px]:[&_h2]:[font-size:16px]"}><div><span className={"verified-kicker [color:#8fc7ff] [font-size:9px] [font-weight:850] [letter-spacing:.17em]"}>LIVE PREVIEW</span><h2>Your premium member card</h2></div><span className={"verified-live-indicator [display:inline-flex] [align-items:center] [gap:6px] [color:#aebbd0] [font-size:8px] [font-weight:800] [letter-spacing:.12em] [&_i]:[width:6px] [&_i]:[height:6px] [&_i]:[border-radius:50%] [&_i]:[background:#65dc9d] [&_i]:[box-shadow:0_0_9px_rgba(101,220,157,.7)]"}><i /> LIVE</span></div>
              <div className={(`verified-card-motion [border-radius:inherit]${previewAnimating ? "is-changing animate-verified-refresh" : ""}`)}><VerifiedMemberCard card={card} qrImage={qrImage} /></div>
              {!generated ? <p className={"verified-preview-hint [margin:14px_0_0] [color:#99a8c1] [font-size:10px] [line-height:1.6]"}>Fill in your details to see your card update live.</p> : null}
            </div>
          </section>

          <section className={"verified-form-panel [grid-area:form] [grid-row:1_/_span_2] [min-width:0] [padding:clamp(20px,3vw,30px)] [border:1px_solid_rgba(255,255,255,.09)] [border-radius:19px] [background:linear-gradient(145deg,rgba(19,29,49,.96),rgba(12,20,36,.98))] [box-shadow:0_18px_55px_rgba(0,0,0,.17)] max-[767px]:[grid-row:auto] max-[767px]:[padding:17px] max-[767px]:[border-radius:16px]"} aria-labelledby="verified-form-title">
            <div className={"verified-panel-title [margin-bottom:22px] [&_h2]:[margin:6px_0_4px] [&_h2]:[font-family:'Clash_Display',sans-serif] [&_h2]:[font-size:20px] [&_p]:[margin:0] [&_p]:[color:#9eabc1] [&_p]:[font-size:11px] max-[767px]:[margin-bottom:18px]"}><span className={"verified-kicker [color:#8fc7ff] [font-size:9px] [font-weight:850] [letter-spacing:.17em]"}>MEMBER DETAILS</span><h2 id="verified-form-title">Personalize your card</h2><p>Your card preview updates as you make changes.</p></div>
            <form className={"verified-member-form [display:grid] [gap:18px] max-[767px]:[gap:16px]"} onSubmit={(event) => { event.preventDefault(); void generateCard(); }}>
              <fieldset className={"verified-fieldset [&_legend_>_span]:[color:#91c9ff] [min-width:0] [margin:0] [padding:0] [border:0] [&_legend]:[margin-bottom:10px] [&_legend]:[color:#eaf0fb] [&_legend]:[font-size:11px] [&_legend]:[font-weight:750] max-[767px]:[&_legend]:[margin-bottom:9px] max-[767px]:[&_legend]:[font-size:13px]"}><legend>Member photo <span aria-hidden="true">*</span></legend>
                <label className={"verified-photo-drop [display:flex] [min-height:102px] [align-items:center] [gap:13px] [padding:12px] [border:1px_dashed_rgba(135,194,255,.42)] [border-radius:12px] [background:linear-gradient(120deg,rgba(42,119,206,.12),rgba(255,255,255,.025))] [cursor:pointer] [&_>_input]:[position:absolute] [&_>_input]:[width:1px] [&_>_input]:[height:1px] [&_>_input]:[overflow:hidden] [&_>_input]:[clip-path:inset(50%)] [&:focus-within]:[outline:2px_solid_#78baff] [&:focus-within]:[outline-offset:3px] max-[767px]:[display:flex] max-[767px]:[width:100%] max-[767px]:[min-height:120px] max-[767px]:[align-items:center] max-[767px]:[justify-content:center] max-[767px]:[gap:15px] max-[767px]:[padding:13px] max-[767px]:[border:1px_dashed_rgba(135,194,255,.55)] max-[767px]:[border-radius:13px] max-[767px]:[background:linear-gradient(120deg,rgba(42,119,206,.15),rgba(255,255,255,.025))] max-[767px]:[cursor:pointer] max-[767px]:[&_>_input]:[position:absolute] max-[767px]:[&_>_input]:[width:1px] max-[767px]:[&_>_input]:[height:1px] max-[767px]:[&_>_input]:[overflow:hidden] max-[767px]:[&_>_input]:[clip-path:inset(50%)] max-[767px]:[&:focus-within]:[outline:2px_solid_#78baff] max-[767px]:[&:focus-within]:[outline-offset:3px]"}><input type="file" accept="image/*" capture="user" onChange={(event) => void selectPhoto(event)} /><span className={"verified-upload-preview [display:grid] [width:76px] [height:76px] [flex:0_0_76px] [overflow:hidden] [place-items:center] [border:2px_solid_#98caff] [border-radius:50%] [background:linear-gradient(140deg,#1b3559,#16253c)] [color:#9eabc1] [font-size:10px] [&_img]:[width:100%] [&_img]:[height:100%] [&_img]:[object-fit:cover] max-[767px]:[width:82px] max-[767px]:[height:82px] max-[767px]:[flex:0_0_82px] max-[767px]:[border-width:3px] max-[767px]:[font-size:11px]"}>{photoUrl ? <img src={photoUrl} alt="" /> : <span aria-hidden="true">Photo</span>}</span><span className={"verified-upload-copy [display:grid] [min-width:0] [gap:5px] [color:#eef6ff] [&_strong]:[font-size:11px] [&_strong]:[line-height:1.45] [&_small]:[color:#aab7cc] [&_small]:[font-size:9px] [&_small]:[line-height:1.5] max-[767px]:[display:grid] max-[767px]:[min-width:0] max-[767px]:[gap:7px] max-[767px]:[color:#eef6ff] max-[767px]:[&_strong]:[font-size:13px] max-[767px]:[&_strong]:[line-height:1.4] max-[767px]:[&_small]:[color:#aab7cc] max-[767px]:[&_small]:[font-size:10px] max-[767px]:[&_small]:[line-height:1.5]"}><strong>📷 Tap to Upload Photo</strong><small>Take a photo or choose one from your phone</small></span></label>
                {profilePhoto ? <button type="button" className={"verified-profile-photo-button [display:inline-flex] [min-height:35px] [align-items:center] [justify-content:center] [padding:0_11px] [border:1px_solid_rgba(116,177,255,.35)] [border-radius:8px] [background:rgba(255,255,255,.04)] [color:#c6d2e6] [font-size:10px] [font-weight:750] [cursor:pointer] [&:hover]:[outline:2px_solid_#78baff] [&:hover]:[outline-offset:2px] [border-color:rgba(255,255,255,.16)] max-[767px]:[width:100%] max-[767px]:[min-height:48px] max-[767px]:[margin-top:9px] max-[767px]:[font-size:13px]"} onClick={useProfilePhoto}>Use My Profile Photo</button> : null}
              </fieldset>
              <label className={"verified-field [display:grid] [gap:7px] [color:#eaf0fb] [font-size:11px] [font-weight:750] [&_>_span[aria-hidden=\"true\"]]:[color:#91c9ff] [&_input:not([type=\"file\"])]:[width:100%] [&_input:not([type=\"file\"])]:[min-height:45px] [&_input:not([type=\"file\"])]:[padding:0_12px] [&_input:not([type=\"file\"])]:[border:1px_solid_rgba(161,183,221,.3)] [&_input:not([type=\"file\"])]:[border-radius:9px] [&_input:not([type=\"file\"])]:[outline:0] [&_input:not([type=\"file\"])]:[background:#edf2fa] [&_input:not([type=\"file\"])]:[color:#1d2940] [&_input:not([type=\"file\"])]:[font-size:13px] [&_input:not([type=\"file\"])]:[color-scheme:light] [&_select]:[width:100%] [&_select]:[min-height:45px] [&_select]:[padding:0_12px] [&_select]:[border:1px_solid_rgba(161,183,221,.3)] [&_select]:[border-radius:9px] [&_select]:[outline:0] [&_select]:[background:#edf2fa] [&_select]:[color:#1d2940] [&_select]:[font-size:13px] [&_select]:[color-scheme:light] [&_input:focus-visible]:[border-color:#58a7ff] [&_input:focus-visible]:[box-shadow:0_0_0_3px_rgba(76,157,255,.18)] [&_select:focus-visible]:[border-color:#58a7ff] [&_select:focus-visible]:[box-shadow:0_0_0_3px_rgba(76,157,255,.18)] [&_small]:[color:#93a1b8] [&_small]:[font-size:10px] [&_small]:[font-weight:450] max-[767px]:[gap:8px] max-[767px]:[font-size:13px] max-[767px]:[&_input:not([type=\"file\"])]:[min-height:50px] max-[767px]:[&_input:not([type=\"file\"])]:[padding-inline:12px] max-[767px]:[&_input:not([type=\"file\"])]:[font-size:16px] max-[767px]:[&_select]:[min-height:50px] max-[767px]:[&_select]:[padding-inline:12px] max-[767px]:[&_select]:[font-size:16px] max-[767px]:[&_small]:[font-size:11px]"}>Full Name <span aria-hidden="true">*</span><input required minLength={2} maxLength={80} value={fullName} onChange={(event) => { setFullName(event.target.value); setGenerated(false); }} placeholder="Enter your full name" /></label>
              <label className={"verified-field [display:grid] [gap:7px] [color:#eaf0fb] [font-size:11px] [font-weight:750] [&_>_span[aria-hidden=\"true\"]]:[color:#91c9ff] [&_input:not([type=\"file\"])]:[width:100%] [&_input:not([type=\"file\"])]:[min-height:45px] [&_input:not([type=\"file\"])]:[padding:0_12px] [&_input:not([type=\"file\"])]:[border:1px_solid_rgba(161,183,221,.3)] [&_input:not([type=\"file\"])]:[border-radius:9px] [&_input:not([type=\"file\"])]:[outline:0] [&_input:not([type=\"file\"])]:[background:#edf2fa] [&_input:not([type=\"file\"])]:[color:#1d2940] [&_input:not([type=\"file\"])]:[font-size:13px] [&_input:not([type=\"file\"])]:[color-scheme:light] [&_select]:[width:100%] [&_select]:[min-height:45px] [&_select]:[padding:0_12px] [&_select]:[border:1px_solid_rgba(161,183,221,.3)] [&_select]:[border-radius:9px] [&_select]:[outline:0] [&_select]:[background:#edf2fa] [&_select]:[color:#1d2940] [&_select]:[font-size:13px] [&_select]:[color-scheme:light] [&_input:focus-visible]:[border-color:#58a7ff] [&_input:focus-visible]:[box-shadow:0_0_0_3px_rgba(76,157,255,.18)] [&_select:focus-visible]:[border-color:#58a7ff] [&_select:focus-visible]:[box-shadow:0_0_0_3px_rgba(76,157,255,.18)] [&_small]:[color:#93a1b8] [&_small]:[font-size:10px] [&_small]:[font-weight:450] max-[767px]:[gap:8px] max-[767px]:[font-size:13px] max-[767px]:[&_input:not([type=\"file\"])]:[min-height:50px] max-[767px]:[&_input:not([type=\"file\"])]:[padding-inline:12px] max-[767px]:[&_input:not([type=\"file\"])]:[font-size:16px] max-[767px]:[&_select]:[min-height:50px] max-[767px]:[&_select]:[padding-inline:12px] max-[767px]:[&_select]:[font-size:16px] max-[767px]:[&_small]:[font-size:11px]"}>Hobby <span aria-hidden="true">*</span><select required value={hobby} onChange={(event) => { setHobby(event.target.value); setGenerated(false); }}><option value="">Choose a hobby</option>{hobby && !hobbyOptions.includes(hobby) ? <option>{hobby}</option> : null}{hobbyOptions.map((item) => <option key={item}>{item}</option>)}</select></label>
              <label className={"verified-field [display:grid] [gap:7px] [color:#eaf0fb] [font-size:11px] [font-weight:750] [&_>_span[aria-hidden=\"true\"]]:[color:#91c9ff] [&_input:not([type=\"file\"])]:[width:100%] [&_input:not([type=\"file\"])]:[min-height:45px] [&_input:not([type=\"file\"])]:[padding:0_12px] [&_input:not([type=\"file\"])]:[border:1px_solid_rgba(161,183,221,.3)] [&_input:not([type=\"file\"])]:[border-radius:9px] [&_input:not([type=\"file\"])]:[outline:0] [&_input:not([type=\"file\"])]:[background:#edf2fa] [&_input:not([type=\"file\"])]:[color:#1d2940] [&_input:not([type=\"file\"])]:[font-size:13px] [&_input:not([type=\"file\"])]:[color-scheme:light] [&_select]:[width:100%] [&_select]:[min-height:45px] [&_select]:[padding:0_12px] [&_select]:[border:1px_solid_rgba(161,183,221,.3)] [&_select]:[border-radius:9px] [&_select]:[outline:0] [&_select]:[background:#edf2fa] [&_select]:[color:#1d2940] [&_select]:[font-size:13px] [&_select]:[color-scheme:light] [&_input:focus-visible]:[border-color:#58a7ff] [&_input:focus-visible]:[box-shadow:0_0_0_3px_rgba(76,157,255,.18)] [&_select:focus-visible]:[border-color:#58a7ff] [&_select:focus-visible]:[box-shadow:0_0_0_3px_rgba(76,157,255,.18)] [&_small]:[color:#93a1b8] [&_small]:[font-size:10px] [&_small]:[font-weight:450] max-[767px]:[gap:8px] max-[767px]:[font-size:13px] max-[767px]:[&_input:not([type=\"file\"])]:[min-height:50px] max-[767px]:[&_input:not([type=\"file\"])]:[padding-inline:12px] max-[767px]:[&_input:not([type=\"file\"])]:[font-size:16px] max-[767px]:[&_select]:[min-height:50px] max-[767px]:[&_select]:[padding-inline:12px] max-[767px]:[&_select]:[font-size:16px] max-[767px]:[&_small]:[font-size:11px]"}>Learner Level <select value={level} onChange={(event) => { setLevel(event.target.value); setGenerated(false); }}>{levels.map((item) => <option key={item}>{item}</option>)}</select></label>
              <label className={"verified-field [display:grid] [gap:7px] [color:#eaf0fb] [font-size:11px] [font-weight:750] [&_>_span[aria-hidden=\"true\"]]:[color:#91c9ff] [&_input:not([type=\"file\"])]:[width:100%] [&_input:not([type=\"file\"])]:[min-height:45px] [&_input:not([type=\"file\"])]:[padding:0_12px] [&_input:not([type=\"file\"])]:[border:1px_solid_rgba(161,183,221,.3)] [&_input:not([type=\"file\"])]:[border-radius:9px] [&_input:not([type=\"file\"])]:[outline:0] [&_input:not([type=\"file\"])]:[background:#edf2fa] [&_input:not([type=\"file\"])]:[color:#1d2940] [&_input:not([type=\"file\"])]:[font-size:13px] [&_input:not([type=\"file\"])]:[color-scheme:light] [&_select]:[width:100%] [&_select]:[min-height:45px] [&_select]:[padding:0_12px] [&_select]:[border:1px_solid_rgba(161,183,221,.3)] [&_select]:[border-radius:9px] [&_select]:[outline:0] [&_select]:[background:#edf2fa] [&_select]:[color:#1d2940] [&_select]:[font-size:13px] [&_select]:[color-scheme:light] [&_input:focus-visible]:[border-color:#58a7ff] [&_input:focus-visible]:[box-shadow:0_0_0_3px_rgba(76,157,255,.18)] [&_select:focus-visible]:[border-color:#58a7ff] [&_select:focus-visible]:[box-shadow:0_0_0_3px_rgba(76,157,255,.18)] [&_small]:[color:#93a1b8] [&_small]:[font-size:10px] [&_small]:[font-weight:450] max-[767px]:[gap:8px] max-[767px]:[font-size:13px] max-[767px]:[&_input:not([type=\"file\"])]:[min-height:50px] max-[767px]:[&_input:not([type=\"file\"])]:[padding-inline:12px] max-[767px]:[&_input:not([type=\"file\"])]:[font-size:16px] max-[767px]:[&_select]:[min-height:50px] max-[767px]:[&_select]:[padding-inline:12px] max-[767px]:[&_select]:[font-size:16px] max-[767px]:[&_small]:[font-size:11px]"}>Motto / Quote <span className={"verified-optional [margin-left:5px] [color:#94a2ba] [font-size:9px] [font-weight:500]"}>Optional</span><input maxLength={35} value={motto} onChange={(event) => { setMotto(event.target.value); setGenerated(false); }} placeholder="Learn. Create. Develop." /><small>{motto.length}/35 characters</small></label>
              <fieldset className={"verified-fieldset [&_legend_>_span]:[color:#91c9ff] [min-width:0] [margin:0] [padding:0] [border:0] [&_legend]:[margin-bottom:10px] [&_legend]:[color:#eaf0fb] [&_legend]:[font-size:11px] [&_legend]:[font-weight:750] max-[767px]:[&_legend]:[margin-bottom:9px] max-[767px]:[&_legend]:[font-size:13px]"}><legend>Choose card colour</legend><div className={"verified-theme-list [display:grid] [grid-template-columns:repeat(5,minmax(0,1fr))] [gap:8px] max-[767px]:[grid-template-columns:repeat(5,minmax(0,1fr))] max-[767px]:[gap:5px]"}>{VERIFIED_MEMBER_THEMES.map((theme) => <button key={theme.id} className={(`verified-theme-option theme-chip- [display:grid] [justify-items:center] [gap:7px] [padding:8px_4px] [border:1px_solid_transparent] [border-radius:10px] [background:transparent] [color:#aab7cc] [font-size:8px] [line-height:1.35] [text-align:center] [cursor:pointer] [&:hover]:[border-color:rgba(130,190,255,.55)] [&:hover]:[background:rgba(72,145,255,.09)] [&:hover]:[color:#f2f7ff] max-[767px]:[min-width:0] max-[767px]:[min-height:58px] max-[767px]:[justify-items:center] max-[767px]:[padding:4px_0] max-[767px]:[&_>_span:last-child]:[display:none]${theme.id}${cardColour === theme.id ? "selected [border-color:rgba(130,190,255,.55)] [background:rgba(72,145,255,.09)] [color:#f2f7ff]" : ""}`)} type="button" aria-label={theme.name} aria-pressed={cardColour === theme.id} onClick={() => { setCardColour(theme.id); setGenerated(false); }}><span className={"verified-theme-swatch [width:29px] [height:29px] [border:2px_solid_rgba(255,255,255,.75)] [border-radius:50%] [box-shadow:0_3px_12px_rgba(0,0,0,.3)] [background:linear-gradient(135deg,#f07838,#b93369)] [outline:2px_solid_#8dc7ff] [outline-offset:2px] [&_i]:[color:#fff] [&_i]:[font-size:12px] [&_i]:[font-style:normal] [&_i]:[font-weight:900] [&_i]:[text-shadow:0_1px_4px_rgba(0,0,0,.8)] max-[767px]:[position:relative] max-[767px]:[display:grid] max-[767px]:[width:48px] max-[767px]:[height:48px] max-[767px]:[max-width:100%] max-[767px]:[place-items:center] max-[767px]:[border:4px_solid_#fff] max-[767px]:[outline:0] max-[767px]:[box-shadow:0_0_0_2px_rgba(107,179,255,.85),0_4px_13px_rgba(0,0,0,.3)] max-[767px]:[&_i]:[color:#fff] max-[767px]:[&_i]:[font-size:20px] max-[767px]:[&_i]:[font-style:normal] max-[767px]:[&_i]:[font-weight:900] max-[767px]:[&_i]:[text-shadow:0_1px_4px_rgba(0,0,0,.8)]"}>{cardColour === theme.id ? <i aria-hidden="true">✓</i> : null}</span><span>{theme.name}</span></button>)}</div><p className={"verified-selected-theme [margin:8px_0_0] [color:#9eabc1] [font-size:10px] [&_strong]:[color:#d7eaff] max-[767px]:[margin-top:11px] max-[767px]:[font-size:12px] max-[767px]:[text-align:center] max-[767px]:[&_strong]:[color:#e5f2ff]"}><strong>{themeName} - Selected</strong></p></fieldset>
              {error ? <p className={"verified-error [margin:0] [color:#ffabb5] [font-size:11px] [line-height:1.55] [grid-column:1/-1] max-[767px]:[grid-column:auto]"} role="alert">{error}</p> : null}
              <button className={"verified-primary-button verified-generate-button [display:inline-flex] [min-height:46px] [align-items:center] [justify-content:center] [gap:9px] [padding:0_15px] [border:1px_solid_rgba(145,201,255,.48)] [border-radius:10px] [background:linear-gradient(115deg,#287be8,#4367ee)] [box-shadow:0_8px_24px_rgba(42,104,225,.2)] [color:#fff] [font-size:10px] [font-weight:800] [cursor:pointer] [transition:transform_.18s,filter_.18s] [&:hover:not(:disabled)]:[transform:translateY(-1px)] [&:hover:not(:disabled)]:[filter:brightness(1.08)] [&:disabled]:[opacity:.58] [&:disabled]:[cursor:wait] [width:100%] [margin-top:1px] max-[767px]:[min-height:54px] max-[767px]:[font-size:16px] max-[767px]:[width:100%] max-[767px]:[padding-inline:13px]"} type="submit" disabled={saving || loading}>{saving ? "Saving your card…" : generated ? "✨ Update My Verified Card" : "✨ Generate My Verified Card"}</button>
            </form>
          </section>
          {generated ? <section className={"verified-card-actions [display:grid] [grid-area:actions] [grid-template-columns:1fr_1fr] [align-self:start] [gap:9px] [margin-top:0] [&_>_:first-child]:[grid-column:1/-1] max-[767px]:[grid-template-columns:1fr] max-[767px]:[gap:12px] max-[767px]:[margin:0] max-[767px]:[&_>_:first-child]:[grid-column:auto]"} aria-label="Card actions"><button type="button" className={"verified-primary-button [display:inline-flex] [min-height:46px] [align-items:center] [justify-content:center] [gap:9px] [padding:0_15px] [border:1px_solid_rgba(145,201,255,.48)] [border-radius:10px] [background:linear-gradient(115deg,#287be8,#4367ee)] [box-shadow:0_8px_24px_rgba(42,104,225,.2)] [color:#fff] [font-size:10px] [font-weight:800] [cursor:pointer] [transition:transform_.18s,filter_.18s] [&:hover:not(:disabled)]:[transform:translateY(-1px)] [&:hover:not(:disabled)]:[filter:brightness(1.08)] [&:disabled]:[opacity:.58] [&:disabled]:[cursor:wait] [width:100%] [margin-top:7px] max-[767px]:[min-height:52px] max-[767px]:[font-size:16px] max-[767px]:[width:100%] max-[767px]:[padding-inline:13px]"} onClick={() => void downloadCard()} disabled={!qrImage}>⬇️ Download Verified Card (PNG)</button><a className={"verified-secondary-button [display:inline-flex] [min-height:46px] [align-items:center] [justify-content:center] [gap:9px] [padding:0_15px] [border:1px_solid_rgba(255,255,255,.14)] [border-radius:10px] [background:rgba(255,255,255,.055)] [box-shadow:none] [color:#dce6f6] [font-size:10px] [font-weight:800] [cursor:pointer] [transition:transform_.18s,filter_.18s] [width:100%] [&:hover]:[border-color:rgba(127,187,255,.42)] [&:hover]:[background:rgba(79,145,225,.13)] max-[767px]:[min-height:52px] max-[767px]:[font-size:16px] max-[767px]:[width:100%] max-[767px]:[padding-inline:13px]"} href={`https://wa.me/?text=${encodeURIComponent(`I am now a Verified Member of Ceo Jack Learning Hub ✅ Get your card: ${signInUrl}`)}`} target="_blank" rel="noreferrer">📤 Share on WhatsApp</a><button type="button" className={"verified-secondary-button [display:inline-flex] [min-height:46px] [align-items:center] [justify-content:center] [gap:9px] [padding:0_15px] [border:1px_solid_rgba(255,255,255,.14)] [border-radius:10px] [background:rgba(255,255,255,.055)] [box-shadow:none] [color:#dce6f6] [font-size:10px] [font-weight:800] [cursor:pointer] [transition:transform_.18s,filter_.18s] [width:100%] [&:hover]:[border-color:rgba(127,187,255,.42)] [&:hover]:[background:rgba(79,145,225,.13)] max-[767px]:[min-height:52px] max-[767px]:[font-size:16px] max-[767px]:[width:100%] max-[767px]:[padding-inline:13px]"} onClick={() => void copyCardLink()}>🔗 Copy Card Link</button><button type="button" className={"verified-secondary-button [display:inline-flex] [min-height:46px] [align-items:center] [justify-content:center] [gap:9px] [padding:0_15px] [border:1px_solid_rgba(255,255,255,.14)] [border-radius:10px] [background:rgba(255,255,255,.055)] [box-shadow:none] [color:#dce6f6] [font-size:10px] [font-weight:800] [cursor:pointer] [transition:transform_.18s,filter_.18s] [width:100%] [&:hover]:[border-color:rgba(127,187,255,.42)] [&:hover]:[background:rgba(79,145,225,.13)] max-[767px]:[min-height:52px] max-[767px]:[font-size:16px] max-[767px]:[width:100%] max-[767px]:[padding-inline:13px]"} onClick={() => { setGenerated(false); setStatus("You can edit your card details, then generate it again."); }}>✏️ Edit Card</button>{downloadFallback ? <div className={"verified-download-fallback [display:grid] [grid-column:1/-1] [gap:8px] [padding:12px] [border:1px_solid_rgba(255,255,255,.1)] [border-radius:10px] [background:rgba(255,255,255,.04)] [&_p]:[margin:0] [&_p]:[color:#c3cee0] [&_p]:[font-size:11px] [&_p]:[line-height:1.5] max-[767px]:[gap:10px] max-[767px]:[padding:14px] max-[767px]:[&_p]:[font-size:13px]"}><p>Download didn’t work? Long-press the PNG below to save it, or copy the card link.</p>{downloadFallbackUrl ? <img className={"verified-download-fallback-image [display:block] [width:min(100%,480px)] [height:auto] [justify-self:center] [border:1px_solid_rgba(255,255,255,.18)] [border-radius:12px]"} src={downloadFallbackUrl} alt="Verified member card PNG. Long-press to save." /> : null}<button type="button" className={"verified-secondary-button [display:inline-flex] [min-height:46px] [align-items:center] [justify-content:center] [gap:9px] [padding:0_15px] [border:1px_solid_rgba(255,255,255,.14)] [border-radius:10px] [background:rgba(255,255,255,.055)] [box-shadow:none] [color:#dce6f6] [font-size:10px] [font-weight:800] [cursor:pointer] [transition:transform_.18s,filter_.18s] [width:100%] [&:hover]:[border-color:rgba(127,187,255,.42)] [&:hover]:[background:rgba(79,145,225,.13)] max-[767px]:[min-height:52px] max-[767px]:[font-size:16px] max-[767px]:[width:100%] max-[767px]:[padding-inline:13px]"} onClick={() => void copyCardLink()}>Copy Card Link</button></div> : null}{status ? <p className={"verified-success [margin:12px_0_0] [color:#8fe0b6] [font-size:11px] max-[767px]:[font-size:13px]"} role="status">{status}</p> : null}</section> : null}
        </div> : null}
      </div>
    </main>
  );
}
