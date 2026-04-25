// Kullanıcı yönetimi için basit bir sınıf
class AuthManager {
    constructor() {
        this.storageKey = 'bagajgo_auth';
    }

    // Kullanıcı kaydı
    register(userData) {
        const { name, email, password } = userData;
        
        // Basit bir kullanıcı objesi oluştur
        const user = {
            id: Date.now(),
            name,
            email,
            password, // Gerçek uygulamada şifre hashlenmeli!
            createdAt: new Date().toISOString()
        };

        // LocalStorage'a kaydet
        localStorage.setItem(this.storageKey, JSON.stringify(user));
        return user;
    }

    // Kullanıcı girişi
    login(email, password) {
        const storedUser = localStorage.getItem(this.storageKey);
        if (!storedUser) return null;

        const user = JSON.parse(storedUser);
        if (user.email === email && user.password === password) {
            return user;
        }
        return null;
    }

    // Mevcut kullanıcıyı getir
    getCurrentUser() {
        const storedUser = localStorage.getItem(this.storageKey);
        return storedUser ? JSON.parse(storedUser) : null;
    }

    // Çıkış yap
    logout() {
        localStorage.removeItem(this.storageKey);
    }

    // Kullanıcının giriş yapıp yapmadığını kontrol et
    isAuthenticated() {
        return !!this.getCurrentUser();
    }
}

// Global auth manager instance
const authManager = new AuthManager(); 