import { Dimensions } from 'react-native';

export const settings = "app_setting";
export const base_url = "https://bongomeals.com/";
export const api_url = "https://bongomeals.com/api/";
export const img_url = "http://bongomeals.com/uploads/";
export const app_name = "BongoMeals";

export const check_phone_number = "customer/check_phone"; 
export const faq = "customer/faq";
export const privacy = "customer/privacy_policy"; 
export const customer_register = "customer/register";
export const customer_login = "customer/login"; 
export const add_address = "customer/add_address";
export const customer_forget_password = "customer/forget_password"; 
export const customer_reset_password = "customer/reset_password";
export const customer_add_address = "customer/add_address";
export const customer_get_address = "customer/all_addresses";
export const customer_update_address = "customer/update_address"; 
export const customer_edit_address = "customer/edit_address";
export const customer_address_type = "get_address_type";
export const home_banners = "customer/get_banners";
export const home_categories = "customer/get_categories";
export const home_restaurant_list = "customer/restaurant_list";
export const customer_address_tag = "customer/get_address_type";
export const promo_code = "customer/get_promo";
export const customer_profile_update = "customer/profile_update"; 
export const restaurant_menu = "customer/get_restaurant_menu";
export const update_favourite_restaurant = "customer/update_favourite_restaurant";
export const get_orders = "customer/get_orders"; 
export const get_favourite_restaurant = "customer/get_favourite_restaurant"; 
export const check_promo_code = "customer/check_promo"; 
export const get_taxes = "customer/get_taxes"; 
export const get_last_active_address = "customer/get_last_active_address";
export const get_payment_type = "customer/get_payment_mode"; 
export const place_order = "customer/place_order"; 
export const get_profile = "customer/get_profile";
export const profile_update = "customer/profile_update";
export const get_profile_picture = "customer/profile_picture";
export const profile_picture_update = "customer/profile_picture_update"; 
export const ongoing_orders = "customer/get_ongoing_orders";
export const rating_upload = "customer/rating_upload";
export const order_detail = "customer/get_order_detail";
export const home_search = "customer/home_search";
export const search_menu = "customer/product_search";
export const cancel_order = "customer/cancel_order";
export const notification = "customer/notification"; 
export const restaurant_category_list = "customer/restaurant_list_by_category"; 
export const get_wallet_list = "customer/get_wallet";
export const add_wallet = "customer/add_wallet";

//Size
export const screenHeight = Math.round(Dimensions.get('window').height);
export const height_40 = Math.round(40 / 100 * screenHeight);
export const height_50 = Math.round(50 / 100 * screenHeight);
export const height_60 = Math.round(60 / 100 * screenHeight);
export const height_70 = Math.round(70 / 100 * screenHeight);
export const height_20 = Math.round(20 / 100 * screenHeight);
export const height_30 = Math.round(30 / 100 * screenHeight);
export const height_17 = Math.round(17 / 100 * screenHeight);

//Path

export const home_banner = require('.././assets/img/home_banner.jpeg');
export const veg = require('.././assets/img/veg.png');
export const non_veg = require('.././assets/img/non_veg.png');
export const email = require('.././assets/img/email.png');
export const profile_img = require('.././assets/img/profile.png');
export const logo_with_name = require('.././assets/img/logo_with_name.png');
export const wallet = require('.././assets/img/wallet.png');
export const wallet_money = require('.././assets/img/wallet_money.png');
export const biryani = require('.././assets/img/biryani.jpeg');
export const biryani_corner = require('.././assets/img/biryani_corner.jpeg');
export const biryani_image = require('.././assets/img/biryani_image.jpeg');
export const edit = require('.././assets/img/edit.png');
export const splash_image = require('.././assets/img/splash_image.png');
export const restaurant = require('.././assets/img/restaurant.jpg');
export const visa = require('.././assets/img/visa.png');
export const paypal = require('.././assets/img/paypal.png');
export const mastro = require('.././assets/img/mastro.png');
export const home_restaurant = require('.././assets/img/home_restaurant.jpg');
export const home_restaurant1 = require('.././assets/img/home_restaurant1.jpg');
export const location = require('.././assets/img/location.png');
export const time = require('.././assets/img/time.png');
export const bag = require('.././assets/img/bag.png');
export const offer = require('.././assets/img/offer.png');
export const star = require('.././assets/img/star.png');
export const discount = require('.././assets/img/discount.png');
export const man = require('.././assets/img/man.png');
export const profile = require('.././assets/img/profile.png');
export const delivery_man = require('.././assets/img/delivery_man.png');
export const cook = require('.././assets/img/cook.png');
export const phone = require('.././assets/img/phone.png');
export const address = require('.././assets/img/address.png');
export const customer_service = require('.././assets/img/customer_service.png');
export const chat = require('.././assets/img/chat.png');
export const cancel = require('.././assets/img/cancel.png');

//Lottie
export const empty_lottie = require('.././assets/json/empty.json');
export const notification_lottie = require('.././assets/json/notification.json');
export const address_lottie = require('.././assets/json/address.json');
export const success_lottie = require('.././assets/json/success.json');
export const closed_lottie = require('.././assets/json/closed.json');
export const slider_1 = require('.././assets/json/slider_1.json');
export const slider_2= require('.././assets/json/slider_2.json');
export const slider_3 = require('.././assets/json/slider_3.json');
export const location_lottie = require('.././assets/json/location_lottie.json');
export const delivery = require('.././assets/json/delivery.json');
export const empty_favorite_restaurant = require('.././assets/json/empty_favorite_restaurant.json'); 
export const empty_menu_lottie = require('.././assets/json/empty_menu.json'); 

//Font Family
export const light  = "Metropolis-Light";
export const regular  = "CheyenneSans-Regular";
export const bold  = "Metropolis-Bold";

//Map
export const GOOGLE_KEY = "AIzaSyCp77n_8Z2QDcWMebzUwHK_z3Q1ibZifkA";
export const LATITUDE_DELTA = 0.0150;
export const LONGITUDE_DELTA =0.0150;

//DropdownAlert
export const alert_close_timing = 2000;

//More Menu
export const menus = [
  {
    menu_name: 'Profile',
    icon: 'person',
    route:'Profile'
  },
  {
    menu_name: 'Manage Addresses',
    icon: 'pin',
    route:'AddressList'
  },
  {
    menu_name: 'Wallet',
    icon: 'wallet',
    route:'Wallet'
  },
  {
    menu_name: 'Faq',
    icon: 'help',
    route:'Faq'
  },
  {
    menu_name: 'Privacy Policy',
    icon: 'alert',
    route:'PrivacyPolicy'
  },
  {
    menu_name: 'Contact Us',
    icon: 'call',
    route:'ContactUs'
  },
  {
    menu_name: 'Logout',
    icon: 'log-out',
    route:'Logout'
  },
]

