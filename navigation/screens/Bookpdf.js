import * as React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Platform,
  StatusBar,
  ScrollView,
  Image,
  Dimensions,
  Button,
  Alert,
  ImageBackground,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
//import { LinearGradient } from "expo-linear-gradient";
//import PDFView from "react-native-view-pdf/lib/index";
//import PDFReader from "rn-pdf-reader-js";
//import Pdf from "react-native-pdf";
import { WebView } from "react-native-webview";

export default function Bookpdf({ route, navigation }) {
  const book = route.params;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Icon
        name="arrow-back-outline"
        size={40}
        style={{ color: "black", marginTop: 30, marginLeft: 10 }}
        onPress={() => navigation.navigate("Home")}
      />
      <WebView
        source={{
          uri: "https://firebasestorage.googleapis.com/v0/b/group16-de98b.appspot.com/o/suzanne-collins-catching-fire.pdf?alt=media&token=80d4681c-4df3-4818-b85f-1d3a70bb0614",
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  buttonCont: {
    marginLeft: 220,
    width: 250,
    borderWidth: 1,
    borderRadius: 50,
    marginBottom: 10,
    backgroundColor: "white",
    height: 40,
    width: 180,
  },
  pdf2: {
    marginLeft: 10,
  },
});