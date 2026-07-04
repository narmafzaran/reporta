import React, { useState } from "react";
import { MediaWebsite } from "../types";
import { MOCK_WEBSITES } from "../data";
import {
  Sparkles,
  Globe,
  Search,
  PenTool,
  Wallet,
  ArrowLeft,
  CheckCircle2,
  Zap,
  BarChart3,
  Users,
  Check,
  HelpCircle,
  TrendingUp,
  ShieldCheck,
  Award,
  MessageSquare,
  ChevronLeft,
  FileText,
  Star,
  Plus
} from "lucide-react";

interface LandingPageViewProps {
  onStartAsAdvertiser: () => void;
  onStartAsPublisher: () => void;
  onLoginClick: () => void;
}

export default function LandingPageView({
  onStartAsAdvertiser,
  onStartAsPublisher,
  onLoginClick
}: LandingPageViewProps) {
  // Category filter state for live directory
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Categories translation
  const CATEGORIES = [
    { id: "all", label: "همه رسانه‌ها" },
    { id: "technology", label: "فناوری و تکنولوژی" },
    { id: "news", label: "اخبار و خبرگزاری" },
    { id: "finance", label: "اقتصاد و بازار مالی" },
    { id: "lifestyle", label: "سبک زندگی و خانواده" },
    { id: "sports", label: "ورزش و سرگرمی" }
  ];

  // Filtering websites for preview
  const filteredWebsites = MOCK_WEBSITES.filter((site) => {
    const matchesCategory = selectedCategory === "all" || site.category === selectedCategory;
    const matchesSearch = site.name.includes(searchQuery) || site.domain.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // State for FAQ accordion
  const [faqOpenIndex, setFaqOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setFaqOpenIndex(faqOpenIndex === index ? null : index);
  };

  const FAQS = [
    {
      q: "رپورتاژ آگهی چیست و چگونه به سئو سایت کمک می‌کند؟",
      a: "رپورتاژ آگهی یک مقاله خبری، آموزشی یا تحلیلی است که در رسانه‌ها و خبرگزاری‌های معتبر منتشر شده و شامل لینک‌های مستقیم (بک‌لینک) به وب‌سایت شماست. اعتبار بالای این رسانه‌ها (Domain Authority) مستقیماً به سایت شما منتقل شده و رتبه شما را در نتایج جستجوی گوگل ارتقا می‌دهد."
    },
    {
      q: "مزیت ویرایشگر مجهز به هوش مصنوعی رپورتا در چیست؟",
      a: "با هوش مصنوعی رپورتا، نیازی نیست نگران نحوه نگارش یا بهینه‌سازی رپورتاژ خود باشید. هوش مصنوعی ما متن شما را تحلیل کرده، ساختار خوانایی و چگالی کلمات کلیدی را بهبود می‌بخشد، و حتی بر اساس آدرس‌های شما، مناسب‌ترین عبارات را برای لینک‌سازی پیشنهاد می‌دهد تا بیشترین بازدهی سئو به دست آید."
    },
    {
      q: "آیا در صورت رد شدن رپورتاژ توسط رسانه، وجه من عودت داده می‌شود؟",
      a: "بله، ۱۰۰٪. هزینه رپورتاژ تا زمان تایید نهایی و انتشار توسط رسانه به صورت امن در پلتفرم رپورتا امانت می‌ماند. در صورتی که رسانه درخواست شما را رد کند یا در زمان مقرر منتشر نسازد، هزینه بلافاصله و بدون کسر هیچ‌گونه کارمزدی به کیف پول شما برگشت داده می‌شود."
    },
    {
      q: "تفاوت لینک‌های Do-Follow و No-Follow چیست؟",
      a: "لینک‌های Do-Follow ارزش و اعتبار دامنه مبدا را به صورت مستقیم به سایت شما انتقال می‌دهند که ارزش سئوی بسیار بالایی دارد. لینک‌های No-Follow برای طبیعی جلوه دادن پروفایل بک‌لینک سایت شما ضروری هستند و ترافیک ارگانیک واقعی جذب می‌کنند."
    },
    {
      q: "چگونه می‌توانم به عنوان ناشر رسانه در رپورتا ثبت‌نام کنم و درآمد داشته باشم؟",
      a: "کافیست از بالای صفحه دکمه «پنل رسانه‌دار» را انتخاب کنید. پس از ورود به پنل خود، می‌توانید دامنه‌های وب‌سایت، تعرفه‌ها، شرایط نگارش و زمان تحویل خود را ثبت کنید. سفارش‌های کاربران به صورت مستقیم برای شما ارسال می‌شوند و پس از درج لینک در سایت خود و ثبت لینک نهایی، بلافاصله وجه خود را تسویه خواهید کرد."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans antialiased selection:bg-blue-600 selection:text-white" dir="rtl">
      {/* Landing Navbar */}
      <nav className="bg-white border-b border-slate-100 sticky top-0 z-50 shadow-xs/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          {/* Logo Brand */}
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 text-white p-2.5 rounded-xl shadow-md shadow-blue-600/20">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h1 className="font-black text-slate-800 text-base leading-none">رپورتا</h1>
              <span className="text-[9px] text-slate-400 font-bold block mt-0.5">پلتفرم هوشمند رپورتاژ آگهی و سئو</span>
            </div>
          </div>

          {/* Nav Actions */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={onLoginClick}
              className="text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-4 py-2.5 rounded-xl transition-all cursor-pointer"
            >
              ورود به پنل کاربری
            </button>
            <button
              onClick={onStartAsAdvertiser}
              className="text-xs font-black text-white bg-blue-600 hover:bg-blue-700 px-4.5 py-2.5 rounded-xl shadow-lg shadow-blue-500/10 hover:shadow-blue-500/25 transition-all cursor-pointer"
            >
              شروع رایگان کمپین
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-white to-slate-50/50 pt-16 pb-20 border-b border-slate-100">
        {/* Abstract Background Accents */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-indigo-100/30 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 md:px-6 text-center space-y-8 relative z-10">
          <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3.5 py-1.5 rounded-full text-[10px] md:text-xs font-black shadow-xs border border-blue-100/50 mx-auto">
            <Zap className="w-3.5 h-3.5" />
            <span>انقلاب سئو و رپورتاژ آگهی با فناوری هوش مصنوعی مدرن</span>
          </div>

          <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-tight md:leading-[1.15] max-w-4xl mx-auto">
            با <span className="text-blue-600 relative inline-block">رپورتا<span className="absolute left-0 bottom-1 w-full h-1.5 bg-blue-200/50 -z-1" /></span>، رتبه اول نتایج جستجوی گوگل در دستان شماست
          </h2>

          <p className="text-slate-500 text-xs md:text-sm leading-relaxed max-w-2xl mx-auto">
            بدون واسطه رپورتاژ آگهی خود را در رسانه‌ها و خبرگزاری‌های معتبر کشور منتشر کنید. از نویسنده هوشمند مجهز به هوش مصنوعی برای تولید متون بی نقص سئو استفاده کرده و نتایج را به صورت زنده رصد نمایید.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button
              onClick={onStartAsAdvertiser}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs px-8 py-4 rounded-xl transition-all shadow-xl shadow-blue-500/20 cursor-pointer"
            >
              <span>من آگهی‌دهنده هستم (ثبت رپورتاژ)</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              onClick={onStartAsPublisher}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 font-extrabold text-xs px-8 py-4 rounded-xl transition-all shadow-xs cursor-pointer"
            >
              <span>من رسانه‌دار هستم (کسب درآمد)</span>
              <Globe className="w-4 h-4 text-slate-500" />
            </button>
          </div>

          {/* Quick trust notes */}
          <div className="flex items-center justify-center gap-6 pt-6 flex-wrap text-[10px] text-slate-400 font-black">
            <div className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>ضمانت ۱۰۰٪ عودت وجه فورا</span>
            </div>
            <div className="flex items-center gap-1">
              <Award className="w-4 h-4 text-amber-500" />
              <span>ارزان‌ترین نرخ بازار بدون واسطه</span>
            </div>
            <div className="flex items-center gap-1">
              <Sparkles className="w-4 h-4 text-blue-500" />
              <span>دستیار هوش مصنوعی رایگان نگارش</span>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Strip */}
      <section className="bg-white border-b border-slate-100 py-10 relative z-10 -mt-8 mx-4 md:mx-auto max-w-5xl rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200/50">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x md:divide-x-reverse divide-slate-100 text-center gap-6 md:gap-0">
          <div className="space-y-1">
            <span className="block text-2xl md:text-3xl font-black text-blue-600 font-mono" dir="ltr">+۸۵۰</span>
            <span className="block text-[10px] md:text-xs text-slate-400 font-bold">رسانه و خبرگزاری فعال</span>
          </div>
          <div className="space-y-1">
            <span className="block text-2xl md:text-3xl font-black text-slate-800 font-mono" dir="ltr">+۱۲,۴۰۰</span>
            <span className="block text-[10px] md:text-xs text-slate-400 font-bold">رپورتاژ منتشر شده موفق</span>
          </div>
          <div className="space-y-1">
            <span className="block text-2xl md:text-3xl font-black text-slate-800 font-mono" dir="ltr">۳۵٪</span>
            <span className="block text-[10px] md:text-xs text-slate-400 font-bold">کاهش هزینه‌های دیجیتال مارکتینگ</span>
          </div>
          <div className="space-y-1">
            <span className="block text-2xl md:text-3xl font-black text-slate-800 font-mono" dir="ltr">۹۹.۴٪</span>
            <span className="block text-[10px] md:text-xs text-slate-400 font-bold">رضایت سئوکاران و آژانس‌ها</span>
          </div>
        </div>
      </section>

      {/* Feature Bento-Grid Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 md:px-6 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-extrabold border border-blue-100/50">چرا پلتفرم رپورتا؟</span>
          <h3 className="text-xl md:text-3xl font-black text-slate-900 leading-snug">امکانات فوق‌پیشرفته و هوشمند برای کسب بهترین جایگاه در گوگل</h3>
          <p className="text-slate-500 text-xs leading-relaxed">رپورتا فراتر از یک کاتالوگ ساده، یک دستیار کامل و هوشمند برای خودکارسازی فرآیند لینک‌سازی و سئوی خارجی شماست.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-xs flex flex-col gap-4 hover:shadow-lg hover:border-slate-300 transition-all text-right">
            <div className="bg-blue-50 text-blue-600 p-3.5 rounded-2xl w-fit">
              <Search className="w-6 h-6" />
            </div>
            <h4 className="font-extrabold text-slate-800 text-sm">کاتالوگ هوشمند با به‌روزترین معیارهای سئو</h4>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              مشاهده آنی معیارهای کلیدی مانند Domain Authority (DA)، درصد اسپم اسکور (SS)، رتبه الکسا، حداکثر زمان تحویل و قوانین اختصاصی هر وب‌سایت برای اتخاذ بهترین تصمیم.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-xs flex flex-col gap-4 hover:shadow-lg hover:border-slate-300 transition-all text-right">
            <div className="bg-indigo-50 text-indigo-600 p-3.5 rounded-2xl w-fit">
              <PenTool className="w-6 h-6" />
            </div>
            <h4 className="font-extrabold text-slate-800 text-sm">ویراستار و نویسنده با هوش مصنوعی</h4>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              تنها با وارد کردن یک ایده اولیه، مقاله رپورتاژ خود را به صورت کاملاً بهینه‌سازی شده همراه با پاراگراف‌بندی استاندارد، هدینگ‌ها و لینک‌سازی طبیعی در کمتر از ۳۰ ثانیه تحویل بگیرید.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-xs flex flex-col gap-4 hover:shadow-lg hover:border-slate-300 transition-all text-right">
            <div className="bg-emerald-50 text-emerald-600 p-3.5 rounded-2xl w-fit">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="font-extrabold text-slate-800 text-sm">تضمین ۱۰۰٪ امنیت مالی و فاکتور رسمی</h4>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              پرداخت امن و نگهداری وجه نزد پلتفرم تا زمان انتشار تایید شده رپورتاژ. عودت آنی کل مبلغ در صورت عدم تایید یا انصراف رسانه، به همراه امکان دریافت فاکتور رسمی برای آژانس‌ها و شرکت‌ها.
            </p>
          </div>

          {/* Card 4 - Large 2/3 block */}
          <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xs md:col-span-2 flex flex-col md:flex-row gap-6 items-center justify-between text-right overflow-hidden relative">
            <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
            <div className="space-y-4 relative z-10 flex-1">
              <span className="text-[10px] bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full font-black border border-blue-500/30">آنالیز زنده سئو</span>
              <h4 className="font-extrabold text-base md:text-lg">قبل از ارسال رپورتاژ، نمره سئوی آن را بدانید!</h4>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                موتور آنالیزور هوش مصنوعی رپورتا متن نگارش شده شما را بر اساس چگالی کلمات کلیدی، صحت لینک‌سازی خارجی، عمق محتوا و جذابیت هدینگ‌ها ارزیابی کرده و پیش از ارسال به رسانه، ایرادات ساختاری آن را رفع می‌کند.
              </p>
              <button
                onClick={onStartAsAdvertiser}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2 px-5 rounded-xl transition-all cursor-pointer flex items-center gap-1 w-fit"
              >
                <span>تست آنلاین آنالیزور</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
            <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 w-full md:w-72 shrink-0 space-y-3 font-sans text-xs relative z-10 text-right">
              <div className="flex justify-between items-center pb-2 border-b border-slate-700">
                <span className="font-black text-slate-200">وضعیت سئو رپورتاژ</span>
                <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded text-[10px]">عالی ۹۲٪</span>
              </div>
              <div className="space-y-2 text-[10px] text-slate-300">
                <div className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span>چگالی کلمات کلیدی استاندارد است.</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span>تعداد لینک‌ها (۳ لینک فالو) بهینه است.</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span>ساختار درختی تگ‌های H رعایت شده است.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 5 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-xs flex flex-col gap-4 hover:shadow-lg hover:border-slate-300 transition-all text-right">
            <div className="bg-amber-50 text-amber-600 p-3.5 rounded-2xl w-fit">
              <Wallet className="w-6 h-6" />
            </div>
            <h4 className="font-extrabold text-slate-800 text-sm">برداشت و تسویه سریع برای صاحبان رسانه</h4>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              اگر مالک سایت یا وبلاگ هستید، سفارش‌های رپورتاژ را مستقیماً دریافت کرده، منتشر کنید و وجه مربوطه را پس از ثبت لینک نهایی با امنیت خاطر و تسویه پایا تحویل بگیرید.
            </p>
          </div>
        </div>
      </section>

      {/* Live Catalog Directory Preview */}
      <section className="bg-white py-20 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 md:px-6 space-y-12">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
            <div className="space-y-3 text-right">
              <span className="text-xs bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full font-extrabold border border-emerald-100/50">پیش‌نمایش رسانه‌های رپورتا</span>
              <h3 className="text-xl md:text-3xl font-black text-slate-900">جستجو و فیلتر زنده بین برترین خبرگزاری‌ها و رسانه‌های تخصصی</h3>
              <p className="text-slate-500 text-xs">تعرفه و شاخص‌های کیفی رسانه‌های هدف خود را با هم مقایسه کنید.</p>
            </div>
            
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <input
                type="text"
                placeholder="جستجوی نام رسانه یا دامنه..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2.5 pr-10 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 text-slate-700 text-right"
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
            </div>
          </div>

          {/* Categories Tab selector */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2" dir="rtl">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer shrink-0 whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/10"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Directory Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWebsites.slice(0, 6).map((site) => (
              <div key={site.id} className="p-5 bg-slate-50/50 border border-slate-200/70 rounded-2xl hover:bg-white hover:shadow-xl hover:border-slate-200 transition-all flex flex-col justify-between text-right">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-black text-sm">
                        {site.logo}
                      </div>
                      <div>
                        <h4 className="font-extrabold text-slate-800 text-sm">{site.name}</h4>
                        <span className="text-[9px] text-slate-400 font-mono" dir="ltr">{site.domain}</span>
                      </div>
                    </div>
                    <span className="text-[9px] bg-slate-100 text-slate-600 px-2 py-1 rounded-md font-extrabold">
                      {site.categoryLabel}
                    </span>
                  </div>

                  {/* Description snippet */}
                  <p className="text-slate-500 text-[10px] leading-relaxed mb-4 line-clamp-2">
                    {site.description}
                  </p>

                  {/* SEO Metrics Grid */}
                  <div className="grid grid-cols-3 gap-2 bg-white p-3 rounded-xl border border-slate-100 text-center mb-4">
                    <div>
                      <span className="block text-[8px] text-slate-400 font-bold mb-0.5">اعتبار دامنه (DA)</span>
                      <span className="text-xs font-black text-slate-800 font-mono">{site.domainAuthority}</span>
                    </div>
                    <div>
                      <span className="block text-[8px] text-slate-400 font-bold mb-0.5">اسپم اسکور</span>
                      <span className="text-xs font-black text-slate-800 font-mono">{site.spamScore}٪</span>
                    </div>
                    <div>
                      <span className="block text-[8px] text-slate-400 font-bold mb-0.5">زمان تحویل</span>
                      <span className="text-xs font-black text-slate-800">{site.deliveryTime}</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Row */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <div>
                    <span className="block text-[8px] text-slate-400 font-semibold">تعرفه رپورتاژ فالو</span>
                    <span className="text-xs font-black text-slate-900 font-mono">
                      {site.price.toLocaleString("fa-IR")} <span className="text-[9px] text-slate-400 font-bold">تومان</span>
                    </span>
                  </div>
                  <button
                    onClick={onStartAsAdvertiser}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-black py-2 px-3.5 rounded-xl transition-all cursor-pointer flex items-center gap-1"
                  >
                    <span>سفارش رپورتاژ</span>
                    <ArrowLeft className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
            
            {filteredWebsites.length === 0 && (
              <div className="col-span-full py-12 text-center text-slate-400 text-xs font-bold">
                هیچ رسانه‌ای با مشخصات جستجو شده یافت نشد.
              </div>
            )}
          </div>

          {/* CTA under catalog */}
          <div className="pt-4 text-center">
            <button
              onClick={onStartAsAdvertiser}
              className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-700 text-xs font-black hover:underline cursor-pointer"
            >
              <span>مشاهده و مقایسه بیش از ۸۵۰ رسانه دیگر در کاتالوگ کامل رپورتا</span>
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>

        </div>
      </section>

      {/* Workflow Steps Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 md:px-6 space-y-16">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full font-extrabold border border-indigo-100/50">راهنمای پلتفرم</span>
          <h3 className="text-xl md:text-3xl font-black text-slate-900">مراحل ساده انتشار رپورتاژ آگهی از ابتدا تا انتها</h3>
          <p className="text-slate-500 text-xs">در کمتر از چند دقیقه سفارش خود را آماده، بهینه‌سازی و روانه معتبرترین رسانه‌های کشور کنید.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-16 right-36 left-36 h-0.5 bg-slate-200/70 -z-1" />

          {/* Step 1 */}
          <div className="text-center space-y-3 flex flex-col items-center">
            <div className="w-12 h-12 rounded-2xl bg-white border-2 border-blue-600 flex items-center justify-center font-black text-blue-600 shadow-md relative">
              <span className="font-mono text-base">۱</span>
              <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-blue-100 rounded-full flex items-center justify-center border border-blue-500 text-[8px] text-blue-700 font-bold">
                ✓
              </div>
            </div>
            <h4 className="font-extrabold text-slate-800 text-xs mt-2">شارژ حساب و ایجاد کمپین</h4>
            <p className="text-slate-400 text-[10px] leading-relaxed max-w-[200px]">
              کیف پول خود را به مبلغ مورد نظر شارژ کرده و برای سازماندهی بهتر کلمات کلیدی، یک کمپین سئو بسازید.
            </p>
          </div>

          {/* Step 2 */}
          <div className="text-center space-y-3 flex flex-col items-center">
            <div className="w-12 h-12 rounded-2xl bg-white border-2 border-slate-200 flex items-center justify-center font-black text-slate-500 shadow-xs">
              <span className="font-mono text-base">۲</span>
            </div>
            <h4 className="font-extrabold text-slate-800 text-xs mt-2">انتخاب رسانه و نگارش رپورتاژ</h4>
            <p className="text-slate-400 text-[10px] leading-relaxed max-w-[200px]">
              رسانه‌های دلخواه خود را به سبد خرید افزوده و با استفاده از هوش مصنوعی رپورتا، شروع به نگارش و لینک‌سازی مقاله کنید.
            </p>
          </div>

          {/* Step 3 */}
          <div className="text-center space-y-3 flex flex-col items-center">
            <div className="w-12 h-12 rounded-2xl bg-white border-2 border-slate-200 flex items-center justify-center font-black text-slate-500 shadow-xs">
              <span className="font-mono text-base">۳</span>
            </div>
            <h4 className="font-extrabold text-slate-800 text-xs mt-2">تایید و انتشار سریع توسط رسانه</h4>
            <p className="text-slate-400 text-[10px] leading-relaxed max-w-[200px]">
              مقاله نهایی برای ناشر وب‌سایت ارسال می‌شود تا طبق زمان‌بندی انتخاب شده شما منتشر گردد.
            </p>
          </div>

          {/* Step 4 */}
          <div className="text-center space-y-3 flex flex-col items-center">
            <div className="w-12 h-12 rounded-2xl bg-white border-2 border-slate-200 flex items-center justify-center font-black text-slate-500 shadow-xs">
              <span className="font-mono text-base">۴</span>
            </div>
            <h4 className="font-extrabold text-slate-800 text-xs mt-2">رصد نتایج و ارتقای سئو</h4>
            <p className="text-slate-400 text-[10px] leading-relaxed max-w-[200px]">
              لینک نهایی تایید شده را در پنل کاربری مشاهده کرده و با بهبود رتبه در موتورهای جستجو، ورودی ارگانیک جذب کنید.
            </p>
          </div>
        </div>
      </section>

      {/* Reviews Testimonial Section */}
      <section className="bg-slate-50 py-20 border-t border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs bg-amber-50 text-amber-600 px-3 py-1 rounded-full font-extrabold border border-amber-100/50">نظرات مشتریان ما</span>
            <h3 className="text-xl md:text-3xl font-black text-slate-900">سئوکاران و آژانس‌های بازاریابی دیجیتال درباره ما چه می‌گویند؟</h3>
            <p className="text-slate-500 text-xs">نظرات برخی از متخصصان سئو کشور که رشد رتبه‌های ارگانیک خود را به رپورتا سپرده‌اند.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Review 1 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-xs text-right space-y-4">
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-500" />
                ))}
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed font-medium">
                «بزرگترین مشکل ما در خرید رپورتاژ، واسطه‌های متعدد و فاکتورهای نامشخص بود. با رپورتا نه تنها مستقیماً با ناشر کار می‌کنیم و قیمت نهایی پایین‌تر آمده، بلکه ابزار آنالیزور سئو و ویرایشگر هوش مصنوعی فوق‌العاده کاربردی هستند.»
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
                <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-black text-xs">
                  م
                </div>
                <div>
                  <h5 className="font-extrabold text-slate-800 text-[11px]">محسن رضایی</h5>
                  <span className="text-[8px] text-slate-400 block mt-0.5">مدیر سئو آژانس وب‌سیما</span>
                </div>
              </div>
            </div>

            {/* Review 2 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-xs text-right space-y-4">
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-500" />
                ))}
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed font-medium">
                «من مالک سه سایت تکنولوژی بزرگ هستم. ثبت‌نام در رپورتا درآمد ما را از رپورتاژ دو برابر کرده است. تسویه حساب‌ها فوق‌العاده سریع و منظم انجام می‌شود و کل فرآیند ارسال متن و درج لینک، بدون دخالت فیزیکی و کاملاً اتوماتیک است.»
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
                <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-black text-xs">
                  س
                </div>
                <div>
                  <h5 className="font-extrabold text-slate-800 text-[11px]">سارا کریمی</h5>
                  <span className="text-[8px] text-slate-400 block mt-0.5">مدیر رسانه دیجی‌تک و وبلاگ‌نویس</span>
                </div>
              </div>
            </div>

            {/* Review 3 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-xs text-right space-y-4">
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-500" />
                ))}
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed font-medium">
                «ابزار نگارش با هوش مصنوعی برای من معجزه کرد. وقتی نیاز به انتشار چندین رپورتاژ در روز داریم، این پلتفرم در کمتر از چند دقیقه مقالاتی روان، شیوا و کاملاً مرتبط تولید می‌کند که نرخ کلیک و بک‌لینک بی‌نظیری دارند.»
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
                <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-black text-xs">
                  ع
                </div>
                <div>
                  <h5 className="font-extrabold text-slate-800 text-[11px]">علی مرادی</h5>
                  <span className="text-[8px] text-slate-400 block mt-0.5">کارشناس ارشد سئو دیجی‌کالا</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="py-20 max-w-4xl mx-auto px-4 md:px-6 space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs bg-slate-200/70 text-slate-600 px-3 py-1 rounded-full font-extrabold">سوالات متداول</span>
          <h3 className="text-xl md:text-3xl font-black text-slate-900">پاسخ به سوالات پرتکرار شما درباره پلتفرم</h3>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, idx) => (
            <div key={idx} className="bg-white border border-slate-200/70 rounded-2xl overflow-hidden transition-all text-right">
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full p-5 flex items-center justify-between text-right font-extrabold text-slate-800 text-xs md:text-sm cursor-pointer hover:bg-slate-50 transition-colors"
              >
                <span>{faq.q}</span>
                <HelpCircle className={`w-5 h-5 shrink-0 text-slate-400 transition-transform ${faqOpenIndex === idx ? "rotate-180 text-blue-600" : ""}`} />
              </button>
              
              {faqOpenIndex === idx && (
                <div className="p-5 pt-0 text-slate-500 text-[11px] leading-relaxed border-t border-slate-100 bg-slate-50/50">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Call To Action Banner */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 pb-20">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-3xl p-8 md:p-12 text-center relative overflow-hidden shadow-2xl shadow-blue-600/10">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-black/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="max-w-2xl mx-auto space-y-6 relative z-10">
            <h3 className="text-xl md:text-3xl font-black">آماده‌اید رتبه سئوی وب‌سایت خود را دگرگون کنید؟</h3>
            <p className="text-blue-100 text-[11px] md:text-xs leading-relaxed">
              همین امروز به جمع صدها آژانس، کسب‌وکار نوپا و برند معروفی بپیوندید که فرآیند بک‌لینک و ثبت رپورتاژ آگهی خود را با رپورتا خودکارسازی کرده‌اند.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={onStartAsAdvertiser}
                className="w-full sm:w-auto bg-white hover:bg-slate-50 text-blue-700 font-black text-xs px-8 py-3.5 rounded-xl shadow-lg shadow-black/10 transition-all cursor-pointer"
              >
                ایجاد اولین کمپین سئو
              </button>
              <button
                onClick={onStartAsPublisher}
                className="w-full sm:w-auto bg-blue-700/50 hover:bg-blue-700 text-white border border-blue-500 font-bold text-xs px-8 py-3.5 rounded-xl transition-all cursor-pointer"
              >
                ثبت رسانه جدید به عنوان ناشر
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200/60 py-12 mt-auto text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-3 gap-8 items-center text-right">
          
          {/* Logo and Copyright */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 justify-start">
              <div className="bg-blue-600 text-white p-2 rounded-lg">
                <Sparkles className="w-4 h-4" />
              </div>
              <h2 className="font-extrabold text-slate-800 text-sm">رپورتا</h2>
            </div>
            <p className="text-[10px] leading-relaxed max-w-sm text-slate-500">
              رپورتا، سامانه هوشمند خرید و ثبت رپورتاژ آگهی مجهز به هوش مصنوعی نویسنده و ابزار تحلیل خودکار سئو. تمامی حقوق محفوظ است. ۱۴۰۶
            </p>
          </div>

          {/* Quick links */}
          <div className="flex gap-10 text-[11px] font-bold text-slate-600">
            <div className="space-y-2">
              <span className="text-[10px] text-slate-400 font-black block">خدمات آگهی‌دهندگان</span>
              <button onClick={onStartAsAdvertiser} className="block hover:text-blue-600 cursor-pointer">کاتالوگ رسانه‌ها</button>
              <button onClick={onStartAsAdvertiser} className="block hover:text-blue-600 cursor-pointer">نویسنده رپورتاژ با هوش مصنوعی</button>
            </div>
            <div className="space-y-2">
              <span className="text-[10px] text-slate-400 font-black block">خدمات رسانه‌داران</span>
              <button onClick={onStartAsPublisher} className="block hover:text-blue-600 cursor-pointer">کسب درآمد از سایت</button>
              <button onClick={onStartAsPublisher} className="block hover:text-blue-600 cursor-pointer">قوانین و راهنما</button>
            </div>
          </div>

          {/* Guarantee Badges */}
          <div className="flex gap-4 items-center justify-start md:justify-end">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/50 flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-emerald-600" />
              <div>
                <span className="block text-[9px] text-slate-800 font-black">پرداخت امن رپورتاژ</span>
                <span className="block text-[8px] text-slate-400 font-medium">تضمین ۱۰۰٪ امنیت مالی</span>
              </div>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/50 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-blue-600" />
              <div>
                <span className="block text-[9px] text-slate-800 font-black">رشد رتبه سئو گوگل</span>
                <span className="block text-[8px] text-slate-400 font-medium">تضمین بک‌لینک مستقیم</span>
              </div>
            </div>
          </div>

        </div>
        
        <div className="pt-8 mt-8 border-t border-slate-100 text-[10px] text-slate-400">
          طراحی و توسعه یافته با ❤️ در پلتفرم هوشمند رپورتا — کلوپ سئوکاران ایران
        </div>
      </footer>
    </div>
  );
}
