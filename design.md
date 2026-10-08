# design.md — MapahJastip.id

> **Status:** Draft v0.1 (tahap desain, belum ada kode)
> **Fungsi dokumen:** Single source of truth untuk desain (Stitch), implementasi (React + TypeScript), dan kolaborasi developer / AI coding assistant.
> **Aturan emas:** Jika ada konflik antara dokumen ini dan asumsi lain, dokumen ini yang menang. Jika dokumen ini belum menjawab sesuatu, tanyakan atau tandai sebagai asumsi, jangan mengarang diam-diam.

---

## Daftar Isi

1. Project Overview
2. Goals
3. Target Users
4. Brand Direction
5. Design Principles
6. Color System
7. Typography
8. Spacing
9. Border Radius
10. Shadows
11. Layout
12. Navigation
13. Homepage
14. Product Listing
15. Product Detail
16. Cart
17. Checkout
18. Components
19. Responsive Rules
20. Accessibility
21. Content & Microcopy
22. Mock Data
23. Payment Architecture
24. Moota Integration Boundary
25. Tech Guidelines (React + TypeScript)
26. Workflow Stitch
27. Prototype Scope
28. Future Development
29. Definition of Done
30. Asumsi & Pertanyaan Terbuka

---

## 1. Project Overview

| Item | Detail |
|---|---|
| Nama | **MapahJastip.id** |
| Jenis bisnis | Jasa titip belanja (jastip) produk Jepang ke Indonesia |
| Model | E-commerce modern: katalog produk, keranjang, checkout, dan pilihan layanan pengiriman (Handcarry, Bagasi, Cargo) |
| Bahasa UI | Bahasa Indonesia (sapaan: **"kamu"**) |
| Mata uang | IDR, format `Rp 125.000` (titik sebagai pemisah ribuan, tanpa desimal) |
| Fase saat ini | Desain, lalu prototype 20–30% |

**Ringkasan nilai:** Pengguna menitipkan pembelian produk dari Jepang dengan mudah, aman, dan terpercaya. MapahJastip.id membelikan di toko resmi di Jepang lalu mengirim ke Indonesia.

---

## 2. Goals

### Tujuan produk
- Membuat pengguna **percaya** (kesan profesional, transparan, rapi).
- Membuat proses titip **sederhana** (alur jelas dari pilih produk sampai pembayaran).
- Mendukung dua tipe pembeli: **personal** dan **reseller**.

### Tujuan prototype
- Memvalidasi tampilan, alur, dan struktur halaman sebelum membangun backend.
- Menghasilkan UI yang konsisten dan reusable, siap dikembangkan menjadi production.

### Non-goals (tahap ini)
Payment gateway nyata, integrasi Moota nyata, autentikasi penuh, admin dashboard, manajemen reseller dan jadwal penerbangan penuh, database production.

---

## 3. Target Users

| Persona | Kebutuhan | Implikasi desain |
|---|---|---|
| **Pembeli personal** | Beli skincare, snack, fashion, elektronik, character goods, obat/kesehatan dari Jepang | Katalog mudah dijelajahi, harga jelas, alur checkout pendek |
| **Reseller** | Dapat produk Jepang untuk dijual kembali, sering dalam jumlah besar | Section reseller yang jelas, opsi layanan Cargo, CTA "Gabung Reseller" |
| **Pengguna mobile-first** | Mayoritas browsing dari HP | Touch-friendly, cart dan checkout nyaman di layar kecil |

---

## 4. Brand Direction

**Kepribadian brand:** Modern · Profesional · Terpercaya · Friendly · Fresh · Bersih.

**Nuansa Jepang (halus, bukan tradisional):**
- Lingkaran lembut sebagai motif dekoratif (terinspirasi bentuk matahari/hinomaru, tetapi **warna biru, bukan merah**).
- Pola gelombang tipis (*seigaiha*) sangat transparan (opacity 4–8%) hanya sebagai tekstur latar di hero atau footer.
- Siluet Gunung Fuji, skyline Tokyo, dan toko/jalanan Jepang pada hero dengan gaya ilustrasi flat atau foto dengan overlay biru lembut.
- Sakura boleh muncul sangat jarang (aksen kecil), jangan dominan.
- **Hindari:** ornamen tradisional ramai, banyak kanji dekoratif, warna merah/pink dominan.

**Logo:** Nuansa biru/cyan. Ikon kombinasi huruf **M**, **map pin**, dan **shopping bag**. Gunakan file logo asli dari pemilik brand. Jangan menggambar ulang logo.

| Aturan logo | Nilai |
|---|---|
| Clear space | Minimal setinggi huruf "M" di sekeliling logo |
| Ukuran minimum | 120 px lebar (wordmark), 32 px (ikon saja) |
| Latar | Putih, Soft Blue, atau Brand Dark Blue (versi putih) |

---

## 5. Design Principles

1. **Bersih dulu.** Whitespace lega; satu fokus per section.
2. **Biru untuk aksi, cyan untuk aksen.** Warna primer hanya dipakai pada elemen penting (CTA, link, state aktif). Cyan tidak untuk teks.
3. **Kartu lembut.** Rounded corner besar + soft shadow, bukan border tebal.
4. **Kepercayaan terlihat.** Rating, jumlah review, badge "Toko Resmi", status jelas, harga transparan.
5. **Konsisten.** Semua nilai (warna, spasi, radius) berasal dari token di dokumen ini.
6. **Mobile bukan afterthought.** Setiap layout dirancang untuk mobile, tablet, dan desktop sejak awal.
7. **Tidak ramai.** Maksimal 1 warna primer + 1 aksen + warna status. Tidak lebih.

---

## 6. Color System

### 6.1 Brand & Neutral

| Token | Hex | Penggunaan |
|---|---|---|
| `--color-primary-500` | `#0B8FEF` | Warna brand utama: ikon, aksen besar, border fokus, elemen non-teks |
| `--color-primary-600` | `#0877CC` | **Background tombol primer & teks link** (kontras AA dengan putih) |
| `--color-primary-700` | `#0A63A8` | Hover/active tombol primer |
| `--color-brand-dark` | `#123B78` | Footer, heading kuat, latar section gelap, teks di atas cyan |
| `--color-cyan-500` | `#16C4E8` | Aksen dekoratif: highlight, ilustrasi, progress, badge. **Bukan untuk teks** |
| `--color-light-blue` | `#EAF7FF` | Latar badge, chip, hover lembut, ikon container |
| `--color-soft-blue` | `#F4FAFF` | Latar section selang-seling |
| `--color-white` | `#FFFFFF` | Latar utama, kartu |
| `--color-text-primary` | `#17345F` | Teks utama |
| `--color-text-secondary` | `#60708A` | Teks sekunder, deskripsi, placeholder |
| `--color-border` | `#DCEAF5` | Border kartu, input, divider |

### 6.2 Status

