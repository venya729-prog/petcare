document.addEventListener("DOMContentLoaded", () => {
    // Отримуємо або створюємо масив кошика з браузера
    let cart = JSON.parse(localStorage.getItem('shop_cart')) || [];
    
    const cartBadge = document.querySelector('.badge-cart');

    // Оновлення лічильника в шапці
    function updateCartBadge() {
        if (cartBadge) {
            const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
            cartBadge.textContent = totalCount;
        }
    }

    // Слухач на кнопки "Купити"
    const buyButtons = document.querySelectorAll('.product-card .hover-btn-sec');
    
    buyButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productCard = e.target.closest('.product-card');
            
            // Збір інформації про обраний одяг
            const product = {
                id: productCard.getAttribute('data-id'),
                title: productCard.getAttribute('data-title'),
                price: parseFloat(productCard.getAttribute('data-price')),
                img: productCard.getAttribute('data-img'),
                quantity: 1
            };

            // Логіка додавання/оновлення кількості
            const existingProduct = cart.find(item => item.id === product.id);

            if (existingProduct) {
                existingProduct.quantity += 1;
            } else {
                cart.push(product);
            }

            // Збереження даних у локальну пам'ять
            localStorage.setItem('shop_cart', JSON.stringify(cart));
            
            // Оновлення індикатора
            updateCartBadge();

            // Ефектний сплеск лічильника кошика
            if (cartBadge) {
                cartBadge.style.transform = 'translate(-50%, -50%) scale(1.3)';
                setTimeout(() => cartBadge.style.transform = 'translate(-50%, -50%) scale(1)', 150);
            }
        });
    });

    // Показуємо актуальну кількість товарів під час завантаження
    updateCartBadge();
});