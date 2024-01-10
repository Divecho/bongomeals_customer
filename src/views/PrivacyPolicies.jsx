import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, SafeAreaView, ScrollView, TouchableOpacity, Image, FlatList, StatusBar } from 'react-native';
import Icon, { Icons } from '../components/Icons';
import * as colors from '../assets/css/Colors';
import { app_name, light, regular, bold, home_banner, logo_with_name, email, privacy, api_url} from '../config/Constants';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import ContentLoader from "react-native-easy-content-loader";

const PrivacyPolicies = () => {
  const navigation = useNavigation();
  const [privacy_result, setPrivacyResult] = useState([]);
  const [loading, setLoading] = useState('false');

  const handleBackButtonClick= () => {
    navigation.goBack()
  }  

  useEffect(() => {
    get_privacy(); 
  },[]);

  const get_privacy = async() => {
    setLoading(true);
    axios({
    method: 'get', 
    url: api_url + privacy,
    })
    .then(async response => {
      setLoading(false);
      setPrivacyResult(response.data.result)
    })
    .catch(error => {
      setLoading(false);
      alert('Sorry something went wrong Privacy')
    });
  } 

  const renderItem = ({ item }) => (
    <View>
      <View style={{ justifyContent:'center', alignItems:'flex-start', padding:10,}}>
        <Text style={{ color:colors.theme_fg_two, fontFamily:bold, fontSize:18 }}>{item.title}</Text>
        <View style={{ margin:10 }} />
        <Text style={{ color:colors.grey, fontFamily:regular, fontSize:14}}>{item.description}</Text>
      </View>
    </View>
  );
 
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={colors.theme_bg}/>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackButtonClick} style={{ width:'15%',justifyContent:'center', alignItems:'flex-start' }}>
          <Icon type={Icons.Ionicons} name="chevron-back-circle-outline" color={colors.theme_fg_two} style={{ fontSize:35 }} />
        </TouchableOpacity>
        <View style={{ width:'75%',justifyContent:'center', alignItems:'flex-start' }}>
          <Text style={{ color:colors.theme_fg_two, fontFamily:bold, fontSize:20 }}>Privacy Policies</Text>
        </View>
      </View>
      <View style={{ margin:10}} />
      <ContentLoader 
          pRows={1}
          pHeight={[10, 30, 20]}
          pWidth={['80%', 70, 100]}
          listSize={5}
          loading={loading}>
          <FlatList
            data={privacy_result}
            renderItem={renderItem}
            keyExtractor={item => item.id}
          />
        </ContentLoader>
    </SafeAreaView>  
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:colors.theme_bg_three,
  },
  header: {
    justifyContent: 'flex-start',
    alignItems:'center',
    flexDirection:'row',
    shadowColor: '#ccc',
    padding:10
  },
  logo:{
      height:120, 
      width:120,
  },
   
});

export default PrivacyPolicies;
