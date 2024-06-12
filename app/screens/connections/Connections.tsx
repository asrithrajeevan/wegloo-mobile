import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {useNavigation} from '@react-navigation/native';
import * as geolib from 'geolib';
import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import Carousel from 'react-native-snap-carousel';
import {
  NavigationState,
  SceneMap,
  SceneRendererProps,
  TabBar,
  TabView,
} from 'react-native-tab-view';
import {StackNavigationProp} from 'react-navigation/native-stack';
import IcAdd from '~app/assets/images/addIcon.svg';
import IcAddWhite from '~app/assets/images/addIconWhite.svg';
import ICLogo from '~app/assets/images/brandLogo.svg';
import IcDiscover from '~app/assets/images/filter.svg';
import IcLocation from '~app/assets/images/location.svg';
import IcSent from '~app/assets/images/sent.svg';
import Button from '~app/components/Button';
import Label from '~app/components/Label';
import MainCard from '~app/components/MainCard';
import {SCREENS} from '~app/constants/navigation';
import {COLORS, COMPONENT_SIZE, hp, wp} from '~app/constants/styles';
import {InitialStackParamsList} from '~app/navigation/InitialNavigation';
import {appStateSelectors, useAppState} from '~app/state/AppState';
const Connections: React.FC = () => {
  const darkMode = useAppState(appStateSelectors.displayMode!);
  const currentUser = useAppState(appStateSelectors.currentUser!);
  const currentLatitude = useAppState(state => state.currentLatitude);
  const currentLongitude = useAppState(state => state.currentLongitude);
  const currentLocation = useAppState(state => state.currentLocation);
  const navigation =
    useNavigation<StackNavigationProp<InitialStackParamsList>>();
  const watchId = useRef(null);
  const caroselRef = useRef(null);

  const [users, setUsers] = useState(useState<object[]>([]));
  const [loader, setLoader] = useState(false);

  const fetchUsers = () => {
    setLoader(true);
    const query = firestore()
      .collection('users')
      .get()
      .then(querySnapshot => {
        let userList: object[] = [];
        querySnapshot.forEach(doc => {
          let data = doc.data();

          if (
            currentLatitude !== undefined &&
            currentLongitude !== undefined &&
            data.currentLatitude !== undefined &&
            data.currentLongitude !== undefined &&
            data.id !== currentUser.id
          )
            var distance = geolib.isPointWithinRadius(
              {latitude: currentLatitude, longitude: currentLongitude},
              {
                latitude: data.currentLatitude,
                longitude: data.currentLongitude,
              },
              4000,
            );
          console.log('distance123', distance);

          if (distance) {
            // var dis = geolib.getDistance(
            //   {latitude: currentLatitude, longitude: currentLongitude},
            //   {latitude: data.latitude, longitude: data.longitude},
            // );
            let dis = distanceCalculation(
              currentLatitude,
              currentLongitude,
              data.currentLatitude,
              data.currentLongitude,
              'K',
            );
            const feet = dis * 3280.84;

            const newData = {...data, feet: feet.toFixed(2)};
            userList.push(newData);
          }

          // console.log('queriedInterests', queriedInterests);
        });

        setUsers(userList);
        setLoader(false);
      });
  };
  function distanceCalculation(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
    unit: string,
  ) {
    if (lat1 == lat2 && lon1 == lon2) {
      return 0;
    } else {
      var radlat1 = (Math.PI * lat1) / 180;
      var radlat2 = (Math.PI * lat2) / 180;
      var theta = lon1 - lon2;
      var radtheta = (Math.PI * theta) / 180;
      var dist =
        Math.sin(radlat1) * Math.sin(radlat2) +
        Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      if (dist > 1) {
        dist = 1;
      }
      dist = Math.acos(dist);
      dist = (dist * 180) / Math.PI;
      dist = dist * 60 * 1.1515;
      dist = dist + dist / 2.5;
      if (unit == 'K') {
        dist = dist * 1.609344;
      }
      if (unit == 'N') {
        dist = dist * 0.8684;
      }
      return dist;
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  const connectionRequest = (item: any, index) => {
    setLoader(true);
    setSnapIndex(index);
    const uid = auth()?.currentUser?.uid;
    let notifications: {
      id: any;
      profileImage: string;
      username: string;
      type: string;
      notificationType: string;
    }[] = [];
    firestore()
      .collection('users')
      .doc(item.id)
      .get()
      .then(documentSnapshot => {
        console.log('User exists: ', documentSnapshot.exists);

        if (documentSnapshot.exists) {
          if (documentSnapshot?.data().hasOwnProperty('notifications')) {
            notifications = documentSnapshot?.data()?.notifications;
          }
          const data = {
            id: uid,
            profileImage: currentUser?.profileImage
              ? currentUser?.profileImage
              : '',
            username: currentUser.username,
            type: 'connection',
            notificationType: 'Request',
          };
          notifications.push(data);
          firestore()
            .collection('users')
            .doc(item.id)
            .update({
              notifications: notifications,
            })
            .then(() => {
              // setLoader(false);
              // setCanvasImages(canvasImages => [...canvasImages, imagePath]);
              console.log('User updated!');
              let connections = [];
              const newData = {
                id: item.id,
                type: 'Requested',
              };
              if (currentUser.hasOwnProperty('connections')) {
                connections = currentUser.connections;
              }
              connections.push(newData);
              firestore()
                .collection('users')
                .doc(uid)
                .update({
                  connections: connections,
                })
                .then(() => {
                  // setLoader(false);
                  // setCanvasImages(canvasImages => [...canvasImages, imagePath]);
                  console.log('User updated!');
                  setLoader(false);
                })
                .catch(e => {
                  // setUploading(false);
                  console.log('api createUser error', e);
                });
            })
            .catch(e => {
              // setUploading(false);
              console.log('api createUser error', e);
            });
        }
      });
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
          onPress={() => {
            connectionRequest(item, index);
          }}
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

  const styles = style(darkMode);
  const FirstRoute = () => (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.WHITE,
        paddingTop: hp(30),
      }}>
      {users.length > 0 ? (
        <Carousel
          ref={caroselRef}
          data={users}
          // loop
          firstItem={snapIndex}
          renderItem={renderItem}
          sliderWidth={COMPONENT_SIZE.SCREEN_WIDTH}
          itemWidth={COMPONENT_SIZE.SCREEN_WIDTH * 0.8}
        />
      ) : (
        <View
          style={{
            alignItems: 'center',
            marginTop: hp(150),
            height: COMPONENT_SIZE.SCREEN_HEIGHT * 0.5,
          }}>
          <Label
            style={{
              fontSize: hp(16),
              fontFamily: 'Poppins-Medium',
              color: COLORS.BLACK,
              fontWeight: '500',
            }}>
            hmm no one to see here...{' '}
          </Label>
          <Label
            style={{
              fontSize: hp(16),
              fontFamily: 'Poppins-Medium',
              color: COLORS.BLACK,
              fontWeight: '500',
            }}>
            Refresh at a new location!{' '}
          </Label>
          <ICLogo style={{marginTop: hp(20)}} />
        </View>
      )}
      <View style={styles.view}>
        <Label style={styles.visibility}>My Visibility</Label>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <ICLogo />
          <Label
            style={[
              styles.visibility,
              {
                marginLeft: wp(10),
                fontFamily: 'Poppins-Light',
                fontWeight: '300',
                fontSize: hp(13),
              },
            ]}>
            Public
          </Label>
        </View>
      </View>
    </View>
  );

  const SecondRoute = () => (
    <View style={{flex: 1, backgroundColor: 'white'}} />
  );
  const FourRoute = () => <View style={{flex: 1, backgroundColor: 'white'}} />;

  const ThirdRoute = () => <View style={{flex: 1, backgroundColor: 'white'}} />;

  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
    third: ThirdRoute,
    four: FourRoute,
  });
  type State = NavigationState<{
    key: string;
    title: string;
  }>;

  const renderTabBar = (
    props: SceneRendererProps & {navigationState: State},
  ) => (
    <TabBar
      {...props}
      scrollEnabled={true}
      activeColor={COLORS.BLACK}
      inactiveColor={COLORS.THIN_GREY}
      indicatorStyle={[styles.indicator, {left: index === 0 ? 15 : 15}]}
      style={styles.tabbar}
      tabStyle={[
        styles.tab,
        {
          width:
            Platform.OS === 'ios' ? wp(165) : index === 2 ? wp(170) : wp(160),
        },
      ]}
      labelStyle={styles.label}
    />
  );
  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const [snapIndex, setSnapIndex] = React.useState(0);

  const [routes] = React.useState([
    {key: 'first', title: 'View All'},
    {key: 'second', title: 'Connections'},
    {key: 'four', title: 'Recently With'},
  ]);
  console.log('no.of users', users.length);
  return (
    <>
      <MainCard>
        <View style={styles.topBar}>
          <ICLogo />
          <View style={styles.innerView}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate(SCREENS.EXPERIENCE);
              }}>
              {darkMode ? <IcAddWhite /> : <IcAdd />}
            </TouchableOpacity>
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
          <Label style={styles.discover}>Discover</Label>
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
        <TabView
          navigationState={{index, routes}}
          renderScene={renderScene}
          renderTabBar={renderTabBar}
          swipeEnabled={index == 0 ? false : true}
          onIndexChange={setIndex}
          initialLayout={{width: layout.width}}
        />
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

export default Connections;
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
