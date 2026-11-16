# Jejak Nol

**Media informasi zero-waste untuk kamu dan keluargamu (rumah tangga & anak kos).**
Karya Lomba Web Design Techno Versary Vol. II, HIMA-TI FKOM Universitas Kuningan. Tema: *EcoDigital For Environment*, sub-tema *Media Informasi Zero-waste Lifestyle dan Daur Ulang Sampah*.

## Deskripsi

Banyak orang sebenarnya mau memilah sampah, tapi berhenti di tiga pertanyaan: barang ini masuk tong mana, apa penggantinya, dan sisanya disetor ke mana. Jejak Nol menjawabnya dalam empat langkah, masing-masing dengan alat yang bisa langsung dicoba:

| Halaman | Isi |
|---|---|
| **Beranda** (`index.html`) | Cerita singkat: pencarian cepat “Ini dibuang ke mana?”, masalah sampah dengan data bersumber, jalan empat langkah yang dilalui satu botol sampai masuk tong, dan contoh Kartu Jejak-ku |
| **Pilah** (`pilah.html`) | Pencarian barang, jelajah ruangan (dapur, kamar mandi, belajar/kerja & kos, belanja), isi empat tong, arti kode plastik 1–7 |
| **Kurangi** (`kurangi.html`) | Kalkulator barang sekali pakai yang bisa dicegah per tahun, perbandingan tumpukan sebelum dan sesudah, cara menghitung, daftar pengganti |
| **Olah** (`olah.html`) | Panduan kompos ember dan eco-enzyme, galeri daur ulang dengan filter “saya punya…”, tombol simpan ide, Mitos vs Fakta |
| **Setor** (`setor.html`) | Checklist persiapan sebelum menyetor, jenis tempat setor, direktori lokasi di Kuningan |
| **Kartu Jejak-ku** (`kartu.html`) | Akhir perjalanan: rangkuman keempat langkah yang bisa **diunduh sebagai gambar 1080×1920** (pas untuk Instagram Story) atau dibagikan langsung dari HP |

### Alur pengunjung

- **Butuh jawaban cepat:** ketik barang di pencarian Beranda atau Pilah, langsung tahu tong, cara menyiapkan, dan penggantinya.
- **Pengunjung baru:** Beranda → *Mulai perjalanan* → Pilah → Kurangi → Olah → Setor → Kartu Jejak-ku (`kartu.html`).
- **Pengunjung bebas:** langsung mulai atau melengkapi langkah mana pun lewat menu.

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

- SIPSN KLHK — data timbulan dan komposisi sampah: https://sipsn.menlhk.go.id
- UU No. 18 Tahun 2008 tentang Pengelolaan Sampah
- Perpres No. 97 Tahun 2017 (Jakstranas): target pengurangan 30% dan penanganan 70% sampah rumah tangga pada 2025
- Permen LHK No. 14 Tahun 2021 tentang Pengelolaan Sampah pada Bank Sampah
- PBB, Sustainable Development Goals: https://sdgs.un.org/goals
- ASTM D7611 — Resin Identification Code (kode plastik 1–7)
- *(lengkapi sumber panduan kompos, eco-enzyme, kode plastik, dan Mitos vs Fakta)*

## Tim

**Nama tim:** JawabanAnda

| Nama | Peran |
|---|---|
| [Nama anggota 1] | Ketua · desain dan konten |
| [Nama anggota 2] | Pengembang |
| [Nama anggota 3] | Pengembang |

---

### Daftar periksa sebelum submit (hapus bagian ini setelah selesai)

- [ ] Isi angka `JN.FAKTA` dari SIPSN KLHK
- [ ] Isi semua sumber yang masih bertanda “ISI”
- [ ] Cocokkan bunyi target SDG 11.6, 14.1, 13.3, 4.7 dan kode ASTM D7611 dengan sumber resminya
- [ ] Cocokkan pengelompokan tong dengan aturan bank sampah/TPS di Kuningan
- [ ] Isi `JN.DIREKTORI` dengan lokasi yang sudah dicek
- [ ] Isi nama tim, anggota, Instagram, dan email (Tentang, Kontak, README)
- [ ] Aktifkan formulir kontak (`data-endpoint`)
- [ ] Terbitkan ke GitHub Pages dan isi tautannya di atas
- [ ] Cek dengan Lighthouse (Chrome DevTools) dan di HP
