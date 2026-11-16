/* Data Jejak Nol. Semua halaman membaca dari sini.
   Dipakai sebagai script biasa (bukan module) supaya website tetap jalan saat index.html dibuka langsung dari folder.

   PENTING sebelum submit:
   - Cocokkan pengelompokan tong (kat) dengan aturan bank sampah / TPS di Kuningan.
   - Fakta dan sumber diperbarui 16 Nov 2026 (semua data maksimal 5 tahun terakhir). Cek ulang angka SIPSN sebelum submit.
   - DIREKTORI (contoh tempat setor) hanya diisi lokasi yang sudah dicek, atau yang diberi `sumber` agar tampil "Belum dikonfirmasi". */
window.JN = window.JN || {};

JN.KAT = {
  organik:   { nama: 'Organik',   warna: 'var(--organik)',   ke: 'Untuk dikompos',        isi: 'Sisa makanan, kulit buah, daun, ampas kopi dan teh.' },
  anorganik: { nama: 'Anorganik', warna: 'var(--anorganik)', ke: 'Ke bank sampah',        isi: 'Botol, gelas plastik, kardus, kertas, kaleng, kaca. Harus bersih dan kering.' },
  b3:        { nama: 'B3',        warna: 'var(--b3)',        ke: 'Ke drop point khusus',  isi: 'Bahan berbahaya dan beracun: baterai, lampu, obat, kaleng semprot, elektronik rusak.' },
  residu:    { nama: 'Residu',    warna: 'var(--residu)',    ke: 'Ke TPS',                isi: 'Yang sulit didaur ulang: sachet berlapis, styrofoam, tisu dan popok bekas.' }
};

JN.RUANG = [['dapur', 'Dapur'], ['kamar-mandi', 'Kamar mandi'], ['kos-kampus', 'Belajar, kerja & kos'], ['belanja', 'Belanja']];

