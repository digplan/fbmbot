# fbmbot
Simpler Facebook Messenger bots
````
var bot = require('fbmbot')();

bot.onmessagetext = (user, txt, body) => {
  bot.sendText(user.id, 'Hi')  // (fbid, txt, [wait seconds, metadata]
}
bot.onpostback = (user, postback) => {
  ...
}

bot.setupGetStartedButton()  one-time
bot.sendTypingOn(user.id)
bot.sendQuickReply(user.id, [])
bot.sendPromptLocation(user.id)
bot.queryUser(user.id, callback)
bot.sendMessage(user.id, {})
bot.users // [users since bot was restarted]
bot.app  // express app
  
````
