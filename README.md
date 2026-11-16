# Jejak Nol

**Media informasi zero-waste untuk pelajar dan mahasiswa, di rumah maupun di kos.**
Karya Lomba Web Design Techno Versary Vol. II, HIMA-TI FKOM Universitas Kuningan. Tema: *EcoDigital For Environment*, sub-tema *Media Informasi Zero-waste Lifestyle dan Daur Ulang Sampah*.

## Deskripsi

Banyak orang sebenarnya mau memilah sampah, tapi berhenti di tiga pertanyaan: barang ini masuk tong mana, apa penggantinya, dan sisanya disetor ke mana. Jejak Nol menjawabnya dalam empat langkah, masing-masing dengan alat yang bisa langsung dicoba:

| Halaman | Isi |
|---|---|
| **Beranda** (`index.html`) | Cerita singkat: pencarian cepat “Ini dibuang ke mana?”, interaksi **“100 sampah di tong”** (tong berisi 100 sampah rata-rata Indonesia terisi saat digulir, botol dari awal halaman jatuh ke salah satu kotaknya, lalu tombol *Pilah isinya!* mengelompokkan isinya menjadi tiga kelompok yang masing-masing menuju satu langkah), jalan empat langkah yang dilalui satu botol sampai masuk tong, dan contoh Kartu Jejak-ku |
| **Pilah** (`pilah.html`) | Pencarian barang, jelajah ruangan (dapur, kamar mandi, belajar/kerja & kos, belanja), isi empat tong, arti kode plastik 1–7 |
| **Kurangi** (`kurangi.html`) | Kalkulator barang sekali pakai yang bisa dicegah per tahun, perbandingan tumpukan sebelum dan sesudah, cara menghitung, daftar pengganti |
| **Olah** (`olah.html`) | Panduan kompos ember dan eco-enzyme, galeri daur ulang dengan filter “saya punya…”, tombol simpan ide, Mitos vs Fakta |
| **Setor** (`setor.html`) | Checklist persiapan sebelum menyetor, jenis tempat setor, direktori lokasi di Kuningan |
| **Kartu Jejak-ku** (`kartu.html`) | Akhir perjalanan: rangkuman keempat langkah yang bisa **diunduh sebagai gambar 1080×1920** (pas untuk Instagram Story) atau dibagikan langsung dari HP |

### Alur pengunjung

- **Butuh jawaban cepat:** ketik barang di pencarian Beranda atau Pilah, langsung tahu tong, cara menyiapkan, dan penggantinya.
- **Pengunjung baru:** Beranda → *Mulai perjalanan* → Pilah → Kurangi → Olah → Setor → Kartu Jejak-ku (`kartu.html`).
- **Pengunjung bebas:** langsung mulai atau melengkapi langkah mana pun lewat menu.

### Dibuat untuk orang awam

- **Selalu bisa pulang ke Beranda:** logo, penanda posisi *Beranda › Langkah n dari 4* di atas setiap halaman, tautan “Kembali ke Beranda” di akhir halaman langkah, dan **bar navigasi bawah di HP** (Beranda + empat langkah).
- **Kerangka yang sama di keempat langkah:** posisi → judul → kotak **Intinya** (satu kalimat) → tujuan halaman → aksi jejak → isi → langkah berikutnya.
- **Istilah bisa diketuk:** kata seperti B3, residu, TPS3R, kompos, dan bank sampah diberi garis putus-putus; diketuk → penjelasan satu kalimat. Kamusnya ada di `JN.ISTILAH` (`assets/js/data.js`).

Setiap langkah punya satu aksi kecil yang meninggalkan **jejak** (buka 3 barang atau cari 1 barang, pilih 1 barang yang sanggup diganti, simpan 1 ide, centang 5 persiapan). Titik berwarna di menu terisi saat jejak langkah itu tercatat. Keempat langkah dapat diselesaikan **dalam urutan apa pun** tanpa dikunci. Kemajuan disimpan di browser, dan bisa dihapus lewat tombol di halaman Kartu Jejak-ku.
| **Tentang** (`tentang.html`) | Masalah, audiens, cara menghitung, sumber data, tim |
| **Kontak** (`kontak.html`) | Formulir pertanyaan, usulan lokasi, dan usulan barang |

Fitur pendukung: maskot **Kardi** yang bereaksi terhadap aksi pengguna, tampilan responsif dari HP sampai desktop, perpindahan halaman yang mulus (View Transitions di Chrome/Edge), dan dukungan pengguna yang mematikan animasi (`prefers-reduced-motion`).

