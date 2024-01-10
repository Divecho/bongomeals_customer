import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, SafeAreaView, ScrollView, TouchableOpacity, Image, StatusBar } from 'react-native';
import Icon, { Icons } from '../components/Icons';
import * as colors from '../assets/css/Colors';
import { app_name, light, regular, bold, home_banner, logo_with_name, settings, api_url } from '../config/Constants';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { Loader } from '../components/Loader';

const AboutUs = () => {

  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [app_details, setAppDetails] = useState("");

  const handleBackButtonClick = () => {
    navigation.goBack()
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      await app_settings();
    });
    return unsubscribe;

  }, []);

  const app_settings = async () => {
    axios({
      method: 'get',
      url: api_url + settings,
    })
      .then(async response => {
        setAppDetails(response.data.result)
      })
      .catch(error => {
        alert('Sorry something went wrong about')
      });
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={colors.theme_bg} />
      <Loader visible={loading} />
      <View style={{ height: '100%' }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBackButtonClick} style={{ width: '15%', justifyContent: 'center', alignItems: 'flex-start' }}>
            <Icon type={Icons.Ionicons} name="chevron-back-circle-outline" color={colors.theme_fg_two} style={{ fontSize: 35 }} />
          </TouchableOpacity>
          <View style={{ width: '75%', justifyContent: 'center', alignItems: 'flex-start' }}>
            <Text style={{ color: colors.theme_fg_two, fontFamily: bold, fontSize: 20 }}>About Us</Text>
          </View>
        </View>
        <View style={{ margin: 10 }} />
        <View style={{ justifyContent: 'center', alignItems: 'center' }} >
          <View style={styles.logo} >
            <Image style={{ height: undefined, width: undefined, flex: 1, }} source={logo_with_name} />
          </View>
        </View>
        <View style={{ margin: 10 }} />
        <View style={{ padding: 10 }}>
          <Text style={{ color: colors.grey, fontFamily: regular, fontSize: 14 }}>{app_details.description}</Text>
        </View>
        <View style={{ margin: 10 }} />
        <View style={{ padding: 10, alignItems: 'center' }}>
          <Text style={{ color: colors.grey, fontFamily: regular, fontSize: 14 }}>About app version {app_details.app_version}</Text>
        </View>
        <View style={{ width: '100%', flexDirection: 'row', height: 60, padding: 10, backgroundColor: colors.light_grey, position: 'absolute', bottom: 0 }}>
          <View style={{ width: '10%', justifyContent: 'center', alignItems: 'center' }}>
            <Icon type={Icons.Ionicons} name="home-outline" color={colors.regular_grey} style={{ fontSize: 15 }} />
          </View>
          <View style={{ width: '85%', justifyContent: 'center', alignItems: 'flex-start' }}>
            <Text style={{ fontFamily: regular, fontSize: 12, color: colors.regular_grey }}>{app_details.address}</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.theme_bg_three,
  },
  header: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    shadowColor: '#ccc',
    padding: 10
  },
  logo: {
    height: 120,
    width: 155,
  },

});

export default AboutUs;
