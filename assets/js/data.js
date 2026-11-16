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
