import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  ActivityIndicator,
  Image,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import {StackNavigationProp} from 'react-navigation/native-stack';
import IcBack from '~app/assets/images/backArrow.svg';
import IcCamera from '~app/assets/images/camera.svg';
import IcLibrary from '~app/assets/images/library.svg';
import ICProgress from '~app/assets/images/progressBar5.svg';
import IcUser from '~app/assets/images/userCircle.svg';
import Button from '~app/components/Button';
import Label from '~app/components/Label';
import MainCard from '~app/components/MainDarkCard';
import {SCREENS} from '~app/constants/navigation';
import {COLORS, COMPONENT_SIZE, hp, wp} from '~app/constants/styles';
import {InitialStackParamsList} from '~app/navigation/InitialNavigation';
import {appStateSelectors, useAppState} from '~app/state/AppState';
import {uploadProfilePicture} from '../../firebase/ImageUpload';
import Camera from './Camera';
import FilterScreen from './FilterScreen';

const ProfilePicture: React.FC = () => {
  const navigation =
    useNavigation<StackNavigationProp<InitialStackParamsList>>();
  const darkMode = useAppState(appStateSelectors.displayMode!);
  const setAuthenticated = useAppState(state => state.setAuthenticated);
  const user = useAppState(state => state.user);
  const setUser = useAppState(state => state.setUser);
  const [modalVisible, setModalVisible] = useState(false);
  const [image, setImage] = useState('');
  const [loader, setLoader] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [fromCamera, setFromCamera] = useState(false);

  const profileImage = useAppState(appStateSelectors.profileImage!);
  const setProfileImage = useAppState(appStateSelectors.setProfileImage!);

  const OpenModal = () => {
    setModalVisible(true);
  };
  const closeModal = () => {
    setModalVisible(false);
  };

  const openLibrary = () => {
    closeModal();
    ImagePicker.openPicker({
      multiple: false,
      cropping: false,

      cropperCircleOverlay: true,
    }).then(async images => {
      setShowFilter(true);
      setProfileImage(images.path);
    });
  };
  const uploadImage = async (images: any) => {
    if (images.length > 0) {
      setLoader(true);
      const imagePath = await uploadProfilePicture(
        images[0]?.path ? images[0].path : images,
      );
      console.log('imagepla', imagePath);
      setImage(imagePath);
      setUser({
        ...user,
        profileImage: imagePath,
      });
      setLoader(false);
    }
  };

  const openCamera = () => {
    closeModal();
    setShowCamera(true);
    setFromCamera(true);
  };

  const style = styles(darkMode);

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

        <Label style={style.mainText}>Let’s set a profile picture </Label>

        <View
          style={{
            flex: 0.95,
            alignItems: 'center',
            // justifyContent: 'center',
          }}>
          <TouchableOpacity
            style={[style.inputContainer]}
            onPress={() => OpenModal()}>
            {image === '' ? (
              <IcUser style={{height: hp(112), width: hp(112)}} />
            ) : (
              <Image
                style={{
                  height: hp(130),
                  width: hp(130),
                  borderRadius: hp(130 / 2),
                  resizeMode: 'cover',
                }}
                source={{
                  uri: image,
                }}></Image>
            )}
          </TouchableOpacity>
          <Button
            onPress={() => {
              setModalVisible(true);
            }}
            label={image === '' ? 'Upload' : 'Change'}
            style={{
              marginTop: hp(50),
              marginHorizontal: wp(120),
              backgroundColor: COLORS.GREY,
              borderRadius: hp(2),
            }}
            labelStyle={style.uploadLabel}
          />
        </View>
        {modalVisible && <View style={style.centeredView}></View>}
        {modalVisible && (
          <View style={style.innerView}>
            <View
              style={{
                backgroundColor: !darkMode ? COLORS.BLACK : COLORS.WHITE,
                width: wp(45),
                height: wp(4),
                borderRadius: wp(1.5),
                marginBottom: hp(30),
                marginTop: hp(5),
              }}></View>
            <TouchableOpacity
              style={style.addCamera}
              onPress={() => {
                openCamera();
              }}>
              <IcCamera color={darkMode ? COLORS.WHITE : COLORS.BLACK} />
              <Label style={style.cameraLabel}>{'Open Camera'}</Label>
            </TouchableOpacity>
            <TouchableOpacity
              style={style.addLibray}
              onPress={() => {
                openLibrary();
              }}>
              <IcLibrary color={darkMode ? COLORS.WHITE : COLORS.BLACK} />
              <Label style={style.cameraLabel}>{'Add from Library'}</Label>
            </TouchableOpacity>
          </View>
        )}
        {modalVisible && (
          <TouchableOpacity
            style={style.cancelView}
            onPress={() => {
              closeModal();
            }}>
            <Label style={style.cancel}>{'Cancel'}</Label>
          </TouchableOpacity>
        )}
        {!modalVisible && (
          <TouchableOpacity
            style={style.progress}
            onPress={() => {
              navigation.navigate(SCREENS.BIO);
            }}>
            <ICProgress />
          </TouchableOpacity>
        )}
        {!modalVisible && (
          <Button
            label="Skip"
            style={{backgroundColor: 'transparent'}}
            labelStyle={style.skip}
            onPress={() => {
              // setUser({...user,})
              navigation.navigate(SCREENS.BIO);
            }}
          />
        )}
        {loader && (
          <View style={style.loaderView}>
            <ActivityIndicator
              size={'large'}
              animating
              color={darkMode ? COLORS.WHITE : COLORS.GREY}
            />
          </View>
        )}
        {showCamera && (
          <Camera
            closeCamera={(image: any) => {
              console.log('setCameraImage', image);
              setShowCamera(false);
              setShowFilter(true);
            }}
            closeCameraFull={() => {
              setShowCamera(false);
              setShowFilter(false);
            }}
          />
        )}
        {showFilter && (
          <FilterScreen
            closeFliter={(image: any) => {
              uploadImage(image);
              setShowFilter(false);
            }}
            openCamera={() => {
              fromCamera ? setShowCamera(true) : openLibrary();
            }}
          />
        )}
      </MainCard>
    </>
  );
};

