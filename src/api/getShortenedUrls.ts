import { BASE_API_PATH } from "@/constants";

export type ShortenedUrl = {
  id: string;
  originalUrl: string;
  shortenedUrl: string;
  clicks: number;
  isActive: boolean;
  createdAt: string;
  expiryDate: string;
};

export const getShortenedUrls = async (): Promise<ShortenedUrl[]> => {
  try {
    const response = await fetch(BASE_API_PATH + "/");

    if (!response.ok) {
      throw new Error("Failed to fetch data from server");
    }

    return response.json();
  } catch (error) {
    console.error("Failed to fetch data from server", error);
    return [];
  }
};
