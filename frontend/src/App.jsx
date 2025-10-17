import React, { useEffect, useMemo, useState, useContext, createContext } from "react";
import { Routes, Route, Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LogIn, LogOut, Menu, X, GraduationCap, Home as HomeIcon, Info, Mail, LayoutDashboard,
  Facebook, Instagram, Linkedin, Twitter, Youtube, Users2, Book, CalendarDays, Clock, MapPin, User,
  MessageSquare, Send
} from "lucide-react";

import { useAuth } from "./auth/AuthProvider";
import ProtectedRoute from "./auth/ProtectedRoute";

import CampusMap from "./components/CampusMap";
import BuildingInfo from "./components/BuildingInfo";
import LocationServices from "./components/LocationServices";

/* ===========================
   Brand & Shared
=========================== */
const brand = { red: "#cc0000", redDark: "#990000", black: "#000000", white: "#ffffff", gray: "#f5f5f5", accent: "#ffcc00" };
const container = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.45 } } };
const glossy = "bg-white/70 dark:bg-white/10 backdrop-blur-xl border border-white/40 shadow-[0_10px_30px_rgba(0,0,0,0.08)]";

/* ===========================
   i18n (lightweight)
=========================== */
const messages = {
  en: {
    brand: { app: "ILLINOIS TECH ONBOARDING", sub: "International Students" },
    nav: { home: "Home", about: "About", contact: "Contact", dashboard: "Dashboard", login: "Login", logout: "Logout" },
    hero: {
      badge: "Welcome to ILLINOIS TECH",
      title: "International Students Onboarding Platform",
      body: "Your guided path from admission to arrival: tasks, checklists, compliance, housing, and campus life.",
      ctaDash: "Go to Dashboard",
      ctaLearn: "Learn more",
    },
    ui: { language: "Language" },
  },
};
const I18nContext = createContext(null);
const get = (obj, path, fallback = "") =>
  path.split(".").reduce((o, k) => (o && o[k] != null ? o[k] : undefined), obj) ?? fallback;
function useI18n() { return useContext(I18nContext); }
function I18nProvider({ children }) {
  const [lang, setLang] = useState("en");
  const t = useMemo(() => (key) => get(messages[lang], key, key), [lang]);
  return <I18nContext.Provider value={{ lang, setLang, t }}>{children}</I18nContext.Provider>;
}

/* ===========================
   UI: Header & Shell
=========================== */
function LanguageSwitcher() {
  const { lang, setLang, t } = useI18n();
  return (
    <label className="hidden md:inline-flex items-center gap-2 text-sm">
      <span className="text-black/70">{t("ui.language")}:</span>
      <select
        className="px-2 py-1 rounded-lg border border-black/10 bg-white/70"
        value={lang}
        onChange={(e) => setLang(e.target.value)}
      >
        <option value="en">EN</option>
      </select>
    </label>
  );
}

function BrandMark() {
  const { t } = useI18n();
  return (
    <Link to="/" className="inline-flex items-center gap-2">
      <span className="inline-grid place-items-center w-8 h-8 rounded-full" style={{ background: brand.red }}>
        <GraduationCap className="w-5 h-5 text-white" />
      </span>
      <div className="leading-tight">
        <div className="font-bold" style={{ color: brand.black }}>{t("brand.app")}</div>
        <div className="text-xs text-black/60">{t("brand.sub")}</div>
      </div>
    </Link>
  );
}

