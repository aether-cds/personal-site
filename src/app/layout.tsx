import type { Metadata, Viewport } from "next";
import { Inter, Mukta, Unbounded } from "next/font/google";
import "./globals.css";
import CustomCursor from "@/components/CustomCursor";
import SmoothScroll from "@/components/motion/SmoothScroll";
import { site } from "@/data/site";

const unbounded = Unbounded({
  subsets: ["latin"],
  weight: "900",
  variable: "--font-unbounded",
  display: "swap",
});

const mukta = Mukta({
  subsets: ["devanagari", "latin"],
  weight: "800",
  variable: "--font-mukta",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const title = `${site.name} — ${site.role}`;
const description = `${site.intro} ${site.nepalLine}`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: title,
    template: `%s — ${site.name}`,
  },
  description,
  applicationName: `${site.name} Portfolio`,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  keywords: [
    site.name,
    site.role,
    "portfolio",
    "Kathmandu",
    "Nepal",
    "creative development",
    "interactive design",
    "Next.js",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title,
    description,
    url: "/",
    siteName: `${site.name} Portfolio`,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#DC143C",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${unbounded.variable} ${mukta.variable} ${inter.variable}`}
    >
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <div className="viewport-frame" aria-hidden="true" />
        <SmoothScroll>{children}</SmoothScroll>
        <CustomCursor />
      </body>
    </html>
  );
}
