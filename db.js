const {Sequelize} = require('sequelize');

module.exports = new Sequelize(
    'telega_bot',
    'root',
    'root',
    {
        host: '77.244.216.12',
        port: '6432',
        dialect: 'postgres'
    }
)