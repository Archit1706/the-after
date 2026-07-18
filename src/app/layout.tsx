import type { Metadata, Viewport } from "next";
import { Inter, Fraunces, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://theafter.vercel.app"),
  title: {
    default: "The After — a gentle guide through what comes after",
    template: "%s · The After",
  },
  description:
    "A gentle guide for what to do when someone dies: organize who to notify, documents, accounts, and estate tasks one calm step at a time.",
  applicationName: "The After",
  keywords: [
    "what to do when someone dies checklist",
    "who to notify when someone dies",
    "how to settle an estate",
    "how many death certificate copies do I need",
    "do I need probate",
    "how to close a deceased person's accounts",
    "death admin help",
  ],
  openGraph: {
    title: "The After — a gentle guide through what comes after",
    description:
      "A gentle guide for the practical tasks after a loss — one calm step at a time.",
    type: "website",
    siteName: "The After",
    locale: "en_US",
    url: "/",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "The After — a gentle guide through what comes after",
    description:
      "A gentle guide for the practical tasks after a loss — one calm step at a time.",
    images: ["/twitter-image"],
  },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf6f0" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1714" },
  ],
  colorScheme: "light dark",
  width: "device-width",
  initialScale: 1,
};

// Runs before paint so an explicit theme choice never flashes.
const themeInitScript = `
try {
  var t = localStorage.getItem('the-after-theme');
  if (t === 'dark' || t === 'light') {
    document.documentElement.setAttribute('data-theme', t);
  }
} catch (e) {}
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${fraunces.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <a
          href="#main"
          className="sr-only fixed left-4 top-4 z-50 rounded-lg bg-primary px-4 py-2 text-primary-foreground focus:not-sr-only"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
