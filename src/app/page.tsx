
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { SiteFooter } from "@/src/components/footer";
import { SiteHeader } from "@/src/components/header";
import { useReveal } from "@/src/hooks/use-reveal";

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  "@id": "https://ceojacklearninghub.com/#organization",
  name: "CEO JACK LEARNING HUB",
  alternateName: "JACKHUB Learning Hub",
  url: "https://ceojacklearninghub.com",
  logo: "https://ceojacklearninghub.com/assets/images/logo.webp",
  image: "https://ceojacklearninghub.com/assets/images/banner.jpeg",
  description:
    "CEO JACK LEARNING HUB is a learning platform for education, digital skills, entrepreneurship and personal development.",
  areaServed: { "@type": "Country", name: "Uganda" },
  founder: {
    "@type": "Person",
    name: "CEO JACK",
    url: "https://ceojacklearninghub.com/author/ceo-jack",
  },
  knowsAbout: ["Education", "Digital skills", "Entrepreneurship", "Business learning"],
};

const eyebrowPhrases = [
  "A learning platform built for the future",
  "Empowering future innovators",
  "Learn today. Create tomorrow. Develop for life.",
];
const longestEyebrowPhrase = eyebrowPhrases.reduce((longest, phrase) =>
  phrase.length > longest.length ? phrase : longest,
);

