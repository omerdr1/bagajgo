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

// Hizmet tipi seçimi ve harita entegrasyonu
let selectedServiceType = null;
let selectedStoragePoint = null;

// Hizmet tipi seçimi
function selectServiceType(type) {
    selectedServiceType = type;
    
    // Aktif sınıfını kaldır
    document.querySelectorAll('.service-option').forEach(option => {
        option.classList.remove('active');
    });
    
    // Seçilen opsiyona aktif sınıfını ekle
    document.querySelector(`.service-option[data-type="${type}"]`).classList.add('active');
    
    // Alış konumu grubunu göster/gizle
    const pickupLocationGroup = document.querySelector('.pickup-location-group');
    if (pickupLocationGroup) {
        pickupLocationGroup.style.display = type === 'pickup' ? 'block' : 'none';
    }
    
    // Emanet noktası seçimi için modal aç
    if (type === 'dropoff') {
        openStoragePointsModal();
    }
    
    // Fiyatı güncelle
    calculatePrice();
}

// Modal işlemleri
function openStoragePointsModal() {
    const modal = document.getElementById('storagePointModal');
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
    
    // iframe'i yükle
    const mapFrame = document.getElementById('mapFrame');
    if (mapFrame) {
        mapFrame.src = 'map.html?isModal=true';
    }
}

function closeStoragePointsModal() {
    const modal = document.getElementById('storagePointModal');
    modal.classList.remove('show');
    document.body.style.overflow = '';
}

// Haritadan seçim yapıldığında
window.addEventListener('message', function(event) {
    if (event.data.type === 'storagePointSelected') {
        const point = event.data.point;
        
        // Seçilen noktayı kaydet
        selectedStoragePoint = point;
        
        // Teslim konumu alanını güncelle
        const dropoffInput = document.getElementById('dropoffLocation');
        if (dropoffInput) {
            dropoffInput.value = point.name + ' - ' + point.address;
        }
        
        // Modalı kapat
        closeStoragePointsModal();
        
        // Fiyatı güncelle
        calculatePrice();
    }
});

// Tarih ve saat seçici başlatma
document.addEventListener('DOMContentLoaded', function() {
    // Tarih seçici
    flatpickr("#pickupDate", {
        locale: "tr",
        dateFormat: "d.m.Y",
        minDate: "today",
        disableMobile: true
    });

    // Saat seçici
    flatpickr("#pickupTime", {
        enableTime: true,
        noCalendar: true,
        dateFormat: "H:i",
        time_24hr: true,
        minTime: "09:00",
        maxTime: "21:00",
        disableMobile: true
    });

    // Form değişikliklerini dinle
    const formInputs = document.querySelectorAll('input, select');
    formInputs.forEach(input => {
        input.addEventListener('change', calculatePrice);
    });
});

// Fiyat hesaplama fonksiyonu
function calculatePrice() {
    const pickupLocation = document.getElementById('pickupLocation').value;
    const dropoffLocation = document.getElementById('dropoffLocation').value;
    const luggageCount = parseInt(document.getElementById('luggageCount').value);
    const luggageType = document.getElementById('luggageType').value;
    
    if (!pickupLocation || !dropoffLocation || !luggageCount || !luggageType) {
        return;
    }
    
    // Hizmet tipine göre fiyatlandırma
    let basePrice = selectedServiceType === 'pickup' ? PRICE_CONSTANTS.BASE_PRICE : PRICE_CONSTANTS.BASE_PRICE;
    
    // Mesafe hesapla
    const distance = calculateDistance(pickupLocation, dropoffLocation);
    const distancePrice = distance * PRICE_CONSTANTS.PRICE_PER_KM;
    
    // Bagaj fiyatı
    const luggagePrice = PRICE_CONSTANTS.LUGGAGE_PRICES[luggageType] * luggageCount;
    
    // Toplam fiyat
    const totalPrice = basePrice + distancePrice + luggagePrice;
    
    // Sonuçları göster
    document.getElementById('basePrice').textContent = basePrice.toFixed(2);
    document.getElementById('distancePrice').textContent = distancePrice.toFixed(2);
    document.getElementById('luggagePrice').textContent = luggagePrice.toFixed(2);
    document.getElementById('totalPrice').textContent = totalPrice.toFixed(2);
    
    // Fiyat kartını göster
    document.getElementById('priceCard').style.display = 'block';
}

// Mesafe hesaplama fonksiyonu (örnek)
function calculateDistance(origin, destination) {
    // Bu fonksiyon gerçek uygulamada Google Maps API veya benzeri bir servis kullanmalı
    // Şimdilik örnek olarak sabit bir değer döndürüyoruz
    return 10; // 10 km
}

// Rezervasyon gönderme fonksiyonu
function submitRequest() {
    const formData = {
        serviceType: document.querySelector('input[name="serviceType"]:checked')?.value,
        pickupLocation: document.getElementById('pickupLocation').value,
        dropoffLocation: document.getElementById('dropoffLocation').value,
        pickupDate: document.getElementById('pickupDate').value,
        pickupTime: document.getElementById('pickupTime').value,
        luggageCount: document.getElementById('luggageCount').value,
        luggageType: document.getElementById('luggageType').value,
        contactName: document.getElementById('contactName').value,
        contactPhone: document.getElementById('contactPhone').value,
        contactNotes: document.getElementById('contactNotes').value
    };

    // Form validasyonu
    if (!validateForm(formData)) {
        return;
    }

    // API'ye gönderme işlemi
    // Gerçek uygulamada burada bir API çağrısı yapılmalı
    console.log('Rezervasyon gönderiliyor:', formData);
    
    // Başarılı rezervasyon mesajı
    alert('Rezervasyonunuz başarıyla alındı! En kısa sürede size dönüş yapacağız.');
}

// Form validasyonu
function validateForm(formData) {
    if (!formData.serviceType) {
        alert('Lütfen hizmet tipini seçin');
        return false;
    }
    if (!formData.pickupLocation) {
        alert('Lütfen alış konumunu girin');
        return false;
    }
    if (!formData.dropoffLocation) {
        alert('Lütfen teslim konumunu girin');
        return false;
    }
    if (!formData.pickupDate) {
        alert('Lütfen tarih seçin');
        return false;
    }
    if (!formData.pickupTime) {
        alert('Lütfen saat seçin');
        return false;
    }
    if (!formData.contactName) {
        alert('Lütfen adınızı ve soyadınızı girin');
        return false;
    }
    if (!formData.contactPhone) {
        alert('Lütfen telefon numaranızı girin');
        return false;
    }
    return true;
}

// Sayfa yüklendiğinde
document.addEventListener('DOMContentLoaded', function() {
    // Form değişikliklerini dinle
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('change', calculatePrice);
    }
    
    // Varsayılan hizmet tipini seç
    selectServiceType('pickup');
}); 