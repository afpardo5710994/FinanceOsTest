import {
  pgTable,
  pgEnum,
  uuid,
  varchar,
  text,
  boolean,
  timestamp,
  date,
  numeric,
  smallint,
  integer,
  jsonb,
  inet,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ─── Enums ────────────────────────────────────────────────────────────────────

export const userPlanEnum = pgEnum("user_plan", ["free", "premium"]);

export const accountTypeEnum = pgEnum("account_type", [
  "depository",
  "investment",
  "credit",
  "loan",
  "other",
]);

export const plaidItemStatusEnum = pgEnum("plaid_item_status", [
  "active",
  "needs_reauth",
  "error",
]);

export const paymentChannelEnum = pgEnum("payment_channel", [
  "online",
  "in_store",
  "other",
]);

export const budgetPeriodEnum = pgEnum("budget_period", [
  "monthly",
  "weekly",
  "annual",
]);

export const goalTypeEnum = pgEnum("goal_type", [
  "savings",
  "debt_payoff",
  "investment",
  "emergency_fund",
  "custom",
]);

export const insightTypeEnum = pgEnum("insight_type", [
  "anomaly",
  "trend",
  "suggestion",
  "forecast",
  "achievement",
]);

export const insightSeverityEnum = pgEnum("insight_severity", [
  "info",
  "warning",
  "positive",
]);

export const securityTypeEnum = pgEnum("security_type", [
  "equity",
  "etf",
  "mutual_fund",
  "fixed_income",
  "cash",
  "other",
]);

// ─── users ────────────────────────────────────────────────────────────────────

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  clerkUserId: varchar("clerk_user_id", { length: 255 }).unique().notNull(),
  email: varchar("email", { length: 320 }).unique().notNull(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  fullName: varchar("full_name", { length: 255 }),
  avatarUrl: text("avatar_url"),
  plan: userPlanEnum("plan").default("free").notNull(),
  timezone: varchar("timezone", { length: 64 }).default("America/New_York").notNull(),
  currency: varchar("currency", { length: 3 }).default("USD").notNull(),
  onboardingDone: boolean("onboarding_done").default(false).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
});

// ─── plaid_items ──────────────────────────────────────────────────────────────

