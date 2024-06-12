import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {StackNavigationProp} from 'react-navigation/native-stack';
import ICLogo from '~app/assets/images/brandLogo.svg';
import ICLock from '~app/assets/images/lockIcon.svg';
import ICArrow from '~app/assets/images/rightArrow.svg';
import Button from '~app/components/Button';
import Header from '~app/components/Header';
import Label from '~app/components/Label';
import MainCard from '~app/components/MainCard';
import {SCREENS} from '~app/constants/navigation';
import {COLORS, COMPONENT_SIZE, hp, wp} from '~app/constants/styles';
import {InitialStackParamsList} from '~app/navigation/InitialNavigation';
import {appStateSelectors, useAppState} from '~app/state/AppState';
import Joinexperience from './components/JoinExperienceModal';
import Viewexperience from './components/ViewExperienceModal';

const Experience: React.FC = () => {
  const darkMode = useAppState(appStateSelectors.displayMode!);
  const experiences = useAppState(appStateSelectors.experiences!);
  const setExperiences = useAppState(appStateSelectors.setExperiences!);

  const setPhotos = useAppState(appStateSelectors.setPhotos!);
  const isFocused = useIsFocused();
  const navigation =
    useNavigation<StackNavigationProp<InitialStackParamsList>>();
  const styles = style(darkMode);
  const [title, setTitle] = useState(experiences.title);
  const [location, setLocation] = useState(experiences.location);
  const [friends, setFriends] = useState([]);
  const [joinModal, setJoinModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [joinType, setJoinType] = useState(false);
  const [viewType, setViewType] = useState('friends');
  const [loader, setLoader] = useState(false);
  const currentLocation = useAppState(appStateSelectors.currentLocation!);
  const currentUser = useAppState(appStateSelectors.currentUser!);

  const [gallary, setGallary] = useState([]);

  const uid = auth()?.currentUser?.uid;
  useEffect(() => {
    setPhotos([]);
  }, []);
  useEffect(() => {
    setPhotos([]);
    setTitle(experiences.title);
    setLocation(experiences.location ? experiences.location : currentLocation);
    setExperiences({
      ...experiences,
      location: experiences.location ? experiences.location : currentLocation,
    });
    setFriends(experiences.friends);
    setGallary(experiences?.gallary?.length > 0 ? experiences?.gallary : []);
  }, [isFocused]);
  const addMedia = () => {
    return (
      <>
        <FastImage
          resizeMode={FastImage.resizeMode.cover}
          source={{uri: gallary[2]?.path}}
          style={{
            width: 50,
            height: 50,
            top: hp(50),
            position: 'absolute',
            left: COMPONENT_SIZE.SCREEN_WIDTH / 3.2,

            borderRadius: 5,
            backgroundColor: COLORS.GREY,
          }}
        />
        <FastImage
          resizeMode={FastImage.resizeMode.cover}
          source={{uri: gallary[1]?.path}}
          style={{
            width: 50,
            height: 50,
            top: hp(50),
            position: 'absolute',
            left: COMPONENT_SIZE.SCREEN_WIDTH / 3,
            backgroundColor: COLORS.GREY,
            borderRadius: 5,
          }}
        />
        <FastImage
          resizeMode={FastImage.resizeMode.cover}
          source={{uri: gallary[0]?.path}}
          style={{
            width: 55,
            height: 55,
            top: hp(45),
            position: 'absolute',
            backgroundColor: COLORS.GREY,
            left: COMPONENT_SIZE.SCREEN_WIDTH / 2.8,

            borderRadius: 5,
          }}
        />

        {/* <FastImage
          source={{uri: gallary[1]?.path}}
          style={{
            width: 40,
            height: 40,
            top: 20,
            left: COMPONENT_SIZE.SCREEN_WIDTH / 2,
            borderWidth: 2,
            borderColor: Colors.WHITE,
            borderRadius: 10,
          }}
        />
        <FastImage
          source={{uri: gallary[2]?.path}}
          style={{
            width: 40,
            height: 40,
            top: 20,
            left: COMPONENT_SIZE.SCREEN_WIDTH / 2,
            borderWidth: 2,
            borderColor: Colors.WHITE,
            borderRadius: 10,
          }}
        /> */}
      </>
    );
  };
  const topFriendsView = () => {
    console.log('topFriendsView');
    return (
      <>
        {experiences.friends[2]?.profileImage !== '' ? (
          <FastImage
            source={{uri: experiences.friends[2]?.profileImage}}
            style={styles.friends2}
          />
        ) : (
          <Image
            style={styles.friends2}
            source={require('~app/assets/images/userCircle.png')}
          />
        )}
        {experiences.friends[1]?.profileImage !== '' ? (
          <FastImage
            source={{uri: experiences.friends[1]?.profileImage}}
            style={styles.friends1}
          />
        ) : (
          <Image
            style={styles.friends1}
            source={require('~app/assets/images/userCircle.png')}
          />
        )}
        {experiences.friends[0]?.profileImage !== '' ? (
          <FastImage
            source={{uri: experiences.friends[0]?.profileImage}}
            style={styles.friends0}
          />
        ) : (
          <Image
            style={styles.friends0}
            source={require('~app/assets/images/userCircle.png')}
          />
        )}
      </>
    );
  };
  const sendNotification = (item: {
    id: string | undefined;
    profileImage: any;
    username: any;
  }) => {
    let notifications: {
      id: any;
      profileImage: string;
      username: string;
      type: string;
      notificationType: string;
    }[] = [];
    firestore()
      .collection('users')
      .doc(item.id)
      .get()
      .then(documentSnapshot => {
        console.log('User exists: ', documentSnapshot.exists);

        if (documentSnapshot.exists) {
          if (documentSnapshot?.data().hasOwnProperty('notifications')) {
            notifications = documentSnapshot?.data()?.notifications;
          }
          const data = {
            id: uid,
            exerienceId: experiences.id,
            profileImage: currentUser.profileImage
              ? currentUser.profileImage
              : '',
            username: currentUser.username,
            type: 'experience',
            notificationType: 'Join',
            createdTime: moment().format(),
          };
          notifications.push(data);
          firestore()
            .collection('users')
            .doc(item.id)
            .update({
              notifications: notifications,
            })
            .then(() => {
              firestore()
                .collection('experiences')
                .doc(experiences.id)
                .set(experiences)
                .then(() => {
                  setExperiences({});
                  console.log('experience created successful');

                  // setOnboarding(false)
                })
                .catch(e => {
                  console.log('api createUser error', e);
                });
              // console.log('User updated!');
              // setLoader(false);
              // setCanvasImages(canvasImages => [...canvasImages, imagePath]);
              console.log('User updated!');
            });
        }
      });
  };

  const onCreateExperience = React.useCallback(() => {
    {
      let newexperience =
        currentUser?.experiences?.length > 0 ? currentUser?.experiences : [];
      newexperience.push(experiences);

      setLoader(true);
      console.log('onCreateExperience', newexperience);
      firestore()
        .collection('users')
        .doc(uid)
        .update({
          experiences: newexperience,
        })
        .then(() => {
          setLoader(false);
          console.log('experiance added to user');
          experiences?.friends?.map(item => {
            sendNotification(item);
          });
          navigation.navigate(SCREENS.PROFILE_TAB, {
            screen: SCREENS.PROFILE,
          });
          // firestore()
        })
        .catch(error => {
          console.log('errorrrrrr', error);
        });
    }
  }, [experiences]);
  return (
    <>
      <MainCard>
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          <Header
            goBack={() => {
              navigation.goBack();
            }}
            onPressNext={() => {
              navigation.goBack();
            }}
            rightTitle={'Cancel'}
            title="Create Experience"></Header>
          <View style={{paddingHorizontal: wp(30), marginTop: hp(30)}}>
            <Label style={styles.heading}>Experience Title</Label>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate(SCREENS.EDIT_TITLE);
              }}>
              <Label style={styles.input}>
                {title ? title : 'Type title...'}
              </Label>
            </TouchableOpacity>
            <View
              style={{
                backgroundColor: COLORS.BLACK,
                height: 1,
                width: '100%',
                marginTop: hp(10),
              }}
            />
          </View>
          <View
            style={{
              backgroundColor: COLORS.GREY,
              height: 1,
              width: '100%',
              marginTop: hp(20),
            }}
          />
          <TouchableOpacity
            onPress={() => {
              navigation.navigate(SCREENS.EDIT_LOCATION);
            }}
            style={{paddingHorizontal: wp(30), marginTop: hp(30)}}>
            <Label style={styles.heading}>Location</Label>
            <Label style={styles.input}>
              {location ? location : 'Type title...'}
            </Label>

            <View
              style={{
                backgroundColor: COLORS.BLACK,
                height: 1,
                width: '100%',
                marginTop: hp(10),
              }}
            />
          </TouchableOpacity>
          <View
            style={{
              backgroundColor: COLORS.GREY,
              height: 1,
              width: '100%',
              marginTop: hp(20),
            }}
          />
          <TouchableOpacity
            style={[styles.people]}
            onPress={() => {
              navigation.navigate(SCREENS.ADD_USERS);
            }}>
            <Label style={[styles.heading, {flex: 1}]}>People</Label>
            <ICArrow />
            <View></View>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.people]}
            onPress={() => {
              navigation.navigate(SCREENS.ADD_USERS);
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '60%',
              }}>
              {experiences?.friends?.length > 0 && topFriendsView()}
              {experiences?.friends?.length > 0 ? (
                <Label style={[styles.heading, {marginLeft: wp(10)}]}>
                  {' + Add More '}
                </Label>
              ) : (
                <Label style={[styles.heading]}>{'+ Add Friends'}</Label>
              )}
            </View>
          </TouchableOpacity>
          <View
            style={{
              backgroundColor: COLORS.GREY,
              height: 1,
              width: '100%',
              marginTop: hp(20),
            }}
          />
          <TouchableOpacity
            onPress={() => {
              navigation.navigate(SCREENS.ADD_GALLARY);
            }}
            style={[styles.people]}>
            <View>
              <Label style={styles.heading}>Gallery</Label>
              <Label
                style={[
                  styles.heading,
                  {
                    fontSize: hp(10),
                    fontFamily: 'Poppins-Regular',
                    color: COLORS.THIN_GREY,
                  },
                ]}>
                Add media now or later!
              </Label>
              {experiences?.gallary && addMedia()}
            </View>
            <ICArrow />
          </TouchableOpacity>
          <View
            style={{
              backgroundColor: COLORS.GREY,
              height: 1,
              width: '100%',
              marginTop: gallary?.length > 0 ? hp(70) : hp(20),
            }}
          />
          <Label
            style={[styles.heading, {marginLeft: wp(30), marginTop: hp(30)}]}>
            Privacy
          </Label>
          <View style={styles.privacyView}>
            <TouchableOpacity
              onPress={() => {
                setJoinModal(true);
              }}
              style={{
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Label style={styles.privacy}>Who can join?</Label>
              <ICLock height={45} width={45} style={{marginTop: hp(10)}} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setViewModal(true);
              }}
              style={{
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Label style={styles.privacy}>Who can view?</Label>
              <ICLogo height={55} width={55} style={{marginTop: hp(10)}} />
            </TouchableOpacity>
          </View>
          <View style={{paddingHorizontal: wp(20), paddingBottom: hp(30)}}>
            {experiences?.title &&
              experiences?.location &&
              experiences?.friends?.length > 0 &&
              experiences?.gallary?.length > 0 && (
                <Button
                  label="Create Experience"
                  labelStyle={styles.create}
                  style={{borderRadius: 5, width: '100%', marginTop: hp(30)}}
                  onPress={() => {
                    onCreateExperience();
                  }}
                />
              )}
          </View>

          {loader && (
            <View style={styles.loaderView}>
              <ActivityIndicator
                size={'large'}
                animating
                color={darkMode ? COLORS.WHITE : COLORS.GREY}
              />
            </View>
          )}
        </KeyboardAwareScrollView>
        {joinModal && (
          <View style={styles.centeredView}>
            <Joinexperience
              selectJoinType={type => {
                setJoinType(type);
                setExperiences({...experiences, joinType: type});
              }}
              closeModal={() => setJoinModal(false)}
              onPressBack={() => {
                navigation.goBack();
              }}
            />
          </View>
        )}
        {viewModal && (
          <View style={styles.centeredView}>
            <Viewexperience
              selectViewType={type => {
                setViewType(type);
                setExperiences({...experiences, viewType: type});
              }}
              closeModal={() => setViewModal(false)}
              onPressBack={() => {
                navigation.goBack();
              }}
            />
          </View>
        )}
      </MainCard>
    </>
  );
};

