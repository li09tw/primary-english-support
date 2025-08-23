import type { Metadata } from "next";
import { generateMetadata } from "@/lib/metadata";

export const metadata: Metadata = generateMetadata("apiTest");

export default function ApiTestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
