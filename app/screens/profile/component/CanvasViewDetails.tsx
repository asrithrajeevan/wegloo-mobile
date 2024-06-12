import {useRoute} from '@react-navigation/native';
import React from 'react';
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewProps,
} from 'react-native';
import {StackNavigationProp} from 'react-navigation/native-stack';
import ICChat from '~app/assets/images/chat.svg';
import ICLike from '~app/assets/images/like.svg';
import ICLikeWhite from '~app/assets/images/like_white.svg';
import IcMore from '~app/assets/images/more.svg';
import Label from '~app/components/Label';
import {COLORS, COMPONENT_SIZE, hp, wp} from '~app/constants/styles';
import {InitialStackParamsList} from '~app/navigation/InitialNavigation';
import {appStateSelectors, useAppState} from '~app/state/AppState';

interface ICanvasViewDetailsProps extends ViewProps {
  date: any;
  profileImage: any;
  showEdit: any;
  onPressLike: any;
  like: boolean;
}
const CanvasViewDetails: React.FC<ICanvasViewDetailsProps> = ({
  date,
  profileImage,
  showEdit,
  onPressLike,
  like,
}) => {
  console.log('likeeeeeee', like);
  const route = useRoute<StackNavigationProp<InitialStackParamsList>>();
  const darkMode = useAppState(appStateSelectors.displayMode!);
  const styles = style(darkMode);

  return (
    <>
      <View style={{paddingHorizontal: wp(15), marginTop: hp(20)}}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <View style={styles.post}>
            <View style={{marginTop: hp(10), flexDirection: 'row'}}>
              <Label style={styles.date}>Posted by </Label>
              <Label style={styles.you}>You </Label>
            </View>
            <Image
              resizeMode="cover"
              style={styles.imageProfile}
              source={{uri: profileImage}}></Image>
          </View>

          <View style={styles.more}>
            <Label style={styles.date}>{date}</Label>
            <TouchableOpacity
              onPress={() => {
                showEdit();
              }}>
              <IcMore
                color={darkMode ? COLORS.WHITE : COLORS.BLACK}
                style={{marginLeft: hp(25)}}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={[styles.post]}>
          <Label style={styles.date}>Posted to </Label>
          <Label style={[styles.date, {color: COLORS.NAVY_BLUE}]}>
            My Canvas{' '}
          </Label>
        </View>
        <View style={[styles.post, {marginTop: hp(10)}]}>
          <TouchableOpacity
            style={{
              height: 40,
              width: 40,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={() => {
              onPressLike();
            }}>
            {!like ? (
              <ICLikeWhite color={darkMode ? COLORS.WHITE : COLORS.BLACK} />
            ) : (
              <ICLike />
            )}
          </TouchableOpacity>
          <ICChat
            color={darkMode ? COLORS.WHITE : COLORS.BLACK}
            style={{marginLeft: wp(10)}}
          />
        </View>
        <Label style={[styles.likes]}>19 Likes</Label>
      </View>
      <View style={styles.commentView}>
        <Image style={styles.imageProfile} source={{uri: profileImage}}></Image>
        <View style={{marginRight: wp(20), flex: 1}}>
          <Label style={[styles.date, {marginLeft: wp(10)}]}>
            <Label style={styles.name}>{'@emmasteal'}</Label>
            {' Lorem ipsum dolor sit amet, consectetur adipiscing elit. '}
          </Label>
          <View style={[styles.commentView, {marginTop: hp(5)}]}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <ICLike />
              <Label style={[styles.likes, {marginLeft: wp(10)}]}>
                {'Reply'}
              </Label>
            </View>
            <Label style={[styles.hrs]}>{'6 hr'}</Label>
          </View>
        </View>
      </View>
      <Label style={[styles.comments]}>{'View all 10 comments '}</Label>
    </>
  );
};

export default CanvasViewDetails;
const style = (darkMode: boolean) =>
  StyleSheet.create({
    image: {
      width: COMPONENT_SIZE.SCREEN_WIDTH,
      height: COMPONENT_SIZE.SCREEN_HEIGHT * 0.4,
      marginVertical: hp(10),
    },
    post: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    commentView: {
      flexDirection: 'row',
      //   alignItems: 'center',
      justifyContent: 'space-between',
      paddingLeft: wp(10),
      paddingRight: wp(30),
      marginTop: hp(20),
    },
    imageProfile: {
      height: hp(35),
      width: hp(35),
      borderRadius: hp(17.5),

      marginLeft: wp(5),
      // marginBottom: hp(10),
    },
    date: {
      fontFamily: 'Poppins-Regular',
      fontWeight: '400',
      fontSize: hp(14),
      color: darkMode ? COLORS.WHITE : COLORS.BLACK,
    },
    name: {
      fontFamily: 'Poppins-SemiBold',
      fontWeight: '400',
      fontSize: hp(14),
      color: darkMode ? COLORS.WHITE : COLORS.BLACK,
    },
    likes: {
      fontFamily: 'Poppins-Regular',
      fontWeight: '400',
      fontSize: hp(16),
      color: darkMode ? COLORS.WHITE : COLORS.BLACK,
      marginTop: hp(5),
      marginLeft: wp(5),
    },
    hrs: {
      marginTop: hp(5),
      fontFamily: 'Poppins-Regular',
      fontWeight: '400',
      fontSize: hp(16),
      color: darkMode ? COLORS.WHITE : COLORS.BLACK,
    },
    comments: {
      marginTop: hp(20),
      fontFamily: 'Poppins-Regular',
      fontWeight: '400',
      fontSize: hp(14),
      color: darkMode ? COLORS.WHITE : COLORS.BLACK,
      marginLeft: wp(20),
    },
    you: {
      fontFamily: 'Poppins-Bold',
      fontWeight: '400',
      fontSize: hp(13),
      color: COLORS.NAVY_BLUE,
    },
    more: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },
  });
