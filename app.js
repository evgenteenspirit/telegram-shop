// Данные товаров
const productsData = [
    // Мебельные ручки
    {
        id: 1,
        name: "Ручка мебельная 'Престиж' алюминиевая",
        price: 450,
        category: "handles",
        image: "images/handles.jpg",
        description: "Алюминиевая ручка с матовым покрытием, 128мм. Для современной мебели."
    },
    {
        id: 2,
        name: "Ручка-кноб 'Элегант' хром",
        price: 320,
        category: "handles",
        image: "images/handles.jpg",
        description: "Шарообразная ручка, хром покрытие, 32мм. Универсальное решение."
    },
    {
        id: 3,
        name: "Ручка С-образная 'Модерн'",
        price: 280,
        category: "handles",
        image: "images/handles.jpg",
        description: "Стальная ручка для современной мебели, 96мм. Стильный дизайн."
    },
    {
        id: 4,
        name: "Ручка скоба 'Классика' латунь",
        price: 390,
        category: "handles",
        image: "images/handles.jpg",
        description: "Латунная ручка для классической мебели, 128мм. Премиальное качество."
    },
    
    // Мебельные петли
    {
        id: 5,
        name: "Петля четырехшарнирная с доводчиком",
        price: 280,
        category: "hinges",
        image: "images/hinges.jpg",
        description: "С доводчиком, регулировка по 3 осям, 110°. Немецкое качество."
    },
    {
        id: 6,
        name: "Петля скрытая INVISIBLE",
        price: 390,
        category: "hinges",
        image: "images/hinges.jpg",
        description: "Скрытое крепление, для современных интерьеров. Невидимый монтаж."
    },
    {
        id: 7,
        name: "Петля накладная 95°",
        price: 220,
        category: "hinges",
        image: "images/hinges.jpg",
        description: "Для мебельных фасадов, угол открывания 95°. Надежная конструкция."
    },
    {
        id: 8,
        name: "Петля полного навеса 175°",
        price: 310,
        category: "hinges",
        image: "images/hinges.jpg",
        description: "Для угловых шкафов, широкий угол открывания. С плавным ходом."
    },
    
    // Системы хранения
    {
        id: 9,
        name: "Направляющая шариковая 400мм",
        price: 890,
        category: "systems",
        image: "images/drawers.jpg",
        description: "Для выдвижных ящиков, нагрузка до 50кг, 400мм. Плавный ход."
    },
    {
        id: 10,
        name: "Лифт подъемный механизм газлифт",
        price: 1250,
        category: "systems",
        image: "images/drawers.jpg",
        description: "Для верхних шкафов, плавное открывание. Gas-lift система."
    },
    {
        id: 11,
        name: "Направляющая телескопическая 450мм",
        price: 750,
        category: "systems",
        image: "images/drawers.jpg",
        description: "Полное выдвижение, нагрузка до 35кг, 450мм. Тихая работа."
    },
    {
        id: 12,
        name: "Система пантограф для верхних шкафов",
        price: 1850,
        category: "systems",
        image: "images/drawers.jpg",
        description: "Для верхних шкафов, вертикальное открывание. Премиум-класс."
    },
    
    // Крепежные изделия
    {
        id: 13,
        name: "Винт мебельный конфирмат 6.3x50mm",
        price: 5,
        category: "hardware",
        image: "images/hardware.jpg",
        description: "Для сборки мебели, 6.3x50mm, оцинкованный. Высокая прочность."
    },
    {
        id: 14,
        name: "Угловая стяжка мебельная",
        price: 15,
        category: "hardware",
        image: "images/hardware.jpg",
        description: "Для перпендикулярного соединения деталей. Надежная фиксация."
    },
    {
        id: 15,
        name: "Шуруп мебельный 4x30mm",
        price: 3,
        category: "hardware",
        image: "images/hardware.jpg",
        description: "Универсальный шуруп для ДСП, 4x30mm. Антикоррозийное покрытие."
    },
    {
        id: 16,
        name: "Мебельный уголок усиленный",
        price: 25,
        category: "hardware",
        image: "images/hardware.jpg",
        description: "Усиленный уголок для крепления полок. Грузоподъемность 50кг."
    }
];

// Корзина
let cart = [];
let cartCount = 0;

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    initCart();
    setupEventListeners();
    setupMobileMenu();
    loadAllProducts();
    setupSearch();
    
    console.log('Сайт загружен! Поиск работает корректно!');
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

