import React from 'react';
import {StyleSheet, TextInput, View, ViewProps} from 'react-native';
import {ImageProps} from 'react-native-svg';
import {COLORS, hp, wp} from '~app/constants/styles';
import {appStateSelectors, useAppState} from '~app/state/AppState';
interface ISocialMediadProps extends ViewProps {
  usernameRef: any;
  email: string;
  handleChange: Function;
  onSubmitEditing: Function;

  error: any;
  onChangeTextValues: any;
  value: string;
  image: ImageProps;
}

const SocialMediaInput: React.FC<ISocialMediadProps> = ({
  usernameRef,
  email,
  handleChange,
  onSubmitEditing,
  onChangeTextValues,
  error,
  value,
  image,
}) => {
  const darkMode = useAppState(appStateSelectors.displayMode!);
  const style = styles(darkMode);
  return (
    <>
      <View
        style={{
          alignItems: 'center',
          flexDirection: 'row',

          marginTop: hp(20),
          paddingHorizontal: hp(15),
          borderRadius: hp(10),
          height: hp(60),
        }}>
        {image}
        <TextInput
          placeholder={'Enter handle...'}
          placeholderTextColor={darkMode ? COLORS.THIN_GREY : '#636472'}
          onChangeText={text => {
            onChangeTextValues(text);
          }}
          value={value}
          style={[
            style.customTextInput,
            {
              borderColor: error
                ? COLORS.READ
                : darkMode
                ? COLORS.BLACK
                : COLORS.WHITE,
            },
          ]}></TextInput>
      </View>
    </>
  );
};

export default SocialMediaInput;
const styles = (darkMode: boolean) =>
  StyleSheet.create({
    container: {
      alignItems: 'center',
      marginTop: hp(50),
      height: hp(350),
      width: '100%',
    },
    customTextInput: {
      fontSize: hp(17),
      marginLeft: wp(30),
      fontFamily: 'Poppins-Medium',
      fontWeight: '500',
      width: '85%',
      height: hp(60),
      paddingHorizontal: wp(20),
      borderRadius: 10,
      borderWidth: 1,

      color: darkMode ? COLORS.WHITE : COLORS.BLACK,
      backgroundColor: darkMode ? COLORS.BLACK : COLORS.GREY,
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
