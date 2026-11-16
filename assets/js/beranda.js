/* Beranda: fakta, garis jalan 4 langkah, dan perjalanan satu botol.
   Beranda hanya bercerita. Alat lengkapnya ada di halaman Pilah, Kurangi, Olah, dan Setor. */
JN.mulai = () => {
  const { $, $$, svg } = JN;

  pasangTong100();
  $('#botol-dalam').innerHTML = svg('botol');

  /* garis putus-putus yang menyambungkan titik singgah di jalan 4 langkah */
  const jalan = $('#jalan-isi'), garis = $('#garis-jalan');
  function gambarGaris() {
    const kotak = jalan.getBoundingClientRect();
    const titik = $$('[data-singgah]', jalan).map(el => { const r = el.getBoundingClientRect(); return [r.left + r.width / 2 - kotak.left, r.top + r.height / 2 - kotak.top]; });
    let d = `M${titik[0][0]},${titik[0][1]}`;
    for (let i = 1; i < titik.length; i++) {
      const [x0, y0] = titik[i - 1], [x1, y1] = titik[i], dy = (y1 - y0) / 2;
      d += ` C${x0},${y0 + dy} ${x1},${y1 - dy} ${x1},${y1}`;
    }
    garis.setAttribute('d', d);
  }

  /* Perjalanan satu botol: diam di titik singgah dan ikut tergulir, lalu melambung ke titik berikutnya
     saat titik itu mendekat. Titik terakhir di tong kecil pada langkah Setor: botol "masuk" ke tong. */
  const botol = $('#botol-jalan'), singgah = $$('[data-singgah]'), tong = $('#tong-mini');
  botol.innerHTML = svg('botol');
  /* Pengguna "kurangi gerakan": tetap satu botol yang mengikuti scroll, tapi lurus saja
     (tanpa lambung, putaran, atau goyang tong) supaya ceritanya tetap sampai. */
  const tenang = JN.kurangGerak;
  const batas = t => Math.min(1, Math.max(0, t)), halus = t => t * t * (3 - 2 * t);
  let menunggu = false, sudahMasuk = false;
  function gambar() {
    menunggu = false;
    const y = scrollY, s = y + innerHeight * 0.55;
    const titik = singgah.map(el => { const r = el.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2, doc: r.top + r.height / 2 + y, w: r.width }; });
    const n = titik.length - 1;
    let x, yy, w, putar = 0, akhir = false;
    if (s <= titik[0].doc) ({ x, y: yy, w } = titik[0]);
    else if (s >= titik[n].doc) { ({ x, y: yy, w } = titik[n]); akhir = true; }
    else {
      let i = 0; while (s >= titik[i + 1].doc) i++;
      const a = titik[i], b = titik[i + 1];
      const t = halus(batas(((s - a.doc) / (b.doc - a.doc) - 0.3) / 0.5)); // 30% diam, 50% pindah, 20% menunggu
      x = a.x + (b.x - a.x) * t;
      w = a.w + (b.w - a.w) * t;
      yy = a.y + (b.y - a.y) * t - (tenang ? 0 : Math.sin(Math.PI * t) * 70);
      putar = tenang ? 0 : Math.sin(Math.PI * t) * 30;
      akhir = i + 1 === n && t >= 1;
    }
    const uk = botol.offsetWidth;
    const skala = Math.min(1, (w * 1.15) / uk); // mengecil saat masuk kotak tong 100 sampah
    botol.style.transform = `translate3d(${(x - uk / 2).toFixed(1)}px,${(yy - uk / 2).toFixed(1)}px,0) rotate(${putar.toFixed(1)}deg) scale(${skala.toFixed(3)})`;
    botol.classList.toggle('masuk', akhir);
    tong.classList.toggle('terisi', akhir);
    if (akhir && !sudahMasuk) {
      if (!tenang) { tong.classList.remove('goyang'); tong.getBoundingClientRect(); tong.classList.add('goyang'); }
      JN.eks('senang', 2200); JN.lompat();
    }
    sudahMasuk = akhir;
  }
  const minta = () => { if (!menunggu) { menunggu = true; requestAnimationFrame(gambar); } };
  addEventListener('scroll', minta, { passive: true });
  addEventListener('resize', () => { gambarGaris(); minta(); });
  document.fonts?.ready.then(() => { gambarGaris(); minta(); });
  gambarGaris(); minta();

  /* Hook "100 sampah di tong": tong terisi saat digulir (botol dari hero jatuh ke salah satu kotaknya),
     lalu tombol "Pilah isinya!" mengelompokkan isinya jadi tiga, masing-masing menuju satu langkah. */
  function pasangTong100() {
    const grid = $('#t100-grid');
    if (!grid) return;
    const K = JN.KOMPOSISI, urutKat = ['organik', 'anorganik', 'residu'];
    const sel = K.flatMap((k, ki) => Array.from({ length: k.jumlah }, (_, i) => ({ k, ki, ikon: k.ikon[i % k.ikon.length] })));
    const acak = JN.acak(12);
    const campur = sel.map(s => [acak(), s]).sort((a, b) => a[0] - b[0]).map(x => x[1]);
    /* kotak tempat botol mendarat: botol plastik pertama mulai baris kedua */
    const iBotol = campur.findIndex((s, i) => i >= 12 && s.ikon === 'botol');
    const terurut = [...campur].sort((a, b) => urutKat.indexOf(a.k.kat) - urutKat.indexOf(b.k.kat) || a.ki - b.ki
      || (b === campur[iBotol]) - (a === campur[iBotol]));
    grid.innerHTML = campur.map((s, i) => i === iBotol
      ? `<span class="t100-sel t100-botol" data-jenis="${s.k.id}" data-singgah style="--w:${JN.KAT[s.k.kat].warna};--i:${i}"></span>`
      : `<span class="t100-sel" data-jenis="${s.k.id}" style="--w:${JN.KAT[s.k.kat].warna};--i:${i}">${svg(s.ikon)}</span>`).join('');
    const sels = $$('.t100-sel', grid);
    const pesan = $('#t100-pesan'), tahap = $('#t100-tahap'), tPilah = $('#t100-pilah'), kelompok = $('#t100-kelompok');
    const jml = kat => K.filter(k => k.kat === kat).reduce((s, k) => s + k.jumlah, 0);
    const besar = [...K].sort((a, b) => b.jumlah - a.jumlah);
    const sebut = k => `${k.nama.toLowerCase()} (${k.jumlah})`;

    pesan.innerHTML = `<p>Paling banyak <strong>${sebut(besar[0])}</strong>, lalu ${sebut(besar[1])} dan ${sebut(besar[2])}.</p>
      <p>Semuanya tercampur di satu tong, jadi sulit diolah. Coba pilah:</p>`;

    /* tong terisi satu per satu saat terlihat */
    if (JN.kurangGerak || !('IntersectionObserver' in window)) grid.classList.add('isi');
    else new IntersectionObserver((e, o) => { if (e[0].isIntersecting) { grid.classList.add('isi'); o.disconnect(); } }, { threshold: 0.25 }).observe(grid);

    tPilah.addEventListener('click', () => {
      const awal = sels.map(el => el.getBoundingClientRect());
      const posisi = new Map(terurut.map((s, i) => [s, i]));
      sels.forEach((el, i) => { el.style.order = posisi.get(campur[i]); });
      grid.classList.add('isi', 'terpilah');
      if (!JN.kurangGerak) {
        sels.forEach((el, i) => {
          const b = el.getBoundingClientRect(), dx = awal[i].left - b.left, dy = awal[i].top - b.top;
          el.animate([{ transform: `translate(${dx}px,${dy}px)` }, { transform: 'none' }],
            { duration: 700, delay: (i % 10) * 18, easing: 'cubic-bezier(.3,1.2,.5,1)', fill: 'backwards' });
        });
      }
      /* botol ikut pindah bersama kotaknya */
      const sampai = performance.now() + 1000;
      (function ikut() { minta(); if (performance.now() < sampai) requestAnimationFrame(ikut); })();
      kelompok.innerHTML = urutKat.map(kat => {
        const arah = JN.KOMPOSISI_ARAH[kat], l = JN.LANGKAH.find(x => x.id === arah.langkah), no = JN.LANGKAH.indexOf(l) + 1;
        return `<a class="t100-k" href="${l.url}" style="--w:${JN.KAT[kat].warna}"><b>${jml(kat)}</b>
          <span>${JN.KAT[kat].nama}: ${arah.judul}</span><span class="t100-ke">Langkah ${no}: ${l.nama} →</span></a>`;
      }).join('');
      kelompok.hidden = false;
      tahap.textContent = 'Sesudah dipilah';
      pesan.innerHTML = `<p><strong>Hanya ${jml('residu')} dari 100 yang benar-benar sulit diolah.</strong> Sisanya, ${jml('organik')} organik dan ${jml('anorganik')} anorganik, masih punya jalan keluar asal dipilah sejak di rumah. Botol tadi masuk kelompok anorganik.</p>
        <p>Barusan kamu sudah melakukan langkah pertama: memilah. <a href="#jalan">Lihat keempat langkahnya ↓</a></p>`;
      tPilah.hidden = true; $('.t100-coret').hidden = true;
      grid.setAttribute('aria-label', `100 sampah sudah dipilah: ${urutKat.map(k => `${jml(k)} ${JN.KAT[k].nama.toLowerCase()}`).join(', ')}.`);
      JN.eks('senang', 2200); JN.lompat();
    });

    $('#t100-sumber').innerHTML = JN.KOMPOSISI_CONTOH
      ? '<span class="belum">Angka contoh, belum dari sumber resmi. Ganti dengan komposisi sampah SIPSN KLHK sebelum dikumpulkan (assets/js/data.js).</span>'
      : `Sumber: ${JN.esc(JN.KOMPOSISI_SUMBER)}. Dibulatkan ke 100.`;
  }
};
