import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import moment from 'moment';
import React, {useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import IcAdd from '~app/assets/images/addIcon.svg';
import IcAddWhite from '~app/assets/images/addIconWhite.svg';
import ICLogo from '~app/assets/images/brandLogo.svg';
import IcSent from '~app/assets/images/sent.svg';
import IcUser from '~app/assets/images/userCircle.svg';
import Button from '~app/components/Button';
import Label from '~app/components/Label';
import MainCard from '~app/components/MainCard';
import {COLORS, hp, wp} from '~app/constants/styles';
import {appStateSelectors, useAppState} from '~app/state/AppState';

const Notifications: React.FC = () => {
  const uid = auth()?.currentUser?.uid;
  const currentUser = useAppState(appStateSelectors.currentUser!);
  const darkMode = useAppState(appStateSelectors.displayMode!);
  const [loader, setLoader] = useState(false);

  const styles = style(darkMode);
  const renderItem = ({item, index}) => {
    var now = moment(new Date()); //todays date
    var end = item.createdTime; // another date
    var duration = moment.duration(now.diff(end));
    var time = duration.asMinutes();
    var minutes = time >= 1 ? `     ${time.toFixed(0)} min` : '';
    return (
      <View style={styles.container}>
        <View style={{flexDirection: 'row', width: '80%'}}>
          {item.profileImage ? (
            <Image
              style={[styles.image]}
              source={{uri: item.profileImage}}
              resizeMode={'cover'}
            />
          ) : (
            <IcUser height={45} width={45} />
          )}
          {/* <View style={{alignItems: 'center', flexDirection: 'row', width: 150}}> */}
          <Text
            style={[
              styles.text,
              {
                fontFamily: 'Poppins-Bold',
                flex: 1,
                textAlign: 'left',
                marginLeft: wp(30),
              },
            ]}>
            {item.username}{' '}
            <Text style={[styles.text, {fontWeight: '300'}]}>
              {item.type === 'connection'
                ? ' requested to connect'
                : ` invited you to join their experience. ${minutes}`}
            </Text>
          </Text>
        </View>
        {/* </View> */}
        <Button
          label={item.type === 'experience' ? 'Join' : 'Accept'}
          onPress={() => {
            {
              item.type === 'experience'
                ? onPressJoin(item, index)
                : onPressAccept(item, index);
            }
          }}
          labelStyle={styles.accept}
          style={styles.button}></Button>
      </View>
    );
  };

  const onPressAccept = (
    item: {id: string | undefined} | undefined,
    currentIndex: any,
  ) => {
    setLoader(true);
    let index = -1;
    const uid = auth()?.currentUser?.uid;
    let connections: {}[] = [];
    firestore()
      .collection('users')
      .doc(item?.id)
      .get()
      .then(documentSnapshot => {
        console.log('User exists: ', documentSnapshot.exists);

        if (documentSnapshot.exists) {
          if (documentSnapshot?.data().hasOwnProperty('connections')) {
            connections = documentSnapshot?.data()?.connections;
            index = documentSnapshot
              ?.data()
              ?.connections.findIndex((data: {id: any}) => {
                return data.id === currentUser.id;
              });
          }

          const newData = {
            id: uid,
            type: 'Connected',
          };

          connections.splice(index, 1, newData);
          // notifications.push(data);
          firestore()
            .collection('users')
            .doc(item.id)
            .update({
              connections: connections,
            })
            .then(() => {
              // setLoader(false);
              // setCanvasImages(canvasImages => [...canvasImages, imagePath]);
              console.log('User updated!');
              currentUser.notifications.splice(currentIndex, 1);
              // if (currentUser.hasOwnProperty('connections')) {
              //   connections = currentUser.connections;
              // }
              // connections.push(newData);
              firestore()
                .collection('users')
                .doc(uid)
                .update({
                  notifications: currentUser.notifications,
                })
                .then(() => {
                  setLoader(false);

                  // setLoader(false);
                  // setCanvasImages(canvasImages => [...canvasImages, imagePath]);
                  console.log('User updated!');
                })
                .catch(e => {
                  // setUploading(false);
                  console.log('api createUser error', e);
                });
            })
            .catch(e => {
              // setUploading(false);
              console.log('api createUser error', e);
            });
        }
      });
  };

  const onPressJoin = (
    item: {id: string | undefined} | undefined,
    currentIndex: any,
  ) => {
    setLoader(true);

    let index = -1;
    const uid = auth()?.currentUser?.uid;
    let experiences: {}[] = [];
    firestore()
      .collection('experiences')
      .doc(item?.exerienceId)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot?.exists) {
          let selectedExperience =
            documentSnapshot?.data().acceptedBy?.length > 0
              ? documentSnapshot?.data().acceptedBy
              : [];
          selectedExperience.push(uid);
          firestore()
            .collection('experiences')
            .doc(item.exerienceId)
            .update({acceptedBy: selectedExperience})
            .then(() => {
              setLoader(false);
            });
        }
      });

    firestore()
      .collection('users')
      .doc(item?.id)
      .get()
      .then(documentSnapshot => {
        console.log('User exists: ', documentSnapshot.exists);

        if (documentSnapshot.exists) {
          if (documentSnapshot?.data().hasOwnProperty('experiences')) {
            experiences = documentSnapshot?.data()?.experiences;
            index = documentSnapshot
              ?.data()
              ?.experiences.findIndex((data: {id: any}) => {
                return data.id === item.exerienceId;
              });
          }
          let addExperianceId = experiences[index].acceptedBy.slice(0);
          addExperianceId.push(uid);
          const newData = {
            ...experiences[index],
            acceptedBy: addExperianceId,
          };
          experiences.splice(index, 1, newData);
          // notifications.push(data);
          firestore()
            .collection('users')
            .doc(item.id)
            .update({
              experiences: experiences,
            })
            .then(() => {
              currentUser.notifications.splice(currentIndex, 1);
              firestore()
                .collection('users')
                .doc(uid)
                .update({
                  notifications: currentUser.notifications,
                })
                .then(() => {
                  console.log('User updated NOTIFICATION!');
                  setLoader(false);
                })
                .catch(e => {
                  // setUploading(false);
                  console.log('api createUser error', e);
                  setLoader(false);
                });
            })
            .catch(e => {
              // setUploading(false);
              console.log('api createUser error', e);
            });
        }
      });
  };
  return (
    <>
      <MainCard>
        <View style={styles.topBar}>
          <ICLogo />
          <View style={styles.innerView}>
            {darkMode ? <IcAddWhite /> : <IcAdd />}
            <IcSent
              color={darkMode ? COLORS.WHITE : COLORS.BLACK}
              style={{marginHorizontal: hp(15)}}
            />
          </View>
        </View>
        <View
          style={{
            paddingHorizontal: wp(20),
            marginTop: hp(40),
            marginLeft: wp(10),
          }}>
          <Label style={styles.discover}>Notifications</Label>
        </View>
        <View style={styles.line} />
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
          }}>
          <FlatList
            data={currentUser.notifications}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            extraData={currentUser.notifications}
          />
        </View>
        {loader && (
          <View style={styles.loaderView}>
            <ActivityIndicator
              size={'large'}
              animating
              color={darkMode ? COLORS.WHITE : COLORS.GREY}
            />
            {/* <Image
              source={require('~app/assets/images/spinnerr.gif')}
              style={{height: hp(50), width: hp(50)}}
            /> */}
          </View>
        )}
      </MainCard>
    </>
  );
};

export default Notifications;
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
    discover: {
      fontSize: hp(21),
      fontWeight: '700',
      fontFamily: 'Poppins-Medium',
      color: COLORS.BLACK,
    },
    line: {
      backgroundColor: COLORS.BLACK,
      height: 0.5,
      width: wp(120),
      marginLeft: wp(30),
    },
    innerView: {
      flex: 1,
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'flex-end',
    },
    accept: {
      fontFamily: 'Poppins-Medium',
      color: COLORS.WHITE,
      fontSize: hp(16),
      fontWeight: '500',
    },
    text: {
      fontFamily: 'Poppins-Regular',
      color: COLORS.BLACK,
      fontSize: hp(16),
      textAlign: 'center',
    },
    button: {
      backgroundColor: COLORS.NAVY_BLUE,
      width: 70,
      height: 30,
      borderRadius: 0,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 0,
    },
    image: {
      height: 40,
      width: 40,

      borderRadius: 20,
    },
    container: {
      alignItems: 'center',
      // justifyContent: 'space-between',
      flexDirection: 'row',
      marginTop: hp(30),
      marginHorizontal: wp(30),
      width: '80%',
    },
  });
