import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, SafeAreaView, ScrollView, TouchableOpacity, Image, FlatList, StatusBar } from 'react-native';
import Icon, { Icons } from '../components/Icons';
import * as colors from '../assets/css/Colors';
import { app_name, light, regular, bold, home_banner, email, notification_lottie, notification, api_url, img_url } from '../config/Constants';
import LottieView from 'lottie-react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { Loader } from '../components/Loader';

const Notifications = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [notification_list, setNotificationList] = useState([]);
  const [count, setCount] = useState('');

  const handleBackButtonClick= () => {
    navigation.goBack()
  }

  useEffect( () => {
    const unsubscribe = navigation.addListener('focus', async () => {
      get_notification();
    });
    return unsubscribe;
  },[]);  

  const get_notification = async () => {
    setLoading(true);
    await axios({
      method: 'post', 
      url: api_url + notification,
      data:{destination_id:global.id}
    })
    .then(async response => {
      await setLoading(false);
      setNotificationList(response.data.result);
      setCount(response.data.result.length);
    })
    .catch(error => {
      setLoading(false);
    });
  }

  const renderItem = ({ item }) => (
    <View style={{ flexDirection:'row',borderBottomWidth:1, borderColor:colors.light_grey, paddingTop:15, paddingBottom:15}}>
      <View style={{ width:'10%',justifyContent:'center', alignItems:'flex-start' }}>
        <Image style={{ height: 25, width: 25 }} source={email} />
      </View>  
      <View style={{ width:'85%', justifyContent:'center', alignItems:'flex-start'}}>
          <Text style={{ fontFamily:regular, fontSize:13, color:colors.theme_fg_two}}>{item.title}</Text>
          <View style={{ margin:1 }} />
          <Text style={{ fontFamily:regular, fontSize:10, color:colors.grey}}>{item.description}</Text>   
      </View>
      {/* <View style={{ width:'5%',justifyContent:'center', alignItems:'flex-end'}}>
        <TouchableOpacity>
          <Icon type={Icons.Ionicons} name="chevron-forward-outline" color={colors.regular_grey} style={{ fontSize:15 }} />
        </TouchableOpacity>
      </View>   */}
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
            <Text style={{ color:colors.theme_fg_two, fontFamily:bold, fontSize:20 }}>Notifications</Text>
          </View>
        </View>
        <View style={{ margin:10 }} />

        {count == 0 ?
          <View style={{marginTop:'30%'}}>
            <View style={{ height:250 }}>
              <LottieView source={notification_lottie} autoPlay loop />
            </View>
            <Text style={{ alignSelf:'center', fontFamily:bold, fontSize:14, fontFamily:bold, color:colors.grey}}>Sorry no data found</Text>
          </View>
        :
        <FlatList
          data={notification_list}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
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
});

export default Notifications;
