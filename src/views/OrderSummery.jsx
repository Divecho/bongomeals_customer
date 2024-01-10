import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, SafeAreaView, ScrollView, TouchableOpacity, Image, FlatList, Linking, Platform, StatusBar } from 'react-native';
import Icon, { Icons } from '../components/Icons';
import * as colors from '../assets/css/Colors';
import { app_name, light, regular, bold, home_banner, address_lottie, veg, order_detail, api_url, img_url, cancel } from '../config/Constants';
import LottieView from 'lottie-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Moment from 'moment';
import axios from 'axios';
import { Loader } from '../components/Loader';

const OrderSummary = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [order_details, setOrderDetails] = useState("");
  const [order_items, setOrderItems] = useState([]);
  const [id, setID] = useState(route.params.id);
  const [loading, setLoading] = useState(false);
  const [allowed_statuses, setAllowedStatuses] = useState([ "restaurant_rejected","cancelled_by_customer","cancelled_by_restaurant","cancelled_by_deliveryboy" ]);

  const handleBackButtonClick= () => {
    navigation.goBack()
  }  

  useEffect( () => {
    const unsubscribe = navigation.addListener('focus', async () => {
      get_order_detail();
    });
    return unsubscribe;
  },[]);  

  const get_order_detail = async () => {
    //setLoading(true);
    await axios({
      method: 'post', 
      url: api_url + order_detail,
      data:{order_id:id}
    })
    .then(async response => {
      await setLoading(false);
      await setOrderDetails(response.data.result);
      await setOrderItems(response.data.result.item_list)
    })
    .catch(error => {
      setLoading(false);
      alert("Sorry something went wrong Summery")
    });
  }

  const give_ratings = () =>{
    navigation.navigate("Ratings", { order_details: order_details})
  }

  const support = () =>{
    navigation.navigate("FaqCategories")
  }

  const call_restaurant = async(number) =>{
    let phoneNumber = '';
    if (Platform.OS === 'android'){ 
      phoneNumber = await `tel:${number}`; 
    }else{
      phoneNumber = await `telprompt:${number}`; 
    }
    await Linking.openURL(phoneNumber);
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={colors.theme_bg}/>
      <ScrollView showsVerticalScrollIndicator={false} style={{padding: 10}}>
      <Loader visible={loading} />
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBackButtonClick} style={{ width:'50%',justifyContent:'center', alignItems:'flex-start' }}>
            <Icon type={Icons.Ionicons} name="chevron-back-circle-outline" color={colors.theme_fg_two} style={{ fontSize:35 }} />
          </TouchableOpacity>
          <TouchableOpacity onPress={support} style={{ width:'50%',justifyContent:'center', alignItems:'flex-end' }}>
            <Text style={{ color:colors.red, fontFamily:regular, fontSize:12 }}>Support</Text>
          </TouchableOpacity>
        </View>
        <View style={{ margin:10 }} />
        <Text style={{ color:colors.theme_fg_two, fontFamily:regular, fontSize:20 }}>Order Summary</Text>
        <View style={{ margin:10 }} />
        <Text style={{ color:colors.theme_fg_two, fontFamily:regular, fontSize:16, letterSpacing:1 }}>{order_details.restaurant_name}</Text>
        <View style={{ margin:1 }} />
        <Text style={{ color:colors.grey, fontFamily:regular, fontSize:10, }}>{order_details.manual_address}</Text>
        <View style={{ margin:5 }} />
        <Text style={{ color:colors.grey, fontFamily:regular, fontSize:10, }}>This order with {order_details.restaurant_name} was delivered</Text>
        <View style={{ margin:10 }} />
        <View style={{ flexDirection:'row',backgroundColor:colors.theme_bg_three, borderBottomWidth:0.5, borderColor:colors.grey}}>
          <View style={{ width:'50%', justifyContent:'center', alignItems:'flex-start', paddingBottom:10,}}>
            <Text style={{ fontFamily:regular, fontSize:16, color:colors.theme_fg_two}}>Your Order</Text>
          </View>
        </View>
        {order_items.map((item) => {
          return (
            <View style={{ backgroundColor:colors.theme_bg_three, paddingBottom:10, paddingTop:10, borderBottomWidth:0.5, borderColor:colors.grey,flexDirection:'row' }}>
              <View style={{ width:'50%'}}>
                <View style={{ flexDirection:'row', alignItems:'center', }}>
                  <Image style={{ height: 15, width: 15}} source={{ uri : img_url+item.icon }} />
                  <View style={{ margin:4 }} />
                  <Text style={{ fontSize:12, color:colors.theme_fg_two, fontFamily:regular}}>{item.item_name}</Text>
                </View>
                <View style={{ flexDirection:'row', alignItems:'center', marginTop:10 }}>
                  <View style={{ borderWidth:0.5,width:15,height:15, alignItems:'center', justifyContent:'center', borderColor:colors.green, backgroundColor:colors.light_green }}>
                    <Text style={{fontFamily:regular, fontSize:8,color:colors.theme_fg_two}}>{item.quantity}</Text>  
                  </View>
                  <View style={{ margin:5 }} />
                  <Text style={{ fontSize:12, color:colors.theme_fg_two, fontFamily:regular}}>X</Text>
                  <View style={{ margin:5 }} />
                  <Text style={{ fontSize:12, color:colors.theme_fg_two, fontFamily:regular}}>{global.currency}{item.price_per_item}</Text>
                </View>
              </View>
              <View style={{ width:'50%', alignItems:'flex-end',justifyContent:'center',}}>
                <Text style={{ fontSize:12, color:colors.grey, fontFamily:regular}}>{global.currency}{item.total}</Text>
              </View>
            </View>
          );
        })}
        <View style={{ margin:5 }} />
        <View style={{ flexDirection:'row', justifyContent:'center', }}>
          <View style={{ width:'50%',alignItems:'flex-start'}}>
            <Text style={{ fontSize:14, color:colors.theme_fg_two, fontFamily:regular}}>Item Total</Text>
          </View>
          <View style={{ width:'50%',alignItems:'flex-end'}}>
            <Text style={{ fontSize:14, color:colors.theme_fg_two, fontFamily:regular}}>{global.currency}{order_details.sub_total}</Text>
          </View>
        </View>
        <View style={{ margin:5 }} />
        {order_details.promo_id >0 &&
          <View>
            <View style={{ flexDirection:'row', justifyContent:'center', }}>
              <View style={{ width:'50%',alignItems:'flex-start'}}>
                <Text style={{ fontSize:12, color:colors.light_blue, fontFamily:regular}}>Coupon - ({order_details.promo_name})</Text>
              </View>
              <View style={{ width:'50%',alignItems:'flex-end'}}>
                <Text style={{ fontSize:12, color:colors.light_blue, fontFamily:regular}}>you saved {global.currency}{order_details.discount}</Text>
              </View>
            </View>
            <View style={{ margin:5 }} />
          </View>
        }
        <View style={{ flexDirection:'row', justifyContent:'center', }}>
          <View style={{ width:'50%',alignItems:'flex-start'}}>
            <Text style={{ fontSize:12, color:colors.grey, fontFamily:regular}}>Taxes</Text>
          </View>
          <View style={{ width:'50%',alignItems:'flex-end'}}>
            <Text style={{ fontSize:12, color:colors.grey, fontFamily:regular}}>{global.currency}{order_details.tax}</Text>
          </View>
        </View>
        <View style={{ margin:5 }} />
        <View style={{ flexDirection:'row', justifyContent:'center', }}>
          <View style={{ width:'50%',alignItems:'flex-start'}}>
            <Text style={{ fontSize:12, color:colors.grey, fontFamily:regular}}>Delivery Charge</Text>
          </View>
          <View style={{ width:'50%',alignItems:'flex-end'}}>
            <Text style={{ fontSize:12, color:colors.grey, fontFamily:regular}}> {global.currency}{order_details.delivery_charge}</Text>
          </View>
        </View>
        <View style={{ margin:5 }} />
        <View style={{ backgroundColor:colors.theme_bg_three, borderBottomWidth:0.5, borderColor:colors.grey,flexDirection:'row',}}/>
        <View style={{ margin:5 }} />
        <View style={{ flexDirection:'row', justifyContent:'center', }}>
          <View style={{ width:'50%',alignItems:'flex-start'}}>
            <Text style={{ fontSize:14, color:colors.theme_fg_two, fontFamily:regular}}>Grand Total</Text>
          </View>
          <View style={{ width:'50%',alignItems:'flex-end'}}>
            <Text style={{ fontSize:14, color:colors.theme_fg_two, fontFamily:regular}}> {global.currency}{order_details.total}</Text>
          </View>
        </View>
        {order_details.promo_id >0 &&
          <View>
            <View style={{ margin:5 }} />
            <View style={{ margin:10}}>
              <View style={{borderWidth:1, fontFamily:regular, fontSize:8, borderColor:colors.light_blue, borderRadius:10, backgroundColor:colors.light_grey, padding:10}}>  
                <View style={{ flexDirection:'row', justifyContent:'center', }}>
                  <View style={{ width:'50%',alignItems:'flex-start'}}>
                    <Text style={{ fontSize:12, color:colors.light_blue, fontFamily:regular}}>Your total savings</Text>
                  </View>
                  <View style={{ width:'50%',alignItems:'flex-end'}}>
                    <Text style={{ fontSize:12, color:colors.light_blue, fontFamily:regular,}}>{global.currency}{order_details.discount}</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        }
        <View style={{position:'absolute', top:'30%', left:'25%'}}>
          {allowed_statuses.includes(order_details.slug) &&
            <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
              <Image style={{ height:125, width:160 }} source={cancel}/>
            </View>
          }
        </View>
        <View style={{ margin:15 }} />
        <Text style={{ color:colors.theme_fg_two, fontFamily:regular, fontSize:18 }}>Order details</Text>
        <View style={{ margin:5 }} />
        <View style={{ flexDirection:'row', backgroundColor:colors.theme_bg_three, borderBottomWidth:0.5, borderColor:colors.grey}}/>
        <View style={{ margin:5 }} />
        <Text style={{ fontSize:12, color:colors.grey, fontFamily:regular}}>Order Number</Text>
        <View style={{ margin:1 }} />
        <Text style={{ fontSize:14, color:colors.grey, fontFamily:regular}}>#{order_details.id}</Text>
        <View style={{ margin:10 }} />
        <Text style={{ fontSize:12, color:colors.grey, fontFamily:regular}}>Payment</Text>
        <View style={{ margin:1 }} />
        <Text style={{ fontSize:14, color:colors.grey, fontFamily:regular}}>{order_details.payment_name}</Text>
        <View style={{ margin:10 }} />
        <Text style={{ fontSize:12, color:colors.grey, fontFamily:regular}}>Date</Text>
        <View style={{ margin:1 }} />
        <Text style={{ fontSize:14, color:colors.grey, fontFamily:regular}}>{Moment(order_details.order_date).format('MMM DD, YYYY hh:mm A')}</Text>
        <View style={{ margin:10 }} />
        <Text style={{ fontSize:12, color:colors.grey, fontFamily:regular}}>Phone number</Text>
        <View style={{ margin:1 }} />
        <Text style={{ fontSize:14, color:colors.grey, fontFamily:regular}}>{order_details.phone_with_code}</Text>
        <View style={{ margin:10 }} />
        <Text style={{ fontSize:12, color:colors.grey, fontFamily:regular}}>Deliver to</Text>
        <View style={{ margin:1 }} />
        <Text style={{ fontSize:14, color:colors.grey, fontFamily:regular}}>{order_details.address}</Text>
        <View style={{ margin:10 }} />
        <TouchableOpacity onPress={call_restaurant.bind(this,order_details.restaurant_phone_number)} style={{ backgroundColor:colors.theme_bg_three, borderBottomWidth:0.5, borderColor:colors.grey,borderTopWidth:0.5, padding:15,alignItems:'center', justifyContent:'center',}}>
           <Text style={{ fontFamily:regular, fontSize:13, color:colors.red, }}>Call {order_details.restaurant_name} ({order_details.restaurant_phone_number})</Text>
        </TouchableOpacity>
        <View style={{ margin:10 }} />
        <Text style={{ fontSize:12, color:colors.grey, fontFamily:regular}}>{order_details.restaurant_name}</Text>
        <View style={{ margin:2 }} />
        <Text style={{ fontSize:12, color:colors.grey, fontFamily:regular}}>Lic.No. {order_details.licence_no ? order_details.licence_no : "Not updated"}</Text>
        <View style={{ height:60}} />
      </ScrollView>
      {order_details.rating_update_status == 0 && order_details.slug == "delivered" &&
      <View style={{ padding:10 }} >
        <TouchableOpacity onPress={give_ratings.bind(this,order_details)} style={{ width:'100%',height:40, padding:10, left:10, backgroundColor:colors.theme_fg, position:'absolute', bottom:0, borderRadius:7}}>  
          <View style={{ justifyContent:'center', alignItems:'center',flexDirection:'row',}}>
            <Icon type={Icons.Ionicons} name="heart" color={colors.theme_fg_three} style={{ fontSize:20 }} />
            <View style={{ margin:5 }} />
            <Text style={{ fontFamily:regular, fontSize:15, color:colors.theme_bg_three}}>Share Your Experience</Text>   
          </View>
        </TouchableOpacity>
      </View>
      }
    </SafeAreaView>  
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:colors.theme_bg_three,
  },
  header: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems:'center',
    flexDirection:'row',
    shadowColor: '#ccc',
  },
});

export default OrderSummary;
