import React from "react";

interface KPICardProps {
  title: string;
  value: string | number;
  color?: "green" | "red" | "blue";
}

export const KPICard: React.FC<KPICardProps> = ({ title, value, color }) => {
  const colorMap = {
    green: "text-green-600",
    red: "text-red-600",
    blue: "text-blue-600"
  };
  return (
    <div className="bg-white shadow rounded-lg p-4 w-48 text-center">
      <div className="text-sm text-gray-500">{title}</div>
      <div className={`text-xl font-semibold ${colorMap[color ?? "blue"]}`}>
        {value}
      </div>
    </div>
  );
};
