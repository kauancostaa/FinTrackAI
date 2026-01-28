import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { Toaster } from "sonner";
import MainLayout from "@/components/layout/main-layout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FinTrack | Sistema Completo de Gestão Financeira",
  description: "Sistema avançado de detecção de fraudes, análise de riscos e gestão de transações bancárias",
};

// Componente para evitar hydration errors
function NoSSR({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <NoSSR>
          <QueryProvider>
            <ThemeProvider>
              <MainLayout>
                {children}
              </MainLayout>
              <Toaster
                position="top-right"
                richColors
                expand={true}
                closeButton
                theme="system"
              />
            </ThemeProvider>
          </QueryProvider>
        </NoSSR>
      </body>
    </html>
  );
}
