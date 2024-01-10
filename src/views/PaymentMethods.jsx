import React, { useState, useEffect } from 'react';
import { StyleSheet, Button, View, SafeAreaView, Text, Alert, ScrollView, TouchableOpacity, TextInput, Image , FlatList, StatusBar} from 'react-native';
import * as colors from '../assets/css/Colors';
import Icon, { Icons } from '../components/Icons';
import { app_name, regular, bold, mastro, paypal, visa, api_url, img_url } from '../config/Constants';
import { CheckBox } from 'react-native-elements';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import { Loader } from '../components/Loader';
import { updatePaymentMode } from '../actions/OrderActions';
import { connect } from 'react-redux';

const PaymentMethods = (props) => {
  const navigation = useNavigation();
  const route = useRoute();

  const [payment_list, setPaymentList] = useState(route.params.modes);

  const handleBackButtonClick= () => {
    navigation.goBack()
  }  

  useEffect(() => {
      const unsubscribe = navigation.addListener('focus', async () => {
        await get_payment_methods();
      });
      return unsubscribe;
  },[]);


  const select_payment = async(data) =>{
    await props.updatePaymentMode(data);
    await handleBackButtonClick();
  }

  

  const renderItem = ({ item }) => {
    console.log("item.payment_name ", item.payment_name)
    return(
    <View style={{ margin:10 }}>
      <TouchableOpacity onPress={select_payment.bind(this,item)} style={styles.button}>
        <View style={{ width:'20%',alignItems: 'flex-start', justifyContent:'center', padding:15}}>
          <View style={{ height:25, width:25}}>
            <Image style={{  height: undefined, width: undefined, flex:1 }} source={{uri:img_url+item.icon}} />
          </View>
        </View>
        <View style={{ width:'80%',alignItems: 'flex-start', justifyContent:'center'}}>
          <Text style={{ color:colors.grey, fontFamily:bold, fontSize:14 }}>{item.payment_name == 'Razorpay' ? 'Bongo' : item.payment_name}</Text>
        </View>
         
      </TouchableOpacity>
    </View>
  )};


  return (

    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={colors.theme_bg}/>
      <ScrollView showsVerticalScrollIndicator={false} style={{padding: 20}}>
         <View style={styles.header}>
            <TouchableOpacity onPress={handleBackButtonClick} style={{ width:'15%',justifyContent:'center', alignItems:'flex-start' }}>
              <Icon type={Icons.Ionicons} name="chevron-back-circle-outline" color={colors.theme_fg_two} style={{ fontSize:35 }} />
            </TouchableOpacity>
            <View style={{ width:'75%',justifyContent:'center', alignItems:'flex-start' }}>
              <Text style={{ color:colors.theme_fg_two, fontFamily:bold, fontSize:20 }}>Payment Methods</Text>
            </View>
          </View>
          <View style={{ margin:20 }}/>
          <FlatList
            data={payment_list}
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
  },
   header: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems:'center',
    flexDirection:'row',
    shadowColor: '#ccc',
  },
  button: {
    paddingLeft:10,
    paddingRight:10,
    borderRadius: 10,
    flexDirection: 'row',
    backgroundColor:colors.theme_fg_three,
    height:45
  },
   buttonStyle: {
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:colors.theme_bg
  },
});

function mapStateToProps(state){
  return{
    payment_mode:state.order.payment_mode
  };
}

const mapDispatchToProps = (dispatch) => ({
  updatePaymentMode: (data) => dispatch(updatePaymentMode(data)),
});

export default connect(mapStateToProps,mapDispatchToProps)(PaymentMethods);