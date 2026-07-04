import { MediaWebsite, AdvertorialOrder, Campaign, ContentOrder, WalletTransaction, PublisherUser, MediaRegistrationRequest } from "./types";

export const MOCK_WEBSITES: MediaWebsite[] = [
  {
    id: "site_1",
    name: "زومیت",
    domain: "zoomit.ir",
    logo: "Z",
    category: "technology",
    categoryLabel: "فناوری و تکنولوژی",
    domainAuthority: 62,
    spamScore: 1,
    alexaRank: 12,
    price: 1850000,
    linkType: "follow",
    deliveryTime: "۲۴ ساعت",
    allowedLinksCount: 3,
    description: "لینک‌های فالو تا حداکثر ۳ عدد پذیرفته می‌شود. تغییر در متن پس از انتشار امکان‌پذیر نیست. تصاویر با کیفیت آپلود شود.",
  },
  {
    id: "site_2",
    name: "دیجیاتو",
    domain: "digiato.com",
    logo: "D",
    category: "technology",
    categoryLabel: "فناوری و تکنولوژی",
    domainAuthority: 58,
    spamScore: 1,
    alexaRank: 18,
    price: 1550000,
    linkType: "follow",
    deliveryTime: "۱۲ ساعت",
    allowedLinksCount: 3,
    description: "انتشار سریع در کمتر از ۱۲ ساعت. درج ۳ لینک فالو مجاز است. حوزه کاری باید مرتبط با تکنولوژی، استارتاپ یا کسب‌وکار باشد.",
  },
  {
    id: "site_3",
    name: "ورزش سه",
    domain: "varzesh3.com",
    logo: "V",
    category: "sports",
    categoryLabel: "ورزش و سرگرمی",
    domainAuthority: 74,
    spamScore: 2,
    alexaRank: 3,
    price: 3400000,
    linkType: "nofollow",
    deliveryTime: "۲۴ ساعت",
    allowedLinksCount: 2,
    description: "پربازدیدترین رسانه ورزشی کشور. لینک‌ها به صورت نوفالو درج می‌شوند. حداکثر ۲ لینک مجاز است.",
  },
  {
    id: "site_4",
    name: "خبرگزاری فارس",
    domain: "farsnews.ir",
    logo: "F",
    category: "news",
    categoryLabel: "اخبار و خبرگزاری",
    domainAuthority: 82,
    spamScore: 3,
    alexaRank: 8,
    price: 2200000,
    linkType: "follow",
    deliveryTime: "۴۸ ساعت",
    allowedLinksCount: 3,
    description: "اعتبار دامنه بسیار بالا. انتشار اخبار رسمی و شرکتی. متن رپورتاژ قبل از انتشار باید به تایید سردبیری برسد.",
  },
  {
    id: "site_5",
    name: "دنیای اقتصاد",
    domain: "donya-e-eqtesad.com",
    logo: "E",
    category: "finance",
    categoryLabel: "اقتصاد و بازار مالی",
    domainAuthority: 66,
    spamScore: 1,
    alexaRank: 25,
    price: 2100000,
    linkType: "follow",
    deliveryTime: "۲۴ ساعت",
    allowedLinksCount: 3,
    description: "بهترین گزینه برای برندهای مالی، بانکی و صنعتی. مخاطبان هدف باکیفیت و تخصصی بازار ارز و سرمایه.",
  },
  {
    id: "site_6",
    name: "نی‌نی سایت",
    domain: "ninisite.com",
    logo: "N",
    category: "lifestyle",
    categoryLabel: "سبک زندگی و خانواده",
    domainAuthority: 54,
    spamScore: 2,
    alexaRank: 15,
    price: 1300000,
    linkType: "follow",
    deliveryTime: "۲۴ ساعت",
    allowedLinksCount: 3,
    description: "مناسب برای محصولات آرایشی، بهداشتی، پوشاک، مادر و کودک و لوازم خانگی. بازدید روزانه فوق‌العاده بالا.",
  },
  {
    id: "site_7",
    name: "چطور",
    domain: "chetor.com",
    logo: "C",
    category: "education",
    categoryLabel: "آموزشی و موفقیت",
    domainAuthority: 51,
    spamScore: 1,
    alexaRank: 42,
    price: 980000,
    linkType: "follow",
    deliveryTime: "۲۴ ساعت",
    allowedLinksCount: 3,
    description: "مقالات سبک زندگی، توسعه فردی و مهارت‌های شغلی. رپورتاژها برای همیشه در سایت باقی می‌مانند.",
  },
  {
    id: "site_8",
    name: "جی‌اس‌ام",
    domain: "gsm.ir",
    logo: "G",
    category: "technology",
    categoryLabel: "فناوری و تکنولوژی",
    domainAuthority: 48,
    spamScore: 2,
    alexaRank: 95,
    price: 850000,
    linkType: "follow",
    deliveryTime: "۲۴ ساعت",
    allowedLinksCount: 3,
    description: "رسانه قدیمی و معتبر حوزه موبایل و گجت‌ها. رپورتاژ شما در دسته‌بندی اخبار تکنولوژی منتشر می‌شود.",
    isMine: true, // This is owned by the user when acting as publisher!
  }
];

