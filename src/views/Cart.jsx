import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, SafeAreaView, ScrollView, TouchableOpacity, Image, TextInput, StatusBar } from 'react-native';
import Icon, { Icons } from '../components/Icons';
import * as colors from '../assets/css/Colors';
import { regular, bold, location, bag, offer, get_payment_type, api_url, img_url, place_order, GOOGLE_KEY } from '../config/Constants';
import { useNavigation, useRoute } from '@react-navigation/native';
import { connect } from 'react-redux';
import { updatePromo, updateTotal, addToCart, updateSubtotal, updateTax, updateDiscount, calculateTotal, updatePaymentMode, reset } from '../actions/OrderActions';
import axios from 'axios';
import { Loader } from '../components/Loader';
import UIStepper from 'react-native-ui-stepper';
import RBSheet from "react-native-raw-bottom-sheet";
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import DateTimePicker from '@react-native-community/datetimepicker';
import Moment from 'moment';
import RazorpayCheckout from 'react-native-razorpay';

const Cart = (props) => {

  const navigation = useNavigation();
  const route = useRoute();
  const [payment_list, setPaymentList] = useState([]);
  const [loading, setLoading] = useState(false);
  const rbsheet_ref = useRef(null);
  const [special_instruction, setSpecialInstruction] = useState('');
  const [order_type_index, setOrderTypeIndex] = useState(0);
  const [order_type, setOrderType] = useState(0);
  const [order_date, setOrderDate] = useState(undefined);
  const [time, setTime] = useState(undefined);
  const [defaultDate, setDefaultDate] = useState(new Date());
  const [mode, setMode] = useState('time');
  const [show, setShow] = useState(false);
  const [current_date, setCurrentDate] = useState(undefined);
  const [show_time, setShowTime] = useState(undefined);
  const [calculate_distance, setCalculateDistance] = useState(undefined);
  const [wallet, setWallet] = useState(0);
  const [restaurant_name, setRestaurantName] = useState(route.params.restaurant_details ? route.params.restaurant_details.restaurant_name : route.params.restaurant_name);
  console.log("restaurant_name", route.params);
  const [time_format, setTimeFormat] = useState('');
  const handleBackButtonClick = () => {
    navigation.goBack()
  }
  //console.log("route.params ", props)
  const getDistance = async () => {
    fetch('https://maps.googleapis.com/maps/api/distancematrix/json?destinations=' + props.address.address + '&origins=' + route.params.restaurant_details.google_address + '&key=' + GOOGLE_KEY)
      .then((response) => response.json())
      .then(async (responseJson) => {
        setCalculateDistance(responseJson.rows[0].elements[0].distance)
        //console.log("responseJson ", responseJson.rows[0].elements[0].distance);
      });
  }

  const payment_methods = () => {
    navigation.navigate("PaymentMethods", { modes: payment_list })
  }

  const default_order_date = async () => {
    let selectedTime = new Date()
    let hours = await selectedTime.getHours(),
      minutes = await selectedTime.getMinutes(),
      seconds = await selectedTime.getSeconds();
    let time = await hours + ":" + minutes + ":" + seconds
    let current_date = await selectedTime.getDate() + '-' + (selectedTime.getMonth() + 1) + '-' + selectedTime.getFullYear();

    setOrderDate(current_date + time);
  };

  const onChange = async (event, selectedTime) => {
    setShow(false);
    let hours = await selectedTime.getHours(),
      minutes = await selectedTime.getMinutes(),
      seconds = await selectedTime.getSeconds();
    let time = await hours + ":" + minutes;
    let current_date = await selectedTime.getDate() + '-' + (selectedTime.getMonth() + 1) + '-' + selectedTime.getFullYear();
    formatAMPM(selectedTime)
    setCurrentDate(current_date);
    setTime(time);
    setOrderDate(current_date + time);
  };

  const formatAMPM = (date) => {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    let strTime = hours + ':' + minutes + ' ' + ampm;
    setTimeFormat(strTime)

    return strTime;
  }

  const showTimepicker = () => {
    setShow(true);
  };

  const select_order_date_time = (data) => {
    if (data == 1) {
      showTimepicker();
    }
  }

  useEffect(() => {
    get_payment_methods();
    const unsubscribe = navigation.addListener('focus', async () => {
      await default_order_date();
      await getDistance()
      await props.calculateTotal();
    });
    return unsubscribe;
  }, []);

  const ref_variable = async () => {
    await setTimeout(() => {
      rbsheet_ref.current.focus();
    }, 200);
  }

  const spl_instruction = () => {
    rbsheet_ref.current.open()
  }

  const close_rbsheet = () => {
    rbsheet_ref.current.close()
  }

  const promo_code = () => {
    navigation.navigate("PromoCode", { restaurant_name: restaurant_name });
  }

  const change_address = () => {
    navigation.navigate("AddressList", { from: 'cart' })
  }

  const add_to_cart = async (qty, item_id, item_name, price) => {
    let cart_items = await props.cart_items;
    let old_item_details = await cart_items[item_id];
    let sub_total = await parseFloat(props.sub_total);
    let total_price = await parseFloat(qty * price);
    if (old_item_details != undefined && total_price > 0) {
      let final_price = await parseFloat(total_price) - parseFloat(old_item_details.total);
      sub_total = await parseFloat(sub_total) + parseFloat(final_price);
    } else if (total_price > 0) {
      let final_price = await parseFloat(qty * price);
      sub_total = await parseFloat(sub_total) + parseFloat(final_price);
    }
    if (qty > 0) {
      let item = await {
        item_id: item_id,
        item_name: item_name,
        quantity: qty,
        price_per_item: parseFloat(price),
        total: parseFloat(qty * price)
      }
      cart_items[item_id] = await item;
      await props.addToCart(cart_items);
      await props.updateSubtotal(sub_total.toFixed(2));
      await props.calculateTotal();
    } else {
      delete cart_items[item_id];
      sub_total = parseFloat(sub_total) - parseFloat(price);
      await props.addToCart(cart_items);
      await props.updateSubtotal(sub_total);
      await props.calculateTotal();
    }
  }

  const navigate_login = () => {
    navigation.navigate("Phone");
  }

  const check_payment_mode = () => {
    if (props.payment_mode.slug == 'cash') {
      order_placing();
    } else if (props.payment_mode.slug == 'razorpay') {
      razorpay();
    } else if (props.payment_mode.slug == 'wallet') {
      if (props.total > wallet) {
        alert('Sorry insufficient wallet balance');
      } else {
        order_placing();
      }
    }
  }

  const razorpay = async () => {
    console.log({
      currency: global.currency_short_code,
      key: global.razorpay_key,
      amount: props.total * 100,
      name: global.app_name,
      prefill: {
        contact: global.phone_with_code,
        name: global.customer_name
      }
    })
    var options = {
      currency: global.currency_short_code,
      key: global.razorpay_key,
      amount: props.total * 100,
      name: global.app_name,
      prefill: {
        contact: global.phone_with_code,
        name: global.customer_name
      },
      theme: { color: colors.theme_fg }
    }
    RazorpayCheckout.open(options).then((data) => {
      order_placing();
    }).catch((error) => {
      alert('Transaction declined');
    });
  }

  const order_placing = async () => {
    console.log({
      customer_id: global.id,
      restaurant_id: props.restaurant_id,
      address_id: props.address.id,
      total: props.total,
      discount: props.discount,
      sub_total: props.sub_total,
      tax: props.tax,
      delivery_charge: props.delivery_charge,
      promo_id: props.promo ? props.promo.id : 0,
      payment_mode: props.payment_mode.id,
      items: JSON.stringify(Object.values(props.cart_items)),
      delivery_instruction: special_instruction,
      order_type: order_type_index,
      order_date: order_date,
    })
    setLoading(true);
    await axios({
      method: 'post',
      url: api_url + place_order,
      data: {
        customer_id: global.id,
        restaurant_id: props.restaurant_id,
        address_id: props.address.id,
        total: props.total,
        discount: props.discount,
        sub_total: props.sub_total,
        tax: props.tax,
        delivery_charge: props.delivery_charge,
        promo_id: props.promo ? props.promo.id : 0,
        payment_mode: props.payment_mode.id,
        items: JSON.stringify(Object.values(props.cart_items)),
        delivery_instruction: special_instruction,
        order_type: order_type_index,
        order_date: order_date,
      }
    })
      .then(async response => {
        setLoading(false);
        if (response.data.status == 1) {
          await props.reset();
          await navigation.navigate("Success");
        } else {
          alert(JSON.stringify(response));
        }
      })
      .catch(error => {
        setLoading(false);
        console.log(error);
        alert('Sorry something went wrong Cart');
      });
  }

  const get_payment_methods = async () => {
    //setLoading(true);
    await axios({
      method: 'post',
      url: api_url + get_payment_type,
      data: { type: 0, customer_id: global.id }
    })
      .then(async response => {
        setLoading(false);
        console.log("response.data.result.payment_modes ", response.data.result.payment_modes)
        setPaymentList(response.data.result.payment_modes);
        if (!props.payment_mode) {
          props.updatePaymentMode(response.data.result.payment_modes[0])
        }
        setWallet(response.data.result.wallet_balance);
      })
      .catch(error => {
        setLoading(false);
        alert('Sorry something went wrong Cart 1')
      });
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={colors.theme_bg} />
      {global.id != 0 &&
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <TouchableOpacity onPress={handleBackButtonClick} style={{ width: '15%', justifyContent: 'center', alignItems: 'flex-start' }}>
              <Icon type={Icons.Ionicons} name="chevron-back-circle-outline" color={colors.theme_fg_two} style={{ fontSize: 35 }} />
            </TouchableOpacity>
            <View style={{ width: '65%', justifyContent: 'center', alignItems: 'flex-start' }}>
              <Text style={{ color: colors.theme_fg_two, fontFamily: bold, fontSize: 20 }}>{restaurant_name}</Text>
            </View>
            <TouchableOpacity onPress={promo_code} style={{ width: '20%', justifyContent: 'center', alignItems: 'flex-end', flexDirection: 'row' }}>
              <Image style={{ height: 15, width: 15 }} source={offer} />
              <View style={{ margin: 2 }} />
              <Text onPress={promo_code} style={{ color: colors.light_blue, fontFamily: regular, fontSize: 12 }}>Offers</Text>
            </TouchableOpacity>
          </View>
          <View style={{ backgroundColor: colors.grey, borderTopWidth: 0.5, borderColor: colors.light_grey }} />
          <View style={{ margin: 5 }} />
          <View style={{ padding: 10 }}>
            {props.address &&
              <View style={{ flexDirection: 'row', }}>
                <View style={{ width: '10%', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                  <Image style={{ height: 20, width: 20 }} source={location} />
                </View>
                <View style={{ width: '70%', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                  <Text style={{ fontFamily: regular, fontSize: 12, color: colors.theme_fg_two }}>{props.address.address}</Text>
                </View>
                <View style={{ width: '20%', justifyContent: 'flex-start', alignItems: 'flex-end' }}>
                  <TouchableOpacity onPress={change_address}>
                    <Text style={{ color: colors.red, fontFamily: regular, fontSize: 12 }}>CHANGE</Text>
                  </TouchableOpacity>
                </View>
              </View>
            }
            {calculate_distance && (
              <>
                <View style={{ margin: 10 }} />
                <View style={{ flexDirection: 'row' }}>
                  <View style={{ width: '10%', justifyContent: 'center', alignItems: 'flex-start' }}>
                    <Icon type={Icons.Ionicons} name="bicycle" color={colors.theme_fg} style={{ fontSize: 20 }} />
                  </View>
                  <View style={{ width: '75%', justifyContent: 'center', alignItems: 'flex-start' }}>
                    <Text style={{ fontFamily: regular, fontSize: 12, color: colors.theme_fg_two }}>{calculate_distance.text}</Text>
                  </View>
                </View>
              </>
            )}

            <View style={{ margin: 10 }} />
            <View style={{ flexDirection: 'row' }}>
              <View style={{ width: '10%', justifyContent: 'center', alignItems: 'flex-start' }}>
                <Icon type={Icons.Ionicons} name="ios-timer-outline" color={colors.theme_fg} style={{ fontSize: 20 }} />
              </View>
              <View style={{ width: '75%', justifyContent: 'center', alignItems: 'flex-start' }}>
                <Text style={{ fontFamily: regular, fontSize: 12, color: colors.theme_fg_two }}>Delivery in 29 mins</Text>
              </View>
            </View>

            <View style={{ margin: 5 }} />
          </View>
          <View style={{ borderBottomWidth: 15, borderColor: colors.light_grey, }} />
          <View style={{ width: '90%', alignSelf: 'center', marginTop: 10 }} >
            <SegmentedControl
              values={['Instant Order', 'Later Order']}
              selectedIndex={order_type_index}
              onChange={(event) => {
                setOrderTypeIndex(event.nativeEvent.selectedSegmentIndex);
                select_order_date_time(event.nativeEvent.selectedSegmentIndex);
              }}
              enabled={true}
              fontStyle={{ color: colors.theme_fg_two, fontFamily: regular }}
              activeFontStyle={{ color: colors.theme_fg, fontFamily: bold, fontSize: 15 }}
              backgroundColor={colors.light_grey}
            />
          </View>
          <View>
            {show && (
              <DateTimePicker
                testID="dateTimePicker"
                mode="time"
                value={defaultDate}
                mode={mode}
                is24Hour={true}
                display="default"
                onChange={onChange}
              />
            )}
          </View>
          {props.discount > 0 &&
            <View style={{ margin: 10 }}>
              <View style={{ borderWidth: 1, fontFamily: regular, fontSize: 8, borderColor: colors.light_blue, borderRadius: 10, backgroundColor: colors.light_grey, padding: 10 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'center', }}>
                  <View style={{ width: '50%', alignItems: 'flex-start' }}>
                    <Text style={{ fontSize: 12, color: colors.light_blue, fontFamily: regular }}>Your total savings</Text>
                  </View>
                  <View style={{ width: '50%', alignItems: 'flex-end' }}>
                    <Text style={{ fontSize: 12, color: colors.light_blue, fontFamily: regular, }}>{global.currency}{props.discount}</Text>
                  </View>
                </View>
              </View>
            </View>
          }

          <View style={{ flexDirection: 'row', padding: 10, }}>
            <Text style={{ fontFamily: bold, fontSize: 16, color: colors.theme_fg_two }}>Your cart</Text>
            <View style={{ margin: 3 }} />
            <Image style={{ height: 16, width: 16 }} source={bag} />
          </View>
          {props.cart_items.map((row, index) => (
            <View style={{ flexDirection: 'row', padding: 10 }}>
              <View style={{ width: '70%', alignItems: 'flex-start', }}>
                <Text style={{ fontSize: 12, color: colors.theme_fg_two, fontFamily: regular }}>{row.item_name}</Text>
                <View style={{ margin: 3 }} />
                <Text style={{ fontSize: 12, color: colors.theme_fg_two, fontFamily: regular }}>{global.currency}{row.price_per_item}</Text>
              </View>
              <View style={{ width: '30%', alignItems: 'flex-end', }}>
                <UIStepper
                  onValueChange={(value) => { add_to_cart(value, row.item_id, row.item_name, row.price_per_item) }}
                  displayValue={true}
                  initialValue={props.cart_items[row.item_id] ? props.cart_items[row.item_id].quantity : 0}
                  value={props.cart_items[row.item_id] ? props.cart_items[row.item_id].quantity : 0}
                  borderColor={colors.theme_fg}
                  textColor={colors.theme_fg}
                  tintColor={colors.theme_fg}
                />
                <View style={{ margin: 3 }} />
                <Text style={{ fontSize: 12, color: colors.theme_fg_two, fontFamily: regular, }}>{global.currency}{row.total}</Text>
              </View>
            </View>
          ))}
          {order_type_index == 0 ?
            <View style={{ flexDirection: 'row', paddingLeft: 5 }}>
              <Text> Your Order Pacing Time - {Moment().format('MMM DD, YYYY  hh:mm A')}</Text>
            </View>
            :
            <View style={{ flexDirection: 'row', paddingLeft: 5 }}>
              <Text> Your Order Pacing Time - {Moment({ current_date }).format('MMM DD, YYYY')} {time_format}</Text>
            </View>
          }
          <View style={{ margin: 5 }} />
          <View style={{ borderBottomWidth: 5, borderColor: colors.light_grey, }} />
          <TouchableOpacity onPress={spl_instruction.bind(this)} style={{ flexDirection: 'row', padding: 10 }}>
            <Icon type={Icons.Ionicons} name="list-outline" color={colors.theme_fg_two} style={{ fontSize: 15 }} />
            <View style={{ margin: 3 }} />
            <Text style={{ borderBottomWidth: 0.5, borderStyle: 'dashed', borderColor: colors.grey, fontFamily: regular, fontSize: 12, color: colors.grey, paddingBottom: 2 }}>Do you want to add cooking instructions?</Text>
          </TouchableOpacity>
          <View style={{ borderBottomWidth: 15, borderColor: colors.light_grey, }} />
          <View style={{ margin: 5 }} />
          <Text style={{ fontSize: 16, color: colors.theme_fg_two, fontFamily: regular, padding: 10 }}>Offers</Text>
          {!props.promo ?
            <View style={{ flexDirection: 'row', padding: 10 }}>
              <View style={{ width: '7%', justifyContent: 'center', alignItems: 'flex-start' }}>
                <Image style={{ height: 15, width: 15 }} source={offer} />
              </View>
              <View style={{ width: '65%', justifyContent: 'center', alignItems: 'flex-start' }}>
                <Text style={{ fontFamily: regular, fontSize: 14, color: colors.theme_fg_two }}>Select a coupon code</Text>
              </View>
              <View style={{ width: '28%', justifyContent: 'flex-start', alignItems: 'flex-end' }}>
                <TouchableOpacity onPress={promo_code}>
                  <Text style={{ color: colors.red, fontFamily: regular, fontSize: 12 }}>View Offers</Text>
                </TouchableOpacity>
              </View>
            </View>
            :
            <View style={{ flexDirection: 'row', padding: 10 }}>
              <View style={{ width: '7%', justifyContent: 'center', alignItems: 'flex-start' }}>
                <Image style={{ height: 20, width: 20 }} source={offer} />
              </View>
              <View style={{ width: '65%', justifyContent: 'center', alignItems: 'flex-start' }}>
                <Text style={{ fontFamily: regular, fontSize: 14, color: colors.theme_fg_two }}>Code {props.promo.promo_code} applied!</Text>
                <Text style={{ fontFamily: regular, fontSize: 13, color: colors.grey }}>{props.promo.description}</Text>
              </View>
              <View style={{ width: '28%', justifyContent: 'flex-start', alignItems: 'flex-end' }}>
                <TouchableOpacity onPress={promo_code} style={{ alignItems: 'center' }}>
                  <Text style={{ color: colors.light_blue, fontFamily: bold, fontSize: 14 }}>- {global.currency}{props.discount}</Text>
                  <Text style={{ color: colors.red, fontFamily: regular, fontSize: 12 }}>Change Offer</Text>
                </TouchableOpacity>
              </View>
            </View>
          }
          <View style={{ margin: 5 }} />
          <View style={{ borderBottomWidth: 15, borderColor: colors.light_grey, }} />
          <View style={{ margin: 5 }} />
          <View style={{ padding: 10 }} >
            <View style={{ flexDirection: 'row', justifyContent: 'center', }}>
              <View style={{ width: '50%', alignItems: 'flex-start' }}>
                <Text style={{ fontSize: 12, color: colors.grey, fontFamily: regular, }}>Item Total</Text>
              </View>
              <View style={{ width: '50%', alignItems: 'flex-end' }}>
                <Text style={{ fontSize: 12, color: colors.grey, fontFamily: regular }}>{global.currency}{props.sub_total}</Text>
              </View>
            </View>
            {props.promo != undefined &&
              <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 5 }}>
                <View style={{ width: '50%', alignItems: 'flex-start' }}>
                  <Text style={{ fontSize: 14, color: colors.light_blue, fontFamily: regular }}>Promo - ({props.promo.promo_code})</Text>
                </View>
                <View style={{ width: '50%', alignItems: 'flex-end' }}>
                  <Text style={{ fontSize: 14, color: colors.light_blue, fontFamily: regular }}>- {global.currency}{props.discount}</Text>
                </View>
              </View>
            }
            <View style={{ margin: 5 }} />
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <View style={{ width: '50%', alignItems: 'flex-start' }}>
                <Text style={{ fontSize: 12, color: colors.grey, fontFamily: regular, borderBottomWidth: 0.5, borderStyle: 'dashed', paddingBottom: 2 }}>Platform fee</Text>
              </View>
              <View style={{ width: '50%', alignItems: 'flex-end' }}>
                <Text style={{ fontSize: 12, color: colors.grey, fontFamily: regular }}>{global.currency}0</Text>
              </View>
            </View>
            <View style={{ margin: 5 }} />
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <View style={{ width: '50%', alignItems: 'flex-start' }}>
                <Text style={{ fontSize: 12, color: colors.grey, fontFamily: regular, borderBottomWidth: 0.5, borderStyle: 'dashed', paddingBottom: 2 }}>Delivery charge</Text>
              </View>
              <View style={{ width: '50%', alignItems: 'flex-end' }}>
                <Text style={{ fontSize: 12, color: colors.grey, fontFamily: regular }}>{global.currency}{props.delivery_charge}</Text>
              </View>
            </View>
            <View style={{ margin: 5 }} />
            <View style={{ flexDirection: 'row', justifyContent: 'center', }}>
              <View style={{ width: '50%', alignItems: 'flex-start' }}>
                <Text style={{ fontSize: 12, color: colors.grey, fontFamily: regular, }}>Taxes</Text>
              </View>
              <View style={{ width: '50%', alignItems: 'flex-end' }}>
                <Text style={{ fontSize: 12, color: colors.grey, fontFamily: regular }}>{global.currency}{props.tax}</Text>
              </View>
            </View>
            {/*<View style={{ margin:5 }} />
          <View style={{ flexDirection:'row', justifyContent:'center'}}>
            <View style={{ width:'45%',alignItems:'flex-start'}}>
              <Text style={{ fontSize:12, color:colors.grey, fontFamily:regular,borderBottomWidth:0.5,borderStyle:'dashed',paddingBottom:2}}>Donate ₹2 to Feeding India</Text>
            </View>
            <TouchableOpacity style={{ width:'55%',alignItems:'flex-start'}}>
              <Text style={{ fontSize:12, color:colors.red, fontFamily:regular}}> Add </Text>
            </TouchableOpacity>
          </View>*/}
            <View style={{ margin: 10 }} />
            <View style={{ flexDirection: 'row', justifyContent: 'center', }}>
              <View style={{ width: '50%', alignItems: 'flex-start' }}>
                <Text style={{ fontSize: 14, color: colors.theme_fg_two, fontFamily: regular, }}>Grand Total</Text>
              </View>
              <View style={{ width: '50%', alignItems: 'flex-end' }}>
                <Text style={{ fontSize: 14, color: colors.theme_fg_two, fontFamily: regular }}>{global.currency}{props.total}</Text>
              </View>
            </View>
          </View>
          <View style={{ margin: 5 }} />
          <View style={{ borderBottomWidth: 15, borderColor: colors.light_grey, }} />
          <View style={{ margin: 5 }} />
          <View style={{ padding: 10 }} >
            <View style={{ flexDirection: 'row', justifyContent: 'center', }}>
              <View style={{ width: '100%', alignItems: 'flex-start' }}>
                <Text style={{ fontSize: 12, color: colors.theme_fg_two, fontFamily: regular, }}>Your details</Text>
              </View>
            </View>
            <View style={{ margin: 5 }} />
            <Text style={{ fontSize: 12, color: colors.grey, fontFamily: regular, }}>{global.customer_name}, {global.phone_number}</Text>
          </View>
          <View style={{ margin: 40 }} />
        </ScrollView>
      }
      {global.id != 0 ?
        <View>
          {props.address ?
            <View style={{ flexDirection: 'row', width: '100%', height: 80, padding: 10, backgroundColor: colors.theme_bg_three, position: 'absolute', bottom: 0, }}>
              {props.payment_mode &&
                <TouchableOpacity onPress={payment_methods} style={{ width: '50%', alignItems: 'flex-start', justifyContent: 'center' }}>
                  <View style={{ flexDirection: 'row', }}>
                    <View style={{ width: '15%', alignItems: 'flex-start', justifyContent: 'center' }}>
                      <View style={{ height: 20, width: 20 }}>
                        <Image style={{ height: undefined, width: undefined, flex: 1 }} source={{ uri: img_url + props.payment_mode.icon }} />
                      </View>
                    </View>
                    <View style={{ width: '85%', alignItems: 'center', justifyContent: 'flex-start', flexDirection: 'row' }}>
                      <Text style={{ fontFamily: regular, fontSize: 12, color: colors.grey }}>Pay Using</Text>
                      <View style={{ margin: 5 }} />
                      <Icon type={Icons.Ionicons} name="caret-up-outline" color={colors.grey} style={{ fontSize: 14 }} />
                    </View>
                  </View>
                  <View style={{ margin: 2 }} />
                  <View style={{ width: '100%', alignItems: 'flex-start', justifyContent: 'center' }}>
                    <Text style={{ fontFamily: bold, fontSize: 12, color: colors.theme_fg_two }}>{props.payment_mode.payment_name == 'Razorpay' ? 'Bongo' : props.payment_mode.payment_name}</Text>
                  </View>
                </TouchableOpacity>
              }
              <View style={{ width: '50%', alignItems: 'flex-end', justifyContent: 'center' }}>
                <TouchableOpacity onPress={check_payment_mode} style={{ width: '100%', borderWidth: 0.5, height: '70%', alignItems: 'flex-start', justifyContent: 'center', borderRadius: 5, backgroundColor: colors.theme_fg, borderColor: colors.theme_fg }}>
                  <View style={{ flexDirection: 'row', padding: 10 }}>
                    <View style={{ width: '95%', alignItems: 'center', }}>
                      <Text style={{ fontSize: 14, color: colors.theme_fg_three, fontFamily: regular }}>Place order</Text>
                    </View>
                    <View style={{ width: '5%', alignItems: 'flex-start', justifyContent: 'center' }}>
                      <Icon type={Icons.Ionicons} name="caret-forward-outline" color={colors.theme_bg_three} style={{ fontSize: 10 }} />
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            :
            <TouchableOpacity onPress={change_address} activeOpacity={1} style={{ flexDirection: 'row', width: '100%', height: 80, padding: 10, backgroundColor: colors.theme_bg_three, position: 'absolute', bottom: 0, }}>
              <View style={{ width: '100%', alignItems: 'flex-end', justifyContent: 'center' }}>
                <View style={{ width: '100%', borderWidth: 0.5, height: '70%', alignItems: 'flex-start', justifyContent: 'center', borderRadius: 5, backgroundColor: colors.theme_fg, borderColor: colors.theme_fg }}>
                  <View style={{ flexDirection: 'row', padding: 10 }}>
                    <View style={{ width: '95%', alignItems: 'center', }}>
                      <Text style={{ fontSize: 14, color: colors.theme_fg_three, fontFamily: regular }}>Select Address</Text>
                    </View>
                    <View style={{ width: '5%', alignItems: 'flex-start', justifyContent: 'center' }}>
                      <Icon type={Icons.Ionicons} name="caret-forward-outline" color={colors.theme_bg_three} style={{ fontSize: 10 }} />
                    </View>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          }
        </View>
        :
        <View style={{ padding: 10, height: '100%', justifyContent: 'center' }}>
          <TouchableOpacity onPress={navigate_login.bind(this)} style={styles.button_lgn}>
            <Text style={{ color: colors.theme_fg_three, fontFamily: bold, fontSize: 14 }}>Login</Text>
          </TouchableOpacity>
          <View style={{ margin: 10 }} />
          <Text style={{ fontSize: 12, color: colors.grey, alignSelf: 'center', fontFamily: bold }}>Please login for access this feature</Text>
          <View style={{ margin: 10 }} />
          <Text onPress={handleBackButtonClick} style={{ fontSize: 16, color: colors.theme_fg_two, alignSelf: 'center', fontFamily: bold, textDecorationLine: 'underline' }}>Back</Text>
        </View>
      }

      <Loader visible={loading} />
      <RBSheet
        ref={rbsheet_ref}
        height={250}
        animationType="fade"
        duration={250}
        closeOnDragDown={true}
      >
        <View style={{ margin: 10 }} />
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <TextInput
            style={styles.input}
            onChangeText={text => setSpecialInstruction(text)}
            multiline={true}
            placeholder="List your special instructions."
            underlineColorAndroid='transparent'
          />
          <View style={{ margin: 10 }} />
          <TouchableOpacity onPress={close_rbsheet.bind(this)} style={styles.button}>
            <Text style={{ color: colors.theme_fg_three, fontFamily: bold, fontSize: 14 }}>Done</Text>
          </TouchableOpacity>
        </View>
        <View style={{ margin: 10 }} />
      </RBSheet>

    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.theme_bg_three,

  },
  header: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    shadowColor: '#ccc',
    padding: 10,
  },
  button: {
    padding: 10,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.theme_bg,
    height: 45
  },
  input: {
    width: '90%',
    height: 120,
    borderColor: colors.light_grey,
    borderWidth: 1,
    backgroundColor: colors.light_grey,
    borderRadius: 10,
    padding: 10,
  },
  button_lgn: {
    padding: 10,
    borderRadius: 10,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.theme_bg,
    width: '100%',
    height: 45
  },
});

function mapStateToProps(state) {
  return {
    promo: state.order.promo,
    total: state.order.total,
    delivery_charge: state.order.delivery_charge,
    sub_total: state.order.sub_total,
    cart_items: state.order.cart_items,
    tax_list: state.order.tax_list,
    tax: state.order.tax,
    discount: state.order.discount,
    address: state.order.address,
    payment_mode: state.order.payment_mode,
    restaurant_id: state.order.restaurant_id,
    cart_count: state.order.cart_count,
  };
}

const mapDispatchToProps = (dispatch) => ({
  updatePromo: (data) => dispatch(updatePromo(data)),
  updateTotal: (data) => dispatch(updateTotal(data)),
  deliveryCharge: (data) => dispatch(deliveryCharge(data)),
  addToCart: (data) => dispatch(addToCart(data)),
  updateSubtotal: (data) => dispatch(updateSubtotal(data)),
  updateTax: (data) => dispatch(updateTax(data)),
  updateDiscount: (data) => dispatch(updateDiscount(data)),
  calculateTotal: (data) => dispatch(calculateTotal(data)),
  updatePaymentMode: (data) => dispatch(updatePaymentMode(data)),
  reset: () => dispatch(reset()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Cart);
