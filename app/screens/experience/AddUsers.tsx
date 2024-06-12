import firestore from '@react-native-firebase/firestore';
import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {StackNavigationProp} from 'react-navigation/native-stack';
import ICLogo from '~app/assets/images/brandLogo.svg';
import IcCircle from '~app/assets/images/circleBlack.svg';
import IcRoundCircle from '~app/assets/images/roundCircle.svg';
import IcSearch from '~app/assets/images/search.svg';
import IcUser from '~app/assets/images/userCircle.svg';
import Button from '~app/components/Button';
import Header from '~app/components/Header';
import Label from '~app/components/Label';
import MainCard from '~app/components/MainCard';
import {COLORS, COMPONENT_SIZE, hp, wp} from '~app/constants/styles';
import {InitialStackParamsList} from '~app/navigation/InitialNavigation';
import {appStateSelectors, useAppState} from '~app/state/AppState';

const AddUsers: React.FC = () => {
  const darkMode = useAppState(appStateSelectors.displayMode!);
  const currentUser = useAppState(appStateSelectors.currentUser!);
  const setExperiences = useAppState(appStateSelectors.setExperiences!);
  const experiences = useAppState(appStateSelectors.experiences!);
  let connections: object[] = [];
  let selectedArray: object[] = [];
  console.log('selectedarrayyyyy', selectedArray);
  const navigation =
    useNavigation<StackNavigationProp<InitialStackParamsList>>();
  const styles = style(darkMode);
  const [search, setSearch] = useState('');

  const [connectUsers, setConnectUsers] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

  useEffect(() => {
    if (currentUser?.connections?.length > 0) {
      currentUser?.connections?.map((data: {id: string | undefined}) => {
        if (data.type === 'Connected') {
          firestore()
            .collection('users')
            .doc(data.id)
            .onSnapshot(documentSnapshot => {
              const item = documentSnapshot?.data();

              const newData = {
                id: data.id,
                username: item?.username,
                profileImage: item?.profileImage ? item?.profileImage : '',
                firstName: item?.firstName,
                lastName: item?.lastName,
                selected: false,
              };
              connections.push(newData);
              setConnectUsers(connections);
              setUsers(connections);
              //   console.log('djdjdjdjd', connections);
              // console.log('User exists: ', documentSnapshot.exists);
            });
        }
        // console.log('djdjdjdjd', connections);
      });
    }
    // setConnectUsers(connections);
  }, []);
  const onPressItem = React.useCallback(
    (item: number, index: number) => {
      connectUsers.splice(index, 1);

      setSelectedUsers([...selectedUsers, item]);
    },

    [selectedUsers, connectUsers],
  );

  const onRemoveItem = React.useCallback(
    (item: number, index: number) => {
      //   selectedArray.push(item);
      //   console.log('selectedUsers', selectedArray);
      //   let filteredName = users.filter(data => {
      //     return item.firstName !== data.firstName;
      //   });
      //   console.log('filteredname', filteredName);
      //   setConnectUsers(filteredName);
      selectedUsers.splice(index, 1);

      setConnectUsers([...connectUsers, item]);
    },
    [selectedUsers, connectUsers],
  );
  const renderSelectedItem = ({item, index}: {item: any; index: number}) => (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        paddingVertical: hp(10),
        alignItems: 'center',
        paddingHorizontal: wp(25),
      }}
      onPress={() => onRemoveItem(item, index)}>
      {item.profileImage ? (
        <FastImage
          source={{
            uri: item?.profileImage,
            priority: FastImage.priority.normal,
          }}
          style={{
            height: 50,
            width: 50,

            margin: 5,
            borderRadius: 25,
          }}
          resizeMode={FastImage.resizeMode.cover}
        />
      ) : (
        <IcUser height={hp(70)} width={hp(70)} />
      )}
      <View style={{marginLeft: wp(15), flex: 1}}>
        <Label
          style={[
            styles.username,
            {fontFamily: 'Poppins-Medium', fontWeight: '500'},
          ]}>
          {item.username}
        </Label>
        <Text style={[styles.username, {fontWeight: '300'}]}>
          {' '}
          {item.firstName}{' '}
          <Text style={[styles.username, {fontWeight: '300'}]}>
            {item.lastName}
          </Text>
        </Text>
      </View>

      <IcRoundCircle />
    </TouchableOpacity>
  );
  const renderItem = ({item, index}: {item: any; index: number}) => (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        paddingVertical: hp(10),
        alignItems: 'center',
        paddingHorizontal: wp(25),
      }}
      onPress={() => onPressItem(item, index)}>
      {item?.profileImage ? (
        <FastImage
          source={{
            uri: item?.profileImage,
            priority: FastImage.priority.normal,
          }}
          style={{
            height: 50,
            width: 50,

            margin: 5,
            borderRadius: 25,
          }}
          resizeMode={FastImage.resizeMode.cover}
        />
      ) : (
        <IcUser height={hp(70)} width={hp(70)} />
      )}
      <View style={{marginLeft: wp(15), flex: 1}}>
        <Label
          style={[
            styles.username,
            {fontFamily: 'Poppins-Medium', fontWeight: '500'},
          ]}>
          {item.username}
        </Label>
        <Text style={[styles.username, {fontWeight: '300'}]}>
          {' '}
          {item.firstName}{' '}
          <Text style={[styles.username, {fontWeight: '300'}]}>
            {item.lastName}
          </Text>
        </Text>
      </View>
      <IcCircle />
    </TouchableOpacity>
  );

  const onSearch = (text: string) => {
    console.log('userssss', users);
    if (users.length > 0) {
      let filteredName = users.filter(item => {
        return item?.firstName?.toLowerCase().includes(text?.toLowerCase());
      });
      setConnectUsers(filteredName);
      console.log('seleeeee', selectedUsers);
      // if (selectedUsers?.length > 0 && text === '') {
      //   const myArrayFiltered = filteredName.filter(el => {
      //     return selectedUsers.some(f => {
      //       return f.firstName !== el.firstName;
      //     });
      //   });
      //   setConnectUsers(myArrayFiltered);
      // }
      // else {
      //   setConnectUsers(filteredName);
      // }
    }
    setSearch(text);
  };
  console.log('connectUsers123', connectUsers, selectedUsers);
  return (
    <>
      <MainCard>
        <View
          style={
            {
              // flex: 1,
            }
          }>
          <Header
            goBack={() => {
              navigation.goBack();
            }}
            onPressNext={() => {}}
            rightTitle={''}
            title="People"></Header>
          <View
            style={{
              marginHorizontal: wp(30),
              marginTop: hp(30),
              flexDirection: 'row',
              backgroundColor: '#EEEEFE',
              borderRadius: 5,
              elevation: 2,
              paddingHorizontal: wp(10),
              alignItems: 'center',
              height: hp(60),
              //   paddingVertical: hp(20),
            }}>
            <IcSearch />
            <TextInput
              style={styles.input}
              onChangeText={text => onSearch(text)}
              value={search}
              placeholder="Search by keyword or name..."
              placeholderTextColor={COLORS.BLACK}
            />
          </View>
          {selectedUsers.length > 0 && (
            <Label
              style={[
                styles.username,
                {
                  fontFamily: 'Poppins-Medium',
                  fontWeight: '500',
                  fontSize: hp(13),
                  marginLeft: wp(30),
                  marginTop: hp(30),
                },
              ]}>
              {'Adding:'}
            </Label>
          )}
          {selectedUsers.length > 0 && (
            <FlatList
              style={{
                // height: COMPONENT_SIZE.SCREEN_HEIGHT * 0.2,
                marginBottom: hp(10),
                marginTop: hp(10),

                //   flex: 0.9,
              }}
              data={selectedUsers}
              renderItem={renderSelectedItem}
              keyExtractor={item => item.id}
            />
          )}
          {selectedUsers.length > 0 && (
            <View
              style={{
                backgroundColor: COLORS.DARK_GREY,
                height: 0.5,
                width: '85%',
                marginTop: hp(20),
                marginHorizontal: wp(30),
              }}
            />
          )}
          {selectedUsers.length > 0 && (
            <Label
              style={[
                styles.username,
                {
                  fontFamily: 'Poppins-Medium',
                  fontWeight: '500',
                  fontSize: hp(13),
                  marginLeft: wp(30),
                  marginTop: hp(30),
                },
              ]}>
              {'Add More:'}
            </Label>
          )}
          {connectUsers.length > 0 && (
            <FlatList
              style={{
                height: COMPONENT_SIZE.SCREEN_HEIGHT * 0.5,
                marginBottom: hp(10),
                marginTop: hp(15),
                //   flex: 0.9,
              }}
              data={connectUsers}
              renderItem={renderItem}
              keyExtractor={item => item.id}
            />
          )}
          {connectUsers.length === 0 && selectedUsers.length === 0 && (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                height: 200,
                // width: '70%',
                paddingHorizontal: wp(70),
                marginTop: hp(100),
              }}>
              <Label
                style={[
                  styles.username,
                  {
                    textAlign: 'center',
                    fontFamily: 'Poppins-Medium',
                    fontWeight: '500',
                  },
                ]}>
                {'No connections around. '}
              </Label>
              <Label
                style={[
                  styles.username,
                  {
                    textAlign: 'center',
                    fontFamily: 'Poppins-Medium',
                    fontWeight: '500',
                  },
                ]}>
                {
                  ' Refresh at a new location or message a friend to get together!'
                }
              </Label>
              <ICLogo height={50} width={50} style={{marginTop: hp(20)}} />
            </View>
          )}
        </View>
        <View
          style={{
            paddingHorizontal: wp(30),
            paddingBottom: hp(10),
            position: 'absolute',
            bottom: 10,
            width: '100%',
          }}>
          <Button
            label={selectedUsers.length > 0 ? 'Done' : 'Next'}
            style={{borderRadius: 5, width: '100%'}}
            onPress={() => {
              setExperiences({...experiences, friends: selectedUsers});
              navigation.goBack();
            }}
          />
        </View>
      </MainCard>
    </>
  );
};

export default AddUsers;
const style = (darkMode: boolean) =>
  StyleSheet.create({
    topBar: {
      alignItems: 'center',
      flexDirection: 'row',
      width: '100%',
      paddingLeft: hp(20),
      marginTop: hp(20),
    },
    username: {
      fontSize: hp(16),
      color: COLORS.BLACK,
      fontFamily: 'Poppins-Regular',
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
      marginLeft: wp(15),
      color: COLORS.BLACK,
    },
  });
function item(item: any, arg1: (index: number) => void, arg2: never[][]) {
  throw new Error('Function not implemented.');
}
