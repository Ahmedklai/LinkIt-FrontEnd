import { faLink as Link } from "@fortawesome/free-solid-svg-icons";
import { ClicksChart } from "@/components/ClicksChart";
import { StatsList } from "@/components/StatsList";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Insights } from "../../../api/getUrlInsights";

interface AnalyticsViewProps {
  insights: Insights;
}

// Client Component
export default function AnalyticsView({ insights }: AnalyticsViewProps) {
  const { clicks, shortener } = insights;

  // Process data for different stats
  const stats = {
    countries: Object.entries(
      clicks.reduce((acc: Record<string, number>, click) => {
        acc[click.location] = (acc[click.location] || 0) + 1;
        return acc;
      }, {})
    )
      .map(([label, value]) => ({
        label,
        value,
        icon: `https://flagcdn.com/w20/${label.toLowerCase().slice(0, 2)}.png`,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8),

    devices: Object.entries(
      clicks.reduce((acc: Record<string, number>, click) => {
        acc[click.deviceType] = (acc[click.deviceType] || 0) + 1;
        return acc;
      }, {})
    )
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value),

    referrers: Object.entries(
      clicks.reduce((acc: Record<string, number>, click) => {
        const label =
          click.referrer === "(direct)"
            ? click.referrer
            : new URL(click.referrer).hostname;
        acc[label] = (acc[label] || 0) + 1;
        return acc;
      }, {})
    )
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8),
  };

  return (
    <div className="min-h-screen  p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 text-gray-600 mb-2">
            <FontAwesomeIcon icon={Link} className="w-4 h-4" />
            <span>Clicks</span>
          </div>
          <h1 className="text-4xl font-bold">{shortener.clicks}</h1>
        </div>

        <div className="bg-blue-50 bg-opacity-40 rounded-lg p-6 shadow-sm">
          <ClicksChart clicks={clicks} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatsList
            title="Countries"
            data={stats.countries}
            total={shortener.clicks}
          />
          <StatsList
            title="Devices"
            data={stats.devices}
            total={shortener.clicks}
          />
          <StatsList
            title="Referrers"
            data={stats.referrers}
            total={shortener.clicks}
          />
        </div>
      </div>
    </div>
  );
}
