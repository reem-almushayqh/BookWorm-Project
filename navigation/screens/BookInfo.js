import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  Button,
  SafeAreaView,
  ImageBackground,
  TextInput,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import StripeApp from "./StripeApp";
import { StripeProvider } from "@stripe/stripe-react-native";
import react from "react";
//import Map from './screens/Map';
//import Fetch from './src/Fetch';
//import {userSate,userEffect} from "react";
//import{collection, query,orderBy,onSanpshot,setDoc,doc,getDoc,getDocs} from "firebase/firestore";
//import{db} from "../../config/firebase";
export default function BookInfo({ route, navigation }) {
  const book = route.params;
  return (
    <View>
      <SafeAreaView>
        <ScrollView>
          <ImageBackground source={require("./222.jpg")} resizeMode="cover">
            <Icon
              name="arrow-back-outline"
              size={40}
              style={{ color: "black", marginTop: 30, marginLeft: 10 }}
              onPress={() => navigation.goBack()}
            />
            <View
              style={{
                //poster area
                // backgroundColor: "grey",
                alignItems: "center",
                alignSelf: "center",
                height: 360,
                width: 200,
                justifyContent: "center",
                margin: "5%",
                shadowColor: "black",
                shadowOpacity: 0.6,
                shadowOffset: {
                  width: 2,
                  height: 8,
                },
              }}
            >
              <Image
                source={{ uri: book.poster }}
                resizeMode="stretch"
                style={styles.imagePoster}
              />
            </View>

            <View
              style={{
                padding: 10,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#EDF5F0",

                borderTopRightRadius: 50,
                borderTopLeftRadius: 50,
                borderColor: "#00a46c",
                borderWidth: 0.7,
              }}
            >
              <Text
                style={{
                  flew: 1,
                  alignItems: "center",
                  justifyContent: "center",
                  paddingTop: 20,
                  paddingLeft: 10,
                  paddingRight: 10,
                  fontSize: "25%",
                  fontWeight: "bold",
                }}
              >
                {book.title}
              </Text>
              <Text
                style={{
                  flew: 1,
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: 9,
                  paddingLeft: 10,
                  paddingRight: 10,
                  fontSize: "15%",
                  fontWeight: "bold",
                  color: "grey",
                }}
              >
                by {book.author}
              </Text>

              <View style={{ flex: 1, flexDirection: "row", paddingTop: 10 }}>
                <Icon name="star" size={30} style={{ color: "gold" }} />
                <Icon name="star" size={30} style={{ color: "gold" }} />
                <Icon name="star" size={30} style={{ color: "gold" }} />
                <Icon name="star" size={30} style={{ color: "gold" }} />
                <Icon name="star-half" size={30} style={{ color: "gold" }} />
              </View>
              <Text style={{ fontWeight: "bold", alignSelf: "flex-start" }}>
                {"\n"}
                {"Book description: "}
              </Text>
              <Text>{book.Description}</Text>
              <Text style={{ fontWeight: "bold", alignSelf: "flex-start" }}>
                {"\n"}
                {"Book Details: "}
              </Text>
              <Text style={{ alignSelf: "flex-start" }}>
                {"ISBN:"}
                {book.ISBN}
                {"\n"}
                {"CATEGORY:"}
                {book.category}
                {"\n "}
              </Text>
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  borderRadius: 25,
                  backgroundColor: "#00a46c",
                  paddingHorizontal: 20,
                }}
              >
                <Text
                  style={{
                    fontWeight: "bold",
                    paddingBottom: 10,
                    fontSize: 18,
                  }}
                >
                  {"ADD TO LIST"}
                  <Icon name="add" size={36} style={{ color: "white" }} />
                </Text>
              </View>
              <Text>
                {"\n"}
                Review it
              </Text>
              <View style={{ flex: 1, flexDirection: "row", paddingTop: 10 }}>
                <Icon name="star-outline" size={36} style={{ color: "gold" }} />
                <Icon name="star-outline" size={36} style={{ color: "gold" }} />
                <Icon name="star-outline" size={36} style={{ color: "gold" }} />
                <Icon name="star-outline" size={36} style={{ color: "gold" }} />
                <Icon name="star-outline" size={36} style={{ color: "gold" }} />
              </View>

              <Text style={{ fontWeight: "bold", alignSelf: "flex-start" }}>
                {"\n"}
                Leave your comments and read other’s: {"\n"}
              </Text>
              <View
                style={{
                  backgroundColor: "white",
                  alignSelf: "center",
                  height: 70,
                  width: 250,
                }}
              >
                <TextInput
                  placeholder="comment"
                  underlineColorAndroid="transparent"
                  scrollEnabled
                />
              </View>
              <View>
                <TouchableOpacity
                  style={styles.fixToText}
                  onPress={() => navigation.navigate("StripeApp")}
                >
                  <Text>buy it here</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ImageBackground>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fixToText: {
    width: 90,
    height: 50,
    justifyContent: "center",
    alignContent: "center",
    borderRadius: 50,
    backgroundColor: "#00a46c",
    marginTop: 40,
    paddingLeft: 10,
  },
  imagePoster: {
    width: "100%",
    height: "100%",
    marginTop: "40%",
    marginBottom: "67%",
  },
});
/*<TouchableOpacity
onPress={() => navigation.navigate("StripeApp")}
>
<Text>buy Here</Text>
</TouchableOpacity>*/