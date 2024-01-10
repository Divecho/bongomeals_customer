import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, SafeAreaView, ScrollView, TouchableOpacity, Image, StatusBar, Platform } from 'react-native';
import Icon, { Icons } from '../components/Icons';
import * as colors from '../assets/css/Colors';
import { app_name, light, regular, bold, home_banner, address_lottie } from '../config/Constants';
import LottieView from 'lottie-react-native';
import { useNavigation } from '@react-navigation/native';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import Geolocation from '@react-native-community/geolocation';
const LocationEnable = () => {
console.log("LocationEnable");
  const navigation = useNavigation();

  const enable_gps = () =>{
    if(Platform.os === "android"){
      RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({interval: 10000, fastInterval: 5000})
      .then(data => {
        navigation.navigate('Splash');
      }).catch(err => {
         
      });
    }else{
      Geolocation.getCurrentPosition( async(position) => {
          navigation.navigate('Splash');
        }, error => alert('Please try again once') , 
        {enableHighAccuracy: false, timeout: 10000 });
    }
    
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={colors.theme_bg} />
      <View style={{ height:'100%',width: '100%', justifyContent:'center'}}>
        <View style={{ height:250 }}>
          <LottieView source={address_lottie} autoPlay loop />
        </View>
        <View style={{ margin:10}} />
        <View style={{alignItems: 'center', justifyContent:'center', margin: 10}}>
          <Text style={{fontFamily:bold, fontSize:18, color:colors.green,}}>Please allow {global.app_name} to enable your GPS for accurate pickup.</Text>
        </View>
        <View style={{ margin:20}} /> 
        <TouchableOpacity onPress={enable_gps.bind(this)} style={styles.button}>
          <Text style={{ color:colors.theme_fg_three, fontFamily:bold, fontSize:14}}>Enable GPS</Text>
        </TouchableOpacity>
      </View>
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
    height:45
  },
});

export default LocationEnable;