/* hitung: hanya barang sekali pakai yang punya pengganti jelas (dipakai Kalkulator Kurangi) */
JN.BARANG = [
  // dapur
  { id: 'botol', nama: 'Botol air mineral', alias: ['aqua', 'botol plastik', 'pet', 'botol minum'], kat: 'anorganik', ruang: 'dapur', ikon: 'botol',
    langkah: ['Kosongkan dan bilas', 'Lepas tutup dan label', 'Pipihkan'], alt: 'Tumbler atau botol isi ulang.',
    hitung: { satuan: 'botol', ganti: 'tumbler', jumlah: 2, per: 'hari', k: .75 } },
  { id: 'pisang', nama: 'Kulit pisang', alias: ['kulit buah', 'pisang'], kat: 'organik', ruang: 'dapur', ikon: 'pisang',
    langkah: ['Pisahkan dari plastik', 'Masukkan ke wadah kompos'], alt: 'Bahan kompos atau eco-enzyme.' },
  { id: 'apel', nama: 'Sisa buah, sayur & nasi', alias: ['sisa makanan', 'nasi', 'apel', 'sayur', 'makanan basi'], kat: 'organik', ruang: 'dapur', ikon: 'apel',
    langkah: ['Tiriskan airnya', 'Masukkan ke wadah kompos'], alt: 'Masak dan ambil secukupnya.' },
  { id: 'kopi', nama: 'Ampas kopi & teh', alias: ['ampas kopi', 'teh celup', 'ampas teh'], kat: 'organik', ruang: 'dapur', ikon: 'gelas-kopi',
    langkah: ['Tiriskan', 'Masukkan ke kompos atau taburkan di tanah tanaman'], alt: 'Teh tubruk atau saringan teh yang bisa dicuci.' },
  { id: 'telur', nama: 'Cangkang telur', alias: ['kulit telur', 'telur'], kat: 'organik', ruang: 'dapur', ikon: 'telur',
    langkah: ['Bilas sebentar', 'Remukkan', 'Masukkan ke kompos'], alt: 'Remukan cangkang bisa jadi campuran media tanam.' },
  { id: 'styrofoam', nama: 'Kotak styrofoam', alias: ['sterofoam', 'gabus', 'kotak nasi'], kat: 'residu', ruang: 'dapur', ikon: 'styrofoam',
    langkah: ['Buang sisa makanannya', 'Masukkan ke residu'], alt: 'Bawa wadah makan sendiri.',
    hitung: { satuan: 'kotak', ganti: 'wadah makan sendiri', jumlah: 3, per: 'minggu', k: .5 } },
  { id: 'sachet', nama: 'Sachet kopi & bumbu', alias: ['saset', 'bungkus kopi', 'sachet', 'bungkus mie'], kat: 'residu', ruang: 'dapur', ikon: 'sachet',
    langkah: ['Masukkan ke residu', 'Atau kumpulkan bersih dan kering untuk ecobrick'], alt: 'Beli kemasan besar atau curah.',
    hitung: { satuan: 'sachet', ganti: 'kemasan besar', jumlah: 1, per: 'hari', k: .5 } },
  { id: 'kertas-minyak', nama: 'Kertas nasi berminyak', alias: ['kertas nasi', 'bungkus nasi', 'kertas minyak'], kat: 'residu', ruang: 'dapur', ikon: 'kertas-minyak',
    langkah: ['Buang sisa makanan', 'Masukkan ke residu karena berminyak dan berlapis plastik'], alt: 'Wadah makan sendiri.' },
  { id: 'kardus-minyak', nama: 'Kotak makanan berminyak', alias: ['kotak pizza', 'dus martabak', 'kardus gorengan', 'kardus berminyak'], kat: 'residu', ruang: 'dapur', ikon: 'kardus',
    langkah: ['Sobek bagian tutup yang masih bersih untuk anorganik', 'Masukkan bagian berminyak ke residu'], alt: 'Bawa kotak makan sendiri saat beli jajan.' },
  { id: 'karton-susu', nama: 'Karton minuman & susu UHT', alias: ['kotak susu', 'tetra pak', 'kotak teh', 'karton susu'], kat: 'anorganik', ruang: 'dapur', ikon: 'karton-susu',
    langkah: ['Kosongkan dan bilas bagian dalam', 'Lipat pipih dan cek bank sampah penerimanya'], alt: 'Beli susu kemasan besar atau buat minuman di rumah.' },
  { id: 'minyak', nama: 'Minyak jelantah', alias: ['jelantah', 'minyak bekas', 'minyak goreng bekas'], kat: 'anorganik', ruang: 'dapur', ikon: 'minyak',
    langkah: ['Dinginkan, lalu tuang ke botol plastik tertutup', 'Jangan buang ke wastafel', 'Serahkan ke bank sampah atau pengepul jelantah'], alt: 'Gunakan secukupnya dan saring untuk pemakaian wajar.' },
  { id: 'kaca', nama: 'Botol & toples kaca', alias: ['kaca', 'toples', 'botol kecap', 'botol saus'], kat: 'anorganik', ruang: 'dapur', ikon: 'toples',
    langkah: ['Bilas hingga bersih', 'Simpan utuh dan jangan dipecahkan'], alt: 'Pakai ulang untuk wadah bumbu atau bahan dapur.' },
  { id: 'pecahan-kaca', nama: 'Piring atau gelas pecah', alias: ['beling', 'piring pecah', 'gelas pecah', 'keramik pecah'], kat: 'residu', ruang: 'dapur', ikon: 'pecahan-kaca',
    langkah: ['Bungkus rapat dengan koran atau kardus bekas', 'Beri tulisan "Hati-hati Beling" lalu masukkan ke residu'], alt: 'Pilih wadah makan berbahan tahan banting untuk penggunaan harian.' },
  // kamar mandi
  { id: 'sampo', nama: 'Botol sampo & sabun', alias: ['shampo', 'sabun cair', 'botol sabun'], kat: 'anorganik', ruang: 'kamar-mandi', ikon: 'sampo',
    langkah: ['Bilas sisa busanya', 'Keringkan dan pisahkan tutupnya'], alt: 'Isi ulang di toko curah atau pakai sabun batang.',
    hitung: { satuan: 'botol', ganti: 'isi ulang atau sabun batang', jumlah: 1, per: 'bulan', k: .5 } },
  { id: 'sikat', nama: 'Sikat gigi bekas', alias: ['sikat gigi'], kat: 'residu', ruang: 'kamar-mandi', ikon: 'sikat',
    langkah: ['Pakai ulang untuk membersihkan sela-sela keramik', 'Lalu masukkan ke residu'], alt: 'Sikat gigi gagang bambu atau kepala ganti.' },
  { id: 'obat', nama: 'Obat kedaluwarsa', alias: ['obat', 'pil', 'kapsul', 'sirup'], kat: 'b3', ruang: 'kamar-mandi', ikon: 'obat',
    langkah: ['Jangan dibuang ke saluran air atau kloset', 'Serahkan ke apotek penerima atau drop point B3'], alt: 'Beli obat secukupnya dan cek tanggal kedaluwarsa berkala.' },
  { id: 'tisu', nama: 'Tisu bekas', alias: ['tisu', 'tissue'], kat: 'residu', ruang: 'kamar-mandi', ikon: 'tisu',
    langkah: ['Masukkan ke tempat sampah residu'], alt: 'Lap kain atau saputangan yang bisa dicuci.' },
  { id: 'popok', nama: 'Popok & pembalut sekali pakai', alias: ['popok', 'pampers', 'pembalut'], kat: 'residu', ruang: 'kamar-mandi', ikon: 'popok',
    langkah: ['Buang kotorannya ke kloset', 'Gulung rapat, bungkus, lalu masukkan ke residu'], alt: 'Popok kain cuci ulang atau pembalut kain/menstrual cup.' },
  // belajar, kerja & kos
  { id: 'gelas', nama: 'Gelas plastik minuman', alias: ['gelas es teh', 'cup', 'gelas kopi', 'gelas boba'], kat: 'anorganik', ruang: 'kos-kampus', ikon: 'gelas',
    langkah: ['Bilas', 'Lepas plastik penutup', 'Susun bertumpuk'], alt: 'Bawa tumbler saat jajan minuman.',
    hitung: { satuan: 'gelas', ganti: 'tumbler sendiri', jumlah: 1, per: 'hari', k: .5 } },
  { id: 'kaleng', nama: 'Kaleng minuman', alias: ['kaleng', 'soda', 'kaleng susu'], kat: 'anorganik', ruang: 'kos-kampus', ikon: 'kaleng',
    langkah: ['Kosongkan dan bilas', 'Pipihkan agar hemat tempat'], alt: 'Pilih minuman isi ulang atau buat di rumah.' },
  { id: 'sedotan', nama: 'Sedotan plastik', alias: ['pipet', 'sedotan'], kat: 'residu', ruang: 'kos-kampus', ikon: 'sedotan',
    langkah: ['Masukkan ke tempat sampah residu'], alt: 'Minum langsung atau pakai sedotan stainless/bambu.',
    hitung: { satuan: 'sedotan', ganti: 'minum tanpa sedotan', jumlah: 1, per: 'hari', k: .75 } },
  { id: 'kertas', nama: 'Kertas, koran & buku bekas', alias: ['kertas', 'koran', 'buku bekas', 'fotokopian'], kat: 'anorganik', ruang: 'kos-kampus', ikon: 'kertas',
    langkah: ['Pastikan kering dan tidak berminyak', 'Lipat rapi dan ikat'], alt: 'Cetak bolak-balik atau pakai catatan digital.' },
  { id: 'masker', nama: 'Masker sekali pakai', alias: ['masker'], kat: 'residu', ruang: 'kos-kampus', ikon: 'masker',
    langkah: ['Gunting talinya agar tidak menjerat hewan', 'Lipat ke dalam dan masukkan ke residu'], alt: 'Masker kain yang bisa dicuci saat tidak sakit.' },
  { id: 'baterai', nama: 'Baterai bekas', alias: ['batre', 'batu baterai', 'baterai'], kat: 'b3', ruang: 'kos-kampus', ikon: 'baterai',
    langkah: ['Simpan terpisah dalam wadah plastik tertutup', 'Serahkan ke drop point B3 atau e-waste'], alt: 'Gunakan baterai isi ulang (rechargeable).' },
  { id: 'lampu', nama: 'Lampu bekas', alias: ['bohlam', 'lampu', 'neon'], kat: 'b3', ruang: 'kos-kampus', ikon: 'lampu',
    langkah: ['Bungkus dus atau koran agar tidak pecah', 'Serahkan ke drop point B3'], alt: 'Pilih lampu LED yang tahan lebih lama.' },
  { id: 'kabel', nama: 'Kabel & charger rusak', alias: ['charger', 'kabel', 'casan', 'elektronik', 'hp rusak'], kat: 'b3', ruang: 'kos-kampus', ikon: 'kabel',
    langkah: ['Kumpulkan terpisah dari sampah basah', 'Serahkan ke drop point e-waste'], alt: 'Perbaiki dulu atau rawat kabel agar tidak tertekuk tajam.' },
  { id: 'semprot', nama: 'Kaleng semprot aerosol', alias: ['obat nyamuk', 'aerosol', 'pengharum ruangan', 'semprotan'], kat: 'b3', ruang: 'kos-kampus', ikon: 'semprot',
    langkah: ['Pastikan isinya habis', 'Jangan dibakar atau dilubangi, serahkan ke drop point B3'], alt: 'Gunakan kelambu, raket nyamuk, atau pewangi alami.' },
  // belanja
  { id: 'kresek', nama: 'Kantong kresek', alias: ['kantong plastik', 'plastik belanja', 'kresek'], kat: 'anorganik', ruang: 'belanja', ikon: 'kresek',
    langkah: ['Pakai ulang untuk belanja lagi', 'Atau kumpulkan bersih untuk disetor'], alt: 'Siapkan tas belanja kain di tas atau jok motor.',
    hitung: { satuan: 'kantong', ganti: 'tas kain', jumlah: 5, per: 'minggu', k: 1 } },
  { id: 'kardus', nama: 'Kardus paket', alias: ['kardus', 'dus', 'karton'], kat: 'anorganik', ruang: 'belanja', ikon: 'kardus',
    langkah: ['Lepas selotip dan stiker resi', 'Lipat rata dan jaga tetap kering'], alt: 'Pakai ulang untuk menyimpan barang rumah tangga.' },
  { id: 'tutup', nama: 'Tutup botol & galon', alias: ['tutup botol', 'tutup galon'], kat: 'anorganik', ruang: 'belanja', ikon: 'tutup',
    langkah: ['Kumpulkan terpisah dari botolnya', 'Setor bersama plastik sejenis'], alt: 'Gunakan galon isi ulang atau dispenser.' },
  { id: 'bubble', nama: 'Bubble wrap paket', alias: ['bubble wrap', 'plastik gelembung', 'bungkus paket'], kat: 'anorganik', ruang: 'belanja', ikon: 'bubble',
    langkah: ['Simpan untuk membungkus paket lagi', 'Atau setor dalam keadaan bersih'], alt: 'Tulis catatan "tanpa bubble wrap" untuk barang tidak pecah belah.',
    hitung: { satuan: 'paket', ganti: 'catatan “tanpa bubble wrap”', jumlah: 2, per: 'bulan', k: .5 } },
  { id: 'wadah-makan', nama: 'Wadah plastik makanan (thinwall)', alias: ['thinwall', 'kotak makan plastik', 'mika', 'wadah bening'], kat: 'anorganik', ruang: 'belanja', ikon: 'wadah-makan',
    langkah: ['Cuci bersih dari sisa minyak dengan sabun', 'Keringkan dan tumpuk sebelum disetor'], alt: 'Pakai ulang untuk wadah kulkas atau bawa misting sendiri.' },
  { id: 'daun', nama: 'Daun kering & potongan rumput', alias: ['daun', 'ranting', 'rumput'], kat: 'organik', ruang: 'belanja', ikon: 'daun',
    langkah: ['Kumpulkan terpisah dari plastik', 'Jadikan lapisan cokelat di kompos'], alt: 'Gunakan sebagai mulsa penutup tanah tanaman.' }
];

