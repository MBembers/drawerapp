import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
  FlatList,
} from "react-native";
import * as SecureStore from "expo-secure-store";

class Notes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notes: [],
    };
    this.getNotes();
    this.props.navigation.addListener("focus", () => {
      this.getNotes();
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
  async getNotes() {
    let ids = await this.getItem("ids");
    ids = JSON.parse(ids);
    let notes = [];
    for (let id of ids) {
      let note = await this.getItem(id);
      notes.push(JSON.parse(note));
    }
    this.setState({ notes: notes });
  }

  showAlert(delid) {
    Alert.alert(
      "Delete note?",
      "This action is irreversible",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: async () => {
            let ids = await this.getItem("ids");
            ids = JSON.parse(ids);
            await this.deleteItem(delid);
            await this.saveItem(
              "ids",
              JSON.stringify(ids.filter((id) => id != delid))
            );
            this.getNotes();
          },
          style: "cancel",
        },
      ],
      {
        cancelable: true,
      }
    );
  }

  render() {
    let notes = this.state.notes;
    console.log("render notes:", notes);
    const renderItem = ({ item }) => {
      return (
        <TouchableOpacity
          style={{ ...styles.note, backgroundColor: item.color }}
          onLongPress={() => this.showAlert(item.id)}
        >
          <Text key="date" style={{ ...styles.text, textAlign: "right" }}>
            {item.date}
          </Text>
          <Text key="title" style={{ ...styles.text, fontSize: 25 }}>
            {item.title}
          </Text>
          <Text key="desc" style={styles.text}>
            {item.desc}
          </Text>
        </TouchableOpacity>
      );
    };
    return (
      <View key="vvvvv" style={styles.container}>
        <FlatList
          style={styles.flatlist}
          data={notes}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#333350",
    padding: 15,
  },
  note: {
    padding: 15,
    margin: 10,
    width: 170,
    height: 170,
    color: "white",
    borderRadius: 8,
  },
  text: {
    fontSize: 17,
    color: "white",
  },
  flatlist: {},
});

export default Notes;
