import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {useIsFocused} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Linking,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  ToastAndroid,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import Geolocation from 'react-native-geolocation-service';
import LinearGradient from 'react-native-linear-gradient';
import IcAdd from '~app/assets/images/addIcon.svg';
import IcAddWhite from '~app/assets/images/addIconWhite.svg';
import ICLogo from '~app/assets/images/brandLogo.svg';
import IcDiscover from '~app/assets/images/gridHorizontal.svg';
import IcLocation from '~app/assets/images/location.svg';
import IcSent from '~app/assets/images/sent.svg';
import Accodian from '~app/components/Accordian/Accordian';
import Button from '~app/components/Button';
import Label from '~app/components/Label';
import MainCard from '~app/components/MainCard';
import {COLORS, COMPONENT_SIZE, hp, wp} from '~app/constants/styles';
import useUsername from '~app/hooks/User';
import {appStateSelectors, useAppState} from '~app/state/AppState';

const Feeds: React.FC = () => {
  const isFocused = useIsFocused();
  const darkMode = useAppState(appStateSelectors.displayMode!);
  const currentUser = useAppState(appStateSelectors.currentUser!);
  const currentLatitude = useAppState(state => state.currentLatitude);
  const currentLongitude = useAppState(state => state.currentLongitude);
  const currentLocation = useAppState(state => state.currentLocation);

  const setAuthenticated = useAppState(state => state.setAuthenticated);
  const setCurrentLatitude = useAppState(state => state.setCurrentLatitude);
  const setCurrentLongitude = useAppState(state => state.setCurrentLongitude);
  const setCurrentLocation = useAppState(state => state.setCurrentLocation);
  const [forceLocation, setForceLocation] = useState(true);
  const [highAccuracy, setHighAccuracy] = useState(true);
  const [locationDialog, setLocationDialog] = useState(true);
  const [significantChanges, setSignificantChanges] = useState(false);
  const [observing, setObserving] = useState(false);
  const [foregroundService, setForegroundService] = useState(false);
  const [useLocationManager, setUseLocationManager] = useState(false);
  const [location, setLocation] = useState(null);
  const watchId = useRef(null);
  const caroselRef = useRef(null);

  const [users, setUsers] = useState(useState<object[]>([]));
  const [loader, setLoader] = useState(false);
  const [feeds, setFeeds] = useState([]);

  const uid = auth()?.currentUser?.uid;
  const {userById} = useUsername();

  useEffect(() => {
    fetchFeeds();
  }, [isFocused]);

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

  useEffect(() => {
    fetchFeeds();
    userById();
    getLocation();
    updateUserId();
    // getLocationUpdates();
  }, []);

  useEffect(() => {
    firestore()
      .collection('users')
      .doc(uid)
      .update({
        currentLatitude: currentLatitude,
        currentLongitude: currentLongitude,
        currentLocation: currentLocation,
        // location: str,
      })
      .then(() => {
        console.log('User updated!');
      })
      .catch(e => {
        console.log('api createUser error', e);
      });
  }, []);

  const fetchFeeds = () => {
    let feedsList: object[] = [];
    firestore()
      .collection('experiences')
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          let data = doc.data();

          if (data.createdBy === uid || data.acceptedBy.includes(uid)) {
            feedsList.push(data);
          }
        });
        setFeeds(feedsList);
      });
  };

  const getLocationUpdates = async () => {
    const hasPermission = await hasLocationPermission();

    if (!hasPermission) {
      return;
    }

    setObserving(true);

    watchId.current = Geolocation.watchPosition(
      position => {
        setCurrentLatitude(position.coords.latitude);
        setCurrentLongitude(position.coords.longitude);
        // firestore()
        //   .collection('users')
        //   .doc(uid)
        //   .update({
        //     currentLatitude: position.coords.latitude,
        //     currentLongitude: position.coords.longitude,
        //     // location: str,
        //   })
        //   .then(() => {
        //     console.log('User updated!');
        //   })
        //   .catch(e => {
        //     console.log('api createUser error', e);
        //   });
        // fetch(
        //   'https://maps.googleapis.com/maps/api/geocode/json?address=' +
        //     position.coords.latitude +
        //     ',' +
        //     position.coords.longitude +
        //     '&key=' +
        //     'AIzaSyBUgvzW8qDS5TQWLnxd3TmRbPAq5g0j7AE',
        // )
        //   .then(response => response.json())
        //   .then(responseJson => {
        //     const address = JSON.stringify(responseJson);
        //     const str = responseJson.results[2].formatted_address.replace(
        //       /,[^,]+$/,
        //       '',
        //     );
        //     setCurrentLocation(str);
        //     console.log('location', str);
        //   });

        // console.log(position);
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
        setCurrentLatitude(position.coords.latitude);
        setCurrentLongitude(position.coords.longitude);
        firestore()
          .collection('users')
          .doc(uid)
          .update({
            currentLatitude: position.coords.latitude,
            currentLongitude: position.coords.longitude,
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
            firestore()
              .collection('users')
              .doc(uid)
              .update({
                currentLoctaion: str,
                // location: str,
              })
              .then(() => {
                console.log('User updated!');
              })
              .catch(e => {
                console.log('api createUser error', e);
              });
            console.log('location', str);
          });

        // setLocation(position);

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

  const renderItem = ({item, index}) => {
    let labelType = '';
    if (currentUser.hasOwnProperty('connections')) {
      let labelIndex = currentUser?.connections?.findIndex(
        (o: {id: any; type: string}) => {
          return o.id === item.id && o.type === 'Requested';
        },
      );
      if (labelIndex == -1) {
        let labelIndexForm = currentUser?.connections?.findIndex(
          (o: {id: any; type: string}) => {
            return o.id === item.id && o.type === 'Connected';
          },
        );
        if (labelIndexForm == -1) {
          labelType = 'Connect';
        } else {
          labelType = 'Connected';
        }
      } else {
        labelType = 'Requested';
      }
    } else {
      labelType = 'Connect';
    }
    return (
      <View
        style={{
          height: 380,
          width: COMPONENT_SIZE.SCREEN_WIDTH * 0.8,
          backgroundColor: COLORS.WHITE,
          alignItems: 'center',

          borderRadius: 20,
          ...Platform.select({
            ios: {
              shadowColor: 'rgba(0,0,0,0.15)',
              shadowOffset: {width: 6, height: 6},
              shadowOpacity: 0.6,
            },
            android: {
              elevation: 5,
            },
          }),
        }}>
        {item?.profileImage !== undefined ? (
          <FastImage
            source={{
              uri: item?.profileImage,
              priority: FastImage.priority.high,
            }}
            style={{
              marginTop: hp(20),
              height: '75%',
              width: '90%',
              margin: 5,
              borderRadius: 20,
            }}
            resizeMode={FastImage.resizeMode.cover}
          />
        ) : (
          <View
            style={{
              marginTop: hp(20),
              height: '75%',
              width: '90%',
              margin: 5,
              borderRadius: 20,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image
              source={require('~app/assets/images/userCircle.png')}
              resizeMode={'contain'}
              style={{
                marginTop: hp(20),
                height: '50%',
                width: '50%',
                margin: 5,
                borderRadius: 20,
              }}
            />
          </View>
        )}
        <LinearGradient
          style={{
            marginTop: hp(20),
            height: '75%',
            width: '90%',
            position: 'absolute',
            margin: 5,
            borderRadius: 20,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'transparent',
          }}
          colors={[
            'transparent',
            'transparent',
            'transparent',
            'transparent',
            COLORS.BLACK_70,
            COLORS.BLACK,
          ]}
          start={{x: 0, y: 0}}
          end={{x: 0, y: 1}}></LinearGradient>

        <View
          style={{
            backgroundColor: COLORS.BLACK_70,
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute',
            right: 30,
            top: 40,
            width: 80,
            height: 30,
            borderRadius: 40,
          }}>
          <Text style={{color: COLORS.WHITE}}>{`${item.feet} ft`}</Text>
        </View>
        <Text style={styles.username}>{item.username}</Text>
        <Button
          disabled={labelType === 'Connected' || labelType === 'Requested'}
          label={labelType}
          labelStyle={{
            color: COLORS.BLACK,
            fontSize: hp(16),
            fontWeight: '500',
            fontFamily: 'Poppins-Medium',
          }}
          onPress={() => {}}
          style={{
            borderWidth: 1.7,
            borderColor: COLORS.NAVY_BLUE,
            backgroundColor: COLORS.WHITE,
            borderRadius: 5,
            marginHorizontal: wp(20),
            marginTop: hp(10),
          }}
        />
      </View>
    );
  };
  const renderCardItem = ({item}) => {
    return (
      <Accodian
        title={item.title}
        users={item.friends}
        location={item.location}
        item={item}
      />

      // <View>
      //   <Label>{item.title}</Label>
      // </View>
    );
  };

  const styles = style(darkMode);

  const [snapIndex, setSnapIndex] = React.useState(0);

  return (
    <>
      <MainCard>
        <View style={styles.topBar}>
          <ICLogo />
          <View style={styles.innerView}>
            {darkMode ? <IcAddWhite /> : <IcAdd />}
            <IcSent
              color={darkMode ? COLORS.WHITE : COLORS.BLACK}
              style={{marginHorizontal: hp(15)}}
            />
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            paddingHorizontal: wp(20),
            marginTop: hp(40),
            marginLeft: wp(10),
            alignItems: 'center',
          }}>
          <Label style={styles.discover}>Feeds</Label>
          <IcDiscover style={{marginLeft: wp(10)}} />
        </View>
        <View style={styles.line} />
        <View
          style={{
            flexDirection: 'row',
            paddingHorizontal: wp(20),
            marginTop: hp(20),
          }}>
          <IcLocation style={{marginLeft: wp(10)}} />
          <Label style={styles.location}>{currentLocation}</Label>
        </View>
        {feeds?.length > 0 && (
          <FlatList
            bounces={false}
            keyExtractor={(item): string => item.title}
            style={{marginBottom: 5}}
            data={feeds}
            extraData={feeds}
            renderItem={renderCardItem}
          />
        )}
        {/* <TabView
          navigationState={{index, routes}}
          renderScene={renderScene}
          renderTabBar={renderTabBar}
          swipeEnabled={index == 0 ? false : true}
          onIndexChange={setIndex}
          initialLayout={{width: layout.width}}
        /> */}
        {loader && (
          <View style={styles.loaderView}>
            <ActivityIndicator
              size={'large'}
              animating
              color={darkMode ? COLORS.WHITE : COLORS.GREY}
            />
            {/* <Image
              source={require('~app/assets/images/spinnerr.gif')}
              style={{height: hp(50), width: hp(50)}}
            /> */}
          </View>
        )}
      </MainCard>
    </>
  );
};

export default Feeds;
const style = (darkMode: boolean) =>
  StyleSheet.create({
    topBar: {
      alignItems: 'center',
      flexDirection: 'row',
      width: '100%',
      paddingLeft: hp(20),
      marginTop: hp(20),
    },
    loaderView: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      opacity: 0.5,
      backgroundColor: 'black',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: wp(10),
    },
    visibility: {
      fontFamily: 'Poppins-Medium',
      fontSize: hp(16),
      fontWeight: '500',
      color: COLORS.BLACK,
    },
    view: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: wp(40),
      marginBottom: Platform.OS === 'ios' ? hp(30) : hp(50),
      width: '100%',
    },
    tabbar: {
      backgroundColor: COLORS.WHITE,
      height: 50,
      width: '100%',
      shadowOffset: {width: 0, height: 0},
      shadowOpacity: 0,
      elevation: 0,
    },
    tab: {
      shadowOffset: {width: 0, height: 1},
      shadowOpacity: 0.2,
      elevation: 1,
      alignItems: 'flex-start',
    },
    indicator: {
      backgroundColor: COLORS.NAVY_BLUE,
      width: wp(22),
    },
    label: {
      fontWeight: '500',
      color: COLORS.BLACK,
      fontFamily: 'Poppins-Regular',
      fontSize: hp(18),
      textTransform: 'none',
    },
    username: {
      color: COLORS.WHITE,
      fontSize: hp(16),
      fontWeight: '500',
      fontFamily: 'Poppins-Medium',
      position: 'absolute',
      left: 30,
      top: hp(300),
    },
    feet: {
      color: COLORS.WHITE,
      fontSize: hp(16),
      // fontWeight: '500',
      fontFamily: 'Poppins-Regular',

      // width: 80,
    },
    line: {
      backgroundColor: COLORS.BLACK,
      height: 0.5,
      width: wp(150),
      marginLeft: wp(20),
    },
    discover: {
      fontSize: hp(21),
      fontWeight: '600',
      fontFamily: 'Poppins-SemiBold',
      color: COLORS.BLACK,
    },
    location: {
      fontSize: hp(14),
      fontWeight: '400',
      fontFamily: 'Poppins-Regular',
      color: COLORS.BLACK,
      marginLeft: wp(10),
      marginRight: wp(20),
    },
    heading: {
      flex: 1,
      fontFamily: 'Poppins-Medium',
      fontSize: hp(18),
      fontWeight: '500',
      color: darkMode ? COLORS.WHITE : COLORS.BLACK,
    },
    innerView: {
      flex: 1,
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'flex-end',
    },
  });
