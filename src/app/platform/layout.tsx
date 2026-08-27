import { PlatformTemplate } from "@/features/platform/template";

type Props = {
  children: React.ReactNode;
};

export default function PlatformLayout({ children }: Props) {
  return <PlatformTemplate>{children}</PlatformTemplate>;
}
