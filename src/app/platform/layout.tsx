import type { Metadata } from "next";
import { PlatformTemplate } from "@/features/platform/template";
import { noIndexRobots } from "@/lib/seo";

export const metadata: Metadata = {
  robots: noIndexRobots,
};

type Props = {
  children: React.ReactNode;
};

export default function PlatformLayout({ children }: Props) {
  return <PlatformTemplate>{children}</PlatformTemplate>;
}
