// DOM Elements
const trackingForm = document.querySelector('.tracking-form');
const trackingInput = document.getElementById('tracking-number');
const trackingResult = document.getElementById('tracking-result');
const contactForm = document.getElementById('contact-form');
const searchBox = document.querySelector('.search-box');
const searchInput = document.querySelector('.search-box input');
const searchButton = document.querySelector('.search-box button');
const faqItems = document.querySelectorAll('.faq-item');
const locationCards = document.querySelectorAll('.location-card');
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const mobileMenuClose = document.querySelector('.mobile-menu-close');
const navLinks = document.querySelector('.nav-links');

// Tracking System
const trackingSystem = {
    // Örnek bagaj verileri
    bags: {
        'BAG123': {
            status: 'Yolda',
            location: 'İstanbul',
            destination: 'Ankara',
            estimatedTime: '2 saat',
            updates: [
                { time: '10:00', status: 'İstanbul\'dan ayrıldı' },
                { time: '11:30', status: 'Ankara\'ya yaklaşıyor' }
            ]
        },
        'BAG456': {
            status: 'Teslim Edildi',
            location: 'İzmir',
            destination: 'İzmir',
            estimatedTime: 'Tamamlandı',
            updates: [
                { time: '09:00', status: 'Teslim alındı' },
                { time: '10:30', status: 'Teslim edildi' }
            ]
        }
    },

    // Bagaj takip fonksiyonu
    trackBag(trackingNumber) {
        const bag = this.bags[trackingNumber];
        if (bag) {
            return bag;
        }
        return null;
    }
};

// Fiyat hesaplama için sabit değerler
const PRICE_CONSTANTS = {
    BASE_PRICE: 99.99,
    PRICE_PER_KM: 2.50,
    LUGGAGE_PRICES: {
        small: 49.99,
        medium: 79.99,
        large: 99.99
    }
};

// Fiyat hesaplama fonksiyonu
function calculatePrice() {
    const pickupLocation = document.getElementById('pickupLocation').value;
    const dropoffLocation = document.getElementById('dropoffLocation').value;
    const luggageType = document.getElementById('luggageType').value;

    if (!pickupLocation || !dropoffLocation || !luggageType) {
        return;
    }

    // Mesafe hesaplama (örnek olarak sabit bir değer kullanıyoruz)
    // Gerçek uygulamada Google Maps API veya benzeri bir servis kullanılmalı
    const distance = calculateDistance(pickupLocation, dropoffLocation);
    
    // Temel ücret
    let basePrice = PRICE_CONSTANTS.BASE_PRICE;
    
    // Mesafe ücreti
    const distancePrice = distance * PRICE_CONSTANTS.PRICE_PER_KM;
    
    // Bagaj ücreti
    const luggagePrice = PRICE_CONSTANTS.LUGGAGE_PRICES[luggageType];
    
    // Toplam ücret
    const totalPrice = basePrice + distancePrice + luggagePrice;

    // Fiyat sonucunu göster
    document.getElementById('priceResult').style.display = 'block';
    document.getElementById('calculatedPrice').textContent = totalPrice.toFixed(2);
    
    // Tahmini süre (örnek olarak sabit bir değer)
    document.getElementById('estimatedTime').textContent = Math.ceil(distance * 2); // Her km için 2 dakika
}

// Mesafe hesaplama fonksiyonu (örnek)
function calculateDistance(origin, destination) {
    // Bu fonksiyon gerçek uygulamada Google Maps API veya benzeri bir servis kullanmalı
    // Şimdilik örnek olarak sabit bir değer döndürüyoruz
    return 10; // 10 km
}

// Form Event Listeners
trackingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const trackingNumber = trackingInput.value.toUpperCase();
    const bagInfo = trackingSystem.trackBag(trackingNumber);

    if (bagInfo) {
        displayTrackingResult(bagInfo);
    } else {
        displayError('Bagaj bulunamadı. Lütfen takip numaranızı kontrol edin.');
    }
});

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);
    
    // Form gönderme simülasyonu
    displaySuccess('Mesajınız başarıyla gönderildi. En kısa sürede size dönüş yapacağız.');
    contactForm.reset();
});

// Mobile Menu Toggle
if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        navLinks.classList.add('active');
    });
}

// Close mobile menu
if (mobileMenuClose) {
    mobileMenuClose.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
}

// Close mobile menu when clicking on a link
if (navLinks) {
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });
}

// Search Functionality
searchBox.addEventListener('submit', (e) => {
    e.preventDefault();
    const searchTerm = searchInput.value.trim();
    if (searchTerm) {
        // Burada gerçek bir arama fonksiyonu eklenecek
        displaySuccess('Arama yapılıyor: ' + searchTerm);
    }
});

