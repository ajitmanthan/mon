const express = require('express')
const router = express.Router()
const multer = require('multer');

const Banner = require('../models/banner');
const CarausalBanner = require('../models/carausalBanner');
const Cart = require('../models/cart');
const Category = require('../models/category');
const Controller = require('../models/controller');
const Headphone = require('../models/headphone');
const Keyboard = require('../models/keyboard');
const Laptop = require('../models/laptop');
const Mouse = require('../models/mouse');
const PC = require('../models/pc');
const ProductBanner = require('../models/productBanner');
const Signup = require('../models/signup');


const roleGateway = function (roles = []) {
    return function (req, res, next) {
        if (req.session.user && roles.includes(req.session.role)) {
            next(); 
        } else {
            res.redirect('/login'); 
        }
    };
};


const admingateway = function (req, res, next) {
    if (req.session.role === 'admin') {
        next();
    } else if (req.session.user) {
        res.status(403).send('Access denied'); 
    } else {
        res.redirect('/login');
    }
}

 router.get('/login', async (req, res) => {
     try {
         const name = await Signup.findOne({ user_email: req.session.user, user_role: req.session.role });
         const cou = await Cart.countDocuments({ user_email: req.session.user });
         res.render('admin/login', { name: name, cou: cou });
     } catch (err) {
         console.error(err);
         res.status(500).send('Internal Server Error');
     }
 });
 
 // Signup Route
 router.get('/signup', async (req, res) => {
     res.render('admin/signup');
 });
 
 // Profile Route
 router.get('/profile', roleGateway, async (req, res) => {
     try {
         const name = await Signup.findOne({ user_email: req.session.user, user_role: req.session.role });
         const pc = await Cart.find({ user_email: req.session.user });
         const cou = await Cart.countDocuments({ user_email: req.session.user });
 
         res.render('profile', {
             role: req.session,
             name: name,
             pc: pc.length ? pc : ' ',
             cou: cou ? cou : '0'
         });
     } catch (err) {
         console.error(err);
         res.status(500).send('Internal Server Error');
     }
 });
 
 // Home Route
 router.get('/', async (req, res) => {
     try {
         const banner = await Banner.find({});
         const category = await Category.find({}).sort({ product_category: -1 });
         const carausal = await CarausalBanner.find({ carausal_category: 'first_carausal' });
         const carausal2 = await CarausalBanner.find({ carausal_category: 'second_carausal' });
         const reslt5 = await Signup.distinct('user_profile', { user_email: req.session.user });
         const cou = await Cart.countDocuments({ user_email: req.session.user });
         
         res.render('index', {
             banner: banner,
             product: category,
             carausal: carausal,
             carausal2: carausal2,
             name: reslt5,
             cou: cou
         });
     } catch (err) {
         console.error(err);
         res.status(500).send('Internal Server Error');
     }
 });
 
 // Admin Route
 router.get('/admin', admingateway, async (req, res) => {
     if (req.session.user) {
         try {
             const user = await Signup.find({}).sort({ id: -1 });
             res.render('admin/dashboard', { user: user });
         } catch (err) {
             console.error(err);
             res.status(500).send('Internal Server Error');
         }
     } else {
         res.redirect('/login');
     }
 });
 
 // Dashboard Banner Route
 router.get('/dashboard_banner', admingateway, async (req, res) => {
     try {
         const banner = await Banner.find({});
         res.render('admin/banner', { banner: banner });
     } catch (err) {
         console.error(err);
         res.status(500).send('Internal Server Error');
     }
 });
 
 // Category Route
 router.get('/category', admingateway, async (req, res) => {
     try {
         const category = await Category.find({});
         res.render('admin/category', { category: category });
     } catch (err) {
         console.error(err);
         res.status(500).send('Internal Server Error');
     }
 });
 
 // Carausal Banner Route
 router.get('/carausal_banner', admingateway, async (req, res) => {
     try {
         const category = await Category.find({});
         const c_banner = await CarausalBanner.find({});
         res.render('admin/carausal_banner', { category, c_banner });
     } catch (err) {
         console.error(err);
         res.status(500).send('Internal Server Error');
     }
 });
 
 // Product Route
 router.get('/product', admingateway, async (req, res) => {
     try {
         const category = await Category.find({});
         
         const pc = await PC.find({});
         const mouse = await Mouse.find({});
         const laptop = await Laptop.find({});
         const keyboard = await Keyboard.find({});
         const headphone = await Headphone.find({});
         const controller = await Controller.find({});
 
         const pro = {
             controller,
             headphone,
             keyboard,
             laptop,
             mouse,
             pc
         };
 
         res.render('admin/product', { category, pro });
     } catch (err) {
         console.error(err);
         res.status(500).send('Internal Server Error');
     }
 });
 
 