| Status | Warna dasar | Teks (di atas putih/tint) | Tint latar |
|---|---|---|---|
| Success | `#18A874` | `#0F7F58` | `#E6F7F1` |
| Warning | `#F5A623` | `#8A5A00` | `#FEF4E0` |
| Error | `#E05252` | `#C23B3B` | `#FCEBEB` |
| Info | `#0B8FEF` | `#0877CC` | `#EAF7FF` |

### 6.3 Catatan kontras (penting)

Warna baseline awal disesuaikan sedikit agar lolos aksesibilitas, sesuai izin di brief:

- `#0B8FEF` dengan teks putih kontrasnya sekitar **3.4:1**, tidak cukup untuk teks kecil. Karena itu **tombol terisi memakai `primary-600`**, sementara `primary-500` dipakai untuk ikon, ilustrasi, dan elemen besar.
- `#16C4E8` terlalu terang untuk teks di atas putih. Jika teks berada di atas cyan, gunakan `brand-dark`.
- Warna status mentah (`#18A874`, `#F5A623`, `#E05252`) kurang kontras sebagai teks kecil. Untuk teks, gunakan kolom "Teks" di atas; warna dasar untuk ikon, border, dan indikator.
- Target: teks normal ≥ 4.5:1, teks besar (≥ 18.66px bold / 24px) ≥ 3:1.

### 6.4 Gradient (opsional, hemat)

```css
--gradient-hero: linear-gradient(135deg, #F4FAFF 0%, #EAF7FF 55%, #D6F1FB 100%);
--gradient-cta:  linear-gradient(135deg, #0877CC 0%, #0B8FEF 60%, #16C4E8 100%);
```
Gradient hanya untuk hero dan satu banner CTA per halaman.

### 6.5 CSS Variables (siap salin)

```css
:root {
  --color-primary-500: #0B8FEF;
  --color-primary-600: #0877CC;
  --color-primary-700: #0A63A8;
  --color-brand-dark: #123B78;
  --color-cyan-500: #16C4E8;
  --color-light-blue: #EAF7FF;
  --color-soft-blue: #F4FAFF;
  --color-white: #FFFFFF;
  --color-text-primary: #17345F;
  --color-text-secondary: #60708A;
  --color-border: #DCEAF5;

  --color-success: #18A874;  --color-success-text: #0F7F58;  --color-success-bg: #E6F7F1;
  --color-warning: #F5A623;  --color-warning-text: #8A5A00;  --color-warning-bg: #FEF4E0;
  --color-error:   #E05252;  --color-error-text:   #C23B3B;  --color-error-bg:   #FCEBEB;
}
```

---

## 7. Typography

| Peran | Font | Fallback |
|---|---|---|
| Heading | **Plus Jakarta Sans** (600/700/800) | `system-ui, sans-serif` |
| Body & UI | **Inter** (400/500/600) | `system-ui, sans-serif` |
| Teks Jepang (jika ada) | **Noto Sans JP** (400/500/700) | `sans-serif` |

> Muat via Google Fonts dengan `display=swap`. Hanya muat weight yang dipakai.

### Type scale

| Token | Desktop (size/line) | Mobile (size/line) | Weight | Penggunaan |
|---|---|---|---|---|
| `display` | 56/64 | 36/44 | 800 | Headline hero |
| `h1` | 40/48 | 30/38 | 700 | Judul halaman |
| `h2` | 32/40 | 26/34 | 700 | Judul section |
| `h3` | 24/32 | 20/28 | 700 | Judul kartu besar |
| `h4` | 20/28 | 18/26 | 600 | Sub-judul |
| `body-lg` | 18/28 | 17/26 | 400 | Subheadline, intro |
| `body` | 16/24 | 16/24 | 400 | Teks standar |
| `body-sm` | 14/20 | 14/20 | 400/500 | Deskripsi kartu, label |
| `caption` | 12/16 | 12/16 | 500 | Meta, badge |
| `price` | 20/28 | 18/26 | 700 | Harga (angka tabular) |

Aturan: ukuran teks input minimal **16px** di mobile (mencegah zoom otomatis iOS), lebar baris teks maksimal ~65 karakter, `font-variant-numeric: tabular-nums` untuk harga dan jumlah.

---

## 8. Spacing

Basis **4px**. Skala: `4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96`.

| Token | Nilai | Contoh pemakaian |
|---|---|---|
| `space-1` | 4px | Jarak ikon-teks kecil |
| `space-2` | 8px | Gap badge, gap kecil |
| `space-3` | 12px | Padding chip |
| `space-4` | 16px | Padding kartu mobile, gutter mobile |
| `space-6` | 24px | Padding kartu desktop, gap grid |
| `space-8` | 32px | Jarak antar blok dalam section |
| `space-12` | 48px | Padding vertikal section (mobile) |
| `space-16` | 64px | Padding vertikal section (desktop) |
| `space-20` | 80px | Padding hero (desktop) |

**Container:** lebar maks **1200px**, centered. Gutter horizontal: 16px (mobile), 24px (tablet), 32px (desktop).

---

## 9. Border Radius

| Token | Nilai | Penggunaan |
|---|---|---|
| `radius-sm` | 8px | Badge, chip kecil |
| `radius-md` | 12px | Input, tombol |
| `radius-lg` | 16px | Kartu produk, kartu kategori |
| `radius-xl` | 24px | Kartu hero, banner, modal |
| `radius-full` | 9999px | Avatar, pill, ikon bulat |

---

## 10. Shadows

Shadow berwarna biru gelap transparan agar terasa menyatu dengan brand.

```css
--shadow-sm: 0 1px 2px rgba(18, 59, 120, 0.06);
--shadow-md: 0 4px 12px rgba(18, 59, 120, 0.08);
--shadow-lg: 0 12px 32px rgba(18, 59, 120, 0.12);
--shadow-focus: 0 0 0 3px rgba(11, 143, 239, 0.35);
```

| Elemen | Default | Hover |
|---|---|---|
| Kartu produk | `shadow-sm` + border `--color-border` | `shadow-md`, naik 2px |
| Navbar (saat scroll) | `shadow-sm` | n/a |
| Modal, dropdown | `shadow-lg` | n/a |

---

## 11. Layout

- Grid 12 kolom di desktop, 8 di tablet, 4 di mobile; gap 24px (desktop), 16px (mobile).
- Section memakai latar putih dan `soft-blue` secara selang-seling untuk ritme visual.
- Header section konsisten (`SectionHeader`): judul (h2) + deskripsi opsional + link aksi opsional di kanan.
- Navbar **sticky** di atas; tinggi 72px (desktop), 64px (mobile).
- Konten halaman dalam: `Breadcrumb` di atas, lalu judul, lalu konten.

---

## 12. Navigation

### 12.1 Navbar

Urutan: **Logo** · Beranda · Produk · Cara Kerja · Layanan · Jadwal Penerbangan · Harga · Reseller · FAQ · **Search** · **Cart** · **Profile/Login**

