import React, { useState, useEffect, useRef } from "react";
import mammoth from "mammoth";
import { AdvertorialOrder, MediaWebsite } from "../types";
import {
  ArrowRight,
  Upload,
  Image as ImageIcon,
  FileText,
  Check,
  Calendar,
  Sparkles,
  Trash2,
  Link2,
  Info,
  Eye,
  BookOpen,
  Award,
  Clock,
  Bold,
  Italic,
  Heading1,
  Heading2,
  List,
  ChevronLeft,
  CheckCircle,
  AlertTriangle,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Undo,
  Redo,
  Table,
  Code,
  Globe,
  ChevronsLeft,
  Type,
  Quote
} from "lucide-react";

// Jalali Date Picker Helpers
const JALALI_MONTHS = [
  { id: 1, name: "فروردین", days: 31 },
  { id: 2, name: "اردیبهشت", days: 31 },
  { id: 3, name: "خرداد", days: 31 },
  { id: 4, name: "تیر", days: 31 },
  { id: 5, name: "مرداد", days: 31 },
  { id: 6, name: "شهریور", days: 31 },
  { id: 7, name: "مهر", days: 30 },
  { id: 8, name: "آبان", days: 30 },
  { id: 9, name: "آذر", days: 30 },
  { id: 10, name: "دی", days: 30 },
  { id: 11, name: "بهمن", days: 30 },
  { id: 12, name: "اسفند", days: 29 },
];

function getJalaliParts(date: Date) {
  try {
    const parts = new Intl.DateTimeFormat('en-US-u-ca-persian', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric'
    }).formatToParts(date);
    
    const year = parseInt(parts.find(p => p.type === 'year')?.value || '1405', 10);
    const month = parseInt(parts.find(p => p.type === 'month')?.value || '1', 10);
    const day = parseInt(parts.find(p => p.type === 'day')?.value || '1', 10);
    
    return { year, month, day };
  } catch (e) {
    // Fallback if Intl calendar not supported
    return { year: 1405, month: 4, day: 4 };
  }
}

function jalaliToGregorianDate(jy: number, jm: number, jd: number): Date {
  const gy = jy + 621;
  const start = new Date(gy - 1, 10, 1); // Nov 1 of previous year
  for (let i = 0; i < 600; i++) {
    const d = new Date(start.getTime() + i * 24 * 60 * 60 * 1000);
    const parts = getJalaliParts(d);
    if (parts.year === jy && parts.month === jm && parts.day === jd) {
      return d;
    }
  }
  return new Date();
}

interface AdvertorialEditorViewProps {
  order: AdvertorialOrder;
  website: MediaWebsite | undefined;
  onSave: (updatedOrder: AdvertorialOrder) => void;
  onCancel: () => void;
}

