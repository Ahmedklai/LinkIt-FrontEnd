import { Metadata } from "next";
import { getUrlInsights } from "../../../api/getUrlInsights";
import AnalyticsView from "./AnalyticsView";
import { notFound } from "next/navigation";

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const insights = await getUrlInsights(params.id);

  return {
    title: `Analytics for ${insights?.shortener.shortenedUrl}`,
    description: `View analytics and insights for ${insights?.shortener.shortenedUrl}`,
  };
}

export default async function AnalyticsPage({ params }: Props) {
  const insights = await getUrlInsights(params.id);

  if (!insights) {
    return notFound();
  }

  return <AnalyticsView insights={insights} />;
}
