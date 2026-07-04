import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// API Routes

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// Google OAuth URL generator
app.get("/api/auth/google/url", (req, res) => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) {
    res.json({ configured: false });
    return;
  }

  const appUrl = process.env.APP_URL || `${req.protocol}://${req.get("host")}`;
  const redirectUri = `${appUrl.replace(/\/$/, "")}/api/auth/google/callback`;

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile",
    prompt: "select_account"
  });

  res.json({
    configured: true,
    url: `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
  });
});

// Google OAuth Callback URL
app.get("/api/auth/google/callback", async (req: express.Request, res: express.Response) => {
  const { code, error } = req.query;

  if (error) {
    res.send(`
      <html>
        <body style="font-family: sans-serif; text-align: center; padding: 50px; background: #0f172a; color: #f8fafc;">
          <h2 style="color: #ef4444;">خطا در ورود با گوگل</h2>
          <p>${error}</p>
          <script>
            if (window.opener) {
              window.opener.postMessage({ type: "OAUTH_AUTH_FAILURE", error: "${error}" }, "*");
              setTimeout(() => window.close(), 3000);
            }
          </script>
        </body>
      </html>
    `);
    return;
  }

  if (!code) {
    res.status(400).send("کد تأیید گوگل یافت نشد.");
    return;
  }

  try {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const appUrl = process.env.APP_URL || `${req.protocol}://${req.get("host")}`;
    const redirectUri = `${appUrl.replace(/\/$/, "")}/api/auth/google/callback`;

    // Exchange code for token
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code: code as string,
        client_id: clientId || "",
        client_secret: clientSecret || "",
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }).toString(),
    });

    if (!tokenResponse.ok) {
      const errText = await tokenResponse.text();
      throw new Error(`خطا در دریافت توکن گوگل: ${errText}`);
    }

    const tokenData: any = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Fetch user info using access token
    const userResponse = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!userResponse.ok) {
      throw new Error("خطا در دریافت مشخصات کاربر از گوگل");
    }

    const userData: any = await userResponse.json();

    const userPayload = {
      name: userData.name || userData.email.split("@")[0],
      email: userData.email,
      avatarUrl: userData.picture,
    };

    // Send success message and close popup
    res.send(`
      <html>
        <body style="font-family: sans-serif; text-align: center; padding: 50px; background: #0f172a; color: #f8fafc;">
          <h2 style="color: #22c55e;">ورود موفقیت‌آمیز</h2>
          <p>با موفقیت از طریق حساب گوگل وارد شدید. در حال انتقال به پنل...</p>
          <script>
            if (window.opener) {
              window.opener.postMessage({ 
                type: "OAUTH_AUTH_SUCCESS", 
                user: ${JSON.stringify(userPayload)} 
              }, "*");
              setTimeout(() => window.close(), 1000);
            } else {
              window.location.href = "/";
            }
          </script>
        </body>
      </html>
    `);
  } catch (err: any) {
    console.error("Google Auth Callback Error:", err);
    res.send(`
      <html>
        <body style="font-family: sans-serif; text-align: center; padding: 50px; background: #0f172a; color: #f8fafc;">
          <h2 style="color: #ef4444;">خطا در تایید اعتبار</h2>
          <p>${err.message}</p>
          <script>
            if (window.opener) {
              window.opener.postMessage({ type: "OAUTH_AUTH_FAILURE", error: "${encodeURIComponent(err.message || "")}" }, "*");
              setTimeout(() => window.close(), 5000);
            }
          </script>
        </body>
      </html>
    `);
  }
});

