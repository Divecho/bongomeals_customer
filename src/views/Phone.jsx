import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Button, View, SafeAreaView, Text, ScrollView, TouchableOpacity, TextInput, ImageBackground, StatusBar, I18nManager, Keyboard } from 'react-native';
import * as colors from '../assets/css/Colors';
import Icon, { Icons } from '../components/Icons';
import { app_name, regular, bold, check_phone_number, api_url } from '../config/Constants';
import PhoneInput from "react-native-phone-number-input";
import { useNavigation, CommonActions } from '@react-navigation/native';
import axios from 'axios';
import LottieView from 'lottie-react-native';
import { Loader } from '../components/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Phone = () => {

  const navigation = useNavigation();
  const [validation, setValidation] = useState(false);
  const phone_ref = useRef();
  const [loading, setLoading] = useState(false);
  const [formattedValue, setFormattedValue] = useState("");
  const [value, setValue] = useState("");

  const handleBackButtonClick = () => {
    navigation.dispatch(
      CommonActions.reset({
          index: 0,
          routes: [{ name: "Home" }],
      })
    );
  }

  const check_valid = () => {
    if (phone_ref.current?.isValidNumber(value)) {
      check_phone();
    } else {
      alert("Please enter valid phone number.")
    }
  }

  const check_phone = async () => {
    setLoading(true);
    await axios({
      method: 'post',
      url: api_url + check_phone_number,
      data: { phone_with_code: formattedValue }
    })
      .then(async response => {
        setLoading(false);
        if (response.data.result.is_available == 1) {
          navigation.navigate('Password', { phone_with_code: formattedValue, type: 1 })
        } else {
          navigation.navigate('Otp', { data: response.data.result.otp, type: 2, phone_with_code: formattedValue, phone_number: value })
        }
      })
      .catch(error => {
        console.log(" error", error);
        setLoading(false);
        alert('Sorry something went wrong Phone');
      });
  }


  const keyExtractor = (item: Item) => item.title;
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={colors.theme_bg} />
      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="always">
        <Loader visible={loading} />
        <ImageBackground
          source={require('../assets/img/front-bg.jpg')}
          resizeMode="cover"
          style={{ width: '100%', height: 300 }}>
          <View style={{ padding: 20, flexDirection:'row', justifyContent:'flex-end' }}>
            <TouchableOpacity onPress={handleBackButtonClick} style={{backgroundColor:'#fff', paddingHorizontal:10, paddingVertical:5, borderRadius:10}}>
              <Text style={{color:'#000'}}>Skip</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
        <View style={{ padding: 20 }}>

          <TouchableOpacity style={{ width: 100, justifyContent: 'center', alignItems: 'flex-start' }}>
          </TouchableOpacity>
          <View style={{ margin: 20 }} />
          <Text style={{ fontSize: 20, color: colors.theme_fg_two, fontFamily: bold }}>Enter your phone number</Text>
          <View style={{ margin: 2 }} />
          <Text style={{ fontSize: 12, color: colors.grey, fontFamily: regular }}>We will send you an one time password on this mobile number</Text>
          <View style={{ margin: 10 }} />
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <PhoneInput
              ref={phone_ref}
              defaultValue={value}
              defaultCode="IN"
              onChangeText={(text) => {
                setValue(text);
              }}

              codeTextStyle={{ placeholderTextColor: colors.theme_fg_two }}
              onChangeFormattedText={(text) => {
                setFormattedValue(text);
              }}
              withDarkTheme
              autoFocus
            />
          </View>
          <View style={{ margin: 20 }} />
          <TouchableOpacity onPress={check_valid.bind(this)} style={styles.button}>
            <Text style={{ color: colors.theme_fg_three, fontFamily: bold, fontSize: 14 }}>Submit</Text>
          </TouchableOpacity>
          <View style={{ margin: 10 }} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textFieldcontainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 5,
    marginBottom: 5,
    height: 45
  },
  textFieldIcon: {
    padding: 5
  },
  textField: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    height: 45,
    backgroundColor: colors.theme_bg_three,
    fontSize: 14,
    color: colors.grey
  },
  button: {
    padding: 10,
    borderRadius: 10,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.theme_bg,
    width: '100%',
    height: 45
  },
  flag_style: {
    width: 38,
    height: 24
  },
  country_text: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    height: 45,
    backgroundColor: colors.theme_bg_three,
    fontSize: 14,
    color: colors.theme_fg_two
  },
  textFieldcontainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 5,
    marginBottom: 5,
    height: 45
  },
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 96,
  },
  image: {
    width: 320,
    height: 320,
    marginTop: 32,
  },
  title: {
    fontSize: 25,
    color: colors.theme_fg_two,
    fontFamily: bold,
    textAlign: 'center',
  },
  text: {
    fontSize: 14,
    fontFamily: regular,
    color: colors.grey,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'justify',
    padding: 10,
  },
  buttonCircle: {
    width: 40,
    height: 40,
    backgroundColor: colors.theme_bg,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Phone;