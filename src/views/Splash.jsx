import React, { useState, useEffect } from 'react';
import { StyleSheet, View,  Image, Platform, PermissionsAndroid, StatusBar } from 'react-native';
import * as colors from '../assets/css/Colors';
import { logo_with_name, api_url, settings, GOOGLE_KEY, get_taxes} from '../config/Constants';
import { useNavigation, CommonActions } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import PushNotification, {Importance} from "react-native-push-notification";
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import Geolocation from '@react-native-community/geolocation';
import { connect } from 'react-redux'; 
import { updateCurrentAddress, updateCurrentLat, updateCurrentLng, currentTag, updateProfilePicture  } from '../actions/CurrentAddressActions';
import { updateTaxList  } from '../actions/OrderActions';

const Splash = (props) => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState('false');

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      await tax_list();
      await app_settings();
    });
    return unsubscribe;
    
  },[]);

  const app_settings = async() => {
    axios({
    method: 'get', 
    url: api_url + settings,
    })
    .then(async response => {
      await configure();
      await channel_create();
      console.log("app setting ", response.data.result)
      await saveData(response.data.result)
    })
    .catch(error => {
      alert('Sorry something went wrong 1')
    });
  }

  const tax_list = async() => {
    axios({
    method: 'get', 
    url: api_url + get_taxes,
    })
    .then(async response => {
      props.updateTaxList(response.data.result);
    })
    .catch(error => {
      alert('Sorry something went wrong 2')
    });
  }

  const channel_create = () =>{
    PushNotification.createChannel(
    {
        channelId: "taxi_booking", // (required)
        channelName: "Booking", // (required)
        channelDescription: "Taxi Booking Solution", // (optional) default: undefined.
        playSound: true, // (optional) default: true
        soundName: "uber.mp3", // (optional) See `soundName` parameter of `localNotification` function
        importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
        vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
      },
      (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
    );
  }

  const configure = () =>{
    if(Platform.OS == "android"){
      PushNotification.configure({
        // (optional) Called when Token is generated (iOS and Android)
        onRegister: function (token) {
          console.log("TOKEN:", token.token);
          global.fcm_token = token.token;
        },

        // (required) Called when a remote is received or opened, or local notification is opened
        onNotification: function (notification) {
          console.log("NOTIFICATION:", notification);

          // process the notification

          // (required) Called when a remote is received or opened, or local notification is opened
          notification.finish(PushNotificationIOS.FetchResult.NoData);
        },

        // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
        onAction: function (notification) {
          console.log("ACTION:", notification.action);
          console.log("NOTIFICATION:", notification);

          // process the action
        },

        // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
        onRegistrationError: function(err) {
          console.error(err.message, err);
        },

        // IOS ONLY (optional): default: all - Permissions to register.
        permissions: {
          alert: true,
          badge: true,
          sound: true,
        },

        // Should the initial notification be popped automatically
        // default: true
        popInitialNotification: true,

        /**
         * (optional) default: true
         * - Specified if permissions (ios) and token (android and ios) will requested or not,
         * - if not, you must call PushNotificationsHandler.requestPermissions() later
         * - if you are not using remote notification or do not have Firebase installed, use this:
         *     requestPermissions: Platform.OS === 'ios'
         */
        requestPermissions: true,
      });
    }else{
      global.fcm_token = "IOS";
    }
    
  }

  const saveData = async(data) =>{
    const id = await AsyncStorage.getItem('id');
    const customer_name = await AsyncStorage.getItem('customer_name');
    const phone_number = await AsyncStorage.getItem('phone_number');
    const phone_with_code = await AsyncStorage.getItem('phone_with_code');
    const profile_picture = await AsyncStorage.getItem('profile_picture');
    const existing = await AsyncStorage.getItem('existing');
    global.existing = await existing;
    global.app_name = await data.app_name;
    global.currency = await data.default_currency;
    global.currency_short_code = await data.currency_short_code; 
    global.delivery_charge_per_km = await data.delivery_charge_per_km;
    global.razorpay_key = await data.razorpay_key;
    global.mode = await data.mode;
    if(id !== null){
      global.id = await id;
      global.customer_name = await customer_name;
      global.phone_number = await phone_number;
      global.phone_with_code = await phone_with_code;
      await props.updateProfilePicture(profile_picture);
      await check_location();
     }else{
      global.id = 0;
      check_location();
     }
  }

  const check_location = async() =>{

    if(Platform.OS === "android"){

       RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({interval: 10000, fastInterval: 5000})
      .then(async data => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,{
                    'title': 'Location Access Required',
                    'message': global.app_name+' needs to Access your location for show nearest restaurant'
                }
            )

            console.log("granted", PermissionsAndroid.RESULTS.GRANTED)
            //const granted = await PermissionsAndroid.check( PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION );

            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
              await getInitialLocation();
            } else {
              alert('Sorry unable to fetch your location');
            }
        } catch (err) {
            navigation.navigate('LocationEnable');
        }
      }).catch(err => {
          navigation.navigate('LocationEnable');
      });
    }else{
      await getInitialLocation();
    }
  }

  const getInitialLocation = async() =>{
    await Geolocation.getCurrentPosition( async(position) => {
      onRegionChange(position.coords);
    }, error => navigation.navigate('LocationEnable'), 
    {enableHighAccuracy: false, timeout: 10000 });
  }

  const onRegionChange = async(value) => {
    //props.addCurrentAddress('Please wait...')
    fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + value.latitude + ',' + value.longitude + '&key=' + GOOGLE_KEY)
        .then((response) => response.json())
        .then(async(responseJson) => {
          console.log(responseJson);
           if(responseJson.results[0].formatted_address != undefined){
            let address = await responseJson.results[0].formatted_address;
            console.log("address", address)
              await props.updateCurrentAddress('Jaipur, Rajasthan, India');
              await props.updateCurrentLat(value.latitude);
              await props.updateCurrentLng(value.longitude);
              await props.currentTag('Live');
              
              navigate_app(); 
           }else{
            alert('Sorry something went wrong 3')
           }
    }) 
  }

  const navigate_app = async() => {
    if(global.existing == 1){
      if(global.id !=''){
        navigation.dispatch(
          CommonActions.reset({
              index: 0,
              routes: [{ name: "Home" }],
          })
        );
      }else{
      navigation.dispatch(
          CommonActions.reset({
              index: 0,
              routes: [{ name: "Phone" }],
          })
        );
      }
    }else{
      navigation.dispatch(
        CommonActions.reset({
            index: 0,
            routes: [{ name: "Intro" }],
        })
      );
    }
  }

