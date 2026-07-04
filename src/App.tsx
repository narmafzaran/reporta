import React, { useState, useEffect } from "react";
import { MediaWebsite, AdvertorialOrder, Campaign, WalletTransaction, UserNotification, PublisherUser, MediaRegistrationRequest } from "./types";
import { MOCK_WEBSITES, MOCK_CAMPAIGNS, MOCK_ORDERS, MOCK_TRANSACTIONS, MOCK_PUBLISHER_USERS, MOCK_MEDIA_REGISTRATION_REQUESTS } from "./data";

// Components
import LandingPageView from "./components/LandingPageView";
import CatalogView from "./components/CatalogView";
import ContentWritingView from "./components/ContentWritingView";
import AdvertiserDashboard from "./components/AdvertiserDashboard";
import PublisherDashboard from "./components/PublisherDashboard";
import WalletView from "./components/WalletView";
import AIAnalyzerModal from "./components/AIAnalyzerModal";
import LoginView from "./components/LoginView";
import AdminDashboard from "./components/AdminDashboard";

// Icons
import {
  Sparkles,
  LayoutDashboard,
  Search,
  PenTool,
  Wallet,
  Globe,
  PlusCircle,
  Bell,
  RefreshCw,
  X,
  CreditCard,
  ShoppingBag,
  ArrowRight,
  UserCheck,
  CheckCircle2,
  ChevronRight,
  AlertCircle
} from "lucide-react";

