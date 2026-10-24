"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useReveal } from "@/src/hooks/use-reveal";
import "@/src/styles/onboarding.css";

const levels = ["Primary", "Secondary", "Higher Education", "Independent Learner"];
const interests = ["School & Education", "Web Development", "Programming", "AI", "Business", "Design"];
const goals = ["Improve school results", "Learn digital skills", "Build projects", "Start a small idea"];

export default function OnboardingPage() {
  useReveal();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [level, setLevel] = useState("");
  const [ageGroup, setAgeGroup] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [status, setStatus] = useState("");

  function toggle(list: string[], value: string, setter: (next: string[]) => void) {
    setter(list.includes(value) ? list.filter((item) => item !== value) : [...list, value]);
  }

  function next() {
    if (step === 1 && (!level || !ageGroup)) {
      setStatus("Choose your learning level and age group.");
      return;
    }
    if (step === 2 && selectedInterests.length === 0) {
      setStatus("Select at least one interest.");
      return;
    }
    if (step === 3 && selectedGoals.length === 0) {
      setStatus("Select at least one goal.");
      return;
    }
    setStatus("");
    if (step === 4) {
      window.localStorage.setItem(
        "ceoJackOnboarding",
        JSON.stringify({ level, ageGroup, interests: selectedInterests, goals: selectedGoals })
      );
      router.push("/dashboard");
      return;
    }
    setStep((value) => value + 1);
  }

  return (
    <>
      <div className="background" aria-hidden="true">
        <div className="grid" />
        <div className="glow glow-one" />
        <div className="glow glow-two" />
      </div>
      <header className="topbar">
        <Link href="/" className="logo">
          <span className="logo-mark">&lt;/&gt;</span>
          <span className="logo-text">
            CEO JACK
            <small>LEARNING HUB</small>
          </span>
        </Link>
        <div className="progress-info">
          <span>SETUP</span>
          <strong>{step} / 4</strong>
        </div>
      </header>
      <main className="onboarding-page">
        <div className="onboarding-intro reveal">
          <span className="page-tag">✦ PERSONALIZE YOUR EXPERIENCE</span>
          <h1>
            Let&apos;s make CEO JACK
            <span> fit you.</span>
          </h1>
          <p>A few quick questions will help us understand your learning direction.</p>
        </div>
        <section className="onboarding-card reveal">
          {step === 1 ? (
            <div className="form-step active">
              <div className="step-heading">
                <span className="step-label">STEP 01</span>
                <h2>Tell us about your <span>learning level.</span></h2>
              </div>
              <div className="option-grid">
                {levels.map((item) => (
                  <label key={item} className="option-card">
                    <input type="radio" name="learningLevel" checked={level === item} onChange={() => setLevel(item)} />
                    <span className="option-content"><strong>{item}</strong></span>
                  </label>
                ))}
              </div>
              <label className="age-select-label" htmlFor="ageGroup">Age group</label>
              <select id="ageGroup" className={`age-select${ageGroup ? " has-value" : ""}`} value={ageGroup} onChange={(event) => setAgeGroup(event.target.value)}>
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
            <div className="form-step active">
              <div className="step-heading">
                <span className="step-label">STEP 02</span>
                <h2>What are you <span>interested in?</span></h2>
              </div>
              <div className="interest-grid">
                {interests.map((item) => (
                  <label key={item} className="interest-card">
                    <input type="checkbox" checked={selectedInterests.includes(item)} onChange={() => toggle(selectedInterests, item, setSelectedInterests)} />
                    <span className="interest-text">{item}</span>
                  </label>
                ))}
              </div>
            </div>
          ) : null}
          {step === 3 ? (
            <div className="form-step active">
              <div className="step-heading">
                <span className="step-label">STEP 03</span>
                <h2>What do you want to <span>achieve?</span></h2>
              </div>
              <div className="interest-grid">
                {goals.map((item) => (
                  <label key={item} className="interest-card">
                    <input type="checkbox" checked={selectedGoals.includes(item)} onChange={() => toggle(selectedGoals, item, setSelectedGoals)} />
                    <span className="interest-text">{item}</span>
                  </label>
                ))}
              </div>
            </div>
          ) : null}
          {step === 4 ? (
            <div className="form-step active">
              <div className="step-heading">
                <span className="step-label">STEP 04</span>
                <h2>Review your <span>path.</span></h2>
              </div>
              <div className="onboarding-review">
                <p><span>Learning level</span><strong>{level}</strong></p>
                <p><span>Age group</span><strong>{ageGroup}</strong></p>
                <p><span>Interests</span><strong>{selectedInterests.join(", ")}</strong></p>
                <p><span>Your goals</span><strong>{selectedGoals.join(", ")}</strong></p>
              </div>
            </div>
          ) : null}
          <p className="onboarding-status" role="status">{status}</p>
          <div className="step-actions">
            {step > 1 ? (
              <button className="nav-btn back-btn" type="button" onClick={() => { setStatus(""); setStep((value) => value - 1); }}>Back</button>
            ) : null}
            <button className="nav-btn next-btn" type="button" onClick={next}>
              {step === 4 ? "Enter dashboard" : "Continue"}
            </button>
          </div>
        </section>
      </main>
    </>
  );
}
