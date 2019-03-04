process.env["NTBA_FIX_319"] = 1;
const TelegramBot = require('node-telegram-bot-api');
const settings = require("./settings.json");
const token = settings.token;
const bot = new TelegramBot(token, {polling: true});

bot.onText(/\/echo (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const resp = match[1];
    bot.sendMessage(chatId, resp);
});

bot.onText(/\/about/, (msg, match) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Github: https://github.com/NecaX/InalambricosSigfox');
});

bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    //bot.sendMessage(chatId, 'Mensaje Recibido');
});