| Breakpoint | Perilaku |
|---|---|
| **≥ 1280px** | Semua link tampil. Search berupa ikon yang membuka input inline. Cart dengan badge jumlah. Profile/Login sebagai tombol atau avatar. |
| **768–1279px (tablet & laptop kecil)** | Logo, ikon Search, ikon Cart, ikon Profile, dan **hamburger**. Link masuk ke drawer. |
| **< 768px (mobile)** | Logo, ikon Cart, hamburger. Search dan Profile ada di dalam drawer (Search di bagian atas drawer). |

Drawer mobile: panel dari kanan (lebar 85%, maks 360px) dengan overlay; link berukuran tinggi 48px; tombol "Login" dan "Titip Sekarang" di bagian bawah; tutup dengan tombol X, tap overlay, atau tombol Esc.

State link: default `text-primary`, hover `primary-600`, aktif `primary-600` + garis bawah 2px cyan.

### 12.2 Pemetaan link (prototype)

| Menu | Tujuan |
|---|---|
| Beranda | `/` |
| Produk | `/produk` |
| Cara Kerja | `/#cara-order` |
| Layanan | `/#layanan` |
| Jadwal Penerbangan | `/#jadwal-penerbangan` |
| Harga | `/#layanan` (info biaya ada di kartu layanan; lihat bagian 30) |
| Reseller | `/#reseller` |
| FAQ | `/#faq` |
| Cart | `/cart` |
| Profile/Login | Tombol disabled/placeholder "Segera hadir" |

Jika pengguna berada di halaman selain `/`, link anchor mengarah ke `/` lalu scroll ke section. Scroll halus, hormati `prefers-reduced-motion`.

---

## 13. Homepage (`/`)

Urutan section dan latar:

| # | Section | Latar |
|---|---|---|
| 1 | Hero | Gradient hero |
| 2 | Kategori | Putih |
| 3 | Produk | Soft Blue |
| 4 | Layanan | Putih |
| 5 | Cara Order | Soft Blue |
| 6 | Jadwal Penerbangan | Putih |
| 7 | Program Reseller | Banner gradient CTA |
| 8 | FAQ | Putih |
| 9 | Footer | Brand Dark Blue |

### 13.1 Hero

- **Headline:** "Titip Belanja di Jepang, Kami yang Urus."
- **Subheadline:** "Titipkan pembelian produk Jepang favoritmu dengan mudah, aman, dan terpercaya. Kami belikan langsung dari toko di Jepang dan kirim ke Indonesia."
- **CTA utama:** "Titip Sekarang" (tombol primer besar) → `/produk`
- **CTA sekunder:** "Lihat Produk" (outline) → `/produk`
- **Trust strip** (kecil di bawah CTA): 3 poin singkat, mis. "Dibeli di toko resmi", "Pembayaran aman", "Pelacakan pesanan".
- **Visual:** ilustrasi/foto Jepang (skyline Tokyo + siluet Gunung Fuji + toko) dengan overlay biru lembut, lingkaran dekoratif, kartu mengambang kecil (mis. "Tokyo → Jakarta · Open"). Maksimal **2 elemen mengambang**.
- **Layout:** desktop dua kolom (teks kiri, visual kanan); mobile satu kolom (teks dulu, visual di bawah dengan tinggi terbatas).

### 13.2 Kategori

- **Judul:** "Belanja Produk Jepang Favoritmu"
- **Kategori (7):** Skincare & Beauty · Makanan & Snack · Fashion & Brand · Elektronik · Jepang Character · Obat & Kesehatan · Lainnya
- `CategoryCard`: ikon/gambar dalam lingkaran `light-blue`, nama kategori; hover mengangkat kartu dan menegaskan border cyan. Klik menuju `/produk?kategori=<slug>`.
- **Layout:** desktop 7 kolom (atau 4 + 3), tablet 4 kolom, mobile scroll horizontal atau grid 2 kolom.

### 13.3 Produk

- **Judul:** "Produk Japan Original Langsung dari Toko Resmi"
- 4–8 `ProductCard` (grid 4 kolom desktop, 3 tablet, 2 mobile) + link "Lihat Semua Produk" → `/produk`.

### 13.4 Layanan

- **Judul:** "Pilih Layanan Jastip Sesuai Kebutuhanmu"
- 3 `ServiceCard`, masing-masing: ikon, judul, deskripsi singkat, 3 benefit (dengan ikon centang), CTA.

| Layanan | Cocok untuk | Benefit (draft) |
|---|---|---|
| **Jastip Handcarry** | Barang cepat, bernilai tinggi, atau rapuh | Estimasi tercepat · Dibawa langsung · Penanganan ekstra hati-hati |
| **Jastip Bagasi** | Pembelian reguler personal | Biaya hemat · Terjadwal mengikuti penerbangan · Cocok untuk skincare, snack, fashion |
| **Jastip Cargo** | Volume besar, reseller | Cocok untuk jumlah banyak · Biaya per kg lebih efisien · Pengemasan aman |

> Estimasi waktu dan biaya dalam kartu adalah **placeholder** sampai dikonfirmasi bisnis.

- Kartu layanan yang direkomendasikan boleh diberi badge "Paling Populer" (maks satu).

### 13.5 Cara Order (`#cara-order`)

Flow 6 langkah, dengan nomor dan ikon:

1. **Pilih produk**
2. **Masukkan ke keranjang**
3. **Checkout**
4. **Lakukan pembayaran**
5. **Kami belikan di Jepang**
6. **Produk dikirim ke Indonesia**

Layout: desktop horizontal (6 kolom) dengan garis penghubung cyan putus-putus; mobile vertikal (timeline kiri).

### 13.6 Jadwal Penerbangan (`#jadwal-penerbangan`)

- Preview 3–4 jadwal Jepang → Indonesia.
- Desktop: **tabel** (Rute · Tanggal · Batas Titip · Status); mobile: **kartu** bertumpuk (tabel tidak dipakai di mobile).
- Status memakai `Badge`: **Open** (success), **Terbatas** (warning), **Penuh** (error), **Segera** (info).
- Contoh data dummy: Tokyo → Jakarta · 15 Oktober 2026 · Open.
- Link "Lihat semua jadwal" (disabled/placeholder di prototype).

### 13.7 Program Reseller (`#reseller`)

- **Judul:** "Mau Jualan Produk Jepang?"
- Deskripsi singkat (1–2 kalimat) + 3 keuntungan (mis. harga reseller, akses produk Jepang, dukungan layanan Cargo).
- **CTA:** "Gabung Reseller" (tombol putih di atas banner gradient; di prototype membuka `Modal` placeholder).

### 13.8 FAQ (`#faq`)

Accordion (satu terbuka pada satu waktu). Topik minimum: cara kerja jastip, pembayaran, estimasi pengiriman, produk yang bisa dititipkan, refund, reseller. Contoh jawaban ada di bagian 22.

