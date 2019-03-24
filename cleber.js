const Telebot = require("telebot");
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var express = require('express');
var app = express();

//release
const bot = new Telebot('891760896:AAH4OFP5Shfr9XPShDkZASPJ0n3OjHppeDA');
//test
// const bot = new Telebot('859246984:AAGJqxaI6-lq5JX_4iL84G9ihUm181IQe1o');


var port = process.env.PORT || 8080;

app.listen(port, function () {
});

bot.on('/status', msg => {
    console.log("Request Status Servidor")
    jsonRequest(function () {

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
    console("notificacao ativado no chat:"+msg.chat.nome)
    setInterval(function () {
        //console.log("intervalo")
        jsonRequest(function () {
            var online = true;
            var saida = JSON.parse(this.responseText);
            if (saida.offline != null && online) {
                console.error("Server caiu!!!")
                return bot.sendMessage(msg.chat.id, "🆘 @JoaoPelizza Server caiu 🆘");
                online = false;
            }else if(!online){
                online = true;
                
            }
            console.log("Server on")
        })
    }, 120000);
})

// setInterval(bot.on(
//     msg=>{
//         console.log("test")
//     }
// ),1000);


bot.connect();

function jsonRequest(callback) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {

        console.log("Status[" + xhr.status + "] ReadyState[" + xhr.readyState + "]")
        if (xhr.status === 200 && this.readyState === 4) {

            if (typeof callback === "function") {
                callback.apply(xhr);
            }
        }
    };

    xhr.open("GET", "https://api.mcsrvstat.us/1/mechakitty.zapto.org", true);
    xhr.send();

}
