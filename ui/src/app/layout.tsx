import { Analytics } from "@vercel/analytics/next";
import { GeistSans } from "geist/font/sans";
import type { Metadata, Viewport } from "next";
import { JsonLd } from "~/components/json-ld";
import { ThemeProvider } from "~/components/theme-provider";
import { siteConfig } from "~/config/site";
import "~/styles/globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: siteConfig.themeColor,
};

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
  keywords: siteConfig.keywords,
  authors: [{ name: siteConfig.creator.name, url: siteConfig.creator.url }],
  creator: siteConfig.creator.name,
  publisher: siteConfig.creator.name,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  manifest: "/manifest.json",
  appleWebApp: {
    title: siteConfig.name,
    statusBarStyle: "default",
    capable: true,
  },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    creator: siteConfig.creator.twitter,
    site: siteConfig.creator.twitter,
  },
  verification: {
    google: "your-google-site-verification",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${GeistSans.variable}`}
    >
      <body suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Analytics />
        </ThemeProvider>
        <JsonLd />
      </body>
    </html>
  );
}