/* Kode daur ulang plastik di bawah kemasan (Resin Identification Code) */
JN.PLASTIK = [
  { kode: 1, nama: 'PET',  lengkap: 'Polyethylene terephthalate', contoh: 'Botol air mineral, botol minuman',   status: 'umum' },
  { kode: 2, nama: 'HDPE', lengkap: 'High-density polyethylene',  contoh: 'Botol sampo, jeriken, botol susu',   status: 'umum' },
  { kode: 3, nama: 'PVC',  lengkap: 'Polyvinyl chloride',         contoh: 'Pipa, kabel, sebagian kemasan',      status: 'sulit' },
  { kode: 4, nama: 'LDPE', lengkap: 'Low-density polyethylene',   contoh: 'Kresek, plastik pembungkus',         status: 'terbatas' },
  { kode: 5, nama: 'PP',   lengkap: 'Polypropylene',              contoh: 'Gelas plastik, tutup botol, wadah',  status: 'umum' },
  { kode: 6, nama: 'PS',   lengkap: 'Polystyrene',                contoh: 'Styrofoam, sendok plastik bening',   status: 'sulit' },
  { kode: 7, nama: 'Lain', lengkap: 'Plastik lain atau campuran', contoh: 'Sachet berlapis, galon polikarbonat', status: 'sulit' }
];
JN.STATUS_PLASTIK = { umum: 'Umum diterima bank sampah', terbatas: 'Diterima sebagian bank sampah', sulit: 'Sulit didaur ulang' };

