/* Pilah: jelajah ruangan, empat tong, kode plastik. */
JN.mulai = () => {
  const { $, $$, svg, KAT } = JN;
  JN.pasangJelajah($('#jelajah'));

  /* 3 contoh tampil; sisanya dibuka di tempat dengan tombol "Lihat n lainnya" (kartu memanjang) */
  $('#kartu-tong').innerHTML = Object.entries(KAT).map(([k, t]) => {
    const contoh = JN.BARANG.filter(b => b.kat === k), lebih = contoh.length - 3;
    return `<article class="kartu-tong${k === 'anorganik' ? '' : ' putih-teks'}" style="--w:${t.warna}">
      <div class="kepala-tong"><b>${t.nama}</b><span class="tujuan-tong">→ ${t.ke}</span></div>
      <div class="badan-tong">
        <p>${t.isi}</p>
        <div class="contoh" id="contoh-${k}">${contoh.map((b, i) => `<span${i >= 3 ? ' class="lebih"' : ''}>${svg(b.ikon)}${b.nama}</span>`).join('')}</div>
        ${lebih > 0 ? `<button type="button" class="contoh-buka" aria-expanded="false" aria-controls="contoh-${k}" data-lebih="${lebih}">Lihat ${lebih} lainnya ▾</button>` : ''}
      </div>
    </article>`;
  }).join('');
  $$('.contoh-buka').forEach(b => b.addEventListener('click', () => {
    const buka = b.getAttribute('aria-expanded') !== 'true';
    b.setAttribute('aria-expanded', buka);
    b.closest('.kartu-tong').classList.toggle('buka', buka);
    b.textContent = buka ? 'Sembunyikan ▴' : `Lihat ${b.dataset.lebih} lainnya ▾`;
  }));

  const segitiga = n => `<svg class="segitiga" viewBox="0 0 60 60" role="img" aria-label="Kode plastik ${n}">
    <path d="M30 6 L54 50 H6 Z" fill="none" stroke="#1B1712" stroke-width="4" stroke-linejoin="round" stroke-dasharray="20 6"/>
    <text x="30" y="42" text-anchor="middle" font-family="Archivo, sans-serif" font-weight="900" font-size="22" fill="#1B1712">${n}</text></svg>`;
  pasangPilahCepat($('#game'));

  /* kartu ringkas: angka + contoh barang + status dulu; nama kimia hanya keterangan kecil */
  $('#daftar-plastik').innerHTML = JN.PLASTIK.map(p => `<article class="pl-${p.status}">
      ${segitiga(p.kode)}<div class="pl-isi"><b>${p.nama}</b><p>${p.contoh}</p><small>${p.lengkap}</small></div>
      <span class="chip st st-${p.status}">${JN.STATUS_PLASTIK[p.status]}</span>
    </article>`).join('');
};

/* Pilah Cepat: 8 barang acak (2 per tong). Ketuk tong (atau tekan 1–4) → barang "terlempar" ke tong itu,
   lalu umpan balik langsung: benar lanjut otomatis, salah ditunjukkan tong yang benar beserta caranya.
   Selesai satu ronde = jejak Pilah tercatat, skornya masuk Kartu Jejak-ku. */
