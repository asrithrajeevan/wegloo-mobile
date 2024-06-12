import React from 'react';
import {StyleSheet, TouchableOpacity, View, ViewProps} from 'react-native';
import IcBack from '~app/assets/images/backArrow.svg';
import ICLogo from '~app/assets/images/brandLogo.svg';
import ICLock from '~app/assets/images/lockIcon.svg';
import Label from '~app/components/Label';
import {COLORS, hp, wp} from '~app/constants/styles';
import {appStateSelectors, useAppState} from '~app/state/AppState';

interface IJoinexperienceProps extends ViewProps {
  closeModal: Function;
  onPressBack: Function;
  selectJoinType: Function;
}
const Joinexperience: React.FC<IJoinexperienceProps> = ({
  closeModal,
  onPressBack,
  selectJoinType,
}) => {
  const darkMode = useAppState(appStateSelectors.displayMode!);
  const currentUser = useAppState(appStateSelectors.currentUser!);
  const styles = style(darkMode);
  return (
    <>
      <View style={styles.innerView}>
        <TouchableOpacity
          style={[styles.canvasBack, {marginTop: hp(10)}]}
          onPress={() => {
            closeModal();
          }}>
          <IcBack color={darkMode ? COLORS.WHITE : COLORS.BLACK} />
          <Label
            style={[
              styles.cameraLabel,
              {marginLeft: wp(30), fontWeight: '500'},
            ]}>
            {'Who can join this Experience?'}
          </Label>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.addLibray]}
          onPress={() => {
            selectJoinType(true);
            closeModal();
          }}>
          <ICLogo
            color={darkMode ? COLORS.WHITE : COLORS.BLACK}
            height={50}
            width={50}
          />
          <View style={{flex: 1}}>
            <Label style={[styles.cameraLabel, {marginLeft: wp(35)}]}>
              {'Allow Others to Join'}
            </Label>
            <Label style={[styles.subLabel, {marginLeft: wp(35)}]}>
              {'If selected, users can join without  your acceptance.'}
            </Label>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.addLibray}
          onPress={() => {
            selectJoinType(false);
            closeModal();
          }}>
          <ICLock color={darkMode ? COLORS.WHITE : COLORS.BLACK} />
          <View style={{flex: 1}}>
            <Label style={[styles.cameraLabel, {marginLeft: wp(45)}]}>
              {'Invite Only'}
            </Label>
            <Label style={[styles.subLabel, {marginLeft: wp(45)}]}>
              {
                'If selected, users can only join via invite from those in the Experience.'
              }
            </Label>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.cancelView]}
          onPress={() => {
            closeModal();
          }}>
          <Label style={styles.cancel}>{'Cancel'}</Label>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default Joinexperience;
const style = (darkMode: boolean) =>
  StyleSheet.create({
    centeredView: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'transparent',
      alignItems: 'center',
      justifyContent: 'flex-end',
      paddingHorizontal: wp(10),
    },
    canvasBack: {
      alignItems: 'center',
      flexDirection: 'row',
      width: '100%',
      paddingHorizontal: wp(30),
      height: hp(70),
      borderBottomWidth: 1,
      borderColor: darkMode ? COLORS.WHITE : COLORS.LIGHT_GRAY,
    },
    innerView: {
      backgroundColor: COLORS.WHITE,
      //   height: COMPONENT_SIZE.SCREEN_HEIGHT / 2.5,
      width: '100%',
      borderRadius: 10,
    },
    cancelView: {
      alignItems: 'center',
      flexDirection: 'row',
      width: '100%',
      paddingVertical: hp(20),
      justifyContent: 'center',
    },
    addLibray: {
      alignItems: 'center',
      flexDirection: 'row',
      width: '100%',
      borderBottomWidth: 1,
      borderColor: darkMode ? COLORS.WHITE : COLORS.LIGHT_GRAY,
      // marginTop: hp(10),
      paddingHorizontal: wp(30),
      paddingVertical: hp(15),
      //   paddingBottom: hp(45),
    },
    cancel: {
      fontWeight: '500',
      fontSize: hp(16),
      color: darkMode ? COLORS.WHITE : COLORS.BLACK,
      fontFamily: 'Poppins-Medium',
      textAlign: 'center',
      //   width: '100%',
    },
    cameraLabel: {
      fontWeight: '500',
      fontSize: hp(16),
      marginLeft: wp(60),
      fontFamily: 'Poppins-Medium',
      color: darkMode ? COLORS.WHITE : COLORS.BLACK,
    },
    subLabel: {
      fontSize: hp(13),
      marginLeft: wp(60),
      fontFamily: 'Poppins-Regular',
      color: darkMode ? COLORS.WHITE : COLORS.BLACK,
    },
    plus: {
      // flex: 1,
      display: 'flex',
      shadowColor: '#171717',
      shadowOffset: {width: -1, height: 8},
      shadowOpacity: 0.2,
      shadowRadius: 3,
      height: hp(25),
      // marginVertical: hp(13),
      elevation: 2,
      marginTop: hp(40),
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
