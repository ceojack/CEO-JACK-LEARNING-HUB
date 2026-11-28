"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { SiteFooter } from "@/src/components/footer";
import { SiteLogoMark } from "@/src/components/site-logo-mark";
import { UserAvatar } from "@/src/components/user-avatar";
import { createClient } from "@/src/utils/supabase/client";
import { isSupabaseConfigured } from "@/src/utils/supabase/config";
import { switchToGoogleAccount } from "@/src/utils/supabase/google-account";
import { AccountSecurity } from "@/src/components/account-security";

const learningLevels = ["Primary", "Secondary", "Higher Education", "Independent Learner"];
const ageGroups = ["Under 13", "13 - 15", "16 - 18", "19 - 24", "25+"];
const interestOptions = ["School & Education", "Web Development", "Programming", "AI", "Business", "Design"];
const goalOptions = ["Improve school results", "Learn digital skills", "Build projects", "Start a small idea"];
type LearnerProfile = { level?: string; learningLevel?: string; hobby?: string; ageGroup?: string; interests?: string[]; goals?: string[] };
type AccountUser = { email?: string; fullName?: string; avatarUrl?: string };

export default function ProfilePage() {
  const [user, setUser] = useState<AccountUser | null>(null);
  const [fullName, setFullName] = useState("");
  const [hobby, setHobby] = useState("");
  const [level, setLevel] = useState("");
  const [ageGroup, setAgeGroup] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [statusType, setStatusType] = useState<"success" | "error" | "">("");
  const [passwordHelpOpen, setPasswordHelpOpen] = useState(false);
  const [passwordHelpBusy, setPasswordHelpBusy] = useState(false);
  const [passwordHelpStatus, setPasswordHelpStatus] = useState("");
  const [passwordHelpError, setPasswordHelpError] = useState(false);
  const [switchingAccount, setSwitchingAccount] = useState(false);
  const [hasMemberCard, setHasMemberCard] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      try {
        if (!isSupabaseConfigured()) {
          const localName = window.localStorage.getItem("ceoJackDisplayName") ?? "";
          const savedProfile = window.localStorage.getItem("ceoJackOnboarding");
          if (cancelled) return;
          setFullName(localName);
          setUser(localName ? { fullName: localName } : null);
          if (savedProfile) {
            const localProfile = JSON.parse(savedProfile) as LearnerProfile;
            setHobby(localProfile.hobby ?? "");
            setLevel(localProfile.level ?? localProfile.learningLevel ?? "");
            setAgeGroup(localProfile.ageGroup ?? "");
            setSelectedInterests(localProfile.interests ?? []);
            setSelectedGoals(localProfile.goals ?? []);
          }
          return;
        }

        const { data: authData, error: authError } = await createClient().auth.getSession();
        if (authError) throw authError;
        const session = authData.session;
        if (session) {
          void fetch("/api/verified-member", { headers: { Authorization: `Bearer ${session.access_token}` }, cache: "no-store" })
            .then(async (response) => response.ok ? response.json() as Promise<{ card?: { memberId?: string } | null }> : null)
            .then((result) => { if (!cancelled) setHasMemberCard(Boolean(result?.card?.memberId)); })
            .catch((verifiedError) => console.error("Could not check verified member status:", verifiedError));
        }
        const response = await fetch("/api/profile", { cache: "no-store" });
        const result = await response.json() as { user?: AccountUser; profile?: LearnerProfile | null; error?: string };
        if (!response.ok) throw new Error(result.error ?? "Your account profile could not be loaded.");
        if (cancelled) return;
        setUser({ ...result.user, email: authData.session?.user.email ?? result.user?.email });
        setFullName(result.user?.fullName ?? "");
        const savedProfile = result.profile ?? null;
        setHobby(savedProfile?.hobby ?? "");
        setLevel(savedProfile?.level ?? savedProfile?.learningLevel ?? "");
        setAgeGroup(savedProfile?.ageGroup ?? "");
        setSelectedInterests(savedProfile?.interests ?? []);
        setSelectedGoals(savedProfile?.goals ?? []);
      } catch (loadError) {
        if (!cancelled) setError(loadError instanceof Error ? loadError.message : "Your account profile could not be loaded.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadProfile();
    return () => { cancelled = true; };
  }, []);

  const displayName = user?.fullName?.trim() || "Learner profile";
  const hasLearnerProfile = Boolean(level && ageGroup && selectedInterests.length && selectedGoals.length);
  const completion = useMemo(() => {
    const completed = [Boolean(fullName.trim()), Boolean(hobby.trim()), Boolean(level), Boolean(ageGroup), Boolean(selectedInterests.length), Boolean(selectedGoals.length)].filter(Boolean).length;
    return { completed, total: 6, percent: Math.round((completed / 6) * 100) };
  }, [ageGroup, fullName, hobby, level, selectedGoals.length, selectedInterests.length]);

  async function saveProfile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = fullName.trim();
    if (name.length < 2 || name.length > 80) {
      setStatusType("error");
      setStatus("Enter a name between 2 and 80 characters.");
      return;
    }
    if (!level || !ageGroup || !selectedInterests.length || !selectedGoals.length) {
      setStatusType("error");
      setStatus("Choose a learning level, age group, at least one interest and at least one goal.");
      return;
    }

    setSaving(true);
    setStatusType("");
    setStatus("Saving your changes…");
    try {
      const updatedProfile = { displayName: name, hobby: hobby.trim(), level, ageGroup, interests: selectedInterests, goals: selectedGoals };
      if (isSupabaseConfigured()) {
        const { data: authData, error: authError } = await createClient().auth.getSession();
        if (authError) throw authError;
        const accessToken = authData.session?.access_token;
        const response = await fetch("/api/profile", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
          },
          body: JSON.stringify(updatedProfile),
        });
        const result = await response.json() as { profile?: LearnerProfile; error?: string; code?: string; details?: string; hint?: string; column?: string };
        if (!response.ok) {
          console.error("Shared profile save error:", result);
          throw new Error(result.error ?? "Your profile could not be saved.");
        }
        setUser((current) => ({ ...current, fullName: name }));
      } else {
        window.localStorage.setItem("ceoJackDisplayName", name);
        window.localStorage.setItem("ceoJackOnboarding", JSON.stringify(updatedProfile));
        setUser({ ...user, fullName: name });
      }
      setStatusType("success");
      setStatus("Your profile has been updated.");
    } catch (saveError) {
      setStatusType("error");
      setStatus(saveError instanceof Error ? saveError.message : "Your name could not be saved. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function sendPasswordHelp() {
    if (!user?.email) {
      setPasswordHelpError(true);
      setPasswordHelpStatus("Your sign-in email could not be found. Sign in again and retry.");
      return;
    }
    setPasswordHelpBusy(true);
    setPasswordHelpError(false);
    setPasswordHelpStatus("Sending a reset link…");
    try {
      const { error: resetError } = await createClient().auth.resetPasswordForEmail(user.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (resetError) throw resetError;
      setPasswordHelpStatus("Reset link sent! Check your email.");
    } catch (resetError) {
      console.error("Could not send password reset link:", resetError);
      setPasswordHelpError(true);
      setPasswordHelpStatus(resetError instanceof Error ? resetError.message : "The reset link could not be sent. Please try again.");
    } finally {
      setPasswordHelpBusy(false);
    }
  }

  async function switchAccount() {
    setSwitchingAccount(true);
    try {
      await switchToGoogleAccount("/dashboard");
    } catch (signOutError) {
      console.error("Could not start Google account switching:", signOutError);
      setStatusType("error");
      setStatus("Google account selection could not start. Please try again.");
      setSwitchingAccount(false);
    }
  }

  return (
    <div className={"profile-page [min-height:100vh] [display:flex] [flex-direction:column] [color:#f5f7ff] [background:radial-gradient(ellipse_at_78%_-12%,_rgba(99,133,255,.14),_transparent_36%),_#080d1b] [font-family:'Satoshi',_sans-serif] [&_*]:[box-sizing:border-box] [&_a]:[color:inherit] [&_a]:[text-decoration:none]"}>
      <header className={"profile-topbar [position:sticky] [top:0] [z-index:20] [display:flex] [min-height:72px] [align-items:center] [justify-content:space-between] [gap:18px] [padding:0_clamp(18px,5vw,64px)] [border-bottom:1px_solid_rgba(255,255,255,.07)] [background:rgba(8,13,27,.9)] [backdrop-filter:blur(16px)] max-[560px]:[min-height:63px] max-[560px]:[padding-inline:16px]"}>
        <Link href="/dashboard" className={"profile-brand [display:flex] [align-items:center] [gap:11px] [&_>_span:last-child]:[display:grid] [&_>_span:last-child]:[gap:4px] [&_strong]:[font-family:'Clash_Display',sans-serif] [&_strong]:[font-size:12px] [&_strong]:[letter-spacing:.08em] [&_small]:[color:#8794ab] [&_small]:[font-size:8px] [&_small]:[font-weight:700] [&_small]:[letter-spacing:.18em]"} aria-label="Back to CEO JACK Learning Hub dashboard">
          <SiteLogoMark className={"profile-brand-mark [display:block] [width:40px] [height:40px] [flex:0_0_40px] [object-fit:cover] [border:1px_solid_rgba(255,255,255,.18)] [border-radius:12px]"} width={80} height={80} alt="CEO JACK Learning Hub logo" /><span><strong>CEO JACK</strong><small>LEARNING HUB</small></span>
        </Link>
        <Link href="/dashboard" className={"profile-back-link [display:inline-flex] [min-height:38px] [align-items:center] [gap:8px] [padding:0_12px] [border:1px_solid_rgba(255,255,255,.1)] [border-radius:9px] ![color:#c4cde0] [font-size:11px] [font-weight:650] [transition:border-color_.18s,background_.18s] [&:hover]:[border-color:rgba(155,123,255,.4)] [&:hover]:[background:rgba(155,123,255,.08)]"}><span aria-hidden="true">←</span> Back to dashboard</Link>
      </header>

      <main className={"profile-content [width:min(1160px,100%)] [margin:0_auto] [padding:28px_clamp(18px,4vw,48px)_46px] [flex:1] max-[560px]:[padding:20px_16px_34px]"}>
        <div className={"profile-breadcrumb [display:flex] [align-items:center] [gap:9px] [margin-bottom:20px] [color:#9ba9c2] [font-size:11px] [&_a]:[color:#c9d2e4] [&_span]:[color:#63708a]"}><Link href="/dashboard">Learning Space</Link><span>/</span> My profile</div>
        <div className={"profile-page-heading [display:flex] [align-items:flex-end] [justify-content:space-between] [gap:20px] [margin-bottom:22px] [&_h1]:[margin:6px_0_5px] [&_h1]:[font-family:'Clash_Display',sans-serif] [&_h1]:[font-size:clamp(28px,4vw,38px)] [&_h1]:[letter-spacing:-.04em] [&_p]:[margin:0] [&_p]:[color:#a4b0c6] [&_p]:[font-size:13px] [&_p]:[line-height:1.6] max-[560px]:[align-items:flex-start] max-[560px]:[flex-direction:column] max-[560px]:[gap:11px] max-[560px]:[&_p]:[font-size:12px]"}><div><span className={"profile-eyebrow [color:#b7a5ff] [font-size:9px] [font-weight:800] [letter-spacing:.15em]"}>ACCOUNT SETTINGS</span><h1>My profile</h1><p>Manage your account details and learning preferences in one place.</p></div><span className={"profile-private-note [display:inline-flex] [align-items:center] [gap:7px] [padding:8px_11px] [border:1px_solid_rgba(255,255,255,.08)] [border-radius:9px] [color:#9eabc1] [font-size:10px] [white-space:nowrap] [&_span]:[color:#a995ff] max-[560px]:[white-space:normal]"}><span aria-hidden="true">◈</span> Only you can see your account details</span></div>

        {error ? <p className={"profile-alert error [margin-bottom:15px] [padding:12px_14px] [border:1px_solid_rgba(255,145,163,.25)] [border-radius:10px] [background:rgba(255,105,125,.08)] [color:#ff9fac] [font-size:12px] ![color:#ff9fac]"} role="alert">{error}</p> : null}

        <section className={"profile-hero-card [display:grid] [gap:16px] [padding:22px] [border:1px_solid_rgba(155,123,255,.2)] [border-radius:18px] [background:radial-gradient(ellipse_at_90%_0%,rgba(115,101,235,.16),transparent_43%),linear-gradient(115deg,#141d33,#111a2d)] [box-shadow:0_14px_38px_rgba(0,0,0,.15)] max-[560px]:[gap:13px] max-[560px]:[padding:16px]"} aria-label="Account overview">
          <div className={"profile-hero-main [display:flex] [min-width:0] [align-items:center] [gap:18px] max-[560px]:[align-items:flex-start] max-[560px]:[flex-wrap:wrap] max-[560px]:[gap:13px]"}>
            <Link href="/profile" aria-label="Open your profile"><UserAvatar src={user?.avatarUrl} className={"profile-avatar [display:grid] [width:70px] [height:70px] [flex:0_0_70px] [overflow:hidden] [place-items:center] [border:2px_solid_rgba(225,218,255,.45)] [border-radius:22px] [background:linear-gradient(145deg,#718fff,#9b7bff)] [box-shadow:0_10px_28px_rgba(99,117,255,.25)] [color:#fff] [font-family:'Clash_Display',sans-serif] [font-size:22px] [font-weight:700] [&_img]:[width:100%] [&_img]:[height:100%] [&_img]:[object-fit:cover] [&_svg]:[width:55%] [&_svg]:[height:55%] [&_svg]:[fill:none] [&_svg]:[stroke:#fff] [&_svg]:[stroke-linecap:round] [&_svg]:[stroke-linejoin:round] [&_svg]:[stroke-width:1.8] max-[560px]:[width:56px] max-[560px]:[height:56px] max-[560px]:[flex-basis:56px] max-[560px]:[border-radius:17px] max-[560px]:[font-size:18px]"} /></Link>
            <div className={"profile-hero-copy [min-width:0] [flex:1] [&_h2]:[overflow-wrap:anywhere] [&_h2]:[margin:5px_0_3px] [&_h2]:[font-family:'Clash_Display',sans-serif] [&_h2]:[font-size:22px] [&_p]:[overflow-wrap:anywhere] [&_p]:[margin:0] [&_p]:[color:#aab6ca] [&_p]:[font-size:12px] max-[560px]:[flex-basis:calc(100%_-_72px)] max-[560px]:[padding-top:3px] max-[560px]:[&_h2]:[font-size:18px] max-[560px]:[&_p]:[font-size:10px]"}><span className={"profile-member-label [display:inline-flex] [align-items:center] [gap:7px] [color:#c1b5ff] [font-size:8px] [font-weight:800] [letter-spacing:.14em] [&_i]:[width:6px] [&_i]:[height:6px] [&_i]:[border-radius:50%] [&_i]:[background:#77d8a8] [&_i]:[box-shadow:0_0_10px_rgba(119,216,168,.55)]"}><i /> LEARNER ACCOUNT</span><h2>{loading ? "Loading your profile…" : displayName}</h2><p>Your shared Learning Hub and JACK AI profile.</p></div>
            <div className={"profile-hero-actions [display:grid] [justify-items:end] [gap:12px] [&_>_a]:[display:inline-flex] [&_>_a]:[min-height:36px] [&_>_a]:[align-items:center] [&_>_a]:[gap:8px] [&_>_a]:[padding:0_11px] [&_>_a]:[border:1px_solid_rgba(155,123,255,.25)] [&_>_a]:[border-radius:9px] [&_>_a]:[background:rgba(155,123,255,.09)] ![&_>_a]:[color:#d6ccff] [&_>_a]:[font-size:10px] [&_>_a]:[font-weight:700] max-[560px]:[width:100%] max-[560px]:[grid-template-columns:1fr_auto] max-[560px]:[align-items:center] max-[560px]:[justify-items:start]"}><span className={"profile-account-status [&_i]:[width:6px] [&_i]:[height:6px] [&_i]:[border-radius:50%] [&_i]:[background:#77d8a8] [&_i]:[box-shadow:0_0_10px_rgba(119,216,168,.55)] [display:inline-flex] [align-items:center] [gap:7px] [color:#aab6ca] [font-size:10px]"}><i /> {loading ? "Loading account" : "Signed-in account"}</span><Link href="#personal-information">Edit details <span aria-hidden="true">↓</span></Link></div>
          </div>
          <div className={"profile-hero-action-row [display:grid] [grid-template-columns:repeat(2,minmax(190px,240px))] [gap:11px] max-[560px]:[grid-template-columns:1fr]"}>
            <button className={"profile-save-button profile-hero-save-button [display:inline-flex] [min-height:42px] [align-items:center] [justify-content:center] [gap:10px] [padding:0_14px] [border:1px_solid_rgba(155,173,255,.4)] [border-radius:9px] [background:linear-gradient(120deg,#6385ff,#8068eb)] [box-shadow:0_7px_20px_rgba(89,89,220,.18)] [color:white] [font-size:11px] [font-weight:750] [cursor:pointer] [transition:transform_.18s,filter_.18s] [&:hover:not(:disabled)]:[transform:translateY(-1px)] [&:hover:not(:disabled)]:[filter:brightness(1.08)] [&:disabled]:[opacity:.55] [&:disabled]:[cursor:wait] [width:100%] max-[560px]:[width:100%]"} type="submit" form="profile-information-form" disabled={loading || saving}>{saving ? "Saving…" : hasLearnerProfile ? "Save Changes" : "Save / Upload Profile"}<span aria-hidden="true">→</span></button>
            {isSupabaseConfigured() ? <button className={"profile-switch-account-button [width:100%] [min-height:42px] [display:inline-flex] [align-items:center] [justify-content:center] [gap:9px] [padding:0_14px] [border:1px_solid_#c7d0df] [border-radius:9px] [background:#f5f7ff] [color:#202b40] [font:inherit] [font-size:11px] [font-weight:750] [cursor:pointer] [transition:transform_.18s,background_.18s,border-color_.18s] [&:hover:not(:disabled)]:[transform:translateY(-1px)] [&:hover:not(:disabled)]:[border-color:#aeb9cc] [&:hover:not(:disabled)]:[background:#fff] [&:disabled]:[opacity:.65] [&:disabled]:[cursor:wait] [&_>_span:last-child]:[color:#63708a]"} type="button" onClick={() => void switchAccount()} disabled={switchingAccount}><span className={"profile-google-mark [display:inline-grid] [width:20px] [height:20px] [flex:0_0_20px] [place-items:center] [border:1px_solid_rgba(32,43,64,.12)] [border-radius:50%] [background:#fff] [color:#4285f4] [font-family:Arial,sans-serif] [font-size:13px] [font-weight:800]"} aria-hidden="true">G</span>{switchingAccount ? "Choose a Google account…" : "Switch Account"}<span aria-hidden="true">↗</span></button> : null}
            <Link className={"profile-verified-member-link [display:inline-flex] [min-height:46px] [grid-column:1/-1] [align-items:center] [justify-content:center] [gap:10px] [padding:0_15px] [border:1px_solid_rgba(146,202,255,.56)] [border-radius:10px] [background:linear-gradient(110deg,#2679e8,#435de9)] [box-shadow:0_8px_22px_rgba(50,111,222,.24)] ![color:#fff] [font-size:11px] [font-weight:850] [letter-spacing:.035em] [transition:transform_.18s,filter_.18s,box-shadow_.18s] [&:hover]:[transform:translateY(-1px)] [&:hover]:[filter:brightness(1.08)] [&:hover]:[box-shadow:0_11px_28px_rgba(50,111,222,.32)] [&_>_span:last-child]:[margin-left:auto] [&_>_span:last-child]:[font-size:16px]"} href="/verified-member"><span className={"profile-verified-member-tick [display:inline-grid] [width:21px] [height:21px] [flex:0_0_21px] [place-items:center] [border:1px_solid_rgba(255,255,255,.5)] [border-radius:50%] [background:rgba(255,255,255,.18)] [color:#fff] [font-size:13px] [font-weight:900]"} aria-hidden="true">✓</span>{hasMemberCard ? "VIEW MY MEMBER CARD" : "BECOME A VERIFIED MEMBER"}<span aria-hidden="true">→</span></Link>
          </div>
          <p className={(`profile-form-status profile-hero-status [min-height:18px] [margin:0] [color:#b6c1d6] [font-size:11px] [line-height:1.5] [&:empty]:[display:none]${statusType ? `${statusType}` : ""}`)} role="status" aria-live="polite">{status}</p>
        </section>

        <div className={"profile-columns [display:grid] [grid-template-columns:minmax(0,1.65fr)_minmax(260px,.85fr)] [align-items:start] [gap:16px] [margin-top:17px] max-[820px]:[grid-template-columns:minmax(0,1fr)]"}>
          <div className={"profile-primary-column [display:grid] [gap:16px] [min-width:0]"}>
            <section className={"profile-panel [min-width:0] [padding:21px] [border:1px_solid_rgba(255,255,255,.09)] [border-radius:15px] [background:linear-gradient(145deg,rgba(19,29,49,.96),rgba(15,23,40,.98))] max-[560px]:[padding:16px]"} id="personal-information" aria-labelledby="personal-information-title">
              <div className={"profile-panel-heading [display:flex] [align-items:flex-start] [justify-content:space-between] [gap:14px] [margin-bottom:19px] [&_h2]:[margin:5px_0_4px] [&_h2]:[font-family:'Clash_Display',sans-serif] [&_h2]:[font-size:18px] [&_h2]:[letter-spacing:-.02em] [&_p]:[margin:0] [&_p]:[color:#9eabc1] [&_p]:[font-size:11px] [&_p]:[line-height:1.6] max-[560px]:[&_h2]:[font-size:16px] max-[560px]:[&_p]:[font-size:10px]"}><div><span className={"profile-panel-kicker [color:#b7a5ff] [font-size:9px] [font-weight:800] [letter-spacing:.15em]"}>SHARED ACCOUNT</span><h2 id="personal-information-title">Your learning profile</h2><p>These preferences personalize your Learning Hub and JACK AI experience.</p></div><span className={"profile-panel-icon [display:grid] [width:38px] [height:38px] [flex:0_0_38px] [place-items:center] [border:1px_solid_rgba(155,123,255,.2)] [border-radius:11px] [background:rgba(155,123,255,.1)] [color:#c2b3ff] [font-size:20px]"} aria-hidden="true">◎</span></div>
              {!loading && !hasLearnerProfile ? <div className={"profile-upload-notice [display:grid] [gap:6px] [margin:0_0_17px] [padding:13px_14px] [border:1px_solid_rgba(155,123,255,.28)] [border-radius:10px] [background:rgba(155,123,255,.08)] [color:#d9d0ff] [&_strong]:[font-size:12px] [&_strong]:[line-height:1.5] [&_span]:[color:#aeb9cd] [&_span]:[font-size:10px] [&_span]:[line-height:1.6]"}><strong>Welcome! Upload your details to set up your learner account</strong><span>Complete the fields below, then save your profile to personalize the Learning Hub and JACK AI.</span></div> : null}
              <form id="profile-information-form" className={"profile-form [display:grid] [gap:16px]"} onSubmit={saveProfile}>
                <label className={"profile-field [display:grid] [gap:7px] [color:#eaf0fb] [font-size:12px] [font-weight:700] [&_input]:[width:100%] [&_input]:[min-height:47px] [&_input]:[padding:0_13px] [&_input]:[border:1px_solid_rgba(171,188,224,.38)] [&_input]:[border-radius:9px] [&_input]:[outline:0] [&_input]:[background:#edf2fa] [&_input]:[color:#1d2940] [&_input]:[font:inherit] [&_input]:[font-size:14px] [&_input]:[font-weight:500] [&_input]:[color-scheme:light] [&_input]:[transition:border-color_.18s,box-shadow_.18s] [&_input::placeholder]:[color:#69758b] [&_input:focus-visible]:[border-color:#927af0] [&_input:focus-visible]:[box-shadow:0_0_0_3px_rgba(155,123,255,.2)] [&_input:disabled]:[opacity:.72] [&_input:disabled]:[cursor:not-allowed] [&_select]:[width:100%] [&_select]:[min-height:47px] [&_select]:[padding:0_13px] [&_select]:[border:1px_solid_rgba(171,188,224,.38)] [&_select]:[border-radius:9px] [&_select]:[outline:0] [&_select]:[background:#edf2fa] [&_select]:[color:#1d2940] [&_select]:[font:inherit] [&_select]:[font-size:14px] [&_select]:[color-scheme:light] [&_select:focus-visible]:[border-color:#927af0] [&_select:focus-visible]:[box-shadow:0_0_0_3px_rgba(155,123,255,.2)] [&_select:disabled]:[opacity:.72] [&_select:disabled]:[cursor:not-allowed] [&_small]:[color:#a2aec2] [&_small]:[font-size:10px] [&_small]:[font-weight:400] [&_small]:[line-height:1.5]"} htmlFor="profile-full-name"><span>Full name</span><input id="profile-full-name" name="fullName" autoComplete="name" maxLength={80} value={fullName} onChange={(event) => setFullName(event.target.value)} placeholder="Enter your full name" disabled={loading || saving} /><small>This name appears on your learning dashboard.</small></label>
                <label className={"profile-field [display:grid] [gap:7px] [color:#eaf0fb] [font-size:12px] [font-weight:700] [&_input]:[width:100%] [&_input]:[min-height:47px] [&_input]:[padding:0_13px] [&_input]:[border:1px_solid_rgba(171,188,224,.38)] [&_input]:[border-radius:9px] [&_input]:[outline:0] [&_input]:[background:#edf2fa] [&_input]:[color:#1d2940] [&_input]:[font:inherit] [&_input]:[font-size:14px] [&_input]:[font-weight:500] [&_input]:[color-scheme:light] [&_input]:[transition:border-color_.18s,box-shadow_.18s] [&_input::placeholder]:[color:#69758b] [&_input:focus-visible]:[border-color:#927af0] [&_input:focus-visible]:[box-shadow:0_0_0_3px_rgba(155,123,255,.2)] [&_input:disabled]:[opacity:.72] [&_input:disabled]:[cursor:not-allowed] [&_select]:[width:100%] [&_select]:[min-height:47px] [&_select]:[padding:0_13px] [&_select]:[border:1px_solid_rgba(171,188,224,.38)] [&_select]:[border-radius:9px] [&_select]:[outline:0] [&_select]:[background:#edf2fa] [&_select]:[color:#1d2940] [&_select]:[font:inherit] [&_select]:[font-size:14px] [&_select]:[color-scheme:light] [&_select:focus-visible]:[border-color:#927af0] [&_select:focus-visible]:[box-shadow:0_0_0_3px_rgba(155,123,255,.2)] [&_select:disabled]:[opacity:.72] [&_select:disabled]:[cursor:not-allowed] [&_small]:[color:#a2aec2] [&_small]:[font-size:10px] [&_small]:[font-weight:400] [&_small]:[line-height:1.5]"} htmlFor="profile-hobby"><span>Hobby</span><input id="profile-hobby" maxLength={100} value={hobby} onChange={(event) => setHobby(event.target.value)} placeholder="e.g. Coding, Music, Football" disabled={loading || saving} /></label>
                <div className={"profile-form-grid [display:grid] [grid-template-columns:repeat(2,minmax(0,1fr))] [gap:13px] max-[560px]:[grid-template-columns:1fr]"}>
                  <label className={"profile-field [display:grid] [gap:7px] [color:#eaf0fb] [font-size:12px] [font-weight:700] [&_input]:[width:100%] [&_input]:[min-height:47px] [&_input]:[padding:0_13px] [&_input]:[border:1px_solid_rgba(171,188,224,.38)] [&_input]:[border-radius:9px] [&_input]:[outline:0] [&_input]:[background:#edf2fa] [&_input]:[color:#1d2940] [&_input]:[font:inherit] [&_input]:[font-size:14px] [&_input]:[font-weight:500] [&_input]:[color-scheme:light] [&_input]:[transition:border-color_.18s,box-shadow_.18s] [&_input::placeholder]:[color:#69758b] [&_input:focus-visible]:[border-color:#927af0] [&_input:focus-visible]:[box-shadow:0_0_0_3px_rgba(155,123,255,.2)] [&_input:disabled]:[opacity:.72] [&_input:disabled]:[cursor:not-allowed] [&_select]:[width:100%] [&_select]:[min-height:47px] [&_select]:[padding:0_13px] [&_select]:[border:1px_solid_rgba(171,188,224,.38)] [&_select]:[border-radius:9px] [&_select]:[outline:0] [&_select]:[background:#edf2fa] [&_select]:[color:#1d2940] [&_select]:[font:inherit] [&_select]:[font-size:14px] [&_select]:[color-scheme:light] [&_select:focus-visible]:[border-color:#927af0] [&_select:focus-visible]:[box-shadow:0_0_0_3px_rgba(155,123,255,.2)] [&_select:disabled]:[opacity:.72] [&_select:disabled]:[cursor:not-allowed] [&_small]:[color:#a2aec2] [&_small]:[font-size:10px] [&_small]:[font-weight:400] [&_small]:[line-height:1.5]"} htmlFor="profile-level"><span>Learning level</span><select id="profile-level" value={level} onChange={(event) => setLevel(event.target.value)} disabled={loading || saving}><option value="">Choose your level</option>{learningLevels.map((item) => <option key={item}>{item}</option>)}</select></label>
                  <label className={"profile-field [display:grid] [gap:7px] [color:#eaf0fb] [font-size:12px] [font-weight:700] [&_input]:[width:100%] [&_input]:[min-height:47px] [&_input]:[padding:0_13px] [&_input]:[border:1px_solid_rgba(171,188,224,.38)] [&_input]:[border-radius:9px] [&_input]:[outline:0] [&_input]:[background:#edf2fa] [&_input]:[color:#1d2940] [&_input]:[font:inherit] [&_input]:[font-size:14px] [&_input]:[font-weight:500] [&_input]:[color-scheme:light] [&_input]:[transition:border-color_.18s,box-shadow_.18s] [&_input::placeholder]:[color:#69758b] [&_input:focus-visible]:[border-color:#927af0] [&_input:focus-visible]:[box-shadow:0_0_0_3px_rgba(155,123,255,.2)] [&_input:disabled]:[opacity:.72] [&_input:disabled]:[cursor:not-allowed] [&_select]:[width:100%] [&_select]:[min-height:47px] [&_select]:[padding:0_13px] [&_select]:[border:1px_solid_rgba(171,188,224,.38)] [&_select]:[border-radius:9px] [&_select]:[outline:0] [&_select]:[background:#edf2fa] [&_select]:[color:#1d2940] [&_select]:[font:inherit] [&_select]:[font-size:14px] [&_select]:[color-scheme:light] [&_select:focus-visible]:[border-color:#927af0] [&_select:focus-visible]:[box-shadow:0_0_0_3px_rgba(155,123,255,.2)] [&_select:disabled]:[opacity:.72] [&_select:disabled]:[cursor:not-allowed] [&_small]:[color:#a2aec2] [&_small]:[font-size:10px] [&_small]:[font-weight:400] [&_small]:[line-height:1.5]"} htmlFor="profile-age-group"><span>Age group</span><select id="profile-age-group" value={ageGroup} onChange={(event) => setAgeGroup(event.target.value)} disabled={loading || saving}><option value="">Choose your age group</option>{ageGroups.map((item) => <option key={item}>{item}</option>)}</select></label>
                </div>
                <fieldset className={"profile-choice-field [min-width:0] [margin:0] [padding:0] [border:0] [&_legend]:[margin-bottom:9px] [&_legend]:[color:#eaf0fb] [&_legend]:[font-size:12px] [&_legend]:[font-weight:700]"}><legend>Interests</legend><div className={"profile-choice-grid [display:grid] [grid-template-columns:repeat(2,minmax(0,1fr))] [gap:8px] [&_label]:[display:flex] [&_label]:[min-height:42px] [&_label]:[align-items:center] [&_label]:[gap:9px] [&_label]:[padding:8px_10px] [&_label]:[border:1px_solid_rgba(255,255,255,.09)] [&_label]:[border-radius:9px] [&_label]:[background:rgba(255,255,255,.025)] [&_label]:[color:#c5cee0] [&_label]:[font-size:11px] [&_label]:[font-weight:500] [&_label]:[cursor:pointer] [&_input]:[width:15px] [&_input]:[height:15px] [&_input]:[flex:0_0_15px] [&_input]:[accent-color:#9b7bff] max-[560px]:[grid-template-columns:1fr]"}>{interestOptions.map((item) => <label key={item}><input type="checkbox" checked={selectedInterests.includes(item)} onChange={() => setSelectedInterests((current) => current.includes(item) ? current.filter((value) => value !== item) : [...current, item])} disabled={loading || saving} /><span>{item}</span></label>)}</div></fieldset>
                <fieldset className={"profile-choice-field [min-width:0] [margin:0] [padding:0] [border:0] [&_legend]:[margin-bottom:9px] [&_legend]:[color:#eaf0fb] [&_legend]:[font-size:12px] [&_legend]:[font-weight:700]"}><legend>Goals</legend><div className={"profile-choice-grid [display:grid] [grid-template-columns:repeat(2,minmax(0,1fr))] [gap:8px] [&_label]:[display:flex] [&_label]:[min-height:42px] [&_label]:[align-items:center] [&_label]:[gap:9px] [&_label]:[padding:8px_10px] [&_label]:[border:1px_solid_rgba(255,255,255,.09)] [&_label]:[border-radius:9px] [&_label]:[background:rgba(255,255,255,.025)] [&_label]:[color:#c5cee0] [&_label]:[font-size:11px] [&_label]:[font-weight:500] [&_label]:[cursor:pointer] [&_input]:[width:15px] [&_input]:[height:15px] [&_input]:[flex:0_0_15px] [&_input]:[accent-color:#9b7bff] max-[560px]:[grid-template-columns:1fr]"}>{goalOptions.map((item) => <label key={item}><input type="checkbox" checked={selectedGoals.includes(item)} onChange={() => setSelectedGoals((current) => current.includes(item) ? current.filter((value) => value !== item) : [...current, item])} disabled={loading || saving} /><span>{item}</span></label>)}</div></fieldset>
              </form>
            </section>
          </div>

          <aside className={"profile-side-column [display:grid] [gap:16px] [min-width:0] max-[820px]:[grid-template-columns:repeat(2,minmax(0,1fr))] max-[820px]:[align-items:start] max-[560px]:[grid-template-columns:1fr]"} aria-label="Profile settings and security">
            <section className={"profile-panel profile-completion-panel [min-width:0] [padding:21px] [border:1px_solid_rgba(255,255,255,.09)] [border-radius:15px] [background:linear-gradient(145deg,rgba(19,29,49,.96),rgba(15,23,40,.98))] max-[560px]:[padding:16px] [&_h2]:[margin:5px_0_4px] [&_h2]:[font-family:'Clash_Display',sans-serif] [&_h2]:[font-size:18px] [&_h2]:[letter-spacing:-.02em] [&_>_p]:[margin:0] [&_>_p]:[color:#9eabc1] [&_>_p]:[font-size:11px] [&_>_p]:[line-height:1.6] [&_h2]:[margin-top:7px]"} aria-labelledby="profile-completion-title">
              <span className={"profile-panel-kicker [color:#b7a5ff] [font-size:9px] [font-weight:800] [letter-spacing:.15em]"}>PROFILE SETUP</span><h2 id="profile-completion-title">Make your profile yours</h2><p>A complete profile helps us personalize your learning journey.</p>
              <div className={"profile-completion-meta [display:flex] [align-items:baseline] [gap:8px] [margin-top:17px] [&_strong]:[color:#d5caff] [&_strong]:[font-family:'Clash_Display',sans-serif] [&_strong]:[font-size:24px] [&_span]:[color:#9eabc1] [&_span]:[font-size:10px]"}><strong>{completion.percent}%</strong><span>{completion.completed} of {completion.total} details added</span></div>
              <div className={"profile-completion-track [height:7px] [overflow:hidden] [margin-top:8px] [border-radius:99px] [background:rgba(255,255,255,.09)] [&_span]:[display:block] [&_span]:[height:100%] [&_span]:[border-radius:inherit] [&_span]:[background:linear-gradient(90deg,#6385ff,#aa93ff)] [&_span]:[transition:width_.25s_ease]"} role="progressbar" aria-label="Profile completion" aria-valuemin={0} aria-valuemax={completion.total} aria-valuenow={completion.completed}><span style={{ width: `${completion.percent}%` }} /></div>
              <ul className={"profile-checklist [display:grid] [gap:12px] [margin:17px_0_0] [padding:0] [list-style:none] [&_li]:[display:flex] [&_li]:[align-items:center] [&_li]:[gap:9px] [&_li]:[color:#aab6ca] [&_li]:[font-size:11px] [&_li_>_span]:[display:grid] [&_li_>_span]:[width:21px] [&_li_>_span]:[height:21px] [&_li_>_span]:[place-items:center] [&_li_>_span]:[border:1px_solid_rgba(255,255,255,.13)] [&_li_>_span]:[border-radius:50%] [&_li_>_span]:[color:#8492aa] [&_li_>_span]:[font-size:9px]"}>
                <li className={(fullName.trim() ? "complete [&_>_span]:[border-color:rgba(119,216,168,.35)] [&_>_span]:[background:rgba(119,216,168,.12)] [&_>_span]:[color:#8fe0b6]" : "")}><span>{fullName.trim() ? "✓" : "1"}</span> Name</li>
                <li className={(hobby.trim() ? "complete [&_>_span]:[border-color:rgba(119,216,168,.35)] [&_>_span]:[background:rgba(119,216,168,.12)] [&_>_span]:[color:#8fe0b6]" : "")}><span>{hobby.trim() ? "✓" : "2"}</span> Hobby</li>
                <li className={(level ? "complete [&_>_span]:[border-color:rgba(119,216,168,.35)] [&_>_span]:[background:rgba(119,216,168,.12)] [&_>_span]:[color:#8fe0b6]" : "")}><span>{level ? "✓" : "3"}</span> Learning level</li>
                <li className={(ageGroup ? "complete [&_>_span]:[border-color:rgba(119,216,168,.35)] [&_>_span]:[background:rgba(119,216,168,.12)] [&_>_span]:[color:#8fe0b6]" : "")}><span>{ageGroup ? "✓" : "4"}</span> Age group</li>
                <li className={(selectedInterests.length ? "complete [&_>_span]:[border-color:rgba(119,216,168,.35)] [&_>_span]:[background:rgba(119,216,168,.12)] [&_>_span]:[color:#8fe0b6]" : "")}><span>{selectedInterests.length ? "✓" : "5"}</span> Interests</li>
                <li className={(selectedGoals.length ? "complete [&_>_span]:[border-color:rgba(119,216,168,.35)] [&_>_span]:[background:rgba(119,216,168,.12)] [&_>_span]:[color:#8fe0b6]" : "")}><span>{selectedGoals.length ? "✓" : "6"}</span> Learning goals</li>
              </ul>
            </section>
            <section className={"profile-security-card [&_h2]:[margin:5px_0_4px] [&_h2]:[font-family:'Clash_Display',sans-serif] [&_h2]:[font-size:15px] [&_h2]:[letter-spacing:-.02em] [&_p]:[margin:0] [&_p]:[color:#9eabc1] [&_p]:[font-size:10px] [&_p]:[line-height:1.6] [display:flex] [align-items:flex-start] [gap:12px] [padding:17px] [border:1px_solid_rgba(99,133,255,.16)] [border-radius:14px] [background:linear-gradient(130deg,rgba(99,133,255,.09),rgba(155,123,255,.045))] [&_a]:[display:inline-flex] [&_a]:[align-items:center] [&_a]:[gap:7px] [&_a]:[margin-top:12px] [&_a]:[color:#c4b5ff] [&_a]:[font-size:10px] [&_a]:[font-weight:700]"} aria-labelledby="profile-security-title"><span className={"profile-security-icon [display:grid] [width:34px] [height:34px] [flex:0_0_34px] [place-items:center] [border-radius:10px] [background:rgba(99,133,255,.15)] [color:#a8bbff] [font-size:19px]"} aria-hidden="true">⌑</span><div><span className={"profile-panel-kicker [color:#b7a5ff] [font-size:9px] [font-weight:800] [letter-spacing:.15em]"}>ACCOUNT SECURITY</span><h2 id="profile-security-title">Keep your account secure</h2><p>Request a password reset link without leaving your profile.</p><button className={"profile-password-help [display:inline-flex] [min-height:34px] [align-items:center] [gap:8px] [margin-top:11px] [padding:0_11px] [border:1px_solid_rgba(155,123,255,.28)] [border-radius:8px] [background:rgba(155,123,255,.1)] [color:#d9d0ff] [font:inherit] [font-size:10px] [font-weight:700] [cursor:pointer] [&:hover]:[background:rgba(155,123,255,.2)]"} type="button" onClick={() => { setPasswordHelpStatus(""); setPasswordHelpOpen(true); }}>Password help <span aria-hidden="true">→</span></button><AccountSecurity /></div></section>
          </aside>
        </div>
      </main>
      {passwordHelpOpen ? (
        <div className={"profile-modal-scrim [position:fixed] [z-index:100] [inset:0] [display:grid] [place-items:center] [padding:18px] [background:rgba(4,7,16,.74)] [backdrop-filter:blur(8px)]"} onMouseDown={(event) => { if (event.target === event.currentTarget) setPasswordHelpOpen(false); }}>
          <section className={"profile-password-modal [position:relative] [width:min(100%,440px)] [padding:clamp(24px,6vw,36px)] [border:1px_solid_rgba(155,123,255,.3)] [border-radius:18px] [background:linear-gradient(145deg,#151d32,#0e1526)] [box-shadow:0_25px_80px_rgba(0,0,0,.5)] [&_h2]:[margin:9px_0] [&_h2]:[font-family:'Clash_Display',sans-serif] [&_h2]:[font-size:24px] [&_>_p]:[margin:0_0_18px] [&_>_p]:[color:#aeb9cd] [&_>_p]:[font-size:12px] [&_>_p]:[line-height:1.7]"} role="dialog" aria-modal="true" aria-labelledby="password-help-title">
            <button className={"profile-modal-close [position:absolute] [top:13px] [right:13px] [display:grid] [width:34px] [height:34px] [place-items:center] [border:1px_solid_rgba(255,255,255,.1)] [border-radius:9px] [background:rgba(255,255,255,.04)] [color:#e7eaff] [font-size:22px] [cursor:pointer]"} type="button" aria-label="Close password help" onClick={() => setPasswordHelpOpen(false)}>×</button>
            <span className={"profile-panel-kicker [color:#b7a5ff] [font-size:9px] [font-weight:800] [letter-spacing:.15em]"}>ACCOUNT SECURITY</span>
            <h2 id="password-help-title">Password Help</h2>
            <p>We’ll send a secure password reset link to the email address used for your account.</p>
            <button className={"profile-save-button [display:inline-flex] [min-height:40px] [align-items:center] [justify-content:center] [gap:10px] [padding:0_14px] [border:1px_solid_rgba(155,173,255,.4)] [border-radius:9px] [background:linear-gradient(120deg,#6385ff,#8068eb)] [box-shadow:0_7px_20px_rgba(89,89,220,.18)] [color:white] [font-size:11px] [font-weight:750] [cursor:pointer] [transition:transform_.18s,filter_.18s] [&:hover:not(:disabled)]:[transform:translateY(-1px)] [&:hover:not(:disabled)]:[filter:brightness(1.08)] [&:disabled]:[opacity:.55] [&:disabled]:[cursor:wait] [width:100%] max-[560px]:[width:100%]"} type="button" onClick={() => void sendPasswordHelp()} disabled={passwordHelpBusy}>{passwordHelpBusy ? "Sending link…" : "Change Password"}<span aria-hidden="true">→</span></button>
            <p className={(`profile-modal-status [min-height:18px] ![margin:12px_0_0] ![color:#8fe0b6]${passwordHelpError ? "error [color:#ff9fac] ![color:#ff9fac]" : ""}`)} role="status" aria-live="polite">{passwordHelpStatus}</p>
          </section>
        </div>
      ) : null}
      <SiteFooter />
    </div>
  );
}
