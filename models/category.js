const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  }, 
  parentId: String,
  subCategory : {type: mongoose.Schema.Types.ObjectId,ref:'Category'}
});

const Category = mongoose.model("Category", CategorySchema);

module.exports = Category;