export const plaidItems = pgTable("plaid_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  plaidItemId: varchar("plaid_item_id", { length: 255 }).unique().notNull(),
  // AES-256 encrypted at application level before storage
  plaidAccessTokenEnc: text("plaid_access_token_enc").notNull(),
  institutionId: varchar("institution_id", { length: 255 }),
  institutionName: varchar("institution_name", { length: 255 }),
  institutionLogo: text("institution_logo"),
  status: plaidItemStatusEnum("status").default("active").notNull(),
  errorCode: varchar("error_code", { length: 100 }),
  consentExpiresAt: timestamp("consent_expires_at", { withTimezone: true }),
  lastSyncedAt: timestamp("last_synced_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// ─── accounts ─────────────────────────────────────────────────────────────────

export const accounts = pgTable(
  "accounts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id),
    plaidItemId: uuid("plaid_item_id").references(() => plaidItems.id),
    plaidAccountId: varchar("plaid_account_id", { length: 255 }),
    mxAccountId: varchar("mx_account_id", { length: 255 }),
    name: varchar("name", { length: 255 }).notNull(),
    officialName: varchar("official_name", { length: 255 }),
    type: accountTypeEnum("type").notNull(),
    subtype: varchar("subtype", { length: 64 }),
    mask: varchar("mask", { length: 4 }),
    institutionName: varchar("institution_name", { length: 255 }),
    currency: varchar("currency", { length: 3 }).default("USD").notNull(),
    currentBalance: numeric("current_balance", { precision: 14, scale: 2 }),
    availableBalance: numeric("available_balance", { precision: 14, scale: 2 }),
    creditLimit: numeric("credit_limit", { precision: 14, scale: 2 }),
    isHidden: boolean("is_hidden").default(false).notNull(),
    displayOrder: smallint("display_order").default(0).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    index("idx_accounts_user_id").on(t.userId),
    index("idx_accounts_plaid_account_id").on(t.plaidAccountId),
  ],
);

// ─── categories ───────────────────────────────────────────────────────────────

export const categories = pgTable("categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 100 }).notNull(),
  parentId: uuid("parent_id"),
  icon: varchar("icon", { length: 50 }),
  color: varchar("color", { length: 7 }),
  isSystem: boolean("is_system").default(true).notNull(),
  userId: uuid("user_id").references(() => users.id),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// ─── transactions ─────────────────────────────────────────────────────────────

export const transactions = pgTable(
  "transactions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id),
    accountId: uuid("account_id")
      .notNull()
      .references(() => accounts.id),
    plaidTransactionId: varchar("plaid_transaction_id", { length: 255 }),
    // negative = debit, positive = credit
    amount: numeric("amount", { precision: 14, scale: 2 }).notNull(),
    currency: varchar("currency", { length: 3 }).default("USD").notNull(),
    description: text("description").notNull(),
    merchantName: varchar("merchant_name", { length: 255 }),
    categoryId: uuid("category_id").references(() => categories.id),
    userCategoryId: uuid("user_category_id").references(() => categories.id),
    isPending: boolean("is_pending").default(false).notNull(),
    transactionDate: date("transaction_date").notNull(),
    authorizedDate: date("authorized_date"),
    locationCity: varchar("location_city", { length: 100 }),
    locationState: varchar("location_state", { length: 2 }),
    locationCountry: varchar("location_country", { length: 2 }),
    paymentChannel: paymentChannelEnum("payment_channel"),
    logoUrl: text("logo_url"),
    isRecurring: boolean("is_recurring").default(false).notNull(),
    recurringStreamId: uuid("recurring_stream_id"),
    tags: text("tags").array().default([]).notNull(),
    notes: text("notes"),
    isExcluded: boolean("is_excluded").default(false).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    uniqueIndex("uniq_plaid_transaction_id").on(t.plaidTransactionId),
    index("idx_transactions_user_date").on(t.userId, t.transactionDate),
    index("idx_transactions_account_id").on(t.accountId),
    index("idx_transactions_category").on(t.userId, t.categoryId),
  ],
);

// ─── balance_snapshots ────────────────────────────────────────────────────────

export const balanceSnapshots = pgTable(
  "balance_snapshots",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id),
    accountId: uuid("account_id")
      .notNull()
      .references(() => accounts.id),
    balance: numeric("balance", { precision: 14, scale: 2 }).notNull(),
    snapshotDate: date("snapshot_date").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    uniqueIndex("uniq_balance_snapshot").on(t.accountId, t.snapshotDate),
    index("idx_balance_snapshots_user_date").on(t.userId, t.snapshotDate),
  ],
);

// ─── holdings ─────────────────────────────────────────────────────────────────

export const holdings = pgTable(
  "holdings",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    accountId: uuid("account_id")
      .notNull()
      .references(() => accounts.id),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id),
    plaidSecurityId: varchar("plaid_security_id", { length: 255 }),
    tickerSymbol: varchar("ticker_symbol", { length: 20 }),
    securityName: varchar("security_name", { length: 255 }),
    securityType: securityTypeEnum("security_type"),
    quantity: numeric("quantity", { precision: 18, scale: 8 }),
    costBasis: numeric("cost_basis", { precision: 14, scale: 2 }),
    institutionPrice: numeric("institution_price", { precision: 14, scale: 4 }),
    institutionValue: numeric("institution_value", { precision: 14, scale: 2 }),
    closePrice: numeric("close_price", { precision: 14, scale: 4 }),
    closePriceDate: date("close_price_date"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    index("idx_holdings_account").on(t.accountId),
    index("idx_holdings_user").on(t.userId),
  ],
);

