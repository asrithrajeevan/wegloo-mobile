import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  PermissionsAndroid,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  PERMISSIONS,
  request,
  requestNotifications,
} from 'react-native-permissions';
import {StackNavigationProp} from 'react-navigation/native-stack';
import IcBack from '~app/assets/images/backArrow.svg';
import ICClose from '~app/assets/images/closeBlack.svg';
import ICProgress from '~app/assets/images/progressBar3.svg';
import IcSucess from '~app/assets/images/sucess.svg';
import Button from '~app/components/Button';
import Label from '~app/components/Label';
import MainCard from '~app/components/MainDarkCard';
import {SCREENS} from '~app/constants/navigation';
import {COLORS, COMPONENT_SIZE, hp, wp} from '~app/constants/styles';
// import useUsername from '~app/hooks/User';
import {InitialStackParamsList} from '~app/navigation/InitialNavigation';
import {appStateSelectors, useAppState} from '~app/state/AppState';
import {createUser} from '../../firebase/CreateUser';

const LocationEnableScreen: React.FC = () => {
  const user = useAppState(state => state.user);

  const navigation =
    useNavigation<StackNavigationProp<InitialStackParamsList>>();
  const darkMode = useAppState(appStateSelectors.displayMode!);
  const setAuthenticated = useAppState(appStateSelectors.setAuthenticated!);

  const [modalVisible, setModalVisible] = useState(false);
  const [locationGrant, setLocationGrant] = useState(false);
  const style = styles(darkMode);

  const storeData = async (image: any) => {
    try {
      const jsonValue =
        'https://firebasestorage.googleapis.com/v0/b/wegloo-efccc.appspot.com/o/profilePictures%2F5bX5b5bWs0S8EUjFdYVlCXrxOS62.jpg?alt=media&token=c6d224fa-02c1-45ad-92c6-30950810785f';
      await AsyncStorage.setItem('@profileImage', jsonValue);
    } catch (e) {
      console.log('storeerrorr', e);
      // saving error
    }
  };
  const handleClick = React.useCallback(() => {
    if (locationGrant) {
      storeData(user.profileImage);
      // setAuthenticated(true);
      createUser(user);
      navigation.navigate(SCREENS.TUTORIAL_ONE);
    }
    // handle the click event
  }, []);
  const enableAndroidLocation = async () => {
    const granted = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    setLocationGrant(granted);

    if (granted) {
      setModalVisible(true);
      storeData(user.profileImage);
      createUser(user);
      console.log('You can use the ACCESS_FINE_LOCATION');
    } else {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      if (granted) {
        setModalVisible(true);
        storeData(user.profileImage);
        createUser(user);
      }
      // console.log('ACCESS_FINE_LOCATION permission denied');
    }
  };
  return (
    <>
      <MainCard>
        <TouchableOpacity
          style={style.backIcon}
          onPress={() => {
            navigation.goBack();
          }}>
          <IcBack color={darkMode ? COLORS.WHITE : COLORS.BLACK} />
        </TouchableOpacity>

        <Label style={style.mainText}>
          Almost done! for the best experience, we ask that you enable your
          location.
        </Label>
        <Label style={style.subText}>
          You can change these settings at any time.{' '}
        </Label>
        <Button
          label="Enable Location"
          style={style.enableButton}
          labelStyle={style.enableText}
          onPress={() => {
            if (Platform.OS === 'ios') {
              request(PERMISSIONS.IOS.LOCATION_ALWAYS).then(result => {
                // …
              });
              requestNotifications(['alert', 'sound']).then(
                ({status, settings}) => {
                  // …
                  setModalVisible(true);
                },
              );
              storeData(user.profileImage);

              createUser(user);
            } else {
              enableAndroidLocation();
            }
          }}
        />
        {modalVisible && (
          <View style={style.centeredView}>
            <View style={style.successCard}>
              <View
                style={{
                  alignItems: 'flex-end',
                  justifyContent: 'center',

                  width: '100%',
                }}>
                <TouchableOpacity
                  style={{height: hp(30), width: hp(30)}}
                  onPress={() => {
                    setModalVisible(false);
                  }}>
                  <ICClose />
                </TouchableOpacity>
              </View>
              <IcSucess />
              <Label style={style.confirmText}>
                You successfully created your
              </Label>
              <Label style={style.confirmBelowText}> profile!</Label>
              <Button
                label="Continue"
                style={style.continueButton}
                labelStyle={style.continueText}
                onPress={() => {
                  navigation.navigate(SCREENS.TUTORIAL_ONE);
                }}
              />
            </View>
          </View>
        )}
        {!modalVisible && (
          <TouchableOpacity style={style.progress} onPress={handleClick}>
            <ICProgress />
          </TouchableOpacity>
        )}
      </MainCard>
    </>
  );
};

