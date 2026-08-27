import type { Metadata } from "next";
import { PlatformTemplate } from "@/features/platform/template";
import { noIndexRobots } from "@/lib/seo";
import { siteName } from "@/consts/site";

export const metadata: Metadata = {
  title: {
    default: "Plataforma",
    template: `%s | ${siteName}`,
  },
  robots: noIndexRobots,
};

type Props = {
  children: React.ReactNode;
};

export default function PlatformLayout({ children }: Props) {
  return <PlatformTemplate>{children}</PlatformTemplate>;
}
