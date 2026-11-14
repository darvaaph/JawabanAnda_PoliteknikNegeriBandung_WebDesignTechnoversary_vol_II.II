# Jejak Nol

**Media informasi zero-waste untuk pelajar dan mahasiswa.**
Karya Lomba Web Design Techno Versary Vol. II, HIMA-TI FKOM Universitas Kuningan. Tema: *EcoDigital For Environment*, sub-tema *Media Informasi Zero-waste Lifestyle dan Daur Ulang Sampah*.

## Deskripsi

Banyak orang sebenarnya mau memilah sampah, tapi berhenti di tiga pertanyaan: barang ini masuk tong mana, apa penggantinya, dan sisanya disetor ke mana. Jejak Nol menjawabnya dalam empat langkah, masing-masing dengan alat yang bisa langsung dicoba:

| Halaman | Isi |
|---|---|
| **Beranda** (`index.html`) | Pencarian “Ini dibuang ke mana?”, masalah sampah dengan data bersumber, peta empat langkah, dan perjalanan satu botol yang menemani pembaca sampai masuk tong |
| **Pilah** (`pilah.html`) | Pencarian barang, jelajah ruangan (dapur, kamar mandi, kos & kampus, belanja), isi empat tong, arti kode plastik 1–7 |
| **Kurangi** (`kurangi.html`) | Kalkulator barang sekali pakai yang bisa dicegah per tahun, perbandingan tumpukan sebelum dan sesudah, Kartu Janji |
| **Olah** (`olah.html`) | Panduan kompos ember dan eco-enzyme, galeri daur ulang dengan filter “saya punya…”, Mitos vs Fakta |
| **Setor** (`setor.html`) | Persiapan sebelum menyetor, jenis tempat setor, direktori lokasi di Kuningan |
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
├─ index.html, pilah.html, kurangi.html, olah.html, setor.html, tentang.html, kontak.html, 404.html
├─ README.md
└─ assets/
   ├─ favicon.svg
   ├─ css/gaya.css          ← semua gaya
   └─ js/
      ├─ data.js            ← data barang, tong, plastik, panduan, DIY, mitos, direktori
      ├─ umum.js            ← ikon, Kardi, menu, pencarian, jelajah, kalkulator
      └─ beranda.js, pilah.js, kurangi.js, olah.js, setor.js, kontak.js
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

## Sumber data

- SIPSN KLHK — data timbulan dan komposisi sampah: https://sipsn.menlhk.go.id
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
- [ ] Cocokkan pengelompokan tong dengan aturan bank sampah/TPS di Kuningan
- [ ] Isi `JN.DIREKTORI` dengan lokasi yang sudah dicek
- [ ] Isi nama tim, anggota, Instagram, dan email (Tentang, Kontak, README)
- [ ] Aktifkan formulir kontak (`data-endpoint`)
- [ ] Terbitkan ke GitHub Pages dan isi tautannya di atas
- [ ] Cek dengan Lighthouse (Chrome DevTools) dan di HP
