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
