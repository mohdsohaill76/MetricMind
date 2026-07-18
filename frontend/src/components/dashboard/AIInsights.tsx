import { FaLightbulb } from "react-icons/fa";

export default function AIInsights() {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-md">
      <div className="mb-5 flex items-center gap-3">
        <FaLightbulb className="text-2xl text-yellow-500" />

        <h2 className="text-xl font-semibold">
          AI Insights
        </h2>
      </div>

      <div className="space-y-4">

        <div className="rounded-lg bg-blue-50 p-4">
          Revenue increased by
          <span className="font-bold text-blue-600"> 12% </span>
          compared to last month.
        </div>

        <div className="rounded-lg bg-green-50 p-4">
          Customer acquisition is
          <span className="font-bold text-green-600"> growing steadily.</span>
        </div>

        <div className="rounded-lg bg-orange-50 p-4">
          Consider increasing marketing in the
          <span className="font-bold text-orange-600"> South Region.</span>
        </div>

      </div>
    </div>
  );
}