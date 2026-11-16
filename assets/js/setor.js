/* Setor: jenis tempat dan direktori Kuningan (dengan keadaan kosong yang jujur). */
JN.mulai = () => {
  const { $, $$, esc, KAT } = JN;
  const WARNA = { 'bank-sampah': 'var(--anorganik)', 'tps3r': 'var(--organik)', 'drop-point-b3': 'var(--b3)', 'toko-curah': 'var(--setor)' };

  $('#jenis-tempat').innerHTML = Object.entries(JN.JENIS_TEMPAT).map(([k, t]) => `
    <article class="kartu-tong${k === 'bank-sampah' ? '' : ' putih-teks'}" style="--w:${WARNA[k]}">
      <div class="kepala-tong"><b>${t.nama}</b></div>
      <div class="badan-tong" style="color:var(--tinta)"><p>${t.isi}</p></div>
    </article>`).join('');

  let jenis = 'semua';
  $('#filter-tempat').innerHTML = `<button type="button" aria-pressed="true" data-jenis="semua">Semua</button>` +
    Object.entries(JN.JENIS_TEMPAT).map(([k, t]) => `<button type="button" aria-pressed="false" data-jenis="${k}">${t.nama}</button>`).join('');
  function gambar() {
    const daftar = JN.DIREKTORI.filter(l => jenis === 'semua' || l.jenis === jenis);
    $('#daftar-lokasi').innerHTML = daftar.length ? `<div class="direktori-daftar">${daftar.map(l => `
      <article class="lokasi kertas">
        <span class="chip" style="background:${WARNA[l.jenis]}">${esc(JN.JENIS_TEMPAT[l.jenis].nama)}</span>
        <h3>${esc(l.nama)}</h3>
        <p>${esc(l.alamat)}, ${esc(l.kecamatan)}</p>
        <p><strong>Jam:</strong> ${esc(l.jam)}</p>
        <p><strong>Menerima:</strong> ${l.menerima.map(m => KAT[m] ? KAT[m].nama : esc(m)).join(', ')}</p>
        ${l.kontak ? `<p><strong>Kontak:</strong> ${esc(l.kontak)}</p>` : ''}
        ${l.maps ? `<a class="tautan-lanjut" href="${esc(l.maps)}" target="_blank" rel="noopener">Buka di peta →</a>` : ''}
        <span class="isi-sumber">Dicek tim pada ${esc(l.dicek)}</span>
      </article>`).join('')}</div>`
      : `<div class="kosong-besar kertas">
          <div class="kardi-kosong">${JN.kardiSVG(false, '')}</div>
          <div><h3>${JN.DIREKTORI.length ? 'Belum ada lokasi untuk jenis ini' : 'Daftar lokasi sedang kami cek'}</h3>
            <p class="pengantar">Kami tidak mau mencantumkan alamat yang belum pasti. Sambil menunggu, tanyakan ke RT/RW atau kelurahan apakah ada bank sampah terdekat. Kalau kamu tahu lokasinya, kabari kami.</p>
            <p style="margin-top:14px"><a class="btn kecil" href="kontak.html?jenis=lokasi">Usulkan lokasi</a></p></div>
        </div>`;
  }
  $$('[data-jenis]').forEach(b => b.addEventListener('click', () => {
    jenis = b.dataset.jenis;
    $$('[data-jenis]').forEach(x => x.setAttribute('aria-pressed', x === b));
    gambar();
  }));
  gambar();

  /* checklist persiapan = aksi jejak langkah Setor */
  const kotak = $$('#checklist input');
  const panggung = pasangPanggungSetor($('#setor-gambar'), $('#setor-panggung'), $('#setor-status'));
  const sinkron = () => {
    const c = JN.jejak.data().setor.centang;
    kotak.forEach(k => { k.checked = c.includes(+k.value); k.disabled = false; });
    panggung(c);
  };
  kotak.forEach(k => k.addEventListener('change', () => {
    JN.jejak.ubah(d => { d.setor.centang = kotak.filter(x => x.checked).map(x => +x.value); });
  }));
  document.addEventListener('jejakberubah', sinkron);
  sinkron();

  pasangJalur($('#jalur-sampah'));
};

/* Tumpukan sampah yang berubah sesuai persiapan yang dicentang (urutan bebas).
   Setiap centang menambah kelas c0–c4 di panggung; perubahan gambarnya diatur CSS. */
