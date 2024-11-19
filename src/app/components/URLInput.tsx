"use client";

import React, { useState, useEffect } from "react";
import FormModal from "./FormModal";
import Toggle from "./Toggle";
import { faLink as Link } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const URLInput: React.FC = () => {
  const [url, setUrl] = useState("");
  const [autoPaste, setAutoPaste] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    <div className="flex flex-col w-full justify-center items-center">
      <div className="relative flex items-center min-w-[50%]">
        <FontAwesomeIcon
          className="absolute left-4 text-gray-400 h-5 w-5 text-sm"
          icon={Link}
        />
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter the link here"
          className="w-full pl-12 pr-44 py-3 bg-white dark:bg-gray-800/50 border-4 border-gray-300 dark:border-gray-700 rounded-full text-gray-900 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors placeholder:text-sm"
        />
        <button
          type="button"
          className="absolute right-2.5 px-4 text-sm py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
          onClick={() => setIsModalOpen(true)}
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
      <FormModal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        initialUrl={url}
      />
    </div>
  );
};

export default URLInput;
