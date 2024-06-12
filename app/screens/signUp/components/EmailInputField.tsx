import React from 'react';
import {StyleProp, StyleSheet, TextStyle, View, ViewProps} from 'react-native';
import Info from '~app/assets/images/info.svg';
import Input from '~app/components/Input';
import Label from '~app/components/Label';
import {COLORS, hp, wp} from '~app/constants/styles';
import {appStateSelectors, useAppState} from '~app/state/AppState';
interface IEmailFieldProps extends ViewProps {
  usernameRef: any;
  email: string;
  handleChange: Function;
  onSubmitEditing: Function;
  labelStyle?: StyleProp<TextStyle>;
  error: any;
  onChangeTextValues: any;
  onPressButton: Function;
  from: string;
  placeholderTextColor?: string;
}

const EmailInputField: React.FC<IEmailFieldProps> = ({
  usernameRef,
  email,
  handleChange,
  onSubmitEditing,
  onChangeTextValues,
  error,
  onPressButton,
  from,
  placeholderTextColor,
}) => {
  const darkMode = useAppState(appStateSelectors.displayMode!);
  const style = styles(darkMode);
  return (
    <>
      <View style={{marginTop: hp(20), width: '100%'}}>
        {from !== 'Login' && <Label style={[style.email]}>{'Email'}</Label>}
        <View
          style={{
            width: '100%',
            paddingHorizontal: wp(20),
            marginTop: hp(10),
          }}>
          <Input
            onPressButton={() => {}}
            innerRef={usernameRef}
            returnKeyType="next"
            value={email}
            error={error}
            style={style.textInput}
            secureTextEntry={true}
            onChangeText={text => onChangeTextValues(text, 'email')}
            onSubmitEditing={onSubmitEditing(usernameRef)}
            placeholder={
              from !== 'Login'
                ? 'Email address'
                : 'Email, username, or phone number'
            }
            keyboardType="email-address"
            placeholderTextColor={placeholderTextColor}
          />
        </View>
        {error ? (
          <View style={style.errorView}>
            <Info />
            <Label style={style.infoText}>{error}</Label>
          </View>
        ) : (
          <></>
        )}
      </View>
    </>
  );
};

export default EmailInputField;
const styles = (darkMode: boolean) =>
  StyleSheet.create({
    container: {
      alignItems: 'center',
      marginTop: hp(50),
      height: hp(350),
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
      // marginTop: hp(10),
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

function handleChange(arg0: string, text: string): void {
  throw new Error('Function not implemented.');
}
