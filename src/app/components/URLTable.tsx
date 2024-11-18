import {
  faClone as Copy,
  faExternalLink as External,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface URLEntry {
  shortLink: string;
  originalLink: string;
  qrCode: string;
  clicks: number;
  status: "active" | "inactive";
  date: string;
}

interface URLTableProps {
  entries: URLEntry[];
}

export const URLTable = ({ entries }: URLTableProps) => {
  return (
    <div className="w-full overflow-x-auto mt-8">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            <th className="p-4 text-gray-600 dark:text-gray-400">Short Link</th>
            <th className="p-4 text-gray-600 dark:text-gray-400">
              Original Link
            </th>
            <th className="p-4 text-gray-600 dark:text-gray-400">QR Code</th>
            <th className="p-4 text-gray-600 dark:text-gray-400">Clicks</th>
            <th className="p-4 text-gray-600 dark:text-gray-400">Status</th>
            <th className="p-4 text-gray-600 dark:text-gray-400">Date</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, index) => (
            <tr
              key={index}
              className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/30"
            >
              <td className="p-4">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-700 dark:text-gray-300">
                    {entry.shortLink}
                  </span>
                  <button className="p-1 hover:text-blue-500 transition-colors">
                    <FontAwesomeIcon icon={Copy} size="sm" />
                  </button>
                </div>
              </td>
              <td className="p-4">
                <div className="flex items-center space-x-2">
                  <img
                    src={`https://www.google.com/s2/favicons?domain=${entry.originalLink}`}
                    className="w-4 h-4"
                    alt=""
                  />
                  <span className="text-gray-700 dark:text-gray-300 truncate max-w-xs">
                    {entry.originalLink}
                  </span>
                  <a
                    href={entry.originalLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500"
                  >
                    <FontAwesomeIcon icon={External} size="sm" />
                  </a>
                </div>
              </td>
              <td className="p-4">
                <img src={entry.qrCode} alt="QR Code" className="w-8 h-8" />
              </td>
              <td className="p-4 text-gray-700 dark:text-gray-300">
                {entry.clicks}
              </td>
              <td className="p-4">
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    entry.status === "active"
                      ? "bg-green-500/20 text-green-500"
                      : "bg-yellow-500/20 text-yellow-500"
                  }`}
                >
                  {entry.status}
                </span>
              </td>
              <td className="p-4 text-gray-700 dark:text-gray-300">
                {entry.date}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