### 13.9 Footer

Latar Brand Dark Blue, teks putih/`light-blue`.

| Kolom | Isi |
|---|---|
| Brand | Logo (versi putih), deskripsi singkat 1–2 kalimat |
| Navigasi | Beranda, Produk, Cara Kerja, Jadwal, Harga, Reseller, FAQ |
| Layanan | Handcarry, Bagasi, Cargo |
| Kontak | Email, WhatsApp, jam layanan (placeholder) |
| Sosial | Instagram, TikTok, WhatsApp (ikon) |

Baris bawah: "© 2026 MapahJastip.id. Semua hak dilindungi." Desktop 4 kolom, tablet 2, mobile 1 (kolom dapat berupa accordion).

---

## 14. Product Listing (`/produk`)

**Struktur halaman:** Breadcrumb → Judul "Semua Produk" + jumlah hasil → toolbar (Search, Sorting) → Filter + grid → paginasi.

| Fitur | Spesifikasi |
|---|---|
| **Search** | `SearchBar` di toolbar; filter client-side pada nama produk; debounce 300ms; tombol clear |
| **Category filter** | Daftar kategori (radio/checkbox single-select) + opsi "Semua". Desktop: sidebar kiri 260px. Mobile/tablet: tombol "Filter" membuka bottom sheet/`Modal` |
| **Sorting** | Select: Terbaru · Harga Terendah · Harga Tertinggi · Rating Tertinggi |
| **Grid** | 4 kolom (≥1024), 3 (≥640), 2 (<640); gap 24/16 |
| **Pagination** | **Load more** (default prototype): 12 produk per halaman + tombol "Tampilkan Lebih Banyak" + teks "Menampilkan X dari Y produk" |
| **State** | Loading (skeleton kartu), Empty ("Produk tidak ditemukan"), Error |
| **URL state** | `?q=`, `?kategori=`, `?urut=` agar bisa dibagikan |

Filter aktif ditampilkan sebagai chip yang bisa dihapus + tombol "Reset filter".

---

## 15. Product Detail (`/produk/:id`)

**Struktur:** Breadcrumb (Beranda › Produk › Kategori › Nama Produk) → dua kolom (galeri kiri, info kanan) → deskripsi → produk terkait.

| Elemen | Spesifikasi |
|---|---|
| Product image | Gambar utama rasio 1:1, thumbnail di bawah (mobile: swipe), zoom saat hover desktop (opsional) |
| Nama | `h1` |
| Meta | Kategori (link), `Rating` + jumlah review, badge (mis. "Toko Resmi") |
| Harga | `PriceDisplay` ukuran besar; harga coret + persen diskon jika ada |
| Stok | Indikator: "Tersedia" (success), "Stok terbatas, sisa N" (warning, jika ≤ 5), "Habis" (error, tombol nonaktif) |
| Deskripsi | Teks ringkas + daftar spesifikasi (ukuran, asal toko, kondisi) |
| Quantity selector | Tombol − / + (44px) dan input angka; min 1, maks = stok |
| **Add to cart** | Tombol outline; setelah klik: toast "Ditambahkan ke keranjang" + badge cart bertambah |
| **Buy now** | Tombol primer; menambahkan ke keranjang lalu menuju `/checkout` |
| Info layanan | Kotak kecil: "Pilih layanan pengiriman saat checkout" |
| Mobile | Tombol Add to cart / Buy now menjadi **sticky bar** di bawah layar |

Produk tidak ditemukan (`id` tidak valid): `EmptyState` + tombol "Kembali ke Produk".

---

## 16. Cart (`/cart`)

**Struktur:** Breadcrumb → judul "Keranjang" → daftar item + ringkasan.

| Elemen | Spesifikasi |
|---|---|
| `CartItem` | Gambar (80px), nama (link ke detail), kategori, harga satuan, quantity stepper, subtotal, tombol hapus |
| Total | Ringkasan: Subtotal, catatan "Biaya jasa & ongkir dihitung saat checkout", **Total sementara** |
| CTA | "Lanjut ke Checkout" (primer, lebar penuh di mobile) + link "Lanjut Belanja" |
| Empty | `EmptyState`: ikon tas belanja, "Keranjangmu masih kosong", tombol "Mulai Belanja" |
| Persistensi | `localStorage` (prototype) |

Layout: desktop dua kolom (daftar 2/3, ringkasan 1/3 sticky); mobile satu kolom dengan ringkasan + tombol checkout **sticky di bawah**. Hapus item menampilkan toast dengan "Urungkan" (undo) jika memungkinkan.

---

## 17. Checkout (`/checkout`)

Semua data **dummy**; tidak ada integrasi pembayaran nyata.

**Struktur (desktop dua kolom; mobile satu kolom berurutan, ringkasan dapat dilipat di atas):**

1. **Data customer** — Nama lengkap, email, nomor WhatsApp
2. **Alamat pengiriman** — Penerima, alamat lengkap, kota/kabupaten, provinsi, kode pos, catatan
3. **Layanan pengiriman** — Pilih Handcarry / Bagasi / Cargo (radio card) + estimasi dummy
4. **Metode pembayaran (dummy)** — Transfer bank (BCA/Mandiri/BNI — placeholder)
5. **Ringkasan pesanan** (`CheckoutSummary`) — Daftar item, subtotal, biaya jasa (dummy), ongkir (dummy), **kode unik (dummy)**, **total**
6. **Tombol "Buat Pesanan"**

### Validasi form (client-side)
- Wajib: nama, email (format valid), WhatsApp (format Indonesia `08…`/`+62…`), alamat, kota, provinsi, kode pos (5 digit).
- Error ditampilkan **di bawah field** dengan teks jelas + `aria-describedby`; fokus pindah ke field error pertama saat submit gagal.

### Status pembayaran dummy

Setelah "Buat Pesanan" tampilkan halaman/state konfirmasi dengan kartu status. Untuk prototype sediakan **kontrol demo** (mis. dropdown kecil bertanda "Demo only") untuk mengganti status:

| Status | Badge | Pesan |
|---|---|---|
| `pending` | warning | "Menunggu pembayaran" + instruksi transfer + hitung mundur dummy |
| `paid` | success | "Pembayaran diterima. Kami segera belikan di Jepang." |
| `failed` | error | "Pembayaran gagal. Coba lagi atau hubungi kami." |
| `expired` | neutral/error | "Waktu pembayaran habis. Buat pesanan ulang." |

> Jangan menyimpan data kartu atau kredensial apa pun. Prototype tidak memproses uang.

---

## 18. Components

Semua komponen: TypeScript, props bertipe eksplisit, **tanpa `any`**, mendukung state keyboard dan fokus. Lokasi: `src/components/`.

### 18.1 Ringkasan

