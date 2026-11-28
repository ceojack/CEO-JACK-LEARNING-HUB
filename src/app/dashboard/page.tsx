"use client";

import Link from "next/link";
import { UserAvatar } from "@/src/components/user-avatar";
import { SiteLogoMark } from "@/src/components/site-logo-mark";
import { SiteFooter } from "@/src/components/footer";
import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/src/utils/supabase/client";
import { switchToGoogleAccount } from "@/src/utils/supabase/google-account";
import { isSupabaseConfigured } from "@/src/utils/supabase/config";
import { LearnerActiveTimeCard } from "@/src/components/active-time";

type LearnerProfile = { displayName?: string; hobby?: string; level?: string; learningLevel?: string; ageGroup?: string; interests?: string[]; goals?: string[] };
type SignedInUser = { email?: string; fullName?: string; avatarUrl?: string };

const paths = [
  { title: "Education Hub", eyebrow: "BUILD YOUR FOUNDATION", description: "Explore school subjects, choose your class, and strengthen what you learn every day.", href: "/education", icon: "▤", tone: "violet", action: "Explore subjects" },
  { title: "Digital Skills", eyebrow: "MAKE WITH TECHNOLOGY", description: "Learn practical digital skills, from programming to creating your first website.", href: "/digital-skills", icon: "</>", tone: "blue", action: "Build digital skills" },
  { title: "Entrepreneurship", eyebrow: "TURN IDEAS INTO ACTION", description: "Develop your business thinking and take your next idea from plan to practice.", href: "/entrepreneurship", icon: "↗", tone: "green", action: "Explore business" },
  { title: "CEO JACK AI", eyebrow: "LEARN WITH A GUIDE", description: "Ask questions, get clear explanations, and practice at your own pace.", href: "/ai", icon: "✦", tone: "orange", action: "Ask your AI tutor" },
];