export const MOCK_CAMPAIGNS: Campaign[] = [
  {
    id: "camp_1",
    name: "کمپین سئو تابستانه ۱۴۰۶",
    budget: 5000000,
    dateCreated: "۱۴۰۶/۰۳/۱۵",
    ordersCount: 2
  },
  {
    id: "camp_2",
    name: "کمپین رونمایی از فیچر جدید",
    budget: 3000000,
    dateCreated: "۱۴۰۶/۰۳/۲۰",
    ordersCount: 1
  }
];

export const MOCK_ORDERS: AdvertorialOrder[] = [
  {
    id: "ord_1",
    websiteId: "site_1",
    websiteName: "زومیت",
    websiteDomain: "zoomit.ir",
    campaignId: "camp_1",
    campaignName: "کمپین سئو تابستانه ۱۴۰۶",
    title: "تاثیر هوش مصنوعی بر آینده توسعه نرم‌افزار در ایران",
    body: "<h1>نقش برجسته هوش مصنوعی در کدنویسی</h1><p>امروزه استفاده از مدل‌های زبانی بزرگ توسعه نرم‌افزار را دگرگون کرده است. شرکت‌های ایرانی نیز با استفاده از پلتفرم‌های نوین توانسته‌اند زمان توسعه را کاهش دهند...</p>",
    keywords: [
      { text: "توسعه نرم‌افزار", url: "https://my-startup.ir/software" },
      { text: "هوش مصنوعی", url: "https://my-startup.ir/ai" }
    ],
    status: "published",
    price: 1850000,
    dateCreated: "۱۴۰۶/۰۳/۱۶",
    publishedUrl: "https://www.zoomit.ir/pr/ai-future-software-iran.html",
    deliveryTimeLimit: "۲۴ ساعت"
  },
  {
    id: "ord_2",
    websiteId: "site_2",
    websiteName: "دیجیاتو",
    websiteDomain: "digiato.com",
    campaignId: "camp_1",
    campaignName: "کمپین سئو تابستانه ۱۴۰۶",
    title: "چگونه یک استارتاپ موفق در سال ۱۴۰۶ راه‌اندازی کنیم؟",
    body: "<p>راه‌اندازی استارتاپ نیازمند تحقیقات بازار و زیرساخت‌های قوی است. در این مقاله به بررسی مراحل کلیدی راه‌اندازی کسب‌وکار پرداخته‌ایم...</p>",
    keywords: [
      { text: "راه‌اندازی استارتاپ", url: "https://my-startup.ir" }
    ],
    status: "pending",
    price: 1550000,
    dateCreated: "۱۴۰۶/۰۳/۲۲",
    deliveryTimeLimit: "۱۲ ساعت"
  },
  {
    id: "ord_3",
    websiteId: "site_8", // This goes to the publisher's site (GSM) to show the publisher view works!
    websiteName: "جی‌اس‌ام",
    websiteDomain: "gsm.ir",
    campaignId: null,
    campaignName: null,
    title: "بررسی بهترین گوشی‌های میان‌رده بازار ایران در سال جاری",
    body: "<p>در بازار کنونی، خرید گوشی میان‌رده هوشمندانه به بودجه و نیازهای کاربر بستگی دارد. در این مقاله قصد داریم گوشی‌های هوشمندی را بررسی کنیم که ارزش خرید بالایی دارند...</p>",
    keywords: [
      { text: "خرید گوشی هوشمند", url: "https://mobileshop.ir" }
    ],
    status: "pending",
    price: 850000,
    dateCreated: "۱۴۰۶/۰۳/۲۴",
    deliveryTimeLimit: "۲۴ ساعت"
  }
];

