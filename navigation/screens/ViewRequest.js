import { useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import Icon from "react-native-vector-icons/Ionicons";
//import BookInfo from "./BookInfo";
import { addDoc, collection, doc, getDoc, getDocs } from "firebase/firestore";

import { db } from "../../config/firebase";
import { withUser } from "../../config/UserContext";
// import db from ".";
function ViewRequest({ navigation, isAdmin }) {
  console.log("🚀 ~ isAdmin", isAdmin);
  const [catergoryIndex, setCategoryIndex] = useState(0);
  const [books, setBooks] = useState([]);
  const [allBooks, setAllBooks] = useState([]);

  const [url, setUrl] = useState("");
  const booksRef = collection(db, "Book");
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [addingBook, setAddingBook] = useState(false);

  const [searchIndex, setsearchIndex] = useState(0);
  const [loadingExtending, setLoadingExtending] = useState(false);

  const searchBooks = (bookName) => {
    setsearchIndex(0);
    setSearch(bookName);
    //console.log(bookName);
    setBooks([]);
    setLoading(true);
    const response = fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${bookName}&maxResults=40&startIndex=${searchIndex}`
    )
      .then((res) => res.json())
      .then((data) => {
        const books = data.items
          ? data.items.map((book) => {
              return {
                id: book.id,
                title: book.volumeInfo.title || "No title",
                author: book.volumeInfo.authors
                  ? book.volumeInfo.authors[0]
                  : "No Author",
                Description: book.volumeInfo.description || "No description",
                poster: book.volumeInfo.imageLinks
                  ? book.volumeInfo.imageLinks.thumbnail
                  : "",
                category: book.volumeInfo.categories
                  ? book.volumeInfo.categories[0]
                  : "No category",

                pdf: book.volumeInfo.previewLink
                  ? book.volumeInfo.previewLink
                  : "",
                exist: false,
              };
            })
          : [];

        // console.log(data);
        setBooks(books);
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  };

  const extendSearch = (bookName) => {
    setsearchIndex((prev) => prev + 40);
    console.log("🚀 ~ searchIndex", searchIndex);

    setLoadingExtending(true);
    const response = fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${bookName}&maxResults=40&startIndex=${
        searchIndex + 40
      }`
    )
      .then((res) => res.json())
      .then((data) => {
        const books = data.items
          ? data.items.map((book) => {
              return {
                id: book.id,
                title: book.volumeInfo.title || "No title",
                author: book.volumeInfo.authors
                  ? book.volumeInfo.authors[0]
                  : "No Author",
                Description: book.volumeInfo.description || "No description",
                poster: book.volumeInfo.imageLinks
                  ? book.volumeInfo.imageLinks.thumbnail
                  : "",
                category: book.volumeInfo.categories
                  ? book.volumeInfo.categories[0]
                  : "No category",

                pdf: book.volumeInfo.previewLink
                  ? book.volumeInfo.previewLink
                  : "",
                exist: false,
              };
            })
          : [];

        // console.log(data);
        setBooks((prev) => [...prev, ...books]);
      })
      .catch((err) => console.log(err))
      .finally(() => setLoadingExtending(false));
  };

  const getBook = async (bookId) => {
    const docRef = doc(booksRef, bookId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      //console.log("Book data:", docSnap.data());
    } else {
      // doc.data() will be undefined in this case
      console.log("No such Book!");
    }
  };

  // check if book exists in db by title and author
  const checkBook = async (book) => {
    // console.log("🚀 ~ book", book.title);

    const bookRef = collection(db, "Book");
    const bookSnap = await getDocs(bookRef);
    const books = bookSnap.docs.map((doc) => doc.data());
    const bookExists = books.find(
      (b) => b.title === book.title && b.author === book.author
    );
    // console.log("🚀 ~ bookExists", bookExists);

    const status = bookExists ? true : false;
    // console.log("🚀 ~ status", status);

    return status;
  };

  const addBook = async (book) => {
    setAddingBook(true);
    // console.log("🚀 ~ book", book);

    checkBook(book)
      .then((bookExists) => {
        if (bookExists) {
          showToast("error", Datacat(book.title, 35) + " already exists ❌");
          console.log("already");
          setAddingBook(false);
        } else {
          const bookRef = collection(db, "Book");
          addDoc(bookRef, book)
            .then((docRef) => {
              console.log("Document written with ID: ", docRef.id);
              showToast(
                "success",
                Datacat(book.title, 35) + " added successfully ✅"
              );
              getBook(docRef.id);
            })
            .catch((error) => {
              console.error("Error adding document: ", error);
              showToast("error", "Error adding book ❌" + error);
            })
            .finally(() => setAddingBook(false));
        }
      })
      .catch((err) => {
        console.log("addBook > checkBook", err);
        showToast("error", "Error adding book ❌" + err);
        setAddingBook(false);
      });
  };

  const onEndReachedHandler = () => {
    if (!loadingExtending) {
      extendSearch(search);
    }
  };

  const categories = ["ALL", "ADULT", "ROMANCE"];
  const width1 = Dimensions.get("screen").width / 2 - 30;
  const hight1 = Dimensions.get("screen").height / 3 - 40;
  const hight2 = Dimensions.get("screen").height / 3 - 20;
  const width2 = Dimensions.get("screen").width / 2.5 - 20;
  const Datacat = (str, num) => {
    if (str?.length > num) {
      return str?.substring(0, num) + "...";
    }
    return str;
  };

  const showToast = (status = "success", subText) => {
    status == "success"
      ? Toast.show({
          type: "success",
          text1: "Success",
          text2: subText ? subText : "Book has been added successfully ✅",
        })
      : Toast.show({
          type: "error",
          text1: "Error",
          text2: subText ? subText : "Book has not been added ❌",
        });
  };

  return (
    <>
      <SafeAreaView style={{ flex: 1 }}>
        <ImageBackground
          style={{ flex: 1 }}
          source={require("./222.jpg")}
          resizeMode="cover"
        >
          <View style={styles.searchContainer}>
            <Icon name="ios-search" size={20} style={{ marginRight: 10 }} />
            <TextInput
              placeholder="Search book by title"
              placeholderTextColor="#b1e5d3"
              onChangeText={(text) => searchBooks(text)}
              style={{
                fontWeight: "bold",
                fontSize: 18,
                width: 260,
              }}
            />
            <Text>{books.length}</Text>
            {/* <Text>{searchIndex}</Text> */}
          </View>

          <View>
            {books.length < 1 ? (
              loading ? (
                <Text
                  style={{
                    color: "#b1e5d3",
                    fontSize: 20,
                    fontWeight: "bold",
                    textAlign: "center",
                    marginTop: 20,
                  }}
                >
                  Loading...
                </Text>
              ) : (
                <View>
                  <Text
                    style={{
                      marginTop: 200,
                      fontSize: 30,
                      color: "grey",
                      fontWeight: "bold",
                      alignItems: "center",
                    }}
                  >
                    No books found! {"\n"}
                    Please, Type a word to search books by title{"\n"}
                    From google books API
                  </Text>
                </View>
              )
            ) : (
              <>
                {search ? (
                  <View style={styles.booksContainer}>
                    <FlatList
                      columnWrapperStyle={{ justifyContent: "space-between" }}
                      numColumns={2}
                      data={books}
                      keyExtractor={(item) => item.title + item.author}
                      onEndReached={onEndReachedHandler}
                      onEndReachedThreshold={0.7}
                      ListFooterComponent={
                        loadingExtending ? (
                          <ActivityIndicator
                            size="large"
                            color="#b1e5d3"
                            style={{ marginTop: 20 }}
                          />
                        ) : null
                      }
                      renderItem={({ item }) => {
                        // console.log("🚀 ~ item", item);
                        // const status = checkBook(item).then((st) => st);
                        // console.log("🚀 ~ status", status);

                        return (
                          //  restUrl(item.data.poster)
                          <View
                            style={{
                              width: width1,
                              height: hight1,
                              margin: 1,
                              marginBottom: 10,
                            }}
                          >
                            <View style={styles.card}>
                              <TouchableOpacity
                                onPress={() =>
                                  navigation.navigate(
                                    isAdmin ? "BookInfoApi" : "BookInfo",
                                    item
                                  )
                                }
                              >
                                <Image
                                  style={styles.container}
                                  source={
                                    item.poster
                                      ? { uri: item.poster }
                                      : require("./222.jpg")
                                  }
                                />
                                <Text>
                                  <Text
                                    style={{
                                      textAlign: "center",
                                      fontWeight: "bold",
                                      fontSize: 12,
                                      //margin: 10,
                                    }}
                                  >
                                    {Datacat(item?.title, 17)}
                                    {"\n"}
                                  </Text>
                                  <Text
                                    style={{
                                      textAlign: "left",
                                      color: "grey",
                                      fontSize: 9,
                                    }}
                                  >
                                    By:
                                    {Datacat(item?.author, 19)} {"\n"}{" "}
                                  </Text>
                                </Text>
                              </TouchableOpacity>
                              <TouchableNativeFeedback
                                style={styles.flexRow}
                                onPress={
                                  addingBook ? null : () => addBook(item)
                                }
                              >
                                <View style={styles.addButton}>
                                  {addingBook ? (
                                    <ActivityIndicator
                                      size="small"
                                      color="#fff"
                                    />
                                  ) : (
                                    <>
                                      <Icon
                                        name="add"
                                        size={20}
                                        style={{
                                          color: "#fff",
                                        }}
                                      />
                                      <Text style={styles.addText}>
                                        {"Add"}
                                      </Text>
                                    </>
                                  )}
                                </View>
                              </TouchableNativeFeedback>
                            </View>
                          </View>
                        );
                      }} //here i want my data
                    />
                  </View>
                ) : (
                  <View>
                    <Text
                      style={{
                        marginTop: 200,
                        fontSize: 30,
                        color: "grey",
                        fontWeight: "bold",
                        //  marginLeft: 120,
                        alignItems: "center",
                      }}
                    >
                      No books found! {"\n"}
                      Please, Type a word to search books by title{"\n"}
                      From google books API
                    </Text>
                  </View>
                )}
              </>
            )}
          </View>
        </ImageBackground>
      </SafeAreaView>

      <Toast position="bottom" onPress={() => Toast.hide()} />
    </>
  );
}

