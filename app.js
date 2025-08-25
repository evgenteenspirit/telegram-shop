// Cart functionality
let cart = [];
let cartCount = 0;

// Initialize cart from localStorage
function initCart() {
    const savedCart = localStorage.getItem('vegadar_cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartCount();
    }
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('vegadar_cart', JSON.stringify(cart));
}

// Update cart count
function updateCartCount() {
    cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    document.querySelector('.cart-count').textContent = cartCount;
}

// Add to cart
function addToCart(productName, productPrice) {
    const existingItem = cart.find(item => item.name === productName);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: productName,
            price: productPrice,
            quantity: 1
        });
    }
    
    saveCart();
    updateCartCount();
    showNotification(`✅ "${productName}" добавлен в корзину!`);
}

// Remove from cart
function removeFromCart(productName) {
    cart = cart.filter(item => item.name !== productName);
    saveCart();
    updateCartCount();
    updateCartModal();
}

// Update quantity
function updateQuantity(productName, change) {
    const item = cart.find(item => item.name === productName);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productName);
        } else {
            saveCart();
            updateCartModal();
        }
    }
}

// Calculate total
function calculateTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Update cart modal
function updateCartModal() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
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
                    <button class="quantity-btn" onclick="updateQuantity('${item.name}', -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity('${item.name}', 1)">+</button>
                </div>
                <button class="cart-item-remove" onclick="removeFromCart('${item.name}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
    }
    
    cartTotal.textContent = calculateTotal();
}

// Cart modal functionality
function setupCartModal() {
    const modal = document.getElementById('cartModal');
    const cartButton = document.getElementById('cartButton');
    const closeButton = document.querySelector('.close');
    const continueShopping = document.getElementById('continueShopping');
    const checkout