// Product Banner Route
router.get('/product_banner', admingateway, async (req, res) => {
    try {
        const category = await Category.find({});
        const banner = await ProductBanner.find({});
        res.render('admin/product_banner', { category, banner });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

// User Route
router.get('/user', async (req, res) => {
    try {
        const users = await Signup.find({});
        res.render('admin/user', { user: users });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

// PC Page
router.get('/PC', async (req, res) => {
    try {
        const pc = await PC.find({});
        const banner = await ProductBanner.find({ product_category: 'PC' })
                            .select('product_banner product_title product_link');
        const name = await Signup.distinct('user_profile', { user_email: req.session.user });
        const cou = await Cart.countDocuments({ user_email: req.session.user });

        res.render('pc', { pc, banner, name, cou });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

// Controller Page
router.get('/controller', async (req, res) => {
    try {
        const controller = await Controller.find({});
        const banner = await ProductBanner.find({ product_category: 'controller' })
                            .select('product_banner product_title product_link');
        const name = await Signup.distinct('user_profile', { user_email: req.session.user });
        const cou = await Cart.countDocuments({ user_email: req.session.user });

        res.render('controller', { controller, banner, name, cou });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

// Laptop Page
router.get('/laptop', async (req, res) => {
    try {
        const laptop = await Laptop.find({});
        const banner = await ProductBanner.find({ product_category: 'laptop' })
                            .select('product_banner product_title product_link');
        const name = await Signup.distinct('user_profile', { user_email: req.session.user });
        const cou = await Cart.countDocuments({ user_email: req.session.user });

        res.render('laptop', { laptop, banner, name, cou });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/accessories', async (req, res) => {
    try {
        const keyboard = await Keyboard.find({});
        const mouse  = await Mouse.find({});
        const headphone = await Headphone.find({});
        const banners = await ProductBanner.find({ product_category: 'keyboard' })
                           .select('product_banner product_title product_link');
        const name = await Signup.distinct('user_profile', { user_email: req.session.user });
        const cou = await Cart.countDocuments({ user_email: req.session.user });

        res.render('accessories', { keyboard, mouse , headphone, banners, name, cou });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});


// Service Page
router.get('/service', async (req, res) => {
    try {
        const name = await Signup.distinct('user_profile', { user_email: req.session.user });
        const cou = await Cart.countDocuments({ user_email: req.session.user });

        res.render('service', { name, cou });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

// Community Page
router.get('/community', async (req, res) => {
    try {
        const banner = await Banner.find({ banner_dis: ' ' });
        const name = await Signup.distinct('user_profile', { user_email: req.session.user });
        const cou = await Cart.countDocuments({ user_email: req.session.user });

        res.render('community', { banner, name, cou });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

// Product Page with Dynamic Parameters
router.get('/product/:product_category/:product_id', async (req, res) => {
    const { product_id, product_category } = req.params;

    try {
        const productModel = require(`../models/${product_category.toLowerCase()}`);
        const product = await productModel.findOne({ product_id });
        const cartItem = await Cart.findOne({ product_id, user_email: req.session.user });
        const name = await Signup.distinct('user_profile', { user_email: req.session.user });
        const count = await Cart.countDocuments({ user_email: req.session.user });

        res.render('product_param', { product, results1: cartItem, name, cou: count });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/cart_page', async (req, res) => {
    if (req.session.user) {
        try {
            const products = await Cart.find({ user_email: req.session.user });
            const name = await Signup.distinct('user_profile', { user_email: req.session.user });
            const count = await Cart.countDocuments({ user_email: req.session.user });

            res.render('cart_page', { product: products, name: name, cou: count });
        } catch (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
        }
    } else {
        res.redirect('/login');
    }
});
 
router.get('/cartonpage', roleGateway, async (req, res) => {
    try {
        const products = await Cart.find({ user_email: req.session.user });

        if (products.length === 0) {
            res.send({ product: ' ', cou: 0 });
        } else {
            const count = await Cart.countDocuments({ user_email: req.session.user });
            res.send({ product: products, cou: count });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});


router.get("/logout", async (req, res) => {
    if (req.session) {
        req.session.destroy(function (err) {
            if (err) {
                return next(err);
            } else {
                res.json({ msg: "logout" });
            }
        });
    }
});






// Multer storage setup for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
       cb(null, './public/images/category/profile'); // Adjust destination as needed
    },
    filename: function (req, file, cb) {
       cb(null, Date.now() + "_" + file.originalname);
    }
 });
 const upload = multer({ storage: storage });
 
 // User login
 router.post('/login', async (req, res) => {
    const { user_email, user_pass } = req.body;
    try {
       const user = await db.collection('signup').findOne({ user_email, user_pass });
       if (user) {
          req.session.user = user.user_email;
          req.session.role = user.user_role;
          req.session.num = user.user_number;
          res.send({ user_role: user.user_role });
       } else {
          res.send({ user_role: 'login' });
       }
    } catch (err) {
       console.error(err);
       res.status(500).send('Internal Server Error');
    }
 });
 
 // User signup
 router.post('/new_signup', upload.single('user_profile'), async (req, res) => {
    let user_profile = req.file ? req.file.filename : 'default.jpg';
    const { user_email, user_pass, user_name, user_number, latitude, longitude } = req.body;
 
    const newUser = { user_profile, user_email, user_pass, user_name, user_number, latitude, longitude };
    try {
       await db.collection('signup').insertOne(newUser);
       res.send({ msg: 'ok' });
    } catch (err) {
       console.error(err);
       res.status(500).send('Internal Server Error');
    }
 });
 
 // Banner upload
 router.post('/dash_banner', upload.single('main_banner'), async (req, res) => {
    const { banner_id, banner_title, banner_dis, banner_link } = req.body;
    const main_banner = req.file.filename;
 
    const banner = { main_banner, banner_id, banner_title, banner_dis, banner_link };
    try {
       await db.collection('banner').insertOne(banner);
       res.send({ msg: 'ok' });
    } catch (err) {
       console.error(err);
       res.status(500).send('Internal Server Error');
    }
 });
 
 // Product insertion
 router.post('/pc', upload.fields([{ name: 'product_image' }]), async (req, res) => {
    const ppicFiles = req.files['product_image'];
    const product_image = ppicFiles ? ppicFiles.map(file => file.filename) : [];
 
    const { product_category, product_id, product_name, product_dis, product_price, orignal_price } = req.body;
    const product = { product_category, product_id, product_image: product_image.join(','), product_name, product_dis, product_price, orignal_price };
 
    try {
       await db.collection('pc').insertOne(product);
       res.redirect('/product');
    } catch (err) {
       console.error(err);
       res.status(500).send('Internal Server Error');
    }
 });



 const storageConfig = (folder) => multer.diskStorage({
    destination: function (req, file, cb) {
       cb(null, `./public/images/category/${folder}`);
    },
    filename: function (req, file, cb) {
       cb(null, Date.now() + "_" + file.originalname);
    }
 });
 
 // Upload configuration for different products
 const HEADPHONE_upload = multer({ storage: storageConfig('product') });
 const KEYBOARD_upload = multer({ storage: storageConfig('product') });
 const LAPTOP_upload = multer({ storage: storageConfig('product') });
 const MOUSE_upload = multer({ storage: storageConfig('product') });
 const CONTROLLER_upload = multer({ storage: storageConfig('product') });
 
 // Function to insert product into the respective MongoDB collection
 const insertProduct = async (collectionName, productData, res) => {
    const { product_category, product_id, product_image, product_name, product_dis, product_price, orignal_price } = productData;
 
    const product = {
       product_category,
       product_id,
       product_image,
       product_name,
       product_dis,
       product_price,
       orignal_price
    };
 
    try {
       await db.collection(collectionName).insertOne(product);
       res.redirect('/product');
    } catch (err) {
       console.error(err);
       res.status(500).send('Internal Server Error');
    }
 };
 
 // Headphone POST
 router.post('/headphone', HEADPHONE_upload.fields([{ name: 'product_image' }]), async (req, res) => {
    const ppicFiles = req.files['product_image'];
    const product_image = ppicFiles ? ppicFiles.map(file => file.filename).join(',') : '';
    await insertProduct('headphones', { ...req.body, product_image }, res);
 });
 
 // Keyboard POST
 router.post('/keyboard', KEYBOARD_upload.fields([{ name: 'product_image' }]), async (req, res) => {
    const ppicFiles = req.files['product_image'];
    const product_image = ppicFiles ? ppicFiles.map(file => file.filename).join(',') : '';
    await insertProduct('keyboards', { ...req.body, product_image }, res);
 });
 
 // Laptop POST
 router.post('/laptop', LAPTOP_upload.fields([{ name: 'product_image' }]), async (req, res) => {
    const ppicFiles = req.files['product_image'];
    const product_image = ppicFiles ? ppicFiles.map(file => file.filename).join(',') : '';
    await insertProduct('laptops', { ...req.body, product_image }, res);
 });
 
 // Mouse POST
 router.post('/mouse', MOUSE_upload.fields([{ name: 'product_image' }]), async (req, res) => {
    const ppicFiles = req.files['product_image'];
    const product_image = ppicFiles ? ppicFiles.map(file => file.filename).join(',') : '';
    await insertProduct('mice', { ...req.body, product_image }, res);
 });
 
 // Controller POST
 router.post('/controller', CONTROLLER_upload.fields([{ name: 'product_image' }]), async (req, res) => {
    const ppicFiles = req.files['product_image'];
    const product_image = ppicFiles ? ppicFiles.map(file => file.filename).join(',') : '';
    await insertProduct('controllers', { ...req.body, product_image }, res);
 });


 // Multer storage configuration for product banners
const storage_dash = multer.diskStorage({
    destination: function (req, file, cb) {
       cb(null, './public/images/category/productbanner');
    },
    filename: function (req, file, cb) {
       cb(null, Date.now() + "_" + file.originalname);
    }
 });
 
 const bnnr_upload = multer({ storage: storage_dash });
 
 // Product Banner POST route
 router.post('/product_bann', bnnr_upload.single('product_banner'), async (req, res) => {
    const { product_title, product_category, product_link, banner_id } = req.body;
    const product_banner = req.file.filename; // Filename of the uploaded banner image
 
    // Create a product banner object to insert into MongoDB
    const productBanner = {
       product_banner,
       product_title,
       product_category,
       product_link,
       banner_id,
    };
 
    try {
       // Insert the product banner into the 'product_banners' collection
       await db.collection('product_banners').insertOne(productBanner);
       res.send({ msg: 'ok' }); // Send success response
    } catch (err) {
       console.error(err);
       res.status(500).send('Internal Server Error'); // Handle errors
    }
 });

 const storage_dashd = multer.diskStorage({
    destination: function (req, file, cb) {
       cb(null, './public/images/category/cart');
    },
    filename: function (req, file, cb) {
       cb(null, Date.now() + "_" + file.originalname);
    }
 });
 const cart_upload = multer({ storage: storage_dashd });
 
 // Add item to cart
 router.post('/cart', cart_upload.single('cart_img'), async (req, res) => {
    if (req.session.user) {
       const { product_category, product_quantity, cart_pname, cart_pprice } = req.body;
       const user = req.session.user;
       const cart_img = req.file.filename; // Get the uploaded cart image filename
 
       try {
          // Check if the product already exists in the user's cart
          const existingProduct = await db.collection('cart').findOne({ product_id: req.body.product_id, user_email: user });
 
          if (existingProduct) {
             // Update the quantity if the product already exists
             await db.collection('cart').updateOne(
                { product_id: req.body.product_id, user_email: user },
                { $set: { product_quantity: product_quantity } }
             );
             res.send({ msg: 'Product quantity updated' });
          } else {
             // Insert new product into the cart
             const newProduct = {
                product_category,
                product_quantity,
                product_id: req.body.product_id,
                cart_image: cart_img,
                cart_pname,
                cart_pprice,
                user_email: user,
             };
             await db.collection('cart').insertOne(newProduct);
             res.send({ msg: 'Product added to cart' });
          }
       } catch (err) {
          console.error(err);
          res.status(500).send('Internal Server Error');
       }
    } else {
       res.send({ msg: 'User not logged in' });
    }
 });

 // Change product quantity in cart
router.post('/quantity_change', async (req, res) => {
    if (req.session.user) {
       const { product_quantity, product_id } = req.body;
 
       try {
          const updatedProduct = await db.collection('cart').updateOne(
             { user_email: req.session.user, product_id: product_id },
             { $set: { product_quantity: product_quantity } }
          );
 
          if (updatedProduct.modifiedCount > 0) {
             res.send({ msg: 'Product quantity updated successfully' });
          } else {
             res.send({ msg: 'No product found to update' });
          }
       } catch (err) {
          console.error(err);
          res.status(500).send('Internal Server Error');
       }
    } else {
       res.redirect('/login');
    }
 });
 
 // Edit product details
 router.post('/edit_product', async (req, res) => {
    const { product_id, product_category } = req.body;
    try {
       const product = await db.collection(product_category).findOne({ product_id: product_id });
 
       if (product) {
          res.send({ product: product });
       } else {
          res.send({ msg: 'Product not found' });
       }
    } catch (err) {
       console.error(err);
       res.status(500).send('Internal Server Error');
    }
 });

 const storage22 = multer.diskStorage({
    destination: function (req, file, cb) {
       cb(null, 'public/images/category/product');
    },
    filename: function (req, file, cb) {
       cb(null, Date.now() + "_" + file.originalname);
    }
 });
 
 const product_upload2 = multer({ storage: storage22 });
 
 // Update product details
 router.post('/pc_update', product_upload2.fields([{ name: 'product_image' }]), async (req, res) => {
    const ppicFiles = req.files['product_image'];
    const product_image = ppicFiles ? ppicFiles.map(file => file.filename).join(',') : undefined;
 
    const { product_category, product_id, product_name, product_dis, product_price, orignal_price } = req.body;
 
    try {
       const updateData = {
          ...(product_image && { product_image: product_image }),
          product_name,
          product_dis,
          product_price,
          orignal_price
       };
 
       const result = await db.collection(product_category).updateOne(
          { product_id: product_id },
          { $set: updateData }
       );
 
       if (result.modifiedCount > 0) {
          res.redirect('/product');
       } else {
          res.status(404).send('Product not found');
       }
    } catch (err) {
       console.error(err);
       res.status(500).send('Internal Server Error');
    }
 });
 
 // Delete a product
 router.post('/delete_pro', async (req, res) => {
    const { product_id, product_category } = req.body;
 
    try {
       const result = await db.collection(product_category).deleteOne({ product_id: product_id });
 
       if (result.deletedCount > 0) {
          res.send({ product: 'deleted' });
       } else {
          res.status(404).send('Product not found');
       }
    } catch (err) {
       console.error(err);
       res.status(500).send('Internal Server Error');
    }
 });
 
 // Show product details
 router.post('/show_product', async (req, res) => {
    const { product_id, product_category } = req.body;
 
    try {
       const product = await db.collection(product_category).findOne({ product_id: product_id });
 
       if (product) {
          res.json({ product });
       } else {
          res.status(404).send('Product not found');
       }
    } catch (err) {
       console.error(err);
       res.status(500).send('Internal Server Error');
    }
 });
 
 // Edit banner details
 router.post('/banner_edit', async (req, res) => {
    const { product_id } = req.body;
 
    try {
       const banner = await db.collection('banner').findOne({ banner_id: product_id });
 
       if (banner) {
          res.json({ banner });
       } else {
          res.status(404).send('Banner not found');
       }
    } catch (err) {
       console.error(err);
       res.status(500).send('Internal Server Error');
    }
 });

 const storage33 = multer.diskStorage({
    destination: function (req, file, cb) {
       cb(null, 'public/images/category/banner');
    },
    filename: function (req, file, cb) {
       cb(null, Date.now() + "_" + file.originalname);
    }
 });
 
 const bnr_uploadb = multer({ storage: storage33 });
 
 // Update banner details
 router.post('/banner_update', bnr_uploadb.single('main_banner'), async (req, res) => {
    const main_banner = req.file.filename;
    const { banner_id, banner_title, banner_dis, banner_link } = req.body;
 
    try {
       const updateData = {
          main_banner,
          banner_title,
          banner_dis,
          banner_link
       };
 
       const result = await db.collection('banner').updateOne(
          { banner_id: banner_id },
          { $set: updateData }
       );
 
       if (result.modifiedCount > 0) {
          res.json({ msg: 'ok' });
       } else {
          res.status(404).send('Banner not found or no changes made');
       }
    } catch (err) {
       console.error(err);
       res.status(500).send('Internal Server Error');
    }
 });
 
 // Delete banner
 router.post('/delete_banner', async (req, res) => {
    const { banner_id } = req.body;
 
    try {
       const result = await db.collection('banner').deleteOne({ banner_id: banner_id });
 
       if (result.deletedCount > 0) {
          res.send({ msg: 'ok' });
       } else {
          res.status(404).send('Banner not found');
       }
    } catch (err) {
       console.error(err);
       res.status(500).send('Internal Server Error');
    }
 });

 // Edit banner details
router.post('/edit_banner', async (req, res) => {
    const { product_id } = req.body;
 
    try {
       const results = await db.collection('product_banner').findOne({ banner_id: product_id });
 
       if (results) {
          res.send({ product: results });
       } else {
          res.status(404).send('Banner not found');
       }
    } catch (err) {
       console.error(err);
       res.status(500).send('Internal Server Error');
    }
 });
 
 // Storage configuration for banner images
 const storage_a = multer.diskStorage({
    destination: function (req, file, cb) {
       cb(null, 'public/images/category/productbanner');
    },
    filename: function (req, file, cb) {
       cb(null, Date.now() + "_" + file.originalname);
    }
 });
 const bnnr_a = multer({ storage: storage_a });
 
 // Update banner details
 router.post('/update_bnnn', bnnr_a.single('product_banner'), async (req, res) => {
    const product_banner = req.file.filename;
    const { product_title, product_category, product_link, banner_id } = req.body;
 
    try {
       const result = await db.collection('product_banner').updateOne(
          { banner_id: banner_id },
          { $set: { product_banner, product_title, product_category, product_link } }
       );
 
       if (result.modifiedCount > 0) {
          res.send({ msg: 'ok' });
       } else {
          res.status(404).send('Banner not found or no changes made');
       }
    } catch (err) {
       console.error(err);
       res.status(500).send('Internal Server Error');
    }
 });
 
 // Delete a product banner
 router.post('/delete_pbanner', async (req, res) => {
    const { banner_id } = req.body;
 
    try {
       const result = await db.collection('product_banner').deleteOne({ banner_id: banner_id });
 
       if (result.deletedCount > 0) {
          res.send({ msg: 'ok' });
       } else {
          res.status(404).send('Banner not found');
       }
    } catch (err) {
       console.error(err);
       res.status(500).send('Internal Server Error');
    }
 });
 
 // Edit carousel details
 router.post('/edit_carausal', async (req, res) => {
    const { carausal_id } = req.body;
 
    try {
       const results = await db.collection('carausal_banner').findOne({ carausal_id: carausal_id });
 
       if (results) {
          res.send({ product: results });
       } else {
          res.status(404).send('Carousel not found');
       }
    } catch (err) {
       console.error(err);
       res.status(500).send('Internal Server Error');
    }
 });
 
 // Storage configuration for carousel images
 const storagf = multer.diskStorage({
    destination: function (req, file, cb) {
       cb(null, 'public/images/category/carousel');
    },
    filename: function (req, file, cb) {
       cb(null, Date.now() + "_" + file.originalname);
    }
 });
 const dash_b = multer({ storage: storagf });
 
 // Update carousel details
 router.post('/update_brrrrrr', dash_b.single('carausal_image'), async (req, res) => {
    const carausal_image = req.file.filename;
    const { carausal_title, carausal_category, carausal_dis, carausal_link, carausal_id } = req.body;
 
    try {
       const result = await db.collection('carausal_banner').updateOne(
          { carausal_id: carausal_id },
          { $set: { carausal_image, carausal_title, carausal_category, carausal_dis, carausal_link } }
       );
 
       if (result.modifiedCount > 0) {
          res.send({ msg: 'ok' });
       } else {
          res.status(404).send('Carousel not found or no changes made');
       }
    } catch (err) {
       console.error(err);
       res.status(500).send('Internal Server Error');
    }
 });
 
 // Delete a carousel
 router.post('/delete_carausal', async (req, res) => {
    const { carausal_id } = req.body;
 
    try {
       const result = await db.collection('carausal_banner').deleteOne({ carausal_id: carausal_id });
 
       if (result.deletedCount > 0) {
          res.send({ msg: 'ok' });
       } else {
          res.status(404).send('Carousel not found');
       }
    } catch (err) {
       console.error(err);
       res.status(500).send('Internal Server Error');
    }
 });
 
 // Delete an item from the cart
 router.post('/delete_cart', async (req, res) => {
    if (req.session.user) {
       const { product_id } = req.body;
 
       try {
          const result = await db.collection('cart').deleteOne({
             product_id: product_id,
             user_email: req.session.user
          });
 
          if (result.deletedCount > 0) {
             res.send({ msg: 'ok' });
          } else {
             res.status(404).send('Product not found in cart');
          }
       } catch (err) {
          console.error(err);
          res.status(500).send('Internal Server Error');
       }
    } else {
       res.redirect('/login');
    }
 });
 




module.exports=router