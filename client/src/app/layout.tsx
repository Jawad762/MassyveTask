import type { Metadata } from "next";
import "./globals.css";
import { Fira_Sans_Condensed } from 'next/font/google'
import AuthChecker from "@/components/Auth/AuthChecker";
import ReduxProvider from "@/components/Shared/ReduxProvider";

const FiraFont = Fira_Sans_Condensed({ weight: '400', subsets: ['latin'] })

export const metadata: Metadata = {
  title: "Massyve Task"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <html lang="en" className="h-full w-full">
      <body
        className={`${FiraFont.className} antialiased h-full w-full bg-darkPrimary text-white`}
      >
        <main className="h-full w-full flex flex-col">
          <ReduxProvider>
            <AuthChecker>
              {children}
            </AuthChecker>
          </ReduxProvider>
        </main>
      </body>
    </html>
  );
}
