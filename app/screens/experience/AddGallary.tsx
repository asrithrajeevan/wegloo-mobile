import auth from '@react-native-firebase/auth';
import MasonryList from '@react-native-seoul/masonry-list';
import {useNavigation} from '@react-navigation/native';
import moment from 'moment';
import React, {FC, useCallback, useState} from 'react';
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import ImagePicker from 'react-native-image-crop-picker';
import {StackNavigationProp} from 'react-navigation/native-stack';
import IcPlusButton from '~app/assets/images/addButton.svg';
import IcCamera from '~app/assets/images/camera.svg';
import ICClose from '~app/assets/images/closeBlack.svg';
import IcLibrary from '~app/assets/images/library.svg';
import IcSucess from '~app/assets/images/sucess.svg';
import IcPlusWhite from '~app/assets/images/whitePlusIcon.svg';
import Button from '~app/components/Button';
import Header from '~app/components/Header';
import Label from '~app/components/Label';
import MainCard from '~app/components/MainCard';
import {SCREENS} from '~app/constants/navigation';
import {COLORS, COMPONENT_SIZE, hp, wp} from '~app/constants/styles';
import {InitialStackParamsList} from '~app/navigation/InitialNavigation';
import {appStateSelectors, useAppState} from '~app/state/AppState';
import {uploadProfilePicture} from '../../firebase/ImageUpload';
import Camera from '../profile/component/Camera';
import FilterScreen from '../profile/component/Filter';

