document.addEventListener("DOMContentLoaded", () => {
    // Завантажуємо дані
    let cart = JSON.parse(localStorage.getItem('shop_cart')) || [];
    
    const cartContainer = document.querySelector('.JSON-cart-container');
    const emptyState = document.querySelector('.empty-cart-state');
    const itemsWrapper = document.querySelector('.items-list-wrapper');
    const headerCartBadge = document.querySelector('.badge-cart');
    
    const subtotalEl = document.querySelector('.summary-subtotal');
    const totalEl = document.querySelector('.summary-total');
    const shippingEl = document.querySelector('.summary-shipping');
    
    const promoInput = document.getElementById('promo-input');
    const promoBtn = document.querySelector('.btn-apply-promo');
    const promoMsg = document.querySelector('.promo-message');
    
    let isPromoApplied = false;
    const PROMO_DISCOUNT = 0.10; 
    const PROMO_CODE = "PUPPY10";

    // Головна функція рендеру та перерахунку
    function renderCart() {
        // 1. Перевірка на порожнечу
        if (cart.length === 0) {
            if (cartContainer) cartContainer.classList.add('d-none');
            if (emptyState) emptyState.classList.remove('d-none');
            if (headerCartBadge) headerCartBadge.textContent = "0";
            return;
        }

        if (cartContainer) cartContainer.classList.remove('d-none');
        if (emptyState) emptyState.classList.add('d-none');

        // 2. Генерація HTML для кожного товару з масиву
        itemsWrapper.innerHTML = ''; // Очищуємо старий статичний вміст
        
        let subtotal = 0;
        let totalItemsCount = 0;

        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;
            totalItemsCount += item.quantity;

            const itemHtml = `
                <div class="bg-custom-lowest card-custom p-3 shadow-sm d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3 cart-item" data-id="${item.id}">
                    <div class="d-flex align-items-center gap-3">
                        <div class="bg-custom-low rounded overflow-hidden shadow-sm product-img-thumb">
                            <img alt="${item.title}" class="w-100 h-100 object-cover" src="${item.img}"/>
                        </div>
                        <div>
                            <h3 class="font-body-lg font-bold m-0 text-truncate max-w-sm-title">${item.title}</h3>
                            <p class="text-caption text-custom-on-surface-variant m-0 mt-1">Код товару: #00${item.id}</p>
                        </div>
                    </div>
                    
                    <div class="d-flex align-items-center justify-content-between justify-content-sm-end gap-4 w-sm-100">
                        <div class="d-flex align-items-center border border-custom-high custom-rounded overflow-hidden bg-custom-surface">
                            <button class="btn btn-sm px-2 py-1 border-0 dec-qty d-flex align-items-center" data-id="${item.id}"><span class="material-symbols-outlined fs-6">remove</span></button>
                            <input type="number" class="form-control form-control-sm border-0 text-center bg-transparent qty-input p-0" value="${item.quantity}" readonly style="width: 35px; font-weight: 600;">
                            <button class="btn btn-sm px-2 py-1 border-0 inc-qty d-flex align-items-center" data-id="${item.id}"><span class="material-symbols-outlined fs-6">add</span></button>
                        </div>
                        <div class="text-end min-w-price">
                            <span class="text-custom-primary font-bold fs-5 item-total-price">${itemTotal} грн</span>
                        </div>
                        <button class="btn text-custom-on-surface-variant p-1 border-0 remove-item d-flex align-items-center hover-danger" data-id="${item.id}">
                            <span class="material-symbols-outlined">delete</span>
                        </button>
                    </div>
                </div>
            `;
            itemsWrapper.insertAdjacentHTML('beforeend', itemHtml);
        });

        // 3. Розрахунок підсумків фінансів
        if (headerCartBadge) headerCartBadge.textContent = totalItemsCount;
        if (subtotalEl) subtotalEl.textContent = `${subtotal} грн`;

        let finalTotal = subtotal;
        if (isPromoApplied) {
            finalTotal = subtotal * (1 - PROMO_DISCOUNT);
        }

        // Логіка доставки
        let deliveryFee = 0;
        if (subtotal < 1000 && subtotal > 0) {
            deliveryFee = 50;
            if (shippingEl) shippingEl.textContent = "50 грн";
            if (shippingEl) shippingEl.className = "font-body-md text-dark summary-shipping";
        } else {
            deliveryFee = 0;
            if (shippingEl) shippingEl.textContent = "Безкоштовно";
            if (shippingEl) shippingEl.className = "font-body-md text-success summary-shipping";
        }

        if (totalEl) totalEl.textContent = `${Math.round(finalTotal) + deliveryFee} грн`;
    }

    // Слухач кліків на кнопки всередині динамічного списку (Плюс / Мінус / Видалити)
    if (itemsWrapper) {
        itemsWrapper.addEventListener('click', (e) => {
            const target = e.target.closest('button');
            if (!target) return;

            const id = target.getAttribute('data-id');
            const itemIndex = cart.findIndex(item => item.id === id);
            if (itemIndex === -1) return;

            // Кнопка +
            if (target.classList.contains('inc-qty')) {
                cart[itemIndex].quantity += 1;
            }
            // Кнопка -
            else if (target.classList.contains('dec-qty')) {
                if (cart[itemIndex].quantity > 1) {
                    cart[itemIndex].quantity -= 1;
                }
            }
            // Кнопка видалення
            else if (target.classList.contains('remove-item')) {
                cart.splice(itemIndex, 1);
            }

            // Зберігаємо зміни та перерендеримо сторінку кошика
            localStorage.setItem('shop_cart', JSON.stringify(cart));
            renderCart();
        });
    }

    // Промокод
    if (promoBtn) {
        promoBtn.addEventListener('click', () => {
            const enteredCode = promoInput.value.trim().toUpperCase();
            if (enteredCode === PROMO_CODE && !isPromoApplied) {
                isPromoApplied = true;
                if (promoMsg) promoMsg.classList.remove('d-none');
                promoInput.setAttribute('disabled', 'true');
                promoBtn.setAttribute('disabled', 'true');
                renderCart();
            } else if (enteredCode !== PROMO_CODE) {
                alert("Невірний промокод! Спробуйте: PUPPY10");
            }
        });
    }

    // Оформлення замовлення (очищення кошика після покупки)
    const checkoutBtn = document.querySelector('.btn-checkout');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            alert("Дякуємо! Ваше замовлення прийнято в обробку.");
            cart = [];
            localStorage.removeItem('shop_cart');
            renderCart();
        });
    }

    // Перший запуск при відкритті cart.html
    renderCart();
});