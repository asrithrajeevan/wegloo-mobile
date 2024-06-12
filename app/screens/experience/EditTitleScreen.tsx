import auth from '@react-native-firebase/auth';
import {useNavigation} from '@react-navigation/native';
import moment from 'moment';
import React, {useState} from 'react';
import {Platform, StyleSheet, TextInput, View} from 'react-native';
import uuid from 'react-native-uuid';
import {StackNavigationProp} from 'react-navigation/native-stack';
import Button from '~app/components/Button';
import Header from '~app/components/Header';
import Label from '~app/components/Label';
import MainCard from '~app/components/MainCard';
import {COLORS, hp, wp} from '~app/constants/styles';
import {InitialStackParamsList} from '~app/navigation/InitialNavigation';
import {appStateSelectors, useAppState} from '~app/state/AppState';

const EditTitleScreen: React.FC = () => {
  const darkMode = useAppState(appStateSelectors.displayMode!);
  const setExperiences = useAppState(appStateSelectors.setExperiences!);
  const experiences = useAppState(appStateSelectors.experiences!);
  const uid = auth()?.currentUser?.uid;
  const navigation =
    useNavigation<StackNavigationProp<InitialStackParamsList>>();
  const styles = style(darkMode);
  const [experience, setexperience] = useState('');

  return (
    <>
      <MainCard>
        <View
          style={{
            flex: 1,
          }}>
          <Header
            iconStyle={{marginLeft: wp(15)}}
            goBack={() => {
              navigation.goBack();
            }}
            onPressNext={() => {}}
            rightTitle={''}
            title="Memory Title"></Header>
          <View style={{paddingHorizontal: wp(30), marginTop: hp(30)}}>
            <Label style={styles.heading}>Title</Label>
            <TextInput
              style={styles.input}
              onChangeText={text => setexperience(text)}
              value={experience}
              placeholder=""
              placeholderTextColor={COLORS.BLACK}
            />
            <View
              style={{
                backgroundColor: COLORS.BLACK,
                height: 1,
                width: '100%',
              }}
            />
          </View>
        </View>
        {experience.trim() !== '' && (
          <View style={{paddingHorizontal: wp(30), paddingBottom: hp(30)}}>
            <Button
              label="Next"
              style={{borderRadius: 5, width: '100%'}}
              onPress={() => {
                setExperiences({
                  ...experiences,
                  title: experience,
                  createdDate: moment().format(),
                  createdBy: uid,
                  likesCount: 0,
                  like: false,
                  comments: [],
                  hide: false,
                  share: false,
                  acceptedBy: [],
                  id: uuid.v4(),
                });
                navigation.goBack();
              }}
            />
          </View>
        )}
      </MainCard>
    </>
  );
};

export default EditTitleScreen;
const style = (darkMode: boolean) =>
  StyleSheet.create({
    topBar: {
      alignItems: 'center',
      flexDirection: 'row',
      width: '100%',
      paddingLeft: hp(20),
      marginTop: hp(20),
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
      fontFamily: 'Poppins-Regular',
      color: COLORS.BLACK,
    },
    input: {
      fontSize: hp(16),
      fontFamily: 'Poppins-Regular',
      fontWeight: '500',
      width: '100%',
      marginTop: Platform.OS === 'ios' ? hp(30) : hp(10),
      paddingBottom: hp(10),
      color: darkMode ? COLORS.WHITE : COLORS.BLACK,
    },
  });
