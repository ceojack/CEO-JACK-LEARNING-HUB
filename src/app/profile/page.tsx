"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { SiteFooter } from "@/src/components/footer";
import { SiteLogoMark } from "@/src/components/site-logo-mark";
import { UserAvatar } from "@/src/components/user-avatar";
import { createClient } from "@/src/utils/supabase/client";
import { isSupabaseConfigured } from "@/src/utils/supabase/config";
import { switchToGoogleAccount } from "@/src/utils/supabase/google-account";
import "./profile.css";

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
    <div className="profile-page">
      <header className="profile-topbar">
        <Link href="/dashboard" className="profile-brand" aria-label="Back to CEO JACK Learning Hub dashboard">
          <SiteLogoMark className="profile-brand-mark" width={80} height={80} alt="CEO JACK Learning Hub logo" /><span><strong>CEO JACK</strong><small>LEARNING HUB</small></span>
        </Link>
        <Link href="/dashboard" className="profile-back-link"><span aria-hidden="true">←</span> Back to dashboard</Link>
      </header>

      <main className="profile-content">
        <div className="profile-breadcrumb"><Link href="/dashboard">Learning Space</Link><span>/</span> My profile</div>
        <div className="profile-page-heading"><div><span className="profile-eyebrow">ACCOUNT SETTINGS</span><h1>My profile</h1><p>Manage your account details and learning preferences in one place.</p></div><span className="profile-private-note"><span aria-hidden="true">◈</span> Only you can see your account details</span></div>

        {error ? <p className="profile-alert error" role="alert">{error}</p> : null}

        <section className="profile-hero-card" aria-label="Account overview">
          <div className="profile-hero-main">
            <Link href="/profile" aria-label="Open your profile"><UserAvatar src={user?.avatarUrl} className="profile-avatar" /></Link>
            <div className="profile-hero-copy"><span className="profile-member-label"><i /> LEARNER ACCOUNT</span><h2>{loading ? "Loading your profile…" : displayName}</h2><p>Your shared Learning Hub and JACK AI profile.</p></div>
            <div className="profile-hero-actions"><span className="profile-account-status"><i /> {loading ? "Loading account" : "Signed-in account"}</span><Link href="#personal-information">Edit details <span aria-hidden="true">↓</span></Link></div>
          </div>
          <div className="profile-hero-action-row">
            <button className="profile-save-button profile-hero-save-button" type="submit" form="profile-information-form" disabled={loading || saving}>{saving ? "Saving…" : hasLearnerProfile ? "Save Changes" : "Save / Upload Profile"}<span aria-hidden="true">→</span></button>
            {isSupabaseConfigured() ? <button className="profile-switch-account-button" type="button" onClick={() => void switchAccount()} disabled={switchingAccount}><span className="profile-google-mark" aria-hidden="true">G</span>{switchingAccount ? "Choose a Google account…" : "Switch Account"}<span aria-hidden="true">↗</span></button> : null}
            <Link className="profile-verified-member-link" href="/verified-member"><span className="profile-verified-member-tick" aria-hidden="true">✓</span>{hasMemberCard ? "VIEW MY MEMBER CARD" : "BECOME A VERIFIED MEMBER"}<span aria-hidden="true">→</span></Link>
          </div>
          <p className={`profile-form-status profile-hero-status${statusType ? ` ${statusType}` : ""}`} role="status" aria-live="polite">{status}</p>
        </section>

        <div className="profile-columns">
          <div className="profile-primary-column">
            <section className="profile-panel" id="personal-information" aria-labelledby="personal-information-title">
              <div className="profile-panel-heading"><div><span className="profile-panel-kicker">SHARED ACCOUNT</span><h2 id="personal-information-title">Your learning profile</h2><p>These preferences personalize your Learning Hub and JACK AI experience.</p></div><span className="profile-panel-icon" aria-hidden="true">◎</span></div>
              {!loading && !hasLearnerProfile ? <div className="profile-upload-notice"><strong>Welcome! Upload your details to set up your learner account</strong><span>Complete the fields below, then save your profile to personalize the Learning Hub and JACK AI.</span></div> : null}
              <form id="profile-information-form" className="profile-form" onSubmit={saveProfile}>
                <label className="profile-field" htmlFor="profile-full-name"><span>Full name</span><input id="profile-full-name" name="fullName" autoComplete="name" maxLength={80} value={fullName} onChange={(event) => setFullName(event.target.value)} placeholder="Enter your full name" disabled={loading || saving} /><small>This name appears on your learning dashboard.</small></label>
                <label className="profile-field" htmlFor="profile-hobby"><span>Hobby</span><input id="profile-hobby" maxLength={100} value={hobby} onChange={(event) => setHobby(event.target.value)} placeholder="e.g. Coding, Music, Football" disabled={loading || saving} /></label>
                <div className="profile-form-grid">
                  <label className="profile-field" htmlFor="profile-level"><span>Learning level</span><select id="profile-level" value={level} onChange={(event) => setLevel(event.target.value)} disabled={loading || saving}><option value="">Choose your level</option>{learningLevels.map((item) => <option key={item}>{item}</option>)}</select></label>
                  <label className="profile-field" htmlFor="profile-age-group"><span>Age group</span><select id="profile-age-group" value={ageGroup} onChange={(event) => setAgeGroup(event.target.value)} disabled={loading || saving}><option value="">Choose your age group</option>{ageGroups.map((item) => <option key={item}>{item}</option>)}</select></label>
                </div>
                <fieldset className="profile-choice-field"><legend>Interests</legend><div className="profile-choice-grid">{interestOptions.map((item) => <label key={item}><input type="checkbox" checked={selectedInterests.includes(item)} onChange={() => setSelectedInterests((current) => current.includes(item) ? current.filter((value) => value !== item) : [...current, item])} disabled={loading || saving} /><span>{item}</span></label>)}</div></fieldset>
                <fieldset className="profile-choice-field"><legend>Goals</legend><div className="profile-choice-grid">{goalOptions.map((item) => <label key={item}><input type="checkbox" checked={selectedGoals.includes(item)} onChange={() => setSelectedGoals((current) => current.includes(item) ? current.filter((value) => value !== item) : [...current, item])} disabled={loading || saving} /><span>{item}</span></label>)}</div></fieldset>
              </form>
            </section>
          </div>

          <aside className="profile-side-column" aria-label="Profile settings and security">
            <section className="profile-panel profile-completion-panel" aria-labelledby="profile-completion-title">
              <span className="profile-panel-kicker">PROFILE SETUP</span><h2 id="profile-completion-title">Make your profile yours</h2><p>A complete profile helps us personalize your learning journey.</p>
              <div className="profile-completion-meta"><strong>{completion.percent}%</strong><span>{completion.completed} of {completion.total} details added</span></div>
              <div className="profile-completion-track" role="progressbar" aria-label="Profile completion" aria-valuemin={0} aria-valuemax={completion.total} aria-valuenow={completion.completed}><span style={{ width: `${completion.percent}%` }} /></div>
              <ul className="profile-checklist">
                <li className={fullName.trim() ? "complete" : ""}><span>{fullName.trim() ? "✓" : "1"}</span> Name</li>
                <li className={hobby.trim() ? "complete" : ""}><span>{hobby.trim() ? "✓" : "2"}</span> Hobby</li>
                <li className={level ? "complete" : ""}><span>{level ? "✓" : "3"}</span> Learning level</li>
                <li className={ageGroup ? "complete" : ""}><span>{ageGroup ? "✓" : "4"}</span> Age group</li>
                <li className={selectedInterests.length ? "complete" : ""}><span>{selectedInterests.length ? "✓" : "5"}</span> Interests</li>
                <li className={selectedGoals.length ? "complete" : ""}><span>{selectedGoals.length ? "✓" : "6"}</span> Learning goals</li>
              </ul>
            </section>
            <section className="profile-security-card" aria-labelledby="profile-security-title"><span className="profile-security-icon" aria-hidden="true">⌑</span><div><span className="profile-panel-kicker">ACCOUNT SECURITY</span><h2 id="profile-security-title">Keep your account secure</h2><p>Request a password reset link without leaving your profile.</p><button className="profile-password-help" type="button" onClick={() => { setPasswordHelpStatus(""); setPasswordHelpOpen(true); }}>Password help <span aria-hidden="true">→</span></button></div></section>
          </aside>
        </div>
      </main>
      {passwordHelpOpen ? (
        <div className="profile-modal-scrim" onMouseDown={(event) => { if (event.target === event.currentTarget) setPasswordHelpOpen(false); }}>
          <section className="profile-password-modal" role="dialog" aria-modal="true" aria-labelledby="password-help-title">
            <button className="profile-modal-close" type="button" aria-label="Close password help" onClick={() => setPasswordHelpOpen(false)}>×</button>
            <span className="profile-panel-kicker">ACCOUNT SECURITY</span>
            <h2 id="password-help-title">Password Help</h2>
            <p>We’ll send a secure password reset link to the email address used for your account.</p>
            <button className="profile-save-button" type="button" onClick={() => void sendPasswordHelp()} disabled={passwordHelpBusy}>{passwordHelpBusy ? "Sending link…" : "Change Password"}<span aria-hidden="true">→</span></button>
            <p className={`profile-modal-status${passwordHelpError ? " error" : ""}`} role="status" aria-live="polite">{passwordHelpStatus}</p>
          </section>
        </div>
      ) : null}
      <SiteFooter />
    </div>
  );
}
