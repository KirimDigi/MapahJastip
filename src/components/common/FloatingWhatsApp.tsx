import React from 'react';

export const FloatingWhatsApp: React.FC = () => {
  return (
    <aside aria-label="Kontak Cepat WhatsApp Shopper">
      <a
        href="https://wa.me/6281280905425?text=Halo%20Personal%20Shopper%20MapahJastip!%20Saya%20mau%20konsultasi%20titip%20belanja%20produk%20dari%20Jepang."
        target="_blank"
        rel="noreferrer"
        aria-label="Hubungi Personal Shopper via WhatsApp"
        title="Chat WhatsApp Shopper (0812-8090-5425)"
        className="fixed bottom-20 xl:bottom-6 right-4 sm:right-6 z-40 w-12 h-12 sm:w-14 sm:h-14 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-full shadow-[0_6px_20px_rgba(37,211,102,0.45)] hover:shadow-[0_8px_25px_rgba(37,211,102,0.6)] flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer group"
      >
        {/* Pulse Ripple Effect Animation */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-30 animate-ping pointer-events-none" />

        {/* WhatsApp Official SVG Logo Only */}
        <svg
          className="w-7 h-7 sm:w-8 sm:h-8 fill-current relative z-10 transition-transform group-hover:rotate-6"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2zm.01 1.67c4.54 0 8.24 3.7 8.24 8.24 0 2.2-.86 4.28-2.42 5.84a8.188 8.188 0 01-5.83 2.41c-1.48 0-2.94-.39-4.21-1.14l-.3-.18-3.12.82.83-3.04-.2-.31a8.167 8.167 0 01-1.25-4.39c0-4.54 3.7-8.25 8.26-8.25zm-3.6 3.12c-.2 0-.44.07-.66.32-.23.25-.87.85-.87 2.08 0 1.23.89 2.42 1.02 2.59.12.17 1.73 2.65 4.21 3.71.59.25 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.17-.48-.29-.25-.13-1.47-.73-1.7-.81-.23-.08-.39-.13-.56.12-.17.25-.66.82-.81.99-.15.17-.3.19-.55.07-.25-.13-1.07-.39-2.04-1.25-.75-.67-1.26-1.5-1.41-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.3.38-.45.13-.15.17-.25.25-.42.08-.17.04-.32-.02-.45-.06-.13-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43l-.48-.01z" />
        </svg>
      </a>
    </aside>
  );
};
