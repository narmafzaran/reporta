import React, { useState, useMemo } from "react";
import { MediaWebsite } from "../types";
import { Search, Filter, ArrowUpDown, ShieldCheck, Link2, Clock, Globe, List, Grid, ShoppingBag, PlusCircle, Info, FileText, Zap, ShieldAlert, X, CheckCircle2 } from "lucide-react";

interface CatalogViewProps {
  websites: MediaWebsite[];
  onSelectWebsite: (website: MediaWebsite) => void;
  userWalletBalance: number;
  cart?: MediaWebsite[];
  onAddToCart?: (website: MediaWebsite) => void;
}

export default function CatalogView({
  websites,
  onSelectWebsite,
  userWalletBalance,
  cart = [],
  onAddToCart,
}: CatalogViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedLinkType, setSelectedLinkType] = useState<string>("all");
  const [minDA, setMinDA] = useState<number>(0);
  const [maxSpam, setMaxSpam] = useState<number>(10);
  const [maxPrice, setMaxPrice] = useState<number>(4000000);
  const [sortBy, setSortBy] = useState<string>("da-desc");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedWebsiteDetails, setSelectedWebsiteDetails] = useState<MediaWebsite | null>(null);
  const [activeTab, setActiveTab] = useState<"info" | "rules" | "features">("info");

  // Format currency helper
  const formatPrice = (price: number) => {
    return price.toLocaleString("fa-IR") + " تومان";
  };

  const categories = [
    { value: "all", label: "همه دسته‌ها" },
    { value: "technology", label: "فناوری و تکنولوژی" },
    { value: "news", label: "اخبار و خبرگزاری" },
    { value: "lifestyle", label: "سبک زندگی و خانواده" },
    { value: "finance", label: "اقتصاد و بازار مالی" },
    { value: "education", label: "آموزشی و موفقیت" },
    { value: "sports", label: "ورزش و سرگرمی" },
  ];

  // Filter and sort logic
  const filteredWebsites = useMemo(() => {
    return websites
      .filter((site) => {
        const matchesSearch =
          site.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          site.domain.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory =
          selectedCategory === "all" || site.category === selectedCategory;
        const matchesLinkType =
          selectedLinkType === "all" || site.linkType === selectedLinkType;
        const matchesDA = site.domainAuthority >= minDA;
        const matchesSpam = site.spamScore <= maxSpam;
        const matchesPrice = site.price <= maxPrice;

        return matchesSearch && matchesCategory && matchesLinkType && matchesDA && matchesSpam && matchesPrice;
      })
      .sort((a, b) => {
        if (sortBy === "da-desc") return b.domainAuthority - a.domainAuthority;
        if (sortBy === "price-asc") return a.price - b.price;
        if (sortBy === "price-desc") return b.price - a.price;
        if (sortBy === "alexa-asc") return a.alexaRank - b.alexaRank;
        return 0;
      });
  }, [websites, searchQuery, selectedCategory, selectedLinkType, minDA, maxSpam, maxPrice, sortBy]);

  return (
    <div className="space-y-6 text-right animate-fade-in" dir="rtl">
      
      {/* Title & Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-black text-slate-800">کاتالوگ و لیست رسانه‌ها</h2>
          <p className="text-slate-500 text-xs mt-1">از بین معتبرترین خبرگزاری‌ها، وبلاگ‌ها و سایت‌های تخصصی ایران رسانه مناسب کمپین خود را انتخاب کنید.</p>
        </div>
        <div className="flex items-center gap-3 bg-emerald-50 text-emerald-800 px-4 py-2.5 rounded-xl border border-emerald-100 self-start md:self-auto">
          <ShoppingBag className="w-5 h-5 text-emerald-600" />
          <div className="text-xs">
            <span className="block font-medium text-slate-500 text-[10px]">موجودی کیف پول شما:</span>
            <span className="font-extrabold text-sm">{formatPrice(userWalletBalance)}</span>
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        {/* Search & Mode toggles */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-2 relative">
            <Search className="absolute right-3.5 top-3 w-4.5 h-4.5 text-slate-400" />
            <input
              type="text"
              placeholder="جستجوی نام رسانه یا دامنه (مثلاً زومیت، digiato)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-10 pl-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 placeholder-slate-400 text-slate-700 bg-slate-50/50"
            />
          </div>

          <div className="flex gap-2">
            <div className="relative flex-1">
              <Filter className="absolute right-3 top-3 w-4 h-4 text-slate-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pr-9 pl-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-slate-50/50 text-slate-600"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between lg:justify-end gap-3">
            {/* Sort order */}
            <div className="relative w-full lg:w-auto">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full lg:w-auto pr-3 pl-8 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-slate-50/50 text-slate-600 appearance-none"
              >
                <option value="da-desc">بیشترین اعتبار دامنه (DA)</option>
                <option value="price-asc">ارزان‌ترین قیمت رپورتاژ</option>
                <option value="price-desc">گران‌ترین قیمت رپورتاژ</option>
                <option value="alexa-asc">بهترین رتبه الکسا ایران</option>
              </select>
              <ArrowUpDown className="absolute left-3 top-3 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Detailed Metrics Sliders */}
        <div className="pt-3 border-t border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* DA Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-600">حداقل اعتبار دامنه (DA)</span>
              <span className="text-blue-600">{minDA}+</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={minDA}
              onChange={(e) => setMinDA(parseInt(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer h-1.5 bg-slate-100 rounded-lg"
            />
          </div>

          {/* Spam Score Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-600">حداکثر اسپم اسکور (Spam Score)</span>
              <span className="text-amber-600">{maxSpam}%</span>
            </div>
            <input
              type="range"
              min="1"
              max="30"
              value={maxSpam}
              onChange={(e) => setMaxSpam(parseInt(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer h-1.5 bg-slate-100 rounded-lg"
            />
          </div>

          {/* Price Cap Filter */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-600">حداکثر قیمت رپورتاژ</span>
              <span className="text-emerald-600">{formatPrice(maxPrice)}</span>
            </div>
            <input
              type="range"
              min="500000"
              max="4000000"
              step="100000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(parseInt(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-slate-100 rounded-lg"
            />
          </div>
        </div>

        {/* Additional Filters */}
        <div className="pt-2 flex flex-wrap gap-4 items-center">
          <span className="text-xs text-slate-400 font-medium">نوع لینک:</span>
          <div className="flex gap-2">
            {[
              { value: "all", label: "همه لینک‌ها" },
              { value: "follow", label: "فالو (Follow)" },
              { value: "nofollow", label: "نوفالو (Nofollow)" },
            ].map((btn) => (
              <button
                key={btn.value}
                onClick={() => setSelectedLinkType(btn.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedLinkType === btn.value
                    ? "bg-slate-800 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>

          <div className="mr-auto text-xs text-slate-400 font-semibold">
            یافت شده: <span className="text-slate-700 font-extrabold">{filteredWebsites.length}</span> رسانه
          </div>
        </div>
      </div>

      {/* Catalog Display */}
      {filteredWebsites.length === 0 ? (
        <div className="bg-white text-center py-16 px-4 rounded-2xl border border-slate-100 shadow-xs">
          <p className="text-slate-400 font-medium text-sm">هیچ رسانه‌ای با مشخصات و فیلترهای انتخابی شما یافت نشد.</p>
          <button
            onClick={() => {
              setSelectedCategory("all");
              setSelectedLinkType("all");
              setMinDA(0);
              setMaxSpam(10);
              setMaxPrice(4000000);
              setSearchQuery("");
            }}
            className="mt-4 text-xs text-blue-600 font-black hover:underline"
          >
            پاک کردن تمامی فیلترها
          </button>
        </div>
      ) : (
        /* Grid / Tiled Mode */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWebsites.map((site) => (
            <div
              key={site.id}
              onClick={() => {
                setSelectedWebsiteDetails(site);
                setActiveTab("info");
              }}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md hover:border-blue-400/50 transition-all duration-200 flex flex-col group cursor-pointer"
            >
              <div className="p-5 flex-1 space-y-4">
                {/* Logo & Domain */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-black text-lg shadow-inner group-hover:scale-105 transition-transform duration-200">
                    {site.logo}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-800 text-base">{site.name}</h4>
                    <span className="text-xs text-blue-600 font-mono tracking-tight flex items-center gap-1 mt-0.5" dir="ltr">
                      <Globe className="w-3 h-3 text-blue-500" />
                      {site.domain}
                    </span>
                  </div>
                  <span className="mr-auto text-[10px] bg-slate-100 text-slate-600 px-2 py-1 rounded-md font-bold">
                    {site.categoryLabel}
                  </span>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-xl text-center border border-slate-200">
                  <div>
                    <span className="text-[10px] text-slate-400 block">اعتبار (DA)</span>
                    <span className="font-black text-slate-800 text-sm">{site.domainAuthority}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">اسپم اسکور</span>
                    <span className={`font-black text-sm ${site.spamScore > 5 ? "text-rose-600" : "text-emerald-600"}`}>
                      {site.spamScore}%
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">رتبه ایران</span>
                    <span className="font-black text-slate-800 text-sm">#{site.alexaRank.toLocaleString("fa-IR")}</span>
                  </div>
                </div>

                {/* Info Badges */}
                <div className="flex flex-wrap gap-3 text-xs text-slate-500 font-semibold pt-1">
                  <span className="flex items-center gap-1">
                    <Link2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>لینک {site.linkType === "follow" ? "فالو" : site.linkType === "nofollow" ? "نوفالو" : "فالو و نوفالو"}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>انتشار در {site.deliveryTime}</span>
                  </span>
                </div>
              </div>

              {/* Price & Buy Button */}
              <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-1.5">
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">تعرفه رپورتاژ:</span>
                  <span className="font-black text-blue-600 text-xs sm:text-sm">{formatPrice(site.price)}</span>
                </div>
                <div className="flex gap-1.5">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedWebsiteDetails(site);
                      setActiveTab("info");
                    }}
                    className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-extrabold text-[10px] px-2.5 py-1.5 rounded-xl flex items-center gap-1 transition-all duration-200 cursor-pointer"
                    title="مشاهده قوانین و اطلاعات کامل رسانه"
                  >
                    <Info className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">بررسی رسانه</span>
                  </button>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onAddToCart) onAddToCart(site);
                    }}
                    className={`font-black text-[10px] px-3 py-1.5 rounded-xl flex items-center gap-1 transition-all duration-200 cursor-pointer ${
                      cart.some((item) => item.id === site.id)
                        ? "bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100"
                        : "bg-blue-600 hover:bg-blue-500 text-white shadow-xs hover:shadow-md"
                    }`}
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>{cart.some((item) => item.id === site.id) ? "در سبد" : "افزودن به سبد"}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* DETAILED MEDIA CARD MODAL (SHOWING RULES, METRICS & CAPABILITIES) */}
      {selectedWebsiteDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs text-right" dir="rtl">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-slate-200 animate-fade-in">
            {/* Header */}
            <div className="p-6 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-xl shadow-md">
                  {selectedWebsiteDetails.logo}
                </div>
                <div>
                  <h3 className="font-black text-slate-800 text-lg flex items-center gap-2">
                    {selectedWebsiteDetails.name}
                  </h3>
                  <span className="text-xs text-blue-600 font-mono tracking-tight block mt-0.5" dir="ltr">
                    {selectedWebsiteDetails.domain}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedWebsiteDetails(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tab selection */}
            <div className="flex border-b border-slate-200 bg-slate-50/50 p-1">
              <button
                onClick={() => setActiveTab("info")}
                className={`flex-1 py-3 text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === "info"
                    ? "text-blue-600 border-b border-blue-600 bg-white shadow-xs rounded-t-lg"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <Info className="w-4 h-4" />
                <span>اطلاعات رسانه</span>
              </button>
              <button
                onClick={() => setActiveTab("rules")}
                className={`flex-1 py-3 text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === "rules"
                    ? "text-blue-600 border-b border-blue-600 bg-white shadow-xs rounded-t-lg"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>قوانین انتشار</span>
              </button>
              <button
                onClick={() => setActiveTab("features")}
                className={`flex-1 py-3 text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === "features"
                    ? "text-blue-600 border-b border-blue-600 bg-white shadow-xs rounded-t-lg"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <Zap className="w-4 h-4" />
                <span>امکانات رسانه</span>
              </button>
            </div>

            {/* Modal Content body */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              
              {/* TAB 1: MEDIA INFORMATION */}
              {activeTab === "info" && (
                <div className="space-y-4 animate-fade-in">
                  <div className="bg-blue-50/40 p-4 rounded-xl border border-blue-100/50">
                    <p className="text-xs text-blue-900 leading-relaxed font-semibold">
                      این رسانه به عنوان یکی از بسترهای معتبر و تاثیرگذار کشور در حوزه <strong className="text-blue-700">{selectedWebsiteDetails.categoryLabel}</strong> شناخته می‌شود. جزئیات فنی و رنکینگ سئو آن به شرح زیر است:
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
                      <ShieldCheck className="w-6 h-6 text-blue-600 mx-auto mb-1.5" />
                      <span className="text-[10px] text-slate-400 block font-bold">اعتبار دامنه (DA)</span>
                      <span className="text-lg font-black text-slate-800">{selectedWebsiteDetails.domainAuthority} از ۱۰۰</span>
                      <span className="text-[9px] text-emerald-600 font-bold block mt-1">تاثیر فوق‌العاده در سئو</span>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
                      <ShieldAlert className={`w-6 h-6 mx-auto mb-1.5 ${selectedWebsiteDetails.spamScore > 5 ? "text-rose-500" : "text-emerald-500"}`} />
                      <span className="text-[10px] text-slate-400 block font-bold">میزان اسپم (Spam Score)</span>
                      <span className="text-lg font-black text-slate-800">{selectedWebsiteDetails.spamScore}٪</span>
                      <span className="text-[9px] text-slate-500 font-bold block mt-1">شاخص سلامت دامنه</span>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
                      <Globe className="w-6 h-6 text-blue-600 mx-auto mb-1.5" />
                      <span className="text-[10px] text-slate-400 block font-bold">رتبه ایران در الکسا</span>
                      <span className="text-lg font-black text-slate-800">#{selectedWebsiteDetails.alexaRank.toLocaleString("fa-IR")}</span>
                      <span className="text-[9px] text-slate-500 font-bold block mt-1">ترافیک روزانه بالا و پایدار</span>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 text-xs">
                    <div className="flex justify-between items-center py-1.5 border-b border-slate-200/60">
                      <span className="text-slate-500 font-bold">دسته‌بندی محتوایی:</span>
                      <span className="text-slate-700 font-extrabold">{selectedWebsiteDetails.categoryLabel}</span>
                    </div>
                    <div className="flex justify-between items-center py-1.5 border-b border-slate-200/60">
                      <span className="text-slate-500 font-bold">آدرس مستقیم سایت:</span>
                      <a href={`https://${selectedWebsiteDetails.domain}`} target="_blank" rel="noreferrer" className="text-blue-600 font-mono hover:underline inline-flex items-center gap-1" dir="ltr">
                        {selectedWebsiteDetails.domain}
                      </a>
                    </div>
                    <div className="flex justify-between items-center py-1.5">
                      <span className="text-slate-500 font-bold">توضیحات کلی رسانه:</span>
                      <span className="text-slate-700 font-medium text-left">{selectedWebsiteDetails.description}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: PUBLISHING RULES */}
              {activeTab === "rules" && (
                <div className="space-y-4 animate-fade-in">
                  <div className="bg-amber-50 text-amber-900 p-4 rounded-xl border border-amber-100 flex gap-3">
                    <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div className="text-xs space-y-1">
                      <strong className="block font-black">قوانین مهم و سرنوشت‌ساز انتشار رپورتاژ:</strong>
                      <p className="leading-relaxed font-semibold">
                        لطفاً قبل از نهایی‌سازی سفارش خود، قوانین اختصاصی این رسانه را مطالعه فرمایید. در صورت تخطی از این بندها، سفارش توسط سردبیری رسانه رد شده و مبلغ به کیف پول شما عودت داده می‌شود.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3.5">
                    <div className="flex items-start gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xs shrink-0 font-bold mt-0.5">۱</div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        <strong>محدودیت تعداد لینک‌های فعال:</strong> شما مجاز به استفاده از حداکثر <strong className="text-blue-600">{selectedWebsiteDetails.allowedLinksCount} لینک فالو (Follow)</strong> در کل متن مقاله هستید. تمام لینک‌ها ترجیحاً باید دارای دامنه یکسانی باشند.
                      </p>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xs shrink-0 font-bold mt-0.5">۲</div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        <strong>عدم امکان ویرایش ثانویه:</strong> پس از تایید پیش‌نویس توسط سردبیر و انتشار رسمی رپورتاژ در خروجی رسانه، به هیچ عنوان امکان اصلاح متن، ویرایش یا جابه‌جایی لینک‌ها و تصاویر میسر نخواهد بود.
                      </p>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xs shrink-0 font-bold mt-0.5">۳</div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        <strong>موضوعات مغایر با قوانین کشور:</strong> رپورتاژ‌های مرتبط با شرط‌بندی، پیش‌بینی مسابقات، فروش انواع وی‌پی‌ان و فیلترشکن، بخت‌آزمایی، موضوعات سیاسی حساس یا تخریبی، فروش داروهای بدون نسخه، مکمل‌های چاقی و لاغری غیرمجاز و هرگونه فعالیت غیرقانونی، به سرعت رد خواهند شد.
                      </p>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xs shrink-0 font-bold mt-0.5">۴</div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        <strong>فرمت و اندازه تصاویر:</strong> حداکثر امکان قرار دادن ۳ تصویر در رپورتاژ وجود دارد. حجم فایل هر تصویر نباید از ۵۰۰ کیلوبایت فراتر رود و فرمت تصاویر باید JPG یا PNG باشد.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: MEDIA CAPABILITIES */}
              {activeTab === "features" && (
                <div className="space-y-4 animate-fade-in">
                  <div className="bg-emerald-50 text-emerald-900 p-4 rounded-xl border border-emerald-100 flex gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div className="text-xs space-y-1">
                      <strong className="block font-black">امکانات ویژه و مزایای رقابتی رسانه {selectedWebsiteDetails.name}:</strong>
                      <p className="leading-relaxed font-semibold">
                        این رسانه خدمات فنی ممتازی را برای ارتقای سئو و رتبه کلمات کلیدی شما در سرچ کنسول گوگل ارائه می‌دهد.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex gap-3">
                      <Zap className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                      <div className="text-xs space-y-1">
                        <strong className="block font-black text-slate-800">ایندکس سریع در گوگل (Fast Index)</strong>
                        <p className="text-slate-500 leading-relaxed">محتوای رپورتاژ به دلیل ساختار فنی بهینه، طی کمتر از ۶ ساعت در نتایج گوگل ایندکس می‌شود.</p>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex gap-3">
                      <Clock className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                      <div className="text-xs space-y-1">
                        <strong className="block font-black text-slate-800">زمان انتشار بسیار سریع</strong>
                        <p className="text-slate-500 leading-relaxed">سفارش شما در کوتاه‌ترین زمان ممکن و حداکثر تا {selectedWebsiteDetails.deliveryTime} در خروجی قرار می‌گیرد.</p>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex gap-3">
                      <Link2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                      <div className="text-xs space-y-1">
                        <strong className="block font-black text-slate-800">لینک‌های دائمی و مادام‌العمر</strong>
                        <p className="text-slate-500 leading-relaxed">تمام لینک‌های ارسالی شما به صورت دائمی، بدون تاریخ انقضا و بدون حذف شدن در دیتابیس باقی می‌مانند.</p>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex gap-3">
                      <ShieldCheck className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                      <div className="text-xs space-y-1">
                        <strong className="block font-black text-slate-800">لینک‌های کاملاً فالو (Follow)</strong>
                        <p className="text-slate-500 leading-relaxed">ارزش فنی و اعتبار (Link Juice) این رسانه به صورت مستقیم به سایت شما منتقل می‌شود.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-xs">
              <button
                type="button"
                onClick={() => setSelectedWebsiteDetails(null)}
                className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-5 py-2.5 rounded-xl font-bold transition-all cursor-pointer"
              >
                انصراف و بازگشت
              </button>

              <button
                type="button"
                onClick={() => {
                  if (onAddToCart) onAddToCart(selectedWebsiteDetails);
                  setSelectedWebsiteDetails(null);
                }}
                className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-xl font-black transition-all flex items-center gap-1.5 shadow-md hover:shadow-lg cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{cart.some((item) => item.id === selectedWebsiteDetails.id) ? "در سبد خرید شماست" : `افزودن به سبد خرید با تعرفه ${formatPrice(selectedWebsiteDetails.price)}`}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
