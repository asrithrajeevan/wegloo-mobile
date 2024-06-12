import React from 'react';
import {FlexStyle, Platform, TouchableOpacity, View} from 'react-native';
import IcBack from '~app/assets/images/backArrow.svg';
import {COLORS, hp, wp} from '~app/constants/styles';
import {appStateSelectors, useAppState} from '~app/state/AppState';
import Label from './Label';

interface IHeaderProps {
  text?: string;
  onPressNext: Function;
  goBack: Function;
  title: string;
  rightTitle: string;
  iconStyle?: FlexStyle;
}

const Header: React.FC<IHeaderProps> = ({
  text,
  onPressNext,
  goBack,
  title,
  rightTitle,
  iconStyle,
}) => {
  const darkMode = useAppState(appStateSelectors.displayMode!);

  return (
    <View
      style={{
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        flexDirection: 'row',
        // marginTop: hp(20),
        // paddingTop: hp(30),
        height: Platform.OS === 'ios' ? hp(50) : hp(50),
        marginLeft: wp(10),
        marginRight: wp(10),
        backgroundColor: darkMode ? 'transparent' : COLORS.WHITE,
      }}>
      <TouchableOpacity
        style={[
          iconStyle,
          {
            height: 30,
            width: 30,
            alignItems: 'center',
            justifyContent: 'center',
          },
        ]}
        onPress={() => {
          goBack();
        }}>
        <IcBack
          color={darkMode ? COLORS.WHITE : COLORS.BLACK}
          // style={{marginBottom: hp(7)}}
        />
      </TouchableOpacity>
      <Label
        style={{
          color: darkMode ? COLORS.WHITE : COLORS.BLACK,
          textAlign: 'center',
          fontSize: hp(17),
          fontFamily: 'Poppins-Medium',
          fontWeight: '500',
          // flex: 1,
          // width: wp(150),

          // fontWeight: '400',
          marginLeft: hp(30),
        }}>
        {title}
      </Label>
      <TouchableOpacity
        style={{
          height: 30,
          width: 50,

          alignItems: 'center',
          justifyContent: 'center',
        }}
        onPress={() => {
          onPressNext();
        }}>
        <Label
          style={{
            color: darkMode
              ? rightTitle === 'Done' || rightTitle === 'Cancel'
                ? COLORS.NAVY_BLUE
                : COLORS.WHITE
              : rightTitle === 'Done' || rightTitle === 'Cancel'
              ? COLORS.NAVY_BLUE
              : COLORS.BLACK,

            fontSize: hp(16),
            fontFamily: 'Poppins-Medium',
            fontWeight: '400',

            width: 70,
            textAlign: 'center',
            marginRight: wp(20),
          }}>
          {rightTitle}
        </Label>
      </TouchableOpacity>
    </View>
  );
};

export default Header;
