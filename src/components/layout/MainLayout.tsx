import React from 'react';
import { Header } from '../common/Header';
import { Footer } from '../common/Footer';

interface MainLayoutProps {
  children: React.ReactNode;
  hideFooter?: boolean;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children, hideFooter = false }) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50/70 text-slate-800">
      <Header />
      <main className="flex-1 w-full">{children}</main>
      {!hideFooter && <Footer />}
    </div>
  );
};
