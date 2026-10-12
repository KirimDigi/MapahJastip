import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage, Language } from '../context/LanguageContext';
import { generateGeneralConsultationUrl } from '../utils/whatsapp';

interface ExtendedFaqItem {
  id: string;
  category: 'alur' | 'kurs' | 'cukai' | 'barang';
  categoryLabel: string;
  question: string;
  answer: string;
}

const FAQ_CATEGORIES_BY_LANG: Record<Language, { id: string; label: string }[]> = {
  id: [
    { id: 'all', label: 'Semua Pertanyaan' },
    { id: 'alur', label: 'Pemesanan & Alur' },
    { id: 'kurs', label: 'Kurs & Pembayaran' },
    { id: 'cukai', label: 'Bea Cukai & Legalitas' },
    { id: 'barang', label: 'Barang & Packing' },
  ],
  en: [
    { id: 'all', label: 'All Questions' },
    { id: 'alur', label: 'Ordering & Process' },
    { id: 'kurs', label: 'Rates & Payment' },
    { id: 'cukai', label: 'Customs & Legality' },
    { id: 'barang', label: 'Items & Packaging' },
  ],
  ja: [
    { id: 'all', label: 'すべての質問' },
    { id: 'alur', label: 'ご注文・流れ' },
    { id: 'kurs', label: '為替レート・決済' },
    { id: 'cukai', label: '通関・税関保証' },
    { id: 'barang', label: '取扱商品・梱包' },
  ],
};

