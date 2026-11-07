import type { Metadata, Viewport } from "next";
import "./globals.css";
import CustomCursor from "@/components/CustomCursor";
import SmoothScroll from "@/components/motion/SmoothScroll";
import { site } from "@/data/site";

const title = `${site.name} — ${site.role}`;

export const metadata: Metadata = {
  title: {
    default: title,
    template: `%s — ${site.name}`,
  },
  description: site.intro,
  applicationName: `${site.name} Portfolio`,
  authors: [{ name: site.name }],
  keywords: [
    site.name,
    site.role,
    "portfolio",
    "Kathmandu",
    "Nepal",
    "creative development",
  ],
  openGraph: {
    title,
    description: site.intro,
    type: "website",
    locale: "en_US",
    siteName: `${site.name} Portfolio`,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: site.intro,
  },
};

export const viewport: Viewport = {
  themeColor: "#DC143C",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>
        <SmoothScroll>{children}</SmoothScroll>
        <CustomCursor />
      </body>
    </html>
  );
}
