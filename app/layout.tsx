import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PayGraph CreditOS",
  description: "Payroll-native credit intelligence, explainable decisioning and real-time portfolio monitoring for workforce platforms.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
