import React, { useState } from 'react';
import { StyleSheet, View, Text, SafeAreaView, ScrollView, TouchableOpacity, FlatList, StatusBar } from 'react-native';
import Icon, { Icons } from '../components/Icons';
import * as colors from '../assets/css/Colors';
import { light, regular, bold } from '../config/Constants';
import { useRoute, useNavigation } from '@react-navigation/native';

const Faq = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [faq_question, setFaqQuestion] = useState(route.params.data);
  const [loding, setLoding] = useState('false'); 

  const handleBackButtonClick= () => {
    navigation.goBack()
  }   

  const faq_details = (data) => {
    navigation.navigate("FaqDetails", { data: data })
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={faq_details.bind(this, item)}>
      <View style={{ flexDirection:'row',borderBottomWidth:1, borderColor:colors.light_grey, paddingTop:15, paddingBottom:15}}>
        <View style={{ width:'95%', justifyContent:'center', alignItems:'flex-start'}}>
          <Text style={{ fontFamily:regular, fontSize:14, color:colors.grey}}>{item.question}</Text>
        </View>
        <View style={{ width:'5%',justifyContent:'center', alignItems:'flex-end'}}>    
          <Icon type={Icons.Ionicons} name="chevron-forward-outline" color={colors.regular_grey} style={{ fontSize:15 }} />
        </View>  
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} >
      <StatusBar backgroundColor={colors.theme_bg}/>
      <ScrollView showsVerticalScrollIndicator={false} style={{ padding:10}}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBackButtonClick} style={{ width:'15%',justifyContent:'center', alignItems:'flex-start' }}>
            <Icon type={Icons.Ionicons} name="chevron-back-circle-outline" color={colors.theme_fg_two} style={{ fontSize:35 }} />
          </TouchableOpacity>
          <View style={{ width:'75%',justifyContent:'center', alignItems:'flex-start' }}>
            <Text style={{ color:colors.theme_fg_two, fontFamily:bold, fontSize:20 }}>{faq_question.category_name}</Text>
          </View>
        </View>
        <View style={{ margin:10 }} />
        <FlatList
          data={faq_question.data}
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

export default Faq;
