import React, { useState, useEffect } from 'react';
import { StyleSheet, Button, View, SafeAreaView, Text, Alert, ScrollView, TouchableOpacity, TextInput, Keyboard, StatusBar, ImageBackground } from 'react-native';
import * as colors from '../assets/css/Colors';
import Icon, { Icons } from '../components/Icons';
import { app_name, regular, bold, customer_register, api_url } from '../config/Constants';
import { useNavigation, useRoute, CommonActions } from '@react-navigation/native';
import axios from 'axios';
import { Loader } from '../components/Loader';
import { connect } from 'react-redux';
import { updateProfilePicture } from '../actions/CurrentAddressActions';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Register = (props) => {

  const navigation = useNavigation();
  const route = useRoute();
  const [phone_with_code_value, setPhoneWithCodeValue] = useState(route.params.phone_with_code_value);
  const [phone_number_value, setPhoneNumber] = useState(route.params.phone_number_value);
  const [customer_name, setCustomerName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [validation, setValidation] = useState(false);
  const [confirm_password, setConfirmPassword] = useState("");

  const handleBackButtonClick = () => {
    navigation.goBack()
  }

  const register_validation = async () => {
    if (customer_name == "") {
      alert('Please enter Name.')
      await setValidation(false);
    } else if (password == "") {
      alert('Please enter Password.')
      await setValidation(false);
    } else if (confirm_password == "") {
      alert('Please enter Confirm Password.')
      await setValidation(false);
    } else if (password != confirm_password) {
      alert('Password mismatch.')
      await setValidation(false);
    } else {
      await setValidation(true);
      registration();
    }
  }

  const registration = async () => {
    Keyboard.dismiss();
    setLoading(true);
    await axios({
      method: 'post',
      url: api_url + customer_register,
      data: { customer_name: customer_name, phone_number: phone_number_value, fcm_token: global.fcm_token, phone_with_code: phone_with_code_value, password: password }
    })
      .then(async response => {
        setLoading(false);
        if (response.data.status == 1) {
          saveData(response.data)
        } else {
          alert(response.data.message)
        }
      })
      .catch(error => {
        setLoading(false);
        alert('Sorry something went wrong Register');
      });
  }

  const saveData = async (data) => {
    try {
      await AsyncStorage.setItem('id', data.result.id.toString());
      await AsyncStorage.setItem('customer_name', data.result.customer_name.toString());
      await AsyncStorage.setItem('phone_number', data.result.phone_number.toString());
      await AsyncStorage.setItem('phone_with_code', data.result.phone_with_code.toString());
      await AsyncStorage.setItem('profile_picture', data.result.profile_picture.toString());

      global.id = await data.result.id.toString();
      global.customer_name = await data.result.customer_name.toString();
      global.phone_number = await data.result.phone_number.toString();
      global.phone_with_code = await data.result.phone_with_code.toString();
      await props.updateProfilePicture(data.result.profile_picture.toString());

      await navigat();
    } catch (e) {
      alert(e);
    }
  }

  const navigat = async () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "Home" }],
      })
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={colors.theme_bg} />
      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="always" >
        <Loader visible={loading} />
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
          <Text style={{ fontSize: 20, color: colors.theme_fg_two, fontFamily: bold }}>Register</Text>
          <View style={{ margin: 2 }} />
          <Text style={{ fontSize: 12, color: colors.grey, fontFamily: regular }}>Enter your details for register</Text>
          <View style={{ margin: 10 }} />
          <View
            style={styles.textFieldcontainer}>
            <TextInput
              style={styles.textField}
              placeholder="Name"
              placeholderTextColor={colors.grey}
              underlineColorAndroid="transparent"
              onChangeText={text => setCustomerName(text)}
            />
          </View>
          <View style={{ margin: 5 }} />
          <View
            style={styles.textFieldcontainer}>
            <TextInput
              style={styles.textField}
              placeholder="Password"
              placeholderTextColor={colors.grey}
              underlineColorAndroid="transparent"
              secureTextEntry={true}
              onChangeText={text => setPassword(text)}
            />
          </View>
          <View style={{ margin: 5 }} />
          <View
            style={styles.textFieldcontainer}>
            <TextInput
              style={styles.textField}
              placeholder="Confirm Password"
              placeholderTextColor={colors.grey}
              underlineColorAndroid="transparent"
              secureTextEntry={true}
              onChangeText={text => setConfirmPassword(text)}
            />
          </View>
          <View style={{ margin: 20 }} />
          <View style={{ left: 0, right: 0, alignItems: 'center', justifyContent: 'center' }}>
            <TouchableOpacity onPress={register_validation.bind(this)} style={styles.button}>
              <Text style={{ color: colors.theme_fg_three, fontFamily: bold, fontSize: 14 }}>Submit</Text>
            </TouchableOpacity>
          </View>
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
    height: 45,
    color: colors.theme_fg_two,
    fontSize: 14
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.theme_bg,
    width: '100%',
    height: 45
  },
});


function mapStateToProps(state) {
  return {
    profile_picture: state.current_location.profile_picture,

  };
}

const mapDispatchToProps = (dispatch) => ({
  updateProfilePicture: (data) => dispatch(updateProfilePicture(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Register);
