/* Beranda: fakta, garis jalan 4 langkah, dan perjalanan satu botol.
   Beranda hanya bercerita. Alat lengkapnya ada di halaman Pilah, Kurangi, Olah, dan Setor. */
JN.mulai = () => {
  const { $, $$, svg } = JN;

  pasangCerita();
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
    /* Titik biasa: botol tiba dan berangkat di posisi yang sama (masuk = keluar).
       Titik ber-data-singgah-tahan (kotak di tong cerita): botol tiba saat bagian cerita mulai terbaca
       dan baru berangkat saat seluruh teks cerita lewat; selama itu botol ikut kotaknya yang menempel. */
    const titik = singgah.map(el => {
      const r = el.getBoundingClientRect(), doc = r.top + r.height / 2 + y;
      const tahan = el.dataset.singgahTahan && document.querySelector(el.dataset.singgahTahan);
      return { x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width,
        masuk: tahan ? tahan.getBoundingClientRect().top + y : doc,
        keluar: tahan ? tahan.getBoundingClientRect().bottom + y : doc };
    });
    const n = titik.length - 1;
    let x, yy, w, putar = 0, akhir = false;
    if (s <= titik[0].masuk) ({ x, y: yy, w } = titik[0]);
    else if (s >= titik[n].masuk) { ({ x, y: yy, w } = titik[n]); akhir = true; }
    else {
      let i = 0; while (s >= titik[i + 1].masuk) i++;
      const a = titik[i], b = titik[i + 1];
      if (s <= a.keluar) ({ x, y: yy, w } = a);
      else {
        const t = halus(batas(((s - a.keluar) / (b.masuk - a.keluar) - 0.3) / 0.5)); // 30% diam, 50% pindah, 20% menunggu
        x = a.x + (b.x - a.x) * t;
        w = a.w + (b.w - a.w) * t;
        yy = a.y + (b.y - a.y) * t - (tenang ? 0 : Math.sin(Math.PI * t) * 70);
        putar = tenang ? 0 : Math.sin(Math.PI * t) * 30;
        akhir = i + 1 === n && t >= 1;
      }
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

  /* Cerita "tong sampah Indonesia" (scrollytelling): tong menempel, teks bergulir per tahap.
     Tahap: kosong → isi → makanan → plastik → lain → pilah. Setiap tahap hanya mengganti data-tahap
     di panggung (gaya diatur CSS); tahap "pilah" juga mengurutkan kotak dengan animasi FLIP. */
  function pasangCerita() {
    const grid = $('#t100-grid'), panggung = $('#panggung');
    if (!grid) return;
    const K = JN.KOMPOSISI, urutKat = ['organik', 'anorganik', 'residu'];
    const sel = K.flatMap((k, ki) => Array.from({ length: k.jumlah }, (_, i) => ({ k, ki, ikon: k.ikon[i % k.ikon.length] })));
    const acak = JN.acak(12);
    const campur = sel.map(s => [acak(), s]).sort((a, b) => a[0] - b[0]).map(x => x[1]);
    const iBotol = campur.findIndex((s, i) => i >= 12 && s.ikon === 'botol'); // kotak tempat botol mendarat
    const terurut = [...campur].sort((a, b) => urutKat.indexOf(a.k.kat) - urutKat.indexOf(b.k.kat) || a.ki - b.ki
      || (b === campur[iBotol]) - (a === campur[iBotol]));
    const posisi = new Map(terurut.map((s, i) => [s, i]));
    grid.innerHTML = campur.map((s, i) => i === iBotol
      ? `<span class="t100-sel t100-botol" data-jenis="${s.k.id}" data-singgah data-singgah-tahan="#masalah .cerita" style="--w:${JN.KAT[s.k.kat].warna};--i:${i}"></span>`
      : `<span class="t100-sel" data-jenis="${s.k.id}" style="--w:${JN.KAT[s.k.kat].warna};--i:${i}">${svg(s.ikon)}</span>`).join('');
    const sels = $$('.t100-sel', grid);
    const jml = kat => K.filter(k => k.kat === kat).reduce((s, k) => s + k.jumlah, 0);
    const dari = id => (K.find(k => k.id === id) || {}).jumlah;

    /* angka di teks selalu ikut data */
    $$('[data-jml]').forEach(el => { const v = dari(el.dataset.jml); if (v != null) el.textContent = v; });
    $('#t100-pesan').innerHTML = `<strong>Hanya ${jml('residu')} dari 100 yang benar-benar sulit diolah.</strong> Sisanya, ${jml('organik')} organik dan ${jml('anorganik')} anorganik, masih punya jalan keluar asal dipilah sejak di rumah. Botol tadi masuk kelompok anorganik.`;
    $('#t100-kelompok').innerHTML = urutKat.map(kat => {
      const arah = JN.KOMPOSISI_ARAH[kat], l = JN.LANGKAH.find(x => x.id === arah.langkah), no = JN.LANGKAH.indexOf(l) + 1;
      return `<a class="t100-k" href="${l.url}" style="--w:${JN.KAT[kat].warna}"><b>${jml(kat)}</b>
        <span>${JN.KAT[kat].nama}: ${arah.judul}</span><span class="t100-ke">Langkah ${no}: ${l.nama} →</span></a>`;
    }).join('');
    $('#t100-sumber').innerHTML = JN.KOMPOSISI_CONTOH
      ? '<span class="belum">Angka contoh, belum dari sumber resmi.</span>'
      : `1 kotak = 1% berat sampah.<span class="sumber-panjang"> Sumber: ${JN.esc(JN.KOMPOSISI_SUMBER)}.</span>`;

    const LABEL = {
      kosong: 'Tong sampah kosong',
      isi: '100 kotak sampah tercampur di satu tong',
      makanan: `${dari('makanan')} dari 100 kotak adalah sisa makanan`,
      plastik: `${dari('plastik')} dari 100 kotak adalah plastik`,
      lain: 'Sisanya kertas, ranting, logam, kaca, kain, dan lainnya, semua tercampur',
      pilah: `Sudah dipilah: ${urutKat.map(k => `${jml(k)} ${JN.KAT[k].nama.toLowerCase()}`).join(', ')}`
    };
    let terpilah = false, kini = 'kosong';
    function urut(pilah) {
      if (pilah === terpilah) return;
      terpilah = pilah;
      const awal = sels.map(el => el.getBoundingClientRect());
      sels.forEach((el, i) => { el.style.order = pilah ? posisi.get(campur[i]) : ''; });
      if (!JN.kurangGerak) sels.forEach((el, i) => {
        const b = el.getBoundingClientRect(), dx = awal[i].left - b.left, dy = awal[i].top - b.top;
        if (dx || dy) el.animate([{ transform: `translate(${dx}px,${dy}px)` }, { transform: 'none' }],
          { duration: 700, delay: (i % 10) * 18, easing: 'cubic-bezier(.3,1.2,.5,1)', fill: 'backwards' });
      });
      const sampai = performance.now() + 1000; // botol ikut pindah bersama kotaknya
      (function ikut() { minta(); if (performance.now() < sampai) requestAnimationFrame(ikut); })();
    }
    const tahap = $$('#masalah .tahap');
    function aktif(t) {
      if (t === kini) return;
      kini = t; panggung.dataset.tahap = t;
      tahap.forEach(el => el.classList.toggle('aktif', el.dataset.tahap === t));
      grid.setAttribute('aria-label', LABEL[t]);
      urut(t === 'pilah');
      if (t === 'makanan') JN.eks('kaget', 1800);
      if (t === 'pilah') { JN.eks('senang', 2200); JN.lompat(); }
    }
    /* HP: "langkah ketuk". Satu kartu tahap tampil di bawah tong, pindah dengan tombol Kembali/Lanjut. */
    const hp = matchMedia('(max-width:860px)');
    const urutan = tahap.map(el => el.dataset.tahap);
    const kontrol = document.createElement('div');
    kontrol.className = 'cerita-kontrol';
    kontrol.innerHTML = `<button type="button" class="btn putih kecil" data-arah="-1">← Kembali</button>
      <span class="cerita-titik" aria-hidden="true">${urutan.map(() => '<span></span>').join('')}</span>
      <button type="button" class="btn kecil" data-arah="1">Lanjut →</button>`;
    $('#masalah .cerita-teks').append(kontrol);
    const [tKembali, tLanjut] = $$('button', kontrol);
    function segarkanKontrol() {
      const i = Math.max(0, urutan.indexOf(kini));
      tKembali.disabled = i === 0;
      tLanjut.textContent = i === urutan.length - 1 ? '4 langkah ↓' : 'Lanjut →';
      $$('.cerita-titik span', kontrol).forEach((s, k) => s.classList.toggle('kini', k === i));
    }
    /* ajakan untuk pengunjung baru: tombol Lanjut berdenyut + petunjuk geser, hilang setelah interaksi pertama */
    const ajak = document.createElement('p');
    ajak.className = 'cerita-ajak';
    ajak.innerHTML = 'Geser kartu ke kiri atau ketuk <b>Lanjut</b> untuk melihat isi tong berikutnya.';
    kontrol.after(ajak);
    tLanjut.classList.add('berdenyut');
    function geser(arah, dariTombol) {
      ajak.hidden = true; tLanjut.classList.remove('berdenyut');
      const i = Math.max(0, urutan.indexOf(kini)) + arah;
      if (i >= urutan.length) {
        if (dariTombol) $('#jalan').scrollIntoView({ behavior: JN.kurangGerak ? 'auto' : 'smooth' });
        return;
      }
      aktif(urutan[Math.max(0, i)]); segarkanKontrol();
    }
    $$('button', kontrol).forEach(b => b.addEventListener('click', () => geser(Number(b.dataset.arah), true)));
    /* geser (swipe) kiri/kanan di area cerita, hanya di HP dan hanya bila gerakannya jelas mendatar */
    let awalX = null, awalY = 0;
    const cerita = $('#masalah .cerita');
    cerita.addEventListener('touchstart', e => { if (hp.matches) { awalX = e.touches[0].clientX; awalY = e.touches[0].clientY; } }, { passive: true });
    cerita.addEventListener('touchend', e => {
      if (awalX == null) return;
      const dx = e.changedTouches[0].clientX - awalX, dy = e.changedTouches[0].clientY - awalY;
      awalX = null;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) geser(dx < 0 ? 1 : -1, false);
    }, { passive: true });

    if (!('IntersectionObserver' in window)) { aktif(hp.matches ? 'isi' : 'pilah'); segarkanKontrol(); return; }
    /* desktop: tahap aktif = tahap terakhir yang bagian atasnya sudah melewati garis tengah layar (aman untuk lompatan jauh) */
    const garis = 0.5;
    const hitung = () => {
      if (hp.matches) return;
      const g = innerHeight * garis;
      const lewat = tahap.filter(el => el.getBoundingClientRect().top <= g);
      aktif(lewat.length ? lewat[lewat.length - 1].dataset.tahap : 'kosong');
    };
    /* dipicu oleh scroll (bukan IntersectionObserver): pita pengamat setipis 1% bisa terpicu sesaat sebelum
       bagian atas tahap melewati garis, lalu tidak terpicu lagi, sehingga tahap pertama tetap redup */
    let hitungMenunggu = false;
    const hitungRaf = () => { if (hitungMenunggu) return; hitungMenunggu = true; requestAnimationFrame(() => { hitungMenunggu = false; hitung(); }); };
    addEventListener('scroll', hitungRaf, { passive: true });
    addEventListener('resize', hitungRaf);
    hitung();
    /* HP: tong terisi saat pertama kali terlihat */
    new IntersectionObserver(es => {
      if (hp.matches && kini === 'kosong' && es.some(e => e.isIntersecting)) { aktif('isi'); segarkanKontrol(); }
    }, { threshold: 0.35 }).observe(panggung);
    hp.addEventListener('change', () => { if (hp.matches) { if (kini === 'kosong') aktif('isi'); segarkanKontrol(); } else hitung(); });
    segarkanKontrol();
  }
};
