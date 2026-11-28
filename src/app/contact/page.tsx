"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { SiteFooter } from "@/src/components/footer";
import { SiteHeader } from "@/src/components/header";
import { useReveal } from "@/src/hooks/use-reveal";

const HELLO_EMAIL = "hello@ceojacklearninghub.com";
const INFO_EMAIL = "info@ceojacklearninghub.com";
const SUPPORT_EMAIL = "support@ceojacklearninghub.com";

export default function ContactPage() {
  useReveal();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};

    if (name.trim().length < 2) nextErrors.name = "Enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) nextErrors.email = "Enter a valid email.";
    if (!subject) nextErrors.subject = "Select a subject.";
    if (message.trim().length < 10) nextErrors.message = "Write at least 10 characters.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setStatus("Please check the highlighted fields.");
      return;
    }

    const body = [`Name: ${name.trim()}`, `Email: ${email.trim()}`, "", message.trim()].join("\n");
    const recipient = subject === "Technical support"
      ? SUPPORT_EMAIL
      : subject === "Partnership"
        ? INFO_EMAIL
        : HELLO_EMAIL;
    window.location.href = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setStatus("Your email app should open with the message prepared.");
  }

  return (
    <>
      <div className={"page-bg [position:fixed] [inset:0] [z-index:-2] [pointer-events:none] [background:radial-gradient(_circle_at_78%_12%,_rgba(99,_133,_255,_0.15),_transparent_28%_),_radial-gradient(_circle_at_10%_60%,_rgba(155,_123,_255,_0.07),_transparent_28%_),_linear-gradient(_180deg,_#080d1b,_#0d1427_55%,_#080d1b_)] [&::after]:[content:\"\"] [&::after]:[position:absolute] [&::after]:[inset:0] [&::after]:[opacity:0.25] [&::after]:[background-image:linear-gradient(_rgba(255,_255,_255,_0.025)_1px,_transparent_1px_),_linear-gradient(_90deg,_rgba(255,_255,_255,_0.025)_1px,_transparent_1px_)] [&::after]:[background-size:48px_48px] [&::after]:[mask-image:linear-gradient(_#000,_transparent_88%_)]"} aria-hidden="true" />
      <SiteHeader active="/contact" />
      <main>
        <section className={"contact-hero section [min-height:calc(100vh_-_76px)] [display:flex] [align-items:center] [padding:100px_0] max-[900px]:[min-height:auto] max-[900px]:[padding-top:65px] max-[600px]:[padding:72px_0]"}>
          <div className={"container hero-grid [width:min(calc(100%_-_40px),_var(--container))] [margin-inline:auto] max-[600px]:[width:min(calc(100%_-_28px),_var(--container))] [display:grid] [grid-template-columns:1fr_0.9fr] [align-items:center] [gap:60px] max-[1100px]:[gap:35px] max-[900px]:[grid-template-columns:1fr] max-[900px]:[gap:20px]"}>
            <div className={"hero-copy reveal [max-width:650px] [&_h1]:[margin-top:20px] [&_h1]:[font:700_clamp(48px,_6vw,_78px)_/_0.99_\"Space_Grotesk\",_sans-serif] [&_h1]:[letter-spacing:-0.06em] [&_h1_span]:[display:block] [&_h1_span]:[color:#c4b5fd] max-[900px]:[max-width:760px] max-[600px]:[&_h1]:[font-size:clamp(46px,_13vw,_68px)] [opacity:0] [transform:translateY(20px)] [transition:opacity_0.65s_ease,_transform_0.65s_ease] motion-reduce:[opacity:1] motion-reduce:[transform:none]"}>
              <span className={"eyebrow [display:inline-flex] [align-items:center] [gap:9px] [color:#aeb8cd] [font-size:10px] [font-weight:800] [letter-spacing:0.18em]"}>
                <span className={"eyebrow-dot [width:7px] [height:7px] [border-radius:50%] [background:var(--green)] [box-shadow:0_0_14px_rgba(69,_211,_156,_0.7)]"} />
                GET IN TOUCH
              </span>
              <h1>
                Let&apos;s start a
                <span> conversation.</span>
              </h1>
              <p className={"hero-lead [max-width:600px] [margin-top:25px] [color:#aeb9cb] [font-size:17px] [line-height:1.8] max-[600px]:[font-size:15px]"}>
                Have a question, suggestion, idea or feedback? We want to hear from you as CEO JACK LEARNING HUB grows.
              </p>
              <div className={"contact-points [display:grid] [gap:12px] [margin-top:32px]"}>
                <a className={"contact-point [display:flex] [align-items:center] [gap:14px] [min-width:0] [padding:13px_15px] [border:1px_solid_var(--line)] [border-radius:14px] [background:rgba(255,_255,_255,_0.025)] [transition:border-color_0.2s,_transform_0.2s] [&[href]:hover]:[transform:translateX(3px)] [&[href]:hover]:[border-color:rgba(99,_133,_255,_0.45)] [&_>_span:nth-child(2)]:[display:grid] [&_>_span:nth-child(2)]:[gap:3px] [&_>_span:nth-child(2)]:[min-width:0] [&_strong]:[font-size:13px] [&_small]:[color:#8290a6] [&_small]:[font-size:11px] [&_small]:[overflow-wrap:anywhere]"} href={`mailto:${HELLO_EMAIL}`}>
                  <span className={"point-icon [display:grid] [place-items:center] [width:42px] [height:42px] [flex-shrink:0] [border:1px_solid_rgba(99,_133,_255,_0.22)] [border-radius:12px] [background:rgba(99,_133,_255,_0.1)] [color:#a39bff] [font-weight:800]"} aria-hidden="true">@</span>
                  <span>
                    <strong>General messages</strong>
                    <small>{HELLO_EMAIL}</small>
                  </span>
                  <span className={"point-arrow [margin-left:auto] [color:#9c93ff]"} aria-hidden="true">↗</span>
                </a>
                <a className={"contact-point [display:flex] [align-items:center] [gap:14px] [min-width:0] [padding:13px_15px] [border:1px_solid_var(--line)] [border-radius:14px] [background:rgba(255,_255,_255,_0.025)] [transition:border-color_0.2s,_transform_0.2s] [&[href]:hover]:[transform:translateX(3px)] [&[href]:hover]:[border-color:rgba(99,_133,_255,_0.45)] [&_>_span:nth-child(2)]:[display:grid] [&_>_span:nth-child(2)]:[gap:3px] [&_>_span:nth-child(2)]:[min-width:0] [&_strong]:[font-size:13px] [&_small]:[color:#8290a6] [&_small]:[font-size:11px] [&_small]:[overflow-wrap:anywhere]"} href={`mailto:${SUPPORT_EMAIL}`}>
                  <span className={"point-icon [display:grid] [place-items:center] [width:42px] [height:42px] [flex-shrink:0] [border:1px_solid_rgba(99,_133,_255,_0.22)] [border-radius:12px] [background:rgba(99,_133,_255,_0.1)] [color:#a39bff] [font-weight:800]"} aria-hidden="true">?</span>
                  <span>
                    <strong>Platform support</strong>
                    <small>{SUPPORT_EMAIL}</small>
                  </span>
                  <span className={"point-arrow [margin-left:auto] [color:#9c93ff]"} aria-hidden="true">↗</span>
                </a>
                <a className={"contact-point [display:flex] [align-items:center] [gap:14px] [min-width:0] [padding:13px_15px] [border:1px_solid_var(--line)] [border-radius:14px] [background:rgba(255,_255,_255,_0.025)] [transition:border-color_0.2s,_transform_0.2s] [&[href]:hover]:[transform:translateX(3px)] [&[href]:hover]:[border-color:rgba(99,_133,_255,_0.45)] [&_>_span:nth-child(2)]:[display:grid] [&_>_span:nth-child(2)]:[gap:3px] [&_>_span:nth-child(2)]:[min-width:0] [&_strong]:[font-size:13px] [&_small]:[color:#8290a6] [&_small]:[font-size:11px] [&_small]:[overflow-wrap:anywhere]"} href={`mailto:${INFO_EMAIL}`}>
                  <span className={"point-icon [display:grid] [place-items:center] [width:42px] [height:42px] [flex-shrink:0] [border:1px_solid_rgba(99,_133,_255,_0.22)] [border-radius:12px] [background:rgba(99,_133,_255,_0.1)] [color:#a39bff] [font-weight:800]"} aria-hidden="true">✦</span>
                  <span>
                    <strong>General enquiries &amp; partnerships</strong>
                    <small>{INFO_EMAIL}</small>
                  </span>
                  <span className={"point-arrow [margin-left:auto] [color:#9c93ff]"} aria-hidden="true">↗</span>
                </a>
              </div>
            </div>
            <div className={"contact-visual reveal reveal-delay [position:relative] [min-height:480px] [display:grid] [place-items:center] [isolation:isolate] [&::before]:[content:\"\"] [&::before]:[position:absolute] [&::before]:[width:260px] [&::before]:[height:260px] [&::before]:[border-radius:50%] [&::before]:[background:rgba(99,_133,_255,_0.13)] [&::before]:[filter:blur(65px)] [&::before]:[z-index:-1] max-[900px]:[min-height:420px] max-[600px]:[min-height:350px] [opacity:0] [transform:translateY(20px)] [transition:opacity_0.65s_ease,_transform_0.65s_ease] motion-reduce:[opacity:1] motion-reduce:[transform:none] [transition-delay:0.1s]"} aria-label="Connect, share ideas and start a conversation">
              <div className={"visual-orbit orbit-one [position:absolute] [border:1px_solid_rgba(99,_133,_255,_0.2)] [border-radius:50%] [width:220px] [height:220px] animate-spin-slower max-[600px]:[width:175px] max-[600px]:[height:175px]"} />
              <div className={"visual-orbit orbit-two [position:absolute] [border:1px_solid_rgba(99,_133,_255,_0.2)] [border-radius:50%] [width:340px] [height:340px] [border-color:rgba(155,_123,_255,_0.16)] animate-spin-reverse max-[600px]:[width:270px] max-[600px]:[height:270px]"} />
              <div className={"visual-orbit orbit-three [position:absolute] [border:1px_solid_rgba(99,_133,_255,_0.2)] [border-radius:50%] [width:440px] [height:205px] [border-color:rgba(99,_133,_255,_0.15)] [transform:rotate(32deg)] animate-tilt max-[600px]:[width:320px] max-[600px]:[height:150px]"} />
              <div className={"visual-core [width:160px] [height:160px] [display:flex] [flex-direction:column] [align-items:center] [justify-content:center] [border:1px_solid_rgba(99,_133,_255,_0.4)] [border-radius:50%] [background:radial-gradient(_circle_at_40%_30%,_rgba(99,_133,_255,_0.25),_rgba(10,_17,_34,_0.98)_70%_)] [box-shadow:0_0_60px_rgba(99,_133,_255,_0.16)] animate-float-5 [&_strong]:[margin-top:5px] [&_strong]:[font:700_12px_\"Space_Grotesk\",_sans-serif] [&_strong]:[letter-spacing:0.22em] [&_small]:[margin-top:5px] [&_small]:[color:#77859d] [&_small]:[font-size:7px] [&_small]:[letter-spacing:0.13em] max-[600px]:[width:135px] max-[600px]:[height:135px]"}>
                <span className={"core-symbol [color:#a49bff] [font-size:30px] [text-shadow:0_0_20px_rgba(99,_133,_255,_0.7)]"}>✦</span>
                <strong>CONNECT</strong>
                <small>START A CONVERSATION</small>
              </div>
              <span className={"signal signal-one [position:absolute] [padding:10px_13px] [border:1px_solid_var(--line)] [border-radius:10px] [background:rgba(10,_17,_34,_0.8)] [backdrop-filter:blur(12px)] [color:#aebbd0] [font-size:8px] [letter-spacing:0.16em] max-[600px]:[padding:8px_10px] max-[600px]:[font-size:7px] [top:16%] [right:6%] animate-float-5 max-[600px]:[right:0]"}>MESSAGE</span>
              <span className={"signal signal-two [position:absolute] [padding:10px_13px] [border:1px_solid_var(--line)] [border-radius:10px] [background:rgba(10,_17,_34,_0.8)] [backdrop-filter:blur(12px)] [color:#aebbd0] [font-size:8px] [letter-spacing:0.16em] max-[600px]:[padding:8px_10px] max-[600px]:[font-size:7px] [left:2%] [bottom:24%] animate-float-6-reverse max-[600px]:[left:0]"}>IDEA</span>
              <span className={"signal signal-three [position:absolute] [padding:10px_13px] [border:1px_solid_var(--line)] [border-radius:10px] [background:rgba(10,_17,_34,_0.8)] [backdrop-filter:blur(12px)] [color:#aebbd0] [font-size:8px] [letter-spacing:0.16em] max-[600px]:[padding:8px_10px] max-[600px]:[font-size:7px] [right:7%] [bottom:12%] animate-float-45 max-[600px]:[right:0]"}>FEEDBACK</span>
            </div>
          </div>
        </section>

        <section className={"contact-section section [background:rgba(255,_255,_255,_0.012)] [padding:100px_0] max-[600px]:[padding:72px_0]"} id="send-message">
          <div className={"container contact-grid [width:min(calc(100%_-_40px),_var(--container))] [margin-inline:auto] max-[600px]:[width:min(calc(100%_-_28px),_var(--container))] [display:grid] [grid-template-columns:minmax(0,_1.25fr)_minmax(280px,_0.7fr)] [gap:48px] [align-items:start] max-[1100px]:[gap:28px] max-[900px]:[grid-template-columns:1fr]"}>
            <div className={"form-column reveal max-[900px]:[min-width:0] [opacity:0] [transform:translateY(20px)] [transition:opacity_0.65s_ease,_transform_0.65s_ease] motion-reduce:[opacity:1] motion-reduce:[transform:none]"}>
              <div className={"section-heading [max-width:650px] [margin-bottom:30px] [&_h2]:[margin-top:12px] [&_h2]:[font:700_clamp(34px,_4.5vw,_52px)_/_1.04_\"Space_Grotesk\",_sans-serif] [&_h2]:[letter-spacing:-0.045em] [&_h2_span]:[color:#8178ff] [&_p]:[margin-top:15px] [&_p]:[color:var(--muted)] [&_p]:[font-size:13px] [&_p]:[line-height:1.8] max-[600px]:[&_h2]:[font-size:36px]"}>
                <span className={"section-label [color:#aeb8cd] [font-size:10px] [font-weight:800] [letter-spacing:0.18em] [margin-bottom:8px]"}>SEND A MESSAGE</span>
                <h2>
                  Tell us what&apos;s
                  <span> on your mind.</span>
                </h2>
                <p>Complete the form and your email application will open with your message prepared.</p>
              </div>
              <form className={"contact-form [padding:30px] [border:1px_solid_var(--line)] [border-radius:22px] [background:linear-gradient(_145deg,_rgba(255,_255,_255,_0.045),_rgba(255,_255,_255,_0.012)_)] [box-shadow:var(--shadow)] max-[600px]:[padding:22px_17px]"} noValidate onSubmit={handleSubmit}>
                <div className={"contact-form-heading [display:flex] [align-items:center] [gap:12px] [margin-bottom:22px] [padding:0_0_17px] [border-bottom:1px_solid_rgba(255,_255,_255,_.09)] [&_>_span]:[display:grid] [&_>_span]:[width:40px] [&_>_span]:[height:40px] [&_>_span]:[flex:0_0_40px] [&_>_span]:[place-items:center] [&_>_span]:[border:1px_solid_rgba(129,_120,_255,_.22)] [&_>_span]:[border-radius:12px] [&_>_span]:[background:rgba(129,_120,_255,_.1)] [&_>_span]:[color:#a9a1ff] [&_>_span]:[font-size:17px] [&_div]:[display:grid] [&_div]:[gap:3px] [&_strong]:[color:#f4f6ff] [&_strong]:[font-size:14px] [&_small]:[color:#c1cbe0] [&_small]:[font-size:12px] [&_small]:[line-height:1.5]"}><span aria-hidden="true">✉</span><div><strong>Contact form</strong><small>Share your details and tell us how we can help.</small></div></div>
                <div className={"form-row [display:grid] [grid-template-columns:1fr_1fr] [gap:16px] max-[600px]:[grid-template-columns:1fr] max-[600px]:[gap:0]"}>
                  <div className={(`form-group [min-width:0] [margin-bottom:19px] [&_label]:[display:block] [&_label]:[margin-bottom:8px] [&_label]:[color:#eef2fb] [&_label]:[font-size:14px] [&_label]:[font-weight:600] [&_input]:[width:100%] [&_input]:[padding:13px_14px] [&_input]:[border:1px_solid_rgba(174,_190,_225,_0.34)] [&_input]:[border-radius:10px] [&_input]:[outline:none] [&_input]:[background:#eef2fa] [&_input]:[color:#1d2940] [&_input]:[font-size:15px] [&_input]:[transition:border-color_0.2s,_box-shadow_0.2s] [&_textarea]:[width:100%] [&_textarea]:[padding:13px_14px] [&_textarea]:[border:1px_solid_rgba(174,_190,_225,_0.34)] [&_textarea]:[border-radius:10px] [&_textarea]:[outline:none] [&_textarea]:[background:#eef2fa] [&_textarea]:[color:#1d2940] [&_textarea]:[font-size:15px] [&_textarea]:[transition:border-color_0.2s,_box-shadow_0.2s] [&_select]:[width:100%] [&_select]:[padding:13px_14px] [&_select]:[border:1px_solid_rgba(174,_190,_225,_0.34)] [&_select]:[border-radius:10px] [&_select]:[outline:none] [&_select]:[background:#eef2fa] [&_select]:[color:#1d2940] [&_select]:[font-size:15px] [&_select]:[transition:border-color_0.2s,_box-shadow_0.2s] [&_input::placeholder]:[color:#68758c] [&_textarea::placeholder]:[color:#68758c] [&_select]:[color-scheme:light] [&_textarea]:[min-height:155px] [&_textarea]:[resize:vertical] [&_input:focus]:[border-color:#7868d8] [&_input:focus]:[box-shadow:0_0_0_3px_rgba(99,_133,_255,_0.2)] [&_textarea:focus]:[border-color:#7868d8] [&_textarea:focus]:[box-shadow:0_0_0_3px_rgba(99,_133,_255,_0.2)] [&_select:focus]:[border-color:#7868d8] [&_select:focus]:[box-shadow:0_0_0_3px_rgba(99,_133,_255,_0.2)]${errors.name ? "invalid [&_input]:[border-color:#ff777f] [&_textarea]:[border-color:#ff777f] [&_select]:[border-color:#ff777f]" : ""}`)}>
                    <label htmlFor="name">Your name</label>
                    <input id="name" name="name" type="text" placeholder="Enter your name" autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} />
                    <small className={"error-message [display:block] [min-height:15px] [margin-top:5px] [color:#ff9298] [font-size:12px]"}>{errors.name}</small>
                  </div>
                  <div className={(`form-group [min-width:0] [margin-bottom:19px] [&_label]:[display:block] [&_label]:[margin-bottom:8px] [&_label]:[color:#eef2fb] [&_label]:[font-size:14px] [&_label]:[font-weight:600] [&_input]:[width:100%] [&_input]:[padding:13px_14px] [&_input]:[border:1px_solid_rgba(174,_190,_225,_0.34)] [&_input]:[border-radius:10px] [&_input]:[outline:none] [&_input]:[background:#eef2fa] [&_input]:[color:#1d2940] [&_input]:[font-size:15px] [&_input]:[transition:border-color_0.2s,_box-shadow_0.2s] [&_textarea]:[width:100%] [&_textarea]:[padding:13px_14px] [&_textarea]:[border:1px_solid_rgba(174,_190,_225,_0.34)] [&_textarea]:[border-radius:10px] [&_textarea]:[outline:none] [&_textarea]:[background:#eef2fa] [&_textarea]:[color:#1d2940] [&_textarea]:[font-size:15px] [&_textarea]:[transition:border-color_0.2s,_box-shadow_0.2s] [&_select]:[width:100%] [&_select]:[padding:13px_14px] [&_select]:[border:1px_solid_rgba(174,_190,_225,_0.34)] [&_select]:[border-radius:10px] [&_select]:[outline:none] [&_select]:[background:#eef2fa] [&_select]:[color:#1d2940] [&_select]:[font-size:15px] [&_select]:[transition:border-color_0.2s,_box-shadow_0.2s] [&_input::placeholder]:[color:#68758c] [&_textarea::placeholder]:[color:#68758c] [&_select]:[color-scheme:light] [&_textarea]:[min-height:155px] [&_textarea]:[resize:vertical] [&_input:focus]:[border-color:#7868d8] [&_input:focus]:[box-shadow:0_0_0_3px_rgba(99,_133,_255,_0.2)] [&_textarea:focus]:[border-color:#7868d8] [&_textarea:focus]:[box-shadow:0_0_0_3px_rgba(99,_133,_255,_0.2)] [&_select:focus]:[border-color:#7868d8] [&_select:focus]:[box-shadow:0_0_0_3px_rgba(99,_133,_255,_0.2)]${errors.email ? "invalid [&_input]:[border-color:#ff777f] [&_textarea]:[border-color:#ff777f] [&_select]:[border-color:#ff777f]" : ""}`)}>
                    <label htmlFor="email">Email address</label>
                    <input id="email" name="email" type="email" placeholder="example@gmail.com" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} />
                    <small className={"error-message [display:block] [min-height:15px] [margin-top:5px] [color:#ff9298] [font-size:12px]"}>{errors.email}</small>
                  </div>
                </div>
                <div className={(`form-group [min-width:0] [margin-bottom:19px] [&_label]:[display:block] [&_label]:[margin-bottom:8px] [&_label]:[color:#eef2fb] [&_label]:[font-size:14px] [&_label]:[font-weight:600] [&_input]:[width:100%] [&_input]:[padding:13px_14px] [&_input]:[border:1px_solid_rgba(174,_190,_225,_0.34)] [&_input]:[border-radius:10px] [&_input]:[outline:none] [&_input]:[background:#eef2fa] [&_input]:[color:#1d2940] [&_input]:[font-size:15px] [&_input]:[transition:border-color_0.2s,_box-shadow_0.2s] [&_textarea]:[width:100%] [&_textarea]:[padding:13px_14px] [&_textarea]:[border:1px_solid_rgba(174,_190,_225,_0.34)] [&_textarea]:[border-radius:10px] [&_textarea]:[outline:none] [&_textarea]:[background:#eef2fa] [&_textarea]:[color:#1d2940] [&_textarea]:[font-size:15px] [&_textarea]:[transition:border-color_0.2s,_box-shadow_0.2s] [&_select]:[width:100%] [&_select]:[padding:13px_14px] [&_select]:[border:1px_solid_rgba(174,_190,_225,_0.34)] [&_select]:[border-radius:10px] [&_select]:[outline:none] [&_select]:[background:#eef2fa] [&_select]:[color:#1d2940] [&_select]:[font-size:15px] [&_select]:[transition:border-color_0.2s,_box-shadow_0.2s] [&_input::placeholder]:[color:#68758c] [&_textarea::placeholder]:[color:#68758c] [&_select]:[color-scheme:light] [&_textarea]:[min-height:155px] [&_textarea]:[resize:vertical] [&_input:focus]:[border-color:#7868d8] [&_input:focus]:[box-shadow:0_0_0_3px_rgba(99,_133,_255,_0.2)] [&_textarea:focus]:[border-color:#7868d8] [&_textarea:focus]:[box-shadow:0_0_0_3px_rgba(99,_133,_255,_0.2)] [&_select:focus]:[border-color:#7868d8] [&_select:focus]:[box-shadow:0_0_0_3px_rgba(99,_133,_255,_0.2)]${errors.subject ? "invalid [&_input]:[border-color:#ff777f] [&_textarea]:[border-color:#ff777f] [&_select]:[border-color:#ff777f]" : ""}`)}>
                  <label htmlFor="subject">What is this about?</label>
                  <select id="subject" name="subject" value={subject} onChange={(event) => setSubject(event.target.value)}>
                    <option value="">Select a subject</option>
                    <option value="General question">General question</option>
                    <option value="Technical support">Technical support</option>
                    <option value="Feedback">Feedback</option>
                    <option value="Partnership">Partnership or collaboration</option>
                    <option value="Suggestion or idea">Suggestion or idea</option>
                  </select>
                  <small className={"error-message [display:block] [min-height:15px] [margin-top:5px] [color:#ff9298] [font-size:12px]"}>{errors.subject}</small>
                </div>
                <div className={(`form-group [min-width:0] [margin-bottom:19px] [&_label]:[display:block] [&_label]:[margin-bottom:8px] [&_label]:[color:#eef2fb] [&_label]:[font-size:14px] [&_label]:[font-weight:600] [&_input]:[width:100%] [&_input]:[padding:13px_14px] [&_input]:[border:1px_solid_rgba(174,_190,_225,_0.34)] [&_input]:[border-radius:10px] [&_input]:[outline:none] [&_input]:[background:#eef2fa] [&_input]:[color:#1d2940] [&_input]:[font-size:15px] [&_input]:[transition:border-color_0.2s,_box-shadow_0.2s] [&_textarea]:[width:100%] [&_textarea]:[padding:13px_14px] [&_textarea]:[border:1px_solid_rgba(174,_190,_225,_0.34)] [&_textarea]:[border-radius:10px] [&_textarea]:[outline:none] [&_textarea]:[background:#eef2fa] [&_textarea]:[color:#1d2940] [&_textarea]:[font-size:15px] [&_textarea]:[transition:border-color_0.2s,_box-shadow_0.2s] [&_select]:[width:100%] [&_select]:[padding:13px_14px] [&_select]:[border:1px_solid_rgba(174,_190,_225,_0.34)] [&_select]:[border-radius:10px] [&_select]:[outline:none] [&_select]:[background:#eef2fa] [&_select]:[color:#1d2940] [&_select]:[font-size:15px] [&_select]:[transition:border-color_0.2s,_box-shadow_0.2s] [&_input::placeholder]:[color:#68758c] [&_textarea::placeholder]:[color:#68758c] [&_select]:[color-scheme:light] [&_textarea]:[min-height:155px] [&_textarea]:[resize:vertical] [&_input:focus]:[border-color:#7868d8] [&_input:focus]:[box-shadow:0_0_0_3px_rgba(99,_133,_255,_0.2)] [&_textarea:focus]:[border-color:#7868d8] [&_textarea:focus]:[box-shadow:0_0_0_3px_rgba(99,_133,_255,_0.2)] [&_select:focus]:[border-color:#7868d8] [&_select:focus]:[box-shadow:0_0_0_3px_rgba(99,_133,_255,_0.2)]${errors.message ? "invalid [&_input]:[border-color:#ff777f] [&_textarea]:[border-color:#ff777f] [&_select]:[border-color:#ff777f]" : ""}`)}>
                  <div className={"label-row [&_label]:[display:block] [&_label]:[margin-bottom:8px] [&_label]:[color:#eef2fb] [&_label]:[font-size:14px] [&_label]:[font-weight:600] [display:flex] [align-items:center] [justify-content:space-between] [gap:12px] [&_#characterCount]:[color:#728098] [&_#characterCount]:[font-size:10px]"}>
                    <label htmlFor="message">Your message</label>
                    <span>{message.length} / 1000</span>
                  </div>
                  <textarea id="message" name="message" rows={7} maxLength={1000} placeholder="Tell us how we can help..." value={message} onChange={(event) => setMessage(event.target.value)} />
                  <small className={"error-message [display:block] [min-height:15px] [margin-top:5px] [color:#ff9298] [font-size:12px]"}>{errors.message}</small>
                </div>
                <button type="submit" className={"submit-btn [width:100%] [display:flex] [align-items:center] [justify-content:space-between] [padding:15px_18px] [border:0] [border-radius:11px] [background:linear-gradient(_135deg,_var(--primary),_var(--blue)_)] [color:#fff] [font-size:14px] [font-weight:700] [cursor:pointer] [transition:transform_0.2s,_opacity_0.2s] [&:hover]:[transform:translateY(-2px)] [&:disabled]:[opacity:0.65] [&:disabled]:[cursor:wait]"}>
                  <span>Prepare email</span>
                  <span aria-hidden="true">→</span>
                </button>
                <p className={"form-status [min-height:20px] [margin-top:12px] [font-size:12px]"} role="status" aria-live="polite">{status}</p>
                <p className={"privacy-note [margin-top:8px] [color:#6f7d92] [font-size:10px]"}>Please don&apos;t include passwords or other sensitive information.</p>
              </form>
            </div>
            <aside className={"contact-sidebar reveal reveal-delay [display:grid] [gap:16px] max-[900px]:[grid-template-columns:1fr_1fr] max-[600px]:[grid-template-columns:1fr] [opacity:0] [transform:translateY(20px)] [transition:opacity_0.65s_ease,_transform_0.65s_ease] motion-reduce:[opacity:1] motion-reduce:[transform:none] [transition-delay:0.1s]"}>
              <div className={"side-card feature-card [padding:27px] [border:1px_solid_var(--line)] [border-radius:20px] [background:radial-gradient(_circle_at_100%_0,_rgba(99,_133,_255,_0.13),_transparent_48%_),_rgba(255,_255,_255,_0.025)] [&_h3]:[margin-top:16px] [&_h3]:[font:700_27px_/_1.2_\"Space_Grotesk\",_sans-serif] [&_h3]:[letter-spacing:-0.035em] [&_p]:[margin-top:14px] [&_p]:[color:#8c9ab0] [&_p]:[font-size:13px] [&_p]:[line-height:1.8]"}>
                <span className={"section-label [color:#aeb8cd] [font-size:10px] [font-weight:800] [letter-spacing:0.18em] [margin-bottom:8px]"}>CEO JACK LEARNING HUB</span>
                <h3>Good communication builds better experiences.</h3>
                <p>Your questions, suggestions and feedback help us understand what learners need as the platform develops.</p>
                <div className={"mini-rule [width:45px] [height:3px] [margin-top:22px] [border-radius:3px] [background:linear-gradient(_90deg,_var(--primary),_var(--cyan)_)]"} />
                <p className={"side-motto [color:#c8c1ff] [font-weight:700]"}>Learn. Create. Develop.</p>
              </div>
              <div className={"side-card quick-card [padding:27px] [border:1px_solid_var(--line)] [border-radius:20px] [background:rgba(255,_255,_255,_0.025)] [&_h3]:[margin-top:16px] [&_h3]:[font:700_27px_/_1.2_\"Space_Grotesk\",_sans-serif] [&_h3]:[letter-spacing:-0.035em] [&_p]:[margin-top:14px] [&_p]:[color:#8c9ab0] [&_p]:[font-size:13px] [&_p]:[line-height:1.8] [display:grid] [gap:0] [&_a]:[display:flex] [&_a]:[justify-content:space-between] [&_a]:[gap:15px] [&_a]:[padding:15px_0] [&_a]:[border-bottom:1px_solid_var(--line)] [&_a]:[color:#aab6c9] [&_a]:[font-size:12px] [&_a]:[transition:color_0.2s] [&_a:last-child]:[border-bottom:0] [&_a_span:last-child]:[color:#9c93ff] [&_a:hover]:[color:#fff]"}>
                <span className={"section-label [color:#aeb8cd] [font-size:10px] [font-weight:800] [letter-spacing:0.18em] [margin-bottom:8px]"}>EXPLORE MORE</span>
                <Link href="/about"><span>Learn about us</span><span>↗</span></Link>
                <Link href="/services"><span>Explore our services</span><span>↗</span></Link>
                <Link href="/"><span>Discover the three hubs</span><span>↗</span></Link>
              </div>
            </aside>
          </div>
        </section>

        <section className={"cta-section section [padding-top:20px] [padding:100px_0] max-[600px]:[padding:72px_0]"}>
          <div className={"container cta-box reveal [width:min(calc(100%_-_40px),_var(--container))] [margin-inline:auto] max-[600px]:[width:min(calc(100%_-_28px),_var(--container))] [&_h2]:[margin-top:12px] [&_h2]:[font:700_clamp(34px,_4.5vw,_52px)_/_1.04_\"Space_Grotesk\",_sans-serif] [&_h2]:[letter-spacing:-0.045em] [&_h2_span]:[color:#8178ff] [padding:70px_30px] [text-align:center] [border:1px_solid_rgba(99,_133,_255,_0.22)] [border-radius:28px] [background:radial-gradient(_circle_at_50%_0,_rgba(99,_133,_255,_0.17),_transparent_48%_),_rgba(255,_255,_255,_0.025)] [&_h2]:[max-width:800px] [&_h2]:[margin-inline:auto] [&_p]:[max-width:650px] [&_p]:[margin:18px_auto_25px] [&_p]:[color:var(--muted)] [&_p]:[font-size:14px] max-[600px]:[&_h2]:[font-size:36px] max-[600px]:[padding:55px_20px] [opacity:0] [transform:translateY(20px)] [transition:opacity_0.65s_ease,_transform_0.65s_ease] motion-reduce:[opacity:1] motion-reduce:[transform:none]"}>
            <span className={"section-label [color:#aeb8cd] [font-size:10px] [font-weight:800] [letter-spacing:0.18em] [margin-bottom:8px]"}>YOUR NEXT STEP</span>
            <h2>
              Learn. Create.
              <span> Develop.</span>
            </h2>
            <p>Your journey can begin today. Explore the platform and choose the path that fits your goals.</p>
            <Link href="/get-started" className={"btn btn-primary get-started-button [display:inline-flex] [align-items:center] [justify-content:center] [gap:11px] [border-radius:12px] [font-weight:700] [transition:transform_0.2s,_box-shadow_0.2s] [&:hover]:[transform:translateY(-2px)] [min-height:50px] [padding:0_20px] [color:#fff] [background:linear-gradient(_135deg,_var(--primary),_var(--blue)_)] [box-shadow:0_16px_38px_rgba(85,_91,_220,_0.25)]"}>
              Get Started Free <span>→</span>
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