const AddGallary: React.FC = () => {
  const darkMode = useAppState(appStateSelectors.displayMode!);
  interface Furniture {
    id: string;
    imgURL: string;
    text: string;
    path: string;
    randomBool: boolean;
  }

  interface Canvas {
    id: string;
    imgURL: string;
    text: string;
    path: string;
    randomBool: boolean;
  }

  const uid = auth()?.currentUser?.uid;

  const navigation =
    useNavigation<StackNavigationProp<InitialStackParamsList>>();
  // let canvasArray: Canvas[] = [];
  console.log('startttttttt');
  const styles = style(darkMode);
  const [experience, setexperience] = useState('');
  const setExperiencePhotos = useAppState(
    appStateSelectors.setExperiencePhotos!,
  );
  const experiences = useAppState(appStateSelectors.experiences!);
  const setExperiences = useAppState(appStateSelectors.setExperiences!);

  const setPhotos = useAppState(appStateSelectors.setPhotos!);
  const photos = useAppState(appStateSelectors.photos!);
  const experiencePhotos = useAppState(appStateSelectors.experimentPhotos!);
  const [canvasImages, setCanvasImages] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [fromCamera, setFromCamera] = useState(false);
  const [longPress, setLongPress] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [image, setImage] = useState('');
  const [loader, setLoader] = useState(false);
  const [randomBool, setRandomBool] = useState(false);
  const [cameraType, setCameraType] = useState(false);
  const [edit, setEdit] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const onClickCanvas = useCallback((item, randomBool) => {
    console.log('likeeee', item.like);
    navigation.navigate(SCREENS.CANVAS, {
      image: item.path,
      randomBool: item.randomBool,
      item: item,
      // index: index,
    });
  }, []);
  const FurnitureCard: FC<{item: Furniture; index: any}> = ({item, index}) => {
    // random = !random;
    // console.log('renderrow', randomBool);
    if (canvasImages.length > 0)
      return (
        <TouchableOpacity
          activeOpacity={1}
          key={item.id}
          style={{flex: 1}}
          onPress={() => item?.path && onClickCanvas(item, randomBool)}
          // onLongPress={() => {
          //   setEdit(true);
          //   setCurrentIndex(canvasImages.indexOf(item));
          //   setLongPress(true);
          //   setModalVisible(true);
          // }}
        >
          <FastImage
            source={{uri: item?.path, priority: FastImage.priority.high}}
            style={{
              height: !item.randomBool ? hp(175) : hp(232),
              alignSelf: 'stretch',
              margin: 5,
              borderRadius: 10,
            }}
            resizeMode={FastImage.resizeMode.cover}
          />
        </TouchableOpacity>
      );
  };
  const closeModal = () => {
    setModalVisible(false);
  };

  const openCamera = () => {
    closeModal();
    setShowCamera(true);
    setCameraType(true);
    setFromCamera(true);
  };

  const uploadImage = async (images: any) => {
    setLoader(true);

    if (images.length > 0) {
      let canvasArray = photos.slice(0);
      for (var i = 0; i < images.length; i++) {
        console.log('uploading88888', experiencePhotos.length);
        if (!uploading) {
          setUploading(true);
          const imagePath = await uploadProfilePicture(images[i].path);
          if (!longPress) {
            const data = {
              path: imagePath,
              // base64: images[i].base64,
              randomBool:
                canvasArray.length === 0
                  ? false
                  : canvasArray.length === 1
                  ? true
                  : !canvasArray[canvasArray.length - 2].randomBool,
              createdDate: moment().format(),
              likeCount: 0,
              like: false,
              comments: [],
              hide: false,
            };
            console.log('newdataa', data);

            // setCanvasImages(canvasImages => [...canvasImages, data]);
            canvasArray.push(data);
            setPhotos(canvasArray);
            const value = experiencePhotos.concat(canvasArray);
            setExperiencePhotos(value);
            setCanvasImages(canvasArray);
            setUploading(false);
            console.log('canvasArray123', canvasArray);
            // firestore()
            //   .collection('users')
            //   .doc(uid)
            //   .update({
            //     canvasImages: canvasArray,
            //   })
            //   .then(() => {
            //     setUploading(false);
            //     // setLoader(false);
            //     // setCanvasImages(canvasImages => [...canvasImages, imagePath]);
            //     console.log('User updated!');
            //   })
            //   .catch(e => {
            //     // setUploading(false);
            //     console.log('api createUser error', e);
            //   });
          }
        }
      }
      setTimeout(() => {
        setLoader(false);
        setSuccess(true);
      }, 1000);

      // const value = canvasImages.concat(canvasArray);
      // // canvasArray.push(data);
      // console.log('expetiiaaa', canvasArray);
      // setCanvasImages(canvasArray);
      // setExperiencePhotos(value);
      // // canvasImages.push(imagePath);
      // // setCanvasImages(canvasImages);
      // setLoader(false);
      // setUploading(false);
      // setSuccess(true);
    }
    if (longPress) {
      const imagePath = await uploadProfilePicture(images[0].path);
      const data = {
        path: imagePath,
        // base64: images[0].base64,
        randomBool: canvasImages[currentIndex].randomBool,
        createdDate: moment().format(),
        likeCount: canvasImages[currentIndex].likeCount,
        like: canvasImages[currentIndex].like,
        comments: [],
        hide: canvasImages[currentIndex].hide,
      };
      // canvasArray.push(imagePath);
      canvasImages.splice(currentIndex, 1, data);
      setCanvasImages(canvasImages);
      // firestore()
      //   .collection('users')
      //   .doc(uid)
      //   .update({
      //     canvasImages: canvasImages,
      //   })
      //   .then(() => {
      //     setUploading(false);
      //     console.log('User updated!');
      //   });
    }
    // setLoader(false);
  };

  const openLibrary = () => {
    setCameraType(false);
    setUploading(false);
    closeModal();
    ImagePicker.openPicker({
      cropping: false,
      multiple: true,
      height: 1500,
      width: 1500,
      includeBase64: false,
      maxFiles: 10,
      // cropperCircleOverlay: true,
    }).then(async images => {
      let selectedImages: object[] = [];
      images.map(image => {
        const data = {path: image.path};
        selectedImages.push(data);
      });
      console.log('setexperience', selectedImages);
      // setCanvasImages(selectedImages);
      setExperiencePhotos(selectedImages);
      setShowFilter(true);
      //  setProfileImage(images.path);
    });
  };

  return (
    <>
      <MainCard>
        <View
          style={{
            flex: 1,
            // paddingHorizontal: wp(30),
          }}>
          <Header
            goBack={() => {
              navigation.goBack();
            }}
            onPressNext={() => {}}
            rightTitle={''}
            title="Gallery"></Header>
          <TouchableOpacity
            onPress={() => {
              setModalVisible(true);
              setEdit(true);
              setLongPress(false);
            }}
            style={styles.plus}>
            {darkMode ? <IcPlusWhite /> : <IcPlusButton />}
          </TouchableOpacity>
          <Label
            style={styles.album}>{`Photo Album:${canvasImages.length}`}</Label>
          {canvasImages?.length > 0 && (
            <MasonryList
              bounces={false}
              nestedScrollEnabled
              keyExtractor={(item): string => item.id}
              numColumns={2}
              data={canvasImages}
              extraData={canvasImages}
              renderItem={({item, index}: any) => (
                <FurnitureCard item={item} index={index} />
              )}
              // renderItem={renderItem}
            />
          )}
        </View>
        {canvasImages?.length > 0 && (
          <View style={{paddingHorizontal: wp(30), paddingBottom: hp(30)}}>
            <Button
              label="Next"
              style={{borderRadius: 5, width: '100%'}}
              onPress={() => {
                setExperiences({...experiences, gallary: canvasImages});
                navigation.goBack();
              }}
            />
          </View>
        )}
        {modalVisible && <View style={styles.centeredView}></View>}
        {modalVisible && (
          <View style={styles.innerView}>
            <View
              style={{
                backgroundColor: !darkMode ? COLORS.BLACK : COLORS.WHITE,
                width: wp(45),
                height: wp(4),
                borderRadius: wp(1.5),

                marginTop: hp(5),
              }}></View>
            <TouchableOpacity
              style={[styles.addLibray, {marginTop: hp(20)}]}
              onPress={() => {
                setUploading(false);

                openCamera();
              }}>
              <IcCamera color={darkMode ? COLORS.WHITE : COLORS.BLACK} />
              <Label style={[styles.cameraLabel, {marginLeft: wp(55)}]}>
                {'Open Camera'}
              </Label>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.addLibray}
              onPress={() => {
                setUploading(false);
                openLibrary();
              }}>
              <IcLibrary color={darkMode ? COLORS.WHITE : COLORS.BLACK} />
              <Label style={styles.cameraLabel}>{'Add from Library'}</Label>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.cancelView]}
              onPress={() => {
                closeModal();
              }}>
              <Label style={styles.cancel}>{'Cancel'}</Label>
            </TouchableOpacity>
          </View>
        )}
        {showCamera && (
          <Camera
            from="experiment"
            closeCameraFull={() => {
              setShowCamera(false);
              setShowFilter(false);
            }}
            closeCamera={(image: any) => {
              setShowCamera(false);
              setShowFilter(true);
            }}
            retakeCamera={(image: any) => {
              if (cameraType) {
                setShowCamera(true);
              } else {
                openLibrary();
                setShowCamera(false);
              }
              setShowFilter(false);
            }}
            openLibraryPart={() => {
              setShowCamera(false);
              openLibrary();
            }}
          />
        )}
        {showFilter && (
          <FilterScreen
            from={'experiment'}
            retakeCamera={(image: any) => {
              if (cameraType) {
                setShowCamera(true);
              } else {
                openLibrary();
                setShowCamera(false);
              }
              setShowFilter(false);
            }}
            closeFliter={(image: any) => {
              uploadImage(image);
              setUploading(false);
              setShowFilter(false);
            }}
            closeFilterModal={() => {
              setShowFilter(false);
            }}
            showFilter={showFilter}
            openCamera={() => {
              fromCamera ? setShowCamera(true) : openLibrary();
            }}
          />
        )}
        {success && (
          <View style={styles.centeredSuccessView}>
            <View style={styles.successCard}>
              <View
                style={{
                  alignItems: 'flex-end',
                  justifyContent: 'center',
                  width: '100%',
                }}>
                <TouchableOpacity
                  style={{height: hp(30), width: hp(30)}}
                  onPress={() => {
                    setSuccess(false);
                  }}>
                  <ICClose />
                </TouchableOpacity>
              </View>
              <IcSucess />
              <Label style={styles.confirmText}>
                Photos added successfully
              </Label>

              <Button
                label="Okay"
                style={styles.continueButton}
                labelStyle={styles.continueText}
                onPress={() => {
                  setSuccess(false);
                }}
              />
            </View>
          </View>
        )}
        {loader && (
          <View style={styles.loaderView}>
            <ActivityIndicator
              size={'large'}
              animating
              color={darkMode ? COLORS.WHITE : COLORS.GREY}
            />
          </View>
        )}
      </MainCard>
    </>
  );
};

