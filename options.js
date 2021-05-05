module.exports = {
    gameOptions: {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{text: 'Попробуй 1', callback_data: '1'}, {text: 'Возможно 2', callback_data: '2'}, {text: 'Наверное 3', callback_data: '3'}],
                [{text: 'Возможно 4', callback_data: '4'}, {text: 'Попробуй 5', callback_data: '5'}, {text: 'Возможно 6', callback_data: '6'}],
                [{text: 'Наверное 7', callback_data: '7'}, {text: 'Возможно 8', callback_data: '8'}, {text: 'Попробуй 9', callback_data: '9'}],
                [{text: 'А может 0', callback_data: '0'}],
            ]
        })
    },
    againOptions: {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{text: 'Играть еще раз', callback_data: '/again'}],
            ]
        })
    }
}