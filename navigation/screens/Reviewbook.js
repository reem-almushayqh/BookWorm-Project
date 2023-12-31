import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import Icon from "react-native-vector-icons/Ionicons";
import { AirbnbRating, Rating } from "react-native-ratings";
import { doc, updateDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../../config/firebase";

export default function Reviewbook({ route, navigation }) {
  const book = route.params;
  const auth = getAuth();
  const user = auth.currentUser;

  let [review, setReview] = useState(0);
  let [comment, setComment] = useState("");

  let PostReview = async () => {
    let ReviewObj = {
      review,
      comment,
      commentuser: user.email,
      comenteuseruid: user.uid,
      time: new Date().toLocaleTimeString(),
      date: new Date().toLocaleDateString(),
    };

    let reviewArray = book.reviews ? book.reviews : [];
    reviewArray.push(ReviewObj);
    book.reviews = reviewArray;

    await updateDoc(doc(db, "Book", book.id), { reviews: reviewArray });
    navigation.navigate("BookInfo", book);
  };
  return (
    <SafeAreaView>
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.header}>
            <Icon
              name="arrow-back-outline"
              size={40}
              style={{ color: "black" }}
              onPress={() => navigation.goBack()}
            />
           <Text style={styles.bookTitle}>
              {" "}
              Add Review
              {"\n"} {book.title}{" "}
            </Text>
          </View>

          <View style={styles.bottomView}>
            <Rating
              startingValue={0}
              imageSize={35}
              fractions={20}
              showRating={true}
              jumpValue={0.5}
              onFinishRating={(res) => {
                console.log(res);
                setReview(res);
              }}
              starContainerStyle={{
                marginTop: 20,
              }}
            />
            <TextInput
              style={styles.review}
              placeholder="Write Comment Here......"
              multiline={true}
              onChangeText={(text) => setComment(text)}
            />
            <TouchableOpacity
              style={{
                borderRadius: 25,
                backgroundColor:
                  review === 0 || comment === "" ? "#aadecc" : "#00a46c",
                width: "48%",
                alignSelf: "center",
                marginTop: 30,
                marginBottom: 20,
                height: 50,
                alignItems: "center",
                justifyContent: "center",
              }}
              onPress={() => PostReview()}
              disabled={review === 0 || comment === "" ? true : false}
            >
              <Text
                style={{
                  fontWeight: "bold",
                  alignSelf: "center",
                  fontSize: 16,
                  color: "white",
                }}
              >
                Post Review
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: "2%",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    marginTop: 10,
    backgroundColor: "#00a46c",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingHorizontal: 20,
  },
  bookTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
    marginLeft: 10,
  },
  bottomView: {
    backgroundColor: "white",
    marginTop: 50,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginHorizontal: 10,
  },
  review: {
    // backgroundColor: "White",
    width: "90%",
    height: 200,
    borderRadius: 10,
    textAlignVertical: "top",
    borderWidth: 1,
    alignSelf: "center",
    padding: 10,
    marginTop: 30,
  },
});
