import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, SafeAreaView, ScrollView, TouchableOpacity, Image, FlatList, StatusBar } from 'react-native';
import Icon, { Icons } from '../components/Icons';
import * as colors from '../assets/css/Colors';
import { app_name, light, regular, bold, home_banner, address_lottie, customer_get_address, api_url, img_url, home_restaurant_list } from '../config/Constants';
import LottieView from 'lottie-react-native';
import { useNavigation } from '@react-navigation/native';
import { connect } from 'react-redux'; 
import { updateCurrentAddress, updateCurrentLat, updateCurrentLng, currentTag  } from '../actions/CurrentAddressActions';
import { Loader } from '../components/Loader';
import axios from 'axios';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import { updateAddress, updateRestaurants } from '../actions/OrderActions';
const SelectCurrentLocation = (props) => {
  console.log("SelectCurrentLocation");
  const navigation = useNavigation();
  const [address_value, setAddressValue] = useState([]); 
  const [loading, setLoading] = useState('false');

  const handleBackButtonClick= () => {
    navigation.goBack()
  } 

  const current_location = async(id) => {
    if (Platform.OS === "android"){
      RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({interval: 10000, fastInterval: 5000})
        .then(data => {
          navigation.navigate("CurrentLocation")
        }).catch(err => {
        
      });
    }else{
      navigation.navigate("CurrentLocation")
    }
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      await get_address();
    });
    return unsubscribe;
  },[]);

  const get_address = async () => {
    setLoading(true);
    await axios({
      method: 'post', 
      url: api_url + customer_get_address,
      data:{ customer_id: global.id }
    })
    .then(async response => {
      setLoading(false);
      setAddressValue(response.data.result);
    })
    .catch(error => {
      setLoading(false);
      alert('Sorry something went wrong selectCurrentLocation')
    });
  }

  const get_restaurant_list = async (lat,lng) => {
    setLoading(true);
    await axios({
      method: 'post', 
      url: api_url + home_restaurant_list,
      data:{ customer_id : global.id, lat:lat, lng:lng }
    })
    .then(async response => {
      await setLoading(false);
      await props.updateRestaurants(response.data.result);
      await home();
    })
    .catch(error => {
      setLoading(false);
      alert('Sorry something went wrong selectCurrentLocation 2');
    });
  }

  const set_current_address = async(data) =>{
    await props.updateCurrentAddress(data.address);
    await props.updateCurrentLat(data.lat);
    await props.updateCurrentLng(data.lng);
    await props.currentTag(data.type_name);
    await props.updateAddress(data);
    await get_restaurant_list(data.lat,data.lng);
  }

  const home= () => {
    navigation.navigate("Home") 
  }
  
  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={set_current_address.bind(this,item)} style={{ flexDirection:'row',borderBottomWidth:1, borderColor:colors.light_grey, paddingTop:15, paddingBottom:15}}>
      <View style={{ width:'10%',justifyContent:'flex-start', alignItems:'flex-start'}}>
        <View style={{ width: 25, height:25 }}>
          <Image style= {{ height: undefined,width: undefined,flex: 1,borderRadius:10 }} source={{ uri: img_url + item.icon }} />
        </View> 
      </View>   
      <View style={{ width:'90%', justifyContent:'center', alignItems:'flex-start'}}>
          <Text style={{ fontFamily:regular, fontSize:16, color:colors.theme_fg_two}}>{item.type_name}</Text>
          <View style={{ margin:2 }} />
          <Text style={{ fontFamily:regular, fontSize:10, color:colors.grey}}>{item.address}</Text>   
      </View> 
    </TouchableOpacity>
  );
return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={colors.theme_bg}/>
      <ScrollView showsVerticalScrollIndicator={false} style={{padding: 10}}>
      <Loader visible={loading} />
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBackButtonClick} style={{ width:'15%',justifyContent:'center', alignItems:'flex-start' }}>
            <Icon type={Icons.Ionicons} name="chevron-back-circle-outline" color={colors.theme_fg_two} style={{ fontSize:35 }} />
          </TouchableOpacity>
          <View style={{ justifyContent:'center', alignItems:'flex-start' }}>
            <Text style={{ color:colors.theme_fg_two, fontFamily:bold, fontSize:20 }}>Pick your location</Text>
          </View>
        </View>
        <View style={{ margin:10 }} />
        <TouchableOpacity onPress={current_location} style={{ flexDirection:'row'}}>
          <View style={{ width:'10%',justifyContent:'flex-start', alignItems:'flex-start' }}>
            <Icon type={Icons.Ionicons} name="compass" color={colors.red} style={{ fontSize:25 }} />
          </View>  
          <View style={{ width:'85%', justifyContent:'center', alignItems:'flex-start'}}>
            <Text style={{ fontFamily:bold, fontSize:16, color:colors.red}}>Use current location </Text>
            <View style={{ margin:2 }} />
            <Text numberOfLines={1} style={{ fontFamily:regular, fontSize:10, color:colors.grey}}>{props.current_address}</Text>   
          </View>
          <View style={{ width:'5%',justifyContent:'center', alignItems:'flex-end' }}>
           <Icon type={Icons.Ionicons} name="chevron-forward-outline" color={colors.regular_grey} style={{ fontSize:20 }} />
          </View>
        </TouchableOpacity>
        <View style={{ margin:10 }} />
        <Text style={{ color:colors.theme_fg_two, fontFamily:bold, fontSize:16 }}>Saved Addresses</Text>
        {global.id != 0 &&
          <FlatList
            data={address_value}
            renderItem={renderItem}
            keyExtractor={item => item.id}
          />
        }
      </ScrollView>
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

function mapStateToProps(state){
  return{
    current_address : state.current_location.current_address,
    current_lat : state.current_location.current_lat,
    current_lng : state.current_location.current_lng,
    current_tag : state.current_location.current_tag,
    address : state.order.address,
  };
}

const mapDispatchToProps = (dispatch) => ({
  updateCurrentAddress: (data) => dispatch(updateCurrentAddress(data)),
  updateCurrentLat: (data) => dispatch(updateCurrentLat(data)),
  updateCurrentLng: (data) => dispatch(updateCurrentLng(data)),
  currentTag: (data) => dispatch(currentTag(data)),
  updateAddress: (data) => dispatch(updateAddress(data)),
  updateRestaurants: (data) => dispatch(updateRestaurants(data)),

});

export default connect(mapStateToProps,mapDispatchToProps)(SelectCurrentLocation);

