import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {
  Image,
  LayoutAnimation,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View,
  ViewProps,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import ICChat from '~app/assets/images/chat.svg';
import ICDownArrow from '~app/assets/images/downArrow.svg';
import ICGallary from '~app/assets/images/gallary.svg';
import ICLike from '~app/assets/images/like_white.svg';
import ICMap from '~app/assets/images/map.svg';
import ICMore from '~app/assets/images/more.svg';
import ICUpArrow from '~app/assets/images/upArrow.svg';
import {COLORS, hp, wp} from '~app/constants/styles';
import {appStateSelectors, useAppState} from '~app/state/AppState';
import Label from '../Label';

interface IAccordianProps extends ViewProps {
  title: string;
  users: any;
  location: string;
  item: object;
}
const Accodian: React.FC<IAccordianProps> = ({
  title,
  users,
  location,
  item,
}) => {
  const [expanded, setExpanded] = useState(false);
  const darkMode = useAppState(appStateSelectors.displayMode!);
  const currentUser = useAppState(appStateSelectors.currentUser!);

  const styles = style(darkMode);
  useEffect(() => {
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }, []);
  //     if (Platform.OS === 'android') {
  //       UIManager.setLayoutAnimationEnabledExperimental(true);
  //     }
  //   }
  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };
  return (
    <>
      <View style={styles.itemContainer}>
        <TouchableOpacity
          activeOpacity={1}
          //ref={accordian}
          style={[
            styles.row,
            expanded ? styles.bgColorWhite : styles.bgColorGray,
            expanded ? styles.radius0 : styles.radius1,
            styles.shadowStyle,
          ]}
          onPress={() => toggleExpand()}>
          <View style={styles.subContainer}>
            <Label style={styles.title}>{title}</Label>
            {!expanded && (
              <Label style={styles.date}>
                {' '}
                {moment(item.createdDate).format('MMM DD')}
              </Label>
            )}

            <ICMore color={darkMode ? COLORS.WHITE : COLORS.BLACK} />
          </View>

          <View style={{flexDirection: 'row'}}>
            <Text style={{color: darkMode ? COLORS.WHITE : COLORS.BLACK}}>
              {'\u2022'}
            </Text>
            <Label style={styles.friends}>
              {users?.length === 1
                ? `You & ${users?.[0].firstName}`
                : `You , ${users?.[0].firstName}, ${users?.[1].firstName} & others`}
            </Label>
          </View>
          <View
            style={{
              flex: 1,

              alignItems: 'flex-start',
              width: '100%',
              flexDirection: 'row',
            }}>
            {users?.length === 1 &&
              (users?.[0].profileImage ? (
                <FastImage
                  source={{uri: users?.[0].profileImage}}
                  style={styles.userPic}></FastImage>
              ) : (
                <Image
                  style={styles.userPic}
                  source={require('~app/assets/images/userCircle.png')}
                />
              ))}
            {users?.length === 1 &&
              (currentUser.profileImage ? (
                <FastImage
                  source={{uri: currentUser.profileImage}}
                  style={styles.patnerPic}></FastImage>
              ) : (
                <Image
                  style={styles.patnerPic}
                  source={require('~app/assets/images/userCircle.png')}
                />
              ))}
            {users?.length > 1 &&
              (currentUser?.profileImage ? (
                <FastImage
                  source={{uri: currentUser?.profileImage}}
                  style={styles.usersPic}></FastImage>
              ) : (
                <Image
                  style={styles.usersPic}
                  source={require('~app/assets/images/userCircle.png')}
                />
              ))}
            {users?.length > 1 && (
              <View style={styles.users}>
                {users.length > 2 &&
                  (users[2]?.profileImage ? (
                    <FastImage
                      source={{uri: users[2].profileImage}}
                      style={styles.pics2}></FastImage>
                  ) : (
                    <Image
                      style={styles.pics2}
                      source={require('~app/assets/images/userCircle.png')}
                    />
                  ))}
                {users[1].profileImage ? (
                  <FastImage
                    source={{uri: users[1].profileImage}}
                    style={styles.pics}></FastImage>
                ) : (
                  <Image
                    style={styles.pics}
                    source={require('~app/assets/images/userCircle.png')}
                  />
                )}

                {users[0]?.profileImage ? (
                  <FastImage
                    source={{uri: users[0]?.profileImage}}
                    style={styles.centerPic}></FastImage>
                ) : (
                  <Image
                    style={styles.centerPic}
                    source={require('~app/assets/images/userCircle.png')}
                  />
                )}

                {users.length > 3 && (
                  <Label style={styles.number}>{+`${users.length - 3}`}</Label>
                )}
              </View>
            )}
          </View>
          {!expanded && (
            <ICDownArrow color={darkMode ? COLORS.WHITE : COLORS.BLACK} />
          )}
        </TouchableOpacity>
        {expanded && (
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
              toggleExpand();
            }}
            style={[
              styles.child,
              expanded ? styles.bgColorWhite : styles.bgColorGray,
              styles.shadowStyle,
            ]}>
            <View
              style={{
                flexDirection: 'row',
                flex: 1,
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '90%',
                marginTop: hp(10),
              }}>
              <View style={{flex: 1, flexDirection: 'row'}}>
                <ICMap
                  color={darkMode ? COLORS.WHITE : COLORS.BLACK}
                  style={{marginTop: hp(5)}}
                />
                <Label style={styles.location}>{location}</Label>
              </View>
              <Label style={styles.expandedDate}>
                {moment(item.createdDate).format('MMM DD')}
              </Label>
            </View>
            <View style={styles.icons}>
              <ICLike color={darkMode ? COLORS.WHITE : COLORS.BLACK} />
              <ICChat color={darkMode ? COLORS.WHITE : COLORS.BLACK} />
              <ICGallary />
            </View>
            <View style={{flexDirection: 'row', flex: 1}}>
              <Label style={styles.likes}>{`${item?.likesCount} Likes`}</Label>
              <Label
                style={
                  styles.comments
                }>{`${item.comments?.length} comments`}</Label>
            </View>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: hp(10),
              }}>
              <ICUpArrow color={darkMode ? COLORS.WHITE : COLORS.BLACK} />
            </View>
          </TouchableOpacity>
        )}
      </View>
    </>
  );
};
const style = (darkMode: boolean) =>
  StyleSheet.create({
    itemContainer: {
      marginTop: hp(5),
      marginHorizontal: wp(5),
    },

    row: {
      height: hp(150),
      paddingHorizontal: wp(25),
      alignItems: 'center',
      marginTop: hp(20),
      paddingBottom: hp(10),
    },
    rowOpen: {
      flexDirection: 'row',

      height: hp(150),
      paddingHorizontal: wp(5),
      alignItems: 'center',
    },
    friends: {
      fontSize: hp(12),
      fontFamily: 'Poppins-Regular',
      fontWeight: '400',
      marginLeft: wp(10),
      flex: 1,
      color: darkMode ? COLORS.WHITE : COLORS.BLACK,
    },
    date: {
      fontSize: hp(12),
      fontFamily: 'Poppins-Regular',
      fontWeight: '400',
      color: darkMode ? COLORS.WHITE : COLORS.BLACK,
    },
    expandedDate: {
      fontSize: hp(12),
      fontFamily: 'Poppins-Regular',
      fontWeight: '400',
      color: darkMode ? COLORS.WHITE : COLORS.THIN_GREY,
      marginLeft: wp(20),
      // marginLeft: wp(20),
    },
    number: {
      fontSize: hp(13),
      fontFamily: 'Poppins-Regular',
      fontWeight: '400',
      marginTop: hp(10),
      marginLeft: wp(20),
      width: '100%',
      color: darkMode ? COLORS.WHITE : COLORS.BLACK,
    },
    icons: {
      flexDirection: 'row',
      flex: 1,
      width: '25%',
      justifyContent: 'space-between',
      marginTop: hp(15),
    },
    location: {
      fontSize: hp(14),
      fontFamily: 'Poppins-Regular',
      fontWeight: '400',
      marginLeft: wp(10),
      color: darkMode ? COLORS.WHITE : COLORS.BLACK,
      // width: '100%',
    },
    comments: {
      fontSize: hp(14),
      fontFamily: 'Poppins-Regular',
      fontWeight: '400',
      marginTop: hp(15),
      marginLeft: wp(30),
      color: darkMode ? COLORS.WHITE : COLORS.BLACK,
    },
    likes: {
      marginTop: hp(15),
      fontSize: hp(14),
      color: darkMode ? COLORS.WHITE : COLORS.BLACK,
      fontFamily: 'Poppins-Regular',
      fontWeight: '400',
    },
    centerPic: {
      height: hp(37),
      width: hp(37),
      borderRadius: hp(37) / 2,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'white',
      position: 'absolute',
      left: hp(5),
      borderWidth: 2,
      borderColor: darkMode ? COLORS.BLACK : COLORS.WHITE,
    },
    pics: {
      height: hp(37),
      width: hp(37),
      borderRadius: hp(37) / 2,
      position: 'absolute',
      right: hp(17),
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'white',
      borderWidth: 2,
      borderColor: darkMode ? COLORS.BLACK : COLORS.WHITE,
    },
    pics2: {
      height: hp(37),
      width: hp(37),
      borderRadius: hp(37) / 2,
      alignItems: 'center',
      justifyContent: 'center',

      marginLeft: wp(45),
      borderWidth: 2,
      borderColor: darkMode ? COLORS.BLACK : COLORS.WHITE,
    },
    userPic: {
      height: hp(36),
      width: hp(36),
      borderRadius: hp(36) / 2,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'white',
      marginTop: hp(13),
      position: 'absolute',
      left: hp(28),
      borderWidth: 2,
      borderColor: darkMode ? COLORS.BLACK : COLORS.WHITE,
    },
    usersPic: {
      height: hp(37),
      width: hp(37),
      borderRadius: hp(37) / 2,
      alignItems: 'center',
      justifyContent: 'center',

      marginTop: hp(15),
      borderWidth: 2,
      borderColor: darkMode ? COLORS.BLACK : COLORS.WHITE,
    },
    patnerPic: {
      height: hp(37),
      width: hp(37),
      borderRadius: hp(37) / 2,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: darkMode ? COLORS.BLACK : COLORS.WHITE,

      marginTop: hp(15),
    },
    users: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: wp(80),
      marginTop: hp(15),

      marginLeft: hp(15),
    },

    shadowStyle: {
      ...Platform.select({
        ios: {
          shadowColor: 'rgba(0,0,0,0.15)',
          shadowOffset: {width: 5, height: 8},
          shadowOpacity: 0.7,
        },
        android: {
          elevation: 2,
        },
      }),
    },

    radius1: {
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
      borderBottomLeftRadius: 10,
      borderBottomRightRadius: 10,
    },

    subContainer: {
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'space-between',
      // flex: 1,
      alignItems: 'center',

      height: hp(50),
    },
    radius0: {
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
    },

    title: {
      fontSize: hp(16),
      fontFamily: 'Poppins-SemiBold',
      fontWeight: '600',
      color: darkMode ? COLORS.WHITE : COLORS.BLACK,
      width: '70%',
    },

    iconStyle: {resizeMode: 'contain', height: 15, width: 15},

    child: {
      paddingHorizontal: wp(20),
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20,
      paddingBottom: hp(15),
      marginBottom: hp(5),
    },

    bgColorWhite: {
      backgroundColor: darkMode ? COLORS.BLACK : COLORS.WHITE,
    },

    bgColorGray: {
      backgroundColor: darkMode ? COLORS.BLACK : COLORS.WHITE,
    },

    description: {
      fontSize: hp(18),
      color: darkMode ? COLORS.WHITE : COLORS.BLACK,
      textAlign: 'left',
      lineHeight: 18,
    },
  });

export default Accodian;
