import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Mail,
  Lock,
  LogIn,
  ShieldAlert,
  CheckCircle2,
  RefreshCw,
  User,
  UserPlus,
  Eye,
  EyeOff,
  Check,
  Info
} from "lucide-react";

interface LoginViewProps {
  onLogin: (role: "advertiser" | "publisher" | "admin", user: { name: string; email: string; avatarUrl?: string }) => void;
}

// Secure browser-native SHA-256 hash function
async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await window.crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  return hashHex;
}

interface UserRecord {
  name: string;
  email: string;
  passwordHash: string;
  role: "advertiser" | "publisher" | "admin";
}

export default function LoginView({ onLogin }: LoginViewProps) {
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [activeTab, setActiveTab] = useState<"advertiser" | "publisher" | "admin">("advertiser");
  const [registerRole, setRegisterRole] = useState<"advertiser" | "publisher">("advertiser");

  // Form Fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // UI States
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Seed default users in localStorage with hashed passwords if empty
  useEffect(() => {
    const initUsers = async () => {
      try {
        const stored = localStorage.getItem("secure_platform_users");
        if (!stored) {
          const defaultUsers: UserRecord[] = [
            {
              name: "احمد محمدی",
              email: "advertiser@tribune.ir",
              passwordHash: await sha256("123456"),
              role: "advertiser"
            },
            {
              name: "مدیر رسانه جی‌اس‌ام",
              email: "publisher@gsm.ir",
              passwordHash: await sha256("123456"),
              role: "publisher"
            },
            {
              name: "مدیر ارشد سیستم",
              email: "admin@tribune.ir",
              passwordHash: await sha256("admin123"),
              role: "admin"
            }
          ];
          localStorage.setItem("secure_platform_users", JSON.stringify(defaultUsers));
        }
      } catch (err) {
        console.error("Failed to seed secure users:", err);
      }
    };
    initUsers();
  }, []);

  const handleAutofill = (roleType: "advertiser" | "publisher" | "admin") => {
    setError("");
    setSuccess("");
    setAuthMode("login");
    setActiveTab(roleType);
    if (roleType === "advertiser") {
      setEmail("advertiser@tribune.ir");
      setPassword("123456");
    } else if (roleType === "publisher") {
      setEmail("publisher@gsm.ir");
      setPassword("123456");
    } else {
      setEmail("admin@tribune.ir");
      setPassword("admin123");
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword) {
      setError("لطفاً تمامی فیلدها را پر کنید.");
      return;
    }

    setLoading(true);

    try {
      // Calculate SHA-256 password hash
      const enteredHash = await sha256(cleanPassword);

      // Fetch users from localStorage
      const storedUsersRaw = localStorage.getItem("secure_platform_users");
      const users: UserRecord[] = storedUsersRaw ? JSON.parse(storedUsersRaw) : [];

      // Find user matching credentials and role
      const matchedUser = users.find(
        (u) => u.email.toLowerCase() === cleanEmail && u.passwordHash === enteredHash && u.role === activeTab
      );

      // Add brief delay for security simulation (prevents brute forcing feel)
      setTimeout(() => {
        setLoading(false);
        if (matchedUser) {
          onLogin(matchedUser.role, {
            name: matchedUser.name,
            email: matchedUser.email
          });
        } else {
          setError("ایمیل، رمز عبور یا نقش انتخاب شده نادرست است.");
        }
      }, 600);
    } catch (err) {
      setLoading(false);
      setError("خطایی در فرآیند احراز هویت رخ داد.");
      console.error(err);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const cleanName = fullName.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();
    const cleanConfirm = confirmPassword.trim();

    // Validations
    if (!cleanName || !cleanEmail || !cleanPassword || !cleanConfirm) {
      setError("لطفاً تمامی فیلدهای فرم ثبت‌نام را تکمیل کنید.");
      return;
    }

    if (cleanPassword.length < 6) {
      setError("رمز عبور باید حداقل ۶ کاراکتر باشد.");
      return;
    }

    if (cleanPassword !== cleanConfirm) {
      setError("رمز عبور و تایید آن با هم مطابقت ندارند.");
      return;
    }

    // Email regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      setError("لطفاً یک آدرس ایمیل معتبر وارد کنید.");
      return;
    }

    setLoading(true);

    try {
      // Fetch current users
      const storedUsersRaw = localStorage.getItem("secure_platform_users");
      const users: UserRecord[] = storedUsersRaw ? JSON.parse(storedUsersRaw) : [];

      // Check duplicate email
      const isDuplicate = users.some((u) => u.email.toLowerCase() === cleanEmail && u.role === registerRole);
      if (isDuplicate) {
        setLoading(false);
        setError("این ایمیل قبلاً برای نقش انتخاب شده ثبت‌نام کرده است.");
        return;
      }

      // Hash password
      const passwordHash = await sha256(cleanPassword);

      // Create new user record
      const newUser: UserRecord = {
        name: cleanName,
        email: cleanEmail,
        passwordHash,
        role: registerRole
      };

      // Append and save
      users.push(newUser);
      localStorage.setItem("secure_platform_users", JSON.stringify(users));

      setTimeout(() => {
        setLoading(false);
        setSuccess("ثبت‌نام شما با موفقیت انجام شد! در حال انتقال به پنل شما...");
        
        // Auto log-in after 1.2 seconds for best UX
        setTimeout(() => {
          onLogin(registerRole, { name: cleanName, email: cleanEmail });
        }, 1200);
      }, 800);
    } catch (err) {
      setLoading(false);
      setError("خطایی در ثبت‌نام پیش آمد.");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 relative overflow-hidden text-right font-sans" dir="rtl">
      {/* Decorative Grid Patterns */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,#3b82f6_1px,transparent_1px),linear-gradient(to_bottom,#3b82f6_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
      </div>
      <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none"></div>

      {/* Main Container Card */}
      <div className="w-full max-w-md bg-slate-950/85 backdrop-blur-xl rounded-3xl border border-slate-800 p-8 shadow-2xl relative z-10 transition-all duration-300">
        
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex bg-blue-600/10 border border-blue-500/20 text-blue-400 p-3 rounded-2xl shadow-lg mb-3">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <h2 className="text-lg font-black text-white">سامانه هوشمند رپورتا</h2>
          <p className="text-[10px] text-slate-400 font-bold mt-1 leading-relaxed">
            احراز هویت امن و بهینه‌سازی شده برای سئوکاران و ناشران رسانه
          </p>
        </div>

        {/* Toggle Mode: Login vs Register */}
        <div className="grid grid-cols-2 gap-1 bg-slate-900 p-1 rounded-2xl border border-slate-800 mb-6">
          <button
            type="button"
            onClick={() => {
              setAuthMode("login");
              setError("");
              setSuccess("");
            }}
            className={`py-2 rounded-xl text-[11px] font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              authMode === "login"
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/10"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>ورود به حساب کاربری</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMode("register");
              setError("");
              setSuccess("");
            }}
            className={`py-2 rounded-xl text-[11px] font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              authMode === "register"
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/10"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>عضویت و ثبت‌نام جدید</span>
          </button>
        </div>

        {/* Dynamic Forms */}
        {authMode === "login" ? (
          /* LOGIN FORM */
          <div className="space-y-4">
            {/* Login Tab Selector (Role) */}
            <div className="grid grid-cols-3 gap-1 bg-slate-900/60 p-1 rounded-xl border border-slate-800/60">
              <button
                type="button"
                onClick={() => {
                  setActiveTab("advertiser");
                  setError("");
                }}
                className={`py-1.5 rounded-lg text-[10px] font-black transition-all cursor-pointer ${
                  activeTab === "advertiser"
                    ? "bg-slate-800 text-white shadow-sm border border-slate-700/50"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                آگهی‌دهنده
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab("publisher");
                  setError("");
                }}
                className={`py-1.5 rounded-lg text-[10px] font-black transition-all cursor-pointer ${
                  activeTab === "publisher"
                    ? "bg-slate-800 text-white shadow-sm border border-slate-700/50"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                رسانه‌دار
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab("admin");
                  setError("");
                }}
                className={`py-1.5 rounded-lg text-[10px] font-black transition-all cursor-pointer ${
                  activeTab === "admin"
                    ? "bg-amber-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                مدیر کل
              </button>
            </div>

            {/* Test Credentials Autofill Box */}
            <div className="p-3 bg-slate-900/40 border border-slate-800/80 rounded-2xl flex flex-col justify-center items-center gap-1.5">
              <span className="text-[9px] font-bold text-slate-400">تست و ارزیابی سریع دمو:</span>
              <button
                type="button"
                onClick={() => handleAutofill(activeTab)}
                className={`text-[9px] font-black px-4 py-1 rounded-lg border transition-all cursor-pointer ${
                  activeTab === "admin"
                    ? "bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20"
                    : "bg-blue-500/10 border-blue-500/30 text-blue-400 hover:bg-blue-500/20"
                }`}
              >
                تکمیل خودکار اطلاعات {activeTab === "admin" ? "مدیر" : activeTab === "publisher" ? "رسانه" : "آگهی‌دهنده"} (با رمز عبور هش شده)
              </button>
            </div>

            {/* Notifications */}
            {error && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-[10px] font-black text-rose-400 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}
            {success && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-[10px] font-black text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{success}</span>
              </div>
            )}

            {/* Login Inputs */}
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-bold block">پست الکترونیکی (ایمیل):</label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="example@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-3 pr-10 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono text-left"
                    style={{ direction: "ltr" }}
                    disabled={loading}
                    required
                  />
                  <Mail className="w-4 h-4 text-slate-500 absolute top-3.5 right-3.5" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-bold block">رمز عبور ورود:</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono text-left"
                    style={{ direction: "ltr" }}
                    disabled={loading}
                    required
                  />
                  <Lock className="w-4 h-4 text-slate-500 absolute top-3.5 right-3.5" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute top-3 left-3 text-slate-500 hover:text-white cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-lg mt-6 ${
                  activeTab === "admin"
                    ? "bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/10"
                    : "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/10"
                }`}
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>در حال بررسی رمز عبور و ورود امن...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>ورود امن به پنل</span>
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          /* REGISTER FORM */
          <div className="space-y-4">
            {/* Select Role for Registration */}
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 font-bold block mb-1">عضویت با چه عنوانی؟</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRegisterRole("advertiser")}
                  className={`py-2 rounded-xl text-[10px] font-black border transition-all cursor-pointer flex flex-col items-center gap-1 ${
                    registerRole === "advertiser"
                      ? "bg-blue-600/10 border-blue-500 text-blue-400"
                      : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>آگهی‌دهنده (سفارش رپورتاژ)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRegisterRole("publisher")}
                  className={`py-2 rounded-xl text-[10px] font-black border transition-all cursor-pointer flex flex-col items-center gap-1 ${
                    registerRole === "publisher"
                      ? "bg-blue-600/10 border-blue-500 text-blue-400"
                      : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <UserPlus className="w-4 h-4" />
                  <span>رسانه‌دار (کسب درآمد از سایت)</span>
                </button>
              </div>
            </div>

            {/* Notifications */}
            {error && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-[10px] font-black text-rose-400 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}
            {success && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-[10px] font-black text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{success}</span>
              </div>
            )}

            {/* Registration Inputs */}
            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-bold block">نام و نام خانوادگی یا شرکت:</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="مثال: مریم محمدی"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-3 pr-10 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                    disabled={loading}
                    required
                  />
                  <User className="w-4 h-4 text-slate-500 absolute top-3.5 right-3.5" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-bold block">آدرس ایمیل:</label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="yourname@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-3 pr-10 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 font-mono text-left"
                    style={{ direction: "ltr" }}
                    disabled={loading}
                    required
                  />
                  <Mail className="w-4 h-4 text-slate-500 absolute top-3.5 right-3.5" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-bold block">رمز عبور امن (حداقل ۶ کاراکتر):</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 font-mono text-left"
                    style={{ direction: "ltr" }}
                    disabled={loading}
                    required
                  />
                  <Lock className="w-4 h-4 text-slate-500 absolute top-3.5 right-3.5" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute top-3 left-3 text-slate-500 hover:text-white cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-bold block">تکرار رمز عبور:</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 font-mono text-left"
                    style={{ direction: "ltr" }}
                    disabled={loading}
                    required
                  />
                  <Lock className="w-4 h-4 text-slate-500 absolute top-3.5 right-3.5" />
                </div>
              </div>

              <div className="pt-2">
                <p className="text-[9px] text-slate-500 leading-normal">
                  با عضویت در رپورتا، تمامی رمزهای عبور شما به صورت محلی و با الگوریتم رمزنگاری یک‌طرفه SHA-256 هش شده و پس از ثبت، مستقیماً وارد پنل کاربری خواهید شد.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-lg mt-4 shadow-blue-600/10"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>در حال رمزنگاری و ثبت‌نام امن...</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>ثبت‌نام امن و ورود به پنل</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Footer info */}
        <div className="mt-8 text-center text-[9px] text-slate-500 font-bold">
          © ۱۴۰۶ تمامی حقوق محفوظ و تحت پوشش سامانه امن رپورتا است.
        </div>
      </div>
    </div>
  );
}
