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
