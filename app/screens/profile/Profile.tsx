import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import MasonryList from '@react-native-seoul/masonry-list';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import moment from 'moment';
import React, {
  FC,
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  ActivityIndicator,
  Alert,
  BackHandler,
  FlatList,
  Image,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import ImagePicker from 'react-native-image-crop-picker';
import GestureRecognizer from 'react-native-swipe-gestures';
import {TabBar} from 'react-native-tab-view';
import {StackNavigationProp} from 'react-navigation/native-stack';
import IcPlusButton from '~app/assets/images/addButton.svg';
import IcAdd from '~app/assets/images/addIcon.svg';
import IcAddWhite from '~app/assets/images/addIconWhite.svg';
import IcBell from '~app/assets/images/bell.svg';
import ICLogo from '~app/assets/images/brandLogo.svg';
import IcCamera from '~app/assets/images/camera.svg';
import ICClose from '~app/assets/images/closeBlack.svg';
import IcContact from '~app/assets/images/contact.svg';
import IcFb from '~app/assets/images/fb.svg';
import IcInstagram from '~app/assets/images/instagram.svg';
import IcLibrary from '~app/assets/images/library.svg';
import IcLocation from '~app/assets/images/location.svg';
import IcMail from '~app/assets/images/mail.svg';
import IcMenu from '~app/assets/images/menu.svg';
import IcMusic from '~app/assets/images/music.svg';
import IcSent from '~app/assets/images/sent.svg';
import IcSucess from '~app/assets/images/sucess.svg';
import IcTwitter from '~app/assets/images/twitter.svg';
import IcUser from '~app/assets/images/userCircle.svg';
import IcPlusWhite from '~app/assets/images/whitePlusIcon.svg';
import Accodian from '~app/components/Accordian/Accordian';
import Button from '~app/components/Button';
import Label from '~app/components/Label';
import MainCard from '~app/components/MainCard';
import {SCREENS} from '~app/constants/navigation';
import {COLORS, COMPONENT_SIZE, hp, wp} from '~app/constants/styles';
import useUsername from '~app/hooks/User';
import {InitialStackParamsList} from '~app/navigation/InitialNavigation';
import {appStateSelectors, useAppState} from '~app/state/AppState';
import {uploadProfilePicture} from '../../firebase/ImageUpload';
import Camera from './component/Camera';
import FilterScreen from './component/Filter';

// let imageArray = [];
let random = false;
const Profile: React.FC = () => {
  const navigation =
    useNavigation<StackNavigationProp<InitialStackParamsList>>();
  const [tab, setTab] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [fromCamera, setFromCamera] = useState(false);
  const [longPress, setLongPress] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [randomBool, setRandomBool] = useState(false);
  const [cameraType, setCameraType] = useState(false);
  const [edit, setEdit] = useState(false);
  const isFocused = useIsFocused();
  const setExperiences = useAppState(appStateSelectors.setExperiences!);

  const [success, setSuccess] = useState(false);

  const [image, setImage] = useState('');
  const [loader, setLoader] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const uid = auth()?.currentUser?.uid;
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => true,
    );
    return () => backHandler.remove();
  }, []);
  // React.useEffect(() => {
  //   if (tab === 2 || tab === 1) {
  //     navigation.setOptions({
  //       tabBarStyle: {
  //         display: 'none',
  //       },
  //     });
  //   } else {
  //     navigation.setOptions({
  //       tabBarStyle: {
  //         display: 'flex',
  //         backgroundColor: darkMode ? 'black' : COLORS.WHITE,
  //       },
  //     });
  //   }
  //   //   navigation.getParent()?.setOptions({tabBarStyle: {display: 'none'}});
  //   //   return () => navigation.getParent()?.setOptions({tabBarStyle: undefined});
  // }, [tab]);
  const {userById} = useUsername();

  const currentUser = useAppState(appStateSelectors.currentUser!);
  const setCanvasPhotos = useAppState(appStateSelectors.setCanvasPhotos!);
  const [canvasImages, setCanvasImages] = useState(currentUser?.canvasImages);

  useEffect(() => {
    userById();
  }, [isFocused]);
  let canvasArray: unknown[] = [];
  canvasArray = currentUser?.canvasImages;

  useEffect(() => {
    // console.log('randommmvalue', currentUser?.canvasImages);
    setCanvasImages(currentUser?.canvasImages);
    canvasArray = currentUser?.canvasImages;
    {
      currentUser?.canvasImages?.length > 0 &&
        setRandomBool(canvasArray[canvasArray.length - 1].randomBool);
    }
  }, [currentUser]);

  interface Furniture {
    id: string;
    imgURL: string;
    text: string;
  }

  const darkMode = useAppState(appStateSelectors.displayMode!);
  const styles = style(darkMode);

  const [shareTab, setShareTab] = useState(0);
  // const [canvasImages, setCanvasImages] = useState(null);

  // useEffect(() => {
  //   navigation.getParent()?.setOptions({tabBarStyle: {display: 'none'}});
  //   return () => navigation.getParent()?.setOptions({tabBarStyle: undefined});
  // }, [navigation]);

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
    random = useMemo(() => !random, []);

    // random = !random;
    // console.log('renderrow', randomBool);
    if (canvasImages.length > 0)
      return (
        <GestureRecognizer
          style={{flex: 1}}
          onSwipeLeft={state => onSwipeLeft(state)}
          onSwipeRight={state => onSwipeRight(state)}
          config={config}>
          <TouchableOpacity
            activeOpacity={1}
            key={item.id}
            style={{flex: 1}}
            onPress={() => item?.path && onClickCanvas(item, randomBool, index)}
            onLongPress={() => {
              setEdit(true);
              setCurrentIndex(canvasImages.indexOf(item));
              setLongPress(true);
              setModalVisible(true);
            }}>
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
        </GestureRecognizer>
      );
  };

  const renderItem = ({
    item,
    index,
  }: {
    item: Furniture;
    index: any;
  }): ReactElement => {
    console.log('indexnumber', index);
    return <FurnitureCard item={item} index={index} />;
  };

  const DATA = [
    {
      title: 'Camping Wknd ⛰',
      users: ['Cris', 'Mark'],
      location: 'Costa Mesa, CA',
    },
    {
      title: 'River Wknd ⛰',
      users: ['Cris'],
      location: 'Costa Mesa, CA',
    },
  ];
  const renderCardItem = ({item}) => (
    <GestureRecognizer
      style={{flex: 1}}
      onSwipeLeft={state => onSwipeLeft(state)}
      onSwipeRight={state => onSwipeRight(state)}
      config={config}>
      <Accodian
        title={item.title}
        users={item.friends}
        location={item.location}
        item={item}
      />
    </GestureRecognizer>
    // <View>
    //   <Label>{item.title}</Label>
    // </View>
  );
  const ImageComponent = React.memo(function ImageComponent({source}: any) {
    return (
      <Image
        style={styles.pics}
        source={{
          uri: source,
        }}
      />
    );
  });
  const renderTabBar = (props: any) => (
    <TabBar
      {...props}
      indicatorStyle={{backgroundColor: COLORS.THEME_BLUE}}
      style={{backgroundColor: COLORS.WHITE}}
      renderLabel={({route, focused, color}) => (
        <Label style={focused ? styles.tabTitle : styles.tabTitleUnfocus}>
          {route.title}
        </Label>
      )}
    />
  );
  const topFriendsView = () => {
    console.log('topFriendsView');
    return (
      <>
        <View style={styles.users}>
          <View style={styles.pics}>
            {/* <IcProfile1 /> */}
            {/* <ImageComponent source={currentUser.profileImage} /> */}
            {/* <Image
              style={styles.pics}
              resizeMode="cover"
              // source={require('~app/assets/images/friend1.png')}
              source={{
                uri: currentUser.profileImage,
              }}
            /> */}
            <FastImage
              style={styles.pics}
              source={{
                uri: 'https://firebasestorage.googleapis.com:443/v0/b/wegloo-efccc.appspot.com/o/profilePictures%2FAjta2VnGofc3dMg1VItuKTOhoxG2.jpg?alt=media&token=b7129d1e-2efd-4683-911f-1a86067f22ae',

                priority: FastImage.priority.normal,
              }}
              resizeMode={FastImage.resizeMode.cover}
            />
          </View>
          <View style={styles.pics}>
            {/* <IcProfile2 /> */}
            {/* <Image
              style={styles.pics}
              resizeMode="cover"
              source={{
                uri: 'https://firebasestorage.googleapis.com:443/v0/b/wegloo-efccc.appspot.com/o/profilePictures%2FTue%20May%2010%202022%2010:08:15%20GMT-0400%20(EDT).jpg?alt=media&token=8f77f804-f968-4969-a509-6469db20e3fe',
              }}
            /> */}
            <FastImage
              style={styles.pics}
              source={{
                uri: 'https://firebasestorage.googleapis.com:443/v0/b/wegloo-efccc.appspot.com/o/profilePictures%2FTue%20May%2010%202022%2010:08:15%20GMT-0400%20(EDT).jpg?alt=media&token=8f77f804-f968-4969-a509-6469db20e3fe',

                priority: FastImage.priority.normal,
              }}
              resizeMode={FastImage.resizeMode.cover}
            />
            {/* <Image
              style={styles.pics}
              source={{
                uri: currentUser.profileImage,
              }}
            /> */}
          </View>
          <View style={styles.centerPic}>
            {/* <Image
              style={styles.pics}
              source={{
                uri: 'https://firebasestorage.googleapis.com:443/v0/b/wegloo-efccc.appspot.com/o/profilePictures%2F3DDfimKmlVeSmLFnXUNO6Sh47gX2.jpg?alt=media&token=c3e7e7d0-6ce5-4285-a40f-e32d3997860b',
              }}
            /> */}
            {/* <IcProfile3 /> */}
            <FastImage
              style={styles.pics}
              source={{
                uri: 'https://firebasestorage.googleapis.com:443/v0/b/wegloo-efccc.appspot.com/o/profilePictures%2F3DDfimKmlVeSmLFnXUNO6Sh47gX2.jpg?alt=media&token=c3e7e7d0-6ce5-4285-a40f-e32d3997860b',

                priority: FastImage.priority.normal,
              }}
              resizeMode={FastImage.resizeMode.cover}
            />
          </View>
        </View>
      </>
    );
  };
  const headerComponent = () => {
    console.log('currentUser.index', currentIndex);
    return (
      <View style={{marginHorizontal: hp(30), flex: 1}}>
        <View style={styles.userView}>
          <View style={styles.imageView}>
            <View style={styles.profileImage}>
              {/* <ProfilePic /> */}
              {currentUser?.profileImage ? (
                // <Image
                //   style={styles.imageStyle}
                //   source={{
                //     uri: currentUser.profileImage,
                //   }}
                // />
                <FastImage
                  style={styles.imageStyle}
                  source={{
                    uri: currentUser.profileImage,

                    priority: FastImage.priority.normal,
                  }}
                  resizeMode={FastImage.resizeMode.cover}
                />
              ) : (
                <IcUser height={hp(140)} width={hp(140)} />
              )}
            </View>
            <View
              style={{
                width: '100%',
                marginTop: hp(10),
              }}>
              <Label style={styles.connectionHead}>
                {currentUser.profileName}
              </Label>
              <View style={styles.location}>
                <IcLocation
                  color={darkMode ? COLORS.WHITE : COLORS.BLACK}
                  style={{marginTop: hp(5)}}
                />
                <Label style={styles.place}>{currentUser.location}</Label>
              </View>
              <View style={styles.location}>
                <View style={styles.active}></View>
                <Label style={styles.place}>{'Active Now'}</Label>
              </View>
            </View>
          </View>
          <View style={styles.connectionsView}>
            <Label style={styles.connectionHead}>{'900'}</Label>
            <Label style={styles.connectionContent}>{'Connections'}</Label>
            <Label style={styles.connectionHead}>{'2k'}</Label>
            <Label style={styles.connectionContent}>{'Followers'}</Label>
            <Label style={styles.connectionHead}>{'90'}</Label>
            <Label style={styles.connectionContent}>{'Experiences'}</Label>
            {topFriendsView()}
            <Label style={styles.connectionContent}>{'Top Friends'}</Label>
          </View>
        </View>
        <Button
          style={styles.editButton}
          labelStyle={styles.buttonText}
          label="Edit Profile"></Button>
        {tabSection()}
        {tab === 0 && (
          <TouchableOpacity
            onPress={() => {
              setModalVisible(true);
              setEdit(true);
              setLongPress(false);
            }}
            style={styles.plus}>
            {darkMode ? <IcPlusWhite /> : <IcPlusButton />}
          </TouchableOpacity>
        )}
        {tab === 1 && (
          <View
            style={{
              width: '85%',
              height: hp(1),
              backgroundColor: darkMode ? COLORS.WHITE : COLORS.BLACK,
              marginLeft: wp(30),
            }}
          />
        )}
        {tab == 1 && (
          <View
            style={{
              flexDirection: 'row',
              // flex: 1,

              height: 40,
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <TouchableOpacity
              onPress={() => {
                setShareTab(0);
              }}
              style={{
                backgroundColor:
                  shareTab === 0
                    ? COLORS.THEME_BLUE
                    : darkMode
                    ? 'transparent'
                    : COLORS.WHITE,
                paddingHorizontal: wp(8),
                paddingVertical: Platform.OS === 'ios' ? hp(1) : hp(0),
                alignItems: 'center',
                borderRadius: 5,
              }}>
              <Label
                style={shareTab === 0 ? styles.shareLabel : styles.hiddenLabel}>
                {'Shared'}
              </Label>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor:
                  shareTab === 1
                    ? COLORS.THEME_BLUE
                    : darkMode
                    ? 'transparent'
                    : COLORS.WHITE,
                paddingHorizontal: wp(8),
                paddingVertical: Platform.OS === 'ios' ? hp(1) : hp(0),
                borderRadius: 5,
                alignItems: 'center',
              }}
              onPress={() => {
                setShareTab(1);
              }}>
              <Label
                style={shareTab === 1 ? styles.shareLabel : styles.hiddenLabel}>
                {'Hidden'}
              </Label>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };
  const uploadImage = async (images: any) => {
    setLoader(true);

    if (images.length > 0) {
      for (var i = 0; i < images.length; i++) {
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
            canvasArray.push(data);
            // canvasImages.push(imagePath);
            // setCanvasImages(canvasImages);

            console.log('canvasArray123', canvasArray);
            firestore()
              .collection('users')
              .doc(uid)
              .update({
                canvasImages: canvasArray,
              })
              .then(() => {
                setUploading(false);
                // setLoader(false);
                // setCanvasImages(canvasImages => [...canvasImages, imagePath]);
                console.log('User updated!');
              })
              .catch(e => {
                // setUploading(false);
                console.log('api createUser error', e);
              });
          }
        }
      }
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
      firestore()
        .collection('users')
        .doc(uid)
        .update({
          canvasImages: canvasImages,
        })
        .then(() => {
          setUploading(false);
          console.log('User updated!');
        });
    }
    setLoader(false);
    setSuccess(true);
  };
  const openLibrary = () => {
    setCameraType(false);

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
      setCanvasPhotos(selectedImages);
      setShowFilter(true);
      // setProfileImage(images.path);
    });
  };

  const tabSection = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          // flex: 1,
          justifyContent: 'space-between',
          marginVertical: hp(10),
        }}>
        <TouchableOpacity
          style={{marginLeft: wp(5)}}
          onPress={() => {
            setTab(0);
          }}>
          <Label style={tab === 0 ? styles.tabTitle : styles.tabTitleUnfocus}>
            {'Canvas'}
          </Label>
          {tab === 0 && <View style={styles.indicatorLine}></View>}
        </TouchableOpacity>
        <TouchableOpacity
          style={{marginLeft: wp(10)}}
          onPress={() => {
            setTab(1);
          }}>
          <Label style={tab === 1 ? styles.tabTitle : styles.tabTitleUnfocus}>
            {'Experiences'}
          </Label>
          {tab === 1 && <View style={styles.indicatorLine}></View>}
        </TouchableOpacity>
        <TouchableOpacity
          style={{marginLeft: wp(10)}}
          onPress={() => {
            setTab(2);
          }}>
          <Label style={tab === 2 ? styles.tabTitle : styles.tabTitleUnfocus}>
            {'About Me'}
          </Label>
          {tab === 2 && <View style={styles.indicatorLine}></View>}
        </TouchableOpacity>
      </View>
    );
  };
  // const changeTab = useCallback(() => {
  //   setTab(1);
  // }, [tab]);
  const OpenModal = () => {
    setModalVisible(true);
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

  const handlePress = async (url: string, type: string) => {
    let newUrl = '';
    if (type === 'fb') {
      newUrl = `https://www.facebook.com/${url}/`;
    } else if (type === 'insta') {
      newUrl = `https://www.instagram.com/${url}/`;
    } else if (type === 'twitter') {
      newUrl = `https://twitter.com/${url}`;
    } else if (type === 'tiktok') {
      if (url.startsWith('@')) {
        newUrl = `https://tiktok.com/${url}`;
      } else {
        newUrl = `https://tiktok.com/@${url}`;
      }
    } else {
      newUrl = `http://www.snapchat.com/add/${url}`;
    }
    // Checking if the link is supported for links with custom URL scheme.
    const supported = await Linking.canOpenURL(newUrl);

    if (supported) {
      await Linking.openURL(newUrl);
      // Opening the link with some app, if the URL scheme is "http" the web link should be opened
      // by some browser in the mobile
    } else {
      Alert.alert(`Don't know how to open this URL: ${newUrl}`);
    }
  };
  const config = {
    velocityThreshold: 0.7,
    directionalOffsetThreshold: 80,
    gestureIsClickThreshold: 5,
  };

  const onSwipeRight = (gestureState: any) => {
    // setImage(images.tutorial1);

    if (tab === 0) {
      // setImage(images.tutorial2);
    } else {
      if (tab <= 2 && tab !== 0 && !showFilter) {
        setTab(tab - 1);
      }
    }
  };

  const onSwipeLeft = (gestureState: any) => {
    console.log('onSwipeLeft', tab);
    if (tab >= 0 && tab !== 2 && !showFilter) {
      setTab(tab + 1);
      // setImage(images.tutorial2);
    }
  };

  return (
    <>
      <MainCard>
        {/* <ScrollView
          contentContainerStyle={{
            flex: 1,
          }}> */}

        <View style={styles.topBar}>
          <Label style={styles.heading}>{currentUser?.username}</Label>
          <TouchableOpacity
            // style={{height: 40, width: 40}}
            onPress={() => {
              setExperiences({});
              navigation.navigate(SCREENS.EXPERIENCE);
            }}>
            {darkMode ? <IcAddWhite /> : <IcAdd />}
          </TouchableOpacity>
          <IcSent
            color={darkMode ? COLORS.WHITE : COLORS.BLACK}
            style={{marginHorizontal: hp(10)}}
          />
          <IcMenu color={darkMode ? COLORS.WHITE : '#282B33'} />
        </View>
        {/* {tab === 2 && headerComponent()} */}

        {tab === 0 && canvasImages?.length === 0 && headerComponent()}
        {tab === 0 && canvasImages?.length > 0 && (
          <MasonryList
            bounces={false}
            ListHeaderComponent={headerComponent()}
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
        {tab === 1 && !currentUser?.experiences && headerComponent()}
        {tab === 1 && currentUser?.experiences?.length > 0 && (
          <FlatList
            bounces={false}
            ListHeaderComponent={headerComponent()}
            keyExtractor={(item): string => item.title}
            style={{marginBottom: 5}}
            data={currentUser?.experiences}
            extraData={currentUser?.experiences}
            renderItem={renderCardItem}
          />
        )}
        {tab === 2 && (
          <ScrollView
            bounces={false}
            contentContainerStyle={{
              marginBottom: hp(30),
            }}>
            <GestureRecognizer
              style={{flex: 1}}
              onSwipeLeft={state => onSwipeLeft(state)}
              onSwipeRight={state => onSwipeRight(state)}
              config={config}>
              {headerComponent()}
              <View style={styles.section}>
                <View
                  style={
                    styles.shadowStyle
                    // marginTop: hp(50),
                  }>
                  <View>
                    <Label style={styles.headBio}>{'Bio'}</Label>
                    <Label style={styles.about}>{currentUser.bio}</Label>
                    <Label style={styles.head}>{'Links'}</Label>
                    <View style={styles.socialView}>
                      <TouchableOpacity
                        onPress={() =>
                          handlePress(currentUser.instagram, 'insta')
                        }>
                        <IcInstagram />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() =>
                          handlePress(currentUser.ticktok, 'tiktok')
                        }>
                        <IcMusic />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() =>
                          handlePress(currentUser.twitter, 'twitter')
                        }>
                        <IcTwitter />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handlePress(currentUser.facebook, 'fb')}>
                        <IcFb />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() =>
                          handlePress(currentUser.snapChat, 'snap')
                        }>
                        <IcBell />
                      </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                      onPress={() => {
                        if (!currentUser?.website.startsWith('https://')) {
                          Linking.openURL(`https://${currentUser?.website}`);
                        } else {
                          Linking.openURL(`${currentUser?.website}`);
                        }
                      }}>
                      <Label style={{color: COLORS.BLUE, marginTop: hp(20)}}>
                        {currentUser.website}
                      </Label>
                    </TouchableOpacity>
                    <Label style={styles.headContact}>{'Contact'}</Label>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: hp(10),
                      }}>
                      <IcContact
                        color={darkMode ? COLORS.WHITE : COLORS.BLACK}
                      />
                      <Label style={styles.contact}>
                        {currentUser.phoneNumber}
                      </Label>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: hp(15),
                      }}>
                      <IcMail color={darkMode ? COLORS.WHITE : COLORS.BLACK} />
                      <Label style={styles.contact}>{currentUser.email}</Label>
                    </View>
                  </View>
                </View>
              </View>
            </GestureRecognizer>
          </ScrollView>
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
              style={[styles.addLibray, {paddingBottom: hp(10)}]}
              onPress={() => {
                setUploading(false);

                openLibrary();
              }}>
              <ICLogo />
              <Label style={[styles.cameraLabel, {marginLeft: wp(45)}]}>
                {'Add from Experience'}
              </Label>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.cancelView, {marginTop: hp(40)}]}
              onPress={() => {
                closeModal();
              }}>
              <Label style={styles.cancel}>{'Cancel'}</Label>
            </TouchableOpacity>
          </View>
        )}
        {/* {modalVisible && (
          <TouchableOpacity
            style={styles.cancelView}
            onPress={() => {
              closeModal();
            }}>
            <Label style={styles.cancel}>{'Cancel'}</Label>
          </TouchableOpacity>
        )} */}
        {showCamera && (
          <Camera
            from=""
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
            from={''}
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
        {/* <View style={{marginTop: hp(100), flex: 1}}>
            <TabView
              navigationState={{index, routes}}
              renderScene={renderScene}
              onIndexChange={setIndex}
              renderTabBar={renderTabBar}
              initialLayout={{width: COMPONENT_SIZE.SCREEN_WIDTH}}
            />
          </View> */}
        {/* </ScrollView> */}
      </MainCard>
    </>
  );
};

