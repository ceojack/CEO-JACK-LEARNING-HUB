"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SiteFooter } from "@/src/components/footer";
import { useReveal } from "@/src/hooks/use-reveal";
import { createClient } from "@/src/utils/supabase/client";
import { isSupabaseConfigured } from "@/src/utils/supabase/config";

const levels = ["Primary", "Secondary", "Higher Education", "Independent Learner"];
const interests = ["School & Education", "Web Development", "Programming", "AI", "Business", "Design"];
const goals = ["Improve school results", "Learn digital skills", "Build projects", "Start a small idea"];
type SavedLearnerProfile = { level?: string; ageGroup?: string; interests?: string[]; goals?: string[] };
const stepLabels = ["Your level", "Interests", "Goals", "Review"];
const stepGuidance = [
  "Choose the level that best describes you and your age group. This helps us recommend learning at the right pace.",
  "Choose every area you would like to explore. You can change these choices whenever you like.",
  "Pick the outcomes you care about most. We’ll use them to shape your recommended next steps.",
  "Check your choices. You can go back to update anything before opening your learning dashboard.",
];

export default function OnboardingPage() {
  useReveal();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [level, setLevel] = useState("");
  const [ageGroup, setAgeGroup] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [status, setStatus] = useState("");
  const [statusType, setStatusType] = useState<"success" | "error" | "">("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      void (async () => {
        try {
          let profile: SavedLearnerProfile | null = null;
          if (isSupabaseConfigured()) {
            const response = await fetch("/api/profile", { cache: "no-store" });
            if (!response.ok) {
              setStatus("Your saved learning path could not be loaded. You can still set a new path.");
              return;
            }
            const result = await response.json() as { profile: SavedLearnerProfile | null };
            profile = result.profile;
          } else {
            const saved = window.localStorage.getItem("ceoJackOnboarding");
            profile = saved ? JSON.parse(saved) as SavedLearnerProfile : null;
          }
          if (!profile) return;
          if (profile.level && levels.includes(profile.level)) setLevel(profile.level);
          if (profile.ageGroup) setAgeGroup(profile.ageGroup);
          if (Array.isArray(profile.interests)) setSelectedInterests(profile.interests.filter((item) => interests.includes(item)));
          if (Array.isArray(profile.goals)) setSelectedGoals(profile.goals.filter((item) => goals.includes(item)));
        } catch {
          setStatus("Your saved learning path could not be loaded. You can still set a new path.");
        }
      })();
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  function toggle(list: string[], value: string, setter: (next: string[]) => void) {
    setter(list.includes(value) ? list.filter((item) => item !== value) : [...list, value]);
  }

  async function enterDashboard() {
    const profile = {
      level,
      ageGroup,
      interests: [...selectedInterests],
      goals: [...selectedGoals],
    };
    try {
      window.localStorage.setItem("ceoJackOnboarding", JSON.stringify(profile));
    } catch (error) {
      console.log("Could not cache the learner profile:", error);
    }

    if (isSupabaseConfigured()) {
      setSaving(true);
      setStatusType("");
      setStatus("Saving your learning path…");
      try {
        const { data: authData, error: authError } = await createClient().auth.getSession();
        if (authError) throw authError;
        const accessToken = authData.session?.access_token;
        const response = await fetch("/api/profile", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
          },
          body: JSON.stringify(profile),
        });
        if (!response.ok) {
          const result = await response.json().catch(() => null) as { error?: string } | null;
          throw new Error(result?.error ?? "Your learning path could not be saved. Please try again.");
        }
        try {
          window.localStorage.removeItem("ceoJackOnboarding");
        } catch {}
      } catch (error) {
        setStatusType("error");
        setStatus(error instanceof Error ? error.message : "Your learning path could not be saved. Please try again.");
        setSaving(false);
        return;
      }
    }

    setStatusType("success");
    setStatus("Your learning path is ready. Opening your dashboard…");
    router.push("/dashboard");
    router.refresh();
  }

  function next() {
    if (step === 1 && (!level || !ageGroup)) {
      setStatusType("error");
      setStatus("Choose your learning level and age group.");
      return;
    }
    if (step === 2 && selectedInterests.length === 0) {
      setStatusType("error");
      setStatus("Select at least one interest.");
      return;
    }
    if (step === 3 && selectedGoals.length === 0) {
      setStatusType("error");
      setStatus("Select at least one goal.");
      return;
    }
    setStatus("");
    setStatusType("");
    setStep((value) => value + 1);
  }

  return (
    <>
      <div className={"background [position:fixed] [inset:0] [overflow:hidden] [pointer-events:none] [z-index:-2]"} aria-hidden="true">
        <div className={"grid [position:absolute] [inset:-50%] [background-image:linear-gradient(_rgba(0,_200,_255,_0.045)_1px,_transparent_1px_),_linear-gradient(_90deg,_rgba(0,_200,_255,_0.045)_1px,_transparent_1px_)] [background-size:60px_60px] [transform:perspective(500px)_rotateX(60deg)] animate-grid-move"} />
        <div className={"glow glow-one [position:absolute] [width:440px] [height:440px] [border-radius:50%] [filter:blur(110px)] [opacity:0.14] [background:#9b7bff] [top:5%] [left:5%] animate-glow-float-10"} />
        <div className={"glow glow-two [position:absolute] [width:440px] [height:440px] [border-radius:50%] [filter:blur(110px)] [opacity:0.14] [background:#6385ff] [bottom:5%] [right:5%] animate-glow-float-12-reverse"} />
      </div>
      <header className={"topbar [width:100%] [padding:22px_6%] [display:flex] [align-items:center] [justify-content:space-between] max-[600px]:[padding:17px_5%]"}>
        <Link href="/" className={"logo [display:flex] [align-items:center] [gap:12px]"}>
          <span className={"logo-mark [width:44px] [height:44px] [display:grid] [place-items:center] [border:1px_solid_rgba(85,221,255,0.4)] [border-radius:12px] [background:rgba(85,221,255,0.05)] [color:#9b7bff] [font-weight:800]"}>&lt;/&gt;</span>
          <span className={"logo-text [font-size:14px] [font-weight:800] [letter-spacing:1px] [&_small]:[display:block] [&_small]:[margin-top:3px] [&_small]:[color:#69798c] [&_small]:[font-size:8px] [&_small]:[letter-spacing:3px]"}>
            CEO JACK
            <small>LEARNING HUB</small>
          </span>
        </Link>
        <div className={"progress-info [display:flex] [align-items:center] [gap:9px] [color:#586a7e] [font-size:12px] [letter-spacing:2px] [&_strong]:[color:#9b7bff] [&_strong]:[font-size:15px] max-[600px]:[font-size:7px]"}>
          <span>SETUP</span>
          <strong>Step {step} of 4</strong>
        </div>
      </header>
      <main className={"onboarding-page [width:88%] [max-width:950px] [margin:0_auto] [padding:40px_0_70px] max-[800px]:[width:90%] max-[600px]:[width:92%] max-[600px]:[padding-top:25px]"}>
        <div className={"onboarding-intro reveal [max-width:700px] [margin:0_auto_45px] [text-align:center] [&_h1]:[font-size:clamp(42px,_6vw,_68px)] [&_h1]:[line-height:1] [&_h1]:[letter-spacing:-3px] [&_h1_span]:[display:block]    [&_h1_span]:[color:#c4b5fd] [&_p]:[max-width:600px] [&_p]:[margin:24px_auto_0] [&_p]:[color:#b0bdd0] [&_p]:[font-size:18px] [&_p]:[line-height:1.8] max-[600px]:[&_h1]:[font-size:43px] max-[600px]:[&_h1]:[letter-spacing:-2px] max-[600px]:[&_p]:[font-size:16px] [opacity:0] [transform:translateY(25px)] [transition:opacity_0.75s_ease,_transform_0.75s_ease]"}>
          <span className={"page-tag [display:inline-block] [margin-bottom:20px] [color:#9b7bff] [font-size:13px] [letter-spacing:1.5px]"}>✦ PERSONALIZE YOUR EXPERIENCE</span>
          <h1>
            Let&apos;s make CEO JACK
            <span> fit you.</span>
          </h1>
          <p>A few quick questions will help us understand your learning direction.</p>
        </div>
        <nav className={"onboarding-progress [max-width:760px] [margin:0_auto_22px] [&_ol]:[display:grid] [&_ol]:[grid-template-columns:repeat(4,_minmax(0,_1fr))] [&_ol]:[gap:8px] [&_ol]:[margin:12px_0_0] [&_ol]:[padding:0] [&_ol]:[list-style:none] [&_li]:[display:flex] [&_li]:[align-items:center] [&_li]:[gap:8px] [&_li]:[color:#aebbd0] [&_li]:[font-size:14px] [&_li]:[line-height:1.35] max-[600px]:[&_li]:[flex-direction:column] max-[600px]:[&_li]:[gap:5px] max-[600px]:[&_li]:[text-align:center] max-[600px]:[&_li]:[font-size:12px]"} aria-label="Onboarding progress">
          <div className={"onboarding-progress-track [height:5px] [overflow:hidden] [border-radius:999px] [background:rgba(255,_255,_255,_0.12)] [&_span]:[display:block] [&_span]:[height:100%] [&_span]:[border-radius:inherit] [&_span]:[background:linear-gradient(90deg,_#9b7bff,_#6385ff)] [&_span]:[transition:width_0.25s_ease]"} aria-hidden="true"><span style={{ width: `${step * 25}%` }} /></div>
          <ol>
            {stepLabels.map((label, index) => (
              <li key={label} className={(index + 1 === step ? "current [color:#fff] [font-weight:700]" : index + 1 < step ? "complete" : "")} aria-current={index + 1 === step ? "step" : undefined}>
                <span className={"progress-number [display:grid] [width:30px] [height:30px] [flex:0_0_auto] [place-items:center] [border:1px_solid_rgba(255,_255,_255,_0.2)] [border-radius:50%] [color:#fff] [font-size:13px] [font-weight:700] [border-color:#9b7bff] [background:rgba(155,_123,_255,_0.2)]"}>{index + 1 < step ? "✓" : `0${index + 1}`}</span>
                <span>{label}</span>
              </li>
            ))}
          </ol>
        </nav>
        <section className={"onboarding-card reveal [padding:38px] [border:1px_solid_rgba(255,255,255,0.09)] [border-radius:25px] [background:linear-gradient(_145deg,_rgba(255,255,255,0.05),_rgba(255,255,255,0.015)_)] [backdrop-filter:blur(18px)] [box-shadow:0_30px_80px_rgba(0,0,0,0.26)] max-[600px]:[padding:24px_17px] max-[600px]:[border-radius:20px] [opacity:0] [transform:translateY(25px)] [transition:opacity_0.75s_ease,_transform_0.75s_ease]"}>
          {step === 1 ? (
            <div className={"form-step active [display:block] animate-step-in [&_span]:[border-color:rgba(85,221,255,0.5)] [&_span]:[background:rgba(85,221,255,0.08)] [&_span]:[color:#9b7bff] [&_small]:[color:#8b9bad]"}>
              <div className={"step-heading [margin-bottom:28px] [&_h2]:[margin-top:12px] [&_h2]:[max-width:650px] [&_h2]:[font-size:clamp(30px,4vw,48px)] [&_h2]:[line-height:1.05] [&_h2]:[letter-spacing:-2px]    [&_h2_span]:[color:#c4b5fd] [&_p]:[margin-top:15px] [&_p]:[color:#b0bdd0] [&_p]:[font-size:17px] [&_p]:[line-height:1.65] [&_p]:[max-width:680px] max-[600px]:[&_p]:[font-size:16px]"}>
                <span className={"step-label [color:#9b7bff] [font-size:13px] [letter-spacing:1.5px]"}>STEP 01</span>
                <h2>Tell us about your <span>learning level.</span></h2>
                <p>{stepGuidance[0]}</p>
              </div>
              <div className={"option-grid [display:grid] [grid-template-columns:repeat(2,_1fr)] [gap:12px] max-[600px]:[grid-template-columns:1fr]"}>
                {levels.map((item) => (
                  <label key={item} className={"option-card [position:relative] [display:flex] [align-items:center] [justify-content:space-between] [gap:15px] [min-height:88px] [padding:20px] [border:1px_solid_rgba(255,255,255,0.08)] [border-radius:13px] [background:rgba(255,255,255,0.02)] [cursor:pointer] [transition:0.3s] [&:hover]:[border-color:rgba(85,221,255,0.2)] [&:hover]:[transform:translateY(-2px)] [&_input]:[position:absolute] [&_input]:[opacity:0] [&_input]:[pointer-events:none] [&:has(input:checked)]:[border-color:rgba(85,221,255,0.35)] [&:has(input:checked)]:[background:rgba(85,221,255,0.055)] [&:focus-within]:[outline:3px_solid_rgba(155,_123,_255,_0.85)] [&:focus-within]:[outline-offset:3px]"}>
                    <input type="radio" name="learningLevel" checked={level === item} onChange={() => setLevel(item)} />
                    <span className={"option-content [&_strong]:[display:block] [&_strong]:[color:#f1f3fa] [&_strong]:[font-size:17px] [&_small]:[display:block] [&_small]:[margin-top:5px] [&_small]:[color:#5e7084] [&_small]:[font-size:9px] [&_strong]:[line-height:1.4]"}><strong>{item}</strong></span>
                  </label>
                ))}
              </div>
              <label className={"age-select-label [display:block] [margin:24px_0_9px] [color:#e0e6f1] [font-size:16px] [font-weight:600]"} htmlFor="ageGroup">Age group</label>
              <select id="ageGroup" className={(`age-select [width:100%] [min-height:60px] [padding:0_16px] [appearance:none] [border:1px_solid_rgba(155,_123,_255,_0.28)] [border-radius:12px] [background-color:#eef2fa] [background-image:url("data:image/svg+xml,%3Csvg_xmlns='http://www.w3.org/2000/svg'_width='16'_height='16'_viewBox='0_0_16_16'_fill='none'%3E%3Cpath_d='m4_6_4_4_4-4'_stroke='%239b7bff'_stroke-width='1.7'_stroke-linecap='round'_stroke-linejoin='round'/%3E%3C/svg%3E")] [background-repeat:no-repeat] [background-position:right_16px_center] [color:#1d2940] [color-scheme:light] [font-size:17px] [cursor:pointer] [transition:border-color_0.2s_ease,_box-shadow_0.2s_ease,_background-color_0.2s_ease] [&:hover]:[border-color:rgba(155,_123,_255,_0.58)] [&:hover]:[background-color:#fff] [&:focus-visible]:[outline:none] [&:focus-visible]:[border-color:#9b7bff] [&:focus-visible]:[box-shadow:0_0_0_4px_rgba(155,_123,_255,_0.16)] [&_option]:[background:#fff] [&_option]:[color:#1d2940]${ageGroup ? "has-value [color:#1d2940]" : ""}`)} value={ageGroup} onChange={(event) => setAgeGroup(event.target.value)}>
                <option value="">Select your age group</option>
                <option>Under 13</option>
                <option>13 - 15</option>
                <option>16 - 18</option>
                <option>19 - 24</option>
                <option>25+</option>
              </select>
            </div>
          ) : null}
          {step === 2 ? (
            <div className={"form-step active [display:block] animate-step-in [&_span]:[border-color:rgba(85,221,255,0.5)] [&_span]:[background:rgba(85,221,255,0.08)] [&_span]:[color:#9b7bff] [&_small]:[color:#8b9bad]"}>
              <div className={"step-heading [margin-bottom:28px] [&_h2]:[margin-top:12px] [&_h2]:[max-width:650px] [&_h2]:[font-size:clamp(30px,4vw,48px)] [&_h2]:[line-height:1.05] [&_h2]:[letter-spacing:-2px]    [&_h2_span]:[color:#c4b5fd] [&_p]:[margin-top:15px] [&_p]:[color:#b0bdd0] [&_p]:[font-size:17px] [&_p]:[line-height:1.65] [&_p]:[max-width:680px] max-[600px]:[&_p]:[font-size:16px]"}>
                <span className={"step-label [color:#9b7bff] [font-size:13px] [letter-spacing:1.5px]"}>STEP 02</span>
                <h2>What are you <span>interested in?</span></h2>
                <p>{stepGuidance[1]}</p>
              </div>
              <div className={"interest-grid [display:grid] [grid-template-columns:repeat(4,_1fr)] [gap:11px] max-[800px]:[grid-template-columns:repeat(2,1fr)] max-[600px]:[grid-template-columns:repeat(2,1fr)]"}>
                {interests.map((item) => (
                  <label key={item} className={"interest-card [position:relative] [min-height:100px] [padding:17px] [border:1px_solid_rgba(255,255,255,0.08)] [border-radius:13px] [background:rgba(255,255,255,0.02)] [cursor:pointer] [transition:0.3s] [&:hover]:[border-color:rgba(85,221,255,0.22)] [&:hover]:[transform:translateY(-2px)] [&_input]:[position:absolute] [&_input]:[opacity:0] [&_input]:[pointer-events:none] [&:has(input:checked)]:[border-color:rgba(85,221,255,0.38)] [&:has(input:checked)]:[background:rgba(85,221,255,0.055)] [display:flex] [align-items:flex-end] [&:focus-within]:[outline:3px_solid_rgba(155,_123,_255,_0.85)] [&:focus-within]:[outline-offset:3px]"}>
                    <input type="checkbox" checked={selectedInterests.includes(item)} onChange={() => toggle(selectedInterests, item, setSelectedInterests)} />
                    <span className={"interest-text [display:block] [max-width:130px] [color:#e0e6f1] [font-size:16px] [line-height:1.45] max-[600px]:[font-size:15px]"}>{item}</span>
                  </label>
                ))}
              </div>
            </div>
          ) : null}
          {step === 3 ? (
            <div className={"form-step active [display:block] animate-step-in [&_span]:[border-color:rgba(85,221,255,0.5)] [&_span]:[background:rgba(85,221,255,0.08)] [&_span]:[color:#9b7bff] [&_small]:[color:#8b9bad]"}>
              <div className={"step-heading [margin-bottom:28px] [&_h2]:[margin-top:12px] [&_h2]:[max-width:650px] [&_h2]:[font-size:clamp(30px,4vw,48px)] [&_h2]:[line-height:1.05] [&_h2]:[letter-spacing:-2px]    [&_h2_span]:[color:#c4b5fd] [&_p]:[margin-top:15px] [&_p]:[color:#b0bdd0] [&_p]:[font-size:17px] [&_p]:[line-height:1.65] [&_p]:[max-width:680px] max-[600px]:[&_p]:[font-size:16px]"}>
                <span className={"step-label [color:#9b7bff] [font-size:13px] [letter-spacing:1.5px]"}>STEP 03</span>
                <h2>What do you want to <span>achieve?</span></h2>
                <p>{stepGuidance[2]}</p>
              </div>
              <div className={"interest-grid [display:grid] [grid-template-columns:repeat(4,_1fr)] [gap:11px] max-[800px]:[grid-template-columns:repeat(2,1fr)] max-[600px]:[grid-template-columns:repeat(2,1fr)]"}>
                {goals.map((item) => (
                  <label key={item} className={"interest-card [position:relative] [min-height:100px] [padding:17px] [border:1px_solid_rgba(255,255,255,0.08)] [border-radius:13px] [background:rgba(255,255,255,0.02)] [cursor:pointer] [transition:0.3s] [&:hover]:[border-color:rgba(85,221,255,0.22)] [&:hover]:[transform:translateY(-2px)] [&_input]:[position:absolute] [&_input]:[opacity:0] [&_input]:[pointer-events:none] [&:has(input:checked)]:[border-color:rgba(85,221,255,0.38)] [&:has(input:checked)]:[background:rgba(85,221,255,0.055)] [display:flex] [align-items:flex-end] [&:focus-within]:[outline:3px_solid_rgba(155,_123,_255,_0.85)] [&:focus-within]:[outline-offset:3px]"}>
                    <input type="checkbox" checked={selectedGoals.includes(item)} onChange={() => toggle(selectedGoals, item, setSelectedGoals)} />
                    <span className={"interest-text [display:block] [max-width:130px] [color:#e0e6f1] [font-size:16px] [line-height:1.45] max-[600px]:[font-size:15px]"}>{item}</span>
                  </label>
                ))}
              </div>
            </div>
          ) : null}
          {step === 4 ? (
            <div className={"form-step active [display:block] animate-step-in [&_span]:[border-color:rgba(85,221,255,0.5)] [&_span]:[background:rgba(85,221,255,0.08)] [&_span]:[color:#9b7bff] [&_small]:[color:#8b9bad]"}>
              <div className={"step-heading [margin-bottom:28px] [&_h2]:[margin-top:12px] [&_h2]:[max-width:650px] [&_h2]:[font-size:clamp(30px,4vw,48px)] [&_h2]:[line-height:1.05] [&_h2]:[letter-spacing:-2px]    [&_h2_span]:[color:#c4b5fd] [&_p]:[margin-top:15px] [&_p]:[color:#b0bdd0] [&_p]:[font-size:17px] [&_p]:[line-height:1.65] [&_p]:[max-width:680px] max-[600px]:[&_p]:[font-size:16px]"}>
                <span className={"step-label [color:#9b7bff] [font-size:13px] [letter-spacing:1.5px]"}>STEP 04</span>
                <h2>Review your <span>path.</span></h2>
                <p>{stepGuidance[3]}</p>
              </div>
              <div className={"onboarding-review [display:grid] [grid-template-columns:repeat(2,_minmax(0,_1fr))] [gap:12px] [&_p]:[display:grid] [&_p]:[align-content:start] [&_p]:[gap:8px] [&_p]:[min-height:96px] [&_p]:[padding:18px] [&_p]:[border:1px_solid_rgba(155,_123,_255,_0.16)] [&_p]:[border-radius:12px] [&_p]:[background:rgba(155,_123,_255,_0.045)] [&_p_span]:[color:#b0bdd0] [&_p_span]:[font-size:13px] [&_p_span]:[letter-spacing:0.7px] [&_p_span]:[text-transform:uppercase] [&_p_strong]:[color:#fff] [&_p_strong]:[font-size:16px] [&_p_strong]:[font-weight:600] [&_p_strong]:[line-height:1.5] [&_p_strong]:[overflow-wrap:anywhere] max-[600px]:[grid-template-columns:1fr]"}>
                <p><span>Learning level</span><strong>{level}</strong></p>
                <p><span>Age group</span><strong>{ageGroup}</strong></p>
                <p><span>Interests</span><strong>{selectedInterests.join(", ")}</strong></p>
                <p><span>Your goals</span><strong>{selectedGoals.join(", ")}</strong></p>
              </div>
            </div>
          ) : null}
          <p className={(`onboarding-status [min-height:24px] [margin-top:14px] [text-align:center] [font-size:15px]${statusType ? `${statusType}` : ""}`)} role="status" aria-live="polite">{status}</p>
          <div className={"step-actions [display:flex] [align-items:center] [justify-content:space-between] [gap:14px] [margin-top:28px] [padding-top:22px] [border-top:1px_solid_rgba(255,255,255,0.08)] [&_button:only-child]:[margin-left:auto] max-[420px]:[gap:10px]"}>
            {step > 1 ? (
              <button className={"nav-btn back-btn [min-height:52px] [display:flex] [align-items:center] [gap:18px] [padding:0_18px] [border-radius:10px] [font-size:16px] [transition:0.3s] [font-weight:700] max-[420px]:[min-height:44px] max-[420px]:[padding:0_15px] [border:1px_solid_rgba(255,255,255,0.08)] [background:rgba(255,255,255,0.02)] [color:#c2ccda] [&:hover]:[color:#fffdf8] [&:hover]:[border-color:rgba(255,255,255,0.15)] [&:focus-visible]:[outline:3px_solid_rgba(150,_127,_255,_0.8)] [&:focus-visible]:[outline-offset:3px]"} type="button" onClick={() => { setStatus(""); setStep((value) => value - 1); }}>Back</button>
            ) : null}
            <button className={"nav-btn next-btn [min-height:52px] [display:flex] [align-items:center] [gap:18px] [padding:0_18px] [border-radius:10px] [font-size:16px] [transition:0.3s] [font-weight:700] max-[420px]:[min-height:44px] max-[420px]:[padding:0_15px] [&:focus-visible]:[outline:3px_solid_rgba(150,_127,_255,_0.8)] [&:focus-visible]:[outline-offset:3px] [border:none] [background:linear-gradient(_135deg,_#9b7bff,_#6385ff_)] [color:#fffdf8] [box-shadow:0_10px_25px_rgba(45,160,255,0.13)] [&:hover]:[transform:translateY(-3px)] [&:hover]:[box-shadow:0_14px_30px_rgba(45,160,255,0.22)] [&:disabled]:[opacity:0.6] [&:disabled]:[cursor:not-allowed] [&:disabled]:[transform:none]"} type="button" onClick={step === 4 ? () => void enterDashboard() : next} disabled={saving}>
              {step === 4 ? (saving ? "Saving…" : "Enter dashboard") : "Continue"}
            </button>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
