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

export default class EditNote extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.route.params.id,
      selectedCategory: this.props.route.params.category,
      titleText: this.props.route.params.title,
      descText: this.props.route.params.desc,
    };
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
          defaultValue={this.props.route.params.title}
          value={this.state.titleText}
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
          defaultValue={this.props.route.params.desc}
          value={this.state.descText}
          onChangeText={(text) => {
            this.setState({
              descText: text,
            });
          }}
        />
        <Picker
          // style={styles.picker}
          selectedValue={this.state.selectedCategory}
          onValueChange={(itemValue, itemIndex) =>
            this.changeCategory(itemValue)
          }
        >
          {/*    <Picker.Item label="AAA" value="a" />
           <Picker.Item label="BBB" value="a" />
           <Picker.Item label="CCC" value="a" /> */}
        </Picker>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            this.EditNote();
          }}
        >
          <Text style={styles.text}>Edit</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity
        style={styles.button}
        onPress={() => {
          this.checkKeys();
        }}
      >
        <Text style={styles.text}>check</Text>
      </TouchableOpacity> */}
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
