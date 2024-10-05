
const mongoose = require('mongoose');

const controllerSchema = new mongoose.Schema({
    product_category: { type: String, required: true },
    product_id: { type: String, required: true },
    product_image: { type: String, required: true },
    product_name: { type: String, required: true },
    product_dis: { type: String, required: true },
    product_price: { type: String, required: true },
    orignal_price: { type: String, required: true }
  });
  
  const Controller = mongoose.model('Controller', controllerSchema);
  module.exports = Controller;
  