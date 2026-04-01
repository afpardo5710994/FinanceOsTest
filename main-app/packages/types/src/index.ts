// ─── Enums ────────────────────────────────────────────────────────────────────

export type UserPlan = "free" | "premium";

export type AccountType = "depository" | "investment" | "credit" | "loan" | "other";

export type TransactionPaymentChannel = "online" | "in_store" | "other";

export type PlaidItemStatus = "active" | "needs_reauth" | "error";

export type BudgetPeriod = "monthly" | "weekly" | "annual";

export type GoalType = "savings" | "debt_payoff" | "investment" | "emergency_fund" | "custom";

export type InsightType = "anomaly" | "trend" | "suggestion" | "forecast" | "achievement";

export type InsightSeverity = "info" | "warning" | "positive";

export type SecurityType =
  | "equity"
  | "etf"
  | "mutual_fund"
  | "fixed_income"
  | "cash"
  | "other";

// ─── Core Entities ────────────────────────────────────────────────────────────

export interface User {
  id: string;
  clerkUserId: string;
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
  plan: UserPlan;
  timezone: string;
  currency: string;
  onboardingDone: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PlaidItem {
  id: string;
  userId: string;
  plaidItemId: string;
  institutionId: string | null;
  institutionName: string | null;
  institutionLogo: string | null;
  status: PlaidItemStatus;
  errorCode: string | null;
  consentExpiresAt: Date | null;
  lastSyncedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Account {
  id: string;
  userId: string;
  plaidItemId: string | null;
  plaidAccountId: string | null;
  name: string;
  officialName: string | null;
  type: AccountType;
  subtype: string | null;
  mask: string | null;
  institutionName: string | null;
  currency: string;
  currentBalance: number | null;
  availableBalance: number | null;
  creditLimit: number | null;
  isHidden: boolean;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  parentId: string | null;
  icon: string | null;
  color: string | null;
  isSystem: boolean;
  userId: string | null;
  createdAt: Date;
}

export interface Transaction {
  id: string;
  userId: string;
  accountId: string;
  plaidTransactionId: string | null;
  amount: number;
  currency: string;
  description: string;
  merchantName: string | null;
  categoryId: string | null;
  userCategoryId: string | null;
  isPending: boolean;
  transactionDate: string; // ISO date string YYYY-MM-DD
  authorizedDate: string | null;
  locationCity: string | null;
  locationState: string | null;
  locationCountry: string | null;
  paymentChannel: TransactionPaymentChannel | null;
  logoUrl: string | null;
  isRecurring: boolean;
  recurringStreamId: string | null;
  tags: string[];
  notes: string | null;
  isExcluded: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface BalanceSnapshot {
  id: string;
  userId: string;
  accountId: string;
  balance: number;
  snapshotDate: string; // ISO date string YYYY-MM-DD
  createdAt: Date;
}

export interface Holding {
  id: string;
  accountId: string;
  userId: string;
  plaidSecurityId: string | null;
  tickerSymbol: string | null;
  securityName: string | null;
  securityType: SecurityType | null;
  quantity: number | null;
  costBasis: number | null;
  institutionPrice: number | null;
  institutionValue: number | null;
  closePrice: number | null;
  closePriceDate: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Budget {
  id: string;
  userId: string;
  categoryId: string;
  amount: number;
  period: BudgetPeriod;
  rollover: boolean;
  startDate: string;
  endDate: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Goal {
  id: string;
  userId: string;
  name: string;
  type: GoalType;
  targetAmount: number;
  currentAmount: number;
  linkedAccountId: string | null;
  targetDate: string | null;
  monthlyContribution: number | null;
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Insight {
  id: string;
  userId: string;
  type: InsightType;
  title: string;
  body: string;
  severity: InsightSeverity;
  isRead: boolean;
  isDismissed: boolean;
  metadata: Record<string, unknown> | null;
  expiresAt: Date | null;
  createdAt: Date;
}

export interface AIMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface AIConversation {
  id: string;
  userId: string;
  messages: AIMessage[];
  contextSnapshot: Record<string, unknown> | null;
  tokenUsage: number;
  createdAt: Date;
  updatedAt: Date;
}

// ─── API Request / Response Types ────────────────────────────────────────────

export interface AccountsSummary {
  netWorth: number;
  liquidTotal: number;
  investmentTotal: number;
  debtTotal: number;
}

export interface TransactionFilters {
  accountId?: string;
  categoryId?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface AIChatRequest {
  message: string;
  conversationId?: string;
}

export interface PlaidLinkTokenResponse {
  linkToken: string;
  expiration: string;
}

export interface PlaidExchangeTokenRequest {
  publicToken: string;
  institutionId: string;
  institutionName: string;
}