## Teknologi

- HTML, CSS, dan JavaScript murni. **Tanpa framework, tanpa proses build, tanpa komponen berbayar.**
- Huruf dari Google Fonts (lisensi terbuka): Archivo, Plus Jakarta Sans, Space Mono, Permanent Marker.
- Semua ilustrasi, ikon, dan maskot dibuat sendiri sebagai SVG di dalam kode.
- Data barang, panduan, dan direktori ada di satu file: `assets/js/data.js`.

## Struktur folder

```
webdesign_JawabanAnda_technoversary_vol.II/
├─ index.html, pilah.html, kurangi.html, olah.html, setor.html, kartu.html, tentang.html, kontak.html, 404.html
├─ README.md
└─ assets/
   ├─ favicon.svg
   ├─ css/gaya.css          ← semua gaya
   └─ js/
      ├─ data.js            ← data barang, tong, plastik, panduan, DIY, mitos, direktori
      ├─ umum.js            ← ikon, Kardi, menu, pencarian, jelajah, kalkulator
      └─ beranda.js, pilah.js, kurangi.js, olah.js, setor.js, kartu.js, kontak.js
```

## Petunjuk instalasi dan cara menjalankan

Tidak perlu instalasi apa pun.

**Cara 1 — buka langsung**
1. Unduh atau clone repository ini.
2. Buka file `index.html` dengan browser (Chrome, Edge, Firefox, atau Safari versi terbaru).

**Cara 2 — server lokal (disarankan, agar perpindahan halaman berjalan mulus)**
```bash
git clone https://github.com/darvaaph/webdesign_JawabanAnda_technoversary_vol.II.git
cd webdesign_JawabanAnda_technoversary_vol.II
python -m http.server 8000
```
Lalu buka `http://localhost:8000` di browser. Alternatif: ekstensi *Live Server* di VS Code, atau `npx serve`.

**Versi online:** `<isi tautan GitHub Pages>`

### Menerbitkan ke GitHub Pages
1. Push folder ini ke repository GitHub.
2. Buka *Settings → Pages*, pilih *Deploy from a branch*, branch `main`, folder `/ (root)`.
3. Tunggu sekitar satu menit, lalu buka tautan yang muncul.

## Mengubah data

- **Menambah barang:** tambahkan objek baru di `JN.BARANG` (`assets/js/data.js`). Isi `hitung` hanya jika barang itu sekali pakai dan punya pengganti jelas.
- **Menambah lokasi setor:** tambahkan ke `JN.DIREKTORI`. Cantumkan hanya lokasi yang sudah dicek langsung, dengan tanggal di kolom `dicek`.
- **Mengaktifkan formulir kontak:** buat formulir gratis di layanan seperti Formspree, lalu isi alamatnya di atribut `data-endpoint` pada `<form id="form-kontak">` di `kontak.html`. Tanpa itu, formulir berjalan dalam mode demo dan memberi tahu pengguna bahwa pesan belum terkirim.

## Kaitan dengan SDGs

Jejak Nol mendukung **SDG 12** (Konsumsi dan Produksi yang Bertanggung Jawab), terutama **target 12.5** (mengurangi timbulan sampah lewat pencegahan, pengurangan, daur ulang, guna ulang) dan **12.8** (informasi dan kesadaran gaya hidup berkelanjutan). Pendukung lain: 12.4 (limbah berbahaya), 11.6 (sampah kota), 14.1 (sampah laut), 13.3 (kesadaran iklim), 4.7 (pendidikan berkelanjutan). Rinciannya ada di halaman Tentang (`tentang.html#sdgs`).

## Sumber data

Semua data dan berita berasal dari **5 tahun terakhir (2021–2026)**, diperbarui 16 November 2026. Peraturan yang lebih lama hanya dicantumkan sebagai dasar hukum yang masih berlaku.

