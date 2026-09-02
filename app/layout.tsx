import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PayGraph CreditOS",
  description: "PayGraph turns verified workforce data into worker-credit decisions, employer exposure controls and portfolio intelligence.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
