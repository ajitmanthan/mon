const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
  main_banner: { type: String, required: true },
  banner_title: { type: String, required: true },
  banner_dis: { type: String, required: true },
  banner_link: { type: String, required: true },
  banner_id: { type: String, required: true }
});

const Banner = mongoose.model('Banner', bannerSchema);
module.exports = Banner;
