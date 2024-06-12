import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {Platform, StyleSheet, TouchableOpacity, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {StackNavigationProp} from 'react-navigation/native-stack';
import IcBack from '~app/assets/images/backArrow.svg';
import IcBell from '~app/assets/images/bell.svg';
import IcFb from '~app/assets/images/fb.svg';
import IcInstagram from '~app/assets/images/instagram.svg';
import IcMusic from '~app/assets/images/music.svg';
import ICProgress from '~app/assets/images/progressBar7.svg';
import IcTwitter from '~app/assets/images/twitter.svg';
import Button from '~app/components/Button';
import Label from '~app/components/Label';
import MainCard from '~app/components/MainDarkCard';
import {SCREENS} from '~app/constants/navigation';
import {COLORS, hp, wp} from '~app/constants/styles';
import {InitialStackParamsList} from '~app/navigation/InitialNavigation';
import {appStateSelectors, useAppState} from '~app/state/AppState';
import SocialMediaInput from './components/SocialMediaInput';

const SocialMediaDetails: React.FC = () => {
  const navigation =
    useNavigation<StackNavigationProp<InitialStackParamsList>>();
  const darkMode = useAppState(appStateSelectors.displayMode!);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [fb, setFb] = useState('');
  const [insta, setInsta] = useState('');
  const [twitter, setTwitter] = useState('');
  const [music, setMusic] = useState('@');
  const [snap, setSnap] = useState('');
  const [age, setAge] = useState(10000);
  const [ticktokError, setTiktokError] = useState('');
  const [fbError, setFbError] = useState('');
  const [instaError, setInstaError] = useState('');
  const [twitterError, setTwitterError] = useState('');
  const [snapChatError, setSnapChatError] = useState('');
  const [proceed, setProceed] = useState(false);
  const style = styles(darkMode);
  const user = useAppState(state => state.user);
  const setUser = useAppState(state => state.setUser);
  console.log('fb.uuuu', fb.startsWith('https://'));
  useEffect(() => {
    console.log('ghaghgshghaghas');
    if (
      ticktokError == '' &&
      fbError == '' &&
      instaError == '' &&
      snapChatError == '' &&
      twitterError == '' &&
      proceed
    ) {
      setUser({
        ...user,
        facebook: fb,
        twitter: twitter,
        snapChat: snap,
        ticktok: music,
        instagram: insta,
      });
      console.log('musicee', music);
      navigation.navigate(SCREENS.LOCATION_ENABLE);
    }
  }, [proceed]);
  const onProceed = () => {
    setProceed(true);
    // if (!music.startsWith('@')) {
    //   var str1 = '@';
    //   var str2 = music;
    //   var res = str1.concat(str2);

    //   setMusic(res);
    // }
    // if (music !== '' && !music.startsWith('@')) {
    //   setTiktokError('enter @ before your username');
    // }
    if (
      fb.toLowerCase().includes('https://') ||
      fb.toLowerCase().includes('www.')
    ) {
      setFbError('Please enter a valid username');
    }
    if (
      twitter.toLowerCase().includes('https://') ||
      twitter.toLowerCase().includes('www.')
    ) {
      setTwitterError('Please enter a valid username');
    }
    if (
      snap.toLowerCase().includes('https://') ||
      snap.toLowerCase().includes('www.')
    ) {
      setSnapChatError('Please enter a valid username');
    }
    if (
      insta.toLowerCase().includes('https://') ||
      insta.toLowerCase().includes('www.')
    ) {
      setInstaError('Please enter a valid username');
    } else {
    }
  };
  return (
    <>
      <MainCard customStyle={{paddingHorizontal: wp(20)}}>
        <TouchableOpacity
          style={style.backIcon}
          onPress={() => {
            navigation.goBack();
          }}>
          <IcBack color={darkMode ? COLORS.WHITE : COLORS.BLACK} />
        </TouchableOpacity>

        <Label style={style.mainText}>What are you social media handles?</Label>
        <Label style={style.subText}>Social Links</Label>
        <KeyboardAwareScrollView
          bounces={false}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps={'handled'}>
          <SocialMediaInput
            value={fb}
            error={fbError}
            image={<IcFb />}
            onSubmitEditing={() => {}}
            onChangeTextValues={(text: React.SetStateAction<string>) => {
              setFb(text);
              setFbError('');
              setProceed(false);
            }}
          />
          {fbError ? (
            <View style={style.errorView}>
              <Label style={style.infoText}>{fbError}</Label>
            </View>
          ) : (
            <></>
          )}
          <SocialMediaInput
            value={insta}
            error={instaError}
            image={<IcInstagram />}
            onSubmitEditing={() => {}}
            onChangeTextValues={(text: React.SetStateAction<string>) => {
              setInsta(text);
              setInstaError('');
              setProceed(false);
            }}
          />
          {instaError ? (
            <View style={style.errorView}>
              <Label style={style.infoText}>{instaError}</Label>
            </View>
          ) : (
            <></>
          )}
          <SocialMediaInput
            value={twitter}
            error={twitterError}
            image={<IcTwitter />}
            onSubmitEditing={() => {}}
            onChangeTextValues={(text: React.SetStateAction<string>) => {
              setTwitter(text);
              setTwitterError('');
              setProceed(false);
            }}
          />
          {twitterError ? (
            <View style={style.errorView}>
              <Label style={style.infoText}>{twitterError}</Label>
            </View>
          ) : (
            <></>
          )}
          <SocialMediaInput
            error={snapChatError}
            value={snap}
            image={<IcBell />}
            onSubmitEditing={() => {}}
            onChangeTextValues={(text: React.SetStateAction<string>) => {
              setSnap(text);
              setSnapChatError('');
              setProceed(false);
            }}
          />
          {snapChatError ? (
            <View style={style.errorView}>
              <Label style={style.infoText}>{snapChatError}</Label>
            </View>
          ) : (
            <></>
          )}
          <SocialMediaInput
            value={music}
            image={<IcMusic />}
            error={ticktokError}
            onSubmitEditing={() => {}}
            onChangeTextValues={(text: React.SetStateAction<string>) => {
              setMusic(text);
              setTiktokError('');
              setProceed(false);
            }}
          />
          {ticktokError ? (
            <View style={style.errorView}>
              <Label style={style.infoText}>{ticktokError}</Label>
            </View>
          ) : (
            <></>
          )}
          <TouchableOpacity
            style={style.progress}
            onPress={() => {
              onProceed();
            }}>
            <ICProgress />
          </TouchableOpacity>
          <Button
            label="Skip"
            style={{backgroundColor: 'transparent'}}
            labelStyle={style.skip}
            onPress={() => {
              setUser({
                ...user,
                facebook: '',
                twitter: '',
                snapChat: '',
                ticktok: '',
              });
              navigation.navigate(SCREENS.LOCATION_ENABLE);
            }}
          />
        </KeyboardAwareScrollView>
      </MainCard>
    </>
  );
};

export default SocialMediaDetails;
const styles = (darkMode: boolean) =>
  StyleSheet.create({
    containter: {
      flex: 1,
    },
    // infoText: {
    //   fontSize: hp(13),
    //   fontFamily: 'Poppins-Regular',
    //   marginLeft: wp(20),
    //   color: darkMode ? COLORS.WHITE : COLORS.BLACK,
    // },
    errorView: {
      flexDirection: 'row',
      paddingHorizontal: wp(20),
      marginTop: hp(10),
    },
    skip: {
      fontSize: hp(12),

      fontFamily: 'Poppins-SemiBold',
      fontWeight: '600',

      color: darkMode ? COLORS.WHITE : COLORS.BLACK,
    },
    line: {
      height: hp(30),
      width: 2,
      backgroundColor: darkMode ? COLORS.BLACK : COLORS.GREY,
      marginHorizontal: hp(15),
    },
    inputContainer: {
      // ...commonStyles.alignItemsCenter,
      // ...commonStyles.flexRow,

      alignItems: 'center',
      flexDirection: 'row',
      marginHorizontal: wp(15),
      backgroundColor: darkMode ? COLORS.BLACK : COLORS.GREY,
      paddingHorizontal: hp(15),
      borderRadius: hp(10),
      borderWidth: 1,
      height: hp(60),
    },
    infoText: {
      fontSize: hp(12),
      fontFamily: 'Poppins-MediumItalic',
      fontWeight: '500',
      marginLeft: wp(50),
      color: darkMode ? COLORS.WHITE : COLORS.BLACK,
      marginTop: hp(10),
    },
    subText: {
      color: darkMode ? COLORS.WHITE : COLORS.BLACK,
      fontSize: wp(16),
      fontWeight: '500',
      fontFamily: 'Poppins-Medium',

      marginTop: hp(30),
      marginLeft: hp(10),
    },
    countryButton: {
      flexDirection: 'row',
      alignItems: 'center',

      // marginLeft: wp(50),
    },

    backIcon: {
      position: 'absolute',
      top: Platform.OS === 'ios' ? hp(70) : hp(50),
      left: wp(10),
      width: wp(30),
      height: hp(30),
      color: darkMode ? COLORS.WHITE : COLORS.BLACK,
      alignItems: 'center',
      justifyContent: 'center',
    },
    containerStyle: {
      backgroundColor: darkMode ? COLORS.BLACK : COLORS.GREY,

      // height: hp(50),
      borderRadius: hp(10),
    },
    textContainer: {
      backgroundColor: darkMode ? COLORS.BLACK : 'transparent',
      // alignItems: 'center',
      width: '100%',
      height: hp(60),
      borderRadius: hp(10),
      paddingHorizontal: hp(10),
      paddingVertical: hp(10),
    },
    progress: {
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      marginTop: hp(60),
    },
    customTextInput: {
      fontSize: hp(16),
      marginLeft: wp(10),
      fontFamily: 'Poppins-Medium',
      fontWeight: '500',

      color: darkMode ? COLORS.WHITE : COLORS.THIN_GREY,
    },
    countryCode: {
      // height: Platform.OS === 'ios' ? hp(40) : hp(50),
      fontSize: hp(17),

      fontFamily: 'Poppins-Medium',
      fontWeight: '500',
      marginRight: wp(5),
      color: darkMode ? COLORS.WHITE : COLORS.THIN_GREY,
    },
    textView: {
      position: 'absolute',
      top: Platform.OS === 'ios' ? hp(103) : hp(115),
      right: 55,
      height: hp(60),
      backgroundColor: 'transparent',
      width: wp(176),
      alignItems: 'center',
      justifyContent: 'center',
    },
    mainText: {
      color: darkMode ? COLORS.WHITE : COLORS.BLACK,
      fontSize: wp(22),
      fontWeight: '500',
      fontFamily: 'Poppins-Medium',
      width: '90%',

      marginTop: hp(100),
      marginLeft: hp(10),
    },
  });