function pasangPilahCepat(wadah) {
  if (!wadah) return;
  const { $, $$, svg, esc, KAT } = JN;
  const URUT = ['organik', 'anorganik', 'b3', 'residu'], JUMLAH = 8;
  const acakSusun = a => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  let soal = [], ke = 0, skor = 0, salah = [], kunci = false;

  function mulai() {
    soal = acakSusun(URUT.flatMap(k => acakSusun(JN.BARANG.filter(b => b.kat === k)).slice(0, JUMLAH / URUT.length)));
    ke = 0; skor = 0; salah = [];
    wadah.innerHTML = `
      <div class="g-atas"><div class="g-progres" aria-hidden="true">${soal.map(() => '<span></span>').join('')}</div>
        <span class="g-skor" id="g-skor" aria-live="polite">Benar 0</span></div>
      <div class="g-panggung"><div class="g-barang" id="g-barang"></div></div>
      <div class="g-tong" role="group" aria-label="Pilih tong">${URUT.map((k, i) => `
        <button type="button" class="g-t${k === 'anorganik' ? '' : ' putih-teks'}" data-kat="${k}" style="--w:${KAT[k].warna}">
          <span class="bibir"></span><span class="badan">${KAT[k].nama}</span><small>${i + 1}</small></button>`).join('')}</div>
      <div class="g-umpan" id="g-umpan" aria-live="polite"></div>`;
    $$('.g-t', wadah).forEach(t => t.addEventListener('click', () => jawab(t.dataset.kat)));
    tampil();
  }
  function tampil() {
    const b = soal[ke];
    $$('.g-progres span', wadah).forEach((s, i) => { s.className = i < ke ? (salah.some(x => x.i === i) ? 'salah' : 'benar') : i === ke ? 'kini' : ''; });
    const el = $('#g-barang', wadah);
    el.style.transform = ''; el.classList.remove('terbang');
    el.innerHTML = `${svg(b.ikon)}<b>${esc(b.nama)}</b><span>Barang ${ke + 1} dari ${soal.length}</span>`;
    el.classList.remove('muncul'); void el.offsetWidth; el.classList.add('muncul');
    $$('.g-t', wadah).forEach(t => { t.disabled = false; t.classList.remove('benar', 'salah', 'tunjuk'); });
    $('#g-umpan', wadah).innerHTML = '';
    kunci = false;
  }
  function jawab(kat) {
    if (kunci) return; kunci = true;
    const b = soal[ke], benar = kat === b.kat, tombol = $(`.g-t[data-kat="${kat}"]`, wadah), el = $('#g-barang', wadah);
    $$('.g-t', wadah).forEach(t => { t.disabled = true; });
    /* barang terlempar ke tong yang dipilih */
    if (!JN.kurangGerak) {
      const a = el.getBoundingClientRect(), t = tombol.getBoundingClientRect();
      el.classList.add('terbang');
      el.style.transform = `translate(${t.left + t.width / 2 - (a.left + a.width / 2)}px,${t.top + 20 - (a.top + a.height / 2)}px) scale(.25) rotate(${benar ? 20 : -30}deg)`;
    }
    setTimeout(() => {
      const k = KAT[b.kat], cara = (b.langkah || []).join(', ').toLowerCase();
      if (benar) {
        skor++; tombol.classList.add('benar'); JN.eks('senang', 1400);
        $('#g-umpan', wadah).innerHTML = `<p class="g-hasil benar">✓ Benar! ${esc(b.nama)} masuk tong <b>${k.nama}</b>.</p><p>${esc(cara.charAt(0).toUpperCase() + cara.slice(1))}.</p>`;
        setTimeout(lanjut, 1700);
      } else {
        salah.push({ i: ke, b, pilih: kat });
        tombol.classList.add('salah'); $(`.g-t[data-kat="${b.kat}"]`, wadah).classList.add('tunjuk'); JN.eks('bingung', 1800);
        el.style.transform = ''; el.classList.remove('terbang');
        $('#g-umpan', wadah).innerHTML = `<p class="g-hasil salah">Belum tepat. ${esc(b.nama)} masuk tong <b>${k.nama}</b> (${k.ke.toLowerCase()}).</p>
          <p>Caranya: ${esc(cara)}.</p><button type="button" class="btn kecil" id="g-lanjut">${ke + 1 < soal.length ? 'Lanjut →' : 'Lihat hasil →'}</button>`;
        $('#g-lanjut', wadah).addEventListener('click', lanjut);
        $('#g-lanjut', wadah).focus({ preventScroll: true });
      }
      $('#g-skor', wadah).textContent = `Benar ${skor}`;
    }, JN.kurangGerak ? 0 : 480);
  }
  function lanjut() {
    ke++;
    if (ke < soal.length) return tampil();
    JN.jejak.ubah(d => { d.pilah.main = true; d.pilah.skor = Math.max(d.pilah.skor || 0, skor); });
    const pesan = skor === soal.length ? 'Sempurna! Kamu siap memilah di rumah.' : skor >= 6 ? 'Hebat, tinggal sedikit lagi!' : skor >= 4 ? 'Lumayan! Cek lagi barang yang tadi keliru.' : 'Tidak apa-apa, justru sekarang kamu jadi tahu.';
    wadah.innerHTML = `<div class="g-akhir">
      <span class="label">Hasil Pilah Cepat</span>
      <p class="g-skor-besar"><b>${skor}</b>/${soal.length}</p><p class="g-pesan">${pesan}</p>
      ${salah.length ? `<ul class="g-salah">${salah.map(x => `<li style="--w:${KAT[x.b.kat].warna}">${svg(x.b.ikon)}<span><b>${esc(x.b.nama)}</b> masuk tong ${KAT[x.b.kat].nama}, bukan ${KAT[x.pilih].nama}.</span></li>`).join('')}</ul>` : ''}
      <div class="g-aksi"><button type="button" class="btn putih" id="g-ulang">Main lagi</button><a class="btn" href="kurangi.html">Lanjut ke Kurangi →</a></div>
    </div>`;
    $('#g-ulang', wadah).addEventListener('click', () => { mulai(); wadah.focus({ preventScroll: true }); });
  }
  wadah.addEventListener('keydown', e => {
    const n = Number(e.key);
    if (n >= 1 && n <= 4 && $('.g-t', wadah) && !kunci) { e.preventDefault(); jawab(URUT[n - 1]); }
  });
  mulai();
}
