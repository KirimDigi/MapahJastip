import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { ExchangeRateProvider } from './context/ExchangeRateContext';
import { ThemeProvider } from './context/ThemeContext';
import { MainLayout } from './components/layout/MainLayout';
import { HomePage } from './pages/HomePage';
import { CatalogPage } from './pages/CatalogPage';
import { CalculatorPage } from './pages/CalculatorPage';
import { HowToShopPage } from './pages/HowToShopPage';
import { LiveShoppingPage } from './pages/LiveShoppingPage';
import { TestimonialsPage } from './pages/TestimonialsPage';
import { OrderStatusPage } from './pages/OrderStatusPage';
import { ConsultationPage } from './pages/ConsultationPage';
import { CheckoutPage } from './pages/CheckoutPage';

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <ExchangeRateProvider>
        <CartProvider>
          <HashRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="katalog" element={<CatalogPage />} />
            <Route path="produk" element={<CatalogPage />} />
            <Route path="estimasi" element={<CalculatorPage />} />
            <Route path="cara-belanja" element={<HowToShopPage />} />
            <Route path="cara-kerja" element={<HowToShopPage />} />
            <Route path="live-belanja" element={<LiveShoppingPage />} />
            <Route path="testimoni" element={<TestimonialsPage />} />
            <Route path="status-pesanan" element={<OrderStatusPage />} />
            <Route path="konsultasi-shopper" element={<ConsultationPage />} />
            <Route path="checkout" element={<CheckoutPage />} />
            {/* Catch-all redirect to Home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </HashRouter>
        </CartProvider>
      </ExchangeRateProvider>
    </ThemeProvider>
  );
};

export default App;
