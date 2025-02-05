import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OURO",
  description: "OURO WEBAPP",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
       <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />
        {children}
      </body>
    </html>
  );
}