function clearCart() {
    cart = [];
    saveCart();
    updateCartCount();
    updateCartModal();
    showNotification('🗑️ Корзина очищена');
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

// Модальное окно корзины
function setupCartModal() {
    const modal = document.getElementById('cartModal');
    const cartButton = document.getElementById('cartButton');
    const closeButton = document.querySelector('.close');
    const continueShopping = document.getElementById('continueShopping');
    const checkoutButton = document.getElementById('checkout');
    const clearCartButton = document.getElementById('clearCart');

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

    if (clearCartButton) {
        clearCartButton.addEventListener('click', clearCart);
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
        `• ${item.name} - ${item.quantity}шт. × ${item.price}₽ = ${item.quantity * item.price}₽`
    ).join('\n');

    const totalAmount = calculateTotal();
    const message = `🛒 ЗАКАЗ С САЙТА VEGADAR.RU\n\n${orderItems}\n\n💰 ИТОГО: ${totalAmount}₽\n\n📞 Для подтверждения заказа свяжитесь с клиентом.`;

    const phone = '+79624044323';
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(phone)}&text=${encodeURIComponent(message)}`;
    
    window.open(telegramUrl, '_blank');
    
    showNotification('✅ Заказ оформлен! Открываю Telegram для отправки.');
    
    cart = [];
    saveCart();
    updateCartCount();
    closeCartModal();
}

// Навигация по категориям
function showCategory(category) {
    // Скрываем все секции
    document.getElementById('products').style.display = 'none';
    document.getElementById('handles').style.display = 'none';
    document.getElementById('hinges').style.display = 'none';
    document.getElementById('systems').style.display = 'none';
    document.getElementById('hardware').style.display = 'none';
    
    // Показываем выбранную категорию
    document.getElementById(category).style.display = 'block';
    
    // Прокручиваем к категории
    document.getElementById(category).scrollIntoView({ behavior: 'smooth' });
}

function showCategories() {
    // Скрываем все категории
    document.getElementById('handles').style.display = 'none';
    document.getElementById('hinges').style.display = 'none';
    document.getElementById('systems').style.display = 'none';
    document.getElementById('hardware').style.display = 'none';
    
    // Показываем главную секцию с категориями
    document.getElementById('products').style.display = 'block';
    
    // Прокручиваем к категориям
    document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
}

function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

// Загрузка товаров
function loadAllProducts() {
    const categories = ['handles', 'hinges', 'systems', 'hardware'];
    
    categories.forEach(category => {
        const productsGrid = document.getElementById(category + 'Products');
        const categoryProducts = productsData.filter(product => product.category === category);
        
        productsGrid.innerHTML = categoryProducts.map(product => `
            <div class="product-card">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/400x200/32CD32/000000?text=Мебельная+Фурнитура'">
                    <div class="product-badge">${getCategoryName(product.category)}</div>
                </div>
                <div class="product-content">
                    <h3>${product.name}</h3>
                    <p>${product.description}</p>
                    <div class="product-price">${product.price} ₽</div>
                    <div class="product-actions">
                        <button class="btn btn-primary" onclick="addToCart(${product.id}, '${product.name.replace(/'/g, "\\'")}', ${product.price})">
                            <i class="fas fa-cart-plus"></i>
                            В корзину
                        </button>
                        <button class="btn btn-secondary" onclick="orderProduct(${product.id})">
                            <i class="fab fa-telegram"></i>
                            Заказать
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    });
}

function getCategoryName(category) {
    const names = {
        'handles': 'Ручки',
        'hinges': 'Петли',
        'systems': 'Системы',
        'hardware': 'Крепеж'
    };
    return names[category] || 'Товар';
}

// Поиск - ИСПРАВЛЕННАЯ ВЕРСИЯ
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    
    if (!searchInput || !searchResults) {
        console.error('Элементы поиска не найдены!');
        return;
    }
    
    searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase().trim();
        
        if (query.length < 2) {
            searchResults.style.display = 'none';
            return;
        }
        
        const results = productsData.filter(product => 
            product.name.toLowerCase().includes(query) || 
            product.description.toLowerCase().includes(query)
        );
        
        if (results.length > 0) {
            searchResults.innerHTML = results.map(product => `
                <div class="search-result-item" onclick="selectSearchResult('${product.category}', ${product.id})">
                    <div class="search-result-name">${product.name}</div>
                    <div class="search-result-price">${product.price} ₽</div>
                </div>
            `).join('');
            searchResults.style.display = 'block';
        } else {
            searchResults.innerHTML = '<div class="no-results">Товары не найдены</div>';
            searchResults.style.display = 'block';
        }
    });
    
    // Скрываем результаты при клике вне поиска
    document.addEventListener('click', function(e) {
        if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
            searchResults.style.display = 'none';
        }
    });
}

function selectSearchResult(category, productId) {
    showCategory(category);
    document.getElementById('searchInput').value = '';
    document.getElementById('searchResults').style.display = 'none';
    
    // Прокручиваем к категории
    setTimeout(() => {
        document.getElementById(category).scrollIntoView({ behavior: 'smooth' });
    }, 100);
}

// Заказ товара
function orderProduct(productId) {
    const product = productsData.find(p => p.id === productId);
    if (product) {
        const message = `Здравствуйте! Хочу заказать товар: ${product.name} - ${product.price}₽`;
        openTelegramWithMessage(message);
    }
}

// Открытие Telegram
function openTelegram() {
    const message = 'Здравствуйте! У меня вопрос по мебельной фурнитуре.';
    openTelegramWithMessage(message);
}

function openTelegramWithMessage(message) {
    const phone = '+79624044323';
    const url = `https://t.me/share/url?url=${encodeURIComponent(phone)}&text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}

// ИИ-ассистент
function openAIAssistant() {
    showNotification('🤖 ИИ-ассистент будет подключен в ближайшее время');
    // В будущем здесь будет интеграция с ИИ-ассистентом
}

// Мобильное меню
function setupMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');

    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }

    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });
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
    const fullMessage = `📧 НОВАЯ ЗАЯВКА С САЙТА VEGADAR.RU\n\n👤 Имя: ${name}\n📞 Телефон: ${phone}\n💬 Сообщение: ${message || 'Не указано'}`;
    openTelegramWithMessage(fullMessage);
    
    document.getElementById('contactForm').reset();
    showNotification('✅ Сообщение отправлено! Мы свяжемся с вами в течение 15 минут.');
}