const lessonKey = "ceoJackLesson:p7-maths-equivalent-fractions";

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profile, setProfile] = useState<LearnerProfile | null>(null);
  const [signedInUser, setSignedInUser] = useState<SignedInUser | null>(null);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [switchingAccount, setSwitchingAccount] = useState(false);
  const [lessonComplete, setLessonComplete] = useState(false);
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [dashboardError, setDashboardError] = useState(false);
  const [loadAttempt, setLoadAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    async function loadLearningData() {
      if (!isSupabaseConfigured()) {
        try {
          const storedProfile = window.localStorage.getItem("ceoJackOnboarding");
          if (!cancelled && storedProfile) setProfile(JSON.parse(storedProfile) as LearnerProfile);
          if (!cancelled) setLessonComplete(window.localStorage.getItem(lessonKey) === "complete");
        } catch (error) {
          console.log("Could not read saved learning details:", error);
          if (!cancelled) setProfile(null);
        }
        if (!cancelled) setDashboardLoading(false);
        return;
      }

      try {
        const { error } = await createClient().auth.getSession();
        if (error) console.log("Could not confirm the shared Learning Hub session:", error);
      } catch (error) {
        console.log("Could not confirm the shared Learning Hub session:", error);
      }

      try {
        const savedProfile = window.localStorage.getItem("ceoJackOnboarding");
        if (!cancelled && savedProfile) setProfile(JSON.parse(savedProfile) as LearnerProfile);
      } catch (error) {
        console.log("Could not read cached learning details:", error);
      }

      try {
        const profileResponse = await fetch("/api/profile", { cache: "no-store" });
        if (profileResponse.ok) {
          const result = await profileResponse.json() as { profile: LearnerProfile | null; user?: SignedInUser; error?: string };
          if (cancelled) return;
          if (result.profile && (result.profile.level || result.profile.learningLevel || result.profile.interests?.length || result.profile.goals?.length)) {
            setProfile(result.profile);
            window.localStorage.removeItem("ceoJackOnboarding");
          }
          setSignedInUser(result.user ?? null);
        } else {
          const result = await profileResponse.json().catch(() => null) as { error?: string } | null;
          console.log("Could not load dashboard profile:", result?.error ?? profileResponse.statusText);
          if (!cancelled) setDashboardError(true);
        }
      } catch (error) {
        console.log("Could not load dashboard profile:", error);
        if (!cancelled) setDashboardError(true);
      }

      try {
        const progressResponse = await fetch("/api/progress", { cache: "no-store" });
        if (progressResponse.ok) {
          const result = await progressResponse.json() as { progress: { lessonId: string; status: string }[] };
          if (cancelled) return;
          setLessonComplete(result.progress.some((item) => item.lessonId === "p7-maths-equivalent-fractions" && item.status === "completed"));
        } else {
          const result = await progressResponse.json().catch(() => null) as { error?: string } | null;
          console.log("Could not load dashboard progress:", result?.error ?? progressResponse.statusText);
          if (!cancelled) setLessonComplete(false);
          if (!cancelled) setDashboardError(true);
        }
      } catch (error) {
        console.log("Could not load dashboard progress:", error);
        if (!cancelled) setLessonComplete(false);
        if (!cancelled) setDashboardError(true);
      }
      if (!cancelled) setDashboardLoading(false);
    }
    void loadLearningData();
    return () => { cancelled = true; };
  }, [loadAttempt]);

  const recommendedPath = useMemo(() => {
    const interests = profile?.interests ?? [];
    if (interests.some((item) => /web|programming|design/i.test(item))) return paths[1];
    if (interests.some((item) => /business/i.test(item))) return paths[2];
    if (interests.some((item) => /ai/i.test(item))) return paths[3];
    return paths[0];
  }, [profile]);

  const learnerLevel = profile?.level || profile?.learningLevel || "Level 1";
  const levelQuery = learnerLevel === "Secondary" ? "secondary" : "primary";
  const completedCount = lessonComplete ? 1 : 0;
  const profileName = signedInUser?.fullName?.trim() || profile?.displayName?.trim() || "Learner";
  const hasLearningProfile = Boolean(
    (profile?.level || profile?.learningLevel) && profile?.ageGroup && profile?.interests?.length && profile?.goals?.length,
  );
  const learningSummary = hasLearningProfile
    ? `Level: ${learnerLevel} · Interests: ${profile?.interests?.join(", ") || "ready to explore"}`
    : "Welcome to your learning hub. Start your first lesson and build momentum one step at a time.";

  async function switchAccount() {
    setSwitchingAccount(true);
    try {
      await switchToGoogleAccount("/dashboard");
    } catch (error) {
      console.error("Could not start Google account switching:", error);
      setSwitchingAccount(false);
    }
  }

  return (
    <div className={"learner-dashboard [--dash-bg:#080d1b] [--dash-panel:#10182a] [--dash-panel-soft:#131e33] [--dash-line:rgba(255,255,255,.09)] [--dash-muted:#9ba9c2] [--dash-purple:#9b7bff] [min-height:100vh] [color:#f5f7ff] [background:radial-gradient(ellipse_at_72%_-12%,_rgba(99,133,255,.15),_transparent_35%),_var(--dash-bg)] [font-family:'Satoshi',_sans-serif] [line-height:1.55] [overflow-x:clip] [&_*]:[box-sizing:border-box] [&_a]:[color:inherit] [&_a]:[text-decoration:none] !motion-reduce:[&_*]:[scroll-behavior:auto] !motion-reduce:[&_*]:[transition-duration:.01ms] !motion-reduce:[&_*::before]:[scroll-behavior:auto] !motion-reduce:[&_*::before]:[transition-duration:.01ms] !motion-reduce:[&_*::after]:[scroll-behavior:auto] !motion-reduce:[&_*::after]:[transition-duration:.01ms]"}>
      {sidebarOpen ? <button className={"dashboard-scrim [display:none] max-[850px]:[position:fixed] max-[850px]:[z-index:25] max-[850px]:[inset:0] max-[850px]:[display:block] max-[850px]:[border:0] max-[850px]:[background:rgba(3,7,15,.64)]"} aria-label="Close navigation" onClick={() => setSidebarOpen(false)} /> : null}
      <aside className={(`dashboard-sidebar [position:fixed] [z-index:30] [inset:0_auto_0_0] [display:flex] [width:258px] [flex-direction:column] [padding:28px_17px_20px] [border-right:1px_solid_rgba(255,255,255,.05)] [background:rgba(9,15,30,.97)] [backdrop-filter:blur(18px)] max-[850px]:[transform:translateX(-102%)] max-[850px]:[transition:transform_.22s_ease] max-[850px]:[box-shadow:18px_0_45px_rgba(0,0,0,.25)]${sidebarOpen ? "is-open max-[850px]:[transform:translateX(0)]" : ""}`)}>
        <Link href="/" className={"dashboard-brand [display:flex] [align-items:center] [gap:11px] [padding:0_8px] [&_>_span:last-child]:[display:grid] [&_>_span:last-child]:[line-height:1.2] [&_strong]:[font-family:'Clash_Display',sans-serif] [&_strong]:[font-size:13px] [&_strong]:[letter-spacing:.07em] [&_small]:[margin-top:4px] [&_small]:[color:#8794ab] [&_small]:[font-size:7px] [&_small]:[font-weight:700] [&_small]:[letter-spacing:.2em]"} aria-label="CEO JACK Learning Hub home">
          <SiteLogoMark className={"dashboard-brand-mark [display:block] [width:41px] [height:41px] [flex:0_0_41px] [object-fit:cover] [border:1px_solid_rgba(255,255,255,.18)] [border-radius:12px] [box-shadow:0_9px_25px_rgba(94,103,255,.24)]"} width={82} height={82} alt="CEO JACK Learning Hub logo" />
          <span><strong>CEO JACK</strong><small>LEARNING HUB</small></span>
        </Link>
        <span className={"dashboard-nav-label [margin:52px_12px_12px] [color:#687691] [font-size:9px] [font-weight:800] [letter-spacing:.17em]"}>YOUR LEARNING SPACE</span>
        <nav className={"dashboard-nav [display:grid] [gap:5px]"} aria-label="Learning space">
          <Link href="/dashboard" className={"dashboard-nav-link active [display:flex] [min-height:45px] [align-items:center] [gap:12px] [padding:0_12px] [border:1px_solid_transparent] [border-radius:11px] [color:#fff] [font-size:12px] [font-weight:600] [transition:background_.18s,border-color_.18s,color_.18s] [&:hover]:[border-color:rgba(255,255,255,.07)] [&:hover]:[background:rgba(255,255,255,.045)] [&:hover]:[color:#fff] [&_>_span]:[display:grid] [&_>_span]:[width:20px] [&_>_span]:[place-items:center] [&_>_span]:[color:#8a9eff] [&_>_span]:[font-size:16px] [border-color:rgba(99,133,255,.2)] [background:linear-gradient(100deg,rgba(99,133,255,.2),rgba(79,140,255,.075))]"} aria-current="page" onClick={() => setSidebarOpen(false)}><span>⌂</span>My dashboard</Link>
          <Link href={`/education?level=${levelQuery}`} className={"dashboard-nav-link [display:flex] [min-height:45px] [align-items:center] [gap:12px] [padding:0_12px] [border:1px_solid_transparent] [border-radius:11px] [color:#a7b1c7] [font-size:12px] [font-weight:600] [transition:background_.18s,border-color_.18s,color_.18s] [&:hover]:[border-color:rgba(255,255,255,.07)] [&:hover]:[background:rgba(255,255,255,.045)] [&:hover]:[color:#fff] [&_>_span]:[display:grid] [&_>_span]:[width:20px] [&_>_span]:[place-items:center] [&_>_span]:[color:#8a9eff] [&_>_span]:[font-size:16px]"} onClick={() => setSidebarOpen(false)}><span>▤</span>Education Hub</Link>
          <Link href="/digital-skills" className={"dashboard-nav-link [display:flex] [min-height:45px] [align-items:center] [gap:12px] [padding:0_12px] [border:1px_solid_transparent] [border-radius:11px] [color:#a7b1c7] [font-size:12px] [font-weight:600] [transition:background_.18s,border-color_.18s,color_.18s] [&:hover]:[border-color:rgba(255,255,255,.07)] [&:hover]:[background:rgba(255,255,255,.045)] [&:hover]:[color:#fff] [&_>_span]:[display:grid] [&_>_span]:[width:20px] [&_>_span]:[place-items:center] [&_>_span]:[color:#8a9eff] [&_>_span]:[font-size:16px]"} onClick={() => setSidebarOpen(false)}><span>&lt;/&gt;</span>Digital Skills</Link>
          <Link href="/entrepreneurship" className={"dashboard-nav-link [display:flex] [min-height:45px] [align-items:center] [gap:12px] [padding:0_12px] [border:1px_solid_transparent] [border-radius:11px] [color:#a7b1c7] [font-size:12px] [font-weight:600] [transition:background_.18s,border-color_.18s,color_.18s] [&:hover]:[border-color:rgba(255,255,255,.07)] [&:hover]:[background:rgba(255,255,255,.045)] [&:hover]:[color:#fff] [&_>_span]:[display:grid] [&_>_span]:[width:20px] [&_>_span]:[place-items:center] [&_>_span]:[color:#8a9eff] [&_>_span]:[font-size:16px]"} onClick={() => setSidebarOpen(false)}><span>◈</span>Entrepreneurship</Link>
          <Link href="/ai" className={"dashboard-nav-link [display:flex] [min-height:45px] [align-items:center] [gap:12px] [padding:0_12px] [border:1px_solid_transparent] [border-radius:11px] [color:#a7b1c7] [font-size:12px] [font-weight:600] [transition:background_.18s,border-color_.18s,color_.18s] [&:hover]:[border-color:rgba(255,255,255,.07)] [&:hover]:[background:rgba(255,255,255,.045)] [&:hover]:[color:#fff] [&_>_span]:[display:grid] [&_>_span]:[width:20px] [&_>_span]:[place-items:center] [&_>_span]:[color:#8a9eff] [&_>_span]:[font-size:16px]"} onClick={() => setSidebarOpen(false)}><span>✦</span>CEO JACK AI</Link>
        </nav>
        <div className={"dashboard-sidebar-bottom [margin-top:auto]"}>
          <div className={"dashboard-sidebar-card [padding:16px] [border:1px_solid_var(--dash-line)] [border-radius:14px] [background:linear-gradient(145deg,rgba(99,133,255,.1),rgba(255,255,255,.025))] [&_>_span]:[color:#a995ff] [&_>_span]:[font-size:8px] [&_>_span]:[font-weight:800] [&_>_span]:[letter-spacing:.14em] [&_strong]:[display:block] [&_strong]:[margin-top:9px] [&_strong]:[font-family:'Clash_Display',sans-serif] [&_strong]:[font-size:15px] [&_p]:[margin:6px_0_12px] [&_p]:[color:#97a4bc] [&_p]:[font-size:10px] [&_p]:[line-height:1.65] [&_a]:[color:#c2b5ff] [&_a]:[font-size:10px] [&_a]:[font-weight:700] [&_a_span]:[margin-left:5px]"}><span>✦ YOUR NEXT STEP</span><strong>One lesson at a time.</strong><p>Keep exploring and build a learning routine that works for you.</p><Link href="/how-it-works">How the hub works <span>→</span></Link></div>
          {isSupabaseConfigured() ? <form action="/auth/signout" method="post" className={"dashboard-signout-form [margin:12px_10px_0]"}><button className={"dashboard-signout [padding:0] [border:0] [background:transparent] [color:#929fb7] [font-size:10px] [font-weight:600] [cursor:pointer] [&:hover]:[color:#fff] [&:focus-visible]:[outline:2px_solid_#b6a5ff] [&:focus-visible]:[outline-offset:3px]"} type="submit">Sign out</button></form> : null}
          <Link href="/" className={"dashboard-site-link [display:flex] [align-items:center] [gap:8px] [margin:17px_10px_0] ![color:#929fb7] [font-size:10px] [font-weight:600] [&_span]:[color:#9b7bff]"}><span>↗</span> Visit the main website</Link>
        </div>
      </aside>

      <main className={"dashboard-main [min-height:100vh] [margin-left:258px] max-[850px]:[margin-left:0]"}>
        <header className={"dashboard-topbar [position:sticky] [z-index:20] [top:0] [display:flex] [height:69px] [align-items:center] [justify-content:space-between] [padding:0_clamp(24px,4vw,58px)] [border-bottom:1px_solid_rgba(255,255,255,.06)] [background:rgba(8,13,27,.83)] [backdrop-filter:blur(16px)] max-[850px]:[justify-content:flex-start] max-[850px]:[gap:14px] max-[620px]:[height:60px] max-[620px]:[padding-inline:17px] max-[420px]:[gap:8px]"}>
          <button className={"dashboard-menu [display:none] max-[850px]:[display:grid] max-[850px]:[width:34px] max-[850px]:[height:34px] max-[850px]:[flex:0_0_34px] max-[850px]:[align-content:center] max-[850px]:[justify-items:center] max-[850px]:[gap:4px] max-[850px]:[padding:0] max-[850px]:[border:1px_solid_var(--dash-line)] max-[850px]:[border-radius:8px] max-[850px]:[background:rgba(255,255,255,.035)] max-[850px]:[&_span]:[width:14px] max-[850px]:[&_span]:[height:1px] max-[850px]:[&_span]:[background:#d1daee]"} type="button" aria-label={sidebarOpen ? "Close navigation" : "Open navigation"} aria-expanded={sidebarOpen} onClick={() => setSidebarOpen((open) => !open)}><span /><span /><span /></button>
          <Link href="/dashboard" className="flex min-w-0 shrink-0 items-center gap-2 text-slate-100 no-underline" aria-label="CEO JACK Learning Hub dashboard"><SiteLogoMark width={62} height={62} alt="" className="size-[31px] shrink-0 rounded-lg object-cover" /><span className="grid leading-tight"><strong className="text-[10px] tracking-[.08em]">CEO JACK</strong><small className="mt-1 text-[7px] font-bold tracking-[.15em] text-slate-400">LEARNING HUB</small></span></Link>
          <nav className="ml-5 hidden items-center gap-4 text-[11px] font-semibold text-slate-300 min-[1121px]:flex" aria-label="Main navigation"><Link href="/dashboard" className="hover:text-white">Dashboard</Link><Link href="/lesson" className="hover:text-white">Lessons</Link><Link href="/profile" className="hover:text-white">Profile</Link>{isSupabaseConfigured() ? <form action="/auth/signout" method="post"><button type="submit" className="min-h-9 rounded-md border border-white/10 px-3 text-slate-300 hover:bg-white/5 hover:text-white">Logout</button></form> : null}</nav>
          <div className={"dashboard-breadcrumb [color:#8694ac] [font-size:11px] [font-weight:600] [&_span]:[margin:0_8px] [&_span]:[color:#536078] max-[850px]:[display:none] max-[620px]:[font-size:9px] max-[420px]:[max-width:115px] max-[420px]:[overflow:hidden] max-[420px]:[text-overflow:ellipsis] max-[420px]:[white-space:nowrap]"}>Learning Space <span>/</span> My dashboard</div>
          <div className={"dashboard-topbar-actions [display:flex] [align-items:center] [gap:13px] [margin-left:auto] max-[850px]:[gap:8px] max-[420px]:[gap:5px]"}>
            <Link href="/ai" className={"dashboard-top-action [display:inline-flex] [min-height:36px] [align-items:center] [gap:8px] [padding:0_13px] [border:1px_solid_rgba(155,123,255,.24)] [border-radius:9px] [background:rgba(155,123,255,.08)] ![color:#d2c8ff] [font-size:10px] [font-weight:700] [&_span]:[color:#b7a5ff] max-[620px]:[min-height:32px] max-[620px]:[gap:5px] max-[620px]:[padding-inline:8px] max-[620px]:[font-size:8px] max-[420px]:[width:33px] max-[420px]:[justify-content:center] max-[420px]:[overflow:hidden] max-[420px]:[padding-inline:0] max-[420px]:[font-size:0] max-[420px]:[&_span]:[font-size:15px]"}><span>✦</span> Ask CEO JACK AI</Link>
            <div className={"dashboard-account-menu [position:relative] [display:flex] [align-items:center]"}>
              <Link className={"dashboard-account-trigger [display:inline-flex] [align-items:center] [gap:6px] [padding:3px] [border:0] [border-radius:999px] [background:transparent] [color:#aebbd0] [cursor:pointer] [&:hover]:[outline:2px_solid_rgba(182,165,255,.65)] [&:hover]:[outline-offset:2px] [&:focus-visible]:[outline:2px_solid_rgba(182,165,255,.65)] [&:focus-visible]:[outline-offset:2px]"} href="/profile" aria-label={`Open profile for ${profileName}`}>
                <UserAvatar src={signedInUser?.avatarUrl} className={"dashboard-account-avatar [position:relative] [display:grid] [width:37px] [height:37px] [flex:0_0_37px] [overflow:hidden] [place-items:center] [border:1px_solid_rgba(206,193,255,.42)] [border-radius:50%] [background:linear-gradient(145deg,#718fff,#9b7bff)] [box-shadow:0_5px_15px_rgba(99,117,255,.23)] [color:#fff] [font-size:11px] [font-weight:800] [&_img]:[position:absolute] [&_img]:[inset:0] [&_img]:[width:100%] [&_img]:[height:100%] [&_img]:[border-radius:inherit] [&_img]:[object-fit:cover] [&_svg]:[width:55%] [&_svg]:[height:55%] [&_svg]:[fill:none] [&_svg]:[stroke:#fff] [&_svg]:[stroke-linecap:round] [&_svg]:[stroke-linejoin:round] [&_svg]:[stroke-width:1.8]"} />
              </Link>
              <button className={"dashboard-account-menu-toggle [display:grid] [width:26px] [height:34px] [place-items:center] [border:0] [border-radius:7px] [background:transparent] [color:#aebbd0] [cursor:pointer] [&:hover]:[outline:2px_solid_rgba(182,165,255,.65)] [&:hover]:[outline-offset:1px] [&:hover]:[color:#fff] [&:focus-visible]:[outline:2px_solid_rgba(182,165,255,.65)] [&:focus-visible]:[outline-offset:1px] [&:focus-visible]:[color:#fff]"} type="button" aria-label="Open account menu" aria-expanded={profileMenuOpen} aria-controls="dashboard-account-popover" onClick={() => setProfileMenuOpen((open) => !open)}>⌄</button>
              {profileMenuOpen ? (
                <div className={"dashboard-account-popover [position:absolute] [z-index:40] [top:calc(100%_+_10px)] [right:0] [width:min(270px,calc(100vw_-_32px))] [padding:10px] [border:1px_solid_rgba(255,255,255,.1)] [border-radius:13px] [background:#111a2d] [box-shadow:0_18px_45px_rgba(0,0,0,.38)] [&_>_a]:[display:flex] [&_>_a]:[width:100%] [&_>_a]:[min-height:38px] [&_>_a]:[align-items:center] [&_>_a]:[justify-content:space-between] [&_>_a]:[padding:0_8px] [&_>_a]:[border:0] [&_>_a]:[border-radius:7px] [&_>_a]:[background:transparent] [&_>_a]:[color:#c7d0e3] [&_>_a]:[font-size:10px] [&_>_a]:[text-align:left] [&_>_a]:[cursor:pointer] [&_form_button]:[display:flex] [&_form_button]:[width:100%] [&_form_button]:[min-height:38px] [&_form_button]:[align-items:center] [&_form_button]:[justify-content:space-between] [&_form_button]:[padding:0_8px] [&_form_button]:[border:0] [&_form_button]:[border-radius:7px] [&_form_button]:[background:transparent] [&_form_button]:[color:#c7d0e3] [&_form_button]:[font-size:10px] [&_form_button]:[text-align:left] [&_form_button]:[cursor:pointer] [&_>_a:hover]:[background:rgba(255,255,255,.06)] [&_>_a:hover]:[color:#fff] [&_form_button:hover]:[background:rgba(255,255,255,.06)] [&_form_button:hover]:[color:#fff] [&_>_a_span]:[color:#b7a5ff]"} id="dashboard-account-popover">
                  <div className={"dashboard-account-summary [display:flex] [align-items:center] [gap:10px] [padding:6px_6px_12px] [border-bottom:1px_solid_rgba(255,255,255,.08)] [&_>_div]:[display:grid] [&_>_div]:[min-width:0] [&_>_div]:[gap:3px] [&_strong]:[overflow:hidden] [&_strong]:[font-size:11px] [&_strong]:[text-overflow:ellipsis] [&_strong]:[white-space:nowrap] [&_small]:[overflow:hidden] [&_small]:[color:#93a1ba] [&_small]:[font-size:9px] [&_small]:[text-overflow:ellipsis] [&_small]:[white-space:nowrap]"}><UserAvatar src={signedInUser?.avatarUrl} className={"dashboard-account-avatar [position:relative] [display:grid] [width:37px] [height:37px] [flex:0_0_37px] [overflow:hidden] [place-items:center] [border:1px_solid_rgba(206,193,255,.42)] [border-radius:50%] [background:linear-gradient(145deg,#718fff,#9b7bff)] [box-shadow:0_5px_15px_rgba(99,117,255,.23)] [color:#fff] [font-size:11px] [font-weight:800] [&_img]:[position:absolute] [&_img]:[inset:0] [&_img]:[width:100%] [&_img]:[height:100%] [&_img]:[border-radius:inherit] [&_img]:[object-fit:cover] [&_svg]:[width:55%] [&_svg]:[height:55%] [&_svg]:[fill:none] [&_svg]:[stroke:#fff] [&_svg]:[stroke-linecap:round] [&_svg]:[stroke-linejoin:round] [&_svg]:[stroke-width:1.8]"} /><div><strong>{profileName}</strong><small>Learning Hub account</small></div></div>
                  <Link href="/profile" onClick={() => setProfileMenuOpen(false)}>View my profile <span>→</span></Link>
                  <Link href="/onboarding" onClick={() => setProfileMenuOpen(false)}>Edit learning profile <span>→</span></Link>
                  <button className={"dashboard-switch-account [display:flex] [width:100%] [min-height:38px] [align-items:center] [justify-content:flex-start] [padding:0_8px] [border:0] [border-radius:7px] [background:transparent] [color:#c7d0e3] [font-size:10px] [text-align:left] [cursor:pointer] [gap:9px] [&_>_span:last-child]:[margin-left:auto] [&:hover]:[background:rgba(255,255,255,.06)] [&:hover]:[color:#fff] [&:disabled]:[opacity:.65] [&:disabled]:[cursor:wait]"} type="button" onClick={() => void switchAccount()} disabled={switchingAccount}><span className={"dashboard-google-mark [display:inline-grid] [width:20px] [height:20px] [flex:0_0_20px] [place-items:center] [border-radius:50%] [background:#fff] [color:#4285f4] [font-family:Arial,sans-serif] [font-size:13px] [font-weight:800]"} aria-hidden="true">G</span>{switchingAccount ? "Choose a Google account…" : "Switch Account"}<span aria-hidden="true">↗</span></button>
                  {isSupabaseConfigured() ? <form action="/auth/signout" method="post"><button type="submit">Sign out</button></form> : null}
                </div>
              ) : null}
            </div>
          </div>
        </header>

        <div className={"dashboard-content [width:min(1180px,100%)] [margin:0_auto] [padding:34px_clamp(24px,4vw,58px)_25px] max-[620px]:[padding:20px_16px_20px]"}>
          {dashboardLoading && isSupabaseConfigured() ? <div className="mb-4 rounded-xl border border-white/10 bg-white/[.03] p-4 text-sm text-slate-300" role="status"><span className="mr-2 inline-block size-3 animate-spin rounded-full border-2 border-violet-300 border-r-transparent align-[-2px]" />Loading your learning dashboard…</div> : null}
          {dashboardError ? <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-rose-300/20 bg-rose-300/5 p-4 text-sm text-rose-100" role="alert"><span>Failed to load, tap to retry.</span><button className="min-h-10 rounded-lg border border-rose-200/25 px-4 font-semibold" type="button" onClick={() => { setDashboardError(false); setDashboardLoading(true); setLoadAttempt((attempt) => attempt + 1); }}>Retry</button></div> : null}
          <section className={"dashboard-hero [position:relative] [display:flex] [min-height:270px] [align-items:center] [justify-content:space-between] [overflow:hidden] [padding:38px_43px] [border:1px_solid_rgba(155,123,255,.18)] [border-radius:22px] [background:radial-gradient(ellipse_at_90%_50%,rgba(103,91,226,.22),transparent_38%),linear-gradient(115deg,#141b34,#111a31_68%,#151c39)] [&::after]:[position:absolute] [&::after]:[inset:0] [&::after]:[pointer-events:none] [&::after]:[background:linear-gradient(100deg,transparent_40%,rgba(255,255,255,.018))] [&::after]:[content:''] [&_h1]:[margin:14px_0_9px] [&_h1]:[font-family:'Clash_Display',sans-serif] [&_h1]:[font-size:clamp(29px,3.4vw,43px)] [&_h1]:[letter-spacing:-.04em] [&_h1]:[line-height:1.12] [&_h1_span]:[color:#b09bff] [&_h1_span]:[font-size:.62em] max-[620px]:[min-height:0] max-[620px]:[padding:25px_21px] max-[620px]:[border-radius:17px] max-[620px]:[&_h1]:[max-width:280px] max-[620px]:[&_h1]:[font-size:31px]"}>
            <div className={"dashboard-hero-copy [position:relative] [z-index:2] [max-width:590px] [&_>_p]:[max-width:490px] [&_>_p]:[margin:0] [&_>_p]:[color:#aab5ca] [&_>_p]:[font-size:12px] [&_>_p]:[line-height:1.8] max-[620px]:[max-width:100%] max-[620px]:[&_>_p]:[max-width:360px] max-[620px]:[&_>_p]:[font-size:11px]"}>
              <div className={"dashboard-eyebrow [display:flex] [align-items:center] [gap:8px] [color:#b6a7ff] [font-size:9px] [font-weight:800] [letter-spacing:.16em] [&_i]:[width:6px] [&_i]:[height:6px] [&_i]:[border-radius:50%] [&_i]:[background:#9b7bff] [&_i]:[box-shadow:0_0_12px_#9b7bff]"}><i /> YOUR LEARNING JOURNEY</div>
              <h1>{hasLearningProfile ? "Welcome back to your learning hub" : "Welcome to your learning hub"}<span> ✦</span></h1>
              <p>{hasLearningProfile ? learningSummary : "Welcome to your learning hub. Start your first lesson and build momentum one step at a time."}</p>
              <div className={"dashboard-hero-actions [display:flex] [align-items:center] [gap:20px] [margin-top:23px] max-[620px]:[align-items:flex-start] max-[620px]:[flex-direction:column] max-[620px]:[gap:12px] max-[620px]:[margin-top:18px]"}>
                <Link href={lessonComplete ? `/education?level=${levelQuery}` : "/lesson"} className={"dashboard-primary-cta [display:inline-flex] [min-height:41px] [align-items:center] [gap:17px] [padding:0_15px] [border:1px_solid_rgba(255,255,255,.15)] [border-radius:9px] [background:linear-gradient(110deg,#6686ff,#8d76f8)] [box-shadow:0_8px_24px_rgba(99,117,255,.2)] ![color:#fff] [font-size:10px] [font-weight:800] [&_span]:[font-size:15px]"}>{lessonComplete ? "Choose your next lesson" : "Start your first lesson"}<span>→</span></Link>
                <Link href="#learning-paths" className={"dashboard-text-cta ![color:#c4cce0] [font-size:10px] [font-weight:700] [&_span]:[margin-left:5px] [&_span]:[color:#a995ff]"}>Explore learning areas <span>↓</span></Link>
              </div>
            </div>
            <div className={"dashboard-hero-art [position:relative] [width:230px] [height:210px] [flex:0_0_230px] [margin-right:35px] max-[850px]:[margin-right:0] max-[850px]:[transform:scale(.88)] max-[850px]:[transform-origin:center_right] max-[620px]:[position:absolute] max-[620px]:[right:-55px] max-[620px]:[bottom:-55px] max-[620px]:[width:180px] max-[620px]:[opacity:.5] max-[620px]:[transform:scale(.75)]"} aria-hidden="true"><div className={"dashboard-art-orbit orbit-a [position:absolute] [inset:14px_21px] [border:1px_solid_rgba(171,155,255,.2)] [border-radius:50%] [transform:rotate(-28deg)]"} /><div className={"dashboard-art-orbit orbit-b [position:absolute] [inset:35px_1px] [border:1px_solid_rgba(171,155,255,.2)] [border-radius:50%] [transform:rotate(33deg)] [border-color:rgba(120,150,255,.18)]"} /><div className={"dashboard-art-center [position:absolute] [top:50%] [left:50%] [display:grid] [width:76px] [height:76px] [place-items:center] [border:1px_solid_rgba(203,190,255,.42)] [border-radius:24px] [background:linear-gradient(145deg,rgba(142,121,255,.52),rgba(77,110,230,.34))] [box-shadow:0_0_55px_rgba(139,117,255,.28),inset_0_1px_rgba(255,255,255,.2)] [color:#fff] [font-size:35px] [transform:translate(-50%,-50%)_rotate(-8deg)]"}>✦</div><span className={"art-chip chip-book [position:absolute] [display:grid] [width:36px] [height:36px] [place-items:center] [border:1px_solid_rgba(255,255,255,.15)] [border-radius:11px] [background:rgba(20,31,57,.92)] [box-shadow:0_8px_25px_rgba(0,0,0,.2)] [color:#c4b8ff] [font-size:13px] [top:24px] [left:32px]"}>▤</span><span className={"art-chip chip-code [position:absolute] [display:grid] [width:36px] [height:36px] [place-items:center] [border:1px_solid_rgba(255,255,255,.15)] [border-radius:11px] [background:rgba(20,31,57,.92)] [box-shadow:0_8px_25px_rgba(0,0,0,.2)] [color:#9ec2ff] [font-size:13px] [right:17px] [bottom:28px]"}>&lt;/&gt;</span><span className={"art-chip chip-spark [position:absolute] [display:grid] [width:36px] [height:36px] [place-items:center] [border:1px_solid_rgba(255,255,255,.15)] [border-radius:11px] [background:rgba(20,31,57,.92)] [box-shadow:0_8px_25px_rgba(0,0,0,.2)] [color:#ffe2a7] [font-size:13px] [top:38px] [right:27px]"}>✧</span></div>
          </section>

          <LearnerActiveTimeCard />

          <section className={"dashboard-overview [display:grid] [grid-template-columns:repeat(3,minmax(0,1fr))] [gap:13px] [margin-top:18px] max-[620px]:[grid-template-columns:1fr] max-[620px]:[gap:8px] max-[620px]:[margin-top:12px]"} aria-label="Your learning overview">
            <article className={"overview-card overview-progress [display:flex] [min-height:92px] [align-items:center] [gap:13px] [padding:16px] [border:1px_solid_var(--dash-line)] [border-radius:14px] [background:linear-gradient(145deg,rgba(20,30,52,.94),rgba(15,24,42,.96))] [&_>_div]:[display:grid] [&_>_div]:[min-width:0] [&_strong]:[margin-top:2px] [&_strong]:[font-family:'Clash_Display',sans-serif] [&_strong]:[font-size:17px] [&_small]:[overflow:hidden] [&_small]:[margin-top:1px] [&_small]:[color:#8e9bb2] [&_small]:[font-size:9px] [&_small]:[text-overflow:ellipsis] [&_small]:[white-space:nowrap] max-[620px]:[min-height:76px]"}><span className={"overview-icon [display:grid] [width:38px] [height:38px] [flex:0_0_38px] [place-items:center] [border-radius:11px] [background:rgba(155,123,255,.13)] [color:#b9a6ff] [font-size:19px]"}>◷</span><div><span className={"overview-label [color:#8290a9] [font-size:8px] [font-weight:800] [letter-spacing:.12em]"}>PROGRESS</span><strong>{lessonComplete ? "100%" : "0%"}</strong><small>{lessonComplete ? "You’ve completed your first lesson" : "Start your first lesson"}</small></div></article>
            <article className={"overview-card [display:flex] [min-height:92px] [align-items:center] [gap:13px] [padding:16px] [border:1px_solid_var(--dash-line)] [border-radius:14px] [background:linear-gradient(145deg,rgba(20,30,52,.94),rgba(15,24,42,.96))] [&_>_div]:[display:grid] [&_>_div]:[min-width:0] [&_strong]:[margin-top:2px] [&_strong]:[font-family:'Clash_Display',sans-serif] [&_strong]:[font-size:17px] [&_small]:[overflow:hidden] [&_small]:[margin-top:1px] [&_small]:[color:#8e9bb2] [&_small]:[font-size:9px] [&_small]:[text-overflow:ellipsis] [&_small]:[white-space:nowrap] max-[620px]:[min-height:76px]"}><span className={"overview-icon blue [display:grid] [width:38px] [height:38px] [flex:0_0_38px] [place-items:center] [border-radius:11px] [background:rgba(99,148,255,.12)] [color:#92b6ff] [font-size:19px]"}>✦</span><div><span className={"overview-label [color:#8290a9] [font-size:8px] [font-weight:800] [letter-spacing:.12em]"}>STREAK</span><strong>0 days</strong><small>Build a learning habit</small></div></article>
            <article className={"overview-card [display:flex] [min-height:92px] [align-items:center] [gap:13px] [padding:16px] [border:1px_solid_var(--dash-line)] [border-radius:14px] [background:linear-gradient(145deg,rgba(20,30,52,.94),rgba(15,24,42,.96))] [&_>_div]:[display:grid] [&_>_div]:[min-width:0] [&_strong]:[margin-top:2px] [&_strong]:[font-family:'Clash_Display',sans-serif] [&_strong]:[font-size:17px] [&_small]:[overflow:hidden] [&_small]:[margin-top:1px] [&_small]:[color:#8e9bb2] [&_small]:[font-size:9px] [&_small]:[text-overflow:ellipsis] [&_small]:[white-space:nowrap] max-[620px]:[min-height:76px]"}><span className={"overview-icon green [display:grid] [width:38px] [height:38px] [flex:0_0_38px] [place-items:center] [border-radius:11px] [background:rgba(90,197,152,.12)] [color:#83d6af] [font-size:19px]"}>◎</span><div><span className={"overview-label [color:#8290a9] [font-size:8px] [font-weight:800] [letter-spacing:.12em]"}>YOUR LEARNING LEVEL</span><strong>{learnerLevel}</strong><small>{profile?.ageGroup ? `Age group ${profile.ageGroup}` : "Your starting point"}</small></div></article>
          </section>

          <section className={"dashboard-profile-card [display:flex] [align-items:flex-start] [gap:16px] [margin-top:14px] [padding:19px] [border:1px_solid_var(--dash-line)] [border-radius:15px] [background:linear-gradient(120deg,rgba(20,30,52,.96),rgba(15,24,42,.96))] max-[620px]:[gap:11px] max-[620px]:[padding:14px]"} id="account-profile" aria-labelledby="dashboard-profile-title">
            <Link href="/profile" aria-label="Open profile"><UserAvatar src={signedInUser?.avatarUrl} className={"dashboard-profile-avatar [&_img]:[position:absolute] [&_img]:[inset:0] [&_img]:[width:100%] [&_img]:[height:100%] [&_img]:[border-radius:inherit] [&_img]:[object-fit:cover] [&_svg]:[width:55%] [&_svg]:[height:55%] [&_svg]:[fill:none] [&_svg]:[stroke:#fff] [&_svg]:[stroke-linecap:round] [&_svg]:[stroke-linejoin:round] [&_svg]:[stroke-width:1.8] [position:relative] [display:grid] [width:48px] [height:48px] [flex:0_0_48px] [overflow:hidden] [place-items:center] [border:1px_solid_rgba(178,154,255,.24)] [border-radius:15px] [background:linear-gradient(145deg,rgba(155,123,255,.3),rgba(99,133,255,.17))] [color:#d4c9ff] [font-family:'Clash_Display',sans-serif] [font-size:15px] [font-weight:800] max-[620px]:[width:39px] max-[620px]:[height:39px] max-[620px]:[flex-basis:39px] max-[620px]:[border-radius:12px]"} /></Link>
            <div className={"dashboard-profile-main [min-width:0] [flex:1]"}>
              <div className={"dashboard-profile-heading [display:flex] [align-items:center] [justify-content:space-between] [gap:16px] [&_h2]:[margin:4px_0_2px] [&_h2]:[font-family:'Clash_Display',sans-serif] [&_h2]:[font-size:19px] [&_p]:[overflow-wrap:anywhere] [&_p]:[margin:0] [&_p]:[color:#9ba9c2] [&_p]:[font-size:10px] max-[620px]:[align-items:flex-start] max-[620px]:[flex-direction:column] max-[620px]:[gap:9px] max-[620px]:[&_h2]:[font-size:17px]"}>
                <div><span className={"section-kicker [color:#a995ff] [font-size:8px] [font-weight:800] [letter-spacing:.16em]"}>YOUR ACCOUNT</span><h2 id="dashboard-profile-title">{profileName}</h2><p>Your learning profile and preferences.</p></div>
                <Link href="/profile" className={"dashboard-profile-edit [flex:0_0_auto] [padding:9px_11px] [border:1px_solid_rgba(155,123,255,.2)] [border-radius:9px] [background:rgba(155,123,255,.07)] ![color:#d2c8ff] [font-size:9px] [font-weight:700] [&_span]:[margin-left:5px] max-[620px]:[font-size:8px]"}>Manage profile <span aria-hidden="true">→</span></Link>
              </div>
              <div className={"dashboard-profile-details [display:grid] [grid-template-columns:repeat(2,minmax(0,1fr))] [gap:8px] [margin-top:13px] [&_>_div]:[display:grid] [&_>_div]:[gap:3px] [&_>_div]:[min-width:0] [&_>_div]:[padding:8px_10px] [&_>_div]:[border:1px_solid_rgba(255,255,255,.07)] [&_>_div]:[border-radius:8px] [&_>_div]:[background:rgba(255,255,255,.025)] [&_span]:[color:#8290a9] [&_span]:[font-size:8px] [&_strong]:[overflow-wrap:anywhere] [&_strong]:[color:#d1c6ff] [&_strong]:[font-size:9px] [&_strong]:[font-weight:700] max-[620px]:[gap:6px] max-[620px]:[&_span]:[font-size:8px]"}>
                <div><span>Learning level</span><strong>{learnerLevel}</strong></div>
                <div><span>Hobby</span><strong>{profile?.hobby || "Add a hobby"}</strong></div>
                <div><span>Age group</span><strong>{profile?.ageGroup || "Not set yet"}</strong></div>
                <div><span>Interests</span><strong>{profile?.interests?.join(", ") || "Choose your interests"}</strong></div>
                <div><span>Goals</span><strong>{profile?.goals?.join(", ") || "Set your learning goals"}</strong></div>
              </div>
            </div>
          </section>

          <section className={"dashboard-next-section [margin-top:34px] max-[620px]:[margin-top:27px]"} aria-labelledby="next-lesson-title">
            <div className={"dashboard-section-heading [display:flex] [align-items:end] [justify-content:space-between] [gap:20px] [margin-bottom:15px] [&_h2]:[margin:5px_0_0] [&_h2]:[font-family:'Clash_Display',sans-serif] [&_h2]:[font-size:22px] [&_h2]:[letter-spacing:-.025em] [&_p]:[margin:5px_0_0] [&_p]:[color:#909db4] [&_p]:[font-size:10px] max-[620px]:[align-items:flex-start] max-[620px]:[flex-direction:column] max-[620px]:[gap:7px] max-[620px]:[&_h2]:[font-size:20px]"}><div><span className={"section-kicker [color:#a995ff] [font-size:8px] [font-weight:800] [letter-spacing:.16em]"}>PICK UP WHERE YOU LEFT OFF</span><h2 id="next-lesson-title">Your next step</h2></div><span className={"dashboard-step-count [padding-bottom:4px] [color:#8896ad] [font-size:9px] max-[620px]:[padding:0]"}>{completedCount ? "1 lesson completed" : "A great place to begin"}</span></div>
            <article className={"next-lesson-card [display:flex] [align-items:center] [gap:18px] [padding:19px] [border:1px_solid_rgba(124,145,255,.15)] [border-radius:15px] [background:linear-gradient(105deg,rgba(28,39,67,.96),rgba(17,27,47,.98))] max-[620px]:[align-items:flex-start] max-[620px]:[flex-wrap:wrap] max-[620px]:[gap:12px] max-[620px]:[padding:14px]"}>
              <div className={"next-lesson-symbol [display:grid] [width:57px] [height:57px] [flex:0_0_57px] [place-items:center] [border:1px_solid_rgba(178,154,255,.2)] [border-radius:15px] [background:linear-gradient(145deg,rgba(155,123,255,.25),rgba(99,133,255,.11))] [color:#c5b6ff] [font-family:'Clash_Display',sans-serif] [font-size:25px] max-[620px]:[width:46px] max-[620px]:[height:46px] max-[620px]:[flex-basis:46px]"}>∑</div>
              <div className={"next-lesson-info [flex:1] [min-width:0] [&_h3]:[margin:4px_0_2px] [&_h3]:[font-family:'Clash_Display',sans-serif] [&_h3]:[font-size:16px] [&_>_p]:[margin:0] [&_>_p]:[color:#9ba8be] [&_>_p]:[font-size:10px] max-[620px]:[flex-basis:calc(100%_-_60px)] max-[620px]:[&_h3]:[font-size:15px] max-[620px]:[&_>_p]:[font-size:9px]"}><span className={"lesson-tag [color:#a995ff] [font-size:8px] [font-weight:800] [letter-spacing:.13em] [&_i]:[display:inline-block] [&_i]:[width:3px] [&_i]:[height:3px] [&_i]:[margin:0_6px_2px] [&_i]:[border-radius:50%] [&_i]:[background:#687794]"}>P7 MATHEMATICS <i /> ABOUT 8 MIN</span><h3>Equivalent fractions</h3><p>Learn how fractions can look different and still represent the same amount.</p><div className={"lesson-progress-row [display:flex] [max-width:310px] [align-items:center] [gap:9px] [margin-top:9px] [color:#8492aa] [font-size:8px]"}><span className={(`lesson-progress-track [height:4px] [flex:1] [overflow:hidden] [border-radius:5px] [background:rgba(255,255,255,.1)] [&_i]:[display:block] [&_i]:[width:0] [&_i]:[height:100%] [&_i]:[border-radius:inherit] [&_i]:[background:linear-gradient(90deg,#6385ff,#a58bff)] [&_i]:[transition:width_.25s]${lessonComplete ? "complete [&_i]:[width:100%]" : ""}`)}><i /></span><span>{lessonComplete ? "Complete" : "Ready when you are"}</span></div></div>
              <Link href="/lesson" className={"lesson-open-button [display:inline-flex] [min-height:36px] [flex:0_0_auto] [align-items:center] [gap:13px] [padding:0_12px] [border:1px_solid_rgba(255,255,255,.12)] [border-radius:8px] [background:rgba(255,255,255,.045)] ![color:#e3e8f6] [font-size:9px] [font-weight:700] [&_span]:[color:#b6a3ff] [&_span]:[font-size:14px] max-[620px]:[margin-left:58px]"}>{lessonComplete ? "Review lesson" : "Start lesson"}<span>→</span></Link>
            </article>
          </section>

          <section className={"dashboard-paths-section [margin-top:34px] max-[620px]:[margin-top:27px]"} id="learning-paths" aria-labelledby="learning-paths-title">
            <div className={"dashboard-section-heading [display:flex] [align-items:end] [justify-content:space-between] [gap:20px] [margin-bottom:15px] [&_h2]:[margin:5px_0_0] [&_h2]:[font-family:'Clash_Display',sans-serif] [&_h2]:[font-size:22px] [&_h2]:[letter-spacing:-.025em] [&_p]:[margin:5px_0_0] [&_p]:[color:#909db4] [&_p]:[font-size:10px] max-[620px]:[align-items:flex-start] max-[620px]:[flex-direction:column] max-[620px]:[gap:7px] max-[620px]:[&_h2]:[font-size:20px]"}><div><span className={"section-kicker [color:#a995ff] [font-size:8px] [font-weight:800] [letter-spacing:.16em]"}>LEARN. CREATE. DEVELOP.</span><h2 id="learning-paths-title">Explore your learning areas</h2><p>Follow what interests you, or try something completely new.</p></div><Link className={"all-paths-link [padding-bottom:3px] ![color:#b9aaff] [font-size:9px] [font-weight:700] [white-space:nowrap] [&_span]:[margin-left:5px]"} href="/how-it-works">See how it works <span>→</span></Link></div>
            <div className={"learning-path-grid [display:grid] [grid-template-columns:repeat(4,minmax(0,1fr))] [gap:12px] max-[1120px]:[grid-template-columns:repeat(2,minmax(0,1fr))] max-[620px]:[grid-template-columns:1fr] max-[620px]:[gap:9px]"}>
              {paths.map((path) => (
                <Link key={path.title} href={path.href} className={(`learning-path-card [position:relative] [display:flex] [min-height:220px] [flex-direction:column] [padding:15px] [overflow:hidden] [border:1px_solid_var(--dash-line)] [border-radius:14px] [background:linear-gradient(150deg,rgba(19,29,50,.98),rgba(13,22,39,.99))] [transition:transform_.2s,border-color_.2s,background_.2s] [&:hover]:[transform:translateY(-3px)] [&:hover]:[border-color:rgba(155,123,255,.3)] [&:hover]:[background:linear-gradient(150deg,rgba(24,35,59,.98),rgba(15,24,43,.99))] [&_h3]:[margin:4px_0_5px] [&_h3]:[font-family:'Clash_Display',sans-serif] [&_h3]:[font-size:15px] [&_p]:[margin:0] [&_p]:[color:#98a5bb] [&_p]:[font-size:9px] [&_p]:[line-height:1.7] max-[1120px]:[min-height:190px] max-[620px]:[min-height:172px]${path.tone}${path.title === recommendedPath.title ? "recommended [border-color:rgba(155,123,255,.3)]" : ""}`)}>
                  <div className={"path-card-top [display:flex] [align-items:center] [justify-content:space-between] [min-height:34px] [margin-bottom:13px]"}><span className={"path-icon [display:grid] [width:34px] [height:34px] [place-items:center] [border:1px_solid_rgba(155,123,255,.19)] [border-radius:10px] [background:rgba(251,180,111,.1)] [color:#ffd096] [font-size:15px] [border-color:rgba(251,180,111,.2)]"}>{path.icon}</span>{path.title === recommendedPath.title ? <span className={"path-recommended [padding:5px_7px] [border-radius:6px] [background:rgba(155,123,255,.11)] [color:#c0b0ff] [font-size:7px] [font-weight:700]"}>A good match for you</span> : <span className={"path-arrow [color:#77859e] [font-size:15px]"}>↗</span>}</div>
                  <span className={"path-eyebrow [color:#8996ad] [font-size:7px] [font-weight:800] [letter-spacing:.11em]"}>{path.eyebrow}</span><h3>{path.title}</h3><p>{path.description}</p><span className={"path-action [display:flex] [align-items:center] [justify-content:space-between] [margin-top:auto] [padding-top:15px] [color:#ffd096] [font-size:9px] [font-weight:700] [&_b]:[font-size:14px] [&_b]:[font-weight:500]"}>{path.action}<b>→</b></span>
                </Link>
              ))}
            </div>
          </section>

          <section className={"dashboard-personalize [display:flex] [align-items:center] [gap:15px] [margin-top:24px] [padding:16px_18px] [border:1px_solid_rgba(99,133,255,.13)] [border-radius:14px] [background:linear-gradient(100deg,rgba(99,133,255,.08),rgba(155,123,255,.045))] max-[620px]:[align-items:flex-start] max-[620px]:[flex-wrap:wrap] max-[620px]:[gap:11px] max-[620px]:[padding:14px]"}>
            <div className={"personalize-mark [display:grid] [width:38px] [height:38px] [flex:0_0_38px] [place-items:center] [border-radius:11px] [background:rgba(155,123,255,.15)] [color:#c2b0ff] [font-size:19px]"}>✦</div><div className={"personalize-copy [&_h2]:[margin:5px_0_0] [&_h2]:[font-family:'Clash_Display',sans-serif] [&_h2]:[font-size:14px] [&_h2]:[letter-spacing:-.025em] [flex:1] [min-width:0] [&_p]:[margin:3px_0_0] [&_p]:[color:#94a1b8] [&_p]:[font-size:9px] max-[620px]:[flex-basis:calc(100%_-_52px)]"}><span className={"section-kicker [color:#a995ff] [font-size:8px] [font-weight:800] [letter-spacing:.16em]"}>MAKE IT YOURS</span><h2>{hasLearningProfile ? "Your learning path is set up" : "Welcome! Upload your details to set up your learner account"}</h2><p>{hasLearningProfile ? `Your interests: ${(profile?.interests ?? []).join(", ") || "ready to explore"}. You can revisit your choices any time.` : "Add your name, hobby, learning level, age group, interests and goals to personalize your learning space."}</p></div><Link href={hasLearningProfile ? "/onboarding" : "/profile"} className={"personalize-link [display:inline-flex] [flex:0_0_auto] [align-items:center] [gap:10px] ![color:#c2b1ff] [font-size:9px] [font-weight:700] max-[620px]:[margin-left:49px]"}>{hasLearningProfile ? "Update my path" : "Upload learner profile"}<span>→</span></Link>
          </section>

        </div>
        <SiteFooter />
      </main>
    </div>
  );
}
