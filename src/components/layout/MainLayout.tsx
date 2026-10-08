import React from 'react';
import { Outlet } from 'react-router-dom';
import { AnnouncementBar } from './AnnouncementBar';
import { Header } from './Header';
import { Footer } from './Footer';
import { CartDrawer } from '../cart/CartDrawer';
import { MobileBottomNav } from './MobileBottomNav';
import { FloatingWhatsApp } from '../common/FloatingWhatsApp';

export const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface">
      <AnnouncementBar />
      <Header />
      <main className="flex-1 w-full pb-20 xl:pb-0">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
      <FloatingWhatsApp />
      <MobileBottomNav />
    </div>
  );
};
