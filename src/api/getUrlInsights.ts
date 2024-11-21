import { BASE_API_PATH } from "../app/constants";

export interface Insights {
  clicks: Click[];
  id: string;
  shortener: Shortener;
  timestamp: Date;
}

export interface Click {
  id: string;
  timestamp: Date;
  location: string;
  deviceType: string;
  referrer: string;
}

export interface Shortener {
  clicks: number;
  createdAt: Date;
  expiryDate: null;
  id: string;
  isActive: boolean;
  originalUrl: string;
  securityCode: string;
  shortenedUrl: string;
  tags: string[];
}

const locations = [
  "US",
  "GB",
  "CA",
  "AU",
  "IN",
  "PK",
  "DE",
  "TUN",
  "US",
  "GB",
  "DE",
]; // to simulate numbers with a bigger difference
const deviceTypes = ["Desktop", "iPhone", "Android", "Tablet"];
const referrers = [
  "https://google.com",
  "https://facebook.com",
  "https://twitter.com",
  "https://linkedin.com",
];

const getRandomElement = (arr: string[]) =>
  arr[Math.floor(Math.random() * arr.length)];

const generateRandomClick = (): Click => ({
  id: Math.random().toString(36).substr(2, 9),
  timestamp: new Date(Date.now() - Math.floor(Math.random() * 1000000000)),
  location: getRandomElement(locations),
  deviceType: getRandomElement(deviceTypes),
  referrer: getRandomElement(referrers),
});

const generateRandomClicks = (count: number): Click[] => {
  return Array.from({ length: count }, generateRandomClick);
};

const mockResponse: Insights = {
  id: "1",
  clicks: generateRandomClicks(159),
  shortener: {
    clicks: 159,
    createdAt: new Date(),
    expiryDate: null,
    id: "1",
    isActive: true,
    originalUrl: "https://example.com",
    securityCode: "1234",
    shortenedUrl: "https://example.com/1234",
    tags: ["example"],
  },
  timestamp: new Date(),
};

export const getUrlInsights = async (id: string): Promise<Insights | null> => {
  try {
    const response = await fetch(`${BASE_API_PATH}/insights:${id}`);

    if (!response.ok) {
      throw new Error("Failed to fetch data from server");
    }

    // return response.json();
    return mockResponse;
  } catch (error) {
    console.error("Failed to fetch data from server", error);
    return null;
  }
};
