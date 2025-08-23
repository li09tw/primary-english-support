import type { Metadata } from "next";
import { generateMetadata } from "@/lib/metadata";

export const metadata: Metadata = generateMetadata("garden");

export default function GardenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
