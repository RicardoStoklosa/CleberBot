const Telebot = require("telebot");

var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var express = require("express");
var app = express();
var notificationList = [];

var telegramToken = process.env.TOKEN;
const bot = new Telebot(telegramToken);

var port = process.env.PORT || 8080;

app.listen(port, function() {});

bot.on("/status", msg => {
  console.log("[" + msg.chat.id + "] Request Status Servidor");
  jsonRequest(msg.chat.id, function() {
    var output = JSON.parse(this.responseText);
    if (output.offline == null) {
      let text =
        "✅ Server Online | " +
        output.players.online +
        "/" +
        output.players.max +
        " ✅";
      if (output.players.online != 0)
        text = text + ("\nOnline: " + output.players.list);
      return bot.sendMessage(msg.chat.id, text);
    }
    return bot.sendMessage(msg.chat.id, "😢 SERVER OFFLINE 😢");
  });
});

bot.on("/start", msg => {
  if (!notificationList.includes(msg.chat.id)) {
    notificationList.push(msg.chat.id);
    var online = true;
    bot.sendMessage(msg.chat.id, "Notificação ativada");
    console.log("[" + msg.chat.id + "] notificação ativada");
    setInterval(function() {
      jsonRequest(msg.chat.id, function() {
        var output = JSON.parse(this.responseText);
        if (output.offline != null && online) {
          console.error("[" + msg.chat.id + "] Server caiu!!!");
          online = false;
          return bot.sendMessage(msg.chat.id, "🆘 @JoaoPelizza Server caiu 🆘");
        } else if (!online) {
          online = true;
        }
        console.log("[" + msg.chat.id + "] Server on");
      });
    }, 100000);
  } else {
    console.log("Notificação ja ativa no chat: " + msg.chat.id);
    return bot.sendMessage(msg.chat.id, "Notificação ja ativa neste chat");
  }
});

bot.connect();

function jsonRequest(id, callback) {
  var xhr = new XMLHttpRequest();
  console.log("[" + id + "] Request iniciado");
  xhr.onreadystatechange = function() {
    if (xhr.readyState < 3) console.log("[" + id + "] Request carregando");

    if (xhr.status == 200 && xhr.readyState == 4) {
      console.log("[" + id + "] Request Completo");
      if (typeof callback === "function") {
        callback.apply(xhr);
      }
    }
  };

  xhr.open("GET", "https://api.mcsrvstat.us/1/mechakitty.zapto.org", true);
  xhr.send();
}
