import { BASE_API_PATH } from "@/constants";
import { ShortenedUrl } from "./getShortenedUrls";

type FormValues = {
  originalUrl: string;
  tags?: string[] | null;
  securityCode?: string | null;
  expiryDate?: Date | null;
};

export const createNewUrl = async (
  data: FormValues
): Promise<
  | (ShortenedUrl & {
      success: boolean;
    })
  | null
> => {
  try {
    const response = await fetch(`${BASE_API_PATH}/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch data from server");
    }

    return {
      success: true,
      ...(await response.json()),
    };
  } catch (error) {
    console.error("Failed to fetch data from server", error);
    return null;
  }
};
