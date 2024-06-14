import { useState, useEffect } from "react";
import { Platform, Text, View, StyleSheet, Alert } from "react-native";
import * as Device from "expo-device";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";
import constants from "expo-constants";

type LatLng = {
  latitude: number;
  longitude: number;
};

type Region = LatLng & {
  latitudeDelta: number;
  longitudeDelta: number;
};

interface LocationType {
  location: Region;
  locationFix: any;
  mocked: boolean | undefined;
}

export default function HomeScreen() {
  const [state, setState] = useState<LocationType>({
    location: {
      latitude: 37.78825,
      longitude: -122.4324,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
    },
    locationFix: null,
    mocked: true,
  });

  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.log("Permission to access location was denied");
      return;
    }
    await Location.hasServicesEnabledAsync();
    await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.Highest,
        timeInterval: 1,
      },
      async (point: any) => {
        const location = point.coords;
        const { mocked } = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Highest,
          timeInterval: 1,
        });
        setState({
          location: {
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          },
          locationFix: location,
          mocked: mocked,
        });
      }
    ).catch((error: any) => {
      console.log(error);
      return;
    });
  };

  useEffect(() => {
    getLocation();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.paragraph}>{state.mocked ? "Mocked" : "Real"}</Text>
      <MapView style={styles.map}>
        <Marker
          coordinate={{
            latitude: state.location.latitude,
            longitude: state.location.longitude,
          }}
          title="You are here"
          description="This is your current location"
        />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    marginTop: constants.statusBarHeight,
  },
  paragraph: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 10,
  },
  map: {
    width: "100%",
    height: "100%",
  },
});
