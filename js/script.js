// Smooth scrolling untuk navigasi
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Toggle mobile menu
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });
}

// Header scroll effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Intersection Observer untuk animasi fade-in
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
        }
    });
}, observerOptions);

// Observe semua section
document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});

// Booking form validation dan submit dengan EmailJS
const bookingForm = document.getElementById('bookingForm');

if (bookingForm) {
    bookingForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Simple validation
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const service = document.getElementById('service').value;
        const date = document.getElementById('date').value;
        const time = document.getElementById('time').value;
        const notes = document.getElementById('notes').value.trim();

        if (!name || !email || !phone || !service || !date || !time) {
            alert('Mohon isi semua field yang diperlukan.');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Mohon masukkan email yang valid.');
            return;
        }

        // Phone validation (Indonesian format)
        const phoneRegex = /^(\+62|62|0)[8-9][0-9]{7,11}$/;
        if (!phoneRegex.test(phone.replace(/\s|-/g, ''))) {
            alert('Mohon masukkan nomor telepon yang valid.');
            return;
        }

        // Date validation - pastikan tanggal tidak di masa lalu
        const selectedDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selectedDate < today) {
            alert('Mohon pilih tanggal yang valid (tidak boleh di masa lalu).');
            return;
        }

        // Show loading state
        const submitBtn = document.getElementById('submitBtn');
        const btnText = document.getElementById('btnText');
        const btnLoading = document.getElementById('btnLoading');
        submitBtn.disabled = true;
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline';

        // EmailJS configuration - GANTI DENGAN KREDENSIAL ANDA
        const serviceID = 'YOUR_SERVICE_ID'; // Ganti dengan Service ID EmailJS Anda
        const templateIDOwner = 'YOUR_TEMPLATE_ID_OWNER'; // Template untuk owner
        const templateIDCustomer = 'YOUR_TEMPLATE_ID_CUSTOMER'; // Template untuk customer
        const publicKey = 'YOUR_PUBLIC_KEY'; // Ganti dengan Public Key EmailJS Anda

        // Initialize EmailJS
        emailjs.init(publicKey);

        // Data untuk email owner
        const ownerTemplateParams = {
            customer_name: name,
            customer_email: email,
            customer_phone: phone,
            service: service,
            date: date,
            time: time,
            notes: notes || 'Tidak ada catatan tambahan',
            to_email: 'owner@example.com' // Ganti dengan email owner
        };

        // Data untuk email customer
        const customerTemplateParams = {
            customer_name: name,
            service: service,
            date: date,
            time: time,
            notes: notes || 'Tidak ada catatan tambahan',
            to_email: email
        };

        // Kirim email ke owner
        emailjs.send(serviceID, templateIDOwner, ownerTemplateParams)
            .then(function(response) {
                console.log('Email ke owner berhasil dikirim!', response.status, response.text);

                // Kirim email ke customer
                return emailjs.send(serviceID, templateIDCustomer, customerTemplateParams);
            })
            .then(function(response) {
                console.log('Email ke customer berhasil dikirim!', response.status, response.text);

                // Reset form dan tampilkan success message
                bookingForm.reset();
                alert('Terima kasih! Booking Anda telah berhasil. Kami telah mengirim konfirmasi ke email Anda dan akan menghubungi Anda segera.');
            })
            .catch(function(error) {
                console.error('Gagal mengirim email:', error);
                alert('Maaf, terjadi kesalahan saat mengirim booking. Silakan coba lagi atau hubungi kami langsung.');
            })
            .finally(function() {
                // Reset button state
                submitBtn.disabled = false;
                btnText.style.display = 'inline';
                btnLoading.style.display = 'none';
            });
    });
}

// Scroll to top button
const scrollToTopBtn = document.createElement('button');
scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
scrollToTopBtn.className = 'scroll-to-top';
document.body.appendChild(scrollToTopBtn);

scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollToTopBtn.classList.add('show');
    } else {
        scrollToTopBtn.classList.remove('show');
    }
});

// Gallery lightbox effect (simple)
document.querySelectorAll('.gallery-item img').forEach(img => {
    img.addEventListener('click', function() {
        // Simple lightbox - bisa dikembangkan lebih lanjut
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2000;
            cursor: pointer;
        `;

        const enlargedImg = document.createElement('img');
        enlargedImg.src = this.src;
        enlargedImg.style.cssText = `
            max-width: 90%;
            max-height: 90%;
            object-fit: contain;
        `;

        overlay.appendChild(enlargedImg);
        document.body.appendChild(overlay);

        overlay.addEventListener('click', () => {
            document.body.removeChild(overlay);
        });
    });
});

// Service card hover effect enhancement
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });

    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Typing effect untuk hero title (opsional)
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';

    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }

    type();
}

// Uncomment untuk mengaktifkan typing effect
// const heroTitle = document.querySelector('.hero-title');
// if (heroTitle) {
//     const originalText = heroTitle.textContent;
//     typeWriter(heroTitle, originalText, 150);
// }

// Lazy loading untuk gambar (performance improvement)
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Prevent form resubmission on page refresh
if (window.history.replaceState) {
    window.history.replaceState(null, null, window.location.href);
}

// Console log untuk debugging (hapus di production)
console.log('Barbershop website loaded successfully!');
