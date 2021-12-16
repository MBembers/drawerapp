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
  styles;
  constructor(props) {
    super(props);
    this.state = {
      notes: [],
      filterText: "",
      actualnotes: [],
      fontSize: "normal",
      sorting: "oldest to newest",
    };
    this.getNotes();
    this.props.navigation.addListener("focus", () => {
      this.getNotes();
    });
    this.styles = StyleSheet.create({
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
        overflow: "hidden",
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
    const settings = JSON.parse(await this.getItem("settings"));
    this.setState({
      notes: notes,
      actualnotes: notes,
      fontSize: settings.fontSize,
      sorting: settings.sorting,
    });
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
    console.log("sorting: ", this.state.sorting);
    notes = notes.sort((a, b) =>
      this.state.sorting === "oldest to newest"
        ? a.date - b.date
        : b.date - a.date
    );
    console.log("render notes:", notes);
    const fontsize =
      this.state.fontSize == "small"
        ? 15
        : this.state.fontSize == "normal"
        ? 17
        : 20;

    const renderItem = ({ item }) => {
      let dates = new Date(item.date);
      const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      dates = dates.toLocaleDateString("pl-PL", options);

      return (
        <TouchableOpacity
          style={{ ...this.styles.note, backgroundColor: item.color }}
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
          <View style={this.styles.badge}>
            <Text key="cat" style={this.styles.badgeText}>
              {item.category}
            </Text>
          </View>
          <Text
            key="date"
            style={{
              ...this.styles.text,
              textAlign: "right",
              fontSize: fontsize,
            }}
          >
            {dates}
          </Text>
          <Text
            key="title"
            style={{ ...this.styles.text, fontSize: fontsize + 5 }}
          >
            {item.title}
          </Text>
          <Text key="desc" style={{ ...this.styles.text, fontSize: fontsize }}>
            {item.desc}
          </Text>
        </TouchableOpacity>
      );
    };
    return (
      <View key="vvvvv" style={this.styles.container}>
        <TextInput
          ref={(input) => {
            this.filterInput = input;
          }}
          style={this.styles.input}
          underlineColorAndroid="#666699"
          placeholder="Filter..."
          placeholderTextColor="white"
          value={this.state.filterText}
          onChangeText={(text) => {
            this.filterNotes(text);
          }}
        />
        <FlatList
          style={this.styles.flatlist}
          data={notes}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
        />
      </View>
    );
  }
}

export default Notes;