/* Langkah Olah */
JN.PANDUAN = [
  { id: 'kompos', ikon: 'ember', judul: 'Kompos ember', tingkat: 'Sedang', waktu: '6–8 minggu',
    bahan: ['Ember atau pot bekas berlubang', 'Sisa sayur dan buah', 'Daun kering atau kardus sobek', 'Sedikit tanah'],
    langkah: ['Lubangi dasar dan sisi ember supaya ada udara.', 'Isi lapisan bawah dengan tanah atau daun kering.', 'Masukkan sisa sayur dan buah yang sudah dipotong kecil.', 'Tutup dengan lapisan daun kering atau kardus sobek setiap kali menambah sisa dapur.', 'Aduk seminggu sekali. Kompos siap saat berwarna gelap dan berbau seperti tanah.'],
    hindari: 'Jangan masukkan daging, tulang, susu, dan minyak: menimbulkan bau dan mengundang lalat.',
    /* slider "Lihat prosesnya": perkiraan waktu, bisa lebih cepat atau lambat tergantung cuaca dan bahan */
    sumber: 'Krisdianto dkk., <i>Tatalaksana dan Pemanfaatan Limbah Dapur Menjadi Pupuk Kompos</i>, <a href="https://new-conference.unisma.ac.id/index.php/KOPEMAS/article/view/396" target="_blank" rel="noopener">KOPEMAS Vol. 5 No. 1, 2024</a>.',
    proses: 'kompos', satuan: 'Perkiraan waktu',
    tahap: [
      { kapan: 'Minggu 0', sorot: [1, 2, 3], judul: 'Ember baru diisi', isi: 'Lapisan tanah atau daun kering di bawah, sisa sayur dan buah di tengah, lalu ditutup daun kering lagi.' },
      { kapan: 'Minggu 1–2', sorot: [3, 4], judul: 'Mulai terurai', isi: 'Mikroba bekerja, isi ember terasa hangat. Aduk seminggu sekali supaya ada udara. Kalau terlalu basah, tambah daun kering.' },
      { kapan: 'Minggu 3–5', sorot: [2, 3], judul: 'Makin gelap', isi: 'Potongan sisa dapur makin kecil dan menghitam. Volumenya menyusut, jadi kamu bisa terus menambah sisa dapur.' },
      { kapan: 'Minggu 6–8', sorot: [4], judul: 'Kompos matang', isi: 'Warnanya gelap, teksturnya remah, dan baunya seperti tanah. Siap dicampur ke media tanam.' }
    ] },
  { id: 'eco-enzyme', ikon: 'toples', judul: 'Eco-enzyme', tingkat: 'Sedang', waktu: '±3 bulan',
    bahan: ['Wadah plastik bertutup', 'Gula merah atau molase', 'Kulit buah dan sayur segar', 'Air bersih'],
    langkah: ['Pakai perbandingan yang umum dipakai: 1 bagian gula, 3 bagian kulit buah, 10 bagian air.', 'Larutkan gula dalam air, lalu masukkan potongan kulit buah.', 'Sisakan ruang kosong di atas, lalu tutup rapat.', 'Buka tutupnya sebentar setiap hari di minggu pertama untuk membuang gas.', 'Simpan di tempat teduh sekitar 3 bulan, lalu saring.'],
    hindari: 'Jangan pakai wadah kaca atau logam yang ditutup rapat: gas fermentasi bisa membuatnya pecah.',
    sumber: 'Marmi dkk. (gula : kulit buah/sayur : air = 1 : 3 : 10, fermentasi 3 bulan), <a href="https://doi.org/10.53625/jabdi.v3i7.6959" target="_blank" rel="noopener">J-ABDI Vol. 3 No. 7, 2023</a>.',
    proses: 'eco', satuan: 'Lama fermentasi',
    tahap: [
      { kapan: 'Hari 0', sorot: [0, 1, 2], judul: 'Baru dicampur', isi: '1 bagian gula, 3 bagian kulit buah, 10 bagian air. Cairannya masih bening kecokelatan dan kulit buah mengapung.' },
      { kapan: 'Minggu 1', sorot: [3], judul: 'Fermentasi aktif', isi: 'Muncul gelembung gas. Buka tutupnya sebentar setiap hari supaya gasnya keluar, lalu tutup lagi.' },
      { kapan: 'Bulan 1–2', sorot: [4], judul: 'Makin cokelat', isi: 'Gelembung berkurang, cairan makin cokelat dan keruh. Biarkan tertutup di tempat teduh.' },
      { kapan: 'Bulan 3', sorot: [4], judul: 'Siap disaring', isi: 'Cairan cokelat berbau asam segar. Saring, simpan cairannya untuk pembersih atau pupuk cair yang diencerkan.' }
    ] }
];

