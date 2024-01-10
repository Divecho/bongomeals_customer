import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, SafeAreaView, ScrollView, TouchableOpacity, Image, FlatList, StatusBar } from 'react-native';
import Icon, { Icons } from '../components/Icons';
import * as colors from '../assets/css/Colors';
import { app_name, light, regular, bold, home_banner, faq, api_url, img_url } from '../config/Constants';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import ContentLoader from "react-native-easy-content-loader";

const FaqCategories = () => {
  const navigation = useNavigation();
  const [faq_category_list, setFaqCategoryList] = useState([]);
  const [loading, setLoading] = useState('false');

  const handleBackButtonClick= () => {
    navigation.goBack()
  }
  
  const faq_question = (data) => {
    navigation.navigate("Faq", { data: data})
  }

  useEffect(() => {
    get_faq_category(); 
  },[]);

  const get_faq_category = async() => {
    setLoading(true);
    axios({
    method: 'get', 
    url: api_url + faq,
    })
    .then(async response => {
      setLoading(false);
      setFaqCategoryList(response.data.result);
    })
    .catch(error => {
      setLoading(false);
      alert('Sorry something went wrong FAQ')
    });
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={faq_question.bind(this,item)}>
      <View style={{ flexDirection:'row',borderBottomWidth:1, borderColor:colors.light_grey, paddingTop:15, paddingBottom:15}}>
        <View style={{ width:'10%',justifyContent:'flex-start', alignItems:'center'}}>
          <View style={{ width: '75%', height:25 }}>
            <Image style= {{ height: undefined,width: undefined,flex: 1,borderRadius:10 }} source={{ uri: img_url + item.icon }} />
          </View> 
        </View>  
        <View style={{ width:'85%', justifyContent:'center', alignItems:'flex-start'}}>
          <Text style={{ fontFamily:regular, fontSize:16, color:colors.theme_fg_two}}>{item.category_name}</Text>
          <View style={{ margin:3 }} />
          <Text style={{ fontFamily:regular, fontSize:10, color:colors.grey}}>{item.description}</Text>   
        </View>
        <View style={{ width:'5%',justifyContent:'center', alignItems:'flex-end'}}>
          <Icon type={Icons.Ionicons} name="chevron-forward-outline" color={colors.regular_grey} style={{ fontSize:15 }} />
        </View>  
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={colors.theme_bg}/>
      <ScrollView showsVerticalScrollIndicator={false} style={{padding: 10}}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBackButtonClick} style={{ width:'15%',justifyContent:'center', alignItems:'flex-start' }}>
            <Icon type={Icons.Ionicons} name="chevron-back-circle-outline" color={colors.theme_fg_two} style={{ fontSize:35 }} />
          </TouchableOpacity>
          <View style={{ width:'75%',justifyContent:'center', alignItems:'flex-start' }}>
            <Text style={{ color:colors.theme_fg_two, fontFamily:bold, fontSize:20 }}>Faq Categories</Text>
          </View>
        </View>
        <View style={{ margin:10 }} />
        <ContentLoader 
          pRows={1}
          pHeight={[10, 30, 20]}
          pWidth={['80%', 70, 100]}
          listSize={5}
          loading={loading}>
          <FlatList
            data={faq_category_list}
            renderItem={renderItem}
            keyExtractor={item => item.id}
          />
        </ContentLoader>
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

export default FaqCategories;
