const TelegramApi = require('node-telegram-bot-api')
const token='6047983273:AAGyu-cVumeRG9SGNdbprA32KWCnjIXtMcU'

const bot = new TelegramApi(token,{polling:true})


const usersid=[]
const usersname=[]
const remind=[]

const vs = false;


var times_btn = {
    reply_markup: JSON.stringify({
      inline_keyboard: [
        [{ text: '9:00', callback_data: '9:00' }],
        [{ text: '11:00', callback_data: '11:00' }],
        [{ text: '13:00', callback_data: '13:00' }],
        [{ text: '15:00', callback_data: '15:00' }],
        [{ text: '17:00', callback_data: '17:00' }],
        [{ text: '19:00', callback_data: '19:00' }],
        [{ text: '20:10', callback_data: '20:10' }],
        [{ text: '21:00', callback_data: '21:00' }],
        [{ text: '23:00', callback_data: '23:00' }],
        [{ text: '01:00', callback_data: '01:00' }],
      ]
    })
  };

bot.setMyCommands([
    {command:'/start', description: 'Начальное приветствие'},
    {command:'/time', description: 'Время'},
    {command:'/remind', description: 'Посмотреть свои напоминания'},
    {command:'/delete', description: 'Удалить напоминание'}
    
])

bot.on('message',async msg =>{
    const text = msg.text;
    const chatId= msg.chat.id

    if(text === '/start')
    {
        if(newUser(msg))
        {
            await bot.sendMessage(chatId,"Добро пожаловать в бот для напоминаний! Producted by Котик")
            await bot.sendSticker(chatId,"https://chpic.su/_data/stickers/k/klepashiz/klepashiz_001.webp")
            await bot.sendMessage(chatId,"Чтобы поставить напоминание введи команду /напомни 'Текст напоминания' в 'Время' ")
            console.log(usersid);
            console.log(usersname);
        }
    }
    if(text === '/напомни')
    {
        await bot.sendMessage(chatId,"биба чироибяк ")
    }
    if(text === '/time')
    {
         t = new Date().getHours()+4;
          if(t==25) {t='21'}
          if(t==26) {t='22'}
          if(t==27) {t='23'}
          if(t==28) {t='00'}
        const tt= new Date().getMinutes();
        const ttt= t + ":" + tt;
        bot.sendMessage(chatId,"Текущее время: " + ttt)
    }
    if(text === '/remind')
    {
        view_remind(msg);
    }
    if(text === '/delete')
    {
        await bot.sendMessage(chatId,"Чтобы удалить запись напишите /удалить + !часть текста из напоминанис!")
    }
    if(text === 'f')
    {
        sendRequest('GET','https://api.rasp.yandex.net/v3.0/nearest_stations/?apikey=2f0fcb47-8b00-4934-923d-9e62b7d7d72e&lat=53.203203&lng=50.145954&distance=50&station_types=bus_stop&transport_types=bus').then(data=>console.log(data)).catch(err=>console.log(err));
        await bot.sendMessage(chatId,"Чтобы удалить запись напишите /удалить + !часть текста из напоминанис!")
    }
  
      
})

function sendRequest(method,url,body=null){
    return fetch(url).then(response =>{return response.json()})
}
bot.onText(/напомни (.+) в (.+)/, function (msg, match) {
   
	userId = msg.from.id;
    userName=msg.from.first_name;
    text_for_remind = match[1]; // cуть
    time = match[2];
    addRemind();


});

bot.onText(/напомнив (.+)/, function (msg, match) {

    userId = msg.from.id;
    userName=msg.from.first_name;
    text_for_remind = match[1]; // cуть
    bot.sendMessage(userId," Выберите время чтобы поставить напоминание! ", times_btn) // клавиатура выбора времени
});

bot.on('callback_query',function(temp){
    time = temp.data;  // время
    const mes_id = temp.message.message_id;
    
    //считали время, теперь удаляем клавиатуру
    bot.deleteMessage(userId,mes_id);
    addRemind();
});

bot.onText(/удалить (.+)/, function (msg, match) {

    userId = msg.from.id;
    userName=msg.from.first_name;
    text_for_delete = match[1]; // cуть

    for (i=0;i<remind.length;i++)
    {
        const m = JSON.parse(remind[i]);
        if(m.user_id==userId && m.text_time.includes(text_for_delete))
        {
            remind.splice(i,1);
            bot.sendMessage(userId,"Вы успешно удалили напоминание: \n" + m.text_time + " в " + m.time);
        }
    }
});
    
function addRemind(){
        NodeGoogleSheets('google_file.json', '1tTCCA10QbHJAN9e4kCQiUbzwK_zmHyVhNPJRQv4Eiwc', {append: 'list1',change:[[userId,text_for_remind,time,userName]]}, (data) => {
        })
        bot.sendMessage(userId,"Вы успешно поставили напоминание: " + text_for_remind +" в " + time);
        console.log(remind);
}