/* Galeri DIY. bahan dipakai untuk filter "saya punya…" */
JN.DIY = [
  { id: 'pot-botol', judul: 'Pot dari botol bekas', bahan: ['botol'], ikon: 'pot', tingkat: 'Mudah', waktu: '±15 menit',
    langkah: ['Potong botol menjadi dua.', 'Lubangi tutup atau dasar untuk aliran air.', 'Isi tanah dan tanam bibit.'] },
  { id: 'ecobrick', judul: 'Ecobrick', bahan: ['sachet', 'botol'], ikon: 'ecobrick', tingkat: 'Mudah', waktu: 'Dicicil',
    langkah: ['Kumpulkan plastik kemasan yang bersih dan kering.', 'Masukkan ke botol plastik dan padatkan dengan tongkat.', 'Isi sampai botol keras dan tidak bisa ditekan.'] },
  { id: 'tas-kaos', judul: 'Tas belanja dari kaos bekas', bahan: ['kain'], ikon: 'tas', tingkat: 'Mudah', waktu: '±20 menit',
    langkah: ['Gunting lengan dan kerah kaos.', 'Gunting rumbai di bagian bawah.', 'Ikat rumbai berpasangan sampai rapat.'] },
  { id: 'organizer', judul: 'Organizer meja dari kardus', bahan: ['kardus'], ikon: 'kardus', tingkat: 'Sedang', waktu: '±45 menit',
    langkah: ['Potong kardus jadi beberapa kotak dengan tinggi berbeda.', 'Rekatkan kotak-kotak itu berdampingan.', 'Lapisi dengan kertas bekas atau cat.'] },
  { id: 'kaleng-alat', judul: 'Tempat alat tulis dari kaleng', bahan: ['kaleng'], ikon: 'kaleng', tingkat: 'Mudah', waktu: '±20 menit',
    langkah: ['Cuci kaleng dan pastikan pinggirnya tidak tajam.', 'Bungkus dengan kertas bekas atau tali rami.', 'Isi dengan pulpen dan pensil.'] },
  { id: 'toples-bumbu', judul: 'Toples kaca jadi wadah bumbu', bahan: ['kaca'], ikon: 'toples', tingkat: 'Mudah', waktu: '±10 menit',
    langkah: ['Rendam toples untuk melepas label.', 'Cuci dan keringkan.', 'Isi bumbu atau beras, beri label baru.'] }
];
JN.BAHAN_DIY = [['botol', 'Botol plastik'], ['sachet', 'Sachet & kemasan'], ['kardus', 'Kardus'], ['kaleng', 'Kaleng'], ['kain', 'Kaos bekas'], ['kaca', 'Toples kaca']];

