"use client";

import { useState } from "react";
import Sidebar from "@/components/sidebar/sidebar";
import Header from "@/components/header/header";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-gray-900/80" onClick={() => setSidebarOpen(false)} />
          <div className="fixed inset-y-0 left-0 w-64">
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex justify-between items-center">
            <div>
              © {new Date().getFullYear()} FinTrack. Todos os direitos reservados.
            </div>
            <div className="flex gap-4">
              <button className="hover:text-gray-700 dark:hover:text-gray-300">Termos</button>
              <button className="hover:text-gray-700 dark:hover:text-gray-300">Privacidade</button>
              <button className="hover:text-gray-700 dark:hover:text-gray-300">Suporte</button>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
