const TelegramApi = require('node-telegram-bot-api')
const {gameOptions, againOptions} = require('./options')

const token = '1646292131:AAH4BstsXGEA1vnV7vlUJicJB5iVzryZduY'

const bot = new TelegramApi(token, {polling: true})

const chats = {}

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, 'Сейчас я загадаю цифру от 0 до 9, а ты должен ее угадать!');
    const randomNumber = Math.floor(Math.random() * 10);
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Отгадывай', gameOptions);
}

const start = () => {
    bot.setMyCommands([
        {command: '/start', description: 'Начальное приветствие'},
        {command: '/info', description: 'Получить информацию о пользователе'},
        {command: '/game', description: 'Игра: отгадай цифру'},
    ])
    
    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;
        
        //const text2 = 'Ты написал мне ' + text;
        //bot.sendMessage(chatId, text2)
        //console.log(msg)
    
        if (text === '/start') {
            await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/27a/34a/27a34ad9-bc5d-3245-9b30-7337ba6b25dc/1.webp')
            return bot.sendMessage(chatId, 'Добро пожаловать в телеграм бот от Dax')
        }
        if (text === '/info') {
            return bot.sendMessage(chatId, 'Тебя зовут ' + msg.from.first_name + ' ' + msg.from.last_name)
        }
        if (text === '/game') {
            return startGame(chatId);
        }
        return bot.sendMessage(chatId, 'Я тебя не понимаю, попробуй еще раз!');

    })

    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if (data === '/again') {
            return startGame(chatId);
        }
        if (data == chats[chatId]) {
            return bot.sendMessage(chatId, 'Поздравляю! Ты отгадал цифру ' + chats[chatId], againOptions);
        } else {
            return bot.sendMessage(chatId, 'К сожалению ты не угадал, бот загадал цифру ' + chats[chatId], againOptions);
        }
        //bot.sendMessage(chatId, 'Ты выбрал цифру ' + data);
        //console.log(msg)
    })
}

start()