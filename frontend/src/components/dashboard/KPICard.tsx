import { ReactNode } from "react";

type KPICardProps = {
  title: string;
  value: string;
  change: string;
  icon: ReactNode;
};

export default function KPICard({
  title,
  value,
  change,
  icon,
}: KPICardProps) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-md transition hover:shadow-xl">
      <div className="flex items-center justify-between">

        <div>
          <p className="text-sm text-gray-500">{title}</p>

          <h2 className="mt-2 text-3xl font-bold">
            {value}
          </h2>

          <p className="mt-2 font-medium text-green-600">
            {change}
          </p>
        </div>

        <div className="text-4xl">
          {icon}
        </div>

      </div>
    </div>
  );
}