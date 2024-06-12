import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  Keyboard,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {StackNavigationProp} from 'react-navigation/native-stack';
import IcBack from '~app/assets/images/backArrow.svg';
import IcClose from '~app/assets/images/close.svg';
import Info from '~app/assets/images/info.svg';
import IcMap from '~app/assets/images/location.svg';
import ICProgress from '~app/assets/images/progressBar7.svg';
import Input from '~app/components/Input';
import Label from '~app/components/Label';
import MainCard from '~app/components/MainDarkCard';
import {SCREENS} from '~app/constants/navigation';
import {COLORS, hp, wp} from '~app/constants/styles';
import {InitialStackParamsList} from '~app/navigation/InitialNavigation';
import {appStateSelectors, useAppState} from '~app/state/AppState';
import {commonStyles} from '~app/styles/styleContants';
import GenderSelection from './components/GenderField';

const Birthday: React.FC = () => {
  const navigation =
    useNavigation<StackNavigationProp<InitialStackParamsList>>();
  const darkMode = useAppState(appStateSelectors.displayMode!);
  const setAuthenticated = useAppState(appStateSelectors.setAuthenticated!);
  const [bio, setBio] = useState('');
  const [latitude, setLatitude] = useState(40.7128);
  const [longitude, setLongitude] = useState(74.006);

  const [female, setFemale] = useState(false);
  const [male, setMale] = useState(false);
  const [gender, setGender] = useState('');
  const [genderError, setGenderError] = useState('');
  // const [genderSelected, setGenderSelected] = useState(false);

  const [googleText, setGoogleText] = useState('');
  const [location, setLocation] = useState('');
  const [website, setWebsite] = useState('');
  const [binary, setBinary] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [websiteError, setWebsiteError] = useState('');
  const [locationError, setLocationError] = useState('');
  const user = useAppState(state => state.user);
  const setUser = useAppState(state => state.setUser);
  const refInput = React.useRef(null);

  const style = styles(darkMode);

  const handleClick = () => {
    let Regex =
      /((?:(?:http?|ftp)[s]*:\/\/)?[a-z0-9-%\/\&=?\.]+\.[a-z]{2,4}\/?([^\s<>\#%"\,\{\}\\|\\\^\[\]`]+)?)/gi;

    // /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/;
    if (website !== '') {
      if (Regex.test(website)) {
        setWebsiteError('');
        if (location === '') {
          setLocationError('Please select your location');
        }
        if (!male && !female && !binary) {
          setGenderError('Please select your gender');
        } else {
          if (websiteError === '') {
            setUser({
              ...user,
              bio,
              website,
              latitude,
              longitude,
              location,
              gender,
              canvasImages: [],
            });
            navigation.navigate(SCREENS.SOCIAL_MEDIA);
          }
        }
      } else {
        setWebsiteError('Please enter a valid url');
      }
    } else {
      if (location === '') {
        setLocationError('Please select your location');
      }
      if (!male && !female && !binary) {
        setGenderError('Please select your gender');
      } else {
        if (
          location !== '' &&
          (male || female || binary) &&
          websiteError === ''
        ) {
          setUser({
            ...user,
            bio,
            website,
            latitude,
            longitude,
            location,
            gender,
            canvasImages: [],
          });
          navigation.navigate(SCREENS.SOCIAL_MEDIA);
        }
      }
    }

    // handle the click event
  };

  const onSubmitUrl = () => {
    console.log('bjdjb');
    let Regex =
      /((?:(?:http?|ftp)[s]*:\/\/)?[a-z0-9-%\/\&=?\.]+\.[a-z]{2,4}\/?([^\s<>\#%"\,\{\}\\|\\\^\[\]`]+)?)/gi;

    // /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/;
    if (website !== '') {
      if (Regex.test(website)) {
        setWebsiteError('');
      } else {
        setWebsiteError('Please enter a valid url');
      }
    } else {
      setWebsiteError('');
    }
    // handle the click event
  };

  const onChangeBioText = (text: string) => {
    console.log('textlength', text, text.length);
    setBio(text);
  };

  const onChangeUrlText = (text: string) => {
    setWebsite(text);
  };

  const changeGender = (text: string) => {
    // handle the click event
    if (text === 'Female') {
      setFemale(!female);
      setMale(false);
      setBinary(false);
      setGender('Female');
      setGenderError('');
      // setGenderSelected(!genderSelected);
    } else if (text === 'Male') {
      setMale(!male);
      setFemale(false);
      setBinary(false);
      setGender('Male');
      setGenderError('');
      // setGenderSelected(!genderSelected);
    } else {
      setBinary(!binary);
      setMale(false);
      setFemale(false);
      setGender('Non-Binar');
      setGenderError('');
      // setGenderSelected(!genderSelected);
    }
  };

  return (
    <>
      <MainCard>
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps={'handled'}>
          <TouchableOpacity
            style={style.backIcon}
            onPress={() => {
              navigation.goBack();
            }}>
            <IcBack color={darkMode ? COLORS.WHITE : COLORS.BLACK} />
          </TouchableOpacity>

          <Label style={style.mainText}>Tell us a bit about you</Label>
          <View style={style.subContainer}>
            <Label style={style.profile}>Profile Bio</Label>
            <Label style={style.optional}>Optional</Label>
          </View>
          <View style={style.inputContainer}>
            <TextInput
              placeholder="Express yourself and tell you friends on Wegloo whats special about you...  "
              placeholderTextColor={
                darkMode ? COLORS.WHITE_LIGHT : COLORS.THIN_GREY
              }
              returnKeyType="next"
              style={style.textInput}
              multiline={true}
              maxLength={250}
              onChangeText={text => onChangeBioText(text)}
              value={bio}></TextInput>
            <Label style={style.textCount}>
              {bio.length === 0
                ? `250 character limit`
                : `${bio.length} of 250 characters used`}
            </Label>
          </View>
          <View style={style.subContainer}>
            <Label style={style.profile}>URL/Link</Label>
            <Label style={style.optional}>Optional</Label>
          </View>
          <Input
            containerStyle={style.normalContainer}
            returnKeyType="next"
            value={website}
            error={websiteError}
            style={style.normalTextInput}
            onChangeText={text => onChangeUrlText(text)}
            // onChangeText={() => handleChange('password')}
            placeholderTextColor={
              darkMode ? COLORS.WHITE_LIGHT : COLORS.THIN_GREY
            }
            placeholder="website url "
            onPressButton={() => {}}
            secureTextEntry={true}
            onSubmitEditing={() => onSubmitUrl()}
          />
          {websiteError ? (
            <View style={style.errorView}>
              <Info />
              <Label style={style.infoText}>{websiteError}</Label>
            </View>
          ) : (
            <></>
          )}
          <View style={style.imageContainer}>
            <IcMap color={darkMode ? COLORS.WHITE : COLORS.BLACK} />
            <Label style={style.locationText}>Location</Label>
          </View>
          <TouchableOpacity
            activeOpacity={1}
            style={[
              style.locationContainer,

              {
                borderColor: locationError
                  ? 'red'
                  : darkMode
                  ? COLORS.BLACK
                  : COLORS.WHITE,
                borderWidth: 2,
                marginBottom: hp(10),
              },
            ]}
            onPress={() => {
              setModalVisible(true);
            }}>
            <Label
              style={[
                style.locationTextInput,
                {
                  color: darkMode
                    ? location === ''
                      ? COLORS.WHITE_LIGHT
                      : COLORS.WHITE
                    : COLORS.THIN_GREY,
                },
              ]}>
              {location === '' ? 'City and State' : location}
            </Label>
          </TouchableOpacity>
          {locationError ? (
            <View style={style.errorView}>
              <Info />
              <Label style={style.infoText}>{locationError}</Label>
            </View>
          ) : (
            <></>
          )}
          <View style={style.imageContainer}>
            <Label style={style.locationText}>Gender Identity</Label>
          </View>
          <GenderSelection
            selected={female}
            text={'Female'}
            changeGender={(text: string) => changeGender(text)}
          />
          <GenderSelection
            selected={male}
            text={'Male'}
            changeGender={(text: string) => changeGender(text)}
          />
          <GenderSelection
            selected={binary}
            text={'Non-Binary'}
            changeGender={(text: string) => changeGender(text)}
          />
          {genderError ? (
            <View style={style.errorView}>
              <Info />
              <Label style={style.infoText}>{genderError}</Label>
            </View>
          ) : (
            <></>
          )}
          <TouchableOpacity
            style={style.progress}
            onPress={() => handleClick()}>
            <ICProgress />
          </TouchableOpacity>
        </KeyboardAwareScrollView>
        {modalVisible && (
          <TouchableOpacity
            onPress={() => {
              Keyboard.dismiss();
              setModalVisible(false);
            }}
            style={style.centeredView}></TouchableOpacity>
        )}
        {modalVisible && (
          <View
            style={{
              position: 'absolute',
              top: hp(100),
              flex: 1,
              width: '100%',
            }}>
            <GooglePlacesAutocomplete
              ref={refInput}
              fetchDetails
              enablePoweredByContainer={false}
              renderRightButton={() => (
                <TouchableOpacity
                  style={{marginRight: 10}}
                  onPress={() => {
                    refInput?.current?.clear();
                    setModalVisible(false);
                  }}>
                  <IcClose />
                </TouchableOpacity>
              )}
              textInputProps={{
                placeholderTextColor: darkMode
                  ? COLORS.THIN_GREY
                  : COLORS.DARK_GREY,
                clearButtonMode: 'never',
                onChangeText: text => {
                  setGoogleText(text);
                },
              }}
              styles={{
                row: {backgroundColor: darkMode ? COLORS.BLACK : COLORS.WHITE},
                textInputContainer: {
                  height: hp(65),
                  // width: '80%',
                  flex: 1,
                  backgroundColor: darkMode ? COLORS.BLACK : COLORS.WHITE,
                  marginHorizontal: wp(20),
                  // borderRadius: 10,
                  borderTopLeftRadius: 10,
                  borderTopRightRadius: 10,
                  borderBottomLeftRadius: googleText.length > 0 ? 0 : 10,
                  borderBottomRightRadius: googleText.length > 0 ? 0 : 10,
                  alignItems: 'center',
                },
                textInput: {
                  height: hp(65),
                  backgroundColor: 'transparent',
                  color: darkMode ? COLORS.LIGHT_WHITE : COLORS.DARK_GREY,
                },
                description: {
                  fontFamily: 'Poppins-Medium',
                  fontSize: hp(14),
                  fontWeight: '400',
                  color: darkMode ? COLORS.WHITE_20 : COLORS.DARK_GREY,
                },
                separator: {
                  height: 1,
                  backgroundColor: darkMode ? COLORS.THIN_GREY : COLORS.BLACK,
                },
                listView: {
                  borderBottomLeftRadius: 10,
                  borderBottomRightRadius: 10,
                  marginHorizontal: wp(20),
                  backgroundColor: darkMode ? '#2F333C' : COLORS.WHITE,
                },
              }}
              placeholder="City and State"
              onPress={(data, details = null) => {
                console.log('detailsss', details);
                setGoogleText('');
                setLocation(details?.formatted_address);
                setLatitude(details?.geometry?.location?.lat);
                setLongitude(details?.geometry?.location?.lng);
                setLocationError('');
                setTimeout(() => {
                  setModalVisible(false);
                }, 1000);

                // 'details' is provided when fetchDetails = true
                console.log(data, details);
              }}
              onFail={error => console.error('errooorrrr', error)}
              query={{
                key: 'AIzaSyBUgvzW8qDS5TQWLnxd3TmRbPAq5g0j7AE',
                language: 'en',
              }}
            />
          </View>
        )}
      </MainCard>
    </>
  );
};

export default Birthday;
const styles = (darkMode: boolean) =>
  StyleSheet.create({
    containter: {
      flex: 1,
    },
    errorView: {
      flexDirection: 'row',
      paddingHorizontal: wp(25),
      // marginTop: hp(10),
    },
    line: {
      height: hp(30),
      width: 2,
      backgroundColor: darkMode ? COLORS.BLACK : COLORS.GREY,
      marginHorizontal: hp(15),
    },
    inputContainer: {
      // ...commonStyles.alignItemsCenter,
      // ...commonStyles.flexRow,
      marginHorizontal: wp(20),
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      //   marginHorizontal: wp(35),
      backgroundColor: darkMode ? COLORS.BLACK : COLORS.GREY,
      paddingLeft: wp(25),
      paddingRight: wp(10),
      borderRadius: hp(10),
      marginTop: hp(10),
      height: hp(200),
      paddingTop: hp(20),
    },
    locationContainer: {
      marginHorizontal: wp(20),
      alignItems: 'center',

      //   marginHorizontal: wp(35),
      backgroundColor: darkMode ? COLORS.BLACK : COLORS.GREY,

      borderRadius: hp(10),
      marginTop: hp(5),
      paddingVertical: Platform.OS === 'ios' ? hp(20) : hp(15),
      paddingHorizontal: wp(10),
    },
    normalContainer: {
      marginHorizontal: wp(20),
      alignItems: 'center',

      //   marginHorizontal: wp(35),
      backgroundColor: darkMode ? COLORS.BLACK : COLORS.GREY,

      borderRadius: hp(10),
      marginTop: hp(5),
      height: hp(60),
    },
    textInput: {
      width: '100%',
      color: darkMode ? COLORS.WHITE : COLORS.THIN_GREY,
      fontSize: wp(15),
      height: hp(150),
      textAlignVertical: 'top',
      fontWeight: '500',
      fontFamily: 'Poppins-Medium',
    },
    normalTextInput: {
      width: '100%',
      color: darkMode ? COLORS.WHITE : COLORS.THIN_GREY,
      fontSize: wp(14),
      fontWeight: '500',
      fontFamily: 'Poppins-Medium',
    },
    locationTextInput: {
      width: '100%',

      fontSize: wp(14),
      fontWeight: '500',
      fontFamily: 'Poppins-Medium',
      // marginTop: hp(20),
      marginLeft: wp(20),
    },
    infoText: {
      fontSize: hp(12),
      fontFamily: 'Poppins-MediumItalic',
      fontWeight: '500',
      marginLeft: wp(20),
      color: darkMode ? COLORS.WHITE : COLORS.BLACK,
    },
    centeredView: {
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
    xt: {
      color: darkMode ? COLORS.WHITE : COLORS.BLACK,
      fontSize: wp(14),
      fontWeight: '500',
      fontFamily: 'Poppins-Medium',
      marginBottom: hp(50),
      marginTop: hp(10),
      marginLeft: hp(35),
    },
    countryButton: {
      flexDirection: 'row',
      alignItems: 'center',

      // marginLeft: wp(50),
    },
    textCount: {
      fontSize: wp(13),
      fontWeight: '500',
      fontFamily: 'Poppins-Medium',
      textAlign: 'right',
      width: '100%',
      color: darkMode ? COLORS.WHITE_LIGHT : COLORS.THIN_GREY,
      marginBottom: hp(10),
    },

    backIcon: {
      position: 'absolute',
      top: Platform.OS === 'ios' ? hp(40) : hp(30),
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
      marginTop: hp(40),
      marginBottom: hp(70),
    },
    customTextInput: {
      fontSize: hp(17),
      marginLeft: wp(10),
      fontFamily: 'Poppins-Medium',
      fontWeight: '500',

      color: darkMode ? COLORS.WHITE : COLORS.THIN_GREY,
    },
    countryCode: {
      // height: Platform.OS === 'ios' ? hp(40) : hp(50),
      fontSize: hp(17),

      fontFamily: 'Poppins-Medium',
      fontWeight: '500',
      marginRight: wp(5),
      color: darkMode ? COLORS.WHITE : COLORS.THIN_GREY,
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
      fontSize: wp(23),
      fontWeight: '500',
      fontFamily: 'Poppins-Medium',

      marginTop: Platform.OS === 'ios' ? hp(130) : hp(120),
      marginLeft: hp(25),
    },
    subContainer: {
      ...commonStyles.flexRow,
      ...commonStyles.justifyContentBetween,
      marginHorizontal: wp(25),
      marginTop: hp(20),
    },
    imageContainer: {
      ...commonStyles.flexRow,

      marginHorizontal: wp(25),
      marginTop: hp(20),
    },
    profile: {
      fontSize: hp(16),
      fontFamily: 'Poppins-Medium',
      fontWeight: '500',
      color: darkMode ? COLORS.WHITE : COLORS.BLACK,
    },
    optional: {
      fontSize: hp(13),
      fontFamily: 'Poppins-Bold',
      fontWeight: '700',
      color: darkMode ? COLORS.WHITE_LIGHT : COLORS.THIN_GREY,
    },
    locationText: {
      fontSize: hp(16),
      fontFamily: 'Poppins-Medium',
      fontWeight: '500',
      color: darkMode ? COLORS.WHITE : COLORS.BLACK,
      marginLeft: wp(10),
    },
  });
