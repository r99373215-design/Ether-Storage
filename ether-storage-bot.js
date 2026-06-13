const { Telegraf } = require('telegraf');

// 1. TOKEN-UL PRINCIPAL AL BOTULUI (Trebuie să fie exact cel primit de la BotFather)
const BOT_TOKEN = '8925262516:AAHIVRm1YUCfutCA7PNSGoX0oguY-nFdRvo'; 

// 2. TOKEN-UL PORTOCALIU DE TEST PENTRU PLĂȚI
const PROVIDER_TOKEN = '1877036958:TEST:0f46819803f313bb0877833524bf5c9d7959df8f';

// 3. LINK-UL CĂTRE MINI APP (Pune link-ul tău de Ngrok sau GitHub Pages)
// Linia 10 - Link-ul tău permanent și securizat (HTTPS) din GitHub Pages
const WEB_APP_URL = 'https://r99373215-design.github.io/Ether-Storage/';

const bot = new Telegraf(BOT_TOKEN);

// Comanda /start - Trimite butonul de tastatură nativă
bot.start((ctx) => {
    ctx.reply('Привет! Добро пожаловать в Ether Storage. Открой магазин с кнопки ниже:', {
        reply_markup: {
            keyboard: [
                [
                    {
                        text: '🛍️ Открыть Магазин',
                        web_app: { url: WEB_APP_URL }
                    }
                ]
            ],
            resize_keyboard: true
        }
    });
});

// Ascultarea datelor trimise din Mini App
bot.on('web_app_data', async (ctx) => {
    try {
        const data = JSON.parse(ctx.webAppData.data);

        if (data.action === 'buy_product') {
            // Telegram vrea prețul în bănuți (kopeks), înmulțim cu 100
            const prices = [{ label: 'Ether Storage', amount: data.price * 100 }];

            // Structura corectă Telegraf: title, description, payload, providerToken, currency, prices
            await ctx.replyWithInvoice(
                data.title,
                `Оплата заказа в магазине Ether Storage`,
                `order_${ctx.from.id}_${Date.now()}`,
                PROVIDER_TOKEN,
                'RUB',
                prices
            );
        }
    } catch (e) {
        console.error("Eroare la procesarea datelor WebApp:", e);
        ctx.reply('Eroare la crearea facturii de test.');
    }
});

// Confirmarea obligatorie pentru Telegram (Pre-Checkout)
bot.on('pre_checkout_query', (ctx) => ctx.answerPreCheckoutQuery(true));

// Mesaj în caz de plată reușită
bot.on('successful_payment', (ctx) => {
    ctx.reply('🎉 [TEST] Plata a trecut cu succes! Produsul a fost procesat.');
});

// Pornirea botului
bot.launch().then(() => {
    console.log('🚀 Serverul a pornit! Botul Ether Storage este activ în regim de TEST.');
}).catch((err) => {
    console.error('❌ Eroare la pornirea botului. Verifică BOT_TOKEN-ul!', err);
});