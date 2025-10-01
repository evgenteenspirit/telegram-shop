
let cart = [];
let cartCount = 0;
let currentFilter = 'all';

// Данные товаров
const productsData = [
    {
        id: 1,
        name: "Ручка мебельная 'Престиж'",
        price: 450,
        category: "handles",
        image: "images/handles.jpg",
        description: "Алюминиевая ручка с матовым покрытием, 128мм"
    },
    {
        id: 2,
        name: "Ручка-кноб 'Элегант'",
        price: 320,
        category: "handles",
        image: "images/handles.jpg",
        description: "Шарообразная ручка, хром покрытие, 32мм"
    },
    {
        id: 3,
        name: "Петля четырехшарнирная",
        price: 280,
        category: "hinges",
        image: "images/hinges.jpg",
        description: "С доводчиком, регулировка по 3 осям, 110°"
    },
    {
        id: 4,
        name: "Петля скрытая INVISIBLE",
        price: 390,
        category: "hinges",
        image: "images/hinges.jpg",
        description: "Скрытое крепление, для современных интерьеров"
    },
    {
        id: 5,
        name: "Направляющая шариковая",
        price: 890,
        category: "systems",
        image: "images/drawers.jpg",
        description: "Для выдвижных ящиков, нагрузка до 50кг, 400мм"
    },
    {
        id: 6,
        name: "Лифт подъемный механизм",
        price: 1250,
        category: "systems",
        image: "images/drawers.jpg",
        description: "Для верхних шкафов, плавное открывание"
    },
    {
        id: 7,
        name: "Винт мебельный конфирмат",
        price: 5,
        category: "hardware",
        image: "images/hardware.jpg",
        description: "Для сборки мебели, 6.3x50mm, оцинкованный"
    },
    {
        id: 8,
        name: "Угловая стяжка",
        price: 15,
        category: "hardware",
        image: "images/hardware.jpg",
        description: "Для перпендикулярного соединения деталей"
    }
];

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    initCart();
    setupEventListeners();
    renderProducts();
    setupMobileMenu();
    setupSmoothScroll();
});

// Корзина
function initCart() {
    const savedCart = localStorage.getItem('vegadar_cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartCount();
    }
}

function saveCart() {
    localStorage.setItem('vegadar_cart', JSON.stringify(cart));
}

function updateCartCount() {
    cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = cartCount;
    }
}

function addToCart(productId, productName, productPrice) {
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productId,
            name: productName,
            price: productPrice,
            quantity: 1
        });
    }
    
    saveCart();
    updateCartCount();
    showNotification(`✅ "${productName}" добавлен в корзину!`);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartCount();
    updateCartModal();
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveCart();
            updateCartModal();
        }
    }
}

function calculateTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Модальные окна
function setupCartModal() {
    const modal = document.getElementById('cartModal');
    const cartButton = document.getElementById('cartButton');
    const closeButton = document.querySelector('.close');
    const continueShopping = document.getElementById('continueShopping');
    const checkoutButton = document.getElementById('checkout');
    const viewCartBtn = document.getElementById('viewCartBtn');

    if (cartButton) {
        cartButton.addEventListener('click', () => {
            updateCartModal();
            modal.style.display = 'block';
        });
    }

    if (closeButton) {
        closeButton.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }

    if (continueShopping) {
        continueShopping.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }

    if (checkoutButton) {
        checkoutButton.addEventListener('click', processCheckout);
    }

    if (viewCartBtn) {
        viewCartBtn.addEventListener('click', () => {
            updateCartModal();
            modal.style.display = 'block';
        });
    }

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

function updateCartModal() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (!cartItems || !cartTotal) return;
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Корзина пуста</p>';
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">${item.price} ₽ × ${item.quantity}</div>
                </div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
                <button class="cart-item-remove" onclick="removeFromCart(${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
    }
    
    cartTotal.textContent = calculateTotal();
}

function showCallbackForm() {
    const modal = document.getElementById('callbackModal');
    if (modal) {
        modal.style.display = 'block';
    }
}