export const MOCK_CONTENT_ORDERS: ContentOrder[] = [
  {
    id: "cnt_1",
    topic: "روش‌های طلایی دیجیتال مارکتینگ برای فروشگاه‌های اینترنتی کوچک",
    keywords: ["دیجیتال مارکتینگ", "فروشگاه اینترنتی", "افزایش فروش"],
    tone: "friendly",
    wordCount: 1000,
    brief: "مخاطب این مقاله صاحبان مشاغل خانگی و کوچک هستند. لحن صمیمی و کاربردی باشد.",
    status: "approved",
    generatedTitle: "۱۰ تکنیک دیجیتال مارکتینگ برای نجات فروشگاه‌های اینترنتی کوچک",
    generatedBody: "<h1>دیجیتال مارکتینگ برای کسب‌وکارهای نوپا</h1><p>کسب‌وکارهای اینترنتی کوچک چالش‌های زیادی دارند اما با روش‌های کم‌هزینه بازاریابی دیجیتال می‌توانند غوغا کنند...</p>",
    generatedSummary: "مقاله آموزشی کاربردی با تمرکز بر تکنیک‌های دیجیتال مارکتینگ ارزان‌قیمت برای افزایش فروش فروشگاه‌های اینترنتی نوپا.",
    seoTips: ["از هدینگ H2 برای تفکیک ۱۰ تکنیک استفاده شده است.", "کلمه کلیدی افزایش فروش در ۳ جای متن به شکل طبیعی توزیع شده است."],
    price: 120000,
    dateCreated: "۱۴۰۶/۰۳/۱۸"
  }
];

export const MOCK_TRANSACTIONS: WalletTransaction[] = [
  {
    id: "trx_1",
    type: "deposit",
    amount: 5000000,
    description: "شارژ آنلاین کیف پول - درگاه ملت",
    date: "۱۴۰۶/۰۳/۱۵",
    status: "success"
  },
  {
    id: "trx_2",
    type: "purchase",
    amount: 1850000,
    description: "پرداخت سفارش رپورتاژ در زومیت",
    date: "۱۴۰6/03/16",
    status: "success"
  },
  {
    id: "trx_3",
    type: "purchase",
    amount: 120000,
    description: "پرداخت سفارش نگارش مقاله دیجیتال مارکتینگ",
    date: "۱۴۰۶/۰۳/۱۸",
    status: "success"
  }
];

export const MOCK_PUBLISHER_USERS: PublisherUser[] = [
  {
    id: "pub_user_1",
    name: "سعید علوی",
    email: "saeed.alavi@yahoo.com",
    phone: "۰۹۱۲۳۴۵۶۷۸۹",
    websitesCount: 2,
    dateJoined: "۱۴۰۵/۰۴/۱۲",
    status: "active"
  },
  {
    id: "pub_user_2",
    name: "رضا کریمی",
    email: "r.karimi@gmail.com",
    phone: "۰۹۱۸۷۶۵۴۳۲۱",
    websitesCount: 1,
    dateJoined: "۱۴۰۵/۰۸/۱۹",
    status: "active"
  },
  {
    id: "pub_user_3",
    name: "مینا حسینی",
    email: "m_hosseini@outlook.com",
    phone: "۰۹۳۵۹۸۷۶۵۴۳",
    websitesCount: 1,
    dateJoined: "۱۴۰۶/۰۱/۱۰",
    status: "active"
  },
  {
    id: "pub_user_4",
    name: "امیر قاسمی",
    email: "amir.ghasemi@net.ir",
    phone: "۰۹۳۰۱۲۳۴۵۶۷",
    websitesCount: 0,
    dateJoined: "۱۴۰۶/۰۳/۰۱",
    status: "active"
  }
];

