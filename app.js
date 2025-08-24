const products = [
    {
        id: 1,
        name: "Ручка-скоба матовая (128мм)",
        price: "85 ₽",
        category: "handles",
        image: "https://via.placeholder.com/250x250?text=Ручка+128мм",
        description: "Материал: сталь, цвет: матовый никель"
    },
    {
        id: 2,
        name: "Ручка-кнопка золото (16мм)",
        price: "45 ₽",
        category: "handles",
        image: "https://via.placeholder.com/250x250?text=Ручка+16мм",
        description: "Материал: алюминий, цвет: золото"
    },
    {
        id: 3,
        name: "Петля четырехшарнирная (110°)",
        price: "120 ₽",
        category: "loops",
        image: "https://via.placeholder.com/250x250?text=Петля+110°",
        description: "Регулировка по 3 осям, накладная"
    },
    {
        id: 4,
        name: "Направляющая роликовая (400мм)",
        price: "190 ₽",
        category: "guides",
        image: "https://via.placeholder.com/250x250?text=Направляющая",
        description: "Для выдвижных ящиков, нагрузка до 30кг"
    },
    {
        id: 5,
        name: "Винт конфирмат (6.3x50mm)",
        price: "5 ₽",
        category: "fasteners",
        image: "https://via.placeholder.com/250x250?text=Конфирмат",
        description: "Упаковка 100 шт., оцинкованный"
    },
    {
        id: 6,
        name: "Угловая стяжка",
        price: "15 ₽",
        category: "fasteners",
        image: "https://via.placeholder.com/250x250?text=Угловая+стяжка",
        description: "Для перпендикулярного соединения"
    }
];

// Текущий выбранный товар
let currentProduct = null;

// Функция для отображения товаров
function displayProducts(category = 'all') {
    const container = document.getElementById('productsContainer');
    container.innerHTML = ''; // Очищаем контейнер

    const filteredProducts = category === 'all' 
        ? products 
        : products.filter(product => product.category === category);

    filteredProducts.forEach(product => {
        const productElement = document.createElement('div');
        productElement.className = 'product';
        productElement.dataset.category = product.category;
        
        productElement.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <p><strong>${product.price}</strong></p>
            <button class="buy-btn" onclick="openOrderModal(${product.id})">Купить</button>
        `;
        
        container.appendChild(productElement);
    });
}

// Функция для фильтрации товаров по категориям
function filterProducts(category) {
    // Убираем активный класс у всех кнопок
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    // Добавляем активный класс нажатой кнопке
    event.target.classList.add('active');
    
    displayProducts(category);
}

// Функция открытия модального окна
function openOrderModal(productId) {
    currentProduct = products.find(p => p.id === productId);
    
    // Заполняем данные (если есть интеграция с Telegram)
    if (window.Telegram && Telegram.WebApp) {
        const user = Telegram.WebApp.initDataUnsafe.user;
        if (user) {
            document.getElementById('userName').value = user.first_name || '';
        }
    }
    
    // Показываем модальное окно и затемнение
    document.getElementById('orderModal').style.display = 'block';
    document.getElementById('overlay').style.display = 'block';
}

// Функция отправки заказа
function sendOrder() {
    const name = document.getElementById('userName').value;
    const phone = document.getElementById('userPhone').value;
    const comment = document.getElementById('userComment').value;

    if (!name || !phone) {
        alert('Пожалуйста, заполните имя и телефон');
        return;
    }

    const message = `
🛒 НОВЫЙ ЗАКАЗ ФУРНИТУРЫ!
───────────────────────
👤 КЛИЕНТ: ${name}
📞 ТЕЛЕФОН: ${phone}
───────────────────────
📦 ТОВАР: ${currentProduct.name}
💰 ЦЕНА: ${currentProduct.price}
📝 КОММЕНТАРИЙ: ${comment || 'Не указан'}
───────────────────────
🌐 САЙТ: ${window.location.href}
    `;

    // Отправляем в Telegram (используйте ваш существующий метод)
    sendToTelegram(message);
    
    // Закрываем модальное окно
    closeOrderModal();
    
    // Показываем подтверждение
    alert('✅ Спасибо за заказ! Мы свяжемся с вами в течение 15 минут для подтверждения.');
}

// Функция закрытия модального окна
function closeOrderModal() {
    document.getElementById('orderModal').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
    // Очищаем поля
    document.getElementById('userName').value = '';
    document.getElementById('userPhone').value = '';
    document.getElementById('userComment').value = '';
}

// Назначаем обработчики событий после загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация товаров
    displayProducts();
    
    // Назначаем обработчики для кнопок модального окна
    document.getElementById('confirmOrder').addEventListener('click', sendOrder);
    document.getElementById('closeModal').addEventListener('click', closeOrderModal);
    
    // Закрытие по клику на затемнение
    document.getElementById('overlay').addEventListener('click', closeOrderModal);
});

// Ваша существующая функция отправки в Telegram (оставьте как есть)
async function sendToTelegram(message) {
    try {
        const response = await fetch('/api/telegram', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message }),
        });
        
        if (!response.ok) {
            console.error('Ошибка отправки сообщения');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}