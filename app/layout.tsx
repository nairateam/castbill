import type { Metadata } from "next";
import { Lora } from "next/font/google";
import "./globals.css";
import { getServerSession } from "next-auth/next";
import SessionProvider from "@/components/SessionProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "sonner";

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "CastBill - Smart Invoicing for Modern Businesses",
  description: "Smart Invoicing for Modern Businesses & Freelancers.",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getServerSession();

  return (
    <html lang="en" className={`${lora.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col">
        <SessionProvider session={session}>
          <ThemeProvider>
            <Toaster
              position="bottom-right"
              toastOptions={{
                style: {
                  background: "#18181b",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "#fff",
                },
              }}
            />
            {children}
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}