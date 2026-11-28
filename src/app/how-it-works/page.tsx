"use client";

import Link from "next/link";
import { SiteFooter } from "@/src/components/footer";
import { SiteHeader } from "@/src/components/header";
import { useReveal } from "@/src/hooks/use-reveal";

export default function HowItWorksPage() {
  useReveal();

  return (
    <>
      <div className={"page-bg [position:fixed] [inset:0] [pointer-events:none] [z-index:-2] [background:radial-gradient(_circle_at_78%_13%,_rgba(99,133,255,.15),_transparent_28%_),_radial-gradient(_circle_at_15%_58%,_rgba(155,123,255,.07),_transparent_28%_),_linear-gradient(_180deg,_#080d1b_0%,_#0d1427_55%,_#080d1b_100%_)] [&::after]:[content:\"\"] [&::after]:[position:absolute] [&::after]:[inset:0] [&::after]:[opacity:.32] [&::after]:[background-image:linear-gradient(_rgba(255,255,255,.025)_1px,_transparent_1px_),_linear-gradient(_90deg,_rgba(255,255,255,.025)_1px,_transparent_1px_)] [&::after]:[background-size:48px_48px] [&::after]:[mask-image:linear-gradient(_to_bottom,_black,_transparent_82%_)]"} aria-hidden="true" />
      <SiteHeader active="/how-it-works" />
      <main>
        <section className={"section how-section [padding:105px_0] max-[780px]:[padding:78px_0] [background:rgba(255,255,255,.015)]"} id="how-it-works">
          <div className={"container [width:min(calc(100%_-_40px),_var(--container))] [margin-inline:auto] max-[780px]:[width:min(_calc(100%_-_28px),_var(--container)_)] max-[1024px]:[min-width:0] max-[768px]:[width:min(calc(100%_-_32px),_var(--container))] max-[320px]:[width:calc(100%_-_24px)]"}>
            <div className={"section-heading centered reveal [max-width:700px] [margin-bottom:18px] [&_h2]:[margin-top:12px] [&_h2]:[font-family:\"Space_Grotesk\",_sans-serif] [&_h2]:[font-size:clamp(36px,_4.5vw,_58px)] [&_h2]:[line-height:1.03] [&_h2]:[letter-spacing:-.045em] [&_h2_span]:[color:#7e77ff] [&_p]:[max-width:630px] [&_p]:[margin-top:16px] [&_p]:[color:var(--muted)] max-[560px]:[&_h2]:[font-size:36px] max-[320px]:[&_h2]:[font-size:31px] [&_h2]:[color:var(--text)] [text-align:center] [margin-inline:auto] [&_p]:[margin-inline:auto] [opacity:0] [transform:translateY(22px)] [transition:opacity_.7s_ease,_transform_.7s_ease]"}>
              <span className={"section-label [color:#aeb8cd] [font-size:11px] [font-weight:800] [letter-spacing:.18em] max-[320px]:[font-size:9px] max-[320px]:[letter-spacing:.12em]"}>HOW IT WORKS</span>
              <h2>Your journey starts simple.</h2>
              <p>Four steps from signing up to building your own path.</p>
            </div>
            <div className={"steps [display:grid] [grid-template-columns:repeat(4,_1fr)] [border-top:1px_solid_var(--line)] [border-bottom:1px_solid_var(--line)] max-[1000px]:[grid-template-columns:1fr_1fr] max-[560px]:[grid-template-columns:1fr]"}>
              <article className={"step reveal [min-height:210px] [padding:28px_25px] [border-right:1px_solid_var(--line)] [&:last-child]:[border-right:0] [&_>_span]:[color:#6385ff] [&_>_span]:[font-family:\"Space_Grotesk\",_sans-serif] [&_>_span]:[font-weight:700] [&_>_span]:[font-size:12px] [&_h3]:[margin-top:34px] [&_h3]:[font-family:\"Space_Grotesk\",_sans-serif] [&_h3]:[font-size:18px] [&_p]:[color:var(--muted)] [&_p]:[font-size:13px] [&_p]:[margin-top:8px] max-[1000px]:[&:nth-child(2)]:[border-right:0] max-[1000px]:[&:nth-child(-n+2)]:[border-bottom:1px_solid_var(--line)] max-[560px]:[min-height:auto] max-[560px]:[border-right:0] max-[560px]:[border-bottom:1px_solid_var(--line)] max-[560px]:[&:last-child]:[border-bottom:0] max-[560px]:[&_h3]:[margin-top:22px] [opacity:0] [transform:translateY(22px)] [transition:opacity_.7s_ease,_transform_.7s_ease]"}>
                <span>01</span>
                <div>
                  <h3>Create your account</h3>
                  <p>Start with a free account and enter your learning space.</p>
                </div>
              </article>
              <article className={"step reveal reveal-delay [min-height:210px] [padding:28px_25px] [border-right:1px_solid_var(--line)] [&:last-child]:[border-right:0] [&_>_span]:[color:#6385ff] [&_>_span]:[font-family:\"Space_Grotesk\",_sans-serif] [&_>_span]:[font-weight:700] [&_>_span]:[font-size:12px] [&_h3]:[margin-top:34px] [&_h3]:[font-family:\"Space_Grotesk\",_sans-serif] [&_h3]:[font-size:18px] [&_p]:[color:var(--muted)] [&_p]:[font-size:13px] [&_p]:[margin-top:8px] max-[1000px]:[&:nth-child(2)]:[border-right:0] max-[1000px]:[&:nth-child(-n+2)]:[border-bottom:1px_solid_var(--line)] max-[560px]:[min-height:auto] max-[560px]:[border-right:0] max-[560px]:[border-bottom:1px_solid_var(--line)] max-[560px]:[&:last-child]:[border-bottom:0] max-[560px]:[&_h3]:[margin-top:22px] [opacity:0] [transform:translateY(22px)] [transition:opacity_.7s_ease,_transform_.7s_ease] [transition-delay:.08s]"}>
                <span>02</span>
                <div>
                  <h3>Tell us your goals</h3>
                  <p>Choose your interests, level and the areas you want to develop.</p>
                </div>
              </article>
              <article className={"step reveal reveal-delay-2 [min-height:210px] [padding:28px_25px] [border-right:1px_solid_var(--line)] [&:last-child]:[border-right:0] [&_>_span]:[color:#6385ff] [&_>_span]:[font-family:\"Space_Grotesk\",_sans-serif] [&_>_span]:[font-weight:700] [&_>_span]:[font-size:12px] [&_h3]:[margin-top:34px] [&_h3]:[font-family:\"Space_Grotesk\",_sans-serif] [&_h3]:[font-size:18px] [&_p]:[color:var(--muted)] [&_p]:[font-size:13px] [&_p]:[margin-top:8px] max-[1000px]:[&:nth-child(2)]:[border-right:0] max-[1000px]:[&:nth-child(-n+2)]:[border-bottom:1px_solid_var(--line)] max-[560px]:[min-height:auto] max-[560px]:[border-right:0] max-[560px]:[border-bottom:1px_solid_var(--line)] max-[560px]:[&:last-child]:[border-bottom:0] max-[560px]:[&_h3]:[margin-top:22px] [opacity:0] [transform:translateY(22px)] [transition:opacity_.7s_ease,_transform_.7s_ease] [transition-delay:.16s]"}>
                <span>03</span>
                <div>
                  <h3>Choose your path</h3>
                  <p>Explore Education, Digital Skills or Entrepreneurship — or combine them.</p>
                </div>
              </article>
              <article className={"step reveal reveal-delay-3 [min-height:210px] [padding:28px_25px] [border-right:1px_solid_var(--line)] [&:last-child]:[border-right:0] [&_>_span]:[color:#6385ff] [&_>_span]:[font-family:\"Space_Grotesk\",_sans-serif] [&_>_span]:[font-weight:700] [&_>_span]:[font-size:12px] [&_h3]:[margin-top:34px] [&_h3]:[font-family:\"Space_Grotesk\",_sans-serif] [&_h3]:[font-size:18px] [&_p]:[color:var(--muted)] [&_p]:[font-size:13px] [&_p]:[margin-top:8px] max-[1000px]:[&:nth-child(2)]:[border-right:0] max-[1000px]:[&:nth-child(-n+2)]:[border-bottom:1px_solid_var(--line)] max-[560px]:[min-height:auto] max-[560px]:[border-right:0] max-[560px]:[border-bottom:1px_solid_var(--line)] max-[560px]:[&:last-child]:[border-bottom:0] max-[560px]:[&_h3]:[margin-top:22px] [opacity:0] [transform:translateY(22px)] [transition:opacity_.7s_ease,_transform_.7s_ease] [transition-delay:.24s]"}>
                <span>04</span>
                <div>
                  <h3>Keep developing</h3>
                  <p>Learn, practise, track progress and keep moving forward.</p>
                </div>
              </article>
            </div>
          </div>
        </section>
        <section className={"section final-section [padding:105px_0] max-[780px]:[padding:78px_0] [padding-top:40px]"}>
          <div className={"container [width:min(calc(100%_-_40px),_var(--container))] [margin-inline:auto] max-[780px]:[width:min(_calc(100%_-_28px),_var(--container)_)] max-[1024px]:[min-width:0] max-[768px]:[width:min(calc(100%_-_32px),_var(--container))] max-[320px]:[width:calc(100%_-_24px)]"}>
            <div className={"final-card reveal [&_h2]:[margin-top:12px] [&_h2]:[font-family:\"Space_Grotesk\",_sans-serif] [&_h2]:[font-size:clamp(36px,_4.5vw,_58px)] [&_h2]:[line-height:1.03] [&_h2]:[letter-spacing:-.045em] [padding:85px_40px] [text-align:center] [border:1px_solid_var(--line)] [border-radius:30px] [background:radial-gradient(_circle_at_50%_0%,_rgba(99,133,255,.18),_transparent_45%_),_rgba(255,255,255,.025)] [&_p]:[margin:16px_auto_28px] [&_p]:[color:var(--muted)] max-[560px]:[&_h2]:[font-size:36px] max-[560px]:[padding:60px_22px] max-[320px]:[&_h2]:[font-size:31px] max-[320px]:[padding:48px_16px] [opacity:0] [transform:translateY(22px)] [transition:opacity_.7s_ease,_transform_.7s_ease]"}>
              <span className={"section-label [color:#aeb8cd] [font-size:11px] [font-weight:800] [letter-spacing:.18em] max-[320px]:[font-size:9px] max-[320px]:[letter-spacing:.12em]"}>YOUR NEXT STEP</span>
              <h2>Ready to learn, create and develop?</h2>
              <p>Start free and build a learning journey around your goals.</p>
              <Link href="/get-started" className={"btn btn-primary large get-started-button [display:inline-flex] [align-items:center] [justify-content:center] [gap:12px] [border-radius:12px] [font-weight:700] [transition:transform_.2s_ease,_box-shadow_.2s_ease,_background_.2s_ease] [&:hover]:[transform:translateY(-2px)] [min-height:56px] [padding:0_20px] max-[560px]:[width:100%] [color:#fff] [background:linear-gradient(_135deg,_var(--primary),_var(--primary-2)_)] [box-shadow:0_16px_38px_rgba(85,91,220,.27)] [padding-inline:26px]"}>
                Get Started Free <span>→</span>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