/* Kuis "Mitos atau fakta?". Setiap kartu wajib punya sumber (maksimal 5 tahun terakhir).
   Entri tanpa `jenis` = mitos (teksnya di `mitos`); entri `jenis: 'fakta'` memakai `pernyataan`. */
JN.MITOS = [
  { mitos: 'Semua plastik bisa didaur ulang.',
    fakta: 'Sachet adalah plastik berlapis (multilayer) yang lapisannya hampir mustahil dipisahkan, jadi tidak bisa masuk rantai daur ulang dan biasanya berakhir sebagai residu.',
    sumber: 'Riset BRUIN 2022–2024 dan Ecoton, dimuat ' + '<a href="https://mongabay.co.id/2025/07/11/riset-sebut-sampah-saset-penuhi-sungai-di-indonesia/" target="_blank" rel="noopener">Mongabay Indonesia, 11 Juli 2025</a>' },
  { pernyataan: 'Sisa makanan adalah jenis sampah paling banyak di Indonesia.', jenis: 'fakta',
    fakta: 'Benar. Menurut SIPSN 2025, sisa makanan sekitar 40,77% dari komposisi sampah nasional, paling besar dibanding plastik (20,52%) dan kertas (11,4%).',
    sumber: '<a href="https://data.goodstats.id/statistic/komposisi-sampah-nasional-2025-didominasi-sisa-makanan-pgp9R" target="_blank" rel="noopener">SIPSN KLH 2025 via GoodStats, 21 Mei 2026</a>' },
  { mitos: 'Toh nanti dipilah lagi di TPA.',
    fakta: 'Sampah tercampur di TPA umumnya hanya ditimbun. Pada 2025 masih ada sedikitnya 343 TPA yang memakai cara open dumping. Karena itu pemilahan diwajibkan sejak dari rumah.',
    sumber: '<a href="https://kemenlh.go.id/news/detail/klhbplh-luncurkan-kebijakan-pemanfaatan-sampah-organik-untuk-pupuk-organik-dorong-swasembada-pangan-berkelanjutan" target="_blank" rel="noopener">KLH/BPLH, 9 September 2025</a>' + ' dan ' + '<a href="https://kemenlh.go.id/news/detail/menteri-lh-pilah-sampah-harus-100-tuntas-di-tingkat-kelurahan" target="_blank" rel="noopener">KLH/BPLH, 24 April 2026</a>' },
  { mitos: 'Baterai bekas boleh dibuang bersama sampah biasa.',
    fakta: 'Baterai bekas termasuk sampah yang mengandung B3. Aturannya: dipilah ke wadah terpisah (wadah merah), lalu diserahkan ke pengumpul atau drop point B3, bukan dicampur, dibakar, atau dibuang ke sungai.',
    sumber: 'Permen LHK No. 9 Tahun 2024 tentang Pengelolaan Sampah yang Mengandung B3 dan Limbah B3 (' + '<a href="https://peraturan.bpk.go.id/Details/291985" target="_blank" rel="noopener">JDIH BPK</a>' + ')' },
  { pernyataan: 'Botol plastik berkode 1 (PET) termasuk yang paling mudah dijual ke bank sampah.', jenis: 'fakta',
    fakta: 'Benar. PET punya rantai daur ulang yang jelas dan nilai ekonomi lebih tinggi dibanding banyak plastik lain, asal bersih dan kering.',
    sumber: '<a href="https://lestari.kompas.com/read/2025/02/27/165716186/fakta-daur-ulang-di-balik-plastik-pet-kemasan-besar-yang-jadi-primadona" target="_blank" rel="noopener">Kompas.com, 27 Februari 2025</a>' },
  { mitos: 'Sisa makanan kan membusuk sendiri, jadi aman dibuang ke TPA.',
    fakta: 'Di TPA, sisa makanan tertimbun tanpa udara lalu menghasilkan gas metana dan air lindi yang mencemari tanah, air, dan udara. Sisa makanan juga jenis sampah terbanyak di Indonesia, jadi paling berdampak bila dikompos di rumah.',
    sumber: '<a href="https://lestari.kompas.com/read/2026/04/11/130300186/klh-dorong-pemda-untuk-bereskan-setengah-sampah-dari-rumah" target="_blank" rel="noopener">Kompas.com, 11 April 2026 (KLH, data SIPSN 2024)</a>' }
];

