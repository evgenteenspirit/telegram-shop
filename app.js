// Обработчик кнопок "Купить"
document.addEventListener('DOMContentLoaded', function() {
    const buyButtons = document.querySelectorAll('.buy-btn');
    
    buyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const product = this.closest('.product');
            const productName = product.querySelector('h3').textContent;
            const productPrice = product.querySelector('p').textContent;
            
            alert(`Вы выбрали: ${productName}\n${productPrice}\n\nДля оформления заказа свяжитесь с нами в Telegram!`);
        });
    });
});

// Можно добавить больше функций:
// - Отправка данных в Telegram бот
// - Корзина товаров
// - Фильтрация товаров