const tg = window.Telegram?.WebApp;

// Inițializare Mini App și setare temă neagră
if (tg) {
    tg.ready();
    tg.expand();
    tg.setHeaderColor("#000000");
    tg.setBackgroundColor("#000000");
}

// Array-ul în care salvăm produsele adăugate în coș
let cart = [];

// Selectăm elementele de interfață ale coșului
const cartModal = document.getElementById("cart-modal");
const cartToggleBtn = document.getElementById("cart-toggle-btn");
const closeCartBtn = document.getElementById("close-cart-btn");
const checkoutBtn = document.getElementById("checkout-btn");
const cartItemsContainer = document.getElementById("cart-items");
const cartCountSpan = document.getElementById("cart-count");
const cartTotalPriceSpan = document.getElementById("cart-total-price");

// 1. Deschide fereastra modală a coșului
if (cartToggleBtn && cartModal) {
    cartToggleBtn.addEventListener("click", () => {
        cartModal.classList.remove("hidden");
    });
}

// 2. Închide fereastra modală a coșului
if (closeCartBtn && cartModal) {
    closeCartBtn.addEventListener("click", () => {
        cartModal.classList.add("hidden");
    });
}

// 3. Ascultăm click-urile pe butoanele produselor pentru adăugarea în coș
document.querySelectorAll(".cart-button").forEach((button) => {
    button.addEventListener("click", () => {
        button.classList.add("is-added");
        setTimeout(() => {
            button.classList.remove("is-added");
        }, 600);

        // Vibrație tactilă (Haptic Feedback) pe telefon
        if (tg?.HapticFeedback) {
            tg.HapticFeedback.impactOccurred("light");
        }

        // Preluăm datele specifice ale produsului din atributele HTML
        const title = button.getAttribute("data-title");
        const price = parseInt(button.getAttribute("data-price")) || 0;

        // Adăugăm produsul în array-ul local
        cart.push({ title, price });

        // Actualizăm interfața grafică a coșului
        updateCartUI();
    });
});

// 4. Funcția care redesenează elementele din coș și recalculează prețul total
function updateCartUI() {
    if (cartCountSpan) {
        cartCountSpan.innerText = cart.length;
    }

    if (!cartItemsContainer) return;

    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach((item) => {
        total += item.price;

        const itemElement = document.createElement("div");
        itemElement.className = "cart-item";
        itemElement.innerHTML = `
            <span>${item.title}</span>
            <span>${item.price} ₽</span>
        `;
        cartItemsContainer.appendChild(itemElement);
    });

    if (cartTotalPriceSpan) {
        cartTotalPriceSpan.innerText = total;
    }
}

// 5. Trimiterea datelor către bot la apăsarea butonului „Оплатить заказ”
if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
        if (cart.length === 0) {
            alert("Ваша корзина пуста!");
            return;
        }

        const totalAmount = cart.reduce((sum, item) => sum + item.price, 0);
        const orderTitle = `Заказ (${cart.length} шт.)`;

        // Construim structura JSON pe care o așteaptă botul tău în backend
        const dataToSend = {
            action: 'buy_product',
            title: orderTitle,
            price: totalAmount
        };

        // Mesaj de control vizual (Să vezi că butonul reacționează instant)
        alert(`Tranzacție inițiată pentru: ${orderTitle} (${totalAmount} ₽). Se trimite către Telegram...`);

        // Trimitem datele direct în chat. Telegram va închide automat Mini App-ul.
        if (tg) {
            try {
                tg.sendData(JSON.stringify(dataToSend));
            } catch (error) {
                console.error("Eroare sendData (asigură-te că ai deschis din tastatura botului):", error);
            }
        } else {
            alert("Eroare: Nu ești în interiorul Telegram WebApp.");
        }
    });
}