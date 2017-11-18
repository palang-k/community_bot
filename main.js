const TelegramBot = require('node-telegram-bot-api');
const request = require('request');

const consts = require('./consts.js');
const token = require('./token.js');

const exchangeApi = "https://coinbine.com/api/exchange/"
const tokenKey = token.key;
const exchangeDictionary = consts.exchangeDictionary;
const currencyDictionary = consts.currencyDictionary;

const bot = new TelegramBot(tokenKey, {polling: true});

bot.onText(/!(.+)/, (msg, match) => {

});

bot.on('message', (msg) => {
  const chatId = msg.chat.id;  
  const words = msg.text.split(' ');
  
  var command = words[0];
  if (command === '!시세' && words.length > 2) {
    var exchange = exchangeDictionary[words[1]];
    var currency =  currencyDictionary[words[2]];

    if (!exchange || !currency) {
      return
    }

    request(exchangeApi + exchange, { json: true }, (err, res, body) => {
      if (err) { 
        console.log(err);
        return;
      }

      if (!body.krw) {
        return 
      }

      var data = body.krw[currency]
      if (data) {
        let price = Math.floor(data["last"]);
        bot.sendMessage(chatId, price + "원 입니다");
      }
     });
  }  

});