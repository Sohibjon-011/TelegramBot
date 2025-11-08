require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const token = process.env.TOKEN;
const bot = new TelegramBot(token, { polling: true });
const axios = require('axios');

// bot.onText(/\/start/, (msg) => {
//     bot.sendMessage(msg.chat.id, "Iltimos locationingizni yuboring!", {
//         reply_markup: {
//             keyboard: [
//                 [
//                     {
//                         text: "Locationni yuborish",
//                         request_location: true
//                     }
//                 ]
//             ],
//             resize_keyboard: true,
//             one_time_keyboard: true,
//         }
//     });
// });
// bot.on("location", (msg) => {
//     const {latitude, longitude} = msg.location;
//     bot.sendMessage(msg.chat.id, `Locationingiz: ${latitude}, ${longitude}`);
// })


bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, "Iltimos telefon raqamingizni yuboring!", {
        reply_markup: {
            keyboard: [
                [
                    {
                        text: "Telefon raqamni yuborish",
                        request_contact: true
                    }
                ]
            ],
            resize_keyboard: true,
            one_time_keyboard: true,
        }
    });
});
bot.on("contact", (msg) => {
    bot.sendMessage(msg.chat.id, `Telefon raqamingiz: ${msg.contact.phone_number}`);
});


const keyboard = {
    reply_markup: {
        keyboard: [
            ["1", "2", "3"],
            ["4", "5", "6"],
            ["7", "8", "9"],
            ["O'chirish"],
        ],
        resize_keyboard: true,
        one_time_keyboard: false,
    }
}

// /start komandasi
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(
        chatId,
        `Assalomu aleykum ${msg.from.first_name}! Botimizga xush kelibsiz!`
    )
    bot.sendMessage(chatId, "Raqamlardan birini tanlang", keyboard)
    bot.sendMessage(
        chatId,
        `Pastdagi tugmalardan birini tanlang 👇`,
        {
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: "Google",
                            url: "https://www.google.com",
                        },
                        {
                            text: "Bio bot",
                            callback_data: "bio_bot",
                        }
                    ],
                    [
                        {
                            text: "Test",
                            callback_data: "test",
                        }
                    ],
                    [
                        {
                            text: "Users",
                            callback_data: "users",
                        }
                    ]
                ]
            },
        }
    )
})

bot.on('message', (msg) => {
    if(msg.text === "1") {
        bot.sendMessage(msg.chat.id, "Siz 1 sonini tanladingiz !")
    }
    else if(msg.text === "2") {
        bot.sendMessage(msg.chat.id, "Siz 2 sonini tanladingiz !")
    }
    else if(msg.text === "3") {
        bot.sendMessage(msg.chat.id, "Siz 3 sonini tanladingiz !")
    }
    else if(msg.text === "4") {
        bot.sendMessage(msg.chat.id, "Siz 4 sonini tanladingiz !")
    }
    else if(msg.text === "5") {
        bot.sendMessage(msg.chat.id, "Siz 5 sonini tanladingiz !")
    }
    else if(msg.text === "6") {
        bot.sendMessage(msg.chat.id, "Siz 6 sonini tanladingiz !")
    }
    else if(msg.text === "7") {
        bot.sendMessage(msg.chat.id, "Siz 7 sonini tanladingiz !")
    }
    else if(msg.text === "8") {
        bot.sendMessage(msg.chat.id, "Siz 8 sonini tanladingiz !")
    }
    else if(msg.text === "9") {
        bot.sendMessage(msg.chat.id, "Siz 9 sonini tanladingiz !")
    }
    else if(msg.text === "O'chirish") {
        bot.sendMessage(msg.chat.id, "O'chirildi", {
            reply_markup: {
                remove_keyboard: true,
            }
        })
    }
    else{
        bot.sendMessage(msg.chat.id, "Bunday son mavjud emas !")
    }
})

bot.on('callback_query', async (query) => {
    const chatId = query.message.chat.id;

    if (query.data === "bio_bot") {
        bot.sendMessage(chatId, "Bio bot haqida ma'lumot berilmoqda...");
    }
    else if (query.data === "error") {
        bot.answerCallbackQuery(query.id, {
            text: "Xatolik yuz berdi !",
            show_alert: true,
        })
    }
    else if (query.data === "test") {
        bot.answerCallbackQuery(query.id, {
            text: "Bu tugma vaqtincha nosoz !",
            show_alert: true,
        })
        bot.sendMessage(chatId, "Iltimos boshqa tugmani tanlang !")
    }
    else if (query.data === "users") {
        try {
            const response = await axios.get("https://jsonplaceholder.typicode.com/users");
            const users = response.data;
            let buttons = users.map((user) => [
                { text: user.name, callback_data: `user_${user.id}` },
            ]);
            bot.sendMessage(chatId, "Foydalanuvchini tanlang:", {
                reply_markup: { inline_keyboard: buttons },
            });
        } catch (err) {
            bot.sendMessage(chatId, "API bilan bog‘lanishda xatolik yuz berdi!");
        }
    }
    else if (query.data.startsWith("user_")) {
        const userId = query.data.split("_")[1];
        try {
            const response = await axios.get(
                `https://jsonplaceholder.typicode.com/users/${userId}`
            );
            const user = response.data;
            bot.editMessageText(`*😀 Ismi:* ${user.name}\n*😄 Familiyasi:* ${user.username}\n*📩 Emaili:* ${user.email}\n*🏡 Yashash joyi:* ${user.address.street}\n*☎ Telefon raqami:* ${user.phone}`,
                {
                    chat_id: chatId,
                    message_id: query.message.message_id,
                    parse_mode: "Markdown",
                    reply_markup: {
                        inline_keyboard: [
                            [
                                {
                                    text: "Ortga qaytish",
                                    callback_data: "users"
                                }
                            ]
                        ]
                    }
                }
            );
        } catch (err) {
            bot.sendMessage(chatId, "Ma'lumot topilmadi !");
        }
        bot.answerCallbackQuery(query.id);
    }
    else {
        bot.answerCallbackQuery(query.id, {
            text: "Bu tugma vaqtinchalik nosoz !",
            show_alert: true,
        });
    }
});

// bot.on("polling_error", (err) => console.log(err));
