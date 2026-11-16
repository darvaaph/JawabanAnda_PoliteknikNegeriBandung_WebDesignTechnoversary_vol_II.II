/* Data Jejak Nol. Semua halaman membaca dari sini.
   Dipakai sebagai script biasa (bukan module) supaya website tetap jalan saat index.html dibuka langsung dari folder.

   PENTING sebelum submit:
   - Cocokkan pengelompokan tong (kat) dengan aturan bank sampah / TPS di Kuningan.
   - Isi semua `sumber` yang masih "ISI" dan angka FAKTA dari SIPSN KLHK.
   - DIREKTORI hanya diisi lokasi yang sudah dicek langsung oleh tim. */
window.JN = window.JN || {};

JN.KAT = {
  organik:   { nama: 'Organik',   warna: 'var(--organik)',   ke: 'Untuk dikompos',        isi: 'Sisa makanan, kulit buah, daun, ampas kopi dan teh.' },
  anorganik: { nama: 'Anorganik', warna: 'var(--anorganik)', ke: 'Ke bank sampah',        isi: 'Botol, gelas plastik, kardus, kertas, kaleng, kaca. Harus bersih dan kering.' },
  b3:        { nama: 'B3',        warna: 'var(--b3)',        ke: 'Ke drop point khusus',  isi: 'Bahan berbahaya dan beracun: baterai, lampu, obat, kaleng semprot, elektronik rusak.' },
  residu:    { nama: 'Residu',    warna: 'var(--residu)',    ke: 'Ke TPS',                isi: 'Yang sulit didaur ulang: sachet berlapis, styrofoam, tisu dan popok bekas.' }
};

JN.RUANG = [['dapur', 'Dapur'], ['kamar-mandi', 'Kamar mandi'], ['kos-kampus', 'Kos & kampus'], ['belanja', 'Belanja'], ['halaman', 'Halaman & umum']];

