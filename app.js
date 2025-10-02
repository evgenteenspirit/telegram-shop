ware.jpg",
        description: "Для перпендикулярного соединения деталей"
    }
];

let currentFilter = 'all';

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    renderProducts();
    setupMobileMenu();
    setupSmoothScroll();
});

// Открытие Telegram
function openTelegram() {
    const phone = '+79624044323';
    const message = 'Здравствуйте! У меня вопрос по мебельной фурнитуре.';
    const url = `https://t.me/share/url?url=${encodeURIComponent(phone)}&text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}

// Работа с товарами
function renderProducts() {
    const productsGrid = document.querySelector('.products-grid');
    if (!productsGrid) return;

    const filteredProducts = currentFilter === 'all' 
        ? productsData 
        : productsData.filter(product => product.category === currentFilter);

    productsGrid.innerHTML = filteredProducts.map(product => `
        <div class="product-card" data-category="${product.category}">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/400x300/22C55E/FFFFFF?text=Фурнитура'">
            </div>
            <div class="product-content">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <div class="product-price">${product.price} ₽</div>
                <button class="btn-primary" onclick="orderProduct('${product.name}', ${product.price})">
                    <i class="fab fa-telegram"></i>
                    Заказать в Telegram
                </button>
            </div>
        </div>
    `).join('');
}

function orderProduct(productName, productPrice) {
    const message = `Здравствуйте! Хочу заказать товар: ${productName} - ${productPrice}₽`;
    const url = `https://t.me/share/url?url=+79624044323&text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}

function setupFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            currentFilter = this.getAttribute('data-filter');
            renderProducts();
        });
    });
}

// Мобильное меню
function setupMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');

    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            this.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuBtn.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// Плавная прокрутка
function setupSmoothScroll() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Настройка всех обработчиков событий
function setupEventListeners() {
    setupFilters();
    
    // Обработчик контактной формы
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('contactName').value;
            const phone = document.getElementById('contactPhone').value;
            const message = document.getElementById('contactMessage').value;
            
            processContactForm(name, phone, message);
        });
    }
}

function processContactForm(name, phone, message) {
    const fullMessage = `Новая заявка с сайта:\nИмя: ${name}\nТелефон: ${phone}\nСообщение: ${message || 'Не указано'}`;
    const url = `https://t.me/share/url?url=+79624044323&text=${encodeURIComponent(fullMessage)}`;
    window.open(url, '_blank');
    
    // Очистка формы
    document.getElementById('contactForm').reset();
    
    // Уведомление
    alert('Спасибо! Ваше сообщение отправлено. Мы свяжемся с вами в ближайшее время.');
}

// Фиксированный хедер при скролле
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (header) {
        if (window.scrollY > 100) {
            header.style.background = 'rgba(0, 0, 0, 0.98)';
        } else {
            header.style.background = 'rgba(0, 0, 0, 0.95)';
        }
    }
});