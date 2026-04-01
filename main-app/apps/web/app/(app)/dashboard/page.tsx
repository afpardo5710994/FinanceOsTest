export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Net Worth", value: "—", sub: "Connect accounts to see" },
          { label: "Liquid Savings", value: "—", sub: "Checking + savings" },
          { label: "Investments", value: "—", sub: "All investment accounts" },
          { label: "Monthly Spend", value: "—", sub: "Current month" },
        ].map((card) => (
          <div key={card.label} className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-sm text-gray-500">{card.label}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{card.value}</p>
            <p className="text-xs text-gray-400 mt-1">{card.sub}</p>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
        <p className="text-gray-500 text-sm">
          Connect your bank accounts to get started.
        </p>
        <a
          href="/settings/accounts"
          className="mt-3 inline-block text-sm font-medium text-indigo-600 hover:text-indigo-500"
        >
          Connect accounts →
        </a>
      </div>
    </div>
  );
}
