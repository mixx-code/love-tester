function hitungJodoh(nama1, nama2) {
  const [namaA, namaB] = [nama1, nama2].sort();
  const gabungan = (namaA + namaB).toLowerCase();
  const hurufSudah = [];
  const angka = [];

  for (let i = 0; i < gabungan.length; i++) {
    const huruf = gabungan[i];
    if (!hurufSudah.includes(huruf)) {
      const jumlah = [...gabungan].filter((h) => h === huruf).length;
      angka.push(jumlah);
      hurufSudah.push(huruf);
    }
  }

  function pecahAngka(n) {
    return n >= 10 ? [Math.floor(n / 10), n % 10] : [n];
  }

  function reduksi(arr) {
    while (arr.join("").length > 2) {
      const hasil = [];
      let i = 0,
        j = arr.length - 1;
      while (i <= j) {
        const jumlah = i === j ? arr[i] : arr[i] + arr[j];
        hasil.push(...pecahAngka(jumlah));
        i++;
        j--;
      }
      arr = hasil;
    }
    return arr;
  }

  const hasilAkhir = reduksi(angka);
  return parseInt(hasilAkhir.join(""), 10);
}

function simpanRiwayat(nama1, nama2, hasil) {
  const now = new Date();
  const tanggal = `${now.getDate().toString().padStart(2, "0")} - ${(
    now.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")} - ${now.getFullYear()}`;
  const riwayat = JSON.parse(localStorage.getItem("riwayatJodoh")) || [];
  riwayat.unshift({ nama1, nama2, hasil, waktu: tanggal });
  localStorage.setItem("riwayatJodoh", JSON.stringify(riwayat.slice(0, 10))); // Simpan max 10
}

function tampilkanRiwayat() {
  const riwayat = JSON.parse(localStorage.getItem("riwayatJodoh")) || [];
  const container = document.getElementById("riwayatTabel");

  if (riwayat.length === 0) {
    container.innerHTML = "<p>Belum ada riwayat.</p>";
    return;
  }

  let html = `
      <table>
        <thead>
          <tr>
            <th>Nama 1</th>
            <th>Nama 2</th>
            <th>Hasil</th>
            <th>Waktu</th>
          </tr>
        </thead>
        <tbody>
    `;

  riwayat.forEach((item) => {
    html += `
        <tr>
          <td>${item.nama1}</td>
          <td>${item.nama2}</td>
          <td>${item.hasil}%</td>
          <td>${item.waktu}</td>
        </tr>
      `;
  });

  html += "</tbody></table>";
  container.innerHTML = html;
}

function cekJodoh() {
  const nama1 = document.getElementById("nama1").value.trim();
  const nama2 = document.getElementById("nama2").value.trim();

  if (!nama1 || !nama2) {
    Swal.fire({
      icon: "warning",
      title: "Isi Nama Dulu 😅",
      text: "Kedua nama harus diisi dulu ya 💡",
    });
    return;
  }

  const persentase = hitungJodoh(nama1, nama2);
  let pesan = "";

  if (persentase >= 80) {
    pesan = "Wah kalian kayak kunci dan gembok yang pas banget! 🔐💕";
  } else if (persentase >= 60) {
    pesan = "Udah mirip couple-couple FYP TikTok 💃🕺";
  } else if (persentase >= 40) {
    pesan = "Bisa jadi cocok... asal gak baper duluan ya 😜";
  } else {
    pesan =
      "Cinta memang tak harus memiliki... tapi siapa tahu besok beda cerita? 😅";
  }

  // 💖 Tampilkan progress bar lucu dalam SweetAlert2
  Swal.fire({
    title: `❤️ 0% Cocok Banget! ❤️`,
    html: `
  <div class="circular-progress" style="--value:${persentase};">
    <span class="value-text">${persentase}%</span>
  </div>
  <br>
  <strong>${nama1}</strong> & <strong>${nama2}</strong><br><br>
  <i>"${pesan}"</i><br><br>
  🌟 Cinta itu misteri... tapi kalian kayaknya serasi! 🌟

  <style>
    .circular-progress {
      --size: 120px;
      --thickness: 10px;
      --color: #ff69b4;
      width: var(--size);
      height: var(--size);
      border-radius: 50%;
      background: conic-gradient(
        var(--color) calc(var(--value) * 1%),
        #eee 0
      );
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto;
      position: relative;
    }

    .circular-progress::before {
      content: "";
      width: calc(var(--size) - var(--thickness) * 2);
      height: calc(var(--size) - var(--thickness) * 2);
      border-radius: 50%;
      background: #fff0f6;
      position: absolute;
    }

    .value-text {
      position: relative;
      font-size: 1.3rem;
      font-weight: bold;
      color: #d63384;
    }
  </style>
`,

    confirmButtonText: "Awww 💖",
    background: "#fff0f6",
    color: "#d63384",
    showClass: {
      popup: "animate__animated animate__rubberBand",
    },
    hideClass: {
      popup: "animate__animated animate__fadeOutDown",
    },
    backdrop: `
        rgba(255,192,203,0.4)
        url("https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif")
        left top
        no-repeat
      `,
    didOpen: () => {
      const progress = Swal.getPopup().querySelector(".circular-progress");
      const valueText = Swal.getPopup().querySelector(".value-text");
      const title = Swal.getTitle();

      let current = 0;
      const animate = () => {
        if (current <= persentase) {
          progress.style.setProperty("--value", current);
          valueText.textContent = `${current}%`;
          title.textContent = `❤️ ${current}% Cocok Banget! ❤️`;
          current++;
          requestAnimationFrame(animate);
        }
      };
      animate();
    },
  });

  simpanRiwayat(nama1, nama2, persentase);
  tampilkanRiwayat();
}

document.addEventListener("DOMContentLoaded", tampilkanRiwayat);
