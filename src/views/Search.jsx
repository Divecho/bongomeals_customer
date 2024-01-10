import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, SafeAreaView, ScrollView, TouchableOpacity, Image, FlatList,TextInput, StatusBar } from 'react-native';
import Icon, { Icons } from '../components/Icons';
import * as colors from '../assets/css/Colors';
import { app_name, light, regular, bold, home_banner, image, home_search, api_url, img_url } from '../config/Constants';
import axios from 'axios';
import { connect } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { Loader } from '../components/Loader';

const Search = (props) => {

  const navigation = useNavigation();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);

  const get_restaurant_list = async (search) => {
    setLoading(true)
    await axios({
      method: 'post', 
      url: api_url + home_search,
      data:{ customer_id : global.id, lat:props.current_lat, lng:props.current_lng, search:search }
    })
    .then(async response => {
      setLoading(false)
      setList(response.data.result);
    })
    .catch(error => {
      setLoading(false)
      alert('Sorry something went wrong Search');
    });
  }

  const handleBackButtonClick= () => {
    navigation.goBack()
  }

  const menu = (id) =>{
    navigation.navigate("Menu",{ restaurant_id:id })
  }
  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={menu.bind(this,item.id)} style={{ flexDirection:'row',borderBottomWidth:1, borderColor:colors.light_grey, paddingTop:15, paddingBottom:15}}>
      <View style={{ width:'20%',justifyContent:'flex-start', alignItems:'center' }}>
       <Image style={{ height:50, width:50,borderRadius:25}} source={{ uri : img_url + item.restaurant_image }} />
      </View> 
      <View style={{ width:'70%', justifyContent:'center', alignItems:'flex-start'}}>
          <Text style={{ fontFamily:regular, fontSize:14, color:colors.theme_fg_two}}>{item.restaurant_name}</Text>
          <View style={{ margin:3 }} />
          <Text style={{ fontFamily:regular, fontSize:12, color:colors.grey}}>{item.cuisines}</Text>   
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={colors.theme_bg}/>
      <Loader visible={loading} />
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
              placeholder="Search your favourite restaurants...."
              underlineColorAndroid="transparent"
              onChangeText={text => get_restaurant_list(text)}
            />
          </View>
        </View>
      <View style={{ margin:10 }} />
      {list.length >0 ?
        <FlatList
          data={list}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
        :
        <View style={{ alignItems:'center', justifyContent:"center", marginTop:'50%'}}>
          <Text>Search for other restaurants.....</Text>
        </View>
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
    color:colors.theme_fg_two
  },
});

function mapStateToProps(state){
  return{
    current_lat : state.current_location.current_lat,
    current_lng : state.current_location.current_lng,
  };
}

export default connect(mapStateToProps,null)(Search);
