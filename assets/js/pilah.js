/* Pilah: jelajah ruangan, empat tong, kode plastik. */
JN.mulai = () => {
  const { $, svg, KAT } = JN;
  JN.pasangJelajah($('#jelajah'));

  $('#kartu-tong').innerHTML = Object.entries(KAT).map(([k, t]) => {
    const contoh = JN.BARANG.filter(b => b.kat === k);
    return `<article class="kartu-tong${k === 'anorganik' ? '' : ' putih-teks'}" style="--w:${t.warna}">
      <div class="kepala-tong"><b>${t.nama}</b><span>${t.ke}</span></div>
      <div class="badan-tong">
        <p>${t.isi}</p>
        <div class="contoh">${contoh.map(b => `<span>${svg(b.ikon)}${b.nama}</span>`).join('')}</div>
      </div>
    </article>`;
  }).join('');

  const segitiga = n => `<svg class="segitiga" viewBox="0 0 60 60" role="img" aria-label="Kode plastik ${n}">
    <path d="M30 6 L54 50 H6 Z" fill="none" stroke="#1B1712" stroke-width="4" stroke-linejoin="round" stroke-dasharray="20 6"/>
    <text x="30" y="42" text-anchor="middle" font-family="Archivo, sans-serif" font-weight="900" font-size="22" fill="#1B1712">${n}</text></svg>`;
  $('#daftar-plastik').innerHTML = JN.PLASTIK.map(p => `<article>
      ${segitiga(p.kode)}<b>${p.nama}</b><p>${p.lengkap}. Contoh: ${p.contoh}.</p>
      <span class="chip st st-${p.status}">${JN.STATUS_PLASTIK[p.status]}</span>
    </article>`).join('');
};
