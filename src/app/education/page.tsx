"use client";

import Link from "next/link";
import { SiteFooter } from "@/src/components/footer";
import { SiteLogoMark } from "@/src/components/site-logo-mark";
import { useEffect, useMemo, useState } from "react";
import {
  AcademicLevel,
  classes,
  getClassLearningTasks,
  getClassLabel,
  primarySubjects,
  secondarySubjects,
} from "@/src/utils/education-data";

export default function EducationPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [level, setLevel] = useState<AcademicLevel>("primary");
  const [selectedClass, setSelectedClass] = useState("P1");
  const [query, setQuery] = useState("");
  const [toast, setToast] = useState("");

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const params = new URLSearchParams(window.location.search);
      const requestedLevel: AcademicLevel = params.get("level") === "secondary" ? "secondary" : "primary";
      const requestedClass = params.get("class");
      const savedLevel = window.localStorage.getItem("ceojack-education-level");
      const savedClass = window.localStorage.getItem("ceojack-education-class");
      const initialLevel = requestedClass ? requestedLevel : savedLevel === "secondary" ? "secondary" : requestedLevel;
      setLevel(initialLevel);
      setSelectedClass(classes[initialLevel][0].value);
      if (!requestedClass && savedClass && classes[initialLevel].some((item) => item.value === savedClass)) {
        setSelectedClass(savedClass);
      }
      if (requestedClass) {
        const match = classes[requestedLevel].find((item) => item.value === requestedClass || item.label === requestedClass);
        if (match) {
          setSelectedClass(match.value);
          window.localStorage.setItem("ceojack-education-level", requestedLevel);
          window.localStorage.setItem("ceojack-education-class", match.value);
        }
      }
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const subjects = useMemo(() => {
    const source = level === "primary" ? primarySubjects : secondarySubjects;
    const term = query.trim().toLowerCase();
    return source.filter(
      (subject) =>
        subject.name.toLowerCase().includes(term) ||
        subject.description.toLowerCase().includes(term)
    );
  }, [level, query]);

  const learningTasks = useMemo(() => getClassLearningTasks(selectedClass), [selectedClass]);

  function selectClass(className: string) {
    setSelectedClass(className);
    window.localStorage.setItem("ceojack-education-level", level);
    window.localStorage.setItem("ceojack-education-class", className);
    setToast(`${getClassLabel(className)} selected successfully.`);
    window.setTimeout(() => setToast(""), 2800);
  }

  function switchLevel(nextLevel: AcademicLevel) {
    setLevel(nextLevel);
    setSelectedClass(classes[nextLevel][0].value);
    window.localStorage.setItem("ceojack-education-level", nextLevel);
    window.localStorage.setItem("ceojack-education-class", classes[nextLevel][0].value);
    setQuery("");
  }

  return (
    <>
    <div className={"app [min-height:100vh] [display:flex] max-[768px]:[max-width:100%] max-[768px]:[min-width:0] max-[768px]:[overflow-x:clip]"}>
      <aside className={(`sidebar [width:255px] [min-height:100vh] [background:rgba(9,15,30,.97)] [color:white] [padding:28px_17px_20px] [border-right:1px_solid_rgba(255,255,255,.05)] [backdrop-filter:blur(18px)] [display:flex] [flex-direction:column] [flex-shrink:0] [position:fixed] [inset:0_auto_0_0] [z-index:30] [overflow-y:auto] max-[850px]:[transform:translateX(-100%)] max-[850px]:[transition:transform_.25s_ease]${sidebarOpen ? "open max-[850px]:[transform:translateX(0)]" : ""}`)} id="sidebar">
        <Link href="/" className={"brand [display:flex] [align-items:center] [gap:11px] [padding:0_7px] [color:white] [margin-bottom:43px]"}>
          <SiteLogoMark className={"brand-icon [width:42px] [height:42px] [object-fit:cover] [border-radius:13px] [display:grid] [place-items:center] [background:linear-gradient(135deg,_#6385ff,_#9b7bff)] [font-family:'Space_Grotesk',_sans-serif] [font-weight:700]"} width={84} height={84} alt="CEO JACK Learning Hub logo" />
          <div className={"brand-copy [&_strong]:[display:block] [&_strong]:[font-size:13px] [&_strong]:[letter-spacing:.5px] [&_span]:[display:block] [&_span]:[font-size:9px] [&_span]:[letter-spacing:1.4px] [&_span]:[color:#9caac1] [&_span]:[margin-top:4px]"}>
            <strong>CEO JACK</strong>
            <span>LEARNING HUB</span>
          </div>
        </Link>
        <div className={"sidebar-label [color:#73829d] [font-size:9px] [letter-spacing:1.5px] [font-weight:700] [padding:0_12px] [margin-bottom:12px]"}>LEARNING SPACE</div>
        <nav className={"navigation [display:grid] [gap:5px]"}>
          <Link href="/dashboard" className={"nav-link [min-height:44px] [display:flex] [align-items:center] [gap:12px] [padding:0_12px] [border-radius:10px] [color:#aebbd0] [font-size:12px] [transition:.2s] [&:hover]:[background:rgba(255,255,255,.07)] [&:hover]:[color:white]"}><span className={"nav-icon [width:20px] [text-align:center] [color:#9b7bff] [font-size:16px]"}>⌂</span>Dashboard</Link>
          <Link href="/education" className={"nav-link active [min-height:44px] [display:flex] [align-items:center] [gap:12px] [padding:0_12px] [border-radius:10px] [color:#fff] [font-size:12px] [transition:.2s] [&:hover]:[background:rgba(255,255,255,.07)] [&:hover]:[color:white] [border:1.5px_solid_var(--primary)] [background:rgba(155,123,255,.14)] [box-shadow:none] [border-color:rgba(155,123,255,.45)]"}><span className={"nav-icon [width:20px] [text-align:center] [color:#9b7bff] [font-size:16px]"}>▤</span>Education Hub</Link>
          <Link href="/digital-skills" className={"nav-link [min-height:44px] [display:flex] [align-items:center] [gap:12px] [padding:0_12px] [border-radius:10px] [color:#aebbd0] [font-size:12px] [transition:.2s] [&:hover]:[background:rgba(255,255,255,.07)] [&:hover]:[color:white]"}><span className={"nav-icon [width:20px] [text-align:center] [color:#9b7bff] [font-size:16px]"}>&lt;/&gt;</span>Digital Skills</Link>
          <Link href="/entrepreneurship" className={"nav-link [min-height:44px] [display:flex] [align-items:center] [gap:12px] [padding:0_12px] [border-radius:10px] [color:#aebbd0] [font-size:12px] [transition:.2s] [&:hover]:[background:rgba(255,255,255,.07)] [&:hover]:[color:white]"}><span className={"nav-icon [width:20px] [text-align:center] [color:#9b7bff] [font-size:16px]"}>◈</span>Entrepreneurship</Link>
          <Link href="/ai" className={"nav-link [min-height:44px] [display:flex] [align-items:center] [gap:12px] [padding:0_12px] [border-radius:10px] [color:#aebbd0] [font-size:12px] [transition:.2s] [&:hover]:[background:rgba(255,255,255,.07)] [&:hover]:[color:white]"}><span className={"nav-icon [width:20px] [text-align:center] [color:#9b7bff] [font-size:16px]"}>✦</span>CEO JACK AI<span className={"ai-tag [margin-left:auto] [font-size:8px] [background:#2e6b65] [padding:4px_6px] [border-radius:5px] [color:white]"}>AI</span></Link>
        </nav>
        <div className={"sidebar-bottom [margin-top:auto] [padding-top:30px]"}>
          <div className={"upgrade-card [padding:16px] [border:1px_solid_rgba(255,255,255,.09)] [border-radius:13px] [background:linear-gradient(145deg,_#1c3042,_#10182a)] [&_strong]:[font-size:12px] [&_p]:[color:#9eacc3] [&_p]:[font-size:11px] [&_p]:[line-height:1.6] [&_p]:[margin:7px_0_12px] [&_a]:[color:#9b7bff] [&_a]:[font-size:11px] [&_a]:[font-weight:700]"}>
            <div className={"upgrade-icon [color:#9b7bff] [font-size:22px] [margin-bottom:10px]"}>✦</div>
            <strong>Keep growing</strong>
            <p>Build knowledge one lesson at a time.</p>
            <Link href="/ai">Explore AI Tutor →</Link>
          </div>
          <Link href="/dashboard" className={"back-link [display:block] [margin:22px_7px_0] [color:#9eacc3] [font-size:11px]"}>← Main Dashboard</Link>
        </div>
      </aside>
      {sidebarOpen ? <div className={"mobile-overlay show [display:none] [opacity:1] [transform:translate(-50%,_0)] max-[850px]:[display:block] max-[850px]:[position:fixed] max-[850px]:[inset:0] max-[850px]:[background:rgba(8,15,30,.55)] max-[850px]:[z-index:20]"} onClick={() => setSidebarOpen(false)} /> : null}

      <main className={"main [margin-left:255px] [width:calc(100%_-_255px)] [min-width:0] max-[850px]:[margin-left:0] max-[850px]:[width:100%] max-[768px]:[max-width:100%] max-[768px]:[min-width:0] max-[768px]:[overflow-x:clip]"}>
        <header className={"topbar [height:69px] [background:rgba(8,13,27,.83)] [border-bottom:1px_solid_var(--border)] [padding:0_38px] [display:flex] [align-items:center] [justify-content:space-between] [position:sticky] [top:0] [z-index:10] [backdrop-filter:blur(15px)] [&_h1]:[font-family:'Space_Grotesk',sans-serif] [&_h1]:[font-size:19px] [&_h1]:[letter-spacing:-.4px] [border-color:rgba(255,255,255,.06)] max-[850px]:[padding:0_22px] max-[600px]:[height:70px] max-[600px]:[padding:0_14px] max-[600px]:[&_h1]:[font-size:16px] max-[1024px]:[min-width:0] max-[768px]:[gap:10px] max-[320px]:[padding-inline:10px] max-[320px]:[&_h1]:[font-size:14px]"}>
          <div className={"topbar-left [display:flex] [align-items:center] [gap:15px] max-[768px]:[min-width:0] max-[320px]:[gap:7px]"}>
            <button className={"menu-btn [display:none] [border:0] [background:transparent] [font-size:23px] [color:var(--text)] max-[850px]:[display:block] max-[320px]:[flex:0_0_30px] max-[320px]:[width:30px] max-[320px]:[padding:0]"} type="button" aria-label="Open navigation" onClick={() => setSidebarOpen(true)}>☰</button>
            <div>
              <div className={"breadcrumb [font-size:10px] [color:var(--muted)] [margin-bottom:5px] max-[600px]:[font-size:9px] max-[320px]:[font-size:8px]"}>Learning Space / Education</div>
              <h1>Education Hub</h1>
            </div>
          </div>
          <div className={"topbar-right [display:flex] [align-items:center] [gap:15px] max-[768px]:[min-width:0]"}>
            <Link href="/ai" className={"ai-top-button [display:flex] [align-items:center] [gap:8px] [padding:10px_15px] [border-radius:9px] [color:#d2c8ff] [background:rgba(155,123,255,.08)] [font-size:11px] [font-weight:700] [&_span:first-child]:[font-size:16px] [border:1px_solid_rgba(155,123,255,.24)] max-[600px]:[padding:9px] max-[600px]:[&_span:last-child]:[display:none]"}><span>✦</span><span>Ask AI</span></Link>
          </div>
        </header>

        <div className={"page-content [width:100%] [max-width:1450px] [margin:0_auto] [padding:31px_38px_25px] max-[850px]:[padding:25px_22px] max-[600px]:[padding:18px_14px] max-[1024px]:[min-width:0] max-[768px]:[padding:20px_18px] max-[320px]:[padding:16px_12px]"}>
          <section className={"hero [min-height:290px] [border-radius:19px] [background:radial-gradient(circle_at_80%_15%,_rgba(116,101,244,.35),_transparent_30%),_linear-gradient(115deg,_#1d3044,_#254653_60%,_#34656a)] [color:white] [position:relative] [overflow:hidden] [display:flex] [align-items:center] [padding:37px_44px] [&_h2]:[font-family:'Space_Grotesk',_sans-serif] [&_h2]:[font-size:clamp(31px,_4vw,_45px)] [&_h2]:[letter-spacing:-1.7px] [&_h2]:[line-height:1.1] [&_h2_span]:[color:#9b7bff] max-[600px]:[min-height:320px] max-[600px]:[padding:27px_22px] max-[600px]:[align-items:flex-start] max-[600px]:[&_h2]:[font-size:35px] max-[768px]:[padding-inline:28px] max-[320px]:[min-height:300px] max-[320px]:[padding:22px_16px] max-[320px]:[&_h2]:[font-size:30px]"}>
            <div className={"hero-content [position:relative] [z-index:2] [max-width:530px] [&_>_p]:[max-width:440px] [&_>_p]:[color:#c0c9dd] [&_>_p]:[font-size:12px] [&_>_p]:[line-height:1.8] [&_>_p]:[margin:14px_0_22px] max-[600px]:[max-width:100%] max-[600px]:[&_>_p]:[max-width:300px] max-[600px]:[&_>_p]:[font-size:11px] max-[320px]:[&_>_p]:[max-width:100%]"}>
              <div className={"hero-label [display:flex] [align-items:center] [gap:8px] [font-size:9px] [letter-spacing:1.7px] [font-weight:700] [color:#c0a3ff] [margin-bottom:17px]"}><span className={"hero-dot [width:7px] [height:7px] [background:#6de0b3] [border-radius:50%]"} />YOUR ACADEMIC JOURNEY</div>
              <h2>Learn today.<br /><span>Lead tomorrow.</span></h2>
              <p>Discover lessons, strengthen your understanding, and build the knowledge that shapes your future.</p>
              <a href="#classSection" className={"hero-button [display:inline-flex] [align-items:center] [gap:19px] [padding:12px_17px] [border-radius:9px] [color:#30286e] [background:white] [font-size:11px] [font-weight:700] [transition:.2s] [&:hover]:[transform:translateY(-2px)]"}>Explore my classes <span>→</span></a>
            </div>
            <div className={"hero-visual [position:absolute] [width:340px] [height:290px] [right:7%] [top:0] [display:grid] [place-items:center] max-[1150px]:[right:0] max-[1150px]:[opacity:.8] max-[600px]:[width:150px] max-[600px]:[height:130px] max-[600px]:[top:auto] max-[600px]:[bottom:0] max-[600px]:[right:-5px] max-[600px]:[opacity:.5] max-[768px]:[max-width:48%] max-[320px]:[max-width:44%] max-[320px]:[opacity:.35]"} aria-hidden="true">
              <div className={"orbit orbit-one [position:absolute] [border:1px_solid_rgba(190,183,255,.2)] [border-radius:50%] [transform:rotate(-24deg)] [width:260px] [height:160px] max-[600px]:[width:120px] max-[600px]:[height:75px]"} />
              <div className={"orbit orbit-two [position:absolute] [border:1px_solid_rgba(190,183,255,.2)] [border-radius:50%] [transform:rotate(-24deg)] [width:210px] [height:250px] max-[600px]:[width:100px] max-[600px]:[height:115px]"} />
              <div className={"hero-book [width:104px] [height:104px] [border-radius:30px] [display:grid] [place-items:center] [font-size:45px] [background:linear-gradient(145deg,_#6385ff,_#9b7bff)] [box-shadow:0_20px_55px_rgba(0,0,0,.25)] [transform:rotate(-8deg)] max-[600px]:[width:65px] max-[600px]:[height:65px] max-[600px]:[border-radius:19px] max-[600px]:[font-size:28px]"}>✦</div>
            </div>
          </section>

          <section className={"hub-journey [display:grid] [grid-template-columns:minmax(190px,.8fr)_minmax(0,2fr)] [align-items:center] [gap:24px] [margin-top:24px] [padding:21px_23px] [border:1px_solid_rgba(255,255,255,.09)] [border-radius:16px] [background:linear-gradient(115deg,rgba(20,30,52,.96),rgba(16,24,42,.9))] max-[850px]:[grid-template-columns:1fr] max-[850px]:[gap:15px] max-[600px]:[margin-top:18px] max-[600px]:[padding:17px]"} aria-label="How to use the Education Hub">
            <div className={"hub-journey-intro [&_h2]:[font-family:'Space_Grotesk',sans-serif] [&_h2]:[font-size:17px] [&_h2]:[letter-spacing:-.35px] [&_p]:[margin-top:6px] [&_p]:[color:var(--muted)] [&_p]:[font-size:10px] [&_p]:[line-height:1.65]"}><span className={"section-kicker [display:block] [font-size:9px] [letter-spacing:1.4px] [color:var(--primary)] [font-weight:700] [margin-bottom:7px]"}>A CLEAR PATH FORWARD</span><h2>Learn one step at a time</h2><p>Your class guides the subjects and practice activities you see.</p></div>
            <div className={"hub-journey-grid [display:grid] [grid-template-columns:repeat(3,minmax(0,1fr))] [gap:9px] [&_article]:[display:flex] [&_article]:[min-width:0] [&_article]:[gap:10px] [&_article]:[padding:12px] [&_article]:[border:1px_solid_rgba(255,255,255,.07)] [&_article]:[border-radius:11px] [&_article]:[background:rgba(255,255,255,.025)] [&_article_strong]:[color:#f5f7ff] [&_article_strong]:[font-size:10px] [&_article_p]:[margin-top:4px] [&_article_p]:[color:#9ba9c2] [&_article_p]:[font-size:9px] [&_article_p]:[line-height:1.55] max-[600px]:[grid-template-columns:1fr]"}>
              <article><span className={"hub-journey-number [display:grid] [width:27px] [height:27px] [flex:0_0_27px] [place-items:center] [border-radius:8px] [background:rgba(155,123,255,.16)] [color:#c7b8ff] [font-size:8px] [font-weight:800]"}>01</span><div><strong>Choose your class</strong><p>Set your school section and current class.</p></div></article>
              <article><span className={"hub-journey-number [display:grid] [width:27px] [height:27px] [flex:0_0_27px] [place-items:center] [border-radius:8px] [background:rgba(155,123,255,.16)] [color:#c7b8ff] [font-size:8px] [font-weight:800]"}>02</span><div><strong>Pick a guided task</strong><p>Start with a short activity made for your level.</p></div></article>
              <article><span className={"hub-journey-number [display:grid] [width:27px] [height:27px] [flex:0_0_27px] [place-items:center] [border-radius:8px] [background:rgba(155,123,255,.16)] [color:#c7b8ff] [font-size:8px] [font-weight:800]"}>03</span><div><strong>Practice a subject</strong><p>Build confidence with clear, step-by-step help.</p></div></article>
            </div>
          </section>

          <section className={"section [margin-top:38px] max-[600px]:[margin-top:31px]"} id="classSection">
            <div className={"section-heading [display:flex] [align-items:flex-end] [justify-content:space-between] [gap:18px] [margin-bottom:20px] [&_h2]:[font-family:'Space_Grotesk',_sans-serif] [&_h2]:[font-size:21px] [&_h2]:[letter-spacing:-.5px] [&_p]:[color:var(--muted)] [&_p]:[font-size:11px] [&_p]:[margin-top:6px] [&_h2]:[color:#f5f7ff] max-[600px]:[align-items:flex-start] max-[600px]:[flex-direction:column] max-[600px]:[&_h2]:[font-size:19px] max-[320px]:[&_h2]:[overflow-wrap:anywhere]"}>
              <div>
                <span className={"section-kicker [display:block] [font-size:9px] [letter-spacing:1.4px] [color:var(--primary)] [font-weight:700] [margin-bottom:7px]"}>PERSONALIZE YOUR LEARNING</span>
                <h2>Choose your school section</h2>
                <p>Choose a school section, then select your class to discover relevant subjects.</p>
              </div>
              <div className={"level-switch [display:flex] [gap:4px] [background:rgba(255,255,255,.055)] [padding:4px] [border-radius:9px] [border:1px_solid_var(--border)] max-[600px]:[width:100%]"}>
                <button className={(`level-tab [border:0] [border-radius:7px] [background:transparent] [color:#a7b1c7] [padding:9px_14px] [font-size:10px] [font-weight:600] max-[600px]:[flex:1] max-[320px]:[padding-inline:7px]${level === "primary" ? "active [border:1.5px_solid_var(--primary)] [background:rgba(155,123,255,.14)] [color:#fff] [box-shadow:none] [border-color:rgba(155,123,255,.45)]" : ""}`)} type="button" onClick={() => switchLevel("primary")}>Primary School</button>
                <button className={(`level-tab [border:0] [border-radius:7px] [background:transparent] [color:#a7b1c7] [padding:9px_14px] [font-size:10px] [font-weight:600] max-[600px]:[flex:1] max-[320px]:[padding-inline:7px]${level === "secondary" ? "active [border:1.5px_solid_var(--primary)] [background:rgba(155,123,255,.14)] [color:#fff] [box-shadow:none] [border-color:rgba(155,123,255,.45)]" : ""}`)} type="button" onClick={() => switchLevel("secondary")}>Secondary School</button>
              </div>
            </div>
            <div className={"class-grid [display:grid] [grid-template-columns:repeat(7,_minmax(0,_1fr))] [gap:10px] max-[1150px]:[grid-template-columns:repeat(4,_minmax(0,_1fr))] max-[600px]:[grid-template-columns:repeat(4,_minmax(0,_1fr))] max-[600px]:[gap:8px] max-[1024px]:[grid-template-columns:repeat(4,_minmax(0,_1fr))] max-[768px]:[grid-template-columns:repeat(4,_minmax(0,_1fr))] max-[320px]:[grid-template-columns:repeat(3,_minmax(0,_1fr))] max-[320px]:[gap:7px]"}>
              {classes[level].map((classOption) => (
                <button
                  key={classOption.value}
                  className={(`class-card [border:1px_solid_var(--border)] [border-radius:12px] [background:linear-gradient(145deg,rgba(20,30,52,.94),rgba(15,24,42,.96))] [min-height:94px] [padding:14px_8px] [text-align:center] [transition:.2s] [box-shadow:0_4px_15px_rgba(25,40,75,.02)] [&:hover]:[transform:translateY(-3px)] [&:hover]:[border-color:rgba(155,123,255,.38)] [&_strong]:[display:block] [&_strong]:[font-family:'Space_Grotesk',_sans-serif] [&_strong]:[font-size:clamp(11px,_1.05vw,_15px)] [&_strong]:[line-height:1.25] [&_strong]:[color:#f5f7ff] [&_span]:[display:block] [&_span]:[font-size:9px] [&_span]:[color:var(--muted)] [&_span]:[margin-top:6px] max-[600px]:[min-height:77px] max-[600px]:[padding:12px_4px] max-[600px]:[&_strong]:[font-size:12px] max-[600px]:[&_span]:[font-size:8px] max-[320px]:[padding-inline:3px] max-[320px]:[&_span]:[font-size:7px]${selectedClass === classOption.value ? "active [border:1.5px_solid_var(--primary)] [background:rgba(155,123,255,.14)] [color:#fff] [box-shadow:none] [border-color:rgba(155,123,255,.45)]" : ""}`)}
                  type="button"
                  aria-pressed={selectedClass === classOption.value}
                  onClick={() => selectClass(classOption.value)}
                >
                  <strong>{classOption.label}</strong>
                  <span>{classOption.group}</span>
                </button>
              ))}
            </div>
          </section>

          <section className={"section [margin-top:38px] max-[600px]:[margin-top:31px]"} aria-labelledby="class-tasks-title">
            <div className={"section-heading [display:flex] [align-items:flex-end] [justify-content:space-between] [gap:18px] [margin-bottom:20px] [&_h2]:[font-family:'Space_Grotesk',_sans-serif] [&_h2]:[font-size:21px] [&_h2]:[letter-spacing:-.5px] [&_p]:[color:var(--muted)] [&_p]:[font-size:11px] [&_p]:[margin-top:6px] [&_h2]:[color:#f5f7ff] max-[600px]:[align-items:flex-start] max-[600px]:[flex-direction:column] max-[600px]:[&_h2]:[font-size:19px] max-[320px]:[&_h2]:[overflow-wrap:anywhere]"}>
              <div>
                <span className={"section-kicker [display:block] [font-size:9px] [letter-spacing:1.4px] [color:var(--primary)] [font-weight:700] [margin-bottom:7px]"}>YOUR NEXT STEPS · {getClassLabel(selectedClass).toUpperCase()}</span>
                <h2 id="class-tasks-title">Tasks for {getClassLabel(selectedClass)}</h2>
                <p>Choose a task to continue learning at your class level. Your class selection is remembered on this device.</p>
              </div>
            </div>
            <div className={"learning-task-grid [display:grid] [grid-template-columns:repeat(3,_minmax(0,_1fr))] [gap:14px] max-[850px]:[grid-template-columns:repeat(2,_minmax(0,_1fr))] max-[560px]:[grid-template-columns:1fr]"}>
              {learningTasks.map((task) => (
                <article className={"learning-task-card [display:flex] [min-width:0] [min-height:190px] [flex-direction:column] [align-items:flex-start] [padding:20px] [border:1px_solid_var(--border)] [border-radius:14px] [background:linear-gradient(145deg,_rgba(20,30,52,.94),_rgba(15,24,42,.96))] [box-shadow:0_8px_24px_rgba(0,0,0,.12)] [&_h3]:[margin-top:10px] [&_h3]:[color:var(--text)] [&_h3]:[font-family:'Space_Grotesk',_sans-serif] [&_h3]:[font-size:16px] [&_h3]:[line-height:1.35] [&_p]:[margin-top:8px] [&_p]:[color:var(--muted)] [&_p]:[font-size:11px] [&_p]:[line-height:1.55]"} key={task.subject}>
                  <span className={"task-subject [color:#b9a8ff] [font-size:9px] [font-weight:800] [letter-spacing:1.2px] [text-transform:uppercase]"}>{task.subject}</span>
                  <h3>{task.title}</h3>
                  <p>Guided practice for {getClassLabel(selectedClass)}.</p>
                  <Link className={"task-continue [display:inline-flex] [align-items:center] [gap:7px] [margin-top:auto] [padding-top:16px] [color:#cfc3ff] [font-size:11px] [font-weight:700] [&_span]:[transition:transform_160ms_ease] [&:hover_span]:[transform:translateX(3px)]"} href={`/ai?mode=education&prompt=${encodeURIComponent(task.prompt)}`}>Continue learning <span aria-hidden="true">→</span></Link>
                </article>
              ))}
            </div>
          </section>

          <section className={"section [margin-top:38px] max-[600px]:[margin-top:31px]"} id="subjectsSection">
            <div className={"section-heading [display:flex] [align-items:flex-end] [justify-content:space-between] [gap:18px] [margin-bottom:20px] [&_h2]:[font-family:'Space_Grotesk',_sans-serif] [&_h2]:[font-size:21px] [&_h2]:[letter-spacing:-.5px] [&_p]:[color:var(--muted)] [&_p]:[font-size:11px] [&_p]:[margin-top:6px] [&_h2]:[color:#f5f7ff] max-[600px]:[align-items:flex-start] max-[600px]:[flex-direction:column] max-[600px]:[&_h2]:[font-size:19px] max-[320px]:[&_h2]:[overflow-wrap:anywhere]"}>
              <div>
                <span className={"section-kicker [display:block] [font-size:9px] [letter-spacing:1.4px] [color:var(--primary)] [font-weight:700] [margin-bottom:7px]"}>DISCOVER KNOWLEDGE</span>
                <h2>Explore subjects</h2>
                <p>Explore subjects for {getClassLabel(selectedClass)}.</p>
              </div>
              <label className={"search-box [width:220px] [display:flex] [align-items:center] [gap:9px] [background:linear-gradient(145deg,rgba(20,30,52,.94),rgba(15,24,42,.96))] [border:1px_solid_var(--border)] [border-radius:9px] [padding:10px_12px] [color:var(--muted)] [&_span]:[font-size:19px] [&_input]:[width:100%] [&_input]:[min-width:0] [&_input]:[border:0] [&_input]:[outline:0] [&_input]:[background:transparent] [&_input]:[font-size:10px] [&_input]:[color:#f5f7ff] max-[600px]:[width:100%]"}>
                <span>⌕</span>
                <input type="search" placeholder="Search subjects..." value={query} onChange={(event) => setQuery(event.target.value)} />
              </label>
            </div>
            <div className={"subject-grid [display:grid] [grid-template-columns:repeat(4,_minmax(0,_1fr))] [gap:13px] max-[1150px]:[grid-template-columns:repeat(3,_minmax(0,_1fr))] max-[600px]:[grid-template-columns:repeat(2,_minmax(0,_1fr))] max-[600px]:[gap:9px] max-[1024px]:[grid-template-columns:repeat(3,_minmax(0,_1fr))] max-[768px]:[grid-template-columns:repeat(2,_minmax(0,_1fr))] max-[320px]:[grid-template-columns:minmax(0,_1fr)]"}>
              {subjects.map((subject) => (
                <Link
                  key={subject.name}
                  href={`/subject?name=${encodeURIComponent(subject.name)}&class=${encodeURIComponent(selectedClass)}&level=${level}`}
                  className={"subject-card [background:linear-gradient(145deg,rgba(20,30,52,.94),rgba(15,24,42,.96))] [border:1px_solid_var(--border)] [border-radius:13px] [padding:17px] [min-height:153px] [transition:.2s] [box-shadow:0_4px_16px_rgba(25,40,75,.025)] [&:hover]:[transform:translateY(-3px)] [&:hover]:[border-color:rgba(155,123,255,.38)] [&:hover]:[box-shadow:var(--shadow)] [&_h3]:[font-size:12px] [&_h3]:[margin-bottom:6px] [&_p]:[color:var(--muted)] [&_p]:[font-size:10px] [&_p]:[line-height:1.6] [&_p]:[min-height:32px] [&_h3]:[color:#f5f7ff] max-[600px]:[min-height:148px] max-[600px]:[padding:13px] max-[600px]:[&_h3]:[font-size:11px] max-[600px]:[&_p]:[font-size:9px]"}
                >
                  <div className={"subject-icon [width:39px] [height:39px] [border-radius:11px] [display:grid] [place-items:center] [font-size:19px] [margin-bottom:15px]"} style={{ backgroundColor: subject.color, color: subject.iconColor }}>
                    {subject.icon}
                  </div>
                  <h3>{subject.name}</h3>
                  <p>{subject.description}</p>
                </Link>
              ))}
            </div>
            {subjects.length === 0 ? (
              <div className={"empty-state [text-align:center] [padding:45px_15px] [color:var(--muted)] [&_>_span]:[font-size:30px] [&_h3]:[color:var(--text)] [&_h3]:[font-size:15px] [&_h3]:[margin:10px_0_5px] [&_p]:[font-size:11px]"}>
                <span>⌕</span>
                <h3>No subjects found</h3>
                <p>Try another search term.</p>
              </div>
            ) : null}
          </section>

          <section className={"ai-banner [display:flex] [align-items:center] [gap:17px] [margin-top:42px] [padding:23px] [border-radius:15px] [background:linear-gradient(105deg,_#f5ecd9,_#eef4f1)] [border:1px_solid_#e9e2d6] max-[600px]:[flex-wrap:wrap] max-[600px]:[padding:17px] max-[600px]:[gap:12px] max-[1024px]:[min-width:0] max-[768px]:[flex-wrap:wrap] max-[320px]:[padding:13px]"}>
            <div className={"ai-banner-icon [width:49px] [height:49px] [flex-shrink:0] [border-radius:14px] [display:grid] [place-items:center] [background:linear-gradient(135deg,_#6385ff,_#9b7bff)] [color:white] [font-size:25px]"}>✦</div>
            <div className={"ai-banner-copy [flex:1] [&_>_span]:[color:var(--primary)] [&_>_span]:[font-size:8px] [&_>_span]:[letter-spacing:1.2px] [&_>_span]:[font-weight:700] [&_h2]:[font-family:'Space_Grotesk',_sans-serif] [&_h2]:[font-size:16px] [&_h2]:[margin:5px_0] [&_p]:[color:#727f97] [&_p]:[font-size:10px] [&_p]:[line-height:1.6] max-[600px]:[width:calc(100%_-_62px)] max-[600px]:[flex:none]"}>
              <span>YOUR PERSONAL LEARNING COMPANION</span>
              <h2>Confused about a topic?</h2>
              <p>Ask CEO JACK AI to explain difficult concepts, provide examples, and help you practice.</p>
            </div>
            <Link href="/ai" className={"ai-banner-button [background:var(--primary)] [color:white] [padding:12px_15px] [border-radius:9px] [font-size:10px] [font-weight:700] [white-space:nowrap] max-[600px]:[width:100%] max-[600px]:[text-align:center]"}>Ask CEO JACK AI →</Link>
          </section>
        </div>
      </main>
      <div className={(`toast [position:fixed] [left:50%] [bottom:25px] [transform:translate(-50%,_20px)] [opacity:0] [pointer-events:none] [padding:12px_17px] [border-radius:9px] [background:#263449] [color:white] [font-size:11px] [box-shadow:0_10px_30px_rgba(0,0,0,.2)] [transition:.25s] [z-index:100] [text-align:center] [max-width:calc(100%_-_30px)]${toast ? "show [opacity:1] [transform:translate(-50%,_0)] max-[850px]:[display:block] max-[850px]:[position:fixed] max-[850px]:[inset:0] max-[850px]:[background:rgba(8,15,30,.55)] max-[850px]:[z-index:20]" : ""}`)} role="status">{toast}</div>
    </div>
      <SiteFooter />
    </>
  );
}
