"use client";

import { useEffect, useState } from "react";
import { Link2 } from "lucide-react";
import Toggle from "./Toggle";

export const URLInput = () => {
  const [url, setUrl] = useState("");
  const [autoPaste, setAutoPaste] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    // TODO: Implement the BE functionality here
    e.preventDefault();
    if (url.trim()) {
      console.log("Shortening URL:", url.trim());
      setUrl("");
    }
  };

  useEffect(() => {
    if (autoPaste) {
      navigator.clipboard.readText().then((text) => {
        if (text.startsWith("http")) {
          setUrl(text);
        }
      });
    }
  }, [autoPaste]);

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto">
      <div className="relative flex items-center">
        <Link2 className="absolute left-4 text-gray-400" size={20} />
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter the link here"
          className="w-full pl-12 pr-44 py-4 bg-white dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700 rounded-full text-gray-900 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
        />
        <button
          type="submit"
          className="absolute right-2 px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
        >
          Shorten Now!
        </button>
      </div>
      <div className="flex items-center justify-center mt-4 text-sm text-gray-600 dark:text-gray-400">
        <label className="flex items-center space-x-2 cursor-pointer">
          <Toggle
            checked={autoPaste}
            onChange={() => setAutoPaste(!autoPaste)}
            label="Auto Paste from Clipboard"
          />
        </label>
      </div>
    </form>
  );
};