"use client";

import React from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { format } from "date-fns";
import { Click } from "../../api/getUrlInsights";

interface ClicksChartProps {
  clicks: Click[];
}

export function ClicksChart({ clicks }: ClicksChartProps) {
  // Process clicks into hourly data points
  const hourlyData = clicks
    .reduce((acc: any[], click) => {
      const hour = format(new Date(click.timestamp), "h:mm a");
      const existing = acc.find((d) => d.hour === hour);
      if (existing) {
        existing.clicks++;
      } else {
        acc.push({ hour, clicks: 1, timestamp: new Date(click.timestamp) });
      }
      return acc;
    }, [])
    .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={hourlyData}>
          <defs>
            <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="hour" stroke="#94a3b8" fontSize={12} />
          <YAxis stroke="#94a3b8" fontSize={12} />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-white p-2 shadow-lg rounded-lg border">
                    <p className="text-sm font-medium">
                      {payload[0].payload.hour}
                    </p>
                    <p className="text-sm text-blue-600">
                      {payload[0].value} clicks
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Area
            type="monotone"
            dataKey="clicks"
            stroke="#3b82f6"
            fillOpacity={1}
            fill="url(#colorClicks)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