export default AddGallary;
const style = (darkMode: boolean) =>
  StyleSheet.create({
    topBar: {
      alignItems: 'center',
      flexDirection: 'row',
      width: '100%',
      paddingLeft: hp(20),
      marginTop: hp(20),
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
    confirmText: {
      fontFamily: 'Poppins-Medium',
      fontSize: hp(16),
      fontWeight: '500',
      width: '90%',
      textAlign: 'center',
      color: COLORS.BLACK,
      marginTop: hp(20),
    },
    confirmBelowText: {
      fontFamily: 'Poppins-Medium',
      fontSize: hp(16),
      fontWeight: '500',
      width: '90%',
      textAlign: 'center',
      color: COLORS.BLACK,
    },
    successCard: {
      shadowColor: '#171717',
      shadowOffset: {width: -1, height: 5},
      shadowOpacity: 0.2,
      shadowRadius: 3,
      borderRadius: 10,
      height: Platform.OS === 'ios' ? hp(280) : hp(300),
      width: COMPONENT_SIZE.SCREEN_WIDTH * 0.8,
      backgroundColor: darkMode ? COLORS.WHITE : '#FFFFFF',
      paddingTop: hp(20),
      // marginVertical: hp(20),
      elevation: 2,

      alignItems: 'center',
    },
    continueButton: {
      alignItems: 'center',
      marginHorizontal: wp(40),
      justifyContent: 'center',
      // width: '80%',
      height: hp(50),
      paddingHorizontal: wp(20),
      borderRadius: 5,
      marginTop: hp(25),
      backgroundColor: COLORS.THEME_BLUE,
    },

    continueText: {
      fontSize: hp(16),
      fontFamily: 'Poppins-SemiBold',
      fontWeight: '600',
      color: COLORS.WHITE,
    },
    centeredSuccessView: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: darkMode ? '#282B33' : '#EEEEFE',
      // opacity: 0.95,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: wp(10),
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
    album: {
      fontWeight: '500',
      fontSize: hp(13),
      color: darkMode ? COLORS.WHITE : COLORS.THIN_GREY,
      fontFamily: 'Poppins-Medium',
      textAlign: 'right',
      width: '95%',
      // marginHorizontal: wp(20),
    },
    innerView: {
      backgroundColor: darkMode ? COLORS.BLACK : COLORS.WHITE,
      //   height: COMPONENT_SIZE.SCREEN_HEIGHT / 3,
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
    addLibray: {
      alignItems: 'center',
      flexDirection: 'row',
      width: '100%',
      marginLeft: wp(50),
      // marginTop: hp(10),
      paddingHorizontal: wp(30),
      paddingBottom: hp(45),
    },
    cancel: {
      fontWeight: '500',
      fontSize: hp(16),
      color: darkMode ? COLORS.WHITE : COLORS.BLACK,
      fontFamily: 'Poppins-Medium',
      textAlign: 'center',
      width: '100%',
    },
    cameraLabel: {
      fontWeight: '500',
      fontSize: hp(16),
      marginLeft: wp(60),
      fontFamily: 'Poppins-Medium',
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
    privacy: {
      textDecorationLine: 'underline',
      fontSize: hp(16),
      color: COLORS.BLACK,
      fontFamily: 'Poppins-Regular',
    },

    privacyView: {
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      flexDirection: 'row',
      paddingHorizontal: wp(30),
      marginTop: hp(30),
    },
    people: {
      paddingHorizontal: wp(30),
      marginTop: hp(30),
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
    },
    heading: {
      fontSize: hp(18),
      fontFamily: 'Poppins-Medium',
      color: COLORS.BLACK,
    },
    input: {
      fontSize: hp(16),
      fontFamily: 'Poppins-Medium',
      fontWeight: '400',
      width: '100%',
      marginTop: hp(20),
    },
  });
