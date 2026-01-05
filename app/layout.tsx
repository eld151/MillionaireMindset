import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Import your components
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MillionaireMindset",
  description: "We all have it... let's find it together",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 text-gray-900`}>
        {/* Top Navbar (Logo & Slogan area) */}
        <Navbar />

        <div className="flex min-h-screen">
          {/* Left Sidebar (Fixed width) */}
          <aside className="w-64 hidden md:block border-r border-gray-200">
            <Sidebar />
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>

        <Footer />
      </body>
    </html>
  );
}