function NavItem({ to, icon: Icon, labelKey }) {
  const { t } = useI18n();
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `inline-flex items-center gap-2 px-3 py-2 rounded-xl transition ${
          isActive ? "text-black bg-black/5" : "text-black/80 hover:text-black hover:bg-black/5"
        }`
      }
    >
      <Icon className="w-4 h-4" />
      <span className="font-medium">{t(labelKey)}</span>
    </NavLink>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  const { t } = useI18n();
  const { user, logout } = useAuth();
  const authed = !!user;

  return (
    <header className="sticky top-0 z-[2000]">
      <div
        className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-3 rounded-2xl ${glossy}`}
        style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.70) 100%)" }}
      >
        <div className="flex items-center justify-between py-3">
          <BrandMark />
          <nav className="hidden md:flex items-center gap-3">
            <NavItem to="/" icon={HomeIcon} labelKey="nav.home" />
            <NavItem to="/about" icon={Info} labelKey="nav.about" />
            <NavItem to="/contact" icon={Mail} labelKey="nav.contact" />
            <NavItem to="/dashboard" icon={LayoutDashboard} labelKey="nav.dashboard" />
            <LanguageSwitcher />
          </nav>
          <div className="hidden md:flex items-center gap-2">
            {authed ? (
              <button
                onClick={logout}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-white shadow hover:opacity-95"
                style={{ background: brand.red }}
              >
                <LogOut className="w-4 h-4" /> {t("nav.logout")}
              </button>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-white shadow hover:opacity-95"
                style={{ background: brand.red }}
              >
                <LogIn className="w-4 h-4" /> {t("nav.login")}
              </Link>
            )}
          </div>
          <button
            className="md:hidden p-2 rounded-xl hover:bg-black/5"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle Menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
        {open && (
          <div className="md:hidden pb-4 border-t border-black/10 mt-2">
            <div className="flex flex-col gap-1 pt-3">
              <NavItem to="/" icon={HomeIcon} labelKey="nav.home" />
              <NavItem to="/about" icon={Info} labelKey="nav.about" />
              <NavItem to="/contact" icon={Mail} labelKey="nav.contact" />
              <NavItem to="/dashboard" icon={LayoutDashboard} labelKey="nav.dashboard" />
              <div className="pt-3 flex items-center justify-between">
                <div />
                <LanguageSwitcher />
              </div>
              <div className="pt-2">
                {authed ? (
                  <button
                    onClick={logout}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-semibold text-white shadow hover:opacity-95"
                    style={{ background: brand.red }}
                  >
                    <LogOut className="w-4 h-4" /> {t("nav.logout")}
                  </button>
                ) : (
                  <Link
                    to="/login"
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-semibold text-white shadow hover:opacity-95"
                    style={{ background: brand.red }}
                  >
                    <LogIn className="w-4 h-4" /> {t("nav.login")}
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

function Page({ title, subtitle, children }) {
  const { t } = useI18n();
  return (
    <motion.section variants={container} initial="hidden" animate="show" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div
        className={`rounded-3xl p-6 md:p-10 ${glossy}`}
        style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.70) 100%)" }}
      >
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-black">
          {typeof title === "string" ? t(title) : title}
        </h1>
        {subtitle && (
          <p className="mt-2 text-black/70 max-w-2xl">{typeof subtitle === "string" ? t(subtitle) : subtitle}</p>
        )}
        <div className="mt-6">{children}</div>
      </div>
    </motion.section>
  );
}

/* ===========================
   Hero (banner + CTAs)
=========================== */
function Hero() {
  const { t } = useI18n();
  const images = ["/images/students.jpg", "/images/housing.jpg"];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % images.length), 3000);
    return () => clearInterval(id);
  }, [images.length]);

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        {images.map((src, i) => (
          <div
            key={i}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-300 ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
            style={{ backgroundImage: `url(${src})` }}
          />
        ))}
        <div className="absolute inset-0 bg-white/20" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-16 grid md:grid-cols-2 gap-10 items-center">
        <div
          className={`rounded-3xl p-8 md:p-5 ${glossy}`}
          style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 10%)" }}
        >
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span
              className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full border border-black/10"
              style={{ background: brand.gray }}
            >
              <span className="w-2 h-2 rounded-full" style={{ background: brand.red }} />
              <span className="ml-1">{t("hero.badge")}</span>
            </span>
            <h1
              className="mt-4 text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.1] text-black text-left"
              style={{ maxWidth: "640px" }}
            >
              {t("hero.title")}
            </h1>
            <p className="mt-3 text-lg text-black/70 max-w-xl text-left">{t("hero.body")}</p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                to="/dashboard"
                aria-label="Go to Dashboard"
                className="px-5 py-3 rounded-xl font-semibold text-white shadow hover:opacity-95"
                style={{ background: brand.red }}
              >
                {t("hero.ctaDash")}
              </Link>
              <Link
                to="/about"
                aria-label="Learn more"
                className="px-5 py-3 rounded-xl font-semibold border border-black/10 hover:bg-black/5"
              >
                {t("hero.ctaLearn")}
              </Link>
            </div>
          </motion.div>
        </div>
        <div className="hidden md:block" aria-hidden />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-4">
        <div className="flex gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`h-2.5 rounded-full transition-all ${i === index ? "w-6" : "w-2.5"}`}
              style={{ background: i === index ? brand.red : "#d1d5db" }}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* Home — fully expanded content per spec */
function Home() {
  return (
    <>
      <Hero />

      <Page
        title="Welcome to the International Student Onboarding Platform"
        subtitle="Designed with international students, for international students. Here, you’ll find everything you need to transition smoothly into life at Illinois Institute of Technology (IIT) — from your I-20 submission to your first class and community event."
      >
        <div className="grid md:grid-cols-2 gap-6 items-stretch">
          {/* LEFT: Photo */}
          <div
            className={`rounded-3xl overflow-hidden ${glossy}`}
            style={{
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.78) 100%)",
            }}
          >
            <img
              src="/images/Walking.jpg"
              alt="Students walking on IIT's Mies Campus"
              className="w-full h-[360px] md:h-[520px] object-cover"
            />
          </div>

          {/* RIGHT: Info + CTAs */}
          <div
            className={`rounded-3xl p-6 md:p-8 ${glossy}`}
            style={{
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.82) 100%)",
            }}
          >
            <h3 className="text-2xl font-extrabold text-black tracking-tight">
              Start strong at Illinois Tech
            </h3>
            <p className="mt-3 text-black/75">
              Your guided path from admission to arrival — tasks, checklists, compliance,
              housing, and campus life — all in one secure place.
            </p>

            {/* CTAs */}
            <div className="mt-5 grid gap-3">
              <Link
                to="/login"
                className="px-5 py-3 rounded-xl font-semibold text-white shadow hover:opacity-95 inline-flex items-center justify-between"
                style={{ background: brand.red }}
                aria-label="Get Started – Begin your onboarding journey"
              >
                <span>🔹 Get Started</span>
                <span className="text-white/90 text-sm">Begin your onboarding journey</span>
              </Link>

              <Link
                to="/dashboard"
                className="px-5 py-3 rounded-xl font-semibold border border-black/10 hover:bg-black/5 inline-flex items-center justify-between"
                aria-label="Check Your Progress – View your onboarding checklist"
              >
                <span>🔹 Check Your Progress</span>
                <span className="text-black/60 text-sm">View your onboarding checklist</span>
              </Link>

              <Link
                to="/about"
                className="px-5 py-3 rounded-xl font-semibold border border-black/10 hover:bg-black/5 inline-flex items-center justify-between"
                aria-label="Explore IIT Resources – Visit key student services"
              >
                <span>🔹 Explore IIT Resources</span>
                <span className="text-black/60 text-sm">Visit key student services</span>
              </Link>
            </div>

            {/* Tagline + mini blurb */}
            <div className="mt-6 rounded-2xl p-4 border border-black/10 bg-white/60">
              <p className="text-sm font-semibold text-black">
                “Designed with international students — for a smooth start at Illinois Tech.”
              </p>
              <p className="mt-2 text-sm text-black/70">
                No more scattered emails. Track tasks, upload documents securely, find local
                living tips, and connect with mentors — all in one place.
              </p>
            </div>
          </div>
        </div>
      </Page>

      {/* 💡 Why This Platform? (unchanged) */}
      <Page title="💡 Why This Platform?" subtitle="Reason why we will support your journey">
        <p className="text-black/80">
          The onboarding experience for international students can be overwhelming. Between visa
          paperwork, housing decisions, and settling into a new culture, many students struggle to
          track deadlines or access essential resources.
          <br />
          <br />
          This platform simplifies your journey — combining all key onboarding steps, resources,
          and contacts into one secure digital home.
        </p>

        <div className="mt-6 grid md:grid-cols-2 gap-4">
          {/* 1. Centralized Tasks */}
          <div
            className={`rounded-2xl p-5 ${glossy}`}
            style={{
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.75) 100%)",
            }}
          >
            <h4 className="font-bold text-black">🧭 1. Centralized Tasks with Smart Reminders</h4>
            <ul className="mt-2 text-sm text-black/75 list-disc pl-5 space-y-1">
              <li>Manage your entire onboarding process through a single dashboard.</li>
              <li>
                Personalized checklist that adapts to your admission stage (Pre-Arrival, Arrival,
                Post-Arrival)
              </li>
              <li>
                Automatic email and in-app notifications for upcoming deadlines (e.g., I-20
                submission, orientation, housing)
              </li>
              <li>Visual progress tracking (e.g., 75% Complete — Housing Contract Submitted)</li>
            </ul>
            <p className="mt-2 text-sm italic text-black/60">
              “No more scattered emails — all your tasks, tracked and synced.”
            </p>
          </div>

          {/* 2. Secure Document Uploads */}
          <div
            className={`rounded-2xl p-5 ${glossy}`}
            style={{
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.75) 100%)",
            }}
          >
            <h4 className="font-bold text-black">🔒 2. Secure Document Uploads</h4>
            <ul className="mt-2 text-sm text-black/75 list-disc pl-5 space-y-1">
              <li>
                Upload, review, and manage your official documents with full encryption and
                compliance with IIT data-protection standards.
              </li>
              <li>Submit forms such as I-20, visa copies, health insurance, and immunization records</li>
              <li>Automatic verification reminders if any document is incomplete</li>
              <li>Secure storage accessible only by authorized IIT staff</li>
            </ul>
            <p className="mt-2 text-sm italic text-black/60">
              “Your paperwork, protected and organized — ready for your arrival.”
            </p>
          </div>

          {/* 3. Local Living Tips */}
          <div
            className={`rounded-2xl p-5 ${glossy}`}
            style={{
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.75) 100%)",
            }}
          >
            <h4 className="font-bold text-black">🏙 3. Local Living Tips</h4>
            <p className="mt-1 text-sm text-black/75">
              Moving to Chicago? We’ve got you covered. Discover everything you need for daily living
              and campus adjustment:
            </p>
            <ul className="mt-2 text-sm text-black/75 list-disc pl-5 space-y-1">
              <li>
                <strong>Banking:</strong> Learn how to open U.S. bank accounts and set up digital
                payments
              </li>
              <li>
                <strong>Transit:</strong> Explore CTA passes, IIT shuttle routes, and nearby train
                stations
              </li>
              <li>
                <strong>Groceries:</strong> Find student-friendly stores and halal/specialty food
                options near Mies Campus
              </li>
              <li>
                <strong>Campus Jobs:</strong> Get started with student employment, HR onboarding, and
                career fairs
              </li>
            </ul>
            <p className="mt-2 text-sm italic text-black/60">
              “Practical guidance for living confidently — both on and off campus.”
            </p>
          </div>

          {/* 4. Connect */}
          <div
            className={`rounded-2xl p-5 ${glossy}`}
            style={{
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.75) 100%)",
            }}
          >
            <h4 className="font-bold text-black">🤝 4. Connect with Mentors, Advisors, and Communities</h4>
            <p className="mt-1 text-sm text-black/75">Settle in faster by building connections that matter.</p>
            <ul className="mt-2 text-sm text-black/75 list-disc pl-5 space-y-1">
              <li>Match with IIT peer mentors and cultural ambassadors through the platform</li>
              <li>Schedule meetings with your academic advisor and orientation leader</li>
              <li>Join international student groups and upcoming IIT social events</li>
            </ul>
            <p className="mt-2 text-sm italic text-black/60">
              “From your first hello to lifelong connections — start your IIT journey with the right people.”
            </p>
          </div>
        </div>
      </Page>

      {/* Quote (unchanged) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <motion.div variants={container} initial="hidden" animate="show" className="relative rounded-3xl overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/images/Crown_Hall.jpg')" }}
            aria-hidden
          />
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px]" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/35 to-black/40" />
          </div>
          <div className="relative p-6 md:p-10">
            <div className="max-w-5xl rounded-2xl bg-white/7 backdrop-blur-xl ring-1 ring-white/15 shadow-2xl p-6 md:p-8">
              <h1 className="font-bold text-white">
                ONBOARDING QUOTE: "Believe you can and you're halfway there." — Theodore Roosevelt
              </h1>
            </div>
          </div>
        </motion.div>
      </section>

      {/* How it Works (unchanged) */}
      <Page title="🧩 How It Works" subtitle="Simple. Secure. Student-centered.">
        <ol className="grid md:grid-cols-5 gap-4 text-sm">
          {[
            ["Step 1", "Log in with your IIT credentials (via Single Sign-On)."],
            ["Step 2", "View your personalized onboarding dashboard."],
            ["Step 3", "Complete tasks like visa upload, housing application, and health check."],
            ["Step 4", "Attend virtual orientation or live sessions."],
            ["Step 5", "Arrive at IIT with confidence — all your paperwork done and support waiting."],
          ].map(([title, body], i) => (
            <li
              key={i}
              className={`rounded-2xl p-4 ${glossy}`}
              style={{
                background: "linear-gradient(180deg, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.78) 100%)",
              }}
            >
              <div className="flex items-center gap-2">
                <span
                  className="w-7 h-7 rounded-full grid place-items-center text-white text-xs font-bold"
                  style={{ background: brand.red }}
                >
                  {i + 1}
                </span>
                <h5 className="font-semibold text-black">{title}</h5>
              </div>
              <p className="mt-2 text-black/70">{body}</p>
            </li>
          ))}
        </ol>
      </Page>
    </>
  );
}
/* ===========================
   About
=========================== */
function About() {
  return (
    <Page title="About" subtitle="Our mission is to streamline the onboarding journey for international students at IIT.">
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className={`relative rounded-3xl overflow-hidden ${glossy}`}
          style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.88) 0%, rgba(255,255,255,0.70) 100%)" }}
        >
          <img src="/images/about.jpg" alt="International students on IIT campus" className="w-full h-[320px] md:h-[480px] object-cover" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/10" />
        </motion.div>
        <div>
          <p className="text-black/80">
            The platform guides students from admission to arrival, with tasks for immigration, housing, orientation,
            and essential campus resources—designed for Illinois Tech’s global community.
          </p>
          <div className="mt-6 grid sm:grid-cols-2 gap-4">
            {["Compliance & Visa", "Housing & Arrival", "Orientation & Community", "Campus Resources"].map((title, i) => (
              <div
                key={i}
                className={`rounded-2xl p-5 ${glossy}`}
                style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.75) 100%)" }}
              >
                <h4 className="font-bold text-black">{title}</h4>
                <p className="mt-2 text-sm text-black/70">Curated steps, due dates, and contacts—no guessing.</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Page>
  );
}

/* ===========================
   Contact
=========================== */
function Contact() {
  return (
    <Page title="Contact" subtitle="Questions or feedback? Reach out—we’re here to help.">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div
          className="md:col-span-2 rounded-3xl p-6 text-white"
          style={{ background: "linear-gradient(135deg, #cc0000 0%, #990000 55%, #4a0000 100%)" }}
        >
          <h3 className="text-xl font-extrabold mb-4">Key Offices</h3>
          {[
            ["Registrar (One Stop)", "10 W 35th St, Chicago, IL 60616", "https://www.iit.edu/registrar", "registrar@iit.edu"],
            ["Office of Global Services (OGS)", "10 W 35th St, Chicago, IL 60616", "https://www.iit.edu/ogs", "ogs@iit.edu"],
            ["Graduate Admissions", "10 W 35th St, Chicago, IL 60616", "https://www.iit.edu/admissions-aid/graduate-admission", "grad.admission@iit.edu"],
            ["IT Support (OTS)", "TechCommons, Galvin Library", "https://ots.iit.edu/", "supportdesk@iit.edu"],
          ].map(([title, addr, site, email]) => (
            <div key={title} className="rounded-2xl p-4 bg-white/10 ring-1 ring-white/15 mb-4">
              <h4 className="font-bold">{title}</h4>
              <p className="text-sm text-white/90 mt-1">{addr}</p>
              <div className="mt-2 space-x-3 text-sm">
                <a href={site} className="underline hover:opacity-90" target="_blank" rel="noreferrer">
                  Website
                </a>
                <a href={`mailto:${email}`} className="underline hover:opacity-90">
                  {email}
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="md:col-span-3">
          <form className="grid gap-4">
            <div>
              <label className="text-sm font-semibold text-black" htmlFor="name">Name</label>
              <input
                id="name"
                className="mt-1 w-full rounded-xl px-4 py-3 border border-black/10 focus:outline-none focus:ring-2"
                placeholder="Your full name"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-black" htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                className="mt-1 w-full rounded-xl px-4 py-3 border border-black/10 focus:outline-none focus:ring-2"
                placeholder="you@hawk.iit.edu"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-black" htmlFor="msg">Message</label>
              <textarea
                id="msg"
                rows={6}
                className="mt-1 w-full rounded-xl px-4 py-3 border border-black/10 focus:outline-none focus:ring-2"
                placeholder="Tell us how we can help"
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-white shadow hover:opacity-95 w-max"
              style={{ background: brand.red }}
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </Page>
  );
}

/* ===========================
   Login
=========================== */
function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("student@hawk.illinoistech.edu");
  const [password, setPassword] = useState("Password123!");
  const [error, setError] = useState("");
  const nav = useNavigate();
  const loc = useLocation();
  const from = loc.state?.from?.pathname || "/dashboard";

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      nav(from, { replace: true });
    } catch (err) {
      setError(err.message || "Login failed");
    }
  };

  return (
    <section
      className="min-h-screen flex items-center justify-center px-4 py-10 relative"
      style={{ backgroundImage: "url('/images/login.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}
    >
      <div className="absolute inset-0 bg-black/30" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`relative z-10 max-w-md w-full rounded-3xl p-8 md:p-10 ${glossy}`}
        style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(255,255,255,0.85) 100%)", boxShadow: "0 10px 40px rgba(0,0,0,0.4)" }}
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 justify-center mb-3">
            <GraduationCap className="w-8 h-8 text-[#cc0000]" />
            <h1 className="text-2xl font-extrabold text-black">IIT Onboarding Login</h1>
          </div>
          <p className="text-black/70 text-sm">Access your onboarding dashboard and continue your journey.</p>
        </div>
        <form onSubmit={submit} className="grid gap-5">
          <label className="text-sm font-semibold text-black">
            Email
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-xl px-4 py-3 border border-black/10 focus:outline-none focus:ring-2"
              placeholder="you@hawk.illinoistech.edu"
            />
          </label>
          <label className="text-sm font-semibold text-black">
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-xl px-4 py-3 border border-black/10 focus:outline-none focus:ring-2"
              placeholder="••••••••"
            />
          </label>
          {error && <div className="text-[#cc0000] text-sm">{error}</div>}
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-white shadow hover:opacity-95 w-full"
            style={{ background: brand.red }}
          >
            <LogIn className="w-4 h-4" /> Sign in
          </button>
        </form>
      </motion.div>
    </section>
  );
}

/* ===========================
   Dashboard
=========================== */
function monthMatrix(firstOfMonth) {
  const start = new Date(firstOfMonth.getFullYear(), firstOfMonth.getMonth(), 1);
  const end = new Date(firstOfMonth.getFullYear(), firstOfMonth.getMonth() + 1, 0);
  const startDay = start.getDay();
  const totalDays = end.getDate();

  const matrix = [];
  let week = new Array(7).fill(null);

  for (let i = 0; i < startDay; i++) week[i] = null;

  let day = 1;
  for (let i = startDay; i < 7; i++) {
    week[i] = new Date(firstOfMonth.getFullYear(), firstOfMonth.getMonth(), day++);
  }
  matrix.push(week);

  while (day <= totalDays) {
    week = new Array(7).fill(null);
    for (let i = 0; i < 7 && day <= totalDays; i++) {
      week[i] = new Date(firstOfMonth.getFullYear(), firstOfMonth.getMonth(), day++);
    }
    matrix.push(week);
  }
  return matrix;
}

function deriveNameFromEmail(email) {
  if (!email) return "Student";
  const base = email.split("@")[0] || "student";
  return base.replace(/\./g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function DummyPage({ title, desc }) {
  return (
    <div
      className={`rounded-2xl p-6 ${glossy}`}
      style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.8) 100%)" }}
    >
      <h3 className="text-xl font-bold text-black">{title}</h3>
      <p className="mt-2 text-black/70">{desc}</p>
    </div>
  );
}

function SidebarLink({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `block px-3 py-2 rounded-lg text-sm transition-colors ${
          isActive
            ? "bg-red-600/25 text-white"
            : "text-white/85 hover:bg-red-600/20 hover:text-white"
        }`
      }
    >
      {children}
    </NavLink>
  );
}

function SidebarSection({ title, items, base }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="mb-4">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full text-left px-2 py-2 font-semibold text-white flex items-center justify-between"
      >
        <span>{title}</span>
        <span className="text-white/60">{open ? "–" : "+"}</span>
      </button>
      {open && (
        <div className="mt-1 pl-1 space-y-1">
          {items.map(([label, slug]) => (
            <SidebarLink key={slug} to={`/dashboard/${base}/${slug}`}>
              {label}
            </SidebarLink>
          ))}
        </div>
      )}
    </div>
  );
}

function DashboardHome({ user }) {
  // profile & progress
  const fullName = user?.fullName || deriveNameFromEmail(user?.email);
  const registeredCourse = "CS 512 – Data Systems";
  const semester = "Spring 2026";
  const completion = 0.75;

  // events
  const events = [
    { title: "International Orientation", date: new Date(), time: "10:00 AM – 12:00 PM", location: "MTCC Ballroom" },
    { title: "Banking Help Desk", date: new Date(new Date().setDate(new Date().getDate() + 2)), time: "1:00 PM – 3:00 PM", location: "MTCC Bridge" },
    { title: "Campus Tour", date: new Date(new Date().setDate(new Date().getDate() + 5)), time: "2:00 PM – 4:00 PM", location: "Welcome Center" },
  ];

  // calendar
  const today = new Date();
  const [activeMonth, setActiveMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const weeks = monthMatrix(activeMonth);
  const monthName = activeMonth.toLocaleString(undefined, { month: "long", year: "numeric" });
  const isSameDay = (a, b) =>
    a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

  // campus groups
  const groups = [
    { title: "International Students Association", meets: "Fridays • 5:30 PM – 7:00 PM", img: "/images/groups/isa.jpg" },
    { title: "Graduate Coding Club", meets: "Wednesdays • 6:00 PM – 8:00 PM", img: "/images/groups/coding.jpg" },
    { title: "Cultural Exchange Circle", meets: "Mondays • 4:00 PM – 5:30 PM", img: "/images/groups/cultural.jpg" },
  ];

  // simple chat state (local-only demo)
  const [chatInput, setChatInput] = useState("");
  const [chat, setChat] = useState([
    { from: "Aisha (ISA)", text: "Welcome to the group! Introduce yourself :)", ts: "2:15 PM" },
    { from: "Diego (ISA)", text: "Anyone going to the campus tour this weekend?", ts: "2:19 PM" },
  ]);
  const sendMsg = (e) => {
    e.preventDefault();
    const txt = chatInput.trim();
    if (!txt) return;
    setChat((c) => [...c, { from: fullName, text: txt, ts: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }) }]);
    setChatInput("");
  };

  return (
    <Page title="Dashboard" subtitle={`Welcome${user?.email ? ", " + user.email : ""}. Here's your onboarding status.`}>
      {/* 70/30 layout, narrow gap to sidebar handled by parent grid gap */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-4">
        {/* LEFT 70% */}
        <div className="lg:col-span-7 space-y-6">
          {/* Profile card */}
          <div
            className={`rounded-2xl p-6 ${glossy}`}
            style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.80) 100%)" }}
          >
            <div className="flex items-center gap-5">
              <img src="/images/avatar.jpg" alt="User avatar" className="w-24 h-24 object-cover rounded-2xl ring-2 ring-black/10" />
              <div className="min-w-0 w-full">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5" style={{ color: brand.red }} />
                  <h3 className="text-xl font-bold text-black truncate">{fullName}</h3>
                </div>
                <div className="mt-2 flex items-center gap-2 text-black/80">
                  <Book className="w-4 h-4" style={{ color: brand.red }} />
                  <span className="text-sm">{registeredCourse}</span>
                </div>
                <div className="mt-1 flex items-center gap-2 text-black/80">
                  <CalendarDays className="w-4 h-4" style={{ color: brand.red }} />
                  <span className="text-sm">{semester}</span>
                </div>

                {/* Progress */}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm text-black/70 mb-1">
                    <span>Onboarding Progress</span>
                    <span className="font-medium">{Math.round(completion * 100)}%</span>
                  </div>
                  <div className="h-3 w-full rounded-full bg-black/10 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: brand.red }}
                      initial={{ width: "0%" }}
                      animate={{ width: `${completion * 100}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                  </div>
                  <p className="mt-1 text-xs text-black/60">
                    Housing Contract Submitted • I-20 Uploaded • Orientation Scheduled
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Campus Groups */}
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {groups.map((g, i) => (
              <div
                key={i}
                className={`rounded-2xl overflow-hidden ${glossy}`}
                style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.90) 0%, rgba(255,255,255,0.75) 100%)" }}
              >
                <div className="h-36 w-full overflow-hidden">
                  <img src={g.img} alt={g.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-4">
                  <h4 className="font-semibold text-black flex items-center gap-2">
                    <Users2 className="w-4 h-4" style={{ color: brand.red }} />
                    {g.title}
                  </h4>
                  <p className="mt-1 text-sm text-black/70 flex items-center gap-2">
                    <Clock className="w-4 h-4" style={{ color: brand.red }} />
                    {g.meets}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* NEW: My Association Chat */}
          <div
            className={`rounded-2xl p-0 overflow-hidden ${glossy}`}
            style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.80) 100%)" }}
          >
            <div className="px-6 py-4 border-b border-black/10 flex items-center gap-2">
              <MessageSquare className="w-5 h-5" style={{ color: brand.red }} />
              <h3 className="text-lg font-bold text-black">My Association Chat</h3>
            </div>
            <div className="p-4 space-y-3 max-h-64 overflow-auto">
              {chat.map((m, idx) => (
                <div key={idx} className="rounded-xl border border-black/10 p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-black">{m.from}</span>
                    <span className="text-xs text-black/50">{m.ts}</span>
                  </div>
                  <p className="text-sm text-black/80 mt-1">{m.text}</p>
                </div>
              ))}
            </div>
            <form onSubmit={sendMsg} className="p-4 border-t border-black/10">
              <div className="flex items-center gap-2">
                <input
                  className="flex-1 px-4 py-2 rounded-xl border border-black/10 focus:outline-none focus:ring-2"
                  placeholder="Write a message to your association…"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                />
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-white shadow hover:opacity-95"
                  style={{ background: brand.red }}
                >
                  <Send className="w-4 h-4" /> Send
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* RIGHT 30% */}
        <div className="lg:col-span-3 space-y-6">
          {/* Calendar */}
          <div
            className={`rounded-2xl p-6 ${glossy}`}
            style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.80) 100%)" }}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-black">{monthName}</h3>
              <div className="flex items-center gap-2">
                <button
                  className="px-3 py-1 rounded-lg border border-black/10 hover:bg-black/5"
                  onClick={() => setActiveMonth(new Date(activeMonth.getFullYear(), activeMonth.getMonth() - 1, 1))}
                >
                  ‹
                </button>
                <button
                  className="px-3 py-1 rounded-lg border border-black/10 hover:bg-black/5"
                  onClick={() => setActiveMonth(new Date(activeMonth.getFullYear(), activeMonth.getMonth() + 1, 1))}
                >
                  ›
                </button>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-7 text-center text-xs font-semibold text-black/70">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                <div key={d} className="py-1">
                  {d}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1 mt-1">
              {weeks.map((w, wi) =>
                w.map((d, di) => (
                  <div
                    key={`${wi}-${di}`}
                    className="aspect-square rounded-lg grid place-items-center text-sm"
                    style={{
                      background: isSameDay(d, today) ? `${brand.red}15` : "transparent",
                      border: isSameDay(d, today) ? `1px solid ${brand.red}` : "1px solid rgba(0,0,0,0.08)",
                    }}
                  >
                    {d ? d.getDate() : ""}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Events */}
          <div
            className={`rounded-2xl p-6 ${glossy}`}
            style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.80) 100%)" }}
          >
            <h3 className="font-bold text-black mb-3">Upcoming Events</h3>
            <ul className="space-y-3">
              {events.map((e, i) => (
                <li key={i} className="rounded-xl border border-black/10 p-3">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="w-4 h-4 shrink-0" style={{ color: brand.red }} />
                    <span className="text-sm font-semibold text-black">{e.title}</span>
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-4 text-sm text-black/70">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-4 h-4" style={{ color: brand.red }} />
                      {e.time}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="w-4 h-4" style={{ color: brand.red }} />
                      {e.location}
                    </span>
                    <span className="inline-flex items-center gap-1">{e.date.toLocaleDateString()}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Page>
  );
}

function DashboardLayout() {
  const { user } = useAuth();
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Glossy black sidebar with red hover/active */}
        <aside
          className="lg:col-span-3 rounded-2xl p-4 border border-white/20 shadow-[0_10px_30px_rgba(0,0,0,0.2)]"
          style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(12px)" }}
        >
          <h2 className="text-lg font-extrabold mb-3 text-white">Navigation</h2>
          <SidebarSection
            title="Pre-Arrival Preparation"
            base="pre-arrival"
            items={[
              ["Visa & Documentation", "visa"],
              ["Housing Options", "housing"],
              ["Cultural Orientation", "culture"],
              ["Document Presentation", "documents"],
            ]}
          />
          <SidebarSection
            title="Campus Navigation"
            base="campus"
            items={[
              ["Interactive Campus Maps", "maps"],
              ["Building Information", "buildings"],
              ["Location-Based Services", "location-services"],
            ]}
          />
        </aside>

        <main className="lg:col-span-9">
          <Routes>
            <Route index element={<DashboardHome user={user} />} />
            {/* Pre-Arrival */}
            <Route
              path="pre-arrival/visa"
              element={<DummyPage title="Visa & Documentation" desc="Provide visa requirements and step-by-step guidance for document submission." />}
            />
            <Route
              path="pre-arrival/housing"
              element={<DummyPage title="Housing Options" desc="Display housing options with availability, pricing, and amenities." />}
            />
            <Route
              path="pre-arrival/culture"
              element={<DummyPage title="Cultural Orientation" desc="Guides, videos, and webinars about local customs and norms." />}
            />
            <Route
              path="pre-arrival/documents"
              element={<DummyPage title="Document Presentation" desc="Upload and securely store essential documents." />}
            />
            {/* Campus */}
            <Route path="campus/maps" element={<CampusMap />} />
            <Route path="campus/buildings" element={<BuildingInfo />} />
            <Route path="campus/location-services" element={<LocationServices />} />

            <Route path="*" element={<DummyPage title="Dashboard" desc="This section is under construction. Content coming soon." />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

/* ===========================
   Footer
=========================== */
function Footer() {
  return (
    <footer className="mt-10 pb-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className={`rounded-2xl p-8 md:p-10 ${glossy}`}
          style={{ background: "linear-gradient(135deg, #cc0000 0%, #990000 60%, #111111 120%)", color: "white" }}
        >
          <div className="flex flex-col md:flex-row justify-between gap-8 border-b border-white/10 pb-8">
            <div className="max-w-sm">
              <div className="flex items-center gap-2 mb-3">
                <h2>
                  <strong>Illinois Institute of Technology</strong>
                </h2>
              </div>
              <p className="text-sm text-white/90 leading-relaxed">
                <strong>Contact</strong>
                <br />
                10 West 35th Street
                <br />
                Chicago, IL 60616
                <br />
                <span className="block mt-2 font-medium text-white/90">312.567.3000</span>
                <a href="https://www.iit.edu/contact" className="hover:underline font-medium" target="_blank" rel="noreferrer">
                  Contact Us
                </a>
              </p>
            </div>

            <div>
              <h4 className="font-bold text-white mb-3">Follow Us</h4>
              <ul className="space-y-2 text-sm">
                {[
                  { name: "Facebook", href: "https://www.facebook.com/illinoistech", Icon: Facebook },
                  { name: "Instagram", href: "https://www.instagram.com/illinoistech/", Icon: Instagram },
                  { name: "LinkedIn", href: "https://www.linkedin.com/school/illinois-institute-of-technology/", Icon: Linkedin },
                  { name: "Twitter", href: "https://twitter.com/illinoistech", Icon: Twitter },
                  { name: "YouTube", href: "https://www.youtube.com/user/illinoistech", Icon: Youtube },
                ].map(({ name, href, Icon }) => (
                  <li key={name}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={name}
                      className="group inline-flex items-center gap-2 text-white/85 hover:text-white transition-colors"
                    >
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/10 ring-1 ring-white/15 group-hover:bg-white/15">
                        <Icon className="w-4 h-4" />
                      </span>
                      <span className="underline-offset-2 group-hover:underline">{name}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-3">Campus Links</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="https://www.iit.edu/emergency" target="_blank" rel="noreferrer" className="hover:underline text-white/80">
                    Emergency Information
                  </a>
                </li>
                <li>
                  <a href="https://www.iit.edu/employment" target="_blank" rel="noreferrer" className="hover:underline text-white/80">
                    Employment
                  </a>
                </li>
                <li>
                  <a href="https://alumni.iit.edu/" target="_blank" rel="noreferrer" className="hover:underline text-white/80">
                    Alumni
                  </a>
                </li>
                <li>
                  <a href="https://my.iit.edu/" target="_blank" rel="noreferrer" className="hover:underline text-white/80">
                    Illinois Tech Portal
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-3">Web & Policies</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="https://www.iit.edu/privacy" target="_blank" rel="noreferrer" className="hover:underline text-white/80">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="https://www.iit.edu/copyright" target="_blank" rel="noreferrer" className="hover:underline text-white/80">
                    Copyright Concerns
                  </a>
                </li>
                <li>
                  <a href="https://complaints.ibhe.org/" target="_blank" rel="noreferrer" className="hover:underline text-white/80">
                    IBHE Online Complaint System
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.iit.edu/student-affairs/handbook/policies-and-procedures/student-complaint-information"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline text-white/80"
                  >
                    Student Complaint Information
                  </a>
                </li>
                <li>
                  <a href="https://www.iit.edu/non-discrimination-policy" target="_blank" rel="noreferrer" className="hover:underline text-white/80">
                    Student Non-Discrimination Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6">
            <BrandMark />
            <p className="text-xs text-white/70 text-center md:text-right">
              © {new Date().getFullYear()} Illinois Institute of Technology • All Rights Reserved
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ===========================
   App Root
=========================== */
export default function App() {
  return (
    <div
      className="min-h-screen"
      style={{
        background: `radial-gradient(1200px 600px at 10% -10%, ${brand.red}10%, transparent 40%),
                     radial-gradient(1000px 500px at 110% 10%, ${brand.redDark}10%, transparent 35%),
                     linear-gradient(180deg, #fff 0%, #f9f9f9 100%)`,
      }}
    >
      <I18nProvider>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard/*" element={<DashboardLayout />} />
          </Route>

          <Route
            path="*"
            element={
              <Page title="Not Found">
                <p className="text-black/70">Page not found.</p>
              </Page>
            }
          />
        </Routes>
        <Footer />
      </I18nProvider>
    </div>
  );
}
