"use client";

import Link from "next/link";
import { SiteLogoMark } from "@/src/components/site-logo-mark";
import { SiteFooter } from "@/src/components/footer";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { getClassLabel } from "@/src/utils/education-data";

function SubjectContent() {
  const params = useSearchParams();
  const name = params.get("name") || "Mathematics";
  const className = params.get("class") || "P1";
  const level = params.get("level") || (className.startsWith("S") ? "secondary" : "primary");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      {sidebarOpen ? <div className={"sidebar-overlay show max-[850px]:[position:fixed] max-[850px]:[inset:0] max-[850px]:[background:rgba(0,0,0,0.35)] max-[850px]:[z-index:900] max-[850px]:[display:block] [transform:translateY(0)] [opacity:1]"} onClick={() => setSidebarOpen(false)} /> : null}
      <aside className={(`sidebar [position:fixed] [left:0] [top:0] [width:260px] [height:100vh] [background:var(--sidebar)] [color:white] [padding:24px_16px] [display:flex] [flex-direction:column] [z-index:1000] max-[850px]:[transform:translateX(-100%)] max-[850px]:[transition:transform_0.25s_ease]${sidebarOpen ? "open max-[850px]:[transform:translateX(0)]" : ""}`)}>
        <div className={"brand [display:flex] [align-items:center] [gap:12px] [padding:0_10px_28px]"}>
          <SiteLogoMark className={"brand-logo [width:42px] [height:42px] [object-fit:cover] [display:grid] [place-items:center] [background:linear-gradient(_135deg,_#6385ff,_#2e6b65_)] [border-radius:12px] [font-family:\"Space_Grotesk\",_sans-serif] [font-weight:700]"} width={84} height={84} alt="CEO JACK Learning Hub logo" />
          <div className={"brand-text [&_h2]:[font-family:\"Space_Grotesk\",_sans-serif] [&_h2]:[font-size:15px] [&_span]:[display:block] [&_span]:[color:#8894aa] [&_span]:[font-size:9px] [&_span]:[letter-spacing:1.4px] [&_span]:[margin-top:3px]"}>
            <h2>CEO JACK</h2>
            <span>LEARNING HUB</span>
          </div>
        </div>
        <nav className={"sidebar-nav [flex:1] [overflow-y:auto]"}>
          <div className={"nav-section [margin-bottom:28px]"}>
            <span className={"nav-label [display:block] [padding:0_12px] [margin-bottom:10px] [color:#68758d] [font-size:10px] [font-weight:700] [letter-spacing:1.4px]"}>MAIN</span>
            <Link href="/dashboard" className={"nav-item [display:flex] [align-items:center] [gap:12px] [padding:11px_12px] [margin-bottom:4px] [color:#aeb8ca] [border-radius:10px] [font-size:14px] [transition:0.2s_ease] [&:hover]:[background:var(--sidebar-soft)] [&:hover]:[color:white]"}><span className={"nav-icon [width:22px] [text-align:center] [font-size:16px]"}>⌂</span><span>Dashboard</span></Link>
            <Link href="/education" className={"nav-item active [display:flex] [align-items:center] [gap:12px] [padding:11px_12px] [margin-bottom:4px] [color:white] [border-radius:10px] [font-size:14px] [transition:0.2s_ease] [&:hover]:[background:var(--sidebar-soft)] [&:hover]:[color:white] [background:rgba(101,_88,_223,_0.18)]"}><span className={"nav-icon [width:22px] [text-align:center] [font-size:16px]"}>🎓</span><span>Education Hub</span></Link>
            <Link href="/digital-skills" className={"nav-item [display:flex] [align-items:center] [gap:12px] [padding:11px_12px] [margin-bottom:4px] [color:#aeb8ca] [border-radius:10px] [font-size:14px] [transition:0.2s_ease] [&:hover]:[background:var(--sidebar-soft)] [&:hover]:[color:white]"}><span className={"nav-icon [width:22px] [text-align:center] [font-size:16px]"}>💻</span><span>Digital Skills</span></Link>
            <Link href="/entrepreneurship" className={"nav-item [display:flex] [align-items:center] [gap:12px] [padding:11px_12px] [margin-bottom:4px] [color:#aeb8ca] [border-radius:10px] [font-size:14px] [transition:0.2s_ease] [&:hover]:[background:var(--sidebar-soft)] [&:hover]:[color:white]"}><span className={"nav-icon [width:22px] [text-align:center] [font-size:16px]"}>🚀</span><span>Entrepreneurship</span></Link>
            <Link href="/ai" className={"nav-item [display:flex] [align-items:center] [gap:12px] [padding:11px_12px] [margin-bottom:4px] [color:#aeb8ca] [border-radius:10px] [font-size:14px] [transition:0.2s_ease] [&:hover]:[background:var(--sidebar-soft)] [&:hover]:[color:white]"}><span className={"nav-icon [width:22px] [text-align:center] [font-size:16px]"}>✦</span><span>CEO JACK AI</span></Link>
          </div>
        </nav>
      </aside>
      <main className={"main-content [margin-left:260px] [min-height:100vh] max-[850px]:[margin-left:0]"}>
        <header className={"topbar [height:72px] [background:rgba(255,255,255,0.94)] [border-bottom:1px_solid_var(--border)] [display:flex] [align-items:center] [justify-content:space-between] [padding:0_32px] [position:sticky] [top:0] [z-index:100] max-[850px]:[padding:0_18px] max-[850px]:[gap:15px] max-[650px]:[height:64px]"}>
          <button className={"menu-btn [display:none] [background:transparent] [font-size:22px] [color:var(--text)] max-[850px]:[display:block]"} type="button" onClick={() => setSidebarOpen(true)}>☰</button>
          <div className={"topbar-left [display:flex] [align-items:center] max-[850px]:[flex:1]"}>
            <Link href={`/education?level=${encodeURIComponent(level)}&class=${encodeURIComponent(className)}`} className={"back-btn [background:transparent] [color:var(--muted)] [font-size:13px] [transition:0.2s] [&:hover]:[color:var(--primary)] max-[650px]:[font-size:11px]"}>← Back to {getClassLabel(className)} subjects</Link>
          </div>
        </header>
        <section className={"subject-hero [display:flex] [justify-content:space-between] [gap:30px] [padding:32px] [background:radial-gradient(_circle_at_90%_20%,_rgba(101,88,223,0.18),_transparent_30%_),_linear-gradient(_135deg,_#171f38,_#222e4d_)] [color:white] [border-radius:22px] [box-shadow:var(--shadow)] max-[1050px]:[flex-direction:column] max-[650px]:[padding:23px] max-[650px]:[border-radius:18px]"}>
          <div className={"hero-text [&_h1]:[font-family:\"Space_Grotesk\",_sans-serif] [&_h1]:[font-size:34px] [&_h1]:[line-height:1.15] [&_h1]:[margin-bottom:9px] [&_p]:[max-width:600px] [&_p]:[color:#b8c2d4] [&_p]:[font-size:14px] [&_p]:[line-height:1.7] max-[650px]:[&_h1]:[font-size:27px] max-[650px]:[&_p]:[font-size:12px]"}>
            <span className={"class-badge [display:inline-block] [padding:5px_10px] [background:rgba(255,255,255,0.1)] [border:1px_solid_rgba(255,255,255,0.1)] [border-radius:20px] [font-size:11px] [font-weight:700] [margin-bottom:9px]"}>{getClassLabel(className)} · SUBJECT</span>
            <h1>{name}</h1>
            <p>Start with the foundations, then practise and ask CEO JACK AI when you get stuck.</p>
            <div className={"hero-actions [display:flex] [flex-wrap:wrap] [gap:10px] [margin-top:22px] max-[650px]:[flex-direction:column]"}>
              {name === "Mathematics" && className === "P7" ? (
                <Link href="/lesson" className={"primary-btn [padding:11px_16px] [border-radius:10px] [font-size:13px] [font-weight:700] [transition:0.2s] [background:white] [color:var(--primary-dark)] [&:hover]:[transform:translateY(-1px)] max-[650px]:[width:100%]"}>Start the equivalent fractions lesson →</Link>
              ) : null}
              <Link href={`/ai?prompt=${encodeURIComponent(`Help me learn ${name} for ${getClassLabel(className)}.`)}`} className={(name === "Mathematics" && className === "P7" ? "secondary-btn [padding:11px_16px] [border-radius:10px] [font-size:13px] [font-weight:700] [transition:0.2s] [background:rgba(255,255,255,0.08)] [color:white] [border:1px_solid_rgba(255,255,255,0.12)] [&:hover]:[background:rgba(255,255,255,0.13)] max-[650px]:[width:100%]" : "primary-btn [padding:11px_16px] [border-radius:10px] [font-size:13px] [font-weight:700] [transition:0.2s] [background:white] [color:var(--primary-dark)] [&:hover]:[transform:translateY(-1px)] max-[650px]:[width:100%]")}>
                Ask CEO JACK AI →
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

export default function SubjectPage() {
  return (
    <Suspense fallback={<p>Loading subject…</p>}>
      <SubjectContent />
    </Suspense>
  );
}
