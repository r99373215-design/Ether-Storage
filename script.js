const tg = window.Telegram?.WebApp;

if (tg) {
    tg.ready();
    tg.expand();
    tg.setHeaderColor("#000000");
    tg.setBackgroundColor("#000000");
}

document.querySelectorAll(".cart-button").forEach((button) => {
    button.addEventListener("click", () => {
        button.classList.add("is-added");

        if (tg?.HapticFeedback) {
            tg.HapticFeedback.impactOccurred("light");
        }

        window.setTimeout(() => {
            button.classList.remove("is-added");
        }, 220);
    });
});