/* Hook Beranda: "100 sampah di tong". Komposisi sampah nasional berdasarkan jenis, SIPSN 2025,
   dibulatkan supaya totalnya 100: sisa makanan 40,77% · plastik 20,52% · kayu-ranting 13,13% · kertas-karton 11,4% ·
   logam 3,11% + kaca 2,39% · kain 2,51% + karet-kulit & lainnya 6,17%. Kategori (kat) menentukan langkah tujuannya. */
JN.KOMPOSISI_CONTOH = false;
JN.KOMPOSISI_SUMBER = 'SIPSN Kementerian Lingkungan Hidup, komposisi sampah berdasarkan jenis, data 2025 (sampahnasional.kemenlh.go.id), dikutip GoodStats 21 Mei 2026';
JN.KOMPOSISI = [
  { id: 'makanan', nama: 'Sisa makanan',            jumlah: 41, kat: 'organik',   ikon: ['apel', 'pisang', 'telur'] },
  { id: 'daun',    nama: 'Kayu & ranting',          jumlah: 13, kat: 'organik',   ikon: ['daun'] },
  { id: 'plastik', nama: 'Plastik',                 jumlah: 21, kat: 'anorganik', ikon: ['botol', 'gelas', 'toples'] },
  { id: 'kertas',  nama: 'Kertas & karton',         jumlah: 11, kat: 'anorganik', ikon: ['kardus', 'kertas'] },
  { id: 'logam',   nama: 'Logam & kaca',            jumlah: 5,  kat: 'anorganik', ikon: ['kaleng'] },
  { id: 'lainnya', nama: 'Kain, karet & lainnya',   jumlah: 9,  kat: 'residu',    ikon: ['popok', 'tisu', 'masker'] }
];
/* Ke langkah mana setiap kelompok menuju setelah dipilah */
JN.KOMPOSISI_ARAH = {
  organik:   { judul: 'bisa diolah jadi kompos',          langkah: 'olah' },
  anorganik: { judul: 'bisa disetor bila bersih & kering', langkah: 'setor' },
  residu:    { judul: 'sulit diolah, jadi harus dikurangi', langkah: 'kurangi' }
};

/* Contoh tempat setor (Kabupaten Kuningan). Contoh isi:
  { nama: 'Bank Sampah …', jenis: 'bank-sampah', alamat: 'Jl. …', kecamatan: '…', jam: 'Sabtu 08.00–11.00',
    menerima: ['anorganik'], kontak: '08…', maps: 'https://maps.app.goo.gl/…', dicek: '2026-11-20' } */
JN.JENIS_TEMPAT = {
  'bank-sampah':   { nama: 'Bank sampah',      isi: 'Menerima sampah anorganik bersih (plastik, kertas, kaleng), sering ditukar tabungan.' },
  'tps3r':         { nama: 'TPS3R',            isi: 'Tempat pengolahan sampah tingkat desa atau kelurahan: memilah, mengompos, mendaur ulang.' },
  'drop-point-b3': { nama: 'Drop point B3',    isi: 'Titik pengumpulan baterai, lampu, elektronik, dan obat bekas.' },
  'toko-curah':    { nama: 'Toko curah/refill', isi: 'Tempat membeli sabun, sampo, atau bahan makanan dengan wadah sendiri.' }
};
/* Contoh tempat setor (Kabupaten Kuningan). Daerah lain bisa ditambah dengan menambah field `daerah`. Entri dengan `sumber` = data hasil penelusuran dokumen publik yang BELUM dikonfirmasi tim
   (kartu menampilkan chip "Belum dikonfirmasi"). Setelah tim menelepon/mengunjungi lokasinya, isi `jam`, `menerima`,
   `kontak` (bila diizinkan), ganti `sumber` dengan `dicek: 'YYYY-MM-DD'`, maka chip itu hilang dan kartu tertulis "Dicek tim".
   Format lengkap: { nama, jenis, alamat, kecamatan, jam, menerima: [], kontak, maps, dicek } */
JN.DIREKTORI = [
  { nama: 'Bank Sampah Induk Kelurahan Cipari', jenis: 'bank-sampah', alamat: 'Kelurahan Cipari', kecamatan: 'Kec. Cigugur',
    jam: '', menerima: [], kontak: '', maps: '',
    sumber: '<a href="https://info3r.kemenlh.go.id/berita/detail/Z25jank4ZkkxK1lJcmhOSkFiVnNmbVh4UkE1MmRHZ0R4RXNrOVhBbHFNYz0" target="_blank" rel="noopener">KLH, serah terima fasilitas Bank Sampah Induk Cipari, 31 Des 2024</a>' },
  { nama: 'Bank Sampah Situsari Sejahtera (Bassis)', jenis: 'bank-sampah', alamat: 'Jl. Pahing Desa, RT 02/RW 01, Desa Situsari', kecamatan: 'Kec. Darma',
    jam: '', menerima: [], kontak: '', maps: '',
    sumber: '<a href="https://zerowaste.id/peta-minim-sampah/bassis-bank-sampah-situsari-sejahtera/" target="_blank" rel="noopener">Peta Minim Sampah, Zero Waste Indonesia</a>' },
  { nama: 'TPS3R Desa Cibinuang', jenis: 'tps3r', alamat: 'Desa Cibinuang', kecamatan: 'Kec. Kuningan',
    jam: '', menerima: [], kontak: '', maps: '',
    sumber: '<a href="https://kuningankab.go.id/home/8-desa-siap-kelola-sampah-melalui-tps-3r/" target="_blank" rel="noopener">Pemkab Kuningan, peluncuran 8 TPS3R, 10 Feb 2022</a>' },
  { nama: 'TPS3R Desa Padamenak', jenis: 'tps3r', alamat: 'Desa Padamenak', kecamatan: 'Kec. Jalaksana',
    jam: '', menerima: [], kontak: '', maps: '',
    sumber: '<a href="https://kuningankab.go.id/home/8-desa-siap-kelola-sampah-melalui-tps-3r/" target="_blank" rel="noopener">Pemkab Kuningan, peluncuran 8 TPS3R, 10 Feb 2022</a>' }
];