// AI Advertorial Content Generator
app.post("/api/gemini/generate-content", async (req: express.Request, res: express.Response) => {
  try {
    const { topic, keywords, tone, wordCount, brief } = req.body;

    if (!topic) {
      res.status(400).json({ error: "موضوع رپورتاژ الزامی است." });
      return;
    }

    const keywordsStr = keywords && Array.isArray(keywords) ? keywords.join("، ") : keywords || "ندارد";

    const prompt = `
    شما یک نویسنده حرفه‌ای رپورتاژ آگهی و کارشناس سئو (SEO) با تجربه در ایران هستید.
    یک رپورتاژ آگهی جذاب، متقاعدکننده و کاملاً بهینه‌سازی شده برای گوگل بنویسید.
    
    مشخصات رپورتاژ مورد نیاز:
    موضوع: "${topic}"
    کلمات کلیدی هدف (که باید به عنوان انکرتکست استفاده شوند): [${keywordsStr}]
    لحن نگارش: "${tone || "رسمی و اداری"}"
    تعداد کلمات تقریبی: ${wordCount || 800} کلمه
    توضیحات یا بریف کارفرما: "${brief || "ندارد"}"
    
    دستورالعمل‌های نگارش:
    ۱. عنوان رپورتاژ (H1) باید بسیار جذاب، کلیک‌خور و شامل کلمه کلیدی اصلی باشد.
    ۲. متن باید دارای ساختار منظم با تگ‌های عناوین فرعی (H2 و H3) باشد.
    ۳. کلمات کلیدی ذکر شده را به صورت کاملاً طبیعی در متن پخش کنید و آن‌ها را در جای مناسب هایلایت یا به صورت لینک فرضی مشخص کنید.
    ۴. متن نباید مستقیماً شبیه به تبلیغ مستقیم باشد، بلکه باید به صورت یک مقاله راهنما، خبری یا آموزشی ارزشمند شروع شود و در انتها به آرامی مخاطب را به سمت استفاده از خدمات یا خرید محصول هدایت کند (فانل بازاریابی محتوایی).
    ۵. در پایان متن، یک بخش جمع‌بندی کوتاه بنویسید.
    
    پاسخ خود را حتماً به زبان فارسی روان و با فرمت ساختاریافته (JSON) با مشخصات زیر ارسال کنید:
    {
      "title": "عنوان جذاب رپورتاژ",
      "body": "کل متن رپورتاژ همراه با تگ‌های HTML ساده مانند <p> و <h2> و <h3> و لینک‌های فرضی <a href='#'>کلمه کلیدی</a> برای سئو عالی و خوانایی بالا",
      "summary": "خلاصه کوتاه رپورتاژ (توضیحات متا پیشنهادی)",
      "seoTips": ["نکته ۱ برای سئو", "نکته ۲ برای لینک‌سازی"]
    }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            body: { type: Type.STRING },
            summary: { type: Type.STRING },
            seoTips: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["title", "body", "summary", "seoTips"]
        },
        temperature: 0.7,
      },
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("پاسخی از مدل هوش مصنوعی دریافت نشد.");
    }

    const data = JSON.parse(resultText);
    res.json(data);
  } catch (error: any) {
    console.error("Error generating content:", error);
    res.status(500).json({ error: error.message || "خطا در تولید محتوا توسط هوش مصنوعی" });
  }
});

// AI SEO & Quality Analyzer
app.post("/api/gemini/analyze-seo", async (req: express.Request, res: express.Response) => {
  try {
    const { title, body, targetKeywords } = req.body;

    if (!title || !body) {
      res.status(400).json({ error: "عنوان و متن رپورتاژ برای تحلیل الزامی هستند." });
      return;
    }

    const keywordsStr = targetKeywords && Array.isArray(targetKeywords) ? targetKeywords.join("، ") : targetKeywords || "تعیین نشده";

    const prompt = `
    شما یک متخصص سئو و ویراستار ارشد رپورتاژ آگهی هستید. 
    رپورتاژ آگهی زیر را تحلیل کنید و یک آنالیز دقیق، نمره سئو (از ۱۰۰)، نقاط قوت، نقاط ضعف و اصلاحات پیشنهادی به زبان فارسی ارائه دهید.
    
    عنوان: "${title}"
    متن رپورتاژ: "${body}"
    کلمات کلیدی هدف: [${keywordsStr}]
    
    فاکتورهای تحلیل:
    ۱. جذابیت عنوان و داشتن کلمه کلیدی.
    ۲. میزان بهینه‌سازی کلمات کلیدی هدف و توزیع طبیعی آن‌ها.
    ۳. ساختار هدینگ‌ها (H2, H3).
    ۴. تعداد لینک‌های خروجی و انکرتکست‌ها (آیا مناسب است؟ رپورتاژ استاندارد معمولاً ۱ تا ۳ لینک دارد).
    ۵. لحن، خوانایی و جذابیت برای مخاطب ایرانی.
    
    پاسخ خود را دقیقاً با این فرمت ساختاریافته (JSON) ارسال کنید:
    {
      "seoScore": 85, // یک عدد بین ۰ تا ۱۰۰
      "readabilityScore": 90, // یک عدد بین ۰ تا ۱۰۰ برای خوانایی
      "keywordsDensity": "توضیح کوتاه درباره تراکم کلمات کلیدی",
      "strengths": ["نقطه قوت ۱", "نقطه قوت ۲"],
      "weaknesses": ["نقطه ضعف ۱", "نقطه ضعف ۲"],
      "suggestions": ["پیشنهاد اصلاحی ۱", "پیشنهاد اصلاحی ۲"],
      "optimizedTitle": "یک عنوان پیشنهادی جایگزین و جذاب‌تر اگر نیاز است"
    }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            seoScore: { type: Type.INTEGER },
            readabilityScore: { type: Type.INTEGER },
            keywordsDensity: { type: Type.STRING },
            strengths: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            weaknesses: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            suggestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            optimizedTitle: { type: Type.STRING }
          },
          required: ["seoScore", "readabilityScore", "keywordsDensity", "strengths", "weaknesses", "suggestions", "optimizedTitle"]
        },
        temperature: 0.3,
      },
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("پاسخی از مدل هوش مصنوعی دریافت نشد.");
    }

    const data = JSON.parse(resultText);
    res.json(data);
  } catch (error: any) {
    console.error("Error analyzing SEO:", error);
    res.status(500).json({ error: error.message || "خطا در تحلیل سئو توسط هوش مصنوعی" });
  }
});

// Vite Server integration
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
