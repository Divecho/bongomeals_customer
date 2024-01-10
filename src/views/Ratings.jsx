import React, { useState } from 'react';
import { StyleSheet, View, Text, SafeAreaView, ScrollView, TouchableOpacity, Image, FlatList, TextInput, Keyboard, StatusBar} from 'react-native';
import Icon, { Icons } from '../components/Icons';
import * as colors from '../assets/css/Colors';
import { app_name, light, regular, bold, rating_upload, api_url, img_url } from '../config/Constants';
import { Rating, AirbnbRating } from 'react-native-ratings';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import { Loader } from '../components/Loader';

const Ratings = () => {

  const navigation = useNavigation();
  const [review_value, setReviewValue] = useState("");
  const [count, setCount] = useState(5);
  const [loading, setLoading] = useState(false);
  const route = useRoute();
  const [order_details, setOrderDetails] = useState(route.params.order_details);

  const handleBackButtonClick= () => {
    navigation.goBack()
  }   

  const onStarRatingPress = (rating) => {
    setCount(rating)
  }

  const get_ratings = async () => {
    Keyboard.dismiss();
    setLoading(true);
    await axios({
      method: 'post', 
      url: api_url + rating_upload,
      data:{restaurant_id:order_details.restaurant_id, customer_id:order_details.customer_id, order_id:order_details.id, rating:count, review:review_value}
    })
    .then(async response => {
      await setLoading(false);
      await handleBackButtonClick();
    })
    .catch(error => {
      alert(error)
      //alert('Sorry something went wrong')
      setLoading(false);
    });
  }

  return (
    <SafeAreaView style={styles.container} keyboardShouldPersistTaps="always">
      <StatusBar backgroundColor={colors.theme_bg}/>
    <Loader visible={loading} />
      <View style={{ flexDirection:'row', margin:10}}>
        <TouchableOpacity onPress={handleBackButtonClick} style={{ width:'10%',justifyContent:'center', alignItems:'flex-start' }}>
            <Icon type={Icons.Ionicons} name="close-circle-outline" color={colors.grey} style={{ fontSize:30 }} />
        </TouchableOpacity>
        <View style={{ width:'80%', justifyContent:'center', alignItems:'center'}}>
          <Text style={{ fontFamily:bold, fontSize:18, color:colors.grey}}> Show your experience</Text>
        </View>
      </View>
      <View style={{ margin:20}} />
      <View style={{ alignItems:'center'}}>
        <Text style={{ color:colors.grey, fontFamily:bold, fontSize:18 }}>{order_details.restaurant_name}</Text>
        <View style={{ margin:'2%'}} />
        {order_details.item_list.map((item) => {
          return (
            <View style={{ backgroundColor:colors.theme_bg_three, paddingBottom:10, paddingTop:10, flexDirection:'row' }}>
              <View style={{ width:'50%'}}>
                <View style={{ flexDirection:'row', alignItems:'center', justifyContent:'center' }}>
                  <Image style={{ height: 15, width: 15}} source={{ uri : img_url+item.icon }} />
                  <View style={{ margin:4 }} />
                  <Text style={{ fontSize:12, color:colors.theme_fg_two, fontFamily:regular}}>{item.item_name} - {item.quantity} X {global.currency}{item.price_per_item}</Text>
                </View>
              </View>
            </View>
          );
        })}
      </View>
      <View style={{ margin:'10%' }} />
      <View style={{alignItems:'center' }}>
        <AirbnbRating
          count={5}
          reviews={["Terrible", "Bad", "OK", "Good", "Very Good" ]}
          defaultRating={5}
          size={30}
          onFinishRating={onStarRatingPress}
        />
      </View>
      <View style={{ margin:'10%' }} />
      <View style={{ alignItems:'center', justifyContent:'center'}}>
        <Text style={{ color:colors.grey, fontFamily:regular, fontSize:14 }}>Do you have any comments</Text>
        <View style={{ margin:10 }} />
        <TextInput
          style={styles.input}
          onChangeText={text => setReviewValue(text)}
          multiline={true}
          placeholder="Enter your comment"
          placeholderTextColor={colors.grey}
          underlineColorAndroid='transparent'
        />
        <View style={{ margin:10 }} />
        <TouchableOpacity onPress={get_ratings.bind(this)} style={styles.button}>
          <Text style={{ color:colors.theme_fg_three, fontFamily:bold, fontSize:14}}>Rate</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>  
  )
 }


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:colors.theme_bg_three,
    padding:10
  },
   button: {
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:colors.theme_bg,
    width: '80%',
    height:45
  },
  input: {
    width:'80%',
    height:100,
    borderColor:colors.light_grey,
    borderWidth:1,
    backgroundColor:colors.light_grey,
    borderRadius:10,
    padding:10,
    fontSize:14,
    color:colors.theme_fg_two
  },
});

export default Ratings;
