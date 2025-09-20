const navLinks = document.getElementById('nav-links');
const loginUser = JSON.parse(localStorage.getItem('loginUser'));
const currentPage = window.location.pathname.split('/').pop();
const protectedPages = ['asuransiMobil.html', 'asuransiKesehatan.html', 'asuransiJiwa.html', 'checkout.html', 'riwayat.html'];
const tabelRiwayat = document.querySelector('#tabelRiwayat tbody');
const productCards = document.querySelectorAll('.product-card');

if (protectedPages.includes(currentPage) && !loginUser) {
    alert('Anda harus login terlebih dahulu untuk mengakses halaman ini.');
    window.location.href = 'login.html';
}

if (loginUser) {
    navLinks.innerHTML = `
    <div class="user-info">
        <a href="histori.html">Riwayat</a>
        <button id="logout-button">Log Out</button>
    </div>
    `;
    document.getElementById('logout-button').addEventListener('click', () => {
        localStorage.removeItem('loginUser');
        alert('Anda telah logout.');
        window.location.href="home.html";
    });
} else {
    navLinks.innerHTML = `
        <a href="login.html">Log In</a>
        <a href="signup.html">Sign Up</a>
    `;
}

if (tabelRiwayat) {
    if (loginUser) {
        const userKey = `history_${loginUser.email}`;
        const riwayat = JSON.parse(localStorage.getItem(userKey)) || [];

        if (riwayat.length === 0) {
            tabelRiwayat.innerHTML = '<tr><td colspan="5" style="text-align:center;">Anda belum melakukan pembelian.</td></tr>';
        } else {
            tabelRiwayat.innerHTML = '';
            riwayat.forEach(item => {
                const baris = `
                    <tr>
                        <td>${item.produk}</td>
                        <td>${item.tanggal}</td>
                        <td>${item.premi.toLocaleString('id-ID')}</td>
                        <td>${item.metode || '-'}</td>
                        <td class="status-lunas">${item.status}</td>
                    </tr>
                `;
                tabelRiwayat.innerHTML += baris;
            });
        }
    }
}

productCards.forEach(card => {
    card.addEventListener('click', (e) => {
        if (!loginUser) {
            e.preventDefault();
            alert('Anda harus login terlebih dahulu untuk melanjutkan.');
            window.location.href = 'login.html';
        }
    });
});