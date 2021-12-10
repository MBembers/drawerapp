import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as SecureStore from "expo-secure-store";

export default class AddCategory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      category: "",
    };
    this.fetchCategories();
    this.props.navigation.addListener("focus", () => {
      this.fetchCategories();
    });
  }
  async saveItem(key, value) {
    await SecureStore.setItemAsync(key, JSON.stringify(value));
  }

  async getItem(key) {
    return JSON.parse(await SecureStore.getItemAsync(key));
  }
  async deleteItem(key) {
    await SecureStore.deleteItemAsync(key);
  }
  async addCategory() {
    await this.fetchCategories();
    if (this.state.category === "" || this.state.category === " ") return;
    if (!this.state.categories.includes(this.state.category)) {
      let new_categories = this.state.categories;
      new_categories.push(this.state.category);
      await this.saveItem("categories", new_categories);
      await this.fetchCategories();
    }
  }
  async fetchCategories() {
    let categories = await this.getItem("categories");
    if (categories === null || categories.length === 0) {
      categories = [];
    }
    this.setState({ categories: categories });
    console.log("fetch categories: ", this.state.categories);
  }
  async deleteCategories() {
    await this.deleteItem("categories");
    await this.fetchCategories();
  }
  render() {
    return (
      <View style={styles.container}>
        <TextInput
          ref={(input) => {
            this.titleInput = input;
          }}
          style={{ ...styles.input, marginTop: 6 }}
          underlineColorAndroid="#666699"
          placeholder="Category name"
          placeholderTextColor="#ddd"
          onChangeText={(text) => {
            this.setState({
              category: text,
            });
          }}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            this.addCategory();
          }}
        >
          <Text style={styles.text}>Add</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            this.deleteCategories();
          }}
        >
          <Text style={styles.text}>DELETE ALL</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#333350",
  },
  input: {
    textAlign: "center",
    height: 60,
    width: 240,
    alignSelf: "center",
    color: "white",
  },
  button: {
    marginTop: 20,
    alignSelf: "center",
    textAlign: "center",
    width: 240,
    height: 50,
    backgroundColor: "#666699",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
  },
  text: {
    textAlign: "center",
    color: "white",
  },
  picker: {
    alignSelf: "center",
    marginTop: 10,
    width: 240,
    backgroundColor: "#fff",
  },
});
