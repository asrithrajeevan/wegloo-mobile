import React, {useState} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewProps,
} from 'react-native';
import Share from 'react-native-share';
import IcFb from '~app/assets/images/fbShare.svg';
import IcInsta from '~app/assets/images/instaShare.svg';
import IcMessage from '~app/assets/images/message.svg';
import IcPin from '~app/assets/images/pin.svg';
import IcSent from '~app/assets/images/sent.svg';
import IcSnap from '~app/assets/images/snapShare.svg';
import IcTwitter from '~app/assets/images/twitterShare.svg';
import Label from '~app/components/Label';
import {COLORS, COMPONENT_SIZE, hp, wp} from '~app/constants/styles';
import {appStateSelectors, useAppState} from '~app/state/AppState';

interface IShareProps extends ViewProps {
  closeShare: any;
  onPressShare: any;
  image: any;
}
const ShareSection: React.FC<IShareProps> = ({
  closeShare,
  onPressShare,
  image,
}) => {
  console.log('shareSingleImage', image);
  const darkMode = useAppState(appStateSelectors.displayMode!);
  const [loader, setLoader] = useState(false);

  const styles = style(darkMode);
  const shareSingleImage = async () => {
    // const shareOptions = {
    //   // title: 'Share image to instastory',
    //   // // backgroundImage: `data:image/jpeg;base64,${image}`,
    //   // social: Share.Social.INSTAGRAM_STORIES,
    //   // url: image,
    //   social: Share.Social.WHATSAPP,

    //   message: 'hi',
    // };
    const shareOptions = {
      title: 'Share file',
      failOnCancel: false,
      url: `data:image/png;base64,` + image,
      message: 'hi hello',
      social: Share.Social.SNAPCHAT,
    };

    try {
      const ShareResponse = await Share.open(shareOptions);
      console.log('ShareResponseuuu', ShareResponse);
      // setResult(JSON.stringify(ShareResponse, null, 2));
    } catch (error) {
      console.log('Error 0000=>', error);
      // setResult('error: '.concat(getErrorString(error)));
    }
  };

  return (
    <>
      {
        <TouchableOpacity
          onPress={() => {
            closeShare();
          }}
          style={styles.centeredView}></TouchableOpacity>
      }
      {
        <View style={styles.innerView}>
          <View
            style={{
              backgroundColor: !darkMode ? COLORS.BLACK : COLORS.WHITE,
              width: wp(50),
              height: wp(7),
              borderRadius: wp(3.5),

              marginTop: hp(20),
            }}></View>
          <TouchableOpacity
            style={[styles.canvasBack, {marginTop: hp(10)}]}
            onPress={() => {
              // onPressShare();
              shareSingleImage();
            }}>
            <Label
              style={[
                styles.cameraLabel,
                {fontWeight: '600', fontSize: hp(16)},
              ]}>
              {'Share Canvas'}
            </Label>
          </TouchableOpacity>
          <View style={styles.socialView}>
            <IcMessage />

            <IcFb />
            <IcInsta />
            <IcTwitter />
            <IcSnap />
          </View>
          <View style={[styles.socialView, {marginTop: hp(5)}]}>
            <Label style={styles.text}>{'iMessage'}</Label>
            <Label style={styles.text}>{'Facebook'}</Label>
            <Label style={styles.text}>{'Instagram'}</Label>
            <Label style={styles.text}>{'Twitter'}</Label>
            <Label style={styles.text}>{'Snapchat'}</Label>
          </View>
          <View
            style={{
              width: '90%',
              backgroundColor: COLORS.THIN_GREY,
              marginTop: hp(30),
              height: 0.3,
              borderBottomWidth: 1,
              borderColor: COLORS.LIGHT_GRAY,
            }}
          />
          <TouchableOpacity style={styles.addLibray} onPress={() => {}}>
            <IcPin />
            <Label style={[styles.cameraLabel, {marginLeft: wp(20)}]}>
              {'Copy Link'}
            </Label>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.addLibray, {paddingHorizontal: wp(25)}]}
            onPress={() => {}}>
            <IcSent />
            <Label style={[styles.cameraLabel, {marginLeft: wp(20)}]}>
              {'Send as a direct message'}
            </Label>
          </TouchableOpacity>
          {/* <TouchableOpacity
              style={[styles.cancelView]}
              onPress={() => {
                onPressEdit();
              }}>
              <Label style={styles.cancel}>{'Cancel'}</Label>
            </TouchableOpacity> */}
        </View>
      }
      {loader && (
        <View style={styles.loaderView}>
          <ActivityIndicator
            size={'large'}
            animating
            color={darkMode ? COLORS.WHITE : COLORS.GREY}
          />
        </View>
      )}
    </>
  );
};

export default ShareSection;
const style = (darkMode: boolean) =>
  StyleSheet.create({
    image: {
      width: COMPONENT_SIZE.SCREEN_WIDTH,

      marginVertical: hp(10),
      // alignSelf: 'center',
    },
    socialView: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '85%',
      alignItems: 'center',
      marginTop: hp(20),
    },
    addLibray: {
      alignItems: 'center',
      flexDirection: 'row',
      width: '100%',
      //   justifyContent: 'center',
      height: hp(70),
      paddingHorizontal: wp(30),
      //   borderBottomWidth: 1,
      //   borderColor: COLORS.LIGHT_GRAY,
    },
    canvasBack: {
      alignItems: 'center',
      flexDirection: 'row',
      width: '100%',
      paddingHorizontal: wp(30),
      height: hp(70),
      borderBottomWidth: 1,
      borderColor: COLORS.LIGHT_GRAY,
    },
    loaderView: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      opacity: 0.5,
      backgroundColor: 'black',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: wp(10),
    },
    cancel: {
      fontWeight: '500',
      fontSize: hp(16),
      color: darkMode ? COLORS.WHITE : COLORS.BLACK,
      fontFamily: 'Poppins-Medium',
      textAlign: 'center',
      width: '100%',
    },
    innerView: {
      backgroundColor: darkMode ? COLORS.BLACK : COLORS.WHITE,
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: hp(10),
      position: 'absolute',
      bottom: hp(0),
      borderTopRightRadius: hp(20),
      borderTopLeftRadius: hp(20),
    },
    cancelView: {
      alignItems: 'center',
      flexDirection: 'row',
      width: '100%',
      paddingHorizontal: wp(30),
      paddingBottom: hp(15),
    },
    cameraLabel: {
      fontWeight: '400',
      fontSize: hp(16),
      fontFamily: 'Poppins-Medium',
      color: darkMode ? COLORS.WHITE : COLORS.BLACK,
    },
    text: {
      fontSize: hp(12),
      fontWeight: '400',
      color: COLORS.THIN_GREY,
      fontFamily: 'AvenirLTStd-Roman',
    },
    centeredView: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'transparent',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: wp(10),
    },
    date: {
      fontFamily: 'Poppins-Regular',
      fontWeight: '400',
      fontSize: hp(14),
      color: COLORS.BLACK,
    },
    more: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      paddingHorizontal: wp(10),
    },
  });
