"use client";

import Link from "next/link";
import { SiteLogoMark } from "@/src/components/site-logo-mark";
import { SiteFooter } from "@/src/components/footer";
import { useEffect, useState } from "react";
import { isSupabaseConfigured } from "@/src/utils/supabase/config";

const progressKey = "ceoJackLesson:p7-maths-equivalent-fractions";
const questions = [
  { prompt: "Which fraction is equivalent to 2/3?", options: ["3/5", "4/6", "4/9"], answer: 1, explanation: "Multiply the numerator and denominator by 2: 2/3 = 4/6." },
  { prompt: "Complete the equivalent fraction: 3/4 =  ?/20", options: ["12", "15", "16"], answer: 1, explanation: "4 × 5 = 20, so multiply the numerator by 5 too: 3 × 5 = 15." },
  { prompt: "A learner shades 6 of 8 equal parts. What is the fraction in simplest form?", options: ["3/4", "2/3", "6/4"], answer: 0, explanation: "Divide the numerator and denominator by 2: 6/8 = 3/4." },
];

export default function LessonPage() {
  const [answers, setAnswers] = useState<number[]>(Array(questions.length).fill(-1));
  const [submitted, setSubmitted] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function loadProgress() {
      if (!isSupabaseConfigured()) {
        setSaved(window.localStorage.getItem(progressKey) === "complete");
        return;
      }
      try {
        const response = await fetch("/api/progress", { cache: "no-store" });
        if (!response.ok) {
          if (!cancelled) setSaveError("Your saved progress could not be loaded.");
          return;
        }
        const result = await response.json() as { progress: { lessonId: string; status: string }[] };
        if (!cancelled) setSaved(result.progress.some((item) => item.lessonId === "p7-maths-equivalent-fractions" && item.status === "completed"));
      } catch {
        if (!cancelled) setSaveError("Your saved progress could not be loaded.");
      }
    }
    void loadProgress();
    return () => { cancelled = true; };
  }, []);

  const score = answers.reduce((total, answer, index) => total + (answer === questions[index].answer ? 1 : 0), 0);
  const complete = score >= 2;

  async function submitQuiz() {
    if (answers.some((answer) => answer < 0)) return;
    setSubmitted(true);
    if (complete) {
      setSaveError("");
      if (isSupabaseConfigured()) {
        try {
          setSaving(true);
          const response = await fetch("/api/progress", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ lessonId: "p7-maths-equivalent-fractions", score }),
          });
          if (!response.ok) {
            const result = await response.json().catch(() => null) as { error?: string } | null;
            throw new Error(result?.error ?? "Your result could not be saved. Please check your connection and try again.");
          }
          setSaved(true);
        } catch (error) {
          setSaveError(error instanceof Error ? error.message : "Your result could not be saved.");
        } finally {
          setSaving(false);
        }
      } else {
        window.localStorage.setItem(progressKey, "complete");
        setSaved(true);
      }
    }
  }

  function resetQuiz() {
    setAnswers(Array(questions.length).fill(-1));
    setSubmitted(false);
  }

  return (
    <>
    <div className={"lesson-app [min-height:100vh] [background:#f7f4ec] [color:#263449] [font-family:\"DM_Sans\",sans-serif]"}>
      <aside className={"lesson-sidebar [position:fixed] [inset:0_auto_0_0] [width:255px] [background:#1b2b3d] [padding:25px_18px] [color:#fff] [&_nav]:[display:grid] [&_nav]:[gap:8px] [&_nav_a]:[display:flex] [&_nav_a]:[gap:14px] [&_nav_a]:[padding:13px_12px] [&_nav_a]:[border-radius:10px] [&_nav_a]:[color:#c1cbd7] [&_nav_a]:[font-size:15px] [&_nav_a:hover]:[background:#2b4057] [&_nav_a:hover]:[color:#fff] max-[850px]:[position:static] max-[850px]:[width:auto] max-[850px]:[padding:12px_18px] max-[850px]:[&_nav]:[display:flex] max-[850px]:[&_nav]:[overflow-x:auto] max-[850px]:[&_nav]:[margin-top:12px] max-[850px]:[&_nav_a]:[flex-shrink:0] max-[850px]:[&_nav_a]:[padding:9px_11px] max-[850px]:[&_nav_a]:[font-size:13px]"}>
        <Link href="/" className={"lesson-brand [display:flex] [align-items:center] [gap:11px] [color:#fff] [margin:0_0_48px_5px] [&>img]:[display:block] [&>img]:[width:42px] [&>img]:[height:42px] [&>img]:[object-fit:cover] [&>img]:[border-radius:13px] [&_strong]:[font-size:13px] [&_strong]:[letter-spacing:.5px] [&_small]:[display:block] [&_small]:[margin-top:4px] [&_small]:[color:#9caac1] [&_small]:[font-size:9px] [&_small]:[letter-spacing:1.3px] max-[850px]:[margin:0]"}><SiteLogoMark className="lesson-brand-mark" width={84} height={84} alt="CEO JACK Learning Hub logo" /><strong>CEO JACK<small>LEARNING HUB</small></strong></Link>
        <nav aria-label="Learning space">
          <Link href="/dashboard">⌂ <span>Dashboard</span></Link>
          <Link href="/education" className={"active [background:#2b4057] [color:#fff]"}>▤ <span>Education Hub</span></Link>
          <Link href="/digital-skills">&lt;/&gt; <span>Digital Skills</span></Link>
          <Link href="/entrepreneurship">◈ <span>Entrepreneurship</span></Link>
          <Link href="/ai">✦ <span>CEO JACK AI</span></Link>
        </nav>
      </aside>
      <main className={"lesson-main [margin-left:255px] [min-height:100vh] max-[850px]:[margin-left:0]"}>
        <header className={"lesson-top [height:76px] [padding:0_max(5vw,24px)] [display:flex] [align-items:center] [justify-content:space-between] [border-bottom:1px_solid_#e9e2d6] [background:#fffdf8] [&_a]:[color:#367f78] [&_a]:[font-weight:700] [&_span]:[font-size:13px] [&_span]:[color:#697789] max-[560px]:[height:60px] max-[560px]:[padding:0_18px] max-[560px]:[&_span]:[font-size:11px]"}><Link href="/education">← Education Hub</Link><span>{saved ? "✓ Lesson complete" : "P7 · Mathematics"}</span></header>
        <article className={"lesson-content [max-width:850px] [margin:0_auto] [padding:54px_28px_70px] [&_h1]:[font-size:clamp(36px,5vw,52px)] [&_h1]:[line-height:1.08] [&_h1]:[letter-spacing:-1.6px] [&_h1]:[margin:13px_0] max-[850px]:[padding:36px_20px_54px] max-[560px]:[padding:30px_16px_44px]"}>
          <div className={"lesson-kicker [color:#367f78] [font-size:11px] [font-weight:800] [letter-spacing:1.3px]"}>NUMBER · FRACTIONS · ABOUT 8 MINUTES</div>
          <h1>Equivalent fractions</h1>
          <p className={"lesson-intro [font-size:18px] [line-height:1.7] [color:#697789] [max-width:700px] [margin-bottom:30px] max-[560px]:[font-size:16px]"}>Fractions can look different and still represent the same amount. Let’s see how to recognise and make them.</p>

          <section className={"lesson-card [background:#fffdf8] [border:1px_solid_#e9e2d6] [border-radius:18px] [padding:28px] [margin:20px_0] [box-shadow:0_12px_35px_rgba(25,40,75,.045)] [&_h2]:[font-size:22px] [&_h2]:[margin:9px_0_12px] [&_p]:[font-size:15px] [&_p]:[line-height:1.75] [&_p]:[color:#556477] [&_li]:[font-size:15px] [&_li]:[line-height:1.75] [&_li]:[color:#556477] [&_ol]:[padding-left:22px] [&_ol]:[margin:12px_0] max-[560px]:[padding:20px_17px]"}>
            <h2>What makes fractions equivalent?</h2>
            <p>Equivalent fractions name the same part of a whole. You can make an equivalent fraction by multiplying or dividing both the numerator (top number) and denominator (bottom number) by the same non-zero number.</p>
            <div className={"fraction-example [position:relative] [display:flex] [align-items:center] [justify-content:center] [gap:25px] [margin:28px_auto_38px] [color:#263449] [&>span]:[display:grid] [&>span]:[text-align:center] [&>span]:[font-size:24px] [&>span]:[min-width:30px] [&_i]:[height:2px] [&_i]:[background:#367f78] [&_i]:[margin:3px_0] [&>strong]:[font-size:25px] [&>strong]:[color:#367f78] [&_small]:[position:absolute] [&_small]:[top:78px] [&_small]:[font-size:12px] [&_small]:[color:#697789]"} aria-label="Two thirds equals four sixths">
              <span><b>2</b><i /> <b>3</b></span><strong>=</strong><span><b>4</b><i /><b>6</b></span>
              <small>Multiply top and bottom by 2</small>
            </div>
            <p>The value stays the same because the numerator and denominator change in the same proportion.</p>
          </section>

          <section className={"lesson-card worked-example [background:#fffdf8] [border:1px_solid_#e9e2d6] [border-radius:18px] [padding:28px] [margin:20px_0] [box-shadow:0_12px_35px_rgba(25,40,75,.045)] [&_h2]:[font-size:22px] [&_h2]:[margin:9px_0_12px] [&_p]:[font-size:15px] [&_p]:[line-height:1.75] [&_p]:[color:#556477] [&_li]:[font-size:15px] [&_li]:[line-height:1.75] [&_li]:[color:#556477] [&_ol]:[padding-left:22px] [&_ol]:[margin:12px_0] max-[560px]:[padding:20px_17px] [border-left:4px_solid_#367f78]"}>
            <span className={"lesson-step [color:#367f78] [font-size:11px] [font-weight:800] [letter-spacing:1.3px]"}>WORKED EXAMPLE</span>
            <h2>Write 3/5 with a denominator of 20.</h2>
            <ol>
              <li>Ask what multiplies 5 to make 20: the answer is 4.</li>
              <li>Multiply the numerator by the same number: 3 × 4 = 12.</li>
              <li>So, 3/5 = 12/20.</li>
            </ol>
            <p className={"try-it [padding:12px_15px] [background:#edf5f0] ![border-radius:9px]"}>Check: 12/20 simplifies back to 3/5 when both numbers are divided by 4.</p>
          </section>

          <section className={"quiz-section [background:#fffdf8] [border:1px_solid_#e9e2d6] [border-radius:18px] [padding:28px] [margin:20px_0] [box-shadow:0_12px_35px_rgba(25,40,75,.045)] max-[560px]:[padding:20px_17px]"} aria-labelledby="quiz-title">
            <div className={"quiz-heading [&_h2]:[font-size:22px] [&_h2]:[margin:9px_0_12px] [display:flex] [align-items:end] [justify-content:space-between] [margin-bottom:20px] [&>span]:[font-size:12px] [&>span]:[color:#697789]"}><div><span className={"lesson-step [color:#367f78] [font-size:11px] [font-weight:800] [letter-spacing:1.3px]"}>QUICK PRACTICE</span><h2 id="quiz-title">Check your understanding</h2></div><span>3 questions</span></div>
            {questions.map((question, questionIndex) => (
              <fieldset className={"quiz-question [border:0] [border-top:1px_solid_#e9e2d6] [padding:20px_0] [&_legend]:[font-size:16px] [&_legend]:[font-weight:700] [&_legend]:[line-height:1.5] [&_legend]:[max-width:100%] [&_legend_b]:[color:#367f78] [&_legend_b]:[margin-right:5px]"} key={question.prompt}>
                <legend><b>{questionIndex + 1}.</b> {question.prompt}</legend>
                <div className={"quiz-options [display:grid] [grid-template-columns:repeat(3,minmax(0,1fr))] [gap:10px] [margin-top:14px] [&_label]:[display:flex] [&_label]:[align-items:center] [&_label]:[gap:9px] [&_label]:[min-height:46px] [&_label]:[padding:10px_12px] [&_label]:[border:1px_solid_#e9e2d6] [&_label]:[border-radius:10px] [&_label]:[cursor:pointer] [&_label]:[color:#556477] [&_input]:[accent-color:#367f78] max-[560px]:[grid-template-columns:1fr]"}>
                  {question.options.map((option, optionIndex) => (
                    <label className={(`${answers[questionIndex] === optionIndex ? "selected [border-color:#367f78] [background:#edf5f0] [color:#263449]" : ""}${submitted && optionIndex === question.answer ? "correct [border-color:#3d896f] [background:#e9f7ef]" : ""}${submitted && answers[questionIndex] === optionIndex && optionIndex !== question.answer ? "incorrect [border-color:#cb6c60] [background:#fff0ed]" : ""}`)} key={option}>
                      <input type="radio" name={`question-${questionIndex}`} checked={answers[questionIndex] === optionIndex} disabled={submitted} onChange={() => setAnswers((current) => current.map((value, index) => index === questionIndex ? optionIndex : value))} />
                      {option}
                    </label>
                  ))}
                </div>
                {submitted ? <p className={"answer-explanation [font-size:13px] [color:#556477] [margin-top:10px]"}>{question.explanation}</p> : null}
              </fieldset>
            ))}
            {submitted ? (
              <div className={(`quiz-result [&_button]:[border:0] [&_button]:[border-radius:10px] [&_button]:[background:#263449] [&_button]:[color:white] [&_button]:[font-weight:700] [&_button]:[padding:13px_18px] [display:grid] [gap:7px] [padding:16px] [border-radius:12px] [&_span]:[font-size:14px] [&_button]:[justify-self:start] [&_button]:[margin-top:7px]${complete ? "passed [background:#e9f7ef] [color:#246447]" : "retry [background:#fff4e6] [color:#77521e]"}`)} role="status">
                <strong>{complete ? "Nice work — lesson complete!" : "You’re close. Review the examples and try again."}</strong>
                <span>You got {score} out of {questions.length} correct.{saving ? " Saving your completion…" : saved ? (isSupabaseConfigured() ? " Your result is saved to your account." : " Your completion is saved on this device.") : complete ? " Your result has not been saved yet." : " Get at least 2 correct to complete the lesson."}</span>
                <button type="button" onClick={resetQuiz} disabled={saving}>Try again</button>
              </div>
            ) : (
              <button className={"quiz-submit [border:0] [border-radius:10px] [background:#367f78] [color:white] [font-weight:700] [padding:13px_18px] [&:disabled]:[opacity:.5] [&:disabled]:[cursor:not-allowed] [&_span]:[margin-left:12px]"} type="button" onClick={submitQuiz} disabled={answers.some((answer) => answer < 0)}>Check answers <span>→</span></button>
            )}
            {saveError ? <p className={"progress-note [font-size:12px] [color:#8490a0] [line-height:1.5]"} role="status">{saveError}</p> : null}
          </section>
          <div className={"lesson-foot [&_a]:[color:#367f78] [&_a]:[font-weight:700] [display:flex] [justify-content:space-between] [gap:15px] [margin:28px_0_12px] [font-size:14px] max-[560px]:[flex-direction:column]"}><Link href="/education">← Back to subjects</Link><Link href={`/ai?prompt=${encodeURIComponent("Explain equivalent fractions with another example.")}`}>Ask CEO JACK AI about this topic →</Link></div>
          <p className={"progress-note [font-size:12px] [color:#8490a0] [line-height:1.5]"}>{isSupabaseConfigured() ? "Your lesson progress is saved to your account when you pass the quiz." : "Lesson completion is saved in this browser for this local demo."}</p>
        </article>
      </main>
    </div>
    <SiteFooter />
    </>
  );
}
