const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const recordSchema = new Schema({
  date: String,
  startAt: String,
  endAt: String,
  isCompleted: Boolean,
  headAmount: Number,
  neckAndShoulderAmount: Number,
  leftHandAmount: Number,
  rightHandAmount: Number,
  lowerBackAmount: Number,
  abdomenAmount: Number,
  buttocksAmount: Number,
  leftLegAmount: Number,
  rightLegAmount: Number,
  soleAmount: Number,
  totalAmount: Number,
  patientId: {
    type: Schema.Types.ObjectId,
    ref: "Patient",
    index: true,
    required: true,
  },
}, { timestamps: true });
module.exports = mongoose.model("Record", recordSchema);
