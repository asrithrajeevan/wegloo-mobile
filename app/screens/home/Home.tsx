import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import React, {useEffect, useRef, useState} from 'react';
import {
  Alert,
  Linking,
  PermissionsAndroid,
  Platform,
  Text,
  ToastAndroid,
  TouchableOpacity,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import useUsername from '~app/hooks/User';
import {useAppState} from '~app/state/AppState';

const Home: React.FC = () => {
  const setAuthenticated = useAppState(state => state.setAuthenticated);
  const setCurrentLatitude = useAppState(state => state.setCurrentLatitude);
  const setCurrentLongitude = useAppState(state => state.setCurrentLongitude);
  const setCurrentLocation = useAppState(state => state.setCurrentLocation);

  const watchId = useRef(null);

  const [forceLocation, setForceLocation] = useState(true);
  const [highAccuracy, setHighAccuracy] = useState(true);
  const [locationDialog, setLocationDialog] = useState(true);
  const [significantChanges, setSignificantChanges] = useState(false);
  const [observing, setObserving] = useState(false);
  const [foregroundService, setForegroundService] = useState(false);
  const [useLocationManager, setUseLocationManager] = useState(false);
  const [location, setLocation] = useState(null);
  const uid = auth()?.currentUser?.uid;
  const {userById} = useUsername();
  useEffect(() => {
    // userById();
    // getLocation();
    // updateUserId();
  }, []);

  const updateUserId = () => {
    firestore()
      .collection('users')
      .doc(uid)
      .update({
        id: uid,
      })
      .then(() => {
        console.log('User updated!');
      })
      .catch(e => {
        console.log('api createUser error', e);
      });
  };

  const hasLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      const hasPermission = await hasPermissionIOS();
      return hasPermission;
    }

    if (Platform.OS === 'android' && Platform.Version < 23) {
      return true;
    }

    const hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    if (hasPermission) {
      return true;
    }

    const status = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    if (status === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    }

    if (status === PermissionsAndroid.RESULTS.DENIED) {
      ToastAndroid.show(
        'Location permission denied by user.',
        ToastAndroid.LONG,
      );
    } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      ToastAndroid.show(
        'Location permission revoked by user.',
        ToastAndroid.LONG,
      );
    }

    return false;
  };

  const hasPermissionIOS = async () => {
    const openSetting = () => {
      Linking.openSettings().catch(() => {
        Alert.alert('Unable to open settings');
      });
    };
    const status = await Geolocation.requestAuthorization('whenInUse');

    if (status === 'granted') {
      return true;
    }

    if (status === 'denied') {
      Alert.alert('Location permission denied');
    }

    if (status === 'disabled') {
      Alert.alert(
        `Turn on Location Services to allow "Wegloo" to determine your location.`,
        '',
        [
          {text: 'Go to Settings', onPress: openSetting},
          {text: "Don't Use Location", onPress: () => {}},
        ],
      );
    }

    return false;
  };

  const getLocationUpdates = async () => {
    const hasPermission = await hasLocationPermission();

    if (!hasPermission) {
      return;
    }

    setObserving(true);

    watchId.current = Geolocation.watchPosition(
      position => {
        setLocation(position);
        console.log(position);
      },
      error => {
        setLocation(null);
        console.log(error);
      },
      {
        accuracy: {
          android: 'high',
          ios: 'best',
        },
        enableHighAccuracy: highAccuracy,
        distanceFilter: 0,
        interval: 5000,
        fastestInterval: 2000,
        forceRequestLocation: forceLocation,
        forceLocationManager: useLocationManager,
        showLocationDialog: locationDialog,
        useSignificantChanges: significantChanges,
      },
    );
  };

  const getLocation = async () => {
    const hasPermission = await hasLocationPermission();

    if (!hasPermission) {
      return;
    }

    // Geolocation.getCurrentPosition(
    //   (position) => {
    //     console.log("getCurrentPosition",position.coords.latitude)
    //          setLatitude(position.coords.latitude);
    //           setLongitude(position.coords.longitude)
    //           fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + position.coords.latitude + ',' + position.coords.longitude + '&key=' + Config.GOOGLE_MAPS_API_KEY)
    //           .then((response) => response.json())
    //           .then((responseJson) => {
    //               const address =JSON.stringify(responseJson);
    //             const  str = responseJson.results[3].formatted_address.replace(/,[^,]+$/, "")
    //             setAddress(str)
    //             const newRegion ={
    //               latitude: position.coords.latitude,
    //               longitude:position.coords.longitude,
    //               latitudeDelta: 0.05,
    //               longitudeDelta: 0.05
    //           }
    //               setNewRegion(newRegion)
    //               ref.current?.setAddressText(str);
    //           mapRef.current.animateToRegion(newRegion,1000)
    //           })
    //   })

    Geolocation.getCurrentPosition(
      position => {
        console.log(
          'currentposition123',
          position.coords.latitude,
          position.coords.longitude,
        );
        setCurrentLatitude(position.coords.latitude);
        setCurrentLongitude(position.coords.longitude);
        firestore()
          .collection('users')
          .doc(uid)
          .update({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            // location: str,
          })
          .then(() => {
            console.log('User updated!');
          })
          .catch(e => {
            console.log('api createUser error', e);
          });
        fetch(
          'https://maps.googleapis.com/maps/api/geocode/json?address=' +
            position.coords.latitude +
            ',' +
            position.coords.longitude +
            '&key=' +
            'AIzaSyBUgvzW8qDS5TQWLnxd3TmRbPAq5g0j7AE',
        )
          .then(response => response.json())
          .then(responseJson => {
            const address = JSON.stringify(responseJson);
            const str = responseJson.results[2].formatted_address.replace(
              /,[^,]+$/,
              '',
            );
            setCurrentLocation(str);
            console.log('location', str);
          });

        setLocation(position);

        console.log(position);
      },
      error => {
        Alert.alert(`Code ${error.code}`, error.message);
        setLocation(null);
        console.log(error);
      },
      {
        accuracy: {
          android: 'high',
          ios: 'best',
        },
        enableHighAccuracy: highAccuracy,
        timeout: 15000,
        maximumAge: 10000,
        distanceFilter: 0,
        forceRequestLocation: forceLocation,
        forceLocationManager: useLocationManager,
        showLocationDialog: locationDialog,
      },
    );
  };
  return (
    <>
      <TouchableOpacity
        onPress={() =>
          auth()
            .signOut()
            .then(() => setAuthenticated(false))
        }
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1,
        }}>
        <Text style={{color: 'black'}}>{'Sign Out'}</Text>
      </TouchableOpacity>
    </>
  );
};

export default Home;
