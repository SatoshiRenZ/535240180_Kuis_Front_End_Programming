const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const fullName = document.getElementById('fullName');
const phone = document.getElementById('phone');
const email = document.getElementById('email');
const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirmPassword');

const showError = (input, message) => {
    const formGroup = input.parentElement;
    const errorElement = formGroup.querySelector('.error-message')
    errorElement.style.display = 'block';
    errorElement.textContent = message;
};

const clearErrors = (form) => {
    const errorMessages = form.querySelectorAll('.error-message');
    errorMessages.forEach(msg => {
        msg.style.display = 'none';
        msg.textContent = '';
    });
};

if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        clearErrors(signupForm);
        let isValid = true;

        if (fullName.value.trim().length < 3 || fullName.value.trim().length > 32) {
            showError(fullName, 'Nama lengkap harus 3-32 karakter.');
            isValid = false;
        } else {
            let nameHasNumber = false;
            for (const char of fullName.value) {
                if (!isNaN(char) && char !== ' ') {
                    nameHasNumber = true;
                    break;
                }
            }
            if (nameHasNumber) {
                showError(fullName, 'Nama lengkap tidak boleh mengandung angka.');
                isValid = false;
            }
        }

        const phoneValue = phone.value;
        let phoneIsAllDigits = true;
        for (const char of phoneValue) {
            if (isNaN(char)) {
                phoneIsAllDigits = false;
                break;
            }
        }
        if (!phoneValue.startsWith('08') || !(phoneValue.length >= 10 && phoneValue.length <= 16) || !phoneIsAllDigits) {
            showError(phone, 'Format no. HP: 08xx, 10-16 digit angka.');
            isValid = false;
        }

        const emailValue = email.value;
        const atIndex = emailValue.indexOf('@');
        const dotIndex = emailValue.lastIndexOf('.');
        if (atIndex < 1 || dotIndex < atIndex + 2 || dotIndex === emailValue.length - 1 || emailValue.includes(' ')) {
            showError(email, 'Format email tidak valid.');
            isValid = false;
        }

        if (password.value.length < 8) {
            showError(password, 'Kata sandi minimal 8 karakter.');
            isValid = false;
        }

        if (password.value !== confirmPassword.value) {
            showError(confirmPassword, 'Konfirmasi kata sandi tidak sesuai.');
            isValid = false;
        }

        if (isValid) {
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const userExists = users.some(user => user.email === email.value);

            if (userExists) {
                showError(email, 'Email ini sudah terdaftar.');
            } else {
                const newUser = {
                    fullName: fullName.value.trim(),
                    phone: phone.value,
                    email: email.value,
                    password: password.value
                };
                users.push(newUser);
                localStorage.setItem('users', JSON.stringify(users));
                
                alert('Sign up berhasil! Anda akan dialihkan ke halaman Login.');
                window.location.href = 'login.html';
            }
        }
    });
}

if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        clearErrors(loginForm);

        if (email.value.trim() === '' || password.value.trim() === '') {
            alert('Email dan kata sandi harus diisi.');
            return;
        }

        const emailValue = email.value;
        const atIndex = emailValue.indexOf('@');
        const dotIndex = emailValue.lastIndexOf('.');

        if (atIndex < 1 || dotIndex < atIndex + 2 || dotIndex === emailValue.length - 1 || emailValue.includes(' ')) {
            alert('Format email tidak valid.');
            return;
        }

        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.email === email.value && u.password === password.value);

        if (user) {
            alert(`Login berhasil! Selamat datang, ${user.fullName}.`);
            localStorage.setItem('loginUser', JSON.stringify(user));
            window.location.href = 'home.html';
        } else {
            alert('Login gagal. Email atau kata sandi salah.');
        }
    });
}