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
  const sinkron = () => {
    const c = JN.jejak.data().setor.centang;
    kotak.forEach(k => { k.checked = c.includes(+k.value); k.disabled = false; });
  };
  kotak.forEach(k => k.addEventListener('change', () => {
    JN.jejak.ubah(d => { d.setor.centang = kotak.filter(x => x.checked).map(x => +x.value); });
  }));
  document.addEventListener('jejakberubah', sinkron);
  sinkron();

};
