import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, SafeAreaView, ScrollView, TouchableOpacity, Image, StatusBar } from 'react-native';
import Icon, { Icons } from '../components/Icons';
import * as colors from '../assets/css/Colors';
import { app_name, light, regular, bold, home_banner, base_url, width_100 } from '../config/Constants';
import { useNavigation } from '@react-navigation/native';
import { WebView } from 'react-native-webview';
const AdminChat = () => {

  const navigation = useNavigation();

  const handleBackButtonClick= () => {
    navigation.goBack()
  }
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={colors.theme_bg}/>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBackButtonClick} style={{ width:'15%',justifyContent:'center', alignItems:'flex-start' }}>
            <Icon type={Icons.Ionicons} name="chevron-back-circle-outline" color={colors.theme_fg_two} style={{ fontSize:35 }} />
          </TouchableOpacity>
          <View style={{ width:'75%',justifyContent:'center', alignItems:'flex-start' }}>
            <Text style={{ color:colors.theme_fg_two, fontFamily:bold, fontSize:20 }}>Admin Chat</Text>
          </View>
        </View>
        <View style={{ margin:5 }} />
        <WebView 
          source={{ uri: base_url+'customer_chat/'+global.id }} 
          style={{ width: width_100 }}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
        />
    </SafeAreaView> 
  )
}

const styles = StyleSheet.create({
  container: {
    flex:1,
  },
  header: {
    justifyContent: 'flex-start',
    alignItems:'center',
    flexDirection:'row',
    padding:10
  },

});

export default AdminChat;
