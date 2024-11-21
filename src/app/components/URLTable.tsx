import {
  faClone as Copy,
  faExternalLink as External,
  faLink as Link,
  faLinkSlash as LinkSlash,
  faSpinner as LoadingSpinner,
  faChartLine as ChartLine,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ShortenedUrl } from "../../api/getShortenedUrls";
import QRCode from "react-qr-code";

interface URLTableProps {
  entries: ShortenedUrl[];
  isLoading: boolean;
}

export const URLTable = ({ entries, isLoading }: URLTableProps) => {
  const onPressCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };
  return (
    <div className="w-full overflow-x-auto mt-8">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-gray-700">
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
        {isLoading ? (
          <tbody>
            <tr className="relative h-24 w-screen">
              <td>
                <FontAwesomeIcon
                  icon={LoadingSpinner}
                  className="absolute top-8 left-[50%] animate-spin h-12 w-12"
                />
              </td>
            </tr>
          </tbody>
        ) : (
          <tbody>
            {entries.map((entry, index) => (
              <tr
                key={index}
                className="border-b  border-gray-800 hover:bg-gray-800/30"
              >
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    <a
                      href={entry.shortenedUrl}
                      target="_blank"
                      className="text-gray-700 dark:text-gray-300"
                    >
                      {entry.shortenedUrl}
                    </a>
                    <button
                      onClick={() => onPressCopy(entry.shortenedUrl)}
                      className="rounded-full p-1 dark:bg-[#252626] hover:text-blue-500 transition-colors h-9 w-9"
                    >
                      <FontAwesomeIcon icon={Copy} className="h-4 w-4" />
                    </button>

                    <a
                      href={`/insights/${entry.id}`}
                      target="_blank"
                      className="rounded-full dark:bg-[#252626] hover:text-blue-500 transition-colors h-9 w-9 flex justify-center items-center"
                    >
                      <FontAwesomeIcon icon={ChartLine} className="h-4 w-4" />
                    </a>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    <img
                      src={`https://www.google.com/s2/favicons?domain=${entry.originalUrl}`}
                      className="w-4 h-4"
                      alt=""
                    />
                    <span className="text-gray-700 dark:text-gray-300 truncate max-w-xs">
                      {entry.originalUrl}
                    </span>
                    <a
                      href={entry.originalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500"
                    >
                      <FontAwesomeIcon icon={External} className="h-4 w-4" />
                    </a>
                  </div>
                </td>
                <td className="p-1">
                  <div className="flex h-full justify-center items-center">
                    <QRCode
                      style={{ height: 48, width: 48 }}
                      value={entry.shortenedUrl}
                      viewBox={`0 0 48 48`}
                    />
                  </div>
                </td>
                <td className="p-4 text-gray-700 dark:text-gray-300">
                  {entry.clicks}
                </td>
                <td className="p-4">
                  <div
                    className={`flex rounded-full px-2 items-center gap-1 w-fit ${
                      entry.isActive
                        ? "bg-green-500 dark:bg-transparent"
                        : "bg-yellow-500 dark:bg-transparent"
                    }`}
                  >
                    <span
                      className={` rounded-full text-xs leading-none ${
                        entry.isActive
                          ? " dark:text-green-500 text-green-900"
                          : " dark:text-yellow-500 text-yellow-900"
                      }`}
                    >
                      {entry.isActive ? "Active" : "Inactive"}
                    </span>
                    <div
                      className={`rounded-full ${
                        entry.isActive
                          ? " dark:text-green-500 text-green-900"
                          : " dark:text-yellow-500 text-yellow-900"
                      }`}
                    >
                      {entry.isActive ? (
                        <FontAwesomeIcon icon={Link} className="h-4 w-4" />
                      ) : (
                        <FontAwesomeIcon icon={LinkSlash} className="h-4 w-4" />
                      )}
                    </div>
                  </div>
                </td>
                <td className="p-4 text-gray-700 dark:text-gray-300">
                  {new Date(entry.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        )}
      </table>
    </div>
  );
};
