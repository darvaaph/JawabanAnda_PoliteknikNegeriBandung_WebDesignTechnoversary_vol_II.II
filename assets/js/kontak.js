/* Kontak: validasi formulir dan pengiriman.
   Supaya pesan benar-benar terkirim, isi atribut data-endpoint pada <form id="form-kontak">
   dengan alamat layanan formulir gratis (mis. Formspree). Lihat README. */
JN.mulai = () => {
  const { $ } = JN;
  const form = $('#form-kontak'), jenis = $('#jenis'), lokasi = $('#medan-lokasi'), terkirim = $('#terkirim');

  const awal = new URLSearchParams(location.search).get('jenis');
  if (awal && [...jenis.options].some(o => o.value === awal)) jenis.value = awal;
  const aturLokasi = () => { lokasi.hidden = jenis.value !== 'lokasi'; };
  jenis.addEventListener('change', aturLokasi); aturLokasi();

  const ATURAN = {
    nama: v => v.trim().length >= 2 || 'Tulis namamu, minimal 2 huruf.',
    email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) || 'Tulis email yang lengkap, contoh: nama@email.com.',
    pesan: v => v.trim().length >= 10 || 'Tulis pesanmu, minimal 10 huruf, supaya kami paham maksudnya.',
    'nama-lokasi': v => jenis.value !== 'lokasi' || v.trim().length >= 3 || 'Tulis nama tempat yang ingin kamu usulkan.'
  };
  function cek(id) {
    const el = $('#' + id), hasil = ATURAN[id](el.value), galat = $('#g-' + id);
    const salah = hasil !== true;
    el.setAttribute('aria-invalid', salah);
    galat.hidden = !salah; galat.textContent = salah ? hasil : '';
    return !salah;
  }
  Object.keys(ATURAN).forEach(id => $('#' + id).addEventListener('blur', () => { if ($('#' + id).value) cek(id); }));

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const salah = Object.keys(ATURAN).filter(id => !cek(id));
    if (salah.length) { $('#' + salah[0]).focus(); JN.eks('bingung', 2000); return; }
    const tombol = $('button[type="submit"]', form);
    tombol.disabled = true; tombol.textContent = 'Mengirim…';
    let teks;
    const endpoint = form.dataset.endpoint;
    if (endpoint) {
      try {
        const r = await fetch(endpoint, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
        if (!r.ok) throw new Error(r.status);
        teks = 'Pesanmu sudah kami terima. Kami akan membalas lewat email dalam beberapa hari.';
      } catch (err) {
        tombol.disabled = false; tombol.textContent = 'Kirim pesan';
        JN.eks('kaget', 2000);
        alertGalat('Pesan belum terkirim karena koneksi bermasalah. Coba kirim lagi sebentar lagi.');
        return;
      }
    } else {
      teks = 'Formulir ini masih versi demo, jadi pesanmu belum dikirim ke tim. Untuk sementara, hubungi kami lewat Instagram atau email di samping.';
    }
    form.hidden = true;
    $('#teks-terkirim').textContent = teks;
    terkirim.hidden = false; terkirim.focus();
    JN.eks('senang', 2000); JN.lompat();
  });
  function alertGalat(t) {
    let g = $('#galat-kirim');
    if (!g) { form.insertAdjacentHTML('beforeend', '<p class="galat" id="galat-kirim" role="alert"></p>'); g = $('#galat-kirim'); }
    g.textContent = t;
  }
  $('#kirim-lagi').addEventListener('click', () => {
    form.reset(); aturLokasi(); terkirim.hidden = true; form.hidden = false;
    const tombol = $('button[type="submit"]', form); tombol.disabled = false; tombol.textContent = 'Kirim pesan';
    $('#nama').focus();
  });
};
