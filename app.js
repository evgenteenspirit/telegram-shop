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
        { id: 1, name: "Ручка мебельная алюминиевая", price: 450, image: "images/handle1.jpg", category: "handles" },
        { id: 2, name: "Ручка кнопка черная", price: 320, image: "images/handle2.jpg", category: "handles" },
        { id: 3, name: "Ручка-скоба 128мм", price: 580, image: "images/handle3.jpg", category: "handles" },
        { id: 4, name: "Ручка профиль 1м", price: 1200, image: "images/handle4.jpg", category: "handles" }
    ],
    hinges: [
        { id: 5, name: "Петля накладная 110°", price: 280, image: "images/hinge1.jpg", category: "hinges" },
        { id: 6, name: "Петля с доводчиком", price: 650, image: "images/hinge2.jpg", category: "hinges" },
        { id: 7, name: "Петля скрытая", price: 890, image: "images/hinge3.jpg", category: "hinges" }
    ],
    systems: [
        { id: 8, name: "Направляющие шариковые 500мм", price: 1200, image: "images/system1.jpg", category: "systems" },
        { id: 9, name: "Система пантограф", price: 4500, image: "images/system2.jpg", category: "systems" },
        { id: 10, name: "Направляющие для ящиков", price: 780, image: "images/system3.jpg", category: "systems" }
    ],
    hardware: [
        { id: 11, name: "Шурупы конфирмат 6.4x50", price: 45, image: "images/hardware1.jpg", category: "hardware" },
        { id: 12, name: "Стяжка мебельная", price: 28, image: "images/hardware2.jpg", category: "hardware" },
        { id: 13, name: "Шкант мебельный 8x30", price: 12, image: "images/hardware3.jpg", category: "hardware" }
    ]
};

// Все товары для поиска
const allProducts = Object.values(products).flat();

// Корзина
let cart = JSON.parse(localStorage.getItem('vegadar_cart')) || {};

// Инициализация
document.addEventListener('DOMContentLoaded', function() {
    initApp();
    setupEventListeners();
    updateCartCount();
    renderFeed();
    renderAllProducts();
});

function initApp() {
    // Логотип спираль
    createLogoSvg('logoSvg');
    createLogoSvg('logoSvgFooter');
    
    // Рипл-эффект
    setupRippleEffects();
    
    // Показать категории по умолчанию
    showCategories();
}

function createLogoSvg(svgId) {
    const svg = document.getElementById(svgId);
    if (!svg) return;
    
    const spiral = document.createElementNS("http://www.w3.org/2000/svg", "path");
    spiral.setAttribute("d", "M60,60 m-40,0 a40,40 0 1,1 80,0 a40,40 0 1,1 -80,0");
    spiral.setAttribute("fill", "none");
    spiral.setAttribute("stroke", "#22C55E");
    spiral.setAttribute("stroke-width", "8");
    spiral.setAttribute("stroke-linecap", "round");
    spiral.setAttribute("stroke-dasharray", "100 200");
    spiral.setAttribute("stroke-dashoffset", "50");
    
    svg.appendChild(spiral);
}

function setupEventListeners() {
    // Поиск
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
        searchInput.addEventListener('focus', showSearchResults);
    }
    
    // Клик вне поиска
    document.addEventListener('click', (e) => {
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
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeCart();
        });
    }
    
    // Форма обратной связи
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }
}

// Поиск
function handleSearch(e) {
    const query = e.target.value.toLowerCase().trim();
    const resultsContainer = document.getElementById('searchResults');
    
    if (!query) {
        hideSearchResults();
        return;
    }
    
    const filtered = allProducts.filter(product => 
        product.name.toLowerCase().includes(query)
    );
    
    showSearchResults(filtered);
}

function showSearchResults(results = null) {
    const container = document.getElementById('searchResults');
    if (!container) return;
    
    if (results) {
        container.innerHTML = results.length ? 
            results.map(product => `
                <div class="search-result-item" onclick="addToCart(${product.id})">
                    <span>${product.name}</span>
                    <strong>${formatPrice(product.price)}</strong>
                </div>
            `).join('') :
            '<div class="no-results">Товары не найдены</div>';
    }
    
    container.style.display = 'block';
}

function hideSearchResults() {
    const container = document.getElementById('searchResults');
    if (container) container.style.display = 'none';
}

// Лента подборок
function renderFeed() {
    const scroller = document.getElementById('feedScroller');
    if (!scroller) return;
    
    const feeds = [
        { title: "Новинки", image: "images/feed-new.jpg" },
        { title: "Хиты продаж", image: "images/feed-popular.jpg" },
        { title: "Акции", image: "images/feed-sale.jpg" },
        { title: "Премиум", image: "images/feed-premium.jpg" }
    ];
    
    scroller.innerHTML = feeds.map(feed => `
        <div class="feed-card" role="listitem">
            <img src="${feed.image}" alt="${feed.title}" 
                 onerror="this.src='https://via.placeholder.com/600x400/22C55E/000000?text=${encodeURIComponent(feed.title)}'">
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
                <img src="${product.image}" alt="${product.name}" 
                     onerror="this.src='https://via.placeholder.com/400x300/22C55E/FFFFFF?text=${encodeURIComponent(product.name)}'">
                <div class="product-badge">В наличии</div>
            </div>
            <div class="product-content">
                <h3>${product.name}</h3>
                <p>Высокое качество, гарантия производителя</p>
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
    document.querySelectorAll('.catalog').forEach(el => el.style.display = 'none');
    document.getElementById('products').style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showCategory(category) {
    document.querySelectorAll('.catalog').forEach(el => el.style.display = 'none');
    document.getElementById('products').style.display = 'none';
    
    const target = document.getElementById(category);
    if (target) {
        target.style.display = 'block';
        window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
    }
}

// Корзина
function addToCart(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (!product) return;
    
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
    delete cart[productId];
    saveCart();
    updateCartCount();
    renderCart();
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
    localStorage.setItem('vegadar_cart', JSON.stringify(cart));
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
        container.innerHTML = '<div style="text-align:center;padding:2rem;color:#666">Корзина пуста</div>';
        if (totalElement) totalElement.textContent = formatPrice(0);
        return;
    }
    
    container.innerHTML = items.map(item => `
        <div class="cart-item">
            <div class="cart-item-name">${item.name}</div>
            <div class="cart-item-price">${formatPrice(item.price)}</div>
            <div class="cart-item-quantity">
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                <span>${item.quantity}</span>
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

// Утилиты
function formatPrice(price) {
    return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        minimumFractionDigits: 0
    }).format(price);
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

function openTelegram() {
    window.open('https://t.me/+79624044323', '_blank');
}

function toggleMobileMenu() {
    const menu = document.getElementById('navMenu');
    if (menu) {
        menu.classList.toggle('active');
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
        }
    });
}

function handleContactForm(e) {
    e.preventDefault();
    
    const name = document.getElementById('contactName').value;
    const phone = document.getElementById('contactPhone').value;
    const message = document.getElementById('contactMessage').value;
    
    // Имитация отправки
    showNotification('Сообщение отправлено! Свяжемся с вами в течение 15 минут');
    
    // Очистка формы
    e.target.reset();
    
    // В реальном приложении здесь был бы fetch запрос
    console.log('Contact form:', { name, phone, message });
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