const FAQ_BY_LANG: Record<Language, ExtendedFaqItem[]> = {
  id: [
    {
      id: 'faq-1',
      category: 'alur',
      categoryLabel: 'Pemesanan & Alur',
      question: 'Apakah ada batasan minimal nilai belanja?',
      answer:
        'Tidak ada minimal belanja! Anda bisa menitip barang satuan seperti gantungan kunci seharga ¥500, snack viral, hingga pesanan skincare tunggal. Biaya jastip disesuaikan secara proporsional dan transparan sesuai kategori dan berat barang.',
    },
    {
      id: 'faq-2',
      category: 'alur',
      categoryLabel: 'Pemesanan & Alur',
      question: 'Bagaimana jika barang yang dititipkan habis atau out of stock di toko fisik Jepang?',
      answer:
        'Shopper kami di Tokyo akan mengabari langsung melalui WhatsApp secara real-time dan memberikan opsi alternatif barang serupa di store lain. Apabila Anda tidak berkenan mengganti, dana deposit pembelian barang akan di-refund 100% tanpa potongan biaya apapun dalam waktu 1x24 jam.',
    },
    {
      id: 'faq-3',
      category: 'alur',
      categoryLabel: 'Pemesanan & Alur',
      question: 'Apakah bisa bantu bidding atau lelang di Mercari dan Yahoo Auctions?',
      answer:
        'Bisa banget! Tim concierge kami memiliki akun terverifikasi bintang 5 di Mercari Japan dan Yahoo Auctions. Kami akan memverifikasi reputasi seller Jepang terlebih dahulu sebelum submit bid untuk memastikan barang asli dan aman.',
    },
    {
      id: 'faq-4',
      category: 'cukai',
      categoryLabel: 'Bea Cukai & Legalitas',
      question: 'Bagaimana dengan perhitungan bea cukai dan pajak impornya?',
      answer:
        'Semua pengiriman kami melalui jalur resmi kargo berizin dengan pelunasan Bea Masuk, PPN, dan PPh impor resmi. Biaya invoice MapahJastip sudah all-in hingga gudang sortir Jakarta. Anda tidak akan pernah ditagih pajak susulan oleh pihak ekspedisi saat paket tiba di rumah.',
    },
    {
      id: 'faq-5',
      category: 'cukai',
      categoryLabel: 'Bea Cukai & Legalitas',
      question: 'Apakah setiap pembelian mendapatkan struk fisik asli?',
      answer:
        'Ya, 100%! Setiap pesanan resmi disertai struk fisik register kasir asli (original boutique/store receipt) dari toko di Jepang sebagai bukti keaslian mutlak dan jaminan bukan barang tiruan.',
    },
    {
      id: 'faq-6',
      category: 'kurs',
      categoryLabel: 'Kurs & Pembayaran',
      question: 'Metode pembayaran apa saja yang diterima?',
      answer:
        'Kami menerima transfer seluruh bank di Indonesia (BCA, Mandiri, BNI, BRI), QRIS instan, e-Wallet (GoPay, OVO, ShopeePay), serta metode pembayaran resmi lokal Jepang (JPQR, PayPay, Line Pay, Konbini Pay) untuk kemudahan transaksi.',
    },
    {
      id: 'faq-7',
      category: 'kurs',
      categoryLabel: 'Kurs & Pembayaran',
      question: 'Kapan kurs mata uang Yen ke Rupiah dikunci?',
      answer:
        'Kurs dikunci secara transparan pada saat Anda melakukan konfirmasi order dan pembayaran deposit, sesuai kurs live acuan harian yang tertera di website. Tidak ada fluktuasi biaya tersembunyi yang ditambahkan di kemudian hari.',
    },
    {
      id: 'faq-8',
      category: 'barang',
      categoryLabel: 'Barang & Packing',
      question: 'Apakah saya bisa menitip barang cair, skincare kaca, atau snack mudah remuk?',
      answer:
        'Bisa! Kami menyediakan standar packing ekstra Jepang dengan bubble wrap ganda berlapis, corner protector anti-peyok, serta karton tebal kokoh (Armor Box) sehingga kosmetik cair, parfum botol kaca, maupun biskuit rapuh aman sampai tujuan.',
    },
    {
      id: 'faq-9',
      category: 'barang',
      categoryLabel: 'Barang & Packing',
      question: 'Berapa lama estimasi barang sampai di Indonesia?',
      answer:
        'Untuk jalur Handcarry Shopper, estimasi tiba adalah 3-5 hari kerja setelah batch terbang dari Tokyo. Untuk jalur Scheduled Air Cargo, estimasi 7-10 hari kerja setelah lolos verifikasi kepabeanan Bandara Soekarno-Hatta (CGK).',
    },
  ],

  en: [
    {
      id: 'faq-1',
      category: 'alur',
      categoryLabel: 'Ordering & Process',
      question: 'Is there a minimum purchase amount requirement?',
      answer:
        'There is no minimum order! You can request single items such as ¥500 keychains, viral snacks, or individual skincare items. Service fees are transparently calculated based on category and weight.',
    },
    {
      id: 'faq-2',
      category: 'alur',
      categoryLabel: 'Ordering & Process',
      question: 'What happens if the item is out of stock in physical Japanese stores?',
      answer:
        'Our Tokyo shopper will message you in real-time via WhatsApp with alternative options or nearby stores. If you prefer not to substitute, your deposit is refunded 100% with zero cancellation fees within 24 hours.',
    },
    {
      id: 'faq-3',
      category: 'alur',
      categoryLabel: 'Ordering & Process',
      question: 'Can you help with bidding on Mercari Japan and Yahoo Auctions?',
      answer:
        'Yes, absolutely! Our concierge team maintains 5-star verified accounts on Mercari Japan and Yahoo Auctions. We verify seller ratings and authenticity before placing any bids to ensure safety.',
    },
    {
      id: 'faq-4',
      category: 'cukai',
      categoryLabel: 'Customs & Legality',
      question: 'How are customs clearance and import taxes calculated?',
      answer:
        'All shipments pass through official licensed cargo channels with full customs duty and import VAT/tax clearance. MapahJastip invoices are fully all-inclusive up to Jakarta Hub. You will never receive surprise tax bills at your doorstep.',
    },
    {
      id: 'faq-5',
      category: 'cukai',
      categoryLabel: 'Customs & Legality',
      question: 'Do I get the original physical store receipt with my order?',
      answer:
        'Yes, 100%! Every official order includes the original printed boutique register receipt from the store in Japan as absolute proof of genuine authenticity.',
    },
    {
      id: 'faq-6',
      category: 'kurs',
      categoryLabel: 'Rates & Payment',
      question: 'What payment methods do you accept?',
      answer:
        'We accept all major Indonesian bank transfers (BCA, Mandiri, BNI, BRI), QRIS, Indonesian e-wallets (GoPay, OVO, ShopeePay), as well as Japanese official payment methods (JPQR, PayPay, Line Pay, Konbini Pay).',
    },
    {
      id: 'faq-7',
      category: 'kurs',
      categoryLabel: 'Rates & Payment',
      question: 'When is the Yen to Rupiah exchange rate locked?',
      answer:
        'The exchange rate is transparently locked the moment you confirm your order and deposit payment, strictly matching our live reference exchange rate. Zero hidden currency fluctuation fees are ever added.',
    },
    {
      id: 'faq-8',
      category: 'barang',
      categoryLabel: 'Items & Packaging',
      question: 'Can I order liquid cosmetics, glass bottles, or delicate snacks?',
      answer:
        'Yes! We provide Japanese export-grade protection with triple-layer bubble wrap, corner box protectors, and reinforced Armor Boxes so liquid cosmetics, glass perfumes, and fragile pastries arrive intact.',
    },
    {
      id: 'faq-9',
      category: 'barang',
      categoryLabel: 'Items & Packaging',
      question: 'How long does shipping from Japan to Indonesia take?',
      answer:
        'For Shopper Handcarry, arrival takes 3-5 business days after departing Tokyo. For Scheduled Air Cargo, arrival takes 7-10 business days after customs clearance at Soekarno-Hatta (CGK).',
    },
  ],

  ja: [
    {
      id: 'faq-1',
      category: 'alur',
      categoryLabel: 'ご注文・流れ',
      question: '注文に最低購入金額の制限はありますか？',
      answer:
        '最低購入金額の制限は一切ございません！500円前後のキーホルダー1点や人気のお菓子、コスメ1点から喜んで代行いたします。代行手数料は商品のカテゴリーや重量に応じて明朗・透明に算出されます。',
    },
    {
      id: 'faq-2',
      category: 'alur',
      categoryLabel: 'ご注文・流れ',
      question: '日本の実店舗で依頼した商品が完売・在庫切れだった場合はどうなりますか？',
      answer:
        '東京現地のショッパーがWhatsAppよりリアルタイムで状況をご連絡し、近隣店舗での代替品のご案内や別店舗での再探索をご提案します。購入をキャンセルされる場合は、お預かりした購入代金を24時間以内に全額（手数料無料）ご返金いたします。',
    },
    {
      id: 'faq-3',
      category: 'alur',
      categoryLabel: 'ご注文・流れ',
      question: 'メルカリやヤフオクの代理入札・代理購入も対応していますか？',
      answer:
        'はい、もちろん対応しております！弊社の現地コンシェルジュチームはメルカリおよびヤフオクにて最高評価（★5）の正規アカウントを保有しています。入札前に出品者の評価履歴を厳格に確認し、偽物リスクを排除して安全にお取引します。',
    },
    {
      id: 'faq-4',
      category: 'cukai',
      categoryLabel: '通関・税関保証',
      question: '通関手続きや輸入関税の計算はどうなっていますか？',
      answer:
        '当社のすべての発送便は正規ライセンス航空貨物ルートを利用し、関税・付加価値税（PPN）・所得税（PPh）の納税申告を適正に完了しています。見積もり金額はジャカルタ配送拠点までのオールインクルーシブ価格となっており、お届け時に追加で税金が請求されることは一切ありません。',
    },
    {
      id: 'faq-5',
      category: 'cukai',
      categoryLabel: '通関・税関保証',
      question: '購入時に日本の実店舗の公式レシート原本は同封されますか？',
      answer:
        'はい、100%必ず同封されます！すべての商品に日本現地の正規ブティックや店舗で発行された正規レジレシート原本を同封いたします。本物であることの確実な証明となります。',
    },
    {
      id: 'faq-6',
      category: 'kurs',
      categoryLabel: '為替レート・決済',
      question: '利用可能な決済方法には何がありますか？',
      answer:
        'インドネシアの主要銀行振込（BCA、Mandiri、BNI、BRI）、QRIS即時決済、各種電子マネー（GoPay、OVO、ShopeePay）に加え、日本国内の公式決済（JPQR、PayPay、LINE Pay、コンビニ決済）にも対応しております。',
    },
    {
      id: 'faq-7',
      category: 'kurs',
      categoryLabel: '為替レート・決済',
      question: '円からルピアの為替レートはいつ確定（ロック）されますか？',
      answer:
        'ご注文確定および手付金のご入金時に、ウェブサイト上に表示されている当日の為替レートで確定・ロックされます。後から為替相場の変動による追加請求が発生することは一切ございません。',
    },
    {
      id: 'faq-8',
      category: 'barang',
      categoryLabel: '取扱商品・梱包',
      question: '液体コスメ、ガラス瓶製品、割れやすいお菓子も依頼できますか？',
      answer:
        'はい、対応可能です！日本基準の厳重梱包を実施しており、3重巻きの気泡緩衝材、ダンボール角当てプロテクター、高強度アーマーボックスを使用しますので、液体化粧品や香水のガラス瓶、繊細なお菓子も安全にお届けできます。',
    },
    {
      id: 'faq-9',
      category: 'barang',
      categoryLabel: '取扱商品・梱包',
      question: '日本発送からインドネシア到着までの目安日数はどれくらいですか？',
      answer:
        'ショッパーの手荷物ハンドキャリー便の場合、東京出発後3〜5営業日で到着します。定期航空貨物便の場合は、スカルノハッタ空港での通関完了を含めて7〜10営業日が目安となります。',
    },
  ],
};

