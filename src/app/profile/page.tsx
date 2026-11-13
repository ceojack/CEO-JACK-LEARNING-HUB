"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { SiteFooter } from "@/src/components/footer";
import { isSupabaseConfigured } from "@/src/utils/supabase/config";
import "./profile.css";

type LearnerProfile = { level?: string; ageGroup?: string; interests?: string[]; goals?: string[] };
type AccountUser = { email?: string; fullName?: string };

export default function ProfilePage() {
  const [user, setUser] = useState<AccountUser | null>(null);
  const [profile, setProfile] = useState<LearnerProfile | null>(null);
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [statusType, setStatusType] = useState<"success" | "error" | "">("");

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
          if (savedProfile) setProfile(JSON.parse(savedProfile) as LearnerProfile);
          return;
        }

        const response = await fetch("/api/profile", { cache: "no-store" });
        const result = await response.json() as { user?: AccountUser; profile?: LearnerProfile | null; error?: string };
        if (!response.ok) throw new Error(result.error ?? "Your account profile could not be loaded.");
        if (cancelled) return;
        setUser(result.user ?? null);
        setFullName(result.user?.fullName ?? "");
        setProfile(result.profile ?? null);
      } catch (loadError) {
        if (!cancelled) setError(loadError instanceof Error ? loadError.message : "Your account profile could not be loaded.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadProfile();
    return () => { cancelled = true; };
  }, []);

  const displayName = user?.fullName?.trim() || user?.email?.split("@")[0] || "Learner profile";
  const initials = displayName.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("") || "LP";
  const completion = useMemo(() => {
    const completed = [Boolean(user?.email), Boolean(fullName.trim()), Boolean(profile?.level), Boolean(profile?.ageGroup), Boolean(profile?.interests?.length), Boolean(profile?.goals?.length)].filter(Boolean).length;
    return { completed, total: 6, percent: Math.round((completed / 6) * 100) };
  }, [fullName, profile, user]);

  async function saveName(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = fullName.trim();
    if (name.length < 2 || name.length > 80) {
      setStatusType("error");
      setStatus("Enter a name between 2 and 80 characters.");
      return;
    }

    setSaving(true);
    setStatusType("");
    setStatus("Saving your changes…");
    try {
      if (isSupabaseConfigured()) {
        const response = await fetch("/api/profile", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fullName: name }),
        });
        const result = await response.json() as { user?: AccountUser; error?: string };
        if (!response.ok) throw new Error(result.error ?? "Your name could not be saved.");
        setUser(result.user ?? { ...user, fullName: name });
      } else {
        window.localStorage.setItem("ceoJackDisplayName", name);
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

  return (
    <div className="profile-page">
      <header className="profile-topbar">
        <Link href="/dashboard" className="profile-brand" aria-label="Back to CEO JACK Learning Hub dashboard">
          <span className="profile-brand-mark">CJ</span><span><strong>CEO JACK</strong><small>LEARNING HUB</small></span>
        </Link>
        <Link href="/dashboard" className="profile-back-link"><span aria-hidden="true">←</span> Back to dashboard</Link>
      </header>

      <main className="profile-content">
        <div className="profile-breadcrumb"><Link href="/dashboard">Learning Space</Link><span>/</span> My profile</div>
        <div className="profile-page-heading"><div><span className="profile-eyebrow">ACCOUNT SETTINGS</span><h1>My profile</h1><p>Manage your account details and learning preferences in one place.</p></div><span className="profile-private-note"><span aria-hidden="true">◈</span> Only you can see your account details</span></div>

        {error ? <p className="profile-alert error" role="alert">{error}</p> : null}

        <section className="profile-hero-card" aria-label="Account overview">
          <div className="profile-avatar" aria-hidden="true">{initials}</div>
          <div className="profile-hero-copy"><span className="profile-member-label"><i /> LEARNER ACCOUNT</span><h2>{loading ? "Loading your profile…" : displayName}</h2><p>{user?.email || "Add your account details to personalize your learning space."}</p></div>
          <div className="profile-hero-actions"><span className="profile-account-status"><i /> {user?.email ? "Signed-in account" : loading ? "Loading account" : "Learner profile"}</span><Link href="#personal-information">Edit details <span aria-hidden="true">↓</span></Link></div>
        </section>

        <div className="profile-columns">
          <div className="profile-primary-column">
            <section className="profile-panel" id="personal-information" aria-labelledby="personal-information-title">
              <div className="profile-panel-heading"><div><span className="profile-panel-kicker">YOUR ACCOUNT</span><h2 id="personal-information-title">Personal information</h2><p>Keep your name up to date. Your sign-in email is shown for reference.</p></div><span className="profile-panel-icon" aria-hidden="true">◎</span></div>
              <form className="profile-form" onSubmit={saveName}>
                <label className="profile-field" htmlFor="profile-full-name"><span>Full name</span><input id="profile-full-name" name="fullName" autoComplete="name" maxLength={80} value={fullName} onChange={(event) => setFullName(event.target.value)} placeholder="Enter your full name" disabled={loading || saving} /><small>This name appears on your learning dashboard.</small></label>
                <label className="profile-field" htmlFor="profile-email"><span>Email address</span><input id="profile-email" type="email" value={user?.email ?? ""} placeholder="Your account email" readOnly disabled={!user?.email} /><small>Email changes are managed through your sign-in provider.</small></label>
                <div className="profile-form-footer"><p className={`profile-form-status${statusType ? ` ${statusType}` : ""}`} role="status" aria-live="polite">{status}</p><button className="profile-save-button" type="submit" disabled={loading || saving}>{saving ? "Saving…" : "Save changes"}<span aria-hidden="true">→</span></button></div>
              </form>
            </section>

            <section className="profile-panel" aria-labelledby="learning-profile-title">
              <div className="profile-panel-heading"><div><span className="profile-panel-kicker">PERSONALIZED LEARNING</span><h2 id="learning-profile-title">Learning profile</h2><p>Your learning choices help us guide you to relevant activities.</p></div><span className="profile-panel-icon learning" aria-hidden="true">▤</span></div>
              <div className="profile-learning-grid">
                <div><span>Learning level</span><strong>{profile?.level || "Not set yet"}</strong></div>
                <div><span>Age group</span><strong>{profile?.ageGroup || "Not set yet"}</strong></div>
                <div className="wide"><span>Interests</span><strong>{profile?.interests?.join(", ") || "Choose the subjects and skills you enjoy."}</strong></div>
                <div className="wide"><span>Learning goals</span><strong>{profile?.goals?.join(", ") || "Add goals to shape your learning path."}</strong></div>
              </div>
              <Link href="/onboarding" className="profile-secondary-button">Update learning preferences <span aria-hidden="true">→</span></Link>
            </section>
          </div>

          <aside className="profile-side-column" aria-label="Profile settings and security">
            <section className="profile-panel profile-completion-panel" aria-labelledby="profile-completion-title">
              <span className="profile-panel-kicker">PROFILE SETUP</span><h2 id="profile-completion-title">Make your profile yours</h2><p>A complete profile helps us personalize your learning journey.</p>
              <div className="profile-completion-meta"><strong>{completion.percent}%</strong><span>{completion.completed} of {completion.total} details added</span></div>
              <div className="profile-completion-track" role="progressbar" aria-label="Profile completion" aria-valuemin={0} aria-valuemax={completion.total} aria-valuenow={completion.completed}><span style={{ width: `${completion.percent}%` }} /></div>
              <ul className="profile-checklist">
                <li className={fullName.trim() ? "complete" : ""}><span>{fullName.trim() ? "✓" : "1"}</span> Name</li>
                <li className={user?.email ? "complete" : ""}><span>{user?.email ? "✓" : "2"}</span> Email</li>
                <li className={profile?.level ? "complete" : ""}><span>{profile?.level ? "✓" : "3"}</span> Learning level</li>
                <li className={profile?.ageGroup ? "complete" : ""}><span>{profile?.ageGroup ? "✓" : "4"}</span> Age group</li>
                <li className={profile?.interests?.length ? "complete" : ""}><span>{profile?.interests?.length ? "✓" : "5"}</span> Interests</li>
                <li className={profile?.goals?.length ? "complete" : ""}><span>{profile?.goals?.length ? "✓" : "6"}</span> Learning goals</li>
              </ul>
            </section>
            <section className="profile-security-card" aria-labelledby="profile-security-title"><span className="profile-security-icon" aria-hidden="true">⌑</span><div><span className="profile-panel-kicker">ACCOUNT SECURITY</span><h2 id="profile-security-title">Keep your account secure</h2><p>Use a strong password and keep access to your email account.</p><Link href="/auth?mode=signin">Password help <span aria-hidden="true">→</span></Link></div></section>
            {isSupabaseConfigured() ? <form action="/auth/signout" method="post" className="profile-signout-form"><button type="submit">Sign out of your account <span aria-hidden="true">↗</span></button></form> : null}
          </aside>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
