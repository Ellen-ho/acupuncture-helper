const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const locationCategorySchema = new Schema({
  locationCategory: String,
  locationCategoryName: String,
});
module.exports = mongoose.model("LocationCategory", locationCategorySchema);
