"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useMemo, useState } from "react";
import { useReveal } from "@/src/hooks/use-reveal";
import "@/src/styles/auth.css";

type Mode = "signup" | "signin";

function AuthForm() {
  useReveal();
  const router = useRouter();
  const params = useSearchParams();
  const initialMode = params.get("mode") === "signin" ? "signin" : "signup";
  const [mode, setMode] = useState<Mode>(initialMode);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [terms, setTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState("");
  const [statusType, setStatusType] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const strength = useMemo(() => {
    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    return score;
  }, [password]);

  function validate() {
    const next: Record<string, string> = {};
    if (mode === "signup" && fullName.trim().length < 2) next.fullName = "Enter your full name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) next.email = "Enter a valid email.";
    if (mode === "signup" && password.length < 8) next.password = "Use at least 8 characters.";
    if (mode === "signin" && !password) next.password = "Enter your password.";
    if (mode === "signup" && confirmPassword !== password) next.confirmPassword = "Your passwords do not match.";
    if (mode === "signup" && !terms) next.terms = "Please accept the Terms and Privacy Policy.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validate()) {
      setStatusType("error");
      setStatus("Please check the highlighted fields.");
      return;
    }

    const user = {
      name: fullName.trim() || email.split("@")[0],
      email: email.trim().toLowerCase(),
    };
    window.localStorage.setItem("ceoJackUser", JSON.stringify(user));
    setStatusType("success");
    setStatus(mode === "signup" ? "Account created. Taking you to onboarding..." : "Signed in. Opening your dashboard...");
    router.push(mode === "signup" ? "/onboarding" : "/dashboard");
  }

  return (
    <>
      <div className="background" aria-hidden="true">
        <div className="grid" />
        <div className="glow glow-one" />
        <div className="glow glow-two" />
      </div>
      <header className="topbar">
        <Link href="/" className="logo" aria-label="CEO JACK Learning Hub home">
          <Image src="/assets/images/logo1.webp" alt="" className="logo-image" width={44} height={44} priority />
          <span className="logo-text">
            <strong>CEO JACK</strong>
            <small>LEARNING HUB</small>
          </span>
        </Link>
        <Link href="/get-started" className="back-link">
          <span aria-hidden="true">←</span> Back to Get Started
        </Link>
      </header>
      <main className="auth-page">
        <section className="auth-intro" aria-labelledby="intro-title">
          <div className="intro-content reveal">
            <p className="page-tag"><span /> YOUR NEXT CHAPTER</p>
            <h1 id="intro-title">
              Build your future,
              <span> one step at a time.</span>
            </h1>
            <p className="intro-copy">One account for your journey across education, digital skills, and entrepreneurship.</p>
          </div>
        </section>
        <section className="auth-section" aria-label="Account access">
          <div className="auth-card reveal">
            <div className="auth-header">
              <div>
                <span className="auth-label">{mode === "signup" ? "CREATE ACCOUNT" : "SIGN IN"}</span>
                <h2>{mode === "signup" ? "Create your account" : "Welcome back"}</h2>
                <p>{mode === "signup" ? "Start your CEO JACK journey." : "Continue your learning journey."}</p>
              </div>
              <span className="account-pill"><span /> Get started free</span>
            </div>
            <form noValidate onSubmit={handleSubmit}>
              {mode === "signup" ? (
                <div className={`form-group${errors.fullName ? " invalid" : ""}`}>
                  <label htmlFor="fullName">Full name</label>
                  <input id="fullName" value={fullName} onChange={(event) => setFullName(event.target.value)} placeholder="Enter your full name" autoComplete="name" />
                  <small className="field-error">{errors.fullName}</small>
                </div>
              ) : null}
              <div className={`form-group${errors.email ? " invalid" : ""}`}>
                <label htmlFor="email">Email address</label>
                <input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" autoComplete="email" />
                <small className="field-error">{errors.email}</small>
              </div>
              <div className={`form-group${errors.password ? " invalid" : ""}`}>
                <div className="label-row">
                  <label htmlFor="password">Password</label>
                  <button className="text-button" type="button" onClick={() => setShowPassword((value) => !value)}>
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                <input id="password" type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password" autoComplete={mode === "signup" ? "new-password" : "current-password"} />
                {mode === "signup" ? (
                  <div className="password-strength">
                    <div className="strength-bar" aria-hidden="true">
                      {Array.from({ length: 4 }).map((_, index) => (
                        <span key={index} style={{ background: index < strength ? (strength < 3 ? "#ffbd72" : "#67d7ff") : "rgba(255,255,255,.09)" }} />
                      ))}
                    </div>
                    <small>{password ? ["Weak password", "Fair password", "Good password", "Strong password"][Math.max(0, strength - 1)] : "Use at least 8 characters"}</small>
                  </div>
                ) : null}
                <small className="field-error">{errors.password}</small>
              </div>
              {mode === "signup" ? (
                <>
                  <div className={`form-group${errors.confirmPassword ? " invalid" : ""}`}>
                    <label htmlFor="confirmPassword">Confirm password</label>
                    <input id="confirmPassword" type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} placeholder="Enter your password again" autoComplete="new-password" />
                    <small className="field-error">{errors.confirmPassword}</small>
                  </div>
                  <label className="terms">
                    <input type="checkbox" checked={terms} onChange={(event) => setTerms(event.target.checked)} />
                    <span>
                      I agree to the <Link href="/terms">Terms</Link> and <Link href="/privacy">Privacy Policy</Link>.
                    </span>
                  </label>
                  <small className="field-error terms-error">{errors.terms}</small>
                </>
              ) : null}
              <button type="submit" className="submit-btn">
                <span>{mode === "signup" ? "Create account" : "Sign in"}</span>
                <span aria-hidden="true">→</span>
              </button>
              <p className={`form-status ${statusType}`} role="status">{status}</p>
            </form>
            <div className="auth-switch">
              <span>{mode === "signup" ? "Already have an account?" : "New here?"}</span>
              <button type="button" onClick={() => setMode(mode === "signup" ? "signin" : "signup")}>
                {mode === "signup" ? "Sign in" : "Create account"}
              </button>
            </div>
          </div>
        </section>
      </main>
      <footer className="page-footer">
        <Link href="/">CEO JACK <span>LEARNING HUB</span></Link>
        <p>Learn. Create. Develop.</p>
        <Link href="/contact">Need help? Contact us <span aria-hidden="true">↗</span></Link>
      </footer>
    </>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<p>Loading account…</p>}>
      <AuthForm />
    </Suspense>
  );
}
