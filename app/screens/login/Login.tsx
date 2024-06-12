import AsyncStorage from '@react-native-async-storage/async-storage';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import ReactNativeBiometrics from 'react-native-biometrics';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import TouchID from 'react-native-touch-id';
import {StackNavigationProp} from 'react-navigation/native-stack';
import CheckBox from '~app/assets/images/check_box.svg';
import CheckBoxTick from '~app/assets/images/check_box_tick.svg';
import CheckBoxColor from '~app/assets/images/colorTick.svg';
import EyesClosed from '~app/assets/images/eyes_closed.svg';
import EyesOpen from '~app/assets/images/eyes_open.svg';
import FaceId from '~app/assets/images/face.svg';
import FingerPrint from '~app/assets/images/fingerPrint.svg';
import Info from '~app/assets/images/info.svg';
import LogoDarkSmall from '~app/assets/images/logo_small_dark.svg';
import LogoLightSmall from '~app/assets/images/logo_small_light.svg';
import Button from '~app/components/Button';
import Label from '~app/components/Label';
import MainCard from '~app/components/MainCard';
import {SCREENS} from '~app/constants/navigation';
import {COLORS, hp, wp} from '~app/constants/styles';
import useSignUp from '~app/hooks/SignUp';
import {InitialStackParamsList} from '~app/navigation/InitialNavigation';
import {appStateSelectors, useAppState} from '~app/state/AppState';
import {signInWithEmail} from '../../firebase/UserSignIn';
import EmailInputField from '../signUp/components/EmailInputField';
import PasswordInputField from '../signUp/components/PasswordInputField';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  // const [loader, setLoader] = useState(true);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const setLoader = useAppState(state => state.setLoader);
  const [bioMetric, setBioMetric] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [isFaceChecked, setIsFaceChecked] = useState(false);
  const [userPassword, setUserPassword] = React.useState('');

  const [show, setShow] = React.useState(false);
  const [showConfirm, setConfirmShow] = React.useState(false);
  const [passwordValidator, setPasswordValidator] = React.useState(false);
  const [confirmValidator, setConfirmValidator] = React.useState(false);
  const [emailValidator, setEmailValidator] = React.useState(false);
  const [isSignUp, setIsSignUp] = React.useState(false);
  const [bioSucess, setBioSuccess] = React.useState(false);
  const isFocused = useIsFocused();

  const darkMode = useAppState(appStateSelectors.displayMode!);
  const setAuthenticated = useAppState(state => state.setAuthenticated);
  const setUser = useAppState(state => state.setUser);
  const setUiId = useAppState(state => state.setUiId);

  const {usernameRef, passwordRef, confirmPasswordRef} = useSignUp();

  useEffect(() => {
    getUser();
    getBioMetricData();
  }, [isFocused]);
  const navigation =
    useNavigation<StackNavigationProp<InitialStackParamsList>>();
  // const handleChange = (type: string, value: string) => {
  //   if (type === 'email') {
  //     setEmail(value);
  //   }
  // };
  const handleFaceId = async () => {
    const {biometryType} = await ReactNativeBiometrics.isSensorAvailable();
    if (biometryType === ReactNativeBiometrics.Biometrics) {
      //do something face id specific
      console.log('faceiddd');
    }
  };

  useEffect(() => {
    checkSupport();
    getUser();
  }, []);
  const checkSupport = async () => {
    ReactNativeBiometrics.isSensorAvailable().then(resultObject => {
      const {available, biometryType} = resultObject;

      if (available && biometryType === ReactNativeBiometrics.TouchID) {
        setIsFaceChecked(false);
        console.log('TouchID is supported');
      } else if (available && biometryType === ReactNativeBiometrics.FaceID) {
        console.log('FaceID is supported');
        setIsFaceChecked(true);
      } else if (
        available &&
        biometryType === ReactNativeBiometrics.Biometrics
      ) {
        setIsFaceChecked(false);

        console.log('Biometrics is supported');
      } else {
        console.log('Biometrics not supported');
      }
    });
    const {keysExist} = await ReactNativeBiometrics.biometricKeysExist();
    if (!keysExist) {
      await ReactNativeBiometrics.createKeys();
    }
  };

  const useBioMetric = async () => {
    getData(email);
    let epochTimeSeconds = Math.round(new Date().getTime() / 1000).toString();
    let payload = epochTimeSeconds + 'some message';

    await ReactNativeBiometrics.createSignature({
      promptMessage: 'Touch id for "Wegloo"',
      payload: payload,
    }).then(resultObject => {
      console.log('resultObject', resultObject);
      const {success, signature} = resultObject;

      if (success) {
        setBioSuccess(true);
        onUserSignUp('biometrics');
        console.log('signature', signature);
      }
    });
  };
  const getData = async (email: string) => {
    try {
      const value = await AsyncStorage.getItem(`${email}`);
      console.log('emaillllllllll', value);

      if (value !== null) {
        const user = JSON.parse(value);
        setUserPassword(user.password);
        setBioMetric(user.biometric);
        // value previously stored
      }
    } catch (e) {
      // error reading value
    }
  };
  const getBioMetricData = async () => {
    try {
      const value = await AsyncStorage.getItem(`Biometric`);

      console.log('emaillllllllll', value);

      if (value !== null) {
        const biometric = JSON.parse(value);
        setBioMetric(biometric);
        // value previously stored
      }
    } catch (e) {
      // error reading value
    }
  };

  const getUser = async () => {
    try {
      const value = await AsyncStorage.getItem('user');
      console.log('emaillllllllll', value);

      if (value !== null) {
        const user = JSON.parse(value);
        if (user.remember) {
          setEmail(user.email);
          setPassword(user.password);
          setIsChecked(user.remember);
        }
        // value previously stored
      }
    } catch (e) {
      // error reading value
    }
  };

  useEffect(() => {
    if (emailValidator && passwordValidator && confirmValidator && isChecked) {
      onUserSignUp('login');
      // navigation.navigate(SCREENS.MODE_SELECTION);
      // setAuthenticated(true);
    }
  }, [isSignUp]);
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
    getData(email);
    // auth()
    //   .signInAnonymously()
    //   .then(() => {
    //     fetchUser(email);
    //     console.log('User signed in anonymously');
    //   })
    //   .catch(error => {
    //     if (error.code === 'auth/operation-not-allowed') {
    //       console.log('Enable anonymous in your firebase console.');
    //     }

    //     console.error(error);
    //   });
    // fetchUser(email);
  };

  const storeData = async (type: string) => {
    const user = {
      email: email,
      password: type === 'biometrics' ? userPassword : password,
      remember: isChecked,
    };
    try {
      await AsyncStorage.setItem('user', JSON.stringify(user));
    } catch (e) {
      // saving error
    }
  };

  const onUserSignUp = async (type: string) => {
    // setLoader(true);
    try {
      const pass = type === 'biometrics' ? userPassword : password;
      console.log('contact', email, userPassword);
      if (email !== '' && email !== null && pass !== null && pass !== '') {
        setLoader(true);

        const user = await signInWithEmail(email, pass);
        if (user.hasOwnProperty('user')) {
          storeData(type);
          // setLoader(false);

          setUiId(user.uid);
          setUser({email: email});
          setLoader(false);
          setAuthenticated(true);

          /* ... */
        } else {
          setLoader(false);
          setEmailError('Email address not found');

          if (user.code === 'auth/user-not-found') {
            setEmailError('Email address not found');
          } else if (user.code === 'auth/invalid-email') {
            // setLoader(false);
            setEmailError('Invalid email format');
          } else if (user.code === 'auth/wrong-password') {
            setPasswordError('incorrect password');
          }
          console.log('user.message', user.message);
        }
      } else {
        if (email === '') {
          setEmailError('Please enter a valid email');
        }
        if (password === '' || password === null) {
          setPasswordError('Please enter your password');
        }
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
  const optionalConfigObject = {
    title: 'Authentication Required', // Android
    color: '#e00606', // Android,
    fallbackLabel: 'Show Passcode', // iOS (if empty, then label is hidden)
  };

  const pressHandler = () => {
    TouchID.authenticate(
      'to demo this react-native component',
      optionalConfigObject,
    )
      .then(success => {
        console.log('suceesss', success);
        //  AlertIOS.alert('Authenticated Successfully');
      })
      .catch(error => {
        console.log('suceessserror', error);
        //  AlertIOS.alert('Authentication Failed');
      });
  };
  const clickHandler = () => {
    TouchID.isSupported()
      .then(biometryType => {
        console.log('biometryType', biometryType);
        // Success code
        if (biometryType === 'FaceID') {
          console.log('FaceID is supported.');
        } else if (biometryType === 'TouchID') {
          console.log('TouchID is supported.');
        } else if (biometryType === true) {
          // Touch ID is supported on Android
          const optionalConfigObject = {
            title: 'Touch ID fro "Wegloo"', // Android
            imageColor: '#e00606', // Android
            imageErrorColor: '#ff0000', // Android
            sensorDescription: 'Touch sensor', // Android
            sensorErrorDescription: 'Failed', // Android
            cancelText: 'Cancel', // Android
            fallbackLabel: 'Show Passcode', // iOS (if empty, then label is hidden)
            unifiedErrors: false, // use unified error messages (default false)
            passcodeFallback: false, // iOS - allows the device to fall back to using the passcode, if faceid/touch is not available. this does not mean that if touchid/faceid fails the first few times it will revert to passcode, rather that if the former are not enrolled, then it will use the passcode.
          };

          TouchID.authenticate('Please log in ', optionalConfigObject)
            .then((success: any) => {
              console.log('sucesssss', success);
            })
            .catch((error: any) => {
              console.log('error', error);
            });
        }
      })
      .catch(error => {
        // Failure code if the user's device does not have touchID or faceID enabled
        console.log('toucherror', error);
      });
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
          onUserSignUp('login');
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
    onUserSignUp('login');
    // navigation.navigate(SCREENS.MODE_SELECTION);
    // setAuthenticated(true);
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
            <Label style={styles.heading}>{'Login'}</Label>
            <View style={styles.line}></View>

            <EmailInputField
              from="Login"
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
              from="Login"
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
                !bioMetric ? setShow(!show) : useBioMetric();
              }}
              secureTextEntry={show}
              rightIcon={
                !bioMetric ? (
                  show ? (
                    <EyesOpen />
                  ) : (
                    <EyesClosed />
                  )
                ) : isFaceChecked ? (
                  <FaceId />
                ) : (
                  <FingerPrint />
                )
              }
              placeholderTextColor={COLORS.THIN_GREY}
            />
            {passwordError ? (
              <View style={styles.errorView}>
                <Info />
                <Label style={styles.infoText}>{passwordError}</Label>
              </View>
            ) : (
              <></>
            )}
            <View style={styles.remeberView}>
              <TouchableOpacity
                activeOpacity={1}
                style={styles.checkBoxView}
                onPress={() => {
                  setIsChecked(!isChecked);
                }}>
                {!isChecked ? (
                  <CheckBox />
                ) : darkMode ? (
                  <CheckBoxColor />
                ) : (
                  <CheckBoxTick />
                )}
                <Label
                  style={[
                    styles.rememberMe,
                    {marginLeft: wp(10)},
                  ]}>{`Remember me`}</Label>
              </TouchableOpacity>
              <Label style={[styles.rememberMe, {color: COLORS.THEME_BLUE}]}>
                {'Forgot Password?'}
              </Label>
            </View>

            <Button
              label="Login"
              labelStyle={{
                fontFamily: 'Poppins-SemiBold',
                fontSize: hp(14),
                fontWeight: '600',
              }}
              disabled={false}
              style={{marginHorizontal: hp(20), marginTop: hp(40)}}
              onPress={() => {
                onPressSignUp();
              }}
            />

            <View style={{flexDirection: 'row', marginTop: hp(30)}}>
              <Label
                style={{
                  marginLeft: wp(20),
                  fontFamily: 'Poppins-Medium',
                  fontWeight: '500',
                  fontSize: hp(14),
                  color: darkMode ? COLORS.WHITE : COLORS.BLACK,
                }}>
                {`Don't have an account?`}
              </Label>
              <TouchableOpacity
                onPress={() => {
                  // handleFaceId();
                  // clickHandler();
                  // pressHandler();
                  navigation.navigate(SCREENS.SIGNUP);
                }}>
                <Label
                  style={{
                    marginLeft: wp(5),
                    fontFamily: 'Poppins-SemiBold',
                    fontWeight: '600',
                    fontSize: hp(14),
                    color: COLORS.THEME_BLUE,
                  }}>
                  {' Sign Up  '}
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
    infoText: {
      fontSize: hp(13),
      fontFamily: 'Poppins-Regular',
      marginLeft: wp(20),
      color: darkMode ? COLORS.WHITE : COLORS.BLACK,
    },
    errorView: {
      flexDirection: 'row',
      paddingHorizontal: wp(20),
      width: '100%',
      // marginTop: hp(10),
    },
    rememberMe: {
      fontFamily: 'Poppins-Regular',
      fontWeight: '400',
      fontSize: hp(14),
      color: darkMode ? COLORS.THIN_GREY : COLORS.BLACK,
    },
    remeberView: {
      flexDirection: 'row',
      flex: 1,
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      paddingHorizontal: wp(20),
      marginTop: hp(10),
    },
    checkBoxView: {
      height: 40,
      flexDirection: 'row',
      alignItems: 'center',
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
      marginBottom: hp(10),
    },
    heading: {
      fontFamily: 'Poppins-Bold',
      fontSize: hp(32),
      fontWeight: '600',
      marginTop: hp(45),
      color: darkMode ? COLORS.WHITE : COLORS.BLACK,
    },
  });

export default Login;
