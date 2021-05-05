const TelegramApi = require('node-telegram-bot-api')
const {gameOptions, againOptions} = require('./options')
const sequelize = require('./db')
const UserModel = require('./models')
const token = '1646292131:AAH4BstsXGEA1vnV7vlUJicJB5iVzryZduY'

const bot = new TelegramApi(token, {polling: true})

const chats = {}

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, 'Сейчас я загадаю цифру от 0 до 9, а ты должен ее угадать!');
    const randomNumber = Math.floor(Math.random() * 10);
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Отгадывай', gameOptions);
}

const start = async () => {

    try {
        await sequelize.authenticate()
        await sequelize.sync()
    } catch (e) {
        console.log('Подключение к бд сломалось', e)
    }

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

        try {
            if (text === '/start') {
                await UserModel.create({chatId})
                await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/27a/34a/27a34ad9-bc5d-3245-9b30-7337ba6b25dc/1.webp')
                return bot.sendMessage(chatId, 'Добро пожаловать в телеграм бот от Dax')
            }
            if (text === '/info') {
                const user = await UserModel.findOne({chatId})
                return bot.sendMessage(chatId, 'Тебя зовут ' + msg.from.first_name + ' ' + msg.from.last_name + ', в игре у тебя правильных ответов ' + user.right + ', неправильных ' + user.wrong);
            }
            if (text === '/game') {
                return startGame(chatId);
            }
            return bot.sendMessage(chatId, 'Я тебя не понимаю, попробуй еще раз!');
        } catch (e) {
            return bot.sendMessage(chatId, 'Произошла какая то ошибочка!');
        }
    })

    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;

        try {
            if (data === '/again') {
                return startGame(chatId);
            }
            const user = await UserModel.findOne({chatId});
            if (data == chats[chatId]) {
                user.right += 1;
                await bot.sendMessage(chatId, 'Поздравляю! Ты отгадал цифру ' + chats[chatId], againOptions);
            } else {
                user.wrong += 1;
                await bot.sendMessage(chatId, 'К сожалению ты не угадал, бот загадал цифру ' + chats[chatId], againOptions);
            }
            await user.save();
        } catch (e) {
            return bot.sendMessage(chatId, 'Произошла какая то ошибочка!');
        }
        //bot.sendMessage(chatId, 'Ты выбрал цифру ' + data);
        //console.log(msg)
    })
}

start()