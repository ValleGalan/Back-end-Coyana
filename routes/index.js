const express = require('express')
const multiparty = require("connect-multiparty"); //imagenes

const router = express.Router()

const userSignUpController = require("../controller/user/userSignUp")
const userSignInController = require('../controller/user/userSignIn')
const userDetailsController = require('../controller/user/userDetails')
const authToken = require('../middleware/authToken')
const userLogout = require('../controller/user/userLogout')
const allUsers = require('../controller/user/allUsers')
const updateUser = require('../controller/user/updateUser')
const UploadProductController = require('../controller/product/uploadProduct')
const getProductController = require('../controller/product/getProduct')
const updateProductController = require('../controller/product/updateProduct')
const getCategoryProduct = require('../controller/product/getCategoryProductOne')
const getCategoryWiseProduct = require('../controller/product/getCategoryWiseProduct')
const getProductDetails = require('../controller/product/getProductDetails')
const addToCartController = require('../controller/user/addToCartController')
const countAddToCartProduct = require('../controller/user/countAddToCartProduct')
const addToCartViewProduct  = require('../controller/user/addToCartViewProduct')
const updateAddToCartProduct = require('../controller/user/updateAddToCartProduct')
const deleteAddToCartProduct = require('../controller/user/deleteAddToCartProduct')
const searchProduct = require('../controller/product/searchProduct')
const filterProductController = require('../controller/product/filterProduct')

const paymentController = require('../controller/order/paymentController')
const webhooks = require('../controller/order/webhook')
const orderController = require('../controller/order/order.controller')
const allOrderController = require('../controller/order/allOrder.controller')

const subscribeNewsletter = require('../controller/user/subscribeNewsletter');
const deleteProductController = require('../controller/product/deleteProductController');

const contactController = require('../controller/product/contacto');


const { createPaymentIntent,createCheckoutSession} = require('../controller/user/paymentController');




router.post("/signup",userSignUpController)
router.post("/signin",userSignInController)
router.get("/user-details",authToken,userDetailsController)
router.get("/userLogout",userLogout)

//admin panel 
router.get("/all-user",authToken,allUsers)
router.post("/update-user",authToken,updateUser)

//product
router.post("/upload-product",authToken,UploadProductController)
router.get("/get-product",getProductController)
router.post("/update-product",authToken,updateProductController)
router.get("/get-categoryProduct",getCategoryProduct)
router.post("/category-product",getCategoryWiseProduct)
router.post("/product-details",getProductDetails)
router.get("/search",searchProduct)
router.post("/filter-product",filterProductController)

//user Añadir al carrito
router.post("/addtocart",authToken,addToCartController)
router.get("/countAddToCartProduct",authToken,countAddToCartProduct)
router.get("/view-card-product",authToken,addToCartViewProduct)
router.post("/update-cart-product",authToken,updateAddToCartProduct)
router.post("/delete-cart-product",authToken,deleteAddToCartProduct)


// Ruta de suscripción al boletín
router.post("/subscribe", subscribeNewsletter.subscribe);
router.delete("/delete/:_id", authToken,deleteProductController);
// Ruta para Payment Intent
router.post('/create-payment-intent', createPaymentIntent);

// Ruta para Checkout Session
router.post('/create-checkout-session', createCheckoutSession);

// Ruta para enviar el formulario de contacto
router.post('/contacto',  contactController.contactForm);

 
//enpoint de blog de Fundación Puna
const PostController = require("../controller/blog/post");
const NewsletterController = require("../controller/blog/newsletter");
const AuthController = require("../controller/blog/auth");
const UserController = require("../controller/blog/user");

const md_auth = require("../middleware/authenticated");
const md_upload = multiparty({ uploadDir: "../uploads/blog" });

//post del blog
router.post("/post", [md_auth.asureAuth, md_upload], PostController.createPost);
router.get("/post", PostController.getPosts);
router.patch(
  "/post/:id",
  [md_auth.asureAuth, md_upload],
  PostController.updatePost
);
router.delete("/post/:id", [md_auth.asureAuth], PostController.deletePost);
router.get("/post/:path", PostController.getPost);

//newsletter
router.post("/newsletter", NewsletterController.suscribeEmail);
router.get("/newsletter", [md_auth.asureAuth], NewsletterController.getEmails);
router.delete(
  "/newsletter/:id",
  [md_auth.asureAuth],
  NewsletterController.deleteEmail
);

//auth
router.post("/auth/register", AuthController.register);
router.post("/auth/login", AuthController.login);
router.post("/auth/refresh_access_token", AuthController.refreshAccessToken);

//user
router.get("/user/me", [md_auth.asureAuth], UserController.getMe);
router.get("/users", [md_auth.asureAuth], UserController.getUsers);
router.post("/user", [md_auth.asureAuth, md_upload], UserController.createUser);
router.patch(
  "/user/:id",
  [md_auth.asureAuth, md_upload],
  UserController.updateUser
);
router.delete("/user/:id", [md_auth.asureAuth], UserController.deleteUser);
//
//payment and order
router.post('/checkout',authToken,paymentController);
router.post('/webhook',webhooks) // /api/webhook
router.get("/order-list",authToken,orderController)
router.get("/all-order",authToken,allOrderController)


module.exports = router