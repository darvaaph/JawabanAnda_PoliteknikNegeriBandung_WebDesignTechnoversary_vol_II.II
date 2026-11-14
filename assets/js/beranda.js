/* Beranda: fakta, jelajah, kalkulator ringkas, cuplikan olah, tong, dan perjalanan satu botol. */
JN.mulai = () => {
  const { $, $$, svg, KAT } = JN;

  $('#fakta').innerHTML = JN.FAKTA.map((f, i) => `<div class="isi-data"><span class="label">Fakta ${i + 1}</span><strong>${f.angka}</strong><p>${f.isi}</p><small>Sumber: ${f.sumber}</small></div>`).join('');
  JN.pasangJelajah($('#jelajah'));
  JN.pasangKalkulator($('#kalkulator'), { ringkas: true });

  const cuplikan = [JN.DIY.find(d => d.id === 'pot-botol'), ...JN.PANDUAN];
  $('#cuplikan-olah').innerHTML = cuplikan.map(o => `<article class="kartu-isi kertas selotip">${svg(o.ikon, '', 'ilus')}<h3>${o.judul}</h3>
    <div class="meta"><span>${o.tingkat}</span><span>${o.waktu}</span></div>
    <p>${o.langkah[0]}</p><a class="tautan-lanjut" href="olah.html#${o.id}">Baca panduannya →</a></article>`).join('');

  const TONG = [['organik', ['pisang', 'daun']], ['anorganik', ['kardus', 'kaleng']], ['b3', ['baterai', 'lampu']], ['residu', ['sachet', 'styrofoam']]];
  $('#tong-daftar').innerHTML = TONG.map(([k, isi]) => `
    <div class="tong t-${k}" style="--w:${KAT[k].warna}">
      <div class="isi-tong" aria-hidden="true">${isi.map(i => svg(JN.byId[i].ikon)).join('')}</div>
      ${k === 'anorganik' ? '<span class="singgah" data-singgah aria-hidden="true"></span>' : ''}
      <div class="bibir"></div><div class="badan"><strong>${KAT[k].nama}</strong><span>${KAT[k].ke}</span></div>
    </div>`).join('');

  /* Perjalanan satu botol: berhenti di titik singgah (judul tiap langkah) dan ikut tergulir,
     lalu melambung ke titik berikutnya saat titik itu mendekat. Titik terakhir di dalam tong anorganik. */
  const botol = $('#botol-jalan'), singgah = $$('[data-singgah]');
  botol.innerHTML = svg('botol');
  if (JN.kurangGerak) { singgah.forEach(s => { s.innerHTML = svg('botol'); }); botol.hidden = true; return; }
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
    if (akhir && !sudahMasuk) {
      const tong = $('.tong.t-anorganik');
      tong.classList.remove('goyang'); tong.getBoundingClientRect(); tong.classList.add('goyang');
      JN.eks('senang', 2200); JN.lompat();
    }
    sudahMasuk = akhir;
  }
  const minta = () => { if (!menunggu) { menunggu = true; requestAnimationFrame(gambar); } };
  addEventListener('scroll', minta, { passive: true });
  addEventListener('resize', minta);
  document.fonts?.ready.then(minta);
  minta();
};
