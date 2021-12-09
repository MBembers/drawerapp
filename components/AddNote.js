import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";
import * as SecureStore from "expo-secure-store";

class Addnote extends Component {
  constructor(props) {
    super(props);
    this.state = {
      titleText: "",
      descText: "",
    };
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
    if (ids === null) {
      ids = [];
      newId = "n1";
    } else {
      let idss = ids.map((id) => parseInt(id.slice(1)));
      newId = "n" + String(Math.max.apply(null, idss) + 1);
    }
    const today = new Date();
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    const saveDate = today.toLocaleDateString("pl-PL", options);
    let newNote = {
      id: newId,
      title: this.state.titleText,
      desc: this.state.descText,
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
});

export default Addnote;
