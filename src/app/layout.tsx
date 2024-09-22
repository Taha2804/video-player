import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Video Player App",
  description: "Developed by Krishna Modepalli",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* <link
          rel="stylesheet"
          href="https://site-assets.fontawesome.com/releases/v6.5.2/css/all.css"
        ></link> */}
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
