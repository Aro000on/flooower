// Плавная прокрутка с учетом хедера
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offset = 80;
            const elementPosition = target.offsetTop - offset;
            window.scrollTo({
                top: elementPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Анимация при скролле
const fadeElements = document.querySelectorAll('.fade-in');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1 });

fadeElements.forEach(el => observer.observe(el));

// Эффект скролла для навбара
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Корзина
let cart = [];
const cartIcon = document.getElementById('cartIcon');
const cartModal = document.getElementById('cartModal');
const cartOverlay = document.getElementById('cartOverlay');
const cartItemsDiv = document.getElementById('cartItems');
const cartTotalSpan = document.getElementById('cartTotal');

// Функция обновления корзины
function updateCart() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartIcon.textContent = `🛒 Корзина (${itemCount})`;
    
    if (cartItemsDiv) {
        if (cart.length === 0) {
            cartItemsDiv.innerHTML = '<p style="text-align: center; color: #999;">Корзина пуста</p>';
        } else {
            cartItemsDiv.innerHTML = cart.map(item => `
                <div class="cart-item">
                    <div>
                        <strong>${item.name}</strong><br>
                        <span style="color: #999;">${item.price} ₸ × ${item.quantity}</span>
                    </div>
                    <div>
                        <button class="remove-item" data-name="${item.name}" style="background: none; border: none; color: #e91e63; cursor: pointer; font-size: 24px;">&times;</button>
                    </div>
                </div>
            `).join('');
            
            // Добавляем обработчики удаления
            document.querySelectorAll('.remove-item').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const name = btn.getAttribute('data-name');
                    const itemIndex = cart.findIndex(item => item.name === name);
                    if (itemIndex > -1) {
                        if (cart[itemIndex].quantity > 1) {
                            cart[itemIndex].quantity--;
                        } else {
                            cart.splice(itemIndex, 1);
                        }
                        updateCart();
                        saveCart();
                    }
                });
            });
        }
        cartTotalSpan.textContent = `Итого: ${total} ₸`;
    }
}

// Сохранение в localStorage
function saveCart() {
    localStorage.setItem('flooowerCart', JSON.stringify(cart));
}

// Загрузка корзины
function loadCart() {
    const saved = localStorage.getItem('flooowerCart');
    if (saved) {
        cart = JSON.parse(saved);
        updateCart();
    }
}

// Добавление товара
function addToCart(name, price) {
    const existing = cart.find(item => item.name === name);
    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ name, price, quantity: 1 });
    }
    updateCart();
    saveCart();
    
    // Анимация уведомления
    const btn = event.target;
    const originalText = btn.textContent;
    btn.textContent = '✓ Добавлено!';
    btn.style.background = '#4caf50';
    btn.style.color = 'white';
    setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
        btn.style.color = '';
    }, 1000);
}

// Открытие корзины
cartIcon.addEventListener('click', () => {
    cartModal.classList.add('open');
    cartOverlay.classList.add('open');
});

function closeCart() {
    cartModal.classList.remove('open');
    cartOverlay.classList.remove('open');
}

document.getElementById('closeCart').addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);

// Оформление заказа
document.getElementById('checkoutBtn').addEventListener('click', () => {
    if (cart.length === 0) {
        alert('🌷 Корзина пуста! Добавьте цветы 🎁');
        return;
    }
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    alert(`✨ Спасибо за заказ!\n\nСумма: ${total} ₸\n\nНаш оператор свяжется с вами в ближайшее время. 🌸`);
    cart = [];
    updateCart();
    saveCart();
    closeCart();
});

// Добавление обработчиков на кнопки "В корзину"
const buttons = document.querySelectorAll('.add-to-cart');
buttons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const card = btn.closest('.product-card');
        const name = card.querySelector('h3').textContent;
        const priceText = card.querySelector('.price').textContent;
        const price = parseInt(priceText.replace(/[^\d]/g, ''));
        addToCart(name, price);
    });
});

// Загружаем корзину при старте
loadCart();

// Анимация для карточек при наведении
document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transition = 'all 0.4s ease';
    });
});

// Добавляем плавный скролл для кнопки "Смотреть коллекцию"
const heroBtn = document.querySelector('.btn');
if (heroBtn) {
    heroBtn.addEventListener('click', function(e) {
        if (this.getAttribute('href') === '#catalog') {
            e.preventDefault();
            const catalog = document.querySelector('#catalog');
            if (catalog) {
                const offset = 80;
                window.scrollTo({
                    top: catalog.offsetTop - offset,
                    behavior: 'smooth'
                });
            }
        }
    });
}

// Анимация логотипа при клике (возврат наверх)
document.querySelector('.logo').addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});