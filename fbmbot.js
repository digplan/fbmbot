var headers = {"Content-Type": "application/json"}

module.exports = debug => {
  var debug_resp = (r, j) => { if(debug) console.log('<', r) }
  var token = process.env.token
  if(!token) throw Error('Need a process.env.token')
  var fburl_POST = `https://graph.facebook.com/me/messages?access_token=${token}`; 
  var users = {}
  var bot = {
    app: app,
    sendText: (toid, txt, wait, metadata) => {
      metadata = metadata || '';
      if(!toid) throw Error('sendText needs an id');
      if(wait) bot.sendTypingOn(toid);
      setTimeout(k=>{
        bot.sendMessage(toid, { "text": txt, "metadata": metadata })
      }, wait*1000)
    },
    setupGetStartedButton: () => {
      var obj = {data: {"setting_type":"call_to_actions","thread_state":"new_thread","call_to_actions":[{"payload":"USER_DEFINED_PAYLOAD"}]}, headers: headers}
      ajax.post(`https://graph.facebook.com/v2.6/me/thread_settings?access_token=${token}`, obj).then(console.log);      
    },
    sendTypingOn: (toid) => {
      var obj = {data: {"recipient": { "id": toid }, "sender_action": "typing_on"}, headers: headers}
      if(debug) console.log('>>>', obj)
      ajax.post(fburl_POST, obj).then(debug_resp);
    },
    sendQuickReply: (toid, qrarr) => {
      bot.sendMessage(toid, {"text":'ok', "quick_replies":qrarr})
    },
    sendPromptLocation: (toid)=>{
      bot.sendQuickReply(toid, [{"content_type":"location"}])
    },
    queryUser: (fbid, cb) => {
      ajax.get(`https://graph.facebook.com/v2.6/${fbid}?fields=first_name,last_name,profile_pic,locale,timezone,gender&access_token=${token}`).then(cb)
    },
    sendMessage: (toid, message) => {
      var obj = {data: {"recipient": { "id": toid }, "message": message}, headers: headers}
      if(debug) console.log('>>>', obj)
      ajax.post(fburl_POST, obj).then(debug_resp);
    } 
  }
  
  var express = require('express')
  var app = express()
  var bodyParser = require('body-parser')
  app.use(bodyParser.json())
  app.use(express.static('public'))
  var ajax = require('ajax.js')
   
  app.get("/", (r,s) => {
    s.end(r.query['hub.challenge'] || 'ok')
  })
   
  app.post("/", (r, s) => {
    if(r.body.entry[0].messaging[0].postback){
      var user = r.body.entry[0].messaging[0].sender
      if(!users[user.id]) users[user.id] = user
      var postback = r.body.entry[0].messaging[0].postback
      return bot.onpostback(user, postback)
    }
    if(!r.body.entry[0].messaging[0].message ||
      r.body.entry[0].messaging[0].message.is_echo) return s.end();
    var txt = r.body.entry[0].messaging[0].message.text
    var user = r.body.entry[0].messaging[0].sender
    if(!users[user.id]) users[user.id] = user
    if(debug) console.log('<<<', JSON.stringify(r.body))
    bot.onmessagetext(user, txt, r.body)
    s.end()
  })
  
  var listener = app.listen(process.env.PORT, () => {
    console.log('Bot is listening on port ' + listener.address().port);
  })
  
  return bot
}