export const FaqPage: React.FC = () => {
  const { t, language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({
    'faq-1': true,
    'faq-4': true,
  });

  const toggleItem = (id: string) => {
    setOpenIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const currentFaqList = FAQ_BY_LANG[language] || FAQ_BY_LANG.id;
  const currentCategories = FAQ_CATEGORIES_BY_LANG[language] || FAQ_CATEGORIES_BY_LANG.id;

  const filteredFaqs = useMemo(() => {
    return currentFaqList.filter((item) => {
      const matchCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchSearch =
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [currentFaqList, selectedCategory, searchQuery]);

  const searchPlaceholder =
    language === 'ja'
      ? 'お買い物代行、為替レート、配送に関する質問を検索...'
      : language === 'en'
      ? 'Search questions about ordering, rates, or cargo...'
      : 'Cari pertanyaan seputar jastip, kurs, atau kargo...';

  const emptyText =
    language === 'ja'
      ? 'キーワードに一致する質問は見つかりませんでした。'
      : language === 'en'
      ? 'No questions match your search keyword.'
      : 'Tidak ada pertanyaan yang sesuai dengan kata kunci.';

  const resetText =
    language === 'ja'
      ? '検索条件をリセット'
      : language === 'en'
      ? 'Reset Search'
      : 'Reset Pencarian';

  const ctaTitle =
    language === 'ja'
      ? '他にご質問はございますか？'
      : language === 'en'
      ? 'Have More Questions?'
      : 'Punya Pertanyaan Lain?';

  const ctaHeading =
    language === 'ja'
      ? '専属コンシェルジュが丁寧にお答えします'
      : language === 'en'
      ? 'Our Concierge Team is Here to Help 24/7'
      : 'Tim Concierge Kami Siap Membantu 24/7';

  const ctaDesc =
    language === 'ja'
      ? '特定の商品の取扱可否、為替レートのご相談、プライベート買付のご要望など、お気軽にWhatsAppよりお問い合わせください。'
      : language === 'en'
      ? 'Want to inquire about a specific item, special exchange rates, or private shopping? Consult directly via WhatsApp.'
      : 'Ingin menanyakan barang spesifik, estimasi kurs spesial, atau request pembelian privat? Konsultasikan langsung via WhatsApp.';

  const ctaBtn =
    language === 'ja'
      ? 'WhatsAppでお問い合わせ'
      : language === 'en'
      ? 'Inquire via WhatsApp'
      : 'Tanya via WhatsApp';

  return (
    <div className="w-full bg-surface pb-20">
      {/* 1. HERO HEADER */}
      <section className="relative w-full bg-gradient-to-b from-surface via-surface-container-low to-surface border-b border-border-subtle/60 py-12 sm:py-16 px-6 lg:px-12 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center space-y-4 relative z-10">
          {/* Breadcrumb */}
          <div className="flex items-center justify-center gap-2 text-xs text-text-secondary font-medium pb-2">
            <Link to="/" className="hover:text-primary transition-colors">
              {t('nav.home')}
            </Link>
            <span>/</span>
            <span className="text-on-surface font-semibold">FAQ</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-light-blue text-primary shadow-xs border border-primary/20">
            <span className="material-symbols-outlined text-[18px]">help_center</span>
            <span className="text-xs font-semibold tracking-wide uppercase">{t('faqPage.badge')}</span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl text-on-surface font-extrabold tracking-tight">
            {t('faqPage.title')}
          </h1>

          <p className="text-base sm:text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed">
            {t('faqPage.desc')}
          </p>

          {/* Search Bar */}
          <div className="pt-4 max-w-xl mx-auto">
            <div className="relative flex items-center bg-surface-container-lowest rounded-2xl border border-slate-200 dark:border-border-subtle shadow-sm focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all px-4 py-3">
              <span className="material-symbols-outlined text-text-secondary text-[22px] mr-3">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full bg-transparent text-sm text-on-surface placeholder:text-text-secondary/70 focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-text-secondary hover:text-on-surface text-xs font-semibold px-2 cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 2. CATEGORY PILLS & FAQ LIST */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10">
        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 mb-8">
          {currentCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-primary text-white shadow-xs'
                  : 'bg-surface-container-low text-text-secondary hover:bg-surface-light-blue hover:text-primary border border-border-subtle/60'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Accordion Questions */}
        {filteredFaqs.length > 0 ? (
          <div className="space-y-3.5">
            {filteredFaqs.map((item) => {
              const isOpen = !!openIds[item.id];
              return (
                <div
                  key={item.id}
                  onClick={() => toggleItem(item.id)}
                  className={`bg-surface-container-lowest rounded-2xl p-5 sm:p-6 border transition-all cursor-pointer ${
                    isOpen
                      ? 'border-primary/40 shadow-sm ring-1 ring-primary/10'
                      : 'border-border-subtle hover:border-slate-300 dark:hover:border-border-subtle/80 shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <span className="inline-block text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-surface-container-low text-primary">
                        {item.categoryLabel}
                      </span>
                      <h3 className="text-base sm:text-lg font-bold text-on-surface leading-snug">
                        {item.question}
                      </h3>
                    </div>
                    <span
                      className={`material-symbols-outlined text-text-secondary transition-transform duration-300 text-[22px] shrink-0 mt-1 ${
                        isOpen ? 'rotate-180 text-primary' : ''
                      }`}
                    >
                      expand_more
                    </span>
                  </div>

                  {isOpen && (
                    <div className="pt-3.5 text-sm sm:text-base text-text-secondary leading-relaxed border-t border-border-subtle/60 mt-3.5 animate-fadeIn">
                      {item.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 bg-surface-container-lowest rounded-2xl border border-border-subtle space-y-3">
            <span className="material-symbols-outlined text-text-secondary text-4xl">search_off</span>
            <p className="text-sm font-semibold text-on-surface">{emptyText}</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="text-xs text-primary font-bold hover:underline cursor-pointer"
            >
              {resetText}
            </button>
          </div>
        )}

        {/* 3. STILL HAVE QUESTIONS CARD */}
        <div className="mt-12 bg-gradient-to-r from-surface-light-blue to-surface-container-lowest p-6 sm:p-8 rounded-3xl border border-primary/20 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center sm:text-left">
            <span className="text-xs font-bold text-primary uppercase tracking-wide">{ctaTitle}</span>
            <h4 className="text-lg sm:text-xl font-bold text-on-surface">
              {ctaHeading}
            </h4>
            <p className="text-xs sm:text-sm text-text-secondary max-w-md">
              {ctaDesc}
            </p>
          </div>
          <a
            href={generateGeneralConsultationUrl()}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-success text-white text-sm font-bold shadow-sm hover:bg-emerald-600 transition-all shrink-0 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">chat</span>
            <span>{ctaBtn}</span>
          </a>
        </div>
      </section>
    </div>
  );
};
