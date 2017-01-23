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
bot.use() // pipeline requests
````
````
const bot = require('./fbbot.js')()
var users = {}

bot.onpostback = (user, postback)=>{
  return bot.sendText(user.id, 'OK ready')
}

bot.use((user, text, next) => {
  console.log('We have users', users)
  bot.sendText(user.id, `Hi there, ${users[user.id].first_name}`)
})

bot.use((user, text, next) => {
  if(users[user.id]) return next()
  
  bot.queryUser(user.id, userinfo => {
    users[user.id] = userinfo
    next()
  })
})
````
