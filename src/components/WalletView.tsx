import React, { useState } from "react";
import { WalletTransaction, MediaWebsite, Campaign } from "../types";
import { 
  CreditCard, 
  ArrowUpLeft, 
  ArrowDownRight, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  ShoppingBag,
  Trash2,
  CheckCircle2,
  ShieldAlert,
  Zap,
  PlusCircle,
  FileText,
  Clock3,
  Info
} from "lucide-react";

interface WalletViewProps {
  balance: number;
  transactions: WalletTransaction[];
  onDeposit: (amount: number) => void;
  cartItems: MediaWebsite[];
  onRemoveFromCart: (id: string) => void;
  onCheckoutCart: (
    campaignId: string,
    customTitles: Record<string, string>,
    customBodies: Record<string, string>,
    customKeywords: Record<string, { text: string; url: string }[]>
  ) => void;
  campaigns: Campaign[];
  onCreateCampaign: (name: string, budget: number) => void;
}

export default function WalletView({
  balance,
  transactions,
  onDeposit,
  cartItems = [],
  onRemoveFromCart,
  onCheckoutCart,
  campaigns = [],
  onCreateCampaign,
}: WalletViewProps) {
  const [depositAmount, setDepositAmount] = useState("");
  const [successMsg, setSuccessMsg] = useState(false);
  
  // Tab within the right column (either "cart" or "transactions")
  const [rightPanelTab, setRightPanelTab] = useState<"cart" | "transactions">(
    cartItems.length > 0 ? "cart" : "transactions"
  );

  // States for Cart Editor
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>("");
  const [newCampaignName, setNewCampaignName] = useState("");

  const formatPrice = (price: number) => {
    return price.toLocaleString("fa-IR") + " تومان";
  };

  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(depositAmount);
    if (amount >= 50000) {
      onDeposit(amount);
      setDepositAmount("");
      setSuccessMsg(true);
      setTimeout(() => setSuccessMsg(false), 3000);
    }
  };

  // Inline campaign creation inside Cart view
  const handleCreateNewCampaignInline = () => {
    if (!newCampaignName.trim()) {
      alert("لطفاً نام کمپین را وارد کنید.");
      return;
    }
    const campId = "camp_" + Date.now();
    onCreateCampaign(newCampaignName.trim(), 5000000); // default budget
    setSelectedCampaignId(campId);
    setNewCampaignName("");
    alert(`کمپین "${newCampaignName}" با موفقیت ایجاد شد و به صورت خودکار انتخاب گردید.`);
  };

  // Total cart calculation
  const totalCost = cartItems.reduce((sum, item) => sum + item.price, 0);
  const isSufficient = balance >= totalCost;
  const shortage = totalCost - balance;

  const handlePayAndFinalizeCampaign = () => {
    if (cartItems.length === 0) return;
    if (!isSufficient) {
      alert("موجودی کیف پول شما برای پرداخت این سبد خرید کافی نیست. ابتدا موجودی خود را شارژ کنید.");
      return;
    }
    
    // Call the parent checkout handler with empty values since titles/bodies are set inside the post-purchase editor
    onCheckoutCart(selectedCampaignId, {}, {}, {});
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-right animate-fade-in" dir="rtl">
      
      {/* Wallet Deposit Section */}
      <div className="lg:col-span-1 space-y-6">
        
        {/* Wallet Balance Card */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 p-6 text-white shadow-lg shadow-blue-600/15">
          <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-44 h-44 bg-white/5 rounded-full blur-2xl" />
          <div className="absolute left-0 bottom-0 -translate-x-12 translate-y-12 w-44 h-44 bg-white/5 rounded-full blur-2xl" />

          <div className="relative space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-100">کیف پول شتابی رپورتاژ آگهی</span>
              <CreditCard className="w-5 h-5 text-blue-200" />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] text-blue-200 font-bold block">موجودی فعلی حساب شما:</span>
              <span className="text-2xl font-black block tracking-tight">{formatPrice(balance)}</span>
            </div>

            <div className="pt-4 border-t border-blue-500/30 flex justify-between text-[10px] text-blue-200 font-bold">
              <span>وضعیت حساب: فعال و معتبر</span>
              <span>تعداد کل تراکنش‌ها: {transactions.length}</span>
            </div>
          </div>
        </div>

        {/* Top-up Form */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="pb-2 border-b border-slate-200">
            <h4 className="font-extrabold text-slate-800 text-xs">افزایش موجودی آنلاین</h4>
            <p className="text-[10px] text-slate-400 mt-0.5">موجودی کیف پول خود را به سرعت جهت خرید رپورتاژ شارژ کنید.</p>
          </div>

          <form onSubmit={handleDepositSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600">مبلغ شارژ (تومان):</label>
              <div className="relative">
                <input
                  type="number"
                  min="50000"
                  required
                  placeholder="حداقل ۵۰,۰۰۰ تومان"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 text-slate-700 font-bold"
                />
                <span className="absolute left-3 top-2 text-[10px] text-slate-400 font-bold pointer-events-none">تومان</span>
              </div>
            </div>

            {/* Quick selectors */}
            <div className="grid grid-cols-3 gap-2">
              {[500000, 1000000, 2000000].map((amt) => (
                <button
                  type="button"
                  key={amt}
                  onClick={() => setDepositAmount(amt.toString())}
                  className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 text-[10px] font-bold py-1.5 rounded-lg transition-colors cursor-pointer text-center"
                >
                  +{amt.toLocaleString("fa-IR")}
                </button>
              ))}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black text-xs py-2.5 rounded-xl transition-all shadow-md shadow-blue-600/10 cursor-pointer"
            >
              اتصال به درگاه بانکی شتاب
            </button>
          </form>

          {successMsg && (
            <div className="p-3 bg-emerald-50 text-emerald-800 text-[10px] font-bold rounded-xl border border-emerald-100 text-center animate-fade-in">
              ✓ افزایش موجودی با موفقیت انجام شد و کیف پول شارژ گردید.
            </div>
          )}
        </div>

      </div>

      {/* Main Right Side Columns (Cart / Transactions Tabbed Component) */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Tab selector for Wallet operations */}
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setRightPanelTab("cart")}
            className={`flex-1 py-2.5 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-2 ${
              rightPanelTab === "cart"
                ? "bg-white text-blue-700 shadow-xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>سبد خرید رپورتاژها</span>
            {cartItems.length > 0 && (
              <span className="bg-blue-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">
                {cartItems.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setRightPanelTab("transactions")}
            className={`flex-1 py-2.5 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-2 ${
              rightPanelTab === "transactions"
                ? "bg-white text-blue-700 shadow-xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Clock3 className="w-4 h-4" />
            <span>ریز تراکنش‌های مالی</span>
          </button>
        </div>

        {/* Tab Content 1: SHOPPING CART */}
        {rightPanelTab === "cart" && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6 animate-fade-in">
            <div className="pb-3 border-b border-slate-200 flex justify-between items-center">
              <div>
                <h4 className="font-extrabold text-slate-800 text-xs">سبد خرید رپورتاژهای سئو</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">رسانه‌های مدنظر خود را پیکربندی کرده و در قالب کمپین منتشر کنید.</p>
              </div>
              <span className="text-[10px] text-blue-600 font-black bg-blue-50 px-3 py-1.5 rounded-xl">
                تعداد کل: {cartItems.length} رسانه
              </span>
            </div>

            {cartItems.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <p className="text-slate-600 text-xs font-black">سبد خرید شما خالی است!</p>
                  <p className="text-slate-400 text-[10px]">همین حالا از بخش «خرید رپورتاژ آگهی»، رسانه‌های باکیفیت را به سبد خرید اضافه کنید.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                
                {/* Campaigns Configuration Header */}
                <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-500 shrink-0" />
                    <span className="text-[11px] font-black text-slate-700">اتصال سفارش‌ها به کمپین و بستن آن</span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 block">کمپین هدف برای ثبت سفارش‌ها:</label>
                      <select
                        value={selectedCampaignId}
                        onChange={(e) => setSelectedCampaignId(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 bg-white font-extrabold text-slate-600"
                      >
                        <option value="">-- بدون کمپین (ثبت انفرادی) --</option>
                        {campaigns.map((camp) => (
                          <option key={camp.id} value={camp.id}>
                            {camp.name} ({camp.ordersCount} رپورتاژ ثبت‌شده)
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 block">یا ایجاد سریع کمپین جدید:</label>
                      <div className="flex gap-1.5">
                        <input
                          type="text"
                          placeholder="نام کمپین جدید (مثلا: کمپین تابستان)"
                          value={newCampaignName}
                          onChange={(e) => setNewCampaignName(e.target.value)}
                          className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 bg-white"
                        />
                        <button
                          type="button"
                          onClick={handleCreateNewCampaignInline}
                          className="bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-[10px] px-3.5 py-1.5 rounded-xl transition-all shrink-0 cursor-pointer"
                        >
                          ساخت کمپین
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cart Items List */}
                <div className="space-y-4 max-h-[400px] overflow-y-auto pl-1">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 bg-white border border-slate-200 hover:border-blue-200 rounded-xl transition-all space-y-3.5 shadow-2xs"
                    >
                      {/* Web Logo, Title & Details */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-black text-sm">
                            {item.logo}
                          </div>
                          <div>
                            <span className="font-extrabold text-slate-800 text-xs block">{item.name}</span>
                            <span className="text-[9px] text-slate-400 font-mono block mt-0.5" dir="ltr">{item.domain}</span>
                          </div>
                          <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md text-[9px] font-bold">
                            DA: {item.domainAuthority} | قیمت: {formatPrice(item.price)}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => onRemoveFromCart(item.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="حذف از سبد خرید"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Media metadata highlight */}
                      <div className="pt-2 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] text-slate-500 font-bold">
                        <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                          <span className="text-slate-400 block">اتوریتی دامنه:</span>
                          <span className="text-slate-800 font-extrabold text-xs">DA {item.domainAuthority}</span>
                        </div>
                        <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                          <span className="text-slate-400 block">امتیاز اسپم:</span>
                          <span className="text-slate-800 font-extrabold text-xs">SS {item.spamScore}%</span>
                        </div>
                        <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                          <span className="text-slate-400 block">زمان پاسخگویی:</span>
                          <span className="text-slate-800 font-extrabold text-xs">{item.deliveryTime}</span>
                        </div>
                        <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                          <span className="text-slate-400 block">حداکثر لینک مجاز:</span>
                          <span className="text-blue-600 font-extrabold text-xs">{item.allowedLinksCount} لینک فالو</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Checkout Section & Billing Summary */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                  <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100/50 flex items-start gap-2 text-[10px] text-blue-800 leading-relaxed font-bold">
                    <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                    <p>
                      توجه: پس از پرداخت سبد خرید، این رپورتاژها به صورت پیش‌نویس در بخش «رپورتاژهای من» ذخیره می‌شوند و شما می‌توانید از طریق ادیتور حرفه‌ای و مجزا، متن رپورتاژ را نگارش کرده، فایل ورد آپلود کنید و برای ناشر ارسال نمایید.
                    </p>
                  </div>

                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs font-bold text-slate-700">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span>مجموع تعرفه رپورتاژها ({cartItems.length} رسانه):</span>
                        <span className="text-slate-900 font-black text-sm">{formatPrice(totalCost)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px]">
                        <span>موجودی کیف پول شما:</span>
                        <span className="text-blue-600 font-black">{formatPrice(balance)}</span>
                      </div>
                    </div>

                    {!isSufficient ? (
                      <div className="flex items-center gap-2 bg-rose-50 border border-rose-100 p-2.5 rounded-xl text-rose-800 font-extrabold text-[10px]">
                        <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0" />
                        <div>
                          <span>کسری موجودی: {formatPrice(shortage)}</span>
                          <span className="block text-[9px] text-rose-500 font-bold mt-0.5">لطفاً برای تکمیل خرید، از پنل افزایش موجودی کیف پول خود را شارژ کنید.</span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 p-2.5 rounded-xl text-emerald-800 font-extrabold text-[10px]">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>موجودی کیف پول برای این سفارش کافی است!</span>
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={handlePayAndFinalizeCampaign}
                    disabled={!isSufficient}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-300 text-white font-black text-xs py-3 rounded-xl transition-all shadow-md shadow-emerald-600/10 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>پرداخت آنلاین و ثبت کمپین ({formatPrice(totalCost)})</span>
                  </button>
                </div>

              </div>
            )}
          </div>
        )}

        {/* Tab Content 2: TRANSACTION HISTORY */}
        {rightPanelTab === "transactions" && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 animate-fade-in">
            <div className="pb-2 border-b border-slate-200">
              <h4 className="font-extrabold text-slate-800 text-xs">ریز تراکنش‌های مالی حساب</h4>
              <p className="text-[10px] text-slate-400 mt-0.5">لیست تمامی دریافتی‌ها، پرداخت‌ها و افزایش اعتبارها</p>
            </div>

            {transactions.length === 0 ? (
              <p className="text-slate-400 text-xs py-16 text-center font-bold">هیچ تراکنشی یافت نشد.</p>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {transactions.map((trx) => (
                  <div
                    key={trx.id}
                    className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-xl ${
                        trx.type === "deposit" || trx.type === "income"
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-rose-50 text-rose-600"
                      }`}>
                        {trx.type === "deposit" || trx.type === "income" ? (
                          <ArrowDownRight className="w-4 h-4" />
                        ) : (
                          <ArrowUpLeft className="w-4 h-4" />
                        )}
                      </div>
                      <div className="space-y-1">
                        <span className="font-bold text-slate-800 block">{trx.description}</span>
                        <span className="text-[9px] text-slate-400 font-semibold block">{trx.date}</span>
                      </div>
                    </div>

                    <div className="text-left space-y-1">
                      <span className={`font-black text-sm block ${
                        trx.type === "deposit" || trx.type === "income"
                          ? "text-emerald-600"
                          : "text-rose-600"
                      }`}>
                        {trx.type === "deposit" || trx.type === "income" ? "+" : "-"}
                        {formatPrice(trx.amount)}
                      </span>
                      <div className="flex items-center gap-1 justify-end text-[9px] font-bold text-slate-400">
                        {trx.status === "success" ? (
                          <>
                            <CheckCircle className="w-3 h-3 text-emerald-500" />
                            <span className="text-emerald-600">موفق</span>
                          </>
                        ) : trx.status === "pending" ? (
                          <>
                            <Clock className="w-3 h-3 text-amber-500 animate-spin" />
                            <span className="text-amber-600">در حال انجام</span>
                          </>
                        ) : (
                          <>
                            <AlertCircle className="w-3 h-3 text-rose-500" />
                            <span className="text-rose-600">ناموفق</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

    </div>
  );
}
