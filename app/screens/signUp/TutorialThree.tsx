import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {StackNavigationProp} from 'react-navigation/native-stack';
import ICBackArrow from '~app/assets/images/backArrow.svg';
import ICProfile from '~app/assets/images/profile.svg';
import ICProgress from '~app/assets/images/progressBar3.svg';
import Label from '~app/components/Label';
import MainCard from '~app/components/MainCard';
import {SCREENS} from '~app/constants/navigation';
import {COLORS, hp, wp} from '~app/constants/styles';
import {InitialStackParamsList} from '~app/navigation/InitialNavigation';
import {appStateSelectors, useAppState} from '~app/state/AppState';

const TutorialThree: React.FC = () => {
  const [theme, setTheme] = useState('light');
  const darkMode = useAppState(appStateSelectors.displayMode!);

  const [check, setCheck] = useState(false);
  const setDisplayMode = useAppState(state => state.setDisplayMode);
  const navigation =
    useNavigation<StackNavigationProp<InitialStackParamsList>>();
  // useEffect(() => {
  //   if (!check) {
  //     setDisplayMode(theme === 'Light' ? false : true);
  //   }
  // }, [theme]);
  //
  // useEffect(() => {
  //   if (check) {
  //     setTheme('light');

  //     let themeValue = Appearance.getColorScheme();
  //     setDisplayMode(themeValue === 'light' ? false : true);
  //   }
  // }, [check]);
  const styles = style(darkMode);
  return (
    <>
      <MainCard>
        <View style={styles.container}>
          <TouchableOpacity
            style={styles.backIcon}
            onPress={() => {
              navigation.goBack();
            }}>
            <ICBackArrow color={darkMode ? COLORS.WHITE : COLORS.BLACK} />
          </TouchableOpacity>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: Platform.OS === 'ios' ? hp(40) : hp(50),
              marginLeft: wp(10),
            }}>
            <Label style={styles.heading}>{'Profile '}</Label>
            <ICProfile
              style={{marginLeft: wp(10), height: hp(30), width: hp(30)}}
            />
          </View>
          <Label style={styles.subHeading}>
            {
              'Express yourself on your profile through your Canvas, Bio, and Experiences. '
            }
          </Label>

          <View style={styles.subContainer}>
            {/* <IcTutorialOne />
          <IcTutorialTwo /> */}
            <Image source={require('~app/assets/images/tutorialFour.png')} />
            <Image source={require('~app/assets/images/tutorialFive.png')} />
            {/* <ICIphone /> */}
            {/* <ICIphoneDark /> */}
          </View>

          <TouchableOpacity
            style={styles.progress}
            onPress={() => {
              navigation.navigate(SCREENS.TUTORIAL_FOUR);
            }}>
            <ICProgress />
          </TouchableOpacity>
          {/* <Text style={{color: 'black'}}>{'AboutMe'}</Text> */}
        </View>
      </MainCard>
    </>
  );
};

export default TutorialThree;
const style = (darkMode: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: wp(25),

      paddingVertical: hp(80),
    },
    backIcon: {
      position: 'absolute',
      top: Platform.OS === 'ios' ? hp(30) : hp(50),
      left: wp(20),
      width: wp(30),
      height: hp(30),
      color: darkMode ? COLORS.WHITE : COLORS.BLACK,
      alignItems: 'center',
      justifyContent: 'center',
    },
    progress: {
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: hp(40),
      flex: 1,
    },
    lightButtonText: {
      color: COLORS.THEME_BLUE,
      textAlign: 'center',
      fontSize: hp(11),
      fontFamily: 'Poppins-Regular',
      fontWeight: '400',
    },
    condition: {
      fontSize: hp(13),
      fontFamily: 'Poppins-Medium',
      marginLeft: wp(10),
      color: COLORS.THIN_GREY,
      fontWeight: '500',
    },
    buttonText: {
      color: COLORS.BLACK,
      textAlign: 'center',
      fontSize: hp(11),
      fontFamily: 'Poppins-Regular',
      fontWeight: '400',
    },
    buttonSelectedText: {
      color: COLORS.WHITE,
      textAlign: 'center',
      fontSize: hp(11),
      fontFamily: 'Poppins-Regular',
      fontWeight: '400',
    },
    editButton: {
      backgroundColor: COLORS.WHITE,
      // width: COMPONENT_SIZE.SCREEN_WIDTH - 20,
      height: hp(30),
      paddingHorizontal: wp(20),
      borderRadius: 5,
      borderColor: COLORS.THEME_BLUE,
      borderWidth: 2,
      // paddingVertical: hp(5),
    },
    editSelectedButton: {
      backgroundColor: COLORS.THEME_BLUE,
      // width: COMPONENT_SIZE.SCREEN_WIDTH - 20,
      height: hp(30),
      paddingHorizontal: wp(20),
      borderRadius: 5,
      borderColor: COLORS.THEME_BLUE,
      borderWidth: 2,
      // paddingVertical: hp(5),
    },
    subContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: hp(40),
      marginHorizontal: wp(10),
    },
    buttonContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: hp(40),
      width: '100%',
      paddingHorizontal: hp(20),
    },
    heading: {
      fontSize: hp(22),
      fontWeight: '600',
      fontFamily: 'Poppins-SemiBold',

      color: darkMode ? COLORS.WHITE : COLORS.BLACK,
    },
    subHeading: {
      fontSize: hp(16),
      fontWeight: '500',
      fontFamily: 'Poppins-Medium',
      marginTop: hp(10),
      marginLeft: wp(10),
      color: darkMode ? COLORS.WHITE : COLORS.BLACK,
    },
  });
