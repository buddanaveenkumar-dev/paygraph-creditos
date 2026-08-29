import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PayGraph CreditOS",
  description: "Worker financial-products decisioning and employer commercial-risk infrastructure for workforce platforms.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
