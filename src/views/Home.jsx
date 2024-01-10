import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Button,
  View,
  Dimensions,
  SafeAreaView,
  Text,
  Alert,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  FlatList,
  StatusBar,
} from "react-native";
import * as colors from "../assets/css/Colors";
import Icon, { Icons } from "../components/Icons";
import {
  app_name,
  light,
  regular,
  bold,
  home_banner,
  home_restaurant,
  home_restaurant1,
  home_banners,
  api_url,
  img_url,
  home_categories,
  home_restaurant_list,
  get_last_active_address,
} from "../config/Constants";
import FastImage from "react-native-fast-image";
import DropShadow from "react-native-drop-shadow";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { connect } from "react-redux";
import { Loader } from "../components/Loader";
import { updateAddress, updateRestaurants } from "../actions/OrderActions";
import {
  updateCurrentAddress,
  updateCurrentLat,
  updateCurrentLng,
  currentTag,
} from "../actions/CurrentAddressActions";
import database from "@react-native-firebase/database";

const Home = (props) => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [banners, setBanners] = useState([]);
  const [categories, setCategories] = useState([]);
  const midPoint = Math.ceil(categories.length / 2);
  const firstHalf = categories.slice(0, midPoint - 1);
  const secondHalf = categories.slice(-midPoint + 1);
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", async () => {
      await get_banners();
      await get_categories();
      await get_address();
    });
    return unsubscribe;

    const onValueChange = database()
      .ref(`/restaurants`)
      .on("value", (snapshot) => {
        get_restaurant_list();
      });
    return () => database().ref(`/restaurants`).off("value", onValueChange);
  }, []);

  const get_banners = async () => {
    //setLoading(true);
    await axios({
      method: "get",
      url: api_url + home_banners,
    })
      .then(async (response) => {
        await setLoading(false);
        await setBanners(response.data.result);
      })
      .catch((error) => {
        setLoading(false);

        alert("Sorry something went wrong h 1");
      });
  };

  const get_address = async () => {
    //setLoading(true);
    await axios({
      method: "post",
      url: api_url + get_last_active_address,
      data: { customer_id: global.id },
    })
      .then(async (response) => {
        await setLoading(false);
        if (response.data.status == 1) {
          update_last_active_address(response.data.result);
        } else {
          get_restaurant_list();
        }
      })
      .catch((error) => {
        setLoading(false);
        alert("Sorry something went wrong h 2");
      });
  };

  const get_categories = async () => {
    //setLoading(true);
    await axios({
      method: "get",
      url: api_url + home_categories,
    })
      .then(async (response) => {
        await setLoading(false);
        setCategories(response.data.result);
      })
      .catch((error) => {
        setLoading(false);
        alert("Sorry something went wrong h 3");
      });
  };

  const get_restaurant_list = async () => {
    //setLoading(true);
    await axios({
      method: "post",
      url: api_url + home_restaurant_list,
      data: {
        customer_id: global.id,
        lat: props.current_lat,
        lng: props.current_lng,
      },
    })
      .then(async (response) => {
        await setLoading(false);
        await props.updateRestaurants(response.data.result);
      })
      .catch((error) => {
        setLoading(false);
        alert("Sorry something went wrong h 4");
      });
  };

  const update_last_active_address = async (address) => {
    if (address && !props.address) {
      await props.updateAddress(address);
      await props.updateCurrentAddress(address.address);
      await props.updateCurrentLat(address.lat);
      await props.updateCurrentLng(address.lng);
      await props.currentTag(address.type_name);
      await get_restaurant_list();
    }
  };
  const menu = (id) => {
    navigation.navigate("Menu", { restaurant_id: id });
  };

  const search = () => {
    navigation.navigate("Search");
  };

  const set_address = () => {
    navigation.navigate("SelectCurrentLocation");
  };

  const restaurant_by_category = (id) => {
    navigation.navigate("RestaurantByCategory", { id: id });
  };

  const notification = () => {
    navigation.navigate("Notifications");
  };

  const categoriesRender = ({ item }) => {
    const { id, category_image, category_name } = item;
    return (
      <TouchableOpacity
        onPress={restaurant_by_category.bind(this, id)}
        key={id}
      >
        <View style={styles.categoryItem}>
          <View>
            <Image
              style={styles.categoryImage}
              source={{ uri: img_url + category_image }}
            />
          </View>
          <View>
            <Text style={styles.categoryTitle}>{category_name}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // {
  //   const { id, category_image, category_name } = item;
  //   return (
  //     <TouchableOpacity onPress={restaurant_by_category.bind(this, id)} key={id}>
  //       <View style={styles.categoryItem}>
  //         <View>
  //           <Image style={styles.categoryImage} source={{ uri: img_url + category_image }} />
  //         </View>
  //         <View>
  //           <Text style={styles.categoryTitle}>{category_name}</Text>
  //         </View>
  //       </View>
  //     </TouchableOpacity>
  //   );
  // }
  const renderItem = ({ item }) => (
    <View style={{ padding: 10 }}>
      <TouchableOpacity activeOpacity={1} onPress={menu.bind(this, item.id)}>
        <DropShadow
          style={{
            width: "100%",
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 0,
            },
            shadowOpacity: 0.1,
            shadowRadius: 5,
          }}
        >
          <View
            style={{
              borderWidth: 0.5,
              borderColor: colors.light_grey,
              borderRadius: 10,
            }}
          >
            <View style={styles.restaurant_container}>
              <View style={styles.imageView}>
                <Image
                  style={{
                    height: undefined,
                    width: undefined,
                    flex: 1,
                    borderTopLeftRadius: 10,
                    borderTopRightRadius: 10,
                  }}
                  source={{ uri: img_url + item.restaurant_image }}
                />
              </View>
              <View style={{ flexDirection: "row", padding: 20 }}>
                <View
                  style={{
                    width: "80%",
                    alignItems: "flex-start",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      color: colors.theme_fg_two,
                      fontFamily: bold,
                      fontSize: 18,
                    }}
                  >
                    {item.restaurant_name}
                  </Text>
                  <View style={{ margin: 2 }} />
                  <Text
                    style={{
                      color: colors.grey,
                      fontFamily: regular,
                      fontSize: 12,
                    }}
                  >
                    {item.cuisines}
                  </Text>
                </View>
                {item.overall_rating != 0 && (
                  <View
                    style={{
                      width: "20%",
                      alignItems: "flex-end",
                      justifyContent: "center",
                    }}
                  >
                    <View
                      style={{
                        width: 50,
                        backgroundColor: "green",
                        padding: 5,
                        borderRadius: 5,
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "row",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 12,
                          color: colors.theme_fg_three,
                          fontFamily: bold,
                        }}
                      >
                        {item.overall_rating}{" "}
                      </Text>
                      <Icon
                        style={{ color: colors.theme_fg_three, fontSize: 10 }}
                        type={Icons.Ionicons}
                        name="star"
                      />
                    </View>
                  </View>
                )}
              </View>
            </View>
          </View>
        </DropShadow>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={colors.theme_bg} />
      <ScrollView style={{ padding: 10 }} showsVerticalScrollIndicator={false}>
        <Loader visible={loading} />
        <View style={styles.header}>
          <TouchableOpacity onPress={set_address} style={{ width: "10%" }}>
            <Icon
              type={Icons.Ionicons}
              name="location"
              color={colors.theme_fg_two}
              style={{ fontSize: 25, color: colors.theme_fg }}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={set_address} style={{ width: "80%" }}>
            <Text style={{ color: colors.theme_fg_two, fontFamily: bold }}>
              {props.current_tag}
            </Text>
            <Text
              style={{
                color: colors.theme_fg_two,
                fontSize: 12,
                fontFamily: regular,
              }}
              numberOfLines={1}
            >
              {props.current_address}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={notification} style={{ width: "10%" }}>
            <Icon
              type={Icons.Ionicons}
              name="notifications"
              color={colors.theme_fg_two}
              style={{ fontSize: 25, color: colors.theme_fg }}
            />
          </TouchableOpacity>
        </View>
        <View style={{ margin: 10 }} />
        <TouchableOpacity
          onPress={search}
          activeOpacity={1}
          style={styles.searchBarContainer}
        >
          <View style={styles.textFieldcontainer}>
            <View style={{ width: "10%" }}>
              <Icon
                style={styles.textFieldIcon}
                type={Icons.Feather}
                name="search"
              />
            </View>
            <View style={{ width: "90%" }}>
              <Text
                style={{
                  fontSize: 12,
                  color: colors.grey,
                  fontFamily: regular,
                }}
              >
                Search your favourite restaurants
              </Text>
            </View>
          </View>
        </TouchableOpacity>
        <View style={{ margin: 10 }} />

        {/* Banner */}
        <View style={{ flexDirection: "row" }}>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            {banners.map((banner) => {
              //console.log("banner ", banner);
              return (
                //
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={ banner.restaurant_id && menu.bind(this, banner.restaurant_id)}
                >
                  <Image
                    style={{
                      width: 300,
                      height: 150,
                      marginLeft: 10,
                      marginRight: 10,
                      borderRadius: 10,
                    }}
                    source={{
                      uri: img_url + banner.image,
                    }}
                  />
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        <View style={{ margin: 10 }} />
        {/* Categories */}
        <View style={{ flex: 1, flexDirection: "row" }}>
          <View style={{ width: "100%", justifyContent: "center" }}>
            <Text
              style={{
                color: colors.theme_fg_two,
                fontFamily: bold,
                fontSize: 18,
              }}
            >
              Eat what you makes happy
            </Text>
          </View>
        </View>
        <View style={{ margin: 10 }} />
        <View style={styles.categoryContainer}>
          {/* {categories.map((category) => { */}
          <FlatList
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            data={firstHalf}
            renderItem={({ item }) => categoriesRender({ item })}
            keyExtractor={(item) => item.key}
            contentContainerStyle={{ flexWrap: "wrap", flexDirection: "row" }}
          />
          <View style={{ margin: 10 }} />

          <Image
            resizeMode="cover"
            style={{
              width: 375,
              height: 100,
              marginLeft: 10,
              marginRight: 10,
              borderRadius: 10,
            }}
            source={home_banner}
          />
          <View style={{ margin: 10 }} />
          <FlatList
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            data={secondHalf}
            renderItem={({ item }) => categoriesRender({ item })}
            keyExtractor={(item) => item.key}
            contentContainerStyle={{ flexWrap: "wrap", flexDirection: "row" }}
          />

          {/* })} */}
        </View>
        <View style={{ margin: 10 }} />

        {/* Restaurant List */}
        {/* <View style={{ flex: 1, flexDirection: 'row' }}>
          <View style={{ width: '100%', justifyContent: 'center' }}>
            <Text style={{ color: colors.theme_fg_two, fontFamily: bold, fontSize: 18 }}>Your Nearest Restaurants</Text>
          </View>
        </View>
        <View style={{ margin: 10 }} />
        <FlatList
          nestedScrollEnabled
          data={props.restaurants}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
        <View style={{ margin: 50 }} /> */}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light_grey,
  },
  header: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
    shadowColor: "#ccc",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  searchBarContainer: {
    backgroundColor: colors.theme_bg_three,
    borderColor: colors.theme_bg_three,
    borderRadius: 10,
    borderWidth: 2,
    height: 45,
  },
  textFieldcontainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginTop: 5,
    marginBottom: 5,
    height: 45,
  },
  textFieldIcon: {
    paddingLeft: 10,
    paddingRight: 5,
    fontSize: 20,
    color: colors.theme_fg,
  },
  textField: {
    flex: 1,
    padding: 5,
    borderRadius: 10,
    height: 45,
    fontFamily: regular,
    fontSize: 14,
    color: colors.grey,
  },
  restaurant_container: {
    borderRadius: 10,
  },
  categoryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  categoryItem: {
    flexDirection: "column",
    alignItems: "center",
    width: Dimensions.get("window").width / 3 - 17,
    paddingHorizontal: 10,
    paddingVertical: 10,
    margin: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.theme_bg_three,
    backgroundColor: colors.theme_bg_three,
  },
  categoryImage: {
    height: 100,
    width: 100,
  },
  categoryTitle: {
    fontSize: 12,
    marginTop: 10,
    fontFamily: bold,
  },
  imageView: {
    width: "100%",
    height: 180,
  },
});

function mapStateToProps(state) {
  return {
    current_lat: state.current_location.current_lat,
    current_lng: state.current_location.current_lng,
    current_address: state.current_location.current_address,
    current_tag: state.current_location.current_tag,
    address: state.order.address,
    restaurants: state.order.restaurants,
  };
}

const mapDispatchToProps = (dispatch) => ({
  updateAddress: (data) => dispatch(updateAddress(data)),
  updateCurrentAddress: (data) => dispatch(updateCurrentAddress(data)),
  updateCurrentLat: (data) => dispatch(updateCurrentLat(data)),
  updateCurrentLng: (data) => dispatch(updateCurrentLng(data)),
  currentTag: (data) => dispatch(currentTag(data)),
  updateRestaurants: (data) => dispatch(updateRestaurants(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
