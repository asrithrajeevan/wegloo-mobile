import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  Animated,
  Easing,
  Image,
  Keyboard,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import {StackNavigationProp} from 'react-navigation/native-stack';
import IcBack from '~app/assets/images/backArrow.svg';
import Label from '~app/components/Label';
import MainCard from '~app/components/MainDarkCard';
import {SCREENS} from '~app/constants/navigation';
import {COLORS, COMPONENT_SIZE, hp, wp} from '~app/constants/styles';
// import useUsername from '~app/hooks/User';
import {InitialStackParamsList} from '~app/navigation/InitialNavigation';
import {appStateSelectors, useAppState} from '~app/state/AppState';
import {commonStyles} from '~app/styles/styleContants';

const ConfirmCode: React.FC = () => {
  // const {onBack} = useUsername();
  const [value, setValue] = useState('');
  const [progress, setProgress] = useState(new Animated.Value(0));
  const ref = useBlurOnFulfill({value, cellCount: 4});
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration: 7000,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  }, []);
  useEffect(() => {
    if (value.length == 4)
      setTimeout(() => {
        navigation.navigate(SCREENS.PHONE_NUMBER_SUCCESS);
      }, 2000);
  }, [value.length == 4]);

  const navigation =
    useNavigation<StackNavigationProp<InitialStackParamsList>>();
  const darkMode = useAppState(appStateSelectors.displayMode!);
  const style = styles(darkMode);
  return value.length === 4 ? (
    <>
      <>
        <MainCard>
          <View
            style={{
              alignItems: 'center',
              height: COMPONENT_SIZE.SCREEN_HEIGHT / 2.5,
              marginTop: hp(100),
            }}>
            <Label style={style.mainText}>
              {'Hang tight! We’re confirming your number...'}
            </Label>
          </View>

          {
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
              <Image
                source={require('~app/assets/images/spinnerr.gif')}
                style={{height: hp(100), width: hp(100)}}
              />
            </View>
            // <ActivityIndicator
            //   size={'large'}
            //   animating
            //   color={darkMode ? COLORS.WHITE : COLORS.GREY}
            // />
          }
        </MainCard>
      </>
    </>
  ) : (
    <MainCard>
      <TouchableOpacity
        style={style.backIcon}
        onPress={() => {
          navigation.goBack();
        }}>
        <IcBack color={darkMode ? COLORS.WHITE : COLORS.BLACK} />
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => Keyboard.dismiss()}
        style={{
          alignItems: 'center',
          height: COMPONENT_SIZE.SCREEN_HEIGHT / 2.5,
          marginTop: hp(100),
        }}>
        <Label style={style.mainText}>
          {'Got it! Please confirm your phone number.'}
        </Label>
        <Label style={style.subText}>
          {
            'You will get a confirmation code via SMS to your number, please enter the code below in order to continue:'
          }
        </Label>
        <View>
          <CodeField
            ref={ref}
            {...props}
            // Use `caretHidden={false}` when users can't paste a text value, because context menu doesn't appear
            value={value}
            onChangeText={setValue}
            cellCount={4}
            rootStyle={style.codeFieldRoot}
            keyboardType="number-pad"
            textContentType="oneTimeCode"
            renderCell={({index, symbol, isFocused}) => (
              <Text
                key={index}
                style={[style.cell, isFocused && style.focusCell]}
                onLayout={getCellOnLayoutHandler(index)}>
                {symbol || (isFocused ? <Cursor /> : null)}
              </Text>
            )}
          />
        </View>
      </TouchableOpacity>
    </MainCard>
  );
};

export default ConfirmCode;
const styles = (darkMode: boolean) =>
  StyleSheet.create({
    containter: {
      flex: 1,
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
    progress: {
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: hp(200),
    },
    mainText: {
      color: darkMode ? COLORS.WHITE : COLORS.BLACK,
      fontSize: wp(23),
      fontWeight: '500',
      fontFamily: 'Poppins-Medium',

      marginTop: hp(20),
      marginLeft: wp(20),
      width: '90%',
    },
    root: {flex: 1, padding: 20},
    title: {textAlign: 'center', fontSize: 30},
    codeFieldRoot: {
      marginTop: hp(60),
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'transparent',
    },
    cell: {
      width: hp(60),
      height: hp(60),
      lineHeight: hp(60),
      fontSize: 24,
      color: darkMode ? COLORS.WHITE : COLORS.BLACK,
      borderWidth: 1,
      borderRadius: hp(10),
      marginHorizontal: wp(15),
      backgroundColor: COLORS.GREY,
      borderColor: COLORS.GREY,
      textAlign: 'center',
    },
    focusCell: {
      borderColor: '#000',
    },
    subText: {
      color: darkMode ? COLORS.WHITE : COLORS.BLACK,
      fontSize: hp(15),
      fontFamily: 'Poppins-Medium',
      ...commonStyles.fw_500,

      width: '85%',
      marginTop: hp(10),
    },
  });
