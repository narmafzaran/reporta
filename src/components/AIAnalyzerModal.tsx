import React, { useState } from "react";
import { AlertCircle, CheckCircle, HelpCircle, RefreshCw, Star, X, Sparkles } from "lucide-react";

interface AIAnalyzerModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  body: string;
  targetKeywords: string[];
}

interface AnalysisResult {
  seoScore: number;
  readabilityScore: number;
  keywordsDensity: string;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  optimizedTitle: string;
}

export default function AIAnalyzerModal({
  isOpen,
  onClose,
  title,
  body,
  targetKeywords,
}: AIAnalyzerModalProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/gemini/analyze-seo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          body,
          targetKeywords,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "خطا در برقراری ارتباط با سرور");
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "بروز خطا در تحلیل سئو. لطفاً مجدداً تلاش کنید.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs text-right" dir="rtl">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-slate-100">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-50 text-emerald-600 p-2 rounded-lg">
              <Sparkles className="w-5 h-5 text-emerald-600 animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-lg">آنالیزور هوشمند سئو و محتوای رپورتاژ</h3>
              <p className="text-xs text-slate-500 mt-0.5">تحلیل عمیق محتوا با هوش مصنوعی جمینی (Gemini 3.5)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* Article Info Preview */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-slate-400 font-medium block">عنوان ارسالی:</span>
                <span className="text-slate-700 font-semibold truncate block mt-1">{title}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">کلمات کلیدی هدف:</span>
                <span className="text-slate-700 font-semibold block mt-1">
                  {targetKeywords.length > 0 ? targetKeywords.join("، ") : "ثبت نشده"}
                </span>
              </div>
            </div>
          </div>

          {!result && !loading && !error && (
            <div className="text-center py-12 px-4">
              <div className="inline-flex p-4 bg-emerald-50 text-emerald-600 rounded-full mb-4">
                <Sparkles className="w-10 h-10" />
              </div>
              <h4 className="text-base font-bold text-slate-700">رپورتاژ شما آماده بررسی است!</h4>
              <p className="text-slate-500 text-sm max-w-md mx-auto mt-2">
                هوش مصنوعی متن شما را از لحاظ تراکم کلمات کلیدی، کیفیت نگارش، جذابیت عنوان، ساختار هدینگ‌ها (H2, H3) و نمره کلی سئو ارزیابی خواهد کرد.
              </p>
              <button
                onClick={handleAnalyze}
                className="mt-6 inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-md transition-all duration-200"
              >
                شروع آنالیز هوشمند سئو
              </button>
            </div>
          )}

          {loading && (
            <div className="text-center py-16 space-y-4">
              <div className="inline-flex animate-spin p-4 text-emerald-600 bg-emerald-50 rounded-full">
                <RefreshCw className="w-8 h-8" />
              </div>
              <p className="text-slate-600 font-medium text-sm animate-pulse">
                هوش مصنوعی جمینی در حال بررسی و تحلیل دقیق ساختار رپورتاژ شماست...
              </p>
              <p className="text-xs text-slate-400">این عملیات ممکن است چند ثانیه زمان ببرد.</p>
            </div>
          )}

          {error && (
            <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h5 className="font-bold text-rose-800 text-sm">بروز خطا در تحلیل سئو</h5>
                <p className="text-rose-700 text-xs">{error}</p>
                <button
                  onClick={handleAnalyze}
                  className="mt-3 text-xs bg-rose-600 text-white px-3 py-1.5 rounded-lg font-bold hover:bg-rose-700 transition-colors"
                >
                  تلاش مجدد
                </button>
              </div>
            </div>
          )}

          {result && (
            <div className="space-y-6 animate-fade-in">
              {/* Scores Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* SEO Score */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex flex-col items-center justify-center text-center">
                  <span className="text-xs text-slate-500 font-medium mb-1">نمره کلی سئو رپورتاژ</span>
                  <div className="relative flex items-center justify-center my-2">
                    <span className="text-4xl font-extrabold text-slate-800">{result.seoScore}</span>
                    <span className="text-slate-400 text-xs mr-0.5">/۱۰۰</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mt-2">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${
                        result.seoScore >= 80
                          ? "bg-emerald-500"
                          : result.seoScore >= 50
                          ? "bg-amber-500"
                          : "bg-rose-500"
                      }`}
                      style={{ width: `${result.seoScore}%` }}
                    />
                  </div>
                  <span className={`text-xs font-bold mt-2 ${
                    result.seoScore >= 80
                      ? "text-emerald-600"
                      : result.seoScore >= 50
                      ? "text-amber-600"
                      : "text-rose-600"
                  }`}>
                    {result.seoScore >= 80 ? "بسیار بهینه‌سازی شده" : result.seoScore >= 50 ? "نیاز به بهبود جزئی" : "ضعیف و بدون استاندارد سئو"}
                  </span>
                </div>

                {/* Readability Score */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex flex-col items-center justify-center text-center">
                  <span className="text-xs text-slate-500 font-medium mb-1">خوانایی و روان بودن متن</span>
                  <div className="relative flex items-center justify-center my-2">
                    <span className="text-4xl font-extrabold text-slate-800">{result.readabilityScore}</span>
                    <span className="text-slate-400 text-xs mr-0.5">/۱۰۰</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mt-2">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all duration-1000"
                      style={{ width: `${result.readabilityScore}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-blue-600 mt-2">
                    {result.readabilityScore >= 80 ? "روان و جذاب برای مخاطب" : result.readabilityScore >= 50 ? "متوسط" : "سخت‌خوان و خسته‌کننده"}
                  </span>
                </div>

                {/* Keywords Density */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex flex-col items-center justify-center text-center">
                  <span className="text-xs text-slate-500 font-medium mb-1">تراکم کلمات کلیدی</span>
                  <div className="text-slate-700 font-bold text-sm my-3 flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span>بهینه‌سازی شده</span>
                  </div>
                  <p className="text-slate-500 text-[11px] leading-relaxed mt-1">
                    {result.keywordsDensity}
                  </p>
                </div>
              </div>

              {/* Optimized Title Alternative */}
              {result.optimizedTitle && result.optimizedTitle !== title && (
                <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100/60">
                  <span className="text-emerald-800 text-xs font-bold block mb-1">عنوان پیشنهادی و جذاب‌تر هوش مصنوعی:</span>
                  <p className="text-slate-800 font-bold text-sm">{result.optimizedTitle}</p>
                </div>
              )}

              {/* Strengths & Weaknesses */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs">
                  <h5 className="font-bold text-emerald-700 text-sm mb-3 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span>نقاط قوت محتوا</span>
                  </h5>
                  <ul className="space-y-2">
                    {result.strengths.map((str, idx) => (
                      <li key={idx} className="text-xs text-slate-600 flex items-start gap-2 leading-relaxed">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full shrink-0 mt-1.5" />
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs">
                  <h5 className="font-bold text-amber-700 text-sm mb-3 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-500" />
                    <span>نقاط ضعف یا نکات نیازمند توجه</span>
                  </h5>
                  <ul className="space-y-2">
                    {result.weaknesses.map((weak, idx) => (
                      <li key={idx} className="text-xs text-slate-600 flex items-start gap-2 leading-relaxed">
                        <span className="w-1.5 h-1.5 bg-amber-500 rounded-full shrink-0 mt-1.5" />
                        <span>{weak}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Suggestions */}
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
                <h5 className="font-bold text-slate-800 text-sm mb-3 flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span>پیشنهادات اصلاحی و سئو برای بهینه‌سازی نهایی</span>
                </h5>
                <ul className="space-y-2.5">
                  {result.suggestions.map((sug, idx) => (
                    <li key={idx} className="text-xs text-slate-700 flex items-start gap-2.5 leading-relaxed">
                      <span className="bg-emerald-50 text-emerald-700 w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0">
                        {idx + 1}
                      </span>
                      <span>{sug}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
          <p className="text-[10px] text-slate-400">
            تحلیل انجام شده با توجه به اصول سئو کلاه سفید و فاکتورهای رتبه‌بندی ۲۰۲۶ گوگل ارائه می‌شود.
          </p>
          <div className="flex gap-2">
            {result && (
              <button
                onClick={handleAnalyze}
                className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs px-4 py-2 rounded-xl transition-colors"
              >
                تحلیل مجدد
              </button>
            )}
            <button
              onClick={onClose}
              className="bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors"
            >
              بستن پنجره
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
