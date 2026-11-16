/* Olah: panduan langkah demi langkah, galeri DIY dengan filter bahan, mitos vs fakta. */
JN.mulai = () => {
  const { $, $$, svg } = JN;

  $('#daftar-panduan').innerHTML = JN.PANDUAN.map(p => `
    <article class="panduan kertas selotip" id="${p.id}">
      ${svg(p.ikon, '', 'ilus')}
      <div>
        <h3>${p.judul}</h3>
        <div class="meta" style="margin-top:8px"><span>Kesulitan: ${p.tingkat}</span><span>Waktu: ${p.waktu}</span></div>
        <div class="kolom">
          <div><h4>Bahan</h4><ul>${p.bahan.map(b => `<li>${b}</li>`).join('')}</ul></div>
          <div><h4>Langkah</h4><ol>${p.langkah.map(l => `<li>${l}</li>`).join('')}</ol></div>
        </div>
        ${p.tahap ? prosesHTML(p) : ''}
        <p class="hindari"><strong>Hindari:</strong> ${p.hindari}</p>
        <p style="margin-top:14px"><button type="button" class="simpan-ide" data-simpan="${p.id}" aria-pressed="false">＋ Aku mau coba</button></p>
      </div>
    </article>`).join('');

  $$('.proses').forEach(pasangProses);

  // filter "saya punya…": kosong = tampilkan semua
  const dipilih = new Set();
  $('#filter-diy').innerHTML = `<span class="label-filter">Saya punya:</span>` +
    JN.BAHAN_DIY.map(([id, n]) => `<button type="button" aria-pressed="false" data-bahan="${id}">${n}</button>`).join('');
  function gambarDIY() {
    const hasil = JN.DIY.filter(d => !dipilih.size || d.bahan.some(b => dipilih.has(b)));
    $('#info-diy').textContent = dipilih.size ? `${hasil.length} ide cocok dengan bahanmu.` : `Menampilkan semua ${hasil.length} ide.`;
    $('#daftar-diy').innerHTML = hasil.map(d => `
      <article class="kartu-isi kertas selotip" id="${d.id}">${svg(d.ikon, '', 'ilus')}
        <h3>${d.judul}</h3>
        <div class="meta"><span>Kesulitan: ${d.tingkat}</span><span>Waktu: ${d.waktu}</span></div>
        <details><summary>Lihat ${d.langkah.length} langkah</summary><ol>${d.langkah.map(l => `<li>${l}</li>`).join('')}</ol></details>
        <button type="button" class="simpan-ide" data-simpan="${d.id}" aria-pressed="false">＋ Aku mau coba</button>
      </article>`).join('');
    sinkronSimpan();
  }
  // "Aku mau coba" = aksi jejak langkah Olah: ide yang dipilih masuk ke Kartu Jejak-ku sebagai rencana
  function sinkronSimpan() {
    const tersimpan = JN.jejak.data().olah.simpan;
    $$('[data-simpan]').forEach(b => {
      const on = tersimpan.includes(b.dataset.simpan);
      b.setAttribute('aria-pressed', on);
      b.disabled = false;
      b.textContent = on ? '✓ Masuk rencanaku' : '＋ Aku mau coba';
    });
  }
  document.addEventListener('jejakberubah', sinkronSimpan);
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-simpan]'); if (!b) return;
    const id = b.dataset.simpan;
    JN.jejak.ubah(d => { d.olah.simpan = d.olah.simpan.includes(id) ? d.olah.simpan.filter(x => x !== id) : [...d.olah.simpan, id]; });
    sinkronSimpan();
  });
  $$('[data-bahan]').forEach(b => b.addEventListener('click', () => {
    const on = b.getAttribute('aria-pressed') !== 'true';
    b.setAttribute('aria-pressed', on);
    on ? dipilih.add(b.dataset.bahan) : dipilih.delete(b.dataset.bahan);
    gambarDIY();
  }));
  gambarDIY();
  // tautan dari Beranda (olah.html#pot-botol) dibuka setelah kartu dibuat
  if (location.hash) { const t = document.getElementById(location.hash.slice(1)); if (t) { t.scrollIntoView(); const d = t.querySelector('details'); if (d) d.open = true; } }

  $('#daftar-mitos').innerHTML = JN.MITOS.map(m => `
    <article class="kertas selotip"><span class="lbl salah">Mitos</span><p class="m">${m.mitos}</p>
      <span class="lbl">Fakta</span><p>${m.fakta}</p>
      <span class="isi-sumber${m.sumber === 'ISI' ? ' belum' : ''}">Sumber: ${m.sumber === 'ISI' ? 'ISI sebelum submit' : m.sumber}</span></article>`).join('');
};

