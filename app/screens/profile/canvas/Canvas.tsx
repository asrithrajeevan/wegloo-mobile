import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {useNavigation, useRoute} from '@react-navigation/native';
import moment from 'moment';
import React, {useState} from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Image from 'react-native-scalable-image';
import Share from 'react-native-share';
import {StackNavigationProp} from 'react-navigation/native-stack';
import IcBack from '~app/assets/images/backArrow.svg';
import Header from '~app/components/Header';
import Label from '~app/components/Label';
import MainDarkCard from '~app/components/MainDarkCard';
import {COLORS, COMPONENT_SIZE, hp, wp} from '~app/constants/styles';
import {InitialStackParamsList} from '~app/navigation/InitialNavigation';
import {appStateSelectors, useAppState} from '~app/state/AppState';
import CanvasViewDetails from '../component/CanvasViewDetails';

const CanvasView: React.FC = () => {
  const route = useRoute<StackNavigationProp<InitialStackParamsList>>();
  const darkMode = useAppState(appStateSelectors.displayMode!);
  const styles = style(darkMode);
  const [showEdit, setShowEdit] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [like, setLike] = useState(route?.params?.item?.like);

  const uid = auth()?.currentUser?.uid;
  const imageUrl = route?.params?.image;

  const currentUser = useAppState(appStateSelectors.currentUser!);
  const [canvasImages, setCanvasImages] = useState(currentUser.canvasImages);
  const [loader, setLoader] = useState(false);
  const navigation =
    useNavigation<StackNavigationProp<InitialStackParamsList>>();

  const onPressEdit = () => {
    setShowEdit(!showEdit);
  };
  const deleteImage = () => {
    let canvas = [];
    const index = canvasImages.findIndex((data: {path: any}) => {
      return data.path === route.params.item.path;
    });

    setLoader(true);
    canvasImages.splice(index, 1);
    for (let i = 0; i < canvasImages.length; i++) {
      const data = {
        path: canvasImages[i].path,
        randomBool:
          i === 0
            ? false
            : i === 1
            ? true
            : !canvas[canvas.length - 2].randomBool,
        createdDate: moment().format(),
        likeCount: canvasImages[i].likeCount,
        like: canvasImages[i].like,
        comments: [],
        // base64: canvasImages[i].hasOwnProperty('base64')
        //   ? canvasImages[i].base64
        //   : '',
        hide: canvasImages[i].hide,
      };
      console.log('deleton', data);
      canvas.push(data);
    }
    firestore()
      .collection('users')
      .doc(uid)
      .update({
        canvasImages: canvas,
      })
      .then(() => {
        setLoader(false);
        console.log('User updated!');
        navigation.goBack();
      });
  };
  const updateLike = () => {
    setLoader(true);
    const index = canvasImages.findIndex((data: {path: any}) => {
      return data.path === route.params.item.path;
    });
    const data = {
      path: canvasImages[index].path,
      // base64: canvasImages[index].hasOwnProperty('base64')
      //   ? canvasImages[index].base64
      //   : '',
      randomBool: canvasImages[index].randomBool,
      createdDate: moment().format(),
      likeCount: canvasImages[index].likeCount,
      like: like,
      comments: [],
      hide: canvasImages[index].hide,
    };
    canvasImages.splice(index, 1, data);
    firestore()
      .collection('users')
      .doc(uid)
      .update({
        canvasImages: canvasImages,
      })
      .then(() => {
        setLoader(false);
        navigation.goBack();
        console.log('User updated!');
      });
  };

  const hideImage = () => {
    setLoader(true);
    const index = canvasImages.findIndex((data: {path: any}) => {
      return data.path === route.params.item.path;
    });
    const data = {
      path: canvasImages[index].path,
      // base64: canvasImages[index].hasOwnProperty('base64')
      //   ? canvasImages[index].base64
      //   : '',
      randomBool: canvasImages[index].randomBool,
      createdDate: moment().format(),
      likeCount: canvasImages[index].likeCount,
      like: canvasImages[index].like,
      comments: [],
      hide: !canvasImages[index].hide,
    };
    canvasImages.splice(index, 1, data);
    firestore()
      .collection('users')
      .doc(uid)
      .update({
        canvasImages: canvasImages,
      })
      .then(() => {
        setLoader(false);
        console.log('User updated!');
        navigation.goBack();
      });
  };

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
      // url: `data:image/png;base64,` + route.params.item.base64,
      url: route.params.item.path,
      message: '',
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
      <MainDarkCard
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1,
        }}>
        <Header
          title={''}
          rightTitle={'Done'}
          goBack={() => {
            if (like !== route.params.item.like) {
              updateLike();
            } else [navigation.goBack()];
          }}
          onPressNext={() => {}}
        />
        <ScrollView
          contentContainerStyle={{marginTop: hp(10), paddingBottom: hp(30)}}
          showsVerticalScrollIndicator={false}>
          <Image
            width={COMPONENT_SIZE.SCREEN_WIDTH} // height will be calculated automatically
            source={{uri: imageUrl}}
          />
          <CanvasViewDetails
            like={like}
            onPressLike={() => setLike(!like)}
            date={moment(route?.params.item.createdDate).format('MMM DD')}
            profileImage={currentUser?.profileImage}
            showEdit={() => {
              onPressEdit();
            }}
          />
        </ScrollView>
        {showEdit && <View style={styles.centeredView}></View>}
        {showEdit && (
          <View style={styles.innerView}>
            <TouchableOpacity
              style={[styles.canvasBack, {marginTop: hp(10)}]}
              onPress={() => {
                onPressEdit();
                navigation.goBack();
              }}>
              <IcBack color={darkMode ? COLORS.WHITE : COLORS.BLACK} />
              <Label
                style={[
                  styles.cameraLabel,
                  {marginLeft: wp(30), fontWeight: '500'},
                ]}>
                {'Canvas'}
              </Label>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.addLibray]}
              onPress={() => {
                deleteImage();
              }}>
              <Label style={[styles.cameraLabel, {color: COLORS.READ}]}>
                {'Delete'}
              </Label>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.addLibray}
              onPress={() => {
                hideImage();
              }}>
              <Label style={[styles.cameraLabel, {color: COLORS.READ}]}>
                {route?.params?.item?.hide
                  ? 'Unhide from Canvas'
                  : 'Hide from Canvas'}
              </Label>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.addLibray}
              onPress={() => {
                setShowEdit(false);
                shareSingleImage();
                // setShowShare(true);
              }}>
              <Label style={[styles.cameraLabel]}>{'Share'}</Label>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.addLibray}
              onPress={() => {
                onPressEdit();
              }}>
              <Label style={[styles.cameraLabel]}>{'Cancel'}</Label>
            </TouchableOpacity>
            {/* <TouchableOpacity
              style={[styles.cancelView]}
              onPress={() => {
                onPressEdit();
              }}>
              <Label style={styles.cancel}>{'Cancel'}</Label>
            </TouchableOpacity> */}
          </View>
        )}
        {/* {showShare && (
          <ShareComponent
            image={route.params.item.base64}
            closeShare={() => {
              setShowShare(false);
            }}
            onPressShare={() => {}}
          />
        )} */}
        {loader && (
          <View style={styles.loaderView}>
            <ActivityIndicator
              size={'large'}
              animating
              color={darkMode ? COLORS.WHITE : COLORS.GREY}
            />
          </View>
        )}
      </MainDarkCard>
    </>
  );
};

export default CanvasView;
const style = (darkMode: boolean) =>
  StyleSheet.create({
    image: {
      width: COMPONENT_SIZE.SCREEN_WIDTH,

      marginVertical: hp(10),
      // alignSelf: 'center',
    },
    addLibray: {
      alignItems: 'center',
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'center',
      height: hp(65),
      paddingHorizontal: wp(30),
      borderBottomWidth: 1,
      borderColor: COLORS.LIGHT_GRAY,
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
