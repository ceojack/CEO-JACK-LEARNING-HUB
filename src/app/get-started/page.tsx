"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SiteFooter } from "@/src/components/footer";
import { useReveal } from "@/src/hooks/use-reveal";

export default function GetStartedPage() {
  useReveal();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [message, setMessage] = useState("");

  function goToAuth(mode: "signup" | "signin") {
    setMessage(mode === "signup" ? "Taking you to account creation…" : "Taking you to sign in…");
    router.push(`/auth?mode=${mode}`);
  }

  return (
    <>
      <div className={"site-background [position:fixed] [inset:0] [z-index:-1] [overflow:hidden] [pointer-events:none] [background:radial-gradient(_ellipse_at_50%_0%,_rgba(45,_57,_116,_.14),_transparent_58%_)]"} aria-hidden="true">
        <div className={"background-grid [position:absolute] [inset:0] [background-image:linear-gradient(rgba(132,_151,_218,_.035)_1px,_transparent_1px),_linear-gradient(90deg,_rgba(132,_151,_218,_.035)_1px,_transparent_1px)] [background-size:58px_58px] [mask-image:linear-gradient(to_bottom,_black,_transparent_92%)]"} />
        <div className={"background-glow glow-blue [position:absolute] [width:460px] [height:460px] [border-radius:50%] [filter:blur(110px)] [opacity:.13] [top:15%] [left:-220px] [background:#9b7bff]"} />
        <div className={"background-glow glow-purple [position:absolute] [width:460px] [height:460px] [border-radius:50%] [filter:blur(110px)] [opacity:.13] [right:-220px] [bottom:4%] [background:#6385ff]"} />
      </div>

      <header className={"site-header [position:sticky] [top:0] [z-index:50] [width:min(calc(100%_-_64px),_1320px)] [min-height:92px] [margin:0_auto] [display:flex] [align-items:center] [justify-content:space-between] [gap:30px] [border-bottom:1px_solid_rgba(255,_255,_255,_.055)] [background:rgba(8,_13,_27,_.94)] [backdrop-filter:blur(16px)] max-[1120px]:[width:min(calc(100%_-_40px),_1320px)] max-[900px]:[min-height:78px] max-[600px]:[width:calc(100%_-_36px)]"}>
        <Link className={"brand [display:inline-flex] [align-items:center] [gap:11px] [flex-shrink:0]"} href="/" aria-label="CEO JACK Learning Hub home">
          <Image src="/assets/images/logo1.webp" alt="" className={"brand-logo [width:43px] [height:43px] [object-fit:contain] [border-radius:11px] max-[600px]:[width:38px] max-[600px]:[height:38px]"} width={40} height={40} priority />
          <span className={"brand-lockup [display:grid] [gap:3px] [&_strong]:[font:700_14px/1_var(--font-display)] [&_strong]:[letter-spacing:.09em] [&_small]:[color:#8c98b2] [&_small]:[font-size:8px] [&_small]:[font-weight:700] [&_small]:[letter-spacing:.24em] max-[600px]:[&_strong]:[font-size:12px] max-[600px]:[&_small]:[font-size:7px]"}>
            <strong>CEO JACK</strong>
            <small>LEARNING HUB</small>
          </span>
        </Link>
        <button
          className={"menu-toggle [display:none] max-[900px]:[width:43px] max-[900px]:[height:43px] max-[900px]:[display:grid] max-[900px]:[align-content:center] max-[900px]:[justify-items:center] max-[900px]:[gap:5px] max-[900px]:[border:1px_solid_var(--line)] max-[900px]:[border-radius:12px] max-[900px]:[background:rgba(255,_255,_255,_.035)] max-[900px]:[cursor:pointer] max-[900px]:[&_span]:[width:18px] max-[900px]:[&_span]:[height:2px] max-[900px]:[&_span]:[border-radius:2px] max-[900px]:[&_span]:[background:#e8edff] max-[900px]:[&_span]:[transition:transform_.2s_ease,_opacity_.2s_ease] max-[900px]:[&[aria-expanded=\"true\"]_span:first-child]:[transform:translateY(7px)_rotate(45deg)] max-[900px]:[&[aria-expanded=\"true\"]_span:nth-child(2)]:[opacity:0] max-[900px]:[&[aria-expanded=\"true\"]_span:last-child]:[transform:translateY(-7px)_rotate(-45deg)]"}
          type="button"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span /><span /><span />
        </button>
        <nav className={(`primary-navigation [display:flex] [align-items:center] [gap:clamp(14px,_1.8vw,_27px)] max-[1120px]:[gap:14px] max-[900px]:[position:absolute] max-[900px]:[z-index:10] max-[900px]:[top:70px] max-[900px]:[left:20px] max-[900px]:[right:20px] max-[900px]:[display:none] max-[900px]:[align-items:stretch] max-[900px]:[gap:0] max-[900px]:[padding:12px] max-[900px]:[border:1px_solid_var(--line)] max-[900px]:[border-radius:16px] max-[900px]:[background:rgba(10,_14,_28,_.98)] max-[900px]:[box-shadow:0_20px_55px_rgba(0,_0,_0,_.35)]${menuOpen ? "is-open max-[900px]:[display:flex] max-[900px]:[flex-direction:column]" : ""}`)} id="primary-navigation" aria-label="Main navigation">
          <Link className="flex min-h-10 items-center px-2 text-xs font-medium text-slate-300 transition hover:text-white" href="/" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link className="flex min-h-10 items-center px-2 text-xs font-medium text-slate-300 transition hover:text-white" href="/#hubs" onClick={() => setMenuOpen(false)}>Hubs</Link>
          <Link className="flex min-h-10 items-center px-2 text-xs font-medium text-slate-300 transition hover:text-white" href="/how-it-works" onClick={() => setMenuOpen(false)}>How It Works</Link>
          <Link className="flex min-h-10 items-center px-2 text-xs font-medium text-slate-300 transition hover:text-white" href="/about" onClick={() => setMenuOpen(false)}>About</Link>
          <Link className="flex min-h-10 items-center px-2 text-xs font-medium text-slate-300 transition hover:text-white" href="/services" onClick={() => setMenuOpen(false)}>Services</Link>
          <Link className="flex min-h-10 items-center px-2 text-xs font-medium text-slate-300 transition hover:text-white" href="/blog" onClick={() => setMenuOpen(false)}>Blog</Link>
          <Link className="flex min-h-10 items-center px-2 text-xs font-medium text-slate-300 transition hover:text-white" href="/contact" onClick={() => setMenuOpen(false)}>Contact</Link>
          <Link className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-cyan-300/25 bg-gradient-to-r from-cyan-300/10 to-violet-400/10 px-3 text-xs font-bold text-white transition hover:-translate-y-0.5 hover:border-cyan-300/60" href="/get-started" aria-current="page">
            Get Started Free <span aria-hidden="true">→</span>
          </Link>
        </nav>
      </header>

      <main>
        <section className={"start-layout [width:min(calc(100%_-_64px),_var(--page-width))] [min-height:690px] [margin:0_auto] [padding:78px_0_68px] [display:grid] [grid-template-columns:minmax(0,_1.12fr)_minmax(370px,_.78fr)] [align-items:center] [gap:clamp(50px,_8vw,_110px)] max-[1120px]:[width:min(calc(100%_-_48px),_var(--page-width))] max-[1120px]:[gap:48px] max-[900px]:[grid-template-columns:1fr] max-[900px]:[gap:48px] max-[900px]:[padding-top:65px] max-[600px]:[width:calc(100%_-_36px)] max-[600px]:[min-height:auto] max-[600px]:[padding:51px_0_42px] max-[600px]:[gap:38px]"} aria-labelledby="page-title">
          <div className={"intro-panel reveal [max-width:620px] max-[900px]:[max-width:700px] [opacity:0] [transform:translateY(15px)] [transition:opacity_.65s_ease,_transform_.65s_ease] motion-reduce:[opacity:1] motion-reduce:[transform:none]"}>
            <p className={"eyebrow [display:flex] [align-items:center] [gap:10px] [margin:0_0_23px] [color:#9ba9c8] [font-size:10px] [font-weight:700] [letter-spacing:.19em] max-[600px]:[font-size:8px] max-[600px]:[letter-spacing:.14em]"}>
              <span className={"eyebrow-dot [width:7px] [height:7px] [display:inline-block] [border-radius:50%] [background:var(--blue)] [box-shadow:0_0_14px_rgba(103,_215,_255,_.65)]"} />
              START HERE · FREE TO JOIN
            </p>
            <h1 id="page-title" className="text-[clamp(2.75rem,7vw,5rem)] font-semibold leading-[.98] tracking-[-.065em] text-white max-[600px]:text-[clamp(2.5rem,12vw,3.75rem)]">
              Start learning.
              <span className="mt-2 block text-violet-300">Build your future.</span>
            </h1>
            <p className={"intro-copy [max-width:550px] [margin:25px_0_0] [color:var(--muted)] [font-size:15px] [line-height:1.9] max-[900px]:[max-width:620px] max-[600px]:[margin-top:19px] max-[600px]:[font-size:13px] max-[600px]:[line-height:1.8]"}>
              Create a free account, choose what you want to learn, and keep your progress in one place. You can explore education, digital skills, and entrepreneurship.
            </p>
            <div className={"journey-list [position:relative] [display:grid] [gap:25px] [margin-top:42px] [&::before]:[content:\"\"] [&::before]:[position:absolute] [&::before]:[top:21px] [&::before]:[bottom:21px] [&::before]:[left:18px] [&::before]:[width:1px] [&::before]:[background:linear-gradient(var(--blue),_rgba(155,_138,_255,_.15))] max-[900px]:[max-width:560px] max-[600px]:[gap:22px] max-[600px]:[margin-top:32px] max-[600px]:[&::before]:[left:16px]"} aria-label="Your journey in three steps">
              <div className={"journey-step [position:relative] [display:grid] [grid-template-columns:37px_minmax(0,_1fr)] [align-items:start] [gap:15px] [&_h2]:[margin:2px_0_5px] [&_h2]:[font:600_14px_var(--font-display)] [&_h2]:[letter-spacing:-.02em] [&_p]:[max-width:390px] [&_p]:[margin:0] [&_p]:[color:var(--quiet)] [&_p]:[font-size:12px] [&_p]:[line-height:1.65] max-[600px]:[grid-template-columns:34px_minmax(0,_1fr)] max-[600px]:[gap:12px] max-[600px]:[&_h2]:[font-size:13px] max-[600px]:[&_p]:[font-size:11px]"}>
                <span className={"step-index [position:relative] [z-index:1] [width:37px] [height:37px] [display:grid] [place-items:center] [border:1px_solid_rgba(103,_215,_255,_.3)] [border-radius:12px] [background:#0b1020] [color:var(--blue)] [font:600_11px_var(--font-display)] max-[600px]:[width:34px] max-[600px]:[height:34px]"}>01</span>
                <div>
                  <h2>Create your account</h2>
                  <p>Sign up with your name, email, and a password.</p>
                </div>
              </div>
              <div className={"journey-step [position:relative] [display:grid] [grid-template-columns:37px_minmax(0,_1fr)] [align-items:start] [gap:15px] [&_h2]:[margin:2px_0_5px] [&_h2]:[font:600_14px_var(--font-display)] [&_h2]:[letter-spacing:-.02em] [&_p]:[max-width:390px] [&_p]:[margin:0] [&_p]:[color:var(--quiet)] [&_p]:[font-size:12px] [&_p]:[line-height:1.65] max-[600px]:[grid-template-columns:34px_minmax(0,_1fr)] max-[600px]:[gap:12px] max-[600px]:[&_h2]:[font-size:13px] max-[600px]:[&_p]:[font-size:11px]"}>
                <span className={"step-index [position:relative] [z-index:1] [width:37px] [height:37px] [display:grid] [place-items:center] [border:1px_solid_rgba(103,_215,_255,_.3)] [border-radius:12px] [background:#0b1020] [color:var(--blue)] [font:600_11px_var(--font-display)] max-[600px]:[width:34px] max-[600px]:[height:34px]"}>02</span>
                <div>
                  <h2>Choose a learning hub</h2>
                  <p>Start with Education, Digital Skills, or Entrepreneurship.</p>
                </div>
              </div>
              <div className={"journey-step [position:relative] [display:grid] [grid-template-columns:37px_minmax(0,_1fr)] [align-items:start] [gap:15px] [&_h2]:[margin:2px_0_5px] [&_h2]:[font:600_14px_var(--font-display)] [&_h2]:[letter-spacing:-.02em] [&_p]:[max-width:390px] [&_p]:[margin:0] [&_p]:[color:var(--quiet)] [&_p]:[font-size:12px] [&_p]:[line-height:1.65] max-[600px]:[grid-template-columns:34px_minmax(0,_1fr)] max-[600px]:[gap:12px] max-[600px]:[&_h2]:[font-size:13px] max-[600px]:[&_p]:[font-size:11px]"}>
                <span className={"step-index [position:relative] [z-index:1] [width:37px] [height:37px] [display:grid] [place-items:center] [border:1px_solid_rgba(103,_215,_255,_.3)] [border-radius:12px] [background:#0b1020] [color:var(--blue)] [font:600_11px_var(--font-display)] max-[600px]:[width:34px] max-[600px]:[height:34px]"}>03</span>
                <div>
                  <h2>Learn at your pace</h2>
                  <p>Follow lessons, practise skills, and return to your progress.</p>
                </div>
              </div>
            </div>
            <div className={"principle-strip [display:flex] [align-items:center] [gap:13px] [margin-top:43px] [color:#d7dff3] [font:700_10px_var(--font-display)] [letter-spacing:.2em] [&_span:first-child]:[color:var(--blue)] [&_span:last-child]:[color:#c0a3ff] max-[600px]:[gap:9px] max-[600px]:[margin-top:31px] max-[600px]:[font-size:9px]"}>
              <span>LEARN</span>
              <span className={"principle-arrow [color:#596782]"}>→</span>
              <span>CREATE</span>
              <span className={"principle-arrow [color:#596782]"}>→</span>
              <span>DEVELOP</span>
            </div>
          </div>

          <section className={"choice-card reveal [position:relative] [padding:clamp(26px,_3vw,_38px)] [overflow:hidden] [border:1px_solid_var(--line)] [border-radius:23px] [background:linear-gradient(145deg,_rgba(22,_28,_49,_.94),_rgba(12,_16,_30,_.92))] [box-shadow:0_28px_90px_rgba(0,_0,_0,_.28)] [&::before]:[content:\"\"] [&::before]:[position:absolute] [&::before]:[top:-100px] [&::before]:[right:-95px] [&::before]:[width:210px] [&::before]:[height:210px] [&::before]:[border-radius:50%] [&::before]:[background:rgba(103,_215,_255,_.09)] [&::before]:[filter:blur(55px)] [&::before]:[pointer-events:none] [&_h2]:[max-width:340px] [&_h2]:[margin:22px_0_10px] [&_h2]:[font:600_29px/1.13_var(--font-display)] [&_h2]:[letter-spacing:-.045em] max-[900px]:[width:100%] max-[900px]:[max-width:560px] max-[900px]:[justify-self:center] max-[600px]:[padding:24px_19px] max-[600px]:[border-radius:19px] max-[600px]:[&_h2]:[font-size:27px] [opacity:0] [transform:translateY(15px)] [transition:opacity_.65s_ease,_transform_.65s_ease] motion-reduce:[opacity:1] motion-reduce:[transform:none]"} aria-labelledby="choice-title">
            <div className={"card-topline [position:relative] [display:flex] [align-items:center] [justify-content:space-between] [gap:12px]"}>
              <span className={"card-kicker [color:#aeb9d2] [font-size:9px] [font-weight:700] [letter-spacing:.16em] max-[600px]:[font-size:8px] max-[600px]:[letter-spacing:.1em]"}>YOUR FIRST STEP</span>
              <span className={"free-label [&_span]:[width:6px] [&_span]:[height:6px] [&_span]:[display:inline-block] [&_span]:[border-radius:50%] [&_span]:[background:#74e6b7] [&_span]:[box-shadow:0_0_10px_rgba(116,_230,_183,_.4)] [display:inline-flex] [align-items:center] [gap:7px] [color:#93e8c7] [font-size:8px] [font-weight:700] [letter-spacing:.1em] [white-space:nowrap] max-[600px]:[font-size:7px]"}><span /> FREE TO START</span>
            </div>
            <div className={"card-symbol [width:52px] [height:52px] [display:grid] [place-items:center] [margin-top:32px] [border:1px_solid_rgba(103,_215,_255,_.24)] [border-radius:15px] [background:rgba(103,_215,_255,_.07)] [color:var(--blue)] [&_svg]:[width:30px] [&_svg]:[height:30px] max-[600px]:[margin-top:27px]"} aria-hidden="true">
              <svg viewBox="0 0 48 48" fill="none">
                <path d="M10 24h27M26 13l11 11-11 11" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h2 id="choice-title">Choose how to continue</h2>
            <p className={"card-description [margin-bottom:24px] [color:var(--muted)] [font-size:12px] [line-height:1.75] max-[600px]:[font-size:11px]"}>New to CEO JACK? Create an account. Already joined? Sign in to continue.</p>
            <button className={"action-option action-primary [width:100%] [display:grid] [grid-template-columns:42px_minmax(0,_1fr)_auto] [align-items:center] [gap:13px] [margin-top:12px] [padding:14px] [border:1px_solid_transparent] [border-radius:13px] [color:var(--text)] [text-align:left] [cursor:pointer] [transition:transform_.2s_ease,_border-color_.2s_ease,_background_.2s_ease] [&:hover]:[transform:translateY(-2px)] [&:hover]:[border-color:rgba(103,_215,_255,_.35)] [&:disabled]:[opacity:.65] [&:disabled]:[cursor:wait] [&:disabled]:[transform:none] max-[600px]:[grid-template-columns:38px_minmax(0,_1fr)_auto] max-[600px]:[gap:10px] max-[600px]:[padding:12px_10px] [border-color:rgba(103,_215,_255,_.23)] [background:linear-gradient(110deg,_rgba(65,_181,_235,_.16),_rgba(109,_103,_234,_.13))] [&:hover]:[background:linear-gradient(110deg,_rgba(65,_181,_235,_.22),_rgba(109,_103,_234,_.18))]"} type="button" onClick={() => goToAuth("signup")}>
              <span className={"option-icon [width:40px] [height:40px] [display:grid] [place-items:center] [border:1px_solid_rgba(103,_215,_255,_.2)] [border-radius:11px] [background:rgba(103,_215,_255,_.055)] [color:var(--blue)] [font-size:19px] max-[600px]:[width:36px] max-[600px]:[height:36px]"} aria-hidden="true">＋</span>
              <span className={"option-copy [&_strong]:[display:block] [&_small]:[display:block] [&_strong]:[font-size:12px] [&_strong]:[font-weight:700] [&_small]:[margin-top:5px] [&_small]:[color:#8c98b2] [&_small]:[font-size:10px] max-[600px]:[&_strong]:[font-size:11px] max-[600px]:[&_small]:[font-size:9px]"}>
                <strong>Create a free account</strong>
                <small>For new learners · Sign up with your name and email</small>
              </span>
              <span className={"option-arrow [color:var(--blue)] [font-size:18px]"} aria-hidden="true">↗</span>
            </button>
            <button className={"action-option action-secondary [width:100%] [display:grid] [grid-template-columns:42px_minmax(0,_1fr)_auto] [align-items:center] [gap:13px] [margin-top:12px] [padding:14px] [border:1px_solid_transparent] [border-radius:13px] [color:var(--text)] [text-align:left] [cursor:pointer] [transition:transform_.2s_ease,_border-color_.2s_ease,_background_.2s_ease] [&:hover]:[transform:translateY(-2px)] [&:hover]:[border-color:rgba(103,_215,_255,_.35)] [&:disabled]:[opacity:.65] [&:disabled]:[cursor:wait] [&:disabled]:[transform:none] max-[600px]:[grid-template-columns:38px_minmax(0,_1fr)_auto] max-[600px]:[gap:10px] max-[600px]:[padding:12px_10px] [border-color:rgba(255,_255,_255,_.09)] [background:rgba(255,_255,_255,_.025)]"} type="button" onClick={() => goToAuth("signin")}>
              <span className={"option-icon [width:40px] [height:40px] [display:grid] [place-items:center] [border:1px_solid_rgba(103,_215,_255,_.2)] [border-radius:11px] [background:rgba(103,_215,_255,_.055)] [color:var(--blue)] [font-size:19px] max-[600px]:[width:36px] max-[600px]:[height:36px]"} aria-hidden="true">↗</span>
              <span className={"option-copy [&_strong]:[display:block] [&_small]:[display:block] [&_strong]:[font-size:12px] [&_strong]:[font-weight:700] [&_small]:[margin-top:5px] [&_small]:[color:#8c98b2] [&_small]:[font-size:10px] max-[600px]:[&_strong]:[font-size:11px] max-[600px]:[&_small]:[font-size:9px]"}>
                <strong>Sign in to your account</strong>
                <small>For returning learners · Continue where you left off</small>
              </span>
              <span className={"option-arrow [color:var(--blue)] [font-size:18px]"} aria-hidden="true">→</span>
            </button>
            <div className={"card-separator [display:flex] [align-items:center] [gap:12px] [margin:22px_0_16px] [&_span]:[flex:1] [&_span]:[height:1px] [&_span]:[background:rgba(255,_255,_255,_.09)] [&_small]:[color:#74809b] [&_small]:[font-size:9px] [&_small]:[letter-spacing:.12em]"}>
              <span /><small>OR</small><span />
            </div>
            <Link className={"explore-link [display:flex] [align-items:center] [justify-content:center] [gap:10px] [padding:8px_0] [color:#aeb9d2] [font-size:11px] [transition:color_.2s_ease] [&_span]:[color:var(--blue)] [&_span]:[font-size:16px] [&:hover]:[color:#fff]"} href="/#hubs">
              Explore the learning hubs first <span aria-hidden="true">→</span>
            </Link>
            <p className={"form-notice [min-height:0] [margin:10px_0_0] [color:var(--blue)] [text-align:center] [font-size:11px] [line-height:1.6] [&:empty]:[display:none]"} role="status" aria-live="polite">{message}</p>
            <p className={"privacy-note [display:flex] [align-items:flex-start] [justify-content:center] [gap:8px] [margin:18px_0_0] [padding-top:15px] [border-top:1px_solid_rgba(255,_255,_255,_.07)] [color:#77839c] [font-size:9px] [line-height:1.6] [text-align:center] [&_span]:[color:#6385ff] [&_span]:[font-size:14px] [&_span]:[line-height:1]"}>
              <span aria-hidden="true">◇</span>
              Your account keeps your learning progress together. Use a password you don&apos;t use elsewhere.
            </p>
          </section>
        </section>

        <section className={"bottom-note reveal [width:min(calc(100%_-_64px),_var(--page-width))] [display:flex] [align-items:center] [gap:22px] [margin:0_auto_42px] [&_p]:[margin:0] [&_p]:[color:#8290ac] [&_p]:[font-size:11px] [&_p]:[text-align:center] [&_strong]:[color:#dce4f8] max-[600px]:[width:calc(100%_-_36px)] max-[600px]:[gap:10px] max-[600px]:[margin-bottom:30px] max-[600px]:[&_p]:[font-size:9px] max-[600px]:[&_p]:[white-space:nowrap] [opacity:0] [transform:translateY(15px)] [transition:opacity_.65s_ease,_transform_.65s_ease] motion-reduce:[opacity:1] motion-reduce:[transform:none]"} aria-label="Platform promise">
          <span className={"bottom-note-line [flex:1] [height:1px] [background:linear-gradient(90deg,_transparent,_rgba(155,_138,_255,_.18),_transparent)]"} />
          <p><strong>One platform.</strong> Three ways to grow.</p>
          <span className={"bottom-note-line [flex:1] [height:1px] [background:linear-gradient(90deg,_transparent,_rgba(155,_138,_255,_.18),_transparent)]"} />
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
