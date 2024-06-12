import {useNavigation} from '@react-navigation/native';
import React, {useCallback} from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import {StackNavigationProp} from 'react-navigation/native-stack';
import Button from '~app/components/Button';
import Label from '~app/components/Label';
import LandingHeader from '~app/components/landing/Landing';
import MainCard from '~app/components/MainCard';
import {SCREENS} from '~app/constants/navigation';
import {COLORS, hp, wp} from '~app/constants/styles';
import {InitialStackParamsList} from '~app/navigation/InitialNavigation';
import {appStateSelectors, useAppState} from '~app/state/AppState';

const Landing: React.FC = () => {
  const darkMode = useAppState(appStateSelectors.displayMode!);
  const height = Dimensions.get('window').width;
  const width = Dimensions.get('window').height;
  const navigation =
    useNavigation<StackNavigationProp<InitialStackParamsList>>();
  const onClickSignUp = useCallback(() => {
    // handle the click event
    navigation.navigate(SCREENS.SIGNUP);
  }, []);
  return (
    <>
      <MainCard>
        <View style={styles.container}>
          <View style={styles.subContainer}>
            <LandingHeader />
            <Label
              style={{
                marginTop: 20,
                fontFamily: 'Poppins-Medium',
                fontWeight: '500',
                fontSize: hp(18),
                color: darkMode ? COLORS.WHITE : COLORS.BLACK,
              }}>
              {'Shared Experiences with Friends'}
            </Label>
          </View>
        </View>
        <View style={{alignItems: 'center', justifyContent: 'center'}}>
          <Button
            label="Create an Account"
            labelStyle={{
              fontFamily: 'Poppins-SemiBold',
              fontSize: hp(16),
              fontWeight: '600',
            }}
            disabled={false}
            style={{marginHorizontal: hp(20)}}
            onPress={onClickSignUp}
          />
          <Button
            label="Login"
            labelStyle={{
              fontFamily: 'Poppins-SemiBold',
              fontSize: hp(16),
              fontWeight: '600',
              color: COLORS.BLACK,
            }}
            style={{
              marginTop: hp(20),
              marginHorizontal: hp(20),
              backgroundColor: COLORS.WHITE,
              borderColor: darkMode ? COLORS.WHITE : COLORS.THEME_BLUE,
              borderWidth: 2,
            }}
            onPress={() => {
              navigation.navigate(SCREENS.SIGN_IN);
            }}
          />
        </View>
        <Label
          style={{
            textAlign: 'center',
            marginTop: hp(60),
            fontFamily: 'Poppins-Medium',
            fontWeight: '500',
            fontSize: hp(14),
            color: darkMode ? COLORS.WHITE : COLORS.BLACK,
          }}>
          {'View the User Agreement and Privacy Policy'}
        </Label>
      </MainCard>
    </>
  );
};
const height = Dimensions.get('window').width;
const width = Dimensions.get('window').height;
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    // marginTop: hp(150),

    flex: 0.95,
    width: '100%',
    marginHorizontal: wp(10),
  },
  subContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    width: width,
  },
});
export default Landing;
