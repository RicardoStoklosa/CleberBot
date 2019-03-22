const Telebot = require("telebot");
const bot = new Telebot('859246984:AAGJqxaI6-lq5JX_4iL84G9ihUm181IQe1o');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

bot.on('/status', msg => {
    console.log("Request Status Servidor")
    jsonRequest(function(){
        
        var saida = JSON.parse(this.responseText);
        if(saida.offline == null) {
            let text = "✅ Server Online | "+saida.players.online+"/"+saida.players.max+" ✅"+
            "\nOnline: "+saida.players.list;
            return bot.sendMessage(msg.chat.id,text);
            
        }
        return bot.sendMessage(msg.chat.id,"😢 SERVER OFFLINE 😢");
    });
});

bot.connect();


function jsonRequest(callback) {
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function () {
		
        console.log("Status["+xhr.status+"] ReadyState["+xhr.readyState+"]")
		if (xhr.status === 200 && this.readyState === 4) {
			
			if (typeof callback === "function") {
				callback.apply(xhr);
			}
		}
	};
	
    xhr.open("GET", "https://api.mcsrvstat.us/1/mechakitty.zapto.org", true);
    xhr.send();
    
}