/* Kamus istilah untuk orang awam. Kemunculan pertama di setiap bagian halaman diberi garis putus-putus;
   diketuk → muncul penjelasan satu kalimat. `cocok` = pola teks (regex, tanpa beda huruf besar kecuali B3).
   Urutkan yang lebih panjang lebih dulu (TPS3R sebelum TPS). */
JN.ISTILAH = [
  { id: 'tps3r',     nama: 'TPS3R',          cocok: 'TPS3R',                         arti: 'Tempat pengolahan sampah di tingkat desa atau kelurahan. 3R artinya reduce, reuse, recycle: mengurangi, memakai ulang, mendaur ulang.' },
  { id: 'tps',       nama: 'TPS',            cocok: 'TPS',                           arti: 'Tempat Penampungan Sementara: tempat sampah dikumpulkan sebelum diangkut truk ke TPA.' },
  { id: 'tpa',       nama: 'TPA',            cocok: 'TPA',                           arti: 'Tempat Pemrosesan Akhir: lokasi terakhir sampah ditimbun. Makin sedikit yang sampai ke sini, makin baik.' },
  { id: 'b3',        nama: 'B3',             cocok: 'B3', huruf: true,               arti: 'Bahan Berbahaya dan Beracun, misalnya baterai, lampu, obat, dan kaleng semprot. Jangan dicampur sampah biasa.' },
  { id: 'residu',    nama: 'Residu',         cocok: 'residu',                        arti: 'Sisa sampah yang sulit didaur ulang atau dikompos, misalnya sachet, styrofoam, dan popok. Akhirnya dibawa ke TPS.' },
  { id: 'anorganik', nama: 'Anorganik',      cocok: 'anorganik',                     arti: 'Sampah yang tidak membusuk, seperti plastik, kertas, kaleng, dan kaca. Banyak yang masih bisa didaur ulang bila bersih.' },
  { id: 'organik',   nama: 'Organik',        cocok: 'organik',                       arti: 'Sampah dari makhluk hidup yang bisa membusuk, seperti sisa makanan, kulit buah, dan daun.' },
  { id: 'kompos',    nama: 'Kompos',         cocok: 'kompos',                        arti: 'Pupuk alami dari sampah organik yang dibiarkan terurai selama beberapa minggu.' },
  { id: 'eco',       nama: 'Eco-enzyme',     cocok: 'eco-?enzyme',                   arti: 'Cairan hasil fermentasi kulit buah, gula, dan air selama sekitar 3 bulan. Bisa dipakai sebagai cairan pembersih.' },
  { id: 'bank',      nama: 'Bank sampah',    cocok: 'bank sampah',                   arti: 'Tempat menabung sampah anorganik yang bersih. Sampahmu ditimbang, lalu nilainya dicatat seperti tabungan.' },
  { id: 'drop',      nama: 'Drop point',     cocok: 'drop point',                    arti: 'Titik pengumpulan barang tertentu, misalnya kotak khusus untuk baterai atau elektronik bekas.' },
  { id: 'ecobrick',  nama: 'Ecobrick',       cocok: 'ecobrick',                      arti: 'Botol plastik yang diisi padat dengan plastik bersih dan kering, lalu dipakai sebagai bata sederhana.' },
  { id: 'jelantah',  nama: 'Minyak jelantah', cocok: 'minyak jelantah',              arti: 'Minyak goreng bekas pakai. Jangan dibuang ke saluran air; kumpulkan di botol lalu setor.' },
  { id: 'daur',      nama: 'Daur ulang',     cocok: 'didaur ulang|daur ulang',       arti: 'Mengolah barang bekas menjadi bahan atau barang baru.' },
  { id: 'zw',        nama: 'Zero-waste',     cocok: 'zero-waste',                    arti: 'Gaya hidup yang berusaha menghasilkan sampah sesedikit mungkin, bukan berarti tanpa sampah sama sekali.' }
];
