import { useState, useEffect, useRef } from "react";
import {
  motion, useInView, useMotionValue, useSpring, AnimatePresence,
  useScroll, useTransform
} from "framer-motion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Building2, Scale, Briefcase, FileText, Landmark, Lightbulb,
  Phone, Mail, MapPin, ChevronDown, Star, Shield, Globe,
  Menu, X, ArrowLeft, Award, Users, CheckCircle
} from "lucide-react";

/* ─── Brand ─── */
const BURG   = "#7a1515";
const BURG_D = "#5c0e0e";
const BURG_L = "#9b2020";
const GOLD   = "#f0e2cc";   /* warm cream/ivory — elegant with burgundy */

/* ─── Images (Unsplash – legal / professional – no English watermarks) ─── */
const IMGS = {
  hero:     "/hero-opt4.jpg",
  about:    "/about-riyadh.jpg",
  office:   "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop",
  team1:    "/team/team-man3.jpg",
  team2:    "/team/team-man1.jpg",
  team3:    "/team/team-woman2.jpg",
  justice:  "https://images.unsplash.com/photo-1589994965851-a8f479c573a9?q=80&w=2070&auto=format&fit=crop",
};

/* ─── Variants ─── */
const fadeUp = {
  hidden:  { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] } }
};
const fadeLeft = {
  hidden:  { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } }
};
const fadeRight = {
  hidden:  { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } }
};
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } };
const staggerFast = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };

/* ─── Wave BG ─── */
function WaveBg({ speed = 18, opacity = 0.06 }: { speed?: number; opacity?: number }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="wave-layer absolute left-0 right-0"
          style={{ top: `${i * 22}%`, animationDuration: `${speed + i * 5}s`, animationDirection: i % 2 === 0 ? "normal" : "reverse" }}>
          <svg viewBox="0 0 2880 120" xmlns="http://www.w3.org/2000/svg"
            style={{ width: "200%", opacity }} preserveAspectRatio="none">
            <path d={`M0,${40+i*8} C240,${80+i*6} 480,${10+i*4} 720,${50+i*5} C960,${90+i*4} 1200,${20+i*3} 1440,${60+i*6} C1680,${95+i*5} 1920,${15+i*4} 2160,${55+i*5} C2400,${90+i*3} 2640,${25+i*4} 2880,${50+i*5} L2880,120 L0,120 Z`}
              fill="white" />
          </svg>
        </div>
      ))}
    </div>
  );
}

/* ─── Animated Counter ─── */
function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { damping: 30, stiffness: 80 });
  const [display, setDisplay] = useState(0);
  useEffect(() => { if (inView) mv.set(target); }, [inView, target, mv]);
  useEffect(() => spring.on("change", (v) => setDisplay(Math.round(v))), [spring]);
  return <span ref={ref}>{display.toLocaleString("ar-SA")}{suffix}</span>;
}

/* ─── InView Section ─── */
function Section({ id, className = "", style, children }: {
  id?: string; className?: string; style?: React.CSSProperties; children: React.ReactNode
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.section id={id} ref={ref} style={style}
      initial="hidden" animate={inView ? "visible" : "hidden"} className={className}>
      {children}
    </motion.section>
  );
}

/* ─── Parallax Image ─── */
function ParallaxImg({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.img src={src} alt={alt} style={{ y, scale: 1.16 }}
        className="w-full h-full object-cover"
        transition={{ ease: "linear" }}
      />
    </div>
  );
}

/* ─── Gold Divider ─── */
function GoldLine() {
  return (
    <motion.div variants={fadeUp} className="mx-auto mt-6 mb-0 h-px w-28"
      style={{ background: `linear-gradient(to left, transparent, ${GOLD}, transparent)` }} />
  );
}

