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
import { TextInput } from "react-native-gesture-handler";

class Notes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notes: [],
      filterText: "",
      actualnotes: [],
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
    if (ids === null) ids = [];
    let notes = [];
    for (let id of ids) {
      let note = await this.getItem(id);
      notes.push(JSON.parse(note));
    }
    this.setState({ notes: notes, actualnotes: notes });
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
  async filterNotes(text) {
    console.log("FILTER TEXT", text);
    if (text === "") {
      this.setState(({ notes }) => ({
        actualnotes: notes,
      }));
    } else {
      this.setState({
        actualnotes: this.state.notes.filter((n) => {
          return (
            n.title.includes(text) ||
            n.desc.includes(text) ||
            n.category.includes(text)
          );
        }),
      });
    }
    this.setState({ filterText: text });
  }

  render() {
    let notes = this.state.actualnotes;
    console.log("render notes:", notes);
    const renderItem = ({ item }) => {
      return (
        <TouchableOpacity
          style={{ ...styles.note, backgroundColor: item.color }}
          onLongPress={() => this.showAlert(item.id)}
          onPress={() => {
            this.props.navigation.navigate("EditNote", {
              id: item.id,
              title: item.title,
              desc: item.desc,
              category: item.category,
              color: item.color,
              date: item.date,
            });
          }}
        >
          <View style={styles.badge}>
            <Text key="cat" style={styles.badgeText}>
              {item.category}
            </Text>
          </View>
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
        <TextInput
          ref={(input) => {
            this.filterInput = input;
          }}
          style={styles.input}
          underlineColorAndroid="#666699"
          placeholder="Filter..."
          placeholderTextColor="white"
          value={this.state.filterText}
          onChangeText={(text) => {
            this.filterNotes(text);
          }}
        />
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
    paddingTop: 10,
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
  badge: {
    flexDirection: "row",
  },
  badgeText: {
    padding: 7,
    borderRadius: 12,
    backgroundColor: "#333350",
    color: "#fff",
    textAlign: "center",
  },
  input: {
    textAlign: "center",
    height: 60,
    width: 240,
    alignSelf: "center",
    color: "white",
  },
});

export default Notes;
