import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Button, View, SafeAreaView, Text, TextInput, ScrollView, TouchableOpacity, StatusBar, ImageBackground } from 'react-native';
import * as colors from '../assets/css/Colors';
import Icon, { Icons } from '../components/Icons';
import { app_name, regular, bold } from '../config/Constants';
import { useNavigation, useRoute } from '@react-navigation/native';

const Otp = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [otp_value, setOtpValue] = useState(route.params.data);
  const [type, setType] = useState(route.params.type);
  const [phone_with_code_value, setPhoneWithCodeValue] = useState(route.params.phone_with_code);
  const [phone_number_value, setPhoneNumber] = useState(route.params.phone_number);
  const [id, setid] = useState(route.params.id);
  const [value, setValue] = useState("");
  const inputRef = useRef();

  const handleBackButtonClick = () => {
    navigation.goBack()
  }
  console.log(otp_value)

  useEffect(() => {
    if (global.mode == 'DEMO') {
      setTimeout(() => {
        check_otp(otp_value);
      }, 1000)
    }
    setTimeout(() => inputRef.current.focus(), 100)
  }, []);

  const check_otp = async (code) => {
    if (code != otp_value) {
      alert('Please enter valid OTP')
    } else if (type == 2) {
      navigation.navigate("Register", { phone_with_code_value: phone_with_code_value, phone_number_value: phone_number_value, })
    } else if (type == 1) {
      navigation.navigate("Password")
    } else if (type == 3) {
      navigation.navigate("CreatePassword", { id: id, from: "otp" })
    }
  }
  //alert(JSON.stringify(route.params.data))
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={colors.theme_bg} />
      <ScrollView showsVerticalScrollIndicator={false}>
      <ImageBackground
          source={require('../assets/img/front-bg.jpg')}
          resizeMode="cover"
          style={{ width: '100%', height: 300 }}>
          <View style={{ padding: 20 }}>
            <TouchableOpacity onPress={handleBackButtonClick} style={{backgroundColor:'#fff',  width: 50, justifyContent: 'center', alignItems: 'flex-start', paddingHorizontal:10, paddingVertical:5, borderRadius:10}}>
            <Icon type={Icons.Ionicons} name="chevron-back-circle-outline" color={colors.theme_fg_two} style={{ fontSize: 35 }} />
            </TouchableOpacity>
          </View>
        </ImageBackground>
        <View style={{ padding: 20 }}>
          <View style={{ margin: 20 }} />
          <Text style={{ fontSize: 20, color: colors.theme_fg_two, fontFamily: bold }}>Enter OTP</Text>
          <View style={{ margin: 2 }} />
          <Text style={{ fontSize: 12, color: colors.grey, fontFamily: regular }}>Enter the 4 digit code that was sent to your phone number</Text>
          <View style={{ margin: 10 }} />
          <View style={{ flexDirection: 'row' }}>
            <View style={{ width: '25%', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.theme_bg_three }}>
              <Icon type={Icons.MaterialIcons} name="dialpad" color={colors.theme_fg_two} style={{ fontSize: 30 }} />
            </View>
            <View style={{ width: '75%', alignItems: 'flex-start', paddingLeft: 10, justifyContent: 'center', backgroundColor: colors.text_container_bg }}>
              <TextInput
                ref={inputRef}
                secureTextEntry={false}
                placeholder="OTP"
                keyboardType='numeric'
                placeholderTextColor={colors.grey}
                style={styles.textinput}
                onChangeText={TextInputValue =>
                  setValue(TextInputValue)}
              />
            </View>
          </View>
          <View style={{ margin: 30 }} />
          <TouchableOpacity onPress={check_otp.bind(this, value)} activeOpacity={1} style={{ width: '100%', backgroundColor: colors.theme_bg, borderRadius: 10, height: 50, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: colors.theme_fg_two, fontSize: 16, color: colors.theme_fg_three, fontFamily: bold }}>Next</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textinput: {
    fontSize: 16,
    color: colors.grey,
    fontFamily: regular,
    height: 60,
    backgroundColor: colors.text_container_bg,
    width: '100%'
  },
});

export default Otp;