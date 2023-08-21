const mongoose = require('mongoose')
const Schema = mongoose.Schema

const patientSchema = new Schema({
  chartNo: String,
  name: String,
  gender: String,
  age:Number,
  wardNumber: String,
  locationCategoryId: { // 加入關聯設定
    type: Schema.Types.ObjectId,
    ref: 'LocationCategory',
    index: true,
    required: true
  }
})
module.exports = mongoose.model('Patient', patientSchema)