function setupCallbackModal() {
    const modal = document.getElementById('callbackModal');
    const closeButton = modal?.querySelector('.close');
    const form = document.getElementById('callbackForm');

    if (closeButton) {
        closeButton.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }

    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('callbackName').value;
            const phone = document.getElementById('callbackPhone').value;
            
            processCallback(name, phone);
        });
    }

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// Обработка заказов
function processCheckout() {
    if (cart.length === 0) {
        showNotification('❌ Корзина пуста!');
        return;
    }

    const orderData = {
        items: cart,
        total: calculateTotal(),
        timestamp: new Date().toLocaleString('ru-RU')
    };

    const message = createOrderMessage(orderData);
    
    // Отправка в Telegram (раскомментировать когда настроишь бота)
    // sendToTelegram(message);
    
    showNotification('✅ Заказ оформлен! Мы свяжемся с вами для подтверждения.');
    
    // Очистка корзины
    cart = [];
    saveCart();
    updateCartCount();
    updateCartModal();
    
    // Закрытие модального окна
    const modal = document.getElementById('cartModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function processCallback(name, phone) {
    const message = `
📞 ЗАПРОС ОБРАТНОГО ЗВОНКА
———————————————
👤 Имя: ${name}
📞 Телефон: ${phone}
⏰ Время: ${new Date().toLocaleString('ru-RU')}
———————————————
🌐 Сайт: vegadar.ru
    `;

    // Отправка в Telegram (раскомментировать когда настроишь бота)
    // sendToTelegram(message);
    
    showNotification('✅ Заявка отправлена! Мы перезвоним в течение 15 минут.');
    
    // Очистка формы
    document.getElementById('callbackForm').reset();
    
    // Закрытие модального окна
    const modal = document.getElementById('callbackModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function createOrderMessage(orderData) {
    return `
🛒 НОВЫЙ ЗАКАЗ С САЙТА!
———————————————
📦 Товары:
${orderData.items.map(item => `• ${item.name} - ${item.quantity}шт. × ${item.price}₽`).join('\n')}
———————————————
💰 Сумма: ${orderData.total} ₽
⏰ Время: ${orderData.timestamp}
———————————————
🌐 Сайт: vegadar.ru
    `;
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
                <button class="add-to-cart-btn" onclick="addToCart(${product.id}, '${product.name}', ${product.price})">
                    <i class="fas fa-plus"></i>
                </button>
            </div>
            <div class="product-content">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <div class="product-price">${product.price} ₽</div>
                <button class="btn-primary add-to-cart" onclick="addToCart(${product.id}, '${product.name}', ${product.price})">
                    В корзину
                </button>
            </div>
        </div>
    `).join('');
}

function setupFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Удаляем активный класс у всех кнопок
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Добавляем активный класс нажатой кнопке
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

    // Закрытие меню при клике на ссылку
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

// Утилиты
function showNotification(message) {
    // Удаляем существующие уведомления
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function downloadCatalog() {
    showNotification('📥 Каталог скоро будет доступен для скачивания!');
    // Здесь можно добавить ссылку на реальный PDF файл
    // window.open('path/to/catalog.pdf', '_blank');
}

// Настройка всех обработчиков событий
function setupEventListeners() {
    setupCartModal();
    setupCallbackModal();
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
    const formMessage = `
📧 СООБЩЕНИЕ С САЙТА
———————————————
👤 Имя: ${name}
📞 Телефон: ${phone}
💬 Сообщение: ${message || 'Не указано'}
⏰ Время: ${new Date().toLocaleString('ru-RU')}
———————————————
🌐 Сайт: vegadar.ru
    `;

    // Отправка в Telegram (раскомментировать когда настроишь бота)
    // sendToTelegram(formMessage);
    
    showNotification('✅ Сообщение отправлено! Мы ответим в течение 24 часов.');
    document.getElementById('contactForm').reset();
}

// Функция для отправки в Telegram (заглушка)
async function sendToTelegram(message) {
    // Раскомментировать и настроить когда создашь бота
    /*
    try {
        const TELEGRAM_BOT_TOKEN = 'YOUR_BOT_TOKEN';
        const TELEGRAM_CHAT_ID = 'YOUR_CHAT_ID';
        
        const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: message,
                parse_mode: 'HTML'
            })
        });
        
        return response.ok;
    } catch (error) {
        console.error('Error sending to Telegram:', error);
        return false;
    }
    */
}

// Фиксированный хедер при скролле
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (header) {
        if (window.scrollY > 100) {
            header.style.background = 'rgba(0, 0, 0, 0.98)';
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.background = 'rgba(0, 0, 0, 0.95)';
            header.style.boxShadow = 'none';
        }
    }
});

// Анимации при скролле
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.category-card, .advantage-card, .contact-card, .product-card');
    
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'all 0.6s ease';
        observer.observe(element);
    });
}

// Инициализация анимаций при загрузке
setTimeout(initScrollAnimations, 100);