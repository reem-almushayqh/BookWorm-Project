import React from "react";
import {
  Button,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function AddBookAPI() {
  return (
    <ScrollView>
      <Image
        style={{ height: "100%", width: "100%", position: "absolute" }}
        source={require("../screens/222.jpg")}
      />
      <View style={styles.container}>
        <View
          style={{
            width: "100%",
            height: 40,
            paddingHorizontal: 20,
          }}
        >
          <Text style={{ fontSize: 22 }} onPress={() => navigation.goBack()}>
            Back
          </Text>
        </View>
        <Text style={[styles.title, styles.leftTitle]}>Add new Book</Text>
        <Text style={{ color: "red" }}>{value?.error}</Text>

        <View style={styles.InputContainer}>
          <View style={styles.InputContainer}>
            <Text style={styles.textD}>Search a Book</Text>
            <TextInput
              multiline={true}
              style={styles.body}
              //onChangeText={}
              underlineColorAndroid="transparent"
            />
          </View>

          <View style={styles.buttonCont}>
            <Button
              title="Add Book"
              color="#B1D8B7"
              //onPress={} //
            ></Button>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //justifyContent: "center",
    //alignItems: "center",
  },
  title: {
    fontWeight: "bold",
    alignSelf: "center",
    fontSize: 35,
    marginTop: 20,
    marginBottom: 20,
  },
  body: {
    borderWidth: 1,
    borderRadius: 50,
    padding: 10,
    margin: 12,
    width: 350,
    height: 42,
    paddingLeft: 20,
    paddingRight: 20,
    alignSelf: "center",
  },
  buttonCont: {
    margin: 20,
    padding: 5,
    width: 250,
    alignSelf: "center",
    borderRadius: 50,
    //backgroundColor: "#B1D8B7",
  },
  InputContainer: {
    fontSize: 50,
  },
  textD: {
    marginLeft: 40,
  },
});
