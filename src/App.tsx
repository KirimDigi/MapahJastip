import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { ExchangeRateProvider } from './context/ExchangeRateContext';
import { ThemeProvider } from './context/ThemeContext';
import { MainLayout } from './components/layout/MainLayout';
import { HomePage } from './pages/HomePage';
import { CatalogPage } from './pages/CatalogPage';
import { CalculatorPage } from './pages/CalculatorPage';
import { HowToShopPage } from './pages/HowToShopPage';
import { TestimonialsPage } from './pages/TestimonialsPage';
import { OrderStatusPage } from './pages/OrderStatusPage';
import { ConsultationPage } from './pages/ConsultationPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { FlightSchedulePage } from './pages/FlightSchedulePage';
import { AuthPage } from './pages/AuthPage';
import { FaqPage } from './pages/FaqPage';
import { AdminPage } from './pages/AdminPage';
import { SplashScreen } from './components/common/SplashScreen';
import { ScrollToTop } from './components/common/ScrollToTop';
import { LanguageProvider } from './context/LanguageContext';

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <SplashScreen />
        <ExchangeRateProvider>
          <AuthProvider>
            <CartProvider>
              <HashRouter>
                <ScrollToTop />
                <Routes>
                  {/* Dedicated Admin Portal Route */}
                  <Route path="/admin" element={<AdminPage />} />

                  {/* Public Storefront Routes with MainLayout */}
                  <Route path="/" element={<MainLayout />}>
                    <Route index element={<HomePage />} />
                    <Route path="katalog" element={<CatalogPage />} />
                    <Route path="produk" element={<CatalogPage />} />
                    <Route path="estimasi" element={<CalculatorPage />} />
                    <Route path="cara-belanja" element={<HowToShopPage />} />
                    <Route path="cara-kerja" element={<HowToShopPage />} />
                    <Route path="jadwal-penerbangan" element={<FlightSchedulePage />} />
                    <Route path="testimoni" element={<TestimonialsPage />} />
                    <Route path="status-pesanan" element={<OrderStatusPage />} />
                    <Route path="faq" element={<FaqPage />} />
                    <Route path="tanya-jawab" element={<FaqPage />} />
                    <Route path="konsultasi-shopper" element={<ConsultationPage />} />
                    <Route path="checkout" element={<CheckoutPage />} />
                    <Route path="masuk" element={<AuthPage />} />
                    <Route path="login" element={<AuthPage />} />
                    <Route path="daftar" element={<AuthPage defaultMode="register" />} />
                    <Route path="register" element={<AuthPage defaultMode="register" />} />
                    {/* Catch-all redirect to Home */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Route>
                </Routes>
            </HashRouter>
          </CartProvider>
        </AuthProvider>
      </ExchangeRateProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;
