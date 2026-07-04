export interface MediaWebsite {
  id: string;
  name: string;
  domain: string;
  logo: string;
  category: "technology" | "news" | "lifestyle" | "finance" | "education" | "sports";
  categoryLabel: string;
  domainAuthority: number; // DA
  spamScore: number; // SS
  alexaRank: number; // rank in Iran
  price: number; // in Tomans
  linkType: "follow" | "nofollow" | "both";
  deliveryTime: string; // e.g., "۲۴ ساعت"
  allowedLinksCount: number; // maximum links in article, e.g. 3
  description: string;
  isMine?: boolean; // Owned by current publisher for simulation
}

export type OrderStatus = "draft" | "pending" | "published" | "rejected";

export interface AdvertorialOrder {
  id: string;
  websiteId: string;
  websiteName: string;
  websiteDomain: string;
  campaignId: string | null;
  campaignName: string | null;
  title: string;
  body: string; // HTML content or rich text
  keywords: { text: string; url: string }[];
  status: OrderStatus;
  price: number;
  dateCreated: string;
  publishedUrl?: string; // submitted by publisher
  rejectionReason?: string;
  deliveryTimeLimit: string;
  featuredImage?: string;
  scheduledDate?: string;
  wordDocName?: string;
}

export interface Campaign {
  id: string;
  name: string;
  budget: number;
  dateCreated: string;
  ordersCount: number;
}

export interface ContentOrder {
  id: string;
  topic: string;
  keywords: string[];
  tone: "official" | "friendly" | "creative" | "academic";
  wordCount: number;
  brief: string;
  status: "pending" | "generated" | "approved";
  generatedTitle?: string;
  generatedBody?: string;
  generatedSummary?: string;
  seoTips?: string[];
  price: number; // Cost of writing service
  dateCreated: string;
}

export interface WalletTransaction {
  id: string;
  type: "deposit" | "purchase" | "withdrawal" | "income";
  amount: number; // In Tomans
  description: string;
  date: string;
  status: "success" | "pending" | "failed";
}

export interface UserNotification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: "info" | "success" | "warning";
}

export interface PublisherUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  websitesCount: number;
  dateJoined: string;
  status: "active" | "suspended";
}

export interface MediaRegistrationRequest {
  id: string;
  name: string;
  domain: string;
  logo: string;
  category: "technology" | "news" | "lifestyle" | "finance" | "education" | "sports";
  categoryLabel: string;
  domainAuthority: number;
  spamScore: number;
  alexaRank: number;
  price: number;
  linkType: "follow" | "nofollow" | "both";
  deliveryTime: string;
  allowedLinksCount: number;
  description: string;
  status: "pending" | "approved" | "rejected";
  publisherName: string;
  publisherEmail: string;
  rejectionReason?: string;
}

