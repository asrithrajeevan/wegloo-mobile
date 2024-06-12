import React, {memo} from 'react';
import {
  StyleProp,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import {COLORS, hp} from '~app/constants/styles';
import {commonStyles} from '~app/styles/styleContants';
import Label from './Label';

interface IButtonProps extends TouchableOpacityProps {
  label: string;
  variant?: 'primary' | 'secondary';
  labelStyle?: StyleProp<TextStyle>;
}

const Button: React.FC<IButtonProps> = ({
  label,
  variant = 'primary',
  labelStyle,
  disabled,
  style,
  onPress,
  ...props
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        _buttonStyle.base,
        _buttonStyle[variant],
        disabled && _buttonStyle.disabled,
        style,
      ]}>
      <Label
        fontWeight="500"
        style={[
          _labelStyle.base,
          _labelStyle[variant],
          disabled && _labelStyle.disabled,
          labelStyle,
        ]}>
        {label}
      </Label>
    </TouchableOpacity>
  );
};

export default memo(Button);

const _buttonStyle = StyleSheet.create({
  base: {
    ...commonStyles.center,
    height: hp(50),
    // marginHorizontal: 20,
    marginBottom: hp(12),
    borderRadius: hp(25),
    alignSelf: 'stretch',
  },
  disabled: {
    backgroundColor: COLORS.LIGHT_GRAY,
    borderColor: COLORS.THEME_BLUE,
    borderWidth: 2,
  },
  primary: {backgroundColor: COLORS.THEME_BLUE},
  secondary: {},
});
const _labelStyle = StyleSheet.create({
  base: {},
  disabled: {color: COLORS.BLACK},
  primary: {color: COLORS.WHITE},
  secondary: {},
});