return (
  <View style={{justifyContent:'center', alignItems:'center', flex:1}}>
    <StatusBar backgroundColor={colors.theme_bg}/>
    <View style={styles.logo} >
      <Image style= {{ height: undefined,width: undefined,flex: 1 }} source={logo_with_name} />
    </View>
  </View>
  )
}

const styles = StyleSheet.create({
 image_style: {
    height:'100%',
    width:'100%',
    alignItems: 'center',
    justifyContent:'center',
    flex: 1,
    marginLeft:5
  },
  logo:{
      height:210, 
      width:200,
      
  },
   
});

function mapStateToProps(state){
  return{
    current_address : state.current_location.current_address,
    current_lat : state.current_location.current_lat,
    current_lng : state.current_location.current_lng,
    current_tag : state.current_location.current_tag,
    profile_picture : state.current_location.profile_picture,

  };
}

const mapDispatchToProps = (dispatch) => ({
  updateCurrentAddress: (data) => dispatch(updateCurrentAddress(data)),
  updateCurrentLat: (data) => dispatch(updateCurrentLat(data)),
  updateCurrentLng: (data) => dispatch(updateCurrentLng(data)),
  currentTag: (data) => dispatch(currentTag(data)),
  updateTaxList: (data) => dispatch(updateTaxList(data)),
  updateProfilePicture: (data) => dispatch(updateProfilePicture(data)),
});

export default connect(mapStateToProps,mapDispatchToProps)(Splash);
