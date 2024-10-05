const mongoose = require('mongoose');
const carausalBannerSchema = new mongoose.Schema({
    carausal_image: { type: String, required: true },
    carausal_title: { type: String, required: true },
    carausal_category: { type: String, required: true },
    carausal_dis: { type: String, required: true },
    carausal_link: { type: String, required: true },
    carausal_id: { type: String, required: true }
  });
  
  const CarausalBanner = mongoose.model('CarausalBanner', carausalBannerSchema);
  module.exports = CarausalBanner;
  