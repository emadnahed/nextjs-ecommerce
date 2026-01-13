import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/config/site";
import { ReactQueryProvider } from "@/providers/ReactQueryProvider";
import { ToastProvider } from "@/providers/toast-provider";
import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: ["ecommerce", "shopping", "online store", "Foticket", "fashion", "electronics", "home decor"],
  authors: [{ name: "Foticket" }],
  creator: "Foticket",
  icons: [
    {
      url: "/favicon.svg",
      href: "/favicon.svg",
      type: "image/svg+xml",
    },
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <ReactQueryProvider>
            <ToastProvider />
            {children}
          </ReactQueryProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
