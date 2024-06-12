import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {
  Keyboard,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import CountryPicker from 'react-native-country-picker-modal';
import {StackNavigationProp} from 'react-navigation/native-stack';
import IcBack from '~app/assets/images/backArrow.svg';
import IcArrow from '~app/assets/images/downArrow.svg';
import ICProgress from '~app/assets/images/progressBar3.svg';
import Label from '~app/components/Label';
import MainCard from '~app/components/MainDarkCard';
import {SCREENS} from '~app/constants/navigation';
import {COLORS, hp, wp} from '~app/constants/styles';
import {Country, CountryCode} from '~app/constants/types';
// import useUsername from '~app/hooks/User';
import {InitialStackParamsList} from '~app/navigation/InitialNavigation';
import {appStateSelectors, useAppState} from '~app/state/AppState';

let phoneMasked = '';
let enteredNumber: '';

const PhoneNumber: React.FC = () => {
  const phoneInput = useRef(null);
  const [countryCode, setCountryCode] = useState<CountryCode>('US');
  const [country, setCountry] = useState<Country>(null);

  const [visibleCountry, setVisibleCountry] = useState<boolean>(false);
  const [countryCodeValue, setCountryCodeValue] = useState<number>(1);

  const [phoneError, setPhoneError] = useState<string>('');

  const [phone, setPhone] = useState('');
  const user = useAppState(state => state.user);
  const setUser = useAppState(state => state.setUser);

  console.log('userrrr', user);
  const navigation =
    useNavigation<StackNavigationProp<InitialStackParamsList>>();
  const darkMode = useAppState(appStateSelectors.displayMode!);
  const setCountryCodeName = useAppState(appStateSelectors.setCountryCodeName!);
  const setCallingCode = useAppState(appStateSelectors.setCallingCode!);
  const setPhoneNumber = useAppState(appStateSelectors.setPhoneNumber!);

  const onSelect = (country: Country) => {
    console.log('onSelect', country.cca2);
    setCountryCode(country.cca2);
    setCountryCodeName(country.cca2);
    setCallingCode(country.callingCode);
    setCountryCodeValue(country.callingCode);
    setCountry(country);
  };
  useEffect(() => {
    setCallingCode('1');
    setCountryCodeName('US');
  }, []);
  const onOpen = () => {
    setVisibleCountry(!visibleCountry);
  };
  const style = styles(darkMode);
  const onChangePhone = (newPhone: string) => {
    const phoneReplaced = newPhone
      .replace(/ /g, '')
      .replace('(', '')
      .replace(')', '')
      .replace('-', '');

    const phoneTrim = phoneReplaced.match(/(.{0,3})(.{0,3})(.{0,4})/);
    enteredNumber = phoneTrim[0];
    phoneMasked = phoneTrim
      ? !phoneTrim[2]
        ? phoneTrim[1]
        : `(${phoneTrim[1]})   ${phoneTrim[2]} ${
            phoneTrim[3] ? '  ' + phoneTrim[3] : ' '
          }`
      : '';
    setPhoneNumber(phoneMasked);
    return setPhone(phoneMasked);
  };

  const phoneValidation = () => {
    console.log('enteredNumber', enteredNumber);
    const regex = /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/i;
    return !(
      !enteredNumber ||
      regex.test(enteredNumber) === false ||
      enteredNumber.length < 10
    );
  };
  const handleClick = React.useCallback(() => {
    console.log('enteredddd', countryCode);
    // handle the click event
    // setCountryCodeName(countryCode);
    // setCallingCode(countryCodeValue);
    if (phoneValidation()) {
      setPhoneError('');
      console.log('palalaaaaa', phoneMasked);
      setUser({
        ...user,
        phoneNumber: phoneMasked,
        countryCode: countryCodeValue,
      });

      navigation.navigate(SCREENS.CONFIRM_PHONE);
    } else {
      setPhoneError('* Please enter a valid phone number');
    }
  }, []);
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

        <Label style={style.mainText}>What is your phone number?</Label>
        <TouchableOpacity
          activeOpacity={1}
          style={{flex: 0.8}}
          onPress={() => {
            Keyboard.dismiss();
          }}>
          <View
            style={[
              style.inputContainer,
              {borderColor: phoneError === '' ? COLORS.WHITE : 'red'},
            ]}>
            <TouchableOpacity
              style={style.countryButton}
              onPress={() => {
                onOpen();
              }}>
              <CountryPicker
                {...{
                  countryCode,
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
            <Label style={style.countryCode}>{`+${countryCodeValue}`}</Label>

            <TextInput
              placeholder={'(000)  000  0000'}
              placeholderTextColor={darkMode ? COLORS.THIN_GREY : '#636472'}
              keyboardType="phone-pad"
              maxLength={18}
              ref={phoneInput}
              onChangeText={text => {
                onChangePhone(text);
              }}
              value={phone}
              style={style.customTextInput}></TextInput>
          </View>
          {phoneError ? (
            <Label style={style.infoText}>{phoneError}</Label>
          ) : (
            <></>
          )}
        </TouchableOpacity>
        <TouchableOpacity style={style.progress} onPress={handleClick}>
          <ICProgress />
        </TouchableOpacity>
      </MainCard>
    </>
  );
};

export default PhoneNumber;
const styles = (darkMode: boolean) =>
  StyleSheet.create({
    containter: {
      flex: 1,
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
      fontSize: wp(23),
      fontWeight: '500',
      fontFamily: 'Poppins-Medium',
      marginBottom: hp(50),
      marginTop: hp(100),
      marginLeft: hp(25),
    },
  });
