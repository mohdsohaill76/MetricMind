const activities = [
  {
    id: 1,
    customer: "Amazon",
    product: "MetricMind Enterprise",
    amount: "$12,500",
    status: "Completed",
  },
  {
    id: 2,
    customer: "Microsoft",
    product: "Business Dashboard",
    amount: "$8,300",
    status: "Processing",
  },
  {
    id: 3,
    customer: "Tesla",
    product: "AI Analytics",
    amount: "$15,000",
    status: "Completed",
  },
  {
    id: 4,
    customer: "Google",
    product: "Cloud Reports",
    amount: "$10,250",
    status: "Pending",
  },
];

export default function RecentActivity() {
  return (
    <div className="card rounded-2xl p-6 shadow-md">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          Recent Activity
        </h2>

        <button className="rounded-lg bg-blue-600 px-4 py-2 text-white">
          View All
        </button>
      </div>

      <table className="w-full">
        <thead>
          <tr className="border-b text-left">
            <th className="py-3">Customer</th>
            <th>Product</th>
            <th>Amount</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {activities.map((item) => (
            <tr key={item.id} className="border-b hover:bg-gray-50">
              <td className="py-4">{item.customer}</td>
              <td>{item.product}</td>
              <td>{item.amount}</td>

              <td>
                <span
                  className={`rounded-full px-3 py-1 text-sm ${
                    item.status === "Completed"
                      ? "bg-green-100 text-green-700"
                      : item.status === "Processing"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {item.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}