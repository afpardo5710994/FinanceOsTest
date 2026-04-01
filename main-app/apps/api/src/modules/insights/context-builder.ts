import type { DbClient } from "@financeos/db";

export interface FinancialContext {
  netWorth: number;
  liquidSavings: number;
  investmentTotal: number;
  creditCardDebt: number;
  currentMonthSpend: number;
  savingsRate3Month: number;
  topCategories: Array<{ name: string; amount: number; budgetAmount?: number }>;
  recentTransactions: Array<{ description: string; amount: number; date: string }>;
  activeFlags: string[];
}

/**
 * Builds a real-time financial context snapshot for a user.
 * Used by the AI chat endpoint and the weekly digest job.
 * NEVER hardcode — always compute from live DB data.
 */
export async function buildFinancialContext(
  db: DbClient,
  userId: string,
): Promise<FinancialContext> {
  // TODO: implement queries to compute each field from DB
  // This stub returns empty/zero values — replace with real queries
  return {
    netWorth: 0,
    liquidSavings: 0,
    investmentTotal: 0,
    creditCardDebt: 0,
    currentMonthSpend: 0,
    savingsRate3Month: 0,
    topCategories: [],
    recentTransactions: [],
    activeFlags: [],
  };
}

export function formatContextAsSystemPrompt(context: FinancialContext): string {
  return `You are a personal financial advisor with access to the user's real financial data.

Current Financial Snapshot:
- Net Worth: $${context.netWorth.toLocaleString()}
- Liquid Savings: $${context.liquidSavings.toLocaleString()}
- Investments: $${context.investmentTotal.toLocaleString()}
- Credit Card Debt: $${context.creditCardDebt.toLocaleString()}
- Current Month Spend: $${context.currentMonthSpend.toLocaleString()}
- 3-Month Savings Rate: ${context.savingsRate3Month.toFixed(1)}%

Top Spending Categories This Month:
${context.topCategories.map((c) => `- ${c.name}: $${c.amount}${c.budgetAmount ? ` / $${c.budgetAmount} budget` : ""}`).join("\n")}

Recent Transactions:
${context.recentTransactions.map((t) => `- ${t.date}: ${t.description} ($${Math.abs(t.amount)})`).join("\n")}

${context.activeFlags.length > 0 ? `Active Alerts:\n${context.activeFlags.map((f) => `- ${f}`).join("\n")}` : ""}

Provide concise, actionable, personalized financial advice based on this data. Be direct and specific — reference actual numbers when relevant.`;
}
