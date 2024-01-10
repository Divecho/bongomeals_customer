import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, SafeAreaView, ScrollView, TouchableOpacity, Image, FlatList, Modal, StatusBar } from 'react-native';
import Icon, { Icons } from '../components/Icons';
import * as colors from '../assets/css/Colors';
import { app_name, light, regular, bold, home_banner, profile_img, img_url } from '../config/Constants';
import DropShadow from "react-native-drop-shadow"; 
import { useNavigation, CommonActions } from '@react-navigation/native';
import { connect } from 'react-redux'; 
import Dialog from "react-native-dialog";
import AsyncStorage from '@react-native-async-storage/async-storage';

const More = (props) => {

  const navigation = useNavigation();
  const [visible, setVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const next = async(name) => {
    if(name == 'Admin Chat'){
      await navigation.navigate("AdminChat")
    }else if(name == 'Wallet'){
      await navigation.navigate("Wallet")
    }else if(name == 'Notifications'){
      await navigation.navigate("Notifications")
    }else if(name == 'Address Book'){
      await navigation.navigate("AddressList", { from : 'more'} )
    }else if(name == 'FAQ Categories'){
      await navigation.navigate("FaqCategories")
    }else if(name == 'Privacy Policies'){
      await navigation.navigate("PrivacyPolicies")
    }else if(name == 'About Us'){
      await navigation.navigate("AboutUs")
    }else if(name == 'Logout'){
      await onShowModal();
    }
  }

  const navigate_login = () =>{
    navigation.navigate("Phone");
  }

  const onShowModal = async() => {
    await setShowModal(true);
  };

  const handleCancel = async() => {
    await setShowModal(false);
  };

  const handleLogout = async() => {
    let keys = ['id', 'customer_name', 'phone_number', 'phone_with_code', 'profile_picture'];
    AsyncStorage.multiRemove(keys, async(err) => {
      // keys k1 & k2 removed, if they existed
      // do most stuff after removal (if you want)
    });
    global.id = await 0;
    await setShowModal(false);
    navigation.dispatch(
        CommonActions.reset({
            index: 0,
            routes: [{ name: "Home" }],
        })
      );
  };
 
  const data_with_id = [
    {
      id:1,
      title: 'Admin Chat',
      icon:'chatbox-ellipses-outline'
    },
    {
      id:2,
      title: 'Wallet',
      icon:'wallet-outline'
    },
    {
      id:3,
      title: 'Notifications',
      icon:'notifications-outline'
    },
    {
      id:4,
      title: 'Address Book',
      icon:'location-outline'
    },
    {
      id:5,
     title: 'FAQ Categories',
      icon:'help-outline'
    },
    {
      id:6,
      title: 'Privacy Policies',
      icon:'finger-print-outline'
    },
    {
      id:7,
      title: 'About Us',
      icon:'information-outline'
    }
  ];

  const data_without_id = [
    {
      id:1,
      title: 'Admin Chat',
      icon:'chatbox-ellipses-outline'
    },
    {
      id:4,
      title: 'Address Book',
      icon:'location-outline'
    },
    {
      id:5,
     title: 'FAQ Categories',
      icon:'help-outline'
    },
    {
      id:6,
      title: 'Privacy Policies',
      icon:'finger-print-outline'
    },
    {
      id:7,
      title: 'About Us',
      icon:'information-outline'
    }
  ]

  const profile = () => {
    navigation.navigate("Profile")
  }

  const open = () => {
    setShowModal(false)
      setTimeout(() => {
        Alert.alert('Alert', 'Works fine');
      }, 510);
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={next.bind(this,item.title)}>
      <View style={{ flexDirection:'row',borderBottomWidth:1, borderColor:colors.light_grey, paddingTop:15, paddingBottom:15}}>
        <View style={{ width:'10%',justifyContent:'center', alignItems:'flex-start' }}>
          <Icon type={Icons.Ionicons} name={item.icon} color={colors.regular_grey} style={{ fontSize:20 }} />
        </View>  
        <View style={{ width:'85%', justifyContent:'center', alignItems:'flex-start'}}>
          <Text style={{ fontFamily:regular, fontSize:16, color:colors.theme_fg_two}}>{item.title}</Text>
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
        <View style={{ margin:5 }} />
        <View style={styles.header}>
          <View style={{ width:'100%',justifyContent:'center', alignItems:'flex-start' }}>
            <Text style={{ color:colors.theme_fg_two, fontFamily:bold, fontSize:20 }}>Settings</Text>
          </View>
        </View>
        <View style={{ margin:10 }} />
        {global.id != 0 &&
        <View>
          <TouchableOpacity activeOpacity={1} onPress={profile}>
          <DropShadow
            style={{
                width: '100%',
                shadowColor: "#000",
                shadowOffset: {
                    width: 0,
                    height: 0,
                },
                shadowOpacity: 0.1,
                shadowRadius: 5,
            }}
          >
                <View style={{ flexDirection:'row', paddingTop:15, paddingBottom:15,}}>
                  <View style={{ width:'20%',justifyContent:'center', alignItems:'flex-start' }}>
                    <Image style={{ height: 50, width: 50, borderRadius:50 }} source={{uri: img_url + props.profile_picture}} />
                  </View>  
                  <View style={{ width:'75%', justifyContent:'center', alignItems:'flex-start'}}>
                    <Text style={{ fontFamily:bold, fontSize:18, color:colors.theme_fg_two}}>{global.customer_name}</Text>
                  <View style={{ margin:2 }} />
                    <Text style={{ fontFamily:regular, fontSize:12, color:colors.grey}}>Edit Profile</Text>   
                  </View>
                  <View style={{ width:'5%',justifyContent:'center', alignItems:'flex-end'}}>
                    <Icon type={Icons.Ionicons} name="chevron-forward-outline" color={colors.regular_grey} style={{ fontSize:15 }} />
                  </View>  
                </View>
            </DropShadow>
          </TouchableOpacity>
          <View style={{ margin:10 }}/>
        </View>
        }
        {global.id != 0 ?
          <FlatList
            data={data_with_id}
            renderItem={renderItem}
            keyExtractor={item => item.id}
          />
        :
          <FlatList
            data={data_without_id}
            renderItem={renderItem}
            keyExtractor={item => item.id}
          />
        }
        {global.id != 0 ?
          <TouchableOpacity onPress={next.bind(this,'Logout')}>
            <View style={{ flexDirection:'row',borderBottomWidth:1, borderColor:colors.light_grey, paddingTop:15, paddingBottom:15}}>
              <View style={{ width:'10%',justifyContent:'center', alignItems:'flex-start' }}>
                <Icon type={Icons.Ionicons} name="log-out-outline" color={colors.regular_grey} style={{ fontSize:20 }} />
              </View>  
              <View style={{ width:'85%', justifyContent:'center', alignItems:'flex-start'}}>
                <Text style={{ fontFamily:regular, fontSize:16, color:colors.theme_fg_two}}>Logout</Text>
              </View>
              <View style={{ width:'5%',justifyContent:'center', alignItems:'flex-end'}}>
                <Icon type={Icons.Ionicons} name="chevron-forward-outline" color={colors.regular_grey} style={{ fontSize:15 }} />
              </View>  
            </View>
          </TouchableOpacity>
          :
          <View>
            <TouchableOpacity onPress={navigate_login.bind(this)}  style={styles.button_lgn}>
              <Text style={{ color:colors.theme_fg_three, fontFamily:bold, fontSize:14 }}>Login</Text>
            </TouchableOpacity>
            <View style={{ margin:10 }} />
            <Text style={{ fontSize:12, color:colors.grey, alignSelf:'center', fontFamily:bold}}>Please login for access more feature</Text>
          </View>
        }
        <Modal animationType='slide' visible={showModal}>
        <View style={{margin: 20, backgroundColor: colors.theme_bg_three, borderRadius: 20, paddingTop: 35, paddingBottom: 10, alignItems: "center", justifyContent:'center', shadowColor: "#000", 
        shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5}}>
            <Text style={{textAlign:'center', fontSize:16, fontFamily:bold, color:colors.theme_fg_two}}>Need to logout?</Text>
            <View style={{ margin:10, borderBottomWidth: 0.5, borderColor:colors.theme_fg_two, width:'100%'}}/>
             <View style={{ flexDirection:'row', alignItems:'center', justifyContent:'center', width:'100%'}}>
              <TouchableOpacity onPress={handleLogout} style={{ width:'50%',  alignItems:'center', justifyContent:'center'}}>
                <Text style={{ textAlign:'center', fontSize:16, fontFamily:bold, color:colors.theme_fg_two}} >YES</Text>
              </TouchableOpacity>
              <View style={{ borderWidth:0.5, height:50 }}/>
              <TouchableOpacity onPress={handleCancel} style={{ width:'48%',  alignItems:'center', justifyContent:'center'}}>
                <Text style={{ textAlign:'center', fontSize:16, fontFamily:bold, color:colors.theme_fg_two}} >NO</Text>
              </TouchableOpacity>
            </View>
        </View>
      </Modal>
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
  button_lgn: {
    padding:10,
    borderRadius: 10,
    marginTop:30,
    height:40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:colors.theme_bg,
    width:'100%',
    height:45
  }
});
function mapStateToProps(state){
  return{
    profile_picture : state.current_location.profile_picture,

  };
}

export default connect(mapStateToProps,null)(More);