export default withUser(ViewRequest);

const styles = StyleSheet.create({
  container: {
    height: "68%",
    width: "95%",
    borderRadius: 1,
    resizeMode: "stretch",
    justifyContent: "center",
    shadowColor: "black",
    shadowOpacity: 0.9,
    shadowOffset: {
      width: 2,
      height: 8,
    },
    alignSelf: "center",
  },
  oneBook: {
    height: 140,
    justifyContent: "center",
    width: 350,
    backgroundColor: "lightgrey",
    borderRadius: 25,
    margin: 50,
    alignItems: "center",
  },
  card: {
    height: "100%",
    width: "90%",
    backgroundColor: "#EDF5F0",
    borderRadius: 10,
    borderColor: "#00a46c",
    borderWidth: 0.2,
    padding: 10,
    margin: 5,
    marginBottom: 10,
    marginHorizontal: 5,
  },
  categoryContainer: {
    flexDirection: "row",
    margin: 10,
    justifyContent: "space-between",
    flex: 1,
  },
  categoryText: { fontSize: 15, color: "grey", fontWeight: "bold" },
  categoryTextSelected: {
    color: "green",
    paddingBottom: 5,
    borderBottomWidth: 2,
  },
  booksContainer: {
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 10,
    marginTop: 25,
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#00a46c",
    borderWidth: 0.6,
    marginBottom: 75,
  },
  searchContainer: {
    backgroundColor: "#FFF",
    // D0ECDF
    paddingVertical: 8,
    paddingHorizontal: 20,
    marginHorizontal: 20,
    borderRadius: 15,
    marginTop: 25,
    marginBottom: -10,
    flexDirection: "row",
    alignItems: "center",
    borderColor: "black",
    borderWidth: 0.2,
  },
  addButton: {
    flex: 1,

    flexDirection: "row",
    width: 100,
    height: 40,

    backgroundColor: "#00a46c",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    padding: 10,

    marginTop: -5,

    addText: {
      color: "#fff",
      fontSize: 15,
      fontWeight: "bold",
    },

    flexRow: {
      flexDirection: "row",
      alignItems: "center",
    },
  },
});
