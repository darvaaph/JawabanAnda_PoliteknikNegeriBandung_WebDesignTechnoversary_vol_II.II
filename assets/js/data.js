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

JN.RUANG = [['dapur', 'Dapur'], ['kamar-mandi', 'Kamar mandi'], ['kos-kampus', 'Kos & kampus'], ['belanja', 'Belanja']];

/* hitung: hanya barang sekali pakai yang punya pengganti jelas (dipakai Kalkulator Kurangi) */
JN.BARANG = [
  // dapur
  { id: 'botol', nama: 'Botol air mineral', alias: ['aqua', 'botol plastik', 'pet', 'botol minum'], kat: 'anorganik', ruang: 'dapur', ikon: 'botol',
    langkah: ['Kosongkan dan bilas', 'Lepas tutup dan label', 'Pipihkan'], alt: 'Tumbler atau botol isi ulang.',
    hitung: { satuan: 'botol', ganti: 'tumbler', jumlah: 2, per: 'hari', k: .75 } },
  { id: 'pisang', nama: 'Kulit pisang', alias: ['kulit buah', 'pisang'], kat: 'organik', ruang: 'dapur', ikon: 'pisang',
    langkah: ['Pisahkan dari plastik', 'Masukkan ke wadah kompos'], alt: 'Bahan kompos atau eco-enzyme.' },
  { id: 'apel', nama: 'Sisa buah & makanan', alias: ['sisa makanan', 'nasi', 'apel', 'sayur', 'makanan basi'], kat: 'organik', ruang: 'dapur', ikon: 'apel',
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
  { id: 'kaca', nama: 'Botol & toples kaca', alias: ['kaca', 'beling', 'botol kecap', 'toples'], kat: 'anorganik', ruang: 'dapur', ikon: 'toples',
    langkah: ['Bilas', 'Simpan utuh, jangan dipecah', 'Kaca pecah dibungkus koran dan diberi tanda'], alt: 'Pakai ulang untuk wadah bumbu.' },
  // kamar mandi
  { id: 'sampo', nama: 'Botol sampo', alias: ['shampo', 'sabun cair', 'botol sabun'], kat: 'anorganik', ruang: 'kamar-mandi', ikon: 'sampo',
    langkah: ['Bilas', 'Pisahkan tutup'], alt: 'Isi ulang di toko curah.',
    hitung: { satuan: 'botol', ganti: 'isi ulang di toko curah', jumlah: 1, per: 'bulan', k: .5 } },
  { id: 'sikat', nama: 'Sikat gigi bekas', alias: ['sikat gigi'], kat: 'residu', ruang: 'kamar-mandi', ikon: 'sikat',
    langkah: ['Pakai ulang untuk membersihkan sela-sela', 'Lalu masukkan ke residu'], alt: 'Sikat gigi gagang bambu.' },
  { id: 'obat', nama: 'Obat kedaluwarsa', alias: ['obat', 'pil', 'kapsul', 'sirup'], kat: 'b3', ruang: 'kamar-mandi', ikon: 'obat',
    langkah: ['Jangan dibuang ke saluran air', 'Serahkan ke apotek atau drop point B3'], alt: 'Beli obat secukupnya.' },
  { id: 'tisu', nama: 'Tisu bekas', alias: ['tisu', 'tissue'], kat: 'residu', ruang: 'kamar-mandi', ikon: 'tisu',
    langkah: ['Masukkan ke residu'], alt: 'Lap kain yang bisa dicuci.' },
  { id: 'popok', nama: 'Popok & pembalut sekali pakai', alias: ['popok', 'pampers', 'pembalut'], kat: 'residu', ruang: 'kamar-mandi', ikon: 'popok',
    langkah: ['Buang kotorannya ke kloset', 'Gulung dan bungkus', 'Masukkan ke residu'], alt: 'Popok kain atau menstrual cup.' },
  // kos & kampus
  { id: 'gelas', nama: 'Gelas plastik minuman', alias: ['gelas es teh', 'cup', 'gelas kopi', 'gelas boba'], kat: 'anorganik', ruang: 'kos-kampus', ikon: 'gelas',
    langkah: ['Bilas', 'Lepas plastik penutup', 'Susun bertumpuk'], alt: 'Bawa tumbler ke penjual.',
    hitung: { satuan: 'gelas', ganti: 'tumbler sendiri', jumlah: 1, per: 'hari', k: .5 } },
  { id: 'kaleng', nama: 'Kaleng minuman', alias: ['kaleng', 'soda', 'kaleng susu'], kat: 'anorganik', ruang: 'kos-kampus', ikon: 'kaleng',
    langkah: ['Kosongkan dan bilas', 'Pipihkan'], alt: 'Pilih minuman isi ulang.' },
  { id: 'sedotan', nama: 'Sedotan plastik', alias: ['pipet', 'sedotan'], kat: 'residu', ruang: 'kos-kampus', ikon: 'sedotan',
    langkah: ['Masukkan ke residu'], alt: 'Minum tanpa sedotan.',
    hitung: { satuan: 'sedotan', ganti: 'minum tanpa sedotan', jumlah: 1, per: 'hari', k: .75 } },
  { id: 'kertas', nama: 'Kertas & koran bekas', alias: ['kertas', 'koran', 'buku bekas', 'fotokopian'], kat: 'anorganik', ruang: 'kos-kampus', ikon: 'kertas',
    langkah: ['Pastikan kering dan tidak berminyak', 'Lipat dan ikat'], alt: 'Cetak bolak-balik atau baca digital.' },
  { id: 'masker', nama: 'Masker sekali pakai', alias: ['masker'], kat: 'residu', ruang: 'kos-kampus', ikon: 'masker',
    langkah: ['Gunting talinya', 'Lipat dan masukkan ke residu'], alt: 'Masker kain yang bisa dicuci.' },
  { id: 'baterai', nama: 'Baterai bekas', alias: ['batre', 'batu baterai', 'baterai'], kat: 'b3', ruang: 'kos-kampus', ikon: 'baterai',
    langkah: ['Simpan terpisah dalam wadah tertutup', 'Serahkan ke drop point B3 atau e-waste'], alt: 'Baterai isi ulang.' },
  { id: 'lampu', nama: 'Lampu bekas', alias: ['bohlam', 'lampu', 'neon'], kat: 'b3', ruang: 'kos-kampus', ikon: 'lampu',
    langkah: ['Bungkus agar tidak pecah', 'Serahkan ke drop point B3'], alt: 'Lampu LED yang lebih awet.' },
  { id: 'kabel', nama: 'Kabel & charger rusak', alias: ['charger', 'kabel', 'casan', 'elektronik', 'hp rusak'], kat: 'b3', ruang: 'kos-kampus', ikon: 'kabel',
    langkah: ['Kumpulkan terpisah', 'Serahkan ke drop point e-waste'], alt: 'Perbaiki dulu sebelum membeli baru.' },
  { id: 'semprot', nama: 'Kaleng semprot obat nyamuk', alias: ['obat nyamuk', 'aerosol', 'pengharum ruangan', 'semprotan'], kat: 'b3', ruang: 'kos-kampus', ikon: 'semprot',
    langkah: ['Habiskan isinya', 'Jangan dibakar atau dilubangi', 'Serahkan ke drop point B3'], alt: 'Kelambu atau raket nyamuk.' },
  // belanja
  { id: 'kresek', nama: 'Kantong kresek', alias: ['kantong plastik', 'plastik belanja', 'kresek'], kat: 'anorganik', ruang: 'belanja', ikon: 'kresek',
    langkah: ['Pakai ulang', 'Kumpulkan dalam keadaan bersih'], alt: 'Tas belanja kain.',
    hitung: { satuan: 'kantong', ganti: 'tas kain', jumlah: 5, per: 'minggu', k: 1 } },
  { id: 'kardus', nama: 'Kardus paket', alias: ['kardus', 'dus', 'karton'], kat: 'anorganik', ruang: 'belanja', ikon: 'kardus',
    langkah: ['Lepas selotip', 'Lipat rata', 'Jaga tetap kering'], alt: 'Pakai ulang untuk menyimpan barang.' },
  { id: 'tutup', nama: 'Tutup botol', alias: ['tutup botol', 'tutup galon'], kat: 'anorganik', ruang: 'belanja', ikon: 'tutup',
    langkah: ['Kumpulkan terpisah dari botolnya', 'Setor bersama plastik lain'], alt: 'Galon isi ulang.' },
  { id: 'bubble', nama: 'Bubble wrap paket', alias: ['bubble wrap', 'plastik gelembung', 'bungkus paket'], kat: 'anorganik', ruang: 'belanja', ikon: 'bubble',
    langkah: ['Simpan untuk mengirim paket lagi', 'Atau setor dalam keadaan bersih'], alt: 'Minta penjual tanpa bubble wrap.',
    hitung: { satuan: 'paket', ganti: 'catatan “tanpa bubble wrap”', jumlah: 2, per: 'bulan', k: .5 } },
  { id: 'daun', nama: 'Daun kering', alias: ['daun', 'ranting', 'rumput'], kat: 'organik', ruang: 'belanja', ikon: 'daun',
    langkah: ['Kumpulkan', 'Jadikan lapisan cokelat di kompos'], alt: 'Mulsa untuk tanaman.' }
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
