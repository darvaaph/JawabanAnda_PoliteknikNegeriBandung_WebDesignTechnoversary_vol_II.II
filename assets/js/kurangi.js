/* Kurangi: kalkulator lengkap, Kartu Janji, daftar pengganti. */
JN.mulai = () => {
  const { $, $$, svg } = JN;
  const kalk = JN.kalkulatorPenuh = JN.pasangKalkulator($('#kalkulator'));

  // datang dari "Hitung di Kurangi →" di halaman lain: kurangi.html?tambah=botol
  const tambah = new URLSearchParams(location.search).get('tambah');
  if (tambah) kalk.tambah(tambah, true);

  $('#daftar-pengganti').innerHTML = JN.BARANG.filter(b => b.hitung).map(b => `
    <article class="kartu-isi kertas">${svg(b.ikon, '', 'ilus')}
      <h3>${b.nama}</h3>
      <p><strong>Ganti dengan:</strong> ${b.hitung.ganti}.</p>
      <p>${b.alt}</p>
      <div><button type="button" class="btn kecil putih" data-tambahkan="${b.id}">Tambahkan ke hitungan</button></div>
    </article>`).join('');
  $$('[data-tambahkan]').forEach(t => t.addEventListener('click', () => kalk.tambah(t.dataset.tambahkan, true)));
};
