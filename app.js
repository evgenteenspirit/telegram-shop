// Инициализация Telegram Web App
let tg = null;
if (window.Telegram?.WebApp) {
    tg = window.Telegram.WebApp;
    tg.expand();
    tg.enableClosingConfirmation();
}

// Данные товаров
const products = {
    handles: [
        { 
            id: 1, 
            name: "Ручка мебельная алюминиевая", 
            price: 450, 
            image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop", 
            category: "handles",
            description: "Качественная алюминиевая ручка для мебели"
        },
        { 
            id: 2, 
            name: "Ручка кнопка черная", 
            price: 320, 
            image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400&h=300&fit=crop", 
            category: "handles",
            description: "Стильная черная ручка-кнопка"
        },
        { 
            id: 3, 
            name: "Ручка-скоба 128мм", 
            price: 580, 
            image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop", 
            category: "handles",
            description: "Прочная ручка-скоба длиной 128мм"
        },
        { 
            id: 4, 
            name: "Ручка профиль 1м", 
            price: 1200, 
            image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400&h=300&fit=crop", 
            category: "handles",
            description: "Алюминиевый профиль для современной мебели"
        }
    ],
    hinges: [
        { 
            id: 5, 
            name: "Петля накладная 110°", 
            price: 280, 
            image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop", 
            category: "hinges",
            description: "Накладная петля с углом открывания 110°"
        },
        { 
            id: 6, 
            name: "Петля с доводчиком", 
            price: 650, 
            image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400&h=300&fit=crop", 
            category: "hinges",
            description: "Петля со встроенным доводчиком"
        },
        { 
            id: 7, 
            name: "Петля скрытая", 
            price: 890, 
            image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop", 
            category: "hinges",
            description: "Скрытая петля для мебели"
        }
    ],
    systems: [
        { 
            id: 8, 
            name: "Направляющие шариковые 500мм", 
            price: 1200, 
            image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400&h=300&fit=crop", 
            category: "systems",
            description: "Шариковые направляющие для ящиков"
        },
        { 
            id: 9, 
            name: "Система пантограф", 
            price: 4500, 
            image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop", 
            category: "systems",
            description: "Система подъема фасадов пантограф"
        },
        { 
            id: 10, 
            name: "Направляющие для ящиков", 
            price: 780, 
            image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400&h=300&fit=crop", 
            category: "systems",
            description: "Качественные направляющие для мебельных ящиков"
        }
    ],
    hardware: [
        { 
            id: 11, 
            name: "Шурупы конфирмат 6.4x50", 
            price: 45, 
            image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop", 
            category: "hardware",
            description: "Шурупы для сборки мебели конфирмат"
        },
        { 
            id: 12, 
            name: "Стяжка мебельная", 
            price: 28, 
            image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400&h=300&fit=crop", 
            category: "hardware",
            description: "Мебельная стяжка для надежной сборки"
        },
        { 
            id: 13, 
            name: "Шкант мебельный 8x30", 
            price: 12, 
            image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop", 
            category: "hardware",
            description: "Деревянный шкант для мебели"
        }
    ]
};

// Все товары для поиска
const allProducts = Object.values(products).flat();

// Корзина
let cart = JSON.parse(localStorage.getItem('vegadar_cart')) || {};

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    initApp();
    setupEventListeners();
    updateCartCount();
    renderFeed();
    renderAllProducts();
});

function initApp() {
    console.log('Vegadar app initialized');
    
    // Установка рипл-эффекта
    setupRippleEffects();
    
    // Показать категории по умолчанию
    showCategories();
}

function setupEventListeners() {
    // Поиск
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
        searchInput.addEventListener('focus', function() {
            if (this.value.trim()) {
                showSearchResults();
            }
        });
    }
    
    // Клик вне поиска
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.search-container')) {
            hideSearchResults();
        }
    });
    
    // Мобильное меню
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }
    
    // Корзина
    const cartButton = document.getElementById('cartButton');
    if (cartButton) {
        cartButton.addEventListener('click', openCart);
    }
    
    // Модальное окно
    const modal = document.getElementById('cartModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeCart();
            }
        });
    }
    
    // Форма обратной связи
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }
    
    // Закрытие модального окна при нажатии ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeCart();
        }
    });
}

// Поиск товаров
function handleSearch(e) {
    const query = e.target.value.toLowerCase().trim();
    const resultsContainer = document.getElementById('searchResults');
    
    if (!query) {
        hideSearchResults();
        return;
    }
    
    const filtered = allProducts.filter(product => 
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
    );
    
    showSearchResults(filtered);
}