| Komponen | Tujuan | Variant / state utama |
|---|---|---|
| `Navbar` | Navigasi utama | desktop, tablet, mobile drawer, scrolled, active link |
| `Footer` | Footer situs | 4 kolom, responsive |
| `Button` | Aksi | `primary` · `secondary` · `outline` · `ghost` · `danger`; ukuran `sm`/`md`/`lg`; `loading`, `disabled`, `fullWidth`, ikon kiri/kanan |
| `ProductCard` | Kartu produk | default, hover, habis stok, loading (skeleton) |
| `CategoryCard` | Kartu kategori | default, hover, aktif |
| `ServiceCard` | Kartu layanan | default, featured (badge) |
| `PriceDisplay` | Format harga | normal, dengan harga coret + diskon, ukuran `sm`/`md`/`lg` |
| `Rating` | Bintang + angka + jumlah review | read-only, ukuran `sm`/`md` |
| `CartItem` | Baris keranjang | default, updating, removing |
| `CheckoutSummary` | Ringkasan biaya | collapsible di mobile |
| `Breadcrumb` | Jejak halaman | truncate di mobile |
| `SectionHeader` | Judul section | dengan/tanpa deskripsi & aksi |
| `Badge` | Label status | `success` · `warning` · `error` · `info` · `neutral` · `brand` |
| `SearchBar` | Input pencarian | default, fokus, dengan hasil/clear |
| `Filter` | Filter kategori + sorting | sidebar (desktop), bottom sheet (mobile) |
| `Modal` | Dialog | ukuran `sm`/`md`; focus trap; tutup via Esc/overlay |
| `Loading` | Spinner & skeleton | `spinner`, `skeleton-card`, `skeleton-text` |
| `EmptyState` | Keadaan kosong | ikon + judul + deskripsi + aksi |

### 18.2 Spesifikasi kunci

**Button**
- Tinggi: `sm` 36px · `md` 44px · `lg` 52px. **Target sentuh minimal 44×44px.**
- `primary`: bg `primary-600`, teks putih; hover `primary-700`; fokus `shadow-focus`.
- `outline`: border `primary-600`, teks `primary-600`, bg transparan; hover bg `light-blue`.
- `secondary`: bg `light-blue`, teks `brand-dark`.
- Radius `radius-md`; teks 16px/600.
- Disabled: opasitas 50%, kursor `not-allowed`, tanpa hover.
- Loading: spinner menggantikan ikon, lebar tombol tetap, `aria-busy`.

**ProductCard**
- Struktur: gambar (rasio 1:1, `radius-lg` atas) → badge (pojok kiri atas gambar) → kategori (caption) → nama (maks 2 baris, ellipsis) → `Rating` → `PriceDisplay` → tombol "Lihat Detail".
- Seluruh kartu dapat diklik menuju detail; tombol memiliki label jelas.
- Gambar: `loading="lazy"`, `alt` deskriptif, rasio dijaga (cegah layout shift).

**Badge** (produk): "Terlaris", "Baru", "Diskon X%", "Toko Resmi", "Stok Terbatas". Maksimal 1 badge pada kartu.

**Input form:** tinggi 48px, `radius-md`, border `--color-border`, fokus border `primary-500` + `shadow-focus`, label di atas field (bukan hanya placeholder), error: border `error` + teks `error-text` di bawah.

**Modal:** latar overlay `rgba(18,59,120,0.45)`, `radius-xl`, padding 24px; mobile: bottom sheet penuh lebar; fokus ter-trap dan kembali ke pemicu saat ditutup.

**Props kontrak (contoh):**

```ts
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export interface ProductCardProps {
  product: Product;
  onViewDetail?: (id: string) => void;
}
```

---

## 19. Responsive Rules

### Breakpoints

| Nama | Lebar | Perangkat |
|---|---|---|
| `xs` | < 640px | Mobile |
| `sm` | ≥ 640px | Mobile besar / tablet kecil |
| `md` | ≥ 768px | Tablet |
| `lg` | ≥ 1024px | Laptop |
| `xl` | ≥ 1280px | Desktop |

Pendekatan **mobile-first** (styling dasar untuk mobile, ditimpa ke atas).

### Aturan per elemen

| Elemen | Mobile (<640) | Tablet (640–1023) | Desktop (≥1024) |
|---|---|---|---|
| Navbar | Logo + Cart + hamburger | Logo + ikon + hamburger | Penuh pada ≥1280; hamburger pada <1280 |
| Hero | 1 kolom, headline 36px | 1–2 kolom, headline 44px | 2 kolom, headline 56px |
| Kategori | Scroll horizontal / 2 kolom | 4 kolom | 7 kolom (atau 4+3) |
| Grid produk | 2 kolom | 3 kolom | 4 kolom |
| Layanan | 1 kolom | 3 kolom (ringkas) | 3 kolom |
| Cara order | Timeline vertikal | 3×2 | 6 kolom horizontal |
| Jadwal | Kartu | Tabel | Tabel |
| Product detail | 1 kolom + sticky action bar | 2 kolom | 2 kolom |
| Cart | 1 kolom + sticky checkout bar | 1–2 kolom | 2 kolom, ringkasan sticky |
| Checkout | 1 kolom, ringkasan collapsible | 1–2 kolom | 2 kolom, ringkasan sticky |
| Footer | 1 kolom | 2 kolom | 4 kolom |

### Aturan umum
- Tidak ada **scroll horizontal** pada halaman (kecuali carousel yang disengaja).
- Tombol dan target sentuh ≥ 44px; jarak antar target ≥ 8px.
- Cart dan checkout: tombol aksi utama selalu terjangkau ibu jari (sticky bottom di mobile); gunakan `inputmode` dan `autocomplete` yang tepat (mis. `inputmode="numeric"` untuk kode pos, `autocomplete="tel"`).
- Gambar responsif (`srcset`/`sizes` bila memungkinkan), rasio terjaga.
- Uji minimal pada lebar: 360, 390, 768, 1024, 1280, 1440.

---

## 20. Accessibility

- Kontras sesuai bagian 6.3 (WCAG 2.1 AA).
- Seluruh elemen interaktif dapat dijangkau keyboard; urutan tab logis; indikator fokus selalu terlihat (`shadow-focus`).
- HTML semantik: `header`, `nav`, `main`, `footer`, satu `h1` per halaman, hierarki heading berurutan.
- Ikon-only button wajib `aria-label` (mis. "Buka keranjang, 3 item").
- Gambar informatif: `alt` deskriptif; dekoratif: `alt=""`.
- Status tidak boleh hanya dibedakan warna: sertakan ikon dan teks (mis. badge "Open" + ikon centang).
- Form: label terhubung ke input, error via `aria-describedby`, `aria-live="polite"` untuk toast.
- Modal: focus trap, tutup dengan Esc, `role="dialog"` + `aria-modal`.
- Hormati `prefers-reduced-motion` (nonaktifkan animasi besar, smooth scroll).
- Animasi: durasi 150–250ms, easing `ease-out`; hover/transition halus, tidak mencolok.

---

