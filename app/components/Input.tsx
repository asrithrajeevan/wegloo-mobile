import {COLORS, hp, wp} from 'app/constants/styles';
import React, {useCallback, useEffect, useState} from 'react';
import {
  NativeSyntheticEvent,
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputFocusEventData,
  TextInputProps,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import useSignUp from '~app/hooks/SignUp';
import {appStateSelectors, useAppState} from '~app/state/AppState';
import {commonStyles} from '~app/styles/styleContants';
import {InputRef} from '~app/utils/common';

interface IInputProps extends TextInputProps {
  error?: string;
  innerRef?: InputRef;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  value?: string;
  onPressButton?: Function;
  containerStyle?: StyleProp<ViewStyle>;
}

const Input: React.FC<IInputProps> = ({
  style,
  innerRef,
  error,
  leftIcon,
  rightIcon,
  containerStyle,
  secureTextEntry,
  value,
  onPressButton,
  ...rest
}) => {
  const darkMode = useAppState(appStateSelectors.displayMode!);
  const {usernameRef} = useSignUp();
  const [active, setActive] = useState(false);
  const [showText, setShowText] = useState(true);

  useEffect(() => {
    if (secureTextEntry) {
      setShowText(false);
    }
  }, [secureTextEntry]);

  const onFocus = useCallback(
    (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
      setActive(true);
      rest.onFocus?.(e);
    },
    [setActive],
  );

  const onBlur = useCallback(
    (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
      setActive(false);
      rest.onBlur?.(e);
    },
    [setActive],
  );

  const styles = _style(darkMode);
  return (
    <View style={commonStyles.mb_12}>
      <View
        style={[
          styles.base,
          active && styles.active,
          !!error && styles.error,
          containerStyle,
        ]}>
        {leftIcon}
        <TextInput
          ref={innerRef}
          onFocus={onFocus}
          onBlur={onBlur}
          secureTextEntry={!secureTextEntry}
          placeholderTextColor={darkMode ? COLORS.WHITE : COLORS.BLACK}
          style={[commonStyles.flex_1, styles.field, style]}
          value={value}
          {...rest}
        />
        <TouchableOpacity
          style={{
            height: 40,
            width: 40,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={() => {
            onPressButton && onPressButton();
          }}>
          {rightIcon}
        </TouchableOpacity>
      </View>
      {/* {error ? (
        <View style={_style.errorView}>
          <Info />
          <Label style={_style.infoText}>{error}</Label>
        </View>
      ) : (
        <></>
      )} */}
    </View>
  );
};

export default React.memo(Input);

const _style = (darkMode: boolean) =>
  StyleSheet.create({
    base: {
      height: hp(50),
      borderRadius: hp(10),
      paddingHorizontal: wp(16),
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'stretch',
      backgroundColor: COLORS.GREY,
      // opacity:0.2

      // borderWidth: hp(1),
    },
    infoText: {
      fontSize: hp(13),
      fontFamily: 'Poppins-Regular',
      marginLeft: wp(20),
    },
    errorView: {
      flexDirection: 'row',
      paddingHorizontal: wp(20),
      marginTop: hp(10),
    },
    field: {
      // color: 'red',
      width: '80%',

      fontWeight: '500',
    },
    active: {
      // borderWidth: hp(2),
      //   borderColor:
      //     theme === 'light'
      //       ? COLORS.PRIMARY_ORANGE
      //       : COLORS.DARK_MODE_ACTIVE_STROKE,
    },
    error: {
      borderColor: COLORS.PINK,
      borderWidth: 2,
      color: COLORS.PINK,
    },
    eyeButton: {
      position: 'absolute',
      right: wp(16),
      height: hp(51),
      justifyContent: 'center',
    },
  });
