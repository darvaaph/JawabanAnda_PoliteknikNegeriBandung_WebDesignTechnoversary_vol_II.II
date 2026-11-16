/* Setor: persiapan, dua jalur sampah (sekaligus menjelaskan jenis tempat), dan direktori Kuningan. */
JN.mulai = () => {
  const { $, $$, esc, KAT } = JN;
  const WARNA = { 'bank-sampah': 'var(--anorganik)', 'tps3r': 'var(--organik)', 'drop-point-b3': 'var(--b3)', 'toko-curah': 'var(--setor)' };

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
  const panggung = pasangSebelumSesudah($('#setor-siap'), $('#setor-status'));
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

/* Sebelum → Sesudah: setiap baris persiapan punya ilustrasi kecil (56×56) yang berbalik dari keadaan
   "sebelum" ke "sesudah" saat dicentang. Di atas daftar: karung yang terisi + bar progres + stempel. */
function pasangSebelumSesudah(kartu, status) {
  if (!kartu) return () => {};
  const { $$ } = JN;
  const ik = (n, x, y, w) => `<svg x="${x}" y="${y}" width="${w}" height="${w}" viewBox="0 0 48 48">${JN.IKON[n]}</svg>`;
  const T = 'stroke="#1B1712" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"';
  const lalat = (x, y) => `<g class="ba-lalat"><ellipse cx="${x - 2}" cy="${y - 3}" rx="3" ry="2" fill="#fff" ${T}/><circle cx="${x}" cy="${y}" r="2.6" fill="#1B1712"/></g>`;
  const kilau = (x, y, w) => `<path d="M${x} ${y - 6} L${x + 1.6} ${y - 1.6} L${x + 6} ${y} L${x + 1.6} ${y + 1.6} L${x} ${y + 6} L${x - 1.6} ${y + 1.6} L${x - 6} ${y} L${x - 1.6} ${y - 1.6}Z" fill="${w}"/>`;
  const tong = (x, w) => `<rect x="${x}" y="24" width="13" height="24" rx="2" fill="${w}" ${T}/><rect x="${x - 1.5}" y="20" width="16" height="5" rx="1.5" fill="#1B1712"/>`;
  const kalender = isi => `<rect x="8" y="9" width="40" height="40" rx="6" fill="#FBF7EE" ${T}/><path d="M8 15 a6 6 0 0 1 6 -6 h28 a6 6 0 0 1 6 6 v5 H8z" fill="#D64532" ${T}/>
    <path d="M18 5 v8 M38 5 v8" ${T}/>${isi}`;
  const GAMBAR = [
    [ /* 1 pilah: kantong campur → tiga tong */
      `${ik('kresek', 4, 8, 46)}${ik('pisang', 26, 0, 22)}${ik('baterai', 2, 2, 16)}`,
      `${tong(4, '#2E8B57')}${tong(21.5, '#F2C230')}${tong(39, '#D64532')}` ],
    [ /* 2 bilas: botol bernoda + lalat → botol bersih berkilau */
      `${ik('botol', 6, 4, 46)}<ellipse cx="27" cy="38" rx="6" ry="3.5" fill="#7A5534"/><ellipse cx="33" cy="30" rx="3.5" ry="2.5" fill="#7A5534"/>${lalat(46, 14)}${lalat(10, 22)}`,
      `${ik('botol', 6, 4, 46)}${kilau(45, 12, '#5B8FD6')}${kilau(11, 34, '#F2C230')}` ],
    [ /* 3 keringkan: kardus basah menetes → kardus kering + matahari */
      `${ik('kardus', 4, 10, 46)}<rect x="9" y="27" width="36" height="22" rx="2" fill="#1F4E8C" opacity=".32"/>
       <path d="M14 6 q4 7 0 10 q-4 -3 0 -10z M28 2 q4 7 0 10 q-4 -3 0 -10z M42 6 q4 7 0 10 q-4 -3 0 -10z" fill="#5B8FD6"/>`,
      `${ik('kardus', 4, 12, 44)}<circle cx="45" cy="10" r="5.5" fill="#F2C230" ${T}/>
       <path d="M45 1 v2 M45 17 v2 M36 10 h2 M52 10 h2 M38.6 3.6 l1.4 1.4 M50 15 l1.4 1.4" ${T}/>` ],
    [ /* 4 kelompokkan: barang berserakan → karung PLASTIK yang rapi */
      `<g transform="rotate(-28 15 30)">${ik('botol', 2, 14, 28)}</g>${ik('kaleng', 26, 26, 24)}${ik('kertas', 28, 0, 24)}${ik('tutup', 4, 2, 14)}`,
      `${ik('botol', 12, 0, 20)}${ik('botol', 24, 2, 20)}<path d="M8 20 h40 l-3 30 a3 3 0 0 1 -3 2.6 H14 a3 3 0 0 1 -3 -2.6z" fill="#E6D6B6" ${T}/>
       <text x="28" y="40" text-anchor="middle" font-family="Space Mono, monospace" font-size="8" font-weight="700" fill="#1B1712">PLASTIK</text>` ],
    [ /* 5 cek jadwal: kalender ? → kalender SABTU ✓ */
      kalender('<text x="28" y="43" text-anchor="middle" font-family="Archivo, sans-serif" font-size="20" font-weight="900" fill="#1B1712">?</text>'),
      kalender('<text x="28" y="33" text-anchor="middle" font-family="Archivo, sans-serif" font-size="9" font-weight="900" fill="#1B1712">SABTU</text><path d="M20 39 l5 5 l11 -11" fill="none" stroke="#2E8B57" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>') ]
  ];
  $$('#checklist li', kartu).forEach((li, i) => {
    const g = GAMBAR[i]; if (!g) return;
    li.querySelector('label').insertAdjacentHTML('afterbegin', `<span class="ba" aria-hidden="true">
      <svg class="ba-sebelum" viewBox="0 0 56 56">${g[0]}</svg><svg class="ba-sesudah" viewBox="0 0 56 56">${g[1]}</svg></span>`);
  });
  $('.siap-karung', kartu).innerHTML = `<svg viewBox="0 0 56 56">
    <defs><clipPath id="klip-karung"><path d="M10 16 h36 l-3 34 a3 3 0 0 1 -3 2.6 H16 a3 3 0 0 1 -3 -2.6z"/></clipPath></defs>
    <path d="M10 16 h36 l-3 34 a3 3 0 0 1 -3 2.6 H16 a3 3 0 0 1 -3 -2.6z" fill="#FBF7EE"/>
    <g clip-path="url(#klip-karung)"><rect class="karung-isi" x="0" y="16" width="56" height="40" fill="#2E8B57"/></g>
    <path d="M10 16 h36 l-3 34 a3 3 0 0 1 -3 2.6 H16 a3 3 0 0 1 -3 -2.6z" fill="none" ${T}/><path d="M14 16 q14 -10 28 0" fill="none" ${T}/></svg>`;
  function $(sel, el) { return (el || document).querySelector(sel); }
  const PESAN = ['Sampah sudah dipilah ke tong masing-masing.', 'Botol dan kaleng sudah bersih, lalat pun pergi.', 'Kardus dan kertas sudah kering.', 'Sudah dikelompokkan per jenis ke dalam karung.', 'Jadwal bank sampah sudah dicek.'];
  let sebelum = [];
  return centang => {
    const n = centang.length;
    $$('#checklist li', kartu).forEach((li, i) => li.classList.toggle('cek', centang.includes(i)));
    kartu.classList.toggle('siap', n >= 5);
    kartu.style.setProperty('--isi', `${(n / 5) * 100}%`);
    kartu.style.setProperty('--isi-angka', n / 5);
    const baru = centang.find(i => !sebelum.includes(i));
    status.innerHTML = n >= 5 ? '<b>5/5 siap.</b> Sampah anorganikmu siap dibawa ke bank sampah!'
      : `<b>${n}/5 siap.</b> ${baru != null ? PESAN[baru] : 'Centang setiap persiapan, lalu lihat gambarnya berubah.'}`;
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
        [node('pisang', KAT.organik.nama, `${jml('organik')} bagian`, KAT.organik.warna), node('ember', 'Kompos di rumah', 'atau TPS3R desa/kelurahan: dikompos jadi pupuk')],
        [node('botol', KAT.anorganik.nama, `${jml('anorganik')} bagian`, KAT.anorganik.warna), node('kardus', 'Bank sampah', 'ditimbang, nilainya dicatat seperti tabungan'), node('', 'Didaur ulang')],
        [node('baterai', KAT.b3.nama, 'sedikit, tapi berbahaya', KAT.b3.warna), node('', 'Drop point B3', 'baterai, lampu, obat, elektronik bekas')],
        [node('sachet', KAT.residu.nama, `${jml('residu')} bagian`, KAT.residu.warna), node('', 'TPS lalu TPA', 'jauh lebih sedikit')]
      ],
      catatan: 'Hitungannya memakai komposisi sampah nasional SIPSN 2025 (1 bagian = 1% berat). B3 jumlahnya kecil tapi wajib dipisah karena berbahaya. Supaya sampah tidak muncul sejak awal, belanja di toko curah/refill dengan wadah sendiri.'
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
