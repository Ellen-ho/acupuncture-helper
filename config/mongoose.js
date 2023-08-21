// require('mongoose').set('debug', true) => 可以顯示詳細的訊息方便 debug
// const mongoose = require('mongoose')

// if (process.env.NODE_ENV !== 'production') {
//   require('dotenv').config()
// }

// const MONGODB_URI = process.env.MONGODB_URI
// mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })

// const db = mongoose.connection

// db.on('error', () => {
//   console.log('mongodb error!')
// })

// db.once('open', () => {
//   console.log('mongodb connected!')
// })

// module.exports = db

const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/accupuncture-helper', { useNewUrlParser: true, useUnifiedTopology: true,'useCreateIndex': true })
const db = mongoose.connection
db.on('error', () => {
  console.log('mongodb error!')
})
db.once('open', () => {
  console.log('mongodb connected!')
})
module.exports = db