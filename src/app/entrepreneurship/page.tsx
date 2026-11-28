"use client";

import Link from "next/link";
import { SiteFooter } from "@/src/components/footer";
import { SiteLogoMark } from "@/src/components/site-logo-mark";
import { useState } from "react";
import { entrepreneurshipTracks } from "@/src/utils/education-data";

export default function EntrepreneurshipPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
    <div className={"app [min-height:100vh] [display:flex] max-[768px]:[max-width:100%] max-[768px]:[min-width:0] max-[768px]:[overflow-x:clip]"}>
      <aside className={(`sidebar [width:255px] [min-height:100vh] [background:rgba(9,15,30,.97)] [color:white] [padding:28px_17px_20px] [border-right:1px_solid_rgba(255,255,255,.05)] [backdrop-filter:blur(18px)] [display:flex] [flex-direction:column] [flex-shrink:0] [position:fixed] [inset:0_auto_0_0] [z-index:30] [overflow-y:auto] max-[850px]:[transform:translateX(-100%)] max-[850px]:[transition:transform_.25s_ease]${sidebarOpen ? "open max-[850px]:[transform:translateX(0)]" : ""}`)}>
        <Link href="/" className={"brand [display:flex] [align-items:center] [gap:11px] [padding:0_7px] [color:white] [margin-bottom:43px]"}>
          <SiteLogoMark className={"brand-icon [width:42px] [height:42px] [object-fit:cover] [border-radius:13px] [display:grid] [place-items:center] [background:linear-gradient(135deg,_#6385ff,_#9b7bff)] [font-family:'Space_Grotesk',_sans-serif] [font-weight:700]"} width={84} height={84} alt="CEO JACK Learning Hub logo" />
          <div className={"brand-copy [&_strong]:[display:block] [&_strong]:[font-size:13px] [&_strong]:[letter-spacing:.5px] [&_span]:[display:block] [&_span]:[font-size:9px] [&_span]:[letter-spacing:1.4px] [&_span]:[color:#9caac1] [&_span]:[margin-top:4px]"}>
            <strong>CEO JACK</strong>
            <span>LEARNING HUB</span>
          </div>
        </Link>
        <nav className={"navigation [display:grid] [gap:5px]"}>
          <Link href="/dashboard" className={"nav-link [min-height:44px] [display:flex] [align-items:center] [gap:12px] [padding:0_12px] [border-radius:10px] [color:#aebbd0] [font-size:12px] [transition:.2s] [&:hover]:[background:rgba(255,255,255,.07)] [&:hover]:[color:white]"}><span className={"nav-icon [width:20px] [text-align:center] [color:#9b7bff] [font-size:16px]"}>⌂</span>Dashboard</Link>
          <Link href="/education" className={"nav-link [min-height:44px] [display:flex] [align-items:center] [gap:12px] [padding:0_12px] [border-radius:10px] [color:#aebbd0] [font-size:12px] [transition:.2s] [&:hover]:[background:rgba(255,255,255,.07)] [&:hover]:[color:white]"}><span className={"nav-icon [width:20px] [text-align:center] [color:#9b7bff] [font-size:16px]"}>▤</span>Education Hub</Link>
          <Link href="/digital-skills" className={"nav-link [min-height:44px] [display:flex] [align-items:center] [gap:12px] [padding:0_12px] [border-radius:10px] [color:#aebbd0] [font-size:12px] [transition:.2s] [&:hover]:[background:rgba(255,255,255,.07)] [&:hover]:[color:white]"}><span className={"nav-icon [width:20px] [text-align:center] [color:#9b7bff] [font-size:16px]"}>&lt;/&gt;</span>Digital Skills</Link>
          <Link href="/entrepreneurship" className={"nav-link active [min-height:44px] [display:flex] [align-items:center] [gap:12px] [padding:0_12px] [border-radius:10px] [color:#fff] [font-size:12px] [transition:.2s] [&:hover]:[background:rgba(255,255,255,.07)] [&:hover]:[color:white] [border:1.5px_solid_var(--primary)] [background:rgba(155,123,255,.14)] [box-shadow:none] [border-color:rgba(155,123,255,.45)]"}><span className={"nav-icon [width:20px] [text-align:center] [color:#9b7bff] [font-size:16px]"}>◈</span>Entrepreneurship</Link>
          <Link href="/ai" className={"nav-link [min-height:44px] [display:flex] [align-items:center] [gap:12px] [padding:0_12px] [border-radius:10px] [color:#aebbd0] [font-size:12px] [transition:.2s] [&:hover]:[background:rgba(255,255,255,.07)] [&:hover]:[color:white]"}><span className={"nav-icon [width:20px] [text-align:center] [color:#9b7bff] [font-size:16px]"}>✦</span>CEO JACK AI</Link>
        </nav>
      </aside>
      {sidebarOpen ? <div className={"mobile-overlay show [display:none] [opacity:1] [transform:translate(-50%,_0)] max-[850px]:[display:block] max-[850px]:[position:fixed] max-[850px]:[inset:0] max-[850px]:[background:rgba(8,15,30,.55)] max-[850px]:[z-index:20]"} onClick={() => setSidebarOpen(false)} /> : null}
      <main className={"main [margin-left:255px] [width:calc(100%_-_255px)] [min-width:0] max-[850px]:[margin-left:0] max-[850px]:[width:100%] max-[768px]:[max-width:100%] max-[768px]:[min-width:0] max-[768px]:[overflow-x:clip]"}>
        <header className={"topbar [height:69px] [background:rgba(8,13,27,.83)] [border-bottom:1px_solid_var(--border)] [padding:0_38px] [display:flex] [align-items:center] [justify-content:space-between] [position:sticky] [top:0] [z-index:10] [backdrop-filter:blur(15px)] [&_h1]:[font-family:'Space_Grotesk',sans-serif] [&_h1]:[font-size:19px] [&_h1]:[letter-spacing:-.4px] [border-color:rgba(255,255,255,.06)] max-[850px]:[padding:0_22px] max-[600px]:[height:70px] max-[600px]:[padding:0_14px] max-[600px]:[&_h1]:[font-size:16px] max-[1024px]:[min-width:0] max-[768px]:[gap:10px] max-[320px]:[padding-inline:10px] max-[320px]:[&_h1]:[font-size:14px]"}>
          <div className={"topbar-left [display:flex] [align-items:center] [gap:15px] max-[768px]:[min-width:0] max-[320px]:[gap:7px]"}>
            <button className={"menu-btn [display:none] [border:0] [background:transparent] [font-size:23px] [color:var(--text)] max-[850px]:[display:block] max-[320px]:[flex:0_0_30px] max-[320px]:[width:30px] max-[320px]:[padding:0]"} type="button" aria-label="Open navigation" onClick={() => setSidebarOpen(true)}>☰</button>
            <div>
              <div className={"breadcrumb [font-size:10px] [color:var(--muted)] [margin-bottom:5px] max-[600px]:[font-size:9px] max-[320px]:[font-size:8px]"}>Learning Space / Entrepreneurship</div>
              <h1>Entrepreneurship Hub</h1>
            </div>
          </div>
        </header>
        <div className={"page-content [width:100%] [max-width:1450px] [margin:0_auto] [padding:31px_38px_25px] max-[850px]:[padding:25px_22px] max-[600px]:[padding:18px_14px] max-[1024px]:[min-width:0] max-[768px]:[padding:20px_18px] max-[320px]:[padding:16px_12px]"}>
          <section className={"hero [min-height:290px] [border-radius:19px] [background:radial-gradient(circle_at_80%_15%,_rgba(116,101,244,.35),_transparent_30%),_linear-gradient(115deg,_#1d3044,_#254653_60%,_#34656a)] [color:white] [position:relative] [overflow:hidden] [display:flex] [align-items:center] [padding:37px_44px] [&_h2]:[font-family:'Space_Grotesk',_sans-serif] [&_h2]:[font-size:clamp(31px,_4vw,_45px)] [&_h2]:[letter-spacing:-1.7px] [&_h2]:[line-height:1.1] [&_h2_span]:[color:#9b7bff] max-[600px]:[min-height:320px] max-[600px]:[padding:27px_22px] max-[600px]:[align-items:flex-start] max-[600px]:[&_h2]:[font-size:35px] max-[768px]:[padding-inline:28px] max-[320px]:[min-height:300px] max-[320px]:[padding:22px_16px] max-[320px]:[&_h2]:[font-size:30px]"}>
            <div className={"hero-content [position:relative] [z-index:2] [max-width:530px] [&_>_p]:[max-width:440px] [&_>_p]:[color:#c0c9dd] [&_>_p]:[font-size:12px] [&_>_p]:[line-height:1.8] [&_>_p]:[margin:14px_0_22px] max-[600px]:[max-width:100%] max-[600px]:[&_>_p]:[max-width:300px] max-[600px]:[&_>_p]:[font-size:11px] max-[320px]:[&_>_p]:[max-width:100%]"}>
              <div className={"hero-label [display:flex] [align-items:center] [gap:8px] [font-size:9px] [letter-spacing:1.7px] [font-weight:700] [color:#c0a3ff] [margin-bottom:17px]"}><span className={"hero-dot [width:7px] [height:7px] [background:#6de0b3] [border-radius:50%]"} />DEVELOP YOUR FUTURE</div>
              <h2>Turn ideas into<br /><span>opportunities.</span></h2>
              <p>Build business thinking, financial literacy and practical next steps you can try in the real world.</p>
              <Link href="/ai" className={"hero-button [display:inline-flex] [align-items:center] [gap:19px] [padding:12px_17px] [border-radius:9px] [color:#30286e] [background:white] [font-size:11px] [font-weight:700] [transition:.2s] [&:hover]:[transform:translateY(-2px)]"}>Explore business with AI <span>→</span></Link>
            </div>
          </section>
          <section className={"hub-journey [display:grid] [grid-template-columns:minmax(190px,.8fr)_minmax(0,2fr)] [align-items:center] [gap:24px] [margin-top:24px] [padding:21px_23px] [border:1px_solid_rgba(255,255,255,.09)] [border-radius:16px] [background:linear-gradient(115deg,rgba(20,30,52,.96),rgba(16,24,42,.9))] max-[850px]:[grid-template-columns:1fr] max-[850px]:[gap:15px] max-[600px]:[margin-top:18px] max-[600px]:[padding:17px]"} aria-label="How to use the Entrepreneurship Hub">
            <div className={"hub-journey-intro [&_h2]:[font-family:'Space_Grotesk',sans-serif] [&_h2]:[font-size:17px] [&_h2]:[letter-spacing:-.35px] [&_p]:[margin-top:6px] [&_p]:[color:var(--muted)] [&_p]:[font-size:10px] [&_p]:[line-height:1.65]"}><span className={"section-kicker [display:block] [font-size:9px] [letter-spacing:1.4px] [color:var(--primary)] [font-weight:700] [margin-bottom:7px]"}>IDEA TO ACTION</span><h2>Build a business mindset</h2><p>Explore practical foundations for turning useful ideas into small, thoughtful experiments.</p></div>
            <div className={"hub-journey-grid [display:grid] [grid-template-columns:repeat(3,minmax(0,1fr))] [gap:9px] [&_article]:[display:flex] [&_article]:[min-width:0] [&_article]:[gap:10px] [&_article]:[padding:12px] [&_article]:[border:1px_solid_rgba(255,255,255,.07)] [&_article]:[border-radius:11px] [&_article]:[background:rgba(255,255,255,.025)] [&_article_strong]:[color:#f5f7ff] [&_article_strong]:[font-size:10px] [&_article_p]:[margin-top:4px] [&_article_p]:[color:#9ba9c2] [&_article_p]:[font-size:9px] [&_article_p]:[line-height:1.55] max-[600px]:[grid-template-columns:1fr]"}>
              <article><span className={"hub-journey-number [display:grid] [width:27px] [height:27px] [flex:0_0_27px] [place-items:center] [border-radius:8px] [background:rgba(155,123,255,.16)] [color:#c7b8ff] [font-size:8px] [font-weight:800]"}>01</span><div><strong>Notice a need</strong><p>Look for everyday problems people want solved.</p></div></article>
              <article><span className={"hub-journey-number [display:grid] [width:27px] [height:27px] [flex:0_0_27px] [place-items:center] [border-radius:8px] [background:rgba(155,123,255,.16)] [color:#c7b8ff] [font-size:8px] [font-weight:800]"}>02</span><div><strong>Plan the basics</strong><p>Think about customers, costs, and what makes your idea useful.</p></div></article>
              <article><span className={"hub-journey-number [display:grid] [width:27px] [height:27px] [flex:0_0_27px] [place-items:center] [border-radius:8px] [background:rgba(155,123,255,.16)] [color:#c7b8ff] [font-size:8px] [font-weight:800]"}>03</span><div><strong>Try a small test</strong><p>Get feedback, learn from it, and improve your next step.</p></div></article>
            </div>
          </section>
          <section className={"section [margin-top:38px] max-[600px]:[margin-top:31px]"}>
            <div className={"section-heading [display:flex] [align-items:flex-end] [justify-content:space-between] [gap:18px] [margin-bottom:20px] [&_h2]:[font-family:'Space_Grotesk',_sans-serif] [&_h2]:[font-size:21px] [&_h2]:[letter-spacing:-.5px] [&_p]:[color:var(--muted)] [&_p]:[font-size:11px] [&_p]:[margin-top:6px] [&_h2]:[color:#f5f7ff] max-[600px]:[align-items:flex-start] max-[600px]:[flex-direction:column] max-[600px]:[&_h2]:[font-size:19px] max-[320px]:[&_h2]:[overflow-wrap:anywhere]"}>
              <div>
                <span className={"section-kicker [display:block] [font-size:9px] [letter-spacing:1.4px] [color:var(--primary)] [font-weight:700] [margin-bottom:7px]"}>GROWTH PATHS</span>
                <h2>Choose a business learning path</h2>
                <p>Explore a foundation, then use CEO JACK AI to plan a beginner-friendly activity.</p>
              </div>
            </div>
            <div className={"subject-grid [display:grid] [grid-template-columns:repeat(4,_minmax(0,_1fr))] [gap:13px] max-[1150px]:[grid-template-columns:repeat(3,_minmax(0,_1fr))] max-[600px]:[grid-template-columns:repeat(2,_minmax(0,_1fr))] max-[600px]:[gap:9px] max-[1024px]:[grid-template-columns:repeat(3,_minmax(0,_1fr))] max-[768px]:[grid-template-columns:repeat(2,_minmax(0,_1fr))] max-[320px]:[grid-template-columns:minmax(0,_1fr)]"}>
              {entrepreneurshipTracks.map((track) => (
                <Link key={track.name} href={`/ai?prompt=${encodeURIComponent(`Help me explore ${track.name}. ${track.description} Give me a practical beginner activity and clear next steps.`)}`} className={"subject-card track-link [background:linear-gradient(145deg,rgba(20,30,52,.94),rgba(15,24,42,.96))] [border:1px_solid_var(--border)] [border-radius:13px] [padding:17px] [min-height:153px] [transition:.2s] [box-shadow:0_4px_16px_rgba(25,40,75,.025)] [&:hover]:[transform:translateY(-3px)] [&:hover]:[border-color:rgba(155,123,255,.38)] [&:hover]:[box-shadow:var(--shadow)] [&_h3]:[font-size:12px] [&_h3]:[margin-bottom:6px] [&_p]:[color:var(--muted)] [&_p]:[font-size:10px] [&_p]:[line-height:1.6] [&_p]:[min-height:32px] [&_h3]:[color:#f5f7ff] max-[600px]:[min-height:148px] max-[600px]:[padding:13px] max-[600px]:[&_h3]:[font-size:11px] max-[600px]:[&_p]:[font-size:9px] [display:flex] [flex-direction:column] [align-items:flex-start] [color:inherit]"}>
                  <div className={"subject-icon [width:39px] [height:39px] [border-radius:11px] [display:grid] [place-items:center] [font-size:19px] [margin-bottom:15px]"}>{track.icon}</div>
                  <h3>{track.name}</h3>
                  <p>{track.description}</p>
                  <span className={"track-action [display:flex] [align-items:center] [gap:7px] [margin-top:auto] [padding-top:8px] [color:var(--primary)] [font-size:11px] [font-weight:700] [&_span]:[transform:translateX(3px)] [&_span]:[transition:transform_180ms_ease]"}>Explore this path <span aria-hidden="true">→</span></span>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
    <SiteFooter />
    </>
  );
}