/* hitung: hanya barang sekali pakai yang punya pengganti jelas (dipakai Kalkulator Kurangi) */
JN.BARANG = [
  // dapur
  { id: 'botol', nama: 'Botol air mineral', alias: ['aqua', 'le minerale', 'botol plastik', 'pet', 'botol minum', 'botol teh', 'botol bening', 'botol bekas'], kat: 'anorganik', ruang: 'dapur', ikon: 'botol',
    langkah: ['Kosongkan dan bilas', 'Lepas tutup dan label', 'Pipihkan'], alt: 'Tumbler atau botol isi ulang.',
    hitung: { satuan: 'botol', ganti: 'tumbler', jumlah: 2, per: 'hari', k: .75 } },
  { id: 'pisang', nama: 'Kulit buah', alias: ['kulit pisang', 'kulit buah', 'pisang', 'kulit jeruk', 'kulit mangga', 'kulit apel', 'kulit semangka', 'biji buah'], kat: 'organik', ruang: 'dapur', ikon: 'pisang',
    langkah: ['Pisahkan dari plastik atau stiker buah', 'Masukkan ke wadah kompos atau botol eco-enzyme'], alt: 'Bahan kompos atau eco-enzyme.' },
  { id: 'apel', nama: 'Sisa buah & makanan', alias: ['sisa makanan', 'nasi', 'nasi basi', 'apel', 'sayur', 'sisa sayur', 'sayur busuk', 'roti basi', 'makanan basi', 'makanan sisa'], kat: 'organik', ruang: 'dapur', ikon: 'apel',
    langkah: ['Tiriskan air atau kuahnya', 'Masukkan ke wadah kompos'], alt: 'Masak dan ambil secukupnya.' },
  { id: 'kopi', nama: 'Ampas kopi & teh', alias: ['ampas kopi', 'teh celup', 'ampas teh', 'kantong teh'], kat: 'organik', ruang: 'dapur', ikon: 'gelas-kopi',
    langkah: ['Tiriskan', 'Masukkan ke kompos atau taburkan di tanah tanaman'], alt: 'Teh tubruk atau saringan teh yang bisa dicuci.' },
  { id: 'telur', nama: 'Cangkang telur', alias: ['kulit telur', 'telur'], kat: 'organik', ruang: 'dapur', ikon: 'telur',
    langkah: ['Bilas sebentar', 'Remukkan', 'Masukkan ke kompos'], alt: 'Remukan cangkang bisa jadi campuran media tanam.' },
  { id: 'jelantah', nama: 'Minyak goreng bekas (jelantah)', alias: ['minyak jelantah', 'jelantah', 'minyak goreng bekas', 'minyak goreng', 'minyak kotor'], kat: 'anorganik', labelKat: 'Penampungan jelantah · jangan ke wastafel', ruang: 'dapur', ikon: 'jelantah',
    langkah: ['Jangan dibuang ke wastafel, selokan, atau tanah karena menyumbat dan mencemari air', 'Tunggu dingin lalu saring remah makanannya', 'Simpan di botol/jeriken tertutup dan setor ke pengepul jelantah atau bank sampah'], alt: 'Kurangi gorengan berlebih dan tukarkan jelantah jadi biodiesel/tabungan.' },
  { id: 'thinwall', nama: 'Wadah makan plastik (thinwall)', alias: ['thinwall', 'kotak makan plastik', 'box plastik', 'mika makanan', 'wadah gofood', 'wadah shopeefood', 'bowl plastik', 'bento plastik'], kat: 'anorganik', ruang: 'dapur', ikon: 'thinwall',
    langkah: ['Buang sisa makanan dan kuahnya', 'Cuci bersih dengan sedikit sabun agar tidak berminyak', 'Pakai ulang di kulkas atau setor ke bank sampah (kode #5 PP)'], alt: 'Bawa wadah makan sendiri saat beli bungkus atau makan di tempat.' },
  { id: 'tetrapak', nama: 'Kotak susu & teh (Tetra Pak)', alias: ['kotak susu', 'dus susu', 'kardus susu', 'ultra milk', 'teh kotak', 'tetrapak', 'tetra pak', 'minuman kotak'], kat: 'anorganik', ruang: 'dapur', ikon: 'tetrapak',
    langkah: ['Habiskan isinya lalu bilas bagian dalam dengan air', 'Buka lipatan sudut atas dan bawah, lalu pipihkan', 'Setor ke bank sampah atau dropbox karton minuman'], alt: 'Pilih susu kemasan botol kaca atau ukuran keluarga.' },
  { id: 'styrofoam', nama: 'Kotak styrofoam', alias: ['sterofoam', 'stirofom', 'styrofoam', 'gabus', 'kotak nasi', 'gabus makanan'], kat: 'residu', ruang: 'dapur', ikon: 'styrofoam',
    langkah: ['Buang sisa makanannya', 'Masukkan ke residu'], alt: 'Bawa wadah makan sendiri.',
    hitung: { satuan: 'kotak', ganti: 'wadah makan sendiri', jumlah: 3, per: 'minggu', k: .5 } },
  { id: 'kardus-minyak', nama: 'Kardus pizza / dus berminyak', alias: ['kardus pizza', 'kotak pizza', 'dus pizza', 'dus martabak', 'kardus berminyak', 'dus nasi berminyak', 'kotak gorengan'], kat: 'residu', ruang: 'dapur', ikon: 'kardus',
    langkah: ['Gunting bagian tutup kardus yang masih bersih untuk masuk anorganik', 'Bagian yang basah kena minyak masukkan ke residu karena minyak merusak daur ulang kertas'], alt: 'Makan di tempat atau bawa kotak makan sendiri.' },
  { id: 'sachet', nama: 'Sachet kopi, bumbu & mie instan', alias: ['saset', 'bungkus kopi', 'sachet', 'bungkus mie', 'bungkus indomie', 'indomie', 'mie instan', 'mie sedaap', 'sarimi', 'bungkus snack', 'bungkus ciki', 'bungkus chiki'], kat: 'residu', ruang: 'dapur', ikon: 'sachet',
    langkah: ['Masukkan ke residu', 'Atau kumpulkan bersih dan kering untuk ecobrick'], alt: 'Beli kemasan besar atau curah.',
    hitung: { satuan: 'sachet', ganti: 'kemasan besar', jumlah: 1, per: 'hari', k: .5 } },
  { id: 'kertas-minyak', nama: 'Kertas nasi berminyak', alias: ['kertas nasi', 'bungkus nasi', 'kertas minyak', 'kertas padang', 'kertas warteg', 'kertas cokelat'], kat: 'residu', ruang: 'dapur', ikon: 'kertas-minyak',
    langkah: ['Buang sisa makanan', 'Masukkan ke residu karena berminyak dan berlapis plastik'], alt: 'Wadah makan sendiri.' },
  { id: 'tulang', nama: 'Tulang, daging & sisa berlemak', alias: ['tulang', 'tulang ayam', 'tulang ikan', 'duri ikan', 'sisa daging', 'lemak', 'kulit ayam', 'kuah santan'], kat: 'residu', ruang: 'dapur', ikon: 'tulang',
    langkah: ['Tiriskan kuahnya', 'Jangan dimasukkan ke kompos ember kos karena menimbulkan bau dan belatung', 'Bungkus rapat ke residu atau serahkan ke pengolah maggot BSF'], alt: 'Ambil porsi lauk secukupnya agar tidak bersisa.' },
  { id: 'alat-makan', nama: 'Sendok plastik & sumpit sekali pakai', alias: ['sendok plastik', 'garpu plastik', 'sumpit kayu', 'tusuk sate', 'alat makan plastik', 'pisau plastik'], kat: 'residu', ruang: 'dapur', ikon: 'alat-makan',
    langkah: ['Jika masih bersih dan kuat, simpan untuk dipakai lagi di kos', 'Jika patah atau sekali pakai, masukkan ke residu'], alt: 'Centang "tanpa alat makan" di aplikasi pesan-antar dan bawa sendok lipat.',
    hitung: { satuan: 'set', ganti: 'sendok sendiri', jumlah: 4, per: 'minggu', k: .75 } },
  { id: 'kaleng-makanan', nama: 'Kaleng sarden & susu kental', alias: ['kaleng sarden', 'kaleng kornet', 'kaleng susu', 'kaleng biskuit', 'kaleng makanan'], kat: 'anorganik', ruang: 'dapur', ikon: 'kaleng',
    langkah: ['Cuci bersih dari sisa minyak dan saus', 'Tekuk tutup tajamnya ke dalam kaleng agar tidak melukai petugas', 'Keringkan dan setor ke bank sampah'], alt: 'Pilih bahan segar atau kemasan botol kaca.' },
  { id: 'kaca', nama: 'Botol & toples kaca', alias: ['kaca', 'beling', 'botol kecap', 'botol saos', 'botol sambal', 'botol sirup', 'toples'], kat: 'anorganik', ruang: 'dapur', ikon: 'toples',
    langkah: ['Bilas', 'Simpan utuh, jangan dipecah', 'Kaca pecah dibungkus koran dan diberi tanda'], alt: 'Pakai ulang untuk wadah bumbu.' },
  // kamar mandi
  { id: 'sampo', nama: 'Botol sampo', alias: ['shampo', 'sabun cair', 'botol sabun', 'botol skincare'], kat: 'anorganik', ruang: 'kamar-mandi', ikon: 'sampo',
    langkah: ['Bilas', 'Pisahkan tutup'], alt: 'Isi ulang di toko curah atau pakai sabun batang.',
    hitung: { satuan: 'botol', ganti: 'isi ulang di toko curah', jumlah: 1, per: 'bulan', k: .5 } },
  { id: 'sikat', nama: 'Sikat gigi bekas', alias: ['sikat gigi'], kat: 'residu', ruang: 'kamar-mandi', ikon: 'sikat',
    langkah: ['Pakai ulang untuk membersihkan sela-sela', 'Lalu masukkan ke residu'], alt: 'Sikat gigi gagang bambu.' },
  { id: 'obat', nama: 'Obat kedaluwarsa', alias: ['obat', 'pil', 'kapsul', 'sirup', 'strip obat'], kat: 'b3', ruang: 'kamar-mandi', ikon: 'obat',
    langkah: ['Jangan dibuang ke saluran air', 'Serahkan ke apotek atau drop point B3'], alt: 'Beli obat secukupnya.' },
  { id: 'tisu', nama: 'Tisu bekas', alias: ['tisu', 'tissue', 'tisu basah'], kat: 'residu', ruang: 'kamar-mandi', ikon: 'tisu',
    langkah: ['Masukkan ke residu (tisu basah mengandung serat plastik, jangan dikomposkan)'], alt: 'Lap kain atau saputangan yang bisa dicuci.' },
  { id: 'popok', nama: 'Popok & pembalut sekali pakai', alias: ['popok', 'pampers', 'pembalut', 'softex', 'diapers'], kat: 'residu', ruang: 'kamar-mandi', ikon: 'popok',
    langkah: ['Buang kotorannya ke kloset', 'Gulung dan bungkus', 'Masukkan ke residu'], alt: 'Popok kain atau menstrual cup.' },
  { id: 'silet', nama: 'Pisau cukur, silet & jarum', alias: ['silet', 'pisau cukur', 'gillette', 'alat cukur', 'jarum', 'benda tajam'], kat: 'b3', labelKat: 'Benda tajam · wajib dibungkus aman', ruang: 'kamar-mandi', ikon: 'silet',
    langkah: ['Masukkan ke dalam kaleng bekas atau botol plastik tebal tertutup', 'Beri tulisan jelas "BENDA TAJAM" sebelum dibuang/disetor'], alt: 'Gunakan pisau cukur logam tahan lama (safety razor).' },
  // kos & kampus
  { id: 'gelas', nama: 'Gelas plastik minuman', alias: ['gelas es teh', 'cup', 'cup plastik', 'gelas kopi', 'cup kopi plastik', 'gelas boba', 'cup boba', 'gelas plastik'], kat: 'anorganik', ruang: 'kos-kampus', ikon: 'gelas',
    langkah: ['Bilas', 'Lepas plastik penutup (seal)', 'Susun bertumpuk'], alt: 'Bawa tumbler ke penjual.',
    hitung: { satuan: 'gelas', ganti: 'tumbler sendiri', jumlah: 1, per: 'hari', k: .5 } },
  { id: 'papercup', nama: 'Gelas kertas kopi (paper cup)', alias: ['cup kopi', 'gelas kopi kertas', 'paper cup', 'cup kertas', 'gelas kafe', 'cup panas', 'gelas kertas'], kat: 'residu', ruang: 'kos-kampus', ikon: 'papercup',
    langkah: ['Kosongkan sisa kopi', 'Masukkan ke residu karena bagian dalamnya dilapisi plastik tipis tahan air sehingga sulit didaur ulang'], alt: 'Bawa tumbler sendiri atau minum dengan cangkir di kafe.',
    hitung: { satuan: 'cup', ganti: 'tumbler sendiri', jumlah: 3, per: 'minggu', k: .75 } },
  { id: 'kaleng', nama: 'Kaleng minuman', alias: ['kaleng', 'soda', 'kaleng susu', 'kaleng kopi'], kat: 'anorganik', ruang: 'kos-kampus', ikon: 'kaleng',
    langkah: ['Kosongkan dan bilas', 'Pipihkan'], alt: 'Pilih minuman isi ulang.' },
  { id: 'sedotan', nama: 'Sedotan plastik', alias: ['pipet', 'sedotan'], kat: 'residu', ruang: 'kos-kampus', ikon: 'sedotan',
    langkah: ['Masukkan ke residu'], alt: 'Minum tanpa sedotan.',
    hitung: { satuan: 'sedotan', ganti: 'minum tanpa sedotan', jumlah: 1, per: 'hari', k: .75 } },
  { id: 'kertas', nama: 'Kertas & koran bekas', alias: ['kertas', 'koran', 'buku bekas', 'fotokopian', 'kertas hvs', 'kertas ujian'], kat: 'anorganik', ruang: 'kos-kampus', ikon: 'kertas',
    langkah: ['Pastikan kering dan tidak berminyak', 'Lipat dan ikat'], alt: 'Cetak bolak-balik atau baca digital.' },
  { id: 'masker', nama: 'Masker sekali pakai', alias: ['masker', 'masker medis'], kat: 'residu', ruang: 'kos-kampus', ikon: 'masker',
    langkah: ['Gunting talinya', 'Lipat dan masukkan ke residu'], alt: 'Masker kain yang bisa dicuci.' },
  { id: 'baterai', nama: 'Baterai bekas', alias: ['batre', 'batu baterai', 'baterai', 'batrai'], kat: 'b3', ruang: 'kos-kampus', ikon: 'baterai',
    langkah: ['Simpan terpisah dalam wadah tertutup', 'Serahkan ke drop point B3 atau e-waste'], alt: 'Baterai isi ulang.' },
  { id: 'lampu', nama: 'Lampu bekas', alias: ['bohlam', 'lampu', 'neon', 'lampu led rusak'], kat: 'b3', ruang: 'kos-kampus', ikon: 'lampu',
    langkah: ['Bungkus agar tidak pecah', 'Serahkan ke drop point B3'], alt: 'Lampu LED yang lebih awet.' },
  { id: 'kabel', nama: 'Kabel & charger rusak', alias: ['charger', 'kabel', 'casan', 'elektronik', 'hp rusak', 'earphone', 'headset', 'powerbank', 'kipas rusak'], kat: 'b3', ruang: 'kos-kampus', ikon: 'kabel',
    langkah: ['Kumpulkan terpisah', 'Serahkan ke drop point e-waste'], alt: 'Perbaiki dulu sebelum membeli baru.' },
  { id: 'semprot', nama: 'Kaleng semprot obat nyamuk', alias: ['obat nyamuk', 'aerosol', 'pengharum ruangan', 'semprotan', 'baygon', 'hit', 'stella', 'kispray'], kat: 'b3', ruang: 'kos-kampus', ikon: 'semprot',
    langkah: ['Habiskan isinya', 'Jangan dibakar atau dilubangi', 'Serahkan ke drop point B3'], alt: 'Kelambu atau raket nyamuk.' },
  // belanja
  { id: 'kresek', nama: 'Kantong kresek', alias: ['kantong plastik', 'plastik belanja', 'kresek', 'kantong asoy', 'tas kresek', 'plastik hitam'], kat: 'anorganik', ruang: 'belanja', ikon: 'kresek',
    langkah: ['Pakai ulang', 'Kumpulkan dalam keadaan bersih'], alt: 'Tas belanja kain.',
    hitung: { satuan: 'kantong', ganti: 'tas kain', jumlah: 5, per: 'minggu', k: 1 } },
  { id: 'kardus', nama: 'Kardus paket', alias: ['kardus', 'dus', 'karton', 'dus paket', 'kardus shopee', 'kardus tokopedia', 'dus indomie', 'dus aqua'], kat: 'anorganik', ruang: 'belanja', ikon: 'kardus',
    langkah: ['Lepas selotip', 'Lipat rata', 'Jaga tetap kering'], alt: 'Pakai ulang untuk menyimpan barang.' },
  { id: 'pouch', nama: 'Pouch refill sabun & minyak', alias: ['pouch refill', 'plastik refill', 'bungkus minyak goreng', 'kemasan minyak', 'refill sabun', 'refill deterjen', 'kantong refill'], kat: 'residu', ruang: 'belanja', ikon: 'sachet',
    langkah: ['Tiriskan sisa cairan sampai habis dan lap kering', 'Kumpulkan untuk ecobrick atau masukkan ke residu karena plastiknya berlapis'], alt: 'Isi ulang langsung ke botol lama di toko curah.' },
  { id: 'struk', nama: 'Struk belanja, ATM & resi paket', alias: ['struk atm', 'struk belanja', 'nota kasir', 'kertas termal', 'resi paket', 'resi shopee', 'karcis parkir'], kat: 'residu', ruang: 'belanja', ikon: 'struk',
    langkah: ['Jangan dicampur ke kertas daur ulang karena mengandung lapisan kimia BPA', 'Masukkan ke tong residu'], alt: 'Tolak cetak struk di ATM/kasir dan gunakan bukti digital.' },
  { id: 'tutup', nama: 'Tutup botol', alias: ['tutup botol', 'tutup galon'], kat: 'anorganik', ruang: 'belanja', ikon: 'tutup',
    langkah: ['Kumpulkan terpisah dari botolnya', 'Setor bersama plastik lain'], alt: 'Galon isi ulang.' },
  { id: 'bubble', nama: 'Bubble wrap paket', alias: ['bubble wrap', 'plastik gelembung', 'bungkus paket'], kat: 'anorganik', ruang: 'belanja', ikon: 'bubble',
    langkah: ['Simpan untuk mengirim paket lagi', 'Atau setor dalam keadaan bersih'], alt: 'Minta penjual tanpa bubble wrap.',
    hitung: { satuan: 'paket', ganti: 'catatan “tanpa bubble wrap”', jumlah: 2, per: 'bulan', k: .5 } },
  // halaman & umum
  { id: 'daun', nama: 'Daun kering & ranting', alias: ['daun', 'daun kering', 'ranting', 'rumput', 'bunga layu'], kat: 'organik', ruang: 'halaman', ikon: 'daun',
    langkah: ['Kumpulkan', 'Jadikan lapisan cokelat penutup bau di kompos'], alt: 'Mulsa alami di atas tanah tanaman.' },
  { id: 'pecahan', nama: 'Pecahan piring, keramik & cermin', alias: ['pecahan piring', 'keramik pecah', 'gelas pecah', 'cermin pecah', 'beling', 'mangkok pecah'], kat: 'residu', ruang: 'halaman', ikon: 'pecahan',
    langkah: ['Jangan dibuang telanjang di plastik tipis', 'Bungkus tebal pakai koran atau kardus bekas', 'Tulis "AWAS BELING" di luar bungkusan agar petugas aman'], alt: 'Gunakan alas anti-selip atau wadah tahan pecah.' },
  { id: 'korek', nama: 'Korek api gas bekas', alias: ['korek gas', 'korek api', 'pemantik', 'mancis', 'gas korek'], kat: 'b3', ruang: 'halaman', ikon: 'korek',
    langkah: ['Pastikan sisa gasnya sudah habis', 'Jangan dibakar atau dicampur sampah panas/organik', 'Simpan terpisah ke drop point B3'], alt: 'Gunakan korek isi ulang atau pemantik listrik USB.' },
  { id: 'pakaian', nama: 'Baju, kaos & kain bekas', alias: ['baju bekas', 'kaos bekas', 'pakaian robek', 'celana bekas', 'kain perca', 'sepatu bekas', 'tas robek'], kat: 'anorganik', labelKat: 'Donasi / daur ulang tekstil', ruang: 'halaman', ikon: 'pakaian',
    langkah: ['Jika masih layak pakai: cuci bersih dan donasikan atau tukar baju', 'Jika robek: ubah jadi kain lap rumah atau tas kaos di halaman Olah'], alt: 'Beli pakaian sesuai kebutuhan dan rawat agar awet.' }
];

