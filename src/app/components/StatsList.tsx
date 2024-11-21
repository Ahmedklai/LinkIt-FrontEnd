"use client";

import React from "react";

interface StatsListProps {
  title: string;
  data: { label: string; value: number; icon?: string }[];
  total: number;
}

export function StatsList({ title, data, total }: StatsListProps) {
  const bgByIndex = (index: number) => {
    const bgColors = [
      "bg-blue-100",
      "bg-red-100",
      "bg-green-100",
      "bg-yellow-100",
      "bg-indigo-100",
      "bg-pink-100",
      "bg-purple-100",
      "bg-gray-100",
    ];
    return bgColors[index % bgColors.length];
  };

  const maxValue = Math.max(...data?.map((item) => item.value));

  return (
    <div className="bg-blue-50 bg-opacity-70 rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-medium text-gray-700 ">{title}</h3>
        <span className="text-sm text-gray-700 ">% CLICKS</span>
      </div>
      <div className="space-y-3">
        {data.map((item, index) => {
          const percentageForWidth = Math.round((item.value / maxValue) * 100);
          const percentageValue = Math.round((item.value / total) * 100);

          return (
            <div key={item.label} className="relative">
              <div
                className={`absolute inset-0 ${bgByIndex(index)} rounded`}
                style={{
                  width: `${percentageForWidth}%`,
                  transition: "width 0.3s ease-in-out",
                }}
              />
              <div className="relative flex items-center justify-between p-2">
                <div className="flex items-center gap-2">
                  {item.icon && (
                    <img src={item.icon} alt="" className="w-4 h-4 rounded" />
                  )}
                  <span className="text-sm font-medium text-gray-700">
                    {item.label}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-700 dark:text-slate-800">
                    {item.value}
                  </span>
                  <span className="text-sm text-gray-500 w-8 dark:text-gray-900 ">
                    {percentageValue}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {data.length > 7 && (
        <button className="mt-4 text-sm text-gray-500 hover:text-gray-700 transition-colors">
          View All
        </button>
      )}
    </div>
  );
}
