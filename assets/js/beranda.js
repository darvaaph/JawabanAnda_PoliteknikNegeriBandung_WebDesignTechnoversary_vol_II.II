/* Beranda: fakta, garis jalan 4 langkah, dan perjalanan satu botol.
   Beranda hanya bercerita. Alat lengkapnya ada di halaman Pilah, Kurangi, Olah, dan Setor. */
JN.mulai = () => {
  const { $, $$, svg } = JN;

  $('#fakta').innerHTML = JN.FAKTA.map((f, i) => `<div class="isi-data"><span class="label">Fakta ${i + 1}</span><strong>${f.angka}</strong><p>${f.isi}</p><small>Sumber: ${f.sumber}</small></div>`).join('');
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
  if (JN.kurangGerak) {
    singgah.slice(0, -1).forEach(s => { s.innerHTML = svg('botol'); });
    tong.classList.add('terisi'); botol.hidden = true;
    gambarGaris(); addEventListener('resize', gambarGaris);
    return;
  }
  const batas = t => Math.min(1, Math.max(0, t)), halus = t => t * t * (3 - 2 * t);
  let menunggu = false, sudahMasuk = false;
  function gambar() {
    menunggu = false;
    const y = scrollY, s = y + innerHeight * 0.55;
    const titik = singgah.map(el => { const r = el.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2, doc: r.top + r.height / 2 + y }; });
    const n = titik.length - 1;
    let x, yy, putar = 0, akhir = false;
    if (s <= titik[0].doc) ({ x, y: yy } = titik[0]);
    else if (s >= titik[n].doc) { ({ x, y: yy } = titik[n]); akhir = true; }
    else {
      let i = 0; while (s >= titik[i + 1].doc) i++;
      const a = titik[i], b = titik[i + 1];
      const t = halus(batas(((s - a.doc) / (b.doc - a.doc) - 0.3) / 0.5)); // 30% diam, 50% pindah, 20% menunggu
      x = a.x + (b.x - a.x) * t;
      yy = a.y + (b.y - a.y) * t - Math.sin(Math.PI * t) * 70;
      putar = Math.sin(Math.PI * t) * 30;
      akhir = i + 1 === n && t >= 1;
    }
    const uk = botol.offsetWidth;
    botol.style.transform = `translate3d(${(x - uk / 2).toFixed(1)}px,${(yy - uk / 2).toFixed(1)}px,0) rotate(${putar.toFixed(1)}deg)`;
    botol.classList.toggle('masuk', akhir);
    tong.classList.toggle('terisi', akhir);
    if (akhir && !sudahMasuk) {
      tong.classList.remove('goyang'); tong.getBoundingClientRect(); tong.classList.add('goyang');
      JN.eks('senang', 2200); JN.lompat();
    }
    sudahMasuk = akhir;
  }
  const minta = () => { if (!menunggu) { menunggu = true; requestAnimationFrame(gambar); } };
  addEventListener('scroll', minta, { passive: true });
  addEventListener('resize', () => { gambarGaris(); minta(); });
  document.fonts?.ready.then(() => { gambarGaris(); minta(); });
  gambarGaris(); minta();
};
