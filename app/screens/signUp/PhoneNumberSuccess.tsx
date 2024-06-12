import {useNavigation} from '@react-navigation/native';
import React, {useRef, useState} from 'react';
import {
  Keyboard,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import CountryPicker from 'react-native-country-picker-modal';
import PhoneInput from 'react-native-phone-number-input';
import {StackNavigationProp} from 'react-navigation/native-stack';
import IcBack from '~app/assets/images/backArrow.svg';
import IcArrow from '~app/assets/images/downArrow.svg';
import ICProgress from '~app/assets/images/progressBar3.svg';
import IcSucess from '~app/assets/images/sucess.svg';
import Label from '~app/components/Label';
import MainCard from '~app/components/MainDarkCard';
import {SCREENS} from '~app/constants/navigation';
import {COLORS, COMPONENT_SIZE, hp, wp} from '~app/constants/styles';
import {Country, CountryCode} from '~app/constants/types';
// import useUsername from '~app/hooks/User';
import {InitialStackParamsList} from '~app/navigation/InitialNavigation';
import {appStateSelectors, useAppState} from '~app/state/AppState';

let phoneMasked = '';
const PhoneNumberSuccess: React.FC = () => {
  const phoneInput = useRef<PhoneInput>(null);
  const [phone, setPhone] = useState('');
  // const {onBack} = useUsername();
  const navigation =
    useNavigation<StackNavigationProp<InitialStackParamsList>>();
  const darkMode = useAppState(appStateSelectors.displayMode!);
  const phoneNumber = useAppState(appStateSelectors.phoneNumber!);
  const callingCode = useAppState(appStateSelectors.callingCode!);
  const setCountryCodeName = useAppState(appStateSelectors.setCountryCodeName!);
  const code = useAppState(appStateSelectors.countryCode!);
  console.log('lppppppppppp', code);
  const [countryCode, setCountryCode] = useState<CountryCode>(code);

  const [country, setCountry] = useState<Country>(null);
  const [withCountryNameButton, setWithCountryNameButton] =
    useState<boolean>(false);

  const [visibleCountry, setVisibleCountry] = useState<boolean>(false);
  const [countryCodeValue, setCountryCodeValue] = useState<number>(1);

  const setAuthenticated = useAppState(appStateSelectors.setAuthenticated);
  const user = useAppState(state => state.user);
  const setUser = useAppState(state => state.setUser);

  console.log('userrrr', user);
  const style = styles(darkMode);
  console.log('phoneeeeee', phone);
  const onSelect = (country: Country) => {
    console.log('countryyyyy', country);
    setCountryCode(country.cca2);
    setCountryCodeName(country.cca2);
    setCountryCodeValue(country.callingCode);
    setCountry(country);
  };
  const onOpen = () => {
    setVisibleCountry(!visibleCountry);
  };
  const onChangePhone = (newPhone: string) => {
    const phoneReplaced = newPhone
      .replace(/ /g, '')
      .replace('(', '')
      .replace(')', '')
      .replace('-', '');

    // if (phoneReplaced.length > 10) {
    //   return setNumber(phoneReplaced);
    // }

    const phoneTrim = phoneReplaced.match(/(.{0,3})(.{0,3})(.{0,4})/);

    phoneMasked = phoneTrim
      ? !phoneTrim[2]
        ? phoneTrim[1]
        : `(${phoneTrim[1]}) ${phoneTrim[2]}${
            phoneTrim[3] ? ' ' + phoneTrim[3] : ''
          }`
      : '';

    return setPhone(phoneMasked);
  };

  return (
    <>
      <MainCard>
        <TouchableOpacity
          style={style.backIcon}
          onPress={() => {
            navigation.navigate(SCREENS.PHONE_NUMBER);
          }}>
          <IcBack color={darkMode ? COLORS.WHITE : COLORS.BLACK} />
        </TouchableOpacity>
        <Label style={style.mainText}>What is your phone number?</Label>

        <View style={style.inputContainer}>
          <TouchableOpacity
            style={style.countryButton}
            onPress={() => {
              onOpen();
            }}>
            <CountryPicker
              {...{
                countryCode,
                withCountryNameButton,
                onSelect,
                onOpen,
              }}
              modalProps={{
                visible: visibleCountry,
              }}
              onOpen={() => setVisibleCountry(true)}
              onClose={() => setVisibleCountry(false)}
            />

            <IcArrow color={darkMode ? COLORS.WHITE : COLORS.BLACK} />
          </TouchableOpacity>
          <View style={style.line} />
          <Label style={style.countryCode}>{`+${callingCode}`}</Label>

          <TextInput
            editable={false}
            placeholder={'(000) 000 0000'}
            placeholderTextColor={darkMode ? COLORS.THIN_GREY : '#636472'}
            keyboardType="phone-pad"
            ref={phoneInput}
            onChangeText={text => {
              onChangePhone(text);
            }}
            value={phoneNumber}
            style={style.customTextInput}></TextInput>
        </View>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => Keyboard.dismiss()}
          style={{
            alignItems: 'center',
            flex: 0.8,
          }}>
          <View style={style.successCard}>
            <Label style={style.confirmText}>
              Your phone number was confirmed!
            </Label>
            <IcSucess />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={style.progress}
          onPress={() => navigation.navigate(SCREENS.BIRTHDAY)}>
          <ICProgress />
        </TouchableOpacity>
      </MainCard>
    </>
  );
};

