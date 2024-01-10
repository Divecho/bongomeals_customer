import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, SafeAreaView, ScrollView, TouchableOpacity, Image, FlatList, Switch, Alert, StatusBar } from 'react-native';
import Icon, { Icons } from '../components/Icons';
import * as colors from '../assets/css/Colors';
import { app_name, light, regular, bold, home_banner,star, time, discount, non_veg, biryani,biryani_image, restaurant_menu, api_url, img_url, veg, update_favourite_restaurant, GOOGLE_KEY, empty_menu_lottie  } from '../config/Constants';
import { useNavigation, useRoute } from '@react-navigation/native';
import StarRating from 'react-native-star-rating';
import axios from 'axios';
import { connect } from 'react-redux';
import { Loader } from '../components/Loader';
import UIStepper from 'react-native-ui-stepper';
import { addToCart, updateSubtotal, updateRestaurantId, updateDeliveryCharge, reset } from '../actions/OrderActions';
import LottieView from 'lottie-react-native';

const Menu = (props) => {
  const navigation = useNavigation();
  const route = useRoute();
  const [star_count, setStarCount] = useState(false);
  const [loading, setLoading] = useState(false);
  const [restaurant_id, setRestaurantId] = useState(route.params.restaurant_id);
  const [restaurant_details, setRestaurantDetails] = useState(undefined); 
  const [categories, setCategories] = useState([]);
  const [view_value, setViewValue] = useState(true);
  const [add_favorite, setAddFavorite] = useState(''); 
  const [food_type, setFoodType] = useState(0);
  const [api_response, setApiResponse] = useState(0); 
  const [is_favourite, setIsFavourite] = useState(0);
  const [favourite_icon, setFavouriteIcon] = useState('heart-outline'); 
  const [veg_type, setVegType] = useState(0);
  const [non_veg_type, setNonVegType] = useState(0);
  const [egg_type, setEggType] = useState(0);
  const [eta, setEta] = useState(0);
  const [distance, setDistance] = useState(0); 
  const [promo, SetPromo] = useState([]);
  const [count, setCount] = useState(''); 

  const add_favourite = async() => {
    if(favourite_icon == "heart"){
      setFavouriteIcon('heart-outline');
    }else{
      setFavouriteIcon('heart');
    }
    update_favourite();
  }

  const check_favourite = async(favourite) => {
    setIsFavourite(favourite);
    if(favourite == 1){
      setFavouriteIcon('heart');
    }
  }

  const changeVegType = async() =>{
    await setVegType(!veg_type);
    await setNonVegType(0);
    await setEggType(0);
    await get_restaurant_menu(!veg_type == 0 ? 0 : 1);
  }

  const changeNonVegType = async() =>{
    await setVegType(0);
    await setNonVegType(!non_veg_type);
    await setEggType(0);
    await get_restaurant_menu(!non_veg_type == 0 ? 0 : 2);
  }

  const changeEggType = async() =>{
    await setVegType(0);
    await setNonVegType(0);
    await setEggType(!egg_type);
    await get_restaurant_menu(!egg_type == 0 ? 0 : 3);
  }

  useEffect( () => {
    get_restaurant_menu(food_type);
    const unsubscribe = navigation.addListener('focus', async () => {
      
    });
    return unsubscribe;
  },[]);

  const handleBackButtonClick= () => {
    navigation.goBack()
  }

  const onStarRatingPress = (rating) => {
    setStarCount(rating);
  }

  const get_restaurant_menu = async (food_type) => {
    console.log(api_url + restaurant_menu)
    console.log({restaurant_id:restaurant_id, food_type:food_type, customer_id:global.id, lat:props.current_lat, lng:props.current_lng})
    setLoading(true);
    await axios({
      method: 'post', 
      url: api_url + restaurant_menu,
      data:{restaurant_id:restaurant_id, food_type:food_type, customer_id:global.id, lat:props.current_lat, lng:props.current_lng}
    })
    .then(async response => {
      await setLoading(false);
      await setCategories(response.data.result.categories);
      await setRestaurantDetails(response.data.result.restaurant)
      await setDistance(response.data.result.distance)
      await check_favourite(response.data.result.restaurant.is_favourite)
      await setApiResponse(1);
      await getEta(response.data.result.max_time,response.data.result.distance,response.data.result.restaurant.lat,response.data.result.restaurant.lng);
      await calculate_delivery_charge(response.data.result.distance);
      await SetPromo(response.data.result.promo);
      await setCount(response.data.result.categories.length);
    })
    .catch(error => {
      setLoading(false);
      alert(error)
    });
  }

  const check_vendor = async() =>{
    if(props.restaurant_id == restaurant_id || props.restaurant_id == undefined){
      setViewValue(true);
      return true;
    }else{
      setViewValue(false);
      Alert.alert(
        "Reset !",
        "You are select another restaurants menus. Can we remove existing items from cart?",
        [
          {
            text: "Cancel",
            onPress: () => { return false; },
            style: "cancel"
          },
          { text: "OK", onPress: async() => { 
            await props.reset();
            props.updateRestaurantId(restaurant_id);
            this.setState({ view_value : false });
            alert('Now you can add products');
            return true;
          } }
        ],
        { cancelable: false }
      );
      
    }
  }

  const update_favourite = async () => {
    setLoading(true);
    await axios({
      method: 'post', 
      url: api_url + update_favourite_restaurant,
      data:{ customer_id:global.id, restaurant_id:restaurant_id }
    })
    .then(async response => {
      await setLoading(false);
    })
    .catch(error => {
      setLoading(false);
      alert('Sorry something went wrong Menus')
    });
  }

  const add_to_cart = async (qty,item_id,item_name,price) => {
    if(check_vendor()){
      let cart_items = await props.cart_items;
      let old_item_details = await cart_items[item_id];
      let sub_total = await parseFloat(props.sub_total);
      let total_price = await parseFloat(qty * price);
      if(old_item_details != undefined && total_price > 0){
        let final_price = await parseFloat(total_price) - parseFloat(old_item_details.total);
        sub_total = await parseFloat(sub_total) + parseFloat(final_price);
      }else if(total_price > 0){
        let final_price = await parseFloat(qty * price);
        sub_total = await parseFloat(sub_total) + parseFloat(final_price);
      }
      if(qty > 0){
        let item = await {
          item_id: item_id,
          item_name: item_name,
          quantity: qty,
          price_per_item: parseFloat(price),
          total:parseFloat(qty * price)
        }
        cart_items[item_id] = await item;
        await props.addToCart(cart_items);
        await props.updateSubtotal(sub_total.toFixed(2));
        await props.updateRestaurantId(restaurant_id);
       }else{
          delete cart_items[item_id];
          sub_total = parseFloat(sub_total) - parseFloat(price);
          await props.addToCart(cart_items);
          await props.updateSubtotal(sub_total);
       }   
    }
    
  }

const view_cart = async() =>{
  navigation.navigate("Cart", {restaurant_details:restaurant_details})
}

const search_menu = async() =>{
  navigation.navigate("SearchMenu",{ restaurant_id : restaurant_id})
}

const calculate_delivery_charge = async(distance) =>{
  let d_charge = await parseInt(distance) * parseInt(global.delivery_charge_per_km);
  if(d_charge == 0){
    props.updateDeliveryCharge(global.delivery_charge_per_km);
  }else{
    props.updateDeliveryCharge(d_charge);
  }
}

const getEta = async(max_time,dis,lat,lng) => {
   
   try {
       let resp = await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${ props.current_lat+","+props.current_lng }&destination=${ lat+","+lng }&mode=${'driving'}&key=${GOOGLE_KEY}`)
       let respJson = await resp.json();
       if(respJson.routes[0].legs[0].duration.text){
        let time = await respJson.routes[0].legs[0].duration.text;
        time = await time.split(" ")[0];
        var eta = await parseInt(max_time) + parseInt(time);
        await setEta(eta);
       }
   } catch(error) {
      alert('Sorry something went wrong Menus 2')
      console.log(error);
   }
}

const renderItem = ({ item }) => (

  <View style={{ flexDirection:'row',padding:10}}>
    <View style={{ width:'70%',justifyContent:'center', alignItems:'flex-start'}}>
      <View style={{ width:'50%',flexDirection:'row'}}>
        <Image style={{ height: 15, width: 15 }} source={{ uri : img_url+item.icon}} />
        <View style={{ margin:2}}/>
        <Text style={{borderWidth:0.5, padding:3, paddingRight:10,paddingLeft:10, fontFamily:regular, fontSize:8, color:colors.theme_fg_three,backgroundColor:colors.theme_fg, borderColor:colors.red, borderRadius:5}}>{item.tag_name}</Text> 
      </View>
      <View style={{ margin:2}}/>
      <Text style={{ fontFamily:bold, fontSize:14, color:colors.theme_fg_two,letterSpacing:1}}>{item.item_name}</Text>
      <View style={{ margin:3}}/>
      <Text style={{ fontFamily:regular, fontSize:12, color:colors.theme_fg_two}}>{global.currency}{item.base_price}</Text>
      <View style={{ margin:3}}/>
      <Text numberOfLines={3} style={{ fontFamily:regular, fontSize:10, color:colors.grey,letterSpacing:1}}>{item.item_description}</Text>
      {/*<View style={{ padding:10}}>
         <View style={{ flexDirection:'row', borderWidth:0.5,width:'40%',height:18,borderRadius:5, borderColor:colors.theme_fg_yellow , right:10, backgroundColor:colors.light_yellow}}>
        <View style={{ width:'70%', alignItems:'center', justifyContent:'center'}}>
           <StarRating
              disabled={false}
              maxStars={5}
              starSize={10}
              emptyStarColor={}
              rating={star_count}
              selectedStar={(rating) => onStarRatingPress(rating)}
            />
          </View>
          <View style={{ width:'30%', alignItems:'flex-start', justifyContent:'center'}}> 
            <Text style={{ fontFamily:regular, fontSize:10, color:colors.theme_fg_two}}>339</Text>
          </View> 
        </View> 
      </View> */}
    </View> 
    <View style={{ width:'30%', alignItems:'center', justifyContent:'center'}}>
      <View style={{ height:80, width:100}}>
        <Image style={{ height: undefined, width:undefined, flex:1, borderRadius:10 }} source={{uri: img_url+item.item_image}} />
      </View>
      <View style={{ margin:2}}/>
      {item.in_stock != 0 ?
      <View>
        <UIStepper
          onValueChange={(value) => { add_to_cart(value,item.id,item.item_name,item.base_price) }}
          displayValue={view_value}
          initialValue={props.cart_items[item.id] ? props.cart_items[item.id].quantity : 0 }
          value={props.cart_items[item.id] ? props.cart_items[item.id].quantity : 0 }
          borderColor={colors.theme_fg}
          textColor={colors.theme_fg}
          tintColor={colors.theme_fg}
        />
      </View>
      :
      <View>
        <Text>Out of stock</Text>
      </View>
      }
      <View style={{ margin:2}}/>
    </View>
  </View>
);

const renderCategory = ({ item }) => (
  <View>
    <View style={{ flexDirection:'row' ,padding:10}}>
      <View style={{width:'100%', alignItems:'flex-start',}}>
        <Text style={{ fontFamily:bold, fontSize:14, color:colors.theme_fg_two,}}>{item.category_name}</Text>  
      </View> 
      {/*<View style={{width:'10%',alignItems:'flex-end',justifyContent:'center'}}> 
        <Icon type={Icons.Ionicons} name="caret-up-outline" color={colors.theme_bg_two} style={{ fontSize:16 }} />
      </View> */}
    </View>
    <FlatList
      data={item.data}
      renderItem={renderItem}
      keyExtractor={item => item.id}
    />
  </View>
);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={colors.theme_bg} />
      {api_response == 1 &&
      <ScrollView showsVerticalScrollIndicator={false}>
      <Loader visible={loading} />
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBackButtonClick} style={{ width:'80%',justifyContent:'center', alignItems:'flex-start' }}>
            <Icon type={Icons.Ionicons} name="chevron-back-circle-outline" color={colors.theme_fg_two} style={{ fontSize:35 }} />
          </TouchableOpacity>
          {global.id != 0 &&
            <TouchableOpacity onPress={add_favourite} style={{ width:'20%',justifyContent:'center', alignItems:'flex-end' }}>
              <Icon type={Icons.Ionicons} name={favourite_icon} color={colors.theme_fg} style={{ fontSize:25 }} />  
            </TouchableOpacity>
          }
          {/*<View style={{ width:'10%',justifyContent:'center', alignItems:'flex-end' }}>
            <Icon type={Icons.Ionicons} name="arrow-redo-outline" color={colors.theme_fg_two} style={{ fontSize:25 }} />
          </View>*/}
        </View>
        <View style={{ flexDirection:'row',padding:10}}>
          <View style={{ width:'70%',justifyContent:'flex-start', alignItems:'flex-start'}}>
            <Text style={{ fontFamily:bold, fontSize:20, color:colors.theme_fg_two,}}>{restaurant_details.restaurant_name}</Text> 
            <View style={{ margin:2}}/>
            <Text style={{ fontFamily:regular, fontSize:13, color:colors.theme_fg_two,}}>{restaurant_details.cuisines}</Text>
            <View style={{ margin:2,}}/>
            <Text style={{ fontFamily:regular, fontSize:12, color:colors.grey,}}>{restaurant_details.manual_address}</Text>
          </View> 
          {restaurant_details.overall_rating != 0 &&
            <View style={{ width:'30%',justifyContent:'flex-start', alignItems:'flex-end'}}>
              <View style={{ height:70, width:60, borderWidth:0.5, borderRadius:10, borderColor:colors.light_grey}}>
                <View style={{ flexDirection:'row', height:'50%', backgroundColor:colors.green,alignItems:'center', justifyContent:'center', borderTopLeftRadius:10, borderTopRightRadius:10}}>
                  <Text style={{ fontFamily:bold, fontSize:14, color:colors.theme_fg_three,}}>{restaurant_details.overall_rating}</Text>
                  <View style={{ margin:1,}}/>
                  <Image style={{ height: 10, width: 10 }} source={star} />
                </View> 
                <View style={{ height:'50%', backgroundColor:colors.theme_fg_three, alignItems:'center', justifyContent:'center', borderBottomLeftRadius:10, borderBottomRightRadius:10}}>
                  <Text style={{ fontFamily:regular, fontSize:10, color:colors.theme_fg_two,}}>{restaurant_details.number_of_rating}</Text>
                  <Text style={{ fontFamily:regular, fontSize:10, color:colors.grey,}}>Reviews</Text>
                </View> 
              </View>  
            </View>
          }
        </View>
        {eta > 0 &&
        <View style={{ padding:10 }}>
          <View style={{ height:25, width:'35%', borderWidth:0.5, borderRadius:5, borderColor:colors.light_grey, backgroundColor:colors.light_grey, justifyContent:'center', }}>
            <View style={{ flexDirection:'row', alignItems:'center', padding:5 }} >
              <Image style={{ height: 14, width: 14 }} source={time} />
              <View style={{ margin:3 }} />
              <Text style={{ fontFamily:regular, fontSize:11, color:colors.theme_fg_two,}}>{eta} mins delivery</Text>
            </View>
          </View>
        </View>
        }
        <View style={{ margin:5 }} />
        <ScrollView  horizontal={true} showsHorizontalScrollIndicator={false}>
        {promo.map((item) => {
          return (
              <View style={{ height:45, width:150, borderWidth:1.5, borderRadius:10, borderColor:colors.light_grey, flexDirection:'row', marginRight:10, marginLeft:10}}>
                <View style={{ width:'20%',justifyContent:'center', alignItems:'center',}}>
                  <Image style={{ height: 20, width: 20 }} source={discount} />
                </View>
                <View style={{ width:'80%',justifyContent:'center', alignItems:'flex-start', }}>
                  <Text style={{ fontFamily:bold, fontSize:11, color:colors.theme_fg_two,}}>{item.promo_name} to {global.currency}{item.discount}</Text>
                  <Text style={{ fontFamily:regular, fontSize:10, color:colors.theme_fg_two,}}>use code {item.promo_code}</Text>
                </View>
              </View>
          );
        })}
        </ScrollView>
        {/*<View style={{ margin:5 }} />
        <View style={{ width:'100%', height:40,borderWidth:0.5, borderColor:colors.light_grey, flexDirection:'row', padding:10, backgroundColor:colors.light_grey}}>
          <View style={{ width:'30%', justifyContent:'center', alignItems:'flex-start'}}>
            <Text style={{ fontFamily:bold, fontSize:14, color:colors.red,}}>Recommended</Text>
          </View>
          <View style={{ width:'30%',justifyContent:'center', alignItems:'center'}}>    
            <Text style={{ fontFamily:bold, fontSize:14, color:colors.grey}}>Soups</Text>  
          </View> 
          <View style={{ width:'40%',justifyContent:'center', alignItems:'flex-start'}}>    
            <Text style={{ fontFamily:bold, fontSize:14, color:colors.grey}}>Starters/Appetizers</Text>  
          </View>  
        </View>*/}
        <View style={{ margin:5 }} />
        <View style={{ padding:10, alignItems:'center'}}>
          <View style={{borderWidth:2,width:'100%', fontFamily:regular, fontSize:8, borderColor:colors.light_grey, borderRadius:10, padding:5}}>  
            <TouchableOpacity onPress={search_menu} activeOpacity={1} style={{ flexDirection:'row', justifyContent:'center', }}>
              <View style={{ width:'15%',alignItems:'center'}}>
                <Icon type={Icons.Ionicons} name="search-outline" color={colors.grey} style={{ fontSize:25 }} />
              </View>
              <View style={{ width:'85%',alignItems:'flex-start', justifyContent:'center'}}>
                <Text style={{ fontSize:12, color:colors.grey, fontFamily:regular, letterSpacing:1 }}>Search within the menu...</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ flexDirection:'row'}}>
          <View style={{ width:'32%', alignItems:'center', justifyContent:'center'}}>
            <Switch
              trackColor={{ false: colors.grey, true: colors.green }}
              thumbColor={veg_type ? colors.green : colors.light_grey}
              ios_backgroundColor="#3e3e3e"
              onValueChange={changeVegType}
              value={veg_type}
              height={17}
            />
            <Text style={{ fontSize:14, color:colors.grey, fontFamily:regular, marginTop:5}}>Veg</Text>
          </View>
          <View style={{ margin:'2%' }} />
          <View style={{ width:'32%', alignItems:'center', justifyContent:'center'}}>
            <Switch
              trackColor={{ false: colors.grey, true: colors.theme_fg }}
              thumbColor={non_veg_type ? colors.theme_fg : colors.light_grey}
              ios_backgroundColor="#3e3e3e"
              onValueChange={changeNonVegType}
              value={non_veg_type}
              height={17}
            />
            <Text style={{ fontSize:14, color:colors.grey, fontFamily:regular, marginTop:5}}>Non Veg</Text>
          </View>
          <View style={{ margin:'2%' }} />
          <View style={{ width:'32%', alignItems:'center', justifyContent:'center'}}>
            <Switch
              trackColor={{ false: colors.grey, true: colors.orange }}
              thumbColor={egg_type ? colors.orange : colors.light_grey}
              ios_backgroundColor="#3e3e3e"
              onValueChange={changeEggType}
              value={egg_type}
              height={17}
            />
            <Text style={{ fontSize:14, color:colors.grey, fontFamily:regular, marginTop:5}}>Egg</Text>
          </View>
        </View>
          <View style={{ margin:5 }} />
          {count == 0 ?
            <View style={{flex:1}}>
              <View style={{ height:250 }}>
                <LottieView source={empty_menu_lottie} autoPlay loop />
              </View>
              <Text style={{ alignSelf:'center', fontFamily:bold, fontSize:14, color:colors.grey}}>No Menus found.</Text>
            </View>
          :
            <FlatList
              data={categories}
              renderItem={renderCategory}
              keyExtractor={item => item.id}
            />
          }
          <View style={{ margin:20 }} />
      </ScrollView>
      }
      {props.cart_count > 0 &&
      <View style={{ left:0, right:0, bottom:10,alignItems:'center', height:50, position:'absolute', justifyContent:'center'}}>  
        <View style={{ width:'100%', height:60, justifyContent:'center'}}>
          <TouchableOpacity onPress={view_cart} style={styles.button}>
            <View style={{ width:'50%', alignItems:'flex-start', justifyContent:'center', flexDirection:'row'}}>
              <Text style={{ fontSize:14, fontFamily:regular, color:colors.theme_fg_three}}>{global.currency}{props.sub_total}</Text>
              <View style={{ margin:4 }} />
              <Text style={{ fontSize:12, fontFamily:regular, color:colors.theme_fg_three}}>plus taxes</Text>
            </View>
            <View style={{ width:'50%', alignItems:'flex-end', justifyContent:'center', paddingRight:20}}>
              <Text style={{ color:colors.theme_fg_three, fontFamily:bold, fontSize:14}}>View Cart</Text>
            </View>
            
          </TouchableOpacity>
        </View>
      </View>
      }
      <View style={{ margin:5 }} />
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
    padding:10
  },
  button: {
    padding:10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:colors.theme_bg,
    width:'94%',
    marginLeft:'3%',
    marginRight:'3%',
    flexDirection:'row',
    height:45
  },
});

function mapStateToProps(state){
  return{
    cart_items : state.order.cart_items,
    cart_count : state.order.cart_count,
    sub_total : state.order.sub_total,
    restaurant_id : state.order.restaurant_id,
    delivery_charge : state.order.delivery_charge,
    current_lat : state.current_location.current_lat,
    current_lng : state.current_location.current_lng,
  };
}

const mapDispatchToProps = (dispatch) => ({
  addToCart: (data) => dispatch(addToCart(data)),
  updateSubtotal: (data) => dispatch(updateSubtotal(data)),
  updateRestaurantId: (data) => dispatch(updateRestaurantId(data)),
  updateDeliveryCharge: (data) => dispatch(updateDeliveryCharge(data)),
  reset: () => dispatch(reset()),
});

export default connect(mapStateToProps,mapDispatchToProps)(Menu);
