import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Supper Club | Recipe ideas",
  description: "Choose a dish, pick your ingredients, and get three recipe ideas."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