function pasangPanggungSetor(wadah, panggung, status) {
  if (!wadah) return () => {};
  const ik = (n, x, y, w) => `<svg x="${x}" y="${y}" width="${w}" height="${w}" viewBox="0 0 48 48">${JN.IKON[n]}</svg>`;
  wadah.innerHTML = `<svg class="setor-gbr" viewBox="0 0 320 220" role="img" aria-label="Tumpukan sampah yang sedang disiapkan untuk disetor">
    <rect x="0" y="198" width="320" height="4" rx="2" fill="#1B1712"/>
    <g class="s-tong"><rect x="14" y="146" width="40" height="52" rx="3" fill="var(--organik)" stroke="#1B1712" stroke-width="3"/><rect x="10" y="140" width="48" height="8" rx="2" fill="#1B1712"/>
      <text x="34" y="178" text-anchor="middle" font-family="Archivo, sans-serif" font-size="9" font-weight="900" fill="#fff">KOMPOS</text>
      <rect x="62" y="146" width="40" height="52" rx="3" fill="var(--b3)" stroke="#1B1712" stroke-width="3"/><rect x="58" y="140" width="48" height="8" rx="2" fill="#1B1712"/>
      <text x="82" y="178" text-anchor="middle" font-family="Archivo, sans-serif" font-size="9" font-weight="900" fill="#fff">B3</text></g>
    <g class="s-karung">${[['PLASTIK', 132], ['LOGAM', 186], ['KERTAS', 240]].map(([t, x]) =>
      `<path d="M${x} 170 q-4 28 6 28 h36 q10 0 6 -28 z" fill="#E6D6B6" stroke="#1B1712" stroke-width="3"/><text x="${x + 24}" y="190" text-anchor="middle" font-family="Space Mono, monospace" font-size="8" font-weight="700" fill="#1B1712">${t}</text>`).join('')}
      <g class="s-tutup">${ik('tutup', 112, 176, 22)}</g></g>
    <g class="s-kardus">${ik('kardus', 196, 130, 66)}
      <g class="s-basah"><rect x="204" y="152" width="50" height="36" rx="3" fill="#1F4E8C" opacity=".35"/><path d="M214 140 q4 8 0 12 q-4 -4 0 -12z M236 134 q4 8 0 12 q-4 -4 0 -12z M250 144 q4 8 0 12 q-4 -4 0 -12z" fill="#5B8FD6"/></g></g>
    <g class="s-botol">${ik('botol', 128, 112, 66)}
      <g class="s-noda" fill="#7A5534"><ellipse cx="152" cy="160" rx="7" ry="4"/><ellipse cx="166" cy="150" rx="4" ry="3"/></g></g>
    <g class="s-kaleng">${ik('kaleng', 172, 140, 52)}<g class="s-noda" fill="#7A5534"><ellipse cx="196" cy="170" rx="6" ry="4"/></g></g>
    <g class="s-pisang">${ik('pisang', 150, 156, 42)}</g>
    <g class="s-baterai">${ik('baterai', 214, 164, 34)}</g>
    <g class="s-lalat" fill="#1B1712"><circle cx="170" cy="112" r="3"/><ellipse cx="167" cy="108" rx="3" ry="2" fill="#fff" stroke="#1B1712"/><circle cx="208" cy="126" r="3"/><ellipse cx="211" cy="122" rx="3" ry="2" fill="#fff" stroke="#1B1712"/></g>
    <g class="s-kilau" stroke="#5B8FD6" stroke-width="3" stroke-linecap="round"><path d="M136 120 v8 M132 124 h8 M206 140 v8 M202 144 h8"/></g>
    <g class="s-kal"><rect x="256" y="14" width="50" height="50" rx="6" fill="#FBF7EE" stroke="#1B1712" stroke-width="3"/><rect x="256" y="14" width="50" height="14" rx="6" fill="var(--b3)"/>
      <text class="s-kal-tanya" x="281" y="54" text-anchor="middle" font-family="Archivo, sans-serif" font-size="22" font-weight="900" fill="#1B1712">?</text>
      <text class="s-kal-ok" x="281" y="52" text-anchor="middle" font-family="Archivo, sans-serif" font-size="13" font-weight="900" fill="var(--organik)">SABTU ✓</text></g>
    <g class="s-stempel"><rect x="40" y="44" width="160" height="36" rx="8" fill="#FBF7EE" stroke="var(--organik)" stroke-width="4"/>
      <text x="120" y="69" text-anchor="middle" font-family="Archivo, sans-serif" font-size="19" font-weight="900" fill="var(--organik)">SIAP DISETOR ✓</text></g>
  </svg>`;
  const PESAN = ['Pisang ke kompos, baterai ke B3.', 'Botol dan kaleng sudah bersih, lalat pergi.', 'Kardus sudah kering.', 'Masuk karung per jenis, tutup botol dipisah.', 'Jadwal bank sampah sudah dicek.'];
  let sebelum = [];
  return centang => {
    for (let i = 0; i < 5; i++) panggung.classList.toggle('c' + i, centang.includes(i));
    panggung.classList.toggle('siap', centang.length >= 5);
    panggung.style.setProperty('--isi', `${(centang.length / 5) * 100}%`);
    const baru = centang.find(i => !sebelum.includes(i));
    status.innerHTML = centang.length >= 5 ? '<b>5/5 siap.</b> Sampah anorganikmu siap dibawa ke bank sampah!'
      : `<b>${centang.length}/5 siap.</b> ${baru != null ? PESAN[baru] : 'Centang persiapannya untuk merapikan tumpukan ini.'}`;
    sebelum = [...centang];
  };
}

