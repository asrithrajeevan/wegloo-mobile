import React from 'react';
import {StyleProp, StyleSheet, TextStyle, View, ViewProps} from 'react-native';
import Info from '~app/assets/images/info.svg';
import GreenTick from '~app/assets/images/tick.svg';
import Input from '~app/components/Input';
import Label from '~app/components/Label';
import {COLORS, hp, wp} from '~app/constants/styles';
import {appStateSelectors, useAppState} from '~app/state/AppState';

interface IConfirmInputFieldProps extends ViewProps {
  confirmPasswordRef: any;
  confirmPassword: string;
  handleChange: Function;
  onChangeTextValues: any;
  onSubmitEditing: Function;
  labelStyle?: StyleProp<TextStyle>;
  error: any;
  onPressButton: Function;
  rightIcon: any;
  secureTextEntry: boolean;
  confirmValidator: boolean;
}

const ConfirmInputField: React.FC<IConfirmInputFieldProps> = ({
  confirmPasswordRef,
  confirmPassword,
  handleChange,
  onSubmitEditing,
  onChangeTextValues,
  error,
  onPressButton,
  rightIcon,
  secureTextEntry,
  confirmValidator,
}) => {
  const darkMode = useAppState(appStateSelectors.displayMode!);
  const style = styles(darkMode);
  return (
    <>
      <View style={{marginTop: hp(15), width: '100%'}}>
        <View
          style={{
            alignItems: 'center',

            flexDirection: 'row',
            width: '70%',
          }}>
          <Label style={[style.email]}>{'Confirm Password'}</Label>
          {error === '' && confirmPassword !== '' && confirmValidator ? (
            <GreenTick style={{marginLeft: 50}} />
          ) : (
            <></>
          )}
        </View>
        <View style={{width: '100%', paddingHorizontal: wp(20), marginTop: 10}}>
          <Input
            innerRef={confirmPasswordRef}
            returnKeyType="next"
            value={confirmPassword}
            error={error}
            style={style.textInput}
            onChangeText={text => onChangeTextValues(text, 'confirmpassword')}
            onSubmitEditing={onSubmitEditing(confirmPasswordRef)}
            placeholder="Confirm Password"
            onPressButton={() => {
              onPressButton();
            }}
            secureTextEntry={secureTextEntry}
            rightIcon={rightIcon}
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

export default ConfirmInputField;
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
      marginTop: hp(10),
    },
    textInput: {
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
