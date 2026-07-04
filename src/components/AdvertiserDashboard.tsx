import React, { useState } from "react";
import { AdvertorialOrder, Campaign, MediaWebsite } from "../types";
import {
  FileText,
  Calendar,
  AlertCircle,
  ExternalLink,
  Plus,
  TrendingUp,
  FolderOpen,
  DollarSign,
  Briefcase,
  CheckCircle,
  Sparkles,
  Edit2,
  Trash2,
  Check,
  Eye
} from "lucide-react";
import AdvertorialEditorView from "./AdvertorialEditorView";

interface AdvertiserDashboardProps {
  orders: AdvertorialOrder[];
  campaigns: Campaign[];
  websites: MediaWebsite[];
  onCreateCampaign: (name: string, budget: number) => void;
  onUpdateOrder: (order: AdvertorialOrder) => void;
  onDeleteOrder: (id: string) => void;
  onAnalyzeOrderSEO: (order: AdvertorialOrder) => void;
  userWalletBalance: number;
}

export default function AdvertiserDashboard({
  orders,
  campaigns,
  websites = [],
  onCreateCampaign,
  onUpdateOrder,
  onDeleteOrder,
  onAnalyzeOrderSEO,
  userWalletBalance,
}: AdvertiserDashboardProps) {
  const [newCampaignName, setNewCampaignName] = useState("");
  const [newCampaignBudget, setNewCampaignBudget] = useState("");
  const [showCampaignModal, setShowCampaignModal] = useState(false);

  // Edit Order State
  const [editingOrder, setEditingOrder] = useState<AdvertorialOrder | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editBody, setEditBody] = useState("");

  const formatPrice = (price: number) => {
    return price.toLocaleString("fa-IR") + " تومان";
  };

  // Stats Calculations
  const totalSpent = orders.filter((o) => o.status !== "rejected").reduce((sum, o) => sum + o.price, 0);
  const publishedCount = orders.filter((o) => o.status === "published").length;
  const pendingCount = orders.filter((o) => o.status === "pending").length;
  const draftCount = orders.filter((o) => o.status === "draft").length;
  const totalCampaigns = campaigns.length;

  const handleCreateCampaignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCampaignName) return;
    const budget = parseFloat(newCampaignBudget) || 0;
    onCreateCampaign(newCampaignName, budget);
    setNewCampaignName("");
    setNewCampaignBudget("");
    setShowCampaignModal(false);
  };

  const handleStartEdit = (order: AdvertorialOrder) => {
    setEditingOrder(order);
    setEditTitle(order.title);
    setEditBody(order.body);
  };

  const handleSaveEdit = () => {
    if (editingOrder) {
      onUpdateOrder({
        ...editingOrder,
        title: editTitle,
        body: editBody,
        status: "pending", // Reset to pending for publisher approval on edit
      });
      setEditingOrder(null);
    }
  };

  if (editingOrder) {
    const targetWebsite = websites.find((w) => w.id === editingOrder.websiteId);
    return (
      <AdvertorialEditorView
        order={editingOrder}
        website={targetWebsite}
        onSave={(updated) => {
          onUpdateOrder(updated);
          setEditingOrder(null);
        }}
        onCancel={() => setEditingOrder(null)}
      />
    );
  }

  return (
    <div className="space-y-8 text-right animate-fade-in" dir="rtl">
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        
        {/* Wallet */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 font-bold block">موجودی کیف پول</span>
            <span className="text-base font-black text-slate-800 block">{formatPrice(userWalletBalance)}</span>
          </div>
          <div className="bg-emerald-50 text-emerald-600 p-3 rounded-xl">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        {/* Total Spent */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 font-bold block">کل بودجه مصرف شده</span>
            <span className="text-base font-black text-slate-800 block">{formatPrice(totalSpent)}</span>
          </div>
          <div className="bg-blue-50 text-blue-600 p-3 rounded-xl">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        {/* Campaigns */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 font-bold block">کمپین‌های فعال</span>
            <span className="text-base font-black text-slate-800 block">{totalCampaigns} کمپین</span>
          </div>
          <div className="bg-slate-50 text-slate-600 p-3 rounded-xl">
            <Briefcase className="w-5 h-5" />
          </div>
        </div>

        {/* Orders */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 font-bold block">وضعیت سفارش‌ها</span>
            <span className="text-[11px] font-bold text-slate-600 block">
              <span className="text-emerald-600 font-extrabold">{publishedCount} منتشر</span> / <span className="text-amber-500 font-extrabold">{pendingCount} معلق</span> / <span className="text-blue-600 font-extrabold">{draftCount} پیش‌نویس</span>
            </span>
          </div>
          <div className="bg-blue-50 text-blue-600 p-3 rounded-xl">
            <FileText className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* Visual Analytics & Campaigns Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Native SVG spending trend chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-extrabold text-slate-800 text-sm">نمودار روند هزینه کمپین‌ها در ماه‌های اخیر</h4>
            <span className="text-[10px] text-blue-600 font-bold">بازه ۳ ماهه گذشته</span>
          </div>

          <div className="relative pt-4">
            {/* SVG Chart */}
            <svg viewBox="0 0 500 180" className="w-full h-44 overflow-visible">
              {/* Grid lines */}
              <line x1="40" y1="20" x2="480" y2="20" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="40" y1="70" x2="480" y2="70" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="40" y1="120" x2="480" y2="120" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3,3" />
              <line x1="40" y1="150" x2="480" y2="150" stroke="#e2e8f0" strokeWidth="1" />

              {/* Data line (simulated) */}
              <path
                d="M 60,140 Q 150,110 240,80 T 420,40"
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              {/* Fill under line */}
              <path
                d="M 60,140 Q 150,110 240,80 T 420,40 L 420,150 L 60,150 Z"
                fill="url(#area-gradient)"
                opacity="0.15"
              />

              {/* Data points */}
              <circle cx="60" cy="140" r="5" className="fill-blue-600 stroke-white" strokeWidth="2" />
              <circle cx="240" cy="80" r="5" className="fill-blue-600 stroke-white" strokeWidth="2" />
              <circle cx="420" cy="40" r="5" className="fill-blue-600 stroke-white" strokeWidth="2" />

              {/* Y Axis Labels */}
              <text x="30" y="25" textAnchor="end" className="fill-slate-400 font-mono text-[9px]">4M</text>
              <text x="30" y="75" textAnchor="end" className="fill-slate-400 font-mono text-[9px]">2M</text>
              <text x="30" y="125" textAnchor="end" className="fill-slate-400 font-mono text-[9px]">1M</text>
              <text x="30" y="155" textAnchor="end" className="fill-slate-400 font-mono text-[9px]">0</text>

              {/* X Axis Labels */}
              <text x="60" y="170" textAnchor="middle" className="fill-slate-500 font-semibold text-[10px]">فروردین</text>
              <text x="240" y="170" textAnchor="middle" className="fill-slate-500 font-semibold text-[10px]">اردیبهشت</text>
              <text x="420" y="170" textAnchor="middle" className="fill-slate-500 font-semibold text-[10px]">خرداد</text>

              {/* Gradients */}
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#2563eb" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
                <linearGradient id="area-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#ffffff" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* Campaigns Panel */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5">
                <FolderOpen className="w-4.5 h-4.5 text-slate-500" />
                <span>کمپین‌های فعال شما</span>
              </h4>
              <button
                onClick={() => setShowCampaignModal(true)}
                className="text-xs bg-blue-50 text-blue-700 hover:bg-blue-100 font-black px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>کمپین جدید</span>
              </button>
            </div>

            {/* Campaign lists */}
            <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
              {campaigns.map((camp) => (
                <div
                  key={camp.id}
                  className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs"
                >
                  <div className="space-y-1">
                    <span className="font-bold text-slate-800 block">{camp.name}</span>
                    <span className="text-[10px] text-slate-400 block font-semibold">ثبت در {camp.dateCreated}</span>
                  </div>
                  <div className="text-left">
                    <span className="font-extrabold text-slate-700 block">{formatPrice(camp.budget)}</span>
                    <span className="text-[9px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md font-extrabold inline-block mt-1">
                      {camp.ordersCount} رپورتاژ
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="text-[10px] text-slate-400 font-semibold pt-3 border-t border-slate-200">
            با تعریف کمپین می‌توانید سفارش‌های رپورتاژ خود را دسته‌بندی و گزارش‌گیری کنید.
          </p>
        </div>

      </div>

      {/* Order List Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        
        {/* Table Header block */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h4 className="font-black text-slate-800 text-base">لیست سفارش‌های رپورتاژ آگهی</h4>
            <p className="text-slate-400 text-xs mt-0.5">وضعیت انتشار، جزییات متن و تایید نهایی ناشران را مدیریت کنید.</p>
          </div>
        </div>

        {/* Table */}
        {orders.length === 0 ? (
          <div className="text-center py-16 px-4">
            <p className="text-slate-400 font-medium text-sm">هنوز هیچ سفارش رپورتاژی ثبت نکرده‌اید.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs font-bold border-b border-slate-200">
                  <th className="p-4 pr-6">رسانه مقصد</th>
                  <th className="p-4">عنوان رپورتاژ آگهی</th>
                  <th className="p-4 text-center">کمپین</th>
                  <th className="p-4 text-center">تاریخ ثبت</th>
                  <th className="p-4 text-center">هزینه</th>
                  <th className="p-4 text-center">وضعیت</th>
                  <th className="p-4 text-left pl-6">عملیات سفارش</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50/30 transition-colors">
                    {/* Media name */}
                    <td className="p-4 pr-6 font-bold">
                      <span className="text-slate-800 block text-sm">{ord.websiteName}</span>
                      <span className="text-[10px] text-slate-400 font-mono tracking-tight" dir="ltr">
                        {ord.websiteDomain}
                      </span>
                    </td>

                    {/* Title */}
                    <td className="p-4 font-semibold text-slate-700 max-w-xs truncate">
                      {ord.title}
                    </td>

                    {/* Campaign */}
                    <td className="p-4 text-center text-slate-500 font-semibold">
                      {ord.campaignName || <span className="text-slate-400 text-[10px]">بدون کمپین</span>}
                    </td>

                    {/* Date */}
                    <td className="p-4 text-center font-mono text-slate-500">
                      {ord.dateCreated}
                    </td>

                    {/* Price */}
                    <td className="p-4 text-center font-black text-slate-800 text-sm">
                      {formatPrice(ord.price)}
                    </td>

                    {/* Status */}
                    <td className="p-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-black ${
                          ord.status === "published"
                            ? "bg-emerald-50 text-emerald-700"
                            : ord.status === "pending"
                            ? "bg-amber-50 text-amber-700"
                            : ord.status === "rejected"
                            ? "bg-rose-50 text-rose-700"
                            : "bg-slate-50 text-slate-600"
                        }`}
                      >
                        {ord.status === "published"
                          ? "منتشر شده"
                          : ord.status === "pending"
                          ? "در انتظار تایید ناشر"
                          : ord.status === "rejected"
                          ? "رد شده"
                          : "پیش‌نویس"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-left pl-6">
                      <div className="flex items-center justify-end gap-2.5">
                        
                        {/* Final Link (if published) */}
                        {ord.status === "published" && ord.publishedUrl && (
                          <a
                            href={ord.publishedUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-2 rounded-lg transition-colors"
                            title="مشاهده صفحه منتشر شده"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}

                        {/* SEO AI Checker */}
                        <button
                          onClick={() => onAnalyzeOrderSEO(ord)}
                          className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-extrabold px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                          title="آنالیز سئو با هوش مصنوعی"
                        >
                          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                          <span>آنالیز سئو هوشمند</span>
                        </button>

                        {/* Write/Edit (if draft, pending, or rejected) */}
                        {ord.status === "draft" ? (
                          <button
                            onClick={() => handleStartEdit(ord)}
                            className="bg-blue-600 hover:bg-blue-500 text-white font-black px-3 py-1.5 rounded-xl transition-all flex items-center gap-1 cursor-pointer animate-pulse"
                            title="نگارش رپورتاژ و انتشار"
                          >
                            <Edit2 className="w-3 h-3" />
                            <span>نگارش و انتشار</span>
                          </button>
                        ) : (ord.status === "pending" || ord.status === "rejected") ? (
                          <button
                            onClick={() => handleStartEdit(ord)}
                            className="bg-blue-50 hover:bg-blue-100 text-blue-700 p-2 rounded-lg transition-colors cursor-pointer"
                            title="ویرایش متن رپورتاژ"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        ) : null}

                        {/* Delete Draft */}
                        {(ord.status === "rejected" || ord.status === "draft") && (
                          <button
                            onClick={() => onDeleteOrder(ord.id)}
                            className="bg-rose-50 hover:bg-rose-100 text-rose-600 p-2 rounded-lg transition-colors cursor-pointer"
                            title="حذف سفارش"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}

                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

      {/* Rejection Notification Warning */}
      {orders.some((o) => o.status === "rejected") && (
        <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h5 className="font-bold text-rose-800 text-xs">سفارش رپورتاژ رد شده دارید!</h5>
            <p className="text-rose-700 text-[10px] leading-relaxed">
              برخی از رسانه‌ها به علت قوانین مربوط به تصاویر یا عدم همخوانی بریف محتوا، سفارش شما را رد کرده‌اند. می‌توانید متن رپورتاژ را ویرایش کرده و مجدداً جهت بررسی ارسال فرمایید.
            </p>
          </div>
        </div>
      )}

      {/* Create Campaign Modal */}
      {showCampaignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden text-right">
            <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <h4 className="font-extrabold text-slate-800 text-base">ایجاد کمپین سئو جدید</h4>
              <button onClick={() => setShowCampaignModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">×</button>
            </div>
            <form onSubmit={handleCreateCampaignSubmit} className="p-5 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600">نام کمپین:</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: سئو کلمات کلیدی پاییز ۱۴۰۶"
                  value={newCampaignName}
                  onChange={(e) => setNewCampaignName(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 text-slate-700 placeholder-slate-400 bg-slate-50/50"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600">بودجه تقریبی کمپین (تومان):</label>
                <input
                  type="number"
                  placeholder="مثال: ۵۰۰۰۰۰۰"
                  value={newCampaignBudget}
                  onChange={(e) => setNewCampaignBudget(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 text-slate-700 placeholder-slate-400 bg-slate-50/50"
                />
              </div>
              <div className="pt-3 flex gap-2 justify-end text-xs">
                <button
                  type="button"
                  onClick={() => setShowCampaignModal(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl transition-colors font-bold"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-xl transition-colors font-bold shadow-md shadow-blue-600/10 cursor-pointer"
                >
                  ایجاد کمپین
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Order Modal */}
      {editingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden text-right flex flex-col max-h-[85vh]">
            <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <div>
                <h4 className="font-extrabold text-slate-800 text-base">ویرایش محتوای رپورتاژ</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">پس از ذخیره تغییرات، رپورتاژ جهت بازبینی مجدد برای ناشر ارسال خواهد شد.</p>
              </div>
              <button onClick={() => setEditingOrder(null)} className="text-slate-400 hover:text-slate-600 font-bold">×</button>
            </div>
            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600">عنوان رپورتاژ:</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 text-slate-700"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600">متن رپورتاژ (تگ‌های HTML ساده پشتیبانی می‌شود):</label>
                <textarea
                  value={editBody}
                  onChange={(e) => setEditBody(e.target.value)}
                  rows={10}
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 text-slate-700 font-mono"
                />
              </div>
            </div>
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex gap-2 justify-end text-xs">
              <button
                type="button"
                onClick={() => setEditingOrder(null)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl transition-colors font-bold"
              >
                انصراف
              </button>
              <button
                type="button"
                onClick={handleSaveEdit}
                className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-xl transition-colors font-bold flex items-center gap-1.5 shadow-md shadow-blue-600/10 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>بروزرسانی و ارسال مجدد</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
