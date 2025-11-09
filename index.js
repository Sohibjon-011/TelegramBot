require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const token = process.env.TOKEN;
const bot = new TelegramBot(token, { polling: true });
const axios = require('axios');
const User = require('./modules/user.modules');
const user = {};

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.chat.id;
    user[userId] = { userid: userId, username: null, phonenumber: null }
    bot.sendMessage(chatId, "Assalomu aleykum! Ismingizni kiriting: ");
});

// Habar kelganda ismni saqlash
bot.on("message", async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.chat.id;
    if (!user[userId]) return;
    if (!user[userId].username) {
        user[userId].username = msg.text;
        bot.sendMessage(chatId, "Ismingiz qabul qilindi! Telefon raqamingizni jo'nating: ", {
            reply_markup: {
                keyboard: [
                    [
                        {
                            text: "Telefon raqamni jo'nating",
                            request_contact: true
                        }
                    ]
                ],
                resize_keyboard: true,
                one_time_keyboard: true,
            }
        });
        return;
    }
    if (msg.contact) {
        user[userId].phonenumber = msg.contact.phone_number;
        bot.sendMessage(chatId, "Telefon raqamingiz qabul qilindi!", {
            reply_markup: {
                remove_keyboard: true
            }
        });
        bot.sendMessage(chatId, "Ma'lumotlaringizni tasdiqlang! \nIsmingiz: " + user[userId].username + "\nTelefon raqamingiz: " + user[userId].phonenumber, {
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: "Tasdiqlash",
                            callback_data: `save_${userId}`
                        },
                        {
                            text: "Bekor qilish",
                            callback_data: `cancel_${userId}`
                        }
                    ]
                ],
                resize_keyboard: true,
                one_time_keyboard: true
            }
        });
        return;
    }    
});

// Ma'lumotlarni saqlash yoki rad etish uchun

bot.on('callback_query', async (query) => {
    const chatId = query.message.chat.id;
    const data = query.data;
    const userId = query.from.id;
    if(!user[userId]) {
        bot.answerCallbackQuery(query.id, {
            text: "Ma'lumotlaringiz topilmadi! Iltimos /start buyrug'ini bering.",
            show_alert: true
        });
        return;
    }
    if(data === `save_${userId}`) {
        try {
            const newUser = new User(
                user[userId].userid,
                user[userId].username,
                user[userId].phonenumber,
            );
            await newUser.save();
            bot.sendMessage(chatId, "Ma'lumotlaringiz saqlandi!",);
            delete user[userId];
        } catch (error) {
            bot.sendMessage(chatId, "Ma'lumotlaringiz saqlanmadi! Iltimos qaytadan urinib ko'ring.");
            console.error("Saqlanishda muommo", error);
        }
    }
    else if(data === `cancel_${userId}`) {
        bot.sendMessage(chatId, "Ma'lumotlaringiz saqlanmadi!");
        delete user[userId];
    }
});