export default function App() {
  // Global State
  const [websites, setWebsites] = useState<MediaWebsite[]>(MOCK_WEBSITES);
  const [orders, setOrders] = useState<AdvertorialOrder[]>(MOCK_ORDERS);
  const [campaigns, setCampaigns] = useState<Campaign[]>(MOCK_CAMPAIGNS);
  const [transactions, setTransactions] = useState<WalletTransaction[]>(MOCK_TRANSACTIONS);
  
  // Wallets
  const [advertiserBalance, setAdvertiserBalance] = useState<number>(3180000);
  const [publisherBalance, setPublisherBalance] = useState<number>(850000);

  // Notifications
  const [notifications, setNotifications] = useState<UserNotification[]>([
    {
      id: "not_1",
      title: "سفارش منتشر شد",
      message: "رپورتاژ شما در سایت زومیت با موفقیت تایید و منتشر شد.",
      date: "۱۴۰۶/۰۳/۱۷",
      read: false,
      type: "success"
    },
    {
      id: "not_2",
      title: "سفارش معلق جدید",
      message: "یک سفارش جدید برای وبسایت جی‌اس‌ام ارسال شده و در انتظار تایید شماست.",
      date: "۱۴۰۶/۰۳/۲۴",
      read: false,
      type: "warning"
    }
  ]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Navigation State & Authentication
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isViewingLogin, setIsViewingLogin] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string; avatarUrl?: string } | null>(null);
  const [userRole, setUserRole] = useState<"advertiser" | "publisher" | "admin">("advertiser");
  const [currentTab, setCurrentTab] = useState<string>("dashboard");

  // Administrator Lists
  const [publisherUsers, setPublisherUsers] = useState<PublisherUser[]>(MOCK_PUBLISHER_USERS);
  const [registrationRequests, setRegistrationRequests] = useState<MediaRegistrationRequest[]>(MOCK_MEDIA_REGISTRATION_REQUESTS);

  // Selection states for Modals / Wizard
  const [selectedWebsiteToBuy, setSelectedWebsiteToBuy] = useState<MediaWebsite | null>(null);
  const [showCheckoutWizard, setShowCheckoutWizard] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);

  // Wizard Form Fields
  const [wizardCampaignId, setWizardCampaignId] = useState<string>("");
  const [wizardTitle, setWizardTitle] = useState("");
  const [wizardBody, setWizardBody] = useState("");
  const [wizardKeywordInput, setWizardKeywordInput] = useState("");
  const [wizardKeywords, setWizardKeywords] = useState<{ text: string; url: string }[]>([]);

  // SEO Analyzer Modal
  const [seoAnalyzerTargetOrder, setSeoAnalyzerTargetOrder] = useState<AdvertorialOrder | null>(null);

  // Cart State
  const [cart, setCart] = useState<MediaWebsite[]>([]);

  // State loading flag
  const [isLoaded, setIsLoaded] = useState(false);

  // Sync state with localStorage if desired
  useEffect(() => {
    const localWebsites = localStorage.getItem("platform_websites");
    const localOrders = localStorage.getItem("platform_orders");
    const localCampaigns = localStorage.getItem("platform_campaigns");
    const localTransactions = localStorage.getItem("platform_transactions");
    const localAdvBalance = localStorage.getItem("platform_adv_balance");
    const localPubBalance = localStorage.getItem("platform_pub_balance");
    const localCart = localStorage.getItem("platform_cart");

    const localLoggedIn = localStorage.getItem("platform_logged_in");
    const localCurrentUser = localStorage.getItem("platform_current_user");
    const localUserRole = localStorage.getItem("platform_user_role");
    
    const localPubUsers = localStorage.getItem("platform_publisher_users");
    const localRequests = localStorage.getItem("platform_registration_requests");

    if (localWebsites) setWebsites(JSON.parse(localWebsites));
    if (localOrders) setOrders(JSON.parse(localOrders));
    if (localCampaigns) setCampaigns(JSON.parse(localCampaigns));
    if (localTransactions) setTransactions(JSON.parse(localTransactions));
    if (localAdvBalance) setAdvertiserBalance(parseFloat(localAdvBalance));
    if (localPubBalance) setPublisherBalance(parseFloat(localPubBalance));
    if (localCart) setCart(JSON.parse(localCart));

    if (localLoggedIn) setIsLoggedIn(JSON.parse(localLoggedIn));
    if (localCurrentUser) setCurrentUser(JSON.parse(localCurrentUser));
    if (localUserRole) setUserRole(JSON.parse(localUserRole) as "advertiser" | "publisher" | "admin");

    if (localPubUsers) setPublisherUsers(JSON.parse(localPubUsers));
    if (localRequests) setRegistrationRequests(JSON.parse(localRequests));

    setIsLoaded(true);
  }, []);

  // Reactive state persistence to localStorage
  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem("platform_websites", JSON.stringify(websites));
    localStorage.setItem("platform_orders", JSON.stringify(orders));
    localStorage.setItem("platform_campaigns", JSON.stringify(campaigns));
    localStorage.setItem("platform_transactions", JSON.stringify(transactions));
    localStorage.setItem("platform_adv_balance", advertiserBalance.toString());
    localStorage.setItem("platform_pub_balance", publisherBalance.toString());
    localStorage.setItem("platform_cart", JSON.stringify(cart));
    localStorage.setItem("platform_publisher_users", JSON.stringify(publisherUsers));
    localStorage.setItem("platform_registration_requests", JSON.stringify(registrationRequests));
  }, [
    isLoaded,
    websites,
    orders,
    campaigns,
    transactions,
    advertiserBalance,
    publisherBalance,
    cart,
    publisherUsers,
    registrationRequests,
  ]);

  // State update helpers
  const updateWebsitesState = (newWebs: MediaWebsite[]) => {
    setWebsites(newWebs);
  };

  const updateOrdersState = (newOrds: AdvertorialOrder[]) => {
    setOrders(newOrds);
  };

  const updateCampaignsState = (newCamps: Campaign[]) => {
    setCampaigns(newCamps);
  };

  const updateTransactionsState = (newTrxs: WalletTransaction[]) => {
    setTransactions(newTrxs);
  };

  const updateAdvertiserBalanceState = (newBal: number) => {
    setAdvertiserBalance(newBal);
  };

  const updatePublisherBalanceState = (newBal: number) => {
    setPublisherBalance(newBal);
  };

  // --- SHOPPING CART WORKFLOWS ---
  const updateCartState = (newCart: MediaWebsite[]) => {
    setCart(newCart);
  };

  const handleAddToCart = (website: MediaWebsite) => {
    if (cart.some((item) => item.id === website.id)) {
      alert("این رسانه در حال حاضر در سبد خرید شما وجود دارد.");
      return;
    }
    const newCart = [...cart, website];
    updateCartState(newCart);
    
    // Auto add a notification
    const newNotif: UserNotification = {
      id: "not_" + Date.now(),
      title: "افزودن به سبد خرید",
      message: `رسانه "${website.name}" با موفقیت به سبد خرید شما اضافه شد.`,
      date: new Date().toLocaleDateString("fa-IR"),
      read: false,
      type: "info"
    };
    setNotifications([newNotif, ...notifications]);
  };

  const handleRemoveFromCart = (websiteId: string) => {
    const newCart = cart.filter((item) => item.id !== websiteId);
    updateCartState(newCart);
  };

  const handleCheckoutCart = (
    campaignId: string,
    customTitles: Record<string, string>,
    customBodies: Record<string, string>,
    customKeywords: Record<string, { text: string; url: string }[]>
  ) => {
    if (cart.length === 0) return;
    const totalCost = cart.reduce((sum, item) => sum + item.price, 0);
    
    if (advertiserBalance < totalCost) {
      alert("اعتبار کیف پول شما برای پرداخت این سبد خرید کافی نیست.");
      return;
    }

    // Deduct balance and create transaction
    const success = handleDeductAdvertiserBalance(
      totalCost,
      `خرید دسته‌جمعی ${cart.length} رپورتاژ آگهی از سبد خرید`
    );

    if (success) {
      const selectedCamp = campaigns.find((c) => c.id === campaignId);
      
      const newOrders: AdvertorialOrder[] = cart.map((site) => {
        return {
          id: "ord_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
          websiteId: site.id,
          websiteName: site.name,
          websiteDomain: site.domain,
          campaignId: campaignId || null,
          campaignName: selectedCamp ? selectedCamp.name : null,
          title: `رپورتاژ جدید در ${site.name} (در انتظار نگارش محتوا)`,
          body: "",
          keywords: [],
          status: "draft",
          price: site.price,
          dateCreated: new Date().toLocaleDateString("fa-IR"),
          deliveryTimeLimit: site.deliveryTime,
        };
      });

      // Update campaigns order count
      if (campaignId) {
        updateCampaignsState(
          campaigns.map((c) =>
            c.id === campaignId ? { ...c, ordersCount: c.ordersCount + cart.length } : c
          )
        );
      }

      updateOrdersState([...newOrders, ...orders]);

      // Clear cart
      updateCartState([]);

      // Create a nice notification
      const newNotif: UserNotification = {
        id: "not_" + Date.now(),
        title: "پرداخت موفق و ثبت رپورتاژها",
        message: `سفارش‌های سبد خرید به ارزش مجموع ${totalCost.toLocaleString("fa-IR")} تومان با موفقیت پرداخت شد. اکنون محتوای آن‌ها را بنویسید!`,
        date: new Date().toLocaleDateString("fa-IR"),
        read: false,
        type: "success"
      };
      setNotifications([newNotif, ...notifications]);

      alert(`سفارش‌های شما با موفقیت پرداخت شد! هم‌اکنون می‌توانید از پنل «رپورتاژهای من» محتوای خود را به صورت حرفه‌ای نگارش و به ناشر ارسال کنید.`);
      setCurrentTab("dashboard");
    }
  };

  // Role switching
  const handleRoleSwitch = (role: "advertiser" | "publisher" | "admin") => {
    setUserRole(role);
    setCurrentTab("dashboard");
    localStorage.setItem("platform_user_role", JSON.stringify(role));
  };

  // Auth Handlers
  const handleLogin = (role: "advertiser" | "publisher" | "admin", user: { name: string; email: string; avatarUrl?: string }) => {
    setIsLoggedIn(true);
    setCurrentUser(user);
    setUserRole(role);
    setCurrentTab("dashboard");

    localStorage.setItem("platform_logged_in", "true");
    localStorage.setItem("platform_current_user", JSON.stringify(user));
    localStorage.setItem("platform_user_role", JSON.stringify(role));

    // Also notify
    const newNotif: UserNotification = {
      id: "not_login_" + Date.now(),
      title: "ورود موفقیت‌آمیز",
      message: `خوش آمدید ${user.name}! با موفقیت به پنل مدیریت ${role === "admin" ? "مدیر کل" : role === "publisher" ? "رسانه‌دار" : "آگهی‌دهنده"} وارد شدید.`,
      date: new Date().toLocaleDateString("fa-IR"),
      read: false,
      type: "success"
    };
    setNotifications([newNotif, ...notifications]);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsViewingLogin(false);
    setCurrentUser(null);
    setUserRole("advertiser");
    setCurrentTab("dashboard");

    localStorage.removeItem("platform_logged_in");
    localStorage.removeItem("platform_current_user");
    localStorage.removeItem("platform_user_role");
  };

  // Admin Approval/Rejection Core Logic
  const handleApproveRequest = (reqId: string) => {
    const request = registrationRequests.find(r => r.id === reqId);
    if (!request) return;

    // Update registration request status
    const updatedRequests = registrationRequests.map(r => 
      r.id === reqId ? { ...r, status: "approved" as const } : r
    );
    setRegistrationRequests(updatedRequests);
    localStorage.setItem("platform_registration_requests", JSON.stringify(updatedRequests));

    // Create a new MediaWebsite
    const newWebsite: MediaWebsite = {
      id: "site_" + Date.now() + "_" + Math.floor(Math.random() * 100),
      name: request.name,
      domain: request.domain,
      logo: request.logo,
      category: request.category,
      categoryLabel: request.categoryLabel,
      domainAuthority: request.domainAuthority,
      spamScore: request.spamScore,
      alexaRank: request.alexaRank,
      price: request.price,
      linkType: request.linkType,
      deliveryTime: request.deliveryTime,
      allowedLinksCount: request.allowedLinksCount,
      description: request.description,
      isMine: true // Owner can see in publisher dashboard
    };

    const newWebsitesList = [newWebsite, ...websites];
    updateWebsitesState(newWebsitesList);

    // Update websites count for this publisher user if found
    const updatedPubUsers = publisherUsers.map(pub => {
      if (pub.email.trim().toLowerCase() === request.publisherEmail.trim().toLowerCase()) {
        return { ...pub, websitesCount: pub.websitesCount + 1 };
      }
      return pub;
    });
    setPublisherUsers(updatedPubUsers);
    localStorage.setItem("platform_publisher_users", JSON.stringify(updatedPubUsers));

    // Auto add a notification
    const newNotif: UserNotification = {
      id: "not_admin_approve_" + Date.now(),
      title: "تایید رسانه جدید",
      message: `رسانه جدید "${request.name}" با موفقیت تایید و به کاتالوگ عمومی پلتفرم افزوده شد.`,
      date: new Date().toLocaleDateString("fa-IR"),
      read: false,
      type: "success"
    };
    setNotifications([newNotif, ...notifications]);

    alert(`رسانه "${request.name}" با موفقیت تایید و به لیست وب‌سایت‌های فعال کاتالوگ فروش رپورتاژ افزوده شد!`);
  };

  const handleRejectRequest = (reqId: string, reason: string) => {
    // Update registration request status and add rejectionReason
    const updatedRequests = registrationRequests.map(r => 
      r.id === reqId ? { ...r, status: "rejected" as const, rejectionReason: reason } : r
    );
    setRegistrationRequests(updatedRequests);
    localStorage.setItem("platform_registration_requests", JSON.stringify(updatedRequests));

    // Auto add a notification
    const newNotif: UserNotification = {
      id: "not_admin_reject_" + Date.now(),
      title: "رد درخواست عضویت رسانه",
      message: `درخواست عضویت رسانه با دلیل "${reason}" رد صلاحیت گردید.`,
      date: new Date().toLocaleDateString("fa-IR"),
      read: false,
      type: "warning"
    };
    setNotifications([newNotif, ...notifications]);

    alert("درخواست رسانه با موفقیت رد شد و علت رد صلاحیت ثبت گردید.");
  };

  const handleAddMediaRequest = (newRequest: Omit<MediaRegistrationRequest, "id" | "status" | "publisherName" | "publisherEmail">) => {
    const fullRequest: MediaRegistrationRequest = {
      ...newRequest,
      id: "req_" + Date.now() + "_" + Math.floor(Math.random() * 100),
      status: "pending" as const,
      publisherName: currentUser?.name || "صاحب رسانه ناشناس",
      publisherEmail: currentUser?.email || "publisher@example.com"
    };

    const updatedRequests = [fullRequest, ...registrationRequests];
    setRegistrationRequests(updatedRequests);
    localStorage.setItem("platform_registration_requests", JSON.stringify(updatedRequests));

    // Auto add a notification
    const newNotif: UserNotification = {
      id: "not_media_req_" + Date.now(),
      title: "ثبت درخواست رسانه جدید",
      message: `درخواست ثبت رسانه "${newRequest.name}" ارسال شد و در صف بررسی مدیر ارشد قرار گرفت.`,
      date: new Date().toLocaleDateString("fa-IR"),
      read: false,
      type: "info"
    };
    setNotifications([newNotif, ...notifications]);

    alert(`درخواست ثبت رسانه "${newRequest.name}" با موفقیت ارسال شد و پس از بررسی و تایید مدیر ارشد پلتفرم فعال خواهد شد.`);
  };

  // --- WALLET MUTATIONS ---
  const handleAdvertiserDeposit = (amount: number) => {
    const newBal = advertiserBalance + amount;
    updateAdvertiserBalanceState(newBal);

    const newTrx: WalletTransaction = {
      id: "trx_" + Date.now(),
      type: "deposit",
      amount,
      description: "افزایش آنلاین اعتبار کیف پول",
      date: new Date().toLocaleDateString("fa-IR"),
      status: "success",
    };
    updateTransactionsState([newTrx, ...transactions]);
  };

  const handleDeductAdvertiserBalance = (amount: number, description: string): boolean => {
    if (advertiserBalance >= amount) {
      const newBal = advertiserBalance - amount;
      updateAdvertiserBalanceState(newBal);

      const newTrx: WalletTransaction = {
        id: "trx_" + Date.now(),
        type: "purchase",
        amount,
        description,
        date: new Date().toLocaleDateString("fa-IR"),
        status: "success",
      };
      updateTransactionsState([newTrx, ...transactions]);
      return true;
    }
    return false;
  };

  // --- CAMPAIGN CREATION ---
  const handleCreateCampaign = (name: string, budget: number) => {
    const newCamp: Campaign = {
      id: "camp_" + Date.now(),
      name,
      budget,
      dateCreated: new Date().toLocaleDateString("fa-IR"),
      ordersCount: 0,
    };
    updateCampaignsState([newCamp, ...campaigns]);
  };

  // --- ORDER PLACEMENT FLOW ---
  const handleSelectWebsiteToBuy = (website: MediaWebsite) => {
    setSelectedWebsiteToBuy(website);
    setWizardTitle("");
    setWizardBody("");
    setWizardKeywords([]);
    setWizardStep(1);
    setShowCheckoutWizard(true);
  };

  const handleAddKeywordToWizard = () => {
    if (selectedWebsiteToBuy && wizardKeywords.length >= selectedWebsiteToBuy.allowedLinksCount) {
      alert(`رسانه ${selectedWebsiteToBuy.name} حداکثر ${selectedWebsiteToBuy.allowedLinksCount} لینک را مجاز کرده است.`);
      return;
    }

    const keywordParts = wizardKeywordInput.split(" - ");
    const text = keywordParts[0]?.trim();
    const url = keywordParts[1]?.trim() || "https://";

    if (text) {
      setWizardKeywords([...wizardKeywords, { text, url }]);
      setWizardKeywordInput("");
    }
  };

  const handleRemoveKeywordFromWizard = (idx: number) => {
    setWizardKeywords(wizardKeywords.filter((_, i) => i !== idx));
  };

  const handleConfirmPurchase = () => {
    if (!selectedWebsiteToBuy) return;
    if (advertiserBalance < selectedWebsiteToBuy.price) {
      alert("اعتبار کیف پول شما کافی نیست. لطفاً ابتدا کیف پول خود را شارژ کنید.");
      return;
    }

    // Deduct balance
    const success = handleDeductAdvertiserBalance(
      selectedWebsiteToBuy.price,
      `ثبت سفارش رپورتاژ در سایت: ${selectedWebsiteToBuy.name}`
    );

    if (success) {
      // Find selected campaign
      const selectedCamp = campaigns.find((c) => c.id === wizardCampaignId);

      // Create Advertorial order
      const newOrder: AdvertorialOrder = {
        id: "ord_" + Date.now(),
        websiteId: selectedWebsiteToBuy.id,
        websiteName: selectedWebsiteToBuy.name,
        websiteDomain: selectedWebsiteToBuy.domain,
        campaignId: wizardCampaignId || null,
        campaignName: selectedCamp ? selectedCamp.name : null,
        title: wizardTitle || "رپورتاژ آگهی جدید",
        body: wizardBody || "<p>متن خالی</p>",
        keywords: wizardKeywords,
        status: "pending", // Waiting for publisher to publish
        price: selectedWebsiteToBuy.price,
        dateCreated: new Date().toLocaleDateString("fa-IR"),
        deliveryTimeLimit: selectedWebsiteToBuy.deliveryTime,
      };

      // If campaign selected, increment ordersCount
      if (wizardCampaignId) {
        updateCampaignsState(
          campaigns.map((c) => (c.id === wizardCampaignId ? { ...c, ordersCount: c.ordersCount + 1 } : c))
        );
      }

      updateOrdersState([newOrder, ...orders]);

      // Add user notification
      const newNotif: UserNotification = {
        id: "not_" + Date.now(),
        title: "سفارش جدید ثبت شد",
        message: `سفارش رپورتاژ شما برای رسانه ${selectedWebsiteToBuy.name} ثبت و جهت بررسی برای ناشر ارسال گردید.`,
        date: new Date().toLocaleDateString("fa-IR"),
        read: false,
        type: "info"
      };
      setNotifications([newNotif, ...notifications]);

      setShowCheckoutWizard(false);
      setSelectedWebsiteToBuy(null);
      setCurrentTab("dashboard");
    }
  };

  // Bridge content writer directly to purchase wizard
  const handleBridgeContentToWebsite = (title: string, body: string, keywords: string[]) => {
    // Navigate to Catalog
    setCurrentTab("catalog");
    // Prep fields for wizard
    setWizardTitle(title);
    setWizardBody(body);
    // Auto populate keywords with mockup start URLs
    setWizardKeywords(keywords.map((kw) => ({ text: kw, url: "https://my-brand.ir" })));
    
    // Notify
    alert("رپورتاژ تولید شده آماده انتشار است! اکنون رسانه مقصد خود را از کاتالوگ زیر انتخاب کنید.");
  };

  // --- PUBLISHER ACTIONS ---
  const handleUpdateWebsitePrice = (id: string, newPrice: number, description: string) => {
    updateWebsitesState(
      websites.map((site) => (site.id === id ? { ...site, price: newPrice, description } : site))
    );
  };

  const handlePublishOrder = (orderId: string, finalUrl: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    const isAlreadyPublished = order.status === "published";

    // Update order status
    const updatedOrders = orders.map((o) =>
      o.id === orderId ? { ...o, status: "published" as const, publishedUrl: finalUrl } : o
    );
    updateOrdersState(updatedOrders);

    if (isAlreadyPublished) {
      // Add notification for the update
      const newNotif: UserNotification = {
        id: "not_" + Date.now(),
        title: "لینک رپورتاژ بروزرسانی شد",
        message: `لینک رپورتاژ با عنوان "${order.title.substring(0, 20)}..." در رسانه ${order.websiteName} ویرایش و بروزرسانی شد.`,
        date: new Date().toLocaleDateString("fa-IR"),
        read: false,
        type: "info"
      };
      setNotifications([newNotif, ...notifications]);
      return;
    }

    // Add revenue to publisher wallet
    const newPubBal = publisherBalance + order.price;
    updatePublisherBalanceState(newPubBal);

    // Add wallet transaction to history
    const newTrx: WalletTransaction = {
      id: "trx_" + Date.now(),
      type: "income",
      amount: order.price,
      description: `درآمد حاصل از انتشار رپورتاژ در سایت: ${order.websiteName}`,
      date: new Date().toLocaleDateString("fa-IR"),
      status: "success",
    };
    updateTransactionsState([newTrx, ...transactions]);

    // Add Notification to advertiser
    const newNotif: UserNotification = {
      id: "not_" + Date.now(),
      title: "رپورتاژ شما منتشر شد!",
      message: `رپورتاژ با عنوان "${order.title.substring(0, 20)}..." در رسانه ${order.websiteName} منتشر شد.`,
      date: new Date().toLocaleDateString("fa-IR"),
      read: false,
      type: "success"
    };
    setNotifications([newNotif, ...notifications]);
  };

  const handleRejectOrder = (orderId: string, reason: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    // Update order status
    const updatedOrders = orders.map((o) =>
      o.id === orderId ? { ...o, status: "rejected" as const, rejectionReason: reason } : o
    );
    updateOrdersState(updatedOrders);

    // Refund money to advertiser balance
    const newAdvBal = advertiserBalance + order.price;
    updateAdvertiserBalanceState(newAdvBal);

    // Add refund transaction to history
    const newTrx: WalletTransaction = {
      id: "trx_" + Date.now(),
      type: "deposit", // acts as refund
      amount: order.price,
      description: `بازگشت وجه به علت رد رپورتاژ در رسانه ${order.websiteName}`,
      date: new Date().toLocaleDateString("fa-IR"),
      status: "success",
    };
    updateTransactionsState([newTrx, ...transactions]);

    // Add notification
    const newNotif: UserNotification = {
      id: "not_" + Date.now(),
      title: "سفارش رپورتاژ رد شد",
      message: `سفارش رپورتاژ شما در رسانه ${order.websiteName} رد شد و مبلغ عودت گردید.`,
      date: new Date().toLocaleDateString("fa-IR"),
      read: false,
      type: "warning"
    };
    setNotifications([newNotif, ...notifications]);
  };

  const handleWithdrawRequest = (amount: number) => {
    if (publisherBalance >= amount) {
      const newPubBal = publisherBalance - amount;
      updatePublisherBalanceState(newPubBal);

      const newTrx: WalletTransaction = {
        id: "trx_" + Date.now(),
        type: "withdrawal",
        amount,
        description: "درخواست برداشت موجودی و واریز به شبا",
        date: new Date().toLocaleDateString("fa-IR"),
        status: "success",
      };
      updateTransactionsState([newTrx, ...transactions]);
    }
  };

  // Delete rejected/draft orders
  const handleDeleteOrder = (id: string) => {
    updateOrdersState(orders.filter((o) => o.id !== id));
  };

  // Open SEO AI Analyzer Modal
  const handleAnalyzeOrderSEO = (order: AdvertorialOrder) => {
    setSeoAnalyzerTargetOrder(order);
  };

  if (!isLoggedIn) {
    if (isViewingLogin) {
      return (
        <div className="relative">
          {/* A small button to go back to the landing page */}
          <div className="absolute top-4 right-4 z-50">
            <button
              onClick={() => setIsViewingLogin(false)}
              className="flex items-center gap-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-black px-4 py-2.5 rounded-xl shadow-xs cursor-pointer transition-all"
            >
              <ArrowRight className="w-4 h-4" />
              <span>بازگشت به صفحه اصلی معرفی</span>
            </button>
          </div>
          <LoginView onLogin={handleLogin} />
        </div>
      );
    }
    return (
      <LandingPageView
        onStartAsAdvertiser={() => {
          setUserRole("advertiser");
          setIsViewingLogin(true);
        }}
        onStartAsPublisher={() => {
          setUserRole("publisher");
          setIsViewingLogin(true);
        }}
        onLoginClick={() => {
          setIsViewingLogin(true);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans antialiased">
      
      {/* Upper Navigation Hub / Top Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between" dir="rtl">
          
          {/* Logo Brand */}
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 text-white p-2.5 rounded-xl shadow-md shadow-blue-600/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-black text-slate-800 text-base leading-none">رپورتا</h1>
              <span className="text-[9px] text-slate-400 font-bold block mt-0.5">پلتفرم هوشمند رپورتاژ آگهی و سئو</span>
            </div>
          </div>

          {/* Static Role Display Badge (Separated & Secure) */}
          <div className="flex items-center gap-1.5">
            {userRole === "advertiser" && (
              <div className="flex items-center gap-1.5 bg-blue-50 border border-blue-200 text-blue-700 px-3.5 py-1.5 rounded-xl text-xs font-black shadow-xs">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></span>
                <span>پنل کاربری آگهی‌دهنده</span>
              </div>
            )}
            {userRole === "publisher" && (
              <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 px-3.5 py-1.5 rounded-xl text-xs font-black shadow-xs">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                <span>پنل مدیریت رسانه‌دار / ناشر</span>
              </div>
            )}
            {userRole === "admin" && (
              <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-700 px-3.5 py-1.5 rounded-xl text-xs font-black shadow-xs">
                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></span>
                <span>پنل نظارتی مدیر پلتفرم</span>
              </div>
            )}
          </div>

          {/* User utility panel */}
          <div className="flex items-center gap-3.5">
            {/* Header Shopping Cart Quick-Link */}
            {userRole === "advertiser" && (
              <button
                onClick={() => {
                  setCurrentTab("wallet");
                }}
                className="relative p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer flex items-center"
                title="سبد خرید رپورتاژ"
              >
                <ShoppingBag className="w-5 h-5" />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center animate-bounce">
                    {cart.length}
                  </span>
                )}
              </button>
            )}

            {/* Notification bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <Bell className="w-5 h-5" />
                {notifications.some((n) => !n.read) && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full" />
                )}
              </button>

              {/* Notification dropdown */}
              {showNotifications && (
                <div className="absolute left-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden text-right z-50">
                  <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex justify-between items-center text-xs font-bold">
                    <span>اعلان‌های پلتفرم</span>
                    <button
                      onClick={() => setNotifications(notifications.map((n) => ({ ...n, read: true })))}
                      className="text-blue-600 hover:underline text-[10px]"
                    >
                      علامت خوانده شده
                    </button>
                  </div>
                  <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
                    {notifications.map((not) => (
                      <div key={not.id} className={`p-3.5 text-xs ${not.read ? "opacity-75" : "bg-blue-50/10"}`}>
                        <div className="flex justify-between items-center">
                          <span className="font-extrabold text-slate-800">{not.title}</span>
                          <span className="text-[9px] text-slate-400 font-semibold">{not.date}</span>
                        </div>
                        <p className="text-slate-500 text-[11px] leading-relaxed mt-1">{not.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Profile mockup and logout */}
            <div className="flex items-center gap-2 border-r border-slate-200 pr-3.5">
              {currentUser?.avatarUrl ? (
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.name}
                  referrerPolicy="no-referrer"
                  className="w-8 h-8 rounded-full border border-slate-200 object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-black text-xs border border-blue-200">
                  {currentUser?.name ? currentUser.name.charAt(0) : "U"}
                </div>
              )}
              <div className="hidden md:block text-right">
                <span className="text-xs font-extrabold text-slate-700 block">{currentUser?.name || "کاربر تایید شده"}</span>
                <span className="text-[9px] text-slate-400 font-bold block">
                  {userRole === "admin" ? "مدیر ارشد پلتفرم" : userRole === "publisher" ? "صاحب رسانه" : "آگهی‌دهنده سئو"}
                </span>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="mr-1.5 p-1 px-2.5 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl text-[9px] font-black transition-all cursor-pointer border border-rose-200/50"
              >
                خروج
              </button>
            </div>
          </div>

        </div>
      </header>

      {/* Main Tab Navigation for current selected role */}
      <nav className="bg-white border-b border-slate-200 shadow-xs py-1">
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center gap-1 overflow-x-auto" dir="rtl">
          {userRole === "advertiser" ? (
            <>
              {[
                { id: "dashboard", label: "داشبورد سئو", icon: LayoutDashboard },
                { id: "catalog", label: "خرید رپورتاژ آگهی", icon: Search },
                { id: "content", label: "نگارش رپورتاژ (هوش مصنوعی)", icon: PenTool },
                { id: "wallet", label: "کیف پول و تراکنش‌ها", icon: Wallet },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setCurrentTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-lg text-xs font-black transition-all cursor-pointer relative ${
                      currentTab === tab.id
                        ? "text-blue-600 bg-blue-50/60"
                        : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{tab.label}</span>
                    {tab.id === "wallet" && cart.length > 0 && (
                      <span className="bg-rose-500 text-white text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center animate-pulse">
                        {cart.length}
                      </span>
                    )}
                  </button>
                );
              })}
            </>
          ) : userRole === "publisher" ? (
            <>
              {[
                { id: "dashboard", label: "داشبورد رسانه", icon: LayoutDashboard },
                { id: "orders", label: "سفارش‌های دریافتی", icon: Globe },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setCurrentTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-lg text-xs font-black transition-all cursor-pointer ${
                      currentTab === tab.id
                        ? "text-blue-600 bg-blue-50/60"
                        : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </>
          ) : (
            <>
              {[
                { id: "dashboard", label: "کنترل پنل مدیریت ارشد", icon: LayoutDashboard },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setCurrentTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-lg text-xs font-black transition-all cursor-pointer ${
                      currentTab === tab.id
                        ? "text-blue-600 bg-blue-50/60"
                        : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </>
          )}
        </div>
      </nav>

      {/* Main Workspace Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-6 py-8">
        {userRole === "advertiser" ? (
          <>
            {currentTab === "dashboard" && (
              <AdvertiserDashboard
                orders={orders}
                campaigns={campaigns}
                websites={websites}
                onCreateCampaign={handleCreateCampaign}
                onUpdateOrder={(updatedOrder) => updateOrdersState(orders.map((o) => (o.id === updatedOrder.id ? updatedOrder : o)))}
                onDeleteOrder={handleDeleteOrder}
                onAnalyzeOrderSEO={handleAnalyzeOrderSEO}
                userWalletBalance={advertiserBalance}
              />
            )}
            {currentTab === "catalog" && (
              <CatalogView
                websites={websites}
                onSelectWebsite={handleSelectWebsiteToBuy}
                userWalletBalance={advertiserBalance}
                cart={cart}
                onAddToCart={handleAddToCart}
              />
            )}
            {currentTab === "content" && (
              <ContentWritingView
                onAddOrderToWebsite={handleBridgeContentToWebsite}
                userWalletBalance={advertiserBalance}
                onDeductBalance={handleDeductAdvertiserBalance}
              />
            )}
            {currentTab === "wallet" && (
              <WalletView
                balance={advertiserBalance}
                transactions={transactions}
                onDeposit={handleAdvertiserDeposit}
                cartItems={cart}
                onRemoveFromCart={handleRemoveFromCart}
                onCheckoutCart={handleCheckoutCart}
                campaigns={campaigns}
                onCreateCampaign={handleCreateCampaign}
              />
            )}
          </>
        ) : userRole === "publisher" ? (
          <>
            {currentTab === "dashboard" && (
              <PublisherDashboard
                myWebsites={websites.filter((site) => site.isMine)}
                receivedOrders={orders.filter((ord) => websites.some((s) => s.id === ord.websiteId && s.isMine))}
                onUpdateWebsitePrice={handleUpdateWebsitePrice}
                onPublishOrder={handlePublishOrder}
                onRejectOrder={handleRejectOrder}
                publisherBalance={publisherBalance}
                onWithdrawRequest={handleWithdrawRequest}
                myRegistrationRequests={registrationRequests.filter(r => r.publisherEmail === currentUser?.email || r.publisherName === currentUser?.name)}
                onAddMediaRequest={handleAddMediaRequest}
                currentUser={currentUser}
              />
            )}
            {currentTab === "orders" && (
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
                <PublisherDashboard
                  myWebsites={websites.filter((site) => site.isMine)}
                  receivedOrders={orders.filter((ord) => websites.some((s) => s.id === ord.websiteId && s.isMine))}
                  onUpdateWebsitePrice={handleUpdateWebsitePrice}
                  onPublishOrder={handlePublishOrder}
                  onRejectOrder={handleRejectOrder}
                  publisherBalance={publisherBalance}
                  onWithdrawRequest={handleWithdrawRequest}
                  myRegistrationRequests={registrationRequests.filter(r => r.publisherEmail === currentUser?.email || r.publisherName === currentUser?.name)}
                  onAddMediaRequest={handleAddMediaRequest}
                  currentUser={currentUser}
                />
              </div>
            )}
          </>
        ) : (
          <>
            {currentTab === "dashboard" && (
              <AdminDashboard
                publisherUsers={publisherUsers}
                registrationRequests={registrationRequests}
                websites={websites}
                onApproveRequest={handleApproveRequest}
                onRejectRequest={handleRejectRequest}
                onLogout={handleLogout}
              />
            )}
          </>
        )}
      </main>

      {/* Footer Branding info */}
      <footer className="bg-white border-t border-slate-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 flex flex-col md:flex-row items-center justify-between text-slate-400 text-xs" dir="rtl">
          <p>© ۱۴۰۶ رپورتا - تمام حقوق برای شبیه‌ساز رپورتاژ آگهی ایران محفوظ است.</p>
          <div className="flex gap-4 mt-3 md:mt-0">
            <a href="#" className="hover:text-slate-600 transition-colors">قوانین رسانه‌ها</a>
            <a href="#" className="hover:text-slate-600 transition-colors">راهنمای هوش مصنوعی</a>
            <a href="#" className="hover:text-slate-600 transition-colors">پشتیبانی شتاب</a>
          </div>
        </div>
      </footer>

      {/* ORDER WIZARD MODAL (CHECKOUT & CONTENT WRITING FLOW) */}
      {showCheckoutWizard && selectedWebsiteToBuy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs text-right animate-fade-in" dir="rtl">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-slate-200">
            
            {/* Header */}
            <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <h3 className="font-black text-slate-800 text-base flex items-center gap-1.5">
                  <ShoppingBag className="w-5 h-5 text-blue-600" />
                  <span>مراحل ثبت سفارش رپورتاژ در {selectedWebsiteToBuy.name}</span>
                </h3>
                <span className="text-[10px] text-slate-400 block mt-1">تعرفه انتشار: {selectedWebsiteToBuy.price.toLocaleString("fa-IR")} تومان</span>
              </div>
              <button
                onClick={() => {
                  setShowCheckoutWizard(false);
                  setSelectedWebsiteToBuy(null);
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Steps Indicator */}
            <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-200 flex items-center justify-between text-xs">
              {[
                { step: 1, label: "کمپین و عنوان" },
                { step: 2, label: "محتوای مقاله" },
                { step: 3, label: "کلمات کلیدی و تسویه" },
              ].map((st) => (
                <div key={st.step} className="flex items-center gap-2">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold ${
                    wizardStep === st.step
                      ? "bg-blue-600 text-white"
                      : wizardStep > st.step
                      ? "bg-emerald-500 text-white"
                      : "bg-slate-200 text-slate-600"
                  }`}>
                    {st.step}
                  </span>
                  <span className={`font-black ${wizardStep === st.step ? "text-blue-600" : "text-slate-500"}`}>{st.label}</span>
                </div>
              ))}
            </div>

            {/* Steps Content container */}
            <div className="p-6 overflow-y-auto flex-1 space-y-5">
              
              {wizardStep === 1 && (
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50/40 rounded-xl border border-blue-100/50">
                    <p className="text-[11px] text-blue-900 leading-relaxed font-bold">
                      شما در حال خرید جایگاه رپورتاژ آگهی دائمی در رسانه معتبر <strong>{selectedWebsiteToBuy.name}</strong> هستید. در گام اول کمپین و عنوان رپورتاژ خود را مشخص کنید.
                    </p>
                  </div>

                  {/* Select Campaign */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 block">انتخاب کمپین تبلیغاتی:</label>
                    <select
                      value={wizardCampaignId}
                      onChange={(e) => setWizardCampaignId(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 text-slate-700 bg-slate-50/50"
                    >
                      <option value="">بدون کمپین (سفارش مستقیم)</option>
                      {campaigns.map((camp) => (
                        <option key={camp.id} value={camp.id}>
                          {camp.name} (بودجه: {camp.budget.toLocaleString("fa-IR")} تومان)
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Title of رپورتاژ */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 block">عنوان اصلی رپورتاژ آگهی (H1):</label>
                    <input
                      type="text"
                      placeholder="عنوان جذاب مقاله رپورتاژ را بنویسید..."
                      value={wizardTitle}
                      onChange={(e) => setWizardTitle(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 text-slate-700"
                    />
                  </div>
                </div>
              )}

              {wizardStep === 2 && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                    <label className="text-xs font-bold text-slate-600 block">متن مقاله رپورتاژ (کامل):</label>
                    <button
                      onClick={() => {
                        setShowCheckoutWizard(false);
                        setCurrentTab("content");
                      }}
                      className="text-xs text-blue-600 font-extrabold flex items-center gap-1 hover:underline"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>نگارش با نویسنده هوش مصنوعی رپورتا</span>
                    </button>
                  </div>

                  <textarea
                    placeholder="متن کامل رپورتاژ را با رعایت اصول خوانایی وارد کنید. استفاده از تگ‌های عناوین h2 و h3 و پاراگراف p توصیه می‌شود..."
                    value={wizardBody}
                    onChange={(e) => setWizardBody(e.target.value)}
                    rows={10}
                    className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 text-slate-700 font-mono resize-none leading-relaxed"
                  />
                </div>
              )}

              {wizardStep === 3 && (
                <div className="space-y-5">
                  
                  {/* Link insertions */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-slate-600 block">درج کلمات کلیدی و لینک‌های هدف (حداکثر {selectedWebsiteToBuy.allowedLinksCount} لینک):</label>
                      <span className="text-[10px] text-slate-400 font-bold">لینک‌های درج شده: {wizardKeywords.length} / {selectedWebsiteToBuy.allowedLinksCount}</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="md:col-span-2">
                        <input
                          type="text"
                          placeholder="مثال: خرید تجهیزات سئو - https://seo-agency.ir"
                          value={wizardKeywordInput}
                          onChange={(e) => setWizardKeywordInput(e.target.value)}
                          className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 text-slate-700"
                        />
                        <span className="text-[9px] text-slate-400 mt-1 block">فرمت: کلمه انکر تکست - آدرس لینک با https</span>
                      </div>
                      <button
                        type="button"
                        onClick={handleAddKeywordToWizard}
                        className="bg-slate-800 hover:bg-slate-900 text-white text-xs font-black py-2 rounded-xl h-9 cursor-pointer"
                      >
                        اضافه کردن لینک
                      </button>
                    </div>

                    {/* Keywords chip lists */}
                    <div className="flex flex-wrap gap-2 pt-1">
                      {wizardKeywords.map((kw, idx) => (
                        <span key={idx} className="bg-slate-50 text-slate-700 text-[10px] font-bold px-2.5 py-1 rounded-lg border border-slate-200 flex items-center gap-1.5">
                          <strong>{kw.text}</strong> ➔ <span className="text-blue-600 font-mono">{kw.url.substring(0, 20)}...</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveKeywordFromWizard(idx)}
                            className="text-rose-400 hover:text-rose-600 font-bold text-xs"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Pricing and invoice breakdown */}
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5">
                    <h5 className="font-extrabold text-slate-800 text-xs">صورت‌حساب نهایی سفارش:</h5>
                    <div className="flex justify-between text-xs text-slate-600 font-semibold">
                      <span>رسانه مقصد انتشار:</span>
                      <span>{selectedWebsiteToBuy.name} ({selectedWebsiteToBuy.domain})</span>
                    </div>
                    <div className="flex justify-between text-xs text-slate-600 font-semibold">
                      <span>نوع لینک خروجی:</span>
                      <span className="text-blue-600 font-bold">دائمی و {selectedWebsiteToBuy.linkType === "follow" ? "فالو (Follow)" : "نوفالو"}</span>
                    </div>
                    <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-black text-slate-800">
                      <span>تعرفه نهایی کاتالوگ:</span>
                      <span className="text-emerald-600">{selectedWebsiteToBuy.price.toLocaleString("fa-IR")} تومان</span>
                    </div>
                  </div>

                  {/* Payment Wallet Warning */}
                  {advertiserBalance < selectedWebsiteToBuy.price ? (
                    <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                      <div className="text-right space-y-1">
                        <p className="text-rose-800 text-[10px] font-black">موجودی کیف پول شما کافی نیست!</p>
                        <p className="text-rose-700 text-[9px]">موجودی شما {advertiserBalance.toLocaleString("fa-IR")} تومان است. مابقی مبلغ را ابتدا شارژ کنید.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-2 text-[10px] text-emerald-800 font-bold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>اعتبار کیف پول شما کافی است. وجه مستقیماً از کیف پول کسر خواهد شد.</span>
                    </div>
                  )}

                </div>
              )}

            </div>

            {/* Footer Navigation */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-xs">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowCheckoutWizard(false);
                    setSelectedWebsiteToBuy(null);
                  }}
                  className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-2 rounded-xl font-bold transition-all"
                >
                  انصراف
                </button>
              </div>

              <div className="flex gap-2">
                {wizardStep > 1 && (
                  <button
                    type="button"
                    onClick={() => setWizardStep(wizardStep - 1)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl font-bold transition-all"
                  >
                    مرحله قبلی
                  </button>
                )}

                {wizardStep < 3 ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (wizardStep === 1 && !wizardTitle) {
                        alert("لطفاً ابتدا عنوان رپورتاژ را مشخص کنید.");
                        return;
                      }
                      if (wizardStep === 2 && !wizardBody) {
                        alert("لطفاً متن رپورتاژ را وارد کنید.");
                        return;
                      }
                      setWizardStep(wizardStep + 1);
                    }}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-xl font-bold transition-all"
                  >
                    ادامه مراحل
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleConfirmPurchase}
                    disabled={advertiserBalance < selectedWebsiteToBuy.price}
                    className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white px-6 py-2 rounded-xl font-black transition-all shadow-md shadow-emerald-600/10 cursor-pointer"
                  >
                    پرداخت و ثبت رپورتاژ
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* GLOBAL SEO ANALYZER DIALOG */}
      {seoAnalyzerTargetOrder && (
        <AIAnalyzerModal
          isOpen={!!seoAnalyzerTargetOrder}
          onClose={() => setSeoAnalyzerTargetOrder(null)}
          title={seoAnalyzerTargetOrder.title}
          body={seoAnalyzerTargetOrder.body}
          targetKeywords={seoAnalyzerTargetOrder.keywords.map((k) => k.text)}
        />
      )}

    </div>
  );
}