/* ---------- "Lihat prosesnya": slider waktu yang mengubah gambar wadah ----------
   Setiap elemen gambar punya kelas; tampilannya per tahap diatur CSS lewat .proses[data-tahap]. */
const GAMBAR_PROSES = {
  kompos: `<svg class="proses-gbr" viewBox="0 0 220 200" aria-hidden="true">
    <defs><clipPath id="klip-kompos"><path d="M50 44 H170 L159 180 H61 Z"/></clipPath></defs>
    <g clip-path="url(#klip-kompos)">
      <rect class="k-tanah" x="40" y="156" width="140" height="30" fill="#7A5534"/>
      <g class="k-sisa">
        <circle cx="78" cy="132" r="12" fill="#7CB342"/><rect x="96" y="122" width="24" height="15" rx="4" fill="#F2A33A"/>
        <circle cx="138" cy="134" r="11" fill="#E05A47"/><circle cx="104" cy="148" r="9" fill="#F5D04C"/>
        <rect x="120" y="142" width="20" height="11" rx="3" fill="#8BC34A"/><path d="M66 150 q10 -14 22 -4 q-10 12 -22 4z" fill="#5E9E3A"/>
      </g>
      <rect class="k-matang" x="40" y="60" width="140" height="130" fill="#3B2A1C"/>
      <g class="k-butir" fill="#5A4030"><circle cx="70" cy="120" r="2.5"/><circle cx="96" cy="108" r="2"/><circle cx="120" cy="126" r="2.5"/><circle cx="146" cy="112" r="2"/><circle cx="84" cy="150" r="2"/><circle cx="132" cy="156" r="2.5"/></g>
      <g class="k-daun"><rect x="40" y="100" width="140" height="16" fill="#C9A26B"/><path d="M52 108 h18 M82 104 h14 M108 110 h20 M140 105 h16" stroke="#8A6A3C" stroke-width="3" stroke-linecap="round"/></g>
    </g>
    <path d="M50 44 H170 L159 180 H61 Z" fill="none" stroke="#1B1712" stroke-width="5" stroke-linejoin="round"/>
    <rect x="42" y="34" width="136" height="12" rx="4" fill="#1B1712"/>
    <g fill="#1B1712"><circle cx="78" cy="172" r="3.5"/><circle cx="110" cy="175" r="3.5"/><circle cx="142" cy="172" r="3.5"/></g>
    <g class="k-uap" fill="none" stroke="#8A7B66" stroke-width="3" stroke-linecap="round">
      <path d="M86 26 q-6 -8 0 -16 q6 -8 0 -14"/><path d="M110 24 q-6 -8 0 -16 q6 -8 0 -14"/><path d="M134 26 q-6 -8 0 -16 q6 -8 0 -14"/></g>
    <g class="k-tunas"><path d="M110 92 V66" stroke="#2E8B57" stroke-width="4" stroke-linecap="round"/>
      <path d="M110 74 q-18 -2 -22 -16 q16 0 22 16z M110 70 q16 -4 22 -18 q-16 2 -22 18z" fill="#2E8B57"/></g>
  </svg>`,
  eco: `<svg class="proses-gbr" viewBox="0 0 220 200" aria-hidden="true">
    <defs><clipPath id="klip-eco"><rect x="58" y="52" width="104" height="132" rx="14"/></clipPath></defs>
    <g clip-path="url(#klip-eco)">
      <rect class="e-cairan" x="50" y="78" width="120" height="120"/>
      <g class="e-kulit"><path d="M72 84 q14 -10 28 0 q-14 8 -28 0z" fill="#F2A33A"/><path d="M108 88 q12 -12 26 -2 q-12 10 -26 2z" fill="#F5D04C"/>
        <path d="M138 82 q10 -8 18 2 q-10 6 -18 -2z" fill="#7CB342"/><path d="M90 96 q10 -6 18 2 q-10 6 -18 -2z" fill="#E05A47"/></g>
      <g class="e-gelembung" fill="none" stroke="#FBF7EE" stroke-width="2.5">
        <circle cx="80" cy="170" r="5"/><circle cx="104" cy="160" r="4"/><circle cx="128" cy="172" r="6"/><circle cx="146" cy="150" r="4"/><circle cx="92" cy="140" r="3.5"/></g>
    </g>
    <rect x="58" y="52" width="104" height="132" rx="14" fill="none" stroke="#1B1712" stroke-width="5"/>
    <rect class="e-label" x="78" y="118" width="64" height="26" rx="5" fill="#FBF7EE" stroke="#1B1712" stroke-width="3"/>
    <text class="e-teks-awal" x="110" y="136" text-anchor="middle" font-family="Space Mono, monospace" font-size="12" font-weight="700" fill="#1B1712">1 : 3 : 10</text>
    <text class="e-teks-siap" x="110" y="137" text-anchor="middle" font-family="Archivo, sans-serif" font-size="15" font-weight="900" fill="#2E8B57">SIAP ✓</text>
    <g class="e-tutup"><rect x="62" y="36" width="96" height="18" rx="5" fill="#1B1712"/></g>
    <g class="e-gas" fill="none" stroke="#8A7B66" stroke-width="3" stroke-linecap="round">
      <path d="M150 30 q10 -6 18 -2"/><path d="M152 22 q12 -10 24 -6"/><path d="M70 30 q-10 -6 -18 -2"/></g>
  </svg>`
};
function prosesHTML(p) {
  /* ringkas: gambar kecil di kiri; label, teks, dan slider di kanan */
  return `<div class="proses" data-tahap="0" data-jenis="${p.proses}" title="${p.satuan} perkiraan, bisa lebih cepat atau lambat tergantung cuaca dan bahan">
    ${GAMBAR_PROSES[p.proses]}
    <div class="proses-kanan">
      <div class="proses-atas"><span class="proses-tajuk">Lihat prosesnya · <span class="proses-kapan"></span></span>
        <button type="button" class="proses-putar" aria-pressed="false" aria-label="Putar prosesnya">▶</button></div>
      <div class="proses-teks" aria-live="polite"><b class="proses-judul"></b><p class="proses-ket"></p></div>
      <label class="sr" for="geser-${p.id}">${p.satuan} (perkiraan)</label>
      <input type="range" class="proses-geser" id="geser-${p.id}" min="0" max="${p.tahap.length - 1}" step="1" value="0">
      <div class="proses-label">${p.tahap.map((t, i) => `<button type="button" data-ke="${i}">${t.kapan}</button>`).join('')}</div>
    </div>
  </div>`;
}
function pasangProses(el) {
  const { $, $$ } = JN;
  const p = JN.PANDUAN.find(x => x.id === el.closest('article').id);
  const geser = $('.proses-geser', el), putar = $('.proses-putar', el), akhir = p.tahap.length - 1;
  let jalan = null;
  function atur(i) {
    const t = p.tahap[i];
    el.dataset.tahap = i; geser.value = i;
    geser.setAttribute('aria-valuetext', `${t.kapan}: ${t.judul}`);
    el.style.setProperty('--isi', `${(i / akhir) * 100}%`);
    $('.proses-kapan', el).textContent = t.kapan;
    $('.proses-judul', el).textContent = t.judul;
    $('.proses-ket', el).textContent = t.isi;
    $$('.proses-label button', el).forEach((b, k) => b.setAttribute('aria-pressed', k === i));
  }
  function henti() { clearInterval(jalan); jalan = null; putar.textContent = '▶'; putar.setAttribute('aria-pressed', 'false'); }
  geser.addEventListener('input', () => { henti(); atur(Number(geser.value)); });
  $$('.proses-label button', el).forEach(b => b.addEventListener('click', () => { henti(); atur(Number(b.dataset.ke)); }));
  putar.addEventListener('click', () => {
    if (jalan) return henti();
    let i = Number(geser.value) >= akhir ? 0 : Number(geser.value);
    atur(i);
    putar.textContent = '❚❚'; putar.setAttribute('aria-pressed', 'true');
    jalan = setInterval(() => { i++; atur(i); if (i >= akhir) henti(); }, 2200);
  });
  atur(0);
}
