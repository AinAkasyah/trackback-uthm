// Simulasi Penyimpanan Berasaskan Fail Berasingan (Menggunakan localStorage)
let currentPasswordSim = localStorage.getItem('sim_password') || "uthm123";
let isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

// Fungsi berjalan secara automatik pada setiap halaman untuk set menu ikutan status login terkini
document.addEventListener("DOMContentLoaded", function() {
    updateNavbarUI();
});

function updateNavbarUI() {
    const guestBanner = document.getElementById('guestBanner');
    if (guestBanner) {
        guestBanner.style.display = isLoggedIn ? 'none' : 'block';
    }

    const desktopItems = [
        'nav-report-lost',
        'nav-report-found',
        'nav-search',
        'nav-contact'
    ];

    const mobileItems = [
        'mobile-report-lost',
        'mobile-report-found',
        'mobile-search',
        'mobile-contact'
    ];

    // TEXT FOR DESKTOP + MOBILE
    desktopItems.forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;

        if (isLoggedIn) {
            el.innerText = el.innerText.replace(" 🔒", "");
        } else {
            if (!el.innerText.includes("🔒")) {
                el.innerText += " 🔒";
            }
        }
    });

    mobileItems.forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;

        if (isLoggedIn) {
            el.innerText = el.innerText.replace(" 🔒", "");
        } else {
            if (!el.innerText.includes("🔒")) {
                el.innerText += " 🔒";
            }
        }
    });

    // AUTH BUTTONS
    const authBtn = document.getElementById('nav-auth-btn');
    const mobileAuthBtn = document.getElementById('mobile-auth-btn');

    // ===== LOGIN STATE =====
    if (isLoggedIn) {

        // DESKTOP LOGIN → LOGOUT
        if (authBtn) {
            authBtn.innerText = "Logout";
            authBtn.className = "btn-logout";
            authBtn.onclick = handleLogout;
        }

        // MOBILE LOGIN → LOGOUT
        if (mobileAuthBtn) {
            mobileAuthBtn.style.display = "block";

            if (isLoggedIn) {
                mobileAuthBtn.innerText = "Logout";
                mobileAuthBtn.classList.remove("login-state");
                mobileAuthBtn.classList.add("logout-state");

                mobileAuthBtn.onclick = function () {
                    handleLogout();
                    toggleMobileMenu();
                };

            } else {
                mobileAuthBtn.innerText = "Login";
                mobileAuthBtn.classList.remove("logout-state");
                mobileAuthBtn.classList.add("login-state");

                mobileAuthBtn.onclick = function () {
                    window.location.href = "login.html";
                };
            }
        }

    // ===== LOGOUT STATE =====
    } else {

        if (authBtn) {
            authBtn.innerText = "Login";
            authBtn.className = "btn-login-nav";
            authBtn.onclick = function () {
                window.location.href = "login.html";
            };
        }

        if (mobileAuthBtn) {
            mobileAuthBtn.style.display = "block";

            if (isLoggedIn) {
                mobileAuthBtn.innerText = "Logout";
                mobileAuthBtn.classList.remove("login-state");
                mobileAuthBtn.classList.add("logout-state");

                mobileAuthBtn.onclick = function () {
                    handleLogout();
                    toggleMobileMenu();
                };

            } else {
                mobileAuthBtn.innerText = "Login";
                mobileAuthBtn.classList.remove("logout-state");
                mobileAuthBtn.classList.add("login-state");

                mobileAuthBtn.onclick = function () {
                    window.location.href = "login.html";
                };
            }
        }
    }
}

// FUNGSI SEKATAN NAVIGASI BORANG / ELEMEN BUTTON
function protectedNavigation(targetPageUrl) {
    if (!isLoggedIn && targetPageUrl !== 'index.html') {
        alert("🔒 Features Blocked! Please log in to UTHM account first.");
        window.location.href = 'login.html';
    } else {
        window.location.href = targetPageUrl;
    }
}

// FUNGSI SEKATAN MENU ATAS (Digunakan pada element HTML 'onclick')
function checkAccess(event, targetPageUrl) {
    if (!isLoggedIn) {
        event.preventDefault(); // Batalkan perpindahan pautan href asal
        alert("🔒 Features Blocked! Please log in to UTHM account first.");
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// FUNGSI SEKATAN KAD BARANG RECENT ITEMS
function protectedItemDetails(title, location, type, image) {
    if (!isLoggedIn) {
        alert("🔒 Please log in to view full detail and claim this goods.");
        window.location.href = 'login.html';
    } else {
        localStorage.setItem('click_title', title);
        localStorage.setItem('click_location', location);
        localStorage.setItem('click_date', "10 Jun 2026");
        localStorage.setItem('click_type', type);
        localStorage.setItem('click_image', image);

        window.location.href = 'details.html';
    }
}

// SIMULASI PROSES LOGIN + SEMAKAN PASSWORD
function handleLogin() {
    const inputPass = document.getElementById('loginPassword').value;
    const errorToast = document.getElementById('loginError');

    if (inputPass !== currentPasswordSim) {
        if(errorToast) errorToast.style.display = 'block';
        return;
    }

    isLoggedIn = true;
    localStorage.setItem('isLoggedIn', 'true');
    if(errorToast) errorToast.style.display = 'none';
    alert('Log in successful! Welcome back to TrackBack.');
    window.location.href = 'index.html';
}

// PROSES BUAT PASSWORD BAHARU
function handleResetPassword() {
    const newPass = document.getElementById('newPass').value;
    const confirmPass = document.getElementById('confirmNewPass').value;
    const resetError = document.getElementById('resetError');

    if(newPass !== confirmPass) {
        if(resetError) resetError.style.display = 'block';
        return;
    }

    currentPasswordSim = newPass;
    localStorage.setItem('sim_password', newPass);
    if(resetError) resetError.style.display = 'none';
    alert('New password has been updated! Please login again.');
    window.location.href = 'login.html';
}

// PROSES LOGOUT
function handleLogout() {
    isLoggedIn = false;
    localStorage.removeItem('isLoggedIn');
    alert('Anda telah berjaya log keluar.');
    window.location.href = 'index.html';
}

// Fungsi tukar multi-step borang (Wizard)
function switchStep(currentStepId, nextStepId) {
    const current = document.getElementById(currentStepId);
    const next = document.getElementById(nextStepId);
    if(current && next) {
        current.classList.remove('active-step');
        next.classList.add('active-step');
    }
}

function toggleMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    if(menu) menu.classList.toggle('active');
}

// Fungsi collapse navigation bar bila resizing
window.addEventListener("resize", function () {
    const menu = document.getElementById("mobileMenu");

    // If screen becomes desktop size, force close menu
    if (window.innerWidth > 768) {
        if (menu && menu.classList.contains("active")) {
            menu.classList.remove("active");
        }
    }
});