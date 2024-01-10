import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, SafeAreaView, ScrollView, TouchableOpacity, Image, StatusBar } from 'react-native';
import Icon, { Icons } from '../components/Icons';
import * as colors from '../assets/css/Colors';
import { app_name, light, regular, bold, home_banner, success_lottie } from '../config/Constants';
import LottieView from 'lottie-react-native';
import { useNavigation } from '@react-navigation/native';



const Success = () => {

  const navigation = useNavigation();

  const my_orders = () => {
    navigation.navigate("MyOrders")
    }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={colors.theme_bg}/>
      <ScrollView showsVerticalScrollIndicator={false} style={{padding: 10}}>
        <View style={{ height:'100%',width: '100%', justifyContent:'center'}}>
          <View style={{ height:250 }}>
            <LottieView source={success_lottie} autoPlay loop />
          </View>
          <View style={{ margin:10}} />
          <View style={{alignItems: 'center', justifyContent:'center'}}>
            <Text style={{fontFamily:bold, fontSize:20, color:colors.green,}}>Order Placed Successfully</Text>
            <View style={{ margin:5}} />
            <Text style={{fontFamily:regular, fontSize:14, color:colors.grey }}>Have a delicious food.</Text>
          </View>
          <View style={{ margin:20}} /> 
          <View style={{ left:0, right:0, alignItems:'center', justifyContent:'center'}}>
            <TouchableOpacity onPress={my_orders} style={styles.button}>
              <Text style={{ color:colors.theme_fg_three, fontFamily:bold, fontSize:14}}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>  
  )
}

const styles = StyleSheet.create({
  container: {
    flex:1,
  },
  button: {
    padding:10,
    borderRadius: 10,
    margin:10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:colors.theme_bg,
    width:'100%',
    height:45
  },
});

export default Success;
