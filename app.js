// Telegram WebApp Initialization
function initTelegramApp() {
    if (window.Telegram && Telegram.WebApp) {
        const tg = window.Telegram.WebApp;
        
        // Expand to full screen
        tg.expand();
        
        // Set background color
        tg.setBackgroundColor('#000000');
        
        // Enable closing confirmation
        tg.enableClosingConfirmation();
        
        // Back button handling
        tg.BackButton.onClick(() => {
            tg.close();
        });
        
        // Set header color
        tg.setHeaderColor('#000000');
        
        console.log('Telegram WebApp initialized successfully');
        return tg;
    }
    console.log('Telegram WebApp not detected - running in browser');
    return null;
}

// Global variables
let cart = [];
let currentFilter = 'all';

// Product data
const products = {
    handles: [
        {
            id: 1,
            name: 'Ручка мебельная "Престиж"',
            description: 'Алюминиевая ручка с матовым покрытием',
            price: 450,
            image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80',
            category: 'handles'
        },
        {
            id: 2,
            name: 'Ручка "Модерн"',
            description: 'Стальная ручка с хромированным покрытием',
            price: 380,
            image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80',
            category: 'handles'
        },
        {
            id: 3,
            name: 'Кноб деревянный',
            description: 'Натуральное дерево, классический дизайн',
            price: 520,
            image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80',
            category: 'handles'
        }
    ],
    hinges: [
        {
            id: 4,
            name: 'Петля четырехшарнирная',
            description: 'С доводчиком, регулировка по 3 осям',
            price: 320,
            image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80',
            category: 'hinges'
        },
        {
            id: 5,
            name: 'Петля скрытого монтажа',
            description: 'Для мебельных фасадов, невидимая установка',
            price: 280,
            image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80',
            category: 'hinges'
        },
        {
            id: 6,
            name: 'Подъемный механизм',
            description: 'Для вертикальных фасадов, плавный ход',
            price: 890,
            image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80',
            category: 'hinges'
        }
    ],
    storage: [
        {
            id: 7,
            name: 'Направляющая шариковая',
            description: 'Для выдвижных ящиков, нагрузка до 50кг',
            price: 890,
            image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80',
            category: 'storage'
        },
        {
            id: 8,
            name: 'Система выдвижных корзин',
            description: 'Для кухонной мебели, металлические корзины',
            price: 1250,
            image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80',
            category: 'storage'
        },
        {
            id: 9,
            name: 'Направляющая телескопическая',
            description: 'Полное выдвижение, плавный ход',
            price: 670,
            image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80',
            category: 'storage'
        }
    ]
};

// Utility Functions
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
        
        // Close mobile menu if open
        closeMobileMenu();
    }
}

function handleNavClick(sectionId) {
    scrollToSection(sectionId);
}

function showContactForm() {
    scrollToSection('contacts');
    setTimeout(() => {
        const nameInput = document.getElementById('contactName');
        if (nameInput) nameInput.focus();
    }, 800);
}

function downloadCatalog() {
    showNotification('📥 Каталог будет отправлен вам в ближайшее время!');
    sendToTelegram('📥 Запрос каталога товаров с сайта Вегадар');
}

function addToCart(productName, price, productId) {
    cart.push({ id: productId, name: productName, price: price });
    showNotification(`✅ "${productName}" добавлен в корзину!`);
    
    // Send to Telegram
    sendToTelegram(`🛒 Добавлен товар в корзину: ${productName} - ${price}₽`);
}

// Catalog filtering
function filterCatalog(category) {
    currentFilter = category;
    
    // Update active filter button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Scroll to catalog section
    scrollToSection('catalog');
    
    // Render products
    renderProducts();
}

function renderProducts() {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;
    
    let productsToShow = [];
    
    if (currentFilter === 'all') {
        // Show all products from all categories
        Object.values(products).forEach(categoryProducts => {
            productsToShow = productsToShow.concat(categoryProducts);
        });
    } else {
        // Show products from specific category
        productsToShow = products[currentFilter] || [];
    }
    
    if (productsToShow.length === 0) {
        productsGrid.innerHTML = `
            <div class="no-products">
                <i class="fas fa-box-open"></i>
                <h3>Товары не найдены</h3>
                <p>В этой категории пока нет товаров</p>
            </div>
        `;
        return;
    }
    
    productsGrid.innerHTML = productsToShow.map(product => `
        <div class="product-card">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
            </div>
            <div class="product-content">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <div class="product-price">${product.price} ₽</div>
                <button class="btn-primary" onclick="addToCart('${product.name}', ${product.price}, ${product.id})">
                    В корзину
                </button>
            </div>
        </div>
    `).join('');
}

// Gallery functionality
class Gallery {
    constructor() {
        this.slider = document.querySelector('.gallery-slider');
        this.track = document.querySelector('.gallery-track');
        this.slides = document.querySelectorAll('.gallery-slide');
        this.prevBtn = document.querySelector('.gallery-prev');
        this.nextBtn = document.querySelector('.gallery-next');
        this.dotsContainer = document.querySelector('.gallery-dots');
        
        this.currentIndex = 0;
        this.slideCount = this.slides.length;
        
        this.init();
    }
    