export default Experience;
const style = (darkMode: boolean) =>
  StyleSheet.create({
    centeredView: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'transparent',
      alignItems: 'center',
      justifyContent: 'flex-end',
      paddingHorizontal: wp(10),
    },
    innerView: {
      backgroundColor: COLORS.WHITE,
      height: COMPONENT_SIZE.SCREEN_HEIGHT / 3,
      width: '100%',
      borderRadius: 10,
    },
    friends2: {
      width: 35,
      height: 35,
      backgroundColor: COLORS.GREY,
      left: 45,
      borderWidth: 2,
      borderColor: 'white',
      borderRadius: 17.5,
    },
    friends1: {
      width: 35,
      height: 35,
      backgroundColor: COLORS.GREY,
      position: 'absolute',
      left: 30,

      borderWidth: 2,
      borderColor: 'white',
      borderRadius: 17.5,
    },
    friends0: {
      width: 35,
      height: 35,

      position: 'absolute',
      left: 15,

      borderWidth: 2,
      borderColor: 'white',
      borderRadius: 17.5,
    },
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
    create: {
      fontSize: hp(18),
      fontFamily: 'Poppins-Semibold',
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
    privacy: {
      textDecorationLine: 'underline',
      fontSize: hp(16),
      color: COLORS.BLACK,
      fontFamily: 'Poppins-Medium',
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
      fontWeight: '500',
    },
    input: {
      fontSize: hp(16),
      fontFamily: 'Poppins-Regular',
      fontWeight: '400',
      width: '100%',
      marginTop: hp(20),
      color: darkMode ? COLORS.WHITE : COLORS.BLACK,
    },
  });
