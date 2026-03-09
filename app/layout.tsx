import "./globals.css";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import { DM_Sans, Playfair_Display } from "next/font/google";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata = {
  title: "Technical Aid — Engineering Solutions Bangladesh",
  description:
    "Technical Aid is Bangladesh's trusted engineering partner. We supply, install, service, and train across educational, industrial, and power sectors since 2018.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${playfair.variable}`}>
      <body className="min-h-screen font-sans">
        <Navbar />
        <div className="pt-16">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
