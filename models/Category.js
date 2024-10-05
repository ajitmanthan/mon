
const mongoose = require('mongoose');


const categorySchema = new mongoose.Schema({
    product_category: { type: String, required: true },
    product_image: { type: String, required: true },
    product_name: { type: String, required: true },
    sub_product_image: { type: String, required: true }
  });
  
  const Category = mongoose.model('Category', categorySchema);
  module.exports = Category;
  