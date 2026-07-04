import React, { useState } from "react";
import { AdvertorialOrder, MediaWebsite, WalletTransaction, MediaRegistrationRequest } from "../types";
import { Check, X, ShieldAlert, Globe, Link2, DollarSign, ExternalLink, Edit2, CheckCircle, RefreshCw, AlertTriangle, Image, ArrowRight, BookOpen, FileText, Plus, Clock, Info } from "lucide-react";

interface PublisherDashboardProps {
  myWebsites: MediaWebsite[];
  receivedOrders: AdvertorialOrder[];
  onUpdateWebsitePrice: (id: string, newPrice: number, description: string) => void;
  onPublishOrder: (orderId: string, finalUrl: string) => void;
  onRejectOrder: (orderId: string, reason: string) => void;
  publisherBalance: number;
  onWithdrawRequest: (amount: number) => void;
  myRegistrationRequests?: MediaRegistrationRequest[];
  onAddMediaRequest?: (req: Omit<MediaRegistrationRequest, "id" | "status" | "publisherName" | "publisherEmail">) => void;
  currentUser?: { name: string; email: string; avatarUrl?: string } | null;
}

export default function PublisherDashboard({
  myWebsites,
  receivedOrders,
  onUpdateWebsitePrice,
  onPublishOrder,
  onRejectOrder,
  publisherBalance,
  onWithdrawRequest,
  myRegistrationRequests = [],
  onAddMediaRequest,
  currentUser,
}: PublisherDashboardProps) {
  // Viewing Order Dedicated Page View state
  const [viewingOrderDetails, setViewingOrderDetails] = useState<AdvertorialOrder | null>(null);

  // Sync state with updated receivedOrders list
  const activeViewingOrder = viewingOrderDetails
    ? receivedOrders.find((o) => o.id === viewingOrderDetails.id) || viewingOrderDetails
    : null;

  const getFeaturedImage = (ord: AdvertorialOrder) => {
    if (ord.featuredImage) return ord.featuredImage;
    if (ord.id === "ord_1" || ord.title.includes("هوش مصنوعی") || ord.title.includes("نرم‌افزار")) {
      return "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80";
    }
    if (ord.id === "ord_2" || ord.title.includes("استارتاپ") || ord.title.includes("کارآفرینی")) {
      return "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80";
    }
    if (ord.id === "ord_3" || ord.title.includes("گوشی") || ord.title.includes("موبایل") || ord.title.includes("تلفن")) {
      return "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80";
    }
    return "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80";
  };

  // Website Price Edit State
  const [editingWebsite, setEditingWebsite] = useState<MediaWebsite | null>(null);
  const [newPrice, setNewPrice] = useState("");
  const [newDesc, setNewDesc] = useState("");

  // New Media Website Registration State
  const [showAddMediaModal, setShowAddMediaModal] = useState(false);
  const [mediaName, setMediaName] = useState("");
  const [mediaDomain, setMediaDomain] = useState("");
  const [mediaCategory, setMediaCategory] = useState<"technology" | "news" | "lifestyle" | "finance" | "education" | "sports">("technology");
  const [mediaPrice, setMediaPrice] = useState("");
  const [mediaLinkType, setMediaLinkType] = useState<"follow" | "nofollow" | "both">("follow");
  const [mediaDeliveryTime, setMediaDeliveryTime] = useState("۲۴ ساعت");
  const [mediaAllowedLinks, setMediaAllowedLinks] = useState(3);
  const [mediaDa, setMediaDa] = useState(35);
  const [mediaSs, setMediaSs] = useState(1);
  const [mediaAlexa, setMediaAlexa] = useState(1500);
  const [mediaDesc, setMediaDesc] = useState("");

  const handleAddMediaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mediaName.trim() || !mediaDomain.trim() || !mediaPrice.trim() || !mediaDesc.trim()) {
      alert("لطفاً تمامی فیلدهای الزامی را تکمیل کنید.");
      return;
    }

    const categoryLabels: Record<string, string> = {
      technology: "فناوری و تکنولوژی",
      news: "اخبار و خبرگزاری",
      lifestyle: "سبک زندگی و خانواده",
      finance: "اقتصاد و بازار مالی",
      education: "آموزشی و موفقیت",
      sports: "ورزش و سرگرمی"
    };

    if (onAddMediaRequest) {
      onAddMediaRequest({
        name: mediaName.trim(),
        domain: mediaDomain.trim().toLowerCase(),
        logo: mediaName.trim().charAt(0).toUpperCase(),
        category: mediaCategory,
        categoryLabel: categoryLabels[mediaCategory] || "عمومی",
        domainAuthority: Number(mediaDa) || 15,
        spamScore: Number(mediaSs) || 1,
        alexaRank: Number(mediaAlexa) || 1000,
        price: parseFloat(mediaPrice) || 0,
        linkType: mediaLinkType,
        deliveryTime: mediaDeliveryTime,
        allowedLinksCount: Number(mediaAllowedLinks) || 3,
        description: mediaDesc.trim()
      });

      // Reset Form State
      setMediaName("");
      setMediaDomain("");
      setMediaCategory("technology");
      setMediaPrice("");
      setMediaLinkType("follow");
      setMediaDeliveryTime("۲۴ ساعت");
      setMediaAllowedLinks(3);
      setMediaDa(35);
      setMediaSs(1);
      setMediaAlexa(1500);
      setMediaDesc("");
      setShowAddMediaModal(false);
    }
  };

  // Publish Order Action State
  const [publishingOrder, setPublishingOrder] = useState<AdvertorialOrder | null>(null);
  const [finalPublishedUrl, setFinalPublishedUrl] = useState("");

  // Reject Order Action State
  const [rejectingOrder, setRejectingOrder] = useState<AdvertorialOrder | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  // Withdraw request State
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);

  const formatPrice = (price: number) => {
    return price.toLocaleString("fa-IR") + " تومان";
  };

  const handlePriceUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingWebsite) {
      onUpdateWebsitePrice(editingWebsite.id, parseFloat(newPrice) || 0, newDesc);
      setEditingWebsite(null);
    }
  };

  const handlePublishSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (publishingOrder && finalPublishedUrl) {
      onPublishOrder(publishingOrder.id, finalPublishedUrl);
      setPublishingOrder(null);
      setFinalPublishedUrl("");
    }
  };

  const handleRejectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rejectingOrder && rejectionReason) {
      onRejectOrder(rejectingOrder.id, rejectionReason);
      setRejectingOrder(null);
      setRejectionReason("");
    }
  };

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(withdrawAmount);
    if (amount > 0 && amount <= publisherBalance) {
      onWithdrawRequest(amount);
      setWithdrawAmount("");
      setWithdrawSuccess(true);
      setTimeout(() => setWithdrawSuccess(false), 3000);
    }
  };

  const pendingReceivedOrders = receivedOrders.filter((o) => o.status === "pending");
  const publishedReceivedOrders = receivedOrders.filter((o) => o.status === "published");
  const totalPublisherEarnings = publishedReceivedOrders.reduce((sum, o) => sum + o.price, 0);

  return (
    <div className="space-y-8 text-right animate-fade-in" dir="rtl">
      
      {/* Publisher Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Wallet Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 font-bold block">موجودی قابل برداشت شما</span>
            <span className="text-base font-black text-slate-800 block">{formatPrice(publisherBalance)}</span>
          </div>
          <div className="bg-emerald-50 text-emerald-600 p-3 rounded-xl">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        {/* Total Earned */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 font-bold block">کل درآمد کسب شده</span>
            <span className="text-base font-black text-emerald-700 block">{formatPrice(totalPublisherEarnings)}</span>
          </div>
          <div className="bg-blue-50 text-blue-600 p-3 rounded-xl">
            <CheckCircle className="w-5 h-5" />
          </div>
        </div>

        {/* Pending Tasks */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 font-bold block">رپورتاژهای در انتظار انتشار</span>
            <span className="text-base font-black text-amber-600 block">{pendingReceivedOrders.length} سفارش معلق</span>
          </div>
          <div className="bg-amber-50 text-amber-600 p-3 rounded-xl">
            <RefreshCw className="w-5 h-5" />
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Manage My Media Websites */}
        <div className="lg:col-span-1 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="pb-2 border-b border-slate-200">
            <h4 className="font-extrabold text-slate-800 text-xs">رسانه‌ها و وبسایت‌های تحت مدیریت من</h4>
            <p className="text-[10px] text-slate-400 mt-0.5">درگاه، تعرفه و شرایط ثبت رپورتاژ را مدیریت کنید.</p>
          </div>

          <button
            onClick={() => setShowAddMediaModal(true)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-black py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-blue-500/10"
          >
            <Plus className="w-4 h-4" />
            <span>ثبت و اضافه کردن رسانه جدید</span>
          </button>

          <div className="space-y-4">
            {myWebsites.map((site) => (
              <div key={site.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-black text-xs">
                      {site.logo}
                    </div>
                    <div>
                      <span className="font-bold text-slate-800 text-xs block">{site.name}</span>
                      <span className="text-[9px] text-slate-400 font-mono" dir="ltr">{site.domain}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setEditingWebsite(site);
                      setNewPrice(site.price.toString());
                      setNewDesc(site.description);
                    }}
                    className="text-[10px] text-blue-600 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>ویرایش تعرفه</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px] font-semibold text-slate-500 pt-1 border-t border-slate-200/50">
                  <div>
                    <span>تعرفه فعلی:</span>
                    <span className="text-blue-600 font-extrabold block mt-0.5">{formatPrice(site.price)}</span>
                  </div>
                  <div>
                    <span>زمان تحویل:</span>
                    <span className="text-slate-800 font-extrabold block mt-0.5">{site.deliveryTime}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Registration Requests Section */}
          {myRegistrationRequests.length > 0 && (
            <div className="pt-4 border-t border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <h5 className="font-bold text-slate-800 text-xs flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>رسانه‌های در انتظار تایید / رد شده</span>
                </h5>
                <span className="text-[9px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-bold">
                  {myRegistrationRequests.filter(r => r.status !== "approved").length} رسانه
                </span>
              </div>
              <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                {myRegistrationRequests.filter(r => r.status !== "approved").map((req) => (
                  <div key={req.id} className="p-3 bg-slate-50/50 border border-slate-200 rounded-xl space-y-2 text-right">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-slate-200 text-slate-700 flex items-center justify-center font-black text-[10px]">
                          {req.logo || req.name.charAt(0)}
                        </div>
                        <div>
                          <span className="font-bold text-slate-700 text-[11px] block">{req.name}</span>
                          <span className="text-[8px] text-slate-400 font-mono" dir="ltr">{req.domain}</span>
                        </div>
                      </div>
                      
                      {req.status === "pending" && (
                        <span className="text-[8px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full font-bold border border-amber-200">
                          در انتظار تایید
                        </span>
                      )}
                      {req.status === "rejected" && (
                        <span className="text-[8px] bg-rose-50 text-rose-700 px-2 py-0.5 rounded-full font-bold border border-rose-200">
                          رد شده
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-1 text-[9px] text-slate-500 pt-1 border-t border-slate-100">
                      <div>
                        <span>تعرفه پیشنهادی:</span>
                        <span className="text-slate-800 font-bold block">{formatPrice(req.price)}</span>
                      </div>
                      <div>
                        <span>شاخص DA:</span>
                        <span className="text-slate-800 font-bold block">{req.domainAuthority}</span>
                      </div>
                    </div>

                    {req.status === "rejected" && req.rejectionReason && (
                      <div className="bg-rose-50 p-2 rounded-lg border border-rose-100 text-[9px] text-rose-600 font-bold flex items-start gap-1">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-rose-500" />
                        <span>علت رد: {req.rejectionReason}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Withdrawal Form */}
          <div className="pt-4 border-t border-slate-200 space-y-3">
            <h5 className="font-bold text-slate-800 text-xs">درخواست تسویه حساب (واریز به شبا)</h5>
            <form onSubmit={handleWithdrawSubmit} className="space-y-3">
              <div className="relative">
                <input
                  type="number"
                  placeholder="مبلغ درخواستی به تومان"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 text-slate-700"
                />
                <span className="absolute left-3 top-2.5 text-[10px] text-slate-400 font-bold pointer-events-none">تومان</span>
              </div>
              <button
                type="submit"
                className="w-full bg-slate-800 hover:bg-slate-900 text-white text-xs font-black py-2 rounded-xl transition-all cursor-pointer"
              >
                ارسال درخواست واریز
              </button>
            </form>
            {withdrawSuccess && (
              <p className="text-[10px] text-emerald-600 font-bold bg-emerald-50 p-2 rounded-lg text-center animate-fade-in">
                ✓ درخواست با موفقیت ثبت شد و ظرف ۲۴ ساعت آینده واریز می‌گردد.
              </p>
            )}
          </div>
        </div>

        {/* Received Advertorial Orders list */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="pb-2 border-b border-slate-200 flex justify-between items-center">
            <div>
              <h4 className="font-extrabold text-slate-800 text-xs">سفارش‌های رپورتاژ آگهی دریافتی</h4>
              <p className="text-[10px] text-slate-400 mt-0.5">مقالات را مطالعه، تایید و منتشر کنید تا درآمد را به دست آورید.</p>
            </div>
            <span className="text-[10px] bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full font-bold">
              {pendingReceivedOrders.length} جدید
            </span>
          </div>

          {receivedOrders.length === 0 ? (
            <p className="text-slate-400 text-xs py-12 text-center">هیچ سفارشی در حال حاضر ثبت نشده است.</p>
          ) : (
            <div className="space-y-4">
              {receivedOrders.map((ord) => (
                <div
                  key={ord.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    ord.status === "pending"
                      ? "bg-amber-50/20 border-amber-100"
                      : ord.status === "published"
                      ? "bg-emerald-50/10 border-emerald-100"
                      : "bg-slate-50 border-slate-200"
                  }`}
                >
                  <div className="flex justify-between items-start flex-wrap gap-2 pb-3 border-b border-dashed border-slate-200">
                    <div>
                      <h5 className="font-black text-slate-800 text-xs leading-relaxed">{ord.title}</h5>
                      <div className="flex flex-wrap items-center gap-3 text-[9px] text-slate-400 font-semibold mt-1.5">
                        <span>تاریخ ارسال: {ord.dateCreated}</span>
                        <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                        <span>رسانه هدف: {ord.websiteName}</span>
                        <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                        <span className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md font-bold ${ord.scheduledDate ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' : 'bg-amber-50 text-amber-700 border border-amber-100'}`}>
                          <Clock className="w-3 h-3 shrink-0" />
                          <span>تاریخ مدنظر انتشار: {ord.scheduledDate ? ord.scheduledDate : "انتشار فوری"}</span>
                        </span>
                      </div>
                    </div>
                    <div className="text-left text-xs font-bold">
                      <span className="text-blue-600 block">{formatPrice(ord.price)}</span>
                      <span
                        className={`inline-block text-[9px] font-bold px-1.5 py-0.5 rounded-md mt-1 ${
                          ord.status === "published"
                            ? "bg-emerald-100 text-emerald-800"
                            : ord.status === "pending"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-rose-100 text-rose-800"
                        }`}
                      >
                        {ord.status === "published" ? "انتشار موفق" : ord.status === "pending" ? "منتظر انتشار" : "رد شده"}
                      </span>
                    </div>
                  </div>

                  {/* Compact Article Info with View Dedicated Page Action */}
                  <div className="my-3 flex flex-col sm:flex-row sm:items-center justify-between bg-slate-50 border border-slate-200/60 p-3 rounded-xl gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-12 rounded-lg bg-white border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center shadow-xs">
                        <img 
                          src={getFeaturedImage(ord)} 
                          alt={ord.title} 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="space-y-0.5 min-w-0">
                        <span className="text-[10px] text-slate-400 font-bold block">پیش‌نمایش تصویر و محتوا</span>
                        <span className="text-[11px] text-slate-700 font-bold block truncate max-w-[280px] sm:max-w-xs">{ord.title}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => setViewingOrderDetails(ord)}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-black px-4 py-2.5 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1 shrink-0 shadow-sm shadow-blue-500/15"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>مشاهده در صفحه اختصاصی رپورتاژ (باکیفیت بالا)</span>
                    </button>
                  </div>

                  {/* Reject/Publish actions if Pending */}
                  {ord.status === "pending" && (
                    <div className="flex gap-2 justify-end pt-1">
                      <button
                        onClick={() => setRejectingOrder(ord)}
                        className="bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>رد رپورتاژ</span>
                      </button>
                      <button
                        onClick={() => setPublishingOrder(ord)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black px-5 py-2 rounded-xl transition-all shadow-md shadow-emerald-600/10 cursor-pointer flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>انتشار رپورتاژ و دریافت وجه</span>
                      </button>
                    </div>
                  )}

                  {/* Show published final link */}
                  {ord.status === "published" && ord.publishedUrl && (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-emerald-50 text-emerald-800 p-2.5 rounded-xl text-[10px] font-bold">
                      <span>✓ این مقاله با موفقیت منتشر شد و وجه آن به کیف پول شما واریز گردید.</span>
                      <div className="flex items-center gap-3 self-end sm:self-auto">
                        <button
                          type="button"
                          onClick={() => {
                            setPublishingOrder(ord);
                            setFinalPublishedUrl(ord.publishedUrl || "");
                          }}
                          className="text-blue-700 hover:text-blue-900 flex items-center gap-1 bg-white px-2 py-1 rounded-md border border-slate-200 shadow-xs cursor-pointer"
                        >
                          <Edit2 className="w-3 h-3 text-blue-500" />
                          <span>ویرایش لینک</span>
                        </button>
                        <a
                          href={ord.publishedUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-emerald-700 hover:underline flex items-center gap-1"
                        >
                          <span>لینک انتشار</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Show rejection reason */}
                  {ord.status === "rejected" && (
                    <div className="bg-rose-50 text-rose-800 p-2.5 rounded-xl text-[10px] font-bold flex items-start gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <div>
                        <span>دلیل رد رپورتاژ: </span>
                        <span className="text-rose-700">{ord.rejectionReason}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Edit Website Price Modal */}
      {editingWebsite && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden text-right">
            <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <h4 className="font-extrabold text-slate-800 text-base">ویرایش تعرفه رسانه {editingWebsite.name}</h4>
              <button onClick={() => setEditingWebsite(null)} className="text-slate-400 hover:text-slate-600 font-bold">×</button>
            </div>
            <form onSubmit={handlePriceUpdateSubmit} className="p-5 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600">تعرفه انتشار رپورتاژ (به تومان):</label>
                <input
                  type="number"
                  required
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 text-slate-700"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600">قوانین و راهنمای ثبت محتوا در این رسانه:</label>
                <textarea
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  rows={4}
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 text-slate-700 resize-none"
                />
              </div>
              <div className="pt-3 flex gap-2 justify-end text-xs">
                <button
                  type="button"
                  onClick={() => setEditingWebsite(null)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl transition-colors font-bold"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-xl transition-colors font-bold shadow-md shadow-blue-600/10 cursor-pointer"
                >
                  ذخیره تغییرات
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Publish Live Link Modal */}
      {publishingOrder && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden text-right">
            <div className="p-5 border-b border-slate-200 bg-slate-50">
              <h4 className="font-extrabold text-slate-800 text-base">
                {publishingOrder.status === "published" ? "ویرایش لینک رپورتاژ منتشر شده" : "ثبت انتشار رپورتاژ"}
              </h4>
              <p className="text-[10px] text-slate-400 mt-0.5">لینک نهایی منتشر شده در سایت خود را وارد نمایید.</p>
            </div>
            <form onSubmit={handlePublishSubmit} className="p-5 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600">لینک نهایی (Published Link):</label>
                <input
                  type="url"
                  required
                  placeholder={`https://www.${publishingOrder.websiteDomain}/news/my-advertorial.html`}
                  value={finalPublishedUrl}
                  onChange={(e) => setFinalPublishedUrl(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 text-slate-700 text-left font-mono"
                  dir="ltr"
                />
              </div>
              <div className="pt-3 flex gap-2 justify-end text-xs">
                <button
                  type="button"
                  onClick={() => setPublishingOrder(null)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl transition-colors font-bold"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-xl transition-colors font-bold shadow-md shadow-emerald-600/10 cursor-pointer"
                >
                  {publishingOrder.status === "published" ? "ذخیره تغییرات لینک" : "تایید انتشار و تسویه"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Rejection Reason Modal */}
      {rejectingOrder && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden text-right">
            <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <h4 className="font-extrabold text-slate-800 text-base">رد سفارش رپورتاژ آگهی</h4>
              <button onClick={() => setRejectingOrder(null)} className="text-slate-400 hover:text-slate-600 font-bold">×</button>
            </div>
            <form onSubmit={handleRejectSubmit} className="p-5 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600">علت رد رپورتاژ (کارفرما این علت را مشاهده خواهد کرد):</label>
                <textarea
                  required
                  placeholder="علت رد سفارش مانند: عدم تطابق محتوای رپورتاژ با استانداردهای رسانه..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows={4}
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 text-slate-700 resize-none"
                />
              </div>
              <div className="pt-3 flex gap-2 justify-end text-xs">
                <button
                  type="button"
                  onClick={() => setRejectingOrder(null)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl transition-colors font-bold"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="bg-rose-600 hover:bg-rose-700 text-white px-5 py-2 rounded-xl transition-colors font-bold shadow-md shadow-rose-600/10 cursor-pointer"
                >
                  رد سفارش و عودت وجه
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Dedicated Separate Page Viewer for Advertorial (Full-screen view) */}
      {activeViewingOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-100 flex flex-col animate-fade-in text-slate-900" dir="rtl">
          {/* Top simulated browser / portal header bar */}
          <div className="sticky top-0 z-10 bg-white border-b border-slate-200 px-4 py-3 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setViewingOrderDetails(null)}
                className="p-1.5 hover:bg-slate-100 rounded-full text-slate-500 hover:text-slate-800 transition-colors cursor-pointer flex items-center gap-1 text-xs font-bold"
              >
                <ArrowRight className="w-4 h-4" />
                <span>بازگشت به پنل رسانه</span>
              </button>
              <div className="h-4 w-px bg-slate-200 hidden sm:block"></div>
              <div className="hidden sm:flex items-center gap-2">
                <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-bold">نمای پیش‌نویس پست رسانه</span>
                <span className="text-[10px] text-slate-400 font-mono" dir="ltr">{activeViewingOrder.websiteDomain}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-blue-50 text-blue-700 flex items-center justify-center font-black text-[10px]">
                {activeViewingOrder.websiteName[0]}
              </div>
              <span className="font-extrabold text-xs text-slate-700">{activeViewingOrder.websiteName}</span>
            </div>
          </div>

          {/* Main Content Layout */}
          <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-6 p-4 md:p-6 flex-1">
            
            {/* Left/Middle Column: Beautiful Simulated Post Body */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-6">
                
                {/* Meta details */}
                <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold text-slate-400">
                  <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">رپورتاژ آگهی</span>
                  <span>•</span>
                  <span>تاریخ ارسال: {activeViewingOrder.dateCreated}</span>
                  <span>•</span>
                  <span className={activeViewingOrder.scheduledDate ? "bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md border border-indigo-100 font-extrabold flex items-center gap-1" : "bg-amber-50 text-amber-700 px-2 py-0.5 rounded-md border border-amber-100 font-extrabold flex items-center gap-1"}>
                    <Clock className="w-3.5 h-3.5 shrink-0" />
                    <span>تاریخ مدنظر انتشار: {activeViewingOrder.scheduledDate ? activeViewingOrder.scheduledDate : "انتشار فوری"}</span>
                  </span>
                  <span>•</span>
                  <span>شناسه سفارش: <span className="font-mono text-slate-500">{activeViewingOrder.id}</span></span>
                </div>

                {/* Main Heading */}
                <h1 className="font-black text-slate-900 text-lg md:text-2xl leading-relaxed">
                  {activeViewingOrder.title}
                </h1>

                {/* Hero Featured Image */}
                <div className="relative group rounded-2xl overflow-hidden border border-slate-100 bg-slate-50 shadow-xs">
                  <img
                    src={getFeaturedImage(activeViewingOrder)}
                    alt={activeViewingOrder.title}
                    className="w-full aspect-video md:aspect-[21/10] object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent pointer-events-none" />
                  <span className="absolute bottom-3 right-3 text-[10px] bg-black/60 text-white font-bold px-2.5 py-1 rounded-md backdrop-blur-xs">
                    تصویر شاخص خبر
                  </span>
                </div>

                {/* Styled Rich HTML Article Body */}
                <div 
                  className="text-xs md:text-sm text-slate-700 leading-relaxed space-y-5 pt-4 border-t border-slate-100
                    [&>h1]:text-lg [&>h1]:md:text-xl [&>h1]:font-black [&>h1]:text-slate-900 [&>h1]:mt-6 [&>h1]:mb-3
                    [&>h2]:text-base [&>h2]:md:text-lg [&>h2]:font-extrabold [&>h2]:text-slate-800 [&>h2]:mt-5 [&>h2]:mb-2.5
                    [&>h3]:text-sm [&>h3]:md:text-base [&>h3]:font-bold [&>h3]:text-slate-800 [&>h3]:mt-4 [&>h3]:mb-2
                    [&>p]:text-xs [&>p]:md:text-sm [&>p]:text-slate-600 [&>p]:leading-relaxed [&>p]:mb-4
                    [&>ul]:list-disc [&>ul]:pr-5 [&>ul]:space-y-1.5 [&>ul]:mb-4 [&>ul]:text-xs [&>ul]:md:text-sm [&>ul]:text-slate-600
                    [&>ol]:list-decimal [&>ol]:pr-5 [&>ol]:space-y-1.5 [&>ol]:mb-4 [&>ol]:text-xs [&>ol]:md:text-sm [&>ol]:text-slate-600
                    [&_a]:text-blue-600 [&_a]:font-bold [&_a]:underline hover:[&_a]:text-blue-800"
                  dangerouslySetInnerHTML={{ __html: activeViewingOrder.body }}
                />

                {/* Footer anchor helper box */}
                <div className="bg-blue-50/60 border border-blue-100 p-4 rounded-2xl space-y-3 mt-8">
                  <div className="flex items-center gap-1.5">
                    <Link2 className="w-4 h-4 text-blue-600" />
                    <h6 className="font-extrabold text-xs text-blue-900">لیست کلمات کلیدی و لینک‌های هدف (بک‌لینک‌ها):</h6>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    توجه رسانه: حتما لینک‌های زیر را به صورت دقیق با همان انکرتکست (متن لینک شده) در بدنه مطلب درج کرده و به آدرس‌های مربوطه به صورت فالو لینک دهید:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {activeViewingOrder.keywords.map((kw, idx) => (
                      <a
                        key={idx}
                        href={kw.url}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-white border border-slate-200/80 hover:border-blue-400 p-2.5 rounded-xl text-[11px] text-blue-700 font-bold flex items-center justify-between transition-all"
                      >
                        <span className="truncate">متن: {kw.text}</span>
                        <span className="text-[9px] text-slate-400 font-mono truncate max-w-[120px]" dir="ltr">آدرس سایت هدف</span>
                      </a>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* Right Column: Sticky Sidebar with Details & Action Board */}
            <div className="lg:col-span-1 space-y-4 lg:sticky lg:top-20 h-fit">
              
              {/* Order Status & Income Panel */}
              <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-4">
                <span className="text-[10px] text-slate-400 font-black tracking-wider block">وضعیت فعلی این سفارش</span>
                
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="text-xs text-slate-500 font-bold">درآمد خالص شما:</span>
                  <span className="text-base font-black text-emerald-600">{formatPrice(activeViewingOrder.price)}</span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">آخرین وضعیت:</span>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black ${
                      activeViewingOrder.status === "published"
                        ? "bg-emerald-100 text-emerald-800"
                        : activeViewingOrder.status === "pending"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-rose-100 text-rose-800"
                    }`}>
                      {activeViewingOrder.status === "published" ? "انتشار موفق" : activeViewingOrder.status === "pending" ? "در انتظار بررسی و انتشار" : "رد شده"}
                    </span>
                  </div>
                  
                  {activeViewingOrder.status === "published" && activeViewingOrder.publishedUrl && (
                    <div className="bg-emerald-50 text-emerald-800 p-3 rounded-xl text-[10px] font-bold space-y-2">
                      <p>✓ با موفقیت منتشر شد و هزینه آن در کیف پول شارژ شده است.</p>
                      <div className="flex flex-col gap-2">
                        <a
                          href={activeViewingOrder.publishedUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="bg-emerald-600 text-white py-1.5 px-3 rounded-lg flex items-center justify-center gap-1 text-[10px] hover:bg-emerald-700 transition-colors w-full"
                        >
                          <span>مشاهده لینک منتشر شده</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                        <button
                          type="button"
                          onClick={() => {
                            setPublishingOrder(activeViewingOrder);
                            setFinalPublishedUrl(activeViewingOrder.publishedUrl || "");
                          }}
                          className="bg-white border border-slate-200 text-slate-700 py-1.5 px-3 rounded-lg flex items-center justify-center gap-1 text-[10px] hover:bg-slate-50 transition-colors w-full cursor-pointer"
                        >
                          <Edit2 className="w-3 h-3 text-slate-500" />
                          <span>ویرایش لینک منتشر شده</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {activeViewingOrder.status === "rejected" && (
                    <div className="bg-rose-50 text-rose-800 p-3 rounded-xl text-[10px] font-bold space-y-1">
                      <span className="block font-black">علت رد توسط شما:</span>
                      <p className="text-rose-700">{activeViewingOrder.rejectionReason}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Publisher Action panel for Pending orders */}
              {activeViewingOrder.status === "pending" && (
                <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-3">
                  <span className="text-[10px] text-slate-400 font-black block">عملیات بررسی محتوا</span>
                  <p className="text-[10px] text-slate-500 leading-relaxed">
                    پس از مطالعه و اطمینان از قرارگیری کلمات کلیدی، مطلب را در رسانه خود منتشر کرده و دکمه زیر را کلیک کنید:
                  </p>
                  
                  <button
                    onClick={() => setPublishingOrder(activeViewingOrder)}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black py-2.5 rounded-xl transition-all shadow-md shadow-emerald-600/10 cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>تایید انتشار و ثبت لینک (دریافت وجه)</span>
                  </button>

                  <button
                    onClick={() => setRejectingOrder(activeViewingOrder)}
                    className="w-full bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <X className="w-4 h-4" />
                    <span>رد کردن سفارش رپورتاژ</span>
                  </button>
                </div>
              )}

              {/* Article specifications info box */}
              <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-3.5 text-xs text-slate-600">
                <span className="text-[10px] text-slate-400 font-black block">اطلاعات فنی کمپین رپورتاژ</span>
                
                <div className="flex justify-between items-center py-1 border-b border-slate-100/60">
                  <span>رسانه انتشاردهنده:</span>
                  <span className="font-bold text-slate-800">{activeViewingOrder.websiteName}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-100/60">
                  <span>کمپین مربوطه:</span>
                  <span className="font-bold text-slate-800">{activeViewingOrder.campaignName || "سفارش مستقیم آزاد"}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-100/60">
                  <span>محدودیت زمانی تحویل:</span>
                  <span className="font-bold text-amber-600">{activeViewingOrder.deliveryTimeLimit}</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span>تعداد بک‌لینک‌ها:</span>
                  <span className="font-bold text-blue-600">{activeViewingOrder.keywords.length} عدد</span>
                </div>
              </div>

              {/* Support Support info block */}
              <div className="bg-linear-to-br from-slate-50 to-slate-100 rounded-3xl p-5 border border-slate-200/80 space-y-2 text-center">
                <span className="text-[10px] text-slate-500 font-black block">نیاز به پشتیبانی دارید؟</span>
                <p className="text-[9px] text-slate-400">در صورت وجود هرگونه مشکل در محتوا، می‌توانید از طریق تیکت با کارشناس رپورتا در ارتباط باشید.</p>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* Register New Website Modal */}
      {showAddMediaModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs text-right animate-fade-in" dir="rtl">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-slate-200">
            {/* Header */}
            <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-blue-50 text-blue-600 p-2 rounded-lg">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-800 text-sm">درخواست ثبت و اضافه کردن رسانه جدید</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">رسانه خود را برای تایید و نمایش در کاتالوگ عمومی ثبت نمایید.</p>
                </div>
              </div>
              <button 
                onClick={() => setShowAddMediaModal(false)} 
                className="text-slate-400 hover:text-slate-600 font-bold text-xl cursor-pointer"
              >
                ×
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleAddMediaSubmit} className="p-5 space-y-4 overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Website Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 block">نام رسانه (وب‌سایت) <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: زومجی، دیجیاتو"
                    value={mediaName}
                    onChange={(e) => setMediaName(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 text-slate-700"
                  />
                </div>

                {/* Website Domain */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 block">دامنه وب‌سایت <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: zoomit.ir"
                    value={mediaDomain}
                    onChange={(e) => setMediaDomain(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 text-slate-700 text-left font-mono"
                    dir="ltr"
                  />
                </div>

                {/* Category */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 block">دسته‌بندی موضوعی <span className="text-rose-500">*</span></label>
                  <select
                    value={mediaCategory}
                    onChange={(e) => setMediaCategory(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 text-slate-700"
                  >
                    <option value="technology">فناوری و تکنولوژی</option>
                    <option value="news">اخبار و خبرگزاری</option>
                    <option value="lifestyle">سبک زندگی و خانواده</option>
                    <option value="finance">اقتصاد و بازار مالی</option>
                    <option value="education">آموزشی و موفقیت</option>
                    <option value="sports">ورزش و سرگرمی</option>
                  </select>
                </div>

                {/* Price */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 block">تعرفه رپورتاژ (تومان) <span className="text-rose-500">*</span></label>
                  <div className="relative">
                    <input
                      type="number"
                      required
                      placeholder="مثال: ۱۲۰۰۰۰۰"
                      value={mediaPrice}
                      onChange={(e) => setMediaPrice(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 text-slate-700 pl-10"
                    />
                    <span className="absolute left-3 top-2 text-[10px] text-slate-400 font-bold pointer-events-none">تومان</span>
                  </div>
                </div>

                {/* Domain Authority (DA) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 block">شاخص اعتبار دامنه (DA) <span className="text-slate-400">(بین ۱ تا ۱۰۰)</span></label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={mediaDa}
                    onChange={(e) => setMediaDa(Number(e.target.value))}
                    className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 text-slate-700"
                  />
                </div>

                {/* Spam Score (SS) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 block">اسپم اسکور (Spam Score) <span className="text-slate-400">(درصد)</span></label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={mediaSs}
                    onChange={(e) => setMediaSs(Number(e.target.value))}
                    className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 text-slate-700"
                  />
                </div>

                {/* Alexa Rank */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 block">رتبه الکسا در ایران</label>
                  <input
                    type="number"
                    value={mediaAlexa}
                    onChange={(e) => setMediaAlexa(Number(e.target.value))}
                    className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 text-slate-700"
                  />
                </div>

                {/* Link Type */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 block">نوع پیوند (لینک)</label>
                  <select
                    value={mediaLinkType}
                    onChange={(e) => setMediaLinkType(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 text-slate-700"
                  >
                    <option value="follow">لینک فالو (Do-Follow)</option>
                    <option value="nofollow">لینک نوفالو (No-Follow)</option>
                    <option value="both">هر دو حالت</option>
                  </select>
                </div>

                {/* Delivery Time */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 block">حداکثر زمان تحویل و انتشار</label>
                  <input
                    type="text"
                    value={mediaDeliveryTime}
                    onChange={(e) => setMediaDeliveryTime(e.target.value)}
                    placeholder="مثال: ۲۴ ساعت"
                    className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 text-slate-700"
                  />
                </div>

                {/* Allowed Links */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 block">تعداد مجاز لینک در خبر</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={mediaAllowedLinks}
                    onChange={(e) => setMediaAllowedLinks(Number(e.target.value))}
                    className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 text-slate-700"
                  />
                </div>

              </div>

              {/* Description & Guideline */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 block">قوانین رسانه و راهنمای نگارش محتوا <span className="text-rose-500">*</span></label>
                <textarea
                  required
                  placeholder="مثال: حداکثر ۳ تصویر مجاز است. حوزه کاری باید مرتبط با توسعه کسب‌وکار، نوآوری یا مارکتینگ باشد و محتوای غیر اخلاقی منتشر نمی‌شود."
                  value={mediaDesc}
                  onChange={(e) => setMediaDesc(e.target.value)}
                  rows={4}
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 text-slate-700 resize-none leading-relaxed"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
                <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold">
                  <Info className="w-3.5 h-3.5" />
                  <span>تایید نهایی نیازمند تایید مدیر ارشد است.</span>
                </div>
                
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddMediaModal(false)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl transition-colors font-bold cursor-pointer"
                  >
                    انصراف
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl transition-colors font-bold shadow-md shadow-blue-600/10 cursor-pointer"
                  >
                    ثبت درخواست و ارسال به مدیریت
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
