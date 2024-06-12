import React from 'react';
import {StyleSheet, View} from 'react-native';
import Error from '~app/assets/images/error.svg';
import GreenTick from '~app/assets/images/green_tick.svg';
import Label from '~app/components/Label';
import {COLORS, hp, wp} from '~app/constants/styles';
import {appStateSelectors, useAppState} from '~app/state/AppState';

const PasswordErrorView: React.FC = () => {
  const darkMode = useAppState(appStateSelectors.displayMode!);
  const styles = style(darkMode);
  return (
    <>
      <View
        style={{marginTop: hp(20), width: '100%', paddingHorizontal: wp(20)}}>
        <View style={styles.container}>
          <GreenTick />
          <Label style={styles.labels}>{'Minimum 7 characters '}</Label>
        </View>
        <View style={styles.container}>
          <GreenTick />
          <Label style={styles.labels}>
            {'At least 1 upper case character  '}
          </Label>
        </View>
        <View style={styles.container}>
          <GreenTick />
          <Label style={styles.labels}>
            {'At least 1 lower case character  '}
          </Label>
        </View>
        <View style={styles.container}>
          <Error />
          <Label style={styles.labels}>{'At least 1 number or symbol  '}</Label>
        </View>
      </View>
    </>
  );
};

export default PasswordErrorView;
const style = (darkMode: boolean) =>
  StyleSheet.create({
    container: {
      alignItems: 'center',
      flexDirection: 'row',
      width: '100%',
    },
    textInput: {
      width: '100%',
      color: COLORS.BLACK,
    },
    labels: {
      fontFamily: 'Poppins-Regular',
      fontSize: hp(13),
      marginLeft: hp(20),
      fontWeight: '400',
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
