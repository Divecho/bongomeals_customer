import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, SafeAreaView, ScrollView, TouchableOpacity, Image, FlatList,TextInput, StatusBar } from 'react-native';
import Icon, { Icons } from '../components/Icons';
import * as colors from '../assets/css/Colors';
import { app_name, light, regular, bold, home_banner, image, search_menu, api_url, img_url } from '../config/Constants';
import axios from 'axios';
import { connect } from 'react-redux';
import { useNavigation, useRoute } from '@react-navigation/native';
import UIStepper from 'react-native-ui-stepper';
import { addToCart, updateSubtotal } from '../actions/OrderActions';

const SearchMenu = (props) => {

  const navigation = useNavigation();
  const route = useRoute();
  const [list, setList] = useState([]);
  const [restaurant_id, setRestaurantId] = useState(route.params.restaurant_id);

  const handleBackButtonClick= () => {
    navigation.goBack()
  }

  const get_menus = async (search) => {
    await axios({
      method: 'post', 
      url: api_url + search_menu,
      data:{ customer_id : global.id, restaurant_id:restaurant_id, food_type:0, search:search }
    })
    .then(async response => {
      setList(response.data.result);
    })
    .catch(error => {
      alert('Sorry something went wrong SearchMenu');
    });
  }

  const menu = (id) =>{
    navigation.navigate("Menu",{ restaurant_id:id })
  }

  const add_to_cart = async (qty,item_id,item_name,price) => {
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

  const renderItem = ({ item }) => (
    <View style={{ flexDirection:'row',padding:10}}>
      <View style={{ width:'70%',justifyContent:'center', alignItems:'flex-start'}}>
        <View style={{ width:'50%',flexDirection:'row'}}>
          <Image style={{ height: 15, width: 15 }} source={{ uri : img_url+item.icon}} />
          <View style={{ margin:2}}/>
          <Text style={{borderWidth:0.5, padding:3, paddingRight:10,paddingLeft:10, fontFamily:regular, fontSize:8, color:colors.theme_fg_three,backgroundColor:colors.red, borderColor:colors.red, borderRadius:5}}>{item.tag_name}</Text> 
        </View>
        <View style={{ margin:2}}/>
        <Text style={{ fontFamily:bold, fontSize:14, color:colors.theme_fg_two,letterSpacing:1}}>{item.item_name}</Text>
        <View style={{ margin:3}}/>
        <Text style={{ fontFamily:regular, fontSize:12, color:colors.theme_fg_two}}>{global.currency}{item.base_price}</Text>
        <View style={{ margin:3}}/>
        <Text numberOfLines={3} style={{ fontFamily:regular, fontSize:10, color:colors.grey,letterSpacing:1}}>{item.item_description}</Text>
        <View style={{ padding:10}}>
           {/*<View style={{ flexDirection:'row', borderWidth:0.5,width:'40%',height:18,borderRadius:5, borderColor:colors.theme_fg_yellow , right:10, backgroundColor:colors.light_yellow}}>
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
          </View>*/} 
        </View> 
      </View> 
      <View style={{ width:'30%', alignItems:'center', justifyContent:'center'}}>
        <View style={{ height:80, width:100}}>
          <Image style={{ height: undefined, width:undefined, flex:1, borderRadius:10 }} source={{uri: img_url+item.item_image}} />
        </View>
        <View style={{ margin:2}}/>
        <UIStepper
          onValueChange={(value) => { add_to_cart(value,item.id,item.item_name,item.base_price) }}
          displayValue={true}
          initialValue={props.cart_items[item.id] ? props.cart_items[item.id].quantity : 0 }
          value={props.cart_items[item.id] ? props.cart_items[item.id].quantity : 0 }
          borderColor={colors.theme_fg}
          textColor={colors.theme_fg}
          tintColor={colors.theme_fg}
        />
        <View style={{ margin:2}}/>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={colors.theme_bg}/>
      <ScrollView showsVerticalScrollIndicator={false} style={{padding: 10}}>
        <TouchableOpacity onPress={handleBackButtonClick} style={{ width:100 , justifyContent:'center', alignItems:'flex-start' }}>
         <Icon type={Icons.Ionicons} name="chevron-back-circle-outline" color={colors.theme_fg_two} style={{ fontSize:35 }} />
        </TouchableOpacity>  
        <View style={{ margin:10 }}/>    
        <View style={styles.searchBarContainer}>
          <View
            style={styles.textFieldcontainer}>
            <Icon style={styles.textFieldIcon} type={Icons.Feather} name="search" />
            <TextInput
              style={styles.textField}
              placeholder="Search your favourite menus...."
              underlineColorAndroid="transparent"
              onChangeText={text => get_menus(text)}
            />
          </View>
        </View>
      <View style={{ margin:10 }} />
        <FlatList
          data={list}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
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
    color:colors.theme_fg_two,
  },
});

function mapStateToProps(state){
  return{
    cart_items : state.order.cart_items,
    cart_count : state.order.cart_count,
    sub_total : state.order.sub_total,
    delivery_charge : state.order.delivery_charge
  };
}

const mapDispatchToProps = (dispatch) => ({
  addToCart: (data) => dispatch(addToCart(data)),
  updateSubtotal: (data) => dispatch(updateSubtotal(data)),
});

export default connect(mapStateToProps,mapDispatchToProps)(SearchMenu);
