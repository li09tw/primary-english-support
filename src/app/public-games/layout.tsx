import { generateMetadata } from "@/lib/metadata";
import { Metadata } from "next";

export const metadata: Metadata = generateMetadata("public-games");

export default function ExternalLinksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