function showSearchResults(results = null) {
    const container = document.getElementById('searchResults');
    const searchInput = document.getElementById('searchInput');
    
    if (!container || !searchInput) return;
    
    if (results) {
        container.innerHTML = results.length ? 
            results.map(product => `
                <div class="search-result-item" onclick="addToCart(${product.id}); hideSearchResults();">
                    <div>
                        <div style="font-weight: 600;">${product.name}</div>
                        <div style="font-size: 12px; color: #666;">${product.description}</div>
                    </div>
                    <strong>${formatPrice(product.price)}</strong>
                </div>
            `).join('') :
            '<div class="no-results">Товары не найдены</div>';
    }
    
    container.style.display = 'block';
}

function hideSearchResults() {
    const container = document.getElementById('searchResults');
    if (container) {
        container.style.display = 'none';
    }
}

// Лента подборок
function renderFeed() {
    const scroller = document.getElementById('feedScroller');
    if (!scroller) return;
    
    const feeds = [
        { title: "Новинки", image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop" },
        { title: "Хиты продаж", image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=600&h=400&fit=crop" },
        { title: "Акции", image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop" },
        { title: "Премиум", image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=600&h=400&fit=crop" }
    ];
    
    scroller.innerHTML = feeds.map(feed => `
        <div class="feed-card">
            <img src="${feed.image}" alt="${feed.title}">
            <div class="feed-caption">${feed.title}</div>
        </div>
    `).join('');
}

// Отображение товаров
function renderAllProducts() {
    Object.keys(products).forEach(category => {
        renderProducts(category);
    });
}

function renderProducts(category) {
    const container = document.getElementById(`${category}Products`);
    if (!container) return;
    
    const categoryProducts = products[category] || [];
    container.innerHTML = categoryProducts.map(product => `
        <div class="product-card">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
                <div class="product-badge">В наличии</div>
            </div>
            <div class="product-content">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <div class="product-price">${formatPrice(product.price)}</div>
                <button class="btn-primary add-to-cart ripple" onclick="addToCart(${product.id})">
                    В корзину
                </button>
            </div>
        </div>
    `).join('');
}

// Навигация по категориям
function showCategories() {
    document.querySelectorAll('.catalog').forEach(el => {
        el.style.display = 'none';
    });
    const productsSection = document.getElementById('products');
    if (productsSection) {
        productsSection.style.display = 'block';
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showCategory(category) {
    document.querySelectorAll('.catalog').forEach(el => {
        el.style.display = 'none';
    });
    
    const productsSection = document.getElementById('products');
    if (productsSection) {
        productsSection.style.display = 'none';
    }
    
    const target = document.getElementById(category);
    if (target) {
        target.style.display = 'block';
        window.scrollTo({ top: target.offsetTop - 100, behavior: 'smooth' });
    }
}

// Корзина
function addToCart(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (!product) {
        console.error('Product not found:', productId);
        return;
    }
    
    if (cart[productId]) {
        cart[productId].quantity += 1;
    } else {
        cart[productId] = {
            ...product,
            quantity: 1
        };
    }
    
    saveCart();
    updateCartCount();
    showNotification(`Добавлено: ${product.name}`);
    
    // Если корзина открыта - обновить
    if (document.getElementById('cartModal').style.display === 'block') {
        renderCart();
    }
}

function removeFromCart(productId) {
    if (cart[productId]) {
        delete cart[productId];
        saveCart();
        updateCartCount();
        renderCart();
        showNotification('Товар удален из корзины');
    }
}

function updateQuantity(productId, change) {
    if (cart[productId]) {
        cart[productId].quantity += change;
        
        if (cart[productId].quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveCart();
            renderCart();
        }
    }
}

function saveCart() {
    try {
        localStorage.setItem('vegadar_cart', JSON.stringify(cart));
    } catch (e) {
        console.error('Error saving cart:', e);
    }
}

function updateCartCount() {
    const countElement = document.getElementById('cartCount');
    if (countElement) {
        const total = Object.values(cart).reduce((sum, item) => sum + item.quantity, 0);
        countElement.textContent = total;
    }
}

function openCart() {
    const modal = document.getElementById('cartModal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        renderCart();
    }
}

function closeCart() {
    const modal = document.getElementById('cartModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function renderCart() {
    const container = document.getElementById('cartItems');
    const totalElement = document.getElementById('cartTotal');
    
    if (!container) return;
    
    const items = Object.values(cart);
    
    if (items.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 3rem 1rem; color: #666;">
                <div style="font-size: 48px; margin-bottom: 1rem;">🛒</div>
                <div style="font-size: 18px; font-weight: 600; margin-bottom: 0.5rem;">Корзина пуста</div>
                <div style="color: #888;">Добавьте товары из каталога</div>
            </div>
        `;
        if (totalElement) totalElement.textContent = formatPrice(0);
        return;
    }
    
    container.innerHTML = items.map(item => `
        <div class="cart-item">
            <div class="cart-item-name">${item.name}</div>
            <div class="cart-item-price">${formatPrice(item.price)}</div>
            <div class="cart-item-quantity">
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                <span style="min-width: 30px; text-align: center;">${item.quantity}</span>
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
            </div>
            <button class="cart-item-remove" onclick="removeFromCart(${item.id})">×</button>
        </div>
    `).join('');
    
    if (totalElement) {
        const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        totalElement.textContent = formatPrice(total);
    }
}

function checkout() {
    const items = Object.values(cart);
    if (items.length === 0) {
        showNotification('Добавьте товары в корзину');
        return;
    }
    
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const orderDetails = items.map(item => 
        `${item.name} - ${item.quantity} × ${formatPrice(item.price)}`
    ).join('\n');
    
    const message = `Заказ из магазина Вегадар:\n\n${orderDetails}\n\nИтого: ${formatPrice(total)}`;
    
    if (tg) {
        // В Telegram Web App
        tg.sendData(JSON.stringify({
            type: 'order',
            items: items,
            total: total
        }));
        showNotification('Заказ отправлен!');
    } else {
        // В браузере - открываем Telegram
        const phone = '79624044323';
        const encodedMessage = encodeURIComponent(message);
        window.open(`https://t.me/share/url?url=&text=${encodedMessage}`, '_blank');
        showNotification('Открываем Telegram для отправки заказа');
    }
    
    // Очищаем корзину после заказа
    cart = {};
    saveCart();
    updateCartCount();
    closeCart();
}

// Утилиты
function formatPrice(price) {
    return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        minimumFractionDigits: 0
    }).format(price);
}

function showNotification(message) {
    // Удаляем существующие уведомления
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notif => notif.remove());
    
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 3000);
}

function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = element.offsetTop - headerHeight - 20;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

function openTelegram() {
    window.open('https://t.me/+79624044323', '_blank');
}

function toggleMobileMenu() {
    const menu = document.getElementById('navMenu');
    const button = document.getElementById('mobileMenuBtn');
    
    if (menu && button) {
        menu.classList.toggle('active');
        button.classList.toggle('active');
        
        // Блокируем прокрутку тела при открытом меню
        if (menu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }
}

function setupRippleEffects() {
    document.addEventListener('click', function(e) {
        const button = e.target.closest('.ripple');
        if (button) {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            button.style.setProperty('--rx', `${x}px`);
            button.style.setProperty('--ry', `${y}px`);
            
            // Убираем свойства после анимации
            setTimeout(() => {
                button.style.removeProperty('--rx');
                button.style.removeProperty('--ry');
            }, 350);
        }
    });
}

function handleContactForm(e) {
    e.preventDefault();
    
    const name = document.getElementById('contactName').value;
    const phone = document.getElementById('contactPhone').value;
    const message = document.getElementById('contactMessage').value;
    
    if (!name || !phone) {
        showNotification('Пожалуйста, заполните обязательные поля');
        return;
    }
    
    // Имитация отправки
    showNotification('Сообщение отправлено! Свяжемся с вами в течение 15 минут');
    
    // Очистка формы
    e.target.reset();
    
    // В реальном приложении здесь был бы fetch запрос
    console.log('Contact form submitted:', { name, phone, message });
    
    // Отправка в Telegram (если доступно)
    if (tg) {
        tg.sendData(JSON.stringify({
            type: 'contact',
            name: name,
            phone: phone,
            message: message
        }));
    }
}

// Глобальные функции для HTML onclick
window.showCategory = showCategory;
window.showCategories = showCategories;
window.addToCart = addToCart;
window.updateQuantity = updateQuantity;
window.removeFromCart = removeFromCart;
window.openCart = openCart;
window.closeCart = closeCart;
window.scrollToSection = scrollToSection;
window.openTelegram = openTelegram;
window.checkout = checkout;