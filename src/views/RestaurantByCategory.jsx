import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, SafeAreaView, ScrollView, TouchableOpacity, Image, FlatList, StatusBar } from 'react-native';
import Icon, { Icons } from '../components/Icons';
import * as colors from '../assets/css/Colors';
import { app_name, light, regular, bold, api_url, restaurant_category_list, img_url, empty_menu_lottie} from '../config/Constants';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Loader } from '../components/Loader';
import axios from 'axios';
import DropShadow from "react-native-drop-shadow";
import { connect } from 'react-redux';
import LottieView from 'lottie-react-native';

const RestaurantByCategory = (props) => {

  const navigation = useNavigation();
  const route = useRoute();
  const [loading, setLoading] = useState(false);
  const [restaurant_category, setRestaurantCategory] = useState([]);
  const [id, setid] = useState(route.params.id); 
  const [count, setCount] = useState('');

  const handleBackButtonClick= () => {
    navigation.goBack()
  }   

  useEffect( () => {
    get_restaurant_category_list();
    const unsubscribe = navigation.addListener('focus', async () => {
      
    });
    return unsubscribe;
  },[]);

  const get_restaurant_category_list = async () => {
    setLoading(true);
    await axios({
      method: 'post', 
      url: api_url + restaurant_category_list,
      data:{customer_id:global.id, category_id:id, lat:props.current_lat, lng:props.current_lng}
    })
    .then(async response => {
      await setLoading(false);
      setRestaurantCategory(response.data.result);
      setCount(response.data.result.length);
    })
    .catch(error => {
      setLoading(false);
      alert('Sorry something went wrong ByCategory')
    });
  }

  const navigate = (id) =>{
    navigation.navigate("Menu", {restaurant_id:id})
  }

  const renderItem = ({ item }) => (
    <View style={{ padding:10 }}>
      <TouchableOpacity onPress={navigate.bind(this, item.id)} activeOpacity={1} >
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
            <View style={styles.restaurant_container}>
              <View style={styles.imageView}>
                <Image style= {{ height: undefined,width: undefined,flex: 1,borderRadius:10 }} source={{ uri : img_url + item.restaurant_image }} />
              </View> 
              <View style={{ flexDirection:'row', padding:20}}>
                <View style={{ width:'80%', alignItems:'flex-start', justifyContent:'center'}}>
                  <Text style={{ color:colors.theme_fg_two, fontFamily:bold, fontSize:18 }}>{item.restaurant_name}</Text>
                  <View style={{ margin:2 }} />
                  <Text style={{ color:colors.grey, fontFamily:regular, fontSize:12 }}>{item.manual_address}</Text>
                </View>
                {item.overall_rating != 0 &&
                  <View style={{ width:'20%', alignItems:'flex-end', justifyContent:'center'}}>
                    <View style={{ width:50, backgroundColor:'green', padding:5, borderRadius:5, alignItems:'center', justifyContent:'center', flexDirection:'row' }}>
                      <Text style={{ fontSize:12, color:colors.theme_fg_three, fontFamily:bold}}>{item.overall_rating} </Text>
                      <Icon style={{ color:colors.theme_fg_three, fontSize:10 }} type={Icons.Ionicons} name="star" />
                    </View>
                  </View>
                }  
              </View>
            </View>
          </DropShadow>
      </TouchableOpacity>
    </View>
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
          <View style={{ width:'75%',justifyContent:'center', alignItems:'flex-start' }}>
            <Text style={{ color:colors.theme_fg_two, fontFamily:bold, fontSize:20 }}></Text>
          </View>
        </View>
        <View style={{ margin:5 }} />
        {count == 0 ?
          <View style={{marginTop:'30%'}}>
            <View style={{ height:250 }}>
              <LottieView source={empty_menu_lottie} autoPlay loop />
            </View>
            <Text style={{ alignSelf:'center', fontFamily:bold, fontFamily:bold, fontSize:14, color:colors.grey}}>No restaurants found.</Text>
          </View>
        :
          <FlatList
            data={restaurant_category}
            renderItem={renderItem}
            keyExtractor={item => item.id}
          />
        }
        <View style={{ margin:40 }} />
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
   button: {
    padding:10,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:colors.theme_bg,
    width:'100%',
    height:45
  },
  restaurant_container:{
    borderRadius:10,
  },
  imageView: {
    width: '100%', 
    height:180,
  },
});

function mapStateToProps(state){
  return{
    current_lat : state.current_location.current_lat,
    current_lng : state.current_location.current_lng,
  };
}

export default connect(mapStateToProps,null)(RestaurantByCategory);
