import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {StackNavigationProp} from 'react-navigation/native-stack';
import IcBack from '~app/assets/images/backArrow.svg';
import MainCard from '~app/components/MainDarkCard';
import {COLORS, hp, wp} from '~app/constants/styles';
import {Terms, Terms2} from '~app/constants/termsConditions';
import useUsername from '~app/hooks/User';
import {InitialStackParamsList} from '~app/navigation/InitialNavigation';
import {appStateSelectors, useAppState} from '~app/state/AppState';
import {commonStyles} from '~app/styles/styleContants';

const TermsConditions: React.FC = () => {
  const {onBack} = useUsername();
  const darkMode = useAppState(appStateSelectors.displayMode!);
  const style = styles(darkMode);
  const navigation =
    useNavigation<StackNavigationProp<InitialStackParamsList>>();
  //   const goBack = () => navigation.goBack();
  return (
    <>
      <MainCard>
        <TouchableOpacity
          style={style.backIcon}
          onPress={() => {
            navigation.goBack();
          }}>
          <IcBack color={darkMode ? COLORS.WHITE : COLORS.BLACK} />
        </TouchableOpacity>
        <Text style={style.heading}>{'Terms of Service'}</Text>

        <View style={style.containter}>
          <Text style={style.text}>{Terms}</Text>
          <Text style={[style.text, {marginTop: 20}]}>{Terms2}</Text>
        </View>
      </MainCard>
    </>
  );
};

export default TermsConditions;
const styles = (darkMode: boolean) =>
  StyleSheet.create({
    containter: {
      flex: 1,

      alignItems: 'center',
      paddingHorizontal: wp(25),
      ...commonStyles.mt_40,
    },
    heading: {
      color: darkMode ? COLORS.WHITE : COLORS.BLACK,
      fontSize: hp(16),
      fontWeight: '500',
      fontFamily: 'Poppins-Medium',
      textAlign: 'center',
      ...commonStyles.mt_40,
    },
    text: {
      color: darkMode ? COLORS.WHITE : COLORS.BLACK,
      fontSize: hp(16),
      fontWeight: '400',
      fontFamily: 'Poppins-Regular',
    },
    backIcon: {
      position: 'absolute',
      top: Platform.OS === 'ios' ? hp(60) : hp(33),
      left: wp(20),
      width: wp(60),
      height: hp(60),
      color: darkMode ? COLORS.WHITE : COLORS.BLACK,

      justifyContent: 'center',
    },
  });
