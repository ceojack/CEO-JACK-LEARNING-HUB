"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import "@/src/styles/lesson.css";

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

  useEffect(() => {
    setSaved(window.localStorage.getItem(progressKey) === "complete");
  }, []);

  const score = answers.reduce((total, answer, index) => total + (answer === questions[index].answer ? 1 : 0), 0);
  const complete = score >= 2;

  function submitQuiz() {
    if (answers.some((answer) => answer < 0)) return;
    setSubmitted(true);
    if (complete) {
      window.localStorage.setItem(progressKey, "complete");
      setSaved(true);
    }
  }

  function resetQuiz() {
    setAnswers(Array(questions.length).fill(-1));
    setSubmitted(false);
  }

  return (
    <div className="lesson-app">
      <aside className="lesson-sidebar">
        <Link href="/" className="lesson-brand"><span>CJ</span><strong>CEO JACK<small>LEARNING HUB</small></strong></Link>
        <nav aria-label="Learning space">
          <Link href="/dashboard">⌂ <span>Dashboard</span></Link>
          <Link href="/education" className="active">▤ <span>Education Hub</span></Link>
          <Link href="/digital-skills">&lt;/&gt; <span>Digital Skills</span></Link>
          <Link href="/entrepreneurship">◈ <span>Entrepreneurship</span></Link>
          <Link href="/ai">✦ <span>CEO JACK AI</span></Link>
        </nav>
      </aside>
      <main className="lesson-main">
        <header className="lesson-top"><Link href="/education">← Education Hub</Link><span>{saved ? "✓ Lesson complete" : "P7 · Mathematics"}</span></header>
        <article className="lesson-content">
          <div className="lesson-kicker">NUMBER · FRACTIONS · ABOUT 8 MINUTES</div>
          <h1>Equivalent fractions</h1>
          <p className="lesson-intro">Fractions can look different and still represent the same amount. Let’s see how to recognise and make them.</p>

          <section className="lesson-card">
            <h2>What makes fractions equivalent?</h2>
            <p>Equivalent fractions name the same part of a whole. You can make an equivalent fraction by multiplying or dividing both the numerator (top number) and denominator (bottom number) by the same non-zero number.</p>
            <div className="fraction-example" aria-label="Two thirds equals four sixths">
              <span><b>2</b><i /> <b>3</b></span><strong>=</strong><span><b>4</b><i /><b>6</b></span>
              <small>Multiply top and bottom by 2</small>
            </div>
            <p>The value stays the same because the numerator and denominator change in the same proportion.</p>
          </section>

          <section className="lesson-card worked-example">
            <span className="lesson-step">WORKED EXAMPLE</span>
            <h2>Write 3/5 with a denominator of 20.</h2>
            <ol>
              <li>Ask what multiplies 5 to make 20: the answer is 4.</li>
              <li>Multiply the numerator by the same number: 3 × 4 = 12.</li>
              <li>So, 3/5 = 12/20.</li>
            </ol>
            <p className="try-it">Check: 12/20 simplifies back to 3/5 when both numbers are divided by 4.</p>
          </section>

          <section className="quiz-section" aria-labelledby="quiz-title">
            <div className="quiz-heading"><div><span className="lesson-step">QUICK PRACTICE</span><h2 id="quiz-title">Check your understanding</h2></div><span>3 questions</span></div>
            {questions.map((question, questionIndex) => (
              <fieldset className="quiz-question" key={question.prompt}>
                <legend><b>{questionIndex + 1}.</b> {question.prompt}</legend>
                <div className="quiz-options">
                  {question.options.map((option, optionIndex) => (
                    <label className={`${answers[questionIndex] === optionIndex ? "selected " : ""}${submitted && optionIndex === question.answer ? "correct" : ""}${submitted && answers[questionIndex] === optionIndex && optionIndex !== question.answer ? "incorrect" : ""}`} key={option}>
                      <input type="radio" name={`question-${questionIndex}`} checked={answers[questionIndex] === optionIndex} disabled={submitted} onChange={() => setAnswers((current) => current.map((value, index) => index === questionIndex ? optionIndex : value))} />
                      {option}
                    </label>
                  ))}
                </div>
                {submitted ? <p className="answer-explanation">{question.explanation}</p> : null}
              </fieldset>
            ))}
            {submitted ? (
              <div className={`quiz-result ${complete ? "passed" : "retry"}`} role="status">
                <strong>{complete ? "Nice work — lesson complete!" : "You’re close. Review the examples and try again."}</strong>
                <span>You got {score} out of {questions.length} correct.{saved ? " Your completion is saved on this device." : " Get at least 2 correct to complete the lesson."}</span>
                <button type="button" onClick={resetQuiz}>Try again</button>
              </div>
            ) : (
              <button className="quiz-submit" type="button" onClick={submitQuiz} disabled={answers.some((answer) => answer < 0)}>Check answers <span>→</span></button>
            )}
          </section>
          <div className="lesson-foot"><Link href="/education">← Back to subjects</Link><Link href={`/ai?prompt=${encodeURIComponent("Explain equivalent fractions with another example.")}`}>Ask CEO JACK AI about this topic →</Link></div>
          <p className="progress-note">Lesson completion is saved in this browser for this prototype. Secure account-based progress can be connected later.</p>
        </article>
      </main>
    </div>
  );
}
