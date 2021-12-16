import * as React from "react";
import {
  Image,
  StyleSheet,
  Text,
  Alert,
  TouchableOpacity,
  Touchable,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
  createDrawerNavigator,
} from "@react-navigation/drawer";
import { Octicons } from "@expo/vector-icons";
import AddNote from "./components/AddNote";
import Notes from "./components/Notes";
import AddCategory from "./components/AddCategory.js";
import EditNote from "./components/EditNote.js";
import Settings from "./components/Settings.js";
let navigator;
const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <NavigationContainer style={styles.container}>
      <Drawer.Navigator
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          drawerStyle: {
            backgroundColor: "#baace8",
          },
          drawerLabelStyle: {
            color: "white",
          },
          drawerActiveBackgroundColor: "#242652",
        }}
      >
        <Drawer.Screen
          name="Notes"
          component={Notes}
          options={{
            ...headerStyles,
            headerRight: () => (
              <TouchableOpacity
                onPress={() => {
                  navigator.navigation.navigate("Settings");
                }}
                style={styles.kebab}
              >
                <Octicons name="kebab-vertical" size={24} color="white" />
              </TouchableOpacity>
            ),
          }}
        />
        <Drawer.Screen
          name="AddNote"
          component={AddNote}
          options={{
            ...headerStyles,
          }}
        />
        <Drawer.Screen
          name="AddCategory"
          component={AddCategory}
          options={{
            ...headerStyles,
          }}
        />
        <Drawer.Screen
          name="EditNote"
          component={EditNote}
          options={{
            ...headerStyles,
          }}
        />
        <Drawer.Screen
          name="Settings"
          component={Settings}
          options={{
            ...headerStyles,
          }}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

function CustomDrawerContent(props) {
  navigator = props;
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItem
        label=""
        icon={() => (
          <Image
            style={styles.iconBig}
            source={require("./assets/pencil.png")}
          />
        )}
      />
      <DrawerItem
        label={() => <Text style={{ color: "white" }}>Notes</Text>}
        icon={() => (
          <Image
            style={styles.icon}
            source={require("./assets/clipboard.png")}
          />
        )}
        onPress={() => props.navigation.navigate("Notes")}
      />
      <DrawerItem
        label={() => <Text style={{ color: "white" }}>Add Note</Text>}
        icon={() => (
          <Image style={styles.icon} source={require("./assets/plus.png")} />
        )}
        onPress={() => props.navigation.navigate("AddNote")}
      />
      <DrawerItem
        label={() => <Text style={{ color: "white" }}>Add Category</Text>}
        icon={() => (
          <Image style={styles.icon} source={require("./assets/plus.png")} />
        )}
        onPress={() => props.navigation.navigate("AddCategory")}
      />
      <DrawerItem
        label={() => <Text style={{ color: "white" }}>info</Text>}
        icon={() => (
          <Image
            style={styles.icon}
            source={require("./assets/info-button.png")}
          />
        )}
        onPress={() => {
          Alert.alert(
            "Info",
            "app name: My Notes\nauthor: Maciej Bednarz\nversion: 3.0.0"
          );
        }}
      />
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#333350",
  },
  icon: {
    width: 30,
    height: 30,
  },
  iconBig: {
    width: 100,
    height: 100,
  },
  kebab: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignContent: "center",
  },
});

const headerStyles = {
  headerStyle: {
    backgroundColor: "#666699",
  },
  headerTintColor: "#fff",
  headerTitleStyle: {
    fontWeight: "bold",
  },
};