// FAQ Toggle
faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    question.addEventListener('click', () => {
        // Diğer açık olan FAQ itemlarını kapat
        faqItems.forEach(otherItem => {
            if (otherItem !== item) {
                otherItem.classList.remove('active');
            }
        });

        // Tıklanan FAQ itemını aç/kapat
        item.classList.toggle('active');
    });
});

// Location Card Click Handler
locationCards.forEach(card => {
    card.addEventListener('click', (e) => {
        if (!e.target.classList.contains('see-more')) {
            const locationName = card.querySelector('h3').textContent;
            // Burada detay sayfasına yönlendirme yapılacak
            console.log('Location clicked:', locationName);
        }
    });
});

// UI Functions
function displayTrackingResult(bagInfo) {
    trackingResult.style.display = 'block';
    trackingResult.innerHTML = `
        <h3>Bagaj Durumu: ${bagInfo.status}</h3>
        <p><strong>Konum:</strong> ${bagInfo.location}</p>
        <p><strong>Varış Noktası:</strong> ${bagInfo.destination}</p>
        <p><strong>Tahmini Süre:</strong> ${bagInfo.estimatedTime}</p>
        <div class="updates">
            <h4>Güncellemeler:</h4>
            <ul>
                ${bagInfo.updates.map(update => `
                    <li>${update.time} - ${update.status}</li>
                `).join('')}
            </ul>
        </div>
    `;
}

function displayError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `
        <i class="fas fa-exclamation-circle"></i>
        <p>${message}</p>
    `;
    document.body.appendChild(errorDiv);

    setTimeout(() => {
        errorDiv.remove();
    }, 3000);
}

function displaySuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <p>${message}</p>
    `;
    document.body.appendChild(successDiv);

    setTimeout(() => {
        successDiv.remove();
    }, 3000);
}

// Smooth Scroll
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

// Sayfa yüklendiğinde
document.addEventListener('DOMContentLoaded', function() {
    // Form değişikliklerini dinle
    const formInputs = document.querySelectorAll('#pickupLocation, #dropoffLocation, #luggageType');
    formInputs.forEach(input => {
        input.addEventListener('change', calculatePrice);
    });

    // Date and bags selection functionality
    const dateSelect = document.getElementById('dateSelect');
    if (dateSelect) {
        dateSelect.addEventListener('click', function() {
            const datePicker = flatpickr(this, {
                minDate: "today",
                defaultDate: "tomorrow",
                onChange: function(selectedDates, dateStr) {
                    dateSelect.querySelector('span').textContent = formatDate(selectedDates[0]);
                }
            });
            datePicker.open();
        });
    }

    // Bags selection
    const bagsSelect = document.getElementById('bagsSelect');
    if (bagsSelect) {
        bagsSelect.addEventListener('click', function() {
            const currentCount = parseInt(this.querySelector('span').textContent) || 2;
            const newCount = prompt('Kaç bagaj?', currentCount);
            if (newCount && !isNaN(newCount) && newCount > 0) {
                this.querySelector('span').textContent = `${newCount} Bagaj`;
            }
        });
    }

    // City Slider functionality
    const slider = document.querySelector('.slider-wrapper');
    if (!slider) return;

    let isDown = false;
    let startX;
    let scrollLeft;

    // Mouse events
    slider.addEventListener('mousedown', (e) => {
        isDown = true;
        slider.style.cursor = 'grabbing';
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
    });

    slider.addEventListener('mouseleave', () => {
        isDown = false;
        slider.style.cursor = 'grab';
    });

    slider.addEventListener('mouseup', () => {
        isDown = false;
        slider.style.cursor = 'grab';
    });

    slider.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX) * 2;
        slider.scrollLeft = scrollLeft - walk;
    });

    // Touch events
    slider.addEventListener('touchstart', (e) => {
        startX = e.touches[0].pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
    });

    slider.addEventListener('touchmove', (e) => {
        if (!startX) return;
        const x = e.touches[0].pageX - slider.offsetLeft;
        const walk = (x - startX) * 2;
        slider.scrollLeft = scrollLeft - walk;
    });

    slider.addEventListener('touchend', () => {
        startX = null;
    });
});

// Helper function to format date
function formatDate(date) {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
        return 'Bugün';
    } else if (date.toDateString() === tomorrow.toDateString()) {
        return 'Yarın';
    } else {
        return date.toLocaleDateString('tr-TR', { 
            day: 'numeric', 
            month: 'long'
        });
    }
}

// Search functionality
document.querySelector('.search-button')?.addEventListener('click', function() {
    const location = document.getElementById('locationInput').value;
    const date = document.getElementById('dateSelect').querySelector('span').textContent;
    const bags = document.getElementById('bagsSelect').querySelector('span').textContent;

    // Store search parameters in localStorage
    localStorage.setItem('searchParams', JSON.stringify({
        location,
        date,
        bags
    }));

    // Redirect to map page
    window.location.href = 'map.html';
}); 