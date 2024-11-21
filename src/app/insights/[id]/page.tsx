import AnalyticsView from "./AnalyticsView";
import { getUrlInsights } from "../../../api/getUrlInsights";
import { notFound } from "next/navigation";

import type { Metadata, ResolvingMetadata } from "next";
import { getShortenedUrls } from "../../../api/getShortenedUrls";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = (await params).id;
  const insights = await getUrlInsights(id);

  return {
    title: `Analytics for ${insights?.shortener.shortenedUrl}`,
    description: `View analytics and insights for ${insights?.shortener.shortenedUrl}`,
  };
}

export async function generateStaticParams() {
  const urls = await getShortenedUrls();
  return urls.map((url) => ({
    id: url.id,
  }));
}

export default async function InsightsPage({ params }: Props) {
  const id = (await params).id;
  const insights = await getUrlInsights(id);

  if (!insights) {
    notFound();
  }

  return <AnalyticsView insights={insights} />;
}
