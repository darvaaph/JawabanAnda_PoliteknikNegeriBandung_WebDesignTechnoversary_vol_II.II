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
  function gambarIkon(n) {
    const s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="120" height="120">${JN.IKON[n] || ''}</svg>`;
    return new Promise(ok => { const img = new Image(); img.onload = () => ok(img); img.onerror = () => ok(null); img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(s); });
  }
  async function buatGambar() {
    await Promise.all(['900 60px Archivo', '400 60px "Permanent Marker"', '600 34px "Plus Jakarta Sans"', '800 34px "Plus Jakarta Sans"', '700 28px "Space Mono"', '400 24px "Space Mono"']
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

    const TINTA = '#1B1712';
    // nama + gelar (pita stabilo kuning)
    y += 130; ctx.fillStyle = TINTA; ctx.font = '400 80px "Permanent Marker"'; ctx.fillText(isi.nama, X, y, LEBAR);
    y += 42; ctx.font = '900 58px Archivo';
    const teksGelar = isi.gelar.toUpperCase(), lebarGelar = Math.min(LEBAR, ctx.measureText(teksGelar).width + 44);
    ctx.save(); ctx.translate(X, y); ctx.rotate(-0.025);
    ctx.fillStyle = TINTA; roundRect(ctx, 8, 8, lebarGelar, 80, 10); ctx.fill();
    ctx.fillStyle = '#F2C230'; roundRect(ctx, 0, 0, lebarGelar, 80, 10); ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = TINTA; ctx.stroke();
    ctx.fillStyle = TINTA; ctx.fillText(teksGelar, 22, 60, lebarGelar - 44); ctx.restore();

    // empat stempel langkah
    const R = 86, D = R * 2, jarak = (LEBAR - D * 4) / 3, cy = y + 88 + 70 + R;
    isi.stempel.forEach((s, i) => {
      const cx = X + R + i * (D + jarak);
      const warna = getComputedStyle(document.documentElement).getPropertyValue(s.l.warna.slice(4, -1)).trim() || TINTA;
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(s.putar * Math.PI / 180);
      if (s.sudah) {
        ctx.beginPath(); ctx.arc(0, 0, R + 6, 0, Math.PI * 2); ctx.fillStyle = TINTA; ctx.fill();
        ctx.beginPath(); ctx.arc(0, 0, R, 0, Math.PI * 2); ctx.fillStyle = warna; ctx.fill();
        ctx.beginPath(); ctx.arc(0, 0, R - 14, 0, Math.PI * 2); ctx.fillStyle = '#FBF7EE'; ctx.fill();
        ctx.setLineDash([8, 7]); ctx.lineWidth = 2.5; ctx.strokeStyle = 'rgba(27,23,18,.45)';
        ctx.beginPath(); ctx.arc(0, 0, R - 24, 0, Math.PI * 2); ctx.stroke(); ctx.setLineDash([]);
      } else {
        ctx.globalAlpha = 0.45; ctx.setLineDash([12, 9]); ctx.lineWidth = 4; ctx.strokeStyle = TINTA;
        ctx.beginPath(); ctx.arc(0, 0, R, 0, Math.PI * 2); ctx.stroke(); ctx.setLineDash([]);
      }
      ctx.textAlign = 'center'; ctx.fillStyle = TINTA;
      ctx.font = '900 34px Archivo'; ctx.fillText(s.l.nama.toUpperCase(), 0, 4, D - 72);
      ctx.font = '700 22px "Space Mono"'; ctx.fillStyle = '#4A3E2E'; ctx.fillText((s.sudah ? (s.tgl || '✓') : 'belum').toUpperCase(), 0, 40);
      ctx.restore();
      // keterangan singkat di bawah stempel (maks 2 baris)
      ctx.save(); ctx.globalAlpha = s.sudah ? 1 : 0.5; ctx.textAlign = 'center'; ctx.fillStyle = TINTA; ctx.font = '800 26px "Plus Jakarta Sans"';
      bungkus(ctx, s.sudah ? s.ket : 'Belum', D + jarak - 8).slice(0, 2).forEach((b, k) => ctx.fillText(b, cx, cy + R + 52 + k * 34));
      ctx.restore();
    });
    const garisPutus = yy => {
      ctx.setLineDash([14, 12]); ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(27,23,18,.4)';
      ctx.beginPath(); ctx.moveTo(X, yy); ctx.lineTo(X + LEBAR, yy); ctx.stroke(); ctx.setLineDash([]);
    };
    const sub = (teks, yy) => { ctx.fillStyle = '#A8231B'; ctx.font = '700 26px "Space Mono"'; ctx.fillText(teks.toUpperCase().split('').join(String.fromCharCode(8202)), X, yy); };
    const ATAS = cy + R + 52 + 34 + 46, BAWAH = 1385; // area Aksi-ku; blok bawah mulai di BAWAH
    garisPutus(ATAS);

    // Aksi-ku: ikon dalam lingkaran warna langkah + teks maks 2 baris; diletakkan di tengah area
    if (isi.aksi.length) {
      ctx.font = '800 31px "Plus Jakarta Sans"';
      const baris = isi.aksi.map(a => bungkus(ctx, a.teks, LEBAR - 104).slice(0, 2));
      const tinggi = baris.map(b => Math.max(76, b.length * 40)), SELA = 20;
      const total2 = 52 + tinggi.reduce((s, t) => s + t + SELA, 0) - SELA;
      let ya = ATAS + Math.max(40, (BAWAH - ATAS - total2) / 2);
      sub('Aksi-ku', ya + 20); ya += 52;
      const gb = await Promise.all(isi.aksi.map(a => gambarIkon(a.ikon)));
      isi.aksi.forEach((a, i) => {
        const warna = getComputedStyle(document.documentElement).getPropertyValue(a.l.warna.slice(4, -1)).trim() || TINTA;
        const tengah = ya + tinggi[i] / 2;
        ctx.beginPath(); ctx.arc(X + 38, tengah, 38, 0, Math.PI * 2); ctx.fillStyle = warna; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = TINTA; ctx.stroke();
        ctx.beginPath(); ctx.arc(X + 38, tengah, 29, 0, Math.PI * 2); ctx.fillStyle = '#FBF7EE'; ctx.fill();
        if (gb[i]) ctx.drawImage(gb[i], X + 38 - 25, tengah - 25, 50, 50);
        ctx.fillStyle = TINTA; ctx.font = '800 31px "Plus Jakarta Sans"';
        const awal = tengah - (baris[i].length * 40) / 2 + 30;
        baris[i].forEach((b, k) => ctx.fillText(b, X + 104, awal + k * 40));
        ya += tinggi[i] + SELA;
      });
    }
    garisPutus(BAWAH);

    // blok bawah (kiri Kardi): total + ikon bila ada janji, kalau belum ada: ilustrasi 4 tong pilah
    const KANAN = W - M - 260; // batas kiri Kardi
    if (total) {
      ctx.fillStyle = '#A8231B'; ctx.font = '900 140px Archivo'; const teksTotal = JN.fmt(total);
      const lebarTotal = Math.min(ctx.measureText(teksTotal).width, 420); ctx.fillText(teksTotal, X, BAWAH + 150, 420);
      // ikon di kanan angka, 2 baris, satuan dipilih supaya muat
      const UK = 50, SL = 8, x0 = X + lebarTotal + 36, kolom = Math.max(1, Math.floor((KANAN - x0 + SL) / (UK + SL)));
      const jml = u => isi.ikon.reduce((s, x) => s + Math.max(1, Math.round(x.dicegah / u)), 0);
      const satuan = [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000, 5000].find(u => jml(u) <= kolom * 2) || 10000;
      const gb = await Promise.all(isi.ikon.map(x => gambarIkon(x.ikon)));
      let k = 0;
      isi.ikon.forEach((x, j) => {
        for (let m = 0; m < Math.max(1, Math.round(x.dicegah / satuan)) && k < kolom * 2; m++, k++) {
          if (gb[j]) ctx.drawImage(gb[j], x0 + (k % kolom) * (UK + SL), BAWAH + 36 + Math.floor(k / kolom) * (UK + SL), UK, UK);
        }
      });
      let yt = BAWAH + 205; ctx.fillStyle = TINTA; ctx.font = '800 32px "Plus Jakarta Sans"';
      bungkus(ctx, 'barang sekali pakai per tahun tidak jadi sampah', KANAN - X - 20).forEach(b => { ctx.fillText(b, X, yt); yt += 40; });
      ctx.fillStyle = '#4A3E2E'; ctx.font = '700 24px "Space Mono"';
      if (isi.perMinggu) { ctx.fillText(`≈ ${JN.fmt(isi.perMinggu)} barang setiap minggu`, X, yt + 8); yt += 36; }
      ctx.font = '400 22px "Space Mono"'; ctx.fillText(`1 ikon = ${JN.fmt(satuan)} barang`, X, yt + 8);
    } else {
      sub(JN.TONG_KARTU_JUDUL, BAWAH + 52);
      const gb = await Promise.all(isi.tong.map(t => gambarIkon(t.ikon)));
      const LB = 124, SL = 22, yTutup = BAWAH + 86;
      isi.tong.forEach((t, i) => {
        const x = X + i * (LB + SL), warna = getComputedStyle(document.documentElement).getPropertyValue(t.warna.slice(4, -1)).trim() || TINTA;
        // badan tong (trapesium) + tutup + pegangan
        ctx.beginPath(); ctx.moveTo(x, yTutup + 26); ctx.lineTo(x + LB, yTutup + 26); ctx.lineTo(x + LB - 10, yTutup + 188); ctx.lineTo(x + 10, yTutup + 188); ctx.closePath();
        ctx.fillStyle = warna; ctx.fill(); ctx.lineWidth = 5; ctx.strokeStyle = TINTA; ctx.lineJoin = 'round'; ctx.stroke();
        ctx.fillStyle = 'rgba(255,255,255,.25)'; ctx.fillRect(x + 16, yTutup + 38, 9, 120);
        ctx.fillStyle = TINTA; roundRect(ctx, x - 8, yTutup, LB + 16, 28, 8); ctx.fill();
        roundRect(ctx, x + LB / 2 - 22, yTutup - 14, 44, 16, 6); ctx.fill();
        // ikon dalam lingkaran putih + nama tong
        ctx.beginPath(); ctx.arc(x + LB / 2, yTutup + 84, 34, 0, Math.PI * 2); ctx.fillStyle = '#FBF7EE'; ctx.fill(); ctx.lineWidth = 4; ctx.stroke();
        if (gb[i]) ctx.drawImage(gb[i], x + LB / 2 - 24, yTutup + 60, 48, 48);
        ctx.fillStyle = '#FBF7EE'; roundRect(ctx, x + 12, yTutup + 132, LB - 24, 36, 6); ctx.fill();
        ctx.fillStyle = TINTA; ctx.textAlign = 'center';
        ctx.font = '900 24px Archivo'; ctx.fillText(t.nama.toUpperCase(), x + LB / 2, yTutup + 158, LB - 32);
        // tujuan tong di bawahnya
        ctx.font = '700 18px "Space Mono"'; ctx.fillText('→ ' + t.ke, x + LB / 2, yTutup + 222, LB + SL - 16);
        ctx.textAlign = 'left';
      });
    }

    // Kardi + kaki kartu
    const kardi = await gambarKardi();
    if (kardi) ctx.drawImage(kardi, W - M - 245, 1740 - 30 - 208, 225, 208);
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