## 21. Content & Microcopy

**Suara brand:** ramah, jelas, ringkas, menenangkan. Sapaan "kamu". Hindari slang berlebihan, jargon logistik, dan tanda seru beruntun. Gunakan bahasa aktif.

| Konteks | Contoh |
|---|---|
| CTA utama | "Titip Sekarang" |
| CTA sekunder | "Lihat Produk", "Lihat Detail", "Lanjut ke Checkout", "Gabung Reseller" |
| Add to cart (sukses) | "Ditambahkan ke keranjang" |
| Empty cart | **"Keranjangmu masih kosong"** — "Yuk, pilih produk Jepang favoritmu." [Mulai Belanja] |
| Empty search | **"Produk tidak ditemukan"** — "Coba kata kunci lain atau reset filter." [Reset Filter] |
| Stok habis | "Stok habis. Cek lagi nanti ya." |
| Error umum | "Ada yang tidak beres di sisi kami. Coba lagi sebentar lagi." |
| Error form | "Nomor WhatsApp belum valid. Gunakan format 08xxxxxxxxxx." |
| Loading | "Memuat produk…" |
| Pembayaran pending | "Menunggu pembayaran. Selesaikan sebelum waktu habis." |
| Pembayaran sukses | "Pembayaran diterima. Kami segera belikan di Jepang." |

Prinsip pesan error: sebutkan **apa yang terjadi**, **apa yang bisa dilakukan**, tanpa menyalahkan pengguna.

---

## 22. Mock Data

> Semua data **dummy**. Jangan menganggap harga, stok, atau estimasi sebagai data bisnis nyata. Simpan di `src/data/mock/`.

### 22.1 Tipe (TypeScript)

```ts
export type CategorySlug =
  | 'skincare-beauty'
  | 'makanan-snack'
  | 'fashion-brand'
  | 'elektronik'
  | 'jepang-character'
  | 'obat-kesehatan'
  | 'lainnya';

export interface Category {
  slug: CategorySlug;
  name: string;
  icon: string; // nama ikon atau path aset
}

export type ProductBadge = 'terlaris' | 'baru' | 'diskon' | 'toko-resmi' | 'stok-terbatas';

export interface Product {
  id: string;
  name: string;
  category: CategorySlug;
  price: number;          // IDR, bilangan bulat
  originalPrice?: number; // untuk harga coret
  rating: number;         // 0–5, satu desimal
  reviewCount: number;
  imageUrl: string;
  images?: string[];
  badge?: ProductBadge;
  description: string;
  stock: number;
  storeName: string;      // toko asal di Jepang (dummy)
  createdAt: string;      // ISO date, untuk sorting "Terbaru"
}

export type ServiceType = 'handcarry' | 'bagasi' | 'cargo';

export interface Service {
  type: ServiceType;
  title: string;
  description: string;
  benefits: string[];
  estimate: string;       // placeholder
  featured?: boolean;
}

export type FlightStatus = 'open' | 'terbatas' | 'penuh' | 'segera';

export interface FlightSchedule {
  id: string;
  origin: string;
  destination: string;
  departureDate: string;  // ISO date
  orderDeadline: string;  // ISO date
  status: FlightStatus;
}

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'expired';

export interface CartLine {
  productId: string;
  quantity: number;
}

export interface CheckoutForm {
  fullName: string;
  email: string;
  whatsapp: string;
  recipient: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  note?: string;
  service: ServiceType;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}
```

### 22.2 Kategori

| slug | Nama |
|---|---|
| `skincare-beauty` | Skincare & Beauty |
| `makanan-snack` | Makanan & Snack |
| `fashion-brand` | Fashion & Brand |
| `elektronik` | Elektronik |
| `jepang-character` | Jepang Character |
| `obat-kesehatan` | Obat & Kesehatan |
| `lainnya` | Lainnya |

### 22.3 Produk (contoh, perbanyak ke 12–16 untuk menguji load more)

| id | Nama | Kategori | Harga (Rp) | Rating | Review | Stok | Badge |
|---|---|---|---|---|---|---|---|
| `p-001` | Hydrating Lotion 170ml | skincare-beauty | 135.000 | 4.8 | 312 | 25 | terlaris |
| `p-002` | UV Watery Essence SPF50+ | skincare-beauty | 98.000 | 4.7 | 540 | 40 | toko-resmi |
| `p-003` | Matcha Chocolate Snack Box | makanan-snack | 85.000 | 4.6 | 128 | 60 | baru |
| `p-004` | Banana Sponge Cake (isi 8) | makanan-snack | 120.000 | 4.9 | 205 | 12 | stok-terbatas |
| `p-005` | Wool Blend Cardigan | fashion-brand | 459.000 | 4.5 | 64 | 8 | toko-resmi |
| `p-006` | Wireless Earbuds Mini | elektronik | 899.000 | 4.4 | 91 | 15 | diskon |
| `p-007` | Plush Mascot Medium | jepang-character | 175.000 | 4.8 | 77 | 30 | baru |
| `p-008` | Vitamin C Tablet 60 hari | obat-kesehatan | 110.000 | 4.6 | 156 | 0 | — |

> Nama produk sengaja generik. Ganti dengan data katalog nyata saat tahap backend. Gunakan gambar placeholder (mis. `/images/placeholder-product.webp`) yang konsisten rasio 1:1.

### 22.4 Layanan (placeholder)

| Tipe | Judul | Estimasi |
|---|---|---|
| `handcarry` | Jastip Handcarry | 5–10 hari kerja (placeholder) |
| `bagasi` | Jastip Bagasi | 7–14 hari kerja (placeholder) |
| `cargo` | Jastip Cargo | 14–30 hari kerja (placeholder) |

### 22.5 Jadwal Penerbangan (dummy)

| Rute | Berangkat | Batas titip | Status |
|---|---|---|---|
| Tokyo → Jakarta | 15 Oktober 2026 | 10 Oktober 2026 | `open` |
| Osaka → Jakarta | 22 Oktober 2026 | 17 Oktober 2026 | `open` |
| Tokyo → Jakarta | 29 Oktober 2026 | 24 Oktober 2026 | `terbatas` |
| Fukuoka → Jakarta | 5 November 2026 | 31 Oktober 2026 | `segera` |

### 22.6 FAQ (draft, **perlu divalidasi bisnis**)

| Pertanyaan | Jawaban draft |
|---|---|
| Bagaimana cara kerja jastip? | Pilih produk, checkout, dan bayar. Kami membelikan produknya di Jepang, lalu mengirimnya ke Indonesia sesuai layanan yang kamu pilih. |
| Apa saja metode pembayarannya? | Saat ini transfer bank. Pesananmu diproses setelah pembayaran terverifikasi. |
| Berapa lama estimasi pengiriman? | Tergantung layanan: Handcarry paling cepat, Bagasi mengikuti jadwal penerbangan, Cargo untuk volume besar. Estimasi pasti tampil saat checkout. |
| Produk apa saja yang bisa dititipkan? | Skincare, makanan, fashion, elektronik, character goods, dan lainnya. Beberapa produk, seperti obat dan kesehatan, dapat memiliki batasan. Hubungi kami jika ragu. |
| Bagaimana kebijakan refund? | [Kebijakan refund menunggu keputusan bisnis.] |
| Bagaimana cara menjadi reseller? | Klik "Gabung Reseller" dan isi formulir. Tim kami akan menghubungimu. |

