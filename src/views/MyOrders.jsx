import React, { useState, useEffect } from 'react';
import { StyleSheet, Image, Button, View, Dimensions, SafeAreaView, Text, Alert, ScrollView, TouchableOpacity, TextInput, FlatList, StatusBar } from 'react-native';
import * as colors from '../assets/css/Colors';
import Icon, { Icons } from '../components/Icons';
import { app_name, light, regular, bold, home_banner, non_veg, veg, empty_lottie, get_orders, api_url, img_url, cancel } from '../config/Constants';
import DropShadow from "react-native-drop-shadow";
import LottieView from 'lottie-react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { Loader } from '../components/Loader';
import Moment from 'moment';

const MyOrders = () => {

  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [order_list, setOrderList] = useState([]);
  const [count, setCount] = useState('');
  const [allowed_statuses, setAllowedStatuses] = useState([ "cancelled_by_customer","cancelled_by_restaurant","cancelled_by_deliveryboy","restaurant_rejected" ]);

  const order_details = (id,slug) => {
    //navigation.navigate("OrderSummery",{id:id});
    if(allowed_statuses.includes(slug) || slug == "delivered"){
      navigation.navigate("OrderSummery",{id:id});
    }else{
      navigation.navigate("OrderOngoing",{id:id});
    }
    
  }

  useEffect( () => {
    const unsubscribe = navigation.addListener('focus', async () => {
      my_orders();
    });
    return unsubscribe;
  },[]);  

  const my_orders = async () => {
    setLoading(true);
    await axios({
      method: 'post', 
      url: api_url + get_orders,
      data:{customer_id:global.id}
    })
    .then(async response => {
      await setLoading(false);
      setOrderList(response.data.result);
      setCount(response.data.result.length);
    })
    .catch(error => {
      setLoading(false);
    });
  }

  

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={order_details.bind(this,item.id,item.slug)} style={{ borderWidth:1, borderRadius:10, borderColor:colors.light_grey, marginBottom:20}} activeOpacity={1}>
      <DropShadow
        style={{
            width: '100%',
            shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 0,
            },
            shadowOpacity: 0.1,
            shadowRadius: 5,
        }}
      >
          <View style={{ flexDirection:'row', backgroundColor:colors.light_grey, padding:10, borderTopLeftRadius:10, borderTopRightRadius:10, }}>
            <View style={{ width:'20%'}}>
              <Image style={{ height: 50, width: 50, borderRadius:10}} source={{ uri : img_url + item.restaurant_image}} />
            </View>
            <View style={{ width:'60%', justifyContent:'center', alignItems:'flex-start'}}>
              <Text style={{ fontFamily:bold, fontSize:12, color:colors.theme_fg_two}}>{item.restaurant_name}</Text>
              <View style={{ margin:1 }} />
              <Text style={{ fontFamily:regular, fontSize:10, color:colors.grey}}>{item.manual_address }</Text>
            </View>
            <View style={{ width:'20%', alignItems:'flex-end', justifyContent:'center'}}>
              <View style={{ width:'100%', alignItems:'center', justifyContent:'center', backgroundColor:colors.theme_bg_three, padding:5, borderRadius:10}}>
                <Text style={{ fontFamily:bold, fontSize:10, color:colors.theme_fg_two}}>{item.status}</Text>
              </View>
            </View>
          </View>
          <View style={{ backgroundColor:colors.theme_bg_three, padding:10, borderBottomWidth:0.5, borderColor:colors.grey }}>
            <View style={{ flexDirection:'column', width:'100%', justifyContent:'flex-start'}}>
                {item.item_list.map((row, index) => (
                  <View style={{ flexDirection:'row', alignItems:'center', margin:3}}>
                    <Image style={{ height: 15, width: 15}} source={{ uri : img_url + row.icon }} />
                    <View style={{ margin:2 }} />
                    <Text style={{ fontSize:10, color:colors.grey, fontFamily:bold}}>{row.quantity} x {row.item_name}</Text>
                  </View>
                ))}
            </View>
          </View>
          <View style={{ flexDirection:'row', backgroundColor:colors.theme_bg_three, padding:10, borderBottomLeftRadius:10, borderBottomRightRadius:10, }}>
            <View style={{ alignItems:'flex-start', width:'50%'}}>
              <Text style={{ fontSize:10, color:colors.grey, fontFamily:regular}}>{Moment(item.created_at).format('DD MMM-YYYY hh:mm')}</Text>
            </View>
            <View style={{ alignItems:'flex-end', width:'50%'}}>
              <Text style={{ fontSize:12, color:colors.theme_fg_two, fontFamily:bold}}>{global.currency}{item.total}</Text>
            </View>
          </View>
          {allowed_statuses.includes(item.slug) &&
          <View style={{position:'absolute', alignItems:'center', justifyContent:'center', width:'100%', height:'100%'}}>
              <Image style={{ height: 50, width:65 }} source={cancel}/>
          </View>
          } 
      </DropShadow>
    </TouchableOpacity>
    );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={colors.theme_bg}/>
      <ScrollView showsVerticalScrollIndicator={false} style={{padding: 10}}>
       <Loader visible={loading} />
       <View style={{ margin:5 }} />
        <View style={styles.header}>
          <View style={{ width:'100%', justifyContent:'center', alignItems:'flex-start' }}>
            <Text style={{ color:colors.theme_fg_two, fontFamily:bold, fontSize:20 }}>My Orders</Text>
          </View>
        </View>
        <View style={{ margin:10 }} />
        
        {count == 0 ?
          <View style={{marginTop:'30%'}}>
            <View style={{ height:250 }}>
              <LottieView source={empty_lottie} autoPlay loop />
            </View>
            <Text style={{ alignSelf:'center', fontFamily:bold, fontSize:14, fontFamily:bold, color:colors.grey}}>Sorry no data found</Text>
          </View>
        :
          <FlatList
            data={order_list}
            renderItem={renderItem}
            keyExtractor={item => item.id}
          />
        }
        <View style={{ margin:50 }} />
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
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  searchBarContainer:{
    borderColor:colors.light_grey, 
    borderRadius:10,
    borderWidth:2, 
    height:45
  },
  textFieldcontainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 5,
    marginBottom: 5,
    height: 45,
  },
  textFieldIcon: {
    paddingLeft:10,
    paddingRight:5,
    fontSize:20, 
    color:colors.theme_fg
  },
  textField: {
    flex: 1,
    padding: 5,
    borderRadius: 10,
    height: 45,
    fontFamily:regular,
    fontSize:14,
    color:colors.grey
  }
});

export default MyOrders;