export default function Home() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', message: '' });
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const heroRef = useRef(null);
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY   = useTransform(heroScroll, [0, 1], ["0%", "30%"]);
  const heroOp  = useTransform(heroScroll, [0, 0.7], [1, 0]);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitMessage(null);

    try {
      const data = {
        service_id: 'service_o8881zl',
        template_id: 'template_jg4tteh',
        user_id: 'aXFlmbDh_pfr1-44q',
        template_params: {
          from_name: formData.name,
          phone_number: formData.phone,
          reply_to: formData.email,
          message: formData.message,
        }
      };

      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setSubmitMessage({ type: 'success', text: 'تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.' });
        setFormData({ name: '', phone: '', email: '', message: '' });
        setTimeout(() => setSubmitMessage(null), 5000);
      } else {
        // EmailJS sends text errors, not JSON!
        const errorText = await response.text(); 
        console.error('EmailJS Error Reason:', errorText);
        throw new Error(`EmailJS error: ${response.status} - ${errorText}`);
      }
    } catch (error) {
      console.error('Failed to send email:', error);
      setSubmitMessage({ type: 'error', text: 'حدث خطأ أثناء إرسال الرسالة. يرجى التحقق من بيانات النموذج والمحاولة مرة أخرى.' });
    }
  };

  const navLinks = [
    { href: "#about", label: "من نحن" },
    { href: "#practices", label: "خدماتنا" },
    { href: "#team", label: "فريق العمل" },
    { href: "#contact", label: "تواصل معنا" },
  ];

  const practices = [
    { icon: Building2, title: "قانون الشركات", desc: "تأسيس الشركات، الاستحواذ والاندماج، حوكمة الشركات، والامتثال التنظيمي." },
    { icon: Landmark,  title: "العقارات والمقاولات", desc: "صياغة عقود التطوير العقاري، النزاعات الإنشائية، وتنظيم الملكيات." },
    { icon: Briefcase, title: "الخدمات المصرفية والمالية", desc: "التمويل الإسلامي، الصناديق الاستثمارية، وهيكلة القروض والتسهيلات." },
    { icon: Scale,     title: "التقاضي وتسوية المنازعات", desc: "تمثيل العملاء أمام كافة المحاكم واللجان شبه القضائية ومراكز التحكيم." },
    { icon: FileText,  title: "الشؤون الحكومية", desc: "التمثيل أمام الجهات الحكومية، والتنظيمات الإدارية، والعقود العامة." },
    { icon: Lightbulb, title: "الملكية الفكرية", desc: "تسجيل وحماية العلامات التجارية وبراءات الاختراع وحقوق النشر." },
  ];

  const team = [
    { name: "د. عبدالعزيز الغامدي", role: "الشريك المؤسس", spec: "خبير في قانون الشركات والتحكيم التجاري الدولي، بخبرة تتجاوز 30 عاماً.", img: IMGS.team1 },
    { name: "المحامي خالد بن فهد",   role: "شريك أول",      spec: "متخصص في قضايا التطوير العقاري والمقاولات والنزاعات العمالية.",           img: IMGS.team2 },
    { name: "المحامية نورة السالم",   role: "شريك",          spec: "مستشارة معتمدة في الملكية الفكرية وامتثال الشركات والأسواق المالية.",     img: IMGS.team3 },
  ];

  const testimonials = [
    { text: "لمسنا في فريق الغامدي وشركاه احترافية عالية ودقة متناهية في صياغة العقود التجارية المعقدة. استشاراتهم القانونية كانت الدرع الحصين لشركتنا في العديد من الصفقات الاستراتيجية.", author: "سلمان العتيبي", company: "الرئيس التنفيذي، مجموعة الرائدة للتطوير" },
    { text: "التعامل مع تعقيدات الأنظمة الحكومية يتطلب خبيراً متمرساً، وهو ما وجدناه في هذا الكيان العريق. إنجاز في وقت قياسي ونتائج تفوق التوقعات.", author: "م. فهد الدوسري", company: "مدير الشؤون القانونية، قطاع المقاولات" },
    { text: "أكثر ما يميزهم هو الشفافية التامة والوضوح في تقييم الموقف القانوني. تولوا قضايا مالية شائكة لشركتنا وحسموا النزاعات لصالحنا بفضل الله.", author: "أحمد بن طارق", company: "رئيس مجلس الإدارة، شركة الأفق للاستثمار" },
  ];

  return (
    <div className="min-h-screen w-full flex flex-col font-sans overflow-x-hidden" dir="rtl"
      style={{ background: BURG }}>

      {/* ══════════════ NAVIGATION ══════════════ */}
      <motion.header
        initial={{ y: -90, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          background: scrolled ? `${BURG_D}f0` : "transparent",
          backdropFilter: scrolled ? "blur(14px)" : "none",
          borderBottom: scrolled ? `1px solid ${GOLD}20` : "none",
          boxShadow: scrolled ? `0 4px 30px ${BURG_D}80` : "none",
        }}
      >
        {/* Top strip */}
        <div className="border-b border-white/10 py-2 hidden md:block">
          <div className="container mx-auto px-6 flex justify-between items-center">
            <div className="flex gap-4 text-white/40 text-xs">
              <a href="tel:+966112345678" className="hover:text-white/70 transition-colors" dir="ltr">+966 11 234 5678</a>
              <span>|</span>
              <a href="mailto:info@alghamdilegal.sa" className="hover:text-white/70 transition-colors">info@alghamdilegal.sa</a>
            </div>
            <span className="text-white/30 text-xs">الرياض — المملكة العربية السعودية</span>
          </div>
        </div>

        {/* Main row */}
        <div className="container mx-auto px-6 h-20 flex items-center justify-between md:justify-center md:gap-16">
          <nav className="hidden md:flex items-center gap-10">
            {navLinks.slice(0, 2).map((l) => (
              <a key={l.href} href={l.href}
                className="text-sm font-medium text-white/70 hover:text-white transition-colors relative group"
                data-testid={`link-${l.href.slice(1)}`}>
                {l.label}
                <span className="absolute -bottom-1 right-0 w-0 h-0.5 group-hover:w-full transition-all duration-300"
                  style={{ background: GOLD }} />
              </a>
            ))}
          </nav>

          <a href="#" className="flex flex-col items-center gap-1 flex-shrink-0">
            <motion.div className="h-12 w-12 rounded-full border-2 flex items-center justify-center relative"
              style={{ borderColor: `${GOLD}60`, background: `${BURG_D}99` }}
              whileHover={{ scale: 1.08, rotate: 5 }} transition={{ type: "spring", stiffness: 300 }}>
              <Scale className="h-6 w-6" style={{ color: GOLD }} />
            </motion.div>
            <div className="text-center">
              <p className="text-white font-black text-sm leading-tight">الغامدي وشركاه</p>
              <p className="text-[9px]" style={{ color: `${GOLD}99` }}>للمحاماة والاستشارات القانونية</p>
            </div>
          </a>

          <nav className="hidden md:flex items-center gap-10">
            {navLinks.slice(2).map((l) => (
              <a key={l.href} href={l.href}
                className="text-sm font-medium text-white/70 hover:text-white transition-colors relative group"
                data-testid={`link-${l.href.slice(1)}`}>
                {l.label}
                <span className="absolute -bottom-1 right-0 w-0 h-0.5 group-hover:w-full transition-all duration-300"
                  style={{ background: GOLD }} />
              </a>
            ))}
            <motion.a href="#contact" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
              <button className="text-sm font-bold px-5 py-2 rounded-full transition-all duration-300 hover:opacity-90"
                style={{ background: GOLD, color: BURG_D }}
                data-testid="button-nav-consult">
                طلب استشارة
              </button>
            </motion.a>
          </nav>

          <button className="md:hidden text-white p-2" onClick={() => setMobileOpen(!mobileOpen)}
            data-testid="button-mobile-menu">
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }} className="md:hidden overflow-hidden border-t border-white/10"
              style={{ background: BURG_D }}>
              <div className="container mx-auto px-6 py-5 flex flex-col gap-4">
                {navLinks.map((l) => (
                  <a key={l.href} href={l.href} onClick={() => setMobileOpen(false)}
                    className="text-white/70 hover:text-white py-2 border-b border-white/10 transition-colors">
                    {l.label}
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* ══════════════ HERO ══════════════ */}
      <section ref={heroRef} className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Parallax BG image */}
        <motion.div className="absolute inset-0" style={{ y: heroY }}>
          <img src={IMGS.hero} alt="مكتب محاماة"
            className="w-full h-full object-cover" />
          <div className="absolute inset-0"
            style={{ background: `linear-gradient(160deg, ${BURG_D}e8 0%, ${BURG}d5 50%, ${BURG_D}f0 100%)` }} />
        </motion.div>

        <WaveBg speed={16} opacity={0.06} />

        <motion.div style={{ opacity: heroOp }}
          className="relative z-10 text-center px-4 max-w-5xl mx-auto pt-44 pb-28">
          <motion.div initial="hidden" animate="visible" variants={stagger}>

            <motion.div variants={fadeUp} className="flex items-center justify-center gap-3 mb-8">
              <div className="h-px w-16" style={{ background: `${GOLD}80` }} />
              <p className="text-sm font-semibold tracking-[0.3em] uppercase" style={{ color: GOLD }}>
                شركة الغامدي وشركاه
              </p>
              <div className="h-px w-16" style={{ background: `${GOLD}80` }} />
            </motion.div>

            <motion.h1 variants={fadeUp}
              className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[1.15] mb-10">
              التميّز في تقديم<br />
              <span style={{ color: GOLD }}>خدمات المحاماة</span><br />
              والاستشارات القانونية.
            </motion.h1>

            <motion.p variants={fadeUp}
              className="text-lg md:text-xl text-white/55 max-w-2xl mx-auto mb-14 leading-relaxed">
              نقدم خدمات قانونية استثنائية للشركات والجهات الحكومية والأفراد، وفق أعلى المعايير المهنية وبما يتوافق مع الشريعة الإسلامية والأنظمة السعودية.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-wrap gap-4 justify-center">
              <motion.a href="#contact" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                <button className="text-base font-bold px-10 py-4 rounded-full shadow-2xl group flex items-center gap-2"
                  style={{ background: GOLD, color: BURG_D }} data-testid="button-hero-contact">
                  تواصل معنا الآن
                  <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                </button>
              </motion.a>
              <motion.a href="#about" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                <button className="text-base font-bold px-10 py-4 rounded-full border border-white/25 text-white hover:bg-white/10 transition-all"
                  data-testid="button-hero-about">
                  تعرف علينا
                </button>
              </motion.a>
            </motion.div>

          </motion.div>
        </motion.div>

        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
          style={{ color: `${GOLD}60`, opacity: heroOp as unknown as number } as React.CSSProperties}
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}>
          <span className="text-[10px] tracking-widest uppercase">تمرير</span>
          <ChevronDown className="h-4 w-4" />
        </motion.div>
      </section>

      {/* ══════════════ STATS ══════════════ */}
      <section className="relative py-16 overflow-hidden"
        style={{ background: BURG_D, borderTop: `2px solid ${GOLD}30`, borderBottom: `2px solid ${GOLD}30` }}>
        <WaveBg speed={24} opacity={0.04} />
        <div className="container mx-auto px-6 relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
            className="grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
            {[
              { val: 25, suf: "+", label: "عاماً من الخبرة", icon: Award },
              { val: 5000, suf: "+", label: "قضية ناجحة", icon: CheckCircle },
              { val: 10, suf: "B+", label: "ريال حجم الصفقات", icon: Briefcase },
              { val: 50, suf: "+", label: "محامي ومستشار", icon: Users },
            ].map((s, i) => (
              <motion.div key={i} variants={fadeUp}
                whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 300 }}>
                <s.icon className="h-6 w-6 mx-auto mb-2" style={{ color: `${GOLD}70` }} />
                <div className="text-4xl md:text-5xl font-black mb-1" style={{ color: GOLD }}>
                  <Counter target={s.val} suffix={s.suf} />
                </div>
                <p className="text-white/50 text-sm">{s.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════ PRACTICE AREAS ══════════════ */}
      <Section id="practices" className="relative py-28 overflow-hidden"
        style={{ background: BURG }}>
        <WaveBg speed={20} opacity={0.05} />

        {/* Background image overlay */}
        <div className="absolute inset-0 pointer-events-none">
          <img src={IMGS.justice} alt="" className="w-full h-full object-cover opacity-5" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div variants={stagger} className="text-center mb-20">
            <motion.p variants={fadeUp} className="text-sm font-semibold tracking-[0.3em] uppercase mb-4"
              style={{ color: GOLD }}>خدماتنا القانونية</motion.p>
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-black text-white">مجالات الممارسة</motion.h2>
            <GoldLine />
          </motion.div>

          <motion.div variants={staggerFast} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {practices.map((p, i) => (
              <motion.div key={i} variants={fadeUp}
                whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.3, ease: "easeOut" } }}
                className="group relative p-8 rounded-2xl border overflow-hidden cursor-default"
                style={{ background: `${BURG_D}99`, borderColor: `${GOLD}20` }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = `${GOLD}55`; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = `${GOLD}20`; }}
                data-testid={`card-practice-${i}`}
              >
                <motion.div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: `radial-gradient(circle at 20% 50%, ${GOLD}0a, transparent 70%)` }} />
                <div className="relative z-10">
                  <motion.div className="h-14 w-14 rounded-xl mb-6 flex items-center justify-center"
                    style={{ background: `${GOLD}18` }}
                    whileHover={{ rotate: 10, scale: 1.1 }} transition={{ type: "spring", stiffness: 300 }}>
                    <p.icon className="h-7 w-7" style={{ color: GOLD }} />
                  </motion.div>
                  <h3 className="text-lg font-bold text-white mb-3">{p.title}</h3>
                  <p className="text-white/45 text-sm leading-relaxed">{p.desc}</p>
                  <div className="mt-5 flex items-center gap-2 text-sm font-semibold opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300"
                    style={{ color: GOLD }}>
                    <span>اعرف المزيد</span>
                    <ArrowLeft className="h-4 w-4" />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Section>

      {/* ══════════════ ABOUT ══════════════ */}
      <Section id="about" className="relative py-28 overflow-hidden"
        style={{ background: BURG_D }}>
        <WaveBg speed={22} opacity={0.06} />
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

            <motion.div variants={fadeLeft}>
              <p className="text-sm font-semibold tracking-[0.3em] uppercase mb-5" style={{ color: GOLD }}>قصتنا</p>
              <h2 className="text-4xl md:text-5xl font-black text-white leading-tight mb-8">
                تاريخٌ من الثقة<br />
                <span style={{ color: GOLD }}>والمصداقية</span>
              </h2>
              <div className="space-y-5 text-white/50 leading-loose">
                <p>تأسست "الغامدي وشركاه" على مبادئ راسخة من العدالة والشفافية. منذ بداياتنا، التزمنا بتقديم استشارات قانونية مبنية على الفهم العميق للبيئة التنظيمية والتجارية في المملكة.</p>
                <p>نحن نؤمن بأن المحاماة ليست مجرد مهنة، بل هي رسالة لتحقيق العدل وحماية الحقوق. فريقنا يجمع بين التأصيل الشرعي والخبرة العملية في الأنظمة المعاصرة.</p>
                <p>نتشرف بثقة كبرى الكيانات التي نعدها شركاء نجاح، ونعمل معهم جنباً إلى جنب لتحقيق أهدافهم الاستراتيجية وحمايتهم من المخاطر القانونية.</p>
              </div>
              <div className="mt-10 grid grid-cols-3 gap-4">
                {[
                  { icon: Shield, label: "سرية تامة" },
                  { icon: Scale,  label: "عدالة وأمانة" },
                  { icon: Globe,  label: "خبرة دولية" },
                ].map(({ icon: Icon, label }, i) => (
                  <motion.div key={i} whileHover={{ scale: 1.06 }}
                    className="flex flex-col items-center gap-2 rounded-xl p-4 border text-center transition-colors"
                    style={{ background: `${BURG}80`, borderColor: `${GOLD}25` }}>
                    <Icon className="h-5 w-5" style={{ color: GOLD }} />
                    <span className="text-white/60 text-xs">{label}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Images collage */}
            <motion.div variants={fadeRight} className="relative h-[500px] md:h-[580px]">
              {/* Main image — fills full container */}
              <div className="absolute inset-0 rounded-2xl overflow-hidden border-2"
                style={{ borderColor: `${GOLD}30` }}>
                <img src={IMGS.about} alt="مكتب محاماة"
                  className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0"
                  style={{ background: `linear-gradient(to bottom, transparent 55%, ${BURG_D}dd)` }} />
              </div>
              {/* Secondary image — overlaid bottom-left corner */}
              <div className="absolute bottom-4 left-4 w-40 h-40 md:w-52 md:h-52 rounded-xl overflow-hidden border-4 shadow-2xl z-10"
                style={{ borderColor: BURG_D }}>
                <ParallaxImg src={IMGS.office} alt="مكتب" className="w-full h-full" />
                <div className="absolute inset-0"
                  style={{ background: `${BURG}40` }} />
              </div>
              {/* Stat badge — overlaid top-left */}
              <motion.div
                className="absolute top-5 left-4 rounded-2xl p-4 shadow-2xl border z-10"
                style={{ background: `${BURG_D}f0`, borderColor: `${GOLD}40` }}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, type: "spring", stiffness: 200 }}>
                <p className="text-3xl font-black" style={{ color: GOLD }}>25+</p>
                <p className="text-white/50 text-xs">سنة خبرة</p>
              </motion.div>
              {/* Gold accent circle */}
              <div className="absolute top-3 right-3 w-14 h-14 rounded-full border-4 z-10"
                style={{ borderColor: GOLD, opacity: 0.35 }} />
            </motion.div>

          </div>
        </div>
      </Section>

      {/* ══════════════ TEAM ══════════════ */}
      <Section id="team" className="relative py-28 overflow-hidden"
        style={{ background: BURG }}>
        <WaveBg speed={26} opacity={0.05} />
        <div className="container mx-auto px-6 relative z-10">
          <motion.div variants={stagger} className="text-center mb-20">
            <motion.p variants={fadeUp} className="text-sm font-semibold tracking-[0.3em] uppercase mb-4"
              style={{ color: GOLD }}>فريقنا</motion.p>
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-black text-white">شركاء النجاح</motion.h2>
            <GoldLine />
          </motion.div>

          <motion.div variants={stagger} className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((m, i) => (
              <motion.div key={i} variants={fadeUp}
                whileHover={{ y: -10, transition: { duration: 0.35, ease: "easeOut" } }}
                className="group rounded-2xl overflow-hidden border transition-all duration-400"
                style={{ borderColor: `${GOLD}20`, background: `${BURG_D}cc` }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = `${GOLD}55`; (e.currentTarget as HTMLDivElement).style.boxShadow = `0 20px 60px ${BURG_D}80`; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = `${GOLD}20`; (e.currentTarget as HTMLDivElement).style.boxShadow = "none"; }}
                data-testid={`card-lawyer-${i}`}>
                {/* Photo */}
                <div className="relative h-72 overflow-hidden">
                  <motion.img src={m.img} alt={m.name}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.08 }}
                    transition={{ duration: 0.6, ease: "easeOut" }} />
                  <div className="absolute inset-0 transition-opacity duration-300"
                    style={{ background: `linear-gradient(to top, ${BURG_D}e0 0%, transparent 55%)` }} />
                  {/* Gold bar bottom reveal */}
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 origin-right scale-x-0 group-hover:scale-x-100 transition-transform duration-500"
                    style={{ background: GOLD }} />
                </div>
                {/* Text */}
                <div className="p-7">
                  <h3 className="text-lg font-bold text-white mb-1">{m.name}</h3>
                  <p className="text-sm font-semibold mb-3" style={{ color: GOLD }}>{m.role}</p>
                  <p className="text-white/45 text-sm leading-relaxed">{m.spec}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Section>

      {/* ══════════════ FULL-WIDTH BANNER ══════════════ */}
      <section className="relative h-80 overflow-hidden flex items-center justify-center">
        <ParallaxImg src={IMGS.office} alt="مكتبنا" className="absolute inset-0 w-full h-full" />
        <div className="absolute inset-0"
          style={{ background: `${BURG_D}d8` }} />
        <WaveBg speed={20} opacity={0.07} />
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
          className="relative z-10 text-center px-6">
          <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-black text-white mb-4">
            هل تحتاج إلى استشارة قانونية؟
          </motion.h2>
          <motion.p variants={fadeUp} className="text-white/50 mb-8">فريقنا من الخبراء جاهز لمساعدتك</motion.p>
          <motion.a href="#contact" variants={fadeUp} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
            <button className="font-bold px-10 py-4 rounded-full shadow-2xl"
              style={{ background: GOLD, color: BURG_D }} data-testid="button-banner-cta">
              تواصل الآن
            </button>
          </motion.a>
        </motion.div>
      </section>

      {/* ══════════════ TESTIMONIALS ══════════════ */}
      <Section id="testimonials" className="relative py-28 overflow-hidden"
        style={{ background: BURG_D }}>
        <WaveBg speed={18} opacity={0.06} />
        <div className="container mx-auto px-6 relative z-10">
          <motion.div variants={stagger} className="text-center mb-20">
            <motion.p variants={fadeUp} className="text-sm font-semibold tracking-[0.3em] uppercase mb-4"
              style={{ color: GOLD }}>آراء العملاء</motion.p>
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-black text-white">قالوا عنا</motion.h2>
            <GoldLine />
          </motion.div>

          <motion.div variants={stagger} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div key={i} variants={fadeUp}
                whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.3 } }}
                className="relative p-8 rounded-2xl border transition-all duration-300"
                style={{ background: `${BURG}99`, borderColor: `${GOLD}20` }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = `${GOLD}50`; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = `${GOLD}20`; }}
                data-testid={`card-testimonial-${i}`}>
                <div className="flex gap-1 mb-5">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <motion.div key={s} initial={{ opacity: 0, scale: 0 }} whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }} transition={{ delay: 0.3 + s * 0.07 }}>
                      <Star className="h-4 w-4" fill={GOLD} style={{ color: GOLD }} />
                    </motion.div>
                  ))}
                </div>
                <div className="absolute top-4 left-5 text-7xl font-serif select-none leading-none"
                  style={{ color: `${GOLD}10` }}>"</div>
                <p className="text-white/55 leading-relaxed text-sm mb-6 relative z-10">{t.text}</p>
                <div className="flex items-center gap-3 pt-5 border-t" style={{ borderColor: `${GOLD}15` }}>
                  <div className="h-10 w-10 rounded-full flex items-center justify-center font-bold shrink-0 text-sm"
                    style={{ background: `${GOLD}22`, color: GOLD }}>
                    {t.author.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm">{t.author}</p>
                    <p className="text-xs" style={{ color: `${GOLD}80` }}>{t.company}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Section>

      {/* ══════════════ CONTACT ══════════════ */}
      <Section id="contact" className="relative py-28 overflow-hidden"
        style={{ background: BURG }}>
        <WaveBg speed={22} opacity={0.05} />

        {/* Background image */}
        <div className="absolute inset-0 pointer-events-none">
          <img src={IMGS.hero} alt="" className="w-full h-full object-cover opacity-5" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div variants={stagger} className="text-center mb-20">
            <motion.p variants={fadeUp} className="text-sm font-semibold tracking-[0.3em] uppercase mb-4"
              style={{ color: GOLD }}>تواصل معنا</motion.p>
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-black text-white">نحن هنا لمساعدتك</motion.h2>
            <GoldLine />
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-14">
            <motion.div variants={fadeLeft} className="lg:col-span-2 space-y-5">
              {[
                { icon: MapPin, title: "المكتب الرئيسي", val: "برج المملكة، طريق الملك فهد\nالرياض، المملكة العربية السعودية" },
                { icon: Phone, title: "الهاتف المباشر", val: "+966 11 234 5678", ltr: true },
                { icon: Mail,  title: "البريد الإلكتروني", val: "info@alghamdilegal.sa", ltr: true },
              ].map(({ icon: Icon, title, val, ltr }, i) => (
                <motion.div key={i}
                  className="flex items-start gap-4 p-5 rounded-xl border transition-colors group"
                  style={{ background: `${BURG_D}99`, borderColor: `${GOLD}20` }}
                  whileHover={{ x: -4 }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = `${GOLD}50`; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = `${GOLD}20`; }}>
                  <div className="h-11 w-11 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: `${GOLD}18` }}>
                    <Icon className="h-5 w-5" style={{ color: GOLD }} />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm mb-1">{title}</h4>
                    <p className="text-white/45 text-sm whitespace-pre-line" dir={ltr ? "ltr" : undefined}>{val}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div variants={fadeRight} className="lg:col-span-3 rounded-2xl p-8 border"
              style={{ background: `${BURG_D}cc`, borderColor: `${GOLD}25` }}>
              <h3 className="text-2xl font-bold text-white mb-6">طلب استشارة مجانية</h3>
              
              {submitMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`mb-6 p-4 rounded-lg text-center font-semibold ${
                    submitMessage.type === 'success'
                      ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                      : 'bg-red-500/20 text-red-300 border border-red-500/30'
                  }`}
                >
                  {submitMessage.text}
                </motion.div>
              )}
              
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-white/70">الاسم الكامل</label>
                    <Input 
                      placeholder="محمد عبدالله" 
                      data-testid="input-name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      required
                      className="border-white/10 bg-white/5 text-white placeholder:text-white/25 focus:border-yellow-600/50" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-white/70">رقم الهاتف</label>
                    <Input 
                      placeholder="05X XXX XXXX" 
                      dir="ltr" 
                      data-testid="input-phone"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      required
                      className="border-white/10 bg-white/5 text-white placeholder:text-white/25 focus:border-yellow-600/50" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-white/70">البريد الإلكتروني</label>
                  <Input 
                    placeholder="example@domain.com" 
                    type="email" 
                    dir="ltr" 
                    data-testid="input-email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    required
                    className="border-white/10 bg-white/5 text-white placeholder:text-white/25 focus:border-yellow-600/50" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-white/70">تفاصيل الاستشارة</label>
                  <Textarea 
                    placeholder="يرجى كتابة تفاصيل موضوعك هنا..." 
                    data-testid="input-message"
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    required
                    className="min-h-[130px] border-white/10 bg-white/5 text-white placeholder:text-white/25 focus:border-yellow-600/50 resize-none" />
                </div>
                <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="w-full py-4 rounded-xl font-bold text-base shadow-xl"
                  style={{ background: GOLD, color: BURG_D }}
                  data-testid="button-submit-contact">
                  إرسال الطلب
                </motion.button>
              </form>
            </motion.div>
          </div>
        </div>
      </Section>

      {/* ══════════════ FOOTER ══════════════ */}
      <footer className="relative pt-16 pb-8 overflow-hidden border-t"
        style={{ background: BURG_D, borderColor: `${GOLD}20` }}>
        <WaveBg speed={30} opacity={0.04} />
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-5">
                <motion.div className="h-11 w-11 rounded-full border-2 flex items-center justify-center"
                  style={{ borderColor: `${GOLD}50`, background: `${BURG}80` }}
                  whileHover={{ rotate: 10 }}>
                  <Scale className="h-5 w-5" style={{ color: GOLD }} />
                </motion.div>
                <div>
                  <p className="font-black text-white text-lg leading-tight">الغامدي وشركاه</p>
                  <p className="text-[10px]" style={{ color: `${GOLD}80` }}>للمحاماة والاستشارات القانونية</p>
                </div>
              </div>
              <p className="text-white/35 text-sm leading-relaxed max-w-sm">
                خيارك الأول للاستشارات القانونية الموثوقة والتمثيل القضائي الاحترافي في المملكة العربية السعودية.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-5 text-xs tracking-widest uppercase" style={{ color: `${GOLD}90` }}>روابط سريعة</h4>
              <ul className="space-y-3">
                {[["من نحن","about"],["خدماتنا","practices"],["فريق العمل","team"],["تواصل معنا","contact"]].map(([l,h]) => (
                  <li key={h}><a href={`#${h}`} className="text-white/35 hover:text-white text-sm transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-5 text-xs tracking-widest uppercase" style={{ color: `${GOLD}90` }}>ساعات العمل</h4>
              <ul className="space-y-2 text-white/35 text-sm">
                <li>الأحد — الخميس</li>
                <li style={{ color: `${GOLD}80` }}>8:00 ص — 5:00 م</li>
                <li className="mt-2">الجمعة — السبت</li>
                <li className="text-red-400/50">مغلق</li>
              </ul>
            </div>
          </div>
          <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 border-t"
            style={{ borderColor: `${GOLD}12` }}>
            <p className="text-white/25 text-xs">
              © {new Date().getFullYear()} شركة الغامدي وشركاه للمحاماة والاستشارات القانونية. جميع الحقوق محفوظة.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-white/25 hover:text-white/60 text-xs transition-colors">سياسة الخصوصية</a>
              <a href="#" className="text-white/25 hover:text-white/60 text-xs transition-colors">شروط الاستخدام</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
