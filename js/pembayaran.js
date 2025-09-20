const mobilForm = document.getElementById('formMobil');
const kesehatanForm = document.getElementById('formKesehatan');
const jiwaForm = document.getElementById('formJiwa');
const hasilPremiDiv = document.getElementById('hasilPremi');
const hargaPremiP = document.getElementById('hargaPremi');
const checkoutBtn = document.getElementById('checkoutBtn');

let currentPurchase = {};

const displayPremium = (premi, product, period) => {
    hargaPremiP.textContent = `Rp ${premi.toLocaleString('id-ID')}`;
    hasilPremiDiv.style.display = 'block';
    checkoutBtn.style.display = 'inline-block';
    currentPurchase = { produk: product, premi: premi, period: period };
};

if (mobilForm) {
    mobilForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const harga = parseFloat(document.getElementById('mobil-harga').value);
        const tahun = parseInt(document.getElementById('mobil-tahun').value);
        const umurMobil = new Date().getFullYear() - tahun;
        let premi = 0;

        if (umurMobil <= 3) {
            premi = 0.025 * harga;
        } else if (umurMobil > 3 && umurMobil <= 5) {
            premi = (harga < 200000000) ? 0.04 * harga : 0.03 * harga;
        } else {
            premi = 0.05 * harga;
        }
        displayPremium(premi, 'Asuransi Mobil', 'per Tahun');
    });
}

if (kesehatanForm) {
    kesehatanForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const tglLahir = new Date(document.getElementById('kesehatan-lahir').value);
        const umur = new Date().getFullYear() - tglLahir.getFullYear();
        const k1 = parseInt(document.getElementById('kesehatan-rokok').value);
        const k2 = parseInt(document.getElementById('kesehatan-hipertensi').value);
        const k3 = parseInt(document.getElementById('kesehatan-diabetes').value);
        const P = 2000000;
        let m = 0;

        if (umur <= 20) m = 0.1;
        else if (umur > 20 && umur <= 35) m = 0.2;
        else if (umur > 35 && umur <= 50) m = 0.25;
        else m = 0.4;
            
        const premi = P + (m * P) + (k1 * 0.5 * P) + (k2 * 0.4 * P) + (k3 * 0.5 * P);
        displayPremium(premi, 'Asuransi Kesehatan', 'per Tahun');
    });
}

if (jiwaForm) {
    jiwaForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const tglLahir = new Date(document.getElementById('jiwa-lahir').value);
        const umur = new Date().getFullYear() - tglLahir.getFullYear();
        const t = parseFloat(document.getElementById('jiwa-tanggungan').value);
        let m = 0;

        if (umur <= 30) m = 0.002;
        else if (umur > 30 && umur <= 50) m = 0.004;
        else m = 0.01;

        const premi = m * t;
        displayPremium(premi, 'Asuransi Jiwa', 'per Bulan');
    });
}

if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
        localStorage.setItem('currentPurchase', JSON.stringify(currentPurchase));
        window.location.href = 'checkout.html';
    });
}

const bayarBtn = document.getElementById('bayarBtn');
if (bayarBtn) {
    const paymentOptions = document.querySelectorAll('.payment-option');
    const paymentError = document.getElementById('paymentError');
    let selectedPaymentMethod = null;

    paymentOptions.forEach(option => {
        option.addEventListener('click', () => {
            paymentOptions.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
            selectedPaymentMethod = option.getAttribute('data-method');
            paymentError.style.display = 'none';
        });
    });

    const dataPembelian = JSON.parse(localStorage.getItem('currentPurchase'));
    if (dataPembelian) {
        document.getElementById('checkout-produk').textContent = dataPembelian.produk;
        document.getElementById('checkout-premi').textContent = `Rp ${dataPembelian.premi.toLocaleString('id-ID')} ${dataPembelian.period}`;
        
        bayarBtn.addEventListener('click', () => {
            if (!selectedPaymentMethod) {
                paymentError.textContent = 'Silakan pilih metode pembayaran terlebih dahulu.';
                paymentError.style.display = 'block';
                return;
            }

            const loginUser = JSON.parse(localStorage.getItem('loginUser')); 
            if (!loginUser) {
                alert('Sesi Anda berakhir, silakan login kembali.');
                window.location.href = 'login.html';
                return;
            }

            const userHistoryKey = `history_${loginUser.email}`; 
            const history = JSON.parse(localStorage.getItem(userHistoryKey)) || [];
            
            const newPurchase = {
                ...dataPembelian,
                metode: selectedPaymentMethod,
                tanggal: new Date().toLocaleDateString('id-ID', { day:'numeric', month: 'long', year:'numeric' }),
                status: 'Lunas'
            };
            history.push(newPurchase);
            localStorage.setItem(userHistoryKey, JSON.stringify(history));
            localStorage.removeItem('currentPurchase');

            alert('Pembayaran Berhasil! Anda akan diarahkan ke halaman riwayat.');
            window.location.href = 'histori.html'; 
        });
    }
}