export default LocationEnableScreen;
const styles = (darkMode: boolean) =>
  StyleSheet.create({
    containter: {
      flex: 1,
    },
    successCard: {
      shadowColor: '#171717',
      shadowOffset: {width: -1, height: 5},
      shadowOpacity: 0.2,
      shadowRadius: 3,
      borderRadius: 10,
      height: Platform.OS === 'ios' ? hp(280) : hp(300),
      width: COMPONENT_SIZE.SCREEN_WIDTH * 0.8,
      backgroundColor: darkMode ? COLORS.WHITE : '#FFFFFF',
      paddingTop: hp(20),
      // marginVertical: hp(20),
      elevation: 2,

      alignItems: 'center',
    },
    confirmText: {
      fontFamily: 'Poppins-Medium',
      fontSize: hp(16),
      fontWeight: '500',
      width: '90%',
      textAlign: 'center',
      color: COLORS.BLACK,
      marginTop: hp(20),
    },
    confirmBelowText: {
      fontFamily: 'Poppins-Medium',
      fontSize: hp(16),
      fontWeight: '500',
      width: '90%',
      textAlign: 'center',
      color: COLORS.BLACK,
    },
    enableText: {
      fontSize: hp(17),
      fontFamily: 'Poppins-Medium',
      fontWeight: '500',
      color: darkMode ? COLORS.WHITE : COLORS.BLACK,
    },

    continueText: {
      fontSize: hp(16),
      fontFamily: 'Poppins-SemiBold',
      fontWeight: '600',
      color: COLORS.WHITE,
    },

    continueButton: {
      alignItems: 'center',
      marginHorizontal: wp(40),
      justifyContent: 'center',
      // width: '80%',
      height: hp(50),
      paddingHorizontal: wp(20),
      borderRadius: 5,
      marginTop: hp(25),
      backgroundColor: COLORS.THEME_BLUE,
    },
    enableButton: {
      marginLeft: wp(30),
      alignItems: 'center',
      justifyContent: 'center',
      width: '85%',
      height: hp(60),
      paddingHorizontal: wp(20),
      borderRadius: 10,
      marginTop: hp(70),
      backgroundColor: darkMode ? COLORS.BLACK : COLORS.GREY,
    },
    centeredView: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,

      backgroundColor: darkMode ? '#282B33' : '#EEEEFE',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: wp(10),
    },
    line: {
      height: hp(22),
      width: darkMode ? 1 : 2,
      backgroundColor: darkMode ? COLORS.THIN_GREY : COLORS.GREY,
      marginHorizontal: hp(15),
    },
    inputContainer: {
      alignItems: 'center',
      flexDirection: 'row',
      marginHorizontal: wp(20),
      backgroundColor: darkMode ? COLORS.BLACK : COLORS.GREY,
      paddingHorizontal: hp(15),
      borderRadius: hp(10),
      height: hp(60),
      borderWidth: 1,
    },
    countryButton: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    infoText: {
      fontSize: hp(13),
      fontFamily: 'Poppins-MediumItalic',
      fontWeight: '500',
      marginLeft: wp(40),
      color: darkMode ? COLORS.WHITE : COLORS.BLACK,
      marginTop: hp(5),
    },
    subText: {
      color: darkMode ? COLORS.WHITE : COLORS.BLACK,
      fontSize: wp(15),
      fontWeight: '500',
      fontFamily: 'Poppins-MediumItalic',

      marginTop: hp(10),
      marginLeft: hp(30),
    },

    backIcon: {
      position: 'absolute',
      top: Platform.OS === 'ios' ? hp(70) : hp(50),
      left: wp(10),
      width: wp(30),
      height: hp(30),
      color: darkMode ? COLORS.WHITE : COLORS.BLACK,
      alignItems: 'center',
      justifyContent: 'center',
    },
    containerStyle: {
      backgroundColor: darkMode ? COLORS.BLACK : COLORS.GREY,

      // height: hp(50),
      borderRadius: hp(10),
    },
    textContainer: {
      backgroundColor: darkMode ? COLORS.BLACK : 'transparent',
      // alignItems: 'center',
      width: '100%',
      height: hp(60),
      borderRadius: hp(10),
      paddingHorizontal: hp(10),
      paddingVertical: hp(10),
    },
    progress: {
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      marginTop: COMPONENT_SIZE.SCREEN_HEIGHT / 3,
    },
    customTextInput: {
      fontSize: hp(17),
      marginLeft: wp(10),
      fontFamily: 'Poppins-Medium',
      fontWeight: '500',
      width: '50%',
      color: darkMode ? COLORS.WHITE : COLORS.BLACK,
    },
    countryCode: {
      // height: Platform.OS === 'ios' ? hp(40) : hp(50),
      fontSize: hp(17),

      fontFamily: 'Poppins-Medium',
      fontWeight: '500',
      marginRight: wp(5),
      color: darkMode ? COLORS.WHITE : COLORS.BLACK,
    },
    textView: {
      position: 'absolute',
      top: Platform.OS === 'ios' ? hp(103) : hp(115),
      right: 55,
      height: hp(60),
      backgroundColor: 'transparent',
      width: wp(176),
      alignItems: 'center',
      justifyContent: 'center',
    },
    mainText: {
      color: darkMode ? COLORS.WHITE : COLORS.BLACK,
      fontSize: wp(22),
      fontWeight: '500',
      fontFamily: 'Poppins-Medium',

      marginTop: hp(100),
      marginLeft: hp(25),
      marginRight: hp(25),
    },
  });
