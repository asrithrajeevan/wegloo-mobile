import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import ReactNativeBiometrics from 'react-native-biometrics';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {StackNavigationProp} from 'react-navigation/native-stack';
import CheckBox from '~app/assets/images/check_box.svg';
import CheckBoxTick from '~app/assets/images/check_box_tick.svg';
import EyesClosed from '~app/assets/images/eyes_closed.svg';
import EyesOpen from '~app/assets/images/eyes_open.svg';
import FaceId from '~app/assets/images/face.svg';
import FingerPrint from '~app/assets/images/fingerPrint.svg';
import Info from '~app/assets/images/info.svg';
import LogoDarkSmall from '~app/assets/images/logo_small_dark.svg';
import LogoLightSmall from '~app/assets/images/logo_small_light.svg';
import RedBox from '~app/assets/images/red_box.svg';
import Button from '~app/components/Button';
import Label from '~app/components/Label';
import MainCard from '~app/components/MainCard';
import {SCREENS} from '~app/constants/navigation';
import {COLORS, hp, wp} from '~app/constants/styles';
import useSignUp from '~app/hooks/SignUp';
import {InitialStackParamsList} from '~app/navigation/InitialNavigation';
import {appStateSelectors, useAppState} from '~app/state/AppState';
import {signUpWithEmail} from '../../firebase/UserSignUp';
import ConfirmInputField from './components/ConfirmInputField';
import EmailInputField from './components/EmailInputField';
import PasswordErrorView from './components/PasswordErrorView';
import PasswordInputField from './components/PasswordInputField';

