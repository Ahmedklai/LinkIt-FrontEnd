"use client";

import { URLTable } from "@/components/URLTable";
import { getShortenedUrls, ShortenedUrl } from "../../api/getShortenedUrls";
import URLInput from "@/components/URLInput";
import { useEffect, useState } from "react";
import { createNewUrl, CreateNewUrlPayload } from "../../api/createNewUrl";

export default function HomePage() {
  const [shortenedUrls, setShortenedUrls] = useState<ShortenedUrl[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchShortenedUrls = async () => {
    setIsLoading(true);
    const urls = await getShortenedUrls();
    setShortenedUrls(urls);
    setIsLoading(false);
  };

  const createNew = async (url: CreateNewUrlPayload) => {
    const newUrlResponse = await createNewUrl(url);

    if (newUrlResponse?.success) {
      setShortenedUrls((prev) => [newUrlResponse.url, ...prev]);
    }

    return {
      success: newUrlResponse?.success ?? false,
    };
  };

  useEffect(() => {
    fetchShortenedUrls();
  }, []);

  return (
    <main className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-5xl leading-loose font-bold  mb-4 bg-gradient-to-r from-blue-500 via-pink-500 to-blue-500 text-transparent bg-clip-text">
          Shorten Your Loooooooong Links :)
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          LinkIt is an efficient and easy-to-use URL shortening service that
          streamlines your online experience.
        </p>
      </div>

      <URLInput createNewUrl={createNew} />

      <div className="text-center mt-4 text-sm text-gray-600 dark:text-gray-400">
        <span>You can create </span>
        <span className="text-pink-500">05</span>
        <span> more links. </span>
        <a href="/register" className="text-blue-500 hover:underline">
          Register Now
        </a>
        <span> to enjoy Unlimited usage</span>
      </div>

      <URLTable entries={shortenedUrls} isLoading={isLoading} />

      <div className="text-center mt-8">
        <a href="/register" className="text-blue-500 hover:underline">
          Register Now
        </a>
        <span className="text-gray-600 dark:text-gray-400">
          {" "}
          to enjoy Unlimited History
        </span>
      </div>
    </main>
  );
}
