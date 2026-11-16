/* Jejak Nol — kode bersama: ikon, Kardi, menu, pencarian, jelajah ruangan, kalkulator, dekorasi.
   Setiap halaman memuat data.js → umum.js → (script halaman). */
(() => {
const JN = window.JN;
const $ = JN.$ = (s, el = document) => el.querySelector(s);
const $$ = JN.$$ = (s, el = document) => [...el.querySelectorAll(s)];
JN.kurangGerak = matchMedia('(prefers-reduced-motion: reduce)').matches;
JN.fmt = n => n.toLocaleString('id-ID');
JN.esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
JN.norm = s => String(s).toLowerCase().trim().replace(/\s+/g, ' ');
JN.acak = seed => () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
  t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
JN.byId = Object.fromEntries(JN.BARANG.map(b => [b.id, b]));
const simpan = {
  ambil(k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } },
  taruh(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* penyimpanan diblokir: tetap jalan tanpa simpan */ } }
};

/* ---------- jejak: kemajuan pengunjung di empat langkah ----------
   Setiap langkah punya satu aksi kecil. Disimpan di browser, jadi tetap ada saat pindah halaman.
   Urutan 1–4 hanya saran: halaman tidak pernah dikunci. */
JN.LANGKAH = [
  { id: 'pilah',   nama: 'Pilah',   warna: 'var(--anorganik)', url: 'pilah.html',   tugas: 'Buka 3 barang di Jelajah ruangan, atau cari 1 barang.' },
  { id: 'kurangi', nama: 'Kurangi', warna: 'var(--stempel)',   url: 'kurangi.html', tugas: 'Pilih minimal 1 barang yang sanggup kamu ganti.' },
  { id: 'olah',    nama: 'Olah',    warna: 'var(--organik)',   url: 'olah.html',    tugas: 'Simpan 1 panduan atau ide yang ingin kamu coba.' },
  { id: 'setor',   nama: 'Setor',   warna: 'var(--setor)',     url: 'setor.html',   tugas: 'Centang kelima persiapan sebelum menyetor.' }
];
/* gembok: ikon SVG sendiri (bukan emoji) supaya sama di semua perangkat dan sesuai gaya ikon lain */
JN.GEMBOK = '<svg class="gembok" viewBox="0 0 24 24" aria-hidden="true"><path d="M7.5 11V8a4.5 4.5 0 0 1 9 0v3" fill="none" stroke="#1B1712" stroke-width="2.6" stroke-linecap="round"/><rect x="4" y="10.5" width="16" height="11.5" rx="2.5" fill="#F2C230" stroke="#1B1712" stroke-width="2.6"/><path d="M12 15v3" stroke="#1B1712" stroke-width="2.6" stroke-linecap="round"/></svg>';
const KUNCI_JEJAK = 'jejaknol:jejak', KUNCI_BARIS = 'jejaknol:baris';
JN.jejak = {
  data() {
    const s = simpan.ambil(KUNCI_JEJAK) || {};
    return { nama: s.nama || '', pilah: { dilihat: [], cari: false, ...(s.pilah || {}) }, kurangi: { janji: false, ...(s.kurangi || {}) },
      olah: { simpan: [], ...(s.olah || {}) }, setor: { centang: [], ...(s.setor || {}) } };
  },
  /* Jejak bebas urutan: pengunjung boleh mulai dari Pilah, Kurangi, Olah, atau Setor mana saja. */
  status(d = this.data()) {
    return {
      pilah: d.pilah.dilihat.length >= 3 || d.pilah.cari,
      kurangi: !!d.kurangi.janji,
      olah: d.olah.simpan.length > 0,
      setor: d.setor.centang.length >= 5
    };
  },
  terbuka() { return true; },
  pesanKunci() { return ''; },
  jumlah(st = this.status()) { return Object.values(st).filter(Boolean).length; },
  berikut(st = this.status()) { return JN.LANGKAH.find(l => !st[l.id]); },
  ubah(fn) {
    const d = this.data(), sebelum = this.status(d);
    fn(d); simpan.taruh(KUNCI_JEJAK, d);
    const sesudah = this.status(d), n = this.jumlah(sesudah);
    JN.LANGKAH.forEach(l => { if (!sebelum[l.id] && sesudah[l.id]) rayakan(l, n); });
    this.tampilkan();
  },
  hapus() {
    try { localStorage.removeItem(KUNCI_JEJAK); localStorage.removeItem(KUNCI_BARIS); } catch (e) { /* abaikan */ }
    this.tampilkan();
  },
  tampilkan() {
    const d = this.data(), st = this.status(d), n = this.jumlah(st), b = this.berikut(st);
    const kunci = a => (a.getAttribute('href') || '').replace(/[#?].*/, '').replace('.html', '');
    $$('nav.menu a.titik, .langkah-nav a').forEach(a => {
      const k = kunci(a); if (!(k in st)) return;
      const kunciLangkah = !st[k] && !this.terbuka(k, st);
      a.classList.toggle('jejak', st[k]); a.classList.toggle('kunci', kunciLangkah);
      a.title = st[k] ? 'Jejak sudah tercatat' : kunciLangkah ? 'Jejak langkah ini masih terkunci, isinya tetap bisa dibaca' : 'Belum ada jejak';
    });
    $$('[data-tugas]').forEach(el => {
      const l = JN.LANGKAH.find(x => x.id === el.dataset.tugas), dikunci = !st[l.id] && !this.terbuka(l.id, st);
      el.classList.toggle('beres', st[l.id]); el.classList.toggle('terkunci', dikunci);
      el.innerHTML = st[l.id]
        ? `<span class="label">✓ Jejak ${l.nama} tercatat · ${n}/4</span><span>${b ? `Lanjut ke <a href="${b.url}">${b.nama} →</a>` : `Keempat jejak lengkap. <a href="kartu.html">Lihat Kartu Jejak-ku →</a>`}</span>`
        : dikunci
          ? `<span class="label">${JN.GEMBOK} Jejak terkunci · ${n}/4</span><span>${this.pesanKunci(l.id)} Isi halaman ini tetap bisa kamu baca. <a href="${b.url}">${n ? "Lanjut ke" : "Mulai dari"} ${b.nama} →</a></span>`
          : `<span class="label">Jejakmu di sini · ${n}/4</span><span>${l.tugas}${l.id === 'pilah' ? ` (${Math.min(3, d.pilah.dilihat.length)}/3)` : ''}</span>`;
    });
    $$('[data-status-jejak]').forEach(el => {
      const k = el.dataset.statusJejak, s = st[k], dikunci = !s && !this.terbuka(k, st);
      el.classList.toggle('sudah', s); el.classList.toggle('terkunci', dikunci);
      el.innerHTML = s ? '✓ Sudah' : dikunci ? `${JN.GEMBOK} Terkunci` : 'Belum';
    });
    $$('[data-lanjut]').forEach(a => {
      if (!n) return;
      if (b) { a.href = b.url; a.textContent = `Lanjutkan: ${b.nama} →`; } else { a.href = 'kartu.html'; a.textContent = 'Lihat Kartu Jejak-ku →'; }
    });
    $$('[data-kartu-jejak]').forEach(JN.gambarKartuJejak);
    document.dispatchEvent(new Event('jejakberubah')); // halaman pilar memperbarui tombol yang terkunci
  }
};
function rayakan(l, n) {
  JN.eks('senang', 2200); JN.lompat();
  JN.bilang(n === 4 ? 'Keempat jejakmu lengkap! Kartu Jejak-ku sudah siap.' : `Jejak ${l.nama} tercatat! ${n} dari 4.`);
}
JN.hitungJanji = baris => (baris || []).filter(r => JN.byId[r.id] && JN.byId[r.id].hitung && JN.PER[r.per])
  .map(r => ({ r, b: JN.byId[r.id], dicegah: Math.round(r.jumlah * JN.PER[r.per] * r.k) }));
/* isi Kartu Jejak-ku sebagai teks biasa: dipakai kartu di halaman dan gambar yang diunduh */
JN.isiKartuJejak = (d = JN.jejak.data()) => {
  const n = JN.jejak.jumlah(JN.jejak.status(d));
  const janji = JN.hitungJanji(simpan.ambil(KUNCI_BARIS)).filter(x => x.r.k > 0);
  const semuaIde = [...JN.PANDUAN, ...JN.DIY];
  const nama = d.nama || 'Aku';
  return {
    judul: n === 4 ? `${nama} menyelesaikan 4 langkah!` : `Jejak ${nama} sejauh ini`,
    total: janji.reduce((s, x) => s + x.dicegah, 0),
    baris: {
      pilah: d.pilah.dilihat.length ? `Sudah mengenali tong untuk ${d.pilah.dilihat.length} barang.` : 'Sudah mencari tahu tong yang benar.',
      kurangi: janji.length ? `Ganti ${janji.slice(0, 3).map(x => `${x.b.nama.toLowerCase()} dengan ${x.b.hitung.ganti}`).join('; ')}${janji.length > 3 ? `, dan ${janji.length - 3} lainnya` : ''}.` : '',
      olah: `Akan mencoba: ${d.olah.simpan.map(id => (semuaIde.find(x => x.id === id) || {}).judul).filter(Boolean).join(', ')}.`,
      setor: 'Siap menyetor sampah yang bersih, kering, dan terpilah.'
    }
  };
};
JN.gambarKartuJejak = el => {
  const d = JN.jejak.data(), st = JN.jejak.status(d), n = JN.jejak.jumlah(st);
  const isi = JN.isiKartuJejak(d), total = isi.total;
  el.innerHTML = `<div class="kartu-jejak">
    <div class="kj-atas"><span class="kj-logo">Jejak Nol</span><span class="kj-cap">${n === 4 ? 'Lengkap' : n + '/4 jejak'}</span></div>
    <div class="kj-nama">${JN.esc(isi.judul)}</div>
    ${JN.LANGKAH.map(l => `<div class="kj-baris${st[l.id] ? '' : ' belum'}" style="--w:${l.warna}"><span><b>${l.nama}</b>${st[l.id] ? JN.esc(isi.baris[l.id]) : `Belum. <a href="${l.url}">Selesaikan langkah ini →</a>`}</span></div>`).join('')}
    ${total ? `<div class="kj-total"><span class="kj-angka">${JN.fmt(total)}</span><br><strong>barang sekali pakai per tahun tidak jadi sampah</strong></div>` : ''}
    <div class="kj-kardi">${JN.kardiSVG(false, '')}</div>
  </div>`;
};

/* ---------- ikon (SVG 48×48, garis tinta) ---------- */
const T = 'stroke="#1B1712" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"';
JN.IKON = {
  botol: `<path ${T} fill="#CFE7F0" d="M20 5h8v6l5 6v24a3 3 0 0 1-3 3H18a3 3 0 0 1-3-3V17l5-6z"/><rect ${T} fill="#fff" x="15" y="23" width="18" height="9"/>`,
  kaleng: `<rect ${T} fill="#B9C3CC" x="14" y="7" width="20" height="35" rx="4"/><path ${T} fill="#D64532" d="M14 17h20v12H14z"/><path ${T} fill="none" d="M19 7v-2h10v2"/>`,
  kardus: `<path ${T} fill="#C7A06A" d="M7 17l17-7 17 7v19l-17 7-17-7z"/><path ${T} fill="none" d="M7 17l17 7 17-7M24 24v19"/><path fill="#ECD9AE" d="M13 19.5l17-7 3 1.3-17 7z"/>`,
  kresek: `<path ${T} fill="#fff" d="M12 16h24l3 26H9z"/><path ${T} fill="none" d="M16 16c0-10 7-10 7-2M32 16c0-10-7-10-7-2"/>`,
  gelas: `<path ${T} fill="#F7E7B4" d="M12 13h24l-3 30H15z"/><path ${T} fill="#fff" d="M10 9h28v5H10z"/><path ${T} fill="none" d="M27 9l5-7"/>`,
  'gelas-kopi': `<path ${T} fill="#fff" d="M10 16h24v16a8 8 0 0 1-8 8h-8a8 8 0 0 1-8-8z"/><path ${T} fill="none" d="M34 20h3a4 4 0 0 1 0 8h-3"/><path fill="#6B4E16" d="M12 18h20v6H12z"/><path ${T} fill="none" d="M17 4c-2 3 2 5 0 8M24 4c-2 3 2 5 0 8"/>`,
  telur: `<path ${T} fill="#FBF3E0" d="M8 28c0-8 7-14 16-14s16 6 16 14l-4-3-4 4-4-4-4 4-4-4-4 4-4-4z"/><path ${T} fill="#FBF3E0" d="M8 32h32c-1 7-8 11-16 11S9 39 8 32z"/>`,
  'kertas-minyak': `<path ${T} fill="#E9E2D0" d="M6 14l36-4 2 26-36 4z"/><ellipse fill="#E8C27A" opacity=".7" cx="22" cy="26" rx="8" ry="5"/><path ${T} fill="none" d="M10 18l30-3"/>`,
  toples: `<rect ${T} fill="#E7F2F2" x="12" y="14" width="24" height="28" rx="5"/><rect ${T} fill="#C7A06A" x="14" y="7" width="20" height="7" rx="2"/><path fill="#F2C230" d="M15 26h18v13H15z" opacity=".8"/>`,
  pisang: `<path ${T} fill="#F2C230" d="M9 30c6 8 22 9 30-4-2 9-10 15-19 14-6-1-10-5-11-10z"/><path ${T} fill="#F2C230" d="M24 34c-3-8-1-18 6-24l3 2c-5 6-6 14-4 21z"/><path ${T} fill="#6B4E16" d="M30 10l3-3 2 2-3 3z"/>`,
  apel: `<path ${T} fill="#F4ECDD" d="M18 12c-5 4-5 9-2 12s3 7 0 10c4 5 13 5 16 0-3-3-3-7 0-10s3-8-2-12c-4 2-8 2-12 0z"/><path ${T} fill="none" d="M24 11c0-3 1-5 3-6"/><path fill="#D64532" d="M17 12.5c-2 1-3 3-3 5l3-1zM31 12.5c2 1 3 3 3 5l-3-1z"/>`,
  daun: `<path ${T} fill="#6FA36A" d="M8 40C8 18 22 8 40 8c0 20-12 32-32 32z"/><path ${T} fill="none" d="M8 40L32 16M18 30h8M22 26v-7"/>`,
  sachet: `<path ${T} fill="#C9C9CF" d="M12 8l3 2 3-2 3 2 3-2 3 2 3-2 3 2 3-2v32l-3-2-3 2-3-2-3 2-3-2-3 2-3-2-3 2z"/><rect fill="#7E3FA0" x="15" y="17" width="18" height="12"/>`,
  styrofoam: `<path ${T} fill="#fff" d="M6 22h36l-4 16H10z"/><path ${T} fill="#F7F7F2" d="M6 22l4-10h28l4 10"/><path ${T} fill="none" d="M14 28h4M22 28h4M30 28h4"/>`,
  sedotan: `<path ${T} fill="#fff" d="M30 4l5 2-15 38-5-2z"/><path fill="#D64532" d="M31 7l3 1.2-2 5-3-1.2zM27 17l3 1.2-2 5-3-1.2zM23 27l3 1.2-2 5-3-1.2z"/>`,
  sikat: `<path ${T} fill="#7BB7E0" d="M10 40l20-28 4 3-20 28z"/><path ${T} fill="#fff" d="M28 8l9 6-5 7-9-6z"/>`,
  baterai: `<rect ${T} fill="#2E2A25" x="10" y="15" width="26" height="18" rx="2"/><rect ${T} fill="#F2C230" x="10" y="15" width="10" height="18"/><path ${T} fill="#2E2A25" d="M36 20h4v8h-4z"/>`,
  lampu: `<circle ${T} fill="#FFF3BF" cx="24" cy="18" r="12"/><path ${T} fill="#B9C3CC" d="M19 29h10v10H19z"/><path ${T} fill="none" d="M19 33h10M21 18l3 5 3-5"/>`,
  obat: `<rect ${T} fill="#E9EEF3" x="8" y="12" width="32" height="24" rx="4"/><g ${T} fill="#fff"><circle cx="17" cy="20" r="3.5"/><circle cx="31" cy="20" r="3.5"/><circle cx="17" cy="29" r="3.5"/><circle cx="31" cy="29" r="3.5"/></g>`,
  sampo: `<path ${T} fill="#F59BB0" d="M15 16h18v24a4 4 0 0 1-4 4H19a4 4 0 0 1-4-4z"/><path ${T} fill="#fff" d="M19 8h10v8H19z"/><path ${T} fill="none" d="M29 10h5"/>`,
  tisu: `<path ${T} fill="#fff" d="M10 20h28v20H10z"/><path ${T} fill="#fff" d="M18 20c0-8 4-12 6-14 2 2 6 6 6 14"/><path ${T} fill="none" d="M14 30h20"/>`,
  popok: `<path ${T} fill="#fff" d="M6 14h36v8c0 10-8 18-18 18S6 32 6 22z"/><path ${T} fill="#9CD3E6" d="M6 14h8v6H6zM34 14h8v6h-8z"/>`,
  kertas: `<path ${T} fill="#fff" d="M12 6h18l8 8v28H12z"/><path ${T} fill="#E9DCC2" d="M30 6v8h8"/><path ${T} fill="none" d="M17 22h16M17 28h16M17 34h10"/>`,
  masker: `<path ${T} fill="#CFE7F0" d="M12 16c8-3 16-3 24 0v14c-8 5-16 5-24 0z"/><path ${T} fill="none" d="M12 18c-5 0-7 4-5 8s5 4 5 4M36 18c5 0 7 4 5 8s-5 4-5 4M17 22h14M17 27h14"/>`,
  kabel: `<rect ${T} fill="#fff" x="8" y="10" width="14" height="16" rx="3"/><path ${T} fill="none" d="M12 10V5M18 10V5M15 26c0 8 4 12 12 12s10 4 10 6"/><rect ${T} fill="#2E2A25" x="33" y="36" width="10" height="7" rx="2"/>`,
  semprot: `<rect ${T} fill="#6FA36A" x="14" y="16" width="20" height="28" rx="4"/><path ${T} fill="#B9C3CC" d="M18 8h12v8H18z"/><path ${T} fill="none" d="M30 10h6M38 7l3-2M38 12l4 0"/><path fill="#F2C230" d="M14 26h20v8H14z"/>`,
  tutup: `<ellipse ${T} fill="#5B8FD6" cx="24" cy="30" rx="15" ry="7"/><path ${T} fill="#5B8FD6" d="M9 30V20c0 4 7 7 15 7s15-3 15-7v10"/><ellipse ${T} fill="#7BA7E6" cx="24" cy="20" rx="15" ry="7"/>`,
  bubble: `<rect ${T} fill="#EAF6FB" x="6" y="10" width="36" height="28" rx="4"/><g fill="#fff" ${T}><circle cx="15" cy="19" r="4"/><circle cx="25" cy="19" r="4"/><circle cx="35" cy="19" r="3"/><circle cx="15" cy="29" r="4"/><circle cx="25" cy="29" r="4"/><circle cx="35" cy="29" r="3"/></g>`,
  pot: `<path ${T} fill="#CFE7F0" d="M14 24h20v16a3 3 0 0 1-3 3H17a3 3 0 0 1-3-3z"/><path ${T} fill="#7A5230" d="M14 24h20v5H14z"/><path ${T} fill="#6FA36A" d="M24 24c-1-7-6-11-11-11 0 6 4 10 11 11zM24 24c1-9 6-14 12-14 0 7-5 13-12 14z"/>`,
  ember: `<path ${T} fill="#7BB7E0" d="M10 16h28l-3 26H13z"/><path ${T} fill="none" d="M12 16c0-10 24-10 24 0"/><path ${T} fill="#7A5230" d="M11 22h26"/><path fill="#6FA36A" d="M16 19h4v3h-4zM26 18h5v4h-5z"/>`,
  ecobrick: `<path ${T} fill="#CFE7F0" d="M20 5h8v6l5 6v24a3 3 0 0 1-3 3H18a3 3 0 0 1-3-3V17l5-6z"/><path fill="#7E3FA0" d="M17 20h14v7H17z"/><path fill="#F2C230" d="M17 27h14v6H17z"/><path fill="#D64532" d="M17 33h14v7H17z"/><path ${T} fill="none" d="M15 20h18"/>`,
  tas: `<path ${T} fill="#F59BB0" d="M10 18h28l-2 24H12z"/><path ${T} fill="none" d="M16 18c0-6 2-10 4-12M32 18c0-6-2-10-4-12M12 38h24"/><path ${T} fill="none" d="M15 42v3M20 42v3M25 42v3M30 42v3M34 42v3"/>`,
  jelantah: `<path ${T} fill="#F9E79F" d="M18 7h12v5l6 7v20a4 4 0 0 1-4 4H16a4 4 0 0 1-4-4V19l6-7z"/><path fill="#E59824" d="M13 28c6-3 15 3 22 0v11a3 3 0 0 1-3 3H16a3 3 0 0 1-3-3z"/><path ${T} fill="none" d="M13 28c6-3 15 3 22 0M19 7h10"/>`,
  papercup: `<path ${T} fill="#F4ECDD" d="M13 15h22l-3 27H16z"/><path fill="#C7A06A" d="M14.5 23h19l-1 10h-17z"/><path ${T} fill="none" d="M14.5 23h19M15.5 33h17"/><path ${T} fill="#fff" d="M11 10h26v5H11z"/>`,
  thinwall: `<rect ${T} fill="#EAF6FB" x="7" y="18" width="34" height="19" rx="4"/><path ${T} fill="#fff" d="M6 14h36v5H6z"/><path ${T} fill="none" d="M14 25h20M14 31h12"/>`,
  tetrapak: `<path ${T} fill="#fff" d="M14 14h20v28H14z"/><path ${T} fill="#5B8FD6" d="M14 14l10-7 10 7z"/><path fill="#F2C230" d="M15 24h18v10H15z"/><path ${T} fill="none" d="M29 9l5-4"/>`,
  tulang: `<path ${T} fill="#FBF3E0" d="M13 17a5 5 0 1 1 6-6l14 14a5 5 0 1 1-6 6L13 17z"/><circle ${T} fill="#FBF3E0" cx="11" cy="18" r="4"/><circle ${T} fill="#FBF3E0" cx="34" cy="33" r="4"/>`,
  'alat-makan': `<ellipse ${T} fill="#fff" cx="16" cy="14" rx="5" ry="7"/><path ${T} fill="none" d="M16 21v21"/><path ${T} fill="none" d="M29 8v34M35 8v34M29 16h6"/>`,
  struk: `<path ${T} fill="#fff" d="M13 7h22v34l-3-2-3 2-3-2-3 2-3-2-3 2-4-2z"/><path ${T} fill="none" d="M17 15h14M17 21h10M17 27h14M17 33h8"/>`,
  pecahan: `<path ${T} fill="#FBF3E0" d="M11 12l16 3 9 14-14 11-12-10z"/><path ${T} fill="none" d="M19 19l5 6-2 7"/><circle fill="#A8231B" cx="36" cy="12" r="4"/>`,
  silet: `<rect ${T} fill="#B9C3CC" x="8" y="15" width="32" height="18" rx="3"/><path ${T} fill="#fff" d="M16 24h16"/><circle ${T} fill="#F4ECDD" cx="13" cy="24" r="2.5"/><circle ${T} fill="#F4ECDD" cx="35" cy="24" r="2.5"/>`,
  korek: `<rect ${T} fill="#D64532" x="15" y="16" width="18" height="26" rx="3"/><rect ${T} fill="#B9C3CC" x="16" y="10" width="10" height="6"/><circle ${T} fill="#1B1712" cx="29" cy="12" r="3.5"/>`,
  pakaian: `<path ${T} fill="#7BB7E0" d="M15 9l6 4h6l6-4 8 7-5 7-4-2v19H16V21l-4 2-5-7z"/>`
};
JN.svg = (n, label, kelas) => `<svg ${kelas ? `class="${kelas}" ` : ''}viewBox="0 0 48 48" ${label ? `role="img" aria-label="${JN.esc(label)}"` : 'aria-hidden="true"'}>${JN.IKON[n] || ''}</svg>`;

/* ---------- Kardi si kardus ---------- */
const TK = 'stroke="#1B1712" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"';
const TK5 = TK.replace('stroke-width="3"', 'stroke-width="5"'); // lengan lebih tebal; satu atribut saja supaya SVG juga valid sebagai gambar
JN.kardiSVG = (lambai, label = 'Kardi, maskot kardus Jejak Nol') => `
<svg class="kardi${lambai ? ' melambai' : ''}" data-eks="biasa" viewBox="-6 0 136 126" ${label ? `role="img" aria-label="${label}"` : 'aria-hidden="true"'}>
 <g class="loncat"><g class="badan-k">
  <rect ${TK} fill="#1B1712" x="34" y="106" width="16" height="12" rx="5"/><rect ${TK} fill="#1B1712" x="70" y="106" width="16" height="12" rx="5"/>
  <g class="lengan-kiri"><path ${TK5} fill="none" d="M22 80 Q8 74 4 58"/><circle ${TK} fill="#C7A06A" cx="4" cy="54" r="6"/></g>
  <g class="lengan-kanan"><path ${TK5} fill="none" d="M106 82 Q118 88 120 100"/><circle ${TK} fill="#A9824E" cx="120" cy="103" r="6"/></g>
  <path ${TK} fill="#D2B07A" d="M20 40 L34 28 L24 8 L6 22 Z"/><path ${TK} fill="#D2B07A" d="M100 40 L114 28 L126 12 L112 22 Z"/>
  <path ${TK} fill="#6E5230" d="M20 40 L34 28 L114 28 L100 40 Z"/><path ${TK} fill="#A9824E" d="M100 40 L114 28 L114 96 L100 110 Z"/>
  <rect ${TK} fill="#C7A06A" x="20" y="40" width="80" height="70" rx="2"/><rect fill="#ECD9AE" x="53" y="41.5" width="14" height="15"/>
  <text x="60" y="103" text-anchor="middle" font-family="Space Mono, monospace" font-size="7" font-weight="700" fill="#1B1712" opacity=".55">JEJAK NOL</text>
  <ellipse fill="#E8896B" opacity=".75" cx="36" cy="82" rx="6" ry="3.5"/><ellipse fill="#E8896B" opacity=".75" cx="84" cy="82" rx="6" ry="3.5"/>
  <g class="eks eks-biasa"><g class="mata" fill="#1B1712"><ellipse cx="46" cy="70" rx="4.5" ry="6.5"/><ellipse cx="74" cy="70" rx="4.5" ry="6.5"/></g><path ${TK} fill="none" d="M52 84 Q60 91 68 84"/></g>
  <g class="eks eks-senang"><path ${TK} fill="none" d="M40 72 Q46 63 52 72 M68 72 Q74 63 80 72"/><path ${TK} fill="#A8231B" d="M50 82 Q60 97 70 82 Z"/></g>
  <g class="eks eks-bingung"><g class="mata" fill="#1B1712"><ellipse cx="46" cy="70" rx="4.5" ry="6.5"/><ellipse cx="74" cy="71" rx="3.5" ry="4.5"/></g><path ${TK} fill="none" d="M38 58 L52 61 M70 62 L82 57"/><path ${TK} fill="none" d="M49 87 q4 -4 7.5 0 t7.5 0 t7.5 0"/></g>
  <g class="eks eks-kaget"><circle ${TK} fill="#fff" cx="46" cy="69" r="8"/><circle ${TK} fill="#fff" cx="74" cy="69" r="8"/><circle fill="#1B1712" cx="46" cy="70" r="3.5"/><circle fill="#1B1712" cx="74" cy="70" r="3.5"/><ellipse fill="#1B1712" cx="60" cy="88" rx="4.5" ry="5.5"/></g>
 </g></g>
</svg>`;

let jedaEks, jedaGel;
JN.eks = (nama, lama) => {
  $$('.kardi').forEach(s => { s.dataset.eks = nama; });
  clearTimeout(jedaEks);
  if (lama) jedaEks = setTimeout(() => JN.eks('biasa'), lama);
};
JN.lompat = () => {
  if (JN.kurangGerak) return;
  $$('.kardi .loncat').forEach(g => { g.classList.remove('lompat'); g.getBoundingClientRect(); g.classList.add('lompat'); });
};
JN.bilang = t => {
  const gel = $('.gelembung'); if (!gel) return;
  $('#gelembung').textContent = t; gel.hidden = false;
  clearTimeout(jedaGel); jedaGel = setTimeout(() => { gel.hidden = true; }, 3500);
};

/* Kardi teman: muncul setelah kepala halaman terlewati, tidak menutupi footer atau menghalangi klik elemen */
function pasangTeman() {
  document.body.insertAdjacentHTML('beforeend', `
  <div class="teman" id="teman" hidden>
    <p class="gelembung" hidden><span id="gelembung" aria-live="polite">Halo, aku Kardi!</span><button type="button" class="tutup-teman" id="tutup-balon" aria-label="Tutup pesan Kardi">×</button></p>
    <button type="button" class="teman-badan" aria-label="Minta tips dari Kardi">${JN.kardiSVG(false, '')}</button>
  </div>`);
  const teman = $('#teman'), gel = $('.gelembung');
  $('#tutup-balon').addEventListener('click', () => { gel.hidden = true; clearTimeout(jedaGel); });
  const TIPS = ['Bilas botol sebelum disetor, biar bank sampah mau terima.', 'Simpan satu tas kain di tas kuliahmu.', 'Baterai bekas jangan dicampur, ya!', 'Sisa sayur bisa jadi kompos.', 'Pisahkan tutup dari botolnya.'];
  let ke = 0;
  $('.teman-badan').addEventListener('click', () => { JN.lompat(); JN.eks('senang', 1200); JN.bilang(TIPS[ke++ % TIPS.length]); });

  const kepala = $('.hero, .halaman-kepala'), kaki = $('footer');
  let diKepala = !!kepala, diFooter = false;
  const perbaruiTeman = () => { teman.hidden = diKepala || diFooter; };
  if (kepala) new IntersectionObserver(([e]) => { diKepala = e.isIntersecting; perbaruiTeman(); }, { threshold: 0.15 }).observe(kepala);
  if (kaki) new IntersectionObserver(([e]) => { diFooter = e.isIntersecting; perbaruiTeman(); }, { threshold: 0.05 }).observe(kaki);
  if (!kepala) perbaruiTeman();

  const pengamat = new IntersectionObserver(ent => ent.forEach(e => {
    if (!e.isIntersecting) return;
    const x = e.target.dataset.eks || 'biasa';
    JN.bilang(e.target.dataset.pesan); JN.eks(x, x === 'biasa' ? 0 : 1800);
  }), { rootMargin: '-45% 0px -45% 0px' });
  $$('[data-pesan]').forEach(s => pengamat.observe(s));
}

/* ---------- pencarian "Ini dibuang ke mana?" + Wizard 2-Klik untuk user non-IT ---------- */
const STOP_CARI = new Set(['sampah', 'bekas', 'sisa', 'tempat', 'wadah', 'buang', 'yang', 'dari', 'habis', 'pakai', 'bungkus']);
const normCari = s => JN.norm(s)
  .replace(/[^a-z0-9\s]/g, ' ')
  .replace(/\bsh/g, 's')
  .replace(/ph/g, 'f')
  .replace(/oe/g, 'u')
  .replace(/\s+/g, ' ')
  .trim();

function jarakKetik(a, b) {
  if (Math.abs(a.length - b.length) > 2) return 99;
  const dp = Array.from({ length: a.length + 1 }, (_, i) => [i]);
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[a.length][b.length];
}

JN.cariBarang = q => {
  const qNorm = normCari(q);
  if (!qNorm) return [];
  const kata = qNorm.split(' ').filter(k => k.length >= 2);
  if (!kata.length) return [];

  const skor = b => {
    const namaNorm = normCari(b.nama);
    const istilah = [namaNorm, ...(b.alias || []).map(normCari)];
    const gabungan = istilah.join(' ');
    const kataNama = [...new Set(namaNorm.split(' ').filter(w => w.length >= 2))];
    const kataGabungan = [...new Set(gabungan.split(' ').filter(w => w.length >= 2))];

    let maks = Math.max(...istilah.map((t, idx) => {
      const bonusNama = idx === 0 ? 3 : 0;
      if (t === qNorm) return 120 + bonusNama;
      if (t.startsWith(qNorm)) return 95 + bonusNama;
      if (t.includes(qNorm)) return 85 + bonusNama;
      if (kata.every(k => t.includes(k))) return 80 + bonusNama;
      return 0;
    }));
    if (maks >= 80) return maks;

    // Cocokkan seluruh kata lintas nama + alias (misal: "cup kopi" -> "cup" + "gelas kopi")
    if (kata.every(k => gabungan.includes(k))) return 70;

    // Cocokkan sebagian kata bermakna (abaikan kata umum seperti "sampah", "bekas", "bungkus")
    const inti = kata.filter(k => !STOP_CARI.has(k));
    const targetKata = inti.length ? inti : kata;
    let cocokSebagian = 0;
    let cocokTypo = 0;
    let cocokDiNama = false;

    targetKata.forEach(k => {
      if (gabungan.includes(k)) {
        cocokSebagian += 1;
        if (namaNorm.includes(k)) cocokDiNama = true;
      } else if (k.length >= 4) {
        const maksTypo = k.length >= 7 ? 2 : 1;
        if (kataNama.some(w => jarakKetik(k, w) <= maksTypo)) {
          cocokTypo += 1;
          cocokDiNama = true;
        } else if (kataGabungan.some(w => jarakKetik(k, w) <= maksTypo)) {
          cocokTypo += 1;
        }
      }
    });

    const bonus = cocokDiNama ? 4 : 0;
    if (cocokSebagian === targetKata.length) return 65 + bonus;
    if (cocokSebagian > 0) return Math.round((cocokSebagian / targetKata.length) * 50) + bonus;
    if (cocokTypo > 0) return Math.round((cocokTypo / targetKata.length) * 40) + bonus;
    return 0;
  };

  return JN.BARANG
    .map(b => ({ b, s: skor(b) }))
    .filter(x => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .map(x => x.b);
};

const AKSI_KATEGORI = {
  organik: b => `<a class="btn kecil" href="olah.html#kompos">Jadikan kompos →</a>`,
  anorganik: b => b.id === 'pakaian'
    ? `<a class="btn kecil" href="olah.html#tas-kaos">Ubah jadi tas / olah →</a>`
    : `<a class="btn kecil" href="setor.html#siapkan">Siapkan untuk bank sampah →</a>`,
  b3: b => `<a class="btn kecil" href="setor.html#tempat">Cari tempat setor B3 →</a>`,
  residu: b => b.hitung ? `<a class="btn kecil" href="kurangi.html?tambah=${b.id}">Kurangi pemakaiannya →</a>` : ''
};

/* Pohon keputusan 2-klik khusus pengguna awam yang bingung nama barangnya */
const WIZARD_ALUR = [
  {
    id: 'organik',
    label: 'Sisa makanan, buah, sayur, atau daun',
    contoh: 'Kulit buah, nasi, tulang, daun kering, minyak goreng',
    ikon: 'pisang',
    tanya2: 'Apakah di dalamnya ada tulang, daging, santan, atau minyak goreng bekas?',
    opsi2: [
      {
        label: 'Tidak ada (cuma sayur, buah, daun, ampas kopi/teh)',
        ikon: 'pisang', kat: 'organik', judul: 'Sampah Dapur & Kebun (Organik)',
        langkah: ['Pisahkan dari plastik atau karet pengikatnya', 'Tiriskan airnya, lalu masukkan ke kompos ember atau eco-enzyme'],
        alt: 'Bisa langsung diolah jadi pupuk atau pembersih alami.',
        aksi: '<a class="btn kecil" href="olah.html#kompos">Lihat cara kompos →</a>'
      },
      {
        label: 'Ya, ini minyak goreng bekas (jelantah)',
        ikon: 'jelantah', kat: 'anorganik', labelKat: 'Penampungan jelantah · jangan ke wastafel',
        judul: 'Minyak Jelantah',
        langkah: ['Jangan pernah buang ke wastafel atau selokan', 'Tunggu dingin, saring, lalu simpan dalam botol/jeriken tertutup', 'Setorkan ke pengepul jelantah atau bank sampah penerima'],
        alt: 'Kurangi pemakaian minyak berulang dan tukar jelantah jadi saldo.',
        aksi: '<a class="btn kecil" href="setor.html#siapkan">Persiapan setor →</a>'
      },
      {
        label: 'Ya, ada tulang, daging, kuah santan, atau sisa lemak',
        ikon: 'tulang', kat: 'residu', judul: 'Sisa Lauk Berlemak / Tulang',
        langkah: ['Tiriskan air/kuahnya dulu supaya tidak berbau di tempat sampah', 'Jangan masukkan ke kompos ember kos biasa karena mengundang belatung', 'Bungkus rapat lalu masukkan ke tong residu (atau pengolah maggot BSF)'],
        alt: 'Ambil porsi lauk secukupnya agar tidak bersisa.',
        aksi: ''
      }
    ]
  },
  {
    id: 'kemasan',
    label: 'Kemasan, plastik, kertas, kaleng, atau kaca',
    contoh: 'Botol, gelas cup, wadah makan, dus pizza, kertas, kaleng',
    ikon: 'botol',
    tanya2: 'Bagaimana kondisi barangnya sekarang?',
    opsi2: [
      {
        label: 'Bersih / bisa dibilas air dan dikeringkan',
        ikon: 'botol', kat: 'anorganik', judul: 'Kemasan Bersih Siap Daur Ulang',
        langkah: ['Kosongkan isinya dan bilas sebentar agar tidak bau', 'Keringkan dan pipihkan/lipat supaya tidak makan tempat', 'Kumpulkan terpisah untuk disetor ke bank sampah'],
        alt: 'Pakai wadah guna ulang seperti tumbler atau kotak makan sendiri.',
        aksi: '<a class="btn kecil" href="setor.html#siapkan">Siapkan untuk bank sampah →</a>'
      },
      {
        label: 'Kena minyak parah / berlapis aluminium foil atau plastik (kertas nasi, cup kertas, sachet)',
        ikon: 'kertas-minyak', kat: 'residu', judul: 'Kemasan Kotor Minyak / Berlapis',
        langkah: ['Buang sisa makanan di dalamnya', 'Kertas berminyak & kemasan berlapis (sachet/paper cup) tidak bisa masuk daur ulang biasa, masukkan ke tong residu'],
        alt: 'Bawa wadah sendiri atau minta kemasan terpisah saat beli makan.',
        aksi: '<a class="btn kecil" href="kurangi.html">Hitung pengurangannya →</a>'
      }
    ]
  },
  {
    id: 'khusus',
    label: 'Baterai, elektronik, obat, benda tajam, atau aerosol',
    contoh: 'Lampu, charger, obat kedaluwarsa, silet, pecahan beling, korek',
    ikon: 'baterai',
    tanya2: 'Mana yang paling cocok dengan barang di tanganmu?',
    opsi2: [
      {
        label: 'Baterai, lampu, kabel/charger rusak, atau kaleng semprot',
        ikon: 'baterai', kat: 'b3', judul: 'Limbah Elektronik & Berbahaya (B3)',
        langkah: ['Jangan dibuang campur sampah rumah, jangan dibakar atau dilubangi', 'Simpan terpisah di wadah tertutup/kardus bekas', 'Antar ke drop point B3 / e-waste terdekat'],
        alt: 'Pakai baterai isi ulang dan rawat kabel agar awet.',
        aksi: '<a class="btn kecil" href="setor.html#tempat">Cari tempat setor B3 →</a>'
      },
      {
        label: 'Obat kedaluwarsa (pil, kapsul, sirup)',
        ikon: 'obat', kat: 'b3', judul: 'Obat Kedaluwarsa',
        langkah: ['Jangan pernah tuang sirup atau buang pil ke wastafel/kloset', 'Kembalikan ke apotek yang menerima atau serahkan ke drop point B3'],
        alt: 'Beli dan simpan obat secukupnya sesuai resep.',
        aksi: '<a class="btn kecil" href="setor.html#tempat">Cari tempat setor B3 →</a>'
      },
      {
        label: 'Pecahan beling/keramik, silet, pisau cukur, atau jarum',
        ikon: 'pecahan', kat: 'b3', labelKat: 'Benda tajam · wajib dibungkus aman',
        judul: 'Benda Tajam & Pecahan Berbahaya',
        langkah: ['Jangan dibuang langsung di kantong plastik tipis', 'Masukkan ke kaleng/botol bekas keras atau bungkus kardus berlapis', 'Tulis jelas "AWAS BELING / TAJAM" di luar bungkusan agar petugas aman'],
        alt: 'Pilih alat cukur logam (safety razor) dan wadah tahan pecah.',
        aksi: ''
      }
    ]
  },
  {
    id: 'sekali-pakai',
    label: 'Tisu, popok, pembalut, masker, atau kotak styrofoam',
    contoh: 'Barang kebersihan diri atau pembungkus sekali pakai kotor',
    ikon: 'tisu',
    tanya2: 'Barang mana yang ingin kamu buang?',
    opsi2: [
      {
        label: 'Tisu, masker, popok, atau pembalut bekas',
        ikon: 'masker', kat: 'residu', judul: 'Sampah Kebersihan Sekali Pakai',
        langkah: ['Untuk popok/pembalut: buang kotoran ke kloset lalu gulung rapat', 'Untuk masker: gunting talinya supaya tidak menjerat hewan', 'Masukkan ke tong residu (jangan dicampur kompos atau daur ulang)'],
        alt: 'Gunakan saputangan kain, masker kain, atau pembalut/popok kain.',
        aksi: '<a class="btn kecil" href="kurangi.html">Lihat penggantinya →</a>'
      },
      {
        label: 'Kotak styrofoam atau sachet kopi/bumbu',
        ikon: 'styrofoam', kat: 'residu', judul: 'Styrofoam / Sachet Berlapis',
        langkah: ['Bersihkan sisa makanan/cairannya', 'Masukkan ke tong residu, atau khusus sachet bersih & kering bisa dijadikan Ecobrick'],
        alt: 'Bawa wadah makan sendiri dan pilih kemasan isi besar.',
        aksi: '<a class="btn kecil" href="olah.html#ecobrick">Lihat cara buat Ecobrick →</a>'
      }
    ]
  }
];

JN.pasangCari = form => {
  const input = $('input', form), hasil = $('.hasil', form);
  // tombol hapus sendiri (menggantikan tanda × bawaan browser)
  $('.baris', form).insertAdjacentHTML('beforeend', '<button type="button" class="hapus-cari" aria-label="Hapus pencarian" hidden>×</button>');
  const hapus = $('.hapus-cari', form);
  hapus.addEventListener('click', () => { input.value = ''; tampil(''); input.focus(); });

  // Sisipkan tombol & panel Wizard 2-Klik setelah contoh saran pencarian
  const saran = $('.saran', form);
  const wizardHTML = `
    <div class="wizard-bungkus">
      <button type="button" class="btn-wizard" aria-expanded="false">
        <span aria-hidden="true">?</span> Bingung ketik apa? Jawab 2 pertanyaan singkat →
      </button>
      <div class="wizard-panel" hidden aria-live="polite"></div>
    </div>`;
  if (saran) saran.insertAdjacentHTML('afterend', wizardHTML);
  else hasil.insertAdjacentHTML('beforebegin', wizardHTML);

  const btnWizard = $('.btn-wizard', form), panelWizard = $('.wizard-panel', form);

  function gambarKartuHasil(cfg) {
    const k = JN.KAT[cfg.kat];
    const subLabel = cfg.labelKat || `Masuk tong ${k.nama.toLowerCase()} · ${k.ke.toLowerCase()}`;
    return `<div class="jawaban" style="--w:${k.warna}">
      <div class="jawaban-visual" aria-hidden="true">
        <span class="jv-barang">${JN.svg(cfg.ikon)}</span>
        <span class="tong-kecil${cfg.kat === 'anorganik' ? '' : ' putih-teks'}"><span class="bibir"></span><span class="badan">${k.nama}</span></span>
      </div>
      <div class="jawaban-isi">
        <span class="label">${subLabel}</span>
        <strong>${cfg.judul}</strong>
        <ol>${cfg.langkah.map(l => `<li>${l}</li>`).join('')}</ol>
        <p><b>Penggantinya:</b> ${cfg.alt}</p>
        <div>${cfg.aksi || ''}</div>
      </div>
    </div>`;
  }

  function bukaWizard(paksaBuka) {
    const buka = paksaBuka !== undefined ? paksaBuka : panelWizard.hidden;
    panelWizard.hidden = !buka;
    btnWizard.setAttribute('aria-expanded', buka);
    if (buka) gambarLangkah1();
  }

  function gambarLangkah1() {
    panelWizard.innerHTML = `
      <div class="wizard-kepala">
        <span class="label">Pertanyaan 1 dari 2</span>
        <strong>Sampah di tanganmu paling mirip yang mana?</strong>
      </div>
      <div class="wizard-opsi">${WIZARD_ALUR.map((item, idx) => `
        <button type="button" class="wizard-pilihan" data-w1="${idx}">
          <span class="w-ikon">${JN.svg(item.ikon)}</span>
          <span><b>${item.label}</b><small>${item.contoh}</small></span>
        </button>`).join('')}
      </div>`;
    $$('[data-w1]', panelWizard).forEach(b => b.addEventListener('click', () => gambarLangkah2(+b.dataset.w1)));
  }

  function gambarLangkah2(idx1) {
    const grup = WIZARD_ALUR[idx1];
    panelWizard.innerHTML = `
      <div class="wizard-kepala">
        <span class="label">Pertanyaan 2 dari 2 · ${grup.label}</span>
        <strong>${grup.tanya2}</strong>
      </div>
      <div class="wizard-opsi tunggal">${grup.opsi2.map((op, idx2) => `
        <button type="button" class="wizard-pilihan" data-w2="${idx2}">
          <span class="w-ikon">${JN.svg(op.ikon)}</span>
          <span><b>${op.label}</b></span>
        </button>`).join('')}
      </div>
      <div class="wizard-bawah"><button type="button" class="tombol-teks" data-wulang>← Ganti pilihan pertama</button></div>`;
    $('[data-wulang]', panelWizard).addEventListener('click', gambarLangkah1);
    $$('[data-w2]', panelWizard).forEach(b => b.addEventListener('click', () => gambarHasilWizard(grup.opsi2[+b.dataset.w2])));
  }

  function gambarHasilWizard(res) {
    panelWizard.innerHTML = `
      ${gambarKartuHasil(res)}
      <div class="wizard-bawah">
        <button type="button" class="tombol-teks" data-wreset>↺ Tanya barang lain lagi</button>
        <button type="button" class="tombol-teks" data-wtutup>Tutup pemandu</button>
      </div>`;
    $('[data-wreset]', panelWizard).addEventListener('click', gambarLangkah1);
    $('[data-wtutup]', panelWizard).addEventListener('click', () => bukaWizard(false));
    JN.eks('senang', 1600); JN.lompat();
    JN.jejak.ubah(d => { d.pilah.cari = true; });
  }

  btnWizard.addEventListener('click', () => bukaWizard());

  function jawaban(b, lain) {
    return `${gambarKartuHasil({
      ikon: b.ikon, kat: b.kat, labelKat: b.labelKat, judul: b.nama,
      langkah: b.langkah, alt: b.alt, aksi: AKSI_KATEGORI[b.kat](b)
    })}
    ${lain.length ? `<div class="mungkin"><span>Mungkin maksudmu:</span>${lain.map(x => `<button type="button" data-pilih="${x.id}">${x.nama}</button>`).join('')}</div>` : ''}`;
  }

  function tampil(q, pilihId) {
    hapus.hidden = !q;
    if (!JN.norm(q)) { hasil.innerHTML = ''; return; }
    let cocok = JN.cariBarang(q);
    if (pilihId) cocok = [JN.byId[pilihId], ...cocok.filter(b => b.id !== pilihId)];
    hasil.innerHTML = cocok.length ? jawaban(cocok[0], cocok.slice(1, 5))
      : `<div class="kosong-kotak">
          <p class="kosong">Belum ketemu persis untuk “${JN.esc(JN.norm(q))}”. Nggak apa-apa — pakai tanya cepat 2 klik supaya langsung ketahuan tongnya, atau <a href="kontak.html?jenis=barang">usulkan barang ini</a>.</p>
          <button type="button" class="btn kecil" data-buka-wizard>Jawab 2 pertanyaan untuk “${JN.esc(JN.norm(q))}” →</button>
        </div>`;
    $$('[data-pilih]', hasil).forEach(t => t.addEventListener('click', () => tampil(q, t.dataset.pilih)));
    const pemicuWizard = $('[data-buka-wizard]', hasil);
    if (pemicuWizard) pemicuWizard.addEventListener('click', () => {
      bukaWizard(true);
      panelWizard.scrollIntoView({ behavior: JN.kurangGerak ? 'auto' : 'smooth', block: 'nearest' });
    });
    JN.eks(cocok.length ? 'senang' : 'bingung', cocok.length ? 1500 : 2200);
    if (cocok.length) JN.jejak.ubah(d => { d.pilah.cari = true; });
  }

  input.addEventListener('input', e => tampil(e.target.value));
  form.addEventListener('submit', e => { e.preventDefault(); tampil(input.value); });
  $$('[data-cari]', form).forEach(b => b.addEventListener('click', () => { input.value = b.dataset.cari; tampil(b.dataset.cari); }));
};

/* ---------- jelajah ruangan ---------- */
JN.pasangJelajah = root => {
  root.innerHTML = `<div class="tab-daftar" role="tablist" aria-label="Ruangan">${JN.RUANG.map(([id, n], i) =>
    `<button role="tab" id="tab-${id}" aria-selected="${i === 0}" aria-controls="rak" data-ruang="${id}">${n}</button>`).join('')}</div>
    <div class="jelajah-isi"><div class="rak kertas selotip" id="rak" role="tabpanel"></div><div class="detail kertas selotip" aria-live="polite"></div></div>`;
  const rak = $('.rak', root), detail = $('.detail', root);
  function tampil(b, diklik) {
    $$('.barang', rak).forEach(x => x.setAttribute('aria-pressed', x.dataset.id === b.id));
    if (diklik) JN.jejak.ubah(d => { if (!d.pilah.dilihat.includes(b.id)) d.pilah.dilihat.push(b.id); });
    let aksi = '';
    if (b.hitung) aksi = JN.kalkulatorPenuh
      ? `<div><button type="button" class="btn kecil" data-tambah="${b.id}">Hitung di Kurangi →</button></div>`
      : `<div><a class="btn kecil" href="kurangi.html?tambah=${b.id}">Hitung di Kurangi →</a></div>`;
    else if (b.kat === 'b3') aksi = `<div><a class="btn kecil putih" href="setor.html#tempat">Tempat setor B3 →</a></div>`;
    detail.innerHTML = `<span class="label">${JN.RUANG.find(r => r[0] === b.ruang)[1]}</span><h3>${b.nama}</h3>
      <span><span class="chip k-${b.kat}">Tong ${JN.KAT[b.kat].nama}</span></span>
      <span class="label">Cara menyiapkan</span><ol>${b.langkah.map(l => `<li>${l}</li>`).join('')}</ol>
      <p class="alt"><strong>Penggantinya:</strong> ${b.alt}</p>${aksi}`;
    const t = $('[data-tambah]', detail);
    if (t) t.addEventListener('click', () => JN.kalkulatorPenuh.tambah(t.dataset.tambah, true));
  }
  function pilih(id) {
    $$('[role="tab"]', root).forEach(t => t.setAttribute('aria-selected', t.dataset.ruang === id));
    rak.setAttribute('aria-labelledby', 'tab-' + id);
    const isi = JN.BARANG.filter(b => b.ruang === id);
    rak.innerHTML = isi.map((b, i) => `<button class="barang" data-id="${b.id}" aria-pressed="false" style="--i:${i}">${JN.svg(b.ikon)}<span>${b.nama}</span></button>`).join('');
    $$('.barang', rak).forEach(el => el.addEventListener('click', () => tampil(JN.byId[el.dataset.id], true)));
    tampil(isi[0]);
  }
  $$('[role="tab"]', root).forEach(t => t.addEventListener('click', () => pilih(t.dataset.ruang)));
  pilih('dapur');
};

/* ---------- kalkulator Kurangi (rumus sama dengan rancangan/hitung.js) ----------
   ringkas: satu baris saja (Beranda), tanpa tambah barang dan tanpa mencatat jejak */
JN.PER = { hari: 365, minggu: 52, bulan: 12 };
JN.SANGGUP = [[0, 'Belum bisa'], [0.25, 'Kadang-kadang'], [0.5, 'Sering'], [0.75, 'Hampir selalu'], [1, 'Selalu']];
JN.pasangKalkulator = (root, opsi = {}) => {
  const ringkas = !!opsi.ringkas, fmt = JN.fmt, byId = JN.byId;
  const awal = id => { const h = byId[id].hitung; return { id, jumlah: h.jumlah, per: h.per, k: h.k }; };
  let baris = ringkas ? ['botol'].map(awal)
    : ((simpan.ambil('jejaknol:baris') || []).filter(r => byId[r.id] && byId[r.id].hitung && JN.PER[r.per]));
  if (!baris.length) baris = ['botol', 'kresek', 'gelas'].map(awal);

  root.innerHTML = `<div class="hitung">
    <form class="form-hitung kertas selotip" aria-label="Kebiasaanmu"></form>
    <div class="panel-hasil kertas selotip">
      <span class="cap">Hasil per tahun</span>
      <div aria-live="polite"><div class="angka">0</div><p class="angka-sub">barang sekali pakai tidak jadi sampah</p></div>
      <div class="dua-tumpukan">
        <div class="tumpukan-wadah"><span class="judul-t">Sekarang · <b data-n="sekarang">0</b></span><div class="tumpukan" data-t="sekarang" aria-hidden="true"></div></div>
        <div class="tumpukan-wadah"><span class="judul-t">Setelah ganti · <b data-n="setelah">0</b></span><div class="tumpukan setelah" data-t="setelah" aria-hidden="true"></div></div>
      </div>
      <p class="keterangan">Setiap ikon = 10 barang sekali pakai dalam setahun.</p>
      ${ringkas ? `<div class="ringkas-lanjut"><a class="btn kecil" href="kurangi.html">Hitung semua kebiasaanmu →</a></div>` : `
      <p class="kelompok">Kalau satu kelas (40 orang) melakukan hal yang sama: <b data-n="kelompok">0</b> barang per tahun tidak jadi sampah.</p>
      <p class="catatan-jejak">Janjimu otomatis tercatat dan akan masuk ke <a href="kartu.html">Kartu Jejak-ku</a> di akhir perjalanan.</p>`}
    </div></div>`;
  const form = $('form', root);

  function gambarForm() {
    const sisa = JN.BARANG.filter(b => b.hitung && !baris.some(r => r.id === b.id));
    form.innerHTML = baris.map(r => { const b = byId[r.id], h = b.hitung; return `
      <fieldset class="kebiasaan" data-baris="${r.id}">
        <legend>${JN.svg(b.ikon)}<span>${b.nama}</span></legend>
        ${!ringkas && baris.length > 1 ? `<button type="button" class="hapus" data-hapus="${r.id}" aria-label="Hapus ${b.nama} dari hitungan">×</button>` : ''}
        <div class="tanya">
          <label for="j-${r.id}">① Berapa banyak kamu pakai?</label>
          <div class="kontrol">
            <span class="stepper"><button type="button" data-ubah="${r.id}" data-n="-1" aria-label="Kurangi jumlah ${b.nama}">−</button><output id="j-${r.id}">${r.jumlah}</output><button type="button" data-ubah="${r.id}" data-n="1" aria-label="Tambah jumlah ${b.nama}">+</button></span>
            <label class="sr" for="p-${r.id}">Satuan waktu untuk ${b.nama}</label>
            <select id="p-${r.id}" data-per="${r.id}">${Object.keys(JN.PER).map(p => `<option value="${p}" ${p === r.per ? 'selected' : ''}>${h.satuan} per ${p}</option>`).join('')}</select>
          </div>
        </div>
        <div class="tanya">
          <label for="k-${r.id}">② Kalau diganti <b>${h.ganti}</b>, seberapa sering kamu sanggup?</label>
          <select id="k-${r.id}" data-k="${r.id}">${JN.SANGGUP.map(([v, l]) => `<option value="${v}" ${v === r.k ? 'selected' : ''}>${l}</option>`).join('')}</select>
        </div>
        <p class="hasil-baris" data-hb="${r.id}"></p>
      </fieldset>`; }).join('') + (!ringkas && sisa.length ? `
      <div class="tambah"><label for="tambah-barang">+ Tambah barang lain</label>
        <select id="tambah-barang"><option value="">Pilih barang…</option>${sisa.map(b => `<option value="${b.id}">${b.nama}</option>`).join('')}</select></div>` : '');
  }
  function tambah(id, gulir) {
    if (!byId[id] || !byId[id].hitung) return;
    if (!baris.some(r => r.id === id)) { baris.push(awal(id)); gambarForm(); hitung(true); }
    if (gulir) {
      root.scrollIntoView({ behavior: JN.kurangGerak ? 'auto' : 'smooth', block: 'start' });
      const fs = $(`[data-baris="${id}"]`, root); fs.classList.add('sorot'); setTimeout(() => fs.classList.remove('sorot'), 1800);
    }
  }
  form.addEventListener('submit', e => e.preventDefault());
  form.addEventListener('click', e => {
    const u = e.target.closest('[data-ubah]'), h = e.target.closest('[data-hapus]');
    if (u) { const r = baris.find(x => x.id === u.dataset.ubah); r.jumlah = Math.max(0, Math.min(30, r.jumlah + +u.dataset.n)); $('#j-' + r.id, root).textContent = r.jumlah; hitung(); }
    if (h) { baris = baris.filter(x => x.id !== h.dataset.hapus); gambarForm(); hitung(true); }
  });
  form.addEventListener('change', e => {
    const t = e.target;
    if (t.dataset.per) { baris.find(x => x.id === t.dataset.per).per = t.value; hitung(); }
    if (t.dataset.k) { baris.find(x => x.id === t.dataset.k).k = +t.value; hitung(); }
    if (t.id === 'tambah-barang' && t.value) tambah(t.value, false);
  });

  let lalu = null, jeda, hasil = [];
  const tumpuk = (el, daftar) => {
    const ikon = [];
    daftar.forEach(([n, jml]) => { for (let i = 0; i < Math.round(jml / 10); i++) ikon.push(n); });
    el.innerHTML = ikon.slice(0, 110).map((n, i) => `<svg viewBox="0 0 48 48" style="--i:${i}">${JN.IKON[n]}</svg>`).join('');
  };
  function hitung(diam) {
    hasil = baris.map(r => {
      const b = byId[r.id], sekarang = r.jumlah * JN.PER[r.per], dicegah = Math.round(sekarang * r.k);
      return { r, b, sekarang, dicegah, setelah: sekarang - dicegah };
    });
    hasil.forEach(x => { $(`[data-hb="${x.r.id}"]`, root).innerHTML = `Sekarang <b>${fmt(x.sekarang)}</b> → setelah ganti <b>${fmt(x.setelah)}</b> ${x.b.hitung.satuan} per tahun`; });
    const totS = hasil.reduce((s, x) => s + x.sekarang, 0), tot = hasil.reduce((s, x) => s + x.dicegah, 0);
    $('.angka', root).textContent = fmt(tot);
    $('[data-n="sekarang"]', root).textContent = fmt(totS);
    $('[data-n="setelah"]', root).textContent = fmt(totS - tot);
    const kel = $('[data-n="kelompok"]', root); if (kel) kel.textContent = fmt(tot * 40);
    if (!diam && lalu !== null && tot !== lalu) {
      if (tot > lalu) { JN.eks('senang', 1600); JN.lompat(); JN.bilang(`Mantap! ${fmt(tot)} barang tidak jadi sampah.`); }
      else { JN.eks('kaget', 1400); JN.bilang('Pelan-pelan juga nggak apa-apa. Yang penting mulai.'); }
    }
    lalu = tot;
    if (!ringkas) {
      simpan.taruh(KUNCI_BARIS, baris);
      // kalkulator selalu bisa dipakai; janji baru dicatat sebagai jejak kalau langkah Pilah sudah selesai
      if (!diam && JN.jejak.terbuka('kurangi')) JN.jejak.ubah(d => { d.kurangi.janji = hasil.some(x => x.r.k > 0); });
    }
    clearTimeout(jeda);
    jeda = setTimeout(() => {
      tumpuk($('[data-t="sekarang"]', root), hasil.map(x => [x.b.ikon, x.sekarang]));
      tumpuk($('[data-t="setelah"]', root), hasil.map(x => [x.b.ikon, x.setelah]));
    }, 120);
  }
  gambarForm(); hitung(true);
  return { tambah };
};

/* ---------- dekorasi & gerak bersama ---------- */
function pasangSobek() {
  $$('[data-sobek]').forEach((sec, s) => {
    const r = JN.acak(31 + s * 7);
    const tepi = () => {
      let d = 'M0,22 L0,' + (8 + r() * 8).toFixed(1);
      for (let x = 0; x <= 1200; x += 14 + r() * 22) d += ` L${x.toFixed(0)},${(3 + r() * 13).toFixed(1)}`;
      return d + ' L1200,' + (6 + r() * 8).toFixed(1) + ' L1200,22 Z';
    };
    sec.insertAdjacentHTML('afterbegin',
      `<svg class="sobek atas" viewBox="0 0 1200 22" preserveAspectRatio="none" aria-hidden="true"><path d="${tepi()}"/></svg>` +
      `<svg class="sobek bawah" viewBox="0 0 1200 22" preserveAspectRatio="none" aria-hidden="true"><path d="${tepi()}"/></svg>`);
  });
}
function pasangPita() {
  const pita = $$('[data-pita]');
  pita.forEach(p => { p.textContent = p.textContent.repeat(3); });
  if (!pita.length || JN.kurangGerak) return;
  let tunggu = false;
  addEventListener('scroll', () => {
    if (tunggu) return; tunggu = true;
    requestAnimationFrame(() => { tunggu = false; pita.forEach(p => { p.style.transform = `translateX(${-((scrollY * 0.25) % 600)}px)`; }); });
  }, { passive: true });
}

document.addEventListener('DOMContentLoaded', () => {
  const tMenu = $('#tombol-menu'), menu = $('#menu');
  if (tMenu) {
    tMenu.addEventListener('click', () => { const b = menu.classList.toggle('buka'); tMenu.setAttribute('aria-expanded', b); });
    $$('a', menu).forEach(a => a.addEventListener('click', () => { menu.classList.remove('buka'); tMenu.setAttribute('aria-expanded', false); }));
  }
  $$('[data-kardi]').forEach(el => {
    el.innerHTML = JN.kardiSVG(el.dataset.kardi === 'lambai');
    if (['senang', 'bingung', 'kaget'].includes(el.dataset.kardi)) el.firstElementChild.dataset.eks = el.dataset.kardi;
  });
  pasangSobek(); pasangPita(); pasangTeman();
  $$('form.cari').forEach(JN.pasangCari);
  const diam = new IntersectionObserver(ent => ent.forEach(e => e.target.classList.toggle('diam', !e.isIntersecting)), { rootMargin: '120px 0px' });
  $$('.bagian').forEach(b => diam.observe(b));
  if (JN.mulai) JN.mulai();
  JN.jejak.tampilkan();
});
})();
