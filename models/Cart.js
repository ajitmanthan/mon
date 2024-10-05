const mongoose = require('mongoose');


const cartSchema = new mongoose.Schema({
    product_category: { type: String },
    product_quantity: { type: String },
    product_id: { type: String },
    cart_image: { type: String },
    cart_pname: { type: String },
    cart_pprice: { type: String },
    user_email: { type: String, required: true }
  });
  
  const Cart = mongoose.model('Cart', cartSchema);
  module.exports = Cart;
  