export default function AdvertorialEditorView({
  order,
  website,
  onSave,
  onCancel,
}: AdvertorialEditorViewProps) {
  const allowedLinks = website?.allowedLinksCount || 3;

  // Form States
  const [title, setTitle] = useState(order.title || "");
  const [body, setBody] = useState(order.body || "");
  const [scheduledDate, setScheduledDate] = useState(order.scheduledDate || "");
  const [publishImmediate, setPublishImmediate] = useState(!order.scheduledDate);
  const [featuredImage, setFeaturedImage] = useState(order.featuredImage || "");
  const [keywords, setKeywords] = useState<{ text: string; url: string }[]>(order.keywords || []);
  const [wordDocName, setWordDocName] = useState(order.wordDocName || "");

  // Link Form State for adding custom anchors
  const [newKwText, setNewKwText] = useState("");
  const [newKwUrl, setNewKwUrl] = useState("https://");

  // Advanced Editor States
  const [editorMode, setEditorMode] = useState<"visual" | "html">("visual");
  const [showLinkPopover, setShowLinkPopover] = useState(false);
  const [popoverLinkUrl, setPopoverLinkUrl] = useState("https://");
  const [popoverLinkLabel, setPopoverLinkLabel] = useState("");

  const [showTablePopover, setShowTablePopover] = useState(false);
  const [tableRows, setTableRows] = useState(3);
  const [tableCols, setTableCols] = useState(3);

  // In-text image insertion popover states
  const [showImagePopover, setShowImagePopover] = useState(false);
  const [popoverImageUrl, setPopoverImageUrl] = useState("");
  const [popoverImageAlt, setPopoverImageAlt] = useState("");

  // Word Document Import Processing States
  const [isProcessingWord, setIsProcessingWord] = useState(false);
  const [wordProgressStep, setWordProgressStep] = useState(0);

  // Custom modal dialog states
  const [modalAlert, setModalAlert] = useState<{
    title?: string;
    message: string;
    onSuccess?: () => void;
  } | null>(null);

  const [modalConfirm, setModalConfirm] = useState<{
    title?: string;
    message: string;
    onConfirm: () => void;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const editableRef = useRef<HTMLDivElement>(null);

  // Active Tab for Editor column: "write" or "preview"
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write");

  // Selection preservation state
  const [savedRange, setSavedRange] = useState<Range | null>(null);

  // Visual Jalali calendar states
  const initialJalali = getJalaliParts(new Date());
  const [calYear, setCalYear] = useState(initialJalali.year);
  const [calMonth, setCalMonth] = useState(initialJalali.month);

  // Save cursor selection in visual editor
  const saveSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      if (editableRef.current && editableRef.current.contains(range.commonAncestorContainer)) {
        setSavedRange(range);
        const selectedText = range.toString().trim();
        if (selectedText) {
          setPopoverLinkLabel(selectedText);
        }
      }
    }
  };

  // Click handler to preserve selection when opening link popover
  const handleLinkButtonClick = () => {
    saveSelection();
    setShowLinkPopover(!showLinkPopover);
    setShowTablePopover(false);
    setShowImagePopover(false);
  };

  // Synchronize calendar view with inputted dates
  useEffect(() => {
    if (scheduledDate && /^\d{4}\/\d{2}\/\d{2}$/.test(scheduledDate)) {
      const parts = scheduledDate.split("/");
      const y = parseInt(parts[0], 10);
      const m = parseInt(parts[1], 10);
      if (!isNaN(y) && !isNaN(m)) {
        setCalYear(y);
        setCalMonth(m);
      }
    }
  }, [scheduledDate]);

  // Word & Character count calculations
  const wordCount = body ? body.replace(/<[^>]*>/g, " ").trim().split(/\s+/).filter(Boolean).length : 0;
  const charCount = body ? body.replace(/<[^>]*>/g, "").length : 0;
  const estimatedReadingTime = Math.max(1, Math.ceil(wordCount / 200));

  // Auto-calculated SEO Score based on real content
  const [seoScore, setSeoScore] = useState(30);

  // Synchronize body state with ContentEditable innerHTML
  useEffect(() => {
    if (editorMode === "visual" && editableRef.current) {
      if (editableRef.current.innerHTML !== body) {
        editableRef.current.innerHTML = body || "<p><br></p>";
      }
    }
  }, [editorMode, activeTab, body]);

  // Keep body synchronized when editing in visual contentEditable
  const handleVisualChange = () => {
    if (editableRef.current) {
      setBody(editableRef.current.innerHTML);
    }
  };

  useEffect(() => {
    let score = 20;
    if (title.length > 15) score += 15;
    if (title.length >= 30 && title.length <= 70) score += 5; // ideal length
    if (wordCount > 300) score += 20;
    if (wordCount > 600) score += 10;
    if (body.includes("<h2>") || body.includes("<h3>") || body.includes("<strong>")) score += 15;
    if (featuredImage) score += 15;
    if (keywords.length > 0) score += 15;
    
    setSeoScore(Math.min(100, score));
  }, [title, body, featuredImage, keywords, wordCount]);

  // Command execution helper for ContentEditable
  const executeCommand = (command: string, value: string = "") => {
    if (editorMode !== "visual") return;
    document.execCommand(command, false, value);
    editableRef.current?.focus();
    handleVisualChange();
  };

  // Helper to insert HTML safely at the current cursor position (or append if lost focus)
  const insertHTMLAtCursor = (html: string) => {
    if (editorMode === "visual" && editableRef.current) {
      editableRef.current.focus();
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.deleteContents();
        
        const el = document.createElement("div");
        el.innerHTML = html;
        const frag = document.createDocumentFragment();
        let node;
        let lastNode;
        while ((node = el.firstChild)) {
          lastNode = frag.appendChild(node);
        }
        range.insertNode(frag);
        
        if (lastNode) {
          range.setStartAfter(lastNode);
          range.collapse(true);
          selection.removeAllRanges();
          selection.addRange(range);
        }
      } else {
        editableRef.current.innerHTML += html;
      }
      handleVisualChange();
    } else {
      // HTML Textarea Mode - insert raw HTML string at textarea caret
      const textarea = document.getElementById("editor-textarea") as HTMLTextAreaElement;
      if (textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;
        const newBody = text.substring(0, start) + html + text.substring(end);
        setBody(newBody);
      }
    }
  };

  // Handle Keyword Link Addition
  const handleAddKeyword = () => {
    const kwText = newKwText.trim();
    const kwUrl = newKwUrl.trim();

    if (!kwText) {
      setModalAlert({
        title: "خطای کلمه کلیدی",
        message: "لطفاً عبارت کلمه کلیدی را بنویسید."
      });
      return;
    }

    if (!kwUrl || kwUrl === "https://" || kwUrl === "http://") {
      setModalAlert({
        title: "خطای آدرس اینترنتی",
        message: "لطفاً آدرس معتبر اینترنتی را بنویسید."
      });
      return;
    }

    if (keywords.length >= allowedLinks) {
      setModalAlert({
        title: "محدودیت تعداد لینک",
        message: `تعداد لینک‌های فالو مجاز برای این وب‌سایت حداکثر ${allowedLinks} عدد است.`
      });
      return;
    }

    setKeywords([...keywords, { text: kwText, url: kwUrl }]);
    setNewKwText("");
    setNewKwUrl("https://");
  };

  const handleRemoveKeyword = (index: number) => {
    setKeywords(keywords.filter((_, idx) => idx !== index));
  };

  // Handle fast insertion of Approved Link
  const handleInsertApprovedKeyword = (kw: { text: string; url: string }) => {
    const linkHtml = `<a href="${kw.url}" class="text-blue-600 underline font-extrabold hover:text-blue-800" target="_blank" rel="noopener noreferrer">${kw.text}</a>`;
    insertHTMLAtCursor(linkHtml);
  };

  // Custom Inline Link Handler
  const handleInsertCustomLink = (url: string, label: string) => {
    const cleanUrl = url.trim();
    const cleanLabel = label.trim() || cleanUrl;
    if (!cleanUrl || cleanUrl === "https://") {
      setModalAlert({
        title: "آدرس نامعتبر",
        message: "لطفاً آدرس معتبر وارد کنید."
      });
      return;
    }

    if (editorMode === "visual" && editableRef.current) {
      editableRef.current.focus();
      
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        if (savedRange) {
          selection.addRange(savedRange);
        }
      }

      let hasSelection = false;
      if (savedRange && !savedRange.collapsed) {
        hasSelection = true;
      }

      if (hasSelection && savedRange) {
        if (cleanLabel !== savedRange.toString().trim()) {
          // Label changed, replace contents
          savedRange.deleteContents();
          const el = document.createElement("div");
          el.innerHTML = `<a href="${cleanUrl}" class="text-blue-600 underline font-extrabold hover:text-blue-800" target="_blank" rel="noopener noreferrer">${cleanLabel}</a>`;
          const frag = document.createDocumentFragment();
          let node;
          while ((node = el.firstChild)) {
            frag.appendChild(node);
          }
          savedRange.insertNode(frag);
        } else {
          // Label is the same, just wrap selection
          document.execCommand("createLink", false, cleanUrl);
        }
      } else {
        // No selection, insert new link
        const linkHtml = `<a href="${cleanUrl}" class="text-blue-600 underline font-extrabold hover:text-blue-800" target="_blank" rel="noopener noreferrer">${cleanLabel}</a>`;
        if (savedRange) {
          savedRange.deleteContents();
          const el = document.createElement("div");
          el.innerHTML = linkHtml;
          const frag = document.createDocumentFragment();
          let node;
          while ((node = el.firstChild)) {
            frag.appendChild(node);
          }
          savedRange.insertNode(frag);
        } else {
          editableRef.current.innerHTML += linkHtml;
        }
      }
      handleVisualChange();
    } else {
      // HTML Textarea Mode
      const textarea = document.getElementById("editor-textarea") as HTMLTextAreaElement;
      if (textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;
        const linkHtml = `<a href="${cleanUrl}" target="_blank" rel="noopener noreferrer">${cleanLabel}</a>`;
        const newBody = text.substring(0, start) + linkHtml + text.substring(end);
        setBody(newBody);
      }
    }

    setShowLinkPopover(false);
    setPopoverLinkUrl("https://");
    setPopoverLinkLabel("");
    setSavedRange(null);
  };

  // Custom Table Handler
  const handleInsertTable = (rows: number, cols: number) => {
    let tableHtml = `<table class="w-full border-collapse border border-slate-200 my-4 text-xs">`;
    tableHtml += `<thead><tr class="bg-slate-50">`;
    for (let c = 0; c < cols; c++) {
      tableHtml += `<th class="border border-slate-200 p-2 text-right">عنوان ستون ${c + 1}</th>`;
    }
    tableHtml += `</tr></thead><tbody>`;
    for (let r = 0; r < rows; r++) {
      tableHtml += `<tr>`;
      for (let c = 0; c < cols; c++) {
        tableHtml += `<td class="border border-slate-200 p-2">سلول ${r + 1}-${c + 1}</td>`;
      }
      tableHtml += `</tr>`;
    }
    tableHtml += `</tbody></table>`;
    insertHTMLAtCursor(tableHtml);
    setShowTablePopover(false);
  };

  // Custom In-Text Image Handler
  const handleInsertImage = (url: string, alt: string) => {
    if (!url.trim()) {
      setModalAlert({
        message: "لطفاً آدرس معتبر تصویر را وارد کنید."
      });
      return;
    }

    const cleanUrl = url.trim();
    const cleanAlt = alt.trim() || "تصویر رپورتاژ";
    const imgHtml = `<img src="${cleanUrl}" alt="${cleanAlt}" class="max-w-full h-auto rounded-xl my-4 mx-auto block border border-slate-200" />`;

    if (editorMode === "visual") {
      insertHTMLAtCursor(imgHtml);
    } else {
      // HTML Textarea Mode
      const textarea = document.getElementById("editor-textarea") as HTMLTextAreaElement;
      if (textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;
        const newBody = text.substring(0, start) + imgHtml + text.substring(end);
        setBody(newBody);
      }
    }

    setShowImagePopover(false);
    setPopoverImageUrl("");
    setPopoverImageAlt("");
  };

  // Real DOCX Upload & Parse using Mammoth
  const handleWordUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setWordDocName(file.name);
    setIsProcessingWord(true);
    setWordProgressStep(1);

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const arrayBuffer = event.target?.result as ArrayBuffer;
        if (!arrayBuffer) {
          throw new Error("خطا در خواندن داده‌های فایل.");
        }

        // Real conversion to HTML
        const result = await mammoth.convertToHtml({ arrayBuffer });
        let htmlResult = result.value;

        if (!htmlResult || htmlResult.trim() === "") {
          throw new Error("سند فایل ورد انتخابی خالی است یا متن معتبری ندارد.");
        }

        // Extract title from the first heading element (h1, h2, h3) if present
        let extractedTitle = "";
        const headingMatch = htmlResult.match(/<h[1-3]>(.*?)<\/h[1-3]>/i);
        if (headingMatch && headingMatch[1]) {
          extractedTitle = headingMatch[1].replace(/<[^>]+>/g, "").trim();
          // Remove this heading from the body to prevent duplication
          htmlResult = htmlResult.replace(headingMatch[0], "");
        } else {
          // If no heading, check if the first paragraph is short and can be a title
          const paragraphMatch = htmlResult.match(/<p>(.*?)<\/p>/i);
          if (paragraphMatch && paragraphMatch[1]) {
            const tempTitle = paragraphMatch[1].replace(/<[^>]+>/g, "").trim();
            if (tempTitle.length > 0 && tempTitle.length < 150) {
              extractedTitle = tempTitle;
              htmlResult = htmlResult.replace(paragraphMatch[0], "");
            }
          }
        }

        // If no title found, use file name without extension
        if (!extractedTitle) {
          extractedTitle = file.name.replace(/\.[^/.]+$/, "");
        }

        // Clean initial empty paragraphs
        htmlResult = htmlResult.replace(/^(<p><br><\/p>|<p><\/p>|\s)+/gi, "");

        // Smart links/anchor tags extraction to populate keyword settings
        const foundKeywords: { text: string; url: string }[] = [];
        const linkRegex = /<a\s+(?:[^>]*?\s+)?href="([^"]*)"[^>]*>(.*?)<\/a>/gi;
        let linkMatch;
        while ((linkMatch = linkRegex.exec(htmlResult)) !== null) {
          const url = linkMatch[1];
          const text = linkMatch[2].replace(/<[^>]+>/g, "").trim();
          if (url && text && !foundKeywords.some((k) => k.text === text)) {
            foundKeywords.push({ text, url });
          }
        }

        // Animate progress smoothly for visual satisfaction
        setWordProgressStep(2);
        await new Promise((res) => setTimeout(res, 400));
        setWordProgressStep(3);
        await new Promise((res) => setTimeout(res, 400));
        setWordProgressStep(4);
        await new Promise((res) => setTimeout(res, 400));

        // Update state
        setTitle(extractedTitle);
        setBody(htmlResult);

        if (editorMode === "visual" && editableRef.current) {
          editableRef.current.innerHTML = htmlResult;
        }

        if (keywords.length === 0 && foundKeywords.length > 0) {
          setKeywords(foundKeywords.slice(0, allowedLinks));
        }

        setIsProcessingWord(false);
        setWordProgressStep(0);
      } catch (err: any) {
        console.error("Error processing DOCX file:", err);
        alert(err.message || "متأسفانه خطایی در خواندن یا پردازش فایل ورد رخ داد. لطفاً فرمت فایل را بررسی و مجدداً تلاش کنید.");
        setIsProcessingWord(false);
        setWordProgressStep(0);
      }
    };

    reader.onerror = () => {
      alert("خطا در بارگذاری فایل از روی حافظه دستگاه.");
      setIsProcessingWord(false);
      setWordProgressStep(0);
    };

    reader.readAsArrayBuffer(file);
  };

  // Preset stock images for Featured Image
  const presetImages = [
    { name: "تکنولوژی", url: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=60" },
    { name: "کسب و کار", url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=60" },
    { name: "لایف استایل", url: "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?w=600&auto=format&fit=crop&q=60" },
    { name: "آموزشی", url: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=600&auto=format&fit=crop&q=60" },
  ];

  const handleSelectPresetImage = (url: string) => {
    setFeaturedImage(url);
  };

  // File Selector for Featured Image
  const handleFeaturedImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setFeaturedImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // Submit to Publisher Action after user confirms
  const executeSubmitToPublisher = () => {
    const updatedOrder: AdvertorialOrder = {
      ...order,
      title: title.trim(),
      body: body.trim(),
      keywords: keywords,
      status: "pending", // Status becomes pending to be accepted by publisher!
      featuredImage: featuredImage,
      scheduledDate: publishImmediate ? undefined : scheduledDate,
      wordDocName: wordDocName || undefined,
    };

    setModalAlert({
      title: "ارسال نهایی رپورتاژ",
      message: "رپورتاژ آگهی شما با موفقیت ثبت و برای ناشر ارسال شد. هم‌اکنون در وضعیت «در انتظار انتشار» قرار گرفت.",
      onSuccess: () => {
        onSave(updatedOrder);
      }
    });
  };

  // Submit to Publisher
  const handleSubmitToPublisher = () => {
    if (!title.trim()) {
      setModalAlert({
        title: "خطای اعتبارسنجی",
        message: "لطفاً عنوان رپورتاژ را وارد کنید."
      });
      return;
    }
    if (!body.trim() || body.trim() === "<p><br></p>") {
      setModalAlert({
        title: "خطای اعتبارسنجی",
        message: "متن رپورتاژ شما نمی‌تواند خالی باشد."
      });
      return;
    }

    if (!publishImmediate && !scheduledDate) {
      setModalAlert({
        title: "خطای اعتبارسنجی",
        message: "لطفاً تاریخ انتشار را مشخص کنید یا گزینه انتشار فوری را تیک بزنید."
      });
      return;
    }

    if (wordCount < 150) {
      setModalConfirm({
        title: "تعداد کلمات کم",
        message: "تعداد کلمات رپورتاژ شما کمتر از ۱۵۰ کلمه است. رسانه‌ها معمولاً رپورتاژهای بسیار کوتاه را رد می‌کنند. آیا تمایل به ثبت نهایی دارید؟",
        onConfirm: executeSubmitToPublisher,
      });
    } else {
      setModalConfirm({
        title: "ارسال نهایی برای ناشر",
        message: "آیا از ارسال نهایی رپورتاژ آگهی برای ناشر مطمئن هستید؟ پس از ارسال، متن قفل شده و ناشر شروع به کار می‌کند.",
        onConfirm: executeSubmitToPublisher,
      });
    }
  };

  // Save Draft locally
  const handleSaveDraftOnly = () => {
    const updatedOrder: AdvertorialOrder = {
      ...order,
      title: title.trim(),
      body: body.trim(),
      keywords: keywords,
      status: "draft",
      featuredImage: featuredImage,
      scheduledDate: publishImmediate ? undefined : scheduledDate,
      wordDocName: wordDocName || undefined,
    };

    setModalAlert({
      title: "ذخیره پیش‌نویس",
      message: "پیش‌نویس رپورتاژ با موفقیت ذخیره شد.",
      onSuccess: () => {
        onSave(updatedOrder);
      }
    });
  };

  return (
    <div className="space-y-6 text-right animate-fade-in pb-16 relative" dir="rtl">
      
      {/* Dynamic style sheet for editor rendering alignment and elements block precisely like CKEditor */}
      <style>{`
        .ck-editor-content h2, .preview-content h2 {
          font-size: 1.35rem;
          font-weight: 900;
          color: #0f172a;
          margin-top: 1.75rem;
          margin-bottom: 0.75rem;
          line-height: 1.4;
          border-bottom: 1px solid #f1f5f9;
          padding-bottom: 0.35rem;
        }
        .ck-editor-content h3, .preview-content h3 {
          font-size: 1.15rem;
          font-weight: 800;
          color: #1e293b;
          margin-top: 1.5rem;
          margin-bottom: 0.5rem;
          line-height: 1.4;
        }
        .ck-editor-content p, .preview-content p {
          font-size: 0.875rem;
          line-height: 1.8;
          color: #334155;
          margin-bottom: 1rem;
        }
        .ck-editor-content ul, .preview-content ul {
          list-style-type: disc !important;
          padding-right: 1.5rem !important;
          margin-bottom: 1rem !important;
          font-size: 0.875rem;
        }
        .ck-editor-content ol, .preview-content ol {
          list-style-type: decimal !important;
          padding-right: 1.5rem !important;
          margin-bottom: 1rem !important;
          font-size: 0.875rem;
        }
        .ck-editor-content blockquote, .preview-content blockquote {
          border-right: 4px solid #3b82f6 !important;
          background-color: #f8fafc !important;
          padding: 0.75rem 1.25rem !important;
          margin: 1.25rem 0 !important;
          font-style: italic !important;
          color: #475569 !important;
          border-radius: 0 6px 6px 0 !important;
        }
        .ck-editor-content table, .preview-content table {
          width: 100% !important;
          border-collapse: collapse !important;
          margin: 1.5rem 0 !important;
          font-size: 0.8rem !important;
        }
        .ck-editor-content th, .preview-content th {
          background-color: #f1f5f9 !important;
          border: 1px solid #cbd5e1 !important;
          padding: 0.5rem 0.75rem !important;
          font-weight: 800 !important;
          color: #1e293b !important;
          text-align: right !important;
        }
        .ck-editor-content td, .preview-content td {
          border: 1px solid #cbd5e1 !important;
          padding: 0.5rem 0.75rem !important;
          color: #334155 !important;
          text-align: right !important;
        }
        .ck-editor-content a, .preview-content a {
          color: #2563eb !important;
          text-decoration: underline !important;
          font-weight: 800 !important;
        }
        .ck-editor-content a:hover, .preview-content a:hover {
          color: #1d4ed8 !important;
        }
        .ck-editor-content img, .preview-content img {
          max-width: 100% !important;
          height: auto !important;
          border-radius: 12px;
          margin: 1.5rem auto !important;
          display: block;
          border: 1px solid #e2e8f0;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }
      `}</style>
      
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <button
              onClick={onCancel}
              className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
              title="بازگشت"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
            <h2 className="text-base font-black text-slate-800">میز تحریر و انتشار رپورتاژ آگهی</h2>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold pr-7">
            <span>رسانه مقصد:</span>
            <span className="text-slate-700 font-extrabold">{order.websiteName}</span>
            <span className="text-slate-300 font-light">|</span>
            <span className="font-mono text-slate-500" dir="ltr">{order.websiteDomain}</span>
            <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md text-[9px] font-bold">
              DA: {website?.domainAuthority || 35}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mr-auto sm:mr-0 text-xs font-bold">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl transition-all cursor-pointer"
          >
            انصراف و خروج
          </button>
          <button
            onClick={handleSaveDraftOnly}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl transition-all cursor-pointer"
          >
            ذخیره پیش‌نویس
          </button>
          <button
            onClick={handleSubmitToPublisher}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all font-black shadow-md shadow-blue-600/10 flex items-center gap-1 cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>تایید و ارسال نهایی رپورتاژ</span>
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Right Columns: Editor Column */}
        <div className="lg:col-span-2 space-y-6 relative z-20">
          
          {/* Main card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs relative">
            
            {/* View Tabs */}
            <div className="border-b border-slate-100 bg-slate-50/50 p-4 flex justify-between items-center rounded-t-2xl">
              <div className="flex gap-1">
                <button
                  onClick={() => setActiveTab("write")}
                  className={`px-4 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                    activeTab === "write"
                      ? "bg-white text-blue-700 shadow-2xs border border-slate-200/50"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  ویرایش و تحریر محتوا
                </button>
                <button
                  onClick={() => setActiveTab("preview")}
                  className={`px-4 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                    activeTab === "preview"
                      ? "bg-white text-blue-700 shadow-2xs border border-slate-200/50"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <span className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" />
                    <span>پیش‌نمایش زنده</span>
                  </span>
                </button>
              </div>

              {/* Word upload trigger */}
              <div className="relative">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleWordUpload}
                  accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isProcessingWord}
                  className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 hover:text-emerald-800 px-3 py-1.5 rounded-xl border border-emerald-200/50 text-[10px] font-black flex items-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{wordDocName ? `تغییر فایل: ${wordDocName}` : "بارگزاری از فایل ورد (Word)"}</span>
                </button>
              </div>
            </div>

            {/* Word parsing progress */}
            {isProcessingWord && (
              <div className="bg-slate-50 p-5 border-b border-slate-100 text-center space-y-3 animate-pulse">
                <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                  <FileText className="w-5 h-5 animate-bounce" />
                </div>
                <div className="space-y-1 max-w-xs mx-auto">
                  <p className="text-xs font-black text-slate-700">درحال بازخوانی فایل ورد (Word)...</p>
                  <p className="text-[10px] text-slate-400 font-semibold">
                    {wordProgressStep === 1 && "آپلود فایل و تجزیه ساختار سند..."}
                    {wordProgressStep === 2 && "استخراج تصاویر شاخص و پاراگراف‌ها..."}
                    {wordProgressStep === 3 && "بهینه‌سازی تگ‌های HTML و لینک‌ها..."}
                    {wordProgressStep === 4 && "انتقال خودکار متون به ادیتور..."}
                  </p>
                </div>
                <div className="w-48 h-1 bg-slate-200 rounded-full mx-auto overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 transition-all duration-500"
                    style={{ width: `${wordProgressStep * 25}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Write Tab */}
            <div className={`p-6 space-y-6 ${activeTab === "write" ? "" : "hidden"}`}>
                
                {/* Title Input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-700 block">عنوان اصلی رپورتاژ آگهی:</label>
                  <input
                    type="text"
                    placeholder="یک عنوان جذاب و بهینه شده سئو بنویسید (مثلاً: ۷ راز موفقیت در بازاریابی محتوایی)"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2.5 text-xs font-bold border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/10 placeholder-slate-400 text-slate-800 bg-slate-50/20"
                  />
                  <div className="flex justify-between items-center text-[10px] text-slate-400 font-semibold px-1">
                    <span>پیشنهاد: بین ۳۰ تا ۷۰ کاراکتر برای نمایش مطلوب در گوگل.</span>
                    <span className={title.length >= 30 && title.length <= 70 ? "text-emerald-600 font-extrabold" : "text-slate-400"}>
                      {title.length} کاراکتر
                    </span>
                  </div>
                </div>

                {/* Highly Professional WYSIWYG / HTML CKEditor-like Area */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-black text-slate-700 block">پیکره محتوا و متن رپورتاژ:</label>
                    
                    {/* Mode Toggle (Visual vs Source Code) */}
                    <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-[10px] font-extrabold">
                      <button
                        type="button"
                        onClick={() => setEditorMode("visual")}
                        className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                          editorMode === "visual" ? "bg-white text-blue-700 shadow-3xs" : "text-slate-500"
                        }`}
                      >
                        نمای بصری (WYSIWYG)
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditorMode("html")}
                        className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                          editorMode === "html" ? "bg-white text-blue-700 shadow-3xs" : "text-slate-500"
                        }`}
                      >
                        کد منبع (HTML)
                      </button>
                    </div>
                  </div>

                  {/* CKEditor professional container */}
                  <div className="border border-slate-200 rounded-2xl overflow-visible bg-white shadow-2xs relative">
                    
                    {/* Pro Rich Toolbar (Only shown or partially active) */}
                    <div className="p-2 border-b border-slate-100 bg-slate-50/60 flex flex-wrap gap-1 items-center relative overflow-visible rounded-t-2xl">
                      {/* Undo / Redo */}
                      <button
                        type="button"
                        onClick={() => executeCommand("undo")}
                        disabled={editorMode !== "visual"}
                        className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-white rounded-lg transition-all disabled:opacity-40"
                        title="لغو عمل اخیر (Undo)"
                      >
                        <Undo className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => executeCommand("redo")}
                        disabled={editorMode !== "visual"}
                        className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-white rounded-lg transition-all disabled:opacity-40"
                        title="انجام مجدد (Redo)"
                      >
                        <Redo className="w-3.5 h-3.5" />
                      </button>

                      <span className="w-px h-4 bg-slate-200 mx-1"></span>

                      {/* Headings */}
                      <button
                        type="button"
                        onClick={() => executeCommand("formatBlock", "H2")}
                        disabled={editorMode !== "visual"}
                        className="px-2 py-1 text-[10px] font-black text-slate-600 hover:text-slate-900 hover:bg-white border border-slate-200/50 rounded-lg transition-all disabled:opacity-40"
                        title="عنوان بزرگ (H2)"
                      >
                        H2
                      </button>
                      <button
                        type="button"
                        onClick={() => executeCommand("formatBlock", "H3")}
                        disabled={editorMode !== "visual"}
                        className="px-2 py-1 text-[10px] font-black text-slate-600 hover:text-slate-900 hover:bg-white border border-slate-200/50 rounded-lg transition-all disabled:opacity-40"
                        title="عنوان فرعی (H3)"
                      >
                        H3
                      </button>
                      <button
                        type="button"
                        onClick={() => executeCommand("formatBlock", "P")}
                        disabled={editorMode !== "visual"}
                        className="px-2 py-1 text-[10px] font-extrabold text-slate-600 hover:text-slate-900 hover:bg-white border border-slate-200/50 rounded-lg transition-all disabled:opacity-40"
                        title="متن معمولی (Paragraph)"
                      >
                        پاراگراف
                      </button>

                      <span className="w-px h-4 bg-slate-200 mx-1"></span>

                      {/* Bold / Italic / Underline / Strike */}
                      <button
                        type="button"
                        onClick={() => executeCommand("bold")}
                        disabled={editorMode !== "visual"}
                        className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-white rounded-lg transition-all font-semibold disabled:opacity-40"
                        title="ضخیم (Bold)"
                      >
                        <Bold className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => executeCommand("italic")}
                        disabled={editorMode !== "visual"}
                        className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-white rounded-lg transition-all disabled:opacity-40"
                        title="کج (Italic)"
                      >
                        <Italic className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => executeCommand("underline")}
                        disabled={editorMode !== "visual"}
                        className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-white rounded-lg transition-all disabled:opacity-40"
                        title="زیرخط دار (Underline)"
                      >
                        <Underline className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => executeCommand("strikeThrough")}
                        disabled={editorMode !== "visual"}
                        className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-white rounded-lg transition-all disabled:opacity-40 text-xs font-semibold"
                        title="خط خورده (Strikethrough)"
                      >
                        S
                      </button>

                      <span className="w-px h-4 bg-slate-200 mx-1"></span>

                      {/* Alignments */}
                      <button
                        type="button"
                        onClick={() => executeCommand("justifyRight")}
                        disabled={editorMode !== "visual"}
                        className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-white rounded-lg transition-all disabled:opacity-40"
                        title="راست‌چین"
                      >
                        <AlignRight className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => executeCommand("justifyCenter")}
                        disabled={editorMode !== "visual"}
                        className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-white rounded-lg transition-all disabled:opacity-40"
                        title="وسط‌چین"
                      >
                        <AlignCenter className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => executeCommand("justifyLeft")}
                        disabled={editorMode !== "visual"}
                        className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-white rounded-lg transition-all disabled:opacity-40"
                        title="چپ‌چین"
                      >
                        <AlignLeft className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => executeCommand("justifyFull")}
                        disabled={editorMode !== "visual"}
                        className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-white rounded-lg transition-all disabled:opacity-40"
                        title="تراز کامل (Justify)"
                      >
                        <AlignJustify className="w-3.5 h-3.5" />
                      </button>

                      <span className="w-px h-4 bg-slate-200 mx-1"></span>

                      {/* Lists */}
                      <button
                        type="button"
                        onClick={() => executeCommand("insertUnorderedList")}
                        disabled={editorMode !== "visual"}
                        className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-white rounded-lg transition-all disabled:opacity-40"
                        title="لیست نشانه‌دار (Bullet List)"
                      >
                        <List className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => executeCommand("insertOrderedList")}
                        disabled={editorMode !== "visual"}
                        className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-white rounded-lg transition-all disabled:opacity-40 text-xs font-bold"
                        title="لیست عددی (Numbered List)"
                      >
                        1.
                      </button>

                      <span className="w-px h-4 bg-slate-200 mx-1"></span>

                      {/* Blockquote */}
                      <button
                        type="button"
                        onClick={() => executeCommand("formatBlock", "blockquote")}
                        disabled={editorMode !== "visual"}
                        className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-white rounded-lg transition-all disabled:opacity-40"
                        title="درج نقل قول (Quote Block)"
                      >
                        <Quote className="w-3.5 h-3.5" />
                      </button>

                      {/* Insert Table */}
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => {
                            setShowTablePopover(!showTablePopover);
                            setShowLinkPopover(false);
                            setShowImagePopover(false);
                          }}
                          className={`p-1.5 hover:bg-white rounded-lg transition-all ${
                            showTablePopover ? "bg-white text-blue-600 border border-slate-200/60" : "text-slate-500"
                          }`}
                          title="درج جدول داده"
                        >
                          <Table className="w-3.5 h-3.5" />
                        </button>

                        {/* Table insertion popover */}
                        {showTablePopover && (
                          <div className="absolute top-10 left-0 z-50 bg-white p-4 rounded-xl border border-slate-200 shadow-xl w-48 space-y-3 text-right">
                            <h5 className="text-[10px] font-black text-slate-800 border-b border-slate-100 pb-1.5">درج جدول</h5>
                            <div className="grid grid-cols-2 gap-2 text-[10px] font-bold">
                              <div className="space-y-1">
                                <label className="text-slate-500 block">سطرها:</label>
                                <input
                                  type="number"
                                  min="1"
                                  max="10"
                                  value={tableRows}
                                  onChange={(e) => setTableRows(Math.max(1, parseInt(e.target.value) || 1))}
                                  className="w-full px-2 py-1 border border-slate-200 rounded-lg text-center"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-slate-500 block">ستون‌ها:</label>
                                <input
                                  type="number"
                                  min="1"
                                  max="10"
                                  value={tableCols}
                                  onChange={(e) => setTableCols(Math.max(1, parseInt(e.target.value) || 1))}
                                  className="w-full px-2 py-1 border border-slate-200 rounded-lg text-center"
                                />
                              </div>
                            </div>
                            <div className="flex gap-2 pt-1 text-[9px]">
                              <button
                                type="button"
                                onClick={() => handleInsertTable(tableRows, tableCols)}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-black py-1 rounded-lg w-1/2 cursor-pointer"
                              >
                                تایید
                              </button>
                              <button
                                type="button"
                                onClick={() => setShowTablePopover(false)}
                                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-1 rounded-lg w-1/2 cursor-pointer"
                              >
                                لغو
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Insert Image In-Text Button & Popover */}
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => {
                            setShowImagePopover(!showImagePopover);
                            setShowTablePopover(false);
                            setShowLinkPopover(false);
                          }}
                          className={`p-1.5 hover:bg-white rounded-lg transition-all ${
                            showImagePopover ? "bg-white text-blue-600 border border-slate-200/60" : "text-slate-500"
                          }`}
                          title="درج تصویر درون متن"
                        >
                          <ImageIcon className="w-3.5 h-3.5" />
                        </button>

                        {/* Image insertion popover */}
                        {showImagePopover && (
                          <div className="absolute top-10 left-0 z-50 bg-white p-4 rounded-xl border border-slate-200 shadow-xl w-72 space-y-3.5 text-right">
                            <h5 className="text-[10px] font-black text-slate-800 border-b border-slate-100 pb-1.5 flex items-center gap-1">
                              <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
                              <span>درج تصویر بین متون رپورتاژ</span>
                            </h5>
                            
                            <div className="space-y-1.5 text-[10px] font-bold">
                              <label className="text-slate-500 block">آدرس اینترنتی تصویر:</label>
                              <input
                                type="text"
                                placeholder="https://example.com/image.jpg"
                                value={popoverImageUrl}
                                onChange={(e) => setPopoverImageUrl(e.target.value)}
                                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-[10px] text-left font-mono"
                                dir="ltr"
                              />
                            </div>

                            <div className="space-y-1.5 text-[10px] font-bold">
                              <label className="text-slate-500 block">توضیح تصویر (Alt):</label>
                              <input
                                type="text"
                                placeholder="مثلا: معرفی نرم‌افزار جدید"
                                value={popoverImageAlt}
                                onChange={(e) => setPopoverImageAlt(e.target.value)}
                                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-[10px]"
                              />
                            </div>

                            {/* Presets Gallery */}
                            <div className="space-y-1.5">
                              <span className="text-[9px] font-black text-slate-400 block">انتخاب سریع از گالری نمونه‌ها:</span>
                              <div className="grid grid-cols-3 gap-1.5">
                                {[
                                  { label: "هوش مصنوعی", url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80" },
                                  { label: "کسب‌وکار", url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80" },
                                  { label: "تکنولوژی", url: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80" },
                                  { label: "مالی و آمار", url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80" },
                                  { label: "پزشکی", url: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=800&q=80" },
                                  { label: "آموزش", url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80" }
                                ].map((preset, index) => (
                                  <button
                                    key={index}
                                    type="button"
                                    onClick={() => {
                                      setPopoverImageUrl(preset.url);
                                      if (!popoverImageAlt) setPopoverImageAlt(preset.label);
                                    }}
                                    className={`group relative aspect-video rounded-lg overflow-hidden border transition-all cursor-pointer ${
                                      popoverImageUrl === preset.url ? "border-blue-600 ring-2 ring-blue-100" : "border-slate-200 hover:border-slate-400"
                                    }`}
                                    title={preset.label}
                                  >
                                    <img
                                      src={preset.url}
                                      alt={preset.label}
                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                      referrerPolicy="no-referrer"
                                    />
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                      <span className="text-[7.5px] font-black text-white px-1 text-center truncate">{preset.label}</span>
                                    </div>
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div className="flex gap-2 pt-1 text-[9px]">
                              <button
                                type="button"
                                onClick={() => handleInsertImage(popoverImageUrl, popoverImageAlt)}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-black py-1.5 rounded-lg w-1/2 cursor-pointer shadow-xs"
                              >
                                درج در متن
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setShowImagePopover(false);
                                  setPopoverImageUrl("");
                                  setPopoverImageAlt("");
                                }}
                                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-1.5 rounded-lg w-1/2 cursor-pointer"
                              >
                                لغو
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Custom Link Button */}
                      <div className="relative">
                        <button
                          type="button"
                          onClick={handleLinkButtonClick}
                          className={`p-1.5 hover:bg-white rounded-lg transition-all ${
                            showLinkPopover ? "bg-white text-blue-600 border border-slate-200/60" : "text-slate-500"
                          }`}
                          title="درج لینک دلخواه"
                        >
                          <Link2 className="w-3.5 h-3.5" />
                        </button>

                        {/* Inline Link dialog */}
                        {showLinkPopover && (
                          <div className="absolute top-10 left-0 z-50 bg-white p-4 rounded-xl border border-slate-200 shadow-xl w-64 space-y-3 text-right">
                            <h5 className="text-[10px] font-black text-slate-800 border-b border-slate-100 pb-1.5">درج لینک در متن</h5>
                            <div className="space-y-1.5 text-[10px] font-bold">
                              <label className="text-slate-500 block">متن پیوند:</label>
                              <input
                                type="text"
                                placeholder="کلمه کلیدی یا عبارت پیوند"
                                value={popoverLinkLabel}
                                onChange={(e) => setPopoverLinkLabel(e.target.value)}
                                className="w-full px-2.5 py-1 border border-slate-200 rounded-lg text-[10px]"
                              />
                            </div>
                            <div className="space-y-1.5 text-[10px] font-bold">
                              <label className="text-slate-500 block">آدرس اینترنتی:</label>
                              <input
                                type="text"
                                placeholder="https://example.com"
                                value={popoverLinkUrl}
                                onChange={(e) => setPopoverLinkUrl(e.target.value)}
                                className="w-full px-2.5 py-1 border border-slate-200 rounded-lg text-[10px] text-left font-mono"
                                dir="ltr"
                              />
                            </div>
                            <div className="flex gap-2 pt-1 text-[9px]">
                              <button
                                type="button"
                                onClick={() => handleInsertCustomLink(popoverLinkUrl, popoverLinkLabel)}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-black py-1.5 rounded-lg w-1/2 cursor-pointer"
                              >
                                تایید لینک
                              </button>
                              <button
                                type="button"
                                onClick={() => setShowLinkPopover(false)}
                                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-1.5 rounded-lg w-1/2 cursor-pointer"
                              >
                                لغو
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Remove Link / Clear Formatting */}
                      <button
                        type="button"
                        onClick={() => executeCommand("unlink")}
                        disabled={editorMode !== "visual"}
                        className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-white rounded-lg transition-all disabled:opacity-40"
                        title="حذف لینک انتخاب شده"
                      >
                        حذف لینک
                      </button>
                      <button
                        type="button"
                        onClick={() => executeCommand("removeFormat")}
                        disabled={editorMode !== "visual"}
                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-white rounded-lg transition-all disabled:opacity-40"
                        title="پاک کردن فرمت‌بندی"
                      >
                        پاک‌کردن فرمت
                      </button>

                      {/* Live text counter */}
                      <span className="mr-auto text-[9px] text-slate-400 font-extrabold font-mono pl-1">
                        {wordCount} کلمه | {charCount} کاراکتر
                      </span>
                    </div>

                    {/* Quick Approved Links injection area */}
                    {keywords.length > 0 && (
                      <div className="bg-blue-50/40 p-2.5 border-b border-slate-100 flex flex-wrap gap-2 items-center text-[10px] font-bold">
                        <span className="text-slate-500">درج سریع لینک‌های مصوب:</span>
                        {keywords.map((kw, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleInsertApprovedKeyword(kw)}
                            className="bg-white hover:bg-blue-50 text-blue-700 border border-blue-200/60 px-2 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer shrink-0 shadow-3xs"
                            title={`درج کلمه کلیدی "${kw.text}" در محل مکان‌نما`}
                          >
                            <span>+ {kw.text}</span>
                            <span className="text-[8px] text-slate-400 font-mono" dir="ltr">({kw.url})</span>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Actual Input Canvas */}
                    {editorMode === "visual" ? (
                      <div
                        ref={editableRef}
                        contentEditable={true}
                        onInput={handleVisualChange}
                        onBlur={handleVisualChange}
                        onMouseUp={saveSelection}
                        onKeyUp={saveSelection}
                        className="ck-editor-content w-full p-6 text-slate-700 leading-relaxed min-h-[350px] max-h-[500px] overflow-y-auto focus:outline-hidden text-right block font-semibold"
                        style={{ direction: "rtl" }}
                        placeholder="متن رپورتاژ خود را اینجا به صورت حرفه‌ای تایپ یا پیست نمایید..."
                      />
                    ) : (
                      <textarea
                        id="editor-textarea"
                        placeholder="کدهای HTML رپورتاژ خود را اینجا بنویسید یا ویرایش کنید..."
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        rows={14}
                        className="w-full p-5 text-xs font-mono leading-relaxed text-slate-700 bg-slate-900 text-slate-100 focus:outline-hidden min-h-[350px] max-h-[500px] resize-y border-0 rounded-b-2xl"
                        dir="ltr"
                      />
                    )}
                  </div>
                </div>

                {/* Featured Image Picker */}
                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-700 block">عکس شاخص رپورتاژ (مطلوب جهت نمایش در سایت مقصد):</label>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    
                    {/* Upload Dropzone */}
                    <div className="md:col-span-1">
                      <input
                        type="file"
                        ref={imageInputRef}
                        accept="image/*"
                        onChange={handleFeaturedImageUpload}
                        className="hidden"
                      />
                      {featuredImage ? (
                        <div className="relative border border-slate-200 rounded-xl overflow-hidden group aspect-video md:h-full flex items-center justify-center bg-slate-50">
                          <img
                            src={featuredImage}
                            alt="Featured preview"
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <button
                              type="button"
                              onClick={() => imageInputRef.current?.click()}
                              className="p-1.5 bg-white text-slate-800 hover:bg-slate-100 rounded-lg text-xs font-bold transition-all"
                            >
                              تغییر عکس
                            </button>
                            <button
                              type="button"
                              onClick={() => setFeaturedImage("")}
                              className="p-1.5 bg-rose-600 text-white hover:bg-rose-500 rounded-lg transition-all"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div
                          onClick={() => imageInputRef.current?.click()}
                          className="border-2 border-dashed border-slate-200 hover:border-blue-400 bg-slate-50/50 hover:bg-blue-50/10 p-4 rounded-xl text-center cursor-pointer transition-all flex flex-col items-center justify-center h-28 aspect-video md:h-full"
                        >
                          <ImageIcon className="w-6 h-6 text-slate-400 mb-1.5" />
                          <span className="text-[10px] text-slate-500 font-extrabold block">آپلود عکس شاخص</span>
                          <span className="text-[8px] text-slate-400 mt-0.5">JPG, PNG تا حداکثر ۲ مگابایت</span>
                        </div>
                      )}
                    </div>

                    {/* Stock Presets selection */}
                    <div className="md:col-span-2 space-y-2">
                      <span className="text-[10px] text-slate-400 font-bold block">انتخاب سریع از تصاویر باکیفیت پیش‌فرض:</span>
                      <div className="grid grid-cols-4 gap-2">
                        {presetImages.map((preset, idx) => (
                          <div
                            key={idx}
                            onClick={() => handleSelectPresetImage(preset.url)}
                            className={`relative rounded-lg overflow-hidden h-14 cursor-pointer border-2 transition-all ${
                              featuredImage === preset.url ? "border-blue-600 shadow-sm" : "border-transparent opacity-85 hover:opacity-100"
                            }`}
                          >
                            <img
                              src={preset.url}
                              alt={preset.name}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute inset-x-0 bottom-0 bg-black/50 text-[8px] text-center text-white py-0.5">
                              {preset.name}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>

                {/* Keywords Link Manager */}
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <div className="space-y-1">
                    <h4 className="text-xs font-black text-slate-800">لینک‌های فالو رپورتاژ آگهی</h4>
                    <p className="text-[10px] text-slate-400 font-semibold">
                      برای رسانه {order.websiteName} مجاز به قرار دادن حداکثر <strong className="text-blue-600 font-black">{allowedLinks}</strong> لینک فالو هستید.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
                    <div className="md:col-span-4">
                      <input
                        type="text"
                        placeholder="کلمه کلیدی (مثال: خرید بک لینک)"
                        value={newKwText}
                        onChange={(e) => setNewKwText(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-xl focus:outline-hidden"
                      />
                    </div>
                    <div className="md:col-span-6">
                      <input
                        type="text"
                        placeholder="آدرس اینترنتی مقصد (مثال: https://seo.com)"
                        value={newKwUrl}
                        onChange={(e) => setNewKwUrl(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-xl font-mono focus:outline-hidden text-left"
                        dir="ltr"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <button
                        type="button"
                        onClick={handleAddKeyword}
                        disabled={keywords.length >= allowedLinks}
                        className="w-full bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white text-xs font-bold py-1.5 rounded-xl transition-all cursor-pointer"
                      >
                        ثبت لینک
                      </button>
                    </div>
                  </div>

                  {/* Registered links List */}
                  {keywords.length > 0 ? (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {keywords.map((kw, idx) => (
                        <div
                          key={idx}
                          className="bg-slate-50 border border-slate-200 text-slate-600 text-xs px-3 py-1 rounded-xl flex items-center gap-2 shadow-2xs"
                        >
                          <Link2 className="w-3.5 h-3.5 text-slate-400" />
                          <span className="font-extrabold">{kw.text}</span>
                          <span className="text-[10px] text-slate-400 font-mono" dir="ltr">({kw.url})</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveKeyword(idx)}
                            className="text-rose-500 hover:text-rose-700 font-black text-xs cursor-pointer mr-1"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[10px] text-slate-400 italic">هیچ لینک فالوی ثبت نشده است. می‌توانید مستقیماً کلمات کلیدی را درج کنید.</p>
                  )}
                </div>

              </div>

              {/* Live Preview Tab */}
              <div className={`p-6 space-y-6 ${activeTab === "preview" ? "" : "hidden"}`}>
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/50 space-y-1.5 text-center">
                  <span className="bg-blue-100 text-blue-700 px-3 py-0.5 rounded-full text-[9px] font-black inline-block">
                    پیش‌نمایش در وب‌سایت {order.websiteName}
                  </span>
                  <p className="text-[10px] text-slate-400 font-semibold">
                    این پیش‌نمایش نشان می‌دهد مقاله شما پس از انتشار در سایت مقصد چگونه برای کاربران نمایش داده می‌شود.
                  </p>
                </div>

                <div className="space-y-4 max-w-2xl mx-auto border border-slate-100 rounded-2xl p-5 bg-white shadow-2xs">
                  {/* Article Title */}
                  <h1 className="text-xl font-black text-slate-900 leading-tight">
                    {title || "«عنوان رپورتاژ آگهی شما»"}
                  </h1>

                  {/* Article metadata */}
                  <div className="flex items-center gap-4 text-[10px] text-slate-400 font-bold pb-4 border-b border-slate-100">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>زمان بارگزاری: {publishImmediate ? "انتشار فوری" : `زمان‌بندی شده برای ${scheduledDate}`}</span>
                    </span>
                    <span>•</span>
                    <span>نویسنده: تحریریه خبر</span>
                    <span>•</span>
                    <span>زمان مطالعه: {estimatedReadingTime} دقیقه</span>
                  </div>

                  {/* Featured image preview */}
                  {featuredImage && (
                    <div className="w-full aspect-video rounded-xl overflow-hidden bg-slate-100">
                      <img
                        src={featuredImage}
                        alt="Featured hero"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  )}

                  {/* Body preview */}
                  {body ? (
                    <div
                      className="preview-content text-slate-700 leading-relaxed text-xs space-y-3 font-semibold text-right"
                      dangerouslySetInnerHTML={{ __html: body }}
                    />
                  ) : (
                    <div className="text-center py-12 text-slate-300 italic text-xs">
                      هیچ متنی نوشته نشده است.
                    </div>
                  )}

                  {/* Injected follow links list */}
                  {keywords.length > 0 && (
                    <div className="mt-8 pt-4 border-t border-slate-100 space-y-2">
                      <span className="text-[10px] text-slate-400 font-bold block">لینک‌های درج شده در بدنه:</span>
                      <div className="flex flex-wrap gap-2">
                        {keywords.map((kw, idx) => (
                          <a
                            key={idx}
                            href={kw.url}
                            target="_blank"
                            rel="noreferrer"
                            className="bg-blue-50/50 hover:bg-blue-50 text-blue-700 px-2.5 py-1 rounded-lg text-[10px] font-black flex items-center gap-1 border border-blue-100/50"
                          >
                            <span>{kw.text}</span>
                            <Link2 className="w-3 h-3" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
          </div>
        </div>

        {/* Left Column: Real-time Assistant, Calendar & SEO Check */}
        <div className="lg:col-span-1 space-y-6 relative z-10">
          
          {/* Calendar Scheduled Publishing Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4 shadow-2xs">
            <h4 className="font-black text-slate-800 text-xs flex items-center gap-1.5 border-b border-slate-100 pb-2.5">
              <Calendar className="w-4 h-4 text-slate-500" />
              <span>زمان‌بندی انتشار رپورتاژ</span>
            </h4>

            <div className="space-y-4 text-xs font-bold">
              {/* Type toggle */}
              <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => {
                    setPublishImmediate(true);
                    setScheduledDate("");
                  }}
                  className={`py-1.5 rounded-lg text-[10px] font-black transition-all cursor-pointer ${
                    publishImmediate ? "bg-white text-slate-800 shadow-3xs" : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  انتشار فوری (حداکثر ۲۴ ساعت)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPublishImmediate(false);
                    setScheduledDate(new Date().toLocaleDateString("fa-IR"));
                  }}
                  className={`py-1.5 rounded-lg text-[10px] font-black transition-all cursor-pointer ${
                    !publishImmediate ? "bg-white text-slate-800 shadow-3xs" : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  انتشار زمان‌بندی شده (آینده)
                </button>
              </div>

              {/* Date Input */}
              {!publishImmediate && (
                <div className="space-y-3 p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 block">تاریخ انتشار مدنظر (شمسی):</label>
                    <input
                      type="text"
                      placeholder="مثال: ۱۴۰۶/۰۴/۱۵"
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-xl text-center font-mono font-extrabold text-slate-700 bg-white focus:outline-hidden text-xs"
                    />
                  </div>

                  {/* Interactive Visual Jalali Calendar Picker */}
                  <div className="bg-white rounded-xl border border-slate-200 p-3 space-y-3 select-none">
                    {/* Header: Month & Year Selector */}
                    <div className="flex justify-between items-center text-[10px] font-black">
                      <button
                        type="button"
                        onClick={() => {
                          if (calMonth === 12) {
                            setCalMonth(1);
                            setCalYear(prev => prev + 1);
                          } else {
                            setCalMonth(prev => prev + 1);
                          }
                        }}
                        className="p-1 hover:bg-slate-100 rounded-lg text-slate-600 cursor-pointer"
                        title="ماه بعد"
                      >
                        <ChevronLeft className="w-3.5 h-3.5 rotate-180" />
                      </button>

                      <div className="flex gap-1.5 items-center">
                        {/* Month Select */}
                        <select
                          value={calMonth}
                          onChange={(e) => setCalMonth(parseInt(e.target.value, 10))}
                          className="bg-slate-50 border border-slate-200 rounded-md px-1 py-0.5 text-[10px] font-bold outline-hidden"
                        >
                          {JALALI_MONTHS.map(m => (
                            <option key={m.id} value={m.id}>{m.name}</option>
                          ))}
                        </select>

                        {/* Year Select */}
                        <select
                          value={calYear}
                          onChange={(e) => setCalYear(parseInt(e.target.value, 10))}
                          className="bg-slate-50 border border-slate-200 rounded-md px-1 py-0.5 text-[10px] font-bold outline-hidden font-mono"
                        >
                          {[1404, 1405, 1406, 1407, 1408, 1409, 1410].map(y => (
                            <option key={y} value={y}>{y}</option>
                          ))}
                        </select>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          if (calMonth === 1) {
                            setCalMonth(12);
                            setCalYear(prev => prev - 1);
                          } else {
                            setCalMonth(prev => prev - 1);
                          }
                        }}
                        className="p-1 hover:bg-slate-100 rounded-lg text-slate-600 cursor-pointer"
                        title="ماه قبل"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Weekday headers */}
                    <div className="grid grid-cols-7 gap-1 text-center text-[8px] font-bold text-slate-400 border-b border-slate-100 pb-1.5">
                      <div>ش</div>
                      <div>ی</div>
                      <div>د</div>
                      <div>س</div>
                      <div>چ</div>
                      <div>پ</div>
                      <div>ج</div>
                    </div>

                    {/* Days Grid */}
                    <div className="grid grid-cols-7 gap-1 text-center">
                      {(() => {
                        const startOffset = (jalaliToGregorianDate(calYear, calMonth, 1).getDay() + 1) % 7;
                        
                        // Leap year check
                        const isLeap = () => {
                          const start = new Date(calYear + 620, 11, 1);
                          for (let i = 0; i < 600; i++) {
                            const d = new Date(start.getTime() + i * 24 * 60 * 60 * 1000);
                            const parts = getJalaliParts(d);
                            if (parts.year === calYear && parts.month === 12 && parts.day === 30) {
                              return true;
                            }
                          }
                          return false;
                        };

                        const daysInMonth = calMonth === 12 ? (isLeap() ? 30 : 29) : JALALI_MONTHS[calMonth - 1].days;
                        const dayButtons = [];

                        // Empty slots
                        for (let i = 0; i < startOffset; i++) {
                          dayButtons.push(<div key={`empty-${i}`} className="aspect-square"></div>);
                        }

                        // Day buttons
                        for (let d = 1; d <= daysInMonth; d++) {
                          const formattedDateString = `${calYear}/${String(calMonth).padStart(2, "0")}/${String(d).padStart(2, "0")}`;
                          const isSelected = scheduledDate === formattedDateString;
                          const isToday = getJalaliParts(new Date()).year === calYear && getJalaliParts(new Date()).month === calMonth && getJalaliParts(new Date()).day === d;

                          dayButtons.push(
                            <button
                              key={d}
                              type="button"
                              onClick={() => setScheduledDate(formattedDateString)}
                              className={`aspect-square w-full rounded-lg text-[9px] font-black flex items-center justify-center transition-all cursor-pointer ${
                                isSelected
                                  ? "bg-blue-600 text-white shadow-xs scale-105"
                                  : isToday
                                  ? "border border-blue-400 text-blue-600 font-extrabold bg-blue-50/20"
                                  : "text-slate-700 hover:bg-slate-100 font-bold"
                              }`}
                            >
                              {d}
                            </button>
                          );
                        }
                        return dayButtons;
                      })()}
                    </div>
                  </div>

                  <span className="text-[9px] text-slate-400 block mt-1 leading-relaxed">
                    ناشر موظف است حداکثر تا ۲ ساعت از تاریخ مشخص شده، اقدام به انتشار رپورتاژ کند.
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Real-time Assistant Quality Check */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4 shadow-2xs">
            <h4 className="font-black text-slate-800 text-xs flex items-center gap-1.5 border-b border-slate-100 pb-2.5">
              <Award className="w-4 h-4 text-slate-500" />
              <span>آنالیزور و دستیار محتوایی سئو</span>
            </h4>

            <div className="space-y-5">
              
              {/* Circular SEO Score */}
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
                  {/* Dynamic coloring based on score */}
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="32"
                      cy="32"
                      r="26"
                      stroke="#f1f5f9"
                      strokeWidth="5"
                      fill="transparent"
                    />
                    <circle
                      cx="32"
                      cy="32"
                      r="26"
                      stroke={seoScore >= 80 ? "#10b981" : seoScore >= 50 ? "#f59e0b" : "#ef4444"}
                      strokeWidth="5"
                      fill="transparent"
                      strokeDasharray={2 * Math.PI * 26}
                      strokeDashoffset={2 * Math.PI * 26 * (1 - seoScore / 100)}
                      className="transition-all duration-500"
                    />
                  </svg>
                  <span className="absolute font-mono font-black text-sm text-slate-800">{seoScore}%</span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[11px] font-black text-slate-700 block">امتیاز سئوی زنده</span>
                  <p className="text-[9px] text-slate-400 font-semibold leading-relaxed">
                    با رفع خطاهای زیر امتیاز سئو افزایش می‌یابد و شانس بک‌لینک موثر بالا می‌رود.
                  </p>
                </div>
              </div>

              {/* Requirement Checklist */}
              <div className="space-y-2.5 text-[10px] font-bold text-slate-600">
                
                {/* Rule 1: Length */}
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle className={`w-3.5 h-3.5 ${wordCount >= 300 ? "text-emerald-500" : "text-slate-300"}`} />
                    <span>طول رپورتاژ (حداقل ۳۰۰ کلمه)</span>
                  </span>
                  <span className="font-mono text-[9px] text-slate-400">({wordCount} کلمه)</span>
                </div>

                {/* Rule 2: Title length */}
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle className={`w-3.5 h-3.5 ${title.length >= 15 ? "text-emerald-500" : "text-slate-300"}`} />
                    <span>عنوان ترغیب کننده سئو</span>
                  </span>
                  <span className="font-mono text-[9px] text-slate-400">{title.length > 0 ? "تکمیل شده" : "خالی"}</span>
                </div>

                {/* Rule 3: Headings */}
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle className={`w-3.5 h-3.5 ${body.includes("<h2>") || body.includes("<h3>") ? "text-emerald-500" : "text-slate-300"}`} />
                    <span>استفاده از تگ‌های ساختار (H2, H3)</span>
                  </span>
                  <span className="font-mono text-[9px] text-slate-400">
                    {body.includes("<h2>") || body.includes("<h3>") ? "رعایت شده" : "نیاز به هدینگ"}
                  </span>
                </div>

                {/* Rule 4: Featured Image */}
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle className={`w-3.5 h-3.5 ${featuredImage ? "text-emerald-500" : "text-slate-300"}`} />
                    <span>بارگزاری عکس شاخص رپورتاژ</span>
                  </span>
                  <span className="font-mono text-[9px] text-slate-400">{featuredImage ? "آپلود شده" : "بدون تصویر"}</span>
                </div>

                {/* Rule 5: Keywords Link limits */}
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle className={`w-3.5 h-3.5 ${keywords.length > 0 && keywords.length <= allowedLinks ? "text-emerald-500" : "text-slate-300"}`} />
                    <span>درج حداقل یک لینک فالو مجاز</span>
                  </span>
                  <span className="font-mono text-[9px] text-slate-400">{keywords.length} از {allowedLinks}</span>
                </div>

              </div>
            </div>
          </div>

          {/* Quick AI Suggestion Booster */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60 space-y-2 flex flex-col justify-between">
            <div className="space-y-1">
              <span className="text-[10px] text-blue-600 font-extrabold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin" />
                <span>دستیار هوشمند نگارش رپورتاژ</span>
              </span>
              <p className="text-[9px] text-slate-500 leading-relaxed font-semibold">
                علاوه بر فایل ورد، شما می‌توانید از بخش «محتوا نویسی با هوش مصنوعی» یک متن سئو شده حرفه‌ای و ساختاریافته در عرض چند ثانیه تولید و در این بخش کپی نمایید.
              </p>
            </div>
          </div>

        </div>

      </div>

      {/* Custom Modal Alert */}
      {modalAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs text-right" dir="rtl">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xl max-w-sm w-full space-y-4 animate-scale-up">
            <h3 className="text-sm font-black text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-1.5">
              <span className="w-1.5 h-4 bg-blue-500 rounded-full"></span>
              {modalAlert.title || "اعلام سیستم"}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed font-semibold">
              {modalAlert.message}
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  const cb = modalAlert.onSuccess;
                  setModalAlert(null);
                  if (cb) cb();
                }}
                className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black transition-all cursor-pointer"
              >
                باشه، متوجه شدم
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Modal Confirm */}
      {modalConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs text-right" dir="rtl">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xl max-w-sm w-full space-y-4 animate-scale-up">
            <h3 className="text-sm font-black text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-1.5">
              <span className="w-1.5 h-4 bg-amber-500 rounded-full"></span>
              {modalConfirm.title || "تاییدیه عملیات"}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed font-semibold">
              {modalConfirm.message}
            </p>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setModalConfirm(null);
                }}
                className="flex-1 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                انصراف
              </button>
              <button
                type="button"
                onClick={() => {
                  const cb = modalConfirm.onConfirm;
                  setModalConfirm(null);
                  cb();
                }}
                className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black transition-all cursor-pointer"
              >
                تایید نهایی
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
