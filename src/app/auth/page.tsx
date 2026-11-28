"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useEffect, useMemo, useState } from "react";
import { SiteFooter } from "@/src/components/footer";
import { useReveal } from "@/src/hooks/use-reveal";
import { createClient } from "@/src/utils/supabase/client";
import { AuthRequestTimeoutError, withAuthRequestTimeout } from "@/src/utils/supabase/request-timeout";
import { isAdminEmail } from "@/src/utils/supabase/admin";

type Mode = "signup" | "signin";

function AuthForm() {
  useReveal();
  const router = useRouter();
  const params = useSearchParams();
  const initialMode = params.get("mode") === "signin" ? "signin" : "signup";
  const requestedNext = params.get("next") ?? "/dashboard";
  const nextPath = requestedNext.startsWith("/") && !requestedNext.startsWith("//") ? requestedNext : "/dashboard";
  const [mode, setMode] = useState<Mode>(initialMode);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [terms, setTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const initialError = params.get("error");
  const initialMessage = params.get("message");
  const [status, setStatus] = useState(initialError ?? initialMessage ?? "");
  const [statusType, setStatusType] = useState(initialError ? "error" : initialMessage ? "success" : "");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signupExistingAccount, setSignupExistingAccount] = useState(false);
  const [signinInvalidCredentials, setSigninInvalidCredentials] = useState(false);

  async function getPostLoginPath(supabase: ReturnType<typeof createClient>) {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return nextPath;
    const { data: profile } = await supabase.from("profiles").select("role, mfa_enabled").eq("id", userData.user.id).maybeSingle();
    const isAdmin = profile?.role === "admin" && isAdminEmail(userData.user.email);
    const destination = isAdmin ? "/admin" : "/dashboard";
    return isAdmin || profile?.mfa_enabled ? `/auth/mfa?next=${encodeURIComponent(destination)}` : destination;
  }

  useEffect(() => {
    if (!signupExistingAccount) return;
    const timer = window.setTimeout(() => {
      setMode("signin");
      setErrors({});
      setStatus("");
      setStatusType("");
      setSignupExistingAccount(false);
      setSigninInvalidCredentials(false);
      router.replace(`/auth?mode=signin&next=${encodeURIComponent(nextPath)}`, { scroll: false });
    }, 2000);
    return () => window.clearTimeout(timer);
  }, [signupExistingAccount, nextPath, router]);

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

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;
    if (!validate()) {
      setStatusType("error");
      setStatus("Please check the highlighted fields.");
      return;
    }

    setStatusType("");
    setStatus("Please wait...");
    setSignupExistingAccount(false);
    setSigninInvalidCredentials(false);
    setIsSubmitting(true);
    try {
      const supabase = createClient();
      if (mode === "signup") {
        const { data, error } = await withAuthRequestTimeout(
          supabase.auth.signUp({
            email: email.trim(),
            password,
            options: { data: { full_name: fullName.trim() } },
          }),
        );
        if (error) throw error;
        if (data.session) {
          router.replace(await getPostLoginPath(supabase));
          router.refresh();
          return;
        }
        throw new Error("Supabase created the account but did not return a sign-in session. Please try signing in.");
      } else {
        const { error } = await withAuthRequestTimeout(supabase.auth.signInWithPassword({ email: email.trim(), password }));
        if (error) {
          console.log(error);
          throw error;
        }
        router.replace(await getPostLoginPath(supabase));
        router.refresh();
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "We couldn’t complete account access. Please try again.";
      const normalizedMessage = errorMessage.toLowerCase();
      if (mode === "signup" && (normalizedMessage.includes("already registered") || normalizedMessage.includes("already exists"))) {
        setSignupExistingAccount(true);
        setStatusType("success");
        setStatus("You already have an account. Taking you to Sign In...");
        return;
      }
      if (mode === "signin" && normalizedMessage.includes("invalid login credentials")) {
        setSigninInvalidCredentials(true);
      }
      setStatusType("error");
      setStatus(
        error instanceof AuthRequestTimeoutError
          ? "Check your internet and try again"
          : mode === "signin" && normalizedMessage.includes("invalid login credentials")
            ? "Account not found"
          : errorMessage
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleGoogle() {
    if (isSubmitting) return;
    setStatusType("");
    setStatus("Redirecting to Google...");
    setIsSubmitting(true);
    try {
      const supabase = createClient();
      const authNext = "/dashboard";
      const { error } = await withAuthRequestTimeout(supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/auth/callback?mode=${mode}&next=${encodeURIComponent(authNext)}` },
      }));
      if (error) throw error;
      setIsSubmitting(false);
      setStatusType("");
      setStatus("");
    } catch (error) {
      setIsSubmitting(false);
      setStatusType("error");
      setStatus(error instanceof AuthRequestTimeoutError ? "Check your internet and try again" : error instanceof Error ? error.message : "Google sign-in could not start. Please try again.");
    }
  }

  function switchMode() {
    const nextMode = mode === "signup" ? "signin" : "signup";
    setMode(nextMode);
    setErrors({});
    setStatus("");
    setStatusType("");
    setSignupExistingAccount(false);
    setSigninInvalidCredentials(false);
    router.replace(`/auth?mode=${nextMode}&next=${encodeURIComponent(nextPath)}`, { scroll: false });
  }

  return (
    <>
      <div className={"background [position:fixed] [z-index:-1] [inset:0] [overflow:hidden] [pointer-events:none] [background:radial-gradient(_ellipse_at_50%_0%,_rgba(60,_70,_142,_.16),_transparent_60%_)]"} aria-hidden="true">
        <div className={"grid [position:absolute] [inset:0] [background-image:linear-gradient(rgba(132,_151,_218,_.035)_1px,_transparent_1px),_linear-gradient(90deg,_rgba(132,_151,_218,_.035)_1px,_transparent_1px)] [background-size:58px_58px] [mask-image:linear-gradient(to_bottom,_#000,_transparent_90%)]"} />
        <div className={"glow glow-one [position:absolute] [width:430px] [height:430px] [border-radius:50%] [filter:blur(110px)] [opacity:.13] [top:10%] [left:-220px] [background:#9b7bff]"} />
        <div className={"glow glow-two [position:absolute] [width:430px] [height:430px] [border-radius:50%] [filter:blur(110px)] [opacity:.13] [right:-220px] [bottom:0] [background:#6385ff]"} />
      </div>
      <header className={"topbar [position:sticky] [top:0] [z-index:50] [width:min(calc(100%_-_64px),_1320px)] [min-height:88px] [margin:0_auto] [display:flex] [align-items:center] [justify-content:space-between] [gap:20px] [border-bottom:1px_solid_rgba(255,_255,_255,_.06)] [background:rgba(8,_13,_27,_.94)] [backdrop-filter:blur(16px)] max-[950px]:[width:min(calc(100%_-_40px),_1320px)] max-[600px]:[width:calc(100%_-_36px)] max-[600px]:[min-height:75px]"}>
        <Link href="/" className={"logo [display:inline-flex] [align-items:center] [gap:11px]"} aria-label="CEO JACK Learning Hub home">
          <Image src="/assets/images/logo1.webp" alt="" className={"logo-image [width:43px] [height:43px] [object-fit:contain] [border-radius:10px] max-[600px]:[width:37px] max-[600px]:[height:37px]"} width={44} height={44} priority />
          <span className={"logo-text [&_strong]:[display:block] [&_small]:[display:block] [&_strong]:[font:700_14px/1_var(--display)] [&_strong]:[letter-spacing:.09em] [&_small]:[margin-top:5px] [&_small]:[color:#8996b0] [&_small]:[font-size:8px] [&_small]:[font-weight:700] [&_small]:[letter-spacing:.23em] max-[600px]:[&_strong]:[font-size:12px] max-[600px]:[&_small]:[font-size:7px]"}>
            <strong>CEO JACK</strong>
            <small>LEARNING HUB</small>
          </span>
        </Link>
        <Link href="/get-started" className={"back-link [display:inline-flex] [min-height:42px] [align-items:center] [gap:9px] [padding:6px_13px_6px_7px] [border:1px_solid_rgba(155,_123,_255,_.2)] [border-radius:999px] [background:linear-gradient(120deg,_rgba(155,_123,_255,_.08),_rgba(255,_255,_255,_.025))] [color:#c8d0e2] [font-size:12px] [font-weight:600] [white-space:nowrap] [transition:color_.2s_ease,_border-color_.2s_ease,_background_.2s_ease,_transform_.2s_ease] [&_span]:[display:grid] [&_span]:[width:28px] [&_span]:[height:28px] [&_span]:[flex:0_0_28px] [&_span]:[place-items:center] [&_span]:[border:1px_solid_rgba(155,_123,_255,_.2)] [&_span]:[border-radius:50%] [&_span]:[background:rgba(155,_123,_255,_.12)] [&_span]:[color:#c5b2ff] [&_span]:[font-size:15px] [&_span]:[transition:transform_.2s_ease,_background_.2s_ease] [&:hover]:[color:#fff] [&:hover]:[border-color:rgba(155,_123,_255,_.5)] [&:hover]:[background:rgba(155,_123,_255,_.12)] [&:hover]:[transform:translateX(-2px)] [&:hover_span]:[transform:translateX(-2px)] [&:hover_span]:[background:rgba(155,_123,_255,_.2)] max-[600px]:[min-height:40px] max-[600px]:[gap:7px] max-[600px]:[padding-right:10px] max-[600px]:[font-size:10px] max-[600px]:[&_span]:[width:26px] max-[600px]:[&_span]:[height:26px] max-[600px]:[&_span]:[flex-basis:26px]"}>
          <span aria-hidden="true">←</span> Back to Get Started
        </Link>
      </header>
      <main className={"auth-page [width:min(calc(100%_-_64px),_1160px)] [flex:1] [margin:0_auto] [padding:65px_0] [display:grid] [grid-template-columns:minmax(0,_1fr)_minmax(380px,_.82fr)] [align-items:center] [gap:clamp(50px,_8vw,_110px)] max-[950px]:[grid-template-columns:1fr] max-[950px]:[width:min(calc(100%_-_48px),_650px)] max-[950px]:[gap:42px] max-[950px]:[padding:55px_0] max-[600px]:[width:calc(100%_-_36px)] max-[600px]:[padding:42px_0_35px] max-[600px]:[gap:32px]"}>
        <section className={"auth-intro [max-width:620px] max-[950px]:[max-width:650px]"} aria-labelledby="intro-title">
          <div className={"intro-content reveal animate-rise-in motion-reduce:[animation:none]"}>
            <p className={"page-tag [display:flex] [align-items:center] [gap:10px] [margin:0_0_22px] [color:#aab6d2] [font-size:10px] [font-weight:700] [letter-spacing:.18em] [&_span]:[width:7px] [&_span]:[height:7px] [&_span]:[border-radius:50%] [&_span]:[background:var(--blue)] [&_span]:[box-shadow:0_0_12px_rgba(103,_215,_255,_.6)]"}><span /> YOUR NEXT CHAPTER</p>
            <h1 id="intro-title" className="text-[clamp(2.5rem,5.5vw,4.5rem)] font-semibold leading-[1.02] tracking-[-.06em] text-white max-[600px]:text-[clamp(2.35rem,10vw,3.5rem)]">
              Build your future,
              <span className="block text-violet-300">one step at a time.</span>
            </h1>
            <p className={"intro-copy [max-width:510px] [margin:24px_0_0] [color:var(--muted)] [font-size:14px] [line-height:1.85] max-[600px]:[font-size:13px]"}>One account for your journey across education, digital skills, and entrepreneurship.</p>
          </div>
        </section>
        <section className={"auth-section [width:100%]"} aria-label="Account access">
          <div className={"auth-card reveal [padding:clamp(25px,_3.1vw,_38px)] [border:1px_solid_var(--line)] [border-radius:23px] [background:linear-gradient(_145deg,_rgba(21,_27,_48,_.96),_rgba(11,_15,_29,_.96)_)] [box-shadow:0_28px_85px_rgba(0,_0,_0,_.3)] [&_form]:[padding:20px] [&_form]:[border:1px_solid_rgba(156,_174,_219,_.28)] [&_form]:[border-radius:16px] [&_form]:[background:linear-gradient(145deg,_rgba(35,_48,_72,_.9),_rgba(27,_39,_62,_.86))] max-[950px]:[width:100%] max-[600px]:[padding:23px_18px] max-[600px]:[border-radius:18px] animate-rise-in motion-reduce:[animation:none]"}>
            <div className={"auth-header [display:flex] [align-items:flex-start] [justify-content:space-between] [gap:12px] [margin-bottom:27px] [&_h2]:[margin:11px_0_7px] [&_h2]:[font:600_28px/1.15_var(--display)] [&_h2]:[letter-spacing:-.045em] [&_p]:[margin:0] [&_p]:[color:var(--muted)] [&_p]:[font-size:13px] [&_p]:[line-height:1.6] max-[600px]:[flex-direction:column] max-[600px]:[margin-bottom:23px] max-[600px]:[&_h2]:[font-size:26px]"}>
              <div>
                <span className={"auth-label [color:var(--blue)] [font-size:9px] [font-weight:700] [letter-spacing:.16em]"}>{mode === "signup" ? "CREATE ACCOUNT" : "SIGN IN"}</span>
                <h2>{mode === "signup" ? "Create your account" : "Welcome back"}</h2>
                <p>{mode === "signup" ? "Start your CEO JACK journey." : "Continue your learning journey."}</p>
              </div>
              <span className={"account-pill [&_span]:[width:5px] [&_span]:[height:5px] [&_span]:[border-radius:50%] [&_span]:[background:var(--blue)] [&_span]:[box-shadow:0_0_12px_rgba(103,_215,_255,_.6)] [display:inline-flex] [align-items:center] [gap:7px] [padding:8px_9px] [border:1px_solid_rgba(103,_215,_255,_.15)] [border-radius:20px] [color:#aab8d1] [font-size:8px] [white-space:nowrap] max-[600px]:[align-self:flex-start]"}><span /> Get started free</span>
            </div>
            <form noValidate onSubmit={handleSubmit}>
              <div className={"form-panel-heading [display:flex] [align-items:center] [gap:11px] [margin-bottom:19px] [padding-bottom:15px] [border-bottom:1px_solid_rgba(255,_255,_255,_.08)] [&_>_span]:[display:grid] [&_>_span]:[width:35px] [&_>_span]:[height:35px] [&_>_span]:[flex:0_0_35px] [&_>_span]:[place-items:center] [&_>_span]:[border:1px_solid_rgba(155,_123,_255,_.3)] [&_>_span]:[border-radius:10px] [&_>_span]:[background:rgba(155,_123,_255,_.16)] [&_>_span]:[color:#c6b8ff] [&_div]:[display:grid] [&_div]:[gap:3px] [&_strong]:[color:#f4f6ff] [&_strong]:[font-size:13px] [&_small]:[color:#c1cbe0] [&_small]:[font-size:11px] [&_small]:[line-height:1.5]"}><span aria-hidden="true">✦</span><div><strong>{mode === "signup" ? "Your account details" : "Sign in securely"}</strong><small>Complete the fields below to continue.</small></div></div>
              {mode === "signup" ? <p className={"auth-form-hint [margin:-3px_0_17px] [color:#9ba9c2] [font-size:13px] [line-height:1.6]"}>Create your account and start your CEO JACK Learning Hub journey right away.</p> : null}
              {mode === "signup" ? (
                <div className={(`form-group [margin-bottom:17px] [&_label]:[display:block] [&_label]:[margin-bottom:8px] [&_label]:[color:#f0f3fc] [&_label]:[font-size:13px] [&_label]:[font-weight:650] [&_input]:[width:100%] [&_input]:[min-height:50px] [&_input]:[padding:0_15px] [&_input]:[border:1px_solid_rgba(173,_189,_225,_.34)] [&_input]:[border-radius:10px] [&_input]:[background:#eef2fa] [&_input]:[color:#1d2940] [&_input]:[color-scheme:light] [&_input]:[font-size:15px] [&_input]:[transition:border-color_.2s,_box-shadow_.2s] [&_input::placeholder]:[color:#68758c] [&_input:focus]:[border-color:#7b68d8] [&_input:focus]:[outline:none] [&_input:focus]:[box-shadow:0_0_0_3px_rgba(155,_123,_255,_.2)]${errors.fullName ? "invalid [&_input]:[border-color:#ff8296]" : ""}`)}>
                  <label htmlFor="fullName">Full name</label>
                  <input id="fullName" name="name" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Enter your full name" autoComplete="name" required aria-invalid={Boolean(errors.fullName)} aria-describedby={errors.fullName ? "fullName-error" : undefined} />
                  <small id="fullName-error" className={"field-error [display:block] [min-height:0] [margin-top:5px] [color:#ff91a3] [font-size:12px] [line-height:1.5] [&:empty]:[display:none]"}>{errors.fullName}</small>
                </div>
              ) : null}
              <div className={(`form-group [margin-bottom:17px] [&_label]:[display:block] [&_label]:[margin-bottom:8px] [&_label]:[color:#f0f3fc] [&_label]:[font-size:13px] [&_label]:[font-weight:650] [&_input]:[width:100%] [&_input]:[min-height:50px] [&_input]:[padding:0_15px] [&_input]:[border:1px_solid_rgba(173,_189,_225,_.34)] [&_input]:[border-radius:10px] [&_input]:[background:#eef2fa] [&_input]:[color:#1d2940] [&_input]:[color-scheme:light] [&_input]:[font-size:15px] [&_input]:[transition:border-color_.2s,_box-shadow_.2s] [&_input::placeholder]:[color:#68758c] [&_input:focus]:[border-color:#7b68d8] [&_input:focus]:[outline:none] [&_input:focus]:[box-shadow:0_0_0_3px_rgba(155,_123,_255,_.2)]${errors.email ? "invalid [&_input]:[border-color:#ff8296]" : ""}`)}>
                <label htmlFor="email">Email address</label>
                <input id="email" name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="example@gmail.com" autoComplete="email" required aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "email-error" : undefined} />
                <small id="email-error" className={"field-error [display:block] [min-height:0] [margin-top:5px] [color:#ff91a3] [font-size:12px] [line-height:1.5] [&:empty]:[display:none]"}>{errors.email}</small>
              </div>
              <div className={(`form-group [margin-bottom:17px] [&_label]:[display:block] [&_label]:[margin-bottom:8px] [&_label]:[color:#f0f3fc] [&_label]:[font-size:13px] [&_label]:[font-weight:650] [&_input]:[width:100%] [&_input]:[min-height:50px] [&_input]:[padding:0_15px] [&_input]:[border:1px_solid_rgba(173,_189,_225,_.34)] [&_input]:[border-radius:10px] [&_input]:[background:#eef2fa] [&_input]:[color:#1d2940] [&_input]:[color-scheme:light] [&_input]:[font-size:15px] [&_input]:[transition:border-color_.2s,_box-shadow_.2s] [&_input::placeholder]:[color:#68758c] [&_input:focus]:[border-color:#7b68d8] [&_input:focus]:[outline:none] [&_input:focus]:[box-shadow:0_0_0_3px_rgba(155,_123,_255,_.2)]${errors.password ? "invalid [&_input]:[border-color:#ff8296]" : ""}`)}>
                <div className={"label-row [display:flex] [align-items:center] [justify-content:space-between]"}>
                  <label htmlFor="password">Password</label>
                  <button className={"text-button [padding:0] [border:0] [background:none] [color:var(--blue)] [font-size:10px] [cursor:pointer] [&:hover]:[color:#fff]"} type="button" onClick={() => setShowPassword((v) => !v)}>
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                <input id="password" name="password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" autoComplete={mode === "signup" ? "new-password" : "current-password"} required aria-invalid={Boolean(errors.password)} aria-describedby={errors.password ? "password-error" : undefined} />
                {mode === "signup" ? (
                  <div className={"password-strength [margin-top:10px] [&_small]:[color:#c1cbe0] [&_small]:[font-size:11px]"}>
                    <div className={"strength-bar [display:flex] [gap:5px] [margin-bottom:6px] [&_span]:[height:3px] [&_span]:[flex:1] [&_span]:[border-radius:4px] [&_span]:[background:rgba(255,_255,_255,_.09)] [&_span]:[transition:background_.2s]"} aria-hidden="true">
                      {Array.from({ length: 4 }).map((_, index) => (
                        <span key={index} style={{ background: index < strength ? (strength < 3 ? "#ffbd72" : "#67d7ff") : "rgba(255,255,255,.09)" }} />
                      ))}
                    </div>
                    <small>{password ? ["Weak password", "Fair password", "Good password", "Strong password"][Math.max(0, strength - 1)] : "Use at least 8 characters"}</small>
                  </div>
                ) : null}
                <small id="password-error" className={"field-error [display:block] [min-height:0] [margin-top:5px] [color:#ff91a3] [font-size:12px] [line-height:1.5] [&:empty]:[display:none]"}>{errors.password}</small>
              </div>
              {mode === "signup" ? (
                <>
                  <div className={(`form-group [margin-bottom:17px] [&_label]:[display:block] [&_label]:[margin-bottom:8px] [&_label]:[color:#f0f3fc] [&_label]:[font-size:13px] [&_label]:[font-weight:650] [&_input]:[width:100%] [&_input]:[min-height:50px] [&_input]:[padding:0_15px] [&_input]:[border:1px_solid_rgba(173,_189,_225,_.34)] [&_input]:[border-radius:10px] [&_input]:[background:#eef2fa] [&_input]:[color:#1d2940] [&_input]:[color-scheme:light] [&_input]:[font-size:15px] [&_input]:[transition:border-color_.2s,_box-shadow_.2s] [&_input::placeholder]:[color:#68758c] [&_input:focus]:[border-color:#7b68d8] [&_input:focus]:[outline:none] [&_input:focus]:[box-shadow:0_0_0_3px_rgba(155,_123,_255,_.2)]${errors.confirmPassword ? "invalid [&_input]:[border-color:#ff8296]" : ""}`)}>
                    <label htmlFor="confirmPassword">Confirm password</label>
                    <input id="confirmPassword" name="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Enter your password again" autoComplete="new-password" required aria-invalid={Boolean(errors.confirmPassword)} aria-describedby={errors.confirmPassword ? "confirmPassword-error" : undefined} />
                    <small id="confirmPassword-error" className={"field-error [display:block] [min-height:0] [margin-top:5px] [color:#ff91a3] [font-size:12px] [line-height:1.5] [&:empty]:[display:none]"}>{errors.confirmPassword}</small>
                  </div>
                  <label className={"terms [display:flex] [align-items:flex-start] [gap:9px] [margin:5px_0_7px] [color:#929fba] [font-size:12px] [line-height:1.6] [&_input]:[width:14px] [&_input]:[height:14px] [&_input]:[margin:2px_0_0] [&_input]:[accent-color:#70d8ff] [&_input]:[flex-shrink:0] [&_a]:[color:var(--blue)] [&_a]:[text-decoration:underline] [&_a]:[text-underline-offset:2px]"}>
                    <input type="checkbox" checked={terms} onChange={(e) => setTerms(e.target.checked)} />
                    <span>
                      I agree to the <Link href="/terms">Terms</Link> and <Link href="/privacy">Privacy Policy</Link>.
                    </span>
                  </label>
                  <small className={"field-error terms-error [display:block] [min-height:0] [margin-top:5px] [color:#ff91a3] [font-size:12px] [line-height:1.5] [&:empty]:[display:none] [margin:0_0_10px]"}>{errors.terms}</small>
                </>
              ) : null}
              <button type="submit" className={"submit-btn [width:100%] [min-height:49px] [display:flex] [align-items:center] [justify-content:space-between] [gap:15px] [margin-top:20px] [padding:0_16px] [border:1px_solid_rgba(103,_215,_255,_.32)] [border-radius:11px] [background:linear-gradient(_105deg,_rgba(52,_177,_226,_.2),_rgba(121,_101,_236,_.22)_)] [color:#fff] [font-size:12px] [font-weight:700] [cursor:pointer] [transition:transform_.2s,_border-color_.2s,_background_.2s] [&:hover]:[transform:translateY(-2px)] [&:hover]:[border-color:rgba(103,_215,_255,_.7)] [&:hover]:[background:linear-gradient(_105deg,_rgba(52,_177,_226,_.28),_rgba(121,_101,_236,_.28)_)] [&:disabled]:[opacity:.65] [&:disabled]:[cursor:wait] [&:disabled]:[transform:none] [&_span:last-child]:[color:var(--blue)] [&_span:last-child]:[font-size:18px]"} disabled={isSubmitting} aria-busy={isSubmitting}>
                <span>{isSubmitting ? mode === "signup" ? "Creating account…" : "Signing in…" : mode === "signup" ? "Create account" : "Sign in"}</span>
                <span aria-hidden="true">→</span>
              </button>
              {mode === "signin" ? <Link className={"forgot-password-button [display:block] [width:fit-content] [margin:12px_0_0_auto] [color:#aebdff] [font-size:11px] [font-weight:600] [&:hover]:[color:#fff]"} href="/forgot-password">Forgot your password?</Link> : null}
              <p className={(`form-status [margin:10px_0_0] [color:var(--blue)] [font-size:11px] [line-height:1.6]${statusType}`)} role="status">{status}</p>
              {signupExistingAccount && mode === "signup" ? (
                <div className={"auth-inline-action [display:flex] [flex-wrap:wrap] [align-items:center] [justify-content:center] [gap:8px] [margin-top:10px] [color:#b8c3d8] [font-size:12px] [text-align:center] [&_button]:[min-height:38px] [&_button]:[padding:0_15px] [&_button]:[border:1px_solid_rgba(179,_161,_255,_.48)] [&_button]:[border-radius:9px] [&_button]:[background:rgba(155,_123,_255,_.15)] [&_button]:[color:#e2d9ff] [&_button]:[font:inherit] [&_button]:[font-weight:700] [&_button]:[cursor:pointer] [&_button]:[transition:background_.18s_ease,_border-color_.18s_ease,_transform_.18s_ease] [&_button:hover]:[transform:translateY(-1px)] [&_button:hover]:[border-color:#b3a1ff] [&_button:hover]:[background:rgba(155,_123,_255,_.25)] [&_button:focus-visible]:[outline:3px_solid_rgba(179,_161,_255,_.75)] [&_button:focus-visible]:[outline-offset:3px]"}>
                  <button type="button" onClick={switchMode}>Go to Sign In <span aria-hidden="true">→</span></button>
                </div>
              ) : null}
              {signinInvalidCredentials && mode === "signin" ? (
                <div className={"auth-inline-action [display:flex] [flex-wrap:wrap] [align-items:center] [justify-content:center] [gap:8px] [margin-top:10px] [color:#b8c3d8] [font-size:12px] [text-align:center] [&_button]:[min-height:38px] [&_button]:[padding:0_15px] [&_button]:[border:1px_solid_rgba(179,_161,_255,_.48)] [&_button]:[border-radius:9px] [&_button]:[background:rgba(155,_123,_255,_.15)] [&_button]:[color:#e2d9ff] [&_button]:[font:inherit] [&_button]:[font-weight:700] [&_button]:[cursor:pointer] [&_button]:[transition:background_.18s_ease,_border-color_.18s_ease,_transform_.18s_ease] [&_button:hover]:[transform:translateY(-1px)] [&_button:hover]:[border-color:#b3a1ff] [&_button:hover]:[background:rgba(155,_123,_255,_.25)] [&_button:focus-visible]:[outline:3px_solid_rgba(179,_161,_255,_.75)] [&_button:focus-visible]:[outline-offset:3px]"}>
                  <span>No account?</span>
                  <button type="button" onClick={switchMode}>Create Account</button>
                </div>
              ) : null}
            </form>
            <div className={"social-divider [display:flex] [align-items:center] [gap:12px] [margin:22px_0_14px] [color:#74819c] [font-size:8px] [font-weight:700] [letter-spacing:.16em] [&::before]:[content:\"\"] [&::before]:[height:1px] [&::before]:[flex:1] [&::before]:[background:rgba(99,_133,_255,_.13)] [&::after]:[content:\"\"] [&::after]:[height:1px] [&::after]:[flex:1] [&::after]:[background:rgba(99,_133,_255,_.13)]"}><span>OR CONTINUE WITH</span></div>
            <div className={"social-login [display:grid] [grid-template-columns:1fr] [gap:10px] max-[420px]:[grid-template-columns:1fr]"}>
              <button className={"social-button google-button [min-width:0] [min-height:50px] [display:flex] [align-items:center] [justify-content:center] [gap:7px] [padding:8px_6px] [border:1px_solid_rgba(99,_133,_255,_.15)] [border-radius:10px] [background:rgba(255,_255,_255,_.06)] [color:#e7ebf8] [font-size:13px] [font-weight:600] [cursor:pointer] [transition:background_.2s,_border-color_.2s,_transform_.2s] [&_svg]:[width:16px] [&_svg]:[height:16px] [&_svg]:[flex:0_0_16px] [&:hover]:[transform:translateY(-1px)] [&:hover]:[border-color:rgba(255,_255,_255,_.38)] [&:hover]:[background:rgba(255,_255,_255,_.1)] [&:disabled]:[opacity:.6] [&:disabled]:[cursor:wait] [&:disabled]:[transform:none] max-[420px]:[min-height:45px] motion-reduce:[transition:none] motion-reduce:[&:hover]:[transform:none] [border-color:rgba(255,_255,_255,_.18)]"} type="button" onClick={handleGoogle} disabled={isSubmitting}>
                <svg viewBox="0 0 48 48" aria-hidden="true" focusable="false">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z" />
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.76 7.18l7.73 6C44.42 37.98 46.98 31.9 46.98 24.55Z" />
                  <path fill="#FBBC05" d="M10.53 28.59a14.4 14.4 0 0 1 0-9.18l-7.98-6.2a23.9 23.9 0 0 0 0 21.57l7.98-6.2Z" />
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.9-5.8l-7.73-6c-2.14 1.44-4.88 2.3-8.17 2.3-6.26 0-11.57-4.22-13.46-9.91l-7.98 6.2C6.51 42.62 14.62 48 24 48Z" />
                </svg>
                <span>Continue with Google</span>
              </button>
            </div>
            <div className={"auth-switch [display:flex] [flex-wrap:wrap] [align-items:center] [justify-content:center] [gap:6px] [margin-top:22px] [color:#b8c3d8] [font-size:13px] [&_button]:[min-height:38px] [&_button]:[padding:0_15px] [&_button]:[border:1px_solid_rgba(179,_161,_255,_.48)] [&_button]:[border-radius:9px] [&_button]:[background:rgba(155,_123,_255,_.15)] [&_button]:[color:#e2d9ff] [&_button]:[font-weight:700] [&_button]:[cursor:pointer] [&_button]:[transition:background_.18s_ease,_border-color_.18s_ease,_transform_.18s_ease] [&_button:hover]:[transform:translateY(-1px)] [&_button:hover]:[border-color:#b3a1ff] [&_button:hover]:[background:rgba(155,_123,_255,_.25)] [&_button:focus-visible]:[outline:3px_solid_rgba(179,_161,_255,_.75)] [&_button:focus-visible]:[outline-offset:3px]"}>
              <span>{mode === "signup" ? "Already have an account?" : "New here?"}</span>
              <button type="button" onClick={switchMode}>
                {mode === "signup" ? "Sign in" : "Create account"}
              </button>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
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
