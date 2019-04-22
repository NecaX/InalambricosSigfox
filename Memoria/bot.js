process.env["NTBA_FIX_319"] = 1;
const TelegramBot = require('node-telegram-bot-api');
const settings = require("./Settings.json");
const telegramToken = settings.telegramToken;
const azureToken = settings.azureToken;
const bot = new TelegramBot(telegramToken, {polling: true});
const excel = require('excel4node');
var chatID = 0;

var date = new Date();
var workbook = new excel.Workbook();
var worksheet = workbook.addWorksheet('Sheet 1');
var style = workbook.createStyle({
    font: {
      color: '000000',
      size: 12
    },
    numberFormat: '#0; (#0); -'
});
worksheet.cell(1,2).string('Pulsaciones').style(style);
worksheet.cell(1,3).string('Temperatura').style(style);
worksheet.cell(1,4).string('Tensión').style(style);
worksheet.cell(1,5).string('Glucosa').style(style);
var i = 2;

const { EventHubClient, EventPosition } = require('@azure/event-hubs');


var printError = function (err) {
    console.log(err.message);
};
  
var printMessage = function (message) {
    console.log('Mensaje recibido desde dispositivo Sigfox');
    console.log(message.body);
    var current_hour = date.getHours().toString()+':'+date.getMinutes().toString();
    worksheet.cell(i,1).string(current_hour).style(style);
    worksheet.cell(i,2).string(message.body.pulsaciones).style(style);
    worksheet.cell(i,3).string(message.body.temperatura).style(style);
    worksheet.cell(i,4).string(message.body.tension).style(style);
    worksheet.cell(i,5).string(message.body.glucosa).style(style);
    i = i+1;
    workbook.write('Excel.xlsx');

    //Pulsaciones
    if(message.body.pulsaciones < 60){
        bot.sendMessage(chatId, current_hour+' - Alerta, pulsaciones bajas ('+message.body.pulsaciones+')');
    } 
    if(message.body.pulsaciones > 120){
        bot.sendMessage(chatId, current_hour+' - Alerta, pulsaciones altas ('+message.body.pulsaciones+')');
    }

    //Temperatura
    if(message.body.temperatura < 35){
        bot.sendMessage(chatId, current_hour+' - Alerta, temperatura bajas ('+message.body.temperatura+')');
    } 
    if(message.body.temperatura > 39){
        bot.sendMessage(chatId, current_hour+' - Alerta, temperatura altas ('+message.body.temperatura+')');
    }

    //Tension
    if(message.body.tension < 80){
        bot.sendMessage(chatId, current_hour+' - Alerta, tensión baja ('+message.body.tension+')');
    } 
    if(message.body.tension > 120){
        bot.sendMessage(chatId, current_hour+' - Alerta, tensión alta ('+message.body.tension+')');
    }

    //Glucosa
    if(message.body.glucosa < 69){
        bot.sendMessage(chatId, current_hour+' - Alerta, glucosa baja ('+message.body.glucosa+')');
    } 
    if(message.body.glucosa > 140){
        bot.sendMessage(chatId, current_hour+' - Alerta, glucosa alta ('+message.body.glucosa+')');
    }
};

var ehClient;
EventHubClient.createFromIotHubConnectionString(azureToken).then(function (client) {
    console.log("Conectado a Azure IOT Hub.");
    ehClient = client;
    return ehClient.getPartitionIds();
}).then(function (ids) {
    return ids.map(function (id) {
        return ehClient.receive(id, printMessage, printError, { eventPosition: EventPosition.fromEnqueuedTime(Date.now()) });
    });
}).catch(printError);


bot.onText(/\/conectar/, (msg, match) => {
    chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Bienvenido al monitor de salud');
});

bot.onText(/\/about/, (msg, match) => {
    bot.sendMessage(chatId, 'Github: https://github.com/NecaX/InalambricosSigfox');
});