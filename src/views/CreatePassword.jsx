import React, { useState } from 'react';
import { StyleSheet, Button, View, SafeAreaView, Text, Alert, ScrollView, TouchableOpacity, TextInput, Keyboard, StatusBar } from 'react-native';
import * as colors from '../assets/css/Colors';
import Icon, { Icons } from '../components/Icons';
import { regular, bold, customer_reset_password, api_url } from '../config/Constants';
import { useNavigation, useRoute, CommonActions } from '@react-navigation/native';
import axios from 'axios';
import { Loader } from '../components/Loader';

const CreatePassword = () => {

  const navigation = useNavigation();
  const route = useRoute();
  const [id, setid] = useState(route.params.id); 
  const [password, setPassword] = useState("");
  const [confirm_password, setConfirmPassword] = useState("");
  const [validation,setValidation] = useState(false); 
  const [loading, setLoading] = useState('false');
  const [from_screen, setFromScreen] = useState(route.params.from); 

  const handleBackButtonClick= () => {
    navigation.goBack()
  }

  const reset_validation = async() =>{
    if(password == ""){
      alert('Please enter Password.')
      await setValidation(false);
    }else if(confirm_password == ""){
      alert('Please enter confirm Password.')
      await setValidation(false);
    }else if(password != confirm_password){
      alert('Password mismatch.')
      await setValidation(false);
    }else{
      await setValidation(true);
      reset_password();
    }
  }

  const reset_password = async() =>{
    Keyboard.dismiss();
    setLoading(true);
    await axios({
      method: 'post', 
      url: api_url + customer_reset_password,
      data:{ id: id, password: password }
    })
    .then(async response => {
      setLoading(false);
      if(response.data.status == 1){
        navigate()
      }else{
        alert(response.data.message)
      }
    })
    .catch(error => {
      setLoading(false);
      alert('Sorry something went wrong CreatePassword');
    });
  }

  const navigate = async() => {
    if(from_screen == "otp"){
      navigation.navigate("Phone")
    }else if(from_screen == "profile"){
      handleBackButtonClick();
    }
  }
  
return( 
  <SafeAreaView style={styles.container}>
    <StatusBar backgroundColor={colors.theme_bg}/>
    <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="always" style={{ padding:20}}>
    <Loader visible={loading} />
      <View>
        <TouchableOpacity onPress={handleBackButtonClick} style={{ width:100 , justifyContent:'center', alignItems:'flex-start' }}>
          <Icon type={Icons.Ionicons} name="chevron-back-circle-outline" color={colors.theme_fg_two} style={{ fontSize:35 }} />
        </TouchableOpacity>
        <View style={{ margin:20 }}/>
        <Text style={{ fontSize:20, color:colors.theme_fg_two, fontFamily:bold}}>Create Password</Text>
        <View style={{ margin:2 }}/>
        <Text style={{ fontSize:12, color:colors.grey, fontFamily:regular }}>Enter your new password for login</Text>
        <View style={{ margin:10 }}/>
        <View
          style={styles.textFieldcontainer}>
          <TextInput
            style={styles.textField}
            placeholder="Password"
            underlineColorAndroid="transparent"
            secureTextEntry={true}
            onChangeText={text => setPassword(text)}
          />
        </View>
        <View style={{ margin:5 }}/>
        <View
          style={styles.textFieldcontainer}>
          <TextInput
            style={styles.textField}
            placeholder="Confirm Password"
            underlineColorAndroid="transparent"
            secureTextEntry={true}
            onChangeText={text => setConfirmPassword(text)}
          />
        </View>
        <View style={{ margin:20 }}/>
        <TouchableOpacity onPress = {reset_validation} style={styles.button}>
          <Text style={{ color:colors.theme_fg_three, fontFamily:bold, fontSize:14}}>Submit</Text>
        </TouchableOpacity>
        <View style={{ margin:10 }}/>
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
    padding:5
  },
  textField: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    height: 45,
    backgroundColor:colors.theme_bg_three,
    fontSize:14,
    color:colors.grey,
    fontFamily:regular
  },
  button: {
    padding:10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:colors.theme_bg,
    width:'100%',
    height:45
  },
});

export default CreatePassword;