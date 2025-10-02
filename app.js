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

// Корзина
let cart = [];
let cartCount = 0;
let currentFilter = 'all';

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

// Работа с товарами
function renderProducts() {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;

    const filteredProducts = currentFilter === 'all' 
        ? productsData 
        : productsData.filter(product => product.category === currentFilter);

    productsGrid.innerHTML = filteredProducts.map(product => `
        <div class="product-card" data-category="${product.category}">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/400x300/22C55E/FFFFFF?text=Мебельная+Фурнитура'">
            </div>
            <div class="product-content">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <div class="product-price">${product.price} ₽</div>
                <button class="btn-primary add-to-cart" onclick="addToCart(${product.id}, '${product.name}', ${product.price})">
                    <i class="fas fa-cart-plus"></i>
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
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            currentFilter = this.getAttribute('data-filter');
            renderProducts();
        });
    });
}

// Модальное окно корзины
function setupCartModal() {
    const modal = document.getElementById('cartModal');
    const cartButton = document.getElementById('cartButton');
    const closeButton = document.querySelector('.close');
    const continueShopping = document.getElementById('continueShopping');
    const checkoutButton = document.getElementById('checkout');

    if (cartButton) {
        cartButton.addEventListener('click', openCartModal);
    }

    if (closeButton) {
        closeButton.addEventListener('click', closeCartModal);
    }

    if (continueShopping) {
        continueShopping.addEventListener('click', closeCartModal);
    }

    if (checkoutButton) {
        checkoutButton.addEventListener('click', processCheckout);
    }

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeCartModal();
        }
    });
}

function openCartModal() {
    const modal = document.getElementById('cartModal');
    updateCartModal();
    modal.style.display = 'block';
}

function closeCartModal() {
    const modal = document.getElementById('cartModal');
    modal.style.display = 'none';
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

function processCheckout() {
    if (cart.length === 0) {
        showNotification('❌ Корзина пуста!');
        return;
    }

    const orderItems = cart.map(item => 
        `${item.name} - ${item.quantity}шт. × ${item.price}₽ = ${item.quantity * item.price}₽`
    ).join('%0A');

    const totalAmount = calculateTotal();
    const message = `Здравствуйте! Хочу оформить заказ:%0A%0A${orderItems}%0A%0AИтого: ${totalAmount}₽%0A%0AПрошу связаться для подтверждения заказа.`;

    const phone = '+79624044323';
    const telegramUrl = `https://t.me/share/url?url=${phone}&text=${message}`;
    
    // Открываем Telegram
    window.open(telegramUrl, '_blank');
    
    showNotification('✅ Заказ оформлен! Открываю Telegram для отправки.');
    
    // Очищаем корзину
    cart = [];
    saveCart();
    updateCartCount();
    closeCartModal();
}

// Открытие Telegram для консультации
function openTelegram() {
    const phone = '+79624044323';
    const message = 'Здравствуйте! У меня вопрос по мебельной фурнитуре.';
    const telegramUrl = `https://t.me/share/url?url=${phone}&text=${message}`;
    window.open(telegramUrl, '_blank');
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
        notification.remove();
    }, 3000);
}

// Настройка всех обработчиков событий
function setupEventListeners() {
    setupCartModal();
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
    const fullMessage = `Новая заявка с сайта:%0AИмя: ${name}%0AТелефон: ${phone}%0AСообщение: ${message || 'Не указано'}`;
    const telegramUrl = `https://t.me/share/url?url=+79624044323&text=${fullMessage}`;
    
    window.open(telegramUrl, '_blank');
    
    // Очистка формы
    document.getElementById('contactForm').reset();
    
    showNotification('✅ Сообщение отправлено! Открываю Telegram.');
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