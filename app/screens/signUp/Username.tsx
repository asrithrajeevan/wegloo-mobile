import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {Keyboard, StyleSheet, TouchableOpacity, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {StackNavigationProp} from 'react-navigation/native-stack';
import IcBack from '~app/assets/images/backArrow.svg';
import ICProgress from '~app/assets/images/progressBar2.svg';
import Input from '~app/components/Input';
import Label from '~app/components/Label';
import MainCard from '~app/components/MainDarkCard';
import {SCREENS} from '~app/constants/navigation';
import {COLORS, hp, wp} from '~app/constants/styles';
import useSignUp from '~app/hooks/SignUp';
import {InitialStackParamsList} from '~app/navigation/InitialNavigation';
import {appStateSelectors, useAppState} from '~app/state/AppState';
import {commonStyles} from '~app/styles/styleContants';

const UserName: React.FC = () => {
  const {fetchUsers} = useSignUp();
  useEffect(() => {
    fetchUsers('@test');
  }, []);
  const allUsers = useAppState(state => state.allUsers);
  const setUser = useAppState(state => state.setUser);
  const user = useAppState(state => state.user);

  const navigation =
    useNavigation<StackNavigationProp<InitialStackParamsList>>();
  const darkMode = useAppState(appStateSelectors.displayMode!);
  const setAuthenticated = useAppState(state => state.setAuthenticated);
  const [check, setCheck] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('@');
  const [profileName, setProfileName] = useState('');
  const [firstError, setfirstError] = useState('');
  const [signUp, setIsSignUp] = useState(false);

  const [lastError, setLastError] = useState('');
  const [profileNameError, setProfileNameError] = useState('');

  const [usernameError, setUserNameError] = useState('');
  useEffect(() => {
    console.log('allusersss', allUsers);
  }, [allUsers]);

  const style = styles(darkMode);
  const onhandleSubmit = () => {
    setIsSignUp(true);
    var filtered = allUsers.filter((user: any) => user.username === username);
    console.log('usernameee', filtered);
    if (!username.startsWith('@')) {
      var str1 = '@';
      var str2 = username;
      var res = str1.concat(str2);

      setUsername(res);
    }
    if (username === '') {
      setUserNameError('* Please enter a valid username');
    }
    if (filtered.length > 0) {
      setUserNameError('* username not available.Please try again');
    }
    if (firstName === '') {
      setfirstError('* Please enter first name');
    }
    if (profileName === '') {
      setProfileNameError('* Please enter profile name');
    }
    if (lastName === '') {
      setLastError('* Please enter last name');
    }
    if (
      username !== '' &&
      filtered.length === 0 &&
      username.startsWith('@') &&
      username !== '' &&
      firstName !== '' &&
      lastName !== '' &&
      profileName !== ''
    ) {
      setUser({
        ...user,
        username,
        firstName,
        lastName,
        profileName: profileName.trim().replace(/(\r\n|\n|\r)/gm, ''),
      });

      navigation.navigate(SCREENS.PHONE_NUMBER);
      // setAuthenticated(true);
    }
  };
  console.log('userrrrrr', username);
  return (
    <MainCard>
      <View style={style.containter}>
        <TouchableOpacity
          style={style.backIcon}
          onPress={() => {
            navigation.goBack();
          }}>
          <IcBack color={darkMode ? COLORS.WHITE : COLORS.BLACK} />
        </TouchableOpacity>
        {/* <IcBack
          onPressIn={onBack}
          style={style.backIcon}
          color={darkMode ? COLORS.WHITE : COLORS.BLACK}
        /> */}

        <View style={[commonStyles.mh_32, commonStyles.mt_70]}>
          <Label style={style.mainText}>Let’s set up your profile</Label>
          <Label style={style.subText}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </Label>
        </View>
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          <View style={[commonStyles.mh_32, commonStyles.mt_40]}>
            {/* <Formik initialValues={initialValues} onSubmit={onUser}>
              {({
                errors,
                values,
                dirty,
                isValid,
                touched,
                handleBlur,
                handleChange,
                handleSubmit,
              }) => ( */}
            <>
              <View>
                <Label style={[style.name]}>{'First Name'}</Label>
                <Input
                  // innerRef={firstNameRef}
                  containerStyle={{height: hp(60)}}
                  style={style.textInput}
                  returnKeyType="next"
                  secureTextEntry={true}
                  value={firstName}
                  placeholderTextColor={
                    darkMode ? COLORS.WHITE_LIGHT : COLORS.THIN_GREY
                  }
                  onPressButton={() => {}}
                  error={firstError}
                  onChangeText={text => {
                    setFirstName(text);
                    setfirstError('');
                  }}
                  placeholder="First Name"
                />
                {/* {firstError ? (
                  <Label style={style.infoText}>{firstError}</Label>
                ) : (
                  <></>
                )} */}
              </View>
              <View>
                <Label style={[style.name]}>{'Last Name'}</Label>
                <Input
                  // innerRef={lastNameRef}
                  secureTextEntry={true}
                  placeholderTextColor={
                    darkMode ? COLORS.WHITE_LIGHT : COLORS.THIN_GREY
                  }
                  containerStyle={{height: hp(60)}}
                  style={style.textInput}
                  returnKeyType="next"
                  value={lastName}
                  error={lastError}
                  onChangeText={text => {
                    setLastName(text);
                    setLastError('');
                  }}
                  onPressButton={() => {}}
                  placeholder="Last Name"
                />
                {/* {lastError ? (
                  <Label style={style.infoText}>{lastError}</Label>
                ) : (
                  <></>
                )} */}
              </View>
              <View>
                <Label style={[style.name]}>{'Name shown on profile'}</Label>
                <Input
                  containerStyle={{height: hp(72)}}
                  style={[style.textInputName, {textAlignVertical: 'top'}]}
                  returnKeyType="next"
                  value={profileName}
                  placeholderTextColor={
                    darkMode ? COLORS.WHITE_LIGHT : COLORS.THIN_GREY
                  }
                  error={profileNameError}
                  onSubmitEditing={() => {
                    Keyboard.dismiss();
                  }}
                  secureTextEntry={true}
                  onChangeText={text => {
                    setProfileName(text);
                    setProfileNameError('');
                  }}
                  onPressButton={() => {}}
                  multiline={true}
                  // placeholder="Hey There!\nHow are You?"
                  placeholder="Type your name as you’d like it shown on your profile. "
                />
                {/* {profileNameError ? (
                  <Label style={style.infoText}>{profileNameError}</Label>
                ) : (
                  <></>
                )} */}
              </View>
              <View>
                <Label style={[style.name]}>{'Username'}</Label>
                <Input
                  // innerRef={lastNameRef}
                  containerStyle={{height: hp(60)}}
                  style={style.textInput}
                  placeholderTextColor={
                    darkMode ? COLORS.WHITE_LIGHT : COLORS.THIN_GREY
                  }
                  returnKeyType="next"
                  value={username}
                  secureTextEntry={true}
                  error={usernameError}
                  onPressButton={() => {}}
                  onChangeText={text => {
                    setUsername(text);
                    setUserNameError('');
                  }}
                  placeholder="@username"
                />
                {usernameError ? (
                  <Label style={style.infoText}>{usernameError}</Label>
                ) : (
                  <></>
                )}
              </View>
              <View style={style.conditionView}>
                {/* <TouchableOpacity
                  onPress={() => {
                    setCheck(!check);
                  }}>
                  {!check ? (
                    <ICGrey color={signUp ? 'red' : '#828282'} />
                  ) : (
                    <ICColorTick />
                  )}
                </TouchableOpacity> */}
                {/* <View
                  style={{
                    ...commonStyles.ml_12,

                    flex: 1,
                    flexDirection: 'row',
                  }}>
                  <Label style={style.condition}>I agree to the </Label>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate(SCREENS.TERMS_CONDITIONS);
                    }}>
                    <Label
                      style={style.conditionDark}
                      onPress={() => navigation.goBack()}>
                      Terms of Service
                    </Label>
                  </TouchableOpacity>
                  <Label style={style.condition}> and </Label>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate(SCREENS.PRIVACY_POLICY);
                    }}>
                    <Label style={style.conditionDark}>Privacy </Label>
                  </TouchableOpacity>
                </View> */}

                {/* <Label style={style.condition}>
                    {'I agree to the Terms of Service and Privacy Policy'}
                  </Label> */}
              </View>
              {/* <TouchableOpacity
                onPress={() => {
                  navigation.navigate(SCREENS.PRIVACY_POLICY);
                }}>
                <Label style={style.conditionDarkView}>Policy </Label>
              </TouchableOpacity> */}
              <TouchableOpacity
                style={style.progress}
                onPress={() => onhandleSubmit()}>
                <ICProgress />
              </TouchableOpacity>
            </>

            {/* </Formik> */}
          </View>
        </KeyboardAwareScrollView>
      </View>
    </MainCard>
  );
};
export default UserName;

const styles = (darkMode: boolean) =>
  StyleSheet.create({
    containter: {
      flex: 1,
    },
    backIcon: {
      position: 'absolute',
      top: 20,
      left: 30,
      width: wp(90),

      height: hp(60),

      color: darkMode ? COLORS.WHITE : COLORS.BLACK,
    },
    infoText: {
      fontSize: hp(13),
      fontFamily: 'Poppins-MediumItalic',
      fontWeight: '500',
      marginLeft: wp(20),
      color: darkMode ? COLORS.WHITE : COLORS.BLACK,
    },
    progress: {
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: hp(40),
      flex: 1,
    },
    condition: {
      fontSize: hp(12),
      fontWeight: '500',
      fontFamily: 'Poppins-Medium',
      // marginLeft: wp(10),
      color: darkMode ? COLORS.THIN_GREY : COLORS.BLACK,
    },
    conditionDark: {
      fontSize: hp(12),
      fontWeight: '600',
      fontFamily: 'Poppins-SemiBold',
      // marginLeft: wp(10),
      color: darkMode ? COLORS.WHITE : COLORS.BLACK,
    },
    conditionDarkView: {
      flexDirection: 'row',
      alignItems: 'center',
      width: '100%',
      marginLeft: wp(40),
      fontWeight: '600',
      fontFamily: 'Poppins-SemiBold',
      fontSize: hp(12),
      // marginLeft: wp(10),
      color: darkMode ? COLORS.WHITE : COLORS.BLACK,
    },
    conditionView: {
      flexDirection: 'row',
      alignItems: 'center',
      width: '100%',
      // marginLeft: wp(15),
      marginTop: hp(20),
    },

    textInput: {
      width: '100%',
      color: darkMode ? COLORS.WHITE : COLORS.BLACK,
      fontFamily: 'Poppins-Regular',
      fontSize: hp(16),
      ...commonStyles.fw_400,
    },
    textInputName: {
      fontSize: hp(15),
      color: darkMode ? COLORS.WHITE : COLORS.BLACK,
      width: '100%',

      fontFamily: 'Poppins-Regular',

      ...commonStyles.fw_400,
    },

    name: {
      fontFamily: 'Poppins-Medium',
      fontSize: hp(16),
      ...commonStyles.fw_500,
      ...commonStyles.mb_12,
      // ...commonStyles.ml_10,
      color: darkMode ? COLORS.WHITE : COLORS.BLACK,
    },
    image: {
      alignSelf: 'flex-end',
      marginRight: -30,
      width: wp(384),
      height: hp(300),
      ...commonStyles.mb_20,
    },
    mainText: {
      color: darkMode ? COLORS.WHITE : COLORS.BLACK,
      fontSize: hp(22),
      fontWeight: '600',
      fontFamily: 'Poppins-SemiBold',
    },
    subText: {
      color: darkMode ? COLORS.WHITE : COLORS.BLACK,
      fontSize: hp(14),
      fontFamily: 'Poppins-Medium',
      ...commonStyles.fw_500,
      ...commonStyles.mt_4,
    },
  });