const SignUp: React.FC = () => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  // const [loader, setLoader] = useState(true);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [isFaceChecked, setIsFaceChecked] = useState(false);
  const [show, setShow] = React.useState(false);
  const [showConfirm, setConfirmShow] = React.useState(false);
  const [passwordValidator, setPasswordValidator] = React.useState(false);
  const [confirmValidator, setConfirmValidator] = React.useState(false);
  const [emailValidator, setEmailValidator] = React.useState(false);
  const [faceId, setFaceId] = React.useState(false);

  const [isSignUp, setIsSignUp] = React.useState(false);
  const darkMode = useAppState(appStateSelectors.displayMode!);
  const setAuthenticated = useAppState(state => state.setAuthenticated);
  const setLoader = useAppState(state => state.setLoader);
  const setUser = useAppState(state => state.setUser);

  const {usernameRef, passwordRef, confirmPasswordRef} = useSignUp();
  const navigation =
    useNavigation<StackNavigationProp<InitialStackParamsList>>();
  // const handleChange = (type: string, value: string) => {
  //   if (type === 'email') {
  //     setEmail(value);
  //   }
  // };
  useEffect(() => {
    checkSupport(), [];
  });

  useEffect(() => {
    if (emailValidator && passwordValidator && confirmValidator && isChecked) {
      onUserSignUp();
      // navigation.navigate(SCREENS.MODE_SELECTION);
      // setAuthenticated(true);
    }
  }, [isSignUp]);

  const storeData = async (email: string, password: string) => {
    const user = {
      email: email,
      password: password,
      biometric: isFaceChecked,
    };
    try {
      await AsyncStorage.setItem(`${email}`, JSON.stringify(user));
      await AsyncStorage.setItem(`Biometric`, JSON.stringify(isFaceChecked));
    } catch (e) {
      // saving error
    }
  };

  const onSubmitEmail = () => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    if (reg.test(email) === false || email === '') {
      setEmailError('Please enter a valid email');
      setEmailValidator(false);
    } else {
      setEmailValidator(true);
      setEmailError('');
      if (!passwordValidator && password === '')
        passwordRef.current !== null && passwordRef.current.focus();
    }
  };
  const checkSupport = async () => {
    ReactNativeBiometrics.isSensorAvailable().then(resultObject => {
      const {available, biometryType} = resultObject;

      if (available && biometryType === ReactNativeBiometrics.TouchID) {
        setFaceId(false);
        console.log('TouchID is supported');
      } else if (available && biometryType === ReactNativeBiometrics.FaceID) {
        console.log('FaceID is supported');
        setFaceId(true);
      } else if (
        available &&
        biometryType === ReactNativeBiometrics.Biometrics
      ) {
        setFaceId(false);

        console.log('Biometrics is supported');
      } else {
        setFaceId(false);

        console.log('Biometrics not supported');
      }
    });
    const {keysExist} = await ReactNativeBiometrics.biometricKeysExist();
    if (!keysExist) {
      await ReactNativeBiometrics.createKeys();
    }
  };
  const onUserSignUp = async () => {
    // setLoader(true);
    try {
      setLoader(true);
      const user = await signUpWithEmail(email, password);
      if (user.hasOwnProperty('user')) {
        // setLoader(false);
        console.log('userdetailsss', user);
        storeData(email, password);
        setUser({email: email, bioMetrics: isFaceChecked});
        setLoader(false);
        navigation.navigate(SCREENS.MODE_SELECTION);
      } else {
        setLoader(false);
        if (user.code === 'auth/email-already-in-use') {
          // setLoader(false);
          setEmailError(
            'The email address is already in use by another account.',
          );
        }
        console.log('user.message', user.message);
      }

      // if (user.email) {
      //   try {
      //     const userDetails = await addUserData(user.email, user.uid);
      //     if (userDetails) navigation.navigate(SCREEN.DASHBOARD);
      //   } catch (error) {
      //     console.log('error', error);
      //   }
      // }
    } catch (error) {
      console.log('error', error);
    }
  };

  const passwordValidation = () => {
    if (emailValidator) {
      onSubmitEmail();
    }
    let validator =
      /^.*(?=.{7,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/;
    if (!validator.test(password) || password === '') {
      setPasswordError('password wrong');
      setConfirmPasswordError('Confirm Password is wrong');
    } else {
      setPasswordValidator(true);
      if (password === confirmPassword) {
        setConfirmValidator(true);
      }
      setPasswordError('');
      if (!confirmValidator && confirmPassword === '')
        confirmPasswordRef.current !== null &&
          confirmPasswordRef.current.focus();
    }
  };
  const passwordConfirmValidation = () => {
    if (!passwordValidator) {
      passwordValidation();
    }
    if (password !== confirmPassword || password === '') {
      setPasswordError('password wrong');
      setConfirmPasswordError('Confirm Password is wrong');
    } else {
      setConfirmPasswordError('');
      if (passwordValidator) {
        setPasswordError('');
      }
      if (
        email !== '' &&
        password !== '' &&
        confirmPassword !== '' &&
        password === confirmPassword
      ) {
        setConfirmValidator(true);
        if (emailValidator && passwordValidator && isChecked) {
          onUserSignUp();
          // navigation.navigate(SCREENS.MODE_SELECTION);
          // setAuthenticated(true);
        }
      } else {
        setConfirmValidator(false);
      }
    }
  };
  const onChangeTextValues = (text: any, value: string) => {
    if (value === 'email') {
      setEmail(text);
    } else if (value === 'password') {
      setPassword(text);
      setPasswordValidator(false);
      setConfirmValidator(false);
    } else {
      setConfirmPassword(text);
      setConfirmValidator(false);
    }
  };

  const onPressSignUp = () => {
    if (emailValidator && passwordValidator && confirmValidator && isChecked) {
      onUserSignUp();
      // navigation.navigate(SCREENS.MODE_SELECTION);
      // setAuthenticated(true);
    } else {
      onSubmitEmail();
      passwordValidation();
      passwordConfirmValidation();
      setIsSignUp(true);
    }
  };
  const styles = style(darkMode);
  return (
    <>
      <MainCard customStyle={{paddingHorizontal: wp(10)}}>
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          <View style={styles.container}>
            {darkMode ? <LogoDarkSmall /> : <LogoLightSmall />}
            <Label style={styles.heading}>{'Sign Up'}</Label>
            <View style={styles.line}></View>

            <EmailInputField
              from="SignUp"
              usernameRef={usernameRef}
              email={email}
              onSubmitEditing={() => onSubmitEmail}
              onChangeTextValues={(text: any) =>
                onChangeTextValues(text, 'email')
              }
              onPressButton={() => {}}
              error={emailError}
              handleChange={() => {}}
              placeholderTextColor={COLORS.THIN_GREY}
            />

            <PasswordInputField
              from="SignUp"
              onSubmitEditing={() => passwordValidation}
              passwordRef={passwordRef}
              passwordStrength={passwordValidator}
              password={password}
              onChangeTextValues={(text: any) =>
                onChangeTextValues(text, 'password')
              }
              handleChange={() => {}}
              error={passwordError}
              onPressButton={() => {
                setShow(!show);
              }}
              placeholderTextColor={COLORS.THIN_GREY}
              secureTextEntry={show}
              rightIcon={show ? <EyesOpen /> : <EyesClosed />}
            />

            <ConfirmInputField
              onSubmitEditing={() => passwordConfirmValidation}
              onChangeTextValues={(text: any) =>
                onChangeTextValues(text, 'confirmPassword')
              }
              confirmValidator={confirmValidator}
              onPressButton={() => {
                setConfirmShow(!showConfirm);
              }}
              rightIcon={showConfirm ? <EyesOpen /> : <EyesClosed />}
              secureTextEntry={showConfirm}
              confirmPassword={confirmPassword}
              confirmPasswordRef={confirmPasswordRef}
              handleChange={() => {}}
              error={confirmPasswordError}
            />
            {passwordError !== '' && !passwordValidator && (
              <PasswordErrorView />
            )}

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginHorizontal: hp(30),
              }}>
              <TouchableOpacity
                style={styles.checkBoxAgreement}
                onPress={() => {
                  setIsChecked(!isChecked);
                }}>
                {!isChecked && isSignUp ? (
                  <RedBox />
                ) : !isChecked ? (
                  <CheckBox />
                ) : (
                  <CheckBoxTick />
                )}
              </TouchableOpacity>
              <View style={{alignItems: 'flex-start', marginLeft: hp(5)}}>
                <Label
                  style={{
                    marginTop: hp(20),
                    fontFamily: 'Poppins-Regular',
                    fontSize: hp(13),
                    fontWeight: '400',
                    color: darkMode ? COLORS.WHITE : COLORS.THIN_GREY,
                  }}>
                  {
                    'By signing up I agree that I’m 18 years of age or older, to the '
                  }
                  <Label
                    style={{
                      marginTop: hp(20),
                      fontFamily: 'Poppins-Regular',
                      fontSize: hp(13),
                      fontWeight: '400',
                      color: darkMode ? COLORS.WHITE : COLORS.BLACK,
                    }}>
                    {
                      'User Agreements, Privacy Policy, Cookie Policy, E-Sign Consent.'
                    }
                  </Label>
                </Label>
              </View>
            </View>
            {isSignUp && !isChecked && (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginHorizontal: hp(26),
                  marginTop: hp(20),
                }}>
                <Info />

                <View style={{alignItems: 'flex-start', marginLeft: hp(25)}}>
                  <Label
                    style={{
                      fontFamily: 'Poppins-Regular',
                      fontSize: hp(14),
                      fontWeight: '400',
                      color: darkMode ? COLORS.WHITE : COLORS.BLACK,
                    }}>
                    {
                      'You must agree to the terms and conditions above to proceed.'
                    }
                  </Label>
                </View>
              </View>
            )}

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                width: '100%',
                marginTop: hp(20),
                marginLeft: hp(25),
              }}>
              <TouchableOpacity
                style={styles.checkBox}
                onPress={() => {
                  setIsFaceChecked(!isFaceChecked);
                }}>
                {!isFaceChecked ? <CheckBox /> : <CheckBoxTick />}
              </TouchableOpacity>

              <Label
                style={{
                  marginLeft: wp(5),
                  fontFamily: 'Poppins-Regular',
                  fontSize: hp(14),
                  color: darkMode ? COLORS.WHITE : COLORS.THIN_GREY,
                }}>
                {faceId ? 'Enable Face ID    ' : 'Enable Touch ID    '}
              </Label>
              {faceId ? <FaceId /> : <FingerPrint />}
            </View>
            <Button
              label="Sign up"
              labelStyle={{fontFamily: 'Poppins-SemiBold', fontSize: 14}}
              disabled={false}
              style={{marginHorizontal: hp(20), marginTop: hp(20)}}
              onPress={() => {
                onPressSignUp();
              }}
            />

            <View style={{flexDirection: 'row'}}>
              <Label
                style={{
                  marginLeft: wp(20),
                  fontFamily: 'Poppins-Medium',
                  fontWeight: '500',
                  fontSize: hp(14),
                  color: darkMode ? COLORS.WHITE : COLORS.BLACK,
                }}>
                {' Already have an account?'}
              </Label>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate(SCREENS.SIGN_IN);
                }}>
                <Label
                  style={{
                    marginLeft: wp(5),
                    fontFamily: 'Poppins-Medium',
                    fontWeight: '500',
                    fontSize: hp(14),
                    color: COLORS.THEME_BLUE,
                  }}>
                  {' Login  '}
                </Label>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </MainCard>
    </>
  );
};
const style = (darkMode: boolean) =>
  StyleSheet.create({
    container: {
      alignItems: 'center',
      // marginTop: hp(10),
      paddingBottom: hp(40),

      // height: hp(350),
      width: '100%',
    },
    checkBox: {
      height: 40,
      width: 40,
      alignItems: 'center',
      justifyContent: 'center',
    },
    checkBoxAgreement: {
      height: 40,
      width: 40,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: hp(15),
    },
    textInput: {
      width: '100%',
      color: COLORS.BLACK,
      fontFamily: 'Poppins-Regular',
      fontSize: 14,
    },
    email: {fontFamily: 'Poppins-Regular', fontSize: 14, marginLeft: hp(20)},
    line: {
      height: hp(2),
      width: '90%',
      backgroundColor: COLORS.LIGHT_GRAY,
      marginTop: hp(10),
    },
    heading: {
      fontFamily: 'Poppins-Bold',
      fontSize: hp(32),
      fontWeight: '600',
      marginTop: hp(45),
      color: darkMode ? COLORS.WHITE : COLORS.BLACK,
    },
  });

export default SignUp;
