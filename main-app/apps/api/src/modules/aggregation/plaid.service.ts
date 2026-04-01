import { PlaidApi, PlaidEnvironments, Configuration, Products, CountryCode } from "plaid";

// Plaid client singleton
const plaidConfig = new Configuration({
  basePath: PlaidEnvironments[process.env["PLAID_ENV"] as keyof typeof PlaidEnvironments ?? "sandbox"],
  baseOptions: {
    headers: {
      "PLAID-CLIENT-ID": process.env["PLAID_CLIENT_ID"] ?? "",
      "PLAID-SECRET": process.env["PLAID_SECRET"] ?? "",
    },
  },
});

export const plaidClient = new PlaidApi(plaidConfig);

export async function createLinkToken(userId: string): Promise<{ linkToken: string; expiration: string }> {
  const response = await plaidClient.linkTokenCreate({
    user: { client_user_id: userId },
    client_name: "FinanceOS",
    products: [Products.Transactions],
    country_codes: [CountryCode.Us, CountryCode.Ca],
    language: "en",
  });
  return {
    linkToken: response.data.link_token,
    expiration: response.data.expiration,
  };
}

export async function exchangePublicToken(publicToken: string): Promise<string> {
  const response = await plaidClient.itemPublicTokenExchange({ public_token: publicToken });
  // IMPORTANT: encrypt this token before storing in DB
  return response.data.access_token;
}

// TODO: implement syncTransactions, getAccounts, removeItem
