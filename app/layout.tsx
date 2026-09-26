import type { Metadata } from "next";
import { Inter, Oswald } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const oswald = Oswald({
  variable: "--font-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FitLog | Workout Library",
  description: "FitLog workout library and training planner",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${oswald.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 1800,
            style: {
              background: "rgba(17, 21, 25, 0.96)",
              color: "#d9ff3f",
              border: "1px solid rgba(217, 255, 63, 0.35)",
              borderRadius: "12px",
              padding: "12px 14px",
              boxShadow: "0 12px 26px rgba(0, 0, 0, 0.18)",
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}