export const MOCK_MEDIA_REGISTRATION_REQUESTS: MediaRegistrationRequest[] = [
  {
    id: "req_1",
    name: "برترین‌ها",
    domain: "bartarinha.ir",
    logo: "B",
    category: "sports",
    categoryLabel: "ورزش و سرگرمی",
    domainAuthority: 55,
    spamScore: 2,
    alexaRank: 20,
    price: 1100000,
    linkType: "follow",
    deliveryTime: "۲۴ ساعت",
    allowedLinksCount: 3,
    description: "بزرگترین پرتال تفریحی و خبری فارسی‌زبان. پذیرش رپورتاژهای عمومی، معرفی اپلیکیشن‌ها و خدمات برندینگ عمومی.",
    status: "pending",
    publisherName: "سعید علوی",
    publisherEmail: "saeed.alavi@yahoo.com"
  },
  {
    id: "req_2",
    name: "سلامت‌نیوز",
    domain: "salamatnews.com",
    logo: "S",
    category: "lifestyle",
    categoryLabel: "سبک زندگی و خانواده",
    domainAuthority: 48,
    spamScore: 1,
    alexaRank: 45,
    price: 950000,
    linkType: "follow",
    deliveryTime: "۲۴ ساعت",
    allowedLinksCount: 2,
    description: "مرجع تخصصی اخبار پزشکی، سلامت و تندرستی. رپورتاژ آگهی‌های مرتبط با تغذیه، زیبایی، درمان و داروسازی پذیرفته می‌شود.",
    status: "pending",
    publisherName: "مینا حسینی",
    publisherEmail: "m_hosseini@outlook.com"
  },
  {
    id: "req_3",
    name: "فرادرس",
    domain: "faradars.org",
    logo: "F",
    category: "education",
    categoryLabel: "آموزش و پژوهش",
    domainAuthority: 61,
    spamScore: 1,
    alexaRank: 14,
    price: 2400000,
    linkType: "nofollow",
    deliveryTime: "۱۲ ساعت",
    allowedLinksCount: 2,
    description: "بزرگترین پلتفرم ویدیوهای آموزشی و دانشگاهی در ایران. کلیه لینک‌ها در انتهای متن به صورت نوفالو درج خواهند شد.",
    status: "pending",
    publisherName: "رضا کریمی",
    publisherEmail: "r.karimi@gmail.com"
  },
  {
    id: "req_4",
    name: "بورس‌نیوز",
    domain: "bourse-news.ir",
    logo: "B",
    category: "finance",
    categoryLabel: "اقتصاد و بازار مالی",
    domainAuthority: 44,
    spamScore: 3,
    alexaRank: 80,
    price: 1200000,
    linkType: "follow",
    deliveryTime: "۴۸ ساعت",
    allowedLinksCount: 3,
    description: "قدیمی‌ترین خبرگزاری بازار سرمایه ایران. درج رپورتاژ با محوریت سیگنال‌دهی ممنوع است.",
    status: "rejected",
    publisherName: "امیر قاسمی",
    publisherEmail: "amir.ghasemi@net.ir",
    rejectionReason: "رسانه‌های حوزه بورس و سیگنال‌دهی طبق قوانین جدید نیاز به مجوزهای رسمی سبدگردانی از سازمان بورس دارند."
  },
  {
    id: "req_5",
    name: "آی‌تی‌رسان",
    domain: "itresan.com",
    logo: "I",
    category: "technology",
    categoryLabel: "فناوری و تکنولوژی",
    domainAuthority: 51,
    spamScore: 2,
    alexaRank: 55,
    price: 850000,
    linkType: "follow",
    deliveryTime: "۲۴ ساعت",
    allowedLinksCount: 3,
    description: "وب‌سایت تخصصی بررسی گجت‌ها، موبایل و تکنولوژی. انتشار منظم و سریع رپورتاژ.",
    status: "approved",
    publisherName: "سعید علوی",
    publisherEmail: "saeed.alavi@yahoo.com"
  }
];

