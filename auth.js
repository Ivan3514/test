document.addEventListener('DOMContentLoaded', function() {
    // Генерация CAPTCHA
    function generateCaptcha() {
        const chars = "0123456789ABCDEFGHJKLMNPQRSTUVWXYZ";
        let captcha = "";
        for (let i = 0; i < 6; i++) {
            captcha += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return captcha;
    }

    let currentCaptcha = generateCaptcha();
    document.getElementById('captcha').textContent = currentCaptcha;

    // Проверка кода доступа
    const authForm = document.getElementById('auth-form');
    authForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const authCode = document.getElementById('auth-code').value;
        const captchaInput = document.getElementById('captcha-input').value;
        
        // Проверка CAPTCHA
        if (captchaInput !== currentCaptcha) {
            alert("Неверно введена CAPTCHA!");
            currentCaptcha = generateCaptcha();
            document.getElementById('captcha').textContent = currentCaptcha;
            document.getElementById('captcha-input').value = '';
            return;
        }
        
        // Проверка кода доступа (в реальном проекте нужно использовать серверную проверку)
        const validCodes = ['diplom2023', '123456', 'qwerty']; // Пример кодов
        if (validCodes.includes(authCode)) {
            // Успешная авторизация
            document.getElementById('auth-overlay').style.display = 'none';
            document.getElementById('content').classList.remove('hidden');
            
            // Запуск систем защиты
            initializeSecuritySystems();
        } else {
            alert("Неверный код доступа!");
            currentCaptcha = generateCaptcha();
            document.getElementById('captcha').textContent = currentCaptcha;
            document.getElementById('captcha-input').value = '';
            document.getElementById('auth-code').value = '';
        }
    });

    // Выход из системы
    document.getElementById('logout-btn').addEventListener('click', function() {
        document.getElementById('auth-overlay').style.display = 'flex';
        document.getElementById('content').classList.add('hidden');
        
        // Сброс CAPTCHA
        currentCaptcha = generateCaptcha();
        document.getElementById('captcha').textContent = currentCaptcha;
        document.getElementById('captcha-input').value = '';
        document.getElementById('auth-code').value = '';
    });
});