/* Kode daur ulang plastik di bawah kemasan (Resin Identification Code) */
JN.PLASTIK = [
  { kode: 1, nama: 'PET',  awam: 'Botol air mineral & botol teh bening',         lengkap: 'Polyethylene terephthalate', contoh: 'Botol air mineral, botol minuman',   status: 'umum' },
  { kode: 2, nama: 'HDPE', awam: 'Botol tebal warna (sampo, deterjen, jeriken)', lengkap: 'High-density polyethylene',  contoh: 'Botol sampo, jeriken, botol susu',   status: 'umum' },
  { kode: 3, nama: 'PVC',  awam: 'Pipa paralon, selang, bungkus kabel kaku',     lengkap: 'Polyvinyl chloride',         contoh: 'Pipa, kabel, sebagian kemasan',      status: 'sulit' },
  { kode: 4, nama: 'LDPE', awam: 'Kantong kresek, plastik paket & plastik wrap', lengkap: 'Low-density polyethylene',   contoh: 'Kresek, plastik pembungkus',         status: 'terbatas' },
  { kode: 5, nama: 'PP',   awam: 'Gelas es teh/boba, tutup botol & wadah thinwall', lengkap: 'Polypropylene',           contoh: 'Gelas plastik, tutup botol, wadah',  status: 'umum' },
  { kode: 6, nama: 'PS',   awam: 'Kotak styrofoam & sendok plastik mudah patah', lengkap: 'Polystyrene',                contoh: 'Styrofoam, sendok plastik bening',   status: 'sulit' },
  { kode: 7, nama: 'Lain', awam: 'Sachet kopi/mie berlapis & galon bening keras', lengkap: 'Plastik lain atau campuran', contoh: 'Sachet berlapis, galon polikarbonat', status: 'sulit' }
];
JN.STATUS_PLASTIK = { umum: 'Umum diterima bank sampah', terbatas: 'Diterima sebagian bank sampah', sulit: 'Sulit didaur ulang' };

