/* Pilah: jelajah ruangan, empat tong interaktif, kode plastik ramah awam. */
JN.mulai = () => {
  const { $, $$, svg, KAT, byId } = JN;
  JN.pasangJelajah($('#jelajah'));

  $('#kartu-tong').innerHTML = Object.entries(KAT).map(([k, t]) => {
    const contoh = JN.BARANG.filter(b => b.kat === k);
    return `<article class="kartu-tong${k === 'anorganik' ? '' : ' putih-teks'}" style="--w:${t.warna}">
      <div class="kepala-tong"><b>${t.nama}</b><span>${t.ke}</span></div>
      <div class="badan-tong">
        <p>${t.isi}</p>
        <p class="tong-petunjuk">Klik salah satu barang untuk melihat cara buangnya:</p>
        <div class="contoh">${contoh.map(b => `<button type="button" class="item-tong" data-tong-item="${b.id}" aria-pressed="false">${svg(b.ikon)}${b.nama}</button>`).join('')}</div>
        <div class="tong-detail" hidden aria-live="polite"></div>
      </div>
    </article>`;
  }).join('');

  $$('#kartu-tong [data-tong-item]').forEach(btn => {
    btn.addEventListener('click', () => {
      const kartu = btn.closest('.kartu-tong'), detail = $('.tong-detail', kartu);
      const sama = btn.getAttribute('aria-pressed') === 'true';
      $$('[data-tong-item]', kartu).forEach(x => x.setAttribute('aria-pressed', 'false'));
      if (sama) { detail.hidden = true; return; }

      btn.setAttribute('aria-pressed', 'true');
      const b = byId[btn.dataset.tongItem];
      if (!b) return;
      detail.hidden = false;
      detail.innerHTML = `
        <strong>${b.nama}</strong>
        <ol>${b.langkah.map(l => `<li>${l}</li>`).join('')}</ol>
        <p><b>Pengganti:</b> ${b.alt}</p>`;
      JN.jejak.ubah(d => { if (!d.pilah.dilihat.includes(b.id)) d.pilah.dilihat.push(b.id); });
    });
  });

  const segitiga = n => `<svg class="segitiga" viewBox="0 0 60 60" role="img" aria-label="Kode plastik ${n}">
    <path d="M30 6 L54 50 H6 Z" fill="none" stroke="#1B1712" stroke-width="4" stroke-linejoin="round" stroke-dasharray="20 6"/>
    <text x="30" y="42" text-anchor="middle" font-family="Archivo, sans-serif" font-weight="900" font-size="22" fill="#1B1712">${n}</text></svg>`;
  $('#daftar-plastik').innerHTML = JN.PLASTIK.map(p => `<article>
      ${segitiga(p.kode)}<b>${p.nama}</b>
      <p><b>Sering ada di:</b> ${p.awam || p.contoh}.</p>
      <small class="nama-kimia">Istilah kemasan: ${p.lengkap}</small>
      <span class="chip st st-${p.status}">${JN.STATUS_PLASTIK[p.status]}</span>
    </article>`).join('');
};
