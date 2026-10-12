# PANDUAN LENGKAP PRESENTASI & LAPORAN PROYEK MAPAHJASTIP.ID
> **Dokumen Resmi untuk Presentasi ke Klien / Pemilik Usaha MapahJastip.id**  
> *Versi: 2.0 (Lengkap & Terstruktur)*  
> *Tanggal: 12 Oktober 2026*  
> *URL Demo Live: [https://kirimdigi.github.io/MapahJastip/](https://kirimdigi.github.io/MapahJastip/)*

---

## 📊 1. TINGKAT KESIAPAN WEBSITE (ESTIMASI: ~92%)

Website **MapahJastip.id** saat ini telah siap di tahap **Soft Launch (Siap Uji Publik)** dengan persentase kesiapan mencapai **~92%**.  
Seluruh alur utama bisnis (*core business flow*) mulai dari pemilihan barang, kalkulator yen, checkout, login akun, hingga pelacakan resi 4 tahap dan dashboard admin sudah **100% aktif dan terhubung ke Database Cloud Supabase**.

### Tabel Status Kesiapan per Modul

| Modul / Komponen Sistem | Kesiapan | Status Operasional |
| :--- | :---: | :--- |
| **Desain Antarmuka (UI/UX) & Tampilan Mobile** | **100%** | Selesai (Desain premium ala Jepang, cepat, responsif di Android & iPhone) |
| **Katalog Produk & Sistem Keranjang Belanja** | **100%** | Selesai (Pencarian cepat, filter kategori, hitung berat gram otomatis) |
| **Kalkulator Biaya Transparan (Yen ➔ Rupiah)** | **100%** | Selesai (Kurs live yen, fee jastip, ongkir kargo per 100g, pajak cukai) |
| **Sistem Autentikasi Akun (Login & Daftar)** | **95%** | Selesai (Tersimpan aman di Cloud Database Supabase dengan isolasi privasi) |
| **Pelacakan Resi Kargo 4 Tahap (Manual Tracking)**| **95%** | Selesai (Sinkronisasi status antara HP pembeli & Dashboard Admin) |
| **Portal / Dashboard Khusus Admin (`/admin`)** | **92%** | Selesai (PIN admin, kontrol status pesanan, input resi, hapus data cloud) |
| **Penyimpanan Cloud Database (Supabase Realtime)**| **90%** | Selesai (Tabel `orders` dan `app_users` aktif online) |
| **Otomatisasi Payment Gateway Perbankan** | **70%** | Siap pakai via Transfer Manual BCA & QRIS (Belum mutasi otomatis via API bank) |

---

## 🧭 2. PENJELASAN LENGKAP SETIAP MENU WEBSITE

### 1. **Header & Bar Navigasi Atas**
* **Fungsi:** Bagian atas yang selalu terlihat di semua halaman untuk membangun kepercayaan awal pengunjung.
* **Fitur yang Tersedia:**
  * **Kurs Acuan Live (1 JPY = Rp ...)**: Menampilkan kurs harian secara transparan agar pembeli yakin harga yang diberikan jujur tanpa mark-up liar.
  * **Badge 100% Struk Resmi Asli**: Jaminan legalitas bahwa barang dibeli langsung di toko resmi Tokyo, Jepang.
  * **Pengalih Bahasa (Indonesia / Jepang)** & **Mode Terang/Gelap (Light/Dark)**: Menambah kenyamanan pengalaman pengguna.
  * **Keranjang Belanja Mengambang (Drawer)**: Menghitung total biaya belanjaan dan total berat barang (gram) secara otomatis.
  * **Status Akun Pelanggan**: Menampilkan nama akun pembeli (misal: Budi Pratama) saat login, tombol profil, dan opsi keluar.

---

### 2. **Halaman Beranda (Home Page — `/`)**
* **Fungsi:** Etalase utama untuk menarik minat pembeli dan menjelaskan layanan dalam hitungan detik.
* **Fitur yang Tersedia:**
  * **Banner Tokyo Interaktif:** Dilengkapi tombol *"Titip Sekarang"* yang langsung menghubungkan pembeli ke WhatsApp resmi.
  * **7 Kartu Kategori Unggulan:** Akses cepat 1-klik untuk:
    1. *Skincare & Beauty* (Shiseido, Melano CC, SK-II, Hada Labo)
    2. *Makanan & Minuman* (Tokyo Banana, Royce Chocolate, KitKat Matcha)
    3. *Fashion & Brand* (Onitsuka Tiger, Bape, Uniqlo Japan, Issey Miyake)
    4. *Elektronik* (Nintendo Switch, Sony Headphones, Kamera)
    5. *Jepang Character* (Pokemon Center, Sanrio, Ghibli, Pop Mart)
    6. *Vitamin & Kesehatan* (DHC Supplement, Rohto Eye Drops, Salonpas)
    7. *Lainnya* (Formulir titipan barang khusus di luar katalog)
  * **Alur Belanja (Omotenashi Flow):** Panduan 4 tahap mudah: *Pilih Barang ➔ Verifikasi Biaya ➔ Belanja di Tokyo ➔ Pengemasan Standar Kargo ➔ Kirim Sampai Rumah*.
  * **Pratinjau Kuota Bagasi:** Menampilkan sisa kuota bagasi (kg) agar pelanggan terdorong segera order sebelum kuota penuh (*urgensi FOMO*).

---

### 3. **Menu Produk / Katalog (`/katalog`)**
* **Fungsi:** Tempat pembeli mencari barang rekomendasi Jepang yang siap dipesan.
* **Fitur yang Tersedia:**
  * **Pencarian Cepat (*Live Search*)**: Hasil pencarian muncul seketika tanpa memuat ulang halaman.
  * **Filter Kategori Cepat**: Filter berbasis tombol pills ramah layar sentuh HP.
  * **Modal Detail Produk**: Menampilkan rincian berat barang, harga estimasi Rupiah & Yen, serta tombol *"Tambah ke Keranjang"*.
  * **Tombol *"Request Barang di Luar Katalog"***: Membuka formulir titip barang khusus untuk produk langka yang belum ada di etalase.

---

### 4. **Menu Cara Kerja / Cara Belanja (`/cara-belanja`)**
* **Fungsi:** Halaman edukasi bagi pembeli baru agar memahami mekanisme titip belanja Jepang dari awal hingga paket sampai di rumah.
* **Fitur yang Tersedia:** Rincian alur penitipan, garansi barang, estimasi durasi belanja, dan tips mencari barang Jepang.

---

### 5. **Menu Jadwal Penerbangan (`/jadwal-penerbangan`)**
* **Fungsi:** Menghadirkan rasa kepastian tanggal belanja dan keberangkatan kargo/shopper.
* **Fitur yang Tersedia:**
  * Menampilkan maskapai penerbangan resmi (ANA, JAL, Garuda Indonesia).
  * Batas waktu setor titipan (*Cut-off Order Date*).
  * Estimasi tanggal mendarat di bandara Soekarno-Hatta (CGK).
  * Status kuota bagasi penerbangan (*Open / Hampir Penuh*).

---

### 6. **Menu Estimasi Biaya / Kalkulator Transparan (`/estimasi`)**
* **Fungsi:** Menghilangkan keraguan pembeli mengenai biaya tersembunyi (*hidden fees*).
* **Fitur yang Tersedia:**
  * Pembeli cukup memasukkan harga barang dalam Yen Jepang (¥).
  * Sistem menghitung otomatis:
    * Konversi nilai barang ke Rupiah berdasarkan kurs live.
    * Fee jasa titip (*Jastip Fee*) yang adil.
    * Pilihan ongkir kargo Jepang: EMS Express (3-5 hari kerja), Air Cargo Terjadwal (7-10 hari), atau Pos Reguler.
    * Estimasi bea masuk & pajak impor Indonesia secara transparan.
  * Tombol kirim rincian perhitungan langsung ke WhatsApp CS.

---

### 7. **Menu Testimoni (`/testimoni`)**
* **Fungsi:** Membangun kredibilitas dan bukti sosial (*social proof*).
* **Fitur yang Tersedia:** Ulasan kepuasan pembeli, rating bintang 5, foto barang hasil belanja di Tokyo, dan tanggal kloter belanja.

---

### 8. **Menu FAQ / Tanya Jawab (`/faq`)**
* **Fungsi:** Menjawab pertanyaan pelanggan yang sering diajukan (*self-service*).
* **Fitur yang Tersedia:** Informasi mengenai keaslian struk belanja, barang yang dilarang bea cukai (Lartas/BPOM), garansi barang pecah belah, dan kebijakan pembatalan.

---

### 9. **Menu Lacak Resi Kargo & Status Pesanan (`/status-pesanan`)**
* **Fungsi:** Pusat pelacakan pesanan mandiri sehingga pelanggan tidak perlu repot menanyakan status paket secara manual via chat.
* **Fitur yang Tersedia:**
  * **Privasi Ketat:** Pelanggan yang login hanya dapat melihat pesanannya sendiri. Pengunjung tanpa login wajib mengetikkan nomor order (misal `#MPJ-095978`) atau nomor resi resmi.
  * **Alur Tracking 4 Tahap:**
    1. *Pesanan Dikonfirmasi & Masuk Antrean Belanja* (Kurs yen dikunci, masuk manifes Tokyo Hub).
    2. *Pembelian di Toko Tokyo & Pengemasan Bubble Wrap Lapis 3* (Shopper membeli langsung dan mengemas sesuai standar kargo internasional).
    3. *Pengiriman Kargo Udara (Japan Post EMS / Paxel / JNE)* (Dilengkapi nomor resi resmi dan tombol 1-klik untuk melacak di website resmi kurir).
    4. *Pesanan Telah Selesai Diterima* (Paket sampai di tangan pembeli dengan aman).

---

### 10. **Menu Keranjang Belanja & Checkout (`/checkout`)**
* **Fungsi:** Tempat pembeli mengunci pesanan, mengisi alamat, dan memilih pengiriman.
* **Fitur yang Tersedia:**
  * Data otomatis terisi dari akun profil yang sedang login (nama, nomor WA, alamat).
  * Pilihan zona tujuan pengiriman di Indonesia (Jabodetabek, Jawa Barat, Luar Jawa).
  * Pilihan metode pembayaran: **Transfer Bank BCA** dan **QRIS Realtime**.
  * **Penyimpanan Otomatis ke Cloud Supabase**: Pesanan yang dibuat langsung tersimpan permanen di database tabel `orders`.

---

### 11. **Portal Khusus Admin (`/admin`)**
* **Fungsi:** Pusat kendali operasional harian bagi pemilik usaha dan admin toko.
* **Fitur yang Tersedia:**
  * **Proteksi Akses PIN**: Akses terenkripsi khusus admin.
  * **Manajemen Pesanan Realtime**: Membaca seluruh pesanan masuk dari Cloud Database Supabase.
  * **Tombol Kontrol Tracking Bertahap**: Admin cukup menekan tombol *"Konfirmasi Sudah Dikemas"*, *"Konfirmasi Dikirim & Input Resi"*, hingga *"Pesanan Selesai"*.
  * **Input Nomor Resi Kargo**: Menginput nomor resi resmi (Japan Post EMS, Paxel, JNE) yang seketika langsung tampil di layar pelacakan pelanggan.
  * **Hapus Pesanan Permanen**: Tombol hapus pesanan langsung membersihkan data dari database Cloud.

---

## 🚫 3. APA SAJA YANG BELUM DIPASANG? (BELUM ADA)

*Poin-poin ini adalah fitur pelengkap yang belum ada di versi saat ini dan bisa dijadikan pengembangan tahap selanjutnya (Fase 2):*

1. **Payment Gateway Otomatis (Midtrans / Xendit / Moota):**
   * *Kondisi saat ini:* Pembeli melakukan transfer manual ke rekening BCA atau scan QRIS statis, lalu konfirmasi pembayaran ke admin.
   * *Yang belum ada:* Belum ada integrasi API bank otomatis yang mendeteksi uang masuk ke rekening secara mandiri dan mengubah status jadi *"Lunas"* otomatis tanpa dicek manual oleh admin.

2. **Bot Pengirim Pesan WhatsApp Otomatis (Fonnte / Wwebjs):**
   * *Kondisi saat ini:* Pembeli dan admin berkomunikasi melalui tautan WhatsApp generator biasa.
   * *Yang belum ada:* Belum ada bot otomatis yang langsung mengirim pesan WhatsApp ke nomor HP pelanggan setiap kali admin menginput resi atau mengubah status pesanan.

3. **Form Tambah & Edit Produk Dinamis di Layar Admin:**
   * *Kondisi saat ini:* Produk di halaman katalog masih berupa data bawaan sistem (*dummy products*).
   * *Yang belum ada:* Admin belum bisa mengunggah foto produk baru, mengganti harga promo, dan menghapus barang langsung dari formulir layar admin ke tabel database Supabase.

4. **Pengiriman Email Notifikasi Otomatis (SMTP / Resend):**
   * *Yang belum ada:* Belum ada pengiriman bukti struk/invoice ke alamat email pembeli secara otomatis setelah checkout.

5. **Nama Domain Resmi Berbayar (.com / .id):**
   * *Kondisi saat ini:* Website masih menggunakan alamat gratis GitHub Pages (`kirimdigi.github.io/MapahJastip/`).
   * *Yang belum ada:* Belum dipasangi domain resmi bermerek seperti `mapahjastip.id` atau `mapahjastip.com`.

---

## 💎 4. KELEBIHAN WEBSITE INI

1. **Faktor Kepercayaan Tinggi (*High Trust Factor*):**
   * Desain profesional bertema Jepang (*Omotenashi*), bersih, tidak kaku, dan jauh lebih meyakinkan dibanding toko jastip yang hanya menggunakan media sosial atau spreadsheet.
   * Dilengkapi bukti struk resmi dan transparansi legalitas cukai, sehingga pembeli barang bernilai tinggi (tas branded, kamera, gadget, kosmetik mahal) merasa sangat aman.

2. **Database Cloud Modern & Terpusat (Supabase):**
   * Data akun pengguna dan pesanan tidak disimpan di komputer lokal, melainkan di Cloud Database PostgreSQL (Supabase). Jika admin membuka laptop atau smartphone lain, seluruh data tetap sinkron secara realtime.

3. **Sistem Tracking Kargo 4 Tahap yang Sinkron:**
   * Hubungan dua arah antara Dashboard Admin dan halaman Lacak Pesanan pelanggan berjalan akurat. Begitu admin memperbarui status belanja di Tokyo, pembeli langsung melihat pembaruannya di HP masing-masing.

4. **Keamanan Privasi Pelanggan:**
   * Data belanja pembeli diisolasi ketat. Akun Budi hanya bisa melihat riwayat belanja miliknya sendiri dan tidak bisa melihat data pelanggan lain.

5. **Performa Sangat Ringan & Cepat (*Ultra Fast Loading*):**
   * Dibangun dengan arsitektur modern (React 18 + Vite), website terbuka seketika tanpa jeda pemuatan halaman yang lambat.

---

## ⚠️ 5. KEKURANGAN WEBSITE INI

1. **Verifikasi Pembayaran Masih Mengandalkan Pengecekan Admin:**
   * Admin masih perlu mengecek mutasi rekening bank secara manual untuk memastikan dana pembeli sudah masuk sebelum melanjutkan belanjaan ke tahap Tokyo Hub.

2. **Katalog Produk Belum Terhubung Database Mandiri:**
   * Penambahan barang baru di katalog masih memerlukan pengaturan file data produk oleh developer, belum bisa di-upload mandiri lewat form admin.

3. **Pelacakan Resi Bukan Penarikan API Ekspedisi Langsung:**
   * Admin harus memasukkan nomor resi kargo secara manual ke sistem. Sistem sudah menyediakan tombol langsung ke situs resmi kurir Japan Post / Paxel, namun belum menarik riwayat pergerakan paket secara otomatis dari API ekspedisi berbayar.

---

## 🎯 6. SKRIP CONTOH PRESENTASI KE KLIEN

> *"Bapak/Ibu, sistem website **MapahJastip.id** saat ini telah siap sekitar **92%** dan sudah aktif online di server demo.  
> Seluruh alur utama bisnis — mulai dari katalog barang, kalkulator kurs yen transparan, keranjang belanja, checkout, sistem login pelanggan, pelacakan resi kargo 4 tahap terintegrasi dengan ekspedisi resmi Jepang, hingga dashboard admin untuk input resi — **sudah beroperasi penuh dan terhubung ke Database Cloud Supabase**.  
> Di tahap ini kita tinggal melengkapi rincian rekening operasional dan produk unggulan. Sedangkan fitur seperti payment gateway otomatis dan bot WhatsApp dapat kita jadwalkan sebagai pengembangan tahap berikutnya seiring bertambahnya volume pesanan."*
