import React, {memo} from 'react';
import {Platform, StyleSheet, ViewProps} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {COLORS, hp} from '~app/constants/styles';
import {appStateSelectors, useAppState} from '~app/state/AppState';
import {commonStyles} from '~app/styles/styleContants';

interface IMainCardProps extends ViewProps {
  children: any;
  customStyle?: any;
}

const MainCard: React.FC<IMainCardProps> = ({children, customStyle}) => {
  const darkMode = useAppState(appStateSelectors.displayMode!);
  const style = styles(darkMode);
  return (
    <LinearGradient
      style={[style.body, customStyle]}
      colors={
        darkMode
          ? [
              COLORS.GRADIENT1,
              COLORS.GRADIENT1,
              COLORS.GRADIENT1,
              COLORS.GRADIENT1,
            ]
          : [COLORS.WHITE, COLORS.WHITE, COLORS.WHITE]
      }
      start={{x: 0.7, y: 0}}>
      {children}
    </LinearGradient>
  );
};

export default memo(MainCard);

const styles = (darkMode: boolean) =>
  StyleSheet.create({
    base: {
      ...commonStyles.center,
      height: hp(50),
      marginBottom: hp(12),
      borderRadius: hp(20),
      alignSelf: 'stretch',
    },
    body: {
      flex: 1,
      height: '100%',
      width: '100%',
      paddingTop: Platform.OS === 'ios' ? hp(40) : hp(10),
      // paddingBottom: hp(20),
      backgroundColor: darkMode ? COLORS.GRADIENT1 : 'white',
    },
    disabled: {
      backgroundColor: COLORS.LIGHT_GRAY,
      borderColor: COLORS.THEME_BLUE,
      borderWidth: 2,
    },
    primary: {backgroundColor: COLORS.THEME_BLUE},
    secondary: {},
  });
