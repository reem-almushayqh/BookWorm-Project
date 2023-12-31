import { LinearGradient } from "expo-linear-gradient";
import { getAuth } from "firebase/auth";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { db } from "../../config/firebase";

export default function Lists({ navigation }) {
  let [BookList, setBookList] = useState([]);
  let [BookFavList, setBookFavList] = useState([]);
  let [BookWishList, setBookWishList] = useState([]);
  let [CustomeList, setCustomeLists] = useState([]);
  let [numberOfBook, setNumberOfBook] = useState(0);
  const Datacat = (str, num) => {
    if (str.length > num) {
      return str.substring(0, num) + "...";
    }
    return str;
  };
  let GetBookList = async () => {
    try {
      let list = [];
      const Auth = getAuth();
      Auth.onAuthStateChanged(async (user) => {
        const db = getFirestore();
        const q = query(
          collection(db, "readBookList"),
          where("favouriteUserId", "==", user.uid)
        );
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          querySnapshot.forEach((doc) => {
            let book = doc.data();
            book.readId = doc.id;
            book.listed = true;
            list.push(book);
          });
          setNumberOfBook(list.length);
          setBookList(list);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };
  let GetBookFavList = async () => {
    try {
      let list = [];
      const Auth = getAuth();
      Auth.onAuthStateChanged(async (user) => {
        const db = getFirestore();

        const q = query(
          collection(db, "favoriteList"),
          where("favouriteListUserId", "==", user.uid)
        );
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          querySnapshot.forEach((doc) => {
            let book = doc.data();
            book.listedInFav = true;
            book.favriteId = doc.id;
            list.push(book);
          });
          setBookFavList(list);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };
  let GetBookWishList = async () => {
    try {
      let list = [];
      const Auth = getAuth();
      Auth.onAuthStateChanged(async (user) => {
        const db = getFirestore();

        const q = query(
          collection(db, "wishList"),
          where("wishListUserId", "==", user.uid)
        );
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          querySnapshot.forEach((doc) => {
            let book = doc.data();
            book.listedInWish = true;
            list.push(book);
          });
          setBookWishList(list);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  let GetAddList = async () => {
    setCustomeLists([]);

    try {
      let lists = [];
      const Auth = getAuth();
      Auth.onAuthStateChanged(async (user) => {
        const db = getFirestore();
        console.log(user.uid);
        const q = query(
          collection(db, "CustomLists"),
          where("List_user_mail", "==", user.email)
        );
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          lists = [];
          querySnapshot.forEach((doc) => {
            let list = doc.data();
            console.log(list);
            lists.push(list);
          });
          setCustomeLists(lists);
        } else {
          setCustomeLists([]);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };
  let OpenInfo = async (val) => {
    const colRef = doc(db, "Book", val.id);
    const snapshot = await getDoc(colRef);
    let book = snapshot.data();
    book.id = val.id;
    console.log(book);
    navigation.navigate("BookInfo", book);
  };
  useEffect(() => {
    navigation.addListener("focus", () => {
      GetBookList();
      GetBookFavList();
      GetBookWishList();
      GetAddList();
    });
  }, []);

  useEffect(() => {
    GetAddList();
  }, []);

  let DeleteReadBookList = async (val) => {
    await deleteDoc(doc(db, "readBookList", val.readId));
    GetBookList();
    Alert.alert("the book got deleted");
  };

  let DeleteFavoriteBookList = async (val) => {
    await deleteDoc(doc(db, "favoriteList", val.favriteId));
    GetBookFavList();
    Alert.alert("the book got deleted");
  };
  let DeleteWishBookList = async (val) => {
    await deleteDoc(doc(db, "wishList", val.wishId));
    GetBookWishList();
    Alert.alert("the book got deleted");
  };
  const DeleteFunc = (message, func, val) =>
    Alert.alert(
      message,
      "Are sure you want to delete",
      [
        {
          text: "Cancel",
          //  onPress: () => Alert.alert("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => func(val),
          style: "cancel",
        },
      ],
      {
        cancelable: true,
        onDismiss: () =>
          Alert.alert(
            "This alert was dismissed by tapping outside of the alert dialog."
          ),
      }
    );
  //console.log(BookList, "========>bookList");
  return (
    <ScrollView
      style={{
        backgroundColor: "#FFF",
        flex: 1,
      }}
    >
      <View
        style={{
          backgroundColor: "#00a46c",
          height: "5%",
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
          paddingHorizontal: 20,
          marginBottom: 15,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 25,
            width: "100%",
          }}
        >
          <View style={{ width: "70%" }}>
            <Text
              style={{
                fontSize: 21,
                color: "#FFF",
                fontWeight: "bold",
              }}
            >
              You have read {numberOfBook} books
            </Text>
          </View>
          <View style={{ width: "30%" }}>
            <MaterialIcons
              name="settings"
              size={30}
              style={{
                color: "white",
                position: "absolute",
                right: 10,

              }}
              onPress={() => {
                navigation.navigate("EditListPrivacy");
              }}
            />
          </View>
        </View>
      </View>

      <View
        style={{
          flexDirection: "row",
          paddingHorizontal: 20,
          width: "100%",
          alignItems: "center",
        }}
      >
        <View style={{ width: "50%" }}>
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 17,
              color: "#585a61",
            }}
          >
            Read Books
          </Text>
        </View>
        <View style={{ width: "50%", alignItems: "flex-end" }}>
          <TouchableOpacity
            onPress={() => navigation.navigate("ReadBookList", BookList)}
          >
            <View
              style={{
                backgroundColor: "#00a46c",
                paddingHorizontal: 20,
                paddingVertical: 5,
                borderRadius: 15,
              }}
            >
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 13,
                  color: "#FFF",
                }}
              >
                View all
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={true}
        style={{ height: 320 }}
      >
        <LinearGradient
          colors={["rgba(0,164,109,0.09)", "transparent"]}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            height: 100,
            marginTop: 220,
            top: 0,
            width: 9999,
          }}
        />
        {BookList.length > 0 ? (
          BookList.map((val, ind) => (
            <View key={ind}>
              <MaterialIcons
                name="close"
                size={30}
                style={{
                  color: "black",
                  marginTop: 30,
                  marginLeft: 10,
                  position: "absolute",
                  left: 10,
                  zIndex: 1,
                }}
                onPress={() =>
                  DeleteFunc(
                    "Deleting From Read List ",
                    DeleteReadBookList,
                    val
                  )
                }
              />
              <TouchableOpacity
                key={ind}
                onPress={() => OpenInfo(val)}
                style={{
                  height: 250,
                  elevation: 2,
                  backgroundColor: "#FFF",
                  marginLeft: 20,
                  marginTop: 20,
                  borderRadius: 15,
                  marginBottom: 10,
                  width: 160,
                }}
                disabled={val.deleted}
              >
                {val.deleted && (
                  <View
                    style={{
                      position: "absolute",
                      zIndex: 1,
                      alignSelf: "center",
                      width: 160,
                      opacity: 0.6,
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: "#525454",
                      height: 250,
                    }}
                  >
                    <Text
                      style={{
                        color: "white",
                        textAlign: "center",
                        fontWeight: "bold",
                        // backgroundColor: "black",
                      }}
                    >
                      DELETED
                    </Text>
                  </View>
                )}

                <Image
                  source={{ uri: val.poster }}
                  style={{ width: "100%", height: 200 }}
                />
                <View
                  style={{
                    flexDirection: "row",
                    paddingTop: 10,
                    paddingHorizontal: 10,
                  }}
                >
                  <Text
                    style={{
                      fontWeight: "bold",
                    }}
                  >
                    {Datacat(val.title, 25)}
                    {"\n"}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <Text
            style={{
              //  flex: 1,
              //textAlign: "center",
              marginTop: -10, ////////////////////////////////////////
              marginLeft: 130, ////////////////////////////////////////
              fontSize: 15,
              fontWeight: "bold",
              color: "grey",
              alignSelf: "center",
            }}
          >
            Book List Is Empty
          </Text>
        )}
      </ScrollView>

      <View
        style={{
          flexDirection: "row",
          paddingHorizontal: 20,
          width: "100%",
          alignItems: "center",
        }}
      >
        <View style={{ width: "50%" }}>
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 17,
              color: "#585a61",
            }}
          >
            Favorite Books
          </Text>
        </View>
        <View style={{ width: "50%", alignItems: "flex-end" }}>
          <TouchableOpacity
            onPress={() => navigation.navigate("FavoriteList", BookFavList)}
          >
            <View
              style={{
                backgroundColor: "#00a46c",
                paddingHorizontal: 20,
                paddingVertical: 5,
                borderRadius: 15,
              }}
            >
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 13,
                  color: "#FFF",
                }}
              >
                View all
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={true}
        style={{ height: 320 }}
      >
        <LinearGradient
          colors={["rgba(0,164,109,0.09)", "transparent"]}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            height: 100,
            marginTop: 220,
            top: 0,
            width: 9999,
          }}
        />
        {BookFavList.length > 0 ? (
          BookFavList.map((val, ind) => (
            <View key={ind}>
              <MaterialIcons
                name="close"
                size={30}
                style={{
                  color: "black",
                  marginTop: 30,
                  marginLeft: 10,
                  position: "absolute",
                  left: 10,
                  zIndex: 1,
                }}
                onPress={() =>
                  DeleteFunc(
                    "Deleting From Favorite Book List ",
                    DeleteFavoriteBookList,
                    val
                  )
                }
              />
              <TouchableOpacity
                key={ind}
                onPress={() => OpenInfo(val)}
                style={{
                  height: 250,
                  elevation: 2,
                  backgroundColor: "#FFF",
                  marginLeft: 20,
                  marginTop: 20,
                  borderRadius: 15,
                  marginBottom: 10,
                  width: 160,
                }}
                disabled={val.deleted}
              >
                {val.deleted && (
                  <View
                    style={{
                      position: "absolute",
                      zIndex: 1,
                      alignSelf: "center",
                      width: 160,
                      opacity: 0.6,
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: "#525454",
                      height: 250,
                    }}
                  >
                    <Text
                      style={{
                        color: "white",
                        textAlign: "center",
                        fontWeight: "bold",
                        // backgroundColor: "black",
                      }}
                    >
                      DELETED
                    </Text>
                  </View>
                )}

                <Image
                  source={{ uri: val.poster }}
                  style={{ width: "100%", height: 200 }}
                />
                <View
                  style={{
                    flexDirection: "row",
                    paddingTop: 10,
                    paddingHorizontal: 10,
                  }}
                >
                  <Text
                    style={{
                      fontWeight: "bold",
                    }}
                  >
                    {Datacat(val.title, 25)}
                    {"\n"}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <Text
            style={{
              //  flex: 1,
              //textAlign: "center",
              marginTop: -10, ////////////////////////////////////////
              marginLeft: 130, ////////////////////////////////////////
              fontSize: 15,
              fontWeight: "bold",
              color: "grey",
              alignSelf: "center",
            }}
          >
            Book List Is Empty
          </Text>
        )}
      </ScrollView>
      <View
        style={{
          flexDirection: "row",
          paddingHorizontal: 20,
          width: "100%",
          alignItems: "center",
        }}
      >
        <View style={{ width: "50%" }}>
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 17,
              color: "#585a61",
            }}
          >
            Wish Books
          </Text>
        </View>
        <View style={{ width: "50%", alignItems: "flex-end" }}>
          <TouchableOpacity
            onPress={() => navigation.navigate("WishList", BookWishList)}
          >
            <View
              style={{
                backgroundColor: "#00a46c",
                paddingHorizontal: 20,
                paddingVertical: 5,
                borderRadius: 15,
              }}
            >
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 13,
                  color: "#FFF",
                }}
              >
                View all
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={true}
        style={{ height: 320 }}
      >
        <LinearGradient
          colors={["rgba(0,164,109,0.09)", "transparent"]}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            height: 100,
            marginTop: 220,
            top: 0,
            width: 9999,
          }}
        />
        {BookWishList.length > 0 ? (
          BookWishList.map((val, ind) => (
            <View>
              <MaterialIcons
                name="close"
                size={30}
                style={{
                  color: "black",
                  marginTop: 30,
                  marginLeft: 10,
                  position: "absolute",
                  left: 10,
                  zIndex: 1,
                }}
                onPress={() =>
                  DeleteFunc(
                    "Deleting From Wish Book List ",
                    DeleteWishBookList,
                    val
                  )
                }
              />
              <TouchableOpacity
                key={ind}
                onPress={() => OpenInfo(val)}
                style={{
                  height: 250,
                  elevation: 2,
                  backgroundColor: "#FFF",
                  marginLeft: 20,
                  marginTop: 20,
                  borderRadius: 15,
                  marginBottom: 10,
                  width: 160,
                }}
                disabled={val.deleted}
              >
                {val.deleted && (
                  <View
                    style={{
                      position: "absolute",
                      zIndex: 1,
                      alignSelf: "center",
                      width: 160,
                      opacity: 0.6,
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: "#525454",
                      height: 250,
                    }}
                  >
                    <Text
                      style={{
                        color: "white",
                        textAlign: "center",
                        fontWeight: "bold",
                        // backgroundColor: "black",
                      }}
                    >
                      DELETED
                    </Text>
                  </View>
                )}

                <Image
                  source={{ uri: val.poster }}
                  style={{ width: "100%", height: 200 }}
                />
                <View
                  style={{
                    flexDirection: "row",
                    paddingTop: 10,
                    paddingHorizontal: 10,
                  }}
                >
                  <Text
                    style={{
                      fontWeight: "bold",
                    }}
                  >
                    {Datacat(val.title, 25)}
                    {"\n"}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <Text
            style={{
              //  flex: 1,
              //textAlign: "center",
              marginTop: -10, ////////////////////////////////////////
              marginLeft: 130, ////////////////////////////////////////
              fontSize: 15,
              fontWeight: "bold",
              color: "grey",
              alignSelf: "center",
            }}
          >
            Book List Is Empty
          </Text>
        )}
      </ScrollView>

      <View
        style={{
          flexDirection: "row",
          paddingHorizontal: 20,
          width: "100%",
          alignItems: "center",
        }}
      >
        <View style={{ width: "50%" }}>
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 17,
              color: "#585a61",
            }}
          >
            My Custom Lists
          </Text>
        </View>
        <View style={{ width: "50%", alignItems: "flex-end" }}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("CreateCustomList");
            }}
          >
            <View
              style={{
                backgroundColor: "#00a46c",
                paddingHorizontal: 20,
                paddingVertical: 5,
                borderRadius: 15,
              }}
            >
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 13,
                  color: "#FFF",
                }}
              >
                Create new
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={true}
        style={{ height: 320 }}
      >
        <LinearGradient
          colors={["rgba(0,164,109,0.09)", "transparent"]}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            height: 50,
            marginTop: 180,
            top: 0,
            width: 9999,
          }}
        />
        {CustomeList.length > 0 ? (
          CustomeList.map((val, ind) => (
            <View key={ind}>
              {/* <MaterialIcons
                name="delete"
                size={30}
                style={{
                  color: "red",
                  marginTop: 30,
                  marginLeft: 10,
                  position: "absolute",
                  left: 10,
                  zIndex: 1,
                }}
                onPress={() =>
                  DeleteFunc(
                    "Deleting From Read List ",
                    DeleteReadBookList,
                    val
                  )
                }
              /> */}
              <TouchableOpacity
                key={ind}
                onPress={() => navigation.navigate("ViewCustomeLists", val)}
                style={{
                  height: 100,
                  elevation: 2,
                  backgroundColor: "rgba(0,164,109,0.09)",
                  marginLeft: 20,
                  marginTop: 50,
                  borderRadius: 15,
                  marginBottom: 10,
                  width: 160,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    paddingTop: 10,
                    paddingHorizontal: 10,
                  }}
                >
                  <Text
                    style={{
                      fontWeight: "bold",
                      fontSize: 22,
                      color: "#585a61",
                      textAlign: "center",
                    }}
                  >
                    {Datacat(val.ListName, 25)}
                    {"\n"}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <Text
            style={{
              //  flex: 1,
              //textAlign: "center",
              marginTop: -10, ////////////////////////////////////////
              marginLeft: 75, ////////////////////////////////////////
              fontSize: 15,
              fontWeight: "bold",
              color: "grey",
              alignSelf: "center",
            }}
          >
            You do not have custom lists
          </Text>
        )}
      </ScrollView>
    </ScrollView> //for all the page
  );
}