    init() {
        this.createDots();
        this.setupEventListeners();
        this.updateGallery();
    }
    
    createDots() {
        for (let i = 0; i < this.slideCount; i++) {
            const dot = document.createElement('div');
            dot.className = 'gallery-dot';
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => this.goToSlide(i));
            this.dotsContainer.appendChild(dot);
        }
    }
    
    setupEventListeners() {
        this.prevBtn.addEventListener('click', () => this.prevSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());
        
        // Touch events for mobile
        let startX, endX;
        
        this.track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });
        
        this.track.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            this.handleSwipe(startX, endX);
        });
    }
    
    handleSwipe(startX, endX) {
        const diff = startX - endX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                this.nextSlide();
            } else {
                this.prevSlide();
            }
        }
    }
    
    goToSlide(index) {
        this.currentIndex = index;
        this.updateGallery();
    }
    
    prevSlide() {
        this.currentIndex = (this.currentIndex - 1 + this.slideCount) % this.slideCount;
        this.updateGallery();
    }
    
    nextSlide() {
        this.currentIndex = (this.currentIndex + 1) % this.slideCount;
        this.updateGallery();
    }
    
    updateGallery() {
        const offset = -this.currentIndex * 100;
        this.track.style.transform = `translateX(${offset}%)`;
        
        // Update dots
        document.querySelectorAll('.gallery-dot').forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentIndex);
        });
    }
}

// Mobile menu functionality
function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            const isVisible = navMenu.style.display === 'flex';
            navMenu.style.display = isVisible ? 'none' : 'flex';
            
            // Animate hamburger icon
            const spans = this.querySelectorAll('span');
            if (!isVisible) {
                spans[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }
}

function closeMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    
    if (navMenu && window.innerWidth <= 768) {
        navMenu.style.display = 'none';
        
        // Reset hamburger icon
        if (mobileMenuBtn) {
            const spans = mobileMenuBtn.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    }
}

// Smooth scroll for navigation
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                closeMobileMenu();
            }
        });
    });
}

// Animation on scroll
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
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll(
        '.category-card, .advantage-card, .contact-card, .product-card, .about-feature'
    );
    
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'all 0.6s ease';
        observer.observe(element);
    });
}

// Form handling
function initFormHandling() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('contactName').value;
            const phone = document.getElementById('contactPhone').value;
            const message = document.getElementById('contactMessage').value;
            
            const telegramMessage = `
📧 НОВЫЙ ЗАПРОС С САЙТА ВЕГАДАР
───────────────────────
👤 Имя: ${name}
📞 Телефон: ${phone}
───────────────────────
💬 Сообщение:
${message || 'Не указано'}
───────────────────────
🌐 Сайт: vegadar.ru
            `;
            
            sendToTelegram(telegramMessage);
            showNotification('✅ Спасибо! Мы свяжемся с вами в течение 15 минут.');
            this.reset();
        });
    }
}

// Notification system
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--green);
        color: var(--black);
        padding: 1rem 2rem;
        border-radius: 12px;
        font-weight: 600;
        z-index: 10000;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        animation: slideIn 0.3s ease;
        max-width: 300px;
        text-align: center;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add notification animations
function addNotificationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        .catalog-filters {
            display: flex;
            gap: 1rem;
            justify-content: center;
            margin: 2rem 0;
            flex-wrap: wrap;
        }
        
        .filter-btn {
            background: var(--light-gray);
            border: 2px solid var(--light-gray);
            color: var(--gray);
            padding: 0.8rem 1.5rem;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s ease;
            font-weight: 500;
        }
        
        .filter-btn:hover,
        .filter-btn.active {
            background: var(--green);
            border-color: var(--green);
            color: var(--black);
        }
        
        .no-products {
            text-align: center;
            padding: 3rem;
            color: var(--gray);
        }
        
        .no-products i {
            font-size: 3rem;
            margin-bottom: 1rem;
            color: var(--green);
        }
    `;
    document.head.appendChild(style);
}

// Fixed header on scroll
function initScrollHeader() {
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.header');
        if (window.scrollY > 100) {
            header.style.background = 'rgba(0, 0, 0, 0.98)';
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.background = 'rgba(0, 0, 0, 0.95)';
            header.style.boxShadow = 'none';
        }
    });
}

// Telegram message sending
async function sendToTelegram(message) {
    try {
        // This would typically send to your backend
        console.log('Telegram message:', message);
        
        // Simulate API call
        const response = await fetch('/api/telegram', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message }),
        });
        
        if (!response.ok) {
            console.error('Ошибка отправки сообщения в Telegram');
        }
    } catch (error) {
        console.error('Error sending to Telegram:', error);
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Telegram
    initTelegramApp();
    
    // Initialize gallery if it exists
    if (document.querySelector('.gallery-slider')) {
        window.gallery = new Gallery();
    }
    
    // Initialize all components
    initSmoothScroll();
    initScrollAnimations();
    initFormHandling();
    initScrollHeader();
    initMobileMenu();
    addNotificationStyles();
    
    // Render initial products
    renderProducts();
    
    // Auto-advance gallery slides
    setInterval(() => {
        if (window.gallery) {
            window.gallery.nextSlide();
        }
    }, 5000);
    
    console.log('VEGADAR shop initialized successfully');
});