- **SIPSN Kementerian Lingkungan Hidup**, komposisi sampah berdasarkan jenis, data 2025: https://sampahnasional.kemenlh.go.id/portal-indikatif/data/komposisi-sampah (ringkasan nasional: GoodStats, 21 Mei 2026, https://data.goodstats.id/statistic/komposisi-sampah-nasional-2025-didominasi-sisa-makanan-pgp9R). Sisa makanan 40,77%, plastik 20,52%, kayu-ranting 13,13%, kertas-karton 11,4%, logam 3,11%, kain 2,51%, kaca 2,39%.
- **Sumber sampah 2025**: rumah tangga 56,7% (GoodStats, data SIPSN): https://goodstats.id/article/persentase-sumber-sampah-indonesia-2025-rumah-tangga-dominasi-timbulan-nasional-GR9A5
- **Kuningan**: DLH Kuningan, timbulan 495 ton/hari dan 260 ton/hari ke TPA Ciniru (Metrotvnews, 12 Maret 2026): https://www.metrotvnews.com/read/bVDCPjAP-dlh-kuningan-siapkan-tpst-pengganti-tpa-ciniru; kebakaran TPA Ciniru 12 Agustus 2026 (ANTARA, 13 Agustus 2026): https://www.antaranews.com/berita/5693389/bpbd-kuningan-200-personel-masih-tangani-kebakaran-tpsa-ciniru
- **Perpres No. 12 Tahun 2025 (RPJMN 2025–2029)**: target 100% sampah terkelola pada 2029: https://kemenlh.go.id/news/detail/indonesia-bersih-2029-klhbplh-pacu-pengelolaan-sampah-100
- **Permen LHK No. 9 Tahun 2024** tentang Pengelolaan Sampah yang Mengandung B3 dan Limbah B3: https://peraturan.bpk.go.id/Details/291985
- **KLH/BPLH**: 343 TPA masih open dumping (9 September 2025); kewajiban pilah dari sumber (24 April 2026): https://kemenlh.go.id/news/detail/menteri-lh-pilah-sampah-harus-100-tuntas-di-tingkat-kelurahan
- **Sachet multilayer**: riset BRUIN 2022–2024 dan Ecoton (Mongabay Indonesia, 11 Juli 2025): https://mongabay.co.id/2025/07/11/riset-sebut-sampah-saset-penuhi-sungai-di-indonesia/
- **Sisa makanan, metana, dan lindi di TPA**: KLH dalam Kompas.com, 11 April 2026: https://lestari.kompas.com/read/2026/04/11/130300186/klh-dorong-pemda-untuk-bereskan-setengah-sampah-dari-rumah
- **Daur ulang PET dan PP**: Kompas.com, 27 Februari 2025: https://lestari.kompas.com/read/2025/02/27/165716186/fakta-daur-ulang-di-balik-plastik-pet-kemasan-besar-yang-jadi-primadona
- **Panduan kompos**: Krisdianto dkk. (2024), *Tatalaksana dan Pemanfaatan Limbah Dapur Menjadi Pupuk Kompos di Desa Senggreng*, KOPEMAS Vol. 5 No. 1: https://new-conference.unisma.ac.id/index.php/KOPEMAS/article/view/396
- **Panduan eco-enzyme**: Marmi dkk. (2023), J-ABDI Vol. 3 No. 7, https://doi.org/10.53625/jabdi.v3i7.6959
- **Dasar hukum yang masih berlaku**: UU No. 18 Tahun 2008 tentang Pengelolaan Sampah; Permen LHK No. 14 Tahun 2021 tentang Pengelolaan Sampah pada Bank Sampah
- **Lainnya**: PBB, Sustainable Development Goals (https://sdgs.un.org/goals); ASTM D7611, Resin Identification Code (kode plastik 1–7)

## Tim

**Nama tim:** JawabanAnda

| Nama | Peran |
|---|---|
| [Nama anggota 1] | Ketua · desain dan konten |
| [Nama anggota 2] | Pengembang |
| [Nama anggota 3] | Pengembang |

---

### Daftar periksa sebelum submit (hapus bagian ini setelah selesai)

- [x] Isi `JN.KOMPOSISI` dari SIPSN 2025 dan semua sumber bertanda “ISI” (16 Nov 2026)
- [ ] Cek ulang angka komposisi langsung di portal SIPSN (sampahnasional.kemenlh.go.id) sebelum submit; angka bisa bergeser bila kabupaten/kota menambah laporan
- [ ] Cocokkan bunyi target SDG 11.6, 14.1, 13.3, 4.7 dan kode ASTM D7611 dengan sumber resminya
- [ ] Cocokkan pengelompokan tong dengan aturan bank sampah/TPS di Kuningan
- [ ] Isi `JN.DIREKTORI` dengan lokasi yang sudah dicek
- [ ] Isi nama tim, anggota, Instagram, dan email (Tentang, Kontak, README)
- [ ] Aktifkan formulir kontak (`data-endpoint`)
- [ ] Terbitkan ke GitHub Pages dan isi tautannya di atas
- [ ] Cek dengan Lighthouse (Chrome DevTools) dan di HP
