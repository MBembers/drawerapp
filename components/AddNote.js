import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { Picker } from "@react-native-picker/picker";

class Addnote extends Component {
  constructor(props) {
    super(props);
    this.state = {
      titleText: "",
      descText: "",
      selectedCategory: "cat",
      categories: [],
    };

    this.fetchCategories();
    this.props.navigation.addListener("focus", () => {
      this.fetchCategories();
    });
  }
  async saveItem(key, value) {
    await SecureStore.setItemAsync(key, value);
  }

  async getItem(key) {
    return await SecureStore.getItemAsync(key);
  }

  async deleteItem(key) {
    await SecureStore.deleteItemAsync(key);
  }
  randomColor() {
    const colorsArray = ["#FA9893", "#A98CE0", "#8DDE6F", "#418EE0"];
    return colorsArray[Math.floor(Math.random() * colorsArray.length)];
  }
  async addNote() {
    if (this.state.titleText == "") return;
    let ids = await this.getItem("ids");
    ids = JSON.parse(ids);
    console.log("adding note / ids", ids);
    let newId = "";
    if (!ids || ids.length === 0) {
      ids = [];
      newId = "n1";
    } else {
      let idss = ids.map((id) => parseInt(id.slice(1)));
      newId = "n" + String(Math.max.apply(null, idss) + 1);
    }
    const today = Date.now();
    const saveDate = today;
    let newNote = {
      id: newId,
      title: this.state.titleText,
      desc: this.state.descText,
      category: this.state.selectedCategory,
      color: this.randomColor(),
      date: saveDate,
    };
    ids.push(newId);
    await this.saveItem("ids", JSON.stringify(ids));
    await this.saveItem(newId, JSON.stringify(newNote));
    this.titleInput.clear();
    this.descInput.clear();
    this.setState({ titleText: "", descText: "" });
    this.props.navigation.jumpTo("Notes");
  }

  async checkKeys() {
    let ids = await this.getItem("ids");
    ids = JSON.parse(ids);
    console.log("ids: ", ids);
    for (let id of ids) {
      await this.deleteItem(id);
      let note = await this.getItem(id);
      console.log("Note", note);
    }
    await this.deleteItem("ids");
  }

  changeCategory(category) {
    this.setState({ selectedCategory: category });
    console.log(this.state.selectedCategory);
  }
  async fetchCategories() {
    let categories = JSON.parse(await this.getItem("categories"));
    if (categories === null || categories.length === 0) {
      categories = [];
    }
    this.setState({ categories: categories });
    console.log("fetch categories: ", this.state.categories);
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
          placeholder="Title..."
          placeholderTextColor="white"
          onChangeText={(text) => {
            this.setState({
              titleText: text,
            });
          }}
        />
        <TextInput
          ref={(input) => {
            this.descInput = input;
          }}
          style={styles.input}
          underlineColorAndroid="#666699"
          placeholder="Desc..."
          placeholderTextColor="white"
          onChangeText={(text) => {
            this.setState({
              descText: text,
            });
          }}
        />
        <Picker
          style={styles.picker}
          selectedValue={this.state.selectedCategory}
          onValueChange={(itemValue, itemIndex) =>
            this.changeCategory(itemValue)
          }
        >
          {this.state.categories.map((c) => (
            <Picker.Item label={c} value={c} key={c} />
          ))}
        </Picker>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            this.addNote();
          }}
        >
          <Text style={styles.text}>Add</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            this.checkKeys();
          }}
        >
          <Text style={styles.text}>check</Text>
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

export default Addnote;
