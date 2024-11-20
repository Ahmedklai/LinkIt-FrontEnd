"use client";

import React from "react";

interface StatsListProps {
  title: string;
  data: { label: string; value: number; icon?: string }[];
  total: number;
}

export function StatsList({ title, data, total }: StatsListProps) {
  console.log({ data, total });
  return (
    <div className="bg-blue-50 bg-opacity-40 rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {title}
        </h3>
        <span className="text-sm text-gray-700 dark:text-gray-300">
          % CLICKS
        </span>
      </div>
      <div className="space-y-3">
        {data.map((item) => {
          const percentage = Math.round((item.value / total) * 100);

          return (
            <div key={item.label} className="relative">
              {/* Background bar */}
              <div
                className="absolute inset-0 bg-blue-50 rounded"
                style={{
                  width: `${percentage}%`,
                  transition: "width 0.3s ease-in-out",
                }}
              />
              {/* Content */}
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
                  <span className="text-sm text-gray-600">{item.value}</span>
                  <span className="text-sm text-gray-400 w-8">
                    {percentage}%
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
