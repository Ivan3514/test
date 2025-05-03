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

function initializeSecuritySystems() {
    // Защита от копирования
    document.addEventListener('copy', function(e) {
        e.preventDefault();
        alert('Копирование материалов запрещено!');
        logSecurityEvent('Попытка копирования содержимого');
    });
    
    // Защита от контекстного меню
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        logSecurityEvent('Попытка открыть контекстное меню');
    });
    
    // Защита от DevTools
    document.addEventListener('keydown', function(e) {
        if (e.key === 'F12' || 
            (e.ctrlKey && e.shiftKey && e.key === 'I') || 
            (e.ctrlKey && e.shiftKey && e.key === 'J') ||
            (e.ctrlKey && e.key === 'U')) {
            e.preventDefault();
            logSecurityEvent('Попытка открыть инструменты разработчика');
        }
    });
    
    // Мониторинг неактивности
    let inactivityTimer;
    const INACTIVITY_TIMEOUT = 15 * 60 * 1000; // 15 минут
    
    function resetInactivityTimer() {
        clearTimeout(inactivityTimer);
        inactivityTimer = setTimeout(() => {
            document.getElementById('logout-btn').click();
            alert('Вы были автоматически вышли из системы из-за неактивности');
            logSecurityEvent('Автоматический выход из-за неактивности');
        }, INACTIVITY_TIMEOUT);
    }
    
    // Сброс таймера при активности пользователя
    document.addEventListener('mousemove', resetInactivityTimer);
    document.addEventListener('keypress', resetInactivityTimer);
    document.addEventListener('scroll', resetInactivityTimer);
    document.addEventListener('click', resetInactivityTimer);
    
    resetInactivityTimer();
    
    // Логирование событий безопасности
    window.logSecurityEvent = function(message) {
        console.log(`[Security Event] ${new Date().toISOString()}: ${message}`);
        // В реальном проекте отправлять на сервер
    };
    
    // Проверка изменения DOM (защита от инспектирования)
    const originalTitle = document.title;
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                // Попытка изменить стили через инспектор
                logSecurityEvent('Попытка изменения стилей через инспектор');
                mutation.target.style = '';
            }
        });
    });
    
    observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['style'],
        subtree: true
    });
    
    // Проверка нахождения во фрейме (защита от встраивания)
    if (window.top !== window.self) {
        document.body.innerHTML = '<h1>Доступ запрещен</h1><p>Сайт не может быть встроен во фрейм</p>';
        logSecurityEvent('Попытка встраивания сайта во фрейм');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Защита контента от копирования
    const protectedContents = document.querySelectorAll('.protected-content');
    
    protectedContents.forEach(content => {
        // Добавляем водяные знаки
        const watermark = document.createElement('div');
        watermark.style.position = 'absolute';
        watermark.style.top = '0';
        watermark.style.left = '0';
        watermark.style.width = '100%';
        watermark.style.height = '100%';
        watermark.style.background = 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'400\' height=\'400\'><text x=\'50\' y=\'50\' fill=\'rgba(200,200,200,0.2)\' transform=\'rotate(-45 100,100)\' font-size=\'20\'>Дипломная работа Попелюх И.И.</text></svg>") repeat';
        watermark.style.pointerEvents = 'none';
        watermark.style.zIndex = '1';
        content.style.position = 'relative';
        content.appendChild(watermark);
        
        // Блокировка выделения текста
        content.addEventListener('selectstart', function(e) {
            e.preventDefault();
            return false;
        });
    });
    
    // Динамическая защита изображений
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.setAttribute('draggable', 'false');
        
        // Замена src при попытке копирования
        const originalSrc = img.src;
        img.addEventListener('contextmenu', function() {
            this.src = 'data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'100\' height=\'100\'><rect width=\'100\' height=\'100\' fill=\'%23f0f0f0\'/><text x=\'50\' y=\'50\' font-family=\'Arial\' font-size=\'10\' text-anchor=\'middle\' fill=\'%23000\'>Изображение защищено</text></svg>';
            setTimeout(() => {
                this.src = originalSrc;
            }, 1000);
        });
    });
    
    // Защита от автоматического парсинга
    setInterval(() => {
        if (document.hidden) {
            document.getElementById('logout-btn').click();
            logSecurityEvent('Автоматический выход при скрытии вкладки');
        }
    }, 5000);
});