/* Langkah Olah */
JN.PANDUAN = [
  { id: 'kompos', ikon: 'ember', judul: 'Kompos ember', tingkat: 'Sedang', waktu: 'Beberapa minggu',
    bahan: ['Ember atau pot bekas berlubang', 'Sisa sayur dan buah', 'Daun kering atau kardus sobek', 'Sedikit tanah'],
    langkah: ['Lubangi dasar dan sisi ember supaya ada udara.', 'Isi lapisan bawah dengan tanah atau daun kering.', 'Masukkan sisa sayur dan buah yang sudah dipotong kecil.', 'Tutup dengan lapisan daun kering atau kardus sobek setiap kali menambah sisa dapur.', 'Aduk seminggu sekali. Kompos siap saat berwarna gelap dan berbau seperti tanah.'],
    hindari: 'Jangan masukkan daging, tulang, susu, dan minyak: menimbulkan bau dan mengundang lalat.' },
  { id: 'eco-enzyme', ikon: 'toples', judul: 'Eco-enzyme', tingkat: 'Sedang', waktu: 'Fermentasi ±3 bulan',
    bahan: ['Wadah plastik bertutup', 'Gula merah atau molase', 'Kulit buah dan sayur segar', 'Air bersih'],
    langkah: ['Pakai perbandingan yang umum dipakai: 1 bagian gula, 3 bagian kulit buah, 10 bagian air.', 'Larutkan gula dalam air, lalu masukkan potongan kulit buah.', 'Sisakan ruang kosong di atas, lalu tutup rapat.', 'Buka tutupnya sebentar setiap hari di minggu pertama untuk membuang gas.', 'Simpan di tempat teduh sekitar 3 bulan, lalu saring.'],
    hindari: 'Jangan pakai wadah kaca atau logam yang ditutup rapat: gas fermentasi bisa membuatnya pecah.' }
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

/* Mitos vs fakta. sumber: isi sebelum submit */
JN.MITOS = [
  { mitos: 'Semua plastik bisa didaur ulang.', fakta: 'Plastik berlapis seperti sachet sangat sulit dipisahkan bahannya, sehingga biasanya berakhir sebagai residu.', sumber: 'ISI' },
  { mitos: 'Toh nanti dipilah lagi di TPA.', fakta: 'Sampah yang sudah tercampur dan kotor jauh lebih sulit diolah. Memilah paling mudah dilakukan di rumah.', sumber: 'ISI' },
  { mitos: 'Baterai bekas boleh dibuang bersama sampah biasa.', fakta: 'Baterai termasuk limbah B3. Simpan terpisah dan serahkan ke drop point khusus.', sumber: 'ISI' },
  { mitos: 'Botol harus dibuang bersama tutupnya supaya rapi.', fakta: 'Tutup dan botol sering terbuat dari plastik berbeda. Pisahkan supaya lebih mudah dipilah di bank sampah.', sumber: 'ISI' }
];

/* Fakta beranda. Isi angka dari SIPSN KLHK (https://sipsn.menlhk.go.id) */
JN.FAKTA = [
  { angka: '[angka]',  isi: 'Jumlah sampah Kabupaten Kuningan per tahun.',      sumber: 'SIPSN KLHK (tahun terbaru)' },
  { angka: '[persen]', isi: 'Porsi sampah yang berasal dari rumah tangga.',     sumber: 'SIPSN KLHK (komposisi sumber sampah)' },
  { angka: '[persen]', isi: 'Porsi sampah plastik dalam komposisi sampah.',     sumber: 'SIPSN KLHK (komposisi jenis sampah)' }
];

/* Direktori Kuningan. Contoh isi:
  { nama: 'Bank Sampah …', jenis: 'bank-sampah', alamat: 'Jl. …', kecamatan: '…', jam: 'Sabtu 08.00–11.00',
    menerima: ['anorganik'], kontak: '08…', maps: 'https://maps.app.goo.gl/…', dicek: '2026-11-20' } */
JN.JENIS_TEMPAT = {
  'bank-sampah':   { nama: 'Bank sampah',      isi: 'Menerima sampah anorganik bersih (plastik, kertas, kaleng), sering ditukar tabungan.' },
  'tps3r':         { nama: 'TPS3R',            isi: 'Tempat pengolahan sampah tingkat desa atau kelurahan: memilah, mengompos, mendaur ulang.' },
  'drop-point-b3': { nama: 'Drop point B3',    isi: 'Titik pengumpulan baterai, lampu, elektronik, dan obat bekas.' },
  'toko-curah':    { nama: 'Toko curah/refill', isi: 'Tempat membeli sabun, sampo, atau bahan makanan dengan wadah sendiri.' }
};
JN.DIREKTORI = [];