function view_remind(msg){
    const id = msg.from.id;

    for(i in remind)
    {
        i = JSON.parse(remind[i]);
        if(i.user_id==id)
        {
            bot.sendMessage(id, i.text_time + " в " + i.time);
        }
    }
}

const newUser = (msg) =>{
    const id= msg.from.id;
    const name = msg.from.first_name

    if(usersid.includes(id))
    {
        bot.sendMessage(id,"Вы уже есть в списке пользователей!")
        return false;
    }
    else{
        usersid.push(id);
        usersname.push(name);
        return true;
    }
}


// Проверяет каждую минуту
setInterval(function(){
    // Проверяем текущее время
     a = new Date().getHours()+4;
          if(a==25) {a='21'}
          if(a==26) {a='22'}
          if(a==27) {a='23'}
          if(a==28) {a='00'}
     b = new Date().getMinutes();
    
    if(b>=0 && b<10)
    {
      b='0'+b;
    }
    curDate = a + ':' + b;
    console.log("cur " + curDate)
   
    var curID=[];

    // Получим список всех времен пользователей
    NodeGoogleSheets('google_file.json', '1tTCCA10QbHJAN9e4kCQiUbzwK_zmHyVhNPJRQv4Eiwc', {values: 'list1!C:C'}, (data) => {    
    curID = data.data.values;
    count = data.data.values.length;

    
      
    for (i=0;i<count;i++)
    {
      if(curDate == curID[i])
      {
        i++;
        temp_text= null;
        var temp_id = null;
        // NodeGoogleSheets('google_file.json', '1tTCCA10QbHJAN9e4kCQiUbzwK_zmHyVhNPJRQv4Eiwc', {values: 'list1!B'+ i}, (data) => {
        //   temp_text=data.data.values[0][0];
        //   console.log(temp_text);
        // });
        // NodeGoogleSheets('google_file.json', '1tTCCA10QbHJAN9e4kCQiUbzwK_zmHyVhNPJRQv4Eiwc', {values: 'list1!A'+ i}, (data) => {
        //   temp_id=data.data.values[0][0];
        //   bot.sendMessage(temp_id, 'Напоминаю, что вы должны: '+ temp_text + ' сейчас.');       
        // });


        NodeGoogleSheets('google_file.json', '1tTCCA10QbHJAN9e4kCQiUbzwK_zmHyVhNPJRQv4Eiwc', {values: 'list1!'+ i+':'+i}, (data) => {
          bot.sendMessage(data.data.values[0][0], 'Напоминаю, что вы должны: '+ data.data.values[0][1]);       
        });
        i--;
      }
    }
    }); 

}, 60000);
//было 60000

///////////////////////////////////////////////////////

const { google } = require("googleapis");
//
function NodeGoogleSheets(file, sheetId, keyMass, fun) {
  const auth = new google.auth.GoogleAuth({
    keyFile: file,
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });
  //
  (async () => {
    const client = await auth.getClient();
    //
    const googleSheets = google.sheets({ version: "v4", auth: client });
    //
    const spreadsheetId = sheetId;
    //
    const metaData = await googleSheets.spreadsheets.get({
      auth,
      spreadsheetId,
    });
    //
    const data = {
      auth,
      spreadsheetId,
      valueInputOption: "USER_ENTERED",
      resource: {
        values: keyMass.change,
      },
    }
    //
    if(keyMass.append) {
      data['range'] = keyMass.append;
      //
      const append = await googleSheets.spreadsheets.values.append(data);
      //
      fun(append);
    } else if(keyMass.values) {
      data['range'] = keyMass.values;
      //
      delete data.valueInputOption; delete data.resource;
      //
      const values = await googleSheets.spreadsheets.values.get(data);
      //
      fun(values); 
    } else if(keyMass.update) {
      data['range'] = keyMass.update;
      //
      const update = await googleSheets.spreadsheets.values.update(data);
      //
      fun(update);
    }
  })();
}
//
// NodeGoogleSheets('google_file.json', '1tTCCA10QbHJAN9e4kCQiUbzwK_zmHyVhNPJRQv4Eiwc', {values: 'list1'}, (data) => {
//   //console.log(data.data.values);
//     const t = data.data.values;
//     console.log(data.data.values.length); // кол-во строк
    
// })
// NodeGoogleSheets('google_file.json', '1tTCCA10QbHJAN9e4kCQiUbzwK_zmHyVhNPJRQv4Eiwc', {append: 'list1',change:[['5','test','20:00']]}, (data) => {
// })




// setInterval(function(){
//     const curDate = new Date().getHours() + ':' + new Date().getMinutes();
//     console.log("cur " + curDate)
    
//         console.log("!");
//         bot.sendMessage(390526845, 'Вы выиграли IPHONE 14 PRO, чтобы забрать получить выигрыш скиньте 100 рублей');
//     }, 200);