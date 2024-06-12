import React from 'react';
import {StyleProp, StyleSheet, TextStyle, View, ViewProps} from 'react-native';
import GreenTick from '~app/assets/images/tick.svg';
import Input from '~app/components/Input';
import Label from '~app/components/Label';
import {COLORS, hp, wp} from '~app/constants/styles';
import {appStateSelectors, useAppState} from '~app/state/AppState';

interface IPasswordInputFieldProps extends ViewProps {
  passwordRef: any;
  password: string;
  handleChange: Function;
  error: any;
  onSubmitEditing: Function;
  labelStyle?: StyleProp<TextStyle>;
  onChangeTextValues: any;
  onPressButton: Function;
  rightIcon: any;
  secureTextEntry: boolean;
  passwordStrength: boolean;
  from: string;
  placeholderTextColor?: string;
}

const PasswordInputField: React.FC<IPasswordInputFieldProps> = ({
  passwordRef,
  password,
  handleChange,
  error,
  onSubmitEditing,
  onChangeTextValues,
  onPressButton,
  rightIcon,
  secureTextEntry,
  passwordStrength,
  from,
  placeholderTextColor,
}) => {
  const darkMode = useAppState(appStateSelectors.displayMode!);
  const style = styles(darkMode);
  console.log('errrrr', error);
  return (
    <>
      <View style={{marginTop: hp(15), width: '100%'}}>
        {from !== 'Login' && (
          <View
            style={{
              alignItems: 'center',

              flexDirection: 'row',
              width: '70%',
            }}>
            <Label style={[style.email]}>{'Create Password'}</Label>

            {passwordStrength ? <GreenTick style={{marginLeft: 50}} /> : <></>}
          </View>
        )}
        <View
          style={{width: '100%', paddingHorizontal: wp(20), marginTop: hp(10)}}>
          <Input
            innerRef={passwordRef}
            returnKeyType="next"
            value={password}
            error={error}
            style={style.textInput}
            onChangeText={text => onChangeTextValues(text, 'password')}
            // onChangeText={() => handleChange('password')}
            onSubmitEditing={onSubmitEditing(passwordRef)}
            placeholder="Password"
            onPressButton={() => {
              onPressButton();
            }}
            secureTextEntry={secureTextEntry}
            rightIcon={rightIcon}
            placeholderTextColor={placeholderTextColor}
          />
        </View>
      </View>
    </>
  );
};

export default PasswordInputField;
const styles = (darkMode: boolean) =>
  StyleSheet.create({
    container: {
      alignItems: 'center',
      marginTop: hp(50),
      height: hp(350),
      width: '100%',
    },
    textInput: {
      width: '100%',
      color: darkMode ? COLORS.WHITE : COLORS.BLACK,
      fontFamily: 'Poppins-Regular',
      fontSize: hp(14),
      fontWeight: '400',
    },
    email: {
      fontFamily: 'Poppins-Medium',
      fontSize: hp(14),
      fontWeight: '400',
      marginLeft: hp(20),
      color: darkMode ? COLORS.WHITE : COLORS.BLACK,
    },
    line: {
      height: hp(2),
      width: '80%',
      backgroundColor: COLORS.LIGHT_GRAY,
      marginTop: hp(10),
    },
    heading: {
      fontFamily: 'Poppins-Bold',
      fontSize: hp(32),
      fontWeight: '600',
      marginTop: hp(50),
    },
  });
