import React, { useState } from "react";
import { PublisherUser, MediaRegistrationRequest, MediaWebsite } from "../types";
import {
  Users,
  Globe,
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
  Award,
  DollarSign,
  AlertTriangle,
  Search,
  Filter,
  Check,
  X,
  FileText,
  ChevronDown,
  ExternalLink
} from "lucide-react";

interface AdminDashboardProps {
  publisherUsers: PublisherUser[];
  registrationRequests: MediaRegistrationRequest[];
  websites: MediaWebsite[];
  onApproveRequest: (reqId: string) => void;
  onRejectRequest: (reqId: string, reason: string) => void;
  onLogout: () => void;
}

export default function AdminDashboard({
  publisherUsers,
  registrationRequests,
  websites,
  onApproveRequest,
  onRejectRequest,
  onLogout
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<"requests" | "publishers">("requests");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  
  // Rejection Modal state
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [targetReqId, setTargetReqId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  // Stats calculations
  const totalPublishers = publisherUsers.length;
  const activeCatalogCount = websites.length;
  const pendingRequestsCount = registrationRequests.filter(r => r.status === "pending").length;
  const rejectedRequestsCount = registrationRequests.filter(r => r.status === "rejected").length;

  // Filtered requests
  const filteredRequests = registrationRequests.filter(req => {
    const matchesSearch =
      req.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.publisherName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === "all" || req.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  // Filtered publishers
  const filteredPublishers = publisherUsers.filter(pub => {
    return (
      pub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pub.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pub.phone.includes(searchQuery)
    );
  });

  const handleOpenRejectModal = (id: string) => {
    setTargetReqId(id);
    setRejectionReason("");
    setShowRejectModal(true);
  };

  const handleConfirmReject = () => {
    if (!rejectionReason.trim()) {
      alert("لطفاً دلیل رد درخواست رسانه را بنویسید.");
      return;
    }
    if (targetReqId) {
      onRejectRequest(targetReqId, rejectionReason.trim());
      setShowRejectModal(false);
      setTargetReqId(null);
    }
  };

  return (
    <div className="space-y-8 text-right" dir="rtl">
      
      {/* Header Block */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200">
        <div>
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <span className="w-2.5 h-5 bg-amber-500 rounded-sm"></span>
            پنل مدیریت ارشد رپورتا
          </h2>
          <p className="text-[10px] text-slate-500 font-bold mt-1">
            نظارت بر عضویت رسانه‌ها، مالکین سایت‌ها و تایید شاخص‌های سئو در پلتفرم
          </p>
        </div>
        <button
          onClick={onLogout}
          className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black rounded-xl transition-all cursor-pointer"
        >
          خروج از پنل مدیریت
        </button>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: Active Publishers */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 flex items-center justify-between shadow-xs">
          <div className="space-y-1.5">
            <span className="text-[10px] text-slate-400 font-bold block">تعداد صاحبان رسانه</span>
            <span className="text-xl font-black text-slate-900 font-mono">{totalPublishers} نفر</span>
            <span className="text-[9px] text-green-600 font-bold block">✓ همه در وضعیت فعال</span>
          </div>
          <div className="bg-blue-50 text-blue-600 p-3 rounded-xl">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* KPI 2: Active Media in Catalog */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 flex items-center justify-between shadow-xs">
          <div className="space-y-1.5">
            <span className="text-[10px] text-slate-400 font-bold block">رسانه‌های فعال کاتالوگ</span>
            <span className="text-xl font-black text-slate-900 font-mono">{activeCatalogCount} رسانه</span>
            <span className="text-[9px] text-slate-500 font-bold block">آماده پذیرش سفارش جدید</span>
          </div>
          <div className="bg-green-50 text-green-600 p-3 rounded-xl">
            <Globe className="w-5 h-5" />
          </div>
        </div>

        {/* KPI 3: Pending Approvals */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 flex items-center justify-between shadow-xs">
          <div className="space-y-1.5">
            <span className="text-[10px] text-slate-400 font-bold block">درخواست‌های معلق عضویت</span>
            <span className="text-xl font-black text-amber-600 font-mono">{pendingRequestsCount} درخواست</span>
            <span className="text-[9px] text-amber-500 font-bold block animate-pulse">● نیاز به بررسی شاخص سئو</span>
          </div>
          <div className="bg-amber-50 text-amber-600 p-3 rounded-xl">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        {/* KPI 4: Rejected Requests */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 flex items-center justify-between shadow-xs">
          <div className="space-y-1.5">
            <span className="text-[10px] text-slate-400 font-bold block">درخواست‌های رد شده</span>
            <span className="text-xl font-black text-slate-700 font-mono">{rejectedRequestsCount} سایت</span>
            <span className="text-[9px] text-slate-400 font-bold block">عدم تطابق با معیارهای پذیرش</span>
          </div>
          <div className="bg-slate-50 text-slate-600 p-3 rounded-xl">
            <XCircle className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* Main Container - Filter and Table/Cards Section */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50/50">
          <button
            onClick={() => { setActiveTab("requests"); setSearchQuery(""); }}
            className={`px-6 py-4 text-xs font-black transition-all flex items-center gap-2 relative cursor-pointer ${
              activeTab === "requests"
                ? "text-blue-600 bg-white border-b-2 border-blue-600"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Clock className="w-4 h-4 text-amber-500" />
            <span>بررسی درخواست‌های عضویت رسانه‌ها</span>
            {pendingRequestsCount > 0 && (
              <span className="bg-amber-500 text-white text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center">
                {pendingRequestsCount}
              </span>
            )}
          </button>
          
          <button
            onClick={() => { setActiveTab("publishers"); setSearchQuery(""); }}
            className={`px-6 py-4 text-xs font-black transition-all flex items-center gap-2 relative cursor-pointer ${
              activeTab === "publishers"
                ? "text-blue-600 bg-white border-b-2 border-blue-600"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Users className="w-4 h-4 text-slate-500" />
            <span>لیست صاحبان رسانه ثبت‌نام شده</span>
            <span className="bg-slate-200 text-slate-600 text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center">
              {totalPublishers}
            </span>
          </button>
        </div>

        {/* Filters bar */}
        <div className="p-5 border-b border-slate-200 bg-slate-50/20 flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder={activeTab === "requests" ? "جستجو در نام رسانه، دامنه یا نام ثبت‌کننده..." : "جستجو در نام مالک، ایمیل یا تلفن..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-3 pr-9 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 text-slate-700 font-semibold"
            />
            <Search className="w-4 h-4 text-slate-400 absolute top-2.5 right-3" />
          </div>

          {/* Category Filter (only for requests) */}
          {activeTab === "requests" && (
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-500 font-bold whitespace-nowrap">دسته‌بندی رسانه:</span>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-[11px] font-bold text-slate-600 outline-none cursor-pointer"
              >
                <option value="all">همه حوزه‌ها</option>
                <option value="technology">فناوری و تکنولوژی</option>
                <option value="news">اخبار و خبرگزاری</option>
                <option value="lifestyle">سبک زندگی و خانواده</option>
                <option value="finance">اقتصاد و بازار مالی</option>
                <option value="education">آموزش و پژوهش</option>
                <option value="sports">ورزش و سرگرمی</option>
              </select>
            </div>
          )}

        </div>

        {/* Requests List Tab */}
        {activeTab === "requests" && (
          <div className="p-6">
            {filteredRequests.length === 0 ? (
              <div className="text-center py-12 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                <Globe className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-500">هیچ درخواست عضویتی یافت نشد.</p>
                <p className="text-[10px] text-slate-400 mt-1">با تغییر عبارات جستجو یا فیلتر مجدد امتحان کنید.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredRequests.map((req) => (
                  <div
                    key={req.id}
                    className="border border-slate-200 hover:border-blue-300 rounded-2xl p-5 hover:bg-slate-50/20 transition-all space-y-4 relative"
                  >
                    
                    {/* Top Row: Name, Domain, Status Tag */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-black text-slate-600 text-sm border border-slate-200">
                          {req.logo}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-xs font-black text-slate-900">{req.name}</h3>
                            <span className="text-[9px] text-slate-400 font-mono">({req.domain})</span>
                          </div>
                          <span className="text-[9px] bg-slate-100 text-slate-500 font-bold px-2 py-0.5 rounded mt-1 inline-block">
                            {req.categoryLabel}
                          </span>
                        </div>
                      </div>

                      {/* Status label */}
                      <div>
                        {req.status === "pending" && (
                          <span className="bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-black px-2.5 py-1 rounded-lg">
                            در انتظار تایید مدارک و شاخص
                          </span>
                        )}
                        {req.status === "approved" && (
                          <span className="bg-green-50 text-green-700 border border-green-200 text-[10px] font-black px-2.5 py-1 rounded-lg">
                            تایید شده و فعال در کاتالوگ
                          </span>
                        )}
                        {req.status === "rejected" && (
                          <span className="bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-black px-2.5 py-1 rounded-lg">
                            رد صلاحیت شده
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Owner Information info card */}
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-[10px] text-slate-600 flex flex-wrap gap-x-6 gap-y-1 font-semibold">
                      <span>ثبت‌کننده: <strong className="text-slate-800">{req.publisherName}</strong></span>
                      <span>ایمیل مالک: <strong className="text-slate-800 font-mono">{req.publisherEmail}</strong></span>
                    </div>

                    {/* Criteria and Metrics Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                      
                      {/* Metric 1 */}
                      <div className="bg-white p-2.5 border border-slate-100 rounded-xl text-center">
                        <span className="text-[9px] text-slate-400 block font-bold mb-1">اتوریتی دامنه (DA)</span>
                        <span className="text-xs font-mono font-extrabold text-blue-600">{req.domainAuthority}</span>
                      </div>

                      {/* Metric 2 */}
                      <div className="bg-white p-2.5 border border-slate-100 rounded-xl text-center">
                        <span className="text-[9px] text-slate-400 block font-bold mb-1">نمره اسپم (SS)</span>
                        <span className={`text-xs font-mono font-extrabold ${req.spamScore > 2 ? 'text-rose-500' : 'text-slate-700'}`}>
                          {req.spamScore}%
                        </span>
                      </div>

                      {/* Metric 3 */}
                      <div className="bg-white p-2.5 border border-slate-100 rounded-xl text-center">
                        <span className="text-[9px] text-slate-400 block font-bold mb-1">رتبه الکسا ایران</span>
                        <span className="text-xs font-mono font-extrabold text-slate-700">{req.alexaRank}</span>
                      </div>

                      {/* Metric 4 */}
                      <div className="bg-white p-2.5 border border-slate-100 rounded-xl text-center">
                        <span className="text-[9px] text-slate-400 block font-bold mb-1">نوع لینک مجاز</span>
                        <span className="text-[10px] font-black text-slate-700">{req.linkType === "follow" ? "فالو (Follow)" : "نوفالو (NoFollow)"}</span>
                      </div>

                      {/* Metric 5 */}
                      <div className="bg-white p-2.5 border border-slate-100 rounded-xl text-center">
                        <span className="text-[9px] text-slate-400 block font-bold mb-1">زمان تحویل رپورتاژ</span>
                        <span className="text-[10px] font-black text-slate-700">{req.deliveryTime}</span>
                      </div>

                      {/* Metric 6 */}
                      <div className="bg-white p-2.5 border border-slate-100 rounded-xl text-center">
                        <span className="text-[9px] text-slate-400 block font-bold mb-1">تعرفه پیشنهادی</span>
                        <span className="text-xs font-mono font-black text-green-600">{req.price.toLocaleString()} تومان</span>
                      </div>

                    </div>

                    {/* Media Bio description */}
                    <div className="text-[11px] text-slate-600 leading-relaxed font-medium bg-blue-50/10 p-3 rounded-xl border border-blue-50">
                      <strong className="text-slate-700 block text-[10px] mb-1">توضیحات و قوانین رسانه:</strong>
                      {req.description}
                    </div>

                    {/* Rejection reason box if rejected */}
                    {req.status === "rejected" && req.rejectionReason && (
                      <div className="p-3 bg-rose-50 rounded-xl border border-rose-100 text-[10px] text-rose-700 font-bold leading-relaxed">
                        ⚠️ علت رد صلاحیت توسط مدیر سیستم: {req.rejectionReason}
                      </div>
                    )}

                    {/* Action buttons (only if pending) */}
                    {req.status === "pending" && (
                      <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => handleOpenRejectModal(req.id)}
                          className="px-4 py-1.5 border border-rose-200 hover:bg-rose-50 text-rose-600 rounded-xl text-[10px] font-black transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>رد و عدم پذیرش رسانه</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => onApproveRequest(req.id)}
                          className="px-5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-[10px] font-black transition-all flex items-center gap-1 cursor-pointer shadow-md shadow-blue-600/10"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>تایید و فعالسازی در کاتالوگ پلتفرم</span>
                        </button>
                      </div>
                    )}

                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Registered Publishers Tab */}
        {activeTab === "publishers" && (
          <div className="p-6">
            {filteredPublishers.length === 0 ? (
              <div className="text-center py-12 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-500">هیچ صاحب رسانه‌ای یافت نشد.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-right border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[10px] font-black">
                      <th className="p-4 rounded-r-xl">نام و نام خانوادگی</th>
                      <th className="p-4">آدرس پست الکترونیکی</th>
                      <th className="p-4">شماره همراه تماس</th>
                      <th className="p-4 text-center">تعداد رسانه‌ها در سیستم</th>
                      <th className="p-4">تاریخ پیوستن</th>
                      <th className="p-4 text-center rounded-l-xl">وضعیت اکانت</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                    {filteredPublishers.map((pub) => (
                      <tr key={pub.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-black text-xs border border-blue-100">
                              {pub.name.charAt(0)}
                            </div>
                            <span className="font-black text-slate-900">{pub.name}</span>
                          </div>
                        </td>
                        <td className="p-4 font-mono text-slate-600">{pub.email}</td>
                        <td className="p-4 font-mono text-slate-600">{pub.phone}</td>
                        <td className="p-4 text-center font-mono font-black text-slate-800">
                          {pub.websitesCount} رسانه
                        </td>
                        <td className="p-4 text-slate-500 font-mono">{pub.dateJoined}</td>
                        <td className="p-4 text-center">
                          <span className="bg-green-50 text-green-700 border border-green-200 text-[9px] font-black px-2 py-0.5 rounded-md">
                            فعال و احرازشده
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

      </div>

      {/* Rejection Modal Box */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs text-right" dir="rtl">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xl max-w-md w-full space-y-4 animate-scale-up">
            
            <h3 className="text-sm font-black text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-1.5">
              <span className="w-1.5 h-4 bg-rose-500 rounded-full"></span>
              رد درخواست عضویت رسانه
            </h3>

            <p className="text-xs text-slate-500 leading-relaxed font-semibold">
              لطفاً علت دقیق عدم تایید و رد صلاحیت این رسانه را مشخص کنید. این علت برای صاحب رسانه ارسال و در پنل وی نمایش داده خواهد شد.
            </p>

            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 font-bold block">دلیل رد درخواست:</label>
              <textarea
                rows={4}
                placeholder="مثلاً: شاخص اتوریتی دامنه شما کمتر از حد مجاز پلتفرم است یا تعرفه پیشنهادی بالا است..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full p-3 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-blue-500 leading-relaxed font-semibold"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowRejectModal(false)}
                className="flex-1 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                انصراف
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                className="flex-1 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-black transition-all cursor-pointer"
              >
                تایید رد درخواست
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
