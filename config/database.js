const Sequelize = require('sequelize')
const sequelize = new Sequelize('questions_and_answers', 'root', '1234', {
  host: 'localhost',
  dialect: 'mysql'
})

module.exports = sequelize
