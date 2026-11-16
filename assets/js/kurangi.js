/* Kurangi: kalkulator lengkap (termasuk chip barang + penggantinya) dan janji tercatat ke jejak. */
JN.mulai = () => {
  const { $ } = JN;
  const kalk = JN.kalkulatorPenuh = JN.pasangKalkulator($('#kalkulator'));

  // datang dari "Hitung di Kurangi →" di halaman lain: kurangi.html?tambah=botol
  const tambah = new URLSearchParams(location.search).get('tambah');
  if (tambah) kalk.tambah(tambah, true);
};
