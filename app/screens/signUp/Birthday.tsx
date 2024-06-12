import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {Platform, StyleSheet, TouchableOpacity, View} from 'react-native';
// import useUsername from '~app/hooks/User';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {StackNavigationProp} from 'react-navigation/native-stack';
import IcBack from '~app/assets/images/backArrow.svg';
import ICProgress from '~app/assets/images/progressBar4.svg';
import Label from '~app/components/Label';
import MainCard from '~app/components/MainDarkCard';
import {SCREENS} from '~app/constants/navigation';
import {COLORS, hp, wp} from '~app/constants/styles';
import {InitialStackParamsList} from '~app/navigation/InitialNavigation';
import {appStateSelectors, useAppState} from '~app/state/AppState';

const Birthday: React.FC = () => {
  const navigation =
    useNavigation<StackNavigationProp<InitialStackParamsList>>();
  const darkMode = useAppState(appStateSelectors.displayMode!);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [date, setDate] = useState('');
  const [age, setAge] = useState(10000);
  const user = useAppState(state => state.user);
  const setUser = useAppState(state => state.setUser);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date: any) => {
    const formattedDate = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    setDate(formattedDate);
    const age = getAge(date.toString());
    setAge(age);
    console.log(age); // June 18, 2021
    hideDatePicker();
  };
  const getAge = (dateString: any) => {
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };
  const style = styles(darkMode);

  return (
    <>
      <MainCard customStyle={{paddingHorizontal: wp(20)}}>
        <TouchableOpacity
          style={style.backIcon}
          onPress={() => {
            navigation.goBack();
          }}>
          <IcBack color={darkMode ? COLORS.WHITE : COLORS.BLACK} />
        </TouchableOpacity>

        <Label style={style.mainText}>What is your birthday? </Label>
        <Label style={style.subText}>Please confirm your birthday below.</Label>
        <View style={{flex: 0.8}}>
          <TouchableOpacity
            style={[
              style.inputContainer,
              {
                borderColor:
                  age < 13 && age !== 10000
                    ? 'red'
                    : darkMode
                    ? COLORS.BLACK
                    : COLORS.WHITE,
              },
            ]}
            onPress={() => showDatePicker()}>
            <Label style={style.customTextInput}>
              {date === '' ? 'Select Date' : date}
            </Label>
          </TouchableOpacity>
          {age < 13 && age !== 10000 ? (
            <Label style={style.infoText}>
              {'*Birthday not valid. You must be 13+ to use this app'}
            </Label>
          ) : (
            <></>
          )}
        </View>
        <DateTimePickerModal
          //   date={new Date('1991/01/01')}
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />
        <TouchableOpacity
          style={style.progress}
          onPress={() => {
            if (age >= 13 && age !== 10000) {
              setUser({...user, date});

              navigation.navigate(SCREENS.PROFILE_PICTURE);
            }
          }}>
          <ICProgress />
        </TouchableOpacity>
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
    line: {
      height: hp(30),
      width: 2,
      backgroundColor: darkMode ? COLORS.BLACK : COLORS.GREY,
      marginHorizontal: hp(15),
    },
    inputContainer: {
      // ...commonStyles.alignItemsCenter,
      // ...commonStyles.flexRow,

      alignItems: 'center',
      flexDirection: 'row',
      marginHorizontal: wp(15),
      backgroundColor: darkMode ? COLORS.BLACK : COLORS.GREY,
      paddingHorizontal: hp(15),
      borderRadius: hp(10),
      borderWidth: 1,
      height: hp(60),
    },
    infoText: {
      fontSize: hp(12),
      fontFamily: 'Poppins-MediumItalic',
      fontWeight: '500',
      marginLeft: wp(37),
      color: darkMode ? COLORS.WHITE : COLORS.BLACK,
      marginTop: hp(10),
    },
    subText: {
      color: darkMode ? COLORS.WHITE : COLORS.BLACK,
      fontSize: wp(14),
      fontWeight: '500',
      fontFamily: 'Poppins-Medium',
      marginBottom: hp(50),
      marginTop: hp(10),
      marginLeft: hp(15),
    },
    countryButton: {
      flexDirection: 'row',
      alignItems: 'center',

      // marginLeft: wp(50),
    },

    backIcon: {
      position: 'absolute',
      top: Platform.OS === 'ios' ? hp(70) : hp(50),
      left: wp(20),
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

      marginTop: hp(100),
      marginLeft: hp(15),
    },
  });
