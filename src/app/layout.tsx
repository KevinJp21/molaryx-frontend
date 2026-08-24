import type { Metadata } from "next";
import { Inter, Geist } from "next/font/google";
import "./globals.css";
import { Providers } from "@/store/providers";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components";
import { AuthGuard } from "@/guard";

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  fallback: ["system-ui", "sans-serif"],
  preload: true
});

export const metadata: Metadata = {
  title: "Molaryx | Gestión de consultorios",
  description:
    "Plataforma para gestionar pacientes, historia clínica, citas, procedimientos, tratamientos y pagos de tu consultorio. Para cualquier especialidad.",
  appleWebApp: {
    title: "Molaryx",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={cn("h-full", "antialiased", inter.variable, "font-sans", geist.variable)}
    >
      <body className="min-h-full flex flex-col">
        <Providers>
          <AuthGuard>
            {children}
          </AuthGuard>
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