export default PhoneNumberSuccess;
const styles = (darkMode: boolean) =>
  StyleSheet.create({
    containter: {
      flex: 1,
    },
    countryCode: {
      // height: Platform.OS === 'ios' ? hp(40) : hp(50),
      fontSize: hp(17),

      fontFamily: 'Poppins-Medium',
      fontWeight: '500',
      marginRight: wp(5),
      color: darkMode ? COLORS.WHITE : COLORS.THIN_GREY,
    },
    line: {
      height: hp(23),
      width: darkMode ? 1 : 2,
      backgroundColor: darkMode ? COLORS.BLACK : COLORS.GREY,
      marginHorizontal: hp(15),
    },
    inputContainer: {
      alignItems: 'center',
      flexDirection: 'row',
      marginHorizontal: wp(25),
      backgroundColor: darkMode ? COLORS.BLACK : COLORS.GREY,
      paddingHorizontal: hp(15),
      borderRadius: hp(10),
      height: hp(60),
    },
    countryButton: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    customTextInput: {
      fontSize: hp(17),
      marginLeft: wp(10),
      fontFamily: 'Poppins-Medium',
      fontWeight: '500',

      width: '50%',
      color: darkMode ? COLORS.WHITE : COLORS.THIN_GREY,
    },
    successCard: {
      display: 'flex',
      shadowColor: '#171717',
      shadowOffset: {width: -1, height: 5},
      shadowOpacity: 0.2,
      shadowRadius: 3,
      borderRadius: 10,
      height: hp(150),
      width: COMPONENT_SIZE.SCREEN_WIDTH * 0.7,
      backgroundColor: darkMode ? COLORS.BLACK : COLORS.WHITE,
      marginVertical: hp(5),
      elevation: 2,
      marginTop: hp(70),

      alignItems: 'center',
      justifyContent: 'center',
    },
    confirmText: {
      fontFamily: 'Poppins-Medium',
      fontSize: hp(16),
      fontWeight: '500',
      width: '90%',
      textAlign: 'center',
      color: darkMode ? COLORS.WHITE : COLORS.BLACK,
      marginBottom: hp(10),
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
    progress: {
      alignItems: 'center',
      justifyContent: 'center',
      // marginTop: hp(200),
    },
    mainText: {
      color: darkMode ? COLORS.WHITE : COLORS.BLACK,
      fontSize: wp(24),
      fontWeight: '500',
      fontFamily: 'Poppins-Medium',
      marginBottom: hp(50),
      marginTop: hp(100),
      marginLeft: wp(25),
    },
  });
