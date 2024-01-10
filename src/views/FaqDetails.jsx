import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, SafeAreaView, ScrollView, TouchableOpacity, Image, StatusBar } from 'react-native';
import Icon, { Icons } from '../components/Icons';
import * as colors from '../assets/css/Colors';
import { app_name, light, regular, bold, home_banner, email, img_url } from '../config/Constants';
import { useNavigation, useRoute } from '@react-navigation/native';

const FaqDetails = () => {

  const navigation = useNavigation();
  const route = useRoute();
  const [faq_answer, setFaqAnswer] = useState(route.params.data);

  const handleBackButtonClick= () => {
    navigation.goBack()
  }   

  return (
    
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={colors.theme_bg}/>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBackButtonClick}  style={{ width:'15%',justifyContent:'center', alignItems:'flex-start' }}>
            <Icon type={Icons.Ionicons} name="chevron-back-circle-outline" color={colors.theme_fg_two} style={{ fontSize:35 }} />
          </TouchableOpacity>
          <View style={{ width:'75%',justifyContent:'center', alignItems:'flex-start' }}>
            <Text style={{ color:colors.theme_fg_two, fontFamily:bold, fontSize:20 }}>{faq_answer.question}</Text>
          </View>
        </View>
        {faq_answer.image != "" &&
          <View style={styles.imageView}>
            <Image style={{ height:200, width:'100%'}} source={{ uri : img_url + faq_answer.image}} />
          </View> 
        }
        <View style={{ margin:5 }} />
        <View style={styles.description}>
          <Text style={{ color:colors.grey, fontFamily:regular, fontSize:14 }}>{faq_answer.answer}</Text>
        </View>     
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
    padding:10
  },
  description: {
    padding:10
  }
});

export default FaqDetails;
