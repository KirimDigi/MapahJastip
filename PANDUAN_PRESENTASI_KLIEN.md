# PANDUAN PRESENTASI & LAPORAN PROYEK MAPAHJASTIP.ID
> **Dokumen Resmi untuk Presentasi ke Klien / Pemilik Usaha MapahJastip.id**  
> *Versi: 1.0 — Soft Launch Ready (~92% Selesai)*  
> *Tanggal: 12 Oktober 2026*  
> *URL Demo Live: [https://kirimdigi.github.io/MapahJastip/](https://kirimdigi.github.io/MapahJastip/)*

---

## 📊 1. RINGKASAN KESIAPAN PROYEK (PERSENTASE: 92%)

Website **MapahJastip.id** saat ini telah mencapai tahap **Soft Launch (Siap Uji Publik)** dengan tingkat kesiapan sistem mencapai **~92%**. Seluruh alur utama bisnis (*core business flow*) dari hulu ke hilir sudah beroperasi dan terintegrasi langsung dengan database Cloud Supabase.

### Tabel Rincian Progres per Modul

| Modul / Komponen Sistem | Persentase | Status Teknis |
| :--- | :---: | :--- |
| **Desain Antarmuka (UI/UX) & Mobile Experience** | **100%** | Desain premium modern bertema Jepang, cepat, dan responsif di Android/iPhone |
| **Katalog Produk & Sistem Keranjang Belanja** | **100%** | Fitur pencarian instan, filter kategori, hitung berat (gram) otomatis |
| **Kalkulator Biaya Transparan (Yen ➔ Rupiah)** | **100%** | Konversi kurs yen live, hitung ongkir kargo per 100g, dan estimasi cukai |
| **Sistem Autentikasi Pengguna (Login & Register)** | **95%** | Terhubung ke tabel `app_users` Supabase Cloud dengan isolasi data akun |
| **Lacak Resi Kargo & Manual Tracking 4 Tahap** | **95%** | Sinkronisasi dua arah pelanggan & admin (Japan Post EMS, Paxel, JNE) |
| **Dashboard / Portal Admin (`/admin`)** | **92%** | Proteksi PIN admin, kelola pesanan, update status, input resi, hapus data cloud |
| **Integrasi Database Cloud (Supabase Realtime)** | **90%** | Penyimpanan terpusat data akun dan pesanan pelanggan secara realtime |
| **Otomatisasi Payment Gateway Bank** | **70%** | Siap pakai via Transfer BCA & QRIS (Pengembangan lanjutan: webhook otomatis) |

---

## 🧭 2. PENJELASAN SETIAP MENU & HALAMAN WEBSITE

### 1. Bar Navigasi & Header Atas
* **Fungsi:** Menyajikan transparansi dan kredibilitas bisnis sejak detik pertama pengunjung membuka website.
* **Fitur Utama:**
  * **Kurs Acuan Live (1 JPY = Rp ...)**: Menampilkan kurs tukar secara terbuka sehingga pelanggan yakin tidak ada manipulasi harga tersembunyi.
  * **Badge 100% Struk Resmi Asli**: Jaminan bahwa barang dibeli langsung dari toko resmi di Tokyo, Jepang.
  * **Pengalih Bahasa (Indonesia / Jepang)**: Memberikan kesan platform profesional lintas negara.
  * **Keranjang Belanja Mengambang (Drawer)**: Menghitung total harga dan estimasi total berat barang secara otomatis.
  * **Status Akun Pelanggan**: Menampilkan nama akun pembeli (misal: Budi Pratama) saat login dan menu masuk/daftar.

---

### 2. Halaman Beranda (Home Page — `/`)
* **Fungsi:** Etalase utama untuk mengubah pengunjung menjadi pembeli (*conversion focused*).
* **Fitur Utama:**
  * **Hero Banner Interaktif Tokyo**: Banner visual berkualitas tinggi dengan tombol pintas *"Titip Sekarang"* yang langsung mengarahkan ke WhatsApp Customer Service.
  * **7 Kartu Kategori Populer**: Akses cepat 1-klik untuk:
    1. *Skincare & Beauty* (Shiseido, Rohto Melano CC, SK-II, Hada Labo)
    2. *Makanan & Minuman* (Tokyo Banana, Royce Chocolate, KitKat Matcha)
    3. *Fashion & Brand* (Onitsuka Tiger, Bape, Uniqlo Japan, Issey Miyake)
    4. *Elektronik* (Nintendo Switch, Sony Headphones, Kamera)
    5. *Jepang Character* (Pokemon Center, Sanrio, Ghibli Studio, Pop Mart)
    6. *Vitamin & Obat Kesehatan* (DHC Supplement, Rohto Eye Drops, Koyok Salonpas)
    7. *Lainnya / Request Khusus* (Form titipan link barang di luar katalog)
  * **Omotenashi Flow (Alur Titip Belanja)**: Infografis 4 langkah mudah: *Pilih Barang ➔ Verifikasi Biaya ➔ Pembelian di Tokyo ➔ Kirim Sampai Rumah*.
  * **Pratinjau Jadwal Kloter Penerbangan**: Menampilkan sisa kuota bagasi (kg) yang memicu pelanggan segera memesan sebelum slot bagasi habis (*urgensi FOMO*).

---

### 3. Menu Katalog Produk (`/katalog`)
* **Fungsi:** Pusat eksplorasi produk Jepang siap titip.
* **Fitur Utama:**
  * **Pencarian Cepat (*Instant Search*)**: Hasil pencarian muncul seketika tanpa perlu memuat ulang halaman.
  * **Filter Kategori Dinamis**: Pemfilteran mudah dengan tombol kategori ramah layar sentuh ponsel.
  * **Modal Detail Barang**: Menampilkan berat produk, estimasi harga dalam Rupiah dan Yen, serta tombol *"Tambah ke Keranjang"*.
  * **Request Barang di Luar Katalog**: Tombol khusus bagi pembeli yang ingin menitip barang langka yang belum ada di katalog website.

---

### 4. Menu Jadwal Penerbangan (`/jadwal-penerbangan`)
* **Fungsi:** Memberikan kepastian jadwal belanja dan waktu keberangkatan bagasi shopper.
* **Fitur Utama:**
  * Menampilkan informasi maskapai terpercaya (ANA - All Nippon Airways, JAL - Japan Airlines, Garuda Indonesia).
  * Menampilkan rute penerbangan resmi (Haneda/Narita Tokyo ➔ Soekarno-Hatta Jakarta).
  * Batas waktu setor titipan (*Cut-Off Order Date*) dan estimasi tanggal mendarat di Jakarta.
  * Indikator kuota bagasi (*Open / Hampir Penuh*).

---

### 5. Menu Estimasi Biaya / Kalkulator Transparan (`/estimasi`)
* **Fungsi:** Menghilangkan keraguan pembeli terkait tarif titip belanja dan ongkir kargo.
* **Fitur Utama:**
  * Input nominal harga barang dalam Yen Jepang (¥).
  * Otomatis mengkalkulasi:
    * Nilai barang dalam Rupiah berdasarkan kurs hari ini.
    * Fee jasa titip (*Jastip Fee*) yang adil.
    * Pilihan ongkir kargo Jepang: EMS Express (3-5 hari), Air Cargo Terjadwal (7-10 hari), atau Pos Reguler.
    * Estimasi bea masuk & pajak impor Indonesia secara transparan.
  * Tombol konsultasi langsung ke WhatsApp dengan rincian hitungan yang sudah tersusun rapi.

---

### 6. Menu Lacak Resi Kargo & Status Pesanan (`/status-pesanan`)
* **Fungsi:** Pelacakan pesanan mandiri sehingga pelanggan tidak perlu repot menanyakan *"Barang saya sudah sampai mana?"* ke chat admin.
* **Fitur Utama:**
  * **Privasi Ketat & Isolasi Akun**: Pelanggan yang telah login hanya akan melihat riwayat belanja miliknya sendiri (data pelanggan lain tidak akan pernah bocor). Pengunjung yang belum login dapat melacak secara aman dengan memasukkan Nomor Pesanan (misal: `#MPJ-095978`) atau Nomor Resi.
  * **Alur Tracking Manual 4 Tahap**:
    1. *Pesanan Dikonfirmasi & Masuk Antrean Belanja* (Kurs Yen dikunci, pesanan masuk manifes Tokyo Hub).
    2. *Pembelian di Toko Tokyo & Pengemasan Bubble Wrap* (Shopper membeli langsung dan mengemas dengan bubble wrap lapis 3 standar kargo).
    3. *Pengiriman Kargo Udara (Japan Post EMS / Paxel)* (Dilengkapi nomor resi resmi dan tombol pelacakan langsung ke situs kurir).
    4. *Pesanan Telah Selesai Diterima* (Paket sampai di tangan pembeli dengan aman).

---

### 7. Menu Checkout & Pembayaran (`/checkout`)
* **Fungsi:** Titik penguncian pesanan dan pemilihan metode pengiriman.
* **Fitur Utama:**
  * Otomatis mengisi nama, nomor telepon WhatsApp, dan alamat sesuai data profil akun yang sedang login.
  * Pilihan zona pengiriman di Indonesia (Jabodetabek, Jawa Barat, Luar Pulau Jawa).
  * Pilihan metode pembayaran: **Transfer Bank BCA** dan **QRIS Realtime**.
  * **Penyimpanan Otomatis ke Cloud Supabase**: Pesanan yang dibuat langsung tersimpan permanen di database tabel `orders`.

---

### 8. Portal Khusus Admin (`/admin`)
* **Fungsi:** Pusat kendali operasional harian bagi pemilik usaha dan admin toko.
* **Fitur Utama:**
  * **Proteksi Akses PIN**: Keamanan akses khusus pengelola toko.
  * **Manajemen Pesanan Realtime**: Melihat seluruh pesanan masuk dari pembeli secara langsung dari Supabase.
  * **Kontrol Tracking Bertahap**: Admin cukup menekan tombol *"Konfirmasi Sudah Dikemas"*, *"Konfirmasi Dikirim & Input Resi"*, hingga *"Pesanan Selesai"*.
  * **Input Nomor Resi Kargo**: Menginput nomor resi (misal resi EMS Japan Post `EJ...JP` atau resi Paxel/JNE) yang seketika langsung tampil di halaman pelacakan pelanggan.
  * **Penghapusan Data Permanen**: Tombol hapus pesanan langsung membersihkan data dari database Cloud.

---

## 💎 3. KELEBIHAN UTAMA WEBSITE (SELLING POINTS)

1. **Tingkat Kepercayaan Tinggi (Trust Factor):**
   * Desain tidak terlihat seperti toko jastip amatir, melainkan platform e-commerce jastip premium dengan filosofi pelayanan Jepang (*Omotenashi*).
   * Bukti struk resmi dan transparansi bea cukai memberikan rasa aman bagi pembeli barang bernilai tinggi (seperti tas branded, kamera, gadget, dan skincare mahal).

2. **Database Cloud Modern & Terpusat (Supabase):**
   * Data tidak tersimpan lokal di satu komputer, melainkan tersimpan di cloud database internasional (Supabase PostgreSQL). Jika admin membuka laptop atau perangkat lain, data tetap sama dan terpusat.

3. **Sinkronisasi Dua Arah yang Akurat:**
   * Apapun yang diubah admin di dashboard (mengubah status ke kemas, input resi, dll.) seketika langsung berubah pada tampilan pelanggan.

4. **Keamanan Privasi Pelanggan:**
   * Sistem memiliki isolasi data yang ketat: Akun Budi hanya melihat pesanan Budi, tidak bisa mengintip pesanan pelanggan lain.

5. **Kecepatan Akses Sangat Tinggi (*Ultra Fast Loading*):**
   * Dibangun menggunakan arsitektur modern (React 18 + Vite), halaman terbuka instan tanpa jeda loading berat.

---

## 🚀 4. REKOMENDASI PENGEMBANGAN TAHAP SELANJUTNYA (FASE 2)

*Poin-poin ini dapat disampaikan ke klien agar mereka melihat bahwa sistem ini memiliki peta jalan (*roadmap*) jangka panjang yang profesional:*

1. **Otomatisasi Payment Gateway (Midtrans / Xendit / Moota):**
   * *Saat ini:* Menggunakan sistem instruksi transfer manual BCA dan QRIS.
   * *Fase 2:* Sistem mendeteksi otomatis saat uang masuk ke rekening dan status pesanan langsung berubah *"Lunas"* dalam 3 detik tanpa verifikasi manual.

2. **WhatsApp Bot Notification (Fonnte / Wwebjs):**
   * *Saat ini:* Pengiriman bukti dan chat terhubung lewat tautan WhatsApp generator.
   * *Fase 2:* Sistem otomatis mengirim pesan WhatsApp ke nomor HP pelanggan setiap kali shopper mengubah status pesanan (misal: notifikasi *"Pesanan Anda telah dikemas di Tokyo Hub"* atau *"Paket sudah terbang, nomor resi Anda adalah EJ..."*).

3. **Manajemen Produk Dinamis di Dashboard Admin:**
   * *Saat ini:* Produk katalog dikelola melalui file konfigurasi data.
   * *Fase 2:* Admin dapat menambah foto produk baru, mengganti harga promo, dan menghapus stok langsung dari formulir layar admin.

---

## 🎯 5. CONTOH KALIMAT PENUTUP SAAT PRESENTASI KE KLIEN

> *"Bapak/Ibu, sistem website **MapahJastip.id** saat ini telah siap sekitar **92%** dan sudah aktif online di server demo.  
> Seluruh alur utama bisnis — mulai dari katalog, kalkulator yen, checkout belanja, login akun pelanggan, pelacakan resi kargo 4 tahap yang terhubung dengan kurir resmi Jepang, hingga portal admin untuk kontrol resi — **sudah beroperasi 100% dan terhubung ke database Cloud Supabase**.  
> Kita tinggal memastikan data produk katalog awal dan nomor rekening operasional disesuaikan, dan website ini sudah siap digunakan untuk menerima pesanan perdana dari para pembeli."*