/* Dua jalur sampah: campur (semua ke TPA) vs dipilah (tiap jenis punya tujuan). Angka dari JN.KOMPOSISI. */
function pasangJalur(wadah) {
  if (!wadah) return;
  const { $$, svg, KAT } = JN;
  const jml = kat => JN.KOMPOSISI.filter(k => k.kat === kat).reduce((s, k) => s + k.jumlah, 0);
  const node = (ikon, judul, ket, warna) => `<div class="j-node" style="--w:${warna || 'var(--kertas-2)'}">${ikon ? svg(ikon) : ''}<b>${judul}</b>${ket ? `<span>${ket}</span>` : ''}</div>`;
  const panah = '<span class="j-panah" aria-hidden="true"><i></i></span>';
  const MODE = {
    campur: {
      angka: 100, ket: 'dari 100 bagian sampah berakhir di TPA',
      jalur: [[node('kresek', 'Rumah', 'semua dalam satu kantong'), node('ember', 'TPS'), node('', 'Truk sampah'), node('', 'TPA Ciniru', 'ditimbun', 'var(--residu)')]],
      catatan: 'Di TPA, sampah tercampur ditimbun. Sisa makanan membusuk jadi gas metana dan air lindi, dan timbunan bisa terbakar seperti TPA Ciniru pada 12 Agustus 2026.'
    },
    pilah: {
      angka: jml('residu'), ket: 'dari 100 bagian yang masih harus ke TPA',
      jalur: [
        [node('pisang', KAT.organik.nama, `${jml('organik')} bagian`, KAT.organik.warna), node('ember', 'Kompos di rumah', 'jadi pupuk')],
        [node('botol', KAT.anorganik.nama, `${jml('anorganik')} bagian`, KAT.anorganik.warna), node('kardus', 'Bank sampah', 'ditimbang, ditabung'), node('', 'Didaur ulang')],
        [node('baterai', KAT.b3.nama, 'sedikit, tapi berbahaya', KAT.b3.warna), node('', 'Drop point B3', 'dikelola khusus')],
        [node('sachet', KAT.residu.nama, `${jml('residu')} bagian`, KAT.residu.warna), node('', 'TPS lalu TPA', 'jauh lebih sedikit')]
      ],
      catatan: 'Hitungannya memakai komposisi sampah nasional SIPSN 2025 (1 bagian = 1% berat). B3 jumlahnya kecil tapi wajib dipisah karena berbahaya.'
    }
  };
  function gambar(mode) {
    const m = MODE[mode];
    wadah.dataset.mode = mode;
    wadah.innerHTML = `<div class="j-angka"><b data-target="${m.angka}">${m.angka}</b><span>${m.ket}</span></div>
      <div class="j-jalur">${m.jalur.map((baris, i) => `<div class="j-baris" style="--i:${i}">${baris.join(panah)}</div>`).join('')}</div>
      <p class="j-catatan">${m.catatan}</p>`;
    $$('.jalur-pilih button').forEach(b => b.setAttribute('aria-pressed', b.dataset.mode === mode));
  }
  $$('.jalur-pilih button').forEach(b => b.addEventListener('click', () => gambar(b.dataset.mode)));
  gambar('campur');
}
