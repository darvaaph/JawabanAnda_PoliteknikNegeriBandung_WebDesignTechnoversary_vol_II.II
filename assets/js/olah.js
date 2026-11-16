/* Olah: panduan langkah demi langkah, galeri DIY dengan filter bahan, mitos vs fakta. */
JN.mulai = () => {
  const { $, $$, svg } = JN;

  $('#daftar-panduan').innerHTML = JN.PANDUAN.map(p => `
    <article class="panduan kertas selotip" id="${p.id}">
      ${svg(p.ikon, '', 'ilus')}
      <div>
        <h3>${p.judul}</h3>
        <div class="meta" style="margin-top:8px"><span>${p.tingkat}</span><span>${p.waktu}</span></div>
        <div class="kolom">
          <div><h4>Bahan</h4><ul>${p.bahan.map(b => `<li>${b}</li>`).join('')}</ul></div>
          <div><h4>Langkah</h4><ol>${p.langkah.map(l => `<li>${l}</li>`).join('')}</ol></div>
        </div>
        <p class="hindari"><strong>Hindari:</strong> ${p.hindari}</p>
        <p style="margin-top:14px"><button type="button" class="simpan-ide" data-simpan="${p.id}" aria-pressed="false">Simpan ide ini</button></p>
      </div>
    </article>`).join('');

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
        <div class="meta"><span>${d.tingkat}</span><span>${d.waktu}</span></div>
        <details><summary>Lihat ${d.langkah.length} langkah</summary><ol>${d.langkah.map(l => `<li>${l}</li>`).join('')}</ol></details>
        <button type="button" class="simpan-ide" data-simpan="${d.id}" aria-pressed="false">Simpan ide ini</button>
      </article>`).join('');
    sinkronSimpan();
  }
  // "Simpan ide ini" = aksi jejak langkah Olah; ide yang disimpan masuk ke Kartu Jejak-ku
  function sinkronSimpan() {
    const tersimpan = JN.jejak.data().olah.simpan;
    $$('[data-simpan]').forEach(b => {
      const on = tersimpan.includes(b.dataset.simpan);
      b.setAttribute('aria-pressed', on);
      b.disabled = false;
      b.textContent = on ? '✓ Tersimpan' : 'Simpan ide ini';
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