// ─── budgets ──────────────────────────────────────────────────────────────────

export const budgets = pgTable(
  "budgets",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id),
    categoryId: uuid("category_id")
      .notNull()
      .references(() => categories.id),
    amount: numeric("amount", { precision: 14, scale: 2 }).notNull(),
    period: budgetPeriodEnum("period").default("monthly").notNull(),
    rollover: boolean("rollover").default(false).notNull(),
    startDate: date("start_date").notNull(),
    endDate: date("end_date"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    uniqueIndex("uniq_budget_user_category_period").on(
      t.userId,
      t.categoryId,
      t.period,
      t.startDate,
    ),
  ],
);

// ─── goals ────────────────────────────────────────────────────────────────────

export const goals = pgTable("goals", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  name: varchar("name", { length: 255 }).notNull(),
  type: goalTypeEnum("type").notNull(),
  targetAmount: numeric("target_amount", { precision: 14, scale: 2 }).notNull(),
  currentAmount: numeric("current_amount", { precision: 14, scale: 2 }).default("0").notNull(),
  linkedAccountId: uuid("linked_account_id").references(() => accounts.id),
  targetDate: date("target_date"),
  monthlyContribution: numeric("monthly_contribution", { precision: 14, scale: 2 }),
  isCompleted: boolean("is_completed").default(false).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// ─── insights ─────────────────────────────────────────────────────────────────

export const insights = pgTable(
  "insights",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id),
    type: insightTypeEnum("type").notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    body: text("body").notNull(),
    severity: insightSeverityEnum("severity").notNull(),
    isRead: boolean("is_read").default(false).notNull(),
    isDismissed: boolean("is_dismissed").default(false).notNull(),
    metadata: jsonb("metadata"),
    expiresAt: timestamp("expires_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index("idx_insights_user_unread").on(t.userId, t.isRead, t.createdAt)],
);

// ─── ai_conversations ─────────────────────────────────────────────────────────

export const aiConversations = pgTable("ai_conversations", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  messages: jsonb("messages").notNull().$type<
    Array<{ role: "user" | "assistant"; content: string; timestamp: string }>
  >(),
  contextSnapshot: jsonb("context_snapshot"),
  tokenUsage: integer("token_usage").default(0).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// ─── audit_log ────────────────────────────────────────────────────────────────

export const auditLog = pgTable(
  "audit_log",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => users.id),
    action: varchar("action", { length: 100 }).notNull(),
    entityType: varchar("entity_type", { length: 50 }),
    entityId: uuid("entity_id"),
    ipAddress: inet("ip_address"),
    userAgent: text("user_agent"),
    metadata: jsonb("metadata"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index("idx_audit_log_user").on(t.userId, t.createdAt)],
);

// ─── Relations ────────────────────────────────────────────────────────────────

export const usersRelations = relations(users, ({ many }) => ({
  plaidItems: many(plaidItems),
  accounts: many(accounts),
  transactions: many(transactions),
  budgets: many(budgets),
  goals: many(goals),
  insights: many(insights),
  aiConversations: many(aiConversations),
  auditLog: many(auditLog),
}));

export const plaidItemsRelations = relations(plaidItems, ({ one, many }) => ({
  user: one(users, { fields: [plaidItems.userId], references: [users.id] }),
  accounts: many(accounts),
}));

export const accountsRelations = relations(accounts, ({ one, many }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
  plaidItem: one(plaidItems, { fields: [accounts.plaidItemId], references: [plaidItems.id] }),
  transactions: many(transactions),
  balanceSnapshots: many(balanceSnapshots),
  holdings: many(holdings),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  user: one(users, { fields: [transactions.userId], references: [users.id] }),
  account: one(accounts, { fields: [transactions.accountId], references: [accounts.id] }),
  category: one(categories, { fields: [transactions.categoryId], references: [categories.id] }),
  userCategory: one(categories, {
    fields: [transactions.userCategoryId],
    references: [categories.id],
  }),
}));