export default Profile;
const style = (darkMode: boolean) =>
  StyleSheet.create({
    topBar: {
      alignItems: 'center',
      flexDirection: 'row',
      width: '100%',
      paddingHorizontal: hp(30),
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
    centeredSuccessView: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: darkMode ? '#282B33' : '#EEEEFE',
      // opacity: 0.97,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: wp(10),
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
    addCamera: {
      alignItems: 'center',
      flexDirection: 'row',
      width: '100%',
      marginLeft: wp(50),
      //   marginTop: hp(150),
      paddingHorizontal: wp(30),
      paddingBottom: hp(15),
      marginTop: hp(15),
    },
    cameraLabel: {
      fontWeight: '500',
      fontSize: hp(16),
      marginLeft: wp(60),
      fontFamily: 'Poppins-Medium',
      color: darkMode ? COLORS.WHITE : COLORS.BLACK,
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

    plus: {
      // flex: 1,
      display: 'flex',
      shadowColor: '#171717',
      shadowOffset: {width: -1, height: 8},
      shadowOpacity: 0.2,
      shadowRadius: 3,
      height: hp(25),
      marginVertical: hp(13),
      elevation: 2,

      alignItems: 'center',
      justifyContent: 'center',
    },
    indicatorLine: {
      height: 2,
      width: 30,
      backgroundColor: COLORS.THEME_BLUE,
    },
    head: {
      fontSize: hp(17),
      fontWeight: '600',
      fontFamily: 'Poppins-SemiBold',
      marginTop: hp(15),
      color: darkMode ? COLORS.WHITE : COLORS.BLACK,
    },
    headBio: {
      fontSize: hp(17),
      fontWeight: '600',
      fontFamily: 'Poppins-SemiBold',

      color: darkMode ? COLORS.WHITE : COLORS.BLACK,
    },
    headContact: {
      fontSize: hp(17),
      fontWeight: '600',
      fontFamily: 'Poppins-SemiBold',
      marginTop: hp(15),
      color: darkMode ? COLORS.WHITE : COLORS.BLACK,
    },
    socialView: {
      // flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '40%',
      marginTop: hp(15),
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
    contact: {
      marginLeft: wp(20),
      fontFamily: 'Poppins-Regular',
      fontWeight: '400',
      fontSize: hp(17),
      color: darkMode ? COLORS.WHITE : COLORS.BLACK,
    },
    about: {
      fontSize: hp(17),
      fontWeight: '400',
      fontFamily: 'Poppins-Regular',
      color: darkMode ? COLORS.WHITE : COLORS.BLACK,
      marginTop: hp(15),
    },
    shareLabel: {
      color: COLORS.WHITE,
      fontSize: hp(13),
      fontFamily: 'Poppins-Medium',
      fontWeight: '500',
    },
    hiddenLabel: {
      color: darkMode ? COLORS.WHITE : COLORS.BLACK,
      fontSize: hp(13),
      fontFamily: 'Poppins-Medium',
      fontWeight: '500',
      // marginLeft: wp(10),
    },
    addButton: {
      height: hp(110),
      width: hp(110),
      borderRadius: hp(110) / 2,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: hp(20),
    },
    section: {
      alignItems: 'center',
      // marginBottom: Platform.OS === 'ios' ? hp(0) : hp(30),
    },

    shadowStyle: {
      marginBottom: hp(30),
      marginTop: hp(10),
      marginHorizontal: hp(10),
      paddingHorizontal: wp(20),
      borderRadius: 20,
      borderLeftWidth: 1,
      borderColor: 'rgba(0,0,0,0.15)',
      width: '90%',
      paddingTop: hp(25),
      paddingBottom: hp(15),
      backgroundColor: darkMode ? COLORS.BLACK : COLORS.WHITE,
      ...Platform.select({
        ios: {
          shadowColor: 'rgba(0,0,0,0.15)',
          shadowOffset: {width: 3, height: 5},
          shadowOpacity: 1,
        },
        android: {
          elevation: 4,
        },
      }),
    },

    tabTitle: {
      color: darkMode ? COLORS.WHITE : COLORS.BLACK,
      marginVertical: 8,
      fontFamily: 'Poppins-Medium',
      fontSize: hp(16),
      fontWeight: '500',
    },
    tabTitleUnfocus: {
      color: COLORS.THIN_GREY,
      marginVertical: 8,
      fontFamily: 'Poppins-Medium',
      fontSize: hp(16),
      fontWeight: '500',
    },
    buttonText: {
      color: darkMode ? COLORS.WHITE : COLORS.BLACK,
      textAlign: 'center',
      fontSize: hp(14),
      fontFamily: 'Poppins-Medium',
      fontWeight: '500',
    },
    profileImage: {
      height: hp(115),
      width: hp(115),
      borderRadius: hp(115) / 2,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#171717',
      shadowOffset: {width: -1, height: 5},
      shadowOpacity: 0.2,
      elevation: 6,
      shadowRadius: 3,
      backgroundColor: darkMode ? 'transparent' : COLORS.WHITE,
      // marginTop: hp(25),
    },
    imageStyle: {
      height: hp(115),
      width: hp(115),
      borderRadius: hp(115) / 2,
      resizeMode: 'cover',
    },
    editButton: {
      backgroundColor: darkMode ? 'transparent' : COLORS.WHITE,
      // width: COMPONENT_SIZE.SCREEN_WIDTH - 20,
      height: hp(40),
      borderRadius: 10,
      borderColor: COLORS.THEME_BLUE,
      borderWidth: 2,
      marginBottom: hp(5),
      marginTop: hp(20),
    },
    pics: {
      height: hp(35),
      width: hp(35),
      borderRadius: hp(35) / 2,
      alignItems: 'center',
      justifyContent: 'center',
    },
    users: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: wp(80),
      marginTop: hp(15),
    },
    connectionHead: {
      fontFamily: 'Poppins-Medium',
      fontSize: hp(18),
      marginTop: hp(5),
      fontWeight: '500',
      color: darkMode ? COLORS.WHITE : COLORS.BLACK,
    },
    connectionContent: {
      fontFamily: 'Poppins-Light',
      fontWeight: '300',
      color: darkMode ? COLORS.WHITE : COLORS.BLACK,
      fontSize: hp(16),
      marginTop: hp(7),
    },
    place: {
      marginLeft: wp(5),
      fontFamily: 'Poppins-Regular',
      fontWeight: '400',
      fontSize: hp(14),
      color: darkMode ? COLORS.WHITE : COLORS.BLACK,
      marginTop: hp(3),
    },
    location: {
      flexDirection: 'row',
      marginTop: hp(5),
      // alignItems: 'center',
    },

    active: {
      backgroundColor: COLORS.FLURECENT_GREEN,
      height: hp(12),
      width: hp(12),
      borderRadius: hp(12) / 2,
      marginTop: hp(6),
    },
    connectionsView: {
      width: '50%',
      alignItems: 'flex-end',
    },
    heading: {
      flex: 1,
      fontFamily: 'Poppins-Medium',
      fontSize: hp(18),
      fontWeight: '500',
      color: darkMode ? COLORS.WHITE : COLORS.BLACK,
    },
    centerPic: {
      height: hp(40),
      width: hp(40),
      borderRadius: hp(40) / 2,
      alignItems: 'center',
      justifyContent: 'center',
      position: 'absolute',
      right: hp(22),
      borderWidth: 2,
      borderColor: darkMode ? COLORS.BLACK : COLORS.WHITE,
      backgroundColor: darkMode ? COLORS.BLACK : COLORS.WHITE,
    },
    userView: {
      justifyContent: 'space-between',
      flexDirection: 'row',
      width: '100%',
      // height: COMPONENT_SIZE.SCREEN_HEIGHT / 4,
      marginTop: hp(15),
    },
    imageView: {
      width: '50%',
    },
  });
