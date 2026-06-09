document.addEventListener("DOMContentLoaded", () => {
    // Ініціалізація кошика зі сховища або створення порожнього
    let cart = JSON.parse(localStorage.getItem('shop_cart')) || [];
    
    const cartBadge = document.querySelector('.badge-cart');

    // Функція оновлення кількості товарів на іконці кошика
    function updateCartBadge() {
        if (cartBadge) {
            const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
            cartBadge.textContent = totalCount;
        }
    }

    // Анімація для кнопок при наведенні
    document.querySelectorAll('.btn, .hover-btn, .hover-btn-sec').forEach(btn => {
        btn.style.transition = "transform 0.2s ease";
        btn.addEventListener('mouseenter', () => btn.style.transform = 'translateY(-2px)');
        btn.addEventListener('mouseleave', () => btn.style.transform = 'translateY(0)');
    });

    // Логіка кліку на кнопку "Купити"
    const buyButtons = document.querySelectorAll('.group-card .hover-btn-sec');
    
    buyButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Знаходимо батьківську картку товару, щоб залісти в її data-атрибути
            const productCard = e.target.closest('.product-card');
            
            const product = {
                id: productCard.getAttribute('data-id'),
                title: productCard.getAttribute('data-title'),
                price: parseFloat(productCard.getAttribute('data-price')),
                img: productCard.getAttribute('data-img'),
                quantity: 1
            };

            // Перевіряємо, чи є вже такий товар в кошику
            const existingProduct = cart.find(item => item.id === product.id);

            if (existingProduct) {
                existingProduct.quantity += 1; // Якщо є, збільшуємо кількість
            } else {
                cart.push(product); // Якщо немає, додаємо новий об'єкт
            }

            // Зберігаємо оновлений кошик в браузері
            localStorage.setItem('shop_cart', JSON.stringify(cart));
            
            // Оновлюємо цифру
            updateCartBadge();

            // Ефект міні-анімації іконки кошика при покупці
            if (cartBadge) {
                cartBadge.style.transform = 'translate(-50%, -50%) scale(1.4)';
                setTimeout(() => cartBadge.style.transform = 'translate(-50%, -50%) scale(1)', 150);
            }
        });
    });

    // Відобразити актуальну кількість при завантаженні сторінки
    updateCartBadge();
});