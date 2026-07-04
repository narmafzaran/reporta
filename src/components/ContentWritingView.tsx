import React, { useState, useEffect } from "react";
import { ContentOrder } from "../types";
import { Sparkles, RefreshCw, Copy, Check, FileText, PlusCircle, AlertCircle, HelpCircle, Save, History } from "lucide-react";

interface ContentWritingViewProps {
  onAddOrderToWebsite: (title: string, body: string, keywords: string[]) => void;
  userWalletBalance: number;
  onDeductBalance: (amount: number, description: string) => boolean;
}

export default function ContentWritingView({
  onAddOrderToWebsite,
  userWalletBalance,
  onDeductBalance,
}: ContentWritingViewProps) {
  // Inputs
  const [topic, setTopic] = useState("");
  const [keywordInput, setKeywordInput] = useState("");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [tone, setTone] = useState<"official" | "friendly" | "creative" | "academic">("official");
  const [wordCount, setWordCount] = useState(800);
  const [brief, setBrief] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedArticle, setGeneratedArticle] = useState<{
    title: string;
    body: string;
    summary: string;
    seoTips: string[];
  } | null>(null);

  const [copiedTitle, setCopiedTitle] = useState(false);
  const [copiedBody, setCopiedBody] = useState(false);
  const [history, setHistory] = useState<ContentOrder[]>([]);

  // Calculate dynamic writing price (e.g. 150 Tomans per word)
  const basePricePerWord = 150;
  const estimatedCost = wordCount * basePricePerWord;

  useEffect(() => {
    // Load history from localStorage
    const savedHistory = localStorage.getItem("content_writing_history");
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const saveToHistory = (item: ContentOrder) => {
    const updated = [item, ...history];
    setHistory(updated);
    localStorage.setItem("content_writing_history", JSON.stringify(updated));
  };

  const handleAddKeyword = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      const val = keywordInput.trim();
      if (val && !keywords.includes(val)) {
        setKeywords([...keywords, val]);
        setKeywordInput("");
      }
    }
  };

  const handleRemoveKeyword = (index: number) => {
    setKeywords(keywords.filter((_, idx) => idx !== index));
  };

  const handleGenerate = async () => {
    if (!topic) {
      setError("لطفاً موضوع رپورتاژ را وارد کنید.");
      return;
    }

    if (userWalletBalance < estimatedCost) {
      setError(`اعتبار کافی نیست. هزینه تولید این رپورتاژ ${estimatedCost.toLocaleString("fa-IR")} تومان است اما موجودی شما کمتر است.`);
      return;
    }

    setLoading(true);
    setError(null);
    setGeneratedArticle(null);

    try {
      const response = await fetch("/api/gemini/generate-content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic,
          keywords,
          tone,
          wordCount,
          brief,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "خطا در برقراری ارتباط با سرور هوش مصنوعی");
      }

      const data = await response.json();
      setGeneratedArticle(data);

      // Deduct balance and add to wallet transaction history
      const success = onDeductBalance(estimatedCost, `نگارش هوشمند رپورتاژ با موضوع: ${topic.substring(0, 30)}...`);
      
      if (success) {
        // Save to local history
        const newHistoryItem: ContentOrder = {
          id: "cnt_" + Date.now(),
          topic,
          keywords,
          tone,
          wordCount,
          brief,
          status: "approved",
          generatedTitle: data.title,
          generatedBody: data.body,
          generatedSummary: data.summary,
          seoTips: data.seoTips,
          price: estimatedCost,
          dateCreated: new Date().toLocaleDateString("fa-IR"),
        };
        saveToHistory(newHistoryItem);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "بروز خطا در تولید محتوا. لطفاً دقایقی دیگر تلاش کنید.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, type: "title" | "body") => {
    navigator.clipboard.writeText(text);
    if (type === "title") {
      setCopiedTitle(true);
      setTimeout(() => setCopiedTitle(false), 2000);
    } else {
      setCopiedBody(true);
      setTimeout(() => setCopiedBody(false), 2000);
    }
  };

  const handlePublishGenerated = () => {
    if (generatedArticle) {
      onAddOrderToWebsite(generatedArticle.title, generatedArticle.body, keywords);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-right animate-fade-in" dir="rtl">
      
      {/* Configuration Column */}
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-200">
            <Sparkles className="w-5 h-5 text-blue-600 animate-pulse" />
            <h3 className="font-extrabold text-slate-800 text-sm">تنظیمات سفارش نگارش رپورتاژ</h3>
          </div>

          {/* Topic */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600 block">موضوع یا عنوان فرضی رپورتاژ:</label>
            <input
              type="text"
              placeholder="مثال: اهمیت خرید دوربین‌های امنیتی در منازل مسکونی"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700 placeholder-slate-400 bg-slate-50/50"
            />
          </div>

          {/* Keywords */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600 block">کلمات کلیدی سئو (با اینتر یا اسپیس اضافه کنید):</label>
            <div className="border border-slate-200 rounded-xl p-2 bg-slate-50/50 space-y-2">
              <input
                type="text"
                placeholder="مثلاً: خرید دوربین مداربسته، ایمنی منزل"
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                onKeyDown={handleAddKeyword}
                className="w-full bg-transparent border-0 p-1 text-xs focus:outline-hidden text-slate-700 placeholder-slate-400"
              />
              <div className="flex flex-wrap gap-1.5">
                {keywords.map((kw, idx) => (
                  <span key={idx} className="bg-blue-50 text-blue-700 text-[10px] font-extrabold px-2 py-1 rounded-md flex items-center gap-1 border border-blue-100">
                    {kw}
                    <button
                      type="button"
                      onClick={() => handleRemoveKeyword(idx)}
                      className="text-blue-400 hover:text-blue-600 font-bold"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Tone & Word Count Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Tone */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 block">لحن مقاله:</label>
              <select
                value={tone}
                onChange={(e: any) => setTone(e.target.value)}
                className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-600 bg-slate-50/50"
              >
                <option value="official">رسمی و اداری</option>
                <option value="friendly">صمیمی و مخاطب‌پسند</option>
                <option value="creative">خلاقانه و بازاریابی</option>
                <option value="academic">علمی و تخصصی</option>
              </select>
            </div>

            {/* Word Count */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 block">طول محتوا (کلمه):</label>
              <select
                value={wordCount}
                onChange={(e) => setWordCount(parseInt(e.target.value))}
                className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-600 bg-slate-50/50"
              >
                <option value="600">کوتاه (۶۰۰ کلمه)</option>
                <option value="800">استاندارد (۸۰۰ کلمه)</option>
                <option value="1000">طولانی (۱۰۰۰ کلمه)</option>
                <option value="1200">کامل و جامع (۱۲۰۰ کلمه)</option>
              </select>
            </div>
          </div>

          {/* Brief */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600 block">راهنمای اضافه یا بریف محتوا (اختیاری):</label>
            <textarea
              placeholder="مثال: حتماً به سه مدل دوربین برند شیائومی در متن اشاره شود و مزایای نصب رایگان فروشگاه ما ذکر گردد..."
              value={brief}
              onChange={(e) => setBrief(e.target.value)}
              rows={3}
              className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700 placeholder-slate-400 bg-slate-50/50 resize-none"
            />
          </div>

          {/* Pricing Info */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <div className="flex justify-between text-xs font-bold text-slate-600">
              <span>تعرفه نگارش هوشمند:</span>
              <span>{basePricePerWord} تومان / کلمه</span>
            </div>
            <div className="flex justify-between text-xs font-bold text-slate-600">
              <span>حجم مقاله انتخابی:</span>
              <span>{wordCount} کلمه</span>
            </div>
            <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-black text-slate-800">
              <span>کل مـبلغ قابل پرداخت:</span>
              <span className="text-blue-600">{estimatedCost.toLocaleString("fa-IR")} تومان</span>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <p className="text-rose-700 text-[10px] leading-relaxed font-bold">{error}</p>
            </div>
          )}

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-300 text-white font-black text-xs py-3 rounded-xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>در حال نگارش و تحقیق هوشمند...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>نگارش محتوای رپورتاژ با هوش مصنوعی</span>
              </>
            )}
          </button>
        </div>

        {/* History Column / Segment */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-200 text-slate-700">
            <History className="w-4 h-4" />
            <h4 className="font-extrabold text-xs">تاریخچه رپورتاژهای نگارش شده</h4>
          </div>

          {history.length === 0 ? (
            <p className="text-slate-400 text-[10px] py-4 text-center">هنوز مقاله‌ای نگارش نکرده‌اید.</p>
          ) : (
            <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
              {history.map((hist) => (
                <div
                  key={hist.id}
                  onClick={() => {
                    if (hist.generatedTitle && hist.generatedBody) {
                      setGeneratedArticle({
                        title: hist.generatedTitle,
                        body: hist.generatedBody,
                        summary: hist.generatedSummary || "",
                        seoTips: hist.seoTips || [],
                      });
                      setTopic(hist.topic);
                      setKeywords(hist.keywords);
                    }
                  }}
                  className="p-3 bg-slate-50 hover:bg-blue-50/40 rounded-xl border border-slate-200 cursor-pointer transition-colors text-right"
                >
                  <p className="font-bold text-[11px] text-slate-800 truncate">{hist.generatedTitle}</p>
                  <div className="flex justify-between text-[9px] text-slate-400 mt-1.5 font-semibold">
                    <span>{hist.dateCreated}</span>
                    <span className="text-blue-600">{hist.wordCount} کلمه</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Editor & Generated Output Column */}
      <div className="lg:col-span-2 space-y-6">
        
        {loading ? (
          <div className="bg-white p-12 rounded-2xl border border-slate-200 shadow-xs text-center flex flex-col items-center justify-center space-y-4 min-h-[500px]">
            <div className="p-4 bg-blue-50 text-blue-600 rounded-full animate-spin">
              <RefreshCw className="w-10 h-10" />
            </div>
            <h3 className="font-extrabold text-slate-800 text-base">در حال نگارش متن رپورتاژ شما</h3>
            <p className="text-slate-500 text-xs max-w-sm leading-relaxed">
              هوش مصنوعی جمینی هم‌اکنون در حال بررسی کلمات کلیدی، تحلیل لینک‌سازی طبیعی و ساختاربندی مقاله‌ای جامع با سرفصل‌های جذاب است. لطفا شکیبا باشید...
            </p>
          </div>
        ) : generatedArticle ? (
          <div className="space-y-6">
            
            {/* Generated Article Container */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              
              {/* Header actions */}
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-2">
                  <div className="bg-emerald-50 text-emerald-600 p-1.5 rounded-lg">
                    <Sparkles className="w-4.5 h-4.5" />
                  </div>
                  <span className="font-black text-slate-800 text-xs">خروجی رپورتاژ تولید شده توسط هوش مصنوعی</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => copyToClipboard(generatedArticle.title, "title")}
                    className="flex items-center gap-1.5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 text-[10px] font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                  >
                    {copiedTitle ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>کپی عنوان</span>
                  </button>
                  <button
                    onClick={() => copyToClipboard(generatedArticle.body, "body")}
                    className="flex items-center gap-1.5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 text-[10px] font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                  >
                    {copiedBody ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>کپی کل متن رپورتاژ</span>
                  </button>
                </div>
              </div>

              {/* Editor Sheet */}
              <div className="p-6 space-y-6">
                
                {/* Generated Title Preview */}
                <div className="space-y-1.5">
                  <span className="text-[10px] text-slate-400 font-bold block">عنوان مقاله رپورتاژ (H1):</span>
                  <h1 className="text-xl font-black text-slate-800 border-b border-dashed border-slate-200 pb-3">
                    {generatedArticle.title}
                  </h1>
                </div>

                {/* Generated Meta Description */}
                {generatedArticle.summary && (
                  <div className="bg-slate-50/50 p-3.5 rounded-xl border border-slate-200 text-xs">
                    <span className="text-slate-400 font-bold block mb-1">خلاصه رپورتاژ (متا دسکریپشن پیشنهادی):</span>
                    <p className="text-slate-600 leading-relaxed">{generatedArticle.summary}</p>
                  </div>
                )}

                {/* Body editor */}
                <div className="space-y-1.5">
                  <span className="text-[10px] text-slate-400 font-bold block">محتوای مقاله رپورتاژ:</span>
                  <div
                    className="prose prose-slate max-w-none text-xs text-slate-700 leading-relaxed space-y-4 border border-slate-200 rounded-xl p-5 bg-slate-50/10"
                    dangerouslySetInnerHTML={{ __html: generatedArticle.body }}
                  />
                </div>

              </div>

              {/* Publish Action Footer */}
              <div className="p-5 bg-blue-50/50 border-t border-slate-200 flex items-center justify-between flex-col md:flex-row gap-4">
                <p className="text-[10px] text-blue-950 font-bold">
                  محتوا نگارش شده کاملاً یونیک و آماده انتشار است. آیا مایلید این رپورتاژ را مستقیماً روی یکی از رسانه‌های کاتالوگ سفارش دهید؟
                </p>
                <button
                  onClick={handlePublishGenerated}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-black text-xs px-5 py-2.5 rounded-xl flex items-center gap-1.5 shadow-md hover:shadow-lg transition-all cursor-pointer self-stretch md:self-auto text-center justify-center"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>انتخاب رسانه و انتشار مستقیم</span>
                </button>
              </div>

            </div>

            {/* SEO Tips Sheet */}
            {generatedArticle.seoTips && generatedArticle.seoTips.length > 0 && (
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <h4 className="font-extrabold text-slate-800 text-xs flex items-center gap-2">
                  <Sparkles className="w-4.5 h-4.5 text-amber-500 fill-amber-500" />
                  <span>نکات سئو و توصیه‌های اختصاصی برای این مقاله</span>
                </h4>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
                  {generatedArticle.seoTips.map((tip, idx) => (
                    <li key={idx} className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-slate-600 leading-relaxed flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full shrink-0 mt-1.5" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

          </div>
        ) : (
          /* Empty State */
          <div className="bg-white p-12 rounded-2xl border border-slate-200 shadow-xs text-center flex flex-col items-center justify-center space-y-4 min-h-[500px]">
            <div className="p-4 bg-slate-50 text-slate-400 rounded-full">
              <FileText className="w-12 h-12" />
            </div>
            <h3 className="font-extrabold text-slate-800 text-base">پیش‌نمایش رپورتاژ آگهی</h3>
            <p className="text-slate-400 text-xs max-w-sm leading-relaxed">
              تنظیمات رپورتاژ مورد نیاز خود را در ستون سمت راست پر کرده و روی دکمه تولید با هوش مصنوعی کلیک کنید تا متن نهایی رپورتاژ با بهترین اصول سئو نگارش و در اینجا نمایش داده شود.
            </p>
          </div>
        )}

      </div>

    </div>
  );
}
