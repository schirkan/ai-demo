import type { Metadata } from "next";
import "../css/globals.css";

export const metadata: Metadata = {
  title: "AI Demo",
  description: "powered by AI SDK",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body>
        {children}
      </body>
    </html>
  );
}
