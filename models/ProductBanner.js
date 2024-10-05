const mongoose = require('mongoose');


const productBannerSchema = new mongoose.Schema({
    product_category: { type: String, required: true },
    product_banner: { type: String, required: true },
    product_title: { type: String, required: true },
    product_link: { type: String, required: true },
    banner_id: { type: String, required: true }
  });
  
  const ProductBanner = mongoose.model('ProductBanner', productBannerSchema);
  module.exports = ProductBanner;
  