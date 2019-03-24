const Telebot = require("telebot");
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var express = require('express');
var app = express();
var notificacao = [];
//release
// const bot = new Telebot('891760896:AAH4OFP5Shfr9XPShDkZASPJ0n3OjHppeDA');
//test
const bot = new Telebot('859246984:AAGJqxaI6-lq5JX_4iL84G9ihUm181IQe1o');


var port = process.env.PORT || 8080;

app.listen(port, function () {
});

bot.on('/status', msg => {
    console.log("["+msg.chat.id+"] Request Status Servidor")
    jsonRequest(msg.chat.id, function () {

        var saida = JSON.parse(this.responseText);
        if (saida.offline == null) {
            let text = "✅ Server Online | " + saida.players.online + "/" + saida.players.max + " ✅";
            if (saida.players.online != 0)
                text = text + ("\nOnline: " + saida.players.list);
            return bot.sendMessage(msg.chat.id, text);

        }
        return bot.sendMessage(msg.chat.id, "😢 SERVER OFFLINE 😢");
    });
});
// setInterval(function () { console.log("oi")},10000)
bot.on('/start', msg => {

    if (!notificacao.includes(msg.chat.id)) {
        notificacao.push(msg.chat.id)
        var online = true;
        bot.sendMessage(msg.chat.id,"Notificação ativada")
        console.log("["+msg.chat.id+"]notificacao ativada")
        setInterval(function () {
            
            jsonRequest(msg.chat.id,function () {

                var saida = JSON.parse(this.responseText);
                if (saida.offline != null && online) {
                    console.error("["+msg.chat.id+"] Server caiu!!!")
                    online = false;
                    return bot.sendMessage(msg.chat.id, "🆘 @JoaoPelizza Server caiu 🆘");

                } else if (!online) {
                    online = true;

                }
                console.log("["+msg.chat.id+"] Server on")
            })
        }, 100000);
    }else{
        console.log("Notificacao ja ativada no chat: " + msg.chat.id)
        return bot.sendMessage(msg.chat.id, "Notificação ja ativada neste chat")
    }
})




bot.connect();

function jsonRequest(id, callback) {
    var xhr = new XMLHttpRequest();
    console.log("["+id+"] Request iniciado")
    xhr.onreadystatechange = function () {

        if(xhr.readyState < 3)
            console.log("["+id+"] Request carregando");
        //console.log("Status[" + xhr.status + "] ReadyState[" + xhr.readyState + "]")

       
            
        if (xhr.status == 200 && xhr.readyState == 4) {
            console.log("["+id+"] Request Completo");
            if (typeof callback === "function") {
                callback.apply(xhr);
            }
        }
    };

    xhr.open("GET", "https://api.mcsrvstat.us/1/mechakitty.zapto.org", true);
    xhr.send();

}
