"use client";

import Link from "next/link";
import { SiteFooter } from "@/src/components/footer";
import { SiteHeader } from "@/src/components/header";
import { SiteLogoMark } from "@/src/components/site-logo-mark";
import { useReveal } from "@/src/hooks/use-reveal";

export default function AboutPage() {
  useReveal();

  return (
    <>
      <div className={"page-bg [position:fixed] [inset:0] [z-index:-2] [pointer-events:none] [background:radial-gradient(_circle_at_78%_12%,_rgba(99,_133,_255,_0.15),_transparent_28%_),_radial-gradient(_circle_at_12%_58%,_rgba(155,_123,_255,_0.07),_transparent_28%_),_linear-gradient(_180deg,_#080d1b,_#0d1427_55%,_#080d1b_)] [&::after]:[content:\"\"] [&::after]:[position:absolute] [&::after]:[inset:0] [&::after]:[opacity:0.28] [&::after]:[background-image:linear-gradient(_rgba(255,_255,_255,_0.025)_1px,_transparent_1px_),_linear-gradient(_90deg,_rgba(255,_255,_255,_0.025)_1px,_transparent_1px_)] [&::after]:[background-size:48px_48px] [&::after]:[mask-image:linear-gradient(_to_bottom,_#000,_transparent_88%_)]"} aria-hidden="true" />
      <SiteHeader active="/about" />
      <main>
        <section className={"about-hero section [min-height:calc(100vh_-_76px)] [display:flex] [align-items:center] [padding:105px_0] max-[780px]:[padding-top:60px] max-[780px]:[padding:78px_0]"}>
          <div className={"container about-hero-grid [width:min(calc(100%_-_40px),_var(--container))] [margin:auto] max-[780px]:[width:min(_calc(100%_-_28px),_var(--container)_)] [display:grid] [grid-template-columns:0.95fr_1.05fr] [align-items:center] [gap:70px] max-[1000px]:[grid-template-columns:1fr] max-[1000px]:[gap:50px]"}>
            <div className={"hero-copy reveal [max-width:620px] [&_h1]:[margin-top:17px] [&_h1]:[font-family:\"Space_Grotesk\",_sans-serif] [&_h1]:[font-size:clamp(52px,_6.4vw,_82px)] [&_h1]:[line-height:0.96] [&_h1]:[letter-spacing:-0.06em] max-[1000px]:[max-width:720px] max-[780px]:[&_h1]:[font-size:clamp(_52px,_14vw,_78px_)] [opacity:0] [transform:translateY(22px)] [transition:opacity_0.7s_ease,_transform_0.7s_ease]"}>
              <span className={"section-label [color:#aeb8cd] [font-size:11px] [font-weight:800] [letter-spacing:0.18em]"}>ABOUT CEO JACK</span>
              <h1>
                Built for people
                <span className="block text-violet-300">building their future.</span>
              </h1>
              <p className={"hero-lead [margin-top:27px] [color:#aeb9cb] [font-size:18px] [line-height:1.75] [&_strong]:[color:#f0f3fa] max-[780px]:[font-size:16px]"}>
                CEO JACK LEARNING HUB is a connected learning platform built around one simple philosophy:{" "}
                <strong>Learn. Create. Develop.</strong>
              </p>
              <p className={"hero-support [max-width:560px] [margin-top:13px] [color:#7f8da4] [font-size:14px] [line-height:1.75]"}>
                We bring education, digital skills and entrepreneurship into one experience so learning can move from knowledge to practical action.
              </p>
              <div className={"hero-actions [display:flex] [flex-wrap:wrap] [gap:12px] [margin-top:30px] max-[780px]:[align-items:stretch] max-[560px]:[flex-direction:column]"}>
                <Link href="/get-started" className={"btn btn-primary get-started-button [display:inline-flex] [align-items:center] [justify-content:center] [gap:11px] [border-radius:12px] [font-weight:700] [transition:0.2s] [&:hover]:[transform:translateY(-2px)] [min-height:50px] [padding:0_20px] max-[1000px]:[grid-column:2] max-[1000px]:[justify-self:start] max-[780px]:[flex:1] max-[780px]:[grid-column:auto] max-[780px]:[justify-self:start] max-[560px]:[width:100%] [color:#fff] [background:linear-gradient(_135deg,_var(--primary),_var(--primary2)_)] [box-shadow:0_16px_38px_rgba(85,_91,_220,_0.27)]"}>
                  Get Started Free <span>→</span>
                </Link>
                <Link href="/" className={"btn btn-secondary [display:inline-flex] [align-items:center] [justify-content:center] [gap:11px] [border-radius:12px] [font-weight:700] [transition:0.2s] [&:hover]:[transform:translateY(-2px)] [min-height:50px] [padding:0_20px] max-[1000px]:[grid-column:2] max-[1000px]:[justify-self:start] max-[780px]:[flex:1] max-[780px]:[grid-column:auto] max-[780px]:[justify-self:start] max-[560px]:[width:100%] [color:#dfe5f2] [border:1px_solid_var(--line)] [background:rgba(255,_255,_255,_0.035)]"}>
                  Explore the Hubs
                </Link>
              </div>
            </div>
            <div className={"about-visual reveal reveal-delay [position:relative] [min-height:470px] [display:grid] [place-items:center] max-[1000px]:[min-height:430px] max-[780px]:[min-height:390px] max-[560px]:[min-height:420px] [opacity:0] [transform:translateY(22px)] [transition:opacity_0.7s_ease,_transform_0.7s_ease] [transition-delay:0.08s]"}>
              <div className={"visual-card [width:min(100%,_560px)] [padding:20px] [position:relative] [overflow:hidden] [border:1px_solid_rgba(255,_255,_255,_0.1)] [border-radius:28px] [background:linear-gradient(_145deg,_rgba(24,_35,_63,_0.96),_rgba(12,_19,_37,_0.97)_)] [box-shadow:var(--shadow)] [&::after]:[content:\"\"] [&::after]:[position:absolute] [&::after]:[width:250px] [&::after]:[height:250px] [&::after]:[top:80px] [&::after]:[left:50%] [&::after]:[transform:translateX(-50%)] [&::after]:[border-radius:50%] [&::after]:[background:rgba(99,_133,_255,_0.12)] [&::after]:[filter:blur(55px)] [&::after]:[pointer-events:none] max-[560px]:[padding:14px]"}>
                <div className={"visual-top [min-height:35px] [display:flex] [align-items:center] [justify-content:space-between] [color:#718099] [font-size:9px] [letter-spacing:0.13em]"}>
                  <span>CEO JACK LEARNING HUB</span>
                  <span className={"status [display:flex] [align-items:center] [gap:6px] [&_b]:[width:5px] [&_b]:[height:5px] [&_b]:[border-radius:50%] [&_b]:[background:var(--green)] [&_b]:[box-shadow:0_0_12px_var(--green)]"}>
                    <b />
                    Connected
                  </span>
                </div>
                <div className={"visual-center [height:320px] [position:relative] [display:grid] [place-items:center] max-[780px]:[height:280px] max-[560px]:[height:275px]"}>
                  <div className={"center-ring ring-one [position:absolute] [border:1px_solid_rgba(99,_133,_255,_0.23)] [border-radius:50%] [width:250px] [height:250px] animate-spin-slow max-[780px]:[width:205px] max-[780px]:[height:205px]"} />
                  <div className={"center-ring ring-two [position:absolute] [border:1px_solid_rgba(99,_133,_255,_0.23)] [border-radius:50%] [width:355px] [height:180px] [transform:rotate(-28deg)] [border-color:rgba(155,_123,_255,_0.2)] animate-spin2 max-[780px]:[width:290px] max-[780px]:[height:150px]"} />
                  <div className={"center-core [width:150px] [height:150px] [position:relative] [z-index:2] [display:flex] [flex-direction:column] [align-items:center] [justify-content:center] [border-radius:50%] [background:radial-gradient(_circle_at_45%_35%,_rgba(141,_131,_255,_0.28),_rgba(10,_17,_34,_0.98)_68%_)] [border:1px_solid_rgba(99,_133,_255,_0.4)] [box-shadow:0_0_55px_rgba(99,_133,_255,_0.22)] [&_strong]:[font-family:\"Space_Grotesk\",_sans-serif] [&_strong]:[font-size:35px] [&_strong]:[letter-spacing:-0.06em]  [&_strong]:[color:#c4b5fd] [&_small]:[margin-top:3px] [&_small]:[color:#77859d] [&_small]:[font-size:7px] [&_small]:[letter-spacing:0.2em] max-[780px]:[width:130px] max-[780px]:[height:130px]"}>
                    <SiteLogoMark className={"about-center-logo [width:72px] [height:72px] [margin-bottom:4px] [border-radius:12px] [object-fit:cover]"} width={140} height={140} alt="CEO JACK Learning Hub logo" />
                    <small>LEARN</small>
                    <small>CREATE</small>
                    <small>DEVELOP</small>
                  </div>
                </div>
                <div className={"visual-labels [display:grid] [grid-template-columns:repeat(3,_1fr)] [gap:8px] [&_span]:[padding:10px] [&_span]:[text-align:center] [&_span]:[border:1px_solid_var(--line)] [&_span]:[border-radius:10px] [&_span]:[color:#8996aa] [&_span]:[background:rgba(255,_255,_255,_0.025)] [&_span]:[font-size:9px] [&_span]:[font-weight:700] max-[560px]:[grid-template-columns:1fr] max-[560px]:[&_span]:[padding:8px]"}>
                  <span>Education</span>
                  <span>Digital Skills</span>
                  <span>Entrepreneurship</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className={"section testimonies-section [padding:105px_0] max-[780px]:[padding:78px_0] [background:rgba(255,_255,_255,_.012)]"} aria-labelledby="testimonies-title">
          <div className={"container [width:min(calc(100%_-_40px),_var(--container))] [margin:auto] max-[780px]:[width:min(_calc(100%_-_28px),_var(--container)_)]"}>
            <div className={"section-heading centered reveal [max-width:700px] [margin-bottom:48px] [&_h2]:[margin-top:12px] [&_h2]:[font-family:\"Space_Grotesk\",_sans-serif] [&_h2]:[font-size:clamp(36px,_4.5vw,_58px)] [&_h2]:[line-height:1.03] [&_h2]:[letter-spacing:-0.045em] [&_h2_span]:[color:#8178ff] [&_p]:[max-width:650px] [&_p]:[margin-top:16px] [&_p]:[color:var(--muted)] max-[560px]:[&_h2]:[font-size:36px] [text-align:center] [margin-inline:auto] [&_p]:[margin-inline:auto] [opacity:0] [transform:translateY(22px)] [transition:opacity_0.7s_ease,_transform_0.7s_ease]"}>
              <h2 id="testimonies-title">What Our Learners Say</h2>
              <p>Real stories from real learners.</p>
            </div>
            <div className={"testimony-grid [display:grid] [grid-template-columns:repeat(3,_minmax(0,_1fr))] [gap:18px] max-[780px]:[grid-template-columns:1fr]"}>
              <article className={"hub-card testimony-card reveal [min-height:375px] [padding:30px] [position:relative] [overflow:hidden] [border:1px_solid_var(--line)] [border-radius:var(--radius)] [background:var(--surface)] [&_h3]:[font-family:\"Space_Grotesk\",_sans-serif] [&_h3]:[font-size:26px] [&_p]:[max-width:330px] [&_p]:[margin:13px_0_26px] [&_p]:[color:var(--muted)] [&_p]:[font-size:14px] [&_a]:[color:#dce3ef] [&_a]:[font-size:13px] [&_a]:[font-weight:800] max-[1000px]:[min-height:auto] [display:flex] [flex-direction:column] [align-items:center] [text-align:center] [&_blockquote]:[flex:1] [&_blockquote]:[margin:24px_0_20px] [&_blockquote]:[color:var(--muted)] [&_blockquote]:[font-size:15px] [&_blockquote]:[line-height:1.75] max-[780px]:[min-height:0] [opacity:0] [transform:translateY(22px)] [transition:opacity_0.7s_ease,_transform_0.7s_ease]"}>
                <div className={"testimony-stars [color:#d4ad55] [font-size:20px] [letter-spacing:.12em] [line-height:1]"} role="img" aria-label="5 out of 5 stars">★★★★★</div>
                <blockquote>“I didn't understand my school topics before. Now I learn step by step and I can do my practice on my own.”</blockquote>
                <p className={"testimony-name [margin:0] [color:var(--text)] [font-size:15px] [font-weight:800]"}>Sarah N.</p>
                <p className={"testimony-role [margin:4px_0_0] [color:var(--muted)] [font-size:12px]"}>Student, Kampala</p>
              </article>
              <article className={"hub-card testimony-card reveal reveal-delay [min-height:375px] [padding:30px] [position:relative] [overflow:hidden] [border:1px_solid_var(--line)] [border-radius:var(--radius)] [background:var(--surface)] [&_h3]:[font-family:\"Space_Grotesk\",_sans-serif] [&_h3]:[font-size:26px] [&_p]:[max-width:330px] [&_p]:[margin:13px_0_26px] [&_p]:[color:var(--muted)] [&_p]:[font-size:14px] [&_a]:[color:#dce3ef] [&_a]:[font-size:13px] [&_a]:[font-weight:800] max-[1000px]:[min-height:auto] [display:flex] [flex-direction:column] [align-items:center] [text-align:center] [&_blockquote]:[flex:1] [&_blockquote]:[margin:24px_0_20px] [&_blockquote]:[color:var(--muted)] [&_blockquote]:[font-size:15px] [&_blockquote]:[line-height:1.75] max-[780px]:[min-height:0] [opacity:0] [transform:translateY(22px)] [transition:opacity_0.7s_ease,_transform_0.7s_ease] [transition-delay:0.08s]"}>
                <div className={"testimony-stars [color:#d4ad55] [font-size:20px] [letter-spacing:.12em] [line-height:1]"} role="img" aria-label="5 out of 5 stars">★★★★★</div>
                <blockquote>“I didn't know how to use a computer. Now I can build a website and use Facebook for my business.”</blockquote>
                <p className={"testimony-name [margin:0] [color:var(--text)] [font-size:15px] [font-weight:800]"}>Daniel K.</p>
                <p className={"testimony-role [margin:4px_0_0] [color:var(--muted)] [font-size:12px]"}>Small Business Owner, Kampala</p>
              </article>
              <article className={"hub-card testimony-card reveal reveal-delay-2 [min-height:375px] [padding:30px] [position:relative] [overflow:hidden] [border:1px_solid_var(--line)] [border-radius:var(--radius)] [background:var(--surface)] [&_h3]:[font-family:\"Space_Grotesk\",_sans-serif] [&_h3]:[font-size:26px] [&_p]:[max-width:330px] [&_p]:[margin:13px_0_26px] [&_p]:[color:var(--muted)] [&_p]:[font-size:14px] [&_a]:[color:#dce3ef] [&_a]:[font-size:13px] [&_a]:[font-weight:800] max-[1000px]:[min-height:auto] [display:flex] [flex-direction:column] [align-items:center] [text-align:center] [&_blockquote]:[flex:1] [&_blockquote]:[margin:24px_0_20px] [&_blockquote]:[color:var(--muted)] [&_blockquote]:[font-size:15px] [&_blockquote]:[line-height:1.75] max-[780px]:[min-height:0] [opacity:0] [transform:translateY(22px)] [transition:opacity_0.7s_ease,_transform_0.7s_ease] [transition-delay:0.16s]"}>
                <div className={"testimony-stars [color:#d4ad55] [font-size:20px] [letter-spacing:.12em] [line-height:1]"} role="img" aria-label="5 out of 5 stars">★★★★★</div>
                <blockquote>“CEO JACK taught me how to turn my idea into a real business. Now I know how to plan, sell and grow.”</blockquote>
                <p className={"testimony-name [margin:0] [color:var(--text)] [font-size:15px] [font-weight:800]"}>Grace A.</p>
                <p className={"testimony-role [margin:4px_0_0] [color:var(--muted)] [font-size:12px]"}>Aspiring Entrepreneur, Kampala</p>
              </article>
            </div>
          </div>
        </section>

        <section className={"section purpose-section [padding:105px_0] max-[780px]:[padding:78px_0] [background:rgba(255,_255,_255,_0.012)]"}>
          <div className={"container [width:min(calc(100%_-_40px),_var(--container))] [margin:auto] max-[780px]:[width:min(_calc(100%_-_28px),_var(--container)_)]"}>
            <div className={"section-heading reveal [max-width:700px] [margin-bottom:48px] [&_h2]:[margin-top:12px] [&_h2]:[font-family:\"Space_Grotesk\",_sans-serif] [&_h2]:[font-size:clamp(36px,_4.5vw,_58px)] [&_h2]:[line-height:1.03] [&_h2]:[letter-spacing:-0.045em] [&_h2_span]:[color:#8178ff] [&_p]:[max-width:650px] [&_p]:[margin-top:16px] [&_p]:[color:var(--muted)] max-[560px]:[&_h2]:[font-size:36px] [opacity:0] [transform:translateY(22px)] [transition:opacity_0.7s_ease,_transform_0.7s_ease]"}>
              <span className={"section-label [color:#aeb8cd] [font-size:11px] [font-weight:800] [letter-spacing:0.18em]"}>WHY CEO JACK EXISTS</span>
              <h2>
                Learning should lead
                <span> somewhere.</span>
              </h2>
              <p>The goal is not simply to finish another lesson. It is to understand something, use it, build confidence and take the next step.</p>
            </div>
            <div className={"purpose-grid [display:grid] [grid-template-columns:repeat(3,_1fr)] [gap:18px] max-[1000px]:[grid-template-columns:1fr]"}>
              <article className={"purpose-card reveal [min-height:300px] [padding:30px] [position:relative] [border:1px_solid_var(--line)] [border-radius:var(--radius)] [background:rgba(255,_255,_255,_0.025)] [&_h3]:[font-family:\"Space_Grotesk\",_sans-serif] [&_h3]:[font-size:22px] [&_p]:[margin-top:10px] [&_p]:[color:var(--muted)] [&_p]:[font-size:14px] max-[1000px]:[min-height:auto] [opacity:0] [transform:translateY(22px)] [transition:opacity_0.7s_ease,_transform_0.7s_ease]"}>
                <span className={"card-number [position:absolute] [top:22px] [right:24px] [color:#58657c] [font-size:10px] [font-weight:800] [letter-spacing:0.13em]"}>01</span>
                <div className={"card-icon [width:45px] [height:45px] [margin:38px_0_22px] [display:grid] [place-items:center] [border-radius:12px] [color:#fff] [background:rgba(99,_133,_255,_0.14)] [border:1px_solid_rgba(99,_133,_255,_0.2)] [font-family:\"Space_Grotesk\",_sans-serif] [font-weight:700]"}>◎</div>
                <h3>Learn with purpose</h3>
                <p>Build strong foundations through structured learning, useful explanations and guided progress.</p>
              </article>
              <article className={"purpose-card featured reveal reveal-delay [min-height:300px] [padding:30px] [position:relative] [border:1px_solid_var(--line)] [border-radius:var(--radius)] [background:linear-gradient(_145deg,_rgba(99,_133,_255,_0.13),_rgba(255,_255,_255,_0.025)_)] [&_h3]:[font-family:\"Space_Grotesk\",_sans-serif] [&_h3]:[font-size:22px] [&_p]:[margin-top:10px] [&_p]:[color:var(--muted)] [&_p]:[font-size:14px] max-[1000px]:[min-height:auto] [border-color:rgba(99,_133,_255,_0.25)] [opacity:0] [transform:translateY(22px)] [transition:opacity_0.7s_ease,_transform_0.7s_ease] [transition-delay:0.08s]"}>
                <span className={"card-number [position:absolute] [top:22px] [right:24px] [color:#58657c] [font-size:10px] [font-weight:800] [letter-spacing:0.13em]"}>02</span>
                <div className={"card-icon [width:45px] [height:45px] [margin:38px_0_22px] [display:grid] [place-items:center] [border-radius:12px] [color:#fff] [background:rgba(99,_133,_255,_0.14)] [border:1px_solid_rgba(99,_133,_255,_0.2)] [font-family:\"Space_Grotesk\",_sans-serif] [font-weight:700]"}>&lt;/&gt;</div>
                <h3>Turn knowledge into action</h3>
                <p>Practise what you learn through digital skills, projects, problem-solving and experimentation.</p>
              </article>
              <article className={"purpose-card reveal reveal-delay-2 [min-height:300px] [padding:30px] [position:relative] [border:1px_solid_var(--line)] [border-radius:var(--radius)] [background:rgba(255,_255,_255,_0.025)] [&_h3]:[font-family:\"Space_Grotesk\",_sans-serif] [&_h3]:[font-size:22px] [&_p]:[margin-top:10px] [&_p]:[color:var(--muted)] [&_p]:[font-size:14px] max-[1000px]:[min-height:auto] [opacity:0] [transform:translateY(22px)] [transition:opacity_0.7s_ease,_transform_0.7s_ease] [transition-delay:0.16s]"}>
                <span className={"card-number [position:absolute] [top:22px] [right:24px] [color:#58657c] [font-size:10px] [font-weight:800] [letter-spacing:0.13em]"}>03</span>
                <div className={"card-icon [width:45px] [height:45px] [margin:38px_0_22px] [display:grid] [place-items:center] [border-radius:12px] [color:#fff] [background:rgba(99,_133,_255,_0.14)] [border:1px_solid_rgba(99,_133,_255,_0.2)] [font-family:\"Space_Grotesk\",_sans-serif] [font-weight:700]"}>↗</div>
                <h3>Develop your future</h3>
                <p>Grow your thinking, confidence, creativity and awareness of opportunities around you.</p>
              </article>
            </div>
          </div>
        </section>

        <section className={"section story-section [padding:105px_0] max-[780px]:[padding:78px_0] [background:#0d1427]"}>
          <div className={"container story-grid [width:min(calc(100%_-_40px),_var(--container))] [margin:auto] max-[780px]:[width:min(_calc(100%_-_28px),_var(--container)_)] [display:grid] [grid-template-columns:1fr_0.82fr] [align-items:center] [gap:75px] max-[1000px]:[grid-template-columns:1fr] max-[1000px]:[gap:50px]"}>
            <div className={"story-copy reveal [&_h2]:[margin-top:12px] [&_h2]:[font-family:\"Space_Grotesk\",_sans-serif] [&_h2]:[font-size:clamp(36px,_4.5vw,_58px)] [&_h2]:[line-height:1.03] [&_h2]:[letter-spacing:-0.045em] [&_h2_span]:[color:#8178ff] [&_h2]:[margin-bottom:24px] [&_p]:[max-width:620px] [&_p]:[margin-bottom:18px] [&_p]:[color:var(--muted)] [&_p]:[font-size:15px] [&_p]:[line-height:1.85] max-[560px]:[&_h2]:[font-size:36px] [opacity:0] [transform:translateY(22px)] [transition:opacity_0.7s_ease,_transform_0.7s_ease]"}>
              <span className={"section-label [color:#aeb8cd] [font-size:11px] [font-weight:800] [letter-spacing:0.18em]"}>OUR STORY</span>
              <h2>
                Why CEO JACK
                <span> exists.</span>
              </h2>
              <p>Technology is changing how people learn, work, create businesses and solve problems.</p>
              <p>CEO JACK LEARNING HUB was designed to bring learning, practical creation, digital skills and personal development into one connected experience.</p>
              <p>Instead of learning something and stopping there, the platform encourages learners to turn knowledge into action.</p>
            </div>
            <aside className={"story-card reveal reveal-delay [padding:42px] [position:relative] [overflow:hidden] [border:1px_solid_rgba(99,_133,_255,_0.22)] [border-radius:25px] [background:linear-gradient(_145deg,_rgba(99,_133,_255,_0.1),_rgba(255,_255,_255,_0.025)_)] [box-shadow:0_25px_65px_rgba(0,_0,_0,_0.2)] [&_h3]:[margin-top:23px] [&_h3]:[font-family:\"Space_Grotesk\",_sans-serif] [&_h3]:[font-size:28px] [&_h3]:[line-height:1.3] [&_p]:[margin-top:20px] [&_p]:[color:#8997aa] [&_p]:[font-size:13px] [&_p]:[line-height:1.75] max-[560px]:[padding:30px] [opacity:0] [transform:translateY(22px)] [transition:opacity_0.7s_ease,_transform_0.7s_ease] [transition-delay:0.08s]"}>
              <span className={"quote-mark [color:#8178ff] [font-family:Georgia,_serif] [font-size:70px] [line-height:0.6]"}>“</span>
              <h3>
                Learn something.
                <br />
                Create something.
                <br />
                Develop yourself.
              </h3>
              <p>Progress becomes more meaningful when knowledge can be applied.</p>
              <span className={"story-line [display:block] [margin-top:24px] [color:#68758b] [font-size:9px] [letter-spacing:0.16em]"}>CEO JACK LEARNING HUB</span>
            </aside>
          </div>
        </section>

        <section className={"section hubs-section [padding:105px_0] max-[780px]:[padding:78px_0] [background:#080d1b]"}>
          <div className={"container [width:min(calc(100%_-_40px),_var(--container))] [margin:auto] max-[780px]:[width:min(_calc(100%_-_28px),_var(--container)_)]"}>
            <div className={"section-heading centered reveal [max-width:700px] [margin-bottom:48px] [&_h2]:[margin-top:12px] [&_h2]:[font-family:\"Space_Grotesk\",_sans-serif] [&_h2]:[font-size:clamp(36px,_4.5vw,_58px)] [&_h2]:[line-height:1.03] [&_h2]:[letter-spacing:-0.045em] [&_h2_span]:[color:#8178ff] [&_p]:[max-width:650px] [&_p]:[margin-top:16px] [&_p]:[color:var(--muted)] max-[560px]:[&_h2]:[font-size:36px] [text-align:center] [margin-inline:auto] [&_p]:[margin-inline:auto] [opacity:0] [transform:translateY(22px)] [transition:opacity_0.7s_ease,_transform_0.7s_ease]"}>
              <span className={"section-label [color:#aeb8cd] [font-size:11px] [font-weight:800] [letter-spacing:0.18em]"}>THE PRODUCT</span>
              <h2>
                Three hubs.
                <span> One journey.</span>
              </h2>
              <p>Each hub solves a different part of learner development while the experience remains connected.</p>
            </div>
            <div className={"hub-grid [display:grid] [grid-template-columns:repeat(3,_1fr)] [gap:18px] max-[1000px]:[grid-template-columns:1fr]"}>
              <article className={"hub-card education reveal [min-height:375px] [padding:30px] [position:relative] [overflow:hidden] [border:1px_solid_var(--line)] [border-radius:var(--radius)] [background:var(--surface)] [&_h3]:[font-family:\"Space_Grotesk\",_sans-serif] [&_h3]:[font-size:26px] [&_p]:[max-width:330px] [&_p]:[margin:13px_0_26px] [&_p]:[color:var(--muted)] [&_p]:[font-size:14px] [&_a]:[color:#dce3ef] [&_a]:[font-size:13px] [&_a]:[font-weight:800] max-[1000px]:[min-height:auto] [border-top:2px_solid_#6385ff] [opacity:0] [transform:translateY(22px)] [transition:opacity_0.7s_ease,_transform_0.7s_ease]"}>
                <div className={"hub-top [display:flex] [justify-content:space-between] [color:#66738a] [font-size:10px] [font-weight:800] [letter-spacing:0.12em] [&_b]:[color:#8793a8]"}>
                  <span>01</span>
                  <b>LEARN</b>
                </div>
                <div className={"hub-icon [width:45px] [height:45px] [margin:38px_0_22px] [display:grid] [place-items:center] [border-radius:12px] [color:#fff] [background:rgba(99,_133,_255,_0.13)] [border:1px_solid_rgba(99,_133,_255,_0.2)] [font-family:\"Space_Grotesk\",_sans-serif] [font-weight:700]"}>▦</div>
                <h3>Education Hub</h3>
                <p>Structured academic learning through classes, subjects, topics, lessons, practice and progress.</p>
                <Link href="/education">Explore Education →</Link>
              </article>
              <article className={"hub-card skills reveal reveal-delay [min-height:375px] [padding:30px] [position:relative] [overflow:hidden] [border:1px_solid_var(--line)] [border-radius:var(--radius)] [background:var(--surface)] [&_h3]:[font-family:\"Space_Grotesk\",_sans-serif] [&_h3]:[font-size:26px] [&_p]:[max-width:330px] [&_p]:[margin:13px_0_26px] [&_p]:[color:var(--muted)] [&_p]:[font-size:14px] [&_a]:[color:#dce3ef] [&_a]:[font-size:13px] [&_a]:[font-weight:800] max-[1000px]:[min-height:auto] [border-top:2px_solid_#9b7bff] [opacity:0] [transform:translateY(22px)] [transition:opacity_0.7s_ease,_transform_0.7s_ease] [transition-delay:0.08s]"}>
                <div className={"hub-top [display:flex] [justify-content:space-between] [color:#66738a] [font-size:10px] [font-weight:800] [letter-spacing:0.12em] [&_b]:[color:#8793a8]"}>
                  <span>02</span>
                  <b>CREATE</b>
                </div>
                <div className={"hub-icon [width:45px] [height:45px] [margin:38px_0_22px] [display:grid] [place-items:center] [border-radius:12px] [color:#fff] [background:rgba(99,_133,_255,_0.13)] [border:1px_solid_rgba(99,_133,_255,_0.2)] [font-family:\"Space_Grotesk\",_sans-serif] [font-weight:700]"}>&lt;/&gt;</div>
                <h3>Digital Skills Hub</h3>
                <p>Practical technology learning through coding, web development, programming, AI and projects.</p>
                <Link href="/digital-skills">Explore Digital Skills →</Link>
              </article>
              <article className={"hub-card business reveal reveal-delay-2 [min-height:375px] [padding:30px] [position:relative] [overflow:hidden] [border:1px_solid_var(--line)] [border-radius:var(--radius)] [background:var(--surface)] [&_h3]:[font-family:\"Space_Grotesk\",_sans-serif] [&_h3]:[font-size:26px] [&_p]:[max-width:330px] [&_p]:[margin:13px_0_26px] [&_p]:[color:var(--muted)] [&_p]:[font-size:14px] [&_a]:[color:#dce3ef] [&_a]:[font-size:13px] [&_a]:[font-weight:800] max-[1000px]:[min-height:auto] [border-top:2px_solid_#8cc8a9] [opacity:0] [transform:translateY(22px)] [transition:opacity_0.7s_ease,_transform_0.7s_ease] [transition-delay:0.16s]"}>
                <div className={"hub-top [display:flex] [justify-content:space-between] [color:#66738a] [font-size:10px] [font-weight:800] [letter-spacing:0.12em] [&_b]:[color:#8793a8]"}>
                  <span>03</span>
                  <b>DEVELOP</b>
                </div>
                <div className={"hub-icon [width:45px] [height:45px] [margin:38px_0_22px] [display:grid] [place-items:center] [border-radius:12px] [color:#fff] [background:rgba(99,_133,_255,_0.13)] [border:1px_solid_rgba(99,_133,_255,_0.2)] [font-family:\"Space_Grotesk\",_sans-serif] [font-weight:700]"}>↗</div>
                <h3>Entrepreneurship Hub</h3>
                <p>Business thinking, financial literacy and opportunity-focused development for the future.</p>
                <Link href="/entrepreneurship">Explore Entrepreneurship →</Link>
              </article>
            </div>
          </div>
        </section>

        <section className={"section ecosystem-section [padding:105px_0] max-[780px]:[padding:78px_0] [background:rgba(255,_255,_255,_0.012)]"}>
          <div className={"container ecosystem-grid [width:min(calc(100%_-_40px),_var(--container))] [margin:auto] max-[780px]:[width:min(_calc(100%_-_28px),_var(--container)_)] [display:grid] [grid-template-columns:1fr_1fr] [align-items:center] [gap:75px] max-[1000px]:[grid-template-columns:1fr] max-[1000px]:[gap:50px]"}>
            <div className={"ecosystem-copy reveal [&_h2]:[margin-top:12px] [&_h2]:[font-family:\"Space_Grotesk\",_sans-serif] [&_h2]:[font-size:clamp(36px,_4.5vw,_58px)] [&_h2]:[line-height:1.03] [&_h2]:[letter-spacing:-0.045em] [&_h2_span]:[color:#8178ff] [max-width:600px] [&_>_p]:[margin-top:18px] [&_>_p]:[color:var(--muted)] [&_>_p]:[font-size:14px] [&_>_p]:[line-height:1.8] max-[560px]:[&_h2]:[font-size:36px] [opacity:0] [transform:translateY(22px)] [transition:opacity_0.7s_ease,_transform_0.7s_ease]"}>
              <span className={"section-label [color:#aeb8cd] [font-size:11px] [font-weight:800] [letter-spacing:0.18em]"}>THE ECOSYSTEM</span>
              <h2>
                One account.
                <span> Many possibilities.</span>
              </h2>
              <p>CEO JACK is designed as a connected ecosystem rather than a collection of unrelated pages.</p>
              <p>As the platform grows, a learner&apos;s experience can become more personalized around their interests, goals and stage of development.</p>
              <div className={"ecosystem-points [margin-top:28px] [border-top:1px_solid_var(--line)] [&_div]:[display:flex] [&_div]:[align-items:center] [&_div]:[gap:15px] [&_div]:[padding:14px_0] [&_div]:[border-bottom:1px_solid_var(--line)] [&_div]:[color:#aeb8c8] [&_div]:[font-size:13px] [&_b]:[color:#8178ff] [&_b]:[font-size:9px] [&_b]:[letter-spacing:0.12em]"}>
                <div>
                  <b>01</b>
                  <span>Personalized learning</span>
                </div>
                <div>
                  <b>02</b>
                  <span>Practical digital skills</span>
                </div>
                <div>
                  <b>03</b>
                  <span>Project and creative development</span>
                </div>
                <div>
                  <b>04</b>
                  <span>Entrepreneurship and financial thinking</span>
                </div>
              </div>
            </div>
            <div className={"ecosystem-map reveal reveal-delay [min-height:470px] [position:relative] [display:grid] [place-items:center] max-[1000px]:[order:-1] max-[780px]:[min-height:380px] max-[560px]:[min-height:340px] [opacity:0] [transform:translateY(22px)] [transition:opacity_0.7s_ease,_transform_0.7s_ease] [transition-delay:0.08s]"}>
              <div className={"map-line line-one [position:absolute] [height:1px] [background:linear-gradient(_90deg,_transparent,_rgba(99,_133,_255,_0.4),_transparent_)] [transform-origin:left_center] [width:150px] [top:43%] [left:50%] [transform:rotate(-90deg)_translateX(-50%)]"} />
              <div className={"map-line line-two [position:absolute] [height:1px] [background:linear-gradient(_90deg,_transparent,_rgba(99,_133,_255,_0.4),_transparent_)] [transform-origin:left_center] [width:190px] [top:54%] [left:43%] [transform:rotate(160deg)]"} />
              <div className={"map-line line-three [position:absolute] [height:1px] [background:linear-gradient(_90deg,_transparent,_rgba(99,_133,_255,_0.4),_transparent_)] [transform-origin:left_center] [width:190px] [top:54%] [right:43%] [transform:rotate(20deg)]"} />
              <div className={"map-node node-center [position:absolute] [width:125px] [height:125px] [display:flex] [flex-direction:column] [align-items:center] [justify-content:center] [border-radius:50%] [background:radial-gradient(_circle_at_40%_30%,_rgba(99,_133,_255,_0.18),_rgba(10,_17,_33,_0.97)_70%_)] [border:1px_solid_rgba(99,_133,_255,_0.25)] [box-shadow:0_0_70px_rgba(155,_123,_255,_0.1)] [&_strong]:[font-family:\"Space_Grotesk\",_sans-serif] [&_strong]:[font-size:28px] [&_small]:[margin-top:4px] [&_small]:[color:#6f7c92] [&_small]:[font-size:7px] [&_small]:[letter-spacing:0.13em] max-[560px]:[width:105px] max-[560px]:[height:105px] [z-index:2] [border-color:rgba(155,_123,_255,_0.38)] [&_strong]:[color:#83a2ff] max-[560px]:[&_strong]:[font-size:24px]"}>
                <SiteLogoMark className={"about-map-logo [width:38px] [height:38px] [border-radius:8px] [object-fit:cover]"} width={80} height={80} alt="CEO JACK Learning Hub logo" />
                <small>LEARNER</small>
              </div>
              <div className={"map-node node-education [position:absolute] [width:95px] [height:95px] [display:flex] [flex-direction:column] [align-items:center] [justify-content:center] [border-radius:50%] [background:radial-gradient(_circle_at_40%_30%,_rgba(99,_133,_255,_0.18),_rgba(10,_17,_33,_0.97)_70%_)] [border:1px_solid_rgba(99,_133,_255,_0.25)] [box-shadow:0_20px_50px_rgba(0,_0,_0,_0.25)] [&_strong]:[font-family:\"Space_Grotesk\",_sans-serif] [&_strong]:[font-size:19px] [&_small]:[margin-top:4px] [&_small]:[color:#6f7c92] [&_small]:[font-size:7px] [&_small]:[letter-spacing:0.13em] max-[560px]:[width:78px] max-[560px]:[height:78px] [top:25px] [left:50%] [transform:translateX(-50%)] max-[780px]:[top:10px]"}>
                <strong>01</strong>
                <small>EDUCATION</small>
              </div>
              <div className={"map-node node-skills [position:absolute] [width:95px] [height:95px] [display:flex] [flex-direction:column] [align-items:center] [justify-content:center] [border-radius:50%] [background:radial-gradient(_circle_at_40%_30%,_rgba(99,_133,_255,_0.18),_rgba(10,_17,_33,_0.97)_70%_)] [border:1px_solid_rgba(99,_133,_255,_0.25)] [box-shadow:0_20px_50px_rgba(0,_0,_0,_0.25)] [&_strong]:[font-family:\"Space_Grotesk\",_sans-serif] [&_strong]:[font-size:19px] [&_small]:[margin-top:4px] [&_small]:[color:#6f7c92] [&_small]:[font-size:7px] [&_small]:[letter-spacing:0.13em] max-[560px]:[width:78px] max-[560px]:[height:78px] [left:4%] [bottom:50px] max-[780px]:[left:0] max-[780px]:[bottom:35px]"}>
                <strong>02</strong>
                <small>SKILLS</small>
              </div>
              <div className={"map-node node-business [position:absolute] [width:95px] [height:95px] [display:flex] [flex-direction:column] [align-items:center] [justify-content:center] [border-radius:50%] [background:radial-gradient(_circle_at_40%_30%,_rgba(99,_133,_255,_0.18),_rgba(10,_17,_33,_0.97)_70%_)] [border:1px_solid_rgba(99,_133,_255,_0.25)] [box-shadow:0_20px_50px_rgba(0,_0,_0,_0.25)] [&_strong]:[font-family:\"Space_Grotesk\",_sans-serif] [&_strong]:[font-size:19px] [&_small]:[margin-top:4px] [&_small]:[color:#6f7c92] [&_small]:[font-size:7px] [&_small]:[letter-spacing:0.13em] max-[560px]:[width:78px] max-[560px]:[height:78px] [right:4%] [bottom:50px] max-[780px]:[right:0] max-[780px]:[bottom:35px]"}>
                <strong>03</strong>
                <small>BUSINESS</small>
              </div>
            </div>
          </div>
        </section>

        <section className={"section ai-role-section [padding:105px_0] max-[780px]:[padding:78px_0]"}>
          <div className={"container ai-role-panel reveal [width:min(calc(100%_-_40px),_var(--container))] [margin:auto] max-[780px]:[width:min(_calc(100%_-_28px),_var(--container)_)] [min-height:190px] [padding:32px_38px] [display:grid] [grid-template-columns:auto_1fr_auto] [align-items:center] [gap:25px] [border:1px_solid_rgba(99,_133,_255,_0.22)] [border-radius:25px] [background:linear-gradient(_135deg,_rgba(99,_133,_255,_0.12),_rgba(255,_255,_255,_0.025)_)] max-[1000px]:[grid-template-columns:auto_1fr] max-[780px]:[grid-template-columns:1fr] max-[780px]:[padding:30px] [opacity:0] [transform:translateY(22px)] [transition:opacity_0.7s_ease,_transform_0.7s_ease]"}>
            <div className={"ai-role-icon [width:58px] [height:58px] [display:grid] [place-items:center] [border-radius:16px] [background:linear-gradient(_135deg,_var(--primary),_var(--primary2)_)] [font-size:25px]"}>✦</div>
            <div className={"ai-role-copy [&_h2]:[margin-top:12px] [&_h2]:[font-family:\"Space_Grotesk\",_sans-serif] [&_h2]:[font-size:30px] [&_h2]:[line-height:1.03] [&_h2]:[letter-spacing:-0.045em] [&_p]:[max-width:620px] [&_p]:[margin-top:7px] [&_p]:[color:var(--muted)] [&_p]:[font-size:13px]"}>
              <span className={"section-label [color:#aeb8cd] [font-size:11px] [font-weight:800] [letter-spacing:0.18em]"}>CEO JACK AI</span>
              <h2>A companion across the journey.</h2>
              <p>CEO JACK AI can help learners understand concepts, ask questions, explore ideas and get guidance while they move through the platform.</p>
            </div>
            <Link href="/ai" className={"btn btn-light [display:inline-flex] [align-items:center] [justify-content:center] [gap:11px] [border-radius:12px] [font-weight:700] [transition:0.2s] [&:hover]:[transform:translateY(-2px)] [min-height:50px] [padding:0_20px] max-[1000px]:[grid-column:2] max-[1000px]:[justify-self:start] max-[780px]:[flex:1] max-[780px]:[grid-column:auto] max-[780px]:[justify-self:start] max-[560px]:[width:100%] [color:#0d1427] [background:#fff]"}>
              Explore CEO JACK AI →
            </Link>
          </div>
        </section>

        <section className={"section vision-section [padding:105px_0] max-[780px]:[padding:78px_0] [padding-top:20px]"}>
          <div className={"container vision-box reveal [width:min(calc(100%_-_40px),_var(--container))] [margin:auto] max-[780px]:[width:min(_calc(100%_-_28px),_var(--container)_)] [&_h2]:[margin-top:12px] [&_h2]:[font-family:\"Space_Grotesk\",_sans-serif] [&_h2]:[font-size:clamp(36px,_4.5vw,_58px)] [&_h2]:[line-height:1.03] [&_h2]:[letter-spacing:-0.045em] [&_h2_span]:[color:#8178ff] [padding:75px_45px] [text-align:center] [border:1px_solid_var(--line)] [border-radius:30px] [background:radial-gradient(_circle_at_50%_0%,_rgba(99,_133,_255,_0.18),_transparent_45%_),_rgba(255,_255,_255,_0.025)] [&_h2]:[max-width:920px] [&_h2]:[margin-inline:auto] [&_p]:[max-width:700px] [&_p]:[margin:20px_auto_28px] [&_p]:[color:var(--muted)] [&_p]:[font-size:14px] [&_p]:[line-height:1.8] max-[560px]:[&_h2]:[font-size:36px] max-[560px]:[padding:58px_22px] [opacity:0] [transform:translateY(22px)] [transition:opacity_0.7s_ease,_transform_0.7s_ease]"}>
            <span className={"section-label [color:#aeb8cd] [font-size:11px] [font-weight:800] [letter-spacing:0.18em]"}>OUR VISION</span>
            <h2>
              Building people who don&apos;t just consume technology —
              <span> they create with it.</span>
            </h2>
            <p>The long-term vision of CEO JACK LEARNING HUB is to become a place where learners can acquire knowledge, develop practical skills, experiment with ideas and build things that matter.</p>
            <Link href="/get-started" className={"btn btn-primary get-started-button [display:inline-flex] [align-items:center] [justify-content:center] [gap:11px] [border-radius:12px] [font-weight:700] [transition:0.2s] [&:hover]:[transform:translateY(-2px)] [min-height:50px] [padding:0_20px] max-[1000px]:[grid-column:2] max-[1000px]:[justify-self:start] max-[780px]:[flex:1] max-[780px]:[grid-column:auto] max-[780px]:[justify-self:start] max-[560px]:[width:100%] [color:#fff] [background:linear-gradient(_135deg,_var(--primary),_var(--primary2)_)] [box-shadow:0_16px_38px_rgba(85,_91,_220,_0.27)]"}>
              Get Started Free <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
