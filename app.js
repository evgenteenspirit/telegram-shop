// Основные функции для сайта

// Плавная прокрутка к секциям
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

// Открытие Telegram
function openTelegram() {
    const phone = '+79624044323';
    const message = 'Здравствуйте! У меня вопрос по мебельной фурнитуре.';
    const url = `https://t.me/share/url?url=${phone}&text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}

// Показ/скрытие каталога
function showCatalog() {
    document.getElementById('products').style.display = 'none';
    document.getElementById('catalog').style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showCategories() {
    document.getElementById('catalog').style.display = 'none';
    document.getElementById('products').style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    console.log('Сайт загружен!');
    
    // Добавляем обработчики для всех кнопок "Смотреть товары"
    const catalogButtons = document.querySelectorAll('.category-link');
    catalogButtons.forEach(button => {
        button.addEventListener('click', showCatalog);
    });
});