/* Kartu Jejak-ku: akhir perjalanan. Kartu digambar ulang ke <canvas> 1080×1920 supaya bisa diunduh
   atau dibagikan langsung sebagai gambar, tanpa library dan tanpa tangkapan layar. */
JN.mulai = () => {
  const { $ } = JN;
  const nama = $('#nama-jejak'), info = $('#info-unduh'), tUnduh = $('#unduh-kartu'), tBagi = $('#bagikan-kartu');
  nama.value = JN.jejak.data().nama;
  nama.addEventListener('input', () => JN.jejak.ubah(d => { d.nama = nama.value.trim(); }));

  // judul dan ajakan mengikuti jumlah jejak
  const asli = JN.jejak.tampilkan.bind(JN.jejak);
  JN.jejak.tampilkan = () => {
    asli();
    const st = JN.jejak.status(), n = JN.jejak.jumlah(st), b = JN.jejak.berikut(st);
    $('#judul-kartu').innerHTML = n === 4 ? 'Perjalananmu <mark class="stabilo">selesai!</mark>' : `Kartu Jejak-ku: <mark class="stabilo">${n} dari 4</mark>`;
    $('#teks-kartu').innerHTML = n === 4
      ? 'Setelah menyelesaikan keempat langkah, kamu mendapat rangkuman semua aksi nyatamu di Jejak Nol. Unduh, lalu bagikan supaya keluarga dan temanmu ikut.'
      : n === 0
        ? 'Setelah melengkapi langkah-langkah Jejak Nol, kamu akan mendapat rangkuman aksi dan alasan untuk berbagi. Mulai dari <a class="tautan-lanjut" href="pilah.html">Langkah 1: Pilah →</a>'
        : `Sudah ${n} dari 4 langkah tercatat. Masih ada ${4 - n} langkah lagi (<a class="tautan-lanjut" href="${b.url}">${b.nama} →</a>), atau kamu tetap bisa mengunduh kartu rangkumanmu sekarang.`;
  };

  let yakin = false;
  $('#hapus-jejak').addEventListener('click', e => {
    if (!yakin) { yakin = true; e.target.textContent = 'Yakin? Klik sekali lagi untuk menghapus semua jejak'; return; }
    JN.jejak.hapus(); nama.value = ''; yakin = false; e.target.textContent = 'Hapus jejak dan mulai dari awal';
  });

  /* ---------- menggambar kartu ke canvas ---------- */
  const W = 1080, H = 1920, M = 90;
  function bungkus(ctx, teks, maks) {
    const kata = teks.split(' '), baris = []; let isi = '';
    kata.forEach(k => { const coba = isi ? isi + ' ' + k : k; if (ctx.measureText(coba).width > maks && isi) { baris.push(isi); isi = k; } else isi = coba; });
    if (isi) baris.push(isi);
    return baris;
  }
  function gambarKardi() {
    // SVG Kardi berdiri sendiri: hanya ekspresi senang yang tampil (tidak ada CSS di dalam gambar)
    const s = JN.kardiSVG(false, '')
      .replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="278" ')
      .replace(/<g class="eks eks-(\w+)">/g, (m, n) => n === 'senang' ? '<g>' : '<g style="display:none">');
    return new Promise(ok => { const img = new Image(); img.onload = () => ok(img); img.onerror = () => ok(null); img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(s); });
  }
  async function buatGambar() {
    await Promise.all(['900 60px Archivo', '400 60px "Permanent Marker"', '600 34px "Plus Jakarta Sans"', '800 34px "Plus Jakarta Sans"', '700 28px "Space Mono"']
      .map(f => document.fonts.load(f).catch(() => null)));
    const d = JN.jejak.data(), st = JN.jejak.status(d), n = JN.jejak.jumlah(st);
    const isi = JN.isiKartuJejak(d), total = isi.total;
    const c = document.createElement('canvas'); c.width = W; c.height = H;
    const ctx = c.getContext('2d');
    if ('fontStretch' in ctx) ctx.fontStretch = 'condensed';

    // latar kardus bergaris
    ctx.fillStyle = '#C7A06A'; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = 'rgba(60,35,10,.06)'; for (let x = 0; x < W; x += 14) ctx.fillRect(x, 0, 3, H);
    // kertas utama
    ctx.fillStyle = '#1B1712'; roundRect(ctx, M, 150 + 10, W - M * 2, H - 330, 36); ctx.fill();
    ctx.fillStyle = '#FBF7EE'; roundRect(ctx, M, 150, W - M * 2, H - 330, 36); ctx.fill();
    ctx.lineWidth = 6; ctx.strokeStyle = '#1B1712'; ctx.stroke();
    // selotip
    ctx.save(); ctx.translate(W / 2, 150); ctx.rotate(-0.05); ctx.fillStyle = 'rgba(236,220,180,.95)'; ctx.fillRect(-110, -24, 220, 48); ctx.restore();

    const X = M + 60, LEBAR = W - M * 2 - 120; let y = 260;
    // logo + cap
    ctx.font = '900 56px Archivo'; const lebarLogo = ctx.measureText('JEJAK NOL').width + 36;
    ctx.fillStyle = '#1B1712'; roundRect(ctx, X, y - 52, lebarLogo, 72, 8); ctx.fill();
    ctx.fillStyle = '#FBF7EE'; ctx.fillText('JEJAK', X + 18, y + 4); ctx.fillStyle = '#F2C230'; ctx.fillText('NOL', X + 18 + ctx.measureText('JEJAK ').width, y + 4);
    ctx.save(); ctx.translate(W - M - 170, y - 14); ctx.rotate(0.12);
    ctx.font = '900 44px Archivo'; const cap = n === 4 ? 'LENGKAP' : `${n}/4 JEJAK`; const lc = ctx.measureText(cap).width + 32;
    ctx.strokeStyle = '#A8231B'; ctx.lineWidth = 5; ctx.strokeRect(-lc / 2, -36, lc, 66); ctx.lineWidth = 2; ctx.strokeRect(-lc / 2 + 7, -29, lc - 14, 52);
    ctx.fillStyle = '#A8231B'; ctx.textAlign = 'center'; ctx.fillText(cap, 0, 12); ctx.restore(); ctx.textAlign = 'left';

    // nama
    y += 120; ctx.fillStyle = '#1B1712'; ctx.font = '400 64px "Permanent Marker"';
    bungkus(ctx, isi.judul, LEBAR).forEach(b => { ctx.fillText(b, X, y); y += 76; });
    y += 30;

    // empat baris langkah (maks 2 baris per langkah agar area total & Kardi di bawah selalu lega)
    JN.LANGKAH.forEach(l => {
      const sudah = st[l.id], warna = getComputedStyle(document.documentElement).getPropertyValue(l.warna.slice(4, -1)).trim() || '#1B1712';
      ctx.globalAlpha = sudah ? 1 : 0.45;
      ctx.beginPath(); ctx.arc(X + 18, y - 14, 18, 0, Math.PI * 2);
      ctx.fillStyle = sudah ? warna : '#FBF7EE'; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = '#1B1712'; ctx.stroke();
      ctx.fillStyle = '#1B1712'; ctx.font = '900 44px Archivo'; ctx.fillText(l.nama.toUpperCase(), X + 56, y);
      y += 46; ctx.font = '600 32px "Plus Jakarta Sans"'; ctx.fillStyle = '#4A3E2E';
      const barisTeks = bungkus(ctx, sudah ? isi.baris[l.id] : 'Belum diselesaikan.', LEBAR - 56);
      barisTeks.slice(0, 2).forEach((b, idx) => {
        const teksBaris = idx === 1 && barisTeks.length > 2 ? b.replace(/\s+\S*$/, '') + '…' : b;
        ctx.fillText(teksBaris, X + 56, y); y += 42;
      });
      y += 28; ctx.globalAlpha = 1;
    });

    // total (diletakkan aman di kiri Kardi dan di dalam batas kertas bawah)
    if (total) {
      const yGaris = Math.min(y, 1380);
      ctx.setLineDash([14, 12]); ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(27,23,18,.4)';
      ctx.beginPath(); ctx.moveTo(X, yGaris); ctx.lineTo(X + LEBAR, yGaris); ctx.stroke(); ctx.setLineDash([]);
      let yTotal = yGaris + 150;
      ctx.fillStyle = '#A8231B'; ctx.font = '900 160px Archivo'; ctx.fillText(JN.fmt(total), X, yTotal, LEBAR - 340);
      yTotal += 54; ctx.fillStyle = '#1B1712'; ctx.font = '800 33px "Plus Jakarta Sans"';
      bungkus(ctx, 'barang sekali pakai per tahun tidak jadi sampah', LEBAR - 340).forEach(b => { ctx.fillText(b, X, yTotal); yTotal += 42; });
    }

    // Kardi + kaki kartu
    const kardi = await gambarKardi();
    if (kardi) ctx.drawImage(kardi, W - M - 330, H - 180 - 300, 300, 278);
    ctx.fillStyle = '#1B1712'; ctx.font = '700 30px "Space Mono"'; ctx.textAlign = 'center';
    ctx.fillText('Pilah · Kurangi · Olah · Setor', W / 2, H - 92); ctx.textAlign = 'left';
    return c;
  }
  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
  }
  const keBlob = c => new Promise(ok => c.toBlob(ok, 'image/png'));
  const namaFile = () => 'kartu-jejak-' + (JN.jejak.data().nama || 'aku').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '.png';

  tUnduh.addEventListener('click', async () => {
    tUnduh.disabled = true; tUnduh.textContent = 'Menyiapkan gambar…';
    try {
      const blob = await keBlob(await buatGambar());
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = namaFile();
      document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 4000);
      info.textContent = 'Gambar sudah diunduh. Cek folder Unduhan di perangkatmu.';
      JN.eks('senang', 1800); JN.lompat();
    } catch (e) {
      info.textContent = 'Gambar belum bisa dibuat di browser ini. Coba tangkap layar kartunya.';
    }
    tUnduh.disabled = false; tUnduh.textContent = 'Unduh gambar';
  });

  // Bagikan langsung (HP): hanya muncul di browser yang bisa membagikan file gambar
  const bisaBagi = !!(navigator.canShare && navigator.canShare({ files: [new File([''], 'x.png', { type: 'image/png' })] }));
  tBagi.hidden = !bisaBagi;
  tBagi.addEventListener('click', async () => {
    try {
      const blob = await keBlob(await buatGambar());
      await navigator.share({ files: [new File([blob], namaFile(), { type: 'image/png' })], title: 'Kartu Jejak-ku', text: 'Aku sudah meninggalkan jejak di Jejak Nol. Kamu juga, yuk!' });
    } catch (e) { if (e.name !== 'AbortError') info.textContent = 'Gagal membagikan. Coba unduh gambarnya dulu.'; }
  });

  JN.buatGambarKartu = buatGambar; // untuk pengujian
};
