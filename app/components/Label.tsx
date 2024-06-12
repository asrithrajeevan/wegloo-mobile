import {hp} from '~app/constants/styles';
import React from 'react';
import {StyleSheet, Text, TextProps, TextStyle} from 'react-native';
import {ValueOf} from 'react-native-gesture-handler/lib/typescript/typeUtils';

interface ILabelProps extends TextProps {
  fontWeight?: ValueOf<Pick<TextStyle, 'fontWeight'>>;
  fontSize?: number;
}

const Label: React.FC<ILabelProps> = ({
  children,
  fontWeight = '400',
  fontSize = hp(16),
  style,
}) => {
  return (
    <Text  style={[_style[fontWeight], {fontSize}, style]} >{children}</Text>
  );
};

export default Label;

const _style = StyleSheet.create({
  // Font family files corresponding to each font weight
  normal: {fontWeight: 'normal'},
  bold: {fontWeight: 'bold'},
  '100': {fontWeight: '100'},
  '200': {fontWeight: '200'},
  '300': {fontWeight: '300'},
  '400': {fontWeight: '400'},
  '500': {fontWeight: '500'},
  '600': {fontWeight: '600'},
  '700': {fontWeight: '700'},
  '800': {fontWeight: '800'},
  '900': {fontWeight: '900'},
});