---

## 23. Payment Architecture

### 23.1 Prototype (sekarang)

- Seluruh checkout memakai **data dummy** dan state lokal.
- Status pembayaran dummy: `pending` · `paid` · `failed` · `expired`.
- Tidak ada pemanggilan API pembayaran, tidak ada backend.

### 23.2 Target arsitektur (masa depan)

```
Customer
  → React Frontend
  → Backend API
  → Payment (pembuatan order + instruksi bayar + kode unik)
  → Bank (customer transfer)
  → Moota (membaca mutasi rekening)
  → Backend (cek mutasi secara berkala, mencocokkan dengan order)
  → Payment status diperbarui
  → Database
  → Frontend (menampilkan status terbaru)
```

### 23.3 Alur rinci (rencana)

1. Customer checkout; frontend memanggil `POST /orders` di Backend API.
2. Backend membuat order berstatus `pending`, menetapkan **total + kode unik**, dan batas waktu bayar; menyimpan ke database.
3. Frontend menampilkan instruksi transfer dan status.
4. Customer transfer ke rekening yang ditentukan.
5. Backend secara berkala mengecek mutasi melalui Moota (lihat bagian 24).
6. Jika ada mutasi yang cocok (nominal + kode unik, dalam batas waktu) → order menjadi `paid`.
7. Jika melewati batas waktu tanpa mutasi cocok → `expired`; jika terjadi kegagalan/ketidakcocokan yang butuh penanganan → `failed` (aturan final ditentukan di tahap backend).
8. Frontend mengambil status terbaru (polling ringan ke Backend API atau mekanisme push di masa depan).

### 23.4 Prinsip

- **Sumber kebenaran status pembayaran adalah backend/database**, bukan frontend.
- Frontend **tidak pernah** menandai order sebagai `paid` berdasarkan logika klien (kecuali kontrol demo di prototype yang jelas ditandai "Demo only").
- Idempotensi: satu mutasi tidak boleh membayar dua order; pencocokan harus deterministik.

---

## 24. Moota Integration Boundary

| Aspek | Aturan |
|---|---|
| **Prototype** | **Jangan** membuat integrasi Moota sungguhan. Tidak ada bot Moota, tidak ada MCP, tidak ada mock server yang meniru API Moota. |
| **Lokasi integrasi** | **Hanya di backend.** Frontend tidak pernah memanggil Moota langsung. |
| **API key / token Moota** | **Tidak boleh berada di frontend React**, termasuk `.env` yang diawali `VITE_` (variabel `VITE_*` ikut ter-bundle ke browser). Simpan hanya di environment server/secret manager. |
| **Frontend hanya tahu** | Endpoint Backend API milik MapahJastip.id dan `PaymentStatus` hasil kembalian. |
| **Mekanisme cek** | Backend memeriksa mutasi secara berkala (polling terjadwal). Penggunaan webhook sebagai pelengkap/alternatif dapat dievaluasi di tahap backend. |
| **Logging** | Log pencocokan pembayaran di backend (tanpa menyimpan data sensitif berlebih). |
| **Aturan repo** | Jangan commit secret apa pun. Sediakan `.env.example` tanpa nilai rahasia. |

> Detail teknis API Moota (autentikasi, endpoint, format mutasi) harus dibaca dari dokumentasi resmi Moota saat tahap backend, bukan diasumsikan dari dokumen ini.

---

## 25. Tech Guidelines (React + TypeScript)

### 25.1 Stack

| Kebutuhan | Pilihan |
|---|---|
| Framework | React 18+ + TypeScript (`strict: true`) |
| Build tool | Vite |
| Routing | React Router |
| Styling | Tailwind CSS dengan design token dari bagian 6–10 (dipetakan ke `tailwind.config` / CSS variables) |
| State keranjang | Context + reducer, atau store ringan (mis. Zustand); persist ke `localStorage` |
| Ikon | Satu library konsisten (mis. Lucide) |
| Data | Mock lokal di `src/data/mock/` |

> Pilihan styling dan state di atas adalah **rekomendasi**. Boleh diganti jika konsisten dan tetap memakai token yang sama.

### 25.2 Struktur folder

```
src/
├─ app/                  # router, providers, entry
├─ assets/               # gambar, logo, ilustrasi
├─ components/
│  ├─ ui/                # Button, Badge, Modal, Loading, EmptyState, SearchBar
│  ├─ layout/            # Navbar, Footer, Breadcrumb, Container, SectionHeader
│  ├─ product/           # ProductCard, PriceDisplay, Rating, Filter
│  ├─ cart/              # CartItem, CheckoutSummary
│  └─ home/              # Hero, CategoryCard, ServiceCard, FlightTable, FaqAccordion
├─ features/
│  └─ cart/              # store, hooks, selectors
├─ data/mock/            # products, categories, services, flights, faq
├─ pages/                # HomePage, ProductListPage, ProductDetailPage, CartPage, CheckoutPage
├─ lib/                  # formatCurrency, formatDate, cn
├─ styles/               # tokens.css, global.css
└─ types/                # tipe domain
```

### 25.3 Aturan kode

**Wajib:**
- Arsitektur berbasis komponen; komponen kecil, satu tanggung jawab.
- TypeScript strict; props dan data bertipe eksplisit.
- Token desain dipakai lewat variabel/utility, **bukan nilai hardcode** (warna, spasi, radius).
- `formatCurrency` terpusat untuk format `Rp`.
- Route sesuai tabel: `/`, `/produk`, `/produk/:id`, `/cart`, `/checkout`.

**Dilarang:**
- Memakai HTML/CSS/JS terpisah sebagai aplikasi utama.
- Inline style/logic berantakan yang menyulitkan perawatan.
- `any` tanpa alasan yang jelas (gunakan `unknown` + penyempitan tipe).
- Secret/API key di frontend.
- Menambah integrasi pembayaran atau Moota pada tahap prototype.

### 25.4 Routing

| Path | Halaman |
|---|---|
| `/` | Homepage |
| `/produk` | Product Listing |
| `/produk/:id` | Product Detail |
| `/cart` | Cart |
| `/checkout` | Checkout |
| `*` | Halaman 404 sederhana (`EmptyState`) |

---

## 26. Workflow Stitch

**Urutan kerja:** `design.md` (dokumen ini) → desain di Stitch → review dan persetujuan → implementasi React + TypeScript.