export default ProfilePicture;
const styles = (darkMode: boolean) =>
  StyleSheet.create({
    containter: {
      flex: 1,
    },
    line: {
      height: hp(30),
      width: 2,
      backgroundColor: darkMode ? COLORS.BLACK : COLORS.GREY,
      marginHorizontal: hp(15),
    },
    addCamera: {
      alignItems: 'center',
      flexDirection: 'row',
      width: '100%',
      marginLeft: wp(50),
      //   marginTop: hp(150),
      paddingHorizontal: wp(30),
      paddingBottom: hp(30),
    },
    cameraLabel: {
      fontWeight: '500',
      fontSize: hp(16),
      marginLeft: wp(60),
      fontFamily: 'Poppins-Medium',
      color: darkMode ? COLORS.WHITE : COLORS.BLACK,
    },
    addLibray: {
      alignItems: 'center',
      flexDirection: 'row',
      width: '100%',
      marginLeft: wp(50),
      marginTop: hp(15),
      paddingHorizontal: wp(30),
      paddingBottom: hp(30),
    },
    cancel: {
      fontWeight: '500',
      fontSize: hp(16),
      color: darkMode ? COLORS.WHITE : COLORS.BLACK,
      fontFamily: 'Poppins-Medium',
    },
    inputContainer: {
      // ...commonStyles.alignItemsCenter,
      // ...commonStyles.flexRow,

      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      marginHorizontal: wp(35),
      backgroundColor: darkMode ? COLORS.BLACK : COLORS.GREY,
      paddingHorizontal: hp(15),
      borderRadius: hp(130 / 2),
      borderWidth: 1,
      height: hp(130),
      width: hp(130),
      marginTop: COMPONENT_SIZE.SCREEN_HEIGHT / 4.8,
    },
    infoText: {
      fontSize: hp(12),
      fontFamily: 'Poppins-MediumItalic',
      fontWeight: '500',
      marginLeft: wp(37),
      color: darkMode ? COLORS.WHITE : COLORS.BLACK,
      marginTop: hp(10),
    },
    subText: {
      color: darkMode ? COLORS.WHITE : COLORS.BLACK,
      fontSize: wp(14),
      fontWeight: '500',
      fontFamily: 'Poppins-Medium',
      marginBottom: hp(50),
      marginTop: hp(10),
      marginLeft: hp(35),
    },
    countryButton: {
      flexDirection: 'row',
      alignItems: 'center',

      // marginLeft: wp(50),
    },

    centeredView: {
      position: 'absolute',

      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      opacity: 0.5,
      backgroundColor: 'black',
      alignItems: 'flex-end',
      justifyContent: 'flex-end',
      paddingHorizontal: wp(10),
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
    innerView: {
      backgroundColor: darkMode ? COLORS.BLACK : COLORS.WHITE,
      //   height: COMPONENT_SIZE.SCREEN_HEIGHT / 3,
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',

      borderRadius: hp(10),
      position: 'absolute',
      bottom: hp(100),
    },
    cancelView: {
      backgroundColor: darkMode ? COLORS.BLACK : COLORS.WHITE,
      height: 60,
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'absolute',
      bottom: hp(1),
      borderRadius: hp(10),
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
    skip: {
      fontSize: hp(12),

      fontFamily: 'Poppins-SemiBold',
      fontWeight: '600',

      color: darkMode ? COLORS.WHITE : COLORS.BLACK,
    },
    uploadLabel: {
      fontSize: hp(16),

      fontFamily: 'Poppins-SemiBold',
      fontWeight: '600',

      color: darkMode ? COLORS.WHITE : COLORS.BLACK,
    },
    progress: {
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
    },
    customTextInput: {
      fontSize: hp(17),
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
      fontSize: wp(23),
      fontWeight: '500',
      fontFamily: 'Poppins-Medium',

      marginTop: hp(100),
      marginLeft: hp(25),
    },
  });