export default function HomePage() {
  useReveal();
  const [typedPhrase, setTypedPhrase] = useState(eyebrowPhrases[0]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let phraseIndex = 0;
    let characterIndex = eyebrowPhrases[0].length;
    let deleting = true;
    let timer: ReturnType<typeof setTimeout>;

    function typeNext() {
      const phrase = eyebrowPhrases[phraseIndex];

      if (deleting) {
        characterIndex = Math.max(0, characterIndex - 1);
        setTypedPhrase(phrase.slice(0, characterIndex));
        if (characterIndex === 0) {
          deleting = false;
          phraseIndex = (phraseIndex + 1) % eyebrowPhrases.length;
          timer = setTimeout(typeNext, 320);
          return;
        }
        timer = setTimeout(typeNext, 32);
        return;
      }

      characterIndex += 1;
      setTypedPhrase(phrase.slice(0, characterIndex));
      if (characterIndex >= phrase.length) {
        deleting = true;
        timer = setTimeout(typeNext, 1800);
        return;
      }
      timer = setTimeout(typeNext, 68);
    }

    timer = setTimeout(typeNext, 2200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <div className={"page-bg [position:fixed] [inset:0] [pointer-events:none] [z-index:-2] [background:radial-gradient(_circle_at_78%_13%,_rgba(99,133,255,.15),_transparent_28%_),_radial-gradient(_circle_at_15%_58%,_rgba(155,123,255,.07),_transparent_28%_),_linear-gradient(_180deg,_#080d1b_0%,_#0d1427_55%,_#080d1b_100%_)] [&::after]:[content:\"\"] [&::after]:[position:absolute] [&::after]:[inset:0] [&::after]:[opacity:.32] [&::after]:[background-image:linear-gradient(_rgba(255,255,255,.025)_1px,_transparent_1px_),_linear-gradient(_90deg,_rgba(255,255,255,.025)_1px,_transparent_1px_)] [&::after]:[background-size:48px_48px] [&::after]:[mask-image:linear-gradient(_to_bottom,_black,_transparent_82%_)]"} aria-hidden="true" />
      <SiteHeader active="/" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema).replace(/</g, "\\u003c") }}
      />

      <main>
        <section className={"learning-marquee-strip [display:flex] [width:100%] [min-height:54px] [align-items:center] [overflow:hidden] [border-block:1px_solid_var(--line)] [background:linear-gradient(90deg,_#0d1427,_var(--surface),_#0d1427)] [color:#c1c9dc] max-[780px]:[min-height:50px]"} aria-label="CEO JACK Learning Hub">
          <div className={"learning-marquee [min-width:0] [width:100%] [overflow:hidden] [-webkit-mask-image:linear-gradient(90deg,_transparent,_#000_4%,_#000_96%,_transparent)] [mask-image:linear-gradient(90deg,_transparent,_#000_4%,_#000_96%,_transparent)] motion-reduce:[overflow-x:auto] motion-reduce:[scrollbar-width:none] motion-reduce:[-webkit-overflow-scrolling:touch] motion-reduce:[&::-webkit-scrollbar]:[display:none]"} aria-label="Learn. Create. Develop. • Education Hub • Digital Skills Hub • Entrepreneurship Hub • CEO JACK AI • Learn Today. Create Tomorrow. Develop For Life. •">
            <div className={"learning-marquee-track [display:flex] [width:max-content] animate-marquee [will-change:transform] motion-reduce:[animation:none]"}>
              <div className={"learning-marquee-group [display:flex] [flex:0_0_auto] [align-items:center] [gap:13px] [padding:0_34px] [color:#c1c9dc] [font-size:12px] [font-weight:600] [line-height:1.3] [white-space:nowrap] max-[780px]:[gap:9px] max-[780px]:[padding-inline:24px] max-[780px]:[font-size:11px]"}>
                <span className={"learning-marquee-lead [color:#f5f7ff] [font-weight:700]"}>Learn. Create. Develop.</span><span className={"learning-marquee-separator [color:#819aff] [font-size:15px] max-[780px]:[font-size:13px]"} aria-hidden="true">•</span>
                <span>Education Hub</span><span className={"learning-marquee-separator [color:#819aff] [font-size:15px] max-[780px]:[font-size:13px]"} aria-hidden="true">•</span>
                <span>Digital Skills Hub</span><span className={"learning-marquee-separator [color:#819aff] [font-size:15px] max-[780px]:[font-size:13px]"} aria-hidden="true">•</span>
                <span>Entrepreneurship Hub</span><span className={"learning-marquee-separator [color:#819aff] [font-size:15px] max-[780px]:[font-size:13px]"} aria-hidden="true">•</span>
                <span>CEO JACK AI</span><span className={"learning-marquee-separator [color:#819aff] [font-size:15px] max-[780px]:[font-size:13px]"} aria-hidden="true">•</span>
                <span>Learn Today. Create Tomorrow. Develop For Life.</span><span className={"learning-marquee-separator [color:#819aff] [font-size:15px] max-[780px]:[font-size:13px]"} aria-hidden="true">•</span>
              </div>
              <div className={"learning-marquee-group [display:flex] [flex:0_0_auto] [align-items:center] [gap:13px] [padding:0_34px] [color:#c1c9dc] [font-size:12px] [font-weight:600] [line-height:1.3] [white-space:nowrap] max-[780px]:[gap:9px] max-[780px]:[padding-inline:24px] max-[780px]:[font-size:11px]"} aria-hidden="true">
                <span className={"learning-marquee-lead [color:#f5f7ff] [font-weight:700]"}>Learn. Create. Develop.</span><span className={"learning-marquee-separator [color:#819aff] [font-size:15px] max-[780px]:[font-size:13px]"}>•</span>
                <span>Education Hub</span><span className={"learning-marquee-separator [color:#819aff] [font-size:15px] max-[780px]:[font-size:13px]"}>•</span>
                <span>Digital Skills Hub</span><span className={"learning-marquee-separator [color:#819aff] [font-size:15px] max-[780px]:[font-size:13px]"}>•</span>
                <span>Entrepreneurship Hub</span><span className={"learning-marquee-separator [color:#819aff] [font-size:15px] max-[780px]:[font-size:13px]"}>•</span>
                <span>CEO JACK AI</span><span className={"learning-marquee-separator [color:#819aff] [font-size:15px] max-[780px]:[font-size:13px]"}>•</span>
                <span>Learn Today. Create Tomorrow. Develop For Life.</span><span className={"learning-marquee-separator [color:#819aff] [font-size:15px] max-[780px]:[font-size:13px]"}>•</span>
              </div>
            </div>
          </div>
        </section>

        <section className={"hero section [min-height:calc(100vh_-_76px)] [display:flex] [align-items:center] [padding-top:80px] [&_h1]:[font-family:\"Space_Grotesk\",_sans-serif] [&_h1]:[font-size:clamp(58px,_7.2vw,_96px)] [&_h1]:[line-height:.91] [&_h1]:[letter-spacing:-.065em] [&_h1]:[margin-bottom:27px] max-[780px]:[padding-top:65px] max-[780px]:[&_h1]:[font-size:clamp(55px,_16vw,_82px)] max-[768px]:[min-height:0] max-[768px]:[padding:50px_0_64px] max-[768px]:[&_h1]:[font-size:clamp(48px,_12vw,_76px)] max-[768px]:[&_h1]:[overflow-wrap:anywhere] max-[320px]:[padding:40px_0_52px] max-[320px]:[&_h1]:[font-size:48px] max-[320px]:[&_h1]:[letter-spacing:-.07em] [padding:105px_0] max-[780px]:[padding:78px_0]"} id="home">
          <div className={"container hero-grid [width:min(calc(100%_-_40px),_var(--container))] [margin-inline:auto] max-[780px]:[width:min(_calc(100%_-_28px),_var(--container)_)] max-[1024px]:[min-width:0] max-[768px]:[width:min(calc(100%_-_32px),_var(--container))] max-[320px]:[width:calc(100%_-_24px)] [display:grid] [grid-template-columns:.92fr_1.08fr] [align-items:center] [gap:70px] max-[1000px]:[grid-template-columns:1fr] max-[1000px]:[gap:55px] max-[1024px]:[grid-template-columns:minmax(0,_1fr)] max-[1024px]:[gap:48px] max-[1024px]:[&_>_*]:[min-width:0] max-[768px]:[gap:38px]"}>
            <div className={"hero-copy reveal max-[1000px]:[max-width:720px] max-[1024px]:[min-width:0] max-[1024px]:[width:100%] [opacity:0] [transform:translateY(22px)] [transition:opacity_.7s_ease,_transform_.7s_ease]"}>
              <div className={"eyebrow [color:#aeb8cd] [font-size:11px] [font-weight:800] [letter-spacing:.18em] [display:inline-flex] [align-items:center] [gap:9px] [margin-bottom:23px] [&_>_span:first-child]:[width:7px] [&_>_span:first-child]:[height:7px] [&_>_span:first-child]:[border-radius:50%] [&_>_span:first-child]:[background:var(--cyan)] [&_>_span:first-child]:[box-shadow:0_0_18px_var(--cyan)] max-[320px]:[font-size:9px] max-[320px]:[letter-spacing:.12em]"}>
                <span />
                <span className={"hero-typewriter [display:inline-grid] [min-height:1.25em] [align-items:center] [font-size:15px] [letter-spacing:.08em] [line-height:1.25] [white-space:nowrap] ![&_>_span]:[font-size:inherit] max-[320px]:[font-size:11px] max-[320px]:[letter-spacing:.04em]"} aria-hidden="true">
                  <span className={"hero-typewriter-current [grid-area:1_/_1] [&::after]:[display:inline-block] [&::after]:[width:2px] [&::after]:[height:1em] [&::after]:[margin-left:3px] [&::after]:[background:var(--cyan)] [&::after]:[content:\"\"] [&::after]:[vertical-align:-0.12em] [&::after]:animate-typewriter-caret"}>{typedPhrase}</span>
                  <span className={"hero-typewriter-measure [grid-area:1_/_1] [visibility:hidden]"}>{longestEyebrowPhrase}</span>
                </span>
                <span className={"hero-typewriter-sr [position:absolute] [width:1px] [height:1px] [overflow:hidden] [clip:rect(0,_0,_0,_0)] [white-space:nowrap] [clip-path:inset(50%)]"}>A learning platform built for the future, empowering future innovators. Learn today. Create tomorrow. Develop for life.</span>
              </div>
              <h1>Learn.<br /><em className="not-italic text-violet-300">Create.</em><br />Develop.</h1>
              <p className={"hero-lead [max-width:560px] [color:var(--muted)] [font-size:18px] [line-height:1.75] [margin-bottom:31px] max-[780px]:[font-size:16px] max-[768px]:[font-size:16px] max-[320px]:[font-size:15px]"}>
                You don’t need to have it all figured out. Start with one question, one idea, one small step. We’ll help you grow from there.
              </p>
              <div className={"hero-actions [display:flex] [flex-wrap:wrap] [gap:13px] max-[560px]:[flex-direction:column] max-[560px]:[align-items:stretch]"}>
                <Link href="/get-started" className={"btn btn-primary get-started-button [display:inline-flex] [align-items:center] [justify-content:center] [gap:12px] [border-radius:12px] [font-weight:700] [transition:transform_.2s_ease,_box-shadow_.2s_ease,_background_.2s_ease] [&:hover]:[transform:translateY(-2px)] [min-height:50px] [padding:0_20px] max-[560px]:[width:100%] [color:#fff] [background:linear-gradient(_135deg,_var(--primary),_var(--primary-2)_)] [box-shadow:0_16px_38px_rgba(85,91,220,.27)]"}>Get Started Free <span>→</span></Link>
                <a href="#hubs" className={"btn btn-secondary [display:inline-flex] [align-items:center] [justify-content:center] [gap:12px] [border-radius:12px] [font-weight:700] [transition:transform_.2s_ease,_box-shadow_.2s_ease,_background_.2s_ease] [&:hover]:[transform:translateY(-2px)] [min-height:50px] [padding:0_20px] max-[560px]:[width:100%] [color:#dfe5f2] [border:1px_solid_var(--line)] [background:rgba(255,255,255,.035)]"}>Explore the Hubs</a>
              </div>
              <div className={"trust-row [display:flex] [flex-wrap:wrap] [gap:18px] [margin-top:25px] [color:#78869e] [font-size:12px] [font-weight:600] max-[560px]:[gap:9px_15px]"}>
                <span>✓ Education</span>
                <span>✓ Digital Skills</span>
                <span>✓ Entrepreneurship</span>
              </div>
            </div>

            <div className={"hero-product reveal reveal-delay [position:relative] max-[1000px]:[max-width:700px] max-[1024px]:[min-width:0] max-[1024px]:[width:100%] max-[768px]:[max-width:100%] [opacity:0] [transform:translateY(22px)] [transition:opacity_.7s_ease,_transform_.7s_ease] [transition-delay:.08s]"}>
              <div className={"product-window [position:relative] [overflow:hidden] [border:1px_solid_rgba(255,255,255,.11)] [border-radius:26px] [background:linear-gradient(_145deg,_rgba(24,35,63,.95),_rgba(12,19,37,.96)_)] [box-shadow:var(--shadow)] max-[1024px]:[min-width:0] max-[1024px]:[width:100%]"}>
                <div className={"window-top [height:48px] [padding:0_18px] [display:flex] [align-items:center] [gap:15px] [border-bottom:1px_solid_var(--line)] [color:#7f8ca5] [font-size:9px] [letter-spacing:.12em] max-[320px]:[gap:7px] max-[320px]:[padding-inline:10px] max-[320px]:[font-size:7px] max-[320px]:[letter-spacing:.06em]"}>
                  <div className={"window-dots [display:flex] [gap:5px] [&_i]:[width:6px] [&_i]:[height:6px] [&_i]:[border-radius:50%] [&_i]:[background:#536078]"}><i /><i /><i /></div>
                  <span>CEO JACK LEARNING HUB</span>
                  <span className={"online [margin-left:auto] [display:flex] [align-items:center] [gap:5px] [&_b]:[width:5px] [&_b]:[height:5px] [&_b]:[border-radius:50%] [&_b]:[background:var(--green)]"}><b />Learning</span>
                </div>
                <div className={"product-body [padding:30px] max-[780px]:[padding:22px] max-[768px]:[padding:clamp(16px,_4vw,_24px)] max-[320px]:[padding:14px]"}>
                  <div className={"preview-heading [&_small]:[color:#7e8ca5] [&_small]:[font-size:9px] [&_small]:[letter-spacing:.15em] [&_small]:[font-weight:800] [&_h2]:[margin-top:7px] [&_h2]:[font-family:\"Space_Grotesk\",_sans-serif] [&_h2]:[font-size:25px] [&_h2]:[letter-spacing:-.03em] max-[768px]:[&_h2]:[font-size:clamp(20px,_5vw,_25px)]"}>
                    <small>YOUR LEARNING JOURNEY</small>
                    <h2>What will you develop today?</h2>
                  </div>
                  <div className={"preview-grid [display:grid] [grid-template-columns:1fr_1fr] [gap:11px] [margin-top:24px] max-[780px]:[grid-template-columns:1fr]"}>
                    <Link href="/education" className={"preview-card education [min-height:122px] [position:relative] [display:grid] [grid-template-columns:auto_1fr_auto] [align-items:start] [gap:11px] [padding:16px] [border:1px_solid_var(--line)] [border-radius:16px] [background:rgba(255,255,255,.035)] [transition:transform_.2s_ease,_background_.2s_ease] [&:hover]:[transform:translateY(-3px)] [&:hover]:[background:rgba(255,255,255,.06)] [&:nth-child(3)]:[grid-column:1_/_-1] [&:nth-child(3)]:[min-height:92px] [&:nth-child(3)]:[align-items:center] [&_strong]:[display:block] [&_strong]:[font-size:13px] [&_strong]:[margin-top:2px] [&_p]:[color:#7f8ca5] [&_p]:[font-size:11px] [&_p]:[line-height:1.5] [&_p]:[margin-top:5px] [&_>_span]:[color:#8d98ae] [&_>_span]:[font-size:16px] max-[780px]:[&:nth-child(3)]:[grid-column:auto] max-[320px]:[grid-template-columns:34px_minmax(0,_1fr)_auto] max-[320px]:[gap:8px] max-[320px]:[padding:12px]"}>
                      <div className={"preview-icon [display:grid] [place-items:center] [flex:0_0_auto] [width:42px] [height:42px] [border-radius:12px] [color:#fff] [font-family:\"Space_Grotesk\",_sans-serif] [font-weight:700] [background:rgba(69,211,156,.1)] [border:1px_solid_rgba(99,133,255,.22)] [border-color:rgba(69,211,156,.18)] max-[320px]:[width:34px] max-[320px]:[height:34px]"}>▦</div>
                      <div><strong>Education Hub</strong><p>Learn by class, subject and topic.</p></div>
                      <span>→</span>
                    </Link>
                    <Link href="/digital-skills" className={"preview-card skills [min-height:122px] [position:relative] [display:grid] [grid-template-columns:auto_1fr_auto] [align-items:start] [gap:11px] [padding:16px] [border:1px_solid_var(--line)] [border-radius:16px] [background:rgba(255,255,255,.035)] [transition:transform_.2s_ease,_background_.2s_ease] [&:hover]:[transform:translateY(-3px)] [&:hover]:[background:rgba(255,255,255,.06)] [&:nth-child(3)]:[grid-column:1_/_-1] [&:nth-child(3)]:[min-height:92px] [&:nth-child(3)]:[align-items:center] [&_strong]:[display:block] [&_strong]:[font-size:13px] [&_strong]:[margin-top:2px] [&_p]:[color:#7f8ca5] [&_p]:[font-size:11px] [&_p]:[line-height:1.5] [&_p]:[margin-top:5px] [&_>_span]:[color:#8d98ae] [&_>_span]:[font-size:16px] max-[780px]:[&:nth-child(3)]:[grid-column:auto] max-[320px]:[grid-template-columns:34px_minmax(0,_1fr)_auto] max-[320px]:[gap:8px] max-[320px]:[padding:12px]"}>
                      <div className={"preview-icon [display:grid] [place-items:center] [flex:0_0_auto] [width:42px] [height:42px] [border-radius:12px] [color:#fff] [font-family:\"Space_Grotesk\",_sans-serif] [font-weight:700] [background:rgba(69,211,156,.1)] [border:1px_solid_rgba(99,133,255,.22)] [border-color:rgba(69,211,156,.18)] max-[320px]:[width:34px] max-[320px]:[height:34px]"}>&lt;/&gt;</div>
                      <div><strong>Digital Skills</strong><p>Build practical technology skills.</p></div>
                      <span>→</span>
                    </Link>
                    <Link href="/entrepreneurship" className={"preview-card business [min-height:122px] [position:relative] [display:grid] [grid-template-columns:auto_1fr_auto] [align-items:start] [gap:11px] [padding:16px] [border:1px_solid_var(--line)] [border-radius:16px] [background:rgba(255,255,255,.035)] [transition:transform_.2s_ease,_background_.2s_ease] [&:hover]:[transform:translateY(-3px)] [&:hover]:[background:rgba(255,255,255,.06)] [&:nth-child(3)]:[grid-column:1_/_-1] [&:nth-child(3)]:[min-height:92px] [&:nth-child(3)]:[align-items:center] [&_strong]:[display:block] [&_strong]:[font-size:13px] [&_strong]:[margin-top:2px] [&_p]:[color:#7f8ca5] [&_p]:[font-size:11px] [&_p]:[line-height:1.5] [&_p]:[margin-top:5px] [&_>_span]:[color:#8d98ae] [&_>_span]:[font-size:16px] max-[780px]:[&:nth-child(3)]:[grid-column:auto] max-[320px]:[grid-template-columns:34px_minmax(0,_1fr)_auto] max-[320px]:[gap:8px] max-[320px]:[padding:12px]"}>
                      <div className={"preview-icon [display:grid] [place-items:center] [flex:0_0_auto] [width:42px] [height:42px] [border-radius:12px] [color:#fff] [font-family:\"Space_Grotesk\",_sans-serif] [font-weight:700] [background:rgba(69,211,156,.1)] [border:1px_solid_rgba(99,133,255,.22)] [border-color:rgba(69,211,156,.18)] max-[320px]:[width:34px] max-[320px]:[height:34px]"}>↗</div>
                      <div><strong>Entrepreneurship</strong><p>Turn ideas into opportunities.</p></div>
                      <span>→</span>
                    </Link>
                  </div>
                  <Link href="/ai" className={"ai-preview [margin-top:12px] [padding:15px] [display:grid] [grid-template-columns:auto_1fr_auto] [align-items:center] [gap:12px] [border:1px_solid_rgba(99,133,255,.25)] [border-radius:15px] [background:linear-gradient(_90deg,_rgba(99,133,255,.12),_rgba(155,123,255,.05)_)] [&_small]:[display:block] [&_small]:[color:#8e83ff] [&_small]:[font-size:8px] [&_small]:[font-weight:800] [&_small]:[letter-spacing:.15em] [&_strong]:[display:block] [&_strong]:[font-size:12px] [&_strong]:[margin-top:3px] [&_>_span]:[color:#aab4c8] [&_>_span]:[font-size:10px] max-[320px]:[grid-template-columns:32px_minmax(0,_1fr)] max-[320px]:[gap:8px] max-[320px]:[padding:12px] max-[320px]:[&_>_span]:[grid-column:2]"}>
                    <div className={"ai-symbol [width:38px] [height:38px] [display:grid] [place-items:center] [border-radius:11px] [background:linear-gradient(_135deg,_var(--primary),_var(--primary-2)_)]"}>✦</div>
                    <div><small>CEO JACK AI</small><strong>Your learning companion</strong></div>
                    <span>Ask AI →</span>
                  </Link>
                </div>
              </div>
              <div className={"floating-note note-one [position:absolute] [padding:9px_12px] [border:1px_solid_var(--line)] [border-radius:10px] [color:#cbd4e3] [background:rgba(10,16,32,.9)] [box-shadow:0_12px_30px_rgba(0,0,0,.25)] [font-size:10px] [font-weight:700] [backdrop-filter:blur(10px)] max-[560px]:[display:none] [left:-22px] [top:-40px] [z-index:2] max-[780px]:[left:-5px] max-[768px]:[left:8px]"}>Personalized learning</div>
              <div className={"floating-note note-two [position:absolute] [padding:9px_12px] [border:1px_solid_var(--line)] [border-radius:10px] [color:#cbd4e3] [background:rgba(10,16,32,.9)] [box-shadow:0_12px_30px_rgba(0,0,0,.25)] [font-size:10px] [font-weight:700] [backdrop-filter:blur(10px)] max-[560px]:[display:none] [right:-24px] [bottom:14%] max-[780px]:[right:-5px] max-[768px]:[right:8px]"}>Learn • Build • Grow</div>
            </div>
          </div>
        </section>

        <section className={"section why-section [padding:105px_0] max-[780px]:[padding:78px_0] [background:rgba(255,255,255,.012)]"} id="about">
          <div className={"container [width:min(calc(100%_-_40px),_var(--container))] [margin-inline:auto] max-[780px]:[width:min(_calc(100%_-_28px),_var(--container)_)] max-[1024px]:[min-width:0] max-[768px]:[width:min(calc(100%_-_32px),_var(--container))] max-[320px]:[width:calc(100%_-_24px)]"}>
            <div className={"section-heading centered reveal [max-width:700px] [margin-bottom:18px] [&_h2]:[margin-top:12px] [&_h2]:[font-family:\"Space_Grotesk\",_sans-serif] [&_h2]:[font-size:clamp(36px,_4.5vw,_58px)] [&_h2]:[line-height:1.03] [&_h2]:[letter-spacing:-.045em] [&_h2_span]:[color:#7e77ff] [&_p]:[max-width:630px] [&_p]:[margin-top:16px] [&_p]:[color:var(--muted)] max-[560px]:[&_h2]:[font-size:36px] max-[320px]:[&_h2]:[font-size:31px] [&_h2]:[color:var(--text)] [text-align:center] [margin-inline:auto] [&_p]:[margin-inline:auto] [opacity:0] [transform:translateY(22px)] [transition:opacity_.7s_ease,_transform_.7s_ease]"}>
              <span className={"section-label [color:#aeb8cd] [font-size:11px] [font-weight:800] [letter-spacing:.18em] max-[320px]:[font-size:9px] max-[320px]:[letter-spacing:.12em]"}>WHY CEO JACK?</span>
              <h2>More than a place to study.</h2>
              <p>CEO JACK connects learning, practical skills and future-focused development in one clear journey.</p>
            </div>
            <div className={"journey-grid [display:grid] [grid-template-columns:repeat(3,_1fr)] [gap:18px] max-[1000px]:[grid-template-columns:1fr] max-[1024px]:[grid-template-columns:repeat(2,_minmax(0,_1fr))] max-[768px]:[grid-template-columns:minmax(0,_1fr)]"}>
              <article className={"journey-card reveal [min-height:300px] [padding:30px] [position:relative] [border:1px_solid_var(--line)] [border-radius:var(--radius)] [background:rgba(255,255,255,.025)] [&_h3]:[font-family:\"Space_Grotesk\",_sans-serif] [&_h3]:[font-size:23px] [&_p]:[color:var(--muted)] [&_p]:[margin-top:10px] [&_p]:[font-size:14px] max-[1000px]:[min-height:auto] max-[1024px]:[min-height:0] max-[768px]:[padding:24px] [opacity:0] [transform:translateY(22px)] [transition:opacity_.7s_ease,_transform_.7s_ease]"}>
                <div className={"step-number [color:#68758d] [font-size:10px] [font-weight:800] [letter-spacing:.14em]"}>01</div><div className={"journey-icon [display:grid] [place-items:center] [flex:0_0_auto] [width:42px] [height:42px] [border-radius:12px] [color:#fff] [font-family:\"Space_Grotesk\",_sans-serif] [font-weight:700] [background:rgba(99,133,255,.16)] [border:1px_solid_rgba(99,133,255,.22)] [margin:38px_0_22px]"}>◎</div>
                <h3>Learn with purpose</h3>
                <p>Build strong foundations through structured lessons, subjects and guided learning.</p>
              </article>
              <article className={"journey-card featured reveal reveal-delay [min-height:300px] [padding:30px] [position:relative] [border:1px_solid_var(--line)] [border-radius:var(--radius)] [background:linear-gradient(_145deg,_rgba(99,133,255,.13),_rgba(255,255,255,.025)_)] [&_h3]:[font-family:\"Space_Grotesk\",_sans-serif] [&_h3]:[font-size:23px] [&_p]:[color:var(--muted)] [&_p]:[margin-top:10px] [&_p]:[font-size:14px] max-[1000px]:[min-height:auto] max-[1024px]:[min-height:0] max-[768px]:[padding:24px] [border-color:rgba(99,133,255,.25)] [opacity:0] [transform:translateY(22px)] [transition:opacity_.7s_ease,_transform_.7s_ease] [transition-delay:.08s]"}>
                <div className={"step-number [color:#68758d] [font-size:10px] [font-weight:800] [letter-spacing:.14em]"}>02</div><div className={"journey-icon [display:grid] [place-items:center] [flex:0_0_auto] [width:42px] [height:42px] [border-radius:12px] [color:#fff] [font-family:\"Space_Grotesk\",_sans-serif] [font-weight:700] [background:rgba(99,133,255,.16)] [border:1px_solid_rgba(99,133,255,.22)] [margin:38px_0_22px]"}>&lt;/&gt;</div>
                <h3>Build practical skills</h3>
                <p>Move beyond theory with digital skills, projects, coding and practical creation.</p>
              </article>
              <article className={"journey-card reveal reveal-delay-2 [min-height:300px] [padding:30px] [position:relative] [border:1px_solid_var(--line)] [border-radius:var(--radius)] [background:rgba(255,255,255,.025)] [&_h3]:[font-family:\"Space_Grotesk\",_sans-serif] [&_h3]:[font-size:23px] [&_p]:[color:var(--muted)] [&_p]:[margin-top:10px] [&_p]:[font-size:14px] max-[1000px]:[min-height:auto] max-[1024px]:[min-height:0] max-[768px]:[padding:24px] [opacity:0] [transform:translateY(22px)] [transition:opacity_.7s_ease,_transform_.7s_ease] [transition-delay:.16s]"}>
                <div className={"step-number [color:#68758d] [font-size:10px] [font-weight:800] [letter-spacing:.14em]"}>03</div><div className={"journey-icon [display:grid] [place-items:center] [flex:0_0_auto] [width:42px] [height:42px] [border-radius:12px] [color:#fff] [font-family:\"Space_Grotesk\",_sans-serif] [font-weight:700] [background:rgba(99,133,255,.16)] [border:1px_solid_rgba(99,133,255,.22)] [margin:38px_0_22px]"}>↗</div>
                <h3>Develop your future</h3>
                <p>Explore entrepreneurship, opportunities, personal growth and the skills that matter next.</p>
              </article>
            </div>
          </div>
        </section>

        <section className={"section hubs-section [padding:105px_0] max-[780px]:[padding:78px_0] [background:#0d1427]"} id="hubs">
          <div className={"container [width:min(calc(100%_-_40px),_var(--container))] [margin-inline:auto] max-[780px]:[width:min(_calc(100%_-_28px),_var(--container)_)] max-[1024px]:[min-width:0] max-[768px]:[width:min(calc(100%_-_32px),_var(--container))] max-[320px]:[width:calc(100%_-_24px)]"}>
            <div className={"section-heading reveal [max-width:700px] [margin-bottom:18px] [&_h2]:[margin-top:12px] [&_h2]:[font-family:\"Space_Grotesk\",_sans-serif] [&_h2]:[font-size:clamp(36px,_4.5vw,_58px)] [&_h2]:[line-height:1.03] [&_h2]:[letter-spacing:-.045em] [&_h2_span]:[color:#7e77ff] [&_p]:[max-width:630px] [&_p]:[margin-top:16px] [&_p]:[color:var(--muted)] max-[560px]:[&_h2]:[font-size:36px] max-[320px]:[&_h2]:[font-size:31px] [&_h2]:[color:var(--text)] [opacity:0] [transform:translateY(22px)] [transition:opacity_.7s_ease,_transform_.7s_ease]"}>
              <span className={"section-label [color:#aeb8cd] [font-size:11px] [font-weight:800] [letter-spacing:.18em] max-[320px]:[font-size:9px] max-[320px]:[letter-spacing:.12em]"}>THE THREE HUBS</span>
              <h2>One platform.<br /><span>Three ways to grow.</span></h2>
              <p>Start where you are. Move between the hubs as your goals change. Your learning journey stays connected.</p>
            </div>
            <div className={"hub-grid [display:grid] [grid-template-columns:repeat(3,_1fr)] [gap:18px] max-[1000px]:[grid-template-columns:1fr] max-[1024px]:[grid-template-columns:repeat(2,_minmax(0,_1fr))] max-[1024px]:[&_>_*]:[min-width:0] max-[768px]:[grid-template-columns:minmax(0,_1fr)]"}>
              <article className={"hub-card hub-education reveal [min-height:390px] [padding:31px] [position:relative] [overflow:hidden] [border:1px_solid_var(--line)] [border-radius:var(--radius)] [background:var(--surface)] [&::after]:[content:\"\"] [&::after]:[position:absolute] [&::after]:[width:180px] [&::after]:[height:180px] [&::after]:[right:-70px] [&::after]:[bottom:-80px] [&::after]:[border-radius:50%] [&::after]:[background:rgba(99,133,255,.13)] [&::after]:[filter:blur(15px)] [&_h3]:[margin-top:5px] [&_h3]:[font-family:\"Space_Grotesk\",_sans-serif] [&_h3]:[font-size:27px] [&_p]:[margin:13px_0_28px] [&_p]:[color:var(--muted)] [&_p]:[font-size:14px] [&_p]:[max-width:320px] [&_a]:[color:#cfd7e7] [&_a]:[font-size:13px] [&_a]:[font-weight:800] [&_a_span]:[color:#6385ff] [&_a_span]:[margin-left:7px] max-[1000px]:[min-height:auto] max-[1024px]:[min-height:0] max-[768px]:[padding:24px] [border-top:2px_solid_#6385ff] [opacity:0] [transform:translateY(22px)] [transition:opacity_.7s_ease,_transform_.7s_ease]"}>
                <div className={"hub-number [color:#68758d] [font-size:10px] [font-weight:800] [letter-spacing:.14em]"}>01</div><div className={"hub-icon [display:grid] [place-items:center] [flex:0_0_auto] [width:42px] [height:42px] [border-radius:12px] [color:#fff] [font-family:\"Space_Grotesk\",_sans-serif] [font-weight:700] [background:rgba(99,133,255,.16)] [border:1px_solid_rgba(99,133,255,.22)] [margin:38px_0_22px]"}>▦</div>
                <span className={"hub-tag [color:#7d89a1] [font-size:9px] [font-weight:800] [letter-spacing:.17em]"}>LEARN</span><h3>Education Hub</h3>
                <p>Structured learning for students from primary through secondary levels, with lessons, topics, practice and progress.</p>
                <Link href="/education">Explore Education <span>→</span></Link>
              </article>
              <article className={"hub-card hub-skills reveal reveal-delay [min-height:390px] [padding:31px] [position:relative] [overflow:hidden] [border:1px_solid_var(--line)] [border-radius:var(--radius)] [background:var(--surface)] [&::after]:[content:\"\"] [&::after]:[position:absolute] [&::after]:[width:180px] [&::after]:[height:180px] [&::after]:[right:-70px] [&::after]:[bottom:-80px] [&::after]:[border-radius:50%] [&::after]:[background:rgba(99,133,255,.13)] [&::after]:[filter:blur(15px)] [&_h3]:[margin-top:5px] [&_h3]:[font-family:\"Space_Grotesk\",_sans-serif] [&_h3]:[font-size:27px] [&_p]:[margin:13px_0_28px] [&_p]:[color:var(--muted)] [&_p]:[font-size:14px] [&_p]:[max-width:320px] [&_a]:[color:#cfd7e7] [&_a]:[font-size:13px] [&_a]:[font-weight:800] [&_a_span]:[color:#6385ff] [&_a_span]:[margin-left:7px] max-[1000px]:[min-height:auto] max-[1024px]:[min-height:0] max-[768px]:[padding:24px] [border-top:2px_solid_#9b7bff] [opacity:0] [transform:translateY(22px)] [transition:opacity_.7s_ease,_transform_.7s_ease] [transition-delay:.08s]"}>
                <div className={"hub-number [color:#68758d] [font-size:10px] [font-weight:800] [letter-spacing:.14em]"}>02</div><div className={"hub-icon [display:grid] [place-items:center] [flex:0_0_auto] [width:42px] [height:42px] [border-radius:12px] [color:#fff] [font-family:\"Space_Grotesk\",_sans-serif] [font-weight:700] [background:rgba(99,133,255,.16)] [border:1px_solid_rgba(99,133,255,.22)] [margin:38px_0_22px]"}>&lt;/&gt;</div>
                <span className={"hub-tag [color:#7d89a1] [font-size:9px] [font-weight:800] [letter-spacing:.17em]"}>CREATE</span><h3>Digital Skills Hub</h3>
                <p>Learn web development, programming, AI and other practical digital skills by building real things.</p>
                <Link href="/digital-skills">Build Digital Skills <span>→</span></Link>
              </article>
              <article className={"hub-card hub-business reveal reveal-delay-2 [min-height:390px] [padding:31px] [position:relative] [overflow:hidden] [border:1px_solid_var(--line)] [border-radius:var(--radius)] [background:var(--surface)] [&::after]:[content:\"\"] [&::after]:[position:absolute] [&::after]:[width:180px] [&::after]:[height:180px] [&::after]:[right:-70px] [&::after]:[bottom:-80px] [&::after]:[border-radius:50%] [&::after]:[background:rgba(99,133,255,.13)] [&::after]:[filter:blur(15px)] [&_h3]:[margin-top:5px] [&_h3]:[font-family:\"Space_Grotesk\",_sans-serif] [&_h3]:[font-size:27px] [&_p]:[margin:13px_0_28px] [&_p]:[color:var(--muted)] [&_p]:[font-size:14px] [&_p]:[max-width:320px] [&_a]:[color:#cfd7e7] [&_a]:[font-size:13px] [&_a]:[font-weight:800] [&_a_span]:[color:#6385ff] [&_a_span]:[margin-left:7px] max-[1000px]:[min-height:auto] max-[1024px]:[min-height:0] max-[768px]:[padding:24px] [border-top:2px_solid_#8cc8a9] [opacity:0] [transform:translateY(22px)] [transition:opacity_.7s_ease,_transform_.7s_ease] [transition-delay:.16s]"}>
                <div className={"hub-number [color:#68758d] [font-size:10px] [font-weight:800] [letter-spacing:.14em]"}>03</div><div className={"hub-icon [display:grid] [place-items:center] [flex:0_0_auto] [width:42px] [height:42px] [border-radius:12px] [color:#fff] [font-family:\"Space_Grotesk\",_sans-serif] [font-weight:700] [background:rgba(99,133,255,.16)] [border:1px_solid_rgba(99,133,255,.22)] [margin:38px_0_22px]"}>↗</div>
                <span className={"hub-tag [color:#7d89a1] [font-size:9px] [font-weight:800] [letter-spacing:.17em]"}>DEVELOP</span><h3>Entrepreneurship Hub</h3>
                <p>Develop business thinking, financial literacy and practical ideas that can grow into opportunities.</p>
                <Link href="/entrepreneurship">Explore Entrepreneurship <span>→</span></Link>
              </article>
            </div>
          </div>
        </section>

        <section className={"section how-section [padding:105px_0] max-[780px]:[padding:78px_0] [background:rgba(255,255,255,.015)]"} id="how-it-works">
          <div className={"container [width:min(calc(100%_-_40px),_var(--container))] [margin-inline:auto] max-[780px]:[width:min(_calc(100%_-_28px),_var(--container)_)] max-[1024px]:[min-width:0] max-[768px]:[width:min(calc(100%_-_32px),_var(--container))] max-[320px]:[width:calc(100%_-_24px)]"}>
            <div className={"section-heading centered reveal [max-width:700px] [margin-bottom:18px] [&_h2]:[margin-top:12px] [&_h2]:[font-family:\"Space_Grotesk\",_sans-serif] [&_h2]:[font-size:clamp(36px,_4.5vw,_58px)] [&_h2]:[line-height:1.03] [&_h2]:[letter-spacing:-.045em] [&_h2_span]:[color:#7e77ff] [&_p]:[max-width:630px] [&_p]:[margin-top:16px] [&_p]:[color:var(--muted)] max-[560px]:[&_h2]:[font-size:36px] max-[320px]:[&_h2]:[font-size:31px] [&_h2]:[color:var(--text)] [text-align:center] [margin-inline:auto] [&_p]:[margin-inline:auto] [opacity:0] [transform:translateY(22px)] [transition:opacity_.7s_ease,_transform_.7s_ease]"}>
              <span className={"section-label [color:#aeb8cd] [font-size:11px] [font-weight:800] [letter-spacing:.18em] max-[320px]:[font-size:9px] max-[320px]:[letter-spacing:.12em]"}>HOW IT WORKS</span>
              <h2>Your journey starts simple.</h2>
              <p>Four steps from signing up to building your own path.</p>
            </div>
            <div className={"steps [display:grid] [grid-template-columns:repeat(4,_1fr)] [border-top:1px_solid_var(--line)] [border-bottom:1px_solid_var(--line)] max-[1000px]:[grid-template-columns:1fr_1fr] max-[560px]:[grid-template-columns:1fr]"}>
              <article className={"step reveal [min-height:210px] [padding:28px_25px] [border-right:1px_solid_var(--line)] [&:last-child]:[border-right:0] [&_>_span]:[color:#6385ff] [&_>_span]:[font-family:\"Space_Grotesk\",_sans-serif] [&_>_span]:[font-weight:700] [&_>_span]:[font-size:12px] [&_h3]:[margin-top:34px] [&_h3]:[font-family:\"Space_Grotesk\",_sans-serif] [&_h3]:[font-size:18px] [&_p]:[color:var(--muted)] [&_p]:[font-size:13px] [&_p]:[margin-top:8px] max-[1000px]:[&:nth-child(2)]:[border-right:0] max-[1000px]:[&:nth-child(-n+2)]:[border-bottom:1px_solid_var(--line)] max-[560px]:[min-height:auto] max-[560px]:[border-right:0] max-[560px]:[border-bottom:1px_solid_var(--line)] max-[560px]:[&:last-child]:[border-bottom:0] max-[560px]:[&_h3]:[margin-top:22px] [opacity:0] [transform:translateY(22px)] [transition:opacity_.7s_ease,_transform_.7s_ease]"}><span>01</span><div><h3>Create your account</h3><p>Start with a free account and enter your learning space.</p></div></article>
              <article className={"step reveal reveal-delay [min-height:210px] [padding:28px_25px] [border-right:1px_solid_var(--line)] [&:last-child]:[border-right:0] [&_>_span]:[color:#6385ff] [&_>_span]:[font-family:\"Space_Grotesk\",_sans-serif] [&_>_span]:[font-weight:700] [&_>_span]:[font-size:12px] [&_h3]:[margin-top:34px] [&_h3]:[font-family:\"Space_Grotesk\",_sans-serif] [&_h3]:[font-size:18px] [&_p]:[color:var(--muted)] [&_p]:[font-size:13px] [&_p]:[margin-top:8px] max-[1000px]:[&:nth-child(2)]:[border-right:0] max-[1000px]:[&:nth-child(-n+2)]:[border-bottom:1px_solid_var(--line)] max-[560px]:[min-height:auto] max-[560px]:[border-right:0] max-[560px]:[border-bottom:1px_solid_var(--line)] max-[560px]:[&:last-child]:[border-bottom:0] max-[560px]:[&_h3]:[margin-top:22px] [opacity:0] [transform:translateY(22px)] [transition:opacity_.7s_ease,_transform_.7s_ease] [transition-delay:.08s]"}><span>02</span><div><h3>Tell us your goals</h3><p>Choose your interests, level and the areas you want to develop.</p></div></article>
              <article className={"step reveal reveal-delay-2 [min-height:210px] [padding:28px_25px] [border-right:1px_solid_var(--line)] [&:last-child]:[border-right:0] [&_>_span]:[color:#6385ff] [&_>_span]:[font-family:\"Space_Grotesk\",_sans-serif] [&_>_span]:[font-weight:700] [&_>_span]:[font-size:12px] [&_h3]:[margin-top:34px] [&_h3]:[font-family:\"Space_Grotesk\",_sans-serif] [&_h3]:[font-size:18px] [&_p]:[color:var(--muted)] [&_p]:[font-size:13px] [&_p]:[margin-top:8px] max-[1000px]:[&:nth-child(2)]:[border-right:0] max-[1000px]:[&:nth-child(-n+2)]:[border-bottom:1px_solid_var(--line)] max-[560px]:[min-height:auto] max-[560px]:[border-right:0] max-[560px]:[border-bottom:1px_solid_var(--line)] max-[560px]:[&:last-child]:[border-bottom:0] max-[560px]:[&_h3]:[margin-top:22px] [opacity:0] [transform:translateY(22px)] [transition:opacity_.7s_ease,_transform_.7s_ease] [transition-delay:.16s]"}><span>03</span><div><h3>Choose your path</h3><p>Explore Education, Digital Skills or Entrepreneurship — or combine them.</p></div></article>
              <article className={"step reveal reveal-delay-3 [min-height:210px] [padding:28px_25px] [border-right:1px_solid_var(--line)] [&:last-child]:[border-right:0] [&_>_span]:[color:#6385ff] [&_>_span]:[font-family:\"Space_Grotesk\",_sans-serif] [&_>_span]:[font-weight:700] [&_>_span]:[font-size:12px] [&_h3]:[margin-top:34px] [&_h3]:[font-family:\"Space_Grotesk\",_sans-serif] [&_h3]:[font-size:18px] [&_p]:[color:var(--muted)] [&_p]:[font-size:13px] [&_p]:[margin-top:8px] max-[1000px]:[&:nth-child(2)]:[border-right:0] max-[1000px]:[&:nth-child(-n+2)]:[border-bottom:1px_solid_var(--line)] max-[560px]:[min-height:auto] max-[560px]:[border-right:0] max-[560px]:[border-bottom:1px_solid_var(--line)] max-[560px]:[&:last-child]:[border-bottom:0] max-[560px]:[&_h3]:[margin-top:22px] [opacity:0] [transform:translateY(22px)] [transition:opacity_.7s_ease,_transform_.7s_ease] [transition-delay:.24s]"}><span>04</span><div><h3>Keep developing</h3><p>Learn, practise, track progress and keep moving forward.</p></div></article>
            </div>
          </div>
        </section>

        <section className={"section progress-section [padding:105px_0] max-[780px]:[padding:78px_0] [background:#0d1427]"} aria-labelledby="progress-title">
          <div className={"container progress-layout [width:min(calc(100%_-_40px),_var(--container))] [margin-inline:auto] max-[780px]:[width:min(_calc(100%_-_28px),_var(--container)_)] max-[1024px]:[min-width:0] max-[768px]:[width:min(calc(100%_-_32px),_var(--container))] max-[320px]:[width:calc(100%_-_24px)] [display:grid] [grid-template-columns:.85fr_1.15fr] [gap:72px] [align-items:center] max-[780px]:[grid-template-columns:1fr] max-[780px]:[gap:36px]"}>
            <div className={"progress-copy reveal [&_h2]:[margin-top:12px] [&_h2]:[font-family:\"Space_Grotesk\",_sans-serif] [&_h2]:[font-size:clamp(36px,_4.5vw,_56px)] [&_h2]:[line-height:1.03] [&_h2]:[letter-spacing:-.045em] [&_p]:[max-width:530px] [&_p]:[margin:18px_0_27px] [&_p]:[color:var(--muted)] [opacity:0] [transform:translateY(22px)] [transition:opacity_.7s_ease,_transform_.7s_ease]"}>
              <span className={"section-label [color:#aeb8cd] [font-size:11px] [font-weight:800] [letter-spacing:.18em] max-[320px]:[font-size:9px] max-[320px]:[letter-spacing:.12em]"}>BUILT TO GROW WITH YOU</span>
              <h2 id="progress-title">Your learning space, all in one view.</h2>
              <p>
                As you connect your account, this space is ready to show enrolled lessons, saved ideas, progress streaks and the next action on your path.
              </p>
              <Link href="/dashboard" className={"text-link [color:#cfd7e7] [font-size:13px] [font-weight:800] [&_span]:[color:#6385ff] [&_span]:[margin-left:7px]"}>Preview your dashboard <span>→</span></Link>
            </div>
            <div className={"learning-board reveal reveal-delay [padding:28px] [border:1px_solid_rgba(99,133,255,.28)] [border-radius:var(--radius)] [background:linear-gradient(145deg,_rgba(22,33,59,.98),_rgba(12,19,37,.98))] [box-shadow:var(--shadow)] max-[560px]:[padding:20px] [opacity:0] [transform:translateY(22px)] [transition:opacity_.7s_ease,_transform_.7s_ease] [transition-delay:.08s]"} aria-label="Example learning dashboard preview">
              <div className={"board-header [display:flex] [align-items:center] [justify-content:space-between] [gap:16px] [&_span]:[color:#8c9ab1] [&_span]:[font-size:9px] [&_span]:[font-weight:800] [&_span]:[letter-spacing:.14em] [&_b]:[color:var(--cyan)] [&_b]:[font-size:12px]"}><span>YOUR WEEKLY MOMENTUM</span><b>76% complete</b></div>
              <div className={"board-progress [height:8px] [overflow:hidden] [margin:17px_0_24px] [border-radius:20px] [background:rgba(255,255,255,.08)] [&_span]:[display:block] [&_span]:[height:100%] [&_span]:[border-radius:inherit] [&_span]:[background:linear-gradient(90deg,_var(--primary),_var(--cyan))]"}><span style={{ width: "76%" }} /></div>
              <div className={"board-stats [&_small]:[color:#8c9ab1] [&_small]:[font-size:9px] [&_small]:[font-weight:800] [&_small]:[letter-spacing:.14em] [display:grid] [grid-template-columns:repeat(3,_1fr)] [gap:10px] [&_>_div]:[display:grid] [&_>_div]:[gap:5px] [&_>_div]:[min-height:92px] [&_>_div]:[padding:16px] [&_>_div]:[border:1px_solid_var(--line)] [&_>_div]:[border-radius:14px] [&_>_div]:[background:rgba(255,255,255,.035)] [&_strong]:[font-family:\"Space_Grotesk\",_sans-serif] [&_strong]:[font-size:27px] max-[560px]:[grid-template-columns:1fr] max-[560px]:[&_>_div]:[min-height:auto] max-[560px]:[&_>_div]:[grid-template-columns:50px_1fr] max-[560px]:[&_>_div]:[align-items:center]"}>
                <div><strong>04</strong><small>LESSONS READY</small></div>
                <div><strong>02</strong><small>SKILLS IN PROGRESS</small></div>
                <div><strong>01</strong><small>IDEA TO EXPLORE</small></div>
              </div>
              <div className={"next-lesson [display:flex] [align-items:center] [justify-content:space-between] [gap:16px] [&_small]:[color:#8c9ab1] [&_small]:[font-size:9px] [&_small]:[font-weight:800] [&_small]:[letter-spacing:.14em] [margin-top:12px] [padding:16px] [border:1px_solid_rgba(155,123,255,.2)] [border-radius:14px] [background:rgba(155,123,255,.055)] [&_>_div]:[margin-right:auto] [&_strong]:[display:block] [&_strong]:[margin-top:3px] [&_strong]:[font-size:13px]"}><span className={"lesson-icon [display:grid] [width:38px] [height:38px] [place-items:center] [border-radius:11px] [background:rgba(155,123,255,.13)] [color:var(--cyan)]"}>↗</span><div><small>CONTINUE LEARNING</small><strong>Turn an idea into a simple plan</strong></div><span aria-hidden="true">→</span></div>
            </div>
          </div>
        </section>

        <section className={"section ai-section [padding:105px_0] max-[780px]:[padding:78px_0]"}>
          <div className={"container [width:min(calc(100%_-_40px),_var(--container))] [margin-inline:auto] max-[780px]:[width:min(_calc(100%_-_28px),_var(--container)_)] max-[1024px]:[min-width:0] max-[768px]:[width:min(calc(100%_-_32px),_var(--container))] max-[320px]:[width:calc(100%_-_24px)]"}>
            <div className={"ai-panel reveal [min-height:390px] [padding:60px] [display:grid] [grid-template-columns:1fr_.7fr] [align-items:center] [overflow:hidden] [border-radius:30px] [border:1px_solid_rgba(99,133,255,.22)] [background:radial-gradient(_circle_at_75%_45%,_rgba(99,133,255,.18),_transparent_28%_),_linear-gradient(_135deg,_#121b36,_#0d1429_)] max-[1000px]:[grid-template-columns:1fr_.5fr] max-[780px]:[grid-template-columns:1fr] max-[780px]:[padding:42px_28px] [opacity:0] [transform:translateY(22px)] [transition:opacity_.7s_ease,_transform_.7s_ease]"}>
              <div className={"ai-copy [&_h2]:[margin-top:12px] [&_h2]:[font-family:\"Space_Grotesk\",_sans-serif] [&_h2]:[font-size:clamp(36px,_4.5vw,_58px)] [&_h2]:[line-height:1.03] [&_h2]:[letter-spacing:-.045em] [max-width:570px] [&_p]:[max-width:530px] [&_p]:[margin:18px_0_28px] [&_p]:[color:var(--muted)] max-[560px]:[&_h2]:[font-size:36px] max-[320px]:[&_h2]:[font-size:31px]"}>
                <span className={"section-label [color:#aeb8cd] [font-size:11px] [font-weight:800] [letter-spacing:.18em] max-[320px]:[font-size:9px] max-[320px]:[letter-spacing:.12em]"}>MEET CEO JACK AI</span>
                <h2>Stuck? Ask.<br />Curious? Explore.</h2>
                <p>CEO JACK AI is your learning companion. Ask questions, get explanations, explore ideas and receive help while you learn.</p>
                <Link href="/ai" className={"btn btn-light [display:inline-flex] [align-items:center] [justify-content:center] [gap:12px] [border-radius:12px] [font-weight:700] [transition:transform_.2s_ease,_box-shadow_.2s_ease,_background_.2s_ease] [&:hover]:[transform:translateY(-2px)] [min-height:50px] [padding:0_20px] max-[560px]:[width:100%] [color:#0d1427] [background:#fff]"}>Explore CEO JACK AI →</Link>
              </div>
              <div className={"ai-orb [position:relative] [width:250px] [height:250px] [justify-self:center] max-[780px]:[margin-top:30px] max-[780px]:[width:180px] max-[780px]:[height:180px]"} aria-hidden="true">
                <div className={"orb-ring ring-a [position:absolute] [inset:0] [border:1px_solid_rgba(99,133,255,.35)] [border-radius:50%] [transform:rotate(55deg)_scaleY(.55)]"} /><div className={"orb-ring ring-b [position:absolute] [inset:0] [border:1px_solid_rgba(99,133,255,.35)] [border-radius:50%] [transform:rotate(-55deg)_scaleY(.55)] [border-color:rgba(155,123,255,.3)]"} /><div className={"orb-core [position:absolute] [inset:65px] [display:grid] [place-items:center] [border-radius:50%] [color:#fff] [font-size:40px] [background:radial-gradient(_circle,_#6385ff,_#2e6b65_48%,_#10182e_70%_)] [box-shadow:0_0_70px_rgba(99,133,255,.32)] max-[780px]:[inset:48px] max-[780px]:[font-size:30px]"}>✦</div>
              </div>
            </div>
          </div>
        </section>

        <section className={"section outcomes-section [padding:105px_0] max-[780px]:[padding:78px_0]"}>
          <div className={"container outcomes-grid [width:min(calc(100%_-_40px),_var(--container))] [margin-inline:auto] max-[780px]:[width:min(_calc(100%_-_28px),_var(--container)_)] max-[1024px]:[min-width:0] max-[768px]:[width:min(calc(100%_-_32px),_var(--container))] max-[320px]:[width:calc(100%_-_24px)] [display:grid] [grid-template-columns:1fr_1fr] [gap:80px] [align-items:center] max-[780px]:[grid-template-columns:1fr] max-[780px]:[gap:45px]"}>
            <div className={"outcomes-copy reveal [&_h2]:[margin-top:12px] [&_h2]:[font-family:\"Space_Grotesk\",_sans-serif] [&_h2]:[font-size:clamp(36px,_4.5vw,_58px)] [&_h2]:[line-height:1.03] [&_h2]:[letter-spacing:-.045em] [&_p]:[max-width:560px] [&_p]:[margin:20px_0_27px] [&_p]:[color:var(--muted)] max-[560px]:[&_h2]:[font-size:36px] max-[320px]:[&_h2]:[font-size:31px] [opacity:0] [transform:translateY(22px)] [transition:opacity_.7s_ease,_transform_.7s_ease]"}>
              <span className={"section-label [color:#aeb8cd] [font-size:11px] [font-weight:800] [letter-spacing:.18em] max-[320px]:[font-size:9px] max-[320px]:[letter-spacing:.12em]"}>THE CEO JACK PHILOSOPHY</span>
              <h2>Learn something.<br />Create something.<br />Develop yourself.</h2>
              <p>Education should not end when the lesson ends. Use what you learn, turn knowledge into skills, and use those skills to shape your future.</p>
              <Link href="/get-started" className={"text-link [color:#cfd7e7] [font-size:13px] [font-weight:800] [&_span]:[color:#6385ff] [&_span]:[margin-left:7px]"}>Start your journey <span>→</span></Link>
            </div>
            <div className={"outcome-list reveal reveal-delay [border-top:1px_solid_var(--line)] [&_>_div]:[display:grid] [&_>_div]:[grid-template-columns:45px_1fr_1.3fr] [&_>_div]:[gap:15px] [&_>_div]:[align-items:center] [&_>_div]:[padding:22px_0] [&_>_div]:[border-bottom:1px_solid_var(--line)] [&_b]:[color:#6385ff] [&_b]:[font-size:11px] [&_strong]:[font-family:\"Space_Grotesk\",_sans-serif] [&_span]:[color:var(--muted)] [&_span]:[font-size:12px] max-[560px]:[&_>_div]:[grid-template-columns:35px_1fr] max-[560px]:[&_span]:[grid-column:2] [opacity:0] [transform:translateY(22px)] [transition:opacity_.7s_ease,_transform_.7s_ease] [transition-delay:.08s]"}>
              <div><b>01</b><strong>Knowledge</strong><span>Understand the foundations.</span></div>
              <div><b>02</b><strong>Skills</strong><span>Practise and build.</span></div>
              <div><b>03</b><strong>Confidence</strong><span>Apply what you know.</span></div>
              <div><b>04</b><strong>Opportunity</strong><span>Develop your next step.</span></div>
            </div>
          </div>
        </section>

        <section className={"section sponsors-section [padding:105px_0] max-[780px]:[padding:78px_0] [padding-block:54px] [border-block:1px_solid_var(--line)] [background:rgba(255,_255,_255,_.012)]"} aria-labelledby="sponsors-title">
          <div className={"container [width:min(calc(100%_-_40px),_var(--container))] [margin-inline:auto] max-[780px]:[width:min(_calc(100%_-_28px),_var(--container)_)] max-[1024px]:[min-width:0] max-[768px]:[width:min(calc(100%_-_32px),_var(--container))] max-[320px]:[width:calc(100%_-_24px)]"}>
            <div className={"sponsor-invite reveal [display:flex] [max-width:760px] [flex-direction:column] [align-items:center] [margin-inline:auto] [padding:30px_28px] [border:1px_solid_rgba(129,_154,_255,_.2)] [border-radius:var(--radius)] [background:radial-gradient(ellipse_at_50%_0%,_rgba(99,_133,_255,_.12),_transparent_65%),_var(--surface)] [box-shadow:0_16px_45px_rgba(0,_0,_0,_.18)] [text-align:center] max-[780px]:[padding:24px_18px] [opacity:0] [transform:translateY(22px)] [transition:opacity_.7s_ease,_transform_.7s_ease]"}>
              <div className={"section-heading centered [max-width:700px] [margin-bottom:18px] [&_h2]:[margin-top:12px] [&_h2]:[font-family:\"Space_Grotesk\",_sans-serif] [&_h2]:[font-size:clamp(36px,_4.5vw,_58px)] [&_h2]:[line-height:1.03] [&_h2]:[letter-spacing:-.045em] [&_h2_span]:[color:#7e77ff] [&_p]:[max-width:630px] [&_p]:[margin-top:16px] [&_p]:[color:var(--muted)] max-[560px]:[&_h2]:[font-size:36px] max-[320px]:[&_h2]:[font-size:31px] [&_h2]:[color:var(--text)] [text-align:center] [margin-inline:auto] [&_p]:[margin-inline:auto]"}>
                <h2 id="sponsors-title">Become Our Sponsor</h2>
                <p>Want to support learning in Uganda? Partner with CEO JACK Learning Hub.</p>
              </div>
              <Link href="/sponsor-application" className={"btn btn-primary sponsor-button [display:inline-flex] [align-items:center] [justify-content:center] [gap:12px] [border-radius:12px] [font-weight:700] [transition:transform_.2s_ease,_box-shadow_.2s_ease,_background_.2s_ease] [&:hover]:[transform:translateY(-2px)] [min-height:50px] [padding:0_20px] max-[560px]:[width:100%] [color:#fff] [background:linear-gradient(_135deg,_var(--primary),_var(--primary-2)_)] [box-shadow:0_16px_38px_rgba(85,91,220,.27)] ![min-height:40px] ![padding-inline:16px] ![border-radius:9px] ![font-size:12px]"}>Become a Sponsor</Link>
            </div>
          </div>
        </section>

        <section className={"section final-section [padding:105px_0] max-[780px]:[padding:78px_0] [padding-top:40px]"} id="contact">
          <div className={"container [width:min(calc(100%_-_40px),_var(--container))] [margin-inline:auto] max-[780px]:[width:min(_calc(100%_-_28px),_var(--container)_)] max-[1024px]:[min-width:0] max-[768px]:[width:min(calc(100%_-_32px),_var(--container))] max-[320px]:[width:calc(100%_-_24px)]"}>
            <div className={"final-card reveal [&_h2]:[margin-top:12px] [&_h2]:[font-family:\"Space_Grotesk\",_sans-serif] [&_h2]:[font-size:clamp(36px,_4.5vw,_58px)] [&_h2]:[line-height:1.03] [&_h2]:[letter-spacing:-.045em] [padding:85px_40px] [text-align:center] [border:1px_solid_var(--line)] [border-radius:30px] [background:radial-gradient(_circle_at_50%_0%,_rgba(99,133,255,.18),_transparent_45%_),_rgba(255,255,255,.025)] [&_p]:[margin:16px_auto_28px] [&_p]:[color:var(--muted)] max-[560px]:[&_h2]:[font-size:36px] max-[560px]:[padding:60px_22px] max-[320px]:[&_h2]:[font-size:31px] max-[320px]:[padding:48px_16px] [opacity:0] [transform:translateY(22px)] [transition:opacity_.7s_ease,_transform_.7s_ease]"}>
              <span className={"section-label [color:#aeb8cd] [font-size:11px] [font-weight:800] [letter-spacing:.18em] max-[320px]:[font-size:9px] max-[320px]:[letter-spacing:.12em]"}>YOUR NEXT STEP</span>
              <h2>Ready to learn, create and develop?</h2>
              <p>Start free and build a learning journey around your goals.</p>
              <Link href="/get-started" className={"btn btn-primary large get-started-button [display:inline-flex] [align-items:center] [justify-content:center] [gap:12px] [border-radius:12px] [font-weight:700] [transition:transform_.2s_ease,_box-shadow_.2s_ease,_background_.2s_ease] [&:hover]:[transform:translateY(-2px)] [min-height:56px] [padding:0_20px] max-[560px]:[width:100%] [color:#fff] [background:linear-gradient(_135deg,_var(--primary),_var(--primary-2)_)] [box-shadow:0_16px_38px_rgba(85,91,220,.27)] [padding-inline:26px]"}>Get Started Free <span>→</span></Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
