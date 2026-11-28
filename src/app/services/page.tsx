"use client";

import Link from "next/link";
import { SiteFooter } from "@/src/components/footer";
import { SiteHeader } from "@/src/components/header";
import { SiteLogoMark } from "@/src/components/site-logo-mark";
import { useReveal } from "@/src/hooks/use-reveal";

export default function ServicesPage() {
  useReveal();

  return (
    <>
      <div className={"page-bg [position:fixed] [inset:0] [z-index:-2] [pointer-events:none] [background:radial-gradient(_circle_at_78%_10%,_rgba(99,133,255,.15),_transparent_28%_),_radial-gradient(_circle_at_12%_60%,_rgba(155,123,255,.07),_transparent_28%_),_linear-gradient(_180deg,_#080d1b,_#0d1427_55%,_#080d1b_)] [&::after]:[content:\"\"] [&::after]:[position:absolute] [&::after]:[inset:0] [&::after]:[opacity:.28] [&::after]:[background-image:linear-gradient(_rgba(255,255,255,.025)_1px,_transparent_1px_),_linear-gradient(_90deg,_rgba(255,255,255,.025)_1px,_transparent_1px_)] [&::after]:[background-size:48px_48px] [&::after]:[mask-image:linear-gradient(_to_bottom,_#000,_transparent_88%_)]"} aria-hidden="true" />
      <SiteHeader active="/services" />
      <main>
        <section className={"services-hero section [min-height:calc(100vh_-_76px)] [display:flex] [align-items:center] [padding:105px_0] max-[780px]:[padding-top:60px] max-[780px]:[padding:78px_0]"}>
          <div className={"container services-hero-grid [width:min(calc(100%_-_40px),_var(--container))] [margin:auto] max-[780px]:[width:min(_calc(100%_-_28px),_var(--container)_)] [display:grid] [grid-template-columns:.95fr_1.05fr] [align-items:center] [gap:70px] max-[1050px]:[grid-template-columns:1fr] max-[1050px]:[gap:50px]"}>
            <div className={"hero-copy reveal [max-width:650px] [&_h1]:[margin-top:17px] [&_h1]:[font-family:\"Space_Grotesk\",_sans-serif] [&_h1]:[font-size:clamp(50px,6vw,78px)] [&_h1]:[line-height:.98] [&_h1]:[letter-spacing:-.06em] [&_h1_span]:[display:block] [&_h1_span]:[color:#c4b5fd] max-[1050px]:[max-width:750px] max-[780px]:[&_h1]:[font-size:clamp(_50px,_13vw,_74px_)] [opacity:0] [transform:translateY(22px)] [transition:opacity_.7s_ease,_transform_.7s_ease]"}>
              <span className={"section-label [color:#aeb8cd] [font-size:11px] [font-weight:800] [letter-spacing:.18em]"}>WHAT WE OFFER</span>
              <h1>
                Everything you need to
                <span> keep moving forward.</span>
              </h1>
              <p className={"hero-lead [margin-top:27px] [max-width:600px] [color:#aeb9cb] [font-size:18px] [line-height:1.75] max-[780px]:[font-size:16px]"}>
                CEO JACK LEARNING HUB brings learning, practical digital skills, entrepreneurship and AI support together in one connected platform.
              </p>
              <div className={"hero-actions [display:flex] [flex-wrap:wrap] [gap:12px] [margin-top:30px] max-[780px]:[flex-direction:column]"}>
                <Link href="/get-started" className={"btn btn-primary get-started-button [display:inline-flex] [align-items:center] [justify-content:center] [gap:11px] [border-radius:12px] [font-weight:700] [transition:.2s] [&:hover]:[transform:translateY(-2px)] [min-height:50px] [padding:0_20px] max-[780px]:[width:100%] [color:#fff] [background:linear-gradient(_135deg,_var(--primary),_var(--primary2)_)] [box-shadow:0_16px_38px_rgba(85,91,220,.27)]"}>
                  Get Started Free <span>→</span>
                </Link>
                <a href="#services" className={"btn btn-secondary [display:inline-flex] [align-items:center] [justify-content:center] [gap:11px] [border-radius:12px] [font-weight:700] [transition:.2s] [&:hover]:[transform:translateY(-2px)] [min-height:50px] [padding:0_20px] max-[780px]:[width:100%] [color:#dfe5f2] [border:1px_solid_var(--line)] [background:rgba(255,255,255,.035)]"}>
                  Explore Services
                </a>
              </div>
            </div>
            <div className={"services-visual reveal reveal-delay [min-height:470px] [display:grid] [place-items:center] max-[780px]:[min-height:420px] max-[520px]:[min-height:390px] [opacity:0] [transform:translateY(22px)] [transition:opacity_.7s_ease,_transform_.7s_ease] [transition-delay:.08s]"}>
              <div className={"visual-card [width:min(100%,560px)] [min-height:480px] [padding:20px] [position:relative] [overflow:hidden] [border:1px_solid_rgba(255,255,255,.1)] [border-radius:28px] [background:linear-gradient(_145deg,_rgba(24,35,63,.96),_rgba(12,19,37,.97)_)] [box-shadow:var(--shadow)] max-[780px]:[min-height:420px] max-[520px]:[min-height:390px] max-[520px]:[padding:14px]"}>
                <div className={"visual-top [min-height:35px] [display:flex] [align-items:center] [justify-content:space-between] [color:#718099] [font-size:9px] [letter-spacing:.13em]"}>
                  <span>CEO JACK ECOSYSTEM</span>
                  <span className={"status [display:flex] [align-items:center] [gap:6px] [&_b]:[width:5px] [&_b]:[height:5px] [&_b]:[border-radius:50%] [&_b]:[background:var(--green)] [&_b]:[box-shadow:0_0_12px_var(--green)]"}>
                    <b />
                    Learning in motion
                  </span>
                </div>
                <div className={"service-orbit [height:390px] [position:relative] [display:grid] [place-items:center] max-[780px]:[height:340px] max-[520px]:[height:315px]"}>
                  <div className={"orbit orbit-one [position:absolute] [border:1px_solid_rgba(99,133,255,.23)] [border-radius:50%] [width:230px] [height:230px] animate-spin-slow max-[520px]:[width:190px] max-[520px]:[height:190px]"} />
                  <div className={"orbit orbit-two [position:absolute] [border:1px_solid_rgba(99,133,255,.23)] [border-radius:50%] [width:340px] [height:190px] [transform:rotate(-30deg)] [border-color:rgba(155,123,255,.2)] animate-spin-two max-[780px]:[width:300px] max-[520px]:[width:265px] max-[520px]:[height:145px]"} />
                  <div className={"orbit orbit-three [position:absolute] [border:1px_solid_rgba(99,133,255,.23)] [border-radius:50%] [width:370px] [height:370px] [border-color:rgba(99,133,255,.1)] max-[780px]:[width:320px] max-[780px]:[height:320px] max-[520px]:[width:285px] max-[520px]:[height:285px]"} />
                  <div className={"orbit-node node-education [position:absolute] [z-index:4] [width:65px] [height:65px] [display:grid] [place-items:center] [border-radius:50%] [background:#0d162a] [border:1px_solid_rgba(255,255,255,.13)] [color:#cdd6e6] [font-size:9px] [font-weight:800] [box-shadow:0_14px_30px_rgba(0,0,0,.25)] max-[520px]:[width:57px] max-[520px]:[height:57px] max-[520px]:[font-size:8px] [top:62px] [left:50%] [transform:translateX(-50%)] max-[520px]:[top:50px]"}>EDU</div>
                  <div className={"orbit-node node-skills [position:absolute] [z-index:4] [width:65px] [height:65px] [display:grid] [place-items:center] [border-radius:50%] [background:#0d162a] [border:1px_solid_rgba(255,255,255,.13)] [color:#cdd6e6] [font-size:9px] [font-weight:800] [box-shadow:0_14px_30px_rgba(0,0,0,.25)] max-[520px]:[width:57px] max-[520px]:[height:57px] max-[520px]:[font-size:8px] [left:10%] [bottom:66px] max-[780px]:[left:4%] max-[520px]:[bottom:38px]"}>SKILLS</div>
                  <div className={"orbit-node node-business [position:absolute] [z-index:4] [width:65px] [height:65px] [display:grid] [place-items:center] [border-radius:50%] [background:#0d162a] [border:1px_solid_rgba(255,255,255,.13)] [color:#cdd6e6] [font-size:9px] [font-weight:800] [box-shadow:0_14px_30px_rgba(0,0,0,.25)] max-[520px]:[width:57px] max-[520px]:[height:57px] max-[520px]:[font-size:8px] [right:10%] [bottom:66px] max-[780px]:[right:4%] max-[520px]:[bottom:38px]"}>BUSINESS</div>
                  <div className={"visual-core [width:145px] [height:145px] [z-index:3] [display:flex] [flex-direction:column] [align-items:center] [justify-content:center] [border-radius:50%] [background:radial-gradient(_circle_at_45%_35%,_rgba(141,131,255,.28),_rgba(10,17,34,.98)_68%_)] [border:1px_solid_rgba(99,133,255,.4)] [box-shadow:0_0_55px_rgba(99,133,255,.22)] [&_strong]:[font-family:\"Space_Grotesk\",_sans-serif] [&_strong]:[font-size:35px] [&_strong]:[letter-spacing:-.06em]  [&_strong]:[color:#c4b5fd] [&_small]:[margin-top:3px] [&_small]:[color:#77859d] [&_small]:[font-size:7px] [&_small]:[letter-spacing:.2em] max-[520px]:[width:120px] max-[520px]:[height:120px]"}>
                    <SiteLogoMark className={"services-center-logo [width:70px] [height:70px] [margin-bottom:4px] [border-radius:12px] [object-fit:cover]"} width={140} height={140} alt="CEO JACK Learning Hub logo" />
                    <small>LEARN</small>
                    <small>CREATE</small>
                    <small>DEVELOP</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className={"section [padding:105px_0] max-[780px]:[padding:78px_0]"} id="services">
          <div className={"container [width:min(calc(100%_-_40px),_var(--container))] [margin:auto] max-[780px]:[width:min(_calc(100%_-_28px),_var(--container)_)]"}>
            <div className={"section-heading centered reveal [max-width:700px] [margin-bottom:48px] [&_h2]:[margin-top:12px] [&_h2]:[font-family:\"Space_Grotesk\",_sans-serif] [&_h2]:[font-size:clamp(36px,4.5vw,58px)] [&_h2]:[line-height:1.03] [&_h2]:[letter-spacing:-.045em] [&_h2_span]:[color:#8178ff] [&_p]:[max-width:650px] [&_p]:[margin-top:16px] [&_p]:[color:var(--muted)] max-[520px]:[&_h2]:[font-size:36px] [text-align:center] [margin-inline:auto] [&_p]:[margin-inline:auto] [opacity:0] [transform:translateY(22px)] [transition:opacity_.7s_ease,_transform_.7s_ease]"}>
              <span className={"section-label [color:#aeb8cd] [font-size:11px] [font-weight:800] [letter-spacing:.18em]"}>CORE SERVICES</span>
              <h2>
                Three pathways.
                <span> One ecosystem.</span>
              </h2>
              <p>Start with what you need today and grow into the other areas as your goals develop.</p>
            </div>
            <div className={"service-grid [display:grid] [grid-template-columns:repeat(3,1fr)] [gap:18px] max-[1050px]:[grid-template-columns:1fr]"}>
              <article className={"service-card education reveal [min-height:500px] [padding:30px] [position:relative] [border:1px_solid_var(--line)] [border-radius:var(--radius)] [background:rgba(255,255,255,.025)] [&_h3]:[margin-top:8px] [&_h3]:[font-family:\"Space_Grotesk\",_sans-serif] [&_h3]:[font-size:27px] [&_>_p]:[margin-top:12px] [&_>_p]:[color:var(--muted)] [&_>_p]:[font-size:14px] [&_>_p]:[line-height:1.75] [&_ul]:[list-style:none] [&_ul]:[margin-top:22px] [&_ul]:[padding-top:17px] [&_ul]:[border-top:1px_solid_var(--line)] [&_li]:[position:relative] [&_li]:[padding:6px_0_6px_18px] [&_li]:[color:#9ba8bb] [&_li]:[font-size:12px] [&_li::before]:[content:\"\"] [&_li::before]:[position:absolute] [&_li::before]:[left:0] [&_li::before]:[top:14px] [&_li::before]:[width:5px] [&_li::before]:[height:5px] [&_li::before]:[border-radius:50%] [&_li::before]:[background:#8178ff] [&_>_a]:[display:inline-block] [&_>_a]:[margin-top:25px] [&_>_a]:[color:#e0e6f1] [&_>_a]:[font-size:13px] [&_>_a]:[font-weight:800] max-[1050px]:[min-height:auto] [border-top:2px_solid_var(--primary)] [opacity:0] [transform:translateY(22px)] [transition:opacity_.7s_ease,_transform_.7s_ease]"}>
                <div className={"service-number [position:absolute] [top:24px] [right:25px] [color:#58657c] [font-size:10px] [font-weight:800] [letter-spacing:.13em]"}>01</div>
                <div className={"service-icon [width:50px] [height:50px] [margin:35px_0_20px] [display:grid] [place-items:center] [border-radius:13px] [color:#fff] [background:rgba(99,133,255,.13)] [border:1px_solid_rgba(99,133,255,.2)] [font-family:\"Space_Grotesk\",_sans-serif] [font-weight:700]"}>▦</div>
                <span className={"service-tag [color:#7e8ba1] [font-size:9px] [font-weight:800] [letter-spacing:.18em]"}>LEARN</span>
                <h3>Education Hub</h3>
                <p>A structured learning environment for academic development, subjects, topics, lessons, practice and progress.</p>
                <ul>
                  <li>Class and subject pathways</li>
                  <li>Topic-based learning</li>
                  <li>Lessons and practice</li>
                  <li>Learning progress</li>
                </ul>
                <Link href="/education">Explore Education →</Link>
              </article>
              <article className={"service-card skills reveal reveal-delay [min-height:500px] [padding:30px] [position:relative] [border:1px_solid_var(--line)] [border-radius:var(--radius)] [background:rgba(255,255,255,.025)] [&_h3]:[margin-top:8px] [&_h3]:[font-family:\"Space_Grotesk\",_sans-serif] [&_h3]:[font-size:27px] [&_>_p]:[margin-top:12px] [&_>_p]:[color:var(--muted)] [&_>_p]:[font-size:14px] [&_>_p]:[line-height:1.75] [&_ul]:[list-style:none] [&_ul]:[margin-top:22px] [&_ul]:[padding-top:17px] [&_ul]:[border-top:1px_solid_var(--line)] [&_li]:[position:relative] [&_li]:[padding:6px_0_6px_18px] [&_li]:[color:#9ba8bb] [&_li]:[font-size:12px] [&_li::before]:[content:\"\"] [&_li::before]:[position:absolute] [&_li::before]:[left:0] [&_li::before]:[top:14px] [&_li::before]:[width:5px] [&_li::before]:[height:5px] [&_li::before]:[border-radius:50%] [&_li::before]:[background:#8178ff] [&_>_a]:[display:inline-block] [&_>_a]:[margin-top:25px] [&_>_a]:[color:#e0e6f1] [&_>_a]:[font-size:13px] [&_>_a]:[font-weight:800] max-[1050px]:[min-height:auto] [border-top:2px_solid_var(--cyan)] [opacity:0] [transform:translateY(22px)] [transition:opacity_.7s_ease,_transform_.7s_ease] [transition-delay:.08s]"}>
                <div className={"service-number [position:absolute] [top:24px] [right:25px] [color:#58657c] [font-size:10px] [font-weight:800] [letter-spacing:.13em]"}>02</div>
                <div className={"service-icon [width:50px] [height:50px] [margin:35px_0_20px] [display:grid] [place-items:center] [border-radius:13px] [color:#fff] [background:rgba(99,133,255,.13)] [border:1px_solid_rgba(99,133,255,.2)] [font-family:\"Space_Grotesk\",_sans-serif] [font-weight:700]"}>&lt;/&gt;</div>
                <span className={"service-tag [color:#7e8ba1] [font-size:9px] [font-weight:800] [letter-spacing:.18em]"}>CREATE</span>
                <h3>Digital Skills Hub</h3>
                <p>Practical technology learning designed to help learners move from consuming technology to creating with it.</p>
                <ul>
                  <li>Web development</li>
                  <li>Programming and coding</li>
                  <li>AI and digital tools</li>
                  <li>Practical projects</li>
                </ul>
                <Link href="/digital-skills">Explore Digital Skills →</Link>
              </article>
              <article className={"service-card business reveal reveal-delay-2 [min-height:500px] [padding:30px] [position:relative] [border:1px_solid_var(--line)] [border-radius:var(--radius)] [background:rgba(255,255,255,.025)] [&_h3]:[margin-top:8px] [&_h3]:[font-family:\"Space_Grotesk\",_sans-serif] [&_h3]:[font-size:27px] [&_>_p]:[margin-top:12px] [&_>_p]:[color:var(--muted)] [&_>_p]:[font-size:14px] [&_>_p]:[line-height:1.75] [&_ul]:[list-style:none] [&_ul]:[margin-top:22px] [&_ul]:[padding-top:17px] [&_ul]:[border-top:1px_solid_var(--line)] [&_li]:[position:relative] [&_li]:[padding:6px_0_6px_18px] [&_li]:[color:#9ba8bb] [&_li]:[font-size:12px] [&_li::before]:[content:\"\"] [&_li::before]:[position:absolute] [&_li::before]:[left:0] [&_li::before]:[top:14px] [&_li::before]:[width:5px] [&_li::before]:[height:5px] [&_li::before]:[border-radius:50%] [&_li::before]:[background:#8178ff] [&_>_a]:[display:inline-block] [&_>_a]:[margin-top:25px] [&_>_a]:[color:#e0e6f1] [&_>_a]:[font-size:13px] [&_>_a]:[font-weight:800] max-[1050px]:[min-height:auto] [border-top:2px_solid_var(--green)] [opacity:0] [transform:translateY(22px)] [transition:opacity_.7s_ease,_transform_.7s_ease] [transition-delay:.16s]"}>
                <div className={"service-number [position:absolute] [top:24px] [right:25px] [color:#58657c] [font-size:10px] [font-weight:800] [letter-spacing:.13em]"}>03</div>
                <div className={"service-icon [width:50px] [height:50px] [margin:35px_0_20px] [display:grid] [place-items:center] [border-radius:13px] [color:#fff] [background:rgba(99,133,255,.13)] [border:1px_solid_rgba(99,133,255,.2)] [font-family:\"Space_Grotesk\",_sans-serif] [font-weight:700]"}>↗</div>
                <span className={"service-tag [color:#7e8ba1] [font-size:9px] [font-weight:800] [letter-spacing:.18em]"}>DEVELOP</span>
                <h3>Entrepreneurship Hub</h3>
                <p>Build business awareness and financial thinking while learning how ideas can become useful opportunities.</p>
                <ul>
                  <li>Business ideas</li>
                  <li>Financial literacy</li>
                  <li>Entrepreneurial thinking</li>
                  <li>Opportunity discovery</li>
                </ul>
                <Link href="/entrepreneurship">Explore Entrepreneurship →</Link>
              </article>
            </div>
          </div>
        </section>

        <section className={"section support-section [padding:105px_0] max-[780px]:[padding:78px_0] [background:rgba(255,255,255,.012)]"}>
          <div className={"container [width:min(calc(100%_-_40px),_var(--container))] [margin:auto] max-[780px]:[width:min(_calc(100%_-_28px),_var(--container)_)]"}>
            <div className={"section-heading reveal [max-width:700px] [margin-bottom:48px] [&_h2]:[margin-top:12px] [&_h2]:[font-family:\"Space_Grotesk\",_sans-serif] [&_h2]:[font-size:clamp(36px,4.5vw,58px)] [&_h2]:[line-height:1.03] [&_h2]:[letter-spacing:-.045em] [&_h2_span]:[color:#8178ff] [&_p]:[max-width:650px] [&_p]:[margin-top:16px] [&_p]:[color:var(--muted)] max-[520px]:[&_h2]:[font-size:36px] [opacity:0] [transform:translateY(22px)] [transition:opacity_.7s_ease,_transform_.7s_ease]"}>
              <span className={"section-label [color:#aeb8cd] [font-size:11px] [font-weight:800] [letter-spacing:.18em]"}>SUPPORTING SERVICES</span>
              <h2>
                More than lessons.
                <span> A complete learning experience.</span>
              </h2>
              <p>The three hubs are the foundation. Supporting tools help learners understand, practise, organize and continue their development.</p>
            </div>
            <div className={"support-grid [display:grid] [grid-template-columns:repeat(2,1fr)] [gap:15px] max-[780px]:[grid-template-columns:1fr]"}>
              <article className={"support-card reveal [display:grid] [grid-template-columns:55px_1fr] [gap:20px] [align-items:start] [padding:25px] [border:1px_solid_var(--line)] [border-radius:18px] [background:rgba(255,255,255,.025)] [&_h3]:[font-family:\"Space_Grotesk\",_sans-serif] [&_h3]:[font-size:19px] [&_p]:[margin-top:5px] [&_p]:[color:var(--muted)] [&_p]:[font-size:13px] [&_a]:[display:inline-block] [&_a]:[margin-top:10px] [&_a]:[color:#dfe5f0] [&_a]:[font-size:12px] [&_a]:[font-weight:800] max-[520px]:[grid-template-columns:1fr] [opacity:0] [transform:translateY(22px)] [transition:opacity_.7s_ease,_transform_.7s_ease]"}>
                <div className={"support-icon [width:50px] [height:50px] [display:grid] [place-items:center] [border-radius:13px] [background:rgba(99,133,255,.11)] [border:1px_solid_rgba(99,133,255,.18)] [color:#938aff] [font-size:19px]"}>✦</div>
                <div>
                  <h3>CEO JACK AI</h3>
                  <p>Ask questions, clarify concepts, explore ideas and get learning guidance.</p>
                  <Link href="/ai">Explore AI →</Link>
                </div>
              </article>
              <article className={"support-card reveal reveal-delay [display:grid] [grid-template-columns:55px_1fr] [gap:20px] [align-items:start] [padding:25px] [border:1px_solid_var(--line)] [border-radius:18px] [background:rgba(255,255,255,.025)] [&_h3]:[font-family:\"Space_Grotesk\",_sans-serif] [&_h3]:[font-size:19px] [&_p]:[margin-top:5px] [&_p]:[color:var(--muted)] [&_p]:[font-size:13px] [&_a]:[display:inline-block] [&_a]:[margin-top:10px] [&_a]:[color:#dfe5f0] [&_a]:[font-size:12px] [&_a]:[font-weight:800] max-[520px]:[grid-template-columns:1fr] [opacity:0] [transform:translateY(22px)] [transition:opacity_.7s_ease,_transform_.7s_ease] [transition-delay:.08s]"}>
                <div className={"support-icon [width:50px] [height:50px] [display:grid] [place-items:center] [border-radius:13px] [background:rgba(99,133,255,.11)] [border:1px_solid_rgba(99,133,255,.18)] [color:#938aff] [font-size:19px]"}>✓</div>
                <div>
                  <h3>Progress & Goals</h3>
                  <p>Keep track of learning activity, completed work and development goals.</p>
                  <Link href="/get-started">Start Learning →</Link>
                </div>
              </article>
              <article className={"support-card reveal reveal-delay-2 [display:grid] [grid-template-columns:55px_1fr] [gap:20px] [align-items:start] [padding:25px] [border:1px_solid_var(--line)] [border-radius:18px] [background:rgba(255,255,255,.025)] [&_h3]:[font-family:\"Space_Grotesk\",_sans-serif] [&_h3]:[font-size:19px] [&_p]:[margin-top:5px] [&_p]:[color:var(--muted)] [&_p]:[font-size:13px] [&_a]:[display:inline-block] [&_a]:[margin-top:10px] [&_a]:[color:#dfe5f0] [&_a]:[font-size:12px] [&_a]:[font-weight:800] max-[520px]:[grid-template-columns:1fr] [opacity:0] [transform:translateY(22px)] [transition:opacity_.7s_ease,_transform_.7s_ease] [transition-delay:.16s]"}>
                <div className={"support-icon [width:50px] [height:50px] [display:grid] [place-items:center] [border-radius:13px] [background:rgba(99,133,255,.11)] [border:1px_solid_rgba(99,133,255,.18)] [color:#938aff] [font-size:19px]"}>⌘</div>
                <div>
                  <h3>Projects & Practice</h3>
                  <p>Turn knowledge into practical work through projects, exercises and creation.</p>
                  <Link href="/get-started">Build Something →</Link>
                </div>
              </article>
              <article className={"support-card reveal [display:grid] [grid-template-columns:55px_1fr] [gap:20px] [align-items:start] [padding:25px] [border:1px_solid_var(--line)] [border-radius:18px] [background:rgba(255,255,255,.025)] [&_h3]:[font-family:\"Space_Grotesk\",_sans-serif] [&_h3]:[font-size:19px] [&_p]:[margin-top:5px] [&_p]:[color:var(--muted)] [&_p]:[font-size:13px] [&_a]:[display:inline-block] [&_a]:[margin-top:10px] [&_a]:[color:#dfe5f0] [&_a]:[font-size:12px] [&_a]:[font-weight:800] max-[520px]:[grid-template-columns:1fr] [opacity:0] [transform:translateY(22px)] [transition:opacity_.7s_ease,_transform_.7s_ease]"}>
                <div className={"support-icon [width:50px] [height:50px] [display:grid] [place-items:center] [border-radius:13px] [background:rgba(99,133,255,.11)] [border:1px_solid_rgba(99,133,255,.18)] [color:#938aff] [font-size:19px]"}>◎</div>
                <div>
                  <h3>Personalized Journey</h3>
                  <p>Build an experience around your interests, goals and chosen learning path.</p>
                  <Link href="/get-started">Create Your Path →</Link>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className={"section journey-section [padding:105px_0] max-[780px]:[padding:78px_0]"}>
          <div className={"container journey-grid [width:min(calc(100%_-_40px),_var(--container))] [margin:auto] max-[780px]:[width:min(_calc(100%_-_28px),_var(--container)_)] [display:grid] [grid-template-columns:1fr_.9fr] [align-items:center] [gap:80px] max-[1050px]:[grid-template-columns:1fr] max-[1050px]:[gap:45px]"}>
            <div className={"journey-copy reveal [&_h2]:[margin-top:12px] [&_h2]:[font-family:\"Space_Grotesk\",_sans-serif] [&_h2]:[font-size:clamp(36px,4.5vw,58px)] [&_h2]:[line-height:1.03] [&_h2]:[letter-spacing:-.045em] [&_h2_span]:[color:#8178ff] [max-width:600px] [&_p]:[margin-top:20px] [&_p]:[color:var(--muted)] [&_p]:[font-size:14px] [&_p]:[line-height:1.85] max-[520px]:[&_h2]:[font-size:36px] [opacity:0] [transform:translateY(22px)] [transition:opacity_.7s_ease,_transform_.7s_ease]"}>
              <span className={"section-label [color:#aeb8cd] [font-size:11px] [font-weight:800] [letter-spacing:.18em]"}>HOW THE SERVICES CONNECT</span>
              <h2>
                Learn something.
                <span> Use it. Build with it.</span>
              </h2>
              <p>
                CEO JACK is designed to make development feel connected. Academic knowledge can strengthen digital skills. Digital skills can support projects. Business thinking can help turn useful skills into opportunities.
              </p>
            </div>
            <div className={"journey-steps reveal reveal-delay [border-top:1px_solid_var(--line)] [opacity:0] [transform:translateY(22px)] [transition:opacity_.7s_ease,_transform_.7s_ease] [transition-delay:.08s]"}>
              <div className={"journey-step [display:grid] [grid-template-columns:48px_1fr] [gap:17px] [padding:20px_0] [border-bottom:1px_solid_var(--line)] [&_>_span]:[color:#8178ff] [&_>_span]:[font-size:10px] [&_>_span]:[font-weight:800] [&_>_span]:[letter-spacing:.12em] [&_>_span]:[padding-top:5px] [&_strong]:[display:block] [&_strong]:[font-family:\"Space_Grotesk\",_sans-serif] [&_strong]:[font-size:20px] [&_small]:[display:block] [&_small]:[margin-top:3px] [&_small]:[color:#7f8ca2] [&_small]:[font-size:12px]"}>
                <span>01</span>
                <div>
                  <strong>Learn</strong>
                  <small>Build knowledge and understanding.</small>
                </div>
              </div>
              <div className={"journey-step [display:grid] [grid-template-columns:48px_1fr] [gap:17px] [padding:20px_0] [border-bottom:1px_solid_var(--line)] [&_>_span]:[color:#8178ff] [&_>_span]:[font-size:10px] [&_>_span]:[font-weight:800] [&_>_span]:[letter-spacing:.12em] [&_>_span]:[padding-top:5px] [&_strong]:[display:block] [&_strong]:[font-family:\"Space_Grotesk\",_sans-serif] [&_strong]:[font-size:20px] [&_small]:[display:block] [&_small]:[margin-top:3px] [&_small]:[color:#7f8ca2] [&_small]:[font-size:12px]"}>
                <span>02</span>
                <div>
                  <strong>Create</strong>
                  <small>Practise and turn knowledge into something real.</small>
                </div>
              </div>
              <div className={"journey-step [display:grid] [grid-template-columns:48px_1fr] [gap:17px] [padding:20px_0] [border-bottom:1px_solid_var(--line)] [&_>_span]:[color:#8178ff] [&_>_span]:[font-size:10px] [&_>_span]:[font-weight:800] [&_>_span]:[letter-spacing:.12em] [&_>_span]:[padding-top:5px] [&_strong]:[display:block] [&_strong]:[font-family:\"Space_Grotesk\",_sans-serif] [&_strong]:[font-size:20px] [&_small]:[display:block] [&_small]:[margin-top:3px] [&_small]:[color:#7f8ca2] [&_small]:[font-size:12px]"}>
                <span>03</span>
                <div>
                  <strong>Develop</strong>
                  <small>Grow your skills, thinking and future direction.</small>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className={"section cta-section [padding:105px_0] max-[780px]:[padding:78px_0] [padding-top:15px]"}>
          <div className={"container cta-box reveal [width:min(calc(100%_-_40px),_var(--container))] [margin:auto] max-[780px]:[width:min(_calc(100%_-_28px),_var(--container)_)] [&_h2]:[margin-top:12px] [&_h2]:[font-family:\"Space_Grotesk\",_sans-serif] [&_h2]:[font-size:clamp(36px,4.5vw,58px)] [&_h2]:[line-height:1.03] [&_h2]:[letter-spacing:-.045em] [&_h2_span]:[color:#8178ff] [padding:75px_35px] [text-align:center] [border:1px_solid_rgba(99,133,255,.22)] [border-radius:30px] [background:radial-gradient(_circle_at_50%_0%,_rgba(99,133,255,.18),_transparent_48%_),_rgba(255,255,255,.025)] [&_h2]:[max-width:800px] [&_h2]:[margin-inline:auto] [&_p]:[max-width:620px] [&_p]:[margin:18px_auto_27px] [&_p]:[color:var(--muted)] [&_p]:[font-size:14px] max-[520px]:[&_h2]:[font-size:36px] [opacity:0] [transform:translateY(22px)] [transition:opacity_.7s_ease,_transform_.7s_ease]"}>
            <span className={"section-label [color:#aeb8cd] [font-size:11px] [font-weight:800] [letter-spacing:.18em]"}>YOUR NEXT STEP</span>
            <h2>
              Ready to start your
              <span> SUCCESS journey?</span>
            </h2>
            <p>Create your account and begin exploring the learning path that fits you.</p>
            <Link href="/get-started" className={"btn btn-primary get-started-button [display:inline-flex] [align-items:center] [justify-content:center] [gap:11px] [border-radius:12px] [font-weight:700] [transition:.2s] [&:hover]:[transform:translateY(-2px)] [min-height:50px] [padding:0_20px] max-[780px]:[width:100%] [color:#fff] [background:linear-gradient(_135deg,_var(--primary),_var(--primary2)_)] [box-shadow:0_16px_38px_rgba(85,91,220,.27)]"}>
              Get Started Free <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
