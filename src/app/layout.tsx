import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "영수증 관리 앱",
    template: "%s | 영수증 관리",
  },
  description: "모던하고 세련된 영수증 관리 애플리케이션",
  keywords: ["영수증", "관리", "가계부", "지출", "PWA"],
  authors: [{ name: "Receipt Manager" }],
  creator: "Receipt Management Team",
  publisher: "Receipt Management",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "영수증관리",
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://receipt-manager.app",
    title: "영수증 관리 앱",
    description: "모던하고 세련된 영수증 관리 애플리케이션",
    siteName: "영수증 관리",
  },
  twitter: {
    card: "summary_large_image",
    title: "영수증 관리 앱",
    description: "모던하고 세련된 영수증 관리 애플리케이션",
  },
  icons: {
    icon: [
      { url: "/icon.svg" },
      { url: "/pwa-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/pwa-512x512.png", sizes: "512x512", type: "image/png" },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#6366f1" },
    { media: "(prefers-color-scheme: dark)", color: "#8b5cf6" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <meta name="application-name" content="영수증관리" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-tap-highlight" content="no" />
      </head>
      <body
        className={`${inter.className} ios-safe-area`}
        suppressHydrationWarning
      >
        <div id="root" className="min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
