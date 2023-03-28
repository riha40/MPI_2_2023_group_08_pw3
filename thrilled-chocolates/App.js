import * as React from 'react';
import { useEffect, useState } from 'react';
import { Text, View, StyleSheet} from 'react-native';
import Constants from 'expo-constants';
import { Card, Button, Dialog, Portal, Provider} from 'react-native-paper';
import MapView from 'react-native-maps';
import * as Location from 'expo-location';

export default function App() {
  const [location, setLocation] = useState(null);
  const [latitude, setLatitude] = useState (57.538900);
  const [longitude, setLongitude] = useState (25.425727);
  const [isLoading, setLoading] = useState(false);
  const [place, setPlace] = useState(null);
  const [country, setCountry] = useState(null);
  const [temperature, setTemperature] = useState(null);
  const [pressure, setPressure] = useState(null);
  const [humidity, setHumidity] = useState(null);
  const [description, setDescription] = useState(null);
  const [visible, setVisible] = React.useState(false);
  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);
  const API_KEY = '';
  const apiURL = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`;
  useEffect (() => {
  (async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.log('Permission to access location was denied');
      return;
    }
    let { coords } = await Location.getCurrentPositionAsync({});
    setLocation (coords);
    setLatitude (coords.latitude);
    setLongitude (coords.longitude);
  })(); }, []);
  const getweather = async () => {
  try {
    const response = await fetch(
      apiURL,
    );
    const json = await response.json();
    setPlace(json.name);
    setTemperature(json.main.temp);
    setPressure(json.main.pressure);
    setHumidity(json.main.humidity);
    setCountry(json.sys.country);
    setDescription(json.weather['0'].description);
    showDialog();
  } catch (error) {
    console.error(error);
    }
  };
  return (
    <View style={styles.container}>
      <Card>
        <MapView style={styles.map}
        showsUserLocation
        showsCompass
        initialRegion={{
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        />
        <View style={styles.button}>
          <Button
          icon="map"
          mode="contained"
            onPress = {() =>
              getweather ()
            }>
          Weather
          </Button>
        </View>
        <Provider>
        <View>
        <Portal>
          <Dialog visible={visible}>
            <Dialog.Title>Alert</Dialog. Title>
            <Dialog.Content>
              <Text variant="bodyMedium">Place: {place}, {country}</Text>
              <Text variant="bodyMedium">Latitude: {latitude}</Text>
              <Text variant="bodyMedium">Longitude: {longitude}</Text>
              <Text variant="bodyMedium">Temp: {temperature}°C</Text>
              <Text variant="bodyMedium">Pressure: {pressure} hPa</Text>
              <Text variant="bodyMedium">Humidity: {humidity}%</Text>
              <Text variant="bodyMedium">Description: {description}</Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={hideDialog}>Done</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>
      </Provider>
    </Card>
  </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
map: {
    width: '100%',
    height: '100%',
  },
  button: {
    position: 'absolute',
    paddingTop: Constants.statusBarHeight,
    left: 10,
    color: 'white',
    width: '50%'
  }
});
