import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  Appearance,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {StackNavigationProp} from 'react-navigation/native-stack';
import ICBackArrow from '~app/assets/images/backArrow.svg';
import ICColorTick from '~app/assets/images/colorTick.svg';
import ICGrey from '~app/assets/images/greyTick.svg';
import ICProgress from '~app/assets/images/progressBar1.svg';
import Button from '~app/components/Button';
import Label from '~app/components/Label';
import {SCREENS} from '~app/constants/navigation';
import {COLORS, hp, wp} from '~app/constants/styles';
import {InitialStackParamsList} from '~app/navigation/InitialNavigation';
import {useAppState} from '~app/state/AppState';

const ModeSelection: React.FC = () => {
  let themeValue = Appearance.getColorScheme();
  const [theme, setTheme] = useState('light');
  const [check, setCheck] = useState(false);
  const [selected, setSelected] = useState(false);
  const setDisplayMode = useAppState(state => state.setDisplayMode);
  const setDefault = useAppState(state => state.setDefault);
  const navigation =
    useNavigation<StackNavigationProp<InitialStackParamsList>>();
  useEffect(() => {
    if (!check && theme !== 'light') {
      setDisplayMode(theme === 'Light' ? false : true);
      // setSelected(true);
    }
  }, [theme]);
  useEffect(() => {
    if (check) {
      setTheme('light');
      setDefault(true);
      let themeValue = Appearance.getColorScheme();
      setDisplayMode(themeValue === 'light' ? false : true);
    } else {
      setDefault(false);
    }
  }, [check]);
  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity
          style={{
            height: hp(30),
            width: hp(30),
          }}
          onPress={() => {
            navigation.goBack();
          }}>
          <ICBackArrow />
        </TouchableOpacity>
        <Label style={styles.heading}>{'Choose your experience.'}</Label>
        <Label style={styles.subHeading}>
          {'This can be changed anytime in your Settings.'}
        </Label>
        <View style={styles.subContainer}>
          <Image source={require('~app/assets/images/iphone.png')} />
          <Image source={require('~app/assets/images/iphoneDark.png')} />
          {/* <ICIphone /> */}
          {/* <ICIphoneDark /> */}
        </View>
        <View style={styles.buttonContainer}>
          <Button
            // disabled={check}
            style={
              theme === 'Light' ? styles.editSelectedButton : styles.editButton
            }
            labelStyle={
              theme === 'Light'
                ? styles.buttonSelectedText
                : styles.lightButtonText
            }
            onPress={() => {
              setTheme('Light');
              setCheck(false);
              setSelected(true);
            }}
            label="Light Mode"></Button>
          <Button
            // disabled={check}
            style={
              theme === 'Dark' ? styles.editSelectedButton : styles.editButton
            }
            onPress={() => {
              setTheme('Dark');
              setCheck(false);
              setSelected(true);
            }}
            labelStyle={
              theme === 'Dark' ? styles.buttonSelectedText : styles.buttonText
            }
            label="Dark Mode"></Button>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            width: '100%',
            marginLeft: wp(15),
            marginTop: hp(20),
          }}>
          <TouchableOpacity
            onPress={() => {
              setCheck(!check);
              setSelected(false);
            }}>
            {!check ? <ICGrey /> : <ICColorTick />}
          </TouchableOpacity>

          <Label style={styles.condition}>
            {'Default - follow your phones default setting.'}
          </Label>
        </View>
        <TouchableOpacity
          style={styles.progress}
          onPress={() => {
            if (selected || check) {
              navigation.navigate(SCREENS.USERNAME);
            }
          }}>
          <ICProgress />
        </TouchableOpacity>
        {/* <Text style={{color: 'black'}}>{'AboutMe'}</Text> */}
      </View>
    </>
  );
};

export default ModeSelection;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp(25),
    backgroundColor: 'white',
    paddingVertical: hp(80),
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
    marginTop: hp(30),
    color: COLORS.BLACK,
  },
  subHeading: {
    fontSize: hp(12),
    fontWeight: '500',
    fontFamily: 'Poppins-Medium',
    marginTop: hp(10),
    color: COLORS.BLACK,
  },
});
