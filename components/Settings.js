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

export default class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fontSizes: ["small", "normal", "large"],
      selectedFontSize: "",
      sortings: ["newest to oldest", "oldest to newest"],
      selectedSorting: "",
    };
    this.getSettings();
  }
  async getSettings() {
    const settings = await this.getItem("settings");
    this.setState({
      selectedSorting: settings.sorting,
      selectedFontSize: settings.fontSize,
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
  async saveSettings() {
    let settings = {
      fontSize: this.state.selectedFontSize,
      sorting: this.state.selectedSorting,
    };
    await this.saveItem("settings", settings);
    this.props.navigation.navigate("Notes");
  }
  render() {
    return (
      <View style={styles.container}>
        <Picker
          style={styles.picker}
          selectedValue={this.state.selectedFontSize}
          onValueChange={(itemValue, itemIndex) =>
            this.setState({ selectedFontSize: itemValue })
          }
        >
          {this.state.fontSizes.map((c) => (
            <Picker.Item label={c} value={c} key={c} />
          ))}
        </Picker>
        <Picker
          style={styles.picker}
          selectedValue={this.state.selectedSorting}
          onValueChange={(itemValue, itemIndex) =>
            this.setState({ selectedSorting: itemValue })
          }
        >
          {this.state.sortings.map((c) => (
            <Picker.Item label={c} value={c} key={c} />
          ))}
        </Picker>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            this.saveSettings();
          }}
        >
          <Text style={styles.text}>Save settings</Text>
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
    color: "white",
    marginTop: 10,
    width: 240,
    backgroundColor: "#666699",
  },
});