### 26.1 Cara memakai dokumen ini di Stitch
1. Berikan ringkasan **Brand Direction**, **Color System**, **Typography**, **Radius**, dan **Shadows** sebagai konteks global.
2. Generate **satu halaman per prompt**, desktop dulu, lalu varian mobile.
3. Periksa hasil terhadap checklist di bagian 29 sebelum disetujui.
4. Catat deviasi yang disetujui kembali ke `design.md` agar tetap menjadi sumber kebenaran.

### 26.2 Prompt dasar (konteks global)

```
Design a modern, clean e-commerce website "MapahJastip.id", a Japan shopping
proxy service (jastip) for Indonesian customers. Style: white-dominant with
blue (#0B8FEF primary, #123B78 dark blue, #16C4E8 cyan accent, #EAF7FF/#F4FAFF
light backgrounds). Lots of whitespace, rounded cards (16px), soft blue shadows,
Plus Jakarta Sans headings, Inter body. Subtle Japanese feel (Mount Fuji,
Tokyo skyline, soft circles) without clutter. Professional, trustworthy,
friendly, fresh. UI language: Indonesian.
```

### 26.3 Prompt per halaman (ringkas)

| Halaman | Prompt inti |
|---|---|
| Homepage | Hero ("Titip Belanja di Jepang, Kami yang Urus.", CTA "Titip Sekarang" + "Lihat Produk"), kategori, produk, 3 layanan, 6 langkah order, jadwal penerbangan, banner reseller, FAQ accordion, footer biru tua |
| Product Listing | Toolbar search + sorting, sidebar filter kategori, grid produk 4 kolom, tombol "Tampilkan Lebih Banyak" |
| Product Detail | Galeri kiri, info kanan (harga, rating, stok, quantity, Add to cart, Buy now), deskripsi, produk terkait |
| Cart | Daftar item (gambar, nama, qty, subtotal, hapus), ringkasan sticky, tombol "Lanjut ke Checkout", empty state |
| Checkout | Form customer + alamat, pilih layanan (radio card), metode bayar dummy, ringkasan pesanan, status pembayaran |
| Mobile | Tambahkan: "Mobile 390px version, hamburger drawer navigation, sticky bottom action bar, 2-column product grid" |

---

## 27. Prototype Scope

Target: ± **20–30%** dari sistem akhir.

### Termasuk
- Homepage (9 section)
- Product Listing (search, filter, sorting, load more)
- Product Detail (quantity, add to cart, buy now)
- Cart (persist lokal)
- Checkout (form + validasi + ringkasan + status pembayaran dummy)
- Navbar responsive + footer
- Komponen reusable pada bagian 18
- Mock data pada bagian 22

### Tidak termasuk
Payment gateway nyata · Integrasi Moota · Bot Moota / MCP · Database production · Admin dashboard · Autentikasi penuh (login hanya placeholder) · Manajemen reseller penuh · Manajemen jadwal penerbangan penuh · Pelacakan pesanan nyata · Notifikasi email/WhatsApp.

---

## 28. Future Development

| Fase | Fokus |
|---|---|
| **Fase 2** | Backend API, database, autentikasi, data produk nyata, pembuatan order |
| **Fase 3** | Integrasi Moota (di backend), pembaruan status pembayaran otomatis, kode unik |
| **Fase 4** | Admin dashboard (produk, order, jadwal penerbangan), halaman reseller lengkap |
| **Fase 5** | Pelacakan pesanan, notifikasi, review & rating nyata, halaman Profil/Riwayat |
| **Fase 6** | Optimasi SEO, performa, analitik, pengujian otomatis, deployment production |

---

## 29. Definition of Done

### Desain (Stitch)
- [ ] Homepage, Listing, Detail, Cart, Checkout tersedia versi **desktop dan mobile**.
- [ ] Hanya memakai warna, tipografi, radius, dan shadow dari dokumen ini.
- [ ] Navbar desktop dan mobile drawer sesuai bagian 12.
- [ ] Empty state, loading, dan error ada untuk Listing, Cart, dan Checkout.
- [ ] Kontras teks memenuhi bagian 6.3.
- [ ] Disetujui pemilik produk.

### Prototype (kode)
- [ ] Lima route berfungsi dan navigasi antar halaman benar.
- [ ] Semua komponen pada bagian 18 ada dan reusable (tanpa duplikasi markup).
- [ ] Cart: tambah, ubah qty, hapus, total benar, tersimpan setelah refresh.
- [ ] Checkout: validasi form, ringkasan benar, empat status pembayaran dummy bisa ditampilkan.
- [ ] Listing: search, filter kategori, sorting, load more bekerja; state diperbarui di URL.
- [ ] Responsif diuji di 360, 390, 768, 1024, 1280, 1440; tanpa scroll horizontal.
- [ ] Target sentuh ≥ 44px; navigasi keyboard dan fokus terlihat berfungsi.
- [ ] `tsc --noEmit` lolos dengan `strict`; tanpa `any` yang tidak beralasan; lint bersih.
- [ ] Tidak ada secret/API key di repo atau bundle; `.env.example` tersedia.
- [ ] Tidak ada integrasi pembayaran/Moota nyata.
- [ ] README singkat: cara menjalankan, struktur folder, dan batasan prototype.

---

## 30. Asumsi & Pertanyaan Terbuka

**Asumsi yang dibuat di dokumen ini (mohon dikonfirmasi):**

1. **Menu "Harga"** tidak punya halaman/section sendiri di brief, jadi di prototype diarahkan ke section Layanan. Jika Anda ingin section atau halaman Harga khusus (tabel biaya jasa/ongkir), tambahkan ke bagian 13.
2. **Biaya jasa** dan **kode unik** muncul sebagai baris dummy di checkout, padahal brief hanya menyebut ongkir dummy. Hapus jika tidak diinginkan.
3. **Estimasi waktu** layanan dan **jawaban FAQ** (terutama refund dan batasan obat/kesehatan) adalah draft yang perlu keputusan bisnis.
4. **Font** (Plus Jakarta Sans + Inter), **Tailwind CSS**, dan **React Router** adalah rekomendasi, bukan keharusan.
5. **Warna** disesuaikan sedikit demi kontras (tombol memakai `primary-600`; teks status memakai varian lebih gelap). Warna baseline asli tetap dipakai sebagai warna brand.
6. Pada layar 768–1279px navbar memakai hamburger karena delapan link menu terlalu padat.

**Pertanyaan terbuka:**
- Apakah file logo resmi (SVG, versi berwarna dan putih) sudah tersedia?
- Ada rekening bank/kanal pembayaran yang sudah pasti (untuk label dummy checkout)?
- Apakah harga produk akan ditampilkan juga dalam Yen (¥) sebagai referensi?
- Apakah reseller mendapat harga atau katalog yang berbeda dari pembeli personal?

---

*Akhir dokumen. Perubahan pada desain atau scope harus diperbarui di file ini terlebih dahulu.*
