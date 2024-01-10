import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, SafeAreaView, ScrollView, TouchableOpacity, Image, FlatList, Platform, StatusBar } from 'react-native';
import Icon, { Icons } from '../components/Icons';
import * as colors from '../assets/css/Colors';
import { light, regular, bold, address_lottie, customer_get_address, api_url, img_url } from '../config/Constants';
import LottieView from 'lottie-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import { Loader } from '../components/Loader';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import { updateAddress } from '../actions/OrderActions';
import { connect } from 'react-redux'; 
const AddressList = (props) => {

  const navigation = useNavigation();
  const route = useRoute();
  const [loading, setLoading] = useState(false);
  const [address_value, setAddressValue] = useState([]); 
  const [count, setCount] = useState(''); 
  const [from, setFrom] = useState(route.params.from);

  const handleBackButtonClick= () => {
    navigation.goBack()
  }   

  useEffect(() => {
      const unsubscribe = navigation.addListener('focus', async () => {
        await get_address();
      });
      return unsubscribe;
  },[]);

  const navigate_login = () =>{
    navigation.navigate("Phone");
  }

  const save_address = async(id, address_type) => {
    if (Platform.OS === "android"){
      RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({interval: 10000, fastInterval: 5000})
        .then(data => {
          navigation.navigate("AddAddress", { id: id, tag_id:address_type })
        }).catch(err => {
        
      });
    }else{
      navigation.navigate("AddAddress", { id: id, tag_id:address_type })
    }
  }

  const select_address = async(data) => {

    if(from == "cart"){
      await props.updateAddress(data);
      await handleBackButtonClick();
    }
  }

  const get_address = async () => {
    //setLoading(true);
    await axios({
      method: 'post', 
      url: api_url + customer_get_address,
      data:{ customer_id: global.id }
    })
    .then(async response => {
      setLoading(false);
      setAddressValue(response.data.result);
      setCount(response.data.result.length)
    })
    .catch(error => {
      setLoading(false);
      alert('Sorry something went wrong addressList')
    });
  }
  
  const renderItem = ({ item }) => (
     <TouchableOpacity activeOpacity={1} onPress={select_address.bind(this, item)} style={{ flexDirection:'row',borderBottomWidth:1, borderColor:colors.light_grey, paddingTop:15, paddingBottom:15}}>
      <View style={{ width:'10%',justifyContent:'flex-start', alignItems:'flex-start'}}>
        <View style={{ width: 25, height:25 }}>
          <Image style= {{ height: undefined,width: undefined,flex: 1,borderRadius:10 }} source={{ uri: img_url + item.icon }} />
        </View> 
      </View>   
      <View style={{ width:'85%', justifyContent:'center', alignItems:'flex-start'}}>
          <Text style={{ fontFamily:regular, fontSize:16, color:colors.theme_fg_two}}>{item.type_name}</Text>
          <View style={{ margin:2 }} />
          <Text style={{ fontFamily:regular, fontSize:10, color:colors.grey}}>{item.address}</Text>   
      </View>
      <View style={{ width:'5%',justifyContent:'center', alignItems:'flex-end'}}>
        <TouchableOpacity onPress={save_address.bind(this, item.id, item.address_type)}>
          <Icon type={Icons.Ionicons} name="create-outline" color={colors.regular_grey} style={{ fontSize:20 }} />
        </TouchableOpacity>
      </View>  
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={colors.theme_bg}/>
      <ScrollView showsVerticalScrollIndicator={false} style={{ padding:10}}>
      <Loader visible={loading} />
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBackButtonClick} style={{ width:'15%',justifyContent:'center', alignItems:'flex-start' }}>
            <Icon type={Icons.Ionicons} name="chevron-back-circle-outline" color={colors.theme_fg_two} style={{ fontSize:35 }} />
          </TouchableOpacity>
          <View style={{ width:'75%',justifyContent:'center', alignItems:'flex-start' }}>
            <Text style={{ color:colors.theme_fg_two, fontFamily:bold, fontSize:20 }}>Address List</Text>
          </View>
        </View>
        <View style={{ margin:10 }} />
        {global.id != 0 ?
        <View>
        <TouchableOpacity onPress={save_address.bind(this,0)}>
          <Text style={{ color:colors.theme_fg_two, fontFamily:bold, fontSize:18 }}>+ Add Address</Text>
        </TouchableOpacity>
        <View style={{ margin:10 }} />
        {count == 0 ?
          <View style={{marginTop:'20%'}}>
            <View style={{ height:250 }}>
              <LottieView source={address_lottie} autoPlay loop />
            </View>
            <Text style={{ alignSelf:'center', fontFamily:bold, fontSize:16, color:colors.theme_fg_two}}>Sorry no data found</Text>
          </View>
        :
        <FlatList
          data={address_value}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
        }
        </View>
        :
        <View>
          <TouchableOpacity onPress={navigate_login.bind(this)}  style={styles.button_lgn}>
            <Text style={{ color:colors.theme_fg_three, fontFamily:bold, fontSize:14 }}>Login</Text>
          </TouchableOpacity>
          <View style={{ margin:10 }} />
          <Text style={{ fontSize:12, color:colors.grey, alignSelf:'center', fontFamily:bold}}>Please login for access this feature</Text>
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
  button_lgn: {
    padding:10,
    borderRadius: 10,
    marginTop:'30%',
    height:40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:colors.theme_bg,
    width:'100%',
    height:45
  },
});


const mapDispatchToProps = (dispatch) => ({
  updateAddress: (data) => dispatch(updateAddress(data)),
});

export default connect(null,mapDispatchToProps)(AddressList);
