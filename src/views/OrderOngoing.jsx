import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, SafeAreaView, ScrollView, TouchableOpacity, Image, FlatList, Linking, Platform, StatusBar } from 'react-native';
import Icon, { Icons } from '../components/Icons';
import * as colors from '../assets/css/Colors';
import { app_name, light, regular, bold, home_banner, delivery_man, address, chat, customer_service, non_veg, veg, cutlery, cook, phone, profile, order_detail, api_url, img_url, cancel_order, cancel, LATITUDE_DELTA, LONGITUDE_DELTA } from '../config/Constants';
import { useNavigation, useRoute } from '@react-navigation/native';
import Moment from 'moment';
import axios from 'axios';
import { Loader } from '../components/Loader';
import Dialog from "react-native-dialog";
import database from '@react-native-firebase/database';
import MapView, { PROVIDER_GOOGLE, AnimatedRegion, Marker } from 'react-native-maps';
import { connect } from 'react-redux';

const OrderOngoing = (props) => {
  
 const navigation = useNavigation();
  const route = useRoute();
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const [order_details, setOrderDetails] = useState("");
  const [id, setID] = useState(route.params.id);
  const [loading, setLoading] = useState(false);
  const [order_items, setOrderItems] = useState([]);
  const [visible, setVisible] = useState(false);
  const [home_marker, setHomeMarker] = useState({ latitude:0, longitude:0 });
  const [restaurant_marker, setRestaurantMarker] = useState({ latitude:0, longitude:0 });
  const [marker, setMarker] = useState({ latitude:0, longitude:0 });
  const [coordinate, setCoordinate] = useState(new AnimatedRegion({ latitude: props.current_lat, longitude: props.current_lng }));
  const [bearing, setBearing] = useState(0);
  const [open_status, setOpenStatus] = useState(0);
  const [allowed_statuses, setAllowedStatuses] = useState([ "order_placed","restaurant_approved","ready_to_dispatch","reached_restaurant","order_picked","at_point" ]);

  const handleBackButtonClick= () => {
    navigation.goBack()
  }  

  useEffect( () => {
    const onValueChange = database()
    .ref(`/orders/${id}`)
    .on('value', snapshot => {
      get_order_detail();
    });
    return () => database().ref(`/orders/${id}`).off('value', onValueChange);
  },[]); 

  const partner_location_sync = (partner_id) =>{
    if(partner_id != 0){
      const onValueChange = database()
      .ref(`/delivery_partners/${partner_id}`)
      .on('value', snapshot => {
        if(snapshot.val().lat && snapshot.val().lng){
            animate({ latitude:parseFloat(snapshot.val().lat), longitude:parseFloat(snapshot.val().lng)});
            setBearing(snapshot.val().bearing);
        }
      });
    }
  }

  const animate = (nextProps) =>{
    const duration = 500

    if (marker !== nextProps) {
      if (Platform.OS === 'android') {
        if(markerRef) {
          markerRef.current.animateMarkerToCoordinate(
            nextProps,
            duration
          );
        }
      } else {
        coordinate.timing({
          ...nextProps,
          duration
        }).start();
      }
    }
  }

  const get_order_detail = async () => {
    setLoading(true);
    await axios({
      method: 'post', 
      url: api_url + order_detail,
      data:{order_id:id}
    })
    .then(async response => {
      await setLoading(false);
      await setOrderDetails(response.data.result);
      await setHomeMarker({ latitude: parseFloat(response.data.result.cus_lat), longitude: parseFloat(response.data.result.cus_lng)});
      await setRestaurantMarker({ latitude: parseFloat(response.data.result.res_lat), longitude: parseFloat(response.data.result.res_lng)});
      await setOrderItems(response.data.result.item_list);
      await setOpenStatus(1);
      await partner_location_sync(response.data.result.delivered_by);
    })
    .catch(error => {
      setLoading(false);
      alert("Sorry something went wrong Order")
    });
  }

  const help = () =>{
    navigation.navigate("FaqCategories")
  }

  const call = async(number) =>{
    let phoneNumber = '';
    if (Platform.OS === 'android'){ 
      phoneNumber = await `tel:${number}`; 
    }else{
      phoneNumber = await `telprompt:${number}`; 
    }
    await Linking.openURL(phoneNumber);
  }

  const order_cancellation = async () => {
    setLoading(true);
    await axios({
      method: 'post', 
      url: api_url + cancel_order,
      data:{order_id:id}
    })
    .then(async response => {
      await setLoading(false);
      handleBackButtonClick();
    })
    .catch(error => {
      setLoading(false);
      alert("Sorry something went wrong Order 1")
    });
  }

  const showDialog = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const handleLogout = () => {
    setVisible(false);
    order_cancellation();
  };

  return (
  <View style={styles.container}>  
  <StatusBar backgroundColor={colors.theme_bg}/>
    <View style={{ width:'100%', backgroundColor:colors.theme_bg}}>
      <View style={{ margin:10 }} />
      <View style={{ flexDirection:'row', padding:20 }}>
        <TouchableOpacity onPress={handleBackButtonClick} style={{ width:'10%', justifyContent:'flex-start', alignItems:'center' }}>
          <Icon type={Icons.Ionicons} name="arrow-back" color={colors.theme_fg_three} style={{ fontSize:30 }} />
        </TouchableOpacity>
        <View style={{ width:'80%', justifyContent:'flex-start', alignItems:'center'}}>
          <Text style={{ fontFamily:regular, fontSize:12, color:colors.theme_fg_three}}>ORDER FROM</Text>
          <View style={{ margin:1 }}/>
          <Text style={{ fontFamily:regular, fontSize:12, color:colors.theme_fg_three}}>{order_details.restaurant_name}</Text>
          {order_details.order_type == 1 &&
            <Text style={{ fontFamily:regular, fontSize:12, color:colors.theme_fg_three}}>Selected delivery time - {Moment(order_details.order_date).format('hh:mm A')}</Text>
          }
        </View>
      </View>
      <View style={{ flexDirection:'row', width:'100%', alignItems:'center', justifyContent:'center', paddingLeft:5, paddingRight:5}}>
        <Text style={{ fontFamily:bold, fontSize:14, color:colors.theme_fg_three, letterSpacing:2, paddingLeft:10, paddingRight:10}}>{order_details.status_for_customer}</Text>
      </View>
      <View style={{ margin:5 }}/>
      {/*<View style={{ alignItems:'center', justifyContent:'center' }}>
        <View style={{ flexdirection:'row', borderWidth:1, width:'65%', height:35, backgroundColor:colors.theme_bg_three, opacity: 0.9, borderColor:colors.theme_bg_three, margin:10, borderRadius:5 }}>
          <View style={styles.ridesFriends}>
            <View style={{ width:'30%',flexDirection:'row', justifyContent:'flex-start', alignItems:'center',  }}>
              <Icon type={Icons.Ionicons} name="timer" color={colors.theme_fg_two} style={{ fontSize:13 }} />
              <View style={{ margin:2 }}/>
              <Text style={{ color:colors.theme_fg_two, fontFamily:regular, fontSize:10, letterSpacing:1 }}>On time</Text>
            </View>
            <View style={{ margin:5 }}/>
            <View style={styles.verticleLine} />
            <View style={{ width:'70%', justifyContent:'flex-start', alignItems:'center' }}>
              <Text style={{ color:colors.theme_fg_two, fontFamily:regular, fontSize:10, letterSpacing:1 }}>Arriving in 45 minutes</Text>
            </View>
          </View>
        </View>
      </View>*/}
      </View>
    {open_status == 1 &&
    <ScrollView showsVerticalScrollIndicator={false}>
      <MapView
         provider={PROVIDER_GOOGLE}
         ref={mapRef}
         style={styles.map}
         mapType="terrain"
         initialRegion={{
           latitude: parseFloat(props.current_lat),
           longitude: parseFloat(props.current_lng),
           latitudeDelta: LATITUDE_DELTA,
           longitudeDelta: LONGITUDE_DELTA,
         }}
      >
         <Marker coordinate={home_marker}>
          <Image 
            style= {{flex:1 ,height:30, width:25 }}
            source={require('.././assets/img/customer_location.png')}
          />
          </Marker>

          <Marker coordinate={restaurant_marker}>
            <Image 
              style= {{flex:1 ,height:30, width:25 }}
              source={require('.././assets/img/restaurant_location.png')}
            />
          </Marker>

          {order_details.delivered_by != 0 &&
            <Marker.Animated
                ref={markerRef}
                rotation={bearing}
                coordinate= {Platform.OS === "ios" ? coordinate : marker}
                identifier={'mk1'}
              >
              <Image square style={{ width:40, height:40 }} source={require('.././assets/img/partner_icon.png')} />
            </Marker.Animated>
          }
      </MapView>
      {order_details.delivered_by == 0 ? 
        <View style={{ flexDirection:'row', backgroundColor:colors.theme_bg_three, padding:10, borderBottomWidth:0.5, borderColor:colors.grey}}>
          <View style={{ width:'15%',justifyContent:'center', alignItems:'flex-start' }}>
            <Image style={{ height: 40, width: 40, borderRadius:20 }} source={delivery_man} />
            <View style={{ margin:5 }} />  
          </View>  
          <View style={{ width:'85%', justifyContent:'center', alignItems:'flex-start'}}>
            <Text style={{ fontFamily:bold, fontSize:13, color:colors.theme_fg_two}}>Waiting for delivery partner</Text>
            <View style={{ margin:2 }} />
            <Text style={{ fontFamily:regular, fontSize:11, color:colors.theme_fg_two}}>Please wait, we will assign our partner soon</Text> 
            <View style={{ margin:5 }} />  
          </View>
          
        </View>
      :
        <View style={{ flexDirection:'row', backgroundColor:colors.theme_bg_three, padding:10, borderBottomWidth:0.5, borderColor:colors.grey}}>
          <View style={{ width:'15%',justifyContent:'center', alignItems:'flex-start' }}>
            <Image style={{ height: 40, width: 40, borderRadius:20 }} source={{ uri : img_url+order_details.delivery_boy_image}} />
            <View style={{ margin:5 }} />  
          </View>  
          
          <View style={{ width:'70%', justifyContent:'center', alignItems:'flex-start'}}>
            <Text style={{ fontFamily:bold, fontSize:13, color:colors.theme_fg_two}}>I'm {order_details.delivery_boy_name}, your delivery partner</Text>
            <View style={{ margin:2 }} />
            <Text style={{ fontFamily:regular, fontSize:11, color:colors.theme_fg_two}}>I have completed {order_details.delivery_boy_order_count}+ five-star deliveries</Text> 
            <View style={{ margin:5 }} />  
          </View>
          <TouchableOpacity onPress={call.bind(this,order_details.delivery_boy_phone_number)} style={{ width:'15%',justifyContent:'center', alignItems:'flex-end',  }}>
            <View style={{ borderWidth:1, height: 30, width: 30, borderRadius: 20, alignItems:'center', justifyContent:'center', borderColor:colors.grey   }}>
              <Image style={{ height: 15, width: 15, }} source={phone} /> 
            </View>
          </TouchableOpacity>
      </View>
    }
      <View style={{ padding:10 }}>  
        <Text style={{ fontFamily:regular, fontSize:11, color:colors.theme_fg_two}}>Delivery partner will reach the restaurant before your order is ready for pickup</Text> 
      </View>
      <View style={{ margin:3 }} />  
      <View style={{ borderWidth:5, backgroundColor:colors.light_grey, borderColor:colors.light_grey }}/>
      <View style={{ margin:3 }} />  
      <View style={{ padding:10,}}>
        <View style={{ flexDirection:'row'}}>
          <View style={{ width:'15%',justifyContent:'center', alignItems:'flex-start' }}>
            <Image style={{ height: 40, width: 40 }} source={{ uri: img_url + order_details.restaurant_image}} /> 
          </View>  
          <View style={{ width:'70%', justifyContent:'center', alignItems:'flex-start'}}>
            <Text style={{ fontFamily:bold, fontSize:13, color:colors.theme_fg_two}}>{order_details.restaurant_name} #{order_details.id}</Text>
            <View style={{ margin:2 }} />
            <Text style={{ fontFamily:regular, fontSize:11, color:colors.theme_fg_two}}>{order_details.manual_address}</Text> 
          </View>
          <TouchableOpacity onPress={call.bind(this,order_details.restaurant_phone_number)} style={{ width:'15%',justifyContent:'center', alignItems:'flex-end',  }}>
            <View style={{ borderWidth:1, height: 30, width: 30, borderRadius: 20, alignItems:'center', justifyContent:'center', borderColor:colors.grey   }}>
              <Image style={{ height: 15, width: 15, }} source={phone} /> 
            </View>
          </TouchableOpacity>
        </View>
        <View style={{ margin:10 }} /> 
        {order_items.map((item) => {
          return (
            <View style={{ flexDirection:'row', alignItems:'center', padding:5 }}>
              <Image style={{ height: 15, width: 15}} source={{ uri : img_url+item.icon }} />
              <View style={{ margin:2 }} />
              <Text style={{ fontSize:12, color:colors.grey, fontFamily:bold}}>{item.quantity} x {item.item_name}</Text>
            </View>
          );
        })}
        <View style={{ margin:5 }} />
      </View>
      <View style={{ borderWidth:5, backgroundColor:colors.light_grey, borderColor:colors.light_grey }}/>
      <View style={{ margin:5}} />
      <View style={{ flexDirection:'row', backgroundColor:colors.theme_bg_three, padding:10, borderBottomWidth:0.5, borderColor:colors.grey, }}>
        <View style={{ width:'15%', justifyContent:'flex-start', alignItems:'flex-start'}}>
          <View style={{ borderWidth:1, height: 30, width: 30, borderRadius: 25, alignItems:'center', justifyContent:'flex-start', borderColor:colors.grey   }}>
            <Image style={{ height: 30, width: 30,  }} source={profile} />
            <View style={{ margin:5 }} />  
          </View>  
        </View>  
        <View style={{ width:'85%', justifyContent:'center', alignItems:'flex-start'}}>
          <Text style={{ fontFamily:bold, fontSize:13, color:colors.grey}}>{order_details.customer_name}, {order_details.phone_with_code}</Text>
        </View>
      </View>
      <View style={{ margin:5}} />
      <View style={{ flexDirection:'row', padding:10, }}>
        <View style={{ width:'15%',justifyContent:'center', alignItems:'flex-start' }}>
          <Image style={{ height: 25, width: 25 }} source={address} />
          <View style={{ margin:5 }} />   
        </View>     
        <View style={{ width:'85%', justifyContent:'flex-start', alignItems:'flex-start'}}>
          <Text style={{ fontFamily:bold, fontSize:13, color:colors.theme_fg_two}}>Your address</Text>
          <View style={{ margin:2 }} />
          <Text style={{ fontFamily:regular, fontSize:11, color:colors.theme_fg_two}}>{order_details.address}</Text> 
        </View>
      </View>
      <View style={{ borderWidth:5, backgroundColor:colors.light_grey, borderColor:colors.light_grey }}/>
      <View style={{ margin:5}} />
      <View style={{ flexDirection:'row', backgroundColor:colors.theme_bg_three, padding:10, borderBottomWidth:0.5, borderColor:colors.grey, }}>
        <View style={{ width:'15%',justifyContent:'center', alignItems:'flex-start' }}>
          <Image style={{ height: 25, width: 25 }} source={customer_service} />
          <View style={{ margin:5 }} />   
        </View>  
        <View style={{ width:'85%', justifyContent:'flex-start', alignItems:'flex-start'}}>
          <Text style={{ fontFamily:bold, fontSize:13, color:colors.theme_fg_two}}>Need help with your order?</Text>
          <View style={{ margin:2 }} />
          <Text style={{ fontFamily:regular, fontSize:12, color:colors.grey}}>{app_name} support is always available</Text>
          <View style={{ margin:5 }} />  
        </View>
      </View>
      <View style={{ margin:5}} />
      <TouchableOpacity onPress={help.bind(this)} style={{ flexDirection:'row', backgroundColor:colors.theme_bg_three, padding:10, borderBottomWidth:0.5, borderColor:colors.grey, }}>
        <View style={{ width:'15%',justifyContent:'center', alignItems:'flex-start' }}>
          <Image style={{ height: 25, width: 25 }} source={chat} />
          <View style={{ margin:5 }} />   
        </View>  
        <View style={{ width:'85%', justifyContent:'center', alignItems:'flex-start'}}>
          <Text style={{ fontFamily:bold, fontSize:13, color:colors.theme_fg_two}}>Chat with us</Text>
          <View style={{ margin:5 }} />  
        </View>
      </TouchableOpacity>
      <View style={{ margin:30 }} />
    </ScrollView>
    }
    <Dialog.Container visible={visible}>
      <Dialog.Title>Confirm Cancel Order</Dialog.Title>
      <Dialog.Description>
        Do you want to cancel order?
      </Dialog.Description>
      <Dialog.Button label="Yes" onPress={handleLogout} />
      <Dialog.Button label="No" onPress={handleCancel} />
    </Dialog.Container>

    {allowed_statuses.includes(order_details.slug) &&
    <View style={{ left:0, right:0, bottom:10,alignItems:'center', height:50, position:'absolute', justifyContent:'center'}}>
      <View style={{ width:'100%', height:60, justifyContent:'center'}}>
        <TouchableOpacity onPress={showDialog} style={styles.button}>
          <View style={{ width:'100%', alignItems:'center', justifyContent:'center'}}>
            <Text style={{ color:colors.theme_fg_three, fontFamily:bold, fontSize:14}}>Cancel Order</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
    }
    <Loader visible={loading} />
  </View>
     
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:colors.theme_bg_three,
    justifyContent:'flex-start'
  },
   ridesFriends: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    padding:10
  },
  verticleLine: {
    height: '100%',
    width: 1,
    backgroundColor:colors.theme_fg_two
  },
  map: {
    width:'100%',
    height:300
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
  },
  
});

function mapStateToProps(state){
  return{
    current_lat : state.current_location.current_lat,
    current_lng : state.current_location.current_lng,
  };
}

export default connect(mapStateToProps,null